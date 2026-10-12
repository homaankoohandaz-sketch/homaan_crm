import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const migration = fs.readFileSync(
  new URL("../../supabase/migrations/20261012161339_optimize_rls_auth_function_initplans.sql", import.meta.url),
  "utf8"
);

test("RLS auth-function optimization preserves policy metadata and wraps stable auth calls", () => {
  assert.match(migration, /FROM pg_policies/);
  assert.match(migration, /p\.policyname/);
  assert.match(migration, /p\.permissive/);
  assert.match(migration, /p\.cmd/);
  assert.match(migration, /p\.roles/);
  assert.match(migration, /regexp_replace\([\s\S]*?\(select \\1\)/);
  assert.match(migration, /DROP POLICY %I ON %I\.%I/);
  assert.match(migration, /CREATE POLICY %I ON %I\.%I AS %s FOR %s TO %s/);
});
