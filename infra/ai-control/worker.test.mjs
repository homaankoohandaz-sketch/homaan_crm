import test from "node:test";
import assert from "node:assert/strict";
import worker from "./worker.js";

const env = {
  BUILDWISE_INTERNAL_TOKEN: "test-token",
  CLOUDFLARE_ACCOUNT_ID: "test-account",
  CLOUDFLARE_API_TOKEN: "test-api-token",
  CF_AIG_GATEWAY_ID: "test-gateway"
};

test("احراز هویت بدون توکن داخلی رد می‌شود", async () => {
  const req = new Request("https://example.test", {
    method: "POST",
    body: JSON.stringify({ route: "cheap" })
  });
  const res = await worker.fetch(req, env);
  assert.equal(res.status, 401);
});

test("هدرهای مصرف توکن و Cache Hit ثبت می‌شوند", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({
    usage: {
      input_tokens: 1000,
      output_tokens: 250,
      cache_read_input_tokens: 700,
      cache_creation_input_tokens: 300
    },
    content: [{ type: "text", text: "ok" }]
  }), { status: 200, headers: { "content-type": "application/json" } });

  try {
    const req = new Request("https://example.test", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-buildwise-token": "test-token"
      },
      body: JSON.stringify({
        route: "cheap",
        system: "stable instructions",
        messages: [{ role: "user", content: "test" }],
        max_tokens: 512
      })
    });

    const res = await worker.fetch(req, env);
    assert.equal(res.status, 200);
    assert.equal(res.headers.get("x-buildwise-input-tokens"), "1000");
    assert.equal(res.headers.get("x-buildwise-output-tokens"), "250");
    assert.equal(res.headers.get("x-buildwise-cache-read-tokens"), "700");
    assert.equal(res.headers.get("x-buildwise-cache-write-tokens"), "300");
    assert.equal(res.headers.get("x-buildwise-cache-hit"), "true");
    assert.ok(res.headers.get("x-buildwise-request-id"));
  } finally {
    globalThis.fetch = originalFetch;
  }
});
