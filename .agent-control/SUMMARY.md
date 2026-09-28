# BuildWise AI — SUMMARY

Updated: 2026-09-28 (Grok Phase04 relational unification)
Branch: buildwise-implementation

## Orientation
1. SUMMARY → MASTER-ARCHITECTURE → NOW → PERFORMANCE (last events)
2. Code truth: this branch for Phase04 domain
3. Live Supabase: runtime tables
4. Never force main

## Phase 04 canonical path (2026-09-28)
UI (project-control + hierarchy bridge)
→ domain model (project-model/wbs/schedule/progress/boq/control)
→ repositories:
  - hierarchy-repository → relational
  - schedule-repository → relational
  - boq-repository → relational
  - procurement-repository → relational
  - project-repository → construction_projects row only (no hierarchy in assumptions)
→ auth via existing supabase client session

## Change ledger
- 2026-09-28 Grok: Phase04 dual-path reduced — hierarchy/schedule/boq repos relational; tests 10/10; UI hierarchy bridge; no production apply.
- Prior entries: see git history.
