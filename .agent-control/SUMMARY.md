# BuildWise AI — SUMMARY

Updated: 2026-10-02
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


## 2026-09-30 — Workflow Engine 343-367
- Canonical workflow subsystem added; no duplicate engine.
- Definitions, ordered steps, trigger/condition/action, approval, notification, assignment, escalation, deadline and recurring configuration.
- Project/procurement/sales/contract/construction/accounting/AI templates.
- Workflow runs, event history, audit, project/builder/user scoping and workflow_start() entry point.
- Project Control UI wired via workflow-engine-343-367.js.
- Transactional 9-step workflow test passed and rolled back.
- Scheduler/external delivery/browser runtime remain unverified; 343-367 PARTIAL.
- Next task: 368.

## 2026-09-30 — Deal Control 368-376
- Extended existing deal_workspaces/deals; no duplicate deal workspace subsystem.
- Added persistent timeline events, deal actions, follow-ups, risk scoring, participation calculations and payment schedules.
- Added deal_workspace_control aggregation view and Project Control UI deal-control-368-376.js.
- Transactional fixture verified timeline/action/follow-up/risk/participation/payment aggregation; rolled back.
- Browser runtime remains unverified; 368-376 PARTIAL.
- Next task: 377.


## 2026-10-01 — Contract Control 377-385
- Extended the canonical BuildWiseContract engine for templates, versioning, attachments, approvals, signatures, obligations, milestones, breach alerts and project links.
- Added persistent contract-control schema and `contract_control` aggregation view with manager-scoped RLS.
- Focused contract-engine tests pass in GitHub CI.
- Full npm suite remains blocked by the pre-existing missing `tests/unit/market-intelligence.test.mjs` reference; browser/runtime and live migration verification remain pending.
- Master Checklist 377-385 are PARTIAL; next task is 386.


## 2026-10-01 — Advisor Operations 386-400
- Reused canonical public_requests and crm_followups; added advisor assignment/response, promotion, hot-slot, KPI snapshot and scorecard control.
- Added `src/domains/crm/advisor-control.js` and focused tests `tests/unit/advisor-control.test.mjs`.
- Added migration `20261001140000_advisor_operations_386_400.sql` with RLS and advisor operations control view.
- Fixed the existing procurement UI syntax blocker that prevented CI from reaching these changes.
- Final CI verification is still running; 386-400 remain PARTIAL until CI + runtime evidence are complete.
- Next task: 401.


## 2026-10-01 — Customer Experience 406-415
- Extended the canonical portal/customer architecture with walkthrough, floor-plan, unit selector/comparison, request journey, customer assistant routing, customer-specific proposal/ROI, notifications and appointment workflow.
- Added persistence migration `20261001150000_customer_experience_406_415.sql` with RLS and appointment control view.
- Added focused customer-experience tests and wired them into the project test suite.
- 406-415 remain PARTIAL pending CI, browser/runtime and live Supabase verification.
- Next task: 416.


## 2026-10-01 — AI Intelligence 425-430
- Extended the canonical AI layer with financial/procurement/sales intelligence, persistent-memory querying, approval-gated action execution and explanation/evidence output.
- Added persistent AI memory/action/explanation schema with RLS and control view.
- Added focused tests and wired them into the project suite.
- 425-430 remain PARTIAL pending CI, live Supabase and runtime verification.
- Next task: 431.

## 2026-10-01 — Agent Control Plane 431-444
- Reconciled against the existing worker registry, task contract v1, access matrix and canonical execution protocol.
- Added `src/agent-control/control-plane.js` for task validation, routing, authorization, result validation, handoff, recovery and dispatch.
- Added focused agent-control-plane tests and wired them into the suite.
- 431-444 remain PARTIAL; 445 Codex Worker remains BLOCKED without independently verified Codex runtime.
- Next task: 446.

## 2026-10-01 — Project Baseline / Construction / UX 446-492
- Added baseline capture/variance and AI progress-evidence verification to the canonical project-control engine with focused tests.
- Extended canonical construction control with submittal, site diary, daily report, crew, equipment, material and progress-photo normalization plus tests.
- Reconciled existing mobile/responsive, AI workspace and project-control UI rather than creating duplicate UI architecture.
- 446-492 remain PARTIAL pending full CI/browser/runtime evidence.
- Next task: 493.

## 2026-10-01 — Project Presentation Views 493-500
- Added `src/ui/project-views-493-500.js` for Gantt, KPI dashboard, procurement calendar, financial dashboard, unit sales matrix, drag/drop workflow, timeline and shared animation tokens.
- Reused canonical project_schedule_tasks, project_kpi_catalog, project_procurement, project_floors/project_units, buildwise_project_dashboard and project_ai_alerts paths; no duplicate engines created.
- Added focused tests `tests/unit/project-views-493-500.test.mjs` and wired them into npm test.
- Isolated focused runtime: PASS — 8/8 tests.
- Browser/runtime and full repository npm/CI verification remain pending; therefore 493-500 are PARTIAL, not DONE.
- Current cursor: 501.


## 2026-10-01 — Canonical Customer Experience Specification
- Recorded `docs/requirements/CUSTOMER-EXPERIENCE-SPEC-v1.md` as the canonical in-scope customer product requirement.
- Recorded durable decision memory in `.agent-control/memory/CUSTOMER-EXPERIENCE-DECISION-2026-10-01.md`.
- C01–C40 are capability identifiers, not a second task registry; existing 401–415 and 418–432 are the current relevant master-checklist ranges.
- Customer privacy, field-level permissions, ±5% customer-facing price range, four-location recommendation limit, visit/calendar flow and verified rating requirements are repository-law inputs for future implementation.


## 2026-10-02 — Security / Governance 591-608
- Security hardening applied to the live Supabase project after a measured preflight and transactional dry run.
- 17→1 RLS-enabled/no-policy findings; the remaining `telegram_sessions` table is intentionally service-only with client grants revoked.
- 22→0 flagged SECURITY DEFINER views by enabling `security_invoker` and revoking anon SELECT.
- 4→0 anon-executable SECURITY DEFINER functions; 3→0 mutable search_path findings.
- 25→23 authenticated SECURITY DEFINER findings remain; they are function-by-function review candidates, not blindly revoked because several are application RPCs and RLS helper functions.
- Added field-policy, agent-tool-permission and production-action-approval governance tables with RLS.
- Added `properties_client` safe read surface and changed all eight browser property read paths to it; raw phone-column revocation is intentionally staged until branch deployment/runtime verification.
- AI audit/alert/approval permissions narrowed to actor/manager/assigned-user boundaries.
- Verified Google Sheets sync uses `BUILDWISE_SYNC_TOKEN` from Edge Function environment and no hardcoded token.
- Leaked Password Protection remains WARN because the current Supabase plan does not include that feature; no false DONE claim.
- Focused security regression tests are wired into npm test.
- Latest Netlify deploy-preview status: SUCCESS. Browser automation is unavailable here; UI/runtime verification remains pending.
- Current cursor: 599.


## 2026-10-02 — Security Hardening 599-600
- Audited the 23 authenticated-callable SECURITY DEFINER functions from the security-governance baseline.
- Closed two trigger-only functions to all API execution: log_lead_request_time() and check_report_threshold().
- Added missing active-user gates to the reviewed project-control/radar/status RPCs.
- 599 implemented at the database boundary: manager-only phone policy is explicit for person/property phone fields.
- 600 implemented for the property client surface: properties_client is narrow and security_invoker; mobile, emergency_phone, owner_notes and internal_notes are excluded.
- Direct authenticated SELECT on public.properties is now explicit-column only; mobile/emergency_phone are not selectable. Existing write privileges were preserved.
- Runtime verification passed for column privileges and crm_mask_phone().
- Security Advisor: authenticated SECURITY DEFINER findings reduced 25 -> 21; anon SECURITY DEFINER 0; mutable search_path 0.
- The remaining 21 SECURITY DEFINER RPCs are intentional application/RLS helpers and require no blind revoke; they remain on the function-by-function review register.
- Browser UI verification is still unavailable, so 599-600 are PARTIAL rather than DONE under the repository acceptance contract.
- Current cursor: 601.


## 2026-10-02 — REOS Integration Contract 651-675
- Reconciled the 651-675 FINAL MASTER OBJECTIVE against the canonical MASTER-ARCHITECTURE and existing domain tables; no second REOS engine was created.
- Added `src/core/reos-contract.js` as the shared integration contract for the intelligence graph, project-control dimensions, per-project configuration, accepted inputs, calculation/comparison domains, AI approval/evidence gates and customer output minimums.
- Added `tests/unit/reos-contract.test.mjs` and wired it into the canonical npm test suite.
- Recorded the architectural decision in `.agent-control/memory/REOS-INTEGRATION-DECISION-2026-10-02.md`.
- Current evidence: focused test is queued through GitHub CI; runtime/browser/UI/security evidence is still required before any 651-675 item can be marked DONE.


## 2026-10-02 — Decision Constitution / Execution Economics / Lineage 750-827
- Extended the canonical REOS integration contract rather than creating a parallel governance engine.
- Added explicit source-of-truth hierarchy, evidence strength, reasoning classes, recalculation modes, failure policy, idempotency, sensitive-action dry-run and approved-version preservation.
- Added validators for critical changes/versioning, execution traces, bounded task scope/budgets, input lineage and recovery evidence.
- Added focused tests and kept the contract in the canonical npm test suite.
- 750-827 are implementation evidence only where covered by these contracts; DONE still requires the checklist acceptance rule including runtime/UI/security evidence where applicable.

## 2026-10-02 — Integrity repair
- Fixed stale `package.json` test reference to the non-existent `tests/unit/market-intelligence.test.mjs`.
- Commit: `404811d89b66ed84ba4dbdf526f58c0948698235`.
- Next: verify fresh CI, then reconcile the live deployment with the canonical implementation branch.
## 2026-10-02 — Customer Experience C01-C40 implementation
- Decision converted to bounded task `.agent-control/tasks/TASK-CUSTOMER-EXPERIENCE-C01-C40.md`.
- Added the canonical C01-C40 implementation layer to `PHASE-CURRENT-ARCHITECTURE.md`; no parallel customer application/engine created.
- Extended `src/domains/portal/customer-experience.js` with intent, requirement/profile, location ranking (max 4), customer-safe ±5% price range, evidence/scenario comparison, verified ratings/market score and privacy-safe output contracts.
- Added migration `20261002230000_customer_experience_c01_c40.sql` for customer profiles/requirements, location recommendations, verified interactions/ratings, proposals, aggregation and privacy policy boundaries.
- Customer portal output now masks exact internal price and limits customer-visible media types.
- Added focused C01-C40 customer-experience tests.
- Acceptance remains PARTIAL until full CI + live Supabase/runtime + browser/UI + applicable security verification are confirmed.

## 2026-10-02 — CRM Import Quality 060-065
- Implemented the canonical CRM import-quality layer for arbitrary-column editing, row-level error isolation, preview, validation, exact batch rollback and data-quality metrics.
- Added focused tests covering all six capabilities and wired the canonical importer UI to preview/edit/validate/rollback.
- Added manager-only rollback migration with batch identity on imported target rows.
- Status: implementation complete; acceptance remains PARTIAL pending CI/runtime verification.


## 2026-10-03 — Core REOS Acceptance 014/022/026/029/030
- Reconciled the existing shared `src/core/reos-contract.js`; no duplicate engine was introduced.
- Hardened Liquidity validation to reject negative assets/obligations and hardened the Master Decision Loop to require non-empty evidence.
- Added focused regression coverage in `tests/unit/reos-contract.test.mjs`.
- Full `npm test` passed in BuildWise Unit Tests run 840.
- Application Validation 938, QA 154, Agent Control Plane Validation 291 and Phase Code Map 617 passed.
- Checklist 014, 022, 026, 029 and 030 promoted to [✓] DONE under the repository DONE rule.
- Migration Gate 19 failed on an unrelated existing migration-gate condition; this task introduced no migration and does not depend on that gate.
- Task contract: `.agent-control/tasks/TASK-A-CORE-014-022-026-029-030.md`.


## 2026-10-03 — Task C/D: Plan Intelligence + Visualization
- Researched GitHub components for 301–312 and 682–688 and recorded the licensing/architecture decision in D-024.
- Added BuildWise-owned plan-intelligence adapters for OCR, PDF, DXF, text fact extraction, plan-vs-permit comparison and missing-information detection.
- Added BuildWise-owned visualization contracts for 2D elevation, 2D floor plan, scenarios, 3D scene bootstrap, 360° texture loading and 4D progress frames.
- Added browser bridge src/ui/plan-visualization-adapter.js and wired it into index.html.
- Added focused tests and registered them in npm test.
- Added docs/architecture/PLAN-VISUALIZATION-TOOLS.md, THIRD-PARTY-NOTICES.md and the Task C/D control-plane task.
- Acceptance remains PARTIAL: real browser ingestion/rendering and representative PDF/image/DXF runtime verification are still required.


## 2026-10-03 — Municipal Regulation Evidence 068
- Added a provenance-first regulation evidence boundary.
- Verified evidence requires authority, source URL, verified status and valid effective dates.
- Unverified or expired sources cannot enter regulatory decision input.
- Added focused tests and registered them in npm test.
- Checklist 068 promoted from TODO to PARTIAL; runtime ingestion/UI verification remains required.


## 2026-10-03 — Market History / Scenarios 082-100
- Added source-aware historical observation and comparison contracts.
- Added 6/12/18/24-month comparison capability, property value in 18K gold grams, chart series generation and explicit forecast/non-guarantee scenario contracts.
- Added focused tests and registered them in npm test.
- Checklist 082–100 promoted from TODO to PARTIAL.
- No live market value was fabricated; real sourced observations and runtime/UI verification remain required.


## 2026-10-03 — Agent Runtime Independence Decision
- 445-449 are no longer treated as five vendor runtimes that must each be built.
- Canonical direction: one provider-independent BuildWise Worker Runtime with replaceable adapters.
- OpenCode, smolagents, vLLM and Ollama are reusable open-source/runtime candidates; n8n is optional.
- Per-user token/time/cost/iteration/tool/data budgets and three access lanes are part of the execution contract.
- Budget exhaustion escalates safely to human advisors with preserved task state.
- Decision recorded in .agent-control/AGENT-RUNTIME-INDEPENDENCE-DECISION-2026-10-03.md.


## 2026-10-03 — Project Management Core 101-130
- Reconciled existing construction hierarchy, WBS, schedule and progress modules before implementation; no duplicate project-control engine created.
- Added `src/domains/construction/project-management-core.js` as the canonical orchestration layer for hierarchy validation, schedule, Gantt-ready rows, CPM float/critical flags, baselines, actual-vs-baseline variance and project status.
- Added focused contract tests in `tests/unit/project-management-core.test.mjs` and registered them in npm test.
- Checklist 101, 102, 106-123, 129-130 moved from TODO to PARTIAL where the new core provides implementation coverage.
- Dashboard/calendar UI, delay reason/responsibility, recovery plan, revised schedule and multi-version snapshot behavior remain separate TODOs.
- Runtime/browser verification is still required; no DONE claim.
