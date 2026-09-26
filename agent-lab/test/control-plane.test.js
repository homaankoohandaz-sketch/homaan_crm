import test from "node:test";
import assert from "node:assert/strict";
import { createTask, transitionTask, validateTaskContract } from "../src/control-plane.js";

test("creates a pending task with a normalized worker contract", () => {
  const task = createTask({
    title: "lab smoke test",
    preferred_model: "claude",
    max_iterations: 3,
    allowed_files: ["agent-lab/src/control-plane.js"],
    cache_keys: ["lab:v1"],
    summarize_after_tools: true
  });

  assert.match(task.id, /^task_/);
  assert.equal(task.status, "pending");
  assert.equal(task.contract.preferred_model, "claude");
  assert.equal(task.contract.max_iterations, 3);
});

test("rejects an unsafe task contract", () => {
  assert.throws(
    () => validateTaskContract({
      title: "bad",
      preferred_model: "unknown",
      max_iterations: 3,
      allowed_files: ["../outside"],
      cache_keys: [],
      summarize_after_tools: true
    }),
    /preferred_model|allowed_files/
  );
});

test("allows deterministic state transitions", () => {
  const task = createTask({
    title: "transition",
    preferred_model: "grok",
    max_iterations: 3,
    allowed_files: [],
    cache_keys: [],
    summarize_after_tools: true
  });
  const running = transitionTask(task, "running");
  const completed = transitionTask(running, "completed");

  assert.equal(running.status, "running");
  assert.equal(completed.status, "completed");
});
  const running = transitionTask(task, "running");
  const completed = transitionTask(running, "completed");

  assert.equal(running.status, "running");
  assert.equal(completed.status, "completed");
});
