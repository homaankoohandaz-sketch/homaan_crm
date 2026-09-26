# BuildWise Agent Lab

Isolated laboratory for the BuildWise multi-agent control plane.

## Boundary

This branch is intentionally isolated from the production BuildWise code path.

- No production BuildWise files are modified.
- The lab owns its task contract and worker abstraction.
- Promotion to the main BuildWise architecture happens only after verification.

## Runtime

The intended Free-first path is:

`ChatGPT Master -> Control Plane -> Desktop Worker Bridge -> Grok/local worker -> evidence -> verification`

The bridge binds to `127.0.0.1` by default and does not expose the worker to the public internet.

## Local worker contract

Start the bridge from `agent-lab`:

```bash
GROK_WORKER_COMMAND=/path/to/your-worker npm run bridge
```

Optional:

```bash
BUILDWISE_REPO_ROOT=/home/t460s/projects/homaan_crm
BUILDWISE_BRIDGE_PORT=8787
GROK_WORKER_ARGS='["arg1","arg2"]'
```

The worker command receives one JSON object on stdin and must return one JSON object on stdout. It is deliberately transport-agnostic: a local Grok UI automation worker, a future Grok API client, Claude handoff, or another local worker can implement the same protocol.

No Grok API key is embedded or assumed. This keeps the architecture usable under Iran/payment constraints.

## Verification

```bash
npm test
node src/smoke.js
```

GitHub Actions runs the same checks on every Agent Lab change.

## Promotion rule

Nothing in `agent-lab/` is treated as production-ready until:

1. CI passes.
2. A real desktop worker is connected.
3. One real task completes through the bridge.
4. Evidence and file boundaries are verified.
5. A reviewed PR is created against the intended BuildWise branch.

Current status: **bridge implemented; real Grok runtime not yet verified**.
