# BuildWise AI — Environment Separation

## Development
- Local files and local test data.
- No production credentials.
- No production destructive operations.

## Preview / Staging
- Separate Cloudflare preview deployment.
- Separate Supabase project/branch when available.
- Test accounts and non-production data only.
- Migration preview before production.

## Production
- Cloudflare Pages production deployment from `main`.
- Existing production Supabase project: `beuestoewletjsgmigmf`.
- Production secrets stored only in GitHub/Cloudflare secret stores.
- No seed/reset operations.

## Rules

1. Never point local development at production for destructive tests.
2. Never use production secrets in pull requests.
3. Production migrations require an explicit workflow dispatch.
4. Production URL health checks are mandatory before declaring deployment verified.
5. Task 630 remains open until browser runtime verification is possible.
