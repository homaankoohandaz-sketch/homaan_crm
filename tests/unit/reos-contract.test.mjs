import test from "node:test";
import assert from "node:assert/strict";
import {
  AI_CONTROL,
  REOS_APPROVAL_GATES,
  REOS_DOMAINS,
  REOS_LIFECYCLE,
  validateCustomerOutput,
  DECISION_CONSTITUTION,
  classifyDecision,
  validateCriticalChange,
  validateExecutionTrace,
  validateBoundedTask,
  validateLineage,
  validateRecovery,
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


test("decision constitution separates evidence and reasoning classes", () => {
  assert.ok(DECISION_CONSTITUTION.reasoningClasses.includes("source_fact"));
  assert.equal(classifyDecision({source:"doc:1",evidence:"verified",reasoningClass:"calculation"}).ok, true);
  assert.equal(classifyDecision({source:"doc:1",evidence:"unknown",reasoningClass:"calculation"}).ok, true);
  assert.equal(classifyDecision({source:"doc:1",evidence:"verified",reasoningClass:"guess"}).ok, false);
});

test("critical changes require versioning and explicit recalculation mode", () => {
  assert.equal(validateCriticalChange({
    changeId:"c1",beforeVersion:"v1",afterVersion:"v2",
    impact:["pricing"],recalculationMode:"APPROVAL_REQUIRED"
  }).ok, true);
  assert.equal(validateCriticalChange({
    changeId:"c1",beforeVersion:"v1",afterVersion:"v1",
    impact:[],recalculationMode:"AUTO"
  }).ok, false);
});

test("execution traces and bounded task scopes are explicit", () => {
  assert.equal(validateExecutionTrace({
    executionId:"x1",actor:"u1",tool:"crm.search",time:"t",
    action:"read",result:"ok",verification:"query"
  }).ok, true);
  assert.equal(validateBoundedTask({
    taskId:"t1",allowedReads:["crm"],allowedWrites:[],
    allowedExecutions:["search"],prohibitedOperations:["delete"],
    tokenBudget:1000,timeBudgetMs:10000,costBudget:1,maxIterations:3
  }).ok, true);
  assert.equal(validateBoundedTask({
    taskId:"t2",allowedReads:[],allowedWrites:[],
    allowedExecutions:[],prohibitedOperations:[],maxIterations:-1
  }).ok, false);
});

test("important values and recovery actions retain lineage", () => {
  assert.equal(validateLineage({
    inputLineage:["cost:1"],sourceRecords:["project:1"],
    sourceVersion:"v2",sourceTimestamp:"2026-10-02"
  }).ok, true);
  assert.equal(validateRecovery({
    before:{version:"v1"},after:{version:"v2"},auditTrail:["a1"]
  }).ok, true);
});


test("permission matrix denies out-of-scope writes", async () => {
  const { validatePermission } = await import("../../src/core/reos-contract.js");
  assert.equal(validatePermission("advisor",{kind:"write",resource:"accounting"}).ok,false);
  assert.equal(validatePermission("advisor",{kind:"read",resource:"properties.assigned"}).ok,true);
});

test("model router chooses the lowest-cost suitable enabled model", async () => {
  const { routeModel } = await import("../../src/core/reos-contract.js");
  const r = routeModel({requires:"analysis"},[
    {id:"expensive",cost:5,reliability:.99,capabilities:["analysis"]},
    {id:"cheap",cost:1,reliability:.95,capabilities:["analysis"]},
    {id:"off",enabled:false,cost:0,capabilities:["analysis"]},
  ]);
  assert.equal(r.selected.id,"cheap");
});

test("liquidity calculation exposes ratio and missing-obligation state", async () => {
  const { calculateLiquidity } = await import("../../src/core/reos-contract.js");
  assert.equal(calculateLiquidity({liquidAssets:150,shortTermObligations:100}).ratio,1.5);
  assert.equal(calculateLiquidity({liquidAssets:10,shortTermObligations:0}).status,"NO_OBLIGATIONS");
});

test("feedback is append-only and requires source/outcome", async () => {
  const { appendFeedback } = await import("../../src/core/reos-contract.js");
  assert.equal(appendFeedback({feedbackId:"f1",source:"user",outcome:"accepted"},[]).ok,true);
  assert.equal(appendFeedback({feedbackId:"f2"},[]).ok,false);
});

test("master decision loop stops at approval gate for critical actions", async () => {
  const { runMasterDecisionLoop } = await import("../../src/core/reos-contract.js");
  const base={event:"e",evidence:["s1"],decision:"d",responsibleParty:"manager",nextAction:"review",critical:true};
  assert.equal(runMasterDecisionLoop(base).code,"APPROVAL_REQUIRED");
  assert.equal(runMasterDecisionLoop({...base,approvalState:"approved"}).ok,true);
});


test("liquidity rejects negative asset inputs", async () => {
  const { calculateLiquidity } = await import("../../src/core/reos-contract.js");
  assert.equal(calculateLiquidity({liquidAssets:-1,shortTermObligations:100}).ok,false);
  assert.equal(calculateLiquidity({liquidAssets:100,shortTermObligations:-1}).ok,false);
});

test("master decision loop requires non-empty evidence", async () => {
  const { runMasterDecisionLoop } = await import("../../src/core/reos-contract.js");
  const result = runMasterDecisionLoop({
    event:"e", evidence:[], decision:"d", responsibleParty:"manager", nextAction:"review",
  });
  assert.equal(result.ok,false);
  assert.equal(result.code,"EVIDENCE_REQUIRED");
});
