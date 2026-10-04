const PLANS = Object.freeze({
  FREE: Object.freeze({ tokenLimit: 10000, timeLimitMs: 120000, costLimit: 0, concurrency: 1 }),
  PRO: Object.freeze({ tokenLimit: 100000, timeLimitMs: 600000, costLimit: 1, concurrency: 3 }),
  PREMIUM: Object.freeze({ tokenLimit: 500000, timeLimitMs: 1800000, costLimit: 5, concurrency: 10 }),
});

const usage = new Map();

function keyOf(userId, windowId) {
  return String(userId) + ":" + String(windowId);
}

export function getPlanPolicy(plan = "FREE") {
  const normalized = String(plan).toUpperCase();
  if (!PLANS[normalized]) throw new Error("AI_PLAN_INVALID");
  return { plan: normalized, ...PLANS[normalized] };
}

export function getUsage(userId, windowId) {
  const current = usage.get(keyOf(userId, windowId));
  return current ? { ...current } : { tokens: 0, timeMs: 0, cost: 0, tasks: 0 };
}

export function authorizeQuota({ userId, plan = "FREE", windowId = "default", requestedTokens = 0, requestedTimeMs = 0, requestedCost = 0 }) {
  if (!userId) return { ok: false, code: "USER_REQUIRED" };
  const policy = getPlanPolicy(plan);
  const current = getUsage(userId, windowId);
  const requested = {
    tokens: Math.max(0, Number(requestedTokens) || 0),
    timeMs: Math.max(0, Number(requestedTimeMs) || 0),
    cost: Math.max(0, Number(requestedCost) || 0),
  };
  const remaining = {
    tokens: policy.tokenLimit - current.tokens,
    timeMs: policy.timeLimitMs - current.timeMs,
    cost: policy.costLimit - current.cost,
  };
  const ok = requested.tokens <= remaining.tokens && requested.timeMs <= remaining.timeMs && requested.cost <= remaining.cost;
  return { ok, code: ok ? "OK" : "AI_QUOTA_EXHAUSTED", plan: policy.plan, policy, current, remaining, requested };
}

export function recordUsage({ userId, windowId = "default", tokens = 0, timeMs = 0, cost = 0 }) {
  if (!userId) throw new Error("USER_REQUIRED");
  const key = keyOf(userId, windowId);
  const current = getUsage(userId, windowId);
  const next = {
    tokens: current.tokens + Math.max(0, Number(tokens) || 0),
    timeMs: current.timeMs + Math.max(0, Number(timeMs) || 0),
    cost: current.cost + Math.max(0, Number(cost) || 0),
    tasks: current.tasks + 1,
  };
  usage.set(key, next);
  return { ...next };
}

export function resetUsageForTests() {
  usage.clear();
}
