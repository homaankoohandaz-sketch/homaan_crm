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

## 2026-10-07 — Production data cleanup + latest runtime gate
- Re-checked live Supabase before cleanup: public.properties contained 1,729 rows, all with generated IMP-* property codes from the malformed 2026-09-23 15:32 import window; 0 had owner name, mobile, total price, or price-per-meter; only 4 had land_area and 1,255 had a street value. This is not valid CRM property data.
- The 1,729 malformed live property rows were deleted using the exact import-window + generated-code + empty-owner/contact/pricing predicate. No property images, photos, documents, followups, market observations, deals, tasks, promotions, construction projects, matches, valuations, or alerts referenced those rows. One old customer_shares test record referenced a malformed property; its FK is ON DELETE SET NULL, so the property cleanup did not orphan a blocking child record.
- Post-cleanup verification is required before marking the data-cleanup item DONE.
- CI for commit 5bd06d4 is GREEN: Agent Control Plane Validation, Application Validation, BuildWise QA, Phase Code Map, Supabase Migration Gate, and BuildWise Unit Tests all completed successfully.
- Netlify Deploy Preview for 5bd06d4 is successful at https://deploy-preview-15--buildwis-ai.netlify.app.
- Public runtime smoke on the latest deploy preview confirmed BuildWise AI branding, all four role choices, and absence of internal instruction/debug/production-suite/duplicate-mobile-navigation leakage.
- Authenticated production/runtime acceptance is still BLOCKED on a signed-in browser session; Browser Context Profiles currently report no signed-in site. No authenticated DONE claim is made.

## 2026-10-07 — Post-Task-Engine project-control slice
- Started the next canonical slice: Project Persistence → Schedule/Milestone → Progress/KPI.
- Added `src/domains/construction/project-control-repository.js` as the single vertical adapter over canonical project, schedule and progress repositories; no parallel persistence table introduced.
- Construction project UI persistence in `src/domains/construction/browser-adapter.js` now routes project listing/creation through `createProjectRepository`.
- Added TDD coverage for vertical snapshot loading, project update isolation, and creator persistence.
- PR #16 contains the slice. CI/runtime/authenticated UI evidence is not yet available from the connected GitHub write path; therefore no DONE claim is made.
- Next execution path remains the same canonical branch and same repository; continue schedule/milestone → progress/KPI implementation without creating a second engine.

## 2026-10-08 — Post-Task-Engine project-control continuation
- Current implementation head includes WBS in the canonical project-control vertical.
- No runtime/authenticated DONE claim: connected GitHub reports no workflow runs for current HEAD.
- Existing PR #16 remains the single integration path.

## 2026-10-08 — Full project-control phase verification cycle
- Project-control phase is implementation/test verified on `buildwise-implementation`.
- Canonical vertical now contains project, WBS, schedule tasks, milestones, progress and KPI snapshot.
- Delay detection uses forecast/actual finish where available.
- CI green after two real failures were diagnosed and corrected.
- Runtime authentication is the remaining acceptance gate.


## 2026-10-08 — Procurement Control Vertical 131–160
- Procurement planning logic and persistence path are now connected through canonical `createProjectProcurementControlRepository`.
- Canonical Project Control vertical now exposes procurement alongside project/WBS/schedule/milestones/progress/KPI.
- Focused procurement repository contract added.
- CI on implementation branch is GREEN: Unit Tests, Application Validation, QA, Phase Code Map, Agent Control Plane Validation.
- Public Deploy Preview remains reachable and branded correctly.
- Authenticated procurement UI/runtime acceptance remains pending; 131–160 stay PARTIAL.
- Next action: authenticated runtime gate for the canonical project-control/procurement flow, then continue to the next coherent phase.


## 2026-10-08 — Procurement Control Vertical 131–160
- Canonical procurement planning/persistence is connected through `createProjectProcurementControlRepository`.
- Project Control now exposes procurement alongside project/WBS/schedule/milestones/progress/KPI.
- Focused repository TDD coverage added.
- CI GREEN: Unit Tests, Application Validation, QA, Phase Code Map, Agent Control Plane Validation.
- Public Deploy Preview smoke is reachable; authenticated procurement runtime/UI acceptance remains pending.
- Checklist 131–160 remain PARTIAL until authenticated runtime/UI verification.
- Next action: authenticated runtime gate, then continue to the next coherent phase.


## 2026-10-09 — Security documentation registered (implementation evidence pending)
- Added: `docs/security/security.md`, `auth.md`, `data.md`, `hack.md`, `checklist.md`.
- Architecture entry point: `docs/SECURITY-ARCHITECTURE.md`.
- Updated canonical architecture, decision ledger and summary to point to the standard.
- Status: DOCUMENTATION REGISTERED; SECURITY AUDIT / CODE FIXES / SUPABASE LIVE POLICY VERIFICATION / AUTHENTICATED RUNTIME remain unverified unless separately evidenced.
- Do not promote security-related checklist items to DONE based on documentation alone.
