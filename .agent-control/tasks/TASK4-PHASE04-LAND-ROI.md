# TASK4 — Phase 04 Land / Construction / ROI / Scenario

status: READY_FOR_WORKER
preferred_model: grok
max_iterations: 3
base_sha: 22b55c51342c2ba08f9fcdf1d9ea85e951a07ed4

## Objective
Implement the smallest production-safe Phase 04 vertical slice using the existing schema:
- construction_projects
- project_scenarios
- base profit / ROI calculation
- scenario input/output persistence

## Scope
Allowed files:
- project-control.html
- existing Phase 04/ROI UI or engine files directly required by the current implementation
- tests directly covering the changed behavior
- .agent-control/tasks/TASK4-PHASE04-LAND-ROI.md
- .agent-control/BRIEF.md
- .agent-control/PERFORMANCE.md
- .agent-control/STATE.md

Do not modify hierarchy, Schedule/WBS/Milestone code, migrations, production secrets, auth configuration, or unrelated modules unless a verified dependency makes it unavoidable. If an extra file is required, stop and report SCOPE_ESCALATION before changing it.

## Required behavior
1. Inspect current Phase 04 code/schema before editing.
2. Reuse existing tables/columns/RPCs where available; do not invent parallel schema.
3. Provide deterministic base ROI/profit calculation from explicit inputs.
4. Provide scenario input/output handling using existing project_scenarios structure.
5. Keep null/empty states safe.
6. Add focused automated/static tests where the repository test structure supports them.
7. Do not claim authenticated CRUD is verified without a real authorized test account.
8. Do not create fake accounts, bypass RLS, or store credentials.

## Verification gate
DONE only if implementation + tests + runtime/evidence verification are all available.
Without authenticated runtime evidence, report PARTIAL and identify exactly what remains unverified.

## Handoff
Return only:
STATUS
MODEL_USED
BASE_SHA
HEAD
CHANGED
TESTS
EVIDENCE
RISKS
NEXT

Do not start another task automatically.
