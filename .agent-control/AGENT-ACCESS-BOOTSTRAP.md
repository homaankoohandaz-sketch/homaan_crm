# Agent Access Bootstrap — 2026-09-26

## Objective
Move BuildWise from documented multi-agent architecture to evidence-backed execution while reducing ChatGPT context consumption.

## Sequence
1. Use the bounded context pack for worker handoffs.
2. Prefer existing connected execution surfaces.
3. Register a real Codex environment before durable Codex dispatch.
4. Accept Grok/Claude/Gemini as live only after independently verifiable runtime evidence.
5. Keep n8n optional.
6. Record runtime changes in .agent-control/memory/PERFORMANCE.md.

## Human gates
Production, secrets/auth, destructive migrations, billing and irreversible Git remain approval-gated.

## Success condition
No worker is marked live from configuration alone.
