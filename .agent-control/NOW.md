# BuildWise NOW — hot execution state

updated: 2026-09-28
branch: buildwise-implementation
actor_last: Grok
active_task: PHASE04 relational unification — PARTIAL

## CURRENT
Phase 04 canonical persistence is relational for hierarchy/schedule/BOQ/procurement.
JSON assumptions path removed from project/schedule/boq repositories for hierarchy/schedule/boq blobs.

## DONE THIS TASK
- hierarchy-repository.js → project_complexes/buildings/floors/units
- schedule-repository.js → project_schedule_tasks/milestones/wbs
- boq-repository.js → project_boq_items (no generated budget_amount)
- project-repository.js → no projectHierarchy in assumptions
- procurement-repository.js already relational (unchanged)
- Unit tests: hierarchy/schedule/boq/project/procurement — 10/10 pass locally
- project-control.html loads project-control-hierarchy.js
- BOQ/proc UI posts omit generated columns

## TESTS RUN (local Node)
pass 10 / fail 0 — hierarchy, schedule, boq, project, procurement repository contracts

## RUNTIME
- Live tables used by repos already exist (prior Master migration)
- Auth CRUD on same tables verified earlier on main/Pages
- Implementation branch not production Pages deploy — UI bridge verified by code presence on branch

## REMAINING GAPS
- progress-repository still assumptions-based (out of strict dual-path hierarchy/schedule/boq; optional next)
- parent_task_id / predecessor fields in UI schedule form still minimal on this branch
- Full browser E2E of hierarchy tab requires preview deploy of this branch (not main Pages)
- Production merge still blocked by diverge

## NEXT
Preview deploy OR Master merge policy; optional progress-repository relational migrate
