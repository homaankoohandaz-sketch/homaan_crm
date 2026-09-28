# BuildWise AI — SUMMARY

Updated: 2026-09-28
Branch: buildwise-implementation

## Single source of orientation
1. Read this file for product orientation.
2. Read `.agent-control/MASTER-ARCHITECTURE.md` for mother architecture and durable decisions.
3. Read only the phase file relevant to the task.
4. Read `.agent-control/NOW.md` for live execution state and exact next action.
5. Read `.agent-control/memory/PERFORMANCE.md` only for the last 5 behavioral events.
6. Read `BUILDWISE-MASTER-CHECKLIST.md` only when acceptance details are required.

## Product identity
BuildWise AI = Real Estate Operating System (REOS), not a simple CRM.

## Canonical product phases
- Phase 01 — CRM Core & Identity
- Phase 02 — Land / Feasibility / Valuation
- Phase 03 — Matching / Deal Intelligence
- Phase 04 — Project & Construction Control
- Phase 05 — Finance / Procurement / Sales
- Phase 06 — Customer / Builder Portals & Showroom
- Phase 07 — AI / Agents / Automation
- Phase 08 — Website / Marketing / Content
- Phase 09 — Release / Security / Operations

## Canonical code direction
- Application entry: `index.html` → current BuildWise UI assets.
- Main browser application logic: `buildwise-app.js` and current CSS/assets it imports.
- Domain logic: `src/`.
- Supabase backend: `supabase/`.
- Tests: `tests/`.
- Agent/control documentation: `.agent-control/`.

## Consolidation rule
- One canonical file per responsibility.
- Do not create v2/v3/FINAL/NEW copies of an existing implementation.
- Extend the canonical file when the responsibility is the same.
- Split only when the module is a genuinely different product phase/domain, requires an independent lifecycle, or the combined file would create unsafe coupling.
- When merging: migrate references → test → verify → remove superseded file.
- Never keep parallel implementations merely as backups.

## Legacy / duplicate rule
Do not develop new features in old duplicate files such as `index_FINAL.html`, `index_legacy.html`, `index3 2.html`, or obsolete root engines unless a task explicitly says migration/repair.

## Existing important areas
- CRM/data import: `src/domains/crm/`
- Construction: `src/domains/construction/`
- Finance/feasibility: `src/domains/finance/`
- Matching: `src/domains/matching/`
- AI/control plane: `.agent-control/`, `src/ai/`, `src/agent-control/`
- Supabase functions/migrations: `supabase/functions/`, `supabase/migrations/`

## Truth boundaries
- GitHub = code truth.
- Supabase = live runtime truth.
- .agent-control = agent/execution truth.
- Master checklist = acceptance truth.
- Runtime evidence beats documentation claims.

## Current execution state
The control plane is present and the worker runtime is bounded. External worker activation still requires verified runtime credentials/evidence. Do not claim a worker is live from documentation alone.

## Release synchronization gate
- Production Netlify site is currently associated with the `main` branch.
- Current implementation is on `buildwise-implementation`.
- GitHub reports these branches as diverged.
- Do not force-update `main`, merge blindly, or treat production as verification of the implementation branch.
- Reviewed PR #10 remains the reconciliation path.
- Production release remains blocked until safe reconciliation, deploy verification and browser/runtime/UI smoke verification.

## Change ledger
- 2026-09-26: Created SUMMARY as compact orientation and MASTER-ARCHITECTURE as the mother architecture reference.
- 2026-09-26: Declared legacy duplicate index files non-development targets and retired the obsolete 100-point checklist.
- 2026-09-27: Added architecture phase map and durable decision ledger; Unified Task Engine became the next cross-domain implementation slice.
- 2026-09-27: Consolidated construction calculations, import v1/v2, procurement, sales, shared engines, graph, AI workspace, normalization, analysis UI and compatibility CSS into canonical locations.
- 2026-09-27: Control-plane memory upgraded to NOW-first progressive disclosure; STATE.md was retired as a separate startup source.
- 2026-09-27: Advisor self-registration contract aligned with DB-trigger architecture; related SECURITY DEFINER RPC exposure was removed and the Supabase advisor finding cleared.
- 2026-09-27: Release synchronization became a blocking production gate after confirming production Netlify serves `main` while `buildwise-implementation` is divergent.
- 2026-09-27: Unified Task Engine core implemented and focused-tested; persistence adapter and additive Supabase migration implemented. Production migration remains unapplied pending release/runtime verification.
- 2026-09-27: GitHub CI repair verified Unit Tests, Application Validation, Phase Code Map, Worker Runtime and GitHub Pages deployment on the implementation branch.
- 2026-09-28: Phase 04 Project & Construction Control started. Added canonical `src/domains/construction/project-model.js` for Project → Complex → Building → Phase → Floor → Unit, with hierarchy validation and deterministic child ordering. Added `tests/unit/project-model.test.mjs` and included it in `npm test`. Focused Node runtime test passed.
- 2026-09-28: Added canonical `src/domains/construction/wbs.js` using the existing BuildWise Workflow engine as the execution boundary. WBS validates parent/dependency integrity and cycles, exposes ready items, and converts task/milestone items to the existing workflow shape. Added `tests/unit/wbs.test.mjs` and wired it into `npm test`. Persistence remains the next bounded task.
- 2026-09-28: CI exposed a pre-existing syntax defect in `buildwise-app.js`: eight escaped template-literal delimiters caused Node syntax validation to fail before application tests ran. Repaired the invalid escaped backticks in the canonical file. Subsequent implementation-branch CI runs completed successfully for the worker runtime and application validation; newer full unit/phase/deploy runs are still being tracked.
- 2026-09-28: Added canonical `src/domains/construction/project-repository.js` to persist Phase 04 hierarchy inside the existing `construction_projects.assumptions.projectHierarchy` JSON field, avoiding a duplicate project table. Added `tests/unit/project-repository.test.mjs` and wired it into `npm test`.
- 2026-09-28: Added canonical `src/domains/construction/schedule.js` to derive deterministic schedule dates from WBS dependencies and identify dependency-chain critical items. Added `tests/unit/schedule.test.mjs` and wired it into `npm test`.
- 2026-09-28: Added `src/domains/construction/schedule-repository.js` to persist schedule/milestone data under existing `construction_projects.assumptions.projectSchedule`, with a focused persistence test wired into `npm test`.
- 2026-09-28: CI exposed a pre-existing Unified Task Engine persistence defect: `task-repository.js` discarded non-numeric canonical IDs, causing lifecycle tests to read null rows. Fixed by preserving provided IDs; full CI re-verification is pending.
- 2026-09-28: Added canonical `src/domains/construction/progress.js` for weighted progress, remaining percentage, completion count and schedule variance KPI. Added progress calculation and persistence tests and wired them into `npm test`.
- 2026-09-28: Added canonical `src/domains/construction/boq.js` for BOQ line totals and category aggregation, with duplicate-line validation and a focused test wired into `npm test`.
- 2026-09-28: Added canonical `src/domains/construction/boq-repository.js` to persist calculated BOQ data under existing `construction_projects.assumptions.projectBoq`, with focused persistence coverage wired into `npm test`.
- 2026-09-28: CI caught a WBS ready-item regression where phase/WBS containers were returned as executable items; fixed `getReadyWbsItems` to return only task/milestone nodes.