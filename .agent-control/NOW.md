# BuildWise NOW — hot execution state

updated: 2026-09-28
branch: buildwise-implementation
active_task: PHASE-04-project-hierarchy

## CURRENT
Phase 04 implementation is progressing on the canonical construction domain. The current bounded slice is project hierarchy and its control foundations: Project → Complex → Building → Phase → Floor → Unit, WBS, schedule, progress/KPI and BOQ.

## DONE
- Phase 04 project hierarchy model implemented in `src/domains/construction/project-model.js`.
- Hierarchy validation covers duplicate IDs, missing parents and invalid parent type.
- Deterministic child ordering implemented.
- Canonical WBS model implemented with dependency validation and adapter to the existing BuildWise Workflow engine.
- Focused WBS contract test added and wired into npm test.
- Project persistence adapter implemented against existing `construction_projects`; hierarchy is stored under `assumptions.projectHierarchy` without schema duplication.
- Canonical schedule derivation and schedule/milestone persistence implemented under existing project assumptions.
- Progress/KPI model and progress snapshot persistence implemented under existing project assumptions.
- BOQ calculation foundation implemented with line totals, category totals and duplicate-line validation.
- BOQ persistence adapter now stores the calculated BOQ under existing `construction_projects.assumptions.projectBoq`; no new project table/schema introduced.
- Procurement persistence adapter implemented against the existing `project_procurement` table with input normalization, status validation, project scoping and focused tests.
- CI caught a WBS ready-item regression: container nodes (phase/WBS) were incorrectly returned as executable items. Fixed `getReadyWbsItems` to return only task/milestone nodes.
- Focused BOQ persistence coverage added and wired into `npm test`.
- Fixed the CI-discovered task repository identifier persistence bug; CI re-verification is tracked.
- Existing Unified Task Engine core and persistence slice remain intact.

## TEST REPAIR LOG
- CI exposed a WBS ready-queue defect: completed task IDs were still returned as ready. `getReadyWbsItems` now excludes completed IDs before dependency evaluation.

## TEST REPAIR LOG
- CI exposed a schedule date aggregation defect: `maxDate` compared ISO strings against `null`, producing null for dependency finishes and project finish. Fixed `maxDate` to ignore empty values and initialize from the first real date.

## BLOCKED / RELEASE GATE
- Production release remains blocked by divergent `main` and `buildwise-implementation`.
- PR #10 must be reconciled deliberately; never force-update `main`.
- Supabase task-engine migration remains unapplied in production.
- External worker credentials/runtime are still unavailable.

## NEXT
1. Implement the next bounded Phase 04 slice: procurement UI wiring on top of the existing project-control data model.
2. Add focused unit/contract tests and wire them into `npm test`.
3. Run branch CI and update evidence.
4. Continue Phase 04 without changing production schema or release state.

## DO NOT
- Create duplicate project/task systems.
- Add new root-level construction engines.
- Change production schema without the required release gate.
- Claim DONE without implementation + test + runtime evidence.
