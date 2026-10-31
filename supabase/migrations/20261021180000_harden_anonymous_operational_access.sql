-- Security hardening based on the live Supabase audit (2026-10-21).
-- Operational CRM policies listed below should apply only to signed-in users.
-- Keep each existing USING / WITH CHECK expression unchanged.
-- This migration intentionally does not revoke authenticated EXECUTE from
-- SECURITY DEFINER helpers: several are used by RLS policies or app RPC flows;
-- those require per-function call-site and authorization tests before restriction.

begin;

alter policy activity_logs_owner_select on public.activity_logs to authenticated;
alter policy activity_logs_self_select on public.activity_logs to authenticated;
alter policy app_roles_owner_manage on public.app_roles to authenticated;
alter policy app_roles_select_owner on public.app_roles to authenticated;
alter policy app_roles_select_self on public.app_roles to authenticated;
alter policy appointments_delete on public.appointments to authenticated;
alter policy appointments_insert on public.appointments to authenticated;
alter policy appointments_update on public.appointments to authenticated;
alter policy deals_delete on public.deals to authenticated;
alter policy deals_insert on public.deals to authenticated;
alter policy deals_update on public.deals to authenticated;
alter policy followups_delete on public.followups to authenticated;
alter policy followups_insert on public.followups to authenticated;
alter policy followups_update on public.followups to authenticated;
alter policy import_batches_delete on public.import_batches to authenticated;
alter policy import_batches_insert on public.import_batches to authenticated;
alter policy import_batches_update on public.import_batches to authenticated;
alter policy invited_emails_owner_all on public.invited_emails to authenticated;
alter policy leads_delete on public.leads to authenticated;
alter policy leads_insert on public.leads to authenticated;
alter policy leads_update on public.leads to authenticated;
alter policy owners_delete on public.owners to authenticated;
alter policy owners_insert on public.owners to authenticated;
alter policy owners_update on public.owners to authenticated;
alter policy properties_delete on public.properties to authenticated;
alter policy properties_insert on public.properties to authenticated;
alter policy properties_update on public.properties to authenticated;
alter policy property_documents_delete on public.property_documents to authenticated;
alter policy property_documents_insert on public.property_documents to authenticated;
alter policy property_documents_update on public.property_documents to authenticated;
alter policy property_images_delete on public.property_images to authenticated;
alter policy property_images_insert on public.property_images to authenticated;
alter policy property_images_update on public.property_images to authenticated;
alter policy property_photos_delete on public.property_photos to authenticated;
alter policy property_photos_insert on public.property_photos to authenticated;
alter policy property_photos_update on public.property_photos to authenticated;
alter policy user_reports_owner_select on public.user_reports to authenticated;

-- Remove implicit/anonymous RPC entry points for all 14 flagged SECURITY DEFINER
-- functions while preserving authenticated calls pending individual review.
revoke execute on function public.buildwise_consume(text, bigint) from public, anon;
revoke execute on function public.can_write() from public, anon;
revoke execute on function public.crm_manager_phone(bigint) from public, anon;
revoke execute on function public.crm_phone_exists(text) from public, anon;
revoke execute on function public.crm_register_phone(bigint, text) from public, anon;
revoke execute on function public.is_active_user() from public, anon;
revoke execute on function public.is_manager_user() from public, anon;
revoke execute on function public.is_owner() from public, anon;
revoke execute on function public.manager_bulk_delete_properties(bigint[]) from public, anon;
revoke execute on function public.manager_delete_ui_module(text) from public, anon;
revoke execute on function public.manager_edit_record(text, text, jsonb, text) from public, anon;
revoke execute on function public.manager_edit_ui_module(text, text, text, boolean, integer) from public, anon;
revoke execute on function public.reos_sync_property_graph(integer) from public, anon;
revoke execute on function public.rollback_import_batch(text) from public, anon;

commit;

-- Post-deploy verification:
-- 1) Re-run Supabase Security Advisor; anon SECURITY DEFINER finding should clear.
-- 2) Verify pg_policies shows only {authenticated} for the policies above.
-- 3) Run anon-deny and authenticated allow/deny tests for each affected table.
-- 4) Review authenticated SECURITY DEFINER warnings individually; do not blanket
--    revoke authenticated EXECUTE because policy helpers may stop working.
