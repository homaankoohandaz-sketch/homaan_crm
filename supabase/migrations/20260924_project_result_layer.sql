-- BuildWise AI Project Result Layer — requirements 676–692
create table if not exists public.project_results (
  id uuid primary key default gen_random_uuid(),
  project_id bigint not null references public.construction_projects(id) on delete restrict,
  version integer not null,
  status text not null default 'analyzed' check (status in ('analyzed','published','archived')),
  source text not null default 'BuildWise Project Result Layer',
  input_snapshot jsonb not null default '{}'::jsonb,
  analysis jsonb not null default '{}'::jsonb,
  architectural_review jsonb not null default '{}'::jsonb,
  financial_impact jsonb not null default '{}'::jsonb,
  plan_unit_price_matrix jsonb not null default '[]'::jsonb,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  published_at timestamptz,
  unique(project_id, version)
);

create table if not exists public.project_result_assets (
  id uuid primary key default gen_random_uuid(),
  result_id uuid not null references public.project_results(id) on delete restrict,
  asset_type text not null check (asset_type in ('front_elevation_2d','floor_plan_2d','floor_plan_3d','exterior_3d','multi_angle','view_360','construction_4d')),
  title text,
  asset_url text,
  asset_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_project_results_project_version on public.project_results(project_id, version desc);
create index if not exists idx_project_result_assets_result on public.project_result_assets(result_id);

create or replace function public.prevent_project_result_mutation()
returns trigger language plpgsql as $$
begin
  raise exception 'project_results are immutable; create a new version instead';
end; $$;

drop trigger if exists trg_project_results_immutable on public.project_results;
create trigger trg_project_results_immutable
before update or delete on public.project_results
for each row execute function public.prevent_project_result_mutation();

create table if not exists public.project_result_publications (
  project_id bigint primary key references public.construction_projects(id) on delete restrict,
  result_id uuid not null unique references public.project_results(id) on delete restrict,
  published_at timestamptz not null default now(),
  published_by uuid references auth.users(id)
);

create or replace function public.publish_project_result(p_result_id uuid)
returns public.project_results language plpgsql security invoker as $$
declare r public.project_results;
begin
  select * into r from public.project_results where id = p_result_id;
  if r.id is null then raise exception 'Project result not found'; end if;
  insert into public.project_result_publications(project_id,result_id,published_at,published_by)
  values(r.project_id,r.id,now(),auth.uid())
  on conflict(project_id) do update
    set result_id=excluded.result_id,published_at=excluded.published_at,published_by=excluded.published_by;
  return r;
end; $$;

create or replace view public.project_room_analyzed_results as
select
  pr.id as result_id, pr.project_id, pr.version, pr.status,
  pr.analysis, pr.architectural_review, pr.financial_impact,
  pr.plan_unit_price_matrix, pr.created_at, pub.published_at
from public.project_result_publications pub
join public.project_results pr on pr.id=pub.result_id;

alter table public.project_results enable row level security;
alter table public.project_result_assets enable row level security;
alter table public.project_result_publications enable row level security;

drop policy if exists project_results_authenticated_read on public.project_results;
create policy project_results_authenticated_read on public.project_results
for select to authenticated using (true);

drop policy if exists project_results_authenticated_insert on public.project_results;
create policy project_results_authenticated_insert on public.project_results
for insert to authenticated with check (auth.uid() = created_by);

drop policy if exists project_result_assets_authenticated_read on public.project_result_assets;
create policy project_result_assets_authenticated_read on public.project_result_assets
for select to authenticated using (true);

drop policy if exists project_result_assets_authenticated_insert on public.project_result_assets;
create policy project_result_assets_authenticated_insert on public.project_result_assets
for insert to authenticated with check (true);

drop policy if exists project_result_publications_authenticated_read on public.project_result_publications;
create policy project_result_publications_authenticated_read on public.project_result_publications
for select to authenticated using (true);

drop policy if exists project_result_publications_authenticated_write on public.project_result_publications;
create policy project_result_publications_authenticated_write on public.project_result_publications
for all to authenticated using (true) with check (true);

-- Security hardening for Project Result layer
alter view public.project_room_analyzed_results set (security_invoker = true);
alter function public.prevent_project_result_mutation() set search_path = public;
alter function public.publish_project_result(uuid) set search_path = public;
drop policy if exists project_result_publications_authenticated_read on public.project_result_publications;
drop policy if exists project_result_publications_authenticated_write on public.project_result_publications;
create policy project_result_publications_authenticated_select on public.project_result_publications
for select to authenticated using (true);
create policy project_result_publications_authenticated_insert on public.project_result_publications
for insert to authenticated with check (true);
create policy project_result_publications_authenticated_update on public.project_result_publications
for update to authenticated using (true) with check (true);
