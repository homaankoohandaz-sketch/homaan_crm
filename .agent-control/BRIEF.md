# BRIEF (read this first — max ~25 lines)

updated: 2026-09-25
project: BuildWise AI+H | repo: homaankoohandaz-sketch/homaan_crm

## Now
status: TASK2 hierarchy code READY | migration pending apply
active: apply 20260925_project_hierarchy.sql in Supabase then verify insert
next: after migration apply → runtime CRUD verify → Task3 WBS/Gantt

## Who does what
- Grok: live GitHub bridge, implementation/review/control-plane writes
- ChatGPT: Master / routing / architecture / synthesis
- Claude: review / integrate / QA via handoff until a live runtime exists

## Shared memory
- code truth: Git commit/branch
- coordination truth: `.agent-control/`
- compact change memory: `.agent-control/memory/PERFORMANCE.md`

## Token rules
1. Read BRIEF + PERFORMANCE recent events + current task only.
2. Prefer preferred_model + max_iterations.
3. Send diffs/summaries, not whole files/history.

## Blockers
- Hierarchy migration not yet applied to live Supabase (human SQL Editor)
- Codex Tasks auth unavailable

## Handoff
HEAD | TASK | CHANGED | RESULT | TESTS | DECISION | NEXT
