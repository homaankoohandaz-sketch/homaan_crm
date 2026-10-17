import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const migration = fs.readFileSync(
  new URL("../../supabase/migrations/20261017100000_restrict_is_active_user_execute.sql", import.meta.url),
  "utf8"
);

test("is_active_user execution is limited to authenticated API sessions", () => {
  assert.match(migration, /REVOKE EXECUTE ON FUNCTION public\.is_active_user\(\) FROM PUBLIC, anon;/i);
  assert.match(migration, /GRANT EXECUTE ON FUNCTION public\.is_active_user\(\) TO authenticated;/i);
  assert.doesNotMatch(migration, /FROM PUBLIC, anon, authenticated/i);
});
