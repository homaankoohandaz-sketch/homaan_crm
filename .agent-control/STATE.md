# Agent Control State

status: BATCH31-50 EXECUTED | CRM RECONCILED | ISOLATED RUNTIME PASS | FULL REPO RUNTIME BLOCKED
project: BuildWise AI
branch: buildwise-implementation
active_task: checklist-141-160
last_batch: 141-160

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

## Next
- Next Task: 141
- Continue sequentially through procurement approval/order/delivery/inventory, reconciling existing schema before extending it.


## Batch 141-160 — Procurement Control
- 141 Purchase Approval: approval records + procurement approval state implemented.
- 142 Purchase Order: PO entity, numbering, supplier, dates, quantity and generated total implemented.
- 143 Delivery Tracking: delivery records and procurement received/rejected quantities implemented.
- 144 Partial Delivery: accepted/rejected partial quantities and delivery percentage implemented.
- 145 Material Inventory: project material inventory with reserved quantity and reorder point implemented.
- 146 Material Consumption: consumption records with inventory decrement and insufficient-stock guard implemented.
- 147 Material Shortage Alert: UI flags inventory at/below reorder point as SHORTAGE.
- 148-157 Price lineage: purchase/current price, variance, history, Toman/USD, source and timestamp fields/table implemented.
- 155 Live Material Price: current price/history surface is implemented; no external live feed is claimed.
- 158 Purchase Forecast: forecast date and quantity fields implemented.
- 159 Optimal Purchase Timing: recommended purchase date field implemented.
- 160 Procurement Risk: 0-100 score and low/medium/high/critical classification implemented.
- Runtime browser verification for the implementation branch is still required; tasks 141-160 remain PARTIAL, not DONE.
- Supabase migration applied: 20260930145935 project_control_procurement_141_160.
- Implementation commits: d0dd4e43f42f74353f619f3628332daa906c820b, 8a45ec5fd0282e121dd9755e2595a0fe071e928e, 6eb0c9c4ae6f28dbc705c1cc9f31a9be20554e43, 97fc7ab4e4bf509aa3f631e4853c8dd25328b56a.


## Batch 161-180 — AI Project Control
- Added read-only AI Project Control engine covering schedule/delay, dependency/cycle analysis, critical-path calculation, procurement/material prediction, cost-overrun analysis, recovery recommendations, parallel-work candidates, team/resource conflicts, workfront/physical interference, crew availability, shared equipment and material conflicts.
- Added Project Control UI entry point and persisted AI alerts via existing project_ai_alerts table.
- Added focused unit tests and wired them into npm test.
- Tasks 161-180 are PARTIAL because browser/runtime verification is still pending; no master schedule is silently mutated.


## Batch 181-200 — AI Workspace Simulation + Accounting Core
- 181-184: shared workspace detection, work zoning, floor parallelism and trade sequencing added.
- 185-187: read-only what-if simulation, schedule optimization analysis and cost/time trade-off calculations added.
- 188: human approval gate table added for critical AI changes.
- 189: recommendation evidence/explanation remains explicit in AI report.
- 190: AI engine/UI remains read-only; no silent master-schedule mutation.
- 191-200: project ledger, versioned budgets/budget lines, revised/actual/committed/forecast/remaining/total project cost summary added.
- Accounting schema migration recorded: 20260930170000_project_accounting_191_200.
- AI approval migration recorded: 20260930171000_ai_change_approval_188.
- Transactional accounting schema test passed and rolled back.
- 181-200 remain PARTIAL pending browser/runtime verification.


## Batch 201-220 — Project Accounting Cost Dimensions / Currency / Variance
- 201-211: canonical ledger cost views added for WBS, phase, floor, unit, contractor, supplier, material, purchase, invoice, payment and date.
- 212-216: Toman normalization, historical USD/gold rates and current USD/gold equivalents added.
- 217: construction-cost index table + transaction inflation view added.
- 218-220: budget-vs-actual, committed-vs-actual and forecast-vs-budget variance views added.
- Supabase migration applied: 20260930151310_project_accounting_201_220.
- Runtime SQL verification passed: currency conversion and inflation calculation returned expected fixture values; test rows were removed.
- Project Control UI slice added: project-accounting-201-220.js and wired into project-control.html.
- Browser/runtime UI verification is still pending; 201-220 remain PARTIAL, not DONE.
- Commits: f5a7b9f5d23c8f67fffa8e5e93e12d70f6ea838f2, 99221c35018236066e6aa1df3872c896738dc93b, 451f384af1c8874912d84120c1be2fae407899fd, 74d2e20a1256e541d81f7ebb9f98ef55aba81244, b4161e44ed698cb7a0fe13144f14bbc372daef91.

## Next
- Next Task: 221


## Batch 221-235 — Project Accounting Payments / Cash Flow / Documents
- 221: Forecast at Completion view added.
- 222: project cash-flow view added.
- 223-224: receivables and payables views added.
- 225-226: contractor and supplier payment views added.
- 227: advance-payment aggregation added.
- 228: retention tracking added.
- 229-230: installment and payment-calendar structures added.
- 231: payment approval structure added.
- 232-234: invoice/receipt upload metadata and document archive added.
- 235: accounting audit view added.
- Supabase migration applied successfully: project_accounting_221_235.
- SQL integration fixture verified payment/installment/payable paths; fixture rows were removed.
- Project Control UI slice added and wired: project-accounting-221-235.js.
- Browser/runtime UI verification remains pending; 221-235 are PARTIAL, not DONE.
- Next: 236.
