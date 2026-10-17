import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const migration = fs.readFileSync(
  new URL("../../supabase/migrations/20261017121000_scope_activity_logs_policies_authenticated.sql", import.meta.url),
  "utf8"
);

test("activity log policies preserve predicates while restricting role to authenticated", () => {
  assert.match(migration, /alter policy activity_logs_owner_select[\s\S]*?to authenticated;/i);
  assert.match(migration, /alter policy activity_logs_self_select[\s\S]*?to authenticated;/i);
  assert.doesNotMatch(migration, /drop policy/i);
  assert.doesNotMatch(migration, /using\s*\(\s*true\s*\)/i);
});
