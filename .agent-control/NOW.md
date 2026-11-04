# NOW — BuildWise AI

as_of: 2026-11-04
canonical_branch: main
active_task: DATA-001-preservation-and-import-contract
operating_mode: CRM-first; evidence-first; preserve production data
release_target: personal trial

## Latest verified release
- App SHA: `5f782cababc051e1982e13d7f4599c8ab182563b`.
- Full Test Suite: PASS.
- BuildWise QA: PASS.
- Application Validation: PASS.
- GitHub Pages deployment: PASS.
- Live HTML/cache version verified: `20261104taskfix4`.
- UI: warm living-room photo behind dark smoked-glass panels; contrast overlay applied.
- CRM import: canonical Persian/Arabic mapper, stable 222.xlsx row identity, pre-import owner/address coverage summary.
- Manager: normalized owner/admin/manager role handling, Persian manager label, CRUD regression tests for property/deal/import archive.
- Search: one-character query and advanced owner/address/price/area/region/type/bedrooms/status filters; manager-only mobile search.
- Follow-ups: DB-compatible status adapter; CRM-only active task center; database-backed selectors for properties, leads, requests, contacts, deals and customer shares.
- Dashboard: no archived construction-project queries; task KPI uses live pending status.

## Live data facts
- properties: 6,039 total; 5,838 canonical 222.xlsx records.
- On those 5,838 records: owner_name 0; mobile 5,838; street 4,967; alley 0; side_street 0; property_name 5,838.
- import_raw_rows: 250 rows for “فایلهای مرتب شده .xlsx”.
- import_batches 5 and 6: processing; 6,034 total rows each; successful_rows 0.
- tasks: 0 rows; DB status constraint accepts only pending/done.
- Supabase migration ledger: 108 entries; repository has 47 migration files. No migration applied.

## Next
1. Obtain original 222.xlsx workbook; produce dry-run reconciliation against existing IMP-222-xxxxx IDs.
2. Repair missing owner/alley/side_street by stable property_code matching; preserve IDs and relations. No bulk delete.
3. Verify authenticated task create/update with owner/staff without leaving production test data.
4. Finish deal lifecycle, public request handling, customer sharing and bounded AI.
5. Complete authenticated owner/staff and mobile walkthrough.

## Gates
- No bulk deletion, reset, blind migration repair or data rewrite.
- Backup rollout and final security audit remain deferred as instructed.
- D-028 archived ranges remain frozen and preserved.
- Authenticated browser E2E remains unverified; no credential handoff or secret exposure.
