-- BuildWise AI security hardening 591-608.
-- Idempotent, least-privilege, preserve service-side trigger behavior.

-- 591-594 / 608: close policy gaps on internal control tables.
do $$
declare t text;
begin
  foreach t in array array[
    'deal_timeline_events','deal_actions','deal_followups','deal_risks',
    'deal_participation_calculations','deal_payment_schedules'
  ] loop
    execute format('drop policy if exists %I on public.%I', t||'_select_active', t);
    execute format('create policy %I on public.%I for select to authenticated using (public.is_active_user() or public.is_manager_user())', t||'_select_active', t);
    execute format('drop policy if exists %I on public.%I', t||'_write_active', t);
    execute format('create policy %I on public.%I for all to authenticated using (public.can_write()) with check (public.can_write())', t||'_write_active', t);
  end loop;
end $$;

drop policy if exists project_kpi_definitions_manager on public.project_kpi_definitions;
create policy project_kpi_definitions_manager on public.project_kpi_definitions
for all to authenticated using (public.is_manager_user()) with check (public.is_manager_user());

drop policy if exists project_kpi_thresholds_manager on public.project_kpi_thresholds;
create policy project_kpi_thresholds_manager on public.project_kpi_thresholds
for all to authenticated using (public.is_manager_user()) with check (public.is_manager_user());

do $$
declare t text;
begin
  foreach t in array array['workflow_definitions','workflow_steps','workflow_templates'] loop
    execute format('drop policy if exists %I on public.%I', t||'_manager', t);
    execute format('create policy %I on public.%I for all to authenticated using (public.is_manager_user()) with check (public.is_manager_user())', t||'_manager', t);
  end loop;
end $$;

drop policy if exists workflow_runs_active on public.workflow_runs;
create policy workflow_runs_active on public.workflow_runs
for all to authenticated using (public.is_active_user()) with check (public.can_write());

drop policy if exists workflow_run_events_active on public.workflow_run_events;
create policy workflow_run_events_active on public.workflow_run_events
for all to authenticated using (public.is_active_user()) with check (public.can_write());

drop policy if exists workflow_assignments_participant on public.workflow_assignments;
create policy workflow_assignments_participant on public.workflow_assignments
for all to authenticated using (public.is_manager_user() or assignee_id=auth.uid()) with check (public.is_manager_user() or assignee_id=auth.uid());

drop policy if exists workflow_notifications_recipient on public.workflow_notifications;
create policy workflow_notifications_recipient on public.workflow_notifications
for all to authenticated using (public.is_manager_user() or recipient_id=auth.uid()) with check (public.is_manager_user() or recipient_id=auth.uid());

drop policy if exists workflow_approvals_participant on public.workflow_approvals;
create policy workflow_approvals_participant on public.workflow_approvals
for all to authenticated using (public.is_manager_user() or approver_id=auth.uid()) with check (public.is_manager_user() or approver_id=auth.uid());

revoke all on table public.telegram_sessions from anon, authenticated;

do $$
declare v text;
begin
  foreach v in array array[
    'project_kpi_live','project_kpi_catalog','project_kpi_trends','project_kpi_drilldown','project_kpi_alerts',
    'workflow_history','workflow_audit','deal_workspace_control','project_unit_sales_matrix',
    'project_material_current_value','project_material_daily_prices','project_cost_intelligence',
    'project_land_comparables','project_unit_cost_allocation','project_profitability_sensitivity',
    'project_return_allocation','project_sales_inventory','project_offer_current_versions',
    'project_sales_profitability','project_document_register','project_document_plan_data','project_kpi_dashboard'
  ] loop
    execute format('alter view public.%I set (security_invoker = true)', v);
    execute format('revoke select on public.%I from anon', v);
    execute format('grant select on public.%I to authenticated', v);
  end loop;
end $$;

alter function public.build_project_unit_sale_price(bigint,numeric,numeric,numeric,numeric,numeric,numeric,numeric,numeric,numeric) set search_path = public, pg_temp;
alter function public.refresh_project_kpi_snapshot(bigint) set search_path = public, pg_temp;
alter function public.workflow_start(bigint,bigint,text,bigint,jsonb) set search_path = public, pg_temp;

revoke execute on function public.route_new_public_request() from anon, authenticated;
revoke execute on function public.route_public_request(uuid) from anon, authenticated;
revoke execute on function public.manager_edit_record(text,text,jsonb,text) from anon;
revoke execute on function public.reos_sync_property_graph(integer) from anon;
