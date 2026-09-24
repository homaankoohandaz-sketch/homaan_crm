/**
 * BuildWise AI Control Gateway
 *
 * Thin Cloudflare Worker:
 * - authenticates the internal caller
 * - routes tasks to the cheapest suitable model
 * - sends requests through Cloudflare AI Gateway
 * - adds Anthropic prompt-cache breakpoints to stable system/tool prefixes
 * - caps agent loops and output
 * - records compact token/cost telemetry without storing prompts or completions
 *
 * Secrets and pricing values are configured in Cloudflare, never in Git.
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

function usageFromResponse(data) {
  const u = data?.usage || {};
  return {
    input_tokens: Number(u.input_tokens ?? u.prompt_tokens ?? 0),
    output_tokens: Number(u.output_tokens ?? u.completion_tokens ?? 0),
    cache_read_input_tokens: Number(
      u.cache_read_input_tokens ?? u.cache_read_tokens ?? 0
    ),
    cache_creation_input_tokens: Number(
      u.cache_creation_input_tokens ?? u.cache_write_input_tokens ?? 0
    )
  };
}

function estimateCostUsd(usage, env) {
  // Optional prices are USD per 1M tokens. Leave unset to report usage only.
  const input = Number(env.PRICE_INPUT_USD_PER_1M || 0);
  const output = Number(env.PRICE_OUTPUT_USD_PER_1M || 0);
  const cacheRead = Number(env.PRICE_CACHE_READ_USD_PER_1M || 0);
  const cacheWrite = Number(env.PRICE_CACHE_WRITE_USD_PER_1M || 0);

  const hasPricing = [input, output, cacheRead, cacheWrite].some(v => v > 0);
  if (!hasPricing) return null;

  return Number((
    usage.input_tokens * input / 1e6 +
    usage.output_tokens * output / 1e6 +
    usage.cache_read_input_tokens * cacheRead / 1e6 +
    usage.cache_creation_input_tokens * cacheWrite / 1e6
  ).toFixed(8));
}

async function recordTelemetry(env, event) {
  // Optional KV binding. If absent, request headers still expose compact telemetry.
  if (!env.AI_USAGE_KV) return;

  const day = new Date().toISOString().slice(0, 10);
  const key = `usage:${day}:${event.model.replaceAll("/", "_")}`;
  const existing = JSON.parse(await env.AI_USAGE_KV.get(key) || "{}");

  existing.requests = (existing.requests || 0) + 1;
  existing.input_tokens = (existing.input_tokens || 0) + event.usage.input_tokens;
  existing.output_tokens = (existing.output_tokens || 0) + event.usage.output_tokens;
  existing.cache_read_input_tokens =
    (existing.cache_read_input_tokens || 0) + event.usage.cache_read_input_tokens;
  existing.cache_creation_input_tokens =
    (existing.cache_creation_input_tokens || 0) + event.usage.cache_creation_input_tokens;
  if (event.cost_usd !== null) {
    existing.estimated_cost_usd =
      Number(((existing.estimated_cost_usd || 0) + event.cost_usd).toFixed(8));
  }

  await env.AI_USAGE_KV.put(key, JSON.stringify(existing), {
    expirationTtl: 60 * 60 * 24 * 35
  });
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

    const requestId = crypto.randomUUID();
    const started = Date.now();

    let upstream;
    try {
      upstream = await fetch(endpoint, {
        method: "POST",
        headers: {
          "authorization": `Bearer ${apiToken}`,
          "content-type": "application/json",
          "cf-aig-gateway-id": gateway
        },
        body: JSON.stringify(payload)
      });
    } catch {
      return json({ error: "upstream_network_error", request_id: requestId }, 502);
    }

    const responseText = await upstream.text();
    let responseData = null;
    try { responseData = JSON.parse(responseText); } catch {}

    const usage = usageFromResponse(responseData);
    const cost_usd = estimateCostUsd(usage, env);

    const telemetry = {
      request_id: requestId,
      timestamp: new Date().toISOString(),
      route: Object.keys(POLICY).find(key => POLICY[key] === route) || "unknown",
      model: route.model,
      status: upstream.status,
      latency_ms: Date.now() - started,
      usage,
      cache_hit: usage.cache_read_input_tokens > 0,
      cost_usd
    };

    // Telemetry failure must never break the model response.
    try { await recordTelemetry(env, telemetry); } catch {}

    return new Response(responseText, {
      status: upstream.status,
      headers: {
        "content-type": upstream.headers.get("content-type") || "application/json",
        "x-buildwise-request-id": requestId,
        "x-buildwise-route": route.model,
        "x-buildwise-input-tokens": String(usage.input_tokens),
        "x-buildwise-output-tokens": String(usage.output_tokens),
        "x-buildwise-cache-read-tokens": String(usage.cache_read_input_tokens),
        "x-buildwise-cache-write-tokens": String(usage.cache_creation_input_tokens),
        "x-buildwise-cache-hit": String(usage.cache_read_input_tokens > 0)
      }
    });
  }
};
