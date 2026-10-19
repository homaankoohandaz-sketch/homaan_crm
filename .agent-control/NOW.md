# NOW — BuildWise AI

as_of: 2026-10-17 (canonical main after reconciliation)

## Current state
- Canonical branch: `main`; code and operational changes are unified in merge commit `2e7a7e98e1cc723385900e9a38b4979d05055871`.
- Access: GitHub + Supabase REST + direct Postgres (Seoul) verified.
- Offline DB backup: schema.sql + data.sql + full.dump produced, age-encrypted, checksummed. Evidence: `.agent-control/evidence/BACKUP-OFFLINE-2026-10-17-GROK.md`.
- Data remediation on live DB: project_wbs=4, project_phases=3, project_milestones=3 for project 1 (چوگیا); deal #1 linked to lead_id=10.
- Scheduled GitHub Actions backup still fails until human sets secrets.
- Authenticated E2E (630) still not verified.

## Current objective
1. Human configures `SUPABASE_DB_URL` + `BACKUP_AGE_RECIPIENT` so scheduled backup can succeed.
2. Continue closing concrete gaps with evidence (no false DONE).

## Current blocker
- **Human-only:** GitHub Actions secrets cannot be set by the agent connector.
  - Secret `SUPABASE_DB_URL` = pooler URI with DB password
  - Variable `BACKUP_AGE_RECIPIENT` = `age1s8l9rcpque8q9pwwwarecwgy4jtjfwm8yepmczz6mlq4xmrp6s4qhgw6zw`
- 630 authenticated runtime/UI acceptance

## Next action
1. Human: set the two Actions values above, run workflow manually, confirm artifact.
2. Agent: continue code/data/control-plane work that does not depend on those secrets.
