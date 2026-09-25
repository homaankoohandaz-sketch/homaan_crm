import assert from "node:assert/strict";
import { createWorkerRegistry, routeTask } from "../src/agent-control/worker-registry.js";

const registry = createWorkerRegistry();

assert.equal(registry.workers.grok.status, "available");
assert.equal(registry.workers.claude.status, "handoff");
assert.equal(registry.workers.codex.status, "blocked");

assert.equal(
  routeTask({ kind: "implementation", preferred_model: "codex" }, registry).worker,
  "grok"
);
assert.equal(
  routeTask({ kind: "review", preferred_model: "claude" }, registry).worker,
  "grok"
);
assert.equal(
  routeTask({ kind: "implementation", preferred_model: "gemini" }, registry).worker,
  "grok"
);

console.log("agent-control worker routing: ok");
