# Homaan CRM Agent Control Plane

Coordination layer for the multi-agent development team (Grok + ChatGPT + Claude).

## Start here (low token)
1. **BRIEF.md** — ultra-short shared status (read every turn)
2. **AGENT-SKILL-LOW-TOKEN.md** — how three agents work with minimal tokens
3. **PROMPTS-FOR-OTHER-AGENTS.md** — copy-paste prompts for ChatGPT and Claude
4. **TOKEN-OPTIMIZATION.md** + **PROMPT-CACHING.md** — cost controls
5. Current **task** under `tasks/` + **AGENT-TASK-CONTRACT-v1.md**

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

## Claude without GitHub
Claude never needs repo access. Human pastes BRIEF + task (+ optional short diff). Claude returns a patch proposal + 6-line SUMMARY. Grok or Human applies the change and updates BRIEF.

## Runtime candidates
- shared-agent-memory, multiagents, shared-context-mcp, codex-orchestrator
These are integration candidates, not yet hard dependencies.
