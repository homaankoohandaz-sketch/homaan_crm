import assert from "node:assert/strict";
import {
  routeModel,
  getPermissionMatrix,
  canPerform,
  decide,
  recordFeedback,
  masterDecisionLoop,
  DECISION_STAGES,
} from "../src/core/decision-layer.js";

assert.equal(routeModel({ task: "code" }).model, "codex");
assert.equal(routeModel({ task: "review" }).model, "claude");
assert.equal(routeModel({ task: "unknown" }).model, "chatgpt");

const matrix = getPermissionMatrix();
assert.ok(matrix.owner.includes("project.write"));
assert.ok(!matrix.advisor.includes("project.write"));

assert.equal(canPerform("owner", "project.write"), true);
assert.equal(canPerform("advisor", "project.write"), false);
assert.equal(canPerform("owner", "project.write", { production: true }), false);
assert.equal(canPerform("owner", "project.write", { production: true, approved: true }), true);

assert.equal(decide({ action: "payment", facts: [{ source: "ledger", value: 100 }] }).status, "needs_approval");
assert.equal(decide({ action: "note", facts: [] }).status, "ready");

const state = recordFeedback({}, { kind: "decision", result: "accepted", timestamp: "2026-09-30T00:00:00Z" });
assert.equal(state.events.length, 1);
assert.equal(state.events[0].result, "accepted");

const first = masterDecisionLoop({ id: "T20" });
assert.equal(first.next, "INPUT");
const afterApproval = masterDecisionLoop({}, DECISION_STAGES.slice(0, 9));
assert.equal(afterApproval.next, "EXECUTE");
const complete = masterDecisionLoop({}, DECISION_STAGES);
assert.equal(complete.next, null);
assert.equal(complete.status, "complete");

console.log("decision-layer: passed");
