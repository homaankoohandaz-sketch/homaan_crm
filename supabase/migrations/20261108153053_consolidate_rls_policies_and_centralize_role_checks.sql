-- BuildWise canonical RLS policy consolidation.
-- Preserves the effective access rules while replacing overlapping permissive policies.
create or replace function public.has_any_active_role(p_roles text[])
returns boolean language sql stable security definer
set search_path = public, pg_temp
as $$
 select exists(select 1 from public.app_roles r
   where r.user_id=auth.uid() and r.active=true
   and r.role=any(coalesce(p_roles,array[]::text[])));
$$;
revoke all on function public.has_any_active_role(text[]) from public, anon;
grant execute on function public.has_any_active_role(text[]) to authenticated;

-- Activity log read access: owner OR own record.
drop policy if exists activity_logs_owner_select on public.activity_logs;
drop policy if exists activity_logs_self_select on public.activity_logs;
create policy activity_logs_select on public.activity_logs for select to public
using (public.is_owner() or actor_id=(select auth.uid()));

-- AI conversations: separate CRUD rules, one rule per command.
drop policy if exists phase_write_ai_conversations on public.ai_conversations;
drop policy if exists phase_read_ai_conversations on public.ai_conversations;
create policy ai_conversations_select on public.ai_conversations for select to authenticated
using ((user_id=(select auth.uid())) or public.is_owner());
create policy ai_conversations_insert on public.ai_conversations for insert to authenticated
with check ((user_id=(select auth.uid())) or public.is_owner());
create policy ai_conversations_update on public.ai_conversations for update to authenticated
using ((user_id=(select auth.uid())) or public.is_owner())
with check ((user_id=(select auth.uid())) or public.is_owner());
create policy ai_conversations_delete on public.ai_conversations for delete to authenticated
using ((user_id=(select auth.uid())) or public.is_owner());

-- App roles: one merged SELECT policy; owner-only mutations.
drop policy if exists app_roles_owner_manage on public.app_roles;
drop policy if exists app_roles_select_colleagues on public.app_roles;
drop policy if exists app_roles_select_owner on public.app_roles;
drop policy if exists app_roles_select_self on public.app_roles;
create policy app_roles_select on public.app_roles for select to public
using (public.is_owner() or public.is_active_user() or user_id=(select auth.uid()));
create policy app_roles_insert on public.app_roles for insert to public with check (public.is_owner());
create policy app_roles_update on public.app_roles for update to public
using (public.is_owner()) with check (public.is_owner());
create policy app_roles_delete on public.app_roles for delete to public using (public.is_owner());

-- Construction projects: merge read rule with existing writer visibility; keep write gate.
drop policy if exists phase_write_projects on public.construction_projects;
drop policy if exists phase_read_projects on public.construction_projects;
create policy construction_projects_select on public.construction_projects for select to authenticated
using (
 public.can_write()
 or exists(select 1 from public.app_roles r where r.user_id=(select auth.uid())
   and r.active=true and r.role=any(array['owner','admin','manager','staff','builder']::text[]))
 or (created_by=(select auth.uid()) and public.has_any_active_role(array['advisor','agent']::text[]))
 or exists(select 1 from public.construction_project_access a
   where a.project_id=construction_projects.id and a.user_id=(select auth.uid()) and a.revoked_at is null)
);
create policy construction_projects_insert on public.construction_projects for insert to authenticated with check (public.can_write());
create policy construction_projects_update on public.construction_projects for update to authenticated using (public.can_write()) with check (public.can_write());
create policy construction_projects_delete on public.construction_projects for delete to authenticated using (public.can_write());

-- Deal resources: SELECT active users; mutations authorized writers.
drop policy if exists deal_actions_write_active on public.deal_actions;
drop policy if exists deal_actions_select_active on public.deal_actions;
create policy deal_actions_select on public.deal_actions for select to authenticated using (public.is_active_user() or public.is_manager_user());
create policy deal_actions_insert on public.deal_actions for insert to authenticated with check (public.can_write());
create policy deal_actions_update on public.deal_actions for update to authenticated using (public.can_write()) with check (public.can_write());
create policy deal_actions_delete on public.deal_actions for delete to authenticated using (public.can_write());

drop policy if exists deal_followups_write_active on public.deal_followups;
drop policy if exists deal_followups_select_active on public.deal_followups;
create policy deal_followups_select on public.deal_followups for select to authenticated using (public.is_active_user() or public.is_manager_user());
create policy deal_followups_insert on public.deal_followups for insert to authenticated with check (public.can_write());
create policy deal_followups_update on public.deal_followups for update to authenticated using (public.can_write()) with check (public.can_write());
create policy deal_followups_delete on public.deal_followups for delete to authenticated using (public.can_write());

drop policy if exists deal_participation_calculations_write_active on public.deal_participation_calculations;
drop policy if exists deal_participation_calculations_select_active on public.deal_participation_calculations;
create policy deal_participation_calculations_select on public.deal_participation_calculations for select to authenticated using (public.is_active_user() or public.is_manager_user());
create policy deal_participation_calculations_insert on public.deal_participation_calculations for insert to authenticated with check (public.can_write());
create policy deal_participation_calculations_update on public.deal_participation_calculations for update to authenticated using (public.can_write()) with check (public.can_write());
create policy deal_participation_calculations_delete on public.deal_participation_calculations for delete to authenticated using (public.can_write());

drop policy if exists deal_payment_schedules_write_active on public.deal_payment_schedules;
drop policy if exists deal_payment_schedules_select_active on public.deal_payment_schedules;
create policy deal_payment_schedules_select on public.deal_payment_schedules for select to authenticated using (public.is_active_user() or public.is_manager_user());
create policy deal_payment_schedules_insert on public.deal_payment_schedules for insert to authenticated with check (public.can_write());
create policy deal_payment_schedules_update on public.deal_payment_schedules for update to authenticated using (public.can_write()) with check (public.can_write());
create policy deal_payment_schedules_delete on public.deal_payment_schedules for delete to authenticated using (public.can_write());

drop policy if exists phase_write_radar on public.deal_radar;
drop policy if exists phase_read_radar on public.deal_radar;
create policy deal_radar_select on public.deal_radar for select to authenticated using (public.is_active_user());
create policy deal_radar_insert on public.deal_radar for insert to authenticated with check (public.can_write());
create policy deal_radar_update on public.deal_radar for update to authenticated using (public.can_write()) with check (public.can_write());
create policy deal_radar_delete on public.deal_radar for delete to authenticated using (public.can_write());

drop policy if exists deal_risks_write_active on public.deal_risks;
drop policy if exists deal_risks_select_active on public.deal_risks;
create policy deal_risks_select on public.deal_risks for select to authenticated using (public.is_active_user() or public.is_manager_user());
create policy deal_risks_insert on public.deal_risks for insert to authenticated with check (public.can_write());
create policy deal_risks_update on public.deal_risks for update to authenticated using (public.can_write()) with check (public.can_write());
create policy deal_risks_delete on public.deal_risks for delete to authenticated using (public.can_write());

drop policy if exists deal_timeline_events_write_active on public.deal_timeline_events;
drop policy if exists deal_timeline_events_select_active on public.deal_timeline_events;
create policy deal_timeline_events_select on public.deal_timeline_events for select to authenticated using (public.is_active_user() or public.is_manager_user());
create policy deal_timeline_events_insert on public.deal_timeline_events for insert to authenticated with check (public.can_write());
create policy deal_timeline_events_update on public.deal_timeline_events for update to authenticated using (public.can_write()) with check (public.can_write());
create policy deal_timeline_events_delete on public.deal_timeline_events for delete to authenticated using (public.can_write());

-- Market/media/scenario/matching/valuation modules: canonical read + write gates.
drop policy if exists phase_write_market on public.market_observations;
drop policy if exists phase_read_market on public.market_observations;
create policy market_observations_select on public.market_observations for select to authenticated using (public.is_active_user());
create policy market_observations_insert on public.market_observations for insert to authenticated with check (public.can_write());
create policy market_observations_update on public.market_observations for update to authenticated using (public.can_write()) with check (public.can_write());
create policy market_observations_delete on public.market_observations for delete to authenticated using (public.can_write());

drop policy if exists phase_write_media on public.media_assets;
drop policy if exists phase_read_media on public.media_assets;
create policy media_assets_select on public.media_assets for select to authenticated using (public.is_active_user());
create policy media_assets_insert on public.media_assets for insert to authenticated with check (public.can_write());
create policy media_assets_update on public.media_assets for update to authenticated using (public.can_write()) with check (public.can_write());
create policy media_assets_delete on public.media_assets for delete to authenticated using (public.can_write());

drop policy if exists phase_write_scenarios on public.project_scenarios;
drop policy if exists phase_read_scenarios on public.project_scenarios;
create policy project_scenarios_select on public.project_scenarios for select to authenticated using (public.is_active_user());
create policy project_scenarios_insert on public.project_scenarios for insert to authenticated with check (public.can_write());
create policy project_scenarios_update on public.project_scenarios for update to authenticated using (public.can_write()) with check (public.can_write());
create policy project_scenarios_delete on public.project_scenarios for delete to authenticated using (public.can_write());

drop policy if exists phase_write_matches on public.property_matches;
drop policy if exists phase_read_matches on public.property_matches;
create policy property_matches_select on public.property_matches for select to authenticated using (public.is_active_user());
create policy property_matches_insert on public.property_matches for insert to authenticated with check (public.can_write());
create policy property_matches_update on public.property_matches for update to authenticated using (public.can_write()) with check (public.can_write());
create policy property_matches_delete on public.property_matches for delete to authenticated using (public.can_write());

drop policy if exists phase_write_valuations on public.valuations;
drop policy if exists phase_read_valuations on public.valuations;
create policy valuations_select on public.valuations for select to authenticated using (public.is_active_user());
create policy valuations_insert on public.valuations for insert to authenticated with check (public.can_write());
create policy valuations_update on public.valuations for update to authenticated using (public.can_write()) with check (public.can_write());
create policy valuations_delete on public.valuations for delete to authenticated using (public.can_write());

-- Existing ALL=true rules already cover SELECT; remove only the redundant SELECT policies.
drop policy if exists project_corrective_authenticated_select on public.project_corrective_actions;
drop policy if exists project_hse_authenticated_select on public.project_hse;

-- Remove one of the two byte-for-byte equivalent authenticated ALL policies.
drop policy if exists buildwise_auth_all on public.project_documents;

-- Public request read access: combine manager + staff predicates.
drop policy if exists public_requests_manager_select on public.public_requests;
drop policy if exists public_requests_staff_select on public.public_requests;
create policy public_requests_select on public.public_requests for select to authenticated
using (public.is_manager_user() or public.has_any_active_role(array['staff']::text[]));

-- Graph: retain authenticated SELECT semantics and split manager mutations.
drop policy if exists reos_graph_edges_manager_write on public.reos_graph_edges;
drop policy if exists reos_graph_edges_select on public.reos_graph_edges;
create policy reos_graph_edges_select on public.reos_graph_edges for select to authenticated using (true);
create policy reos_graph_edges_insert on public.reos_graph_edges for insert to authenticated with check (public.is_manager_user());
create policy reos_graph_edges_update on public.reos_graph_edges for update to authenticated using (public.is_manager_user()) with check (public.is_manager_user());
create policy reos_graph_edges_delete on public.reos_graph_edges for delete to authenticated using (public.is_manager_user());

drop policy if exists reos_graph_nodes_manager_write on public.reos_graph_nodes;
drop policy if exists reos_graph_nodes_select on public.reos_graph_nodes;
create policy reos_graph_nodes_select on public.reos_graph_nodes for select to authenticated using (true);
create policy reos_graph_nodes_insert on public.reos_graph_nodes for insert to authenticated with check (public.is_manager_user());
create policy reos_graph_nodes_update on public.reos_graph_nodes for update to authenticated using (public.is_manager_user()) with check (public.is_manager_user());
create policy reos_graph_nodes_delete on public.reos_graph_nodes for delete to authenticated using (public.is_manager_user());

-- UI module read: non-deleted for users; managers may inspect deleted rows.
drop policy if exists ui_modules_manager_write on public.ui_modules;
drop policy if exists ui_modules_read_authenticated on public.ui_modules;
create policy ui_modules_select on public.ui_modules for select to authenticated
using (public.is_manager_user() or not deleted);
create policy ui_modules_insert on public.ui_modules for insert to authenticated with check (public.is_manager_user());
create policy ui_modules_update on public.ui_modules for update to authenticated using (public.is_manager_user()) with check (public.is_manager_user());
create policy ui_modules_delete on public.ui_modules for delete to authenticated using (public.is_manager_user());
