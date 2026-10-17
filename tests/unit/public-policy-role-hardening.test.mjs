import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const migration = fs.readFileSync(new URL("../../supabase/migrations/20261017140000_scope_internal_public_policies_to_authenticated.sql", import.meta.url), "utf8");

test("internal PUBLIC policies are recreated for authenticated while preserving predicates", () => {
  assert.match(migration, /p\.polroles\s*=\s*array\[0::oid\]/i);
  assert.match(migration, /to authenticated/i);
  assert.match(migration, /pg_get_expr\(p\.polqual, p\.polrelid\)/i);
  assert.match(migration, /pg_get_expr\(p\.polwithcheck, p\.polrelid\)/i);
  assert.match(migration, /p\.polpermissive/i);
  assert.match(migration, /drop policy/i);
  assert.match(migration, /create policy/i);
});

test("policy hardening is limited to the reviewed internal table allowlist", () => {
  const allowlist = [
    "activity_logs", "app_roles", "appointments", "deals", "followups",
    "import_batches", "invited_emails", "leads", "owners", "properties",
    "property_documents", "property_images", "property_photos", "user_reports"
  ];
  for (const table of allowlist) assert.ok(migration.includes("'" + table + "'"), table);
  assert.match(migration, /begin;[\s\S]*do \$migration\$[\s\S]*commit;/i);
});
