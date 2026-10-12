-- Enforce resource plan limits at the database boundary; UI checks are advisory only.
create or replace function public.enforce_plan_resource_limit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_uid uuid;
  v_plan text := 'FREE';
  v_feature text;
  v_limit bigint;
  v_current bigint := 0;
begin
  -- Never trust a client-supplied created_by for authenticated writes.
  v_uid := auth.uid();
  if v_uid is null then v_uid := new.created_by; end if;
  if v_uid is null then return new; end if;

  if tg_table_name = 'properties' then v_feature := 'max_properties';
  elsif tg_table_name = 'leads' then v_feature := 'max_leads';
  elsif tg_table_name = 'construction_projects' then v_feature := 'max_projects';
  else raise exception 'unsupported_quota_table';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext(v_uid::text));

  select coalesce(up.plan_code, 'FREE') into v_plan
  from public.user_plans up
  where up.user_id = v_uid and up.active = true
    and (up.expires_at is null or up.expires_at > now())
  order by up.updated_at desc nulls last limit 1;

  select pl.limit_value into v_limit
  from public.plan_limits pl
  where pl.plan_code = v_plan and pl.feature_key = v_feature and pl.enabled = true;

  if v_limit is null then raise exception 'FEATURE_NOT_CONFIGURED:%', v_feature; end if;
  if v_limit = -1 then return new; end if;

  if v_feature = 'max_properties' then
    select count(*) into v_current from public.properties where created_by = v_uid;
  elsif v_feature = 'max_leads' then
    select count(*) into v_current from public.leads where created_by = v_uid;
  else
    select count(*) into v_current from public.construction_projects where created_by = v_uid;
  end if;

  if v_current >= v_limit then raise exception 'PLAN_LIMIT_REACHED:%', v_feature; end if;
  return new;
end;
$function$;

revoke all on function public.enforce_plan_resource_limit() from public, anon, authenticated;
grant execute on function public.enforce_plan_resource_limit() to postgres, service_role;

drop trigger if exists enforce_plan_limit_properties on public.properties;
create trigger enforce_plan_limit_properties before insert on public.properties
for each row execute function public.enforce_plan_resource_limit();

drop trigger if exists enforce_plan_limit_leads on public.leads;
create trigger enforce_plan_limit_leads before insert on public.leads
for each row execute function public.enforce_plan_resource_limit();

drop trigger if exists enforce_plan_limit_construction_projects on public.construction_projects;
create trigger enforce_plan_limit_construction_projects before insert on public.construction_projects
for each row execute function public.enforce_plan_resource_limit();
