# Live Supabase Runtime Snapshot — 2026-09-25

Project: beuestoewletjsgmigmf

## Verified directly from live Supabase
- Public tables queried: all returned with RLS enabled.
- Live rows include: properties 1750, activity_logs 1819, import_batches 4, team_slots 10, app_roles 2, leads 5, appointments 4, deals 1, invited_emails 4, telegram_sessions 1, crm_alerts 1, ai_actions 4, construction_projects 1, plan_limits 60, user_plans 2.
- 10 active Edge Functions are deployed, including ai-orchestrator v7, crm-data-agent v3, buildwise-app v3, property-bank v12, telegram-bot v6, app v5, storage-setup v5, media-ai v1, google-sheets-sync v3, public-request v2.
- Security advisor currently reports: 1 RLS-enabled table with no policy (public.telegram_sessions); 4 SECURITY DEFINER functions executable by anon; 25 SECURITY DEFINER functions executable by authenticated users.
- Performance advisor reports unused-index findings and 25 multiple-permissive-policy findings.
- This is live runtime evidence, not a statement about repository source.

## Operating consequence
Git and Supabase must be treated as two truth domains:
REPO = source for repository artifacts.
LIVE = source for deployed runtime.
DRIFT = when they differ.
VERIFIED = when the relationship has been checked.

No cleanup or security fix is authorized by this snapshot alone. Create a scoped task and verify intended access model first.
