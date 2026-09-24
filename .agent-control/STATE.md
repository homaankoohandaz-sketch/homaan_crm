# Agent Control State

status: token_opt + low-token multi-agent bridge ready
project: BuildWise AI+H
control_plane_version: 1.2.0-brief
active_task: P0-runtime-bootstrap-and-read-only-audit

## Read first
**Always start from `.agent-control/BRIEF.md`** (short shared status for Grok + ChatGPT + Claude).

## Master
- chatgpt: master orchestrator / architect / synthesis

## Collaboration model
- **Grok**: GitHub read/write bridge, control-plane commits
- **ChatGPT**: Master routing (paste prompts in PROMPTS-FOR-OTHER-AGENTS.md)
- **Claude**: no GitHub — receives BRIEF+task paste; proposes diffs only
- Skill: `.agent-control/AGENT-SKILL-LOW-TOKEN.md`
- Paste prompts: `.agent-control/PROMPTS-FOR-OTHER-AGENTS.md`

## Recent updates (2026-09-24)
- Token-opt: CLAUDE.md, AGENTS.md, PROTOCOL v0.2, task contract v1.1, PROMPT-CACHING, TOKEN-OPTIMIZATION
- Coord: BRIEF.md, AGENT-SKILL-LOW-TOKEN.md, PROMPTS-FOR-OTHER-AGENTS.md

## Runtime blocker
- Codex Tasks auth unavailable → no autonomous Codex worker yet
- Claude/Gemini/n8n configured targets, not live workers

## Next objective
Authenticate one real worker → documentation-only handoff → read-only audit.
Every task must use preferred_model + max_iterations. Claude briefings = BRIEF + task only.
