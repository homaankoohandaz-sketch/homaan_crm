# Agent Coordination Protocol v0.2

## Task lifecycle
ready -> claimed -> working -> review -> done
blocked may branch from any active state.

## Claim
An agent must claim a task and its files before editing.

## Lock semantics
Runtime locks are advisory for now and become mandatory once the bridge is installed.
A lock contains: agent, task, path, timestamp, expiry.

## Message
Messages must contain:
- from
- to
- task
- type
- body
- timestamp

Types: request, handoff, review, blocker, decision, status.

## Review
The implementing agent cannot self-approve a production change.
Cross-agent review is preferred.

## Memory
Durable decisions go to Git. Ephemeral coordination stays in the runtime bridge.

## Token & context rules (v0.2)

### Context layers (order matters for caching)
1. **Stable prefix** (must stay byte-identical across calls):
   - Role instructions (CLAUDE.md / AGENTS.md / agent role file)
   - Protocol + approval gates
   - Tool definitions when fixed
2. **Semi-stable**:
   - Short STATE summary only (status, active_task, blockers)
   - Current task contract
3. **Variable (last)**:
   - Allowed files / diffs
   - Latest handoff
   - Tool results / user message

### Hard limits
- Default `max_iterations`: 3 (override only via task contract).
- Do not inject full BUILDWISE-AGENT-SPECIFICATION unless a named section is required.
- After heavy tool output: summarize, then drop the raw payload before the next model call.
- Prefer preferred_model from the task (haiku / mini for light work).

### Caching
- Claude: mark stable blocks with `cache_control: {"type": "ephemeral"}` (use `"ttl": "1h"` for long sessions).
- Keep stable prefix at the front. Any change above a cache breakpoint invalidates everything after it.
- Pre-warm long system prompts with `max_tokens: 0` at session start when useful.

### Handoff discipline
When context grows large or iteration limit is reached, write a handoff and start the next agent with a clean, short context.

See also: `.agent-control/PROMPT-CACHING.md` and `.agent-control/TOKEN-OPTIMIZATION.md`.
