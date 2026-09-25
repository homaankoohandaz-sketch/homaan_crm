# BRIEF (read this first — max ~25 lines)

updated: 2026-09-25
project: BuildWise AI+H | repo: homaankoohandaz-sketch/homaan_crm

## Now
status: TASK1 audit DONE | Grok live bridge active
active: await Master confirm for TASK2 hierarchy
next: Project/Complex/Building/Phase/Floor/Unit hierarchy (CRUD + persistence)

## Who does what
- Grok: live GitHub bridge, implementation/review/control-plane writes
- ChatGPT: Master / routing / architecture / synthesis
- Claude: review / integrate / QA via handoff until a live runtime exists

## Shared memory
- code truth: Git commit/branch
- coordination truth: `.agent-control/`
- compact change memory: `.agent-control/memory/PERFORMANCE.md`
- skill: `.agent-control/AGENT-SKILL-PERFORMANCE-MEMORY.md`

## Token rules
1. Read BRIEF + PERFORMANCE recent events + current task only.
2. Prefer preferred_model + max_iterations.
3. Send diffs/summaries, not whole files/history.
4. Stable prompts first; variable context last.

## Blockers
- Codex Tasks auth unavailable
- Telegram webhook secret needs human-gated fix
- Live AI gateway ≠ full specialist layer yet

## Handoff
HEAD | TASK | CHANGED | RESULT | TESTS | DECISION | NEXT
