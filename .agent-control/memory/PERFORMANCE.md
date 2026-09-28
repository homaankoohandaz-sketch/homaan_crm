# Performance Memory — Shared Change Ledger

## CURRENT
status: TASK1 DONE | TASK2 AUTH_VERIFIED | TASK3 AUTH_VERIFIED | TASK4 PARTIAL
head: 7debd9b27d233ea86cbca4a6613a6ef22adaa473
active_task: none
last_verified: 2026-09-28 Grok — auth CRUD hierarchy/schedule/BOQ/procurement; Pages main-only
next: Master authorize suppliers/PO or Task5; do not auto-start

## LAST EVENTS
2026-09-28 | summary-sync | Grok | 7debd9b2 | SYNC | BRIEF+PERFORMANCE+STATE | match verified runtime | no code change | Master next
2026-09-28 | TASK4-boq-proc | Grok | c1c29572 | PARTIAL | app.js BOQ/proc lists+fields; omit generated cols | auth insert+link+cleanup OK | no suppliers/PO tables | Master scope
2026-09-28 | pages-access-fix | Grok | main deploy | DONE | feature branch cannot overwrite Pages | hierarchy+TASK3 live | — | —
2026-09-28 | auth-runtime | Grok | live Pages | AUTH_VERIFIED | hierarchy+schedule CRUD UI/DB | project چوگیا id=1 | secrets not stored | TASK2/3 closable DONE
2026-09-26 | TASK2-hierarchy | Grok | migration | APPLIED | project_hierarchy | Master FK OK | — | —

## RULE
Append one compact event after each meaningful change. Keep latest 5.
Never store passwords or tokens.
