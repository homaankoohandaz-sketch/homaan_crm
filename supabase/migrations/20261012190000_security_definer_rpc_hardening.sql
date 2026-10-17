-- BuildWise AI: SECURITY DEFINER quota RPC hardening
-- Closes negative-amount quota bypass and blocks inactive authenticated accounts.
-- Preserve SECURITY DEFINER where required for protected plan/usage tables.

create or replace function public.buildwise_check_limit(
  p_feature_key text,
  p_amount bigint default 1
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_plan text := 'FREE';
  v_limit bigint;
  v_used bigint := 0;
  v_current_count bigint := 0;
begin
  if auth.uid() is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  if p_amount is null or p_amount < 0 then
    raise exception 'INVALID_AMOUNT';
  end if;

  if not public.is_active_user() then
    raise exception 'INACTIVE_USER';
  end if;

  if p_feature_key is null or btrim(p_feature_key) = '' then
    raise exception 'FEATURE_REQUIRED';
  end if;

  select coalesce(up.plan_code, 'FREE')
    into v_plan
  from public.user_plans up
  where up.user_id = auth.uid()
    and up.active = true
    and (up.expires_at is null or up.expires_at > now());

  select pl.limit_value
    into v_limit
  from public.plan_limits pl
  where pl.plan_code = v_plan
    and pl.feature_key = p_feature_key
    and pl.enabled = true;

  if v_limit is null then
    return jsonb_build_object(
      'allowed', false,
      'reason', 'FEATURE_NOT_CONFIGURED',
      'plan', v_plan,
      'feature', p_feature_key
    );
  end if;

  if p_feature_key = 'max_properties' then
    select count(*) into v_current_count
    from public.properties
    where created_by = auth.uid();
  elsif p_feature_key = 'max_leads' then
    select count(*) into v_current_count
    from public.leads
    where created_by = auth.uid();
  elsif p_feature_key = 'max_projects' then
    select count(*) into v_current_count
    from public.construction_projects
    where created_by = auth.uid();
  end if;

  if p_feature_key in (
    'max_ai_requests',
    'max_image_generations',
    'max_video_generations',
    'max_telegram_actions',
    'max_automation_runs'
  ) then
    select coalesce((
      select pum.used_count
      from public.plan_usage_monthly pum
      where pum.user_id = auth.uid()
        and pum.month_start = date_trunc('month', current_date)::date
        and pum.feature_key = p_feature_key
    ), 0) into v_used;
  end if;

  if v_limit = -1 then
    return jsonb_build_object(
      'allowed', true, 'plan', v_plan, 'feature', p_feature_key,
      'limit', v_limit,
      'used', case when p_feature_key in ('max_properties','max_leads','max_projects')
                   then v_current_count else v_used end,
      'remaining', -1
    );
  end if;

  if p_feature_key in ('max_properties','max_leads','max_projects') then
    return jsonb_build_object(
      'allowed', v_current_count + p_amount <= v_limit,
      'plan', v_plan, 'feature', p_feature_key, 'limit', v_limit,
      'used', v_current_count,
      'remaining', greatest(v_limit - v_current_count, 0)
    );
  end if;

  return jsonb_build_object(
    'allowed', v_used + p_amount <= v_limit,
    'plan', v_plan, 'feature', p_feature_key, 'limit', v_limit,
    'used', v_used,
    'remaining', greatest(v_limit - v_used, 0)
  );
end;
$function$;

create or replace function public.buildwise_consume(
  p_feature_key text,
  p_amount bigint default 1
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_check jsonb;
  v_limit bigint;
  v_plan text;
begin
  if auth.uid() is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  if p_amount is null or p_amount <= 0 then
    raise exception 'INVALID_AMOUNT';
  end if;

  if not public.is_active_user() then
    raise exception 'INACTIVE_USER';
  end if;

  v_check := public.buildwise_check_limit(p_feature_key, p_amount);
  if coalesce((v_check->>'allowed')::boolean, false) = false then
    return v_check;
  end if;

  v_plan := v_check->>'plan';
  v_limit := coalesce((v_check->>'limit')::bigint, -1);

  if p_feature_key not in ('max_properties','max_leads','max_projects')
     and v_limit <> -1 then
    insert into public.plan_usage_monthly
      (user_id, month_start, feature_key, used_count, updated_at)
    values
      (auth.uid(), date_trunc('month', current_date)::date,
       p_feature_key, p_amount, now())
    on conflict (user_id, month_start, feature_key)
    do update set
      used_count = public.plan_usage_monthly.used_count + excluded.used_count,
      updated_at = now();
  end if;

  return public.buildwise_check_limit(p_feature_key, 0);
end;
$function$;

create or replace function public.buildwise_plan_status()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_plan text := 'FREE';
  v_result jsonb;
begin
  if auth.uid() is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  if not public.is_active_user() then
    raise exception 'INACTIVE_USER';
  end if;

  select coalesce(up.plan_code, 'FREE')
    into v_plan
  from public.user_plans up
  where up.user_id = auth.uid()
    and up.active = true
    and (up.expires_at is null or up.expires_at > now());

  select jsonb_build_object(
    'plan', v_plan,
    'limits', coalesce(
      (select jsonb_object_agg(pl.feature_key, pl.limit_value)
       from public.plan_limits pl
       where pl.plan_code = v_plan and pl.enabled),
      '{}'::jsonb
    )
  ) into v_result;

  return v_result;
end;
$function$;

-- Keep intended authenticated RPC use explicit; no anonymous execution.
revoke all on function public.buildwise_check_limit(text,bigint) from public, anon;
grant execute on function public.buildwise_check_limit(text,bigint) to authenticated;
revoke all on function public.buildwise_consume(text,bigint) from public, anon;
grant execute on function public.buildwise_consume(text,bigint) to authenticated;
revoke all on function public.buildwise_plan_status() from public, anon;
grant execute on function public.buildwise_plan_status() to authenticated;
