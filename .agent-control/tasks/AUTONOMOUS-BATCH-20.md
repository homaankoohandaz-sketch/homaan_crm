# BUILDWISE — AUTONOMOUS IMPLEMENTATION BATCH 20

## Mission
Execute Tasks 01→20 sequentially on `buildwise-implementation`. Do NOT stop after one task, after tests pass, or after the first green build.

A task is DONE only when it is:
1. implemented,
2. integrated with the existing application,
3. validated with focused tests,
4. checked for regressions/import/dependency issues,
5. documented in the control-plane,
6. committed coherently.

Do not ask for human confirmation between tasks. Do not rebuild working modules. Do not delete existing functionality merely to make tests pass.

## Execution loop
For EACH task:
- inspect current repository and existing implementation first;
- implement the smallest coherent change;
- run focused tests;
- fix failures immediately;
- verify integration and imports;
- update relevant control-plane status/evidence;
- commit coherent work;
- immediately continue to the next task.

If a task is blocked, record the exact blocker, root cause, attempted fix, evidence, and next action, then continue with the next unblocked task.

## Tasks

### 01 — Baseline and boot
Verify the current application entry point, package scripts, dependency graph, build command, test command, and runtime boot path. Fix only concrete blockers preventing the integrated app from running.

### 02 — Application shell integration
Ensure the main application loads as one coherent BuildWise application rather than disconnected demo/module pages. Preserve existing working functionality.

### 03 — Routing/module integration
Connect the existing land analysis, CRM, deal workspace, matching, construction, advisor, import, and dashboard surfaces through the actual application navigation/flow.

### 04 — Authentication flow
Verify login/session handling and protected application access. Fix concrete integration defects without changing production secrets or weakening security/RLS.

### 05 — CRM core
Verify property/contact CRUD paths, persistence, validation, duplicate handling, filtering, and the existing phone-number visibility rules. Fix broken relations rather than replacing the CRM.

### 06 — Import pipeline
Verify Excel/CSV/manual import, batching, validation, duplicate safety, error reporting, and persistence. Preserve same-phone records when they represent distinct records.

### 07 — Land/property analysis
Connect land/property inputs to the existing feasibility and analysis UI. Verify dimensions, area, region/street fields, regulatory inputs, and outputs flow through the actual application.

### 08 — Feasibility engine
Verify the feasibility calculations and their UI wiring. Add/fix tests for representative cases and edge cases. Do not invent business rules not supported by the existing project specification.

### 09 — Financial model
Verify cost, revenue, ROI/profit and participation calculations and their links to project/floor-level data. Fix unit/field mismatches and add regression tests.

### 10 — Deal workspace
Verify deal creation, editing, ownership, status, linked properties/people, and the end-to-end persistence path.

### 11 — Matching / Deal Intelligence
Verify matching inputs, candidate retrieval, scoring/ranking logic as already specified, and presentation of actionable matches. Ensure linked records remain consistent.

### 12 — Construction Control
Verify WBS/Gantt/BOQ/procurement/RFI/quality/HSE/risk/progress surfaces that already exist. Integrate them into the main application without rebuilding working components.

### 13 — AI orchestration boundary
Verify advisor/AI orchestration interfaces, request/response contracts, error handling, and safe fallbacks. Do not add secrets or bypass authentication/RLS.

### 14 — Relational integrity
Audit cross-module IDs, foreign-key assumptions, serialization/deserialization, null handling, and stale references. Fix concrete relationship defects and add tests.

### 15 — UI integration
Remove broken navigation/dead buttons/obvious disconnected states in the integrated path. Ensure the primary BuildWise workflow is usable from login through core modules.

### 16 — Regression suite
Run the existing unit/integration tests. Add only high-value regression tests for defects found during Tasks 01–15. Fix failures caused by implementation changes.

### 17 — Production build validation
Run the production build and inspect warnings/errors. Fix build blockers, broken imports, asset/path issues, and runtime-critical defects.

### 18 — End-to-end readiness
Exercise the actual user path: open app → authenticate → create/find record → analyze → calculate → create/inspect deal → navigate linked modules. Fix blockers discovered.

### 19 — Release gate
Review project release-readiness criteria and checklist. Verify implementation + integration + tests + build + evidence. Do not call DONE merely because CI is green.

### 20 — Final integration pass
Run the final relevant tests and production build. Inspect git diff/status and module relationships. Update control-plane evidence with exact commands/results, remaining risks, and release state. Commit and push the coherent final state.

## Hard constraints
- No human approval between tasks.
- No stopping at the first green test.
- Passing tests alone is NOT DONE.
- No destructive rewrite of working modules.
- No production secret changes.
- No auth weakening.
- No RLS bypass.
- No unrelated refactor.
- Prefer existing architecture and code.
- Keep changes reviewable and coherent.
- At the end, report: STATUS, MODEL_USED, BASE_SHA, HEAD, CHANGED, TESTS, BUILD, E2E, EVIDENCE, RISKS, NEXT.
