import { Worker, createWorkerResult } from "./worker.js";

export function createGrokWorker({ transport } = {}) {
  if (typeof transport !== "function") {
    throw new Error("Grok adapter requires a transport");
  }

  const worker = new Worker({
    name: "grok",
    capabilities: ["implementation", "review", "github"]
  });

  worker.execute = async task => {
    if (task?.contract?.preferred_model !== "grok") {
      throw new Error("preferred_model must be grok");
    }

    const payload = {
      model: "grok",
      task_id: task.id,
      title: task.title,
      max_iterations: task.contract.max_iterations,
      allowed_files: [...task.contract.allowed_files],
      cache_keys: [...task.contract.cache_keys],
      summarize_after_tools: task.contract.summarize_after_tools
    };

    const response = await transport(payload);
    return createWorkerResult({
      worker: worker.name,
      task,
      status: "completed",
      output: response?.output ?? null,
      error: response?.error ?? null,
      evidence: response?.evidence ?? []
    });
  };

  return worker;
}
