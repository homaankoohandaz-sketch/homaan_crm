-- Provision new advisor registrations as inactive application roles.
-- requested_role is intentionally limited to advisor; privileged roles are never self-assigned.
create or replace function public.provision_advisor_role_on_signup()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if coalesce(new.raw_user_meta_data ->> 'requested_role', '') = 'advisor' then
    insert into public.app_roles (user_id, full_name, role, active, email)
    values (new.id, nullif(new.raw_user_meta_data ->> 'full_name',''), 'advisor', false, new.email)
    on conflict (user_id) do nothing;
  end if;
  return new;
end;
$$;

revoke execute on function public.provision_advisor_role_on_signup() from public;
drop trigger if exists on_auth_user_created_provision_advisor on auth.users;
create trigger on_auth_user_created_provision_advisor after insert on auth.users for each row execute function public.provision_advisor_role_on_signup();