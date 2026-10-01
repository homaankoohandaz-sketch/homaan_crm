# Agent Control State

status: BATCH493-500 IMPLEMENTED | PROJECT VIEWS RECONCILED | RUNTIME PENDING | FULL REPO RUNTIME BLOCKED
project: BuildWise AI
branch: buildwise-implementation
active_task: checklist-501-524
last_batch: 493-500
## Batch 493-500 — Project Presentation Views
- Added canonical `src/ui/project-views-493-500.js`; no duplicate project-control engine created.
- 493 Gantt UI: normalized existing project_schedule_tasks data.
- 494 KPI Dashboard UI: reused canonical project_kpi_catalog.
- 495 Procurement Calendar UI: reused canonical project_procurement.
- 496 Financial Dashboard UI: reused existing buildwise_project_dashboard cost aggregation.
- 497 Unit Sales Matrix UI: reused canonical project_floors/project_units hierarchy.
- 498 Drag & Drop Workflow UI: added deterministic reorder behavior; persistence is intentionally not claimed until canonical workflow storage/runtime is verified.
- 499 Timeline UI: reused project_ai_alerts as the current project event stream.
- 500 Professional Animation System: shared timing/easing tokens installed through the existing suite loader.
- Focused unit test added: tests/unit/project-views-493-500.test.mjs and wired into npm test.
- Checklist 493-500 marked PARTIAL: implementation/test evidence exists, browser/runtime verification is still pending.
- Current cursor: 501.

last_batch: 431-444

## Current truth
- Code truth: GitHub branch buildwise-implementation.
- Coordination truth: .agent-control/.
- MASTER-CHECKLIST-v3-850.md is the sole task acceptance register.
- MASTER-ARCHITECTURE.md remains authoritative and unchanged.
- No force-update of main.

## Batch 31-50
- 031 People: canonical crm_people repository retained and extended with typed search.
- 032 Owners: represented through crm_people.person_type=owner; no duplicate owner repository created.
- 033 Buyers: represented through crm_people.person_type=buyer; no duplicate buyer repository created.
- 034 Investors: represented through crm_people.person_type=investor; no duplicate investor repository created.
- 035 Builders: represented through crm_people.person_type=builder; no duplicate builder repository created.
- 036 Suppliers: no dedicated supplier entity/type exists in current live schema; remains PARTIAL.
- 037 Contractors: no dedicated contractor entity/type exists in current live schema; remains PARTIAL.
- 038 Properties: existing canonical properties table/repository path retained; 1,750 live rows observed.
- 039 Lands: existing land/feasibility path retained; no duplicate domain created.
- 040 Leads: existing leads repository retained; live table has 5 rows.
- 041 Public Requests: existing public_requests table/path retained.
- 042 Deals: existing deals table/path retained; live table has 1 row.
- 043 Contacts/Phones: crm_person_private + crm_identity_events retained; phone hash is generated in live schema.
- 044 Search: canonical local search/query helper added.
- 045 Advanced Filters: canonical local filter operators added; repository boundary extended with ilike/neq/is.
- 046 Excel Import: existing canonical import path retained.
- 047 Google Sheets Import: existing canonical import path retained.
- 048 Multi-Sheet Import: existing importer reads all workbook sheets.
- 049 Preserve Every Excel Column: raw source object preservation retained.
- 050 Preserve Every Excel Row: source row metadata preservation retained.

## Additional reconciliation
- Import duplicate detection was corrected to be non-destructive and candidate-only.
- Duplicate detection no longer treats surname/phone as merge authority; property-code candidates are explicitly reported.
- Persian phone-column aliases are now recognized after normalization.
- Added tests/crm-import-query.test.js.

## Tests / Runtime
- Isolated Node runtime: PASS — crm search/filter + import normalization + validation + raw preservation + duplicate-candidate detection.
- JS syntax checks: PASS for changed CRM helper/import files.
- Live Supabase schema inspection: PASS; project ACTIVE_HEALTHY.
- Full repository runtime remains unavailable from the current environment; no DONE is claimed solely from isolated tests.

## Release
PARTIAL / release-gated.

## Batch 71-100 Reconciliation / Implementation
- 071-075 Matching: implementation files exist in `src/domains/matching/scoring.js`; focused tests were added, but runtime verification for the repository test file was not executed in this environment.
- 076 Valuation Engine: existing implementation retained; no duplicate valuation engine created.
- 077 Comparable Evidence: remains PARTIAL; no unsupported comparable evidence was invented.
- 078 Construction Cost Engine: canonical construction calculation path retained; root duplicate was not recreated.
- 079 ROI / Profit Scenarios: existing finance paths retained; no duplicate scenario engine created.
- 080-081 Gold/Dollar Comparison: canonical `src/domains/finance/market-analysis.js` extended.
- 082 Historical Market Analysis: historical comparison primitive added.
- 083 Live Market Snapshot: timestamped market snapshot primitive added; this is not a live external feed.
- 084 Scenario Forecasting: scenario output explicitly marked non-guarantee.
- 085 Liquidity Analysis: remains TODO.
- 086 Deal Risk Analysis: existing risk flag primitive retained.
- 087 Market Data Timestamp: snapshot timestamp/sourceTimestamp added.
- 088-089 Daily Gold/Dollar Update: no scheduled external feed implemented; remain TODO.
- 090 Property Price vs Gold: explicit property-vs-gold primitive added.
- 091 Property Price vs Dollar: explicit property-vs-dollar primitive added.
- 092 Property Value in 18K Gold Grams: explicit grams primitive added.
- 093-096 Historical 6/12/18/24 month series support added; source observations remain caller-supplied.
- 097 Historical Performance Chart: data-series support exists; visual chart remains TODO.
- 098 Future Scenario Chart: scenario-series support exists; visual chart remains TODO.
- 099 Proposal-Ready Investment Analysis: structured investment-analysis output added.
- 100 Forecast/Scenario vs Guarantee: output explicitly carries guarantee=false and disclaimer.
- Commits: matching 6b742cad2963489b7f00c552f95ea5a94b29b52f; matching tests b2ad97058b2bea3bef440a79852750a8be40c4b1; market analysis 36939c8f4907fc039dc4dc003dd1da66a4338c06; market tests 11deeeec1bef348a0bd85682ee1d74e3f3570ec7.
- Isolated runtime: market-analysis tests PASS after fixing historical direction and floating-point assertion.
- Full repository runtime: unavailable from current environment.

## Batch 101-120 Reconciliation
- 101 Project Management Core: live schema and project-control architecture exist; acceptance remains PARTIAL until end-to-end runtime evidence.
- 102 Project hierarchy: canonical hierarchy implementation and live project-control schema exist; prior authenticated runtime evidence covers hierarchy.
- 103-111 Dashboard/master plan/calendar/WBS/MSP/Gantt/milestones/dependencies/predecessors: schema/UI evidence exists from prior Grok work; current live database has 1 project but 0 phases/WBS/milestones/schedule tasks, so these remain PARTIAL pending populated-data runtime verification.
- 112-114 Critical Path/CPM/Float: schema has `is_critical` and predecessor data, but no verified CPM/float implementation found; remain TODO.
- 115-118 Baseline/actual/variance: project and schedule tables contain baseline/actual/progress fields; calculation/runtime acceptance remains TODO/PARTIAL.
- 119-122 Progress metrics: project/schedule tables contain progress and planned_progress; earned-progress calculation not verified.
- 123-130 Delay/recovery/version/snapshot/status: no verified canonical implementation found; remain TODO.
- Live Supabase verification: construction_projects=1, project_phases=0, project_wbs=0, project_milestones=0, project_schedule_tasks=0.
- No duplicate Project Control engine created.

## Batch 121-140 Implementation
- 121 Actual Progress: implemented as canonical project-control progress primitive.
- 122 Earned Progress: implemented as explicit earned progress input/output.
- 123 Delay Detection: implemented with planned/actual date assessment.
- 124 Delay Reason: not silently inferred; remains TODO for explicit persisted reason taxonomy.
- 125 Delay Responsibility: remains TODO; no unsupported attribution introduced.
- 126 Recovery Plan: implemented as proposal object with explicit human approval requirement.
- 127 Revised Schedule: version primitive supports revised task snapshots; full persistence/UI remains PARTIAL.
- 128 Multiple Project Versions: implemented as version snapshot primitive; persistence remains PARTIAL.
- 129 Project Snapshot: implemented as timestamped snapshot primitive.
- 130 Project Status: snapshot supports explicit project status.
- 131 Procurement Master Plan: procurement operations foundation added; master-plan persistence/UI remains PARTIAL.
- 132 Material List: material reference supported through purchase requests; dedicated material master remains PARTIAL.
- 133 BOQ Integration: no duplicate BOQ engine created; existing BOQ remains canonical and integration remains PARTIAL.
- 134 Purchase Schedule: required-date field supported in purchase request; full schedule remains PARTIAL.
- 135 Required Date: implemented in purchase request.
- 136 Order Date: implemented on purchase order.
- 137 Delivery Date: implemented on delivery record.
- 138 Supplier: supplierId supported on purchase request.
- 139 Supplier Comparison: remains TODO.
- 140 Purchase Request: implemented with request state.
- Focused isolated Node runtime: project-progress-121-130 PASS; procurement-131-140 PASS.
- Full repository npm/CI runtime: not executed here; therefore none of these are marked DONE under the project DONE contract.
- Commits: a7926936026434cd2b607dbfdb096b5fce984704; bd24f7a393ad514480f73ae9ef91c05d9eb02616; 65a688754e4399c410d0343f0e0419a9d41fe2bb; 3e4b563ea68161dee8e680c04357e89efcc7d1db.

## Batch 324-342 — KPI Engine
- Extended canonical project_kpi_snapshots/KPI dashboard; no duplicate KPI subsystem.
- Added KPI catalog: quality, HSE documentation, sales, cash flow, contractor, supplier, productivity, progress, delay, cost overrun, procurement delay, unit sales, ROI and profit margin.
- Added custom KPI definitions, thresholds, alert evaluation, trend data and drill-down data.
- Added snapshot refresh function and Project Control UI slice project-kpi-324-342.js.
- Supabase migration project_kpi_324_342 applied and transactionally tested; fixtures rolled back.
- Browser/runtime UI verification remains pending; 324-342 are PARTIAL.
- Next Task: 343.


## Batch 294-323 — Project Documents / Plan Intelligence / KPI
- Reused existing project_documents table and extended it with file/OCR/extraction metadata instead of creating a duplicate document system.
- Added document register for architectural plans, permits, municipality documents, floor plans, elevations, site plans and renders.
- Added structured extracted plan-data view for gross area, useful area, units, parking, storage, floors, land area and setbacks.
- Added project KPI snapshots and dashboard aggregating schedule, cost, procurement and sales indicators.
- Added project-docs-kpi-294-323.js and wired it into Project Control.
- Migration project_documents_kpi_294_323_v4 applied successfully after two schema corrections; final migration is valid.
- SQL verification passed with a rolled-back OCR/extraction fixture returning gross 1200, useful 950, 8 units, 10 parking, 8 storage, 5 floors, 400 land area and setbacks JSON.
- Actual OCR/AI extraction engine, binary file upload/storage runtime, plan-vs-permit comparison and browser runtime are not yet verified; therefore 294-323 remain PARTIAL.
- Next Task: 324.

## Batch 343-367 — Workflow Engine
- Implemented one canonical workflow subsystem; no parallel workflow architecture.
- Added workflow definitions, ordered steps, triggers/conditions/actions, approvals, notifications, assignments, escalations, deadlines and recurring step configuration.
- Added project/procurement/sales/contract/construction/accounting/AI workflow templates.
- Added project/builder/user scoping, workflow runs, event history and audit views.
- Added workflow_start() runtime entry point.
- Added Project Control UI builder/history/audit surface in workflow-engine-343-367.js.
- Applied migration workflow_engine_343_367 and transactionally tested a 9-step workflow including start/event/history/audit; fixture rolled back.
- External notification delivery, scheduler/cron execution and full browser runtime remain unverified; 343-367 are PARTIAL.
- Next Task: 368.

## 2026-09-30 — Deal Control 368-376
- Extended existing deal_workspaces/deals; no duplicate deal workspace subsystem.
- Added persistent timeline events, deal actions, follow-ups, risk scoring, participation calculations and payment schedules.
- Added deal_workspace_control aggregation view and Project Control UI deal-control-368-376.js.
- Transactional fixture verified timeline/action/follow-up/risk/participation/payment aggregation; rolled back.
- Browser runtime remains unverified; 368-376 PARTIAL.
- Next task: 377.




## 2026-10-01 — Contract Control 377-385
- Extended the existing canonical BuildWiseContract engine; no parallel contract subsystem.
- Added deterministic helpers for templates, immutable version snapshots, attachments, approvals, signatures, obligations, milestones, breach alerts and contract-to-project links.
- Added migration `20261001130000_contract_control_377_385.sql` covering persistent contract control tables, indexes, RLS manager gate and `contract_control` aggregation view.
- Added focused acceptance coverage to `tests/contract-engine.test.js`; GitHub Unit Test run reached `contract-engine: passed`.
- Full npm test remains BLOCKED by an existing repository reference to missing `tests/unit/market-intelligence.test.mjs`; this is unrelated to the 377-385 implementation.
- Browser/runtime and live Supabase migration verification are still pending; 377-385 remain PARTIAL.
- Next task: 386.


## 2026-10-01 — Advisor Operations 386-400
- Reused canonical public_requests and crm_followups; no duplicate request/follow-up entities were created.
- Added advisor request assignment/response, promotion, hot-slot, KPI snapshot and scorecard persistence.
- Added canonical `src/domains/crm/advisor-control.js` with routing, workload, KPI and scorecard logic plus auditable promotion/hot-slot/transfer primitives.
- Added focused tests in `tests/unit/advisor-control.test.mjs` and wired them into the repository test command.
- Added migration `20261001140000_advisor_operations_386_400.sql` with RLS and advisor operations control view.
- CI was blocked by an existing syntax defect in `procurement-control-141-160.js`; the defect was fixed minimally and a fresh CI run is now in progress.
- 386-400 remain PARTIAL pending final CI result, browser/runtime and live Supabase verification.
- Next task: 401.


## 2026-10-01 — Customer Experience 406-415
- Reused the canonical portal/media/customer-flow architecture; no parallel showroom or CRM request subsystem created.
- Added `src/domains/portal/customer-experience.js` for interactive walkthrough, floor-plan viewer state, unit selection, unit comparison, customer request journey, customer assistant routing, customer-specific proposal/ROI, notifications and appointment workflow primitives.
- Added `20261001150000_customer_experience_406_415.sql` for experience views, customer notifications and appointment persistence with RLS and control view.
- Added `tests/unit/customer-experience.test.mjs` and wired it into the repository test command.
- Existing 401-405 remain PARTIAL; 406-415 are now PARTIAL pending CI, browser/runtime and live Supabase verification.
- Next task: 416.


## 2026-10-01 — AI Intelligence 425-430
- Reused canonical `src/ai/` gateway/action-contract and existing `ai_audit_events` / `learning_events`; no parallel AI execution or audit architecture.
- Added `src/ai/intelligence-layer.js` for financial, procurement and sales intelligence, persistent-memory querying, approval-gated action execution and explanation/evidence output.
- Added `20261001160000_ai_intelligence_425_430.sql` for persistent AI memory, action runs and explanations with RLS and control view.
- Added `tests/unit/ai-intelligence-layer.test.mjs` and wired it into the project test suite.
- 425-430 remain PARTIAL pending CI, live Supabase and runtime verification.
- Next task: 431.


## 2026-10-01 — Agent Control Plane 431-444
- Reconciled existing worker registry, task contract and execution protocol; no duplicate agent registry or task-contract architecture.
- Added canonical `src/agent-control/control-plane.js` for contract validation, model/worker routing, tool-scope authorization, result validation, evidence handoff and failure recovery.
- Added `tests/agent-control-plane.test.mjs` and wired it into the project suite.
- 431-444 remain PARTIAL pending CI/runtime verification.
- 445 Codex Worker remains BLOCKED because no independently verified Codex runtime is connected.
- Next task: 446.


## 2026-10-01 — Project Baseline & Variance 457-458
- Reused canonical `ai-project-control-engine.js`; no parallel project-control subsystem created.
- Added deterministic baseline snapshot and task/project variance calculations covering start/finish, duration, cost and progress deltas.
- Added `tests/ai-project-control-baseline.test.mjs` and wired it into `npm test`.
- 457-458 are PARTIAL pending focused/full CI confirmation and runtime/Supabase verification.
- Next task: 461.


## 2026-10-01 — Construction Operations 461-475
- Reused canonical construction control model; no parallel operations subsystem created.
- Existing supplier commitment remains represented by procurement control; extended construction control with RFI/submittal, site diary, daily report, crew, equipment, material, progress-photo, geotag and before/after normalization.
- Added `tests/unit/construction-control-operations.test.mjs` and wired it into `npm test`.
- 461-475 are PARTIAL pending CI/full-suite, live persistence/Supabase and browser/runtime verification.
- Next task: 476.


## 2026-10-01 — AI Progress Verification 476
- Reused canonical `ai-project-control-engine.js` and added evidence-vs-declared progress verification.
- Added `tests/ai-project-control-progress-verification.test.mjs` and wired it into `npm test`.
- 476 is PARTIAL pending CI and runtime evidence integration.
- 477-490 remain at their registered states; no UI claim was made without browser verification.
- Next task: 477.


## 2026-10-01 — UX Reconciliation 477-492
- Audited the existing mobile foundation and canonical `src/ui/ai-workspace.js`.
- Existing responsive/mobile shell, contextual AI assistant, persistent deal workspace, and AI project-control surface were found; no duplicate UI subsystem was created.
- Reconciled 480-490 and 491-492 to PARTIAL because implementation exists but browser/runtime parity verification is not complete.
- 493 onward remains unclaimed until an actual implementation is present and verified.
- Next task: 493.
