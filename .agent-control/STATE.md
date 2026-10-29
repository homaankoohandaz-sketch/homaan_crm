## EXECUTION GATE CLARIFICATION — 2026-10-29

- **Experimental/internal execution gate: OPEN.** Claude and other authorized workers should proceed immediately with the real test suite, advisor parsing, live-site checks, bug fixes, and non-destructive integration work. Do not pause ordinary development merely because the production release gate is blocked.
- **Production release gate: remains BLOCKED until evidence closes the release criteria.** This is not permission to label the product release-ready, skip failed tests, bypass access controls, or perform unsafe production database changes.
- Record test results, advisor findings, live URL/runtime observations, exact commit SHA, and unresolved blockers. Fix what can be fixed safely; continue independent work while any external credential or human approval is pending.

# Agent Control State

## CURRENT OPERATING MODE — 2026-10-20 (OVERRIDES OLDER RELEASE-ORIENTED NOTES)

- Active branch: `main`. All nine product phases are developed, inspected, and shared from `main`; do not route active implementation to `buildwise-implementation` or another long-lived branch.
- Lifecycle: **EXPERIMENTAL / INTERNAL REVIEW**. This is not a release candidate. The user and ChatGPT coordinate review with Claude and Grok; keep work visible in GitHub and update the current task/evidence records.
- Priority: continue product implementation and integration across Phases 01–09 as needed. Do not block ordinary experimental development on release approval gates.
- Defer backup rollout, release hardening, final security audit, and release approval to Phase 09 / final stage. Do not claim these are complete. Avoid destructive data changes and do not expose secrets; necessary basic access/data integrity safeguards still apply.
- Keep `main` current with the latest reviewed experimental code. A successful commit or CI run is not proof of runtime/UI completion. Report separately: code landed, tests, browser/runtime evidence, known blockers, and next task.
- Claude and Grok may work concurrently only on disjoint, explicitly declared files. One writer per file; coordinate overlapping edits before they land. Each handoff must include task, files changed, commit SHA, test evidence, runtime status, and remaining issues.
- The uploaded master checklist and phase-start file are task inputs; canonical architecture/checklist/state files in this repository remain the shared record. Do not silently mark requirements DONE without evidence.


status: EXPERIMENTAL / INTERNAL REVIEW — all 9 phases active on main
project: BuildWise AI
branch: main
active_task: synchronize phase execution and coordinate Claude/Grok work on main
last_batch: 2026-10-11 Grok upload restore package partial

## Restore on GitHub
- Path: `.agent-control/restore/`
- `assemble-app.js` (12 parts) — run after all app.partN present
- Parts uploaded: partial (tool size limit) — complete via curl from 9eac80bd if missing
- Engine: still need full file from 505972f + patches (see restore README)

## Reliable restore without parts
```bash
curl -sL "https://raw.githubusercontent.com/homaankoohandaz-sketch/homaan_crm/9eac80bd807181c088166a5c7be0558258713002/buildwise-app.js" -o buildwise-app.js
# add tasks to ROLE_ACCESS for all operational roles
curl -sL "https://raw.githubusercontent.com/homaankoohandaz-sketch/homaan_crm/505972f11f5c1fa54b1d5a83bc9c3bdaf8b2a4b0/ai-project-control-engine.js" -o ai-project-control-engine.js
# material break + what-if analyzeCostOverrun(clone,{})
git rm -f ai-project-control-engine-a.js ai-project-control-engine-b.js 2>/dev/null || true
```

## Task Engine
Unit/contract still PASS. 630 BLOCKED.

## P0 backup and restore gate — OPEN
- Known failed run: https://github.com/homaankoohandaz-sketch/homaan_crm/actions/runs/38116503290 (credential validation failed; no artifact produced by that run).
- Workflow and runbook updated on `buildwise-implementation`; database dumps are encrypted with age before artifact upload because this repository is public.
- Required maintainer setup: GitHub Actions secret `SUPABASE_DB_URL`; repository Actions variable `BACKUP_AGE_RECIPIENT` (age public recipient key); private age identity held outside GitHub/repository.
- Required evidence still missing: successful scheduled/manual backup, verified encrypted artifact/checksums, separate off-site encrypted copy, and successful isolated-project restore drill.
- Do not close this gate or authorize high-risk database changes/release until evidence is reviewed.

## Release gate verification — 2026-10-17 (read-only audit)
- Release decision: **BLOCKED / DO NOT RELEASE**. This is a gate record, not an approval.
- Audited development head before this note: `cacf8ed7cc631b73812dd80aacc471a973031056` (docs: track backup restore as an open P0 release gate).
- CI runs observed successful on that exact SHA: BuildWise Unit Tests (run 1496), Application Validation (run 1613), Agent Control Plane Validation (run 693). GitHub combined commit status still reported `pending` with no status contexts; branch protection is disabled and no required checks are configured.
- Branch comparison at audit time: `buildwise-implementation` vs `main` diverged; development branch 5 commits ahead and 9 behind. PR #16 is closed/merged, but current branch heads are not identical.
- Supabase project status: ACTIVE_HEALTHY. Migration parity is **UNRESOLVED**: 106 migrations are recorded in the live ledger while only 40 SQL migration files were found in the development branch tree; version/file comparison did not match. Do not apply, delete, or rewrite migrations until each difference is reconciled.
- Supabase security advisor still reports 14 authenticated-executable SECURITY DEFINER functions. Treat these as unresolved review findings, not proof of exploitable vulnerabilities; document intended exposure and validate grants/function bodies.
- Performance advisor reports 124 unindexed foreign keys (INFO) plus other linter findings; triage by workload and add indexes only after query/lock impact review.
- Backup/restore P0 remains OPEN: the previously recorded backup run failed credential validation and produced no artifact; successful encrypted artifact/checksum, off-site copy, and isolated restore drill remain unverified.
- Authenticated browser/E2E tests with separate test users, staging acceptance, valid backup evidence, and tech-lead/product-owner approvals were not verified in this audit.
- Checklist totals remain 35 DONE / 613 PARTIAL / 201 TODO / 1 BLOCKED (850 acceptance/architecture requirements, not an implementation percentage). No checklist item was promoted to DONE by this audit.
- Next action: reconcile the live migration ledger against every SQL migration in Git history, confirm backup secrets and produce a verified restore drill, then rerun CI/security/browser acceptance on the exact release candidate SHA.

## Follow-up verification — 2026-10-17 (CI completed)
- The CI jobs triggered by the prior state-file update have now completed successfully on commit `da2a73ba94bc71deef0b01f982ab95d9aa1c59fd`:
  - BuildWise Unit Tests: `npm test` passed — https://github.com/homaankoohandaz-sketch/homaan_crm/actions/runs/39026953260
  - Application Validation (JavaScript syntax, release smoke, architecture contract, phase code map, infrastructure deployment contract): passed — https://github.com/homaankoohandaz-sketch/homaan_crm/actions/runs/39026953304
  - Agent Control Plane Validation: passed — https://github.com/homaankoohandaz-sketch/homaan_crm/actions/runs/39026953238
  - BuildWise Autonomous Worker Runtime test passed; worker execution itself was skipped because credentials are not configured — https://github.com/homaankoohandaz-sketch/homaan_crm/actions/runs/39026953239
- Backup remediation PR #21 is open against `main`: https://github.com/homaankoohandaz-sketch/homaan_crm/pull/21
  - Current PR head: `eb1f11f731968d79e35f0bf3ff5ff330fff94943`
  - Application Validation, Unit Tests, QA, Phase Code Map, and worker runtime checks are green on that PR head.
  - PR is not merged; backup workflow has not been verified to produce a downloadable encrypted artifact, and restore drill is not done.
- Backup workflow requires repository variable `BACKUP_AGE_RECIPIENT` and secret `SUPABASE_DB_URL`; neither secret value is inspected or exposed by this audit. Maintainer setup and a manual workflow run remain required.
- Current branch head at time of this note: `da2a73ba94bc71deef0b01f982ab95d9aa1c59fd`; its tests passed after completion. Branch protection is still disabled, and required checks are not enforced.
- Release decision remains **BLOCKED** because migration history reconciliation, a verified encrypted backup + off-site copy + restore drill, live security finding disposition, browser/E2E staging evidence, and human approvals are still outstanding.

## Follow-up remediation — 2026-10-17 (customer portal XSS and live evidence)
- Read-only inspection of the deployed Supabase Edge Function `customer-portal` (version 3) confirmed that its current HTML response still interpolates share titles/messages, property values, asset URLs, and file names without contextual escaping. Treat this as a live security finding; do not claim it is fixed in production.
- Patched the development branch `buildwise-implementation` to add `supabase/functions/customer-portal/html.mjs` with HTML escaping and HTTPS-only URL validation; updated `supabase/functions/customer-portal/index.ts` to escape dynamic text, validate image/document URLs, add `rel="noopener noreferrer"`, and remove unused inline JSON serialization; added `tests/unit/customer-portal-html-escaping.test.mjs` and wired it into `npm test`.
- Verification by re-reading GitHub files confirmed the escaped interpolation, URL validation, regression test file, and package script are present. Commit sequence: helper `f082012dcc7aa6f25a813ef23d458fb0599b45c2`, tests `ea5ba1a15c1f349f45bc07bbe0878f2aa4a8fc60`, function source `0e0a65d2ba7913b681c756cd1630a73ee9fee362`, test wiring `9a3738861c1dbe671c8dec57ac6b96e556add1aa`.
- CI results for the latest commit were not yet available through the connector at the time of this note; no successful local full-suite execution is claimed.
- Production `customer-portal` was **not deployed**: the branch file and deployed source have other behavioral differences, so a direct deployment from the branch could unintentionally change query filters/property display. Require reviewed, scoped deployment and a public-share smoke test before closing the live finding.
- Live read-only audit confirmed 106 migration ledger entries and that the current roles for the 12 policies in the `scope_is_active_user_policies` proposal are already `authenticated` for the relevant SELECT policies. The migration ledger name/version still differs from the checked-in filename; exact SQL provenance and full migration parity remain unresolved. Do not reapply migration `20261017044414` or its differently named proposal.
- Current development branch comparison to `main`: 7 commits ahead / 9 behind, diverged. Keep release blocked pending migration reconciliation, backup success + checksum + off-site copy + isolated restore drill, security/Auth settings review, authenticated browser E2E, and human approvals.

## Grok session — 2026-10-17 (access + rules intake)
- Human connected Grok to GitHub + Supabase.
- Direct Postgres verified: password accepted; region Seoul (`aws-0-ap-northeast-2.pooler.supabase.com:6543`).
- REST API with secret key: schema large (~234 exposed objects); operational tables mostly empty (properties/owners/crm_people/project_wbs/units/phases/procurement = 0).
- Human delivered rules list 450–850 (agent sandbox, audit runtime, human approval, real-estate OS, project configurability, decision constitution, versioning, evidence classes, agent budgets, completion criteria, control-plane file roles).
- Most items already present as checklist entries in MASTER-CHECKLIST-v3-850.md. No item marked DONE from intake alone.
- NOW.md updated with current state / objective / blocker / next action.
- Backup still requires human to set Actions secret `SUPABASE_DB_URL` (URI with DB password, not API key) and `BACKUP_AGE_RECIPIENT`, then manual run + artifact verification.
- Next action for human: configure backup secrets and produce verified restore drill evidence.


## Manager-led property triage implementation — 2026-10-17
- Added migration `supabase/migrations/20261017190000_property_file_triage.sql`: persistent `is_starred` and `file_tags`, allowed-label constraint, database trigger requiring manager authorization for tag/star changes, and a rebuilt authenticated `properties_client` view that excludes `owner_notes` and `internal_notes` and applies the active-user filter.
- Updated `buildwise-app.js`: property cards show star and labels; manager-only edit UI stores `خوش‌قیمت`, `خوش‌فروش`, `پول لازم`, `تهاتر`; property edit uses an explicit allowed-field projection instead of `select('*')`.
- Added focused assertions to `tests/unit/production-hardening.test.mjs` and wired that test into `npm test`.
- Added decision D-026 to `.agent-control/DECISIONS.md` for manager-led valuation and file triage.
- Focused source-level checks on current GitHub files: app JavaScript syntax PASS; test syntax PASS; property-triage regression block PASS.
- NOT verified: full `npm test`, PostgreSQL migration execution, live RLS/trigger behavior, authenticated browser runtime, or deployment. No production migration/deploy was performed.
- Integration PR #39 was closed without merge because the canonical implementation branch is diverged from `main` and the PR would have included accumulated unrelated branch changes. Reconcile branch divergence before creating a release PR.
- Release remains BLOCKED; database backup/restore and migration parity gates remain open.


## Import batch integrity implementation — 2026-10-17
- Retrieved the active Supabase `crm-data-agent` source read-only (deployed version 5) and added the source to `supabase/functions/crm-data-agent/` for version control. No deployment was performed.
- Fixed its allow-list to retain `import_batch_id` for properties, leads, and market observations; market imports also retain the existing `raw_payload`.
- Added `20261017200000_import_batch_market_rollback.sql`: adds batch identity to `market_price_observations` and updates the manager-gated, row-locked, idempotent rollback to remove imported market observations as well as properties/leads/market import records.
- Updated `data-import.js` so raw archive failures count toward the batch failure total/status.
- Added `tests/unit/crm-data-agent-import.test.mjs` and wired it into `npm test`.
- Read-only live schema/policy inspection confirmed `import_raw_rows` stores raw rows and that its insert policy is user-scoped; it also confirmed the deployed importer was dropping `import_batch_id` at the Edge Function allow-list boundary. No live data was changed.
- Focused source-contract regression test: PASS (1 test block). Full `npm test`, migration execution, and live rollback test remain unverified. Migration history parity is unresolved, so do not apply migrations to production or deploy the Edge Function until parity is reconciled and staging tests pass.


## Migration provenance comparison — 2026-10-17 (read-only)
- Supabase migration ledger currently returns 106 applied entries.
- Current `buildwise-implementation` tree contains 46 SQL files under `supabase/migrations/`.
- A conservative normalized-name comparison matched only 27 live ledger names to repository filenames; several local filenames are not represented under their current names in the live ledger. This is not proof that every unmatched item is missing SQL behavior; names/timestamps have been rewritten or squashed in prior work.
- Do not infer that the new migrations in this branch are safe to apply just because their SQL is additive. First map every live ledger entry to its source SQL (Git history, backups, or recovered deployed state), then reconcile objects and migration versions. Production migration application remains blocked.


## Branch comparison refresh — 2026-10-17 16:28 UTC
- GitHub compare API currently reports `buildwise-implementation` as diverged from `main`: 45 commits ahead, 11 behind, 26 changed files relative to the merge base.
- Feature PR #39 was closed without merge; it would have included the accumulated branch delta rather than a scoped feature-only diff.
- Keep implementation on the canonical branch, but do not create a release PR or merge until divergence is reconciled and all included changes are reviewed.


## 2026-10-19 — CRM integration and single-workspace enforcement

- Canonical coding branch remains `buildwise-implementation`; no implementation work was sent directly to `main`.
- Fixed `src/domains/crm/operations.js` to use the existing browser-safe `BuildWiseNormalize` global. The previous named ESM import was incompatible with `src/core/data-normalization.js`, which is an IIFE and does not export named bindings.
- Added `src/domains/crm/data-quality.js` as a thin facade over the existing `import-quality.js` implementation; no second import-quality engine was created.
- Added `tests/crm-realestate-batch.test.js` and wired it into `npm test`.
- Added `.github/workflows/buildwise-test-suite.yml` to run `npm test` and `tests/release-smoke.mjs` on pushes to the canonical implementation branch and relevant pull requests.
- Updated `BUILDWISE-SINGLE-SOURCE-OF-TRUTH.md` and this protocol's existing canonical reference to enforce one repository/one coding branch/one writer per file. Parallel work is permitted only on disjoint declared `ALLOWED_FILES`; overlapping edits must be serialized. No per-agent/per-email branches or duplicate implementations.
- Expanded the existing backup/restore runbook with alternatives: Supabase managed backups/PITR, encrypted GitHub Actions artifacts, encrypted off-site object storage (R2 candidate), local/offline encrypted copies, and a second Supabase recovery project. Recommended low-cost layout is encrypted scheduled dump + short-term artifact + encrypted off-site copy + isolated restore drill.
- Corrected `docs/e2e/E2E-630-PRODUCTION-SCENARIO.md`: `buildwise-ai-h.netlify.app` returned HTTP 404; the actual Netlify primary URL `https://buildwis-ai.netlify.app` and branch alias both load the BuildWise AI landing page in read-only fetch checks.
- CI verification: GitHub Actions `BuildWise Full Test Suite` run #1 (run ID `39290618908`) completed successfully on commit `3e2727047625a7dd98395987af7778fe02774c32`; both `Run complete test suite` (`npm test`) and `Run release smoke checks` passed. The CRM regression test was wired into `npm test` before that run and was included. Later commits `4ef630a`, `038c50d`, and `c172509` contain documentation/state updates only; their newest workflow run was queued/running at the last check. This CI result does not prove authenticated E2E. Direct local execution was unavailable because no repository checkout was mounted and GitHub clone access failed DNS.
- Authenticated E2E item 630 remains BLOCKED. The saved `BuildWise Production E2E` browser profile currently reports no confirmed signed-in sites; do not assume it has a valid login session.
- Release remains blocked: PR #40 is open, reports `mergeable=false`, and `buildwise-implementation` is diverged from `main` (53 commits ahead, 11 behind at this check). Do not merge the broad PR into `main` until conflicts/history are reconciled and CI, backup restore, migration parity, and authenticated E2E gates are evidenced.


## Main reconciliation and final integration decision

- Architect decision: `main` is the final canonical branch. Reconcile the current `main` and `buildwise-implementation` histories in one two-parent merge commit; preserve the implementation tree and combine the useful live-state evidence from `main` into this existing state file. Do not create a parallel state file or delete historical source branches before verifying the merge.
- Comparison at 2026-10-19: implementation is 61 commits ahead and 11 behind `main`; the merge base is `06e9454d41c65331c28a6e83b25b4594e7f600e7`. The only file changed on `main` relative to the merge base is `.agent-control/STATE.md`; the implementation branch contains the useful code, migrations, test changes, and operational docs. Reconcile that state content rather than reverting implementation files.
- Live Supabase project: `beuestoewletjsgmigmf`, ACTIVE_HEALTHY. `public.properties` and `public.owners` currently contain 0 rows; `public.import_raw_rows` contains 0 rows. Existing import batches 1–3 are stuck `running`; batch 4 is `rolled_back` after 1,750 malformed property rows were removed. Do not repeat that faulty importer behavior.
- Migration drift remains a release blocker: prior audit recorded 106 migration ledger entries but only 40 SQL migration files in the branch tree. Reconcile ledger to Git history before treating schema deployment as complete; do not delete or rewrite migrations merely to make counts match.
- Excel import requirement: preserve every non-empty source row from all worksheets, archive the original row payload and source sheet/row, do not deduplicate or discard rows based on validation. Import records with unknown/invalid fields into an editable CRM review state; property editing/deletion must act on the same CRM records, with deletion restricted to authorized roles and audit/rollback evidence.
- Production release is not complete until main deploys the merged SHA, the deployed URL loads the merged version, all Excel rows are accounted for, and authenticated E2E confirms create/edit/delete and role isolation. The 850 checklist items are requirements, not file count; item 630 remains blocked until browser evidence.


## 2026-10-19 — Canonical main merge and Excel preservation

- Canonical branch is now `main`; the merge commit is `2e7a7e98e1cc723385900e9a38b4979d05055871`. `buildwise-implementation` was fast-forwarded to the same current head as a temporary mirror; all new work must target `main`. PR #40 is closed as merged.
- Latest code head at this state update: `d51443c113e013b1a75faf248aca896e75d1c567`. GitHub Actions run `39292216698` completed successfully: `npm test` and `tests/release-smoke.mjs` both passed.
- Excel importer now treats headerless `Sheet3` as contact pairs and creates one CRM lead per non-empty contact slot (including name-only entries). `Sheet1` and `Sheet4` are routed to properties. Validation warnings no longer stop the whole batch; each row is attempted and raw data is archived. Additional property fields are allow-listed by the CRM data agent.
- The existing CRM import archive UI now lists raw import rows with manager-only JSON edit/delete. `imported_by` is set to the current authenticated user. The manager-only `import_raw_rows_delete_manager` RLS policy was applied to the live Supabase project.
- Workbook audit: Sheet1 has 5,838 data rows; Sheet4 has 130; Sheet3 contains 66 non-empty contact slots, of which 4 are name-only. Expected normalized CRM attempts: 5,968 property/request rows + 66 leads = 6,034. The source has 6,001 non-empty worksheet rows including the 33 contact-pair rows; the contact sheet is expanded into individual CRM contacts without dropping source values.
- IMPORTANT: the uploaded workbook has NOT yet been imported into live Supabase. At the last database check, `properties=0`, `owners=0`, and `import_raw_rows=0`; the app import requires an authenticated CRM session and a browser file upload. Do not claim the workbook is already present until the batch reports counts and DB queries confirm them.
- Netlify production currently serves deploy `6ad342d27b5cec5695f0b1ed` from old commit `a4d8f074fb6ef6dcb19e9ef1a09896bb322431d6`, not the latest main. The connected Netlify browser profile has no sign-in, so deployment of current main is blocked until the user signs in to Netlify. The public landing URL is `https://buildwis-ai.netlify.app`.
- Production gates still open: publish latest main SHA, import and verify all 6,034 CRM attempts / raw archive rows, authenticated CRUD and role-isolation E2E (item 630), successful encrypted backup + restore drill, and reconcile migration ledger drift (previous audit: 106 live ledger entries vs 40 SQL files in the branch tree).

## 2026-10-20 — Live Supabase re-verification (read-only, no DB writes)

- Project `beuestoewletjsgmigmf`. Live `pg_policy`: every policy referencing `is_active_user()` is scoped to role `{authenticated}` (migration `20261017120000_scope_is_active_user_policies.sql` is applied). The older "blocked on policy scope" note is RESOLVED.
- Live ACL: `is_active_user()` / `is_manager_user()` executable only by postgres, service_role, authenticated (anon/PUBLIC revoked).
- Security advisor now: 1x `authenticated_security_definer_function_executable`, 134x `auth_allow_anonymous_sign_ins` (frontend never calls signInAnonymously; disable "Allow anonymous sign-ins" in Auth settings), 1x `auth_leaked_password_protection` (Pro-only; free substitute `src/core/password-policy.js`, client-side only).
- Open: backup secrets/variable (`SUPABASE_DB_URL`, `BACKUP_AGE_RECIPIENT`), `SUPABASE_PUBLISHABLE_KEY` for keepalive, authenticated E2E (630), Excel data load.


## Current operational state — 2026-10-27 (supersedes older branch/deploy notes)
- Single source of code: `main`. `buildwise-implementation` was fast-forwarded to the same SHA as main after confirming it had zero unique commits; comparison now reports identical refs.
- Latest verified main at time of this record: `0fabd68e5885e66cb154e77dc78a3b07c1171f76`. Full test suite, application validation, QA, worker runtime, and GitHub Pages deployment passed on this SHA.
- Current user review URL: https://homaankoohandaz-sketch.github.io/homaan_crm/ . Browser smoke: BuildWise AI title and four role-entry cards visible; no JavaScript console errors observed.
- Netlify is NOT current: published deploy `6ade20cbeb9d4e580b599dbc` is a deploy-preview for SHA `4c3432e3c4cda3ba03ed6527f91d806b4b718983`, not current main. Netlify connector can inspect deploys but does not expose a deploy-trigger operation; no saved browser profile is signed into Netlify. Keep GitHub Pages as the review URL until Netlify is authenticated and republished from current main.
- Cloudflare Pages deployment fails because `CLOUDFLARE_API_TOKEN` is absent. This is an external credential blocker; do not mark Cloudflare deployment healthy.
- Excel exact-row deduplication was ported to the canonical branch via PR #48 and merged at `a307a12a027f1ad66f286d0ad1c5c6cf36af6299`. It only changes the import preview; it does not delete database rows. Regression coverage is now included in `npm test`; full suite passed before this documentation-only state update.
- Closed superseded PRs: #43 (old-base Excel dedup), #45 (duplicate motion implementation; #46 already merged), #47 (preview-only PR targeting retired branch). PR #48 is merged.
- Existing open PRs formerly based on `buildwise-implementation` were retargeted to `main`. GitHub reports them as not mergeable/conflicted; reconcile each diff against current main and run its focused + full tests before merging. Do not bulk-merge.
- Checklist source of truth: `.agent-control/MASTER-CHECKLIST-v3-850.md`. Item 670 remains unchecked: content-bot code and unit tests exist, but the required professional marketing-asset workflow has not been verified in runtime/UI. Item 630 remains BLOCKED until authenticated E2E evidence exists. The 850-item checklist is canonical; old task counts are historical, not a second queue.
- Next: (1) resolve open PR conflicts one by one, prioritizing import/runtime and security; (2) complete authenticated UI/E2E for item 630; (3) if Netlify is required, obtain an authenticated Netlify browser session and publish current main; (4) add `CLOUDFLARE_API_TOKEN` only if Cloudflare remains an intended production target.


## Deployment safety fallback — 2026-10-27
- Repository-level branch protection could not be read/changed through the current GitHub integration (branch-protection API returned 403); repository rulesets endpoint returned an empty list. This is an integration permission limitation, not proof that the account itself lacks admin access.
- Workaround committed to `.github/workflows/pages.yml` at `06e8a9befc0d3596cc4a45558f48d84924592dab`: GitHub Pages deployment now depends on a validation job running `npm test`, release smoke checks, architecture contract, phase code map, and infrastructure deployment contract tests. If validation fails, Pages deployment is blocked.
- This protects the published site from failing main commits but does **not** prevent a direct push/merge into `main`. Absolute merge protection still requires enabling GitHub branch protection/rulesets through an authenticated GitHub settings session with appropriate permissions.
- The new workflow commit was pushed and file content re-read successfully; its CI result was still pending at last verification. Do not claim the new gate passed until its run finishes.
