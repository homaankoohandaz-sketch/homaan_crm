import assert from "node:assert/strict";
import { authorizeQuota, getPlanPolicy, getUsage, recordUsage, resetUsageForTests } from "../src/agent-control/ai-quota.js";

resetUsageForTests();
assert.equal(getPlanPolicy("free").tokenLimit, 10000);
assert.equal(getPlanPolicy("pro").tokenLimit, 100000);
assert.equal(getPlanPolicy("premium").tokenLimit, 500000);

assert.equal(authorizeQuota({ userId: "u1", plan: "free", requestedTokens: 10000 }).ok, true);
recordUsage({ userId: "u1", windowId: "w1", tokens: 9990, timeMs: 1000, cost: 0 });
assert.equal(authorizeQuota({ userId: "u1", plan: "free", windowId: "w1", requestedTokens: 11 }).ok, false);
assert.equal(authorizeQuota({ userId: "u1", plan: "free", windowId: "w1", requestedTokens: 10 }).ok, true);
assert.equal(getUsage("u1", "w1").tokens, 9990);

console.log("AI quota policy: three tiers + per-user enforcement PASS");
