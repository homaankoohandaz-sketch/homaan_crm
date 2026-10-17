# NOW — BuildWise AI

as_of: 2026-10-17

## Current state
- Access verified: GitHub (full for main work) + Supabase REST (secret key) + direct Postgres (password confirmed, Seoul/ap-northeast-2).
- Control plane files present: NOW, STATE, SUMMARY, MASTER-ARCHITECTURE, MASTER-CHECKLIST-v3-850, BRIEF, ROADMAP, TASK_CONTRACT, AGENT_REGISTRY, DECISIONS.
- PR #16 open on buildwise-implementation; CI described as green for unit/QA/validation; authenticated runtime/UI acceptance NOT done.
- Database content: schema large (~234 exposed objects); operational tables mostly empty (properties/owners/crm_people/project_wbs/units/phases/procurement = 0 rows).
- Backup workflow failing every night: missing GitHub secret `SUPABASE_DB_URL`.

## Current objective
1. Remediate database backup (set `SUPABASE_DB_URL` and verify artifact).
2. Keep control-plane current after Grok session intake of rules 450–850.
3. Do not mark any feature DONE without implementation + test + runtime verification.

## Current blocker
- `SUPABASE_DB_URL` not set in repository Actions secrets → scheduled backup fails at "Verify backup credential is configured".
- Authenticated E2E / checklist 630 still blocked (no runtime evidence).
- Restricting `is_active_user()` EXECUTE from anon is blocked until public-role RLS scope is resolved.

## Next action
1. Human: add GitHub Actions secret `SUPABASE_DB_URL` with verified connection URI (see STATE.md).
2. Manually run "BuildWise Scheduled Database Backup" and confirm non-empty dump + manifest artifact.
3. Continue only after backup is verified; then prioritize authenticated runtime acceptance before further feature claims.
