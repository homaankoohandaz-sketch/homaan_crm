# BRIEF (read this first — max ~25 lines)

updated: 2026-09-24
project: BuildWise AI+H | repo: homaankoohandaz-sketch/homaan_crm

## Now
status: token_opt_docs_done | runtime still blocked (Codex auth)
active: P0-runtime-bootstrap-and-read-only-audit
next: authenticate 1 real worker → doc-only handoff → read-only audit

## Who does what
- Grok: GitHub bridge, token-opt, control-plane writes
- ChatGPT: Master / routing / synthesis
- Claude: review / integrate / QA (no direct GitHub — paste BRIEF+task only)

## Token rules (all agents)
1. Read BRIEF + current task only. Do not load full specification unless asked.
2. Prefer preferred_model + max_iterations from task contract.
3. After tools: summarize, drop raw dumps.
4. Claude: use prompt caching on stable role text; Human/Grok applies Git diffs.

## Blockers
- Codex Tasks auth unavailable
- Telegram webhook secret needs human-gated fix
- Live AI gateway ≠ full specialist layer yet

## Last changes (token-opt)
CLAUDE.md, AGENTS.md shortened | PROTOCOL v0.2 | task contract v1.1 | PROMPT-CACHING.md | TOKEN-OPTIMIZATION.md

## How to hand off (3 lines)
status | what changed | next_action + who
