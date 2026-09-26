import { spawn } from "node:child_process";

export function createCommandTransport({ command, args = [], cwd = process.cwd(), timeout_ms = 120000 } = {}) {
  if (!command) throw new Error("command is required");

  return payload => new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      shell: false,
      stdio: ["pipe", "pipe", "pipe"]
    });

    let stdout = "";
    let stderr = "";
    let settled = false;

    const finish = (fn, value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      fn(value);
    };

    const timer = setTimeout(() => {
      child.kill("SIGTERM");
      finish(reject, new Error("worker command timed out"));
    }, timeout_ms);

    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", chunk => { stdout += chunk; });
    child.stderr.on("data", chunk => { stderr += chunk; });

    child.on("error", error => finish(reject, error));
    child.on("close", code => {
      if (code !== 0) {
        return finish(reject, new Error(stderr.trim() || `worker command exited with code ${code}`));
      }
      try {
        finish(resolve, JSON.parse(stdout));
      } catch {
        finish(reject, new Error("worker command returned invalid JSON"));
      }
    });

    child.stdin.end(JSON.stringify(payload));
  });
}
