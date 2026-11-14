import {
  escapeHtml,
  safeHttpsUrl,
  safeJsonForHtml,
  safeErrorCode,
  redactForAudit,
  safeResponseJson,
} from "./security.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

Deno.test("escapeHtml escapes markup and attributes", () => {
  assert(escapeHtml('<script "x" & \'y\'>') === "&lt;script &quot;x&quot; &amp; &#39;y&#39;&gt;", "HTML must be escaped");
});

Deno.test("safeHttpsUrl rejects javascript and credential-bearing URLs", () => {
  assert(safeHttpsUrl("javascript:alert(1)") === "", "javascript URL must be rejected");
  assert(safeHttpsUrl("https://user:pass@example.com/a") === "", "credential URL must be rejected");
  assert(safeHttpsUrl("https://example.com/a").startsWith("https://example.com/"), "HTTPS URL should pass");
});

Deno.test("safeJsonForHtml prevents closing-script injection", () => {
  const encoded = safeJsonForHtml({ text: "</script><script>alert(1)</script>" });
  assert(!encoded.includes("</script>"), "serialized JSON must not contain a closing script tag");
  assert(encoded.includes("\\u003c"), "less-than must be unicode escaped");
});

Deno.test("safeErrorCode never exposes unknown provider error messages", () => {
  assert(safeErrorCode(new Error("quota_exceeded")) === "quota_exceeded", "known code should remain useful");
  assert(safeErrorCode(new Error("provider secret=abc")) === "internal_error", "unknown message must be hidden");
});

Deno.test("redactForAudit removes personal and secret fields", () => {
  const result = redactForAudit({ phone: "+123456789", api_key: "secret", count: 2 }) as Record<string, unknown>;
  assert(result.phone === "[REDACTED]", "phone must be redacted");
  assert(result.api_key === "[REDACTED]", "API key must be redacted");
  assert(result.count === 2, "safe numeric metadata should remain");
});

Deno.test("safeResponseJson returns null for malformed response", async () => {
  const response = new Response("not-json", { headers: { "Content-Type": "application/json" } });
  assert(await safeResponseJson(response) === null, "malformed JSON should not throw");
});
