import { createCommandTransport } from "./grok-command.js";
import { createGrokWorker } from "./grok-adapter.js";
import { createDesktopBridge } from "./desktop-bridge.js";

const command = process.env.GROK_WORKER_COMMAND;
if (!command) {
  console.error("GROK_WORKER_COMMAND is required. Set it to a local worker executable that reads one JSON object from stdin and writes one JSON object to stdout.");
  process.exit(2);
}

const worker = createGrokWorker({
  transport: createCommandTransport({
    command,
    args: process.env.GROK_WORKER_ARGS ? JSON.parse(process.env.GROK_WORKER_ARGS) : [],
    cwd: process.env.BUILDWISE_REPO_ROOT || process.cwd()
  })
});

const bridge = createDesktopBridge({
  worker,
  host: process.env.BUILDWISE_BRIDGE_HOST || "127.0.0.1",
  port: Number(process.env.BUILDWISE_BRIDGE_PORT || 8787)
});

const address = await bridge.start();
console.log(`BuildWise Desktop Worker Bridge listening on http://${address.host}:${address.port}`);
