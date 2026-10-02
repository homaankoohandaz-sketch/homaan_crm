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
