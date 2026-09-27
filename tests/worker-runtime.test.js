import assert from "node:assert/strict";
import { resolveWorker } from "../tools/worker-runtime.mjs";

const blocked = resolveWorker("grok", {});
assert.equal(blocked.status, "blocked");
assert.equal(blocked.reason, "WORKER_RUNTIME_NOT_CONFIGURED");

const ready = resolveWorker("grok", { BUILDWISE_GROK_COMMAND: "worker-cli --run" });
assert.equal(ready.status, "ready");
assert.equal(ready.command, "worker-cli --run");

console.log("worker runtime gate: ok");
