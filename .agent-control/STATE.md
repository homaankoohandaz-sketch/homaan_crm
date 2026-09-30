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
