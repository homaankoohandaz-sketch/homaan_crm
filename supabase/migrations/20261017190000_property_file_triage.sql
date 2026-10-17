-- Property file triage: manager-controlled star and operational labels.
-- Additive only; this migration does not update or delete existing property records.
alter table public.properties
  add column if not exists is_starred boolean not null default false,
  add column if not exists file_tags text[] not null default '{}';

-- Keep the existing client-view contract and append the two non-sensitive file-triage fields.
create or replace view public.properties_client
with (security_invoker = true)
as
select
  id, property_code, source, rate, status, request_type, property_type, ownership_type,
  usage_type, region, neighborhood, street, property_name, alley, side_street, plaque,
  location_lat, location_lng, frontage, passage_width, land_area, built_area, floor, total_floors,
  bedrooms, building_age, unit_count, parking_count, storage_count, elevator, regulation, density,
  allowed_floors, occupancy_percent, setback, number_of_fronts, aggregation_possible, permit_status,
  completion_status, total_price, price_per_meter, entry_price, full_deposit, deposit_amount, rent_amount,
  barter_possible, barter_details, payment_terms, owner_asking_price, negotiable_price, owner_id,
  description, owner_notes, internal_notes, created_at, updated_at, last_contact_at, next_followup_at,
  created_by, updated_by, units_per_floor, width, title_status, convertible, alley_name, sub_alley,
  entrance_info, year_registered, rating, activity_status, listing_type, owner_name,
  is_starred, file_tags
from public.properties;

revoke all on public.properties_client from anon;
grant select on public.properties_client to authenticated;
