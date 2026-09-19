-- Release hardening: security and duplicate-index cleanup.
-- Safe/idempotent permission and index changes only.

REVOKE EXECUTE ON FUNCTION public.is_manager_user() FROM PUBLIC;

DROP INDEX IF EXISTS public.properties_bedrooms_idx;
DROP INDEX IF EXISTS public.properties_search_bedrooms_idx;
DROP INDEX IF EXISTS public.properties_land_area_idx;
DROP INDEX IF EXISTS public.properties_search_land_idx;
DROP INDEX IF EXISTS public.properties_property_type_idx;
DROP INDEX IF EXISTS public.properties_search_type_idx;
DROP INDEX IF EXISTS public.properties_region_idx;
DROP INDEX IF EXISTS public.properties_search_region_idx;
DROP INDEX IF EXISTS public.properties_search_price_idx;
DROP INDEX IF EXISTS public.properties_total_price_idx;
DROP INDEX IF EXISTS public.properties_updated_at_idx;

-- Keep the explicit idx_* indexes and the DESC updated index.
