-- Task authorization helpers are RLS internals, not public RPCs.
revoke execute on function public.can_manage_tasks() from public, anon, authenticated;
revoke execute on function public.can_update_assigned_task(uuid) from public, anon, authenticated;
