# NOW — BuildWise AI

as_of: 2026-11-04
canonical_branch: main
active_task: DATA-001-preservation-and-import-contract
operating_mode: CRM-first; evidence-first; preserve production data
release_target: personal trial

## Latest verified app release
- App SHA: `c5483e61f2be8ae74fe3942b564ca9aede953fe0`.
- Full Test Suite: PASS.
- BuildWise QA: PASS.
- Application Validation: PASS.
- GitHub Pages deployment: PASS.
- Live HTML/cache version verified: `20261104taskfix1`.
- Importer: canonical Persian/Arabic mapper, stable 222.xlsx row identity, pre-import owner/address coverage summary.
- Manager: normalized role handling, Persian manager label, CRUD regression tests for property/deal/import archive.
- Search: one-character text query; owner/name/code/address, region, neighborhood, type, price, area, bedrooms and status; manager-only mobile search.
- Follow-ups: task persistence maps domain lifecycle to live `pending/done` DB constraint; CRM task subjects include property, lead, request, contact, customer share and deal; active UI is CRM-only.

## Live data facts
- properties: 6,039 total; 5,838 canonical 222.xlsx records.
- On those 5,838 records: owner_name 0; mobile 5,838; street 4,967; alley 0; side_street 0; property_name 5,838.
- import_raw_rows: 250 rows for “فایلهای مرتب شده .xlsx”.
- import_batches 5 and 6: processing; 6,034 total rows each; successful_rows 0. These are not verified successful imports.
- tasks: 0 rows; status constraint accepts only pending/done.
- Supabase migration ledger: 108 entries, latest 20261024100056; repository currently has 47 migration files. Do not add migrations until drift reconciliation.

## Next
1. Obtain original 222.xlsx workbook; produce dry-run reconciliation against existing IMP-222-xxxxx IDs.
2. Repair missing owner/alley/side_street by stable property_code matching; preserve IDs and relations. No bulk delete.
3. Verify task creation/update with an authenticated CRM role without creating production test data.
4. Finish deal lifecycle, customer sharing, CRM request/lead flows and bounded AI.
5. Complete authenticated owner/staff walkthrough and mobile acceptance.

## Gates
- No bulk deletion, reset, blind migration repair or data rewrite.
- Backup rollout and final security audit remain deferred as instructed.
- D-028 archived ranges remain frozen and preserved.
- Authenticated browser E2E remains unverified; no credential handoff or secret exposure.
