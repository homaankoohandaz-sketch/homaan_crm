-- Scope audit-log reads to signed-in users only.
-- The existing predicates (owner/self) are preserved; only the target role changes.
-- Public customer entry flows use Edge Functions and do not need anon access to activity_logs.
begin;

alter policy activity_logs_owner_select
  on public.activity_logs
  to authenticated;

alter policy activity_logs_self_select
  on public.activity_logs
  to authenticated;

commit;
