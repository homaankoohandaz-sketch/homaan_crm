import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const migration = fs.readFileSync(
  new URL("../../supabase/migrations/20261012190000_security_definer_rpc_hardening.sql", import.meta.url),
  "utf8"
);
const crmMigration = fs.readFileSync(
  new URL("../../supabase/migrations/20261012193000_secure_crm_security_definer_rpcs.sql", import.meta.url),
  "utf8"
);

test("quota RPC rejects negative or null amounts", () => {
  assert.match(migration, /if p_amount is null or p_amount < 0 then\s+raise exception 'INVALID_AMOUNT'/);
  assert.match(migration, /if p_amount is null or p_amount <= 0 then\s+raise exception 'INVALID_AMOUNT'/);
});

test("quota RPCs reject inactive users", () => {
  assert.equal((migration.match(/raise exception 'INACTIVE_USER'/g) || []).length, 3);
});

test("quota usage defaults to zero when no monthly usage row exists", () => {
  assert.match(migration, /select coalesce\(\(\s*select pum\.used_count[\s\S]*?\), 0\) into v_used/);
});

test("quota functions use an empty search_path and explicit authenticated grants", () => {
  assert.equal((migration.match(/set search_path = ''/g) || []).length, 3);
  assert.equal((migration.match(/grant execute on function public\.buildwise_/g) || []).length, 3);
  assert.match(migration, /revoke all on function public\.buildwise_consume\(text,bigint\) from public, anon/);
});

test("phone lookup is limited to trusted active CRM roles", () => {
  assert.match(crmMigration, /ar\.role in \('owner','admin','manager','staff'\)/);
  assert.match(crmMigration, /raise exception 'FORBIDDEN_ROLE'/);
  assert.match(crmMigration, /extensions\.digest/);
});

test("schedule conflict results are scoped to manager or caller-owned appointments", () => {
  assert.match(crmMigration, /v_is_manager and \(p_assigned_to is null or a\.created_by = p_assigned_to\)/);
  assert.match(crmMigration, /not v_is_manager and a\.created_by = auth\.uid\(\)/);
  assert.match(crmMigration, /v_is_manager or a\.created_by = auth\.uid\(\)/);
  assert.match(crmMigration, /raise exception 'INVALID_TIME_RANGE'/);
});
