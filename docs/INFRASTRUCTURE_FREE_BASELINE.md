# BuildWise AI — Free Infrastructure Baseline

## Runtime topology

- Development: local runtime.
- Staging: Netlify Deploy Preview / branch deploy.
- Production: Netlify production deploy.
- Data/Auth/Storage/Edge Functions: current Supabase project.

## Cost rule

No paid provider is required for this baseline. Do not introduce Cloudflare, a custom domain, or another paid runtime only to satisfy an infrastructure checklist item.

## Environment semantics

Netlify contexts expose `BUILDWISE_ENV`:

- `production` → production deploy.
- `staging` → deploy preview / branch deploy.
- `development` → local development.

This is configuration separation. It is **not** a separate database. Until a second Supabase project is available, staging and production share the current Supabase backend and must not be described as isolated data environments.

## Backup

GitHub Actions is configured to run a scheduled PostgreSQL logical backup daily via `.github/workflows/database-backup.yml`.

### Required GitHub configuration

- Repository Actions secret `SUPABASE_DB_URL`: a PostgreSQL connection URI for the Supabase database (use the Session pooler URI when appropriate). This is not a Supabase API key.
- Repository Actions variable `BACKUP_AGE_RECIPIENT`: the public `age1...` recipient key corresponding to a private age identity held securely outside GitHub and outside this repository.

Never commit the database URL, private age identity, database dumps, or other secrets to this public repository. Do not place the private age identity in GitHub Actions secrets unless a separately reviewed restore workflow explicitly requires it.

### Backup workflow

1. Validates that the connection URI and age recipient are configured without printing their values.
2. Uses Supabase CLI `supabase db dump` to export roles, schema, and data separately.
3. Verifies the expected SQL dump files are non-empty and checks the schema/data dump completion markers.
4. Encrypts all database dump files with age before upload, then removes the plaintext dump files from the job workspace.
5. Writes a manifest and SHA-256 checksums, then verifies the checksums.
6. Uploads the encrypted dumps, manifest, and checksums as a GitHub Actions artifact with 30-day retention.

This is a logical backup of the database content exported by Supabase CLI. It is not a physical point-in-time backup and does not replace Supabase-managed backups, a separate off-site copy, or restore drills. Supabase-managed schemas excluded by the CLI, Auth/Storage objects or files, project settings, secrets, and external provider configuration may require separate recovery procedures.

### Activation and recovery gates

The workflow configuration is **not** proof of a usable backup. The backup gate remains open until all of the following evidence exists:

- A manual workflow run completes successfully.
- The artifact contains all three non-empty encrypted dump files, `manifest.txt`, and `SHA256SUMS`.
- Checksum verification passes and the artifact can be decrypted using the separately held private age identity.
- A copy is stored outside this GitHub repository/account under an approved retention policy.
- A restore drill succeeds in an isolated non-production Supabase project, followed by basic schema/data integrity checks.

Until a separate isolated Supabase project exists, do not restore test data into the production project. Do not mark backup or recovery checklist items DONE based on the workflow file alone.

## Production domain

The current Netlify hostname is the production delivery URL. A custom domain is optional and is not a release blocker.

## Cloudflare

Cloudflare is intentionally deferred from the critical path. Existing Cloudflare-related code may remain, but no Cloudflare provider runtime is required for this baseline.

## Acceptance

Infrastructure checklist status must distinguish:

- implemented configuration;
- provider-dependent activation;
- runtime-verified completion.

A test or configuration file alone is never sufficient for DONE.
