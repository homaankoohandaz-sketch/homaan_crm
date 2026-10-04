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

GitHub Actions runs a scheduled PostgreSQL logical backup daily.

Required repository secret:

`SUPABASE_DB_URL`

The workflow:

1. installs `postgresql-client`;
2. runs `pg_dump` in custom format;
3. validates the dump with `pg_restore --list`;
4. uploads the dump and manifest as a private GitHub Actions artifact;
5. retains the artifact for 7 days.

### Activation gate

The workflow is implemented, but scheduled runtime is not considered DONE until a real workflow run completes successfully.

Do not commit the database URL or any secret to the repository.

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
