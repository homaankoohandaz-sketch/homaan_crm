-- Production hardening: generic module controls + manager bulk property delete.
create table if not exists public.app_modules (
  id text primary key,
  title text not null,
  section text not null,
  visible boolean not null default true,
  enabled boolean not null default true,
  hideable boolean not null default true,
  editable boolean not null default true,
  deletable boolean not null default true,
  sort_order integer not null default 100,
  config jsonb not null default '{}'::jsonb,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now(),
  deleted boolean not null default false
);

alter table public.app_modules enable row level security;
drop policy if exists app_modules_select_active on public.app_modules;
create policy app_modules_select_active on public.app_modules
  for select to authenticated
  using (public.is_active_user() and deleted = false);

drop policy if exists app_modules_manager_write on public.app_modules;
create policy app_modules_manager_write on public.app_modules
  for all to authenticated
  using (public.is_manager_user())
  with check (public.is_manager_user());

insert into public.app_modules
  (id,title,section,visible,enabled,hideable,editable,deletable,sort_order)
values
  ('requests','درخواست‌ها','CRM',true,true,true,true,true,10),
  ('tasks','پیگیری‌ها','CRM',true,true,true,true,true,20),
  ('promotions','پروموشن','CRM',true,true,true,true,true,30),
  ('dashboard','داشبورد','CRM',true,true,false,true,false,40),
  ('properties','املاک','CRM',true,true,true,true,true,50),
  ('leads','خواهان‌ها','CRM',true,true,true,true,true,60),
  ('deals','معاملات','Deal',true,true,true,true,true,70),
  ('search','جستجوی هوشمند','Intelligence',true,true,true,true,true,80),
  ('construction','ساخت و پروژه','Construction',true,true,true,true,true,90),
  ('market','بازار و ارزش‌گذاری','Market',true,true,true,true,true,100),
  ('matching','تطبیق','Deal',true,true,true,true,true,110),
  ('room','ROOM','Portal',true,true,true,true,true,120),
  ('automation','اتوماسیون','Workflow',true,true,true,true,true,130),
  ('customerflow','مشتری → مشاور','CRM',true,true,true,true,true,140),
  ('ai','دستیار AI','AI',true,true,true,true,true,150)
on conflict (id) do update set
  title=excluded.title,
  section=excluded.section,
  hideable=excluded.hideable,
  editable=excluded.editable,
  deletable=excluded.deletable;

create or replace function public.manager_delete_properties(p_ids bigint[])
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  deleted_count integer;
begin
  if not public.is_manager_user() then
    raise exception 'manager_required';
  end if;

  delete from public.properties
  where id = any(coalesce(p_ids, '{}'::bigint[]));

  get diagnostics deleted_count = row_count;
  return jsonb_build_object('deleted', deleted_count);
end;
$$;

revoke all on function public.manager_delete_properties(bigint[]) from public, anon;
grant execute on function public.manager_delete_properties(bigint[]) to authenticated;
