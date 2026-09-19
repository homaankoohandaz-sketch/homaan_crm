# Agent Runtime Bridge

This directory defines the vendor-neutral runtime contract for Claude Code and Codex.

## Runtime roles
- ChatGPT: architect / task decomposition / decision gate
- Claude Code: reviewer / integrator / refactor / QA review
- Codex: implementer / debugger / test runner
- GitHub: durable source of truth

## Execution order
1. Read AGENTS.md and CLAUDE.md.
2. Read .agent-control/STATE.md and the assigned task.
3. Claim the task and its file paths.
4. Work only inside the claimed paths.
5. Record verification results.
6. Hand off to the next agent through .agent-control/handoffs/.
7. Reviewer validates before the task becomes done.

## Lock rule
The runtime must reject a second active claim for the same path. Git is the durable fallback if a runtime process disappears.

## Bootstrap test
The first live test is documentation-only and must not modify CRM application code. It proves Claude -> Codex -> Claude state transfer before enabling autonomous application changes.

## Human gates
Production deployment, destructive migrations, secrets/authentication changes, irreversible Git operations, and billing require human approval.
