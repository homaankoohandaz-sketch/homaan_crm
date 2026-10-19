-- Permit authorized managers to delete one archived import row from the CRM archive UI.
-- This does not delete the linked property/lead; those are separate canonical CRM records.
drop policy if exists import_raw_rows_delete_manager on public.import_raw_rows;
create policy import_raw_rows_delete_manager
  on public.import_raw_rows
  for delete
  to authenticated
  using (public.is_manager_user());
