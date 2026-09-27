# BuildWise AI — SUMMARY

Updated: 2026-09-27
Branch: buildwise-implementation

## Single source of orientation
1. Read this file first.
2. Read `.agent-control/MASTER-ARCHITECTURE.md` for the mother architecture and decisions.
3. Read only the phase file relevant to the task.
4. Read `.agent-control/STATE.md` only for live execution state.
5. Read `BUILDWISE-MASTER-CHECKLIST.md` only when acceptance details are required.

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
- Main browser application logic: `buildwise-app.js` and the current CSS/assets it imports.
- Domain logic is being consolidated under `src/`.
- Supabase backend: `supabase/`.
- Tests: `tests/`.
- Agent/control documentation: `.agent-control/`.

## Legacy / duplicate rule
Do not develop new features in old duplicate files such as `index_FINAL.html`, `index_legacy.html`, `index3 2.html`, or obsolete root engines unless a task explicitly says migration/repair.

## Existing important areas
- CRM/data import: root import UI + `src/domains/crm/`
- Construction: `src/domains/construction/` plus current construction UI/engines
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

## Change ledger
- 2026-09-26: Created SUMMARY as the compact orientation note.
- 2026-09-26: Created MASTER-ARCHITECTURE as the single mother architecture/decision reference.
- 2026-09-26: Declared legacy duplicate index files non-development targets and removed `index_FINAL.html`, `index_legacy.html`, `index3 2.html` from the active branch.
- 2026-09-26: Retired the obsolete 100-point checklist as an execution reference.
- 2026-09-26: Root README now points every worker to the canonical orientation path.
- Rule from now on: every structural/code change must append one short entry here: date + change + files + verification + next dependency.
- 2026-09-27: Added current architecture phase map and durable decision ledger; consolidated Task/Follow-up/Calendar/Notification decisions; created inspectable branch `architecture/current-phase`; next implementation slice is Unified Task Engine.
- 2026-09-27: Completed structural repository audit: 205 files / 42 directories; zero exact-content duplicate groups; confirmed construction calculation duplication, import v1/v2 overlap, root-level transitional engines, multiple operational page entry points, and missing canonical domain folders for Real Estate/Procurement/Sales. Audit: `.agent-control/AUDIT-STRUCTURE-2026-09-27.md`. Next dependency: canonicalize/migrate before Unified Task Engine.
- 2026-09-27: Consolidated construction calculation authority into `src/domains/construction/calculations.js`; `construction-engine.js` is now UI/persistence adapter only; syntax and tree re-audit passed; full CI run was not available for the latest commit.
- 2026-09-27: Consolidated import v1/v2 into canonical `data-import.js`, preserving remote sources, market import, resilient batching and raw-row archival; deleted `data-import-v2.js`; syntax/reference/tree audit passed. Next dependency: migrate remaining root engines by verified domain ownership.

- 2026-09-27: Final consolidation pass: merged shared accounting/KPI/contract/decision/workflow engines into `src/core/business-engines.js`; merged graph engine/store/sync into `src/domains/intelligence/graph.js`; merged advisor/deal/contextual AI UI into `src/ui/ai-workspace.js`; moved normalization, analysis UI and data import into canonical `src/` locations; absorbed compatibility CSS into `buildwise-app.js`; removed superseded root files and updated `index.html`. No archive/backup copies were created. Runtime workflow checks were not available for this commit.
