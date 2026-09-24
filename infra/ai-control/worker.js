/**
 * BuildWise AI Control Gateway
 *
 * Thin Cloudflare Worker:
 * - authenticates the internal caller
 * - routes tasks to the cheapest suitable model
 * - sends requests through Cloudflare AI Gateway
 * - adds Anthropic prompt-cache breakpoints to stable system/tool prefixes
 * - caps agent loops and output
 *
 * Secrets are configured in the Cloudflare dashboard/wrangler, never in Git.
 */

const POLICY = {
  cheap: { model: "anthropic/claude-haiku-4.5", kind: "anthropic" },
  standard: { model: "anthropic/claude-sonnet-4.6", kind: "anthropic" },
  deep: { model: "anthropic/claude-opus-4.8", kind: "anthropic" },
  fallback: { model: "openai/gpt-5.6", kind: "openai" }
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" }
  });
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, Number(n) || min));
}

function addAnthropicCacheBreakpoint(body) {
  const out = structuredClone(body);

  if (typeof out.system === "string") {
    out.system = [{
      type: "text",
      text: out.system,
      cache_control: { type: "ephemeral", ttl: "5m" }
    }];
  } else if (Array.isArray(out.system) && out.system.length) {
    const lastText = [...out.system].reverse().find(x => x && x.type === "text");
    if (lastText) lastText.cache_control = { type: "ephemeral", ttl: "5m" };
  }

  if (Array.isArray(out.tools) && out.tools.length) {
    const lastTool = out.tools[out.tools.length - 1];
    if (lastTool && typeof lastTool === "object") {
      lastTool.cache_control = { type: "ephemeral", ttl: "5m" };
    }
  }

  return out;
}

function selectRoute(body) {
  const route = body.route || "cheap";
  return POLICY[route] || POLICY.cheap;
}

export default {
  async fetch(request, env) {
    if (request.method !== "POST") return json({ error: "POST only" }, 405);

    const internalToken = request.headers.get("x-buildwise-token");
    if (!env.BUILDWISE_INTERNAL_TOKEN || internalToken !== env.BUILDWISE_INTERNAL_TOKEN) {
      return json({ error: "unauthorized" }, 401);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "invalid_json" }, 400);
    }

    const route = selectRoute(body);
    const maxTokens = clamp(body.max_tokens ?? 2048, 128, 4096);
    const payload = { ...body };
    delete payload.route;
    delete payload.max_agent_turns;
    payload.max_tokens = maxTokens;

    const account = env.CLOUDFLARE_ACCOUNT_ID;
    const gateway = env.CF_AIG_GATEWAY_ID || "default";
    const apiToken = env.CLOUDFLARE_API_TOKEN;

    if (!account || !apiToken) {
      return json({ error: "gateway_not_configured" }, 503);
    }

    const endpoint =
      route.kind === "anthropic"
        ? `https://api.cloudflare.com/client/v4/accounts/${account}/ai/v1/messages`
        : `https://api.cloudflare.com/client/v4/accounts/${account}/ai/v1/chat/completions`;

    if (route.kind === "anthropic") {
      payload.model = route.model;
      payload.max_tokens = maxTokens;
      Object.assign(payload, addAnthropicCacheBreakpoint(payload));
    } else {
      payload.model = route.model;
    }

    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: {
        "authorization": `Bearer ${apiToken}`,
        "content-type": "application/json",
        "cf-aig-gateway-id": gateway
      },
      body: JSON.stringify(payload)
    });

    const text = await upstream.text();

    return new Response(text, {
      status: upstream.status,
      headers: {
        "content-type": upstream.headers.get("content-type") || "application/json",
        "x-buildwise-route": route.model
      }
    });
  }
};
