# Agent Control State

status: runtime_bootstrap_blocked_audit_baseline_recorded + token_optimization_docs_landed
project: BuildWise AI+H
control_plane_version: 1.1.0-token-opt
active_task: P0-runtime-bootstrap-and-read-only-audit

## Master
- chatgpt: master orchestrator / architect / synthesis

## Specialist team
- 21 logical specialist roles are specified in BUILDWISE-AGENT-SPECIFICATION-v1.md.
- They are not marked operational until runtime, tools, permissions, tests and a real non-production task pass.

## Recent control-plane updates (2026-09-24)
- CLAUDE.md and AGENTS.md shortened for prompt caching.
- PROTOCOL.md → v0.2 with token & context rules.
- AGENT-TASK-CONTRACT → v1.1 with preferred_model, max_iterations, cache_keys.
- Added PROMPT-CACHING.md and TOKEN-OPTIMIZATION.md under .agent-control/.

## Verified in current execution
- GitHub connection: ADMIN / MAINTAIN / PUSH verified for homaankoohandaz-sketch/homaan_crm.
- Supabase project is ACTIVE_HEALTHY.
- Ten live Edge Functions are present and ACTIVE.
- CRM, matching, market/valuation, project-control, AI-audit and public-request tables are present.
- Netlify has an existing buildwise-ai-h site.

## Runtime blocker
- Codex Tasks authentication is unavailable in the current ChatGPT session.
- No autonomous Codex worker is therefore considered operational.
- Claude/Gemini/n8n remain configured targets, not live workers.

## P0 findings (unchanged summary)
- Live ai-orchestrator is still a limited CRM AI gateway, not the full specialist layer.
- Security advisor findings and Telegram webhook secret need human-gated remediation.
- No GitHub Actions runs recorded yet for buildwise-implementation.

## Human approval gates
- production deployment
- destructive database/schema changes
- secrets/authentication changes
- irreversible Git operations
- billing/cost commitments
- sensitive public social actions
- material legal/financial commitments

## Next objective
Authenticate one real worker, run documentation-only handoff, then read-only repository/application audit. Apply token rules on every new task contract.
