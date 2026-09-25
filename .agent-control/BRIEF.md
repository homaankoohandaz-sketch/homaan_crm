# BUILDWISE BRIEF — read first

updated: 2026-09-25
project: BuildWise AI | branch: buildwise-implementation
code_truth: GitHub
coordination_truth: .agent-control
control_hub: homaankoohandaz-sketch/ai-agent-coworking

## Current state
- BuildWise is beyond initial architecture: CRM/data, graph, valuation, construction-cost and several project-control primitives exist.
- Master checklist v2 has 675 requirements; current source marks many as PARTIAL/TODO. DONE requires runtime/UI/security verification.
- Supabase project beuestoewletjsgmigmf is ACTIVE_HEALTHY; 10 Edge Functions exist.
- Netlify site buildwise-ai-h exists.
- Autonomous Codex runtime is not verified operational in this ChatGPT session.
- GitHub contains recent control-plane commits and Grok-bridge documentation; runtime execution by Grok is not independently verifiable from ChatGPT.

## Team
- ChatGPT: Master Operator — architecture, decomposition, routing, synthesis, conflict control.
- Grok: GitHub execution bridge when live; implementation/control-plane worker.
- Claude: independent review/integration/QA; implement only through a claimed task if write access is verified.
- Other workers/tools: use when they reduce cost/time or improve verification.

## Startup order
BRIEF → latest PERFORMANCE → active task → minimum allowed files.

## Token rule
Never replay full history. Use compact state + task + diff. Default max_iterations=3. Stable prompt first, variable context last.

## Gates
Human approval required for production, secrets/auth, destructive DB/schema, billing, irreversible Git, material legal/financial actions.

## Next
P0-control-plane-unify-and-worker-loop → verify shared state, then dispatch the smallest non-production implementation task.
