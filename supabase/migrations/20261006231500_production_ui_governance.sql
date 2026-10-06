-- BuildWise AI — production UI governance
create table if not exists public.ui_modules (
  id text primary key,
  label text not null,
  icon text not null default '•',
  visible boolean not null default true,
  deleted boolean not null default false,
  sort_order integer not null default 100,
  config jsonb not null default '{}'::jsonb,
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now()
);

alter table public.ui_modules enable row level security;
drop policy if exists "ui_modules_read_authenticated" on public.ui_modules;
create policy "ui_modules_read_authenticated" on public.ui_modules for select to authenticated using (not deleted);
drop policy if exists "ui_modules_manager_write" on public.ui_modules;
create policy "ui_modules_manager_write" on public.ui_modules for all to authenticated using (public.is_manager_user()) with check (public.is_manager_user());

insert into public.ui_modules (id,label,icon,sort_order) values
('requests','درخواست‌ها','◉',10),('tasks','پیگیری‌ها','✓',20),('promotions','پروموشن','✦',30),
('dashboard','داشبورد','⌂',40),('properties','املاک','⌂',50),('leads','خواهان‌ها','◉',60),
('deals','معاملات','◆',70),('search','جستجوی هوشمند','⌕',80),('construction','ساخت و پروژه','▦',90),
('market','بازار و ارزش‌گذاری','◌',100),('matching','تطبیق','⇄',110),('room','ROOM','◇',120),
('automation','اتوماسیون','⚙',130),('customerflow','مشتری → مشاور','↗',140),('ai','دستیار AI','✦',150),
('app-settings','مدیریت اپ','⚙',900)
on conflict (id) do nothing;

create or replace function public.manager_edit_ui_module(
  p_id text, p_label text, p_icon text, p_visible boolean, p_sort_order integer
) returns public.ui_modules
language plpgsql security definer set search_path = ''
as $$
declare r public.ui_modules;
begin
  if not public.is_manager_user() then raise exception 'manager_only'; end if;
  update public.ui_modules
    set label=coalesce(nullif(btrim(p_label),''),label),
        icon=coalesce(nullif(btrim(p_icon),''),icon),
        visible=coalesce(p_visible,visible),
        sort_order=coalesce(p_sort_order,sort_order),
        deleted=false, updated_by=auth.uid(), updated_at=now()
  where id=p_id returning * into r;
  if r.id is null then raise exception 'ui_module_not_found'; end if;
  return r;
end; $$;

create or replace function public.manager_delete_ui_module(p_id text)
returns public.ui_modules
language plpgsql security definer set search_path = ''
as $$
declare r public.ui_modules;
begin
  if not public.is_manager_user() then raise exception 'manager_only'; end if;
  update public.ui_modules set deleted=true, visible=false, updated_by=auth.uid(), updated_at=now()
  where id=p_id returning * into r;
  if r.id is null then raise exception 'ui_module_not_found'; end if;
  return r;
end; $$;

create or replace function public.manager_bulk_delete_properties(p_ids bigint[])
returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare deleted_count integer:=0;
begin
  if not public.is_manager_user() then raise exception 'manager_only'; end if;
  if p_ids is null or cardinality(p_ids)=0 then raise exception 'property_ids_required'; end if;
  delete from public.properties where id = any(p_ids);
  get diagnostics deleted_count=row_count;
  return jsonb_build_object('ok',true,'deleted',deleted_count);
end; $$;

revoke all on function public.manager_edit_ui_module(text,text,text,boolean,integer) from public, anon;
grant execute on function public.manager_edit_ui_module(text,text,text,boolean,integer) to authenticated;
revoke all on function public.manager_delete_ui_module(text) from public, anon;
grant execute on function public.manager_delete_ui_module(text) to authenticated;
revoke all on function public.manager_bulk_delete_properties(bigint[]) from public, anon;
grant execute on function public.manager_bulk_delete_properties(bigint[]) to authenticated;
