# Skill: Low-Token Multi-Agent Collaboration

Use this skill every turn when working on BuildWise with Grok + ChatGPT + Claude.

## Goal
Coordinate three agents with minimal tokens while Claude has no direct GitHub access.

## Always-on rules
1. **First read only** `.agent-control/BRIEF.md` (or the pasted BRIEF block).
2. **Second read** only the current task contract (or the pasted task block).
3. **Third read** only the latest `.agent-control/memory/PERFORMANCE.md` snapshot + recent events.
4. Do **not** open full BUILDWISE-AGENT-SPECIFICATION, long memory files, or whole app JS unless the task lists them under `files_or_records_allowed`.
5. Output a **Performance Summary** in ≤6 lines at the end of every response.
6. If you need a file Claude cannot fetch: provide a short excerpt (≤80 lines) or diff, not the whole file.

## Roles
| Agent | Can write GitHub? | Primary job |
|-------|-------------------|-------------|
| Grok | Yes | Bridge, commits, control-plane, token infra |
| ChatGPT | Via tools if connected; else propose | Master, plan, route, synthesize |
| Claude | No — propose patches only | Review, refactor plan, QA notes |

## Shared performance memory
Use `.agent-control/AGENT-SKILL-PERFORMANCE-MEMORY.md`.
The ledger is Git-backed and intentionally small.

## Claude workflow (no GitHub)
1. Human/Grok provides BRIEF + latest PERFORMANCE + task + optional short diff.
2. Claude returns decision, patch, risks and a compact Performance event.
3. Human or Grok applies the patch and records the event.
4. BRIEF is refreshed after meaningful work.

## ChatGPT / Grok workflow
1. Read BRIEF + latest PERFORMANCE.
2. Create/update task with preferred_model + max_iterations.
3. Keep STATE.md and BRIEF short; put detail in handoffs/ only when needed.
4. Never re-send full history to Claude — send BRIEF + PERFORMANCE + task + minimal evidence.

## Performance Summary template (mandatory, ≤6 lines)
```
SUMMARY
- role: <this agent>
- did: <1 line>
- files/touch: <paths or none>
- tokens_focus: <what was loaded / avoided>
- blocker: <none or short>
- next: <who> → <action>
```

## Patch format Claude should use
```diff
--- a/path/file
+++ b/path/file
@@
-old
+new
```

Or explicit:
FILE: path/to/file
ACTION: replace|append|create
CONTENT:
...

## Anti-patterns (ban)
- Loading entire index_FINAL.html / buildwise-app.js "just in case"
- Re-pasting full AGENTS + specification every turn
- Multi-page status essays instead of BRIEF + SUMMARY
- Claude asking for whole-repo zip
