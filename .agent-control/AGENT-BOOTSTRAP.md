# BuildWise AI+H — Agent Bootstrap Plan

## Current state
The control plane is persisted in the repository. The missing piece is live worker execution: the current state records that the Codex environment registry has zero connected environments.

## Bootstrap sequence
1. Keep ChatGPT as Master/architect.
2. Connect one local executable worker runtime to the repository.
3. Run a documentation-only Master → worker → reviewer handoff.
4. Run a read-only code audit.
5. Run a tiny non-production implementation task in an isolated branch/worktree.
6. Register the worker only after the bootstrap test passes.
7. Enable specialist dispatch for application changes.

## Worker contract
Every worker reads AGENTS.md, CLAUDE.md, STATE.md and its task; claims paths before editing; avoids claimed files; writes verification evidence and a handoff; never exposes secrets; and stops at human approval gates.

## Recommended reference
Use the MIT multi-agent-orchestrator-skill as an implementation reference for isolated worktrees and multi-CLI supervision. Do not make the external repository a runtime dependency unless there is a concrete operational reason.

## Activation order
DEVOPS / INFRA → QA & SECURITY → CRM / DATA → AI ASSISTANT → PROJECT CONTROL → DEAL INTELLIGENCE → LAND / DEVELOPMENT + MARKET / VALUATION → growth/media specialists.
