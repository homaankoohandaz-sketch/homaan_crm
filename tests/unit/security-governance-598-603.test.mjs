import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
const migration=fs.readFileSync("supabase/migrations/20261002141000_security_governance_598_603.sql","utf8");
test("598-603 governance foundations exist",()=>{
 for(const x of ["security_field_policies","agent_tool_permissions","production_action_approvals","properties_client"]) assert.match(migration,new RegExp(x));
 assert.match(migration,/security_invoker=true/);
 assert.match(migration,/status='pending'/);
});
