# BRIEF (read this first — max ~25 lines)

updated: 2026-09-24
project: BuildWise AI+H | repo: homaankoohandaz-sketch/homaan_crm

## Now
status: token_opt + performance_memory_ready | runtime still blocked (Codex auth)
active: P0-runtime-bootstrap-and-read-only-audit
next: authenticate 1 real worker → doc-only handoff → read-only audit

## Who does what
- Grok: GitHub bridge, control-plane writes, shared performance ledger
- ChatGPT: Master / routing / architecture / synthesis
- Claude: review / integrate / QA; receives BRIEF+PERFORMANCE+task

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
