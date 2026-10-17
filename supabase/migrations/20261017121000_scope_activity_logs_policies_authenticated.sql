-- Scope audit-log reads to signed-in users only.
-- Preserve the existing owner/self row predicates; change only the target role.
-- Public customer entry flows use Edge Functions and do not need anon access to audit logs.
begin;

alter policy activity_logs_owner_select
  on public.activity_logs
  to authenticated;

alter policy activity_logs_self_select
  on public.activity_logs
  to authenticated;

commit;
