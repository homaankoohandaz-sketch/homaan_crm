import { execFile } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

const MAX_OUTPUT = Number(process.env.BUILDWISE_WORKER_MAX_OUTPUT ?? 12000);
const DEFAULT_TIMEOUT_MS = Number(process.env.BUILDWISE_WORKER_TIMEOUT_MS ?? 180000);

function finiteNonNegative(value, fallback) {
  return Number.isFinite(Number(value)) && Number(value) >= 0 ? Number(value) : fallback;
}

export function loadTask(taskPath) {
  if (!taskPath || !existsSync(taskPath)) throw new Error("TASK_FILE_NOT_FOUND");
  const task = readFileSync(taskPath, "utf8");
  if (task.length > 12000) throw new Error("TASK_FILE_TOO_LARGE");
  return task;
}

export function resolveWorker(worker, env = process.env) {
  const key = "BUILDWISE_" + String(worker).toUpperCase() + "_COMMAND";
  const command = env[key];
  if (!command) {
    return { status: "blocked", worker, reason: "WORKER_RUNTIME_NOT_CONFIGURED" };
  }
  return { status: "ready", worker, command };
}

export function createBudget(input = {}) {
  return Object.freeze({
    tokenBudget: finiteNonNegative(input.tokenBudget, 0),
    timeBudgetMs: finiteNonNegative(input.timeBudgetMs, DEFAULT_TIMEOUT_MS),
    costBudget: finiteNonNegative(input.costBudget, 0),
    maxIterations: Math.max(1, Math.floor(finiteNonNegative(input.maxIterations, 1))),
  });
}

export function consumeBudget(budget, usage = {}) {
  const next = {
    tokenBudget: budget.tokenBudget - finiteNonNegative(usage.tokens, 0),
    timeBudgetMs: budget.timeBudgetMs - finiteNonNegative(usage.timeMs, 0),
    costBudget: budget.costBudget - finiteNonNegative(usage.cost, 0),
    maxIterations: budget.maxIterations - Math.max(0, Math.floor(finiteNonNegative(usage.iterations, 0))),
  };
  const exhausted = Object.entries(next).some(([key, value]) => key !== "maxIterations" ? value < 0 : value < 0);
  return Object.freeze({ ...next, exhausted });
}

export function runWorker({ worker, taskPath, env = process.env, budget = {}, execute = execFile }) {
  const resolved = resolveWorker(worker, env);
  if (resolved.status !== "ready") return Promise.resolve(resolved);

  const limits = createBudget(budget);
  if (limits.maxIterations < 1) {
    return Promise.resolve({ status: "blocked", worker, reason: "ITERATION_BUDGET_EXHAUSTED" });
  }

  const task = loadTask(taskPath);
  const [command, ...args] = resolved.command.trim().split(/\s+/);
  const started = Date.now();

  return new Promise((resolve) => {
    execute(
      command,
      [...args, task],
      { env, timeout: limits.timeBudgetMs || DEFAULT_TIMEOUT_MS, maxBuffer: MAX_OUTPUT * 2 },
      (error, stdout, stderr) => {
        const timeMs = Date.now() - started;
        const output = String(stdout || "").slice(0, MAX_OUTPUT);
        const errorText = String(stderr || "").slice(0, MAX_OUTPUT);
        const usage = { timeMs, iterations: 1 };
        const remaining = consumeBudget(limits, usage);

        if (remaining.exhausted && !error) {
          resolve({
            status: "budget_exhausted",
            worker,
            output,
            error: errorText,
            usage,
            remaining,
            escalation: "human_advisor",
          });
          return;
        }

        resolve({
          status: error ? "failed" : "completed",
          worker,
          exit_code: error?.code ?? 0,
          output,
          error: errorText,
          usage,
          remaining,
          escalation: null,
        });
      }
    );
  });
}
