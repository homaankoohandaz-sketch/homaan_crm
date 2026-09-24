# Token Optimization Playbook — BuildWise AI+H

Last updated: 2026-09-24

## Why tokens burn so fast here
- Many specialist roles + frequent handoffs
- Agents re-reading large control-plane docs
- Tool loops ("check and return") without summarization
- Expensive models used for light work

## Four levers (use all of them)

### 1. Prompt caching
See `PROMPT-CACHING.md`.
- Claude: explicit `cache_control` on stable blocks, prefer `ttl: "1h"` for coding sessions.
- Keep CLAUDE.md + AGENTS.md + protocol rules byte-stable.
- Pre-warm at session start when useful.

### 2. Layered context
Never send the whole control plane.

| Layer | Content | Cache? |
|-------|---------|--------|
| Stable | Role file, AGENTS, PROTOCOL rules, fixed tools | Yes |
| Semi-stable | Short STATE, current task contract | Sometimes |
| Variable | Diffs, tool results, user message | No — put last |

### 3. Model routing
| Work type | Preferred model |
|-----------|-----------------|
| Classify / status / extract / short QA | Haiku or GPT-4o-mini |
| Implementation | Codex / Sonnet |
| Deep review / integration | Claude Sonnet |
| Master routing & synthesis | ChatGPT (can downshift for trivial routes) |

Task contracts now carry `preferred_model` and `max_iterations`.

### 4. Iteration & handoff discipline
- Default max_iterations = 3
- After heavy tools → summarize, drop raw payload
- When limit hit → status `ITERATION_EXHAUSTED`, write handoff, stop
- Master should receive specialist **summaries**, not raw dumps

## Files changed for this optimization
- `CLAUDE.md` — shortened, cache-oriented
- `AGENTS.md` — tightened + token discipline section
- `.agent-control/PROTOCOL.md` — v0.2 token & context rules
- `.agent-control/AGENT-TASK-CONTRACT-v1.md` — v1.1 token fields
- `.agent-control/PROMPT-CACHING.md` — this guide’s companion
- `.agent-control/TOKEN-OPTIMIZATION.md` — this file

## Operational checklist for Master
When creating a task:
1. Set `preferred_model` and `max_iterations`
2. List only `files_or_records_allowed` that are truly needed
3. Put stable docs in `cache_keys`
4. Require `summarize_after_tools: true` for tool-heavy work

When a specialist returns:
- Prefer short handoff format (see task contract)
- Do not re-inject full previous context into the next agent

## Expected impact
Combined caching + layering + routing + iteration limits:
- Routine agent turns: ~60–80% lower cost
- Long coding/review loops: ~40–60%
- Multi-hour multi-agent sessions: often 70%+

## Next improvements (optional)
- LiteLLM or OpenRouter gateway for automatic routing + budgets
- Helicone/Langfuse for per-agent cost visibility
- Automatic STATE summarizer that keeps STATE.md under ~300 tokens
