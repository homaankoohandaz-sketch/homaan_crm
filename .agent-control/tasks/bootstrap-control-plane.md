# Task: Bootstrap Control Plane

Status: ready
Owner: ORCHESTRATOR
Priority: P0

## Objective
Create the durable project contract needed for multiple AI coding agents to work on Homaan CRM without context drift or file collisions.

## Acceptance criteria
- AGENTS.md exists.
- CLAUDE.md exists.
- .agent-control state exists.
- Architecture memory exists.
- Runtime integration remains optional.
- No existing CRM application code is changed.

## Next task
Evaluate and integrate the smallest reliable runtime bridge for Claude Code + Codex first. Then add Gemini/n8n/other MCP agents through adapters.
