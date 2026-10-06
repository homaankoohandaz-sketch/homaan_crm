# Agent Control State

status: CI GREEN | 609-629 VERIFIED | 630 BLOCKED ON PRODUCTION BROWSER | 633-650 INFRA PARTIAL | TASK-ENGINE PURE LAYER ADVANCED BY GROK
project: BuildWise AI
branch: buildwise-implementation
active_task: checklist-633-650
last_batch: 2026-10-04 Grok task-engine audit/reject/notification

## Security 601-608
- 599-600 were not reopened.
- 601-603: implemented and live verified (see prior STATE entries).
- 604 Secret Management: BLOCKED; requires external secret-management access.
- 605 Webhook Secret Remediation: BLOCKED pending controlled secret migration.
- 606-607: PARTIAL; function-by-function SECURITY DEFINER review remains.
- 608 Permission Regression Tests: focused test wired into npm test.

## 609-632 Testing / Release (summary)
- 609-629: verified per prior STATE (unit/architecture/graph/decision/contract/import/project-control/mobile/PWA/portal).
- 630 Production E2E: BLOCKED — needs authenticated browser session; public smoke only on https://buildwise-ai-h.netlify.app.
- 631-632: regression/security suites wired.

## Next action
- Resolve 630 only with real authenticated production browser verification.
- Otherwise continue 633+ infrastructure without false DONE.
- Unified Task Engine pure layer advanced by Grok (2026-10-04); UI bind still open.

## 633-650 Infrastructure (summary)
- 633-643: PARTIAL as previously recorded (GitHub, branch, Actions, Supabase, Edge, schema, graph, AI edge, Pages, Netlify hostname, Cloudflare deferred).
- 644 Cloudflare Workers: TODO — not required by current architecture.
- 645-650: PARTIAL / documented policies; no production DB mutation by Grok batch.

## 2026-10-04 — Grok batch (Task Engine audit layer)
- Agent: Grok (xAI). Commits tagged [grok] on buildwise-implementation.
- task-engine: rejectTask, audit_log on mutations, listDueTodayTasks, listNotificationCandidates.
- task-repository: reject, listDueToday, listNotificationCandidates.
- Local tests PASS. 436 remains PARTIAL. 630 still BLOCKED.
- active_task remains checklist-633-650; architecture next slice Unified Task Engine advanced at pure layer only.
- Evidence: `.agent-control/memory/2026-10-04-grok-task-engine-audit.md`

## Prior STATE history
Full prior sections (Security detail, 609-632 runs, 633-650 detail, Netlify recovery, production smoke reconciliation) remain in git history of this path on buildwise-implementation. Do not compact away evidence; prefer prior commits when expanding.


## 2026-10-06 — Unified Task Engine UI binding
- Active implementation: Task Center UI connected to canonical Task Engine on buildwise-implementation.
- Added src/ui/task-engine-ui.js, Task Center navigation in buildwise-app.js, module load in index.html, and focused test in tests/task-engine-ui.test.js.
- UI actions: create, approve, reject, complete, move to tomorrow, star, reminder.
- Existing public.tasks remains the sole persistence table; no second task engine/table introduced.
- GitHub readback verified. CI/browser runtime evidence not yet returned; status remains IMPLEMENTED / RUNTIME PENDING, not DONE.


## 2026-10-06 — Unified Task Engine → UI → Auth/Permission → Notification
- Canonical Task Engine UI binding is implemented at `src/ui/task-engine-ui.js` and routed from `buildwise-app.js`.
- UI exposes one Task Center for CRM / Construction / Procurement; no second task table was introduced.
- Production Supabase `public.tasks` was extended additively with canonical Task Engine fields including `delegated_by` and `audit_log`.
- Task RLS now scopes reads to task managers or the assigned user; writes are manager-scoped except assigned-user task updates.
- In-app notifications reuse existing `workflow_notifications`; assignment, due-today, overdue and reminder paths are wired.
- Authorization helper functions are internal RLS helpers; public EXECUTE was revoked.
- PR #15 opened for this slice.
- Commit `44498c9`: code/UI slice. Commit `520c52c`: migration persistence.
- CI for `44498c9`: Unit Tests PASS, Application Validation PASS, Worker Runtime PASS, Phase Code Map PASS.
- CI for `520c52c`: migration/application/unit/QA runs are currently in progress.
- NOT DONE yet: authenticated browser/runtime verification on the implementation branch.


## 2026-10-06/07 — Production hardening batch
- Implemented TDD regression coverage for blank Excel rows, module governance, internal-copy leakage, property bulk delete, and duplicate task navigation.
- Import normalization now skips fully blank spreadsheet rows while preserving original source row numbers.
- Canonical `ui_modules` governance remains the single module-control system: manager edit/save/hide/delete.
- Property bulk delete is manager-scoped through `manager_bulk_delete_properties(bigint[])`.
- Removed internal dashboard copy from production UI.
- Confirmed NAV contains a single Task Center entry.
- BuildWise Unit Tests passed on commit `7efadb9`; Application Validation initially failed only because `loadUiModules` had been committed as `async async function`. Corrected in commit `a9144b6`; fresh validation run is executing.
- Runtime authenticated acceptance remains separate and is not marked DONE.


## 2026-10-06 — Production UI / Import Hardening
- User-reported production defects: internal instruction copy visible across UI, duplicate navigation presentation, no manager bulk property deletion, malformed Excel import producing 1,750 property rows, and no manager governance for newly added modules.
- Live Supabase verification found public.properties = 1,750; all 1,750 rows belonged to the malformed 2026-09-23 import window. Import batch #4 recorded 3,750 rows with 1,750 successful / 2,000 failed.
- Removed the 1,750 malformed property rows and marked import batch #4 rolled_back; no owners were attached to those rows.
- Applied live CRM import-quality runtime schema with import_batch_id support and exact batch rollback function.
- Added persistent ui_modules governance with manager-only edit/save/hide/delete RPCs and seeded module registry.
- Added manager property selection, bulk delete, edit and delete controls.
- Excel importer now filters fully blank spreadsheet rows before mapping/insertion.
- Removed the production suite shortcut overlay from index.html; this removes the public Netlify/Showroom/Project Control shortcut injection.
- Removed duplicate mobile navigation strip; bottom navigation is the single mobile navigation surface.
- Bumped service-worker shell cache from v4 to v5.
- Focused source-level syntax verification: buildwise-app.js PASS, src/domains/crm/data-import.js PASS; regression assertions for UI governance/import filtering PASS.
- Public runtime verification used the authenticated BuildWise Production E2E profile and confirmed the profile session is signed in as owner, but the currently published Netlify deployment still served the previous UI. Runtime acceptance of these latest code changes remains PENDING until the implementation branch is deployed.
