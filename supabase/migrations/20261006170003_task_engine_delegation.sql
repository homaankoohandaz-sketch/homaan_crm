-- Task Engine delegation traceability.
alter table public.tasks add column if not exists delegated_by uuid references auth.users(id);
create index if not exists idx_tasks_delegated_by on public.tasks(delegated_by);
