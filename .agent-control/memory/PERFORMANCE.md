# Performance Memory — Shared Change Ledger

## CURRENT
status: TASK1 DONE | TASK2 AUTH_VERIFIED | TASK3 AUTH_VERIFIED | TASK4 PARTIAL
head: 3fc155e7058928758d372cac441ef61cfbf8d6ef
active_task: none
last_verified: 2026-09-28
actor: Grok (Execution / Implementation Worker)
next: Master authorize suppliers/PO or Task5; do not auto-start

## REPORT BY GROK (2026-09-28)
All items below were executed by **Grok**, not ChatGPT/Claude.

### 1. Pages / deploy access — by Grok
- Diagnose: branch `buildwise-implementation` overwrote live GitHub Pages (old UI, no hierarchy)
- Fix: `pages.yml` on that branch → deploy only from `main` (+ job guard)
- Redeploy main via workflow_dispatch → success
- Verify browser: tab سلسله‌مراتب + hierarchy-panel.js live
- RESULT: DONE

### 2. Auth runtime verify TASK2/TASK3 — by Grok
- Login owner on live CRM (credentials not stored in repo)
- Project: چوگیا (id=1)
- TASK2: insert/select Complex→Building→Floor→Unit; UI tree render; full cleanup
- TASK3: task + parent_task_id + predecessor_ids; WBS; milestone; Gantt labels; cleanup
- RESULT: AUTH_VERIFIED (TASK2/3 closable as DONE by Master)

### 3. TASK4 BOQ / Procurement slice — by Grok
- Schema probe: project_boq_items, project_procurement exist; no suppliers/PO tables
- Code: project-control.html → shell; logic in project-control-app.js
- UI: BOQ list; wbs_id; procurement required/ordered/delivered + status + boq_item_id + list
- Fix: omit generated columns budget_amount / total_price on insert
- Auth test: BOQ insert + procurement linked to boq_item_id + cleanup OK
- RESULT: PARTIAL (UI+insert OK; suppliers/PO not in live DB)

### 4. Incident recover — by Grok
- Accidental truncated project-control.html push → restored via shell + external app.js
- No secrets committed

### 5. Control plane sync — by Grok
- BRIEF / PERFORMANCE / STATE aligned to verified reality
- Removed stale claims (auth not verified / wrong HEAD)

## LAST EVENTS
2026-09-28 | perf-report | Grok | 3fc155e7 | REPORT | detailed Grok actions in PERFORMANCE | human-readable | no product code | Master read
2026-09-28 | summary-sync | Grok | 3fc155e7 | SYNC | BRIEF+STATE | match runtime | — | Master next
2026-09-28 | TASK4-boq-proc | Grok | c1c29572 | PARTIAL | app.js BOQ/proc; omit generated cols | auth insert+link OK | no suppliers/PO | Master scope
2026-09-28 | pages-access-fix | Grok | main deploy | DONE | feature branch locked out of Pages | hierarchy live | — | —
2026-09-28 | auth-runtime | Grok | live Pages | AUTH_VERIFIED | hierarchy+schedule CRUD | project id=1 | secrets not stored | TASK2/3 DONE-ready

## RULE
Append one compact event after each meaningful change. Keep latest 5.
Never store passwords or tokens.
Always attribute actor (Grok | ChatGPT | Claude).
