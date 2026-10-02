# BuildWise AI — Backup & Rollback

## Backup

Primary protection:
- Supabase-managed backups for the production database.

Repository-level emergency protection:
- Supabase logical schema dump can be generated through CI using protected secrets.
- Migration history remains committed in Git.
- Git history provides application rollback points.

Do not store production database dumps in the repository.

## Database rollback

- Prefer a forward corrective migration.
- Do not use destructive `db reset` against production.
- If migration history diverges, repair history deliberately and document the change.

## Application rollback

- Cloudflare Pages retains prior deployments and supports production rollback.
- Rollback target must be an identified known-good deployment/commit.
- After rollback, run the production health check.
- Task 630 still requires browser runtime verification of the resulting production URL.

## Incident sequence

1. Stop further production deployments.
2. Identify last known-good commit/deployment.
3. Roll back application if the fault is frontend/deployment related.
4. For database faults, prefer a corrective migration.
5. Re-run health checks and regression tests.
6. Record the incident and final state in the control plane.
