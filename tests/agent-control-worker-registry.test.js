import assert from "node:assert/strict";
import { createWorkerRegistry, routeTask } from "../src/agent-control/worker-registry.js";

const registry = createWorkerRegistry();

assert.equal(registry.workers.grok.status, "blocked");
assert.equal(registry.workers.claude.status, "handoff");
assert.equal(registry.workers.codex.status, "blocked");
assert.equal(registry.workers.gemini.status, "blocked");

assert.equal(
  routeTask({ kind: "implementation", preferred_model: "codex" }, registry).status,
  "blocked"
);
assert.equal(
  routeTask({ kind: "review", preferred_model: "claude" }, registry).status,
  "blocked"
);
assert.equal(
  routeTask({ kind: "research", preferred_model: "gemini" }, registry).status,
  "blocked"
);

console.log("agent-control worker routing truth: ok");
