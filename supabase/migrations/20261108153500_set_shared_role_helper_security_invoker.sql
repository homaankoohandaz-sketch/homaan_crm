-- Keep the shared role predicate under caller privileges; app_roles RLS governs its read.
alter function public.has_any_active_role(text[]) security invoker;
alter function public.has_any_active_role(text[]) set search_path = public, pg_temp;
revoke all on function public.has_any_active_role(text[]) from public, anon;
grant execute on function public.has_any_active_role(text[]) to authenticated;
