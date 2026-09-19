# Homaan CRM Agent Control Plane

This directory is the coordination layer for the multi-agent development team.

## Planned layers
1. Shared project memory
2. Agent registry and presence
3. Task board
4. File/resource locks
5. Agent messaging
6. Handoffs
7. Review/approval gates
8. Orchestration adapters
9. Observability

## Design rule
The CRM application must remain independent from the orchestration implementation. The control plane may use MCP, SQLite, JSON, WebSocket, n8n, or another bridge, but project knowledge and task contracts must remain portable.

## Runtime candidates
- shared-agent-memory: shared memory for Claude Code, Codex and MCP clients.
- multiagents: orchestration for Claude Code, Codex CLI and Gemini CLI.
- shared-context-mcp: real-time memory/tasks/messages/artifacts over MCP/WebSocket.
- codex-orchestrator: Codex + Claude control plane with shared memory and project boards.

These are integration candidates, not yet hard dependencies.
