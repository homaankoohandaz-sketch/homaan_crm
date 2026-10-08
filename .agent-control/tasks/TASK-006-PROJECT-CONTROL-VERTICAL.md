# TASK-006-PROJECT-CONTROL-VERTICAL
status: IN_PROGRESS
verification: CI Unit Tests SUCCESS; Application Validation SUCCESS; QA SUCCESS; Phase Code Map SUCCESS; public Netlify preview reachable; authenticated runtime acceptance pending
progress: project persistence + canonical project-control vertical including WBS/schedule/milestones + schedule/milestone CRUD hardening + canonical progress/KPI snapshot + TDD coverage; runtime/authenticated acceptance pending
2026-10-08 verification cycle: real CI failure found in architecture-contract checklist expectation and schedule-repository test fake client. Architecture test aligned to canonical 850 checklist pointer; fake client gained update() support. Re-run passed Unit Tests, Application Validation, QA and Phase Code Map. Progress KPI delay detection also fixed and covered by test.
depends_on: TASK-004-RLS-ROLE-HARDENING
Goal: make the existing project-control work a coherent vertical slice from project -> WBS -> schedule -> progress.
Acceptance: manager/builder access, CRUD paths, tests and runtime evidence.
