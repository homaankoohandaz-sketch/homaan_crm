# BuildWise AI

> Canonical workspace and operating rules: `BUILDWISE-SINGLE-SOURCE-OF-TRUTH.md`
> **Only coding/review branch: `main`.** The long-lived `buildwise-implementation` branch is retired; do not target it or use it as a source of truth.
 > **Current canonical app link (auto-deployed from `main`):** https://homaankoohandaz-sketch.github.io/homaan_crm/
> Netlify primary URL `https://buildwis-ai.netlify.app/` is currently behind `main` (last verified Netlify deploy SHA `4c3432e`); do not use it for latest-code review until its deploy SHA matches `main`.

## Start here
1. `BUILDWISE-SINGLE-SOURCE-OF-TRUTH.md` — the only authority for branch/workspace policy.
2. `.agent-control/SUMMARY.md` — project map and change ledger.
3. `.agent-control/STATE.md` — current execution/runtime state.
4. `.agent-control/MASTER-ARCHITECTURE.md` — architecture and decisions.
5. `.agent-control/MASTER-CHECKLIST-v3-850.md` — canonical acceptance checklist; older task counts/checklists are historical, not separate queues.
6. `tests/` — automated verification.

BuildWise AI is a Real Estate Operating System (REOS), not a simple CRM.

## Canonical implementation areas
- UI entry: `index.html`
- Current app: `buildwise-app.js`
- Shared/core: `src/core/`
- Domains: `src/domains/`
- AI: `src/ai/`
- Agent runtime: `src/agent-control/`
- Backend: `supabase/`
- Tests: `tests/`
- Coordination: `.agent-control/`

## Required delivery path
All work lands on `main`. Before a change is considered complete, inspect the diff, run the focused tests and full test suite, verify the deployed preview/runtime, and record the commit SHA plus evidence in the existing state/summary. Do not create a parallel checklist, queue, summary, or long-lived implementation branch. A merged commit or successful deploy alone does not prove that its UI/data features work.
