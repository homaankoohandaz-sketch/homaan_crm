# BuildWise AI — Professional Benchmark and Execution Log
Date: 2026-10-12
Branch: buildwise-implementation
Production release: main (not changed by this work)

## Executive assessment

BuildWise is best treated as an integrated Real Estate Operating System in development, not as a production-equivalent replacement for Salesforce, Procore, Autodesk Forma/Construction Cloud, or Oracle Primavera P6. Its differentiator is the intended combination of CRM, real-estate deal intelligence, construction controls, finance, and AI-assisted decisions. Its main gap is evidence of reliable end-to-end runtime behavior and enterprise-grade access controls across those domains.

## Benchmark: what leading products make non-negotiable

| Reference product | Professional benchmark | BuildWise implication |
|---|---|---|
| Salesforce | Least-privilege access and configurable security controls. Source: https://compliance.salesforce.com/en/documents/a006e000014PD7VAA | Every RPC, table, role, and sensitive field needs explicit authorization tests; UI hiding is not a security boundary. |
| Procore | Connected project management, financial management, quality/safety, schedules, resource tracking, and AI in construction workflows. Source: https://www.procore.com/products | Construction modules must share project/task/cost identities and audit trails rather than operate as disconnected demos. |
| Autodesk Forma / Construction Cloud | Common data environment, document versioning/approvals, RFIs/submittals, cost and schedule linkage, analytics and integrations. Sources: https://construction.autodesk.com/workflows/construction-project-management/ and https://help.autodesk.com/cloudhelp/ENG/Docs/files/About_Autodesk_Docs.html | BuildWise needs evidence-backed document history, approval workflows, schedule/cost linkage, and traceable changes. |
| Oracle Primavera P6 | Multi-project scheduling, resource management, risk management, baseline-vs-actual reporting and portfolio-level visibility. Source: https://www.oracle.com/construction-engineering/primavera-p6/datasheet/ | WBS, dependencies, critical path, baselines, resource conflicts, and progress evidence must be validated against persisted project data and runtime workflows. |

These are product capability comparisons based on vendor-published descriptions, not a claim that BuildWise has reached parity.

## Changes executed against Supabase

1. **Removed unrestricted KPI snapshot access.** Replaced the single project_kpi_snapshots_auth policy (FOR ALL, USING true, WITH CHECK true) with active-user SELECT and can_write()-gated INSERT/UPDATE/DELETE policies.
2. **Removed one redundant index.** Dropped project_kpi_snapshots_project_date_uq; the table's UNIQUE constraint index on (project_id, snapshot_date) remains.
3. **Added 18 FK indexes** on CRM, appointments, project, alert, and audit hot paths.
4. **Optimized 55 RLS policy expressions** by wrapping stable auth.*() calls in scalar SELECTs, preserving policy names, roles, commands, USING, and WITH CHECK predicates.

## Post-change verification

- KPI snapshot policies now have separate SELECT/INSERT/UPDATE/DELETE predicates; no blanket true policy remains.
- 18 of the previously reported unindexed foreign keys now have indexes; Supabase advisor count changed from **142 to 124**.
- The auth_rls_initplan performance warning category disappeared after policy optimization.
- Duplicate-index warning disappeared after removal of the redundant KPI index.
- Targeted local tests for the two new regression-test files: **3/3 passed**.
- Security advisor still reports **14 authenticated-callable SECURITY DEFINER functions** and **leaked-password protection disabled**. The 14 functions require per-function authorization/caller review; the generic warning alone is not proof that each is exploitable.
- Multiple-permissive-policy warnings remain (**34**); these need policy-by-policy semantic review before consolidation.
- Full GitHub CI and authenticated cross-account browser E2E have **not** been confirmed by this execution. Do not mark these changes as full release-ready solely from local unit tests and SQL policy inspection.

## Remaining priorities (ordered)

1. **Release gate:** verify branch/deploy parity, authenticated owner/manager/staff/advisor/builder/customer journeys, and cross-account isolation before merging to main.
2. **Auth setting:** enable leaked-password protection in Supabase Authentication settings.
3. **RLS consolidation:** review 34 multiple-permissive-policy findings and the remaining 14 SECURITY DEFINER functions; preserve legitimate role behavior.
4. **Index program:** inspect table sizes, pg_stat_user_indexes, and query plans before indexing the remaining 124 foreign keys. Avoid blindly adding all indexes because indexes also increase write cost and storage.
5. **CRM data integrity:** finish import preview/validation, raw-vs-normalized error isolation, duplicate rules, rollback, and data-quality dashboard.
6. **Project-control acceptance:** persistent WBS → dependency/schedule → baseline/progress evidence → KPI snapshots → procurement/BOQ → audit log, validated end-to-end.
7. **AI governance:** agent/tool permission matrix, model router, approval boundary, idempotent action execution, auditability, and feedback loop.
8. **Load and reliability:** test realistic concurrency, query latency, error rates, and mobile behavior; “1,000 users/day” is not equivalent to “1,000 concurrent users.”

## Release safety

Changes were applied to the connected Supabase project and recorded in buildwise-implementation. Production Netlify is on main; this work does not merge the 139-commit divergent branch or claim that the live UI now includes all branch changes.

## Additional security and functional correction

- Restricted the generic manager editor to the currently verified active table, public_requests, and an explicit editable-column allowlist. Requests for other tables now fail closed until a table-specific editable schema is reviewed.
- The editor rejects null for non-nullable columns.
- Fixed the editor's description field to persist into public_requests.requirements.text (JSONB) instead of the nonexistent notes column.
- Fixed UUID-based edit/save handlers to pass record IDs via data attributes; the previous unquoted interpolation could make the action invalid for UUID primary keys.
- Expanded targeted tests to cover these protections. Local targeted suite: **4/4 passed**.
