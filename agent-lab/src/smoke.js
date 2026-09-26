import { createTask, transitionTask } from "./control-plane.js";
import { Worker, createWorkerResult } from "./worker.js";

class EchoWorker extends Worker {
  async execute(task) {
    return createWorkerResult({
      worker: this.name,
      task,
      status: "completed",
      output: { message: "agent-lab smoke test passed", task_id: task.id }
    });
  }
}

export async function runSmokeTest() {
  let task = createTask({
    title: "agent-lab smoke test",
    preferred_model: "claude",
    max_iterations: 3,
    allowed_files: ["agent-lab/**"],
    cache_keys: ["agent-lab:v1"],
    summarize_after_tools: true
  });

  task = transitionTask(task, "running");
  const worker = new EchoWorker({ name: "echo-worker", capabilities: ["smoke-test"] });
  const result = await worker.execute(task);

  return { task: transitionTask(task, "completed"), result };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(JSON.stringify(await runSmokeTest(), null, 2));
}
