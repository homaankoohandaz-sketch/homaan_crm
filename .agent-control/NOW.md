# NOW — BuildWise AI

as_of: 2026-11-04
canonical_branch: main
active_task: DATA-001-preservation-and-import-contract
operating_mode: CRM-first; evidence-first; preserve production data
release_target: personal trial

## Latest verified implementation
- Main code SHA: `343ec1314bbdfa8b67c5dbef0458a8ed3535378e`.
- Full Test Suite: PASS.
- BuildWise QA: PASS.
- Application Validation: PASS.
- GitHub Pages deployment: PASS.
- Live HTML stamp and cache version verified: `20261104crmfix3`.
- Importer now uses a canonical Persian/Arabic mapper, stable source-row identity for 222.xlsx/Sheet2, and a pre-import field coverage panel for owner/address columns.
- Manager role normalization and Persian sidebar label fixed; regression tests cover property/deal/import-archive manager controls.

## Live data facts
- properties: 6,039 total; 5,838 canonical 222.xlsx records.
- On those 5,838 records: owner_name 0; mobile 5,838; street 4,967; alley 0; side_street 0; property_name 5,838.
- import_raw_rows: 250 rows for “فایلهای مرتب شده .xlsx”.
- import_batches 5 and 6: processing; 6,034 total rows each; successful_rows 0. These are not verified successful imports.
- Supabase migration ledger: 108 entries, latest 20261024100056.

## Next execution
1. Obtain original 222.xlsx workbook and produce a dry-run reconciliation report against the existing IMP-222-xxxxx IDs.
2. Repair missing owner/alley/side_street fields by matching property_code; preserve IDs, relations and all non-target fields. Do not bulk-delete.
3. Continue active CRM backlog: import rollback/error isolation, search/filter E2E, people/requests, deal lifecycle, follow-ups, customer sharing and bounded AI.
4. Verify authenticated UI flows for owner and staff roles.

## Gates
- No bulk deletion, reset, blind migration repair or data rewrite.
- Backup rollout and final security audit remain deferred as instructed.
- D-028 archived ranges remain frozen and preserved.
- Authenticated browser E2E remains unverified; no credential handoff or secret exposure.
