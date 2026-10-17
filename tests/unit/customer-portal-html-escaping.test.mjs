import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { escapeHtml, safeHttpsUrl } from "../../supabase/functions/customer-portal/html.mjs";

const source = fs.readFileSync(new URL("../../supabase/functions/customer-portal/index.ts", import.meta.url), "utf8");

test("escapeHtml encodes HTML metacharacters from untrusted content", () => {
  assert.equal(
    escapeHtml(`<tag title="quoted">'&`),
    "&lt;tag title=&quot;quoted&quot;&gt;&#39;&amp;"
  );
});

test("safeHttpsUrl accepts HTTPS URLs and rejects non-HTTPS and credential URLs", () => {
  assert.equal(safeHttpsUrl("https://storage.example.test/photo.png"), "https://storage.example.test/photo.png");
  assert.equal(safeHttpsUrl("javascript:void(0)"), "");
  assert.equal(safeHttpsUrl("data:text/plain,hello"), "");
  assert.equal(safeHttpsUrl("https://user:pass@example.test/file"), "");
  assert.equal(safeHttpsUrl("not a URL"), "");
});

test("customer portal escapes dynamic text and validates asset URLs before HTML interpolation", () => {
  assert.match(source, /escapeHtml\(share\.title\)/);
  assert.match(source, /escapeHtml\(share\.message\)/);
  assert.match(source, /escapeHtml\(p\.property_name/);
  assert.match(source, /\.map\(escapeHtml\)/);
  assert.match(source, /safeHttpsUrl\(x\.file_url\)/);
  assert.match(source, /rel="noopener noreferrer"/);
  assert.doesNotMatch(source, /const C=\$\{safe\}/);
});
