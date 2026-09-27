import { execFile } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

const MAX_OUTPUT = Number(process.env.BUILDWISE_WORKER_MAX_OUTPUT ?? 12000);

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

export function runWorker({ worker, taskPath, env = process.env }) {
  const resolved = resolveWorker(worker, env);
  if (resolved.status !== "ready") return Promise.resolve(resolved);

  const [command, ...args] = resolved.command.trim().split(/\s+/);
  const task = loadTask(taskPath);

  return new Promise((resolve) => {
    execFile(
      command,
      [...args, task],
      { env, timeout: 180000, maxBuffer: MAX_OUTPUT * 2 },
      (error, stdout, stderr) => {
        resolve({
          status: error ? "failed" : "completed",
          worker,
          exit_code: error?.code ?? 0,
          output: String(stdout || "").slice(0, MAX_OUTPUT),
          error: String(stderr || "").slice(0, MAX_OUTPUT),
        });
      }
    );
  });
}
