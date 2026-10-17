# BuildWise AI — Backup and Restore Runbook

**Status:** Procedure and workflow hardened; a successful backup and real restore still must be verified before this control is complete.  
**Project ref:** `beuestoewletjsgmigmf`  
**Repository:** `homaankoohandaz-sketch/homaan_crm` (**public**)  
**Workflow:** `.github/workflows/database-backup.yml`

## 1. Known incident and security finding

GitHub Actions run [38116503290](https://github.com/homaankoohandaz-sketch/homaan_crm/actions/runs/38116503290) failed at **Verify backup credential is configured**. The dump and artifact-upload steps were skipped. That run produced no artifact; this does not prove whether a separate Supabase-managed backup exists.

The repository is public. Therefore database dumps must never be uploaded as plaintext GitHub artifacts or committed to this repository. The workflow now requires client-side `age` encryption before upload. Artifact encryption does not replace a separate off-site backup or a restore drill.

## 2. One-time setup required from a maintainer

1. Generate an `age` key pair on a trusted workstation using the official `age-keygen` tool. Keep the **private identity** outside GitHub and this repository (preferably in an approved password manager/offline recovery location); never paste it into chat or commit it.
2. Add the public recipient string (starts with `age1`) as repository **variable** `BACKUP_AGE_RECIPIENT` in GitHub → Settings → Secrets and variables → Actions → Variables.
3. Add/update repository **secret** `SUPABASE_DB_URL` in GitHub → Settings → Secrets and variables → Actions. Use the Supabase Dashboard → Connect **Session pooler** URI where possible; ensure the password is current and URI-encoded as required. Do not paste it into source code, issues, logs, or chat.
4. Confirm repository Actions access is restricted to trusted maintainers. Although artifacts in this public repository may be downloadable, their database dumps are encrypted before upload and the decryption identity is not stored here.
5. Open Actions → **BuildWise Scheduled Database Backup** → Run workflow. The job must fail early if either configuration item is missing.

## 3. Backup procedure and evidence

The workflow uses Supabase CLI logical dumps for roles, schema, and data; checks that files are non-empty and schema/data dump completion markers exist; encrypts all three SQL dumps using the configured `age` recipient; removes plaintext files from the runner workspace; generates a manifest and SHA-256 checksums; verifies the checksums; and uploads only encrypted dump files plus the non-secret manifest/checksum files. Artifact retention is 30 days.

For each successful run:
1. Record run URL, UTC completion time, artifact name, and retention expiry.
2. Download the artifact and run `sha256sum --check SHA256SUMS`.
3. On a trusted workstation, decrypt using the separately stored private identity, e.g. `age -d -i /secure/path/identity.txt -o schema.sql schema.sql.age`. Repeat for roles and data. Never upload decrypted files to this public repository.
4. Keep at least one additional encrypted copy in an approved off-site storage location with access controls and a retention policy. GitHub artifact retention is not a long-term archive.

A successful dump and checksum check do not prove recoverability.

## 4. Coverage and separate recovery items

The logical database dump is intended to capture database roles (excluding platform-reserved roles), schema, database data, SQL functions, triggers, and database RLS policies, subject to Supabase's platform-specific filtering and permissions.

These items require separate inventory, backup, or reconfiguration:
- **Storage object bytes:** database dumps preserve Storage metadata, not uploaded file contents. Export/copy objects separately using an approved Storage/S3 procedure.
- **Edge Functions:** retain source in Git and redeploy to the recovery project.
- **Auth/provider configuration, OAuth credentials, SMTP, API keys, JWT configuration, custom domains, redirect URLs, and project settings:** document and reconfigure securely; never put secret values in this runbook or artifacts.
- **Extensions and database settings:** inventory and confirm availability on the target.
- **Scheduled jobs, external integrations, and encryption/Vault keys:** verify separately; do not assume a database dump alone restores them.

Supabase-managed backup availability and retention depend on the project's plan and backup type. Verify Dashboard → Database → Backups instead of assuming a managed backup exists.

## 5. Restore drill — isolated project only

**Never test restore against production.** Create/designate a separate recovery project and confirm region, PostgreSQL version, extensions, and Supabase platform compatibility. Use synthetic test accounts where possible and protect production-derived personal data as carefully as production.

1. Download a known successful artifact and verify checksums.
2. Decrypt the SQL files on a trusted machine or controlled runner that is not the public artifact store.
3. Follow the current official Supabase logical restore procedure, including reserved-role filtering and version compatibility. Stop on the first SQL error; a partial restore is a failure.
4. Inventory tables by schema and compare critical table row counts against a source snapshot from backup time. Explain expected differences for volatile/system-managed tables.
5. Verify extensions, indexes, constraints, SQL functions, triggers, RLS enabled status, and policy definitions. Test an unauthenticated request and at least two test users with different permissions; verify unauthorized rows/actions remain blocked.
6. Deploy required Edge Functions to the isolated project, configure only safe non-secret settings, and test expected responses.
7. Verify representative reads and login with a recovery-only test user. Do not send real customer emails or trigger payments/production webhooks.
8. Test Storage object retrieval separately if the application uses Storage.
9. Record restore start/end in UTC, artifact/checksum, target project ref, errors, table/policy/function counts, login/read/RLS test results, and operator. Clean up only after evidence is captured and according to an approved policy.

## 6. Recovery evidence template

- Backup run URL:
- Backup completion time (UTC):
- Artifact name and retention expiry:
- SHA-256 verification: PASS / FAIL
- Decryption check: PASS / FAIL
- Additional off-site encrypted copy and retention:
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

## 7. Release gate

Keep the P0 backup/restore gate **OPEN** until all of these are evidenced:
- GitHub Actions secret `SUPABASE_DB_URL` and variable `BACKUP_AGE_RECIPIENT` are configured.
- At least one backup workflow run succeeds and the encrypted artifact's checksums verify.
- An additional encrypted off-site copy exists.
- A documented restore drill succeeds in a separate project and data/access checks pass.

Keep high-risk schema changes and production rollout blocked until the evidence is reviewed. A workflow file, configured secret, or successful dump alone is not proof of recoverability.

## References

- [Supabase Database Backups](https://supabase.com/docs/guides/platform/backups)
- [Supabase automated backups using GitHub Actions](https://supabase.com/docs/guides/deployment/ci/backups)
- [Supabase backup and restore](https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore)
- [age encryption tool](https://age-encryption.org/)
