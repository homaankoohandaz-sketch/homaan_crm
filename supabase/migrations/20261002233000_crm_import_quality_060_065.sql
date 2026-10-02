-- BuildWise AI — CRM import quality 060-065
-- Batch identity is attached to normalized target rows so rollback is exact and bounded.
-- No merge is performed from surname/phone alone.

alter table public.properties
  add column if not exists import_batch_id text;

alter table public.leads
  add column if not exists import_batch_id text;

alter table public.market_data_imports
  add column if not exists import_batch_id text;

create index if not exists properties_import_batch_id_idx
  on public.properties(import_batch_id)
  where import_batch_id is not null;

create index if not exists leads_import_batch_id_idx
  on public.leads(import_batch_id)
  where import_batch_id is not null;

create index if not exists market_data_imports_import_batch_id_idx
  on public.market_data_imports(import_batch_id)
  where import_batch_id is not null;

create or replace function public.rollback_import_batch(p_batch_id text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  deleted_properties integer := 0;
  deleted_leads integer := 0;
  deleted_market integer := 0;
  batch_exists boolean;
begin
  if not public.is_manager_user() then
    raise exception 'manager_only';
  end if;

  if p_batch_id is null or btrim(p_batch_id) = '' then
    raise exception 'batch_id_required';
  end if;

  select exists(select 1 from public.import_batches where id::text = p_batch_id)
    into batch_exists;

  if not batch_exists then
    raise exception 'import_batch_not_found';
  end if;

  delete from public.properties where import_batch_id = p_batch_id;
  get diagnostics deleted_properties = row_count;

  delete from public.leads where import_batch_id = p_batch_id;
  get diagnostics deleted_leads = row_count;

  delete from public.market_data_imports where import_batch_id = p_batch_id;
  get diagnostics deleted_market = row_count;

  update public.import_batches
    set status = 'rolled_back',
        error_log = coalesce(error_log,'') || case when coalesce(error_log,'')='' then '' else E'\n' end ||
          format('Rolled back by manager: properties=%s, leads=%s, market=%s', deleted_properties, deleted_leads, deleted_market)
  where id::text = p_batch_id;

  return jsonb_build_object(
    'ok', true,
    'batch_id', p_batch_id,
    'deleted', jsonb_build_object(
      'properties', deleted_properties,
      'leads', deleted_leads,
      'market', deleted_market
    )
  );
end;
$$;

revoke all on function public.rollback_import_batch(text) from public, anon;
grant execute on function public.rollback_import_batch(text) to authenticated;
