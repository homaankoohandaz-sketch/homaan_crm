const MODELS = new Set(["claude", "grok", "codex"]);
const STATUSES = new Set(["pending", "running", "completed", "failed"]);

export function validateTaskContract(input) {
  if (!input || typeof input.title !== "string" || !input.title.trim()) {
    throw new Error("title is required");
  }
  if (!MODELS.has(input.preferred_model)) {
    throw new Error("preferred_model must be claude, grok, or codex");
  }
  if (!Number.isInteger(input.max_iterations) || input.max_iterations < 1 || input.max_iterations > 3) {
    throw new Error("max_iterations must be an integer between 1 and 3");
  }
  if (!Array.isArray(input.allowed_files) || input.allowed_files.some(p => typeof p !== "string" || p.startsWith("..") || p.startsWith("/"))) {
    throw new Error("allowed_files must contain repository-relative paths");
  }
  if (!Array.isArray(input.cache_keys)) {
    throw new Error("cache_keys must be an array");
  }
  if (typeof input.summarize_after_tools !== "boolean") {
    throw new Error("summarize_after_tools must be boolean");
  }
  return true;
}

export function createTask(input) {
  validateTaskContract(input);
  const now = new Date().toISOString();
  return {
    id: "task_" + Math.random().toString(36).slice(2, 10),
    title: input.title.trim(),
    status: "pending",
    created_at: now,
    updated_at: now,
    contract: {
      preferred_model: input.preferred_model,
      max_iterations: input.max_iterations,
      allowed_files: [...input.allowed_files],
      cache_keys: [...input.cache_keys],
      summarize_after_tools: input.summarize_after_tools
    }
  };
}

export function transitionTask(task, status) {
  if (!STATUSES.has(status)) throw new Error("invalid status");
  if (status === "running" && task.status !== "pending") throw new Error("task must be pending");
  if (status === "completed" && task.status !== "running") throw new Error("task must be running");
  if (status === "failed" && !["running", "pending"].includes(task.status)) throw new Error("task cannot fail from current status");
  return { ...task, status, updated_at: new Date().toISOString() };
}
