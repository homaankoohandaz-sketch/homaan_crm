-- BuildWise AI: scope sensitive CRM SECURITY DEFINER RPCs
-- Limit phone existence/person-id lookups to trusted CRM roles and prevent
-- authenticated users from probing other users' appointment schedules.

create or replace function public.crm_phone_exists(p_phone text)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $function$
declare
  v_hash text;
  v_result jsonb;
begin
  if auth.uid() is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  if not exists (
    select 1
    from public.app_roles ar
    where ar.user_id = auth.uid()
      and ar.active = true
      and ar.role in ('owner','admin','manager','staff')
  ) then
    raise exception 'FORBIDDEN_ROLE';
  end if;

  if p_phone is null or btrim(p_phone) = '' then
    raise exception 'INVALID_PHONE';
  end if;

  v_hash := pg_catalog.encode(
    extensions.digest(public.normalize_crm_phone(p_phone), 'sha256'),
    'hex'
  );

  select jsonb_build_object('exists', true, 'person_id', cpp.person_id)
    into v_result
  from public.crm_person_private cpp
  where cpp.phone_hash = v_hash
  limit 1;

  return coalesce(v_result, jsonb_build_object('exists', false));
end;
$function$;

create or replace function public.crm_schedule_conflict(
  p_start timestamp with time zone,
  p_end timestamp with time zone,
  p_assigned_to uuid default null,
  p_lead_id bigint default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_is_manager boolean;
begin
  if auth.uid() is null or not public.is_active_user() then
    raise exception 'UNAUTHORIZED';
  end if;

  if p_start is null or p_end is null or p_end < p_start then
    raise exception 'INVALID_TIME_RANGE';
  end if;

  v_is_manager := public.is_manager_user();

  return jsonb_build_object(
    'conflict',
    exists (
      select 1
      from public.appointments a
      where a.status is distinct from 'cancelled'
        and a.scheduled_at >= p_start - interval '90 minutes'
        and a.scheduled_at <= p_end
        and (
          (v_is_manager and (p_assigned_to is null or a.created_by = p_assigned_to))
          or
          (not v_is_manager and a.created_by = auth.uid())
        )
    ),
    'lead_conflict',
    exists (
      select 1
      from public.appointments a
      where a.status is distinct from 'cancelled'
        and p_lead_id is not null
        and a.lead_id = p_lead_id
        and a.scheduled_at >= p_start - interval '90 minutes'
        and a.scheduled_at <= p_end
        and (v_is_manager or a.created_by = auth.uid())
    )
  );
end;
$function$;

revoke all on function public.crm_phone_exists(text) from public, anon;
grant execute on function public.crm_phone_exists(text) to authenticated;
revoke all on function public.crm_schedule_conflict(timestamptz,timestamptz,uuid,bigint) from public, anon;
grant execute on function public.crm_schedule_conflict(timestamptz,timestamptz,uuid,bigint) to authenticated;
