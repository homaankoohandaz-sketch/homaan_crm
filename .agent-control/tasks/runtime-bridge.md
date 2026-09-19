# Runtime Bridge Integration

Status: blocked only on human-side Codex environment authentication/registration.

## Objective

Connect the repository control plane to the local Codex workspace without changing application code.

## Required agents

- ORCHESTRATOR: owns runtime coordination.
- CODEX: local implementation/test execution.
- CLAUDE: review/integration.
- ARCHITECT: architecture decisions.
- HUMAN: final approval for privileged or irreversible actions.

## Sequence

1. Human registers/authenticates the Codex environment.
2. Orchestrator verifies the environment.
3. Codex performs a read-only control-plane health check.
4. Runtime task claiming and file locking are enabled.
5. Claude review bridge is connected.
6. Shared memory/task/message protocol is validated.
7. Only then connect n8n automation.

## Safety

No production deployment, destructive migration, secret rotation, billing change, or irreversible Git operation is part of this bootstrap.
