import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const source = fs.readFileSync(new URL("../../supabase/functions/public-request/index.ts", import.meta.url), "utf8");

test("public-request handles browser CORS preflight before method rejection", () => {
  assert.match(source, /Access-Control-Allow-Origin": "\*"/);
  assert.match(source, /Access-Control-Allow-Headers": "content-type"/);
  assert.match(source, /Access-Control-Allow-Methods": "POST,OPTIONS"/);
  assert.match(source, /if \(r\.method === "OPTIONS"\) return new Response\(null, \{ status: 204, headers: CORS \}\)/);
});

test("public-request fails closed when the phone-based rate-limit lookup fails", () => {
  assert.match(source, /if \(recent\.error\) return j\(\{ error: "request_temporarily_unavailable" \}, 503\)/);
  assert.match(source, /if \(\(recent\.count \?\? 0\) >= 5\) return j\(\{ error: "rate_limited" \}, 429\)/);
});

test("public-request does not expose raw database errors to callers", () => {
  assert.match(source, /if \(ins\.error\) return j\(\{ error: "request_not_saved" \}, 500\)/);
  assert.doesNotMatch(source, /return j\(\{ error: ins\.error\.message/);
});
