-- BuildWise AI — Security Hardening 599-600
-- Safe rollout: trigger-only RPCs are closed to API callers; authenticated SECURITY DEFINER
-- RPCs retain only the minimum explicit caller gate required by their current contract.
-- 599 = phone visibility rules. 600 = sensitive-field masking/exposure reduction.

-- ------------------------------------------------------------
-- A. SECURITY DEFINER audit: 23 authenticated-callable functions
-- ------------------------------------------------------------

-- Trigger-only functions: never API endpoints.
revoke execute on function public.log_lead_request_time() from public, anon, authenticated;
revoke execute on function public.check_report_threshold() from public, anon, authenticated;

-- Functions already role/user-gated remain callable where their current contract requires it.
-- Add the missing active-user gates to read/control RPCs that otherwise bypass RLS.
create or replace function public.crm_deal_radar()
returns setof public.deal_radar
language sql
security definer
set search_path = public, pg_temp
as $function$
  select r.*
  from public.deal_radar r
  where public.is_active_user()
    and r.status='open'
  order by r.priority desc,r.created_at desc
  limit 100
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
set search_path = public, pg_temp
as $function$
begin
  if not public.is_active_user() then
    raise exception 'unauthorized';
  end if;

  return jsonb_build_object(
    'conflict', exists(
      select 1
      from public.appointments a
      where a.status is distinct from 'cancelled'
        and a.scheduled_at >= p_start - interval '90 minutes'
        and a.scheduled_at <= p_end
        and (p_assigned_to is null or a.created_by=p_assigned_to)
    ),
    'lead_conflict', exists(
      select 1
      from public.appointments a
      where a.status is distinct from 'cancelled'
        and p_lead_id is not null
        and a.lead_id=p_lead_id
        and a.scheduled_at >= p_start - interval '90 minutes'
        and a.scheduled_at <= p_end
    )
  );
end;
$function$;

create or replace function public.buildwise_plan_status()
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $function$
declare p text := 'FREE'; r jsonb;
begin
  if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;
  select coalesce(up.plan_code,'FREE') into p
  from public.user_plans up
  where up.user_id=auth.uid() and up.active=true
    and (up.expires_at is null or up.expires_at>now());

  select jsonb_build_object(
    'plan',p,
    'limits',coalesce(
      (select jsonb_object_agg(feature_key,limit_value)
       from public.plan_limits
       where plan_code=p and enabled),
      '{}'::jsonb)
  ) into r;
  return r;
end;
$function$;

-- These two project-control RPCs are shared authenticated read/control surfaces.
-- They must at least require an active BuildWise user before bypassing RLS.
create or replace function public.buildwise_project_dashboard(p_project_id bigint)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $function$
declare r jsonb;
begin
  if not public.is_active_user() then raise exception 'unauthorized'; end if;

  select jsonb_build_object(
    'project', (select to_jsonb(p) from public.construction_projects p where p.id=p_project_id),
    'schedule', jsonb_build_object(
      'tasks',(select count(*) from public.project_schedule_tasks where project_id=p_project_id),
      'critical_open',(select count(*) from public.project_schedule_tasks where project_id=p_project_id and is_critical and status not in ('done','completed')),
      'late',(select count(*) from public.project_schedule_tasks where project_id=p_project_id and planned_finish < current_date and status not in ('done','completed'))
    ),
    'cost', jsonb_build_object(
      'budget',(select coalesce(current_budget,baseline_budget,0) from public.construction_projects where id=p_project_id),
      'actual',(select coalesce(actual_cost,0) from public.construction_projects where id=p_project_id),
      'committed',(select coalesce(sum(committed_amount),0) from public.project_commitments where project_id=p_project_id),
      'change_orders',(select coalesce(sum(amount_delta),0) from public.project_change_orders where project_id=p_project_id and status='approved')
    ),
    'procurement', jsonb_build_object(
      'open',(select count(*) from public.project_procurement where project_id=p_project_id and status not in ('delivered','closed')),
      'late',(select count(*) from public.project_procurement where project_id=p_project_id and required_at < current_date and status not in ('delivered','closed'))
    ),
    'quality', jsonb_build_object(
      'open',(select count(*) from public.project_quality_checks where project_id=p_project_id and status not in ('resolved','closed')),
      'critical',(select count(*) from public.project_site_observations where project_id=p_project_id and severity='critical' and status='open')
    ),
    'risks', jsonb_build_object(
      'open',(select count(*) from public.project_risks where project_id=p_project_id and status='open'),
      'high',(select count(*) from public.project_risks where project_id=p_project_id and status='open' and score>=12)
    ),
    'rfis', jsonb_build_object(
      'open',(select count(*) from public.project_rfis where project_id=p_project_id and status='open'),
      'overdue',(select count(*) from public.project_rfis where project_id=p_project_id and status='open' and due_date < current_date)
    ),
    'submittals', jsonb_build_object(
      'open',(select count(*) from public.project_submittals where project_id=p_project_id and status not in ('approved','closed'))
    ),
    'last_daily_log',(select to_jsonb(d) from public.project_daily_logs d where d.project_id=p_project_id order by log_date desc,id desc limit 1),
    'last_progress',(select to_jsonb(s) from public.project_progress_snapshots s where s.project_id=p_project_id order by snapshot_date desc,id desc limit 1)
  ) into r;
  return coalesce(r,'{}'::jsonb);
end;
$function$;

create or replace function public.buildwise_ai_control_scan(p_project_id bigint)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $function$
declare
  late_tasks integer := 0; overdue_rfis integer := 0; overdue_proc integer := 0;
  open_quality integer := 0; high_risks integer := 0; alerts_created integer := 0; p record;
begin
  if not public.is_active_user() then raise exception 'unauthorized'; end if;

  select * into p from public.construction_projects where id=p_project_id;
  if not found then return jsonb_build_object('ok',false,'error','project_not_found'); end if;

  select count(*) into late_tasks from public.project_schedule_tasks
    where project_id=p_project_id and coalesce(status,'') not in ('done','completed','closed') and planned_finish < current_date;
  select count(*) into overdue_rfis from public.project_rfis
    where project_id=p_project_id and coalesce(status,'') not in ('answered','closed','resolved') and due_date < current_date;
  select count(*) into overdue_proc from public.project_procurement
    where project_id=p_project_id and coalesce(status,'') not in ('delivered','closed','cancelled') and required_at < current_date and delivered_at is null;
  select count(*) into open_quality from public.project_quality_checks
    where project_id=p_project_id and coalesce(status,'') not in ('closed','resolved','passed');
  select count(*) into high_risks from public.project_risks
    where project_id=p_project_id and coalesce(status,'') not in ('closed','resolved') and coalesce(score,0)>=12;

  if late_tasks > 0 then
    insert into public.project_ai_alerts(project_id,alert_type,severity,title,explanation,evidence,recommendation,status,source,metadata)
    select p_project_id,'schedule_delay','high','تأخیر در برنامه زمان‌بندی','AI چند فعالیت با تاریخ پایان گذشته و وضعیت باز پیدا کرد.',
      jsonb_build_object('late_tasks',late_tasks,'scan_date',current_date),'فعالیت‌های عقب‌افتاده را بررسی و برنامه اصلاحی ثبت کنید.','open','rule_ai',jsonb_build_object('dedupe_key','late_tasks');
    alerts_created := alerts_created + 1;
  end if;
  if overdue_rfis > 0 then
    insert into public.project_ai_alerts(project_id,alert_type,severity,title,explanation,evidence,recommendation,status,source,metadata)
    select p_project_id,'rfi_delay','medium','RFI معوق','پاسخ تعدادی از RFIها از مهلت تعیین‌شده عبور کرده است.',
      jsonb_build_object('overdue_rfis',overdue_rfis),'مسئول پاسخ را مشخص و موعد جدید تعیین کنید.','open','rule_ai',jsonb_build_object('dedupe_key','overdue_rfi');
    alerts_created := alerts_created + 1;
  end if;
  if overdue_proc > 0 then
    insert into public.project_ai_alerts(project_id,alert_type,severity,title,explanation,evidence,recommendation,status,source,metadata)
    select p_project_id,'procurement_delay','high','تأخیر در تأمین','مواردی از خرید از تاریخ موردنیاز عبور کرده‌اند و تحویل نشده‌اند.',
      jsonb_build_object('overdue_procurement',overdue_proc),'خریدهای معوق را با فعالیت‌های برنامه زمان‌بندی تطبیق دهید.','open','rule_ai',jsonb_build_object('dedupe_key','overdue_procurement');
    alerts_created := alerts_created + 1;
  end if;
  if high_risks > 0 then
    insert into public.project_ai_alerts(project_id,alert_type,severity,title,explanation,evidence,recommendation,status,source,metadata)
    select p_project_id,'high_risk','critical','ریسک با امتیاز بالا','ریسک باز با امتیاز بالا شناسایی شد.',
      jsonb_build_object('high_risks',high_risks),'اقدام کاهشی و مسئول ریسک را بررسی کنید.','open','rule_ai',jsonb_build_object('dedupe_key','high_risk');
    alerts_created := alerts_created + 1;
  end if;
  if coalesce(p.current_budget,0)>0 and coalesce(p.actual_cost,0)>coalesce(p.current_budget,0)*1.05 then
    insert into public.project_ai_alerts(project_id,alert_type,severity,title,explanation,evidence,recommendation,status,source,metadata)
    select p_project_id,'cost_overrun','critical','انحراف هزینه','هزینه واقعی بیش از ۵٪ از بودجه جاری عبور کرده است.',
      jsonb_build_object('budget',p.current_budget,'actual_cost',p.actual_cost,'variance_percent',round(((p.actual_cost-p.current_budget)/p.current_budget)*100,2)),
      'هزینه‌ها و تعهدات را بررسی و علت انحراف را ثبت کنید.','open','rule_ai',jsonb_build_object('dedupe_key','cost_overrun');
    alerts_created := alerts_created + 1;
  end if;

  return jsonb_build_object('ok',true,'late_tasks',late_tasks,'overdue_rfis',overdue_rfis,
    'overdue_procurement',overdue_proc,'open_quality',open_quality,'high_risks',high_risks,
    'alerts_created',alerts_created,'scanned_at',now());
end;
$function$;

-- ------------------------------------------------------------
-- B. 599 — explicit phone visibility policy
-- ------------------------------------------------------------
insert into public.security_field_policies
  (entity_type,field_name,visibility,roles,mask_strategy,active)
select 'person','phone','manager_only',array['owner','admin','manager'],'none',true
where not exists (
  select 1 from public.security_field_policies
  where entity_type='person' and field_name='phone'
);
insert into public.security_field_policies
  (entity_type,field_name,visibility,roles,mask_strategy,active)
select 'person','emergency_phone','manager_only',array['owner','admin','manager'],'none',true
where not exists (
  select 1 from public.security_field_policies
  where entity_type='person' and field_name='emergency_phone'
);
insert into public.security_field_policies
  (entity_type,field_name,visibility,roles,mask_strategy,active)
select 'property','mobile','manager_only',array['owner','admin','manager'],'none',true
where not exists (
  select 1 from public.security_field_policies
  where entity_type='property' and field_name='mobile'
);
insert into public.security_field_policies
  (entity_type,field_name,visibility,roles,mask_strategy,active)
select 'property','emergency_phone','manager_only',array['owner','admin','manager'],'none',true
where not exists (
  select 1 from public.security_field_policies
  where entity_type='property' and field_name='emergency_phone'
);

-- ------------------------------------------------------------
-- C. 600 — sensitive data masking / exposure reduction
-- ------------------------------------------------------------

create or replace function public.crm_mask_phone(p_phone text)
returns text
language sql
immutable
strict
security invoker
set search_path = pg_catalog
as $function$
  select case
    when length(p_phone) <= 4 then repeat('•', length(p_phone))
    else left(p_phone,2) || repeat('•', greatest(length(p_phone)-6,2)) || right(p_phone,4)
  end
$function$;

-- The public client property surface is rebuilt narrowly. It intentionally omits:
-- mobile, emergency_phone, owner_notes, internal_notes.
-- Exact phone access remains through the existing manager-gated crm_manager_phone RPC.
drop view if exists public.properties_client;

create view public.properties_client
with (security_invoker = true)
as
select
  id, property_code, source, rate, status, request_type, property_type,
  ownership_type, usage_type, region, neighborhood, street, property_name,
  alley, side_street, plaque, location_lat, location_lng, frontage,
  passage_width, land_area, built_area, floor, total_floors, bedrooms,
  building_age, unit_count, parking_count, storage_count, elevator,
  regulation, density, allowed_floors, occupancy_percent, setback,
  number_of_fronts, aggregation_possible, permit_status, completion_status,
  total_price, price_per_meter, entry_price, full_deposit, deposit_amount,
  rent_amount, barter_possible, barter_details, payment_terms,
  owner_asking_price, negotiable_price, owner_id, description,
  created_at, updated_at, last_contact_at, next_followup_at,
  created_by, updated_by, units_per_floor, width, title_status,
  convertible, alley_name, sub_alley, entrance_info, year_registered,
  rating, activity_status, listing_type, owner_name
from public.properties
where public.is_active_user();

revoke all on table public.properties_client from anon;
grant select on table public.properties_client to authenticated;

-- Prevent direct API reads of sensitive property fields while preserving existing
-- non-sensitive property reads and the write path. Column-level grants are explicit.
revoke select on table public.properties from anon, authenticated;

do $grant$
declare
  cols text;
begin
  select string_agg(format('%I',column_name), ', ' order by ordinal_position)
    into cols
  from information_schema.columns
  where table_schema='public'
    and table_name='properties'
    and column_name not in ('mobile','emergency_phone');

  execute 'grant select (' || cols || ') on table public.properties to authenticated';
end
$grant$;

-- 600 regression boundary: the two sensitive property columns are not selectable
-- through the authenticated base-table API.
revoke select (mobile, emergency_phone) on table public.properties from anon, authenticated;

-- Keep write permissions unchanged; SELECT is now through the safe client view.
