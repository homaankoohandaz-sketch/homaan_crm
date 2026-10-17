# BuildWise AI — Backup and Restore Runbook

**Status:** Recovery procedure documented; a successful backup and a real restore must still be verified before this control is marked complete.  
**Project ref:** `beuestoewletjsgmigmf`  
**Repository:** `homaankoohandaz-sketch/homaan_crm`  
**Workflow:** `.github/workflows/database-backup.yml`

## 1. Known incident and current gate

GitHub Actions run [38116503290](https://github.com/homaankoohandaz-sketch/homaan_crm/actions/runs/38116503290) failed at **Verify backup credential is configured**. The dump and artifact-upload steps were skipped. This is evidence that this run produced no backup artifact; it does not by itself prove whether a separate Supabase-managed backup exists.

The workflow requires the repository Actions secret `SUPABASE_DB_URL`. Never put the connection URI in source code, issues, logs, or chat. Prefer the project's **Session pooler** connection URI from Supabase Dashboard → Connect; ensure the password is current and URI-encoded as required. Add/update it in GitHub → repository Settings → Secrets and variables → Actions. Do not use the direct `db.<ref>.supabase.co` URI from a runner unless direct IPv6/IPv4 connectivity is known to work.

## 2. Run the scheduled backup

1. Confirm the repository is private and Actions artifacts are restricted to trusted maintainers.
2. Set `SUPABASE_DB_URL` as a GitHub Actions secret.
3. Open Actions → **BuildWise Scheduled Database Backup** → Run workflow.
4. Require a successful run. The workflow creates three Supabase CLI logical dumps: roles, schema, and data; validates non-empty outputs and dump completion markers; creates a manifest and SHA-256 checksums; and uploads them as an artifact for 30 days.
5. Download the artifact through GitHub Actions and verify `sha256sum --check SHA256SUMS` in the extracted `backup` directory.
6. Record run URL, UTC completion time, artifact name, checksum verification, and any warnings in the release evidence.

A successful workflow run is necessary but not sufficient: it does not prove the dump can be restored.

## 3. What is and is not covered

The logical database dump is intended to capture database roles (excluding platform-reserved roles), schema, database data, SQL functions, triggers, and database RLS policies, subject to Supabase's platform-specific dump filtering and permissions.

Treat these as separate recovery items and verify them independently:

- Storage object bytes: database dumps preserve Storage metadata, not uploaded file contents. Export/copy the objects separately using an approved Storage/S3 procedure.
- Edge Functions: retain source in Git and redeploy to the recovery project.
- Auth/provider configuration, OAuth credentials, SMTP, API keys, JWT configuration, custom domains, redirect URLs, and project settings: document and reconfigure securely; do not put secret values in this runbook or artifacts.
- Extensions and database settings: inventory them and confirm availability on the target.
- Scheduled jobs, external integrations, and encryption/Vault keys: verify separately; do not assume a database dump alone restores them.

Supabase-managed daily backup availability and retention depend on the project's plan and backup type. Verify Dashboard → Database → Backups rather than assuming it exists or that a GitHub artifact is equivalent to a platform restore point.

## 4. Restore drill — isolated project only

**Never test restore against production.** Create or designate a separate recovery project and confirm region/version/extension compatibility. Use synthetic test accounts where possible and protect any production-derived personal data under the same access controls as production.

1. Download a known successful artifact and verify checksums.
2. Review the current Supabase documentation for the supported logical restore procedure and platform-reserved role handling before executing it.
3. Restore roles, schema, and data into the isolated target using the approved Supabase CLI/psql procedure. Stop on the first SQL error; do not treat a partial restore as success.
4. Inventory tables by schema and compare critical table row counts with a source snapshot taken at backup time. Document expected differences for system-managed or volatile tables.
5. Verify extensions, indexes, constraints, SQL functions, triggers, and RLS enabled status/policies. Test an unauthenticated request and at least two test users with different permissions to confirm unauthorized rows/actions remain blocked.
6. Deploy required Edge Functions to the isolated project, apply safe non-secret configuration, and test health/expected responses.
7. Verify representative data reads and an end-to-end login with a recovery-only test user. Do not send real customer emails or trigger payments/production webhooks.
8. Test Storage object retrieval separately if Storage is used by the application.
9. Record restore start/end in UTC, artifact/checksum, target project ref, errors, table/policy/function counts, login/read/RLS test results, and the operator. Remove test data/project only after evidence is captured and according to the approved cleanup policy.

## 5. Recovery evidence template

- Backup run URL:
- Backup completion time (UTC):
- Artifact name and retention expiry:
- SHA-256 verification: PASS / FAIL
- Restore target (non-production project ref):
- Restore start/end (UTC):
- Table and critical row-count comparison:
- RLS/policy and role checks:
- SQL function/trigger and extension checks:
- Edge Function checks:
- Test login and representative reads:
- Storage object check:
- Failures and remediation:
- Reviewer and approval:

## 6. Release gate

Keep the P0 backup/restore gate **OPEN** until there is at least one successful backup artifact with verified checksums and a documented successful restore drill in a separate project. Keep high-risk schema changes and production rollout blocked until that evidence is reviewed. A workflow file, configured secret, or successful dump alone is not proof of recoverability.

## References

- [Supabase Database Backups](https://supabase.com/docs/guides/platform/backups)
- [Supabase automated backups using GitHub Actions](https://supabase.com/docs/guides/deployment/ci/backups)
- [Supabase restore to another project](https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore)
