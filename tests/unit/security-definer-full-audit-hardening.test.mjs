import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const migration = fs.readFileSync(
  new URL("../../supabase/migrations/20261012200000_security_definer_full_audit_hardening.sql", import.meta.url),
  "utf8"
);
const edge = fs.readFileSync(
  new URL("../../supabase/functions/ai-orchestrator/index.ts", import.meta.url),
  "utf8"
);
const resourceLimits = fs.readFileSync(
  new URL("../../supabase/migrations/20261012201500_enforce_plan_resource_limits.sql", import.meta.url),
  "utf8"
);
const unusedRpcRevokes = fs.readFileSync(
  new URL("../../supabase/migrations/20261012203000_revoke_unused_security_definer_rpc_exposure.sql", import.meta.url),
  "utf8"
);

function body(name) {
  const start = migration.indexOf(`FUNCTION public.${name}`);
  assert.notEqual(start, -1, `missing function ${name}`);
  const next = migration.indexOf("CREATE OR REPLACE FUNCTION", start + 1);
  return migration.slice(start, next === -1 ? migration.length : next);
}

test("phone lookup returns only existence and is restricted to trusted roles", () => {
  const b = body("crm_phone_exists");
  assert.match(b, /public\.is_manager_user\(\) or public\.my_role\(\) in \('owner','staff'\)/);
  assert.match(b, /jsonb_build_object\('exists',found_match\)/);
  assert.doesNotMatch(b, /'person_id'/);
  assert.match(b, /extensions\.digest/);
});

test("appointment conflict RPC does not let non-managers inspect other assignees or leads", () => {
  const b = body("crm_schedule_conflict");
  assert.match(b, /v_assignee <> v_uid and not public\.is_manager_user\(\)/);
  assert.match(b, /forbidden_lead/);
  assert.match(b, /a\.created_by=v_assignee/);
  assert.match(b, /p_end <= p_start/);
});

test("generic manager editor uses a strict table allowlist and blocks protected columns", () => {
  const b = body("manager_edit_record");
  assert.match(b, /allowed_tables text\[\]/);
  assert.match(b, /table_not_allowlisted/);
  assert.match(b, /protected_column:%/);
  assert.match(b, /for update/);
  assert.match(b, /manager_edit_events/);
});

test("bulk delete and import rollback are manager-gated and bounded/idempotent", () => {
  const bulk = body("manager_bulk_delete_properties");
  assert.match(bulk, /public\.is_manager_user\(\)/);
  assert.match(bulk, /cardinality\(p_ids\)>500/);
  const rollback = body("rollback_import_batch");
  assert.match(rollback, /for update/);
  assert.match(rollback, /already_rolled_back/);
  assert.match(rollback, /public\.is_manager_user\(\)/);
});

test("quota consume enforces the cap atomically rather than check-then-increment", () => {
  const b = body("buildwise_consume");
  assert.match(b, /where p_amount<=v_limit/);
  assert.match(b, /used_count\+excluded\.used_count<=v_limit/);
  assert.match(b, /return jsonb_build_object\('allowed',false,'reason','LIMIT_REACHED'/);
  assert.match(b, /public\.buildwise_check_limit/);
});

test("non-count quota features read monthly usage and all configured features are checked", () => {
  const b = body("buildwise_check_limit");
  assert.match(b, /FEATURE_NOT_CONFIGURED/);
  assert.match(b, /else\s+select coalesce\(\(select u\.used_count/);
  assert.match(b, /plan_usage_monthly/);
});

test("phone registration is scoped to the creator unless caller is trusted CRM staff", () => {
  const b = body("crm_register_phone");
  assert.match(b, /v_person_owner is distinct from v_uid/);
  assert.match(b, /forbidden_person/);
  assert.match(b, /extensions\.digest/);
  assert.match(b, /insert into public\.crm_person_private\(person_id,phone,updated_at\)/);
  assert.doesNotMatch(b, /insert into public\.crm_person_private\(person_id,phone,phone_hash/);
});

test("AI identity checks use the caller JWT RPC and return no cross-record identifiers", () => {
  const start = edge.indexOf("async function checkIdentity(");
  const end = edge.indexOf("const canCheckIdentity", start);
  const b = edge.slice(start, end);
  assert.match(b, /userDb\.rpc\("crm_phone_exists"/);
  assert.doesNotMatch(b, /service-role lookup|from\("crm_person_private"\)|from\("leads"\)|from\("owners"\)|from\("properties"\)/);
  assert.match(edge, /canCheckIdentity\(a\.profile\)/);
  assert.doesNotMatch(edge, /duplicate\.matches|r\.matches\.length/);
  assert.match(edge, /userDb\.rpc\("buildwise_consume"/);
  assert.match(edge, /quota_exceeded/);
});


test("resource caps are enforced in the database and cannot be bypassed by spoofing created_by", () => {
  assert.match(resourceLimits, /before insert on public\.properties/);
  assert.match(resourceLimits, /before insert on public\.leads/);
  assert.match(resourceLimits, /before insert on public\.construction_projects/);
  assert.match(resourceLimits, /v_actor uuid := auth\.uid\(\)/);
  assert.match(resourceLimits, /new\.created_by := v_actor/);
  assert.match(resourceLimits, /CREATED_BY_MISMATCH/);
  assert.match(resourceLimits, /v_uid := new\.created_by/);
  assert.match(resourceLimits, /pg_advisory_xact_lock/);
  assert.match(resourceLimits, /PLAN_LIMIT_REACHED/);
  assert.match(resourceLimits, /revoke all on function public\.enforce_plan_resource_limit\(\) from public, anon, authenticated/);
});


test("unused SECURITY DEFINER RPCs are not directly callable by authenticated clients", () => {
  for (const signature of [
    "buildwise_ai_control_scan(bigint)",
    "buildwise_check_limit(text,bigint)",
    "buildwise_plan_status()",
    "buildwise_project_dashboard(bigint)",
    "crm_deal_radar()",
    "crm_market_value(bigint)",
    "crm_match_score(bigint,bigint)",
    "crm_record_learning(text,text,bigint,jsonb,jsonb,numeric)",
    "crm_run_matching(bigint,integer)",
    "crm_schedule_conflict(timestamptz,timestamptz,uuid,bigint)",
    "my_role()"
  ]) {
    assert.ok(
      unusedRpcRevokes.toLowerCase().includes(
        ("revoke all on function public." + signature + " from public, anon, authenticated").toLowerCase()
      ),
      "missing revoke for " + signature
    );
  }
});
