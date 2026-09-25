-- BuildWise AI — Project Hierarchy v1
-- Project → Complex → Building → Phase → Floor → Unit
-- Idempotent / safe. Rollback notes at bottom.
-- Does NOT drop or alter existing construction_projects data.

BEGIN;

-- 1. Complexes under a Project
CREATE TABLE IF NOT EXISTS public.project_complexes (
  id              bigserial PRIMARY KEY,
  project_id      bigint NOT NULL REFERENCES public.construction_projects(id) ON DELETE CASCADE,
  name            text NOT NULL,
  code            text,
  description     text,
  sort_order      integer NOT NULL DEFAULT 0,
  status          text NOT NULL DEFAULT 'active',
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  created_by      uuid
);

CREATE INDEX IF NOT EXISTS idx_project_complexes_project
  ON public.project_complexes(project_id);

-- 2. Buildings under a Complex
CREATE TABLE IF NOT EXISTS public.project_buildings (
  id              bigserial PRIMARY KEY,
  complex_id      bigint NOT NULL REFERENCES public.project_complexes(id) ON DELETE CASCADE,
  name            text NOT NULL,
  code            text,
  floors_planned  integer,
  sort_order      integer NOT NULL DEFAULT 0,
  status          text NOT NULL DEFAULT 'active',
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  created_by      uuid
);

CREATE INDEX IF NOT EXISTS idx_project_buildings_complex
  ON public.project_buildings(complex_id);

-- 3. Link existing project_phases to Building/Complex (nullable, non-breaking)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'project_phases'
  ) THEN
    ALTER TABLE public.project_phases
      ADD COLUMN IF NOT EXISTS building_id bigint REFERENCES public.project_buildings(id) ON DELETE SET NULL;
    ALTER TABLE public.project_phases
      ADD COLUMN IF NOT EXISTS complex_id bigint REFERENCES public.project_complexes(id) ON DELETE SET NULL;
    CREATE INDEX IF NOT EXISTS idx_project_phases_building ON public.project_phases(building_id);
    CREATE INDEX IF NOT EXISTS idx_project_phases_complex  ON public.project_phases(complex_id);
  END IF;
END $$;

-- 4. Floors under a Building (optional Phase link)
CREATE TABLE IF NOT EXISTS public.project_floors (
  id              bigserial PRIMARY KEY,
  building_id     bigint NOT NULL REFERENCES public.project_buildings(id) ON DELETE CASCADE,
  phase_id        bigint REFERENCES public.project_phases(id) ON DELETE SET NULL,
  floor_number    integer NOT NULL,
  name            text,
  area_m2         numeric(14,2),
  sort_order      integer NOT NULL DEFAULT 0,
  status          text NOT NULL DEFAULT 'active',
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  created_by      uuid,
  UNIQUE (building_id, floor_number)
);

CREATE INDEX IF NOT EXISTS idx_project_floors_building
  ON public.project_floors(building_id);

-- 5. Units under a Floor
CREATE TABLE IF NOT EXISTS public.project_units (
  id              bigserial PRIMARY KEY,
  floor_id        bigint NOT NULL REFERENCES public.project_floors(id) ON DELETE CASCADE,
  unit_code       text NOT NULL,
  unit_type       text DEFAULT 'residential',
  area_m2         numeric(14,2),
  bedrooms        integer,
  status          text NOT NULL DEFAULT 'available',
  sort_order      integer NOT NULL DEFAULT 0,
  metadata        jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  created_by      uuid,
  UNIQUE (floor_id, unit_code)
);

CREATE INDEX IF NOT EXISTS idx_project_units_floor
  ON public.project_units(floor_id);
CREATE INDEX IF NOT EXISTS idx_project_units_status
  ON public.project_units(status);

-- 6. Minimal RLS (match existing authenticated CRM pattern)
ALTER TABLE public.project_complexes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_floors    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_units     ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'project_complexes' AND policyname = 'project_complexes_auth_all') THEN
    CREATE POLICY project_complexes_auth_all ON public.project_complexes
      FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'project_buildings' AND policyname = 'project_buildings_auth_all') THEN
    CREATE POLICY project_buildings_auth_all ON public.project_buildings
      FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'project_floors' AND policyname = 'project_floors_auth_all') THEN
    CREATE POLICY project_floors_auth_all ON public.project_floors
      FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'project_units' AND policyname = 'project_units_auth_all') THEN
    CREATE POLICY project_units_auth_all ON public.project_units
      FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;

COMMIT;

-- ============================================================
-- ROLLBACK (manual, if needed):
-- DROP TABLE IF EXISTS public.project_units CASCADE;
-- DROP TABLE IF EXISTS public.project_floors CASCADE;
-- ALTER TABLE public.project_phases DROP COLUMN IF EXISTS building_id;
-- ALTER TABLE public.project_phases DROP COLUMN IF EXISTS complex_id;
-- DROP TABLE IF EXISTS public.project_buildings CASCADE;
-- DROP TABLE IF EXISTS public.project_complexes CASCADE;
-- ============================================================
