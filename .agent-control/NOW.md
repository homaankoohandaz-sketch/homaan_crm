# NOW — BuildWise AI

as_of: 2026-11-04
canonical_branch: main
active_task: DATA-001-preservation-and-import-contract
operating_mode: CRM-first; evidence-first; preserve production data
release_target: personal trial

## Latest implementation
- Main SHA: `b5f11472cb4080918dae801971385b67dfb594c1`.
- Canonical Persian Excel property mapper extracted and tested.
- 222.xlsx / Sheet2 stable row identity now reproduces the existing `IMP-222-00001` … `IMP-222-05838` identifiers.
- Manager role normalization and Persian sidebar role label fixed.
- Full Test Suite: PASS; BuildWise QA: PASS; Application Validation: PASS.
- GitHub Pages deployment for this SHA must be checked before sharing as live.

## Live data facts
- properties: 6,039 total; 5,838 canonical 222.xlsx records.
- On those 5,838 records: owner_name 0; mobile 5,838; street 4,967; alley 0; side_street 0; property_name 5,838.
- import_raw_rows: 250 rows for “فایلهای مرتب شده .xlsx”.
- import_batches 5 and 6: processing; 6,034 total rows each; successful_rows 0. These are not verified successful imports.
- Supabase migration ledger: 108 entries, latest 20261024100056.

## Next
1. Verify GitHub Pages deploy for current SHA.
2. Obtain the original 222.xlsx workbook and create a dry-run row/column reconciliation report.
3. Repair owner/alley/side_street by stable property_code matching while preserving IDs and relations; no bulk delete.
4. Continue active CRM work: import preview/validation/error isolation, search, manager record operations, people/requests, deals, follow-ups, customer sharing and bounded AI.

## Gates
- No bulk deletion, reset, blind migration repair or data rewrite.
- Backup rollout and final security audit remain deferred as instructed.
- D-028 archived ranges remain frozen and preserved.
