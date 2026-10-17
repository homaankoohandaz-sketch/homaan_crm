# Agent Control State

status: RESTORE IN PROGRESS via .agent-control/restore/ | Task Engine unit OK | 630 BLOCKED
project: BuildWise AI
branch: buildwise-implementation
active_task: restore-full-app-and-engine
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
