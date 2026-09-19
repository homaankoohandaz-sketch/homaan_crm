# BuildWise AI+H — Free / Low-Cost Infrastructure

## Target stack
1. Frontend: Cloudflare Pages / Workers.
2. Data, auth and early storage: existing Supabase project.
3. Edge/API: existing Supabase Edge Functions first; Cloudflare Worker only where a thin gateway, webhook router, cache or scheduler is useful.
4. Scheduling: Cloudflare Cron for lightweight recurring jobs; GitHub Actions for CI, smoke tests and repository workflows.
5. Spreadsheet bridge: existing Google Apps Script bridge.
6. Media: Supabase Storage initially; evaluate Cloudflare R2 when media volume grows.
7. Agent execution: local Codex/Claude/Gemini/OpenCode runtimes; GitHub remains source of truth.
8. n8n: optional self-hosted automation layer later, not a required paid dependency.

## Current infrastructure decisions
Cloudflare is the preferred static/API edge direction because the current free Workers plan provides 100,000 requests/day, 10 ms CPU/request, 5 Cron Triggers/account and up to 100 Workers.

Supabase Free remains suitable for development and early usage, but its current free plan includes 500 MB database, 1 GB file storage and 5 GB egress plus 5 GB cached egress; free projects pause after one week of inactivity.

Google Apps Script remains the fastest bridge for Google Sheets/Excel workflows. Consumer quotas currently include 20,000 URL Fetch calls/day and 90 minutes/day trigger runtime.

GitHub Pages remains useful for smoke/demo deployment but is not the production host for BuildWise: GitHub explicitly states Pages is not intended for commercial SaaS/online business hosting.

Vercel Hobby can remain a preview/experiment option, but it should not become a production assumption without checking the current commercial-use terms.

Netlify is currently a diagnostic/legacy path because the existing public deployment has had connection failures. Do not make the product dependent on it.

## Security
Never commit service-role keys, AI keys, social tokens or deployment tokens. Public Supabase client configuration may be embedded in the frontend; privileged keys belong in provider secrets or GitHub Actions Secrets.
