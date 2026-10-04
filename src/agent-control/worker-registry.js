const DEFAULT_WORKERS = Object.freeze({
  chatgpt: { capability: "orchestrate", status: "available" },
  buildwise_local: { capability: ["implement", "review", "research", "automation", "control"], status: "available", provider: "self-hosted" },
  grok: { capability: ["implement", "review", "control"], status: "optional" },
  claude: { capability: "review", status: "optional" },
  codex: { capability: "implement", status: "optional" },
  gemini: { capability: "research", status: "optional" },
  n8n: { capability: "automation", status: "optional" },
});

export function createWorkerRegistry(overrides = {}) {
  const workers = {};
  for (const [name, worker] of Object.entries(DEFAULT_WORKERS)) {
    workers[name] = Object.freeze({ ...worker, ...(overrides[name] ?? {}) });
  }
  return Object.freeze({ workers: Object.freeze(workers) });
}

function usable(worker) {
  return worker && worker.status === "available";
}

export function routeTask(task, registry = createWorkerRegistry()) {
  const workers = registry.workers;
  const preferred = task.preferred_model?.toLowerCase();

  const preferredMap = {
    codex: ["codex", "buildwise_local", "grok"],
    grok: ["grok", "buildwise_local"],
    claude: ["claude", "buildwise_local", "grok"],
    gemini: ["gemini", "buildwise_local", "grok"],
    chatgpt: ["chatgpt"],
  };

  const kindMap = {
    implementation: ["codex", "buildwise_local", "grok"],
    review: ["claude", "buildwise_local", "grok"],
    research: ["gemini", "buildwise_local", "claude"],
    orchestration: ["chatgpt"],
    automation: ["n8n", "buildwise_local", "grok"],
  };

  const capabilityByKind = { implementation: "implement", review: "review", research: "research", orchestration: "orchestrate", automation: "automation" };
  const requiredCapability = capabilityByKind[task.kind];
  const candidates = preferredMap[preferred] ?? kindMap[task.kind] ?? ["buildwise_local"];
  const worker = candidates.find((name) => usable(workers[name]) && (!requiredCapability || (Array.isArray(workers[name].capability) ? workers[name].capability.includes(requiredCapability) : workers[name].capability === requiredCapability)));

  if (!worker) {
    return {
      worker: null,
      status: "blocked",
      reason: "No usable worker matches this task.",
    };
  }

  return {
    worker,
    status: "ready",
    fallback: preferred !== worker ? preferred ?? null : null,
  };
}

export const WORKER_REGISTRY_VERSION = "1.0.0";
