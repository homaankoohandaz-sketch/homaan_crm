# BuildWise Agent Control State

status: control_plane_reconciled
updated: 2026-09-25
project: BuildWise AI
branch: buildwise-implementation
control_plane_version: 2.0.0

## Truth
- Code: GitHub repository + current task branch.
- Coordination: .agent-control/.
- Product acceptance: Master checklist v2.
- Independent manager/control hub: homaankoohandaz-sketch/ai-agent-coworking.

## Team
- ChatGPT: Master Operator / architecture / routing / synthesis.
- Grok: GitHub execution bridge / implementation when runtime is live.
- Claude: independent review / integration / QA; implementation only if live write access is verified.
- Other workers: selected by capability, cost, availability and verification quality.

## Verified infrastructure
- GitHub repository access: admin/maintain/push.
- Supabase: beuestoewletjsgmigmf, ACTIVE_HEALTHY, 10 Edge Functions.
- Netlify: buildwise-ai-h site exists.
- Codex autonomous runtime: not verified in this ChatGPT session.
- n8n: optional; never a hard dependency.

## Important branch fact
buildwise-implementation and main are divergent. Do not blind-merge. Transplant or reconcile control-plane changes deliberately.

## Active task
P0-control-plane-unify-and-worker-loop

## Startup
BRIEF → latest PERFORMANCE → active task → minimum allowed files.

## Gates
Human approval: production, secrets/auth, destructive DB/schema, billing, irreversible Git, material legal/financial actions.

## Done
Implementation + tests + runtime/evidence verification + state update.
