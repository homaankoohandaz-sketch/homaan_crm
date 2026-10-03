import assert from "node:assert/strict";
import { join } from "node:path";
import { writeFileSync } from "node:fs";
import { runWorker } from "../tools/worker-runtime.mjs";

const taskPath = join(process.cwd(), ".tmp-worker-runtime-smoke.txt");
writeFileSync(taskPath, "BUILDWISE_RUNTIME_SMOKE");
const result = await runWorker({
  worker: "buildwise_local",
  taskPath,
  env: {
    BUILDWISE_BUILDWISE_LOCAL_COMMAND: `${process.execPath} tools/worker-runtime-smoke.mjs`,
  },
  budget: { tokenBudget: 1000, timeBudgetMs: 10000, costBudget: 1, maxIterations: 2 },
});
assert.equal(result.status, "completed");
assert.equal(result.exit_code, 0);
assert.match(result.output, /BUILDWISE_RUNTIME_SMOKE/);
assert.equal(result.escalation, null);
console.log("real worker runtime smoke: PASS");
