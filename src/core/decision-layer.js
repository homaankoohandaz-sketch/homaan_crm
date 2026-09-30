/**
 * BuildWise AI decision layer.
 * Deterministic routing, permission gates, evidence and canonical decision loop.
 */
const clone = (o) => JSON.parse(JSON.stringify(o ?? {}));

const ROUTES = [
  { when: (i) => i.task === "code", model: "codex" },
  { when: (i) => i.task === "review", model: "claude" },
  { when: (i) => ["valuation", "land", "market"].includes(i.task), model: "chatgpt" },
  { when: (i) => i.task === "research", model: "web-research" },
];

export function routeModel(input = {}) {
  return ROUTES.find((route) => route.when(input)) ?? { model: "chatgpt" };
}

const PERMISSIONS = Object.freeze({
  advisor: Object.freeze(["property.read", "lead.read", "match.read", "deal.read"]),
  staff: Object.freeze(["property.read", "property.write", "lead.read", "lead.write", "match.read"]),
  manager: Object.freeze(["property.read", "property.write", "lead.read", "lead.write", "deal.read", "deal.write"]),
  builder: Object.freeze(["property.read", "property.write", "deal.read", "deal.write", "project.read", "project.write"]),
  owner: Object.freeze(["property.read", "property.write", "lead.read", "lead.write", "deal.read", "deal.write", "project.read", "project.write"]),
});

export function getPermissionMatrix() {
  return clone(PERMISSIONS);
}

export function canPerform(role, action, ctx = {}) {
  const allowed = new Set(PERMISSIONS[role] ?? []);
  if (!allowed.has(action)) return false;
  if (ctx.production === true && ctx.approved !== true) return false;
  if (ctx.production === true && !["owner", "manager"].includes(role)) return false;
  return true;
}

export function decide({ type = "general", facts = [], action = null } = {}) {
  const evidence = (facts ?? []).map((fact, index) => ({
    id: index + 1,
    source: fact?.source ?? "unknown",
    value: fact?.value,
  }));
  const highImpact = ["publish", "delete", "execute", "contract", "payment"].includes(action);
  return {
    status: highImpact ? "needs_approval" : "ready",
    type,
    action,
    evidence,
    confidence: evidence.length ? Math.min(95, 50 + evidence.length * 10) : 10,
  };
}

export function recordFeedback(state = {}, event = {}) {
  const next = clone(state);
  next.events = Array.isArray(next.events) ? next.events.slice() : [];
  next.events.push({ ...clone(event), timestamp: event.timestamp ?? new Date().toISOString() });
  return next;
}

export const DECISION_STAGES = Object.freeze([
  "INPUT",
  "IDENTIFY",
  "UNDERSTAND",
  "ANALYZE",
  "MATCH",
  "CALCULATE",
  "SIMULATE",
  "RECOMMEND",
  "HUMAN_APPROVAL",
  "EXECUTE",
  "MONITOR",
  "MEASURE",
  "LEARN",
]);

export function masterDecisionLoop(input = {}, completedStages = []) {
  const completed = new Set((completedStages ?? []).map(String));
  const next = DECISION_STAGES.find((stage) => !completed.has(stage)) ?? null;
  return {
    stages: [...DECISION_STAGES],
    input: clone(input),
    next,
    status: next === "HUMAN_APPROVAL"
      ? "awaiting_human_approval"
      : next
        ? "in_progress"
        : "complete",
  };
}
