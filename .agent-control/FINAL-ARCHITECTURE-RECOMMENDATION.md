# BuildWise Final Architecture — CRM-First Recommendation

Date: 2026-11-03
Decision: D-028
Status: draft for independent review by Grok and Claude, then Product Owner approval
Freeze: .agent-control/ARCHIVE-FREEZE.md

## Recommendation
Do not rebuild from zero. Keep the current repository, Supabase project, property records, auth/role foundation, import pipeline and working CRM flows. Narrow BuildWise to a reliable real-estate CRM and transaction workspace. Do not create a second app/repository now. Project Control remains a possible future extraction after BuildWise is usable.

## Frozen ranges
066–100 (market/municipal/valuation), 191–235 (project accounting), 343–367 (workflow engine), 453–476 (construction/project control). These are FROZEN — DO NOT TOUCH for ChatGPT, Grok, Claude, Codex, other agents and the human owner. They are excluded from task generation, estimates, progress, navigation and release blockers. Preserve existing source, schema, migrations, data and tests.

## Audit evidence

### Application
- Primary entry: index.html; primary authenticated app and navigation: buildwise-app.js.
- Main UI remains a large browser-side application file. Do not rewrite it; modularize only when needed by an active CRM task.
- Navigation has been narrowed to: Dashboard, Properties, Leads/Contacts, Requests, Deals, Search, Matching, Follow-ups, Data Import/Archive, Customer Sharing, ROOM, Promotions, AI Assistant and App Settings.
- Role access and route dispatch no longer expose construction, market or automation routes.
- Project and valuation shortcuts and recent-project dashboard panel have been removed.
- Data Hub is intended for property/contact import and raw-row archive; market-specific widgets were removed.
- Old engine files and script imports remain in the repository. Preserve them. Detach unused script imports only after dependency analysis and browser regression tests.

### Supabase read-only inspection
Project: beuestoewletjsgmigmf
- 108 migration records; latest recorded migration version: 20261024100056.
- RLS is enabled on all public tables returned by the table inventory. This alone does not prove the policies are correctly scoped.
- Key row counts: properties 6,039; leads 5; deals 1; owners 0; app_roles 2; import_batches 6; import_raw_rows 250; tasks 0; public_requests 0; customer_shares 1.
- crm_people, crm_person_private and crm_requests are empty while properties/leads/deals hold operational records. Do not merge these models without field-level mapping and duplicate/provenance audit.
- Project tables are present and mostly empty; known exceptions: construction_projects 1, project_phases 3, project_wbs 4, project_milestones 3, construction_boq_items 1. Preserve them.
- Security advisors: 14 SECURITY DEFINER functions executable by authenticated users; many anonymous-policy warnings; leaked-password protection disabled. Review individually. No broad revocations.
- Performance advisors: 34 multiple-permissive-policy findings, 124 unindexed foreign keys, 87 unused indexes. Review in priority order; no blind schema changes.
- Backup systems were not inspected, consistent with the existing defer-until-final-pre-release decision.

## Active BuildWise product
1. Authentication, active-account check, roles and manager governance.
2. Property bank: create/read/update, full attributes, owner/contact link, status, tags, media and follow-up dates.
3. People/CRM: owners, sellers, buyers, builders, customers, advisors and duplicate-safe identity.
4. Leads and public requests: intake, qualification, assignment and contact history.
5. Excel/CSV import: preview, mapping, validation, duplicate review, raw archive, batch traceability, row-level errors and rollback.
6. Search/filter: Persian/Arabic normalization, region, neighborhood, property type, price, area, rooms and status.
7. Matching: explainable matching of real requests to available properties.
8. Deals: property/request links, type, price, dates, status and brokerage commission.
9. CRM follow-ups: assignments, reminders, response and history limited to property/contact/request/deal contexts. Not the archived workflow builder.
10. Customer sharing: controlled proposal links, expiry and customer response.
11. Operational AI limited to authorized CRM search, summaries and actions.
12. CRM dashboard and app settings.

## Keep hidden / preserved
Construction/project-control, market/valuation, project accounting/procurement and workflow-builder code/schema remain archived. Do not delete source, migrations or records. Do not extend these capabilities through shared modules.

## Architecture decisions to settle
A. Canonical person model: map properties, owners, leads, public_requests, crm_people and crm_requests. Decide after provenance/duplicate review; no data migration before this.
B. Navigation: role access is authoritative. Database UI settings may customize allowed entries only; they must never re-enable archived routes.
C. App modularity: keep current shell; gradually split the monolithic app file, no rewrite.
D. Import is P0: test multi-sheet workbook, column preservation, duplicates, raw archive, batch reconciliation, failed-row isolation and rollback.
E. Security: review every anonymous policy and SECURITY DEFINER function against intended public/customer/authenticated/manager access. Add negative tests for phone visibility and manager-only edits.

## Shortest route to usable BuildWise
P0 Architecture: Grok and Claude independently review this report, the changed navigation, data model and security risks. Master reconciles their findings into one final proposal for Product Owner approval.
P1 Property bank: verify create/edit/list/detail, owner links, media, history and permissions.
P2 CRM intake: reconcile canonical person model, requests/leads, import and search.
P3 Matching/deals: verify real matches, deal lifecycle and brokerage commission.
P4 Follow-up/customer sharing: CRM-only task/reminder flow and customer response lifecycle.
P5 Release proof: authenticated walkthrough for each role, import acceptance, mobile UI, RLS/phone visibility regression, full test suite and deployed SHA match.

## Acceptance
BuildWise is not final because the UI loads or CI passes. A usable personal-trial release requires login and role isolation; safe import/create/search/edit/retrieval of real property records; linked contacts, requests and deals; working CRM follow-ups and customer sharing; security and phone-visibility evidence; automated and authenticated browser tests; and deployed SHA equal to reviewed main SHA.

## Product Owner decisions still open
1. CRM canonical person model after data mapping.
2. Keep ROOM in the first usable release or defer it.
3. Keep Promotions in the first usable release or defer it.
4. Is Google Sheets sync essential, or are Excel/CSV/manual entry enough for first release?
5. Confirm minimum roles and phone-visibility matrix.

Final recommendation: approve CRM-first; no rebuild; no second app now; finish the existing property bank, CRM contacts, import, search, matching, deals and follow-ups before any new feature expansion.
