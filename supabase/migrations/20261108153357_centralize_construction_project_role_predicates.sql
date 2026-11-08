-- Route construction-project role checks through the shared authorization predicate.
drop policy if exists construction_projects_select on public.construction_projects;
create policy construction_projects_select on public.construction_projects
for select to authenticated
using (
  public.can_write()
  or public.has_any_active_role(array['owner','admin','manager','staff','builder']::text[])
  or (
    created_by = (select auth.uid())
    and public.has_any_active_role(array['advisor','agent']::text[])
  )
  or exists (
    select 1 from public.construction_project_access a
    where a.project_id = construction_projects.id
      and a.user_id = (select auth.uid())
      and a.revoked_at is null
  )
);
