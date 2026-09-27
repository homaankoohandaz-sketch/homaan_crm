# Worker Runtime Task

status: BLOCKED_PENDING_CREDENTIALS
preferred_model: grok
max_iterations: 3
allowed_files:
- tools/worker-runtime.mjs
- tests/worker-runtime.test.js
- src/agent-control/worker-registry.js
- tests/agent-control-worker-registry.test.js
- .agent-control/tasks/WORKER-RUNTIME.md
- .agent-control/BRIEF.md
- .agent-control/memory/PERFORMANCE.md

## Objective
Provide a bounded execution adapter for external AI workers without storing credentials in the repository.

## Gate
A worker becomes OPERATIONAL only after a real runtime credential/environment is supplied outside Git, a non-production task executes successfully, and evidence is independently verifiable.

## Current blocker
No test credential and no registered durable Codex environment are available. Do not fabricate, bypass, or create accounts.
