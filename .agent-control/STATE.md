# Agent Control State

status: BATCH31-50 EXECUTED | CRM RECONCILED | ISOLATED RUNTIME PASS | FULL REPO RUNTIME BLOCKED
project: BuildWise AI
branch: buildwise-implementation
active_task: checklist-51-70
last_batch: 31-50

## Current truth
- Code truth: GitHub branch buildwise-implementation.
- Coordination truth: .agent-control/.
- MASTER-CHECKLIST-v3-850.md is the sole task acceptance register.
- MASTER-ARCHITECTURE.md remains authoritative and unchanged.
- No force-update of main.

## Batch 31-50
- 031 People: canonical crm_people repository retained and extended with typed search.
- 032 Owners: represented through crm_people.person_type=owner; no duplicate owner repository created.
- 033 Buyers: represented through crm_people.person_type=buyer; no duplicate buyer repository created.
- 034 Investors: represented through crm_people.person_type=investor; no duplicate investor repository created.
- 035 Builders: represented through crm_people.person_type=builder; no duplicate builder repository created.
- 036 Suppliers: no dedicated supplier entity/type exists in current live schema; remains PARTIAL.
- 037 Contractors: no dedicated contractor entity/type exists in current live schema; remains PARTIAL.
- 038 Properties: existing canonical properties table/repository path retained; 1,750 live rows observed.
- 039 Lands: existing land/feasibility path retained; no duplicate domain created.
- 040 Leads: existing leads repository retained; live table has 5 rows.
- 041 Public Requests: existing public_requests table/path retained.
- 042 Deals: existing deals table/path retained; live table has 1 row.
- 043 Contacts/Phones: crm_person_private + crm_identity_events retained; phone hash is generated in live schema.
- 044 Search: canonical local search/query helper added.
- 045 Advanced Filters: canonical local filter operators added; repository boundary extended with ilike/neq/is.
- 046 Excel Import: existing canonical import path retained.
- 047 Google Sheets Import: existing canonical import path retained.
- 048 Multi-Sheet Import: existing importer reads all workbook sheets.
- 049 Preserve Every Excel Column: raw source object preservation retained.
- 050 Preserve Every Excel Row: source row metadata preservation retained.

## Additional reconciliation
- Import duplicate detection was corrected to be non-destructive and candidate-only.
- Duplicate detection no longer treats surname/phone as merge authority; property-code candidates are explicitly reported.
- Persian phone-column aliases are now recognized after normalization.
- Added tests/crm-import-query.test.js.

## Tests / Runtime
- Isolated Node runtime: PASS — crm search/filter + import normalization + validation + raw preservation + duplicate-candidate detection.
- JS syntax checks: PASS for changed CRM helper/import files.
- Live Supabase schema inspection: PASS; project ACTIVE_HEALTHY.
- Full repository runtime remains unavailable from the current environment; no DONE is claimed solely from isolated tests.

## Release
PARTIAL / release-gated.

## Next
- Next Task: 051
- Continue sequentially through the 850 registry.
- Do not rebuild completed/reconciled CRM paths.


## Batch 51-70
- 051 Original Raw Data: canonical CRM operations now preserves source objects for export/audit workflows.
- 052 Import Batch Tracking: batch lifecycle primitive added (started/completed/error count).
- 053 Duplicate Detection: duplicate phone candidates remain detection-only; no merge authority.
- 054 Same Phone Preservation: same-phone candidates explicitly return mergeAllowed=false.
- 055 Activity Timeline: canonical activity event/timeline primitives added.
- 056 Data Export: column-selectable record export added.
- 057 JSON Backup: JSON serialization added from canonical export path.
- 058 Manager Data Editing: arbitrary-field record edit primitive added without field whitelist.
- 059 Manager Audit Trail: immutable audit-entry/append primitives added.
- 060 Arbitrary Excel Column Editor: arbitrary imported-field edit primitive added; UI/runtime integration remains partial.
- 061 Import Error Isolation: raw rows are retained independently from normalization errors.
- 062 Import Preview: existing preview reconciled; no duplicate preview path created.
- 063 Import Validation: existing validation reconciled; error isolation added.
- 064 Import Rollback: non-destructive rollback-plan primitive added; execution remains gated.
- 065 Data Quality Dashboard: quality metrics primitive added; dashboard UI remains partial.
- 066 Land Analysis: canonical analysis primitives added without replacing existing feasibility path.
- 067 Development Feasibility: land analysis supports buildable/useful area and cost/revenue scenario inputs; full municipal evidence remains separate.
- 068 Municipal Regulation Evidence: remains TODO; no unsupported external regulatory data was invented.
- 069 Participation Analysis: canonical participation share/profit calculation added.
- 070 Barter Analysis: canonical value-balance calculation added.

## Batch 51-70 Verification
- Isolated Node runtime: PASS for CRM operations, data-quality primitives, land/participation/barter analysis.
- Full repository runtime: still unavailable from current environment; no DONE claim made from isolated runtime alone.
- New implementation commits: dbcbfa777268235287eae565994715833bb654a3, f669cfd584b51035b994840090276dd3fabe7bde, d002b1fc4e16518935d5bdd2a922b63f322e9a7c, 77ce4deb1b2a7aa5dd6a3b3b50cd7aae79a3caf4.
- Next Task: 071.
