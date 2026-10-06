# TASK — Unified Task Engine UI Binding

Status: IMPLEMENTED / RUNTIME VERIFICATION PENDING
Date: 2026-10-06
Branch: buildwise-implementation

## Objective
Bind the canonical Unified Task Engine to the existing BuildWise application UI without creating a second task system.

## Implemented
- Added پیگیری‌ها Task Center navigation.
- Added browser adapter at src/ui/task-engine-ui.js.
- Uses canonical src/core/task-engine.js and src/core/task-repository.js.
- Uses the existing public.tasks table.
- Manager-capable roles can create and view team tasks.
- Assigned users can approve, reject, complete and move tasks to tomorrow.
- Reminder configuration is exposed from the task card.
- Starred tasks remain backed by the canonical engine.
- Added focused UI binding contract test and wired it into npm test.

## Verification
- GitHub readback confirms all changed files are present on buildwise-implementation.
- Static contract wiring is present.
- CI/runtime/browser verification is still pending because no workflow run/status is currently returned for the new commits.
- Therefore this task is not marked DONE.

## Acceptance
Implementation + focused test + CI + authenticated browser/runtime verification are required before DONE.