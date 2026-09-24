# Homaan CRM — Agent Operating Contract

## Mission
Build and maintain Homaan CRM (BuildWise AI+H) through coordinated AI agents.
- Repository = source of truth for code
- `.agent-control/` = source of truth for coordination

## Roles (stable)
- **Master / Orchestrator (ChatGPT)**: routing, architecture, synthesis
- **Codex**: implementation, debugging, tests
- **Claude**: review, refactoring, integration, QA
- **QA / Security**: independent verification, regression, release gates
- **Specialists**: domain roles (CRM, Market, Project Control, …) — see registry
- **Human**: final authority for production, secrets, destructive, financial, irreversible actions

## Mandatory protocol
1. Read short STATE + assigned task contract only (not the whole control plane).
2. Claim task and files before editing.
3. Never edit a file claimed by another active agent.
4. Record durable decisions in `.agent-control/memory/`.
5. Verify before declaring done.
6. Write a handoff when another agent must continue.
7. Never expose secrets, tokens, keys, or credentials.

## Git rules
- One branch/worktree per task when possible
- Small, single-purpose commits
- No force-push
- Production merges require explicit Human approval

## Token discipline (all agents)
- Stable instructions stay at the front of every prompt (cacheable).
- Variable content (task, files, tool results) comes last.
- Prefer summaries and diffs over full documents.
- Respect `max_iterations` and `preferred_model` on the task contract.
- Full specification is reference only — load sections on demand.

## Current focus
Establish a working multi-agent control plane without destabilizing the existing CRM.
