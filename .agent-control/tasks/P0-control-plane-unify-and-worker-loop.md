# P0 — Unify Control Plane + Worker Loop

status: ready
requester: chatgpt
primary: grok
reviewer: claude
project: BuildWise AI
base_sha: 7cbc2acc93dc73444c64d474792205687a0ddb22

## Objective
Make .agent-control the operational shared state for BuildWise. No worker requires chat-history replay.

## Scope
Verify BRIEF, STATE, PERFORMANCE memory, worker reminder, prompts and task contract. Verify current Git/Supabase/Netlify state read-only. Make only required control-plane edits. No production/secrets/destructive schema/branch merge.

## Allowed files
- .agent-control/BRIEF.md
- .agent-control/STATE.md
- .agent-control/memory/PERFORMANCE.md
- .agent-control/WORKER-REMINDER-v1.md
- .agent-control/AGENT-TASK-CONTRACT-v1.md
- .agent-control/prompts/CLAUDE-REVIEWER-v2.md
- .agent-control/prompts/GROK-BRIDGE-v2.md
- .agent-control/tasks/P0-control-plane-unify-and-worker-loop.md

## Escalation files
Any file outside Allowed files required to complete the task. Do not modify it until Master expands scope.

## Acceptance
- BRIEF current and short.
- Worker reminder exists and contains bootstrap + scope-escalation rules.
- Claude/Grok canonical prompts exist.
- Active task has preferred_model, max_iterations, cache_keys, files_or_records_allowed.
- Handoff requires model_used and base_sha.
- One compact Performance event per meaningful worker action.
- No duplicate ownership.
- Control-plane files reachable from buildwise-implementation.

## Token policy
preferred_model: auto
max_iterations: 3
cache_keys: [role, protocol, tools]
context_budget: 1200
summarize_after_tools: true

## Worker accountability
model_used: required
base_sha: required
claim_scope: required
escalation_files: required

## Handoff
Grok executes/validates. Claude reviews resulting evidence. ChatGPT reconciles and dispatches next smallest verified task.
