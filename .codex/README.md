# Homaan CRM Codex Environment

This repository is prepared for the multi-agent control plane.

## Local setup

1. Open this repository in the Codex desktop app on Windows.
2. Select the repository as the workspace.
3. Allow workspace access.
4. Run the project setup script if Codex prompts for it.
5. Keep network access disabled by default; enable it only when the task requires GitHub/package/deployment access.

## Required project behavior

- Read `AGENTS.md`, `CLAUDE.md`, and `.agent-control/STATE.md` before work.
- Claim a task before editing.
- Do not edit files claimed by another agent.
- Record decisions and handoffs in `.agent-control/`.
- Use a separate branch/worktree for implementation tasks.
- Never deploy production, run destructive migrations, rotate secrets, or perform irreversible Git operations without the human approval gate.

The final local-device authentication/registration step is intentionally left to the human operator.
