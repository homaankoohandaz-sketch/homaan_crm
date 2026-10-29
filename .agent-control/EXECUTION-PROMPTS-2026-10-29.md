# BuildWise — Unified Execution Prompt Pack
Date: 2026-10-29
Canonical branch: `main`
Canonical checklist: `.agent-control/MASTER-CHECKLIST-v3-850.md`
Canonical state: `.agent-control/STATE.md`
Canonical source-of-truth: `BUILDWISE-SINGLE-SOURCE-OF-TRUTH.md`

## Operating instruction

Act as the implementation agent for BuildWise AI / REOS. Execute work directly in the existing repository and the current `main` line. Do not stop at advice, mockups, or a plan when the task can be implemented with available access. Do not wait for optional architectural approval or use architecture wording as a reason to avoid ordinary experimental implementation. Keep the existing architecture where it works; do not create duplicate engines, tables, routes, or competing sources of truth. Do not rewrite or delete migrations, bulk-transform production data, expose secrets, or weaken authentication/RLS. When a needed external credential or authenticated runtime is unavailable, complete all safe work possible and report the exact remaining external action.

### Required execution loop for every checklist item
1. Read the item and relevant canonical docs, existing implementation, tests, database schema, and history before editing.
2. Search for an existing implementation before adding a new one. Reuse canonical modules and shared contracts.
3. Convert the requirement into a failing regression test or acceptance test first where feasible.
4. Implement the smallest complete change in the canonical files. Keep Persian RTL, accessibility, mobile layouts, and reduced-motion behavior where applicable.
5. Run targeted tests, then the relevant broader validation commands. Fix failures caused by the change.
6. For database work, compare local SQL migration history with the live Supabase migration ledger and schema first. Add forward-only migrations; never guess missing migration history or mutate live data without a verified backup and explicit authorization.
7. For UI work, run browser-level checks when available: authenticated and unauthenticated states, loading/empty/error/success states, desktop/mobile, keyboard/accessibility, and console/network errors.
8. Update the exact checklist IDs with evidence: commit SHA, files, test command and result, runtime evidence, known gaps. Do not report completion based on code presence or a passing unit test alone.
9. Commit coherent batches to `main` when repository access permits. Never force-push or rewrite shared history. If changes originate on a divergent branch, compare first and selectively port non-conflicting changes; do not merge an old branch wholesale merely to reduce the commit count.
10. Finish with a concise report: landed SHA, changed files, tests, browser/runtime status, database status, deployment URL/SHA, unresolved blockers, and next concrete task.

## Master prompt — apply to all remaining checklist items

Read the entire `.agent-control/MASTER-CHECKLIST-v3-850.md` and identify every item marked PARTIAL, TODO, or BLOCKED. Do not assume historical counts are current. Produce a current inventory of remaining IDs and map each to: canonical module, actual implementation status, dependency, risk, acceptance test, and evidence required. Then execute in dependency order in batches, not just produce another plan. For each item, inspect the code and live data before deciding whether it is missing, partial, duplicated, or implemented but unverified. Preserve existing user data and public APIs. Do not create parallel implementations. Do not claim DONE without passing acceptance criteria. Continue automatically through safe, independent tasks; only pause when a required credential, irreversible/destructive operation, or decision that only the user can make is genuinely required.

## Workstream prompts

### A. Core REOS, entity graph, decision loop — checklist 003–030
Inspect and complete entity resolution, persistent graph storage, graph synchronization, opportunity/matching/deal intelligence, valuation/scenario/risk/ROI, contract/construction/sales/finance/control engines, AI decision and action layers, human approval, audit/versioning, permissions, agent/tool registries, and the master decision loop. Use one canonical identity and relationship model across person, owner, buyer, investor, builder, supplier, contractor, property, land, project, unit, deal, contract, and money. Add idempotent synchronization and provenance. Prevent duplicate entities from phone/name alone; preserve ambiguous matches for review. Every recommendation must expose source data, assumptions, confidence/uncertainty, and a traceable explanation. Critical actions require explicit permission and human approval. Add tests for duplicates, cycles, stale links, partial failures, retries, permission denials, audit history, and rollback-safe recovery. Connect INPUT → IDENTIFY → UNDERSTAND → ANALYZE → MATCH → CALCULATE → SIMULATE → RECOMMEND → APPROVAL → EXECUTE → MONITOR → MEASURE → LEARN with persisted evidence.

### B. CRM, import, search, audit and data quality — checklist 031–065
Complete people/owner/buyer/investor/builder/supplier/contractor/property/land/lead/request/deal/contact records, global search, advanced filters, Excel and Google Sheets imports, multi-sheet imports, preservation of every source column and row, raw source preservation, import batches, duplicate detection, activity timeline, exports, backups, manager editing/audit, import preview/validation/rollback, isolated row errors, and a data-quality dashboard. Reconcile legacy and new tables before moving records. Never discard source columns or silently drop rows. Normalize Persian/Arabic digits and phone formats without using them as the sole merge key. Imports must be idempotent, resumable, explain rejected rows, and provide a dry-run preview plus rollback strategy. Test empty/malformed files, duplicate rows, multiple sheets, large imports, partial failures, permissions, and exact source-to-destination row counts.

### C. Real-estate intelligence, valuation and market data — checklist 066–100
Complete land analysis, feasibility, evidence-backed municipal regulations, participation/barter/investor/builder/supplier/property matching, opportunity radar, comparable evidence, ROI/profit scenarios, gold/dollar comparisons, historical and live market snapshots, forecast charts, liquidity/risk analysis, timestamps and proposal-ready investment analysis. Every market datum must carry source, timestamp, currency/unit, geography, and freshness. Distinguish observed values from estimates and scenarios; never present forecasts as guarantees. Validate formulas with fixtures and independent hand calculations. Handle missing/stale/outlier data and currency/unit conversions. Persist inputs and scenario versions so results are reproducible. Provide explicit assumptions, sensitivity analysis, and source evidence in exported reports.

### D. Project planning and schedule control — checklist 101–130
Complete the project/complex/building/phase/floor/unit hierarchy, dashboard, master plan, calendar, WBS, schedule, Gantt, milestones, dependencies, critical path/CPM, float, baseline, actual-vs-baseline, schedule variance, progress/earned progress, delay detection/reason/responsibility, recovery plans, revised schedule, versions, snapshots and status. Maintain one canonical project hierarchy and stable IDs. Validate dependency cycles, date arithmetic, calendars, predecessors/successors, baseline comparisons, and progress rollups. Changes to the master schedule must be auditable and versioned. Test realistic multi-phase projects and edge cases; verify authenticated browser workflows, not only model-level tests.

### E. Procurement and materials — checklist 131–160
Complete procurement master plan, material list/BOQ integration, purchase schedule, required/order/delivery dates, suppliers and comparison, purchase requests/approvals/orders, delivery and partial delivery, inventory/consumption/shortage alerts, purchase-date and current prices, variance/history, Toman and USD equivalents, source/timestamp, forecast, optimal timing and procurement risk. Connect each purchase to project, WBS, budget, supplier, approval, delivery, invoice/ledger and inventory movements. Prevent duplicate orders and negative inventory from retries. Keep quoted, committed, received, consumed and paid quantities/amounts distinct. Test partial delivery, price changes, cancellation, supplier substitution, approvals and reconciliation.

### F. AI project control and scenario simulation — checklist 161–190
Complete schedule/delay/dependency/critical-path/procurement/shortage/cost-overrun/recovery/parallel-work/team-conflict/workfront/crew/resource/space/equipment/material interference analysis, zoning/trade sequencing, what-if simulations, schedule optimization and cost-time trade-offs. Recommendations must be explainable, grounded in project data, and explicitly marked as suggestions. Simulation must run on an isolated copy and never silently alter the master schedule. Add confidence and missing-data warnings. Require human approval for critical changes and record the before/after state, approver and rationale. Test impossible constraints, missing inputs, conflicting resources, unsafe parallel activities and rollback after rejected recommendations.

### G. Project accounting and finance — checklist 191–220 and related finance items
Inspect the checklist for the exact scope and complete project ledger, cash/bank accounts, original/revised budget, actual/committed/forecast/remaining/total cost, allocation by WBS/phase/floor/unit/contractor/supplier/material, receivables/payables, claims, payments, cash flow, profit, ROI, and reconciliation. Use decimal-safe money arithmetic and explicit currency/FX timestamps. Separate budget, commitment, invoice, payment and actual cost. Enforce project-level authorization and auditability. Test partial payments, reversals, duplicate callbacks, cost reallocations, budget overruns, rounding and ledger reconciliation. Do not fabricate accounting entries or migrate historical financial data without reconciliation.

### H. Customer experience, portal, notifications, tasks and automation — checklist 221–300 and matching CX/task IDs
Inspect exact IDs in the master checklist, then complete public/customer portal, role-aware views, consent, contact flows, notifications, reminders, shared task engine, task assignment/status/priority, activity history, automation triggers, retries, idempotency, and contextual AI access. Treat UI hiding as presentation only; enforce authorization server-side and in RLS. Escape untrusted HTML and prevent XSS. Do not expose private owner/client data through public routes or search. Test role isolation with distinct users, anonymous access, expired sessions, notification retries, timezone handling, duplicate events and audit logs.

### I. Plan/document intelligence and visualization — checklist 301–312 and related plan/visualization IDs
Complete file ingestion, PDF/image/DXF parsing, OCR, drawing metadata, geometry extraction, measurement units, scale detection, floor/room/door/window/wall extraction where supported, 2D/3D visualization and links to project units and BOQ. Preserve original files and parser provenance. Detect unsupported or low-confidence extraction and ask for review rather than inventing dimensions. Validate scale/units against known fixtures. Use permissively licensed dependencies and record license/source. Handle malformed, oversized and malicious files safely. Ensure the viewer degrades gracefully when parsing fails.

### J. Market intelligence, content, mobile/PWA, security, performance and production hardening — checklist 313–850
Read the exact remaining checklist sections and preserve their item IDs; do not skip items because the range is broad. Implement in coherent sub-batches covering market history/data, content system and bots, project-result and floor-pricing views, landing/gateway, mobile/PWA/portal, import quality, regression/security governance, SECURITY DEFINER grants and function-body review, RLS policies, unindexed foreign keys, password policy, public activity-log policies, query performance, and production hardening. For each item, derive a focused prompt from the literal checklist requirement, inspect the current implementation, add a regression test, implement, run the relevant test suite, and record evidence. Never weaken RLS or authentication to make a test pass. Do not apply blanket index/policy changes without query-plan and behavior checks. Security findings must be classified as confirmed issue, false positive, or needs investigation with evidence.

## Mandatory cross-system reconciliation prompt

Compare `main`, all active feature branches, GitHub PRs/commits, the live Supabase migration ledger and schema, the deployed Netlify commit, and the current checklist. Build a matrix of branch/ref → commit SHA → changed files → already present in main? → conflict/regression risk → tests → recommended action. Main is canonical, but do not assume every branch has been merged. Do not merge a branch wholesale if it is substantially behind/diverged. Port only verified unique changes, one coherent batch at a time. For Supabase, compare every recorded migration version to the corresponding SQL file and checksum; do not invent or delete migration history. For Netlify, verify deployed commit SHA and the exact URL. After any merge/deploy, re-fetch the commit and deployment metadata to prove the result.

## Completion report template

- Checklist IDs handled:
- Main commit SHA and URL:
- Files changed:
- Tests run and exact results:
- Browser/runtime evidence:
- Supabase schema/migration findings:
- Deployment URL and deployed SHA:
- Remaining items and reason:
- Next batch:

A commit is not proof of a completed feature. A green unit test is not proof of authenticated runtime behavior. Keep working through safe tasks and report the truth of the evidence.


## Command 1 — Extract executable instructions from a specific commit

Use this prompt with a commit SHA, commit URL, or branch/ref:

> You are the BuildWise commit-audit and task-extraction agent. Repository: `homaankoohandaz-sketch/homaan_crm`. Canonical integration branch: `main`.
>
> Target commit/ref: `<PASTE_SHA_OR_URL_HERE>`.
>
> Inspect the target commit's metadata, full diff, changed files, parent/merge-base, adjacent commits, related tests, linked issues/PRs, and relevant canonical docs. Also inspect current `main` before classifying any work as missing. For each change, extract:
> 1. Explicit instructions, decisions, TODOs, FIXMEs, acceptance criteria, and follow-up work stated in the commit message, diff, comments, tests, docs, and linked work items.
> 2. Implicit required work evidenced by incomplete code paths, missing tests, broken references, unhandled errors, stale docs, migration mismatches, deployment drift, or incomplete user workflows. Clearly label inferred items separately from explicit instructions.
> 3. Files changed and behavior changed; dependencies; security/data risks; duplicate or superseded work; tests that exist and tests missing.
> 4. Whether each item is already in current `main`, partially present, absent, superseded, conflicting, or cannot be verified. Compare actual file contents and history; do not rely on branch names or commit messages alone.
> 5. One actionable task per row with a stable task ID, priority (P0–P3), exact paths, dependency, implementation instruction, acceptance criteria, test command, runtime evidence needed, and recommended destination.
>
> Output an extraction ledger with columns: ID | origin SHA/path/line | explicit or inferred | instruction/task | current-main status | dependencies | risk | acceptance test | evidence | recommended action.
>
> Do not implement during extraction. Do not mark a task DONE because code exists. Do not infer that a branch must be merged. Preserve user data, secrets, migrations, RLS, and authentication. Finish with a prioritized execution queue and a list of unresolved questions that truly require human input.

### Expected extraction output

Save the results as `.agent-control/extractions/<short-sha>-instructions.md` when repository write access is available. Include the target SHA, extraction date, current `main` SHA, file list, task ledger, evidence links, and a clear distinction between explicit and inferred instructions. Avoid duplicating tasks already tracked in the master checklist; link to their existing checklist IDs.

## Command 2 — Execute the extracted instructions

Use this prompt after reviewing the extraction ledger:

> You are the BuildWise implementation agent. Repository: `homaankoohandaz-sketch/homaan_crm`. Canonical branch: `main`. Extraction ledger: `.agent-control/extractions/<short-sha>-instructions.md`. Execute every safe, actionable task in the ledger; do not stop after writing a plan.
>
> Start by fetching current `main` and the ledger again. Recheck each task against current code so work already completed is not repeated. Order work by dependencies and risk. Implement independent tasks in coherent batches; keep edits small and attributable. For every task:
> 1. Inspect the existing implementation and relevant callers before editing.
> 2. Add or update a regression/acceptance test first when feasible.
> 3. Implement in the canonical module; do not create duplicate engines, schemas, routes, or competing sources of truth.
> 4. Run the targeted test and relevant suite; fix regressions introduced by the change.
> 5. For UI work, verify real browser behavior where runtime tools are available, including mobile, RTL, accessibility, empty/error/loading states, and console/network failures.
> 6. For Supabase work, inspect the live schema and migration ledger first. Use forward-only migrations. Do not rewrite migration history, apply speculative schema changes, delete data, or weaken RLS/authentication. If a destructive operation or credential is required, complete safe preparatory work and report the precise external blocker.
> 7. For branches, compare base/head and identify unique commits/files. Port only changes that are not already in `main`; resolve conflicts deliberately. Never force-push or rewrite shared history. Do not merge a divergent branch wholesale merely to reduce the number of commits.
> 8. Update the extraction ledger and canonical checklist with evidence, not assumptions. Record task status as implemented, tested, runtime-verified, blocked, or not applicable; these statuses are distinct.
> 9. Commit coherent changes to `main` when authorized repository tools permit. After committing, fetch the commit and changed files to verify the result.
> 10. If deployment access exists, deploy only after the relevant tests pass, then fetch deployment metadata and verify the deployed SHA and URL. Never claim deployment based on a GitHub commit alone.
>
> Continue through all safe tasks without waiting for optional architectural sign-off. Do not bypass security, data-integrity, test, or human-authorization requirements. Do not fabricate success if a tool, credential, test runner, or browser is unavailable.
>
> Final report must list: task IDs completed; commit SHA/link; changed files; exact test commands/results; browser/runtime evidence; Supabase migration/schema status; deployed URL/SHA; remaining tasks and concrete blockers. Then continue with the next safe batch rather than ending at a status report.

## Command 3 — One-shot combined extraction and execution

> In `homaankoohandaz-sketch/homaan_crm`, inspect target commit `<SHA_OR_URL>`. First produce and save a traceable extraction ledger of every explicit instruction and evidence-supported inferred follow-up, comparing all work against current `main`. Then execute the extracted tasks in dependency order, skipping only tasks proven already complete or tasks genuinely blocked by missing external access, credentials, or required human authorization. For each task, inspect current code, add regression tests, implement, run tests, update the canonical checklist/ledger, and commit coherent changes to `main`. Reconcile branches by selective porting, not blind merging. Protect production data, secrets, RLS, authentication, and migration history. Verify each resulting commit and, when possible, the actual deployed SHA. Do not stop at a plan, do not mark work DONE without evidence, and report every unverified or blocked item precisely.

## Default execution order

1. Identify target commit and current `main` SHA.
2. Extract explicit instructions and evidence-based inferred work.
3. Compare extracted items against current `main`, checklist, open issues/PRs, and deployment.
4. Deduplicate and order by dependencies and risk.
5. Execute tests-first implementation in safe batches.
6. Reconcile schema/migrations without destructive guessing.
7. Commit to `main`, verify SHA and changed files.
8. Verify deployment separately.
9. Update task ledger and report remaining work.
