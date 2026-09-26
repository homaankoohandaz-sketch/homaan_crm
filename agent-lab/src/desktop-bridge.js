import http from "node:http";

function json(res, status, body) {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store"
  });
  res.end(JSON.stringify(body));
}

export function createDesktopBridge({ worker, host = "127.0.0.1", port = 0 } = {}) {
  if (!worker || typeof worker.execute !== "function") {
    throw new Error("worker.execute is required");
  }

  let server;

  return {
    start() {
      if (server) return Promise.reject(new Error("bridge already started"));
      server = http.createServer(async (req, res) => {
        try {
          if (req.method === "GET" && req.url === "/health") {
            return json(res, 200, { status: "ok", worker: "grok" });
          }
          if (req.method !== "POST" || req.url !== "/execute") {
            return json(res, 404, { error: "not_found" });
          }

          let raw = "";
          for await (const chunk of req) raw += chunk;
          const body = JSON.parse(raw || "{}");
          if (!body.task || typeof body.task !== "object") {
            return json(res, 400, { error: "task is required" });
          }

          const result = await worker.execute(body.task);
          return json(res, 200, result);
        } catch (error) {
          return json(res, 500, { error: error.message });
        }
      });

      return new Promise((resolve, reject) => {
        server.once("error", reject);
        server.listen(port, host, () => {
          const address = server.address();
          resolve({ host, port: address.port });
        });
      });
    },

    stop() {
      if (!server) return Promise.resolve();
      const current = server;
      server = null;
      return new Promise((resolve, reject) => {
        current.close(error => error ? reject(error) : resolve());
      });
    }
  };
}
