-- Security 606: explicitly deny authenticated access to private Telegram sessions.
-- Edge Functions use the service role and therefore bypass this RLS deny policy.
create policy telegram_sessions_authenticated_deny
on public.telegram_sessions
for all to authenticated
using (false)
with check (false);
