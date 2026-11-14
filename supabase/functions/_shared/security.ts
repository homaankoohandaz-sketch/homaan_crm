/**
 * Shared security and observability helpers for Supabase Edge Functions.
 * Never pass raw provider errors, request bodies, tokens, or PII to logs/client responses.
 */
export function escapeHtml(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char]!);
}

export function safeHttpsUrl(value: unknown): string {
  try {
    const parsed = new URL(String(value ?? ""));
    if (parsed.protocol !== "https:" || parsed.username || parsed.password) return "";
    return parsed.toString();
  } catch {
    return "";
  }
}

export function safeJsonForHtml(value: unknown): string {
  return (JSON.stringify(value) ?? "null")
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit = {},
  timeoutMs = 20_000,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } catch (error) {
    if (controller.signal.aborted) throw new Error("upstream_timeout");
    throw new Error("upstream_unavailable");
  } finally {
    clearTimeout(timer);
  }
}

export async function safeResponseJson(response: Response): Promise<any> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

const SAFE_ERROR_CODES = new Set([
  "unauthorized", "forbidden", "quota_exceeded", "quota_service_unavailable",
  "identity_check_failed", "workspace_not_found", "deal_id_required",
  "deal_not_found", "share_not_found_or_expired", "message_required",
  "invalid_input", "invalid_json", "unknown_action", "method_not_allowed",
  "upstream_timeout", "upstream_unavailable", "ai_provider_error",
]);

export function safeErrorCode(error: unknown): string {
  const message = error instanceof Error ? error.message : "";
  return SAFE_ERROR_CODES.has(message) ? message : "internal_error";
}

/** Redact sensitive values and bound audit payload size/depth. */
export function redactForAudit(value: unknown, depth = 0): unknown {
  if (depth > 3) return "[TRUNCATED]";
  if (value === null || value === undefined || typeof value === "number" || typeof value === "boolean") return value;
  if (typeof value === "string") return value.slice(0, 120);
  if (Array.isArray(value)) return value.slice(0, 20).map((item) => redactForAudit(item, depth + 1));
  if (typeof value === "object") {
    const output: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value as Record<string, unknown>).slice(0, 30)) {
      if (/(token|secret|password|authorization|phone|email|full.?name|address|message|prompt|content|api.?key)/i.test(key)) {
        output[key] = "[REDACTED]";
      } else {
        output[key] = redactForAudit(item, depth + 1);
      }
    }
    return output;
  }
  return "[UNSUPPORTED]";
}
