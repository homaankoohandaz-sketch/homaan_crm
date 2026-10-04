# 2026-10-04 — Integrity + Unified Task Engine calendar queries

Branch: `buildwise-implementation` only.

## Done this batch
1. Restored `tests/unit/market-intelligence.test.mjs` against existing `src/domains/intelligence/market-intelligence.js` (9/9 PASS). Wired in package.json. No second intelligence module.
2. Extended existing `src/core/task-engine.js` with:
   - listTasksForDay
   - listTeamTasksForDay
   - listOverdueTasks
   - listStarredTasks
   - listTasksByContext
   No second task system/table/calendar.
3. Focused tests in existing `tests/task-engine.test.js` PASS (contract + mutation + calendar).
4. Public production smoke (SUMMARY URL): https://buildwise-ai-h.netlify.app — landing + project-control OK.

## Still blocked / partial
- 630 authenticated Production E2E: BLOCKED (no auth session).
- Unified Task Engine UI binding: still open.
- active_task remains checklist-633-650.

## Commits
- market-intelligence test + package.json wire
- task-engine calendar helpers `8b1b4eaf`
