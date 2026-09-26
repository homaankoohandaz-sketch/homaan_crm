import test from "node:test";
import assert from "node:assert/strict";
import { createGrokWorker } from "../src/grok-adapter.js";
import { createDesktopBridge } from "../src/desktop-bridge.js";
import { createTask } from "../src/control-plane.js";

import { createCommandTransport } from "../src/grok-command.js";

function task(overrides = {}) {
  return createTask({
    title: "implement bridge",
    preferred_model: "grok",
    max_iterations: 3,
    allowed_files: ["agent-lab/src/grok-adapter.js"],
    cache_keys: ["buildwise:agent-lab:v1"],
    summarize_after_tools: true,
    ...overrides
  });
}

test("Grok adapter sends only the task contract to its transport", async () => {
  let received;
  const worker = createGrokWorker({
    transport: async payload => {
      received = payload;
      return { output: "ok", evidence: ["test-pass"] };
    }
  });

  const t = task();
  const result = await worker.execute(t);

  assert.equal(result.status, "completed");
  assert.equal(result.output, "ok");
  assert.deepEqual(result.evidence, ["test-pass"]);
  assert.equal(received.model, "grok");
  assert.equal(received.task_id, t.id);
  assert.deepEqual(received.allowed_files, t.contract.allowed_files);
  assert.equal(received.max_iterations, 3);
});

test("Grok adapter refuses non-Grok tasks", async () => {
  const worker = createGrokWorker({ transport: async () => ({ output: "bad" }) });
  await assert.rejects(() => worker.execute(task({ preferred_model: "claude" })), /preferred_model must be grok/);
});

test("command transport uses a local JSON line worker", async () => {
  const transport = createCommandTransport({
    command: process.execPath,
    args: ["-e", "process.stdin.setEncoding('utf8'); let s=''; process.stdin.on('data',d=>s+=d).on('end',()=>process.stdout.write(JSON.stringify({output:JSON.parse(s).task_id,evidence:['local-command']})));"]
  });
  const result = await transport({ model: "grok", task_id: "task_local" });
  assert.equal(result.output, "task_local");
  assert.deepEqual(result.evidence, ["local-command"]);
});

test("desktop bridge exposes health and delegates execute requests", async () => {
  const calls = [];
  const bridge = createDesktopBridge({
    worker: {
      execute: async t => {
        calls.push(t.id);
        return { status: "completed", output: "bridge-ok", evidence: [] };
      }
    },
    host: "127.0.0.1",
    port: 0
  });

  const address = await bridge.start();
  try {
    const health = await fetch(`http://${address.host}:${address.port}/health`);
    assert.equal(health.status, 200);
    assert.deepEqual(await health.json(), { status: "ok", worker: "grok" });

    const response = await fetch(`http://${address.host}:${address.port}/execute`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ task: task() })
    });
    assert.equal(response.status, 200);
    assert.equal((await response.json()).output, "bridge-ok");
    assert.equal(calls.length, 1);
  } finally {
    await bridge.stop();
  }
});
