# BuildWise AI — SUMMARY

Updated: 2026-09-27
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
- Current consolidation work is on `buildwise-implementation`.
- GitHub reports these branches as **diverged**, not fast-forwardable.
- Therefore: do not force-update `main`, do not merge blindly, and do not treat the current production site as verification of the implementation branch.
- Required path: reviewed PR #10 from `buildwise-implementation` → `main` → resolve merge conflicts safely → CI/merge verification → Netlify production deploy verification → browser/runtime/UI smoke test.
- PR #10 is open; GitHub currently reports `mergeable=false`. Do not merge or force-update `main` until that is resolved.
- Unified Task Engine is paused until this release synchronization gate is resolved.

## Change ledger
- 2026-09-26: Created SUMMARY as the compact orientation note and MASTER-ARCHITECTURE as the mother architecture reference.
- 2026-09-26: Declared legacy duplicate index files non-development targets and removed them from the active branch.
- 2026-09-26: Retired the obsolete 100-point checklist as an execution reference.
- 2026-09-27: Added architecture phase map and durable decision ledger; next implementation slice is Unified Task Engine.
- 2026-09-27: Structural audit found 205 files / 42 directories; 0 exact-content duplicate groups, but several duplicate/overlapping implementations requiring canonicalization.
- 2026-09-27: Consolidated construction calculations, import v1/v2, procurement, sales, shared business engines, graph, AI workspace, normalization, analysis UI and compatibility CSS into canonical locations; superseded files removed after reference/syntax checks. Latest runtime workflow verification was unavailable.
- 2026-09-27: Control-plane memory upgraded to NOW-first progressive disclosure; old history remains cold archive.
- 2026-09-27: Advisor self-registration contract was aligned with the DB-trigger architecture; the live SECURITY DEFINER trigger function was explicitly revoked from anon/authenticated RPC execution and Supabase security advisor confirmed that finding cleared.
- 2026-09-27: Execution state was consolidated into NOW.md; STATE.md is no longer a separate startup source.
- 2026-09-27: Release synchronization became a blocking gate after confirming Netlify production serves `main` while the consolidated implementation is on divergent `buildwise-implementation`. Blind merge/force-update is prohibited; reviewed PR is the canonical reconciliation path.
- 2026-09-27: Started Unified Task Engine implementation in canonical `src/core/task-engine.js`. Added focused contract test `tests/task-engine.test.js` and included it in the repository test script. Core lifecycle now covers create, Yes/No response, completion, move-to-tomorrow, overdue detection, context/subject/priority validation. Focused Node test passed; full repository suite remains pending because this environment cannot clone/fetch the repository runtime locally.
- 2026-09-27: Extended Unified Task Engine core with Starred/Promotion, priority mutation, and notification/reminder configuration; added TASK-011 completion record and focused runtime verification (`task engine focused contract: PASS`). Full repository suite remains unclaimed because this environment cannot mount the repository runtime.
- 2026-09-27: Expanded `npm test` to include all four existing ESM unit suites: construction calculations, feasibility engine, repository and scenario engine. GitHub accepted the change; CI evidence is pending the next branch workflow run.
- 2026-09-27: GitHub Actions CI was repaired against the canonical `src/` tree. Stale root-path tests, malformed literal-\\n JS fixtures, obsolete checklist assertions, and stale construction/repository/customer-flow expectations were corrected. GitHub verified Unit Tests, Application Validation, Phase Code Map, Worker Runtime, and GitHub Pages deployment successfully on `bd06d4c`. External worker execution remains intentionally blocked without XAI/Anthropic secrets.
