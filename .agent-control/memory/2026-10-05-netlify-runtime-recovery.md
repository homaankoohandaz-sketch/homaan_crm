# 2026-10-05 — Netlify runtime recovery

## Result
- Production site: buildwis-ai / Site ID b880916b-90b3-406e-8915-b26f9aa1d21d
- Netlify public SSO gate was enabled accidentally/configurationally; it returned HTTP 401 to public runtime verification.
- SSO team-login requirement was disabled for the site; password protection remains disabled.
- Production and main branch URLs now return HTTP 200 and render BuildWise AI landing content.
- Current Netlify deploy before the latest merge remains READY on main; the Netlify connector's deploy action currently returns a CLI command and this session cannot execute GitHub network operations locally.
- Netlify env vars added: SUPABASE_URL and SUPABASE_ANON_KEY using the live Supabase project and its public publishable client key.
- Supabase, Async Workloads, and Content Security Policy Netlify extensions installed successfully.
- Arcjet is installed at team level but Site-level installation failed through the Netlify extension API; no bypass attempted.
- PR #13 fixed browser runtime config by providing the public Supabase publishable key as a safe default. CI: Unit Tests PASS, QA PASS, Phase Code Map PASS. PR #13 merged to main as ea70e5e527cc35811090326e4aa658024a880eed.
- Remaining release gate: trigger a fresh Netlify production deploy from the merged main commit so the new runtime configuration and environment-variable changes are included, then run authenticated browser/runtime smoke tests.

## Security
- No service-role key, AI key, deployment token, or other privileged secret was committed.
- Public Supabase publishable key is intentionally client-safe.

## Evidence
- Netlify public runtime verification: HTTP 200 after SSO removal.
- Supabase project: ACTIVE_HEALTHY.
