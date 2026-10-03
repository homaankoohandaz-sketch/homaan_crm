# BuildWise AI — Project Management Core

## Purpose
Canonical orchestration layer for project-management capabilities 101–130 without duplicating the existing construction WBS, schedule, hierarchy, and progress modules.

## Composed capabilities
- Project / Complex / Building / Phase / Floor / Unit hierarchy
- WBS validation and dependency graph
- Deterministic schedule generation
- Gantt-ready rows
- Milestone support through WBS type
- Predecessor/dependency relationships
- CPM-style float calculation and critical-path flags
- Versioned schedule baseline
- Actual/baseline variance calculation
- Weighted project progress
- Project status

## Boundary
This layer is a domain model/adapter. It does not claim UI/runtime completion of the full project-management checklist. Dashboard, calendar UI, recovery planning, delay responsibility, revised schedules, multi-version project snapshots, and browser verification remain separate work.

## Acceptance rule
Tasks remain PARTIAL until implementation, focused tests, runtime verification, and UI verification where applicable are completed.
