# BuildWise Agent Access Matrix

updated: 2026-09-26
purpose: factual runtime status + bounded context.

## Connected
- ChatGPT: Master architecture/routing/synthesis.
- GitHub connector: repository read/write, PR and CI operations.
- Supabase connector: live database/runtime verification.
- Replit connector: available for separate Replit apps; no BuildWise app is registered.

## Not live-verified
- Grok: external worker; require independently verifiable execution evidence.
- Claude: no live worker execution evidence in this session.
- Codex durable tasks: no registered Codex environment.
- Gemini: no live runtime evidence.
- n8n: optional and not verified.

## Token firewall
Every worker starts with BRIEF -> latest PERFORMANCE -> exact task -> minimum allowed files.
Use `node tools/build-context-pack.mjs <task-file>` for bounded handoffs.
Never send full repository/history/specification unless the active task explicitly requires it.

## Operational definition
A worker is OPERATIONAL only after runtime + permissions + successful non-production task + independently verifiable evidence.

Credentials are never committed or pasted into chat.
