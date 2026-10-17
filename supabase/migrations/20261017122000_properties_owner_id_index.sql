-- Targeted FK index selected from the live read-only performance audit.
-- properties is the largest affected table (~2.3 MiB); owner_id is a core relationship
-- key and the FK has no valid leading-column index in the live catalog.
-- Draft migration only: do not apply until migration-history reconciliation is complete.
create index if not exists properties_owner_id_idx
  on public.properties using btree (owner_id);
