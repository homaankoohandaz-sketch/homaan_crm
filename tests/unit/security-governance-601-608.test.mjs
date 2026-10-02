import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const governance = fs.readFileSync("supabase/migrations/20261002141000_security_governance_598_603.sql","utf8");
const ai = fs.readFileSync("supabase/migrations/20261002143000_security_governance_601.sql","utf8");

test("601-603 AI/tool/production approval boundaries exist", () => {
  for (const table of ["agent_tool_permissions","production_action_approvals"]) assert.match(governance, new RegExp(table));
  assert.match(governance,/requires_approval boolean not null default true/);
  assert.match(governance,/requested_by = auth\.uid\(\) and status='pending'/);
  assert.match(governance,/public\.is_manager_user\(\)/);
  assert.match(ai,/actor_user_id=auth\.uid\(\)/);
  assert.match(ai,/requested_by=auth\.uid\(\)/);
  assert.match(ai,/status='pending'/);
});

test("601 AI audit and alert mutations are scoped", () => {
  assert.match(ai,/ai_audit_events_update_manager/);
  assert.match(ai,/ai_audit_events_delete_manager/);
  assert.match(ai,/project_ai_alerts_update/);
  assert.match(ai,/assigned_to=auth\.uid\(\)/);
});

test("604-608 remain explicitly gated when external/runtime evidence is missing", () => {
  const state = fs.readFileSync(".agent-control/SECURITY-601-608.md","utf8");
  assert.match(state,/604 .*BLOCKED/);
  assert.match(state,/605 .*BLOCKED/);
  assert.match(state,/606 .*PARTIAL/);
  assert.match(state,/607 .*PARTIAL/);
  assert.match(state,/608 .*PASS/);
});
