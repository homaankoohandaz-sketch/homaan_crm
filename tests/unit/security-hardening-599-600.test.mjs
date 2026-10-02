import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const migration = fs.readFileSync(
  "supabase/migrations/20261002134500_security_hardening_599_600.sql",
  "utf8"
);

test("599-600 defines explicit field visibility and phone masking", () => {
  assert.match(migration, /security_field_policies/);
  assert.match(migration, /entity_type\s*=\s*'person'/);
  assert.match(migration, /field_name\s*=\s*'phone'/);
  assert.match(migration, /manager_only/);
  assert.match(migration, /crm_mask_phone/);
  assert.match(migration, /crm_manager_phone/);
  assert.match(migration, /properties_client/);
  assert.match(migration, /mobile/);
  assert.match(migration, /emergency_phone/);
});

test("599-600 removes direct client execution of trigger-only SECURITY DEFINER functions", () => {
  assert.match(
    migration,
    /revoke execute on function public\.log_lead_request_time\(\) from anon, authenticated/
  );
  assert.match(
    migration,
    /revoke execute on function public\.check_report_threshold\(\) from anon, authenticated/
  );
});

test("599-600 hardens authenticated SECURITY DEFINER reads with an active-user gate", () => {
  assert.match(migration, /crm_deal_radar[\s\S]*is_active_user/);
  assert.match(migration, /buildwise_project_dashboard[\s\S]*is_active_user/);
  assert.match(migration, /buildwise_ai_control_scan[\s\S]*is_active_user/);
});
