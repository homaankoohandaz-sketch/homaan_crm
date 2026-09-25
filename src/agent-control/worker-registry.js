const DEFAULT_WORKERS = Object.freeze({
  chatgpt: { capability: "orchestrate", status: "available" },
  grok: { capability: ["implement", "review", "control"], status: "available" },
  claude: { capability: "review", status: "handoff" },
  codex: { capability: "implement", status: "blocked" },
  gemini: { capability: "research", status: "configured" },
  n8n: { capability: "automation", status: "blocked" },
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
    codex: ["codex", "grok"],
    grok: ["grok"],
    claude: ["claude"],
    gemini: ["gemini", "grok"],
    chatgpt: ["chatgpt"],
  };

  const kindMap = {
    implementation: ["codex", "grok"],
    review: ["claude", "grok"],
    research: ["gemini", "claude"],
    orchestration: ["chatgpt"],
    automation: ["n8n", "grok"],
  };

  const capabilityByKind = { implementation: "implement", review: "review", research: "research", orchestration: "orchestrate", automation: "automation" };
  const requiredCapability = capabilityByKind[task.kind];
  const candidates = preferredMap[preferred] ?? kindMap[task.kind] ?? ["grok"];
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
