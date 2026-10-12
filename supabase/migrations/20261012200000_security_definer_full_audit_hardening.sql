-- BuildWise AI: consolidated SECURITY DEFINER RPC hardening.
-- Reproducible source for the production hardening already applied to Supabase.
-- Includes authorization checks, constrained dynamic edits, privacy-safe phone lookup,
-- caller-scoped scheduling checks, and atomic monthly quota consumption.

CREATE OR REPLACE FUNCTION public.buildwise_ai_control_scan(p_project_id bigint)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare
  late_tasks integer := 0; overdue_rfis integer := 0; overdue_proc integer := 0;
  open_quality integer := 0; high_risks integer := 0; alerts_created integer := 0; p record;
begin
  if not public.is_active_user() then raise exception 'unauthorized'; end if;
  select * into p from public.construction_projects where id=p_project_id;
  if not found then return jsonb_build_object('ok',false,'error','project_not_found'); end if;
  if p.created_by is distinct from auth.uid() and not public.is_manager_user() then
    raise exception 'forbidden_project';
  end if;
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
    values(p_project_id,'schedule_delay','high','تأخیر در برنامه زمان‌بندی','AI چند فعالیت با تاریخ پایان گذشته و وضعیت باز پیدا کرد.',
      jsonb_build_object('late_tasks',late_tasks,'scan_date',current_date),'فعالیت‌های عقب‌افتاده را بررسی و برنامه اصلاحی ثبت کنید.','open','rule_ai',jsonb_build_object('dedupe_key','late_tasks'));
    alerts_created := alerts_created + 1;
  end if;
  if overdue_rfis > 0 then
    insert into public.project_ai_alerts(project_id,alert_type,severity,title,explanation,evidence,recommendation,status,source,metadata)
    values(p_project_id,'rfi_delay','medium','RFI معوق','پاسخ تعدادی از RFIها از مهلت تعیین‌شده عبور کرده است.',
      jsonb_build_object('overdue_rfis',overdue_rfis),'مسئول پاسخ را مشخص و موعد جدید تعیین کنید.','open','rule_ai',jsonb_build_object('dedupe_key','overdue_rfi'));
    alerts_created := alerts_created + 1;
  end if;
  if overdue_proc > 0 then
    insert into public.project_ai_alerts(project_id,alert_type,severity,title,explanation,evidence,recommendation,status,source,metadata)
    values(p_project_id,'procurement_delay','high','تأخیر در تأمین','مواردی از خرید از تاریخ موردنیاز عبور کرده‌اند و تحویل نشده‌اند.',
      jsonb_build_object('overdue_procurement',overdue_proc),'خریدهای معوق را با فعالیت‌های برنامه زمان‌بندی تطبیق دهید.','open','rule_ai',jsonb_build_object('dedupe_key','overdue_procurement'));
    alerts_created := alerts_created + 1;
  end if;
  if high_risks > 0 then
    insert into public.project_ai_alerts(project_id,alert_type,severity,title,explanation,evidence,recommendation,status,source,metadata)
    values(p_project_id,'high_risk','critical','ریسک با امتیاز بالا','ریسک باز با امتیاز بالا شناسایی شد.',
      jsonb_build_object('high_risks',high_risks),'اقدام کاهشی و مسئول ریسک را بررسی کنید.','open','rule_ai',jsonb_build_object('dedupe_key','high_risk'));
    alerts_created := alerts_created + 1;
  end if;
  if coalesce(p.current_budget,0)>0 and coalesce(p.actual_cost,0)>coalesce(p.current_budget,0)*1.05 then
    insert into public.project_ai_alerts(project_id,alert_type,severity,title,explanation,evidence,recommendation,status,source,metadata)
    values(p_project_id,'cost_overrun','critical','انحراف هزینه','هزینه واقعی بیش از ۵٪ از بودجه جاری عبور کرده است.',
      jsonb_build_object('budget',p.current_budget,'actual_cost',p.actual_cost,'variance_percent',round(((p.actual_cost-p.current_budget)/p.current_budget)*100,2)),
      'هزینه‌ها و تعهدات را بررسی و علت انحراف را ثبت کنید.','open','rule_ai',jsonb_build_object('dedupe_key','cost_overrun'));
    alerts_created := alerts_created + 1;
  end if;
  return jsonb_build_object('ok',true,'late_tasks',late_tasks,'overdue_rfis',overdue_rfis,
    'overdue_procurement',overdue_proc,'open_quality',open_quality,'high_risks',high_risks,
    'alerts_created',alerts_created,'scanned_at',now());
end;
$function$;

CREATE OR REPLACE FUNCTION public.buildwise_check_limit(p_feature_key text, p_amount bigint DEFAULT 1)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare v_plan text := 'FREE'; v_limit bigint; v_used bigint:=0; v_current_count bigint:=0;
begin
  if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;
  if not public.is_active_user() then raise exception 'INACTIVE_USER'; end if;
  if p_amount is null or p_amount<0 then raise exception 'INVALID_AMOUNT'; end if;
  if p_feature_key is null or btrim(p_feature_key)='' then raise exception 'FEATURE_REQUIRED'; end if;
  select coalesce(up.plan_code,'FREE') into v_plan from public.user_plans up
   where up.user_id=auth.uid() and up.active=true and (up.expires_at is null or up.expires_at>now())
   order by up.updated_at desc nulls last limit 1;
  select pl.limit_value into v_limit from public.plan_limits pl
   where pl.plan_code=v_plan and pl.feature_key=p_feature_key and pl.enabled=true;
  if v_limit is null then return jsonb_build_object('allowed',false,'reason','FEATURE_NOT_CONFIGURED','plan',v_plan,'feature',p_feature_key); end if;
  if p_feature_key='max_properties' then
    select count(*) into v_current_count from public.properties where created_by=auth.uid();
  elsif p_feature_key='max_leads' then
    select count(*) into v_current_count from public.leads where created_by=auth.uid();
  elsif p_feature_key='max_projects' then
    select count(*) into v_current_count from public.construction_projects where created_by=auth.uid();
  else
    select coalesce((select u.used_count from public.plan_usage_monthly u where u.user_id=auth.uid()
      and u.month_start=date_trunc('month',current_date)::date and u.feature_key=p_feature_key),0) into v_used;
  end if;
  if v_limit=-1 then return jsonb_build_object('allowed',true,'plan',v_plan,'feature',p_feature_key,'limit',-1,
    'used',case when p_feature_key in ('max_properties','max_leads','max_projects') then v_current_count else v_used end,'remaining',-1); end if;
  if p_feature_key in ('max_properties','max_leads','max_projects') then
    return jsonb_build_object('allowed',v_current_count+p_amount<=v_limit,'plan',v_plan,'feature',p_feature_key,
      'limit',v_limit,'used',v_current_count,'remaining',greatest(v_limit-v_current_count,0));
  end if;
  return jsonb_build_object('allowed',v_used+p_amount<=v_limit,'plan',v_plan,'feature',p_feature_key,
    'limit',v_limit,'used',v_used,'remaining',greatest(v_limit-v_used,0));
end $function$;

CREATE OR REPLACE FUNCTION public.buildwise_consume(p_feature_key text, p_amount bigint DEFAULT 1)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare v_plan text:='FREE'; v_limit bigint; v_used bigint:=0; v_new_used bigint;
begin
  if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;
  if not public.is_active_user() then raise exception 'INACTIVE_USER'; end if;
  if p_amount is null or p_amount<=0 then raise exception 'INVALID_AMOUNT'; end if;
  if p_feature_key is null or btrim(p_feature_key)='' then raise exception 'FEATURE_REQUIRED'; end if;
  select coalesce(up.plan_code,'FREE') into v_plan from public.user_plans up
   where up.user_id=auth.uid() and up.active=true and (up.expires_at is null or up.expires_at>now())
   order by up.updated_at desc nulls last limit 1;
  select pl.limit_value into v_limit from public.plan_limits pl
   where pl.plan_code=v_plan and pl.feature_key=p_feature_key and pl.enabled=true;
  if v_limit is null then return jsonb_build_object('allowed',false,'reason','FEATURE_NOT_CONFIGURED','plan',v_plan,'feature',p_feature_key); end if;
  if p_feature_key in ('max_properties','max_leads','max_projects') then
    return public.buildwise_check_limit(p_feature_key,p_amount);
  end if;
  if v_limit=-1 then return public.buildwise_check_limit(p_feature_key,0); end if;
  insert into public.plan_usage_monthly(user_id,month_start,feature_key,used_count,updated_at)
    select auth.uid(),date_trunc('month',current_date)::date,p_feature_key,p_amount,now()
    where p_amount<=v_limit
    on conflict(user_id,month_start,feature_key) do update
      set used_count=public.plan_usage_monthly.used_count+excluded.used_count,updated_at=now()
      where public.plan_usage_monthly.used_count+excluded.used_count<=v_limit
    returning used_count into v_new_used;
  if v_new_used is null then
    select coalesce(used_count,0) into v_used from public.plan_usage_monthly
      where user_id=auth.uid() and month_start=date_trunc('month',current_date)::date and feature_key=p_feature_key;
    return jsonb_build_object('allowed',false,'reason','LIMIT_REACHED','plan',v_plan,'feature',p_feature_key,
      'limit',v_limit,'used',coalesce(v_used,0),'remaining',greatest(v_limit-coalesce(v_used,0),0));
  end if;
  return jsonb_build_object('allowed',true,'plan',v_plan,'feature',p_feature_key,'limit',v_limit,
    'used',v_new_used,'remaining',greatest(v_limit-v_new_used,0));
end $function$;

CREATE OR REPLACE FUNCTION public.buildwise_project_dashboard(p_project_id bigint)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare r jsonb; project_owner uuid;
begin
  if not public.is_active_user() then raise exception 'unauthorized'; end if;
  select created_by into project_owner from public.construction_projects where id=p_project_id;
  if not found then raise exception 'project_not_found'; end if;
  if project_owner is distinct from auth.uid() and not public.is_manager_user() then
    raise exception 'forbidden_project';
  end if;
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

CREATE OR REPLACE FUNCTION public.crm_match_score(p_request_id bigint, p_property_id bigint)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare r public.crm_requests%rowtype; p public.properties%rowtype; s numeric:=0; b jsonb:='{}'::jsonb;
begin
  if not public.is_active_user() then raise exception 'unauthorized'; end if;
  select * into r from public.crm_requests where id=p_request_id;
  if r.id is null then return jsonb_build_object('score',0,'breakdown',b); end if;
  if r.created_by is distinct from auth.uid() and coalesce(r.assigned_to::text,'') <> auth.uid()::text and not public.is_manager_user() then
    raise exception 'forbidden_request';
  end if;
  select * into p from public.properties where id=p_property_id;
  if p.id is null then return jsonb_build_object('score',0,'breakdown',b); end if;
  if r.property_type is null or lower(coalesce(p.property_type,''))=lower(r.property_type) then s:=s+20; b:=b||jsonb_build_object('property_type',20); end if;
  if r.region is null or p.region=r.region then s:=s+20; b:=b||jsonb_build_object('region',20); end if;
  if r.bedrooms is null or coalesce(p.bedrooms,0)>=r.bedrooms then s:=s+15; b:=b||jsonb_build_object('bedrooms',15); end if;
  if r.budget_max is null or coalesce(p.total_price,0)<=r.budget_max then s:=s+20; b:=b||jsonb_build_object('budget',20);
  elsif r.budget_max is not null and p.total_price <= r.budget_max*1.1 then s:=s+10; b:=b||jsonb_build_object('budget',10); end if;
  if r.neighborhood is null or lower(coalesce(p.neighborhood,''))=lower(r.neighborhood) then s:=s+15; b:=b||jsonb_build_object('neighborhood',15); end if;
  return jsonb_build_object('score',least(100,s),'breakdown',b);
end;
$function$;

CREATE OR REPLACE FUNCTION public.crm_phone_exists(p_phone text)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare h text; found_match boolean;
begin
  if not public.is_active_user() then raise exception 'unauthorized'; end if;
  if not (public.is_manager_user() or public.my_role() in ('owner','staff')) then
    raise exception 'forbidden_role';
  end if;
  if p_phone is null or length(public.normalize_crm_phone(p_phone)) < 7 then
    raise exception 'invalid_phone';
  end if;
  h := encode(digest(public.normalize_crm_phone(p_phone),'sha256'),'hex');
  select exists(select 1 from public.crm_person_private where phone_hash=h) into found_match;
  return jsonb_build_object('exists',found_match);
end $function$;

CREATE OR REPLACE FUNCTION public.crm_record_learning(p_event_type text, p_entity_type text, p_entity_id bigint, p_input jsonb, p_outcome jsonb, p_reward numeric DEFAULT NULL::numeric)
 RETURNS bigint
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare n bigint;
begin
 if auth.uid() is null or not public.can_write() then raise exception 'unauthorized'; end if;
 if p_event_type is null or length(btrim(p_event_type))=0 or length(p_event_type)>80 then raise exception 'invalid_event_type'; end if;
 if p_entity_type is null or p_entity_type not in ('property','lead','request','project','task','deal','match','valuation') then raise exception 'invalid_entity_type'; end if;
 if p_entity_id is null or p_entity_id<=0 then raise exception 'invalid_entity_id'; end if;
 if p_reward is not null and (p_reward < -1 or p_reward > 1) then raise exception 'invalid_reward'; end if;
 if pg_column_size(coalesce(p_input,'{}'::jsonb))+pg_column_size(coalesce(p_outcome,'{}'::jsonb))>32768 then raise exception 'learning_payload_too_large'; end if;
 insert into public.learning_events(user_id,event_type,entity_type,entity_id,input,outcome,reward)
 values(auth.uid(),btrim(p_event_type),p_entity_type,p_entity_id,coalesce(p_input,'{}'::jsonb),coalesce(p_outcome,'{}'::jsonb),p_reward)
 returning id into n;
 return n;
end $function$;

CREATE OR REPLACE FUNCTION public.crm_register_phone(p_person_id bigint, p_phone text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare v_uid uuid:=auth.uid(); v_role text; v_phone text; v_hash text; v_person_owner uuid;
begin
  if v_uid is null then raise exception 'unauthorized'; end if;
  select role into v_role from public.app_roles where user_id=v_uid and active=true limit 1;
  if v_role is null then raise exception 'inactive_user'; end if;
  if p_person_id is null then raise exception 'person_not_found'; end if;
  select created_by into v_person_owner from public.crm_people where id=p_person_id;
  if not found then raise exception 'person_not_found'; end if;
  if v_role not in ('owner','admin','manager','staff') and v_person_owner is distinct from v_uid then
    raise exception 'forbidden_person';
  end if;
  v_phone:=public.normalize_crm_phone(p_phone);
  if v_phone is null or length(v_phone)<7 then raise exception 'invalid_phone'; end if;
  v_hash:=encode(digest(v_phone,'sha256'),'hex');
  if exists(select 1 from public.crm_person_private where phone_hash=v_hash and person_id<>p_person_id) then
    insert into public.crm_identity_events(phone_hash,person_id,entity_type,entity_id,action,actor_id,metadata)
    values(v_hash,p_person_id,'person',p_person_id,'duplicate_register_attempt',v_uid,jsonb_build_object('source','crm_register_phone'));
    insert into public.crm_alerts(alert_type,severity,person_id,assigned_to,created_by,title,detail)
    values('duplicate_identity','high',p_person_id,v_uid,v_uid,'تلاش برای ثبت شماره تکراری',jsonb_build_object('source','crm_register_phone'));
    return jsonb_build_object('ok',false,'duplicate',true);
  end if;
  insert into public.crm_person_private(person_id,phone,phone_hash,updated_at)
    values(p_person_id,v_phone,v_hash,now())
    on conflict(person_id) do update set phone=excluded.phone,phone_hash=excluded.phone_hash,updated_at=now();
  insert into public.crm_identity_events(phone_hash,person_id,entity_type,entity_id,action,actor_id,metadata)
    values(v_hash,p_person_id,'person',p_person_id,'registered',v_uid,jsonb_build_object('source','crm_register_phone'));
  return jsonb_build_object('ok',true,'duplicate',false);
end $function$;

CREATE OR REPLACE FUNCTION public.crm_run_matching(p_request_id bigint, p_limit integer DEFAULT 20)
 RETURNS SETOF property_matches
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare x record; v jsonb; r public.crm_requests%rowtype;
begin
  if not public.is_active_user() then raise exception 'unauthorized'; end if;
  select * into r from public.crm_requests where id=p_request_id;
  if r.id is null then raise exception 'request_not_found'; end if;
  if r.created_by is distinct from auth.uid() and coalesce(r.assigned_to::text,'') <> auth.uid()::text and not public.is_manager_user() then
    raise exception 'forbidden_request';
  end if;
  for x in select id from public.properties where lower(coalesce(status,'')) not in ('sold','closed','done') limit 500 loop
    v:=public.crm_match_score(p_request_id,x.id);
    if (v->>'score')::numeric>0 then
      insert into public.property_matches(request_id,property_id,score,score_breakdown)
      values(p_request_id,x.id,(v->>'score')::numeric,v->'breakdown')
      on conflict(request_id,property_id) do update set score=excluded.score,score_breakdown=excluded.score_breakdown;
    end if;
  end loop;
  return query select * from public.property_matches where request_id=p_request_id order by score desc limit greatest(1,p_limit);
end;
$function$;

CREATE OR REPLACE FUNCTION public.crm_schedule_conflict(p_start timestamp with time zone, p_end timestamp with time zone, p_assigned_to uuid DEFAULT NULL::uuid, p_lead_id bigint DEFAULT NULL::bigint)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare v_uid uuid := auth.uid(); v_role text; v_assignee uuid;
begin
  if v_uid is null or not public.is_active_user() then raise exception 'unauthorized'; end if;
  if p_start is null or p_end is null or p_end <= p_start then raise exception 'invalid_time_range'; end if;
  v_role := public.my_role();
  v_assignee := coalesce(p_assigned_to, v_uid);
  if v_assignee <> v_uid and not public.is_manager_user() then raise exception 'forbidden_assignee'; end if;
  if p_lead_id is not null and not public.is_manager_user()
     and not exists(select 1 from public.leads l where l.id=p_lead_id and (l.created_by=v_uid or l.assigned_to=v_uid)) then
    raise exception 'forbidden_lead';
  end if;
  return jsonb_build_object(
    'conflict', exists(
      select 1 from public.appointments a
      where a.status is distinct from 'cancelled'
        and a.created_by=v_assignee
        and a.scheduled_at >= p_start - interval '90 minutes'
        and a.scheduled_at <= p_end
    ),
    'lead_conflict', case when p_lead_id is null then false else exists(
      select 1 from public.appointments a
      where a.status is distinct from 'cancelled'
        and a.lead_id=p_lead_id
        and a.created_by=v_assignee
        and a.scheduled_at >= p_start - interval '90 minutes'
        and a.scheduled_at <= p_end
    ) end
  );
end $function$;

CREATE OR REPLACE FUNCTION public.manager_bulk_delete_properties(p_ids bigint[])
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare deleted_count integer:=0; requested_count integer;
begin
  if auth.uid() is null or not public.is_manager_user() then raise exception 'manager_only'; end if;
  if p_ids is null or cardinality(p_ids)=0 then raise exception 'property_ids_required'; end if;
  if cardinality(p_ids)>500 then raise exception 'batch_too_large'; end if;
  if exists(select 1 from unnest(p_ids) x where x is null) then raise exception 'invalid_property_ids'; end if;
  select count(distinct x) into requested_count from unnest(p_ids) x;
  delete from public.properties where id=any(p_ids);
  get diagnostics deleted_count=row_count;
  return jsonb_build_object('ok',true,'requested',requested_count,'deleted',deleted_count);
end $function$;

CREATE OR REPLACE FUNCTION public.manager_edit_record(p_table text, p_id text, p_patch jsonb, p_reason text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare before_row jsonb; after_row jsonb; k text; v jsonb; typ text; has_updated_at boolean;
  allowed_tables text[] := array[
    'properties','leads','crm_people','crm_requests','appointments','construction_projects',
    'project_schedule_tasks','project_procurement','project_quality_checks','project_risks',
    'project_rfis','project_submittals','project_daily_logs','project_site_observations',
    'project_commitments','project_change_orders','project_progress_snapshots'
  ];
begin
  if auth.uid() is null or not public.is_manager_user() then raise exception 'manager_only'; end if;
  if p_table is null or not (p_table = any(allowed_tables)) then raise exception 'table_not_allowlisted'; end if;
  if p_id is null or btrim(p_id)='' then raise exception 'record_id_required'; end if;
  if p_patch is null or jsonb_typeof(p_patch) <> 'object' or p_patch='{}'::jsonb then raise exception 'invalid_patch'; end if;
  if (select count(*) from jsonb_object_keys(p_patch)) > 30 then raise exception 'patch_too_large'; end if;
  select exists(select 1 from information_schema.columns where table_schema='public' and table_name=p_table and column_name='updated_at') into has_updated_at;
  execute format('select to_jsonb(t) from public.%I t where t.id::text=$1 for update',p_table) into before_row using p_id;
  if before_row is null then raise exception 'record_not_found'; end if;
  for k,v in select key,value from jsonb_each(p_patch) loop
    if k in ('id','created_at','created_by','updated_at','updated_by','manager_id','user_id','role','active','owner_id','import_batch_id') then
      raise exception 'protected_column:%',k;
    end if;
    select format_type(a.atttypid,a.atttypmod) into typ
      from pg_attribute a join pg_class c on c.oid=a.attrelid join pg_namespace n on n.oid=c.relnamespace
      where n.nspname='public' and c.relname=p_table and a.attname=k and a.attnum>0 and not a.attisdropped;
    if typ is null then raise exception 'column_not_found:%',k; end if;
    if has_updated_at then
      if v='null'::jsonb then
        execute format('update public.%I set %I=null, updated_at=now() where id::text=$1',p_table,k) using p_id;
      else
        execute format('update public.%I set %I=$1::%s, updated_at=now() where id::text=$2',p_table,k,typ) using v #>> '{}',p_id;
      end if;
    else
      if v='null'::jsonb then execute format('update public.%I set %I=null where id::text=$1',p_table,k) using p_id;
      else execute format('update public.%I set %I=$1::%s where id::text=$2',p_table,k,typ) using v #>> '{}',p_id; end if;
    end if;
  end loop;
  execute format('select to_jsonb(t) from public.%I t where t.id::text=$1',p_table) into after_row using p_id;
  insert into public.manager_edit_events(manager_id,entity_table,entity_id,before_data,patch,after_data,reason)
  values(auth.uid(),p_table,p_id,before_row,p_patch,after_row,p_reason);
  return after_row;
end $function$;

CREATE OR REPLACE FUNCTION public.rollback_import_batch(p_batch_id text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare deleted_properties integer:=0; deleted_leads integer:=0; deleted_market integer:=0; batch_key bigint;
begin
  if auth.uid() is null or not public.is_manager_user() then raise exception 'manager_only'; end if;
  if p_batch_id is null or btrim(p_batch_id)='' then raise exception 'batch_id_required'; end if;
  begin batch_key := p_batch_id::bigint; exception when others then raise exception 'invalid_batch_id'; end;
  perform 1 from public.import_batches where id=batch_key for update;
  if not found then raise exception 'import_batch_not_found'; end if;
  if exists(select 1 from public.import_batches where id=batch_key and status='rolled_back') then
    return jsonb_build_object('ok',true,'batch_id',p_batch_id,'already_rolled_back',true);
  end if;
  delete from public.properties where import_batch_id=p_batch_id; get diagnostics deleted_properties=row_count;
  delete from public.leads where import_batch_id=p_batch_id; get diagnostics deleted_leads=row_count;
  delete from public.market_data_imports where import_batch_id=p_batch_id; get diagnostics deleted_market=row_count;
  update public.import_batches set status='rolled_back',
    error_log=left(coalesce(error_log,'') || E'\n' || format('Rolled back by manager %s: properties=%s, leads=%s, market=%s',auth.uid(),deleted_properties,deleted_leads,deleted_market),10000)
    where id=batch_key;
  return jsonb_build_object('ok',true,'batch_id',p_batch_id,'deleted',jsonb_build_object('properties',deleted_properties,'leads',deleted_leads,'market',deleted_market));
end $function$;

-- Explicitly remove default/public and anonymous execution. Authenticated RPCs remain
-- callable only where the function body enforces the caller's role/ownership.
REVOKE ALL ON FUNCTION public.buildwise_ai_control_scan(bigint) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.buildwise_ai_control_scan(bigint) TO authenticated, service_role;
REVOKE ALL ON FUNCTION public.buildwise_check_limit(text,bigint) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.buildwise_check_limit(text,bigint) TO authenticated, service_role;
REVOKE ALL ON FUNCTION public.buildwise_consume(text,bigint) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.buildwise_consume(text,bigint) TO authenticated, service_role;
REVOKE ALL ON FUNCTION public.buildwise_project_dashboard(bigint) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.buildwise_project_dashboard(bigint) TO authenticated, service_role;
REVOKE ALL ON FUNCTION public.crm_match_score(bigint,bigint) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.crm_match_score(bigint,bigint) TO authenticated, service_role;
REVOKE ALL ON FUNCTION public.crm_run_matching(bigint,integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.crm_run_matching(bigint,integer) TO authenticated, service_role;
REVOKE ALL ON FUNCTION public.crm_phone_exists(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.crm_phone_exists(text) TO authenticated, service_role;
REVOKE ALL ON FUNCTION public.crm_schedule_conflict(timestamptz,timestamptz,uuid,bigint) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.crm_schedule_conflict(timestamptz,timestamptz,uuid,bigint) TO authenticated, service_role;
REVOKE ALL ON FUNCTION public.manager_edit_record(text,text,jsonb,text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.manager_edit_record(text,text,jsonb,text) TO authenticated, service_role;
REVOKE ALL ON FUNCTION public.manager_bulk_delete_properties(bigint[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.manager_bulk_delete_properties(bigint[]) TO authenticated, service_role;
REVOKE ALL ON FUNCTION public.rollback_import_batch(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.rollback_import_batch(text) TO authenticated, service_role;
REVOKE ALL ON FUNCTION public.crm_record_learning(text,text,bigint,jsonb,jsonb,numeric) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.crm_record_learning(text,text,bigint,jsonb,jsonb,numeric) TO authenticated, service_role;
REVOKE ALL ON FUNCTION public.crm_register_phone(bigint,text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.crm_register_phone(bigint,text) TO authenticated, service_role;
