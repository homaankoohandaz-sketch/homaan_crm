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
