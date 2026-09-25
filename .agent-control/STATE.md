# Agent Control State

status: token_opt + live Grok bridge + low-token multi-agent routing
project: BuildWise AI+H
control_plane_version: 1.2.0-brief
active_task: P0-worker-routing-and-runtime-bootstrap

## Read first
**Always start from `.agent-control/BRIEF.md`** (short shared status for Grok + ChatGPT + Claude).

## Master
- chatgpt: master orchestrator / architect / synthesis

## Collaboration model
- **Grok**: live GitHub read/write bridge, implementation/review/control-plane commits
- **ChatGPT**: Master routing (paste prompts in PROMPTS-FOR-OTHER-AGENTS.md)
- **Claude**: handoff/review target; no live runtime currently
- Skill: `.agent-control/AGENT-SKILL-LOW-TOKEN.md`
- Paste prompts: `.agent-control/PROMPTS-FOR-OTHER-AGENTS.md`

## Recent updates (2026-09-24)
- Token-opt: CLAUDE.md, AGENTS.md, PROTOCOL v0.2, task contract v1.1, PROMPT-CACHING, TOKEN-OPTIMIZATION
- Coord: BRIEF.md, AGENT-SKILL-LOW-TOKEN.md, PROMPTS-FOR-OTHER-AGENTS.md

## Runtime blocker
- Codex Tasks: no registered environment → no autonomous Codex worker
- Claude/Gemini/n8n configured targets, not live workers

## Next objective
Use the live Grok bridge for implementation/review; keep every task contract low-token; activate additional runtimes only after live verification.
Every task must use preferred_model + max_iterations. Claude briefings = BRIEF + task only.
