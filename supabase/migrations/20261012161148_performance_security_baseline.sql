-- BuildWise: close the unrestricted KPI snapshot policy and improve hot-path FK lookups.
-- The previous policy allowed every authenticated account to read/write/delete every KPI snapshot.
DROP POLICY IF EXISTS project_kpi_snapshots_auth ON public.project_kpi_snapshots;

DROP POLICY IF EXISTS project_kpi_snapshots_active_select ON public.project_kpi_snapshots;
CREATE POLICY project_kpi_snapshots_active_select
  ON public.project_kpi_snapshots
  FOR SELECT TO authenticated
  USING (public.is_active_user());

DROP POLICY IF EXISTS project_kpi_snapshots_write_insert ON public.project_kpi_snapshots;
CREATE POLICY project_kpi_snapshots_write_insert
  ON public.project_kpi_snapshots
  FOR INSERT TO authenticated
  WITH CHECK (public.can_write());

DROP POLICY IF EXISTS project_kpi_snapshots_write_update ON public.project_kpi_snapshots;
CREATE POLICY project_kpi_snapshots_write_update
  ON public.project_kpi_snapshots
  FOR UPDATE TO authenticated
  USING (public.can_write())
  WITH CHECK (public.can_write());

DROP POLICY IF EXISTS project_kpi_snapshots_write_delete ON public.project_kpi_snapshots;
CREATE POLICY project_kpi_snapshots_write_delete
  ON public.project_kpi_snapshots
  FOR DELETE TO authenticated
  USING (public.can_write());

-- This standalone index duplicates the UNIQUE constraint index on (project_id, snapshot_date).
DROP INDEX IF EXISTS public.project_kpi_snapshots_project_date_uq;

-- Index foreign-key columns used by the CRM, project, and audit hot paths.
CREATE INDEX IF NOT EXISTS idx_activity_logs_actor_id ON public.activity_logs (actor_id);
CREATE INDEX IF NOT EXISTS idx_ai_actions_actor_user_id ON public.ai_actions (actor_user_id);
CREATE INDEX IF NOT EXISTS idx_app_roles_owner_id ON public.app_roles (owner_id);
CREATE INDEX IF NOT EXISTS idx_appointments_created_by ON public.appointments (created_by);
CREATE INDEX IF NOT EXISTS idx_appointments_lead_id ON public.appointments (lead_id);
CREATE INDEX IF NOT EXISTS idx_appointments_property_id ON public.appointments (property_id);
CREATE INDEX IF NOT EXISTS idx_construction_projects_property_id ON public.construction_projects (property_id);
CREATE INDEX IF NOT EXISTS idx_crm_alerts_assigned_to ON public.crm_alerts (assigned_to);
CREATE INDEX IF NOT EXISTS idx_crm_alerts_created_by ON public.crm_alerts (created_by);
CREATE INDEX IF NOT EXISTS idx_crm_alerts_person_id ON public.crm_alerts (person_id);
CREATE INDEX IF NOT EXISTS idx_crm_alerts_property_id ON public.crm_alerts (property_id);
CREATE INDEX IF NOT EXISTS idx_crm_alerts_request_id ON public.crm_alerts (request_id);
CREATE INDEX IF NOT EXISTS idx_crm_identity_events_actor_id ON public.crm_identity_events (actor_id);
CREATE INDEX IF NOT EXISTS idx_crm_identity_events_person_id ON public.crm_identity_events (person_id);
CREATE INDEX IF NOT EXISTS idx_crm_people_created_by ON public.crm_people (created_by);
CREATE INDEX IF NOT EXISTS idx_crm_requests_assigned_to ON public.crm_requests (assigned_to);
CREATE INDEX IF NOT EXISTS idx_crm_requests_created_by ON public.crm_requests (created_by);
CREATE INDEX IF NOT EXISTS idx_crm_requests_person_id ON public.crm_requests (person_id);
