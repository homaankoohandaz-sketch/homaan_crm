# BuildWise AI — SUMMARY

Updated: 2026-09-30
Branch: buildwise-implementation

## Canonical governance
- Repository law: Conversation → Decision → Repository record → Implementation → Test → Runtime verification → State update.
- Canonical agent behavioral reference: `.agent-control/AGENT_EXECUTION_PROTOCOL.md`.
- All agents follow Source → Decision → Task → Reconcile → Implement → Test → Runtime Verify → Evidence → State → Done.
- Canonical architecture/decision documents are updated before creating another file for the same responsibility.
- Missing GitHub evidence means a decision is unrecorded.
- No duplicate specifications for an existing responsibility.

## Active task baseline
- Canonical active registry: `.agent-control/MASTER-CHECKLIST-v3-850.md`.
- This is the sole active acceptance/source-of-truth register.
- Task sequencing and acceptance mapping must reference this file only.

## Existing implementation baseline
- Tasks 001–020: existing implementation/audit baseline; do not rebuild.
- Tasks 011–012: implementation + focused test evidence.
- Task 010: implementation preserved/audited.
- Tasks 013–020: primarily audit/release-gate work.
- 2026-09-30: decision-layer routing, production permission gating, evidence decisioning, feedback append, and canonical decision-loop progression hardened; isolated runtime test passed. Full repository runtime remains unavailable from the current environment.

## Architecture baseline
- Mother architecture: .agent-control/MASTER-ARCHITECTURE.md
- Execution protocol: .agent-control/AGENT_EXECUTION_PROTOCOL.md
- Current architecture phase: .agent-control/PHASE-CURRENT-ARCHITECTURE.md
- Decision ledger: .agent-control/DECISIONS.md
- Execution state: .agent-control/STATE.md

## Phase 04
Relational canonical path for hierarchy, schedule, BOQ, procurement, progress.
Integration test covers hierarchy→schedule→progress→boq→procurement.

## Release gate
main diverged — never force-update main. Preview buildwise-implementation for UI E2E.


## 2026-09-30 — Procurement 141-160
- Implemented procurement-control schema and Project Control UI slice for checklist 141-160.
- Added approval, purchase order, delivery/partial delivery, inventory, consumption, material price history, forecast and risk structures.
- Added project_procurement_control view for delivery %, outstanding quantity, live price variance and calculated risk level.
- Supabase migration applied: 20260930145935_project_control_procurement_141_160.
- Integration SQL test passed transactionally; test data was rolled back.
- External live material-price feed is NOT claimed; price source/timestamp/history are implemented and current price can be recorded from a source.
- Browser/runtime verification on buildwise-implementation is still pending, so 141-160 remain PARTIAL.


## 2026-09-30 — AI Project Control 161-180
- Added deterministic/read-only AI project-control engine and UI for schedule, delay, dependencies, CPM, procurement prediction, material shortage, cost overrun, recovery suggestions, parallel-work candidates, team/resource/workfront/physical/equipment/material conflicts and crew availability.
- Added focused tests and wired them into npm test.
- AI writes alerts to existing project_ai_alerts; it does not mutate the master schedule.
- Runtime/browser verification remains pending; 161-180 are PARTIAL.


## 2026-09-30 — 181-200
- Added AI workspace conflict, zoning, floor parallelism, trade sequencing, what-if simulation, schedule optimization and cost/time trade-off analysis.
- Added human approval gate for critical AI changes and preserved read-only master-schedule safety.
- Added project accounting core: ledger, budget versions/lines, revised budget, actual, committed, forecast, remaining and total project cost summary.
- Added accounting + AI approval migrations and transactional schema verification.
- Browser/runtime verification remains pending; 181-200 are PARTIAL.


## 2026-09-30 — Project Accounting 201-220
- Implemented canonical cost allocation views for WBS, phase, floor, unit, contractor, supplier, material, purchase, invoice, payment and date.
- Added historical USD/gold rate lineage, Toman normalization, current equivalents and construction-cost inflation tracking.
- Added budget/actual, committed/actual and forecast/budget variance reporting.
- Applied Supabase migration 20260930151310_project_accounting_201_220 and verified currency/inflation SQL with temporary fixtures; fixtures removed.
- Added Project Control accounting UI slice and wired it to the canonical page.
- 201-220 remain PARTIAL until browser/runtime UI verification; no DONE claim.
- Next: 221.


## 2026-09-30 — Project Accounting 221-235
- Added Forecast at Completion, cash flow, receivables, payables, contractor/supplier payments, advances, retention, installments and payment calendar.
- Added payment approval records plus invoice/receipt document metadata/archive and accounting audit view.
- Applied and SQL-tested migration project_accounting_221_235; temporary fixtures removed.
- Added and wired Project Control UI slice project-accounting-221-235.js.
- 221-235 remain PARTIAL pending browser/runtime verification.
- Next task: 236.

## 2026-09-30 — Real Estate Cost / Price Engine 236-264
- Retained the existing Construction Cost Engine for task 236; no duplicate responsibility created.
- Added material current-price and daily-price aggregation, with explicit source/timestamp lineage and no unsupported external live-feed claim.
- Added construction current/base cost and inflation factor using the existing project cost-index data.
- Added CRM land valuation, market comparable inputs, and combined land valuation; existing CRM records with Divar source can participate where present.
- Added total project cost, gross/useful-area calculations with 80% default, useful-m² costs, unit allocation, unit profitability, developer margin, investor/owner return allocation, and five-point sale-price sensitivity scenarios.
- Applied Supabase migration real_estate_cost_price_236_264.
- SQL transactional verification passed with expected fixture arithmetic; all fixtures rolled back.
- Added project-cost-236-264.js and wired Project Control to the new views.
- Browser/runtime UI verification remains pending; 237-264 are PARTIAL, not DONE.
- Next task: 265.

## 2026-09-30 — Sales Engine / Offer Builder 265-293
- Added sales strategy and unit pricing model on top of existing Project/Unit/Cost Intelligence structures.
- Added premium components: floor, view, orientation, commercial; fixed values: parking, storage, terrace, garden; payment-term pricing for cash/installment.
- Added inventory statuses available/reserved/sold, sale/pre-sale/participation offer types, customer offers, negotiation records, versioning and approvals.
- Added unit sales matrix, inventory, current offer version and profitability views.
- Added project-sales-265-293.js and wired Project Control; browser print is the current proposal/PDF-screen mechanism.
- Migration sales_engine_265_293 applied successfully.
- Smoke verification passed for database objects/views. Existing project has zero units, so populated unit arithmetic could not be executed against real project data.
- Browser/runtime UI verification remains pending; 265-293 are PARTIAL.
- Next task: 294.

## 2026-09-30 — Documents / Plan Intelligence / KPI 294-323
- Extended existing project_documents rather than creating a parallel document subsystem.
- Added upload/document metadata fields, OCR status/text, extracted plan JSON, document register and plan-data aggregation.
- Added KPI snapshots and project KPI dashboard covering schedule, cost, procurement and sales.
- Added project-docs-kpi-294-323.js and wired it into Project Control.
- Final migration project_documents_kpi_294_323_v4 applied successfully.
- SQL rollback fixture verified plan extraction: gross 1200, useful 950, 8 units, 10 parking, 8 storage, 5 floors, land 400 and setbacks JSON.
- Actual binary upload/storage, OCR/AI extraction, plan-vs-permit comparison and browser runtime remain unverified; 294-323 are PARTIAL.
- Next task: 324.


## 2026-09-30 — KPI Engine / Control Center 324-342
- Extended the canonical KPI path instead of creating a parallel subsystem.
- Added live KPI catalog for quality, HSE documentation, sales, cash flow, contractor, supplier, productivity, progress, delay, cost overrun, procurement delay, unit sales, ROI and profit margin.
- Added custom KPI definitions, thresholds, alerts, trend data, drill-down and snapshot refresh.
- Added project-kpi-324-342.js and wired it into Project Control.
- Applied migration project_kpi_324_342 and transactionally tested catalog, alerts, snapshot, trends and drill-down; fixtures rolled back.
- Browser/runtime UI verification remains pending; 324-342 are PARTIAL.
- Next task: 343.
