# BuildWise AI — Agent Control State

as_of: 2026-10-17
project: BuildWise AI
implementation_branch: buildwise-implementation
working_change_branch: security-backup-state-2026-10-17
active_task: backup-credential-remediation-and-security-review

## Verified project state

- PR #16: https://github.com/homaankoohandaz-sketch/homaan_crm/pull/16
- PR #16 description reports green CI for Unit Tests, Application Validation, QA, Phase Code Map, and Agent Control Plane Validation.
- PR #16 description reports the public deploy-preview smoke is reachable.
- Authenticated runtime/UI acceptance has NOT been completed or verified. Do not mark Production E2E / checklist item 630 DONE.
- The old 2026-10-11 restore status is obsolete and is not the current project state.

## Database backup — OPEN / FAILING

- Workflow: `.github/workflows/database-backup.yml`
- Expected GitHub Actions secret: `SUPABASE_DB_URL`
- Expected value: PostgreSQL connection URI from Supabase; not an API key.
- The workflow checks that the secret is non-empty, then passes it to `pg_dump`.
- Incident reported for 2026-10-13 through 2026-10-16: failure at `Verify backup credential is configured`.
- Both workflow steps use the same secret name. File review found no name mismatch or condition bug to patch.
- Required manual action: configure `SUPABASE_DB_URL` in repository Actions secrets using the database connection URI from Supabase, then manually run the workflow and inspect logs and artifact.
- Backup is NOT verified until a manual run succeeds and the artifact contains a non-empty dump and manifest.

## Supabase security review — BLOCKED ON POLICY SCOPE

- Project: `beuestoewletjsgmigmf`
- Read-only live SQL confirmed `public.is_active_user()` is SECURITY DEFINER and currently executable by both `anon` and `authenticated`.
- Live `pg_policies` results show that the function is referenced by RLS policies, including policies whose role is `{public}` (therefore applicable to anon as well as authenticated).
- A separate read-only privilege query showed anon has table privileges on multiple tables whose RLS expressions call `is_active_user()`, including appointments, deals, followups, leads, owners, property documents/images/photos, and user reports.
- Repository search found no direct frontend `rpc("is_active_user")` call; that search result alone is not proof of no runtime caller.
- Therefore, revoking EXECUTE from `PUBLIC` and `anon` without first resolving the public-role policies is NOT confirmed safe and may break existing anonymous API paths. No ACL migration is included in this change branch; none was applied to the database.
- Next safe step: determine which anonymous table/API paths are intentional, then narrow affected RLS policies/table grants as needed before adding the function ACL migration.
- Leaked password protection was reported as disabled in Supabase Auth. It remains a dashboard-only manual action and is NOT verified enabled.

## Current release gates

- [ ] Database backup: set `SUPABASE_DB_URL`, manually run workflow, verify dump and manifest artifact.
- [ ] Authenticated runtime/UI acceptance: login and end-to-end role/permission workflow.
- [ ] Resolve public-role RLS/table-grant dependencies before restricting `is_active_user()` EXECUTE.
- [ ] Enable Leaked Password Protection in Supabase Auth and verify the setting.
- [ ] Inspect actual CI run results for this change branch before merge.

## Evidence rules

- A green CI run does not prove authenticated runtime/UI acceptance.
- Do not mark checklist item 630 (Production E2E) DONE without authenticated runtime evidence.
- Do not mark backup strategy DONE until a successful backup artifact is verified.
- Production migrations require explicit human approval and are not applied by this change.
