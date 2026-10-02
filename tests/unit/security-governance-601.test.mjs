import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
const migration=fs.readFileSync("supabase/migrations/20261002143000_security_governance_601.sql","utf8");
test("601 AI data permissions are actor/manager scoped",()=>{
 assert.match(migration,/ai_audit_events_select/);
 assert.match(migration,/actor_user_id=auth\.uid\(\)/);
 assert.match(migration,/project_ai_change_approvals_insert/);
 assert.match(migration,/status='pending'/);
 assert.match(migration,/project_ai_alerts_update/);
});
