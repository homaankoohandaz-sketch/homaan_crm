# BuildWise AI — Infrastructure & Deployment

## Canonical path

- Source of truth: GitHub repository.
- Production branch: `main`.
- Static web target: Cloudflare Pages.
- Database/Auth/API edge: existing Supabase project and Edge Functions.
- CI/CD: GitHub Actions.
- GitHub Pages: smoke/demo only; not production.
- Netlify: legacy/diagnostic only.

Cloudflare's current documentation supports Wrangler-based Pages deployment from GitHub Actions and explicit production-branch control. citeturn0search0turn0search1

## Production deployment gate

1. CI must be green.
2. Merge to `main`.
3. Cloudflare Pages deployment runs.
4. Deployment health check returns HTTP success from the configured production URL.
5. Browser runtime verifies the customer → advisor flow.
6. Only then can checklist 630 be closed.

## Deployment safety

The deployment uses a root `.assetsignore` so repository control-plane files, tests, documentation, migrations and package metadata are not published as public static assets. Client application assets under the root and `src/` remain deployable.

## Required GitHub secrets

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `SUPABASE_ACCESS_TOKEN`
- `SUPABASE_DB_PASSWORD`
- `SUPABASE_PROJECT_REF`

Required GitHub Actions variable:

- `PRODUCTION_URL`

Never commit service-role keys, database passwords, AI provider secrets or deployment tokens.

## Environment model

- Feature/implementation branches: CI and review.
- `main`: production deployment.
- Cloudflare preview deployments: validation before merge.
- Production Supabase: no reset/seed/destructive local workflows.

## Current external gate

No Cloudflare account/project credentials or verified production URL are available to this execution context. Therefore 642, 643, 645 and 646 remain PARTIAL/TODO rather than being falsely marked DONE.
