import assert from "node:assert/strict";
import { createBudget, consumeBudget, resolveWorker, runWorker } from "../tools/worker-runtime.mjs";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const blocked = resolveWorker("grok", {});
assert.equal(blocked.status, "blocked");
assert.equal(blocked.reason, "WORKER_RUNTIME_NOT_CONFIGURED");

const ready = resolveWorker("grok", { BUILDWISE_GROK_COMMAND: "worker-cli --run" });
assert.equal(ready.status, "ready");
assert.equal(ready.command, "worker-cli --run");

const budget = createBudget({ tokenBudget: 1000, timeBudgetMs: 5000, costBudget: 1, maxIterations: 3 });
assert.equal(budget.maxIterations, 3);
const after = consumeBudget(budget, { tokens: 100, timeMs: 100, cost: .1, iterations: 1 });
assert.equal(after.exhausted, false);
assert.equal(after.maxIterations, 2);
assert.equal(consumeBudget(after, { iterations: 2 }).exhausted, true);

const taskPath = join(process.cwd(), ".tmp-worker-runtime-task.txt");
writeFileSync(taskPath, "SMOKE_TASK");
const executed = await runWorker({
  worker: "local",
  taskPath,
  env: { BUILDWISE_LOCAL_COMMAND: process.execPath },
  budget: { tokenBudget: 100, timeBudgetMs: 5000, costBudget: 0, maxIterations: 1 },
  execute: (_command, args, _options, callback) => callback(null, args.at(-1), ""),
});
assert.equal(executed.status, "budget_exhausted");
assert.equal(executed.escalation, "human_advisor");
assert.equal(executed.usage.iterations, 1);

console.log("worker runtime: bounded execution + quota + escalation ok");
