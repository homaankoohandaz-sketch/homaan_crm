# BuildWise AI — Agent Control State

as_of: 2026-10-17
project: BuildWise AI
implementation_branch: buildwise-implementation
working_change_branch: security-backup-state-2026-10-17
active_task: backup-credential-remediation-and-supabase-execute-hardening

## Verified project state

- PR #16: https://github.com/homaankoohandaz-sketch/homaan_crm/pull/16
- PR #16 describes CI as green for Unit Tests, Application Validation, QA, Phase Code Map, and Agent Control Plane Validation.
- PR #16 also records that public deploy-preview smoke is reachable.
- Authenticated runtime/UI acceptance has NOT been completed or verified. Do not mark Production E2E / checklist item 630 DONE.
- The older 2026-10-11 restore status below is obsolete; it is not the current project state.

## Database backup — OPEN / FAILING

- Workflow: `.github/workflows/database-backup.yml`
- Expected GitHub Actions secret: `SUPABASE_DB_URL`
- The workflow checks this secret is non-empty, then uses it as a PostgreSQL connection URI for `pg_dump`.
- Incident reported for 2026-10-13 through 2026-10-16: failure at `Verify backup credential is configured`.
- The workflow references the same secret name in both validation and dump steps. No workflow-name/condition mismatch has been established from the file review.
- Required manual action: configure `SUPABASE_DB_URL` in repository Actions secrets using the database connection URI from Supabase, then run the workflow manually and inspect the run log and artifact.
- Backup is NOT verified working until a manual run completes successfully and the artifact contains a non-empty dump and manifest.

## Supabase security review — PROPOSED, NOT APPLIED

- Project: `beuestoewletjsgmigmf`
- Repository policy migrations call `public.is_active_user()` in policies targeted to `authenticated`, including workflow, AI audit, and project-alert policies.
- Repository search found no direct frontend `rpc("is_active_user")` call.
- A new migration is proposed on the working change branch to revoke direct EXECUTE from `PUBLIC` and `anon`, while granting it to `authenticated`.
- This migration has NOT been applied to Supabase. Review CI and the migration before any manual/production application.
- Leaked password protection was reported as disabled in Supabase Auth. It remains a dashboard-only manual action and is NOT verified enabled.

## Current release gates

- [ ] Database backup: manual run, dump validation, and artifact confirmation.
- [ ] Authenticated runtime/UI acceptance: login and end-to-end role/permission workflow.
- [ ] Supabase migration review and explicit human approval before applying.
- [ ] Enable Leaked Password Protection in Supabase Auth and verify the setting.
- [ ] Re-run CI on the current PR branch and inspect actual job results.

## Evidence rules

- A green CI run does not prove authenticated runtime/UI acceptance.
- Do not mark checklist item 630 (Production E2E) DONE without authenticated runtime evidence.
- Do not mark backup strategy DONE until a successful backup artifact is verified.
- No production migration has been applied by this change.
