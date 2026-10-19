-- Ensure all imported market observations can be rolled back by their exact batch.
alter table public.market_price_observations
  add column if not exists import_batch_id text;

create index if not exists market_price_observations_import_batch_idx
  on public.market_price_observations(import_batch_id)
  where import_batch_id is not null;

-- Preserve the existing manager gate, batch lock, and idempotent rollback contract.
create or replace function public.rollback_import_batch(p_batch_id text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  deleted_properties integer := 0;
  deleted_leads integer := 0;
  deleted_market_observations integer := 0;
  deleted_market_imports integer := 0;
  batch_key bigint;
begin
  if auth.uid() is null or not public.is_manager_user() then
    raise exception 'manager_only';
  end if;
  if p_batch_id is null or btrim(p_batch_id) = '' then
    raise exception 'batch_id_required';
  end if;
  begin
    batch_key := p_batch_id::bigint;
  exception when others then
    raise exception 'invalid_batch_id';
  end;
  perform 1 from public.import_batches where id = batch_key for update;
  if not found then raise exception 'import_batch_not_found'; end if;

  if exists(select 1 from public.import_batches where id = batch_key and status = 'rolled_back') then
    return jsonb_build_object('ok', true, 'batch_id', p_batch_id, 'already_rolled_back', true);
  end if;

  delete from public.properties where import_batch_id = p_batch_id;
  get diagnostics deleted_properties = row_count;
  delete from public.leads where import_batch_id = p_batch_id;
  get diagnostics deleted_leads = row_count;
  delete from public.market_price_observations where import_batch_id = p_batch_id;
  get diagnostics deleted_market_observations = row_count;
  delete from public.market_data_imports where import_batch_id = p_batch_id;
  get diagnostics deleted_market_imports = row_count;

  update public.import_batches
  set status = 'rolled_back',
      error_log = left(
        coalesce(error_log, '') || E'\n' ||
        format(
          'Rolled back by manager %s: properties=%s, leads=%s, market_observations=%s, market_imports=%s',
          auth.uid(), deleted_properties, deleted_leads, deleted_market_observations, deleted_market_imports
        ),
        10000
      )
  where id = batch_key;

  return jsonb_build_object(
    'ok', true,
    'batch_id', p_batch_id,
    'deleted', jsonb_build_object(
      'properties', deleted_properties,
      'leads', deleted_leads,
      'market_observations', deleted_market_observations,
      'market_imports', deleted_market_imports
    )
  );
end
$function$;

revoke all on function public.rollback_import_batch(text) from public, anon;
grant execute on function public.rollback_import_batch(text) to authenticated;
