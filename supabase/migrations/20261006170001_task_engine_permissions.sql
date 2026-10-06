-- Task Engine role boundary.
create or replace function public.can_manage_tasks()
returns boolean
language sql stable security definer
set search_path = public, pg_temp
as $$
  select exists(
    select 1 from public.app_roles
    where user_id = auth.uid()
      and role in ('owner','admin','manager','staff','builder')
      and active = true
  );
$$;

create or replace function public.can_update_assigned_task(p_assigned_to uuid)
returns boolean
language sql stable security definer
set search_path = public, pg_temp
as $$
  select auth.uid() = p_assigned_to
    and exists(
      select 1 from public.app_roles
      where user_id = auth.uid()
        and role in ('advisor','agent','builder','staff','manager','owner','admin')
        and active = true
    );
$$;

revoke execute on function public.can_manage_tasks() from public, anon, authenticated;
revoke execute on function public.can_update_assigned_task(uuid) from public, anon, authenticated;
