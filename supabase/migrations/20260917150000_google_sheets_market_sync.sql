-- BuildWise AI+H: Google Sheets market-data source
-- Keep the market provenance explicit instead of treating Google Sheets as generic API data.

alter table public.market_data_imports
  drop constraint if exists market_data_imports_source_type_check;

alter table public.market_data_imports
  add constraint market_data_imports_source_type_check
  check (source_type in ('excel','divar','manual','api','google_sheets'));

alter table public.market_price_observations
  drop constraint if exists market_price_observations_source_type_check;

alter table public.market_price_observations
  add constraint market_price_observations_source_type_check
  check (source_type in ('excel','divar','manual','api','google_sheets'));

create index if not exists market_price_observations_google_sheet_idx
  on public.market_price_observations (source_type, external_id, observed_at desc)
  where source_type = 'google_sheets';
