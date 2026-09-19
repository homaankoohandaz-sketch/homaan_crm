# Phase 1 — Claude + Codex Runtime Bridge

## Objective

Make Claude Code and Codex first-class cooperating agents for this repository.

## Required behavior

1. Claude is the reviewer/integrator:
   - inspect architecture and implementation plans;
   - review Codex changes;
   - identify regressions, missing tests, and refactor opportunities;
   - write handoff notes into .agent-control/handoffs/.

2. Codex is the implementer:
   - claim implementation tasks;
   - claim file locks before editing;
   - implement and debug;
   - run verification;
   - hand off results to Claude.

3. Both agents MUST read:
   - AGENTS.md
   - CLAUDE.md
   - .agent-control/STATE.md
   - relevant task file
   before modifying the repository.

4. They MUST NOT edit the same claimed file concurrently.

5. GitHub remains the durable source of project truth.

6. Production, destructive migrations, secrets/auth changes, irreversible Git operations, and billing remain human approval gates.

## Initial bootstrap task

- Verify Claude can access the repository and read the control-plane files.
- Verify Codex can access the same repository/workspace.
- Verify both can read and update task/handoff state.
- Verify a Claude -> Codex -> Claude handoff using a harmless read-only or documentation task.
- Do not modify application runtime code during bootstrap.

## Success criteria

A task can move through:

ARCHITECT -> CLAUDE REVIEW -> CODEX IMPLEMENT -> CLAUDE REVIEW -> QA -> HUMAN APPROVAL

without losing state or allowing conflicting file edits.
