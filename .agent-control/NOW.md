# NOW — BuildWise AI

as_of: 2026-11-04
canonical_branch: main
active_task: DATA-001-preservation-and-import-contract
operating_mode: CRM-first; evidence-first; preserve production data
release_target: personal trial

## Latest verified app release
- App SHA: `d4199d6cf06f91903a9685aa68d83969fa0f408f`.
- Full Test Suite: PASS.
- BuildWise QA: PASS.
- Application Validation: PASS.
- GitHub Pages deployment: PASS.
- Live HTML/cache version verified: `20261104crmfix4`.
- Importer: canonical Persian/Arabic mapper, stable 222.xlsx row identity, pre-import owner/address coverage summary.
- Manager: normalized owner/admin/manager role handling, Persian manager label, CRUD regression tests for properties/deals/import archive.
- Search: one-character query, owner/name/code/address fields, region/neighborhood/type, price, area, bedrooms and status filters; manager mobile search uses base properties, other roles use properties_client.

## Live data facts
- properties: 6,039 total; 5,838 canonical 222.xlsx records.
- On those 5,838 records: owner_name 0; mobile 5,838; street 4,967; alley 0; side_street 0; property_name 5,838.
- import_raw_rows: 250 rows for “فایلهای مرتب شده .xlsx”.
- import_batches 5 and 6: processing; 6,034 total rows each; successful_rows 0. These are not verified successful imports.
- Supabase migration ledger: 108 entries, latest 20261024100056.

## Next execution
1. Obtain original 222.xlsx workbook and produce a dry-run reconciliation report against existing IMP-222-xxxxx IDs.
2. Repair missing owner/alley/side_street fields by stable property_code matching; preserve IDs, relations and non-target fields. No bulk delete.
3. Finish import rollback/error isolation and verify 2,000+ multi-sheet import with a representative workbook.
4. Continue active CRM backlog: people/requests, deal lifecycle, follow-ups, customer sharing and bounded AI.
5. Verify authenticated UI flows for owner and staff roles.

## Gates
- No bulk deletion, reset, blind migration repair or data rewrite.
- Backup rollout and final security audit remain deferred as instructed.
- D-028 archived ranges remain frozen and preserved.
- Authenticated browser E2E remains unverified; no credential handoff or secret exposure.
