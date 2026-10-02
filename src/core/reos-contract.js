/**
 * BuildWise AI — canonical REOS contract.
 *
 * This is an integration contract, not a second feature engine.
 * Domain modules own behavior; this file defines the shared system-level
 * interfaces required to qualify BuildWise as one REOS.
 */

export const REOS_DOMAINS = Object.freeze({
  intelligenceGraph: ["property","person","owner","land","builder","investor","supplier","contractor","project","unit","deal","contract","money","task","document","schedule","procurement","sale"],
  projectControl: ["wbs","schedule","gantt","criticalPath","kpi","workflow","procurement","accounting","cashFlow","quality","hse","risk","progress"],
  configurableProject: ["workflow","kpi","accounting","procurement","schedule","salesStrategy"],
  acceptedInputs: ["plan","permit","render","photos","documents","excel","financialData"],
  calculations: ["landCost","currentLandValue","constructionCost","currentMaterialCost","grossArea","usefulArea","usefulAreaPct","costPerGrossM2","costPerUsefulM2","costPerUnit","salePrice","profit","roi","risk","liquidity"],
  comparisons: ["property","gold","dollar","constructionInflation","marketPrice"],
});

export const AI_CONTROL = Object.freeze({
  managerFinalAuthority: true,
  auditRequired: true,
  silentMasterScheduleMutation: false,
  materialActionsRequireApproval: true,
});

export const REOS_LIFECYCLE = Object.freeze([
  "event",
  "interpret",
  "evaluate",
  "decide",
  "approve",
  "execute",
  "deadline",
  "alert",
  "followUp",
  "audit",
]);

export const REOS_APPROVAL_GATES = Object.freeze([
  "production",
  "destructive_migration",
  "secrets_or_auth",
  "irreversible_git",
  "billing",
  "material_legal_or_financial_commitment",
]);

export function validateReosAction(action = {}) {
  const missing = [];
  for (const field of ["actorId","actionType","evidence","decision","approvalState"]) {
    if (action[field] === undefined || action[field] === null || action[field] === "") missing.push(field);
  }

  const material = action.material === true;
  const requiresApproval = material || REOS_APPROVAL_GATES.includes(action.actionType);

  if (requiresApproval && action.approvalState !== "approved") {
    return { ok: false, code: "APPROVAL_REQUIRED", missing };
  }

  if (!Array.isArray(action.evidence) || action.evidence.length === 0) {
    return { ok: false, code: "EVIDENCE_REQUIRED", missing };
  }

  return { ok: missing.length === 0, code: missing.length ? "INVALID_ACTION" : "OK", missing };
}

export function validateProjectConfiguration(config = {}) {
  const required = REOS_DOMAINS.configurableProject;
  const missing = required.filter(key => config[key] === undefined);
  return { ok: missing.length === 0, missing };
}

export function validateCustomerOutput(output = {}) {
  const required = ["title","summary","sourceContext","nextAction"];
  const missing = required.filter(key => !output[key]);
  return { ok: missing.length === 0, missing };
}


export const DECISION_CONSTITUTION = Object.freeze({
  sourceTruthHierarchy: ["approved_record","repository_decision","validated_runtime_data","source_document","external_source","user_input","inference"],
  evidenceStrengths: ["verified","supported","limited","unknown"],
  reasoningClasses: ["fact","source_fact","calculation","inference","scenario","recommendation","action"],
  recalculationModes: ["AUTO","MANUAL","APPROVAL_REQUIRED"],
  failurePolicies: ["retry","fallback","stop","escalate"],
  executionTraceRequired: true,
  idempotencyRequired: true,
  dryRunForSensitiveActions: true,
  preserveApprovedVersions: true,
  silentCriticalMutation: false,
});

export function classifyDecision(value = {}) {
  const required = ["source","evidence","reasoningClass"];
  const missing = required.filter(k => value[k] === undefined || value[k] === null || value[k] === "");
  const validReasoning = DECISION_CONSTITUTION.reasoningClasses.includes(value.reasoningClass);
  const validEvidence = DECISION_CONSTITUTION.evidenceStrengths.includes(value.evidence);
  return {
    ok: missing.length === 0 && validReasoning && validEvidence,
    missing,
    code: missing.length ? "DECISION_METADATA_REQUIRED" : (!validReasoning || !validEvidence ? "DECISION_CLASS_INVALID" : "OK"),
  };
}

export function validateCriticalChange(change = {}) {
  const required = ["changeId","beforeVersion","afterVersion","impact","recalculationMode"];
  const missing = required.filter(k => change[k] === undefined || change[k] === null || change[k] === "");
  const modeValid = DECISION_CONSTITUTION.recalculationModes.includes(change.recalculationMode);
  const versioned = change.beforeVersion !== change.afterVersion;
  return {
    ok: missing.length === 0 && modeValid && versioned,
    missing,
    code: missing.length ? "CHANGE_METADATA_REQUIRED" : (!modeValid ? "RECALCULATION_MODE_INVALID" : (!versioned ? "VERSION_REQUIRED" : "OK")),
  };
}

export function validateExecutionTrace(trace = {}) {
  const required = ["executionId","actor","tool","time","action","result","verification"];
  const missing = required.filter(k => trace[k] === undefined || trace[k] === null || trace[k] === "");
  return { ok: missing.length === 0, missing, code: missing.length ? "EXECUTION_TRACE_REQUIRED" : "OK" };
}

export function validateBoundedTask(task = {}) {
  const required = ["taskId","allowedReads","allowedWrites","allowedExecutions","prohibitedOperations"];
  const missing = required.filter(k => task[k] === undefined);
  const numeric = ["tokenBudget","timeBudgetMs","costBudget","maxIterations"].filter(k => task[k] !== undefined && (!Number.isFinite(task[k]) || task[k] < 0));
  return { ok: missing.length === 0 && numeric.length === 0, missing, invalidBudgets: numeric, code: missing.length ? "TASK_SCOPE_REQUIRED" : (numeric.length ? "BUDGET_INVALID" : "OK") };
}

export function validateLineage(value = {}) {
  const required = ["inputLineage","sourceRecords","sourceVersion","sourceTimestamp"];
  const missing = required.filter(k => value[k] === undefined || value[k] === null || value[k] === "");
  return { ok: missing.length === 0, missing, code: missing.length ? "LINEAGE_REQUIRED" : "OK" };
}

export function validateRecovery(record = {}) {
  const required = ["before","after","auditTrail"];
  const missing = required.filter(k => record[k] === undefined || record[k] === null);
  return { ok: missing.length === 0, missing, code: missing.length ? "RECOVERY_EVIDENCE_REQUIRED" : "OK" };
}
