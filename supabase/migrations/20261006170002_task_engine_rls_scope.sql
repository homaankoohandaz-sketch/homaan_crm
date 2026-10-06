-- Task Engine row scope.
drop policy if exists tasks_select on public.tasks;
drop policy if exists tasks_insert on public.tasks;
drop policy if exists tasks_update on public.tasks;
drop policy if exists tasks_delete on public.tasks;

create policy tasks_select on public.tasks
for select to authenticated
using (public.can_manage_tasks() or assigned_to = auth.uid());

create policy tasks_insert on public.tasks
for insert to authenticated
with check (public.can_manage_tasks());

create policy tasks_update on public.tasks
for update to authenticated
using (public.can_manage_tasks() or public.can_update_assigned_task(assigned_to))
with check (public.can_manage_tasks() or public.can_update_assigned_task(assigned_to));

create policy tasks_delete on public.tasks
for delete to authenticated
using (public.can_manage_tasks());

drop policy if exists workflow_notifications_recipient on public.workflow_notifications;
create policy workflow_notifications_recipient on public.workflow_notifications
for all to authenticated
using (public.can_manage_tasks() or recipient_id = auth.uid())
with check (public.can_manage_tasks() or recipient_id = auth.uid());
