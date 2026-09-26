# BUILDWISE BRIEF — read first

updated: 2026-09-26
project: BuildWise AI | branch: buildwise-implementation
code_truth: GitHub
coordination_truth: .agent-control
control_hub: homaankoohandaz-sketch/ai-agent-coworking

## Current state
- BuildWise is beyond initial architecture; master checklist v2 has 675 requirements.
- Supabase beuestoewletjsgmigmf is ACTIVE_HEALTHY; 10 Edge Functions exist.
- Netlify buildwise-ai-h exists but is not a product dependency.
- Low-token context firewall is implemented and GitHub Actions unit test passed on 2026-09-26.
- No durable Codex environment is registered in this ChatGPT session.
- Grok/Claude/Gemini runtime execution is not independently verified here.
- Replit connector is available, but no BuildWise Replit app is registered.

## Team
- ChatGPT: Master Operator — architecture, decomposition, routing, synthesis, conflict control.
- Workers: use only when runtime + permissions + successful non-production evidence are verified.
- n8n: optional, never a hard dependency.

## Startup order
1. Resolve repo + target branch.
2. Read BRIEF → latest PERFORMANCE → active task → minimum allowed files.
3. For worker handoff, use `node tools/build-context-pack.mjs <task-file>`.
4. Claim exact scope before modification.

## Token rule
Never replay full history. Use compact state + task + diff. Default max_iterations=3. Stable prompt first, variable context last.

## Scope rule
Allowed files are a hard boundary. Extra files require SCOPE_ESCALATION.

## Handoff rule
Every worker handoff records MODEL_USED, BASE_SHA, scope, evidence, tests, risks and next action.

## Gates
Human approval required for production, secrets/auth, destructive DB/schema, billing, irreversible Git, material legal/financial actions.

## Next
Activate a real worker runtime with independently verifiable non-production execution; until then, keep the control plane truthful and use connected tools directly.

## Runtime truth — Supabase
Git is code truth; Supabase is independent runtime truth for live schema/RLS/functions/security advisors. Record live changes back into the ledger. Distinguish REPO / LIVE / DRIFT / VERIFIED.
