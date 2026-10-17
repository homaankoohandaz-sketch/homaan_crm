-- Proposed only: review before applying to Supabase.
-- Restrict public-role policies that call is_active_user() to authenticated clients.
-- Public customer flows should use their Edge Functions, which use the service-role
-- client and therefore do not depend on these anon RLS policies.
begin;

drop policy if exists app_roles_select_colleagues on public.app_roles;
create policy app_roles_select_colleagues on public.app_roles
  for select to authenticated using (public.is_active_user());

drop policy if exists appointments_select on public.appointments;
create policy appointments_select on public.appointments
  for select to authenticated using (public.is_active_user());

drop policy if exists deals_select on public.deals;
create policy deals_select on public.deals
  for select to authenticated using (public.is_active_user());

drop policy if exists followups_select on public.followups;
create policy followups_select on public.followups
  for select to authenticated using (public.is_active_user());

drop policy if exists import_batches_select on public.import_batches;
create policy import_batches_select on public.import_batches
  for select to authenticated using (public.is_active_user());

drop policy if exists leads_select on public.leads;
create policy leads_select on public.leads
  for select to authenticated using (public.is_active_user());

drop policy if exists owners_select on public.owners;
create policy owners_select on public.owners
  for select to authenticated using (public.is_active_user());

drop policy if exists properties_select on public.properties;
create policy properties_select on public.properties
  for select to authenticated using (public.is_active_user());

drop policy if exists property_documents_select on public.property_documents;
create policy property_documents_select on public.property_documents
  for select to authenticated using (public.is_active_user());

drop policy if exists property_images_select on public.property_images;
create policy property_images_select on public.property_images
  for select to authenticated using (public.is_active_user());

drop policy if exists property_photos_select on public.property_photos;
create policy property_photos_select on public.property_photos
  for select to authenticated using (public.is_active_user());

drop policy if exists user_reports_insert on public.user_reports;
create policy user_reports_insert on public.user_reports
  for insert to authenticated
  with check (
    (select auth.uid()) = reporter_id
    and reporter_id <> reported_user_id
    and public.is_active_user()
  );

-- PUBLIC includes anon; revoke both explicitly to make the intended ACL clear.
revoke execute on function public.is_active_user() from PUBLIC, anon;
grant execute on function public.is_active_user() to authenticated;

commit;
