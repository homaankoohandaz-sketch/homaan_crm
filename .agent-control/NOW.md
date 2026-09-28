# BuildWise NOW — hot execution state

updated: 2026-09-28
branch: buildwise-implementation
active_task: PHASE-04-project-hierarchy

## CURRENT
Phase 04 implementation has started on the canonical construction domain. The first bounded slice is project hierarchy: Project → Complex → Building → Phase → Floor → Unit.

## DONE
- Phase 04 project hierarchy model implemented in `src/domains/construction/project-model.js`.
- Hierarchy validation covers duplicate IDs, missing parents and invalid parent type.
- Deterministic child ordering implemented.
- Canonical WBS model implemented with dependency validation and adapter to the existing BuildWise Workflow engine.
- Focused WBS contract test added and wired into npm test.
- Focused unit test added and passed in an isolated Node runtime.
- Test script now includes the Phase 04 project model and persistence tests.
- Project persistence adapter implemented against existing `construction_projects`; hierarchy is stored under `assumptions.projectHierarchy` without schema duplication.
- Persistence contract test added.
- Canonical schedule derivation added from WBS dependencies; schedule test wired into npm test.
- Existing Unified Task Engine core and persistence slice remain intact.

## BLOCKED / RELEASE GATE
- Production release remains blocked by divergent `main` and `buildwise-implementation`.
- PR #10 must be reconciled deliberately; never force-update `main`.
- Supabase task-engine migration remains unapplied in production.
- External worker credentials/runtime are still unavailable.

## NEXT
1. Implement Phase 04 project persistence against the existing Supabase project-control schema.
2. Persist the existing project hierarchy against the current construction project data model.
3. Add schedule/milestone persistence after WBS integration.
4. Run branch CI and update evidence.
5. Keep production reconciliation separate; do not let the release gate stop implementation work on the branch.

## DO NOT
- Create duplicate project/task systems.
- Add new root-level construction engines.
- Change production schema without the required release gate.
- Claim DONE without implementation + test + runtime evidence.