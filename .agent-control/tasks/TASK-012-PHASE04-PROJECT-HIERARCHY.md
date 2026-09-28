# TASK-012 — Phase 04 Project Hierarchy

Status: IMPLEMENTED / PERSISTENCE-TEST-ADDED
Date: 2026-09-28
Branch: buildwise-implementation

## Scope
Start Phase 04 with one canonical project hierarchy model for:
Project → Complex → Building → Phase → Floor → Unit.

## Implemented
- Canonical src/domains/construction/project-model.js.
- Node creation with status, ordering, metadata and timestamps.
- Hierarchy validation for duplicate IDs, missing parents and invalid parent type.
- Child retrieval with deterministic sort order.
- Focused unit test under tests/unit/project-model.test.mjs.
- Canonical persistence adapter under src/domains/construction/project-repository.js.
- Persistence contract test under tests/unit/project-repository.test.mjs, wired into npm test.

## Verification
- Isolated Node runtime test: PASS.
- Production/runtime verification: not claimed.
- Supabase persistence integration: next bounded task.
- UI verification: not applicable to this core slice.

## Acceptance mapping
- Master Checklist: 101–102.
- Phase 04: project hierarchy foundation.

## Next
Implement project persistence against the existing Supabase project-control schema, then add WBS/schedule linkage without creating duplicate project tables.
