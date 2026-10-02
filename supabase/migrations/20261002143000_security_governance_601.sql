-- BuildWise AI security hardening 601: AI data and approval boundaries.
drop policy if exists ai_audit_events_auth on public.ai_audit_events;
create policy ai_audit_events_select on public.ai_audit_events
for select to authenticated using (public.is_manager_user() or actor_user_id=auth.uid());
create policy ai_audit_events_insert on public.ai_audit_events
for insert to authenticated with check (public.is_active_user() and actor_user_id=auth.uid());
create policy ai_audit_events_update_manager on public.ai_audit_events
for update to authenticated using (public.is_manager_user()) with check (public.is_manager_user());
create policy ai_audit_events_delete_manager on public.ai_audit_events
for delete to authenticated using (public.is_manager_user());

drop policy if exists buildwise_auth_all on public.project_ai_alerts;
drop policy if exists project_ai_alerts_auth on public.project_ai_alerts;
create policy project_ai_alerts_select on public.project_ai_alerts
for select to authenticated using (public.is_active_user());
create policy project_ai_alerts_update on public.project_ai_alerts
for update to authenticated using (public.is_manager_user() or assigned_to=auth.uid())
with check (public.is_manager_user() or assigned_to=auth.uid());
create policy project_ai_alerts_delete_manager on public.project_ai_alerts
for delete to authenticated using (public.is_manager_user());

drop policy if exists buildwise_auth_all on public.project_ai_change_approvals;
create policy project_ai_change_approvals_insert on public.project_ai_change_approvals
for insert to authenticated
with check (public.is_active_user() and requested_by=auth.uid() and status='pending');
create policy project_ai_change_approvals_select on public.project_ai_change_approvals
for select to authenticated using (public.is_manager_user() or requested_by=auth.uid());
create policy project_ai_change_approvals_update_manager on public.project_ai_change_approvals
for update to authenticated using (public.is_manager_user()) with check (public.is_manager_user());