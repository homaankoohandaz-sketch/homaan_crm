# BUILDWISE BRIEF — execution state

Orientation source: `.agent-control/SUMMARY.md`
Architecture source: `.agent-control/MASTER-ARCHITECTURE.md`

updated: 2026-09-27
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
- Bounded worker runtime adapter is implemented; it refuses execution when an external worker command/credential is absent.
- Worker registry is evidence-based: Grok/Gemini are blocked until live runtime evidence exists; Claude remains handoff-only; Codex remains blocked.
- Production currently serves `main`; current consolidation work is on `buildwise-implementation`. Do not merge these branches blindly.

## Team
- ChatGPT: Master Operator — architecture, decomposition, routing, synthesis, conflict control.
- Workers: use only when runtime + permissions + successful non-production evidence are verified.
- n8n: optional, never a hard dependency.

## Startup order — minimum token
1. Read `.agent-control/NOW.md` first.
2. Read BRIEF.md only for project orientation.
3. Read PERFORMANCE.md snapshot + last 5 events.
4. Read the active task contract.
5. Inspect only minimum allowed files.
6. Never replay full history to recover context.

## Token rule
Use progressive disclosure: NOW → BRIEF → PERFORMANCE → task → minimum code. Stable prompt first, variable context last. Default max_iterations=3.

## Scope rule
Allowed files are a hard boundary. Extra files require SCOPE_ESCALATION.

## Handoff rule
Every worker handoff records MODEL_USED, BASE_SHA, scope, evidence, tests, risks and next action.

## Gates
Human approval required for production, secrets/auth, destructive DB/schema, billing, irreversible Git, material legal/financial actions.

## Latest implementation slice
- Unified task-engine lifecycle is canonical.
- `src/core/task-repository.js` now provides the persistence boundary over the existing generic repository.
- `tests/task-repository.test.js` covers create/respond/star/complete/missing-task/validation.
- Reconstructed local contract test PASS; GitHub workflow/status evidence for the latest commit is still pending.

## Next
1. Obtain branch CI evidence for the latest implementation commit.
2. Review/resolve PR #10 safely; never force-update `main`.
3. Verify resulting Netlify deploy and browser/runtime behavior.
4. Only then continue further task-engine/API work.

## Runtime truth — Supabase
Git is code truth; Supabase is independent runtime truth for live schema/RLS/functions/security advisors. Record live changes back into the ledger. Distinguish REPO / LIVE / DRIFT / VERIFIED.
