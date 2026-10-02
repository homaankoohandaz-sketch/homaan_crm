import test from "node:test";
import assert from "node:assert/strict";
import {
  AI_CONTROL,
  REOS_APPROVAL_GATES,
  REOS_DOMAINS,
  REOS_LIFECYCLE,
  validateCustomerOutput,
  validateProjectConfiguration,
  validateReosAction,
} from "../../src/core/reos-contract.js";

test("REOS contract covers the master connected intelligence graph", () => {
  for (const entity of ["property","person","owner","land","builder","investor","supplier","contractor","project","unit","deal","contract","money","task","document","schedule","procurement","sale"]) {
    assert.ok(REOS_DOMAINS.intelligenceGraph.includes(entity), entity);
  }
});

test("REOS contract covers project-control dimensions and configurable project domains", () => {
  assert.ok(REOS_DOMAINS.projectControl.includes("criticalPath"));
  for (const key of REOS_DOMAINS.configurableProject) {
    assert.equal(validateProjectConfiguration({ [key]: {} }).missing.includes(key), false);
  }
});

test("material AI actions require approval and evidence", () => {
  const denied = validateReosAction({
    actorId: "u1", actionType: "production", evidence: ["e1"],
    decision: "execute", approvalState: "pending", material: true,
  });
  assert.equal(denied.ok, false);
  assert.equal(denied.code, "APPROVAL_REQUIRED");

  const allowed = validateReosAction({
    actorId: "u1", actionType: "production", evidence: ["e1"],
    decision: "execute", approvalState: "approved", material: true,
  });
  assert.equal(allowed.ok, true);
});

test("non-material actions still require evidence", () => {
  const result = validateReosAction({
    actorId: "u1", actionType: "analysis",
    evidence: [], decision: "inform", approvalState: "not_required",
  });
  assert.equal(result.code, "EVIDENCE_REQUIRED");
});

test("customer output contract requires understandable, actionable context", () => {
  const result = validateCustomerOutput({
    title: "Project proposal",
    summary: "Summary",
    sourceContext: ["project:1"],
    nextAction: "Review",
  });
  assert.equal(result.ok, true);
});

test("lifecycle and approval gates are explicit", () => {
  assert.deepEqual(REOS_LIFECYCLE, ["event","interpret","evaluate","decide","approve","execute","deadline","alert","followUp","audit"]);
  assert.ok(REOS_APPROVAL_GATES.includes("production"));
  assert.equal(AI_CONTROL.managerFinalAuthority, true);
  assert.equal(AI_CONTROL.silentMasterScheduleMutation, false);
});
