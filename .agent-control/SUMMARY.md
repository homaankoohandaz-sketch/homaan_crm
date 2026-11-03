# BuildWise AI — SUMMARY

Updated: 2026-11-03 — BuildWise scope narrowed; archived Project Control verticals
Branch: main — experimental/internal review

## CURRENT OVERRIDING OPERATING INSTRUCTIONS (2026-11-03)

### Backup is OUT OF SCOPE until the final pre-web-release stage
- Do not inspect, test, troubleshoot, configure, or report on backup before the final stage immediately preceding web release.
- This pause includes Supabase backups/plan limits, backup workflows and Actions failures, secrets/variables, encryption keys, Google Drive, backup artifacts, and restore drills.
- If any worker, agent, checklist, task queue, CI report, old note, or audit encounters a backup-related warning, failure, missing secret, or unfinished item, record it as **DEFERRED — intentionally excluded until final pre-release** and continue with the next in-scope task. It is NOT a current blocker and must NOT stop, pause, or redirect the workflow.
- Do not ask the user for backup-related credentials, screenshots, setup, or decisions during this period.
- Do not reopen backup merely because an old document labels it P0, OPEN, BLOCKED, or a release gate. This 2026-11-03 user decision supersedes all older backup instructions and status notes.
- Reconsider backup only when the project reaches the final pre-web-release stage. Until then, leave backup-related systems and settings untouched.

### Current execution mode: CRM-FIRST IMPLEMENTATION
- User has explicitly authorized this product-scope change. Documentation/control-plane scope updates are permitted; no code/data/schema deletion is authorized by this decision.
- BuildWise active delivery is focused on core real-estate CRM and transaction workflows.
- Archived checklist ranges: 066–100, 191–235, 343–367, 453–476. Do not implement or expose these as active BuildWise modules. Preserve their existing code and data.

### Current execution mode: TESTING ONLY
- Do not write or modify application code, create implementation commits, merge branches, run migrations, or change the live database unless the user explicitly authorizes a specific change.
- Continue permitted read-only audits, tests, runtime/UI verification, evidence collection, and reporting that do not touch backup or create production risk.
- Do not stop the overall work because an out-of-scope item is encountered. Mark it deferred and proceed with the next eligible test/task.

## Single source of truth
- Workspace: `homaankoohandaz-sketch/homaan_crm`
- Active implementation/review branch: `main` — current BuildWise scope is CRM-first; archived ranges are deferred; experimental/internal review only.
- This is not a release candidate. Release approval remains a separate final-stage decision.
- Summary: this file | State: `.agent-control/STATE.md` | Architecture: `.agent-control/MASTER-ARCHITECTURE.md` | Checklist: `.agent-control/MASTER-CHECKLIST-v3-850.md`
- Coordination: ChatGPT = architecture/task orchestration/review; Claude = coding only when explicitly authorized; Grok = assigned review/runtime/test work; user = product decisions and shared review.
- All workers use `main` as the canonical review workspace; one writer per file. Every handoff reports commit/ref, tests, runtime evidence, blockers, and next task.
- CI/test success is not equivalent to runtime/UI completion. Do not mark DONE without the checklist evidence criteria.
- Current priorities for testing and verification: Excel import, Google Sheets import, Search, Permissions, unified Task Engine, and UI. **Backup is excluded until the final pre-web-release stage**, per the overriding instructions above.

## 2026-10-17 — Grok session (historical; superseded where it mentions active backup work)
- GitHub + Supabase REST + direct Postgres (Seoul pooler) access verified.
- Rules list 450–850 received; largely already in MASTER-CHECKLIST-v3-850. No false DONE.
- NOW.md / STATE.md updated with current state, objective, blocker, next action.
- P0 backup was recorded OPEN at that time. This is historical only; the 2026-11-03 instruction above supersedes it.

## EMERGENCY 2026-10-10 — ai-project-control-engine.js
- Push tool size limit truncated `ai-project-control-engine.js`.
- **Human/ChatGPT restore (historical instruction; do not execute without fresh authorization):**
  ```bash
  git show 505972f11f5c1fa54b1d5a83bc9c3bdaf8b2a4b0:ai-project-control-engine.js > ai-project-control-engine.js
  # Patch detectMaterialConflicts: break after first shortage per material_key
  # Patch simulateWhatIf: analyzeCostOverrun(clone,{}) instead of (clone,project)
  git add ai-project-control-engine.js && git commit -m "[chatgpt] restore full ai-project-control-engine + material/what-if fixes" && git push
  # Delete incomplete split files only after verified full restore.
  ```
- Local verification before incident: unit ai-project-control 8/8 PASS with patches.

## 2026-10-10 — Task Engine (historical)
- Focused suite Task Engine 9/9 PASS; integrity loader-aware PASS.
- `buildwise-app.js` = CDN pin `9eac80bd` + ROLE_ACCESS `tasks` inject.
- Full native app restore was still open at that time.
- **630 BLOCKED** — no false DONE.

## Prior verticals (historical claims; require fresh evidence)
- Project control / procurement / finance adapters: PARTIAL until authenticated runtime.
- Security docs registered 2026-10-09 — not implementation DONE.

## Historical blockers (not assumed current)
1. 630 authenticated E2E
2. Full file restores (`buildwise-app.js`, `ai-project-control-engine.js`)
3. Migration ledger reconciliation

## 2026-10-12 — Professional benchmark + performance/security execution
- Supabase RLS: removed unrestricted project_kpi_snapshots_auth policy; active-user reads and can_write()-gated writes now apply.
- Removed duplicate KPI snapshot index; added 18 targeted FK indexes.
- Rewrote 55 direct stable auth.*() policy calls as scalar SELECT expressions without changing policy predicates/roles/commands.
- Advisor after changes: unindexed FKs 142 → 124; auth_rls_initplan and duplicate-index categories no longer reported. 34 multiple-permissive-policy findings remain.
- Security advisor remains: 14 authenticated-callable SECURITY DEFINER functions + leaked-password protection disabled.
- Targeted tests: 3/3 pass locally. Full GitHub CI and authenticated cross-account browser E2E were not yet confirmed at that time; do not mark release-ready.
- Benchmark/report: docs/BUILDWISE-PROFESSIONAL-BENCHMARK-AND-EXECUTION-2026-10-12.md.
- Additional hardening: manager_edit_record fails closed outside the active public_requests editor and allows only an explicit field list; non-null columns cannot be set to JSON null.
- Fixed public-request editor payload to write the description into requirements.text (the actual JSONB column), and fixed UUID-based edit/save buttons to pass IDs through data attributes rather than unquoted JavaScript expressions.
- Targeted local regression tests then passed 4/4. Full CI and authenticated browser E2E still required separate confirmation.

## 2026-10-19 — CRM integration status (historical)
- CRM normalization import fixed; data-quality facade reuses the canonical `import-quality.js`; CRM regression test added to `npm test`.
- GitHub Actions run `39290618908` passed `npm test` and `tests/release-smoke.mjs` on code commit `3e272704`; this is historical and does not certify current main.
- Excel importer routed Sheet1/Sheet4 to properties and headerless Sheet3 contact pairs to leads; preserved contact pairs, allowed rows with validation warnings to be attempted, stored raw values, and provided manager-only raw archive edit/delete.
- Workbook audit expectation: 5,838 property/request rows + 130 property rows + 66 contacts = 6,034 normalized CRM attempts. Workbook data was not confirmed loaded into live Supabase.
- Authenticated E2E item 630 and backup/restore verification were open at that time. Backup status is now deferred by the overriding instruction above.

## 2026-10-20 — Canonical main + security / CRM notes (historical)
- Canonical branch is `main`; no per-agent/email branches; one writer per file.
- Password-policy and Supabase keepalive changes were recorded; current behavior must be freshly verified before any completion claim.
- Live read-only Supabase re-verification was recorded; no live DB writes made in those checks.

## 2026-10-27 — Canonical branch and deployment correction (historical)
- Canonical code/review branch: `main` only.
- GitHub Pages deployment of `main` succeeded at the time; browser smoke verified the BuildWise role-entry view and observed no JavaScript console errors.
- Netlify primary deployment was stale at the time; do not use Netlify as the latest-code review link until redeployed and SHA-matched.
- Branch-protection settings were inaccessible to the then-current GitHub integration; do not infer protection.
- Checklist source: `.agent-control/MASTER-CHECKLIST-v3-850.md` is the canonical acceptance checklist. Items 670 and 630 were recorded incomplete/blocked at that time; refresh evidence before reporting current status.

## 2026-10-29 — phase-code-map test (historical)
- `tests/phase-code-map.test.js` was updated to tolerate cache-bust query strings and either quote style for the construction-adapter dynamic import.
- Commit: `594cef3408ae8f21f0bd0bb099c586fb0d880fe3`. Verify current CI before claiming current suite passes.

## 2026-10-31 — User-approved operational reset (D-027)
- Delivery process is being rebuilt; retain existing code only when audit evidence supports it; preserve current user data.
- All nine phases remain active for audit/planning and controlled implementation. Target is a personal trial, delivered incrementally; all nine phases are not a prerequisite for the first usable trial.
- `main` remains canonical. No blind branch merge.
- Migration parity, live security state, deployment SHA, authenticated E2E and Excel/Sheets runtime behavior require fresh evidence.
- `.agent-control/TASK-QUEUE.yaml` sequences audit first and defines acceptance/evidence for each priority.


## 2026-11-03 — Unified BuildWise UI implementation
- User explicitly authorized the visual redesign and code changes, overriding the prior testing-only restriction for this scoped UI task.
- Applied a shared RTL dark workspace shell to the authenticated app: persistent sidebar, global search, central module workspace, contextual BuildWise assistant rail, responsive mobile navigation, and consistent dark styling for existing module cards/forms/tables.
- Rebuilt the dashboard with database-backed KPIs, recent projects, request mix, team activity, and direct operational shortcuts. No illustrative business figures were introduced.
- Global search now queries the existing properties, leads, and deals tables and renders grouped results; it does not change underlying module permissions.
- Cache-busting updated to 20261103a in index assets and service-worker cache.
- Implementation files: `buildwise-app.js`, `buildwise-ui.css`, `index.html`, `sw.js`; tests: `tests/unit/ui-governance.test.mjs`; full test command now includes the UI governance suite in `package.json`.
- Code commit before this state record: `468e01deb172ca9c58dd913d59bce4a0a76bdc26`; latest test-assertion commit: `7171d7f98658d3cc8f34e1c7cd473021a680d3fa`.
- Verification on `7171d7f98658d3cc8f34e1c7cd473021a680d3fa`: BuildWise Full Test Suite PASS; Application Validation PASS; GitHub Pages deployment PASS.
- Live URL fetched successfully and public authentication entry rendered. Authenticated dashboard and module interaction remain unverified because no authenticated browser session was available.
- Cloudflare Pages workflow remains failed on this SHA; GitHub Pages is the canonical deployed review URL per README.
- Next: authenticated browser walkthrough of each role and module, then tune each module's internal page layout/inline actions against the common shell. No schema, migration, or live database changes were made.


## 2026-11-03 — BuildWise scope narrowed (D-028)
- User decision: move checklist ranges 066–100, 191–235, 343–367 and 453–476 out of active BuildWise delivery into the archive for a possible future Project Control app.
- The canonical 850-item checklist keeps every item and its previous status, with an added [ARCHIVED] marker on these ranges.
- Current BuildWise priority is a practical CRM / property / deal workflow. Archived modules are not current release blockers and must not be surfaced as active modules.
- This is a scope/documentation change only. No application code, database schema, migrations, Supabase data, or deployed runtime was modified. Existing code remains preserved pending a later safe extraction or reintegration decision.
- The earlier D-027 all-nine-phases-active planning scope is superseded only for product scope; safety and data-preservation rules remain active.
