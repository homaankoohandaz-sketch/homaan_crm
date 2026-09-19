# BuildWise AI — Release Readiness

## Current architecture
- Frontend: static mobile-first PWA served by Netlify.
- Data/Auth: Supabase.
- AI: Supabase Edge Function ai-orchestrator -> OpenAI Responses API.
- Telegram: Supabase Edge Function telegram-bot.
- Public intake: public-request Edge Function.
- Media: media-ai Edge Function and Supabase storage layer.
- Market sync: google-sheets-sync Edge Function.
- CRM data agent: crm-data-agent Edge Function.

## Release gates
1. JavaScript syntax validation.
2. Frontend smoke validation.
3. Supabase security advisor review.
4. Supabase performance advisor review.
5. Edge Function status review.
6. Netlify deploy verification.
7. Human approval before production deployment.

## Known non-blocking findings
- Several SECURITY DEFINER RPCs are intentionally callable by authenticated CRM users because they implement protected CRM operations. They must remain covered by application/RLS authorization tests.
- telegram_sessions has RLS enabled without a client policy; this is intentionally fail-closed because session state is handled by the service-side Telegram function.
- Supabase reports many unindexed foreign keys; these are a performance backlog item rather than a release blocker and should be handled in a measured index migration after query profiling.

## Release target
The application is considered release-candidate ready when CI is green, the active Netlify deploy serves the current main branch, the Supabase functions are ACTIVE, and the production gate is explicitly approved.
