-- Unified Task Engine persistence fields.
-- Additive migration: preserves the existing tasks table and legacy columns.
alter table public.tasks
  add column if not exists context_type text,
  add column if not exists subject_type text,
  add column if not exists related_entity_id text,
  add column if not exists scheduled_date date,
  add column if not exists scheduled_time time,
  add column if not exists deadline timestamptz,
  add column if not exists recurrence text,
  add column if not exists priority text not null default 'normal',
  add column if not exists starred boolean not null default false,
  add column if not exists response text,
  add column if not exists completed_at timestamptz,
  add column if not exists moved_to_date date,
  add column if not exists notification_enabled boolean not null default false,
  add column if not exists reminder_at timestamptz,
  add column if not exists notification_status text;

alter table public.tasks
  add constraint tasks_context_type_check check (context_type is null or context_type in ('crm','construction','procurement')),
  add constraint tasks_subject_type_check check (subject_type is null or subject_type in ('deal','construction','purchase')),
  add constraint tasks_priority_check check (priority in ('critical','important','normal','low')),
  add constraint tasks_response_check check (response is null or response in ('yes','no'));

create index if not exists idx_tasks_assigned_scheduled on public.tasks (assigned_to, scheduled_date);
create index if not exists idx_tasks_status_deadline on public.tasks (status, deadline);

alter table public.tasks enable row level security;