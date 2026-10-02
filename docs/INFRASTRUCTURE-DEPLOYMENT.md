# BuildWise AI — Infrastructure & Deployment

## Canonical path

- Source of truth: GitHub repository.
- Production branch: `main`.
- Static edge target: Cloudflare Pages.
- Database/Auth/early storage: existing Supabase project.
- Edge/API: existing Supabase Edge Functions.
- CI: GitHub Actions.
- GitHub Pages: smoke/demo only, not production.
- Netlify: legacy/diagnostic only.

## Production deployment gate

1. CI must be green.
2. Merge to `main).
3. Cloudflare Pages deployment runs automatically.
4. Deployment health check must return HTTP success from the configured production URL.
5. Production E2E task 630 is closed only after the production URL is browser-accessible and runtime-verified.

## Required secrets / variables

GitHub Actions secrets:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `SUPABASE_ACCESS_TOKEN`
- `SUPABASE_DB_PASSWORD`
- `SUPABASE_PROJECT_REF`

GitHub Actions variable:
- `PRODUCTION_URL`

No service-role key, database password, AI secret, or deployment token belongs in source control.

## Rollout model

- Feature branches: CI + review.
- `main`: production deployment.
- Cloudflare preview deployments may be used before merge.
- Production deployment is never performed from `buildwise-implementation`.

Cloudflare's current documentation supports GitHub-based Pages deployment and Wrangler direct-upload CI; this repository uses the latter so the production branch is explicit in GitHub Actions. 
