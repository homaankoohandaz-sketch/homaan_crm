import assert from "node:assert/strict";
import { createWorkerRegistry, routeTask } from "../src/agent-control/worker-registry.js";

const registry = createWorkerRegistry();

assert.equal(registry.workers.buildwise_local.status, "available");
assert.equal(registry.workers.buildwise_local.provider, "self-hosted");
assert.equal(registry.workers.codex.status, "optional");
assert.equal(registry.workers.claude.status, "optional");
assert.equal(registry.workers.gemini.status, "optional");
assert.equal(registry.workers.n8n.status, "optional");

for (const [kind, preferred_model] of [
  ["implementation", "codex"],
  ["review", "claude"],
  ["research", "gemini"],
  ["automation", "n8n"],
]) {
  const routed = routeTask({ kind, preferred_model }, registry);
  assert.equal(routed.status, "ready");
  assert.equal(routed.worker, "buildwise_local");
  assert.equal(routed.fallback, preferred_model);
}

console.log("agent-control worker routing: independent fallback ready");
