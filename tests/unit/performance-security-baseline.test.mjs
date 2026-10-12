import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const migration = fs.readFileSync(
  new URL("../../supabase/migrations/20261012161148_performance_security_baseline.sql", import.meta.url),
  "utf8"
);
const managerEdit = fs.readFileSync(
  new URL("../../supabase/migrations/20261012161544_manager_edit_record_column_allowlist.sql", import.meta.url),
  "utf8"
);
const app = fs.readFileSync(new URL("../../buildwise-app.js", import.meta.url), "utf8");

test("KPI snapshots no longer expose unrestricted authenticated read/write access", () => {
  assert.match(migration, /DROP POLICY IF EXISTS project_kpi_snapshots_auth/);
  assert.match(migration, /project_kpi_snapshots_active_select[\s\S]*?FOR SELECT TO authenticated[\s\S]*?is_active_user\(\)/);
  assert.match(migration, /project_kpi_snapshots_write_insert[\s\S]*?FOR INSERT TO authenticated[\s\S]*?can_write\(\)/);
  assert.match(migration, /project_kpi_snapshots_write_update[\s\S]*?FOR UPDATE TO authenticated[\s\S]*?USING \(public\.can_write\(\)\)[\s\S]*?WITH CHECK \(public\.can_write\(\)\)/);
  assert.match(migration, /project_kpi_snapshots_write_delete[\s\S]*?FOR DELETE TO authenticated[\s\S]*?can_write\(\)/);
});

test("performance baseline removes duplicate KPI index and indexes hot-path foreign keys", () => {
  assert.match(migration, /DROP INDEX IF EXISTS public\.project_kpi_snapshots_project_date_uq/);
  for (const name of [
    "idx_activity_logs_actor_id",
    "idx_ai_actions_actor_user_id",
    "idx_app_roles_owner_id",
    "idx_appointments_lead_id",
    "idx_appointments_property_id",
    "idx_construction_projects_property_id",
    "idx_crm_alerts_assigned_to",
    "idx_crm_alerts_person_id",
    "idx_crm_identity_events_person_id",
    "idx_crm_people_created_by",
    "idx_crm_requests_assigned_to",
    "idx_crm_requests_person_id"
  ]) assert.ok(migration.includes(name), "missing index " + name);
});

test("manager editor only mutates explicitly approved public-request fields", () => {
  assert.match(managerEdit, /allowed_tables text\[\] := ARRAY\['public_requests'\]/);
  assert.match(managerEdit, /allowed_columns text\[\]/);
  assert.match(managerEdit, /column_not_allowlisted:%/);
  assert.match(managerEdit, /column_not_nullable:%/);
  assert.match(managerEdit, /manager_edit_events/);
  assert.match(app, /requirements:\{text:er_notes\.value\.trim\(\)\}/);
  assert.match(app, /data-id="\'+esc\(x\.id\)\+'" onclick="editPublicRequest\(this\.dataset\.id\)"/);
  assert.match(app, /data-id="\'+esc\(id\)\+'" onclick="savePublicRequest\(this\.dataset\.id\)"/);
  assert.doesNotMatch(app, /budget_max:n\(er_max\.value\),status:er_status\.value\.trim\(\),notes:er_notes\.value\.trim\(\)/);
});
