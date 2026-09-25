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

## Acceptance
- BRIEF current and short.
- Worker reminder exists.
- Claude/Grok canonical prompts exist.
- Active task has preferred_model, max_iterations, cache_keys, files_or_records_allowed.
- One compact Performance event per meaningful worker action.
- No duplicate ownership.
- Control-plane files reachable from buildwise-implementation.

## Token policy
preferred_model: auto
max_iterations: 3
cache_keys: [role, protocol, tools]
context_budget: 1200
summarize_after_tools: true

## Handoff
Grok executes/validates. Claude reviews resulting evidence. ChatGPT reconciles and dispatches next smallest verified task.
