# BuildWise Migration Inventory — Git side (main)

**Date:** 2026-11-08  
**Branch:** `main`  
**Author:** Grok (read-only audit contribution to AUDIT-000)  
**Purpose:** Exact list of SQL migration files currently present in the repository. This is the Git-side half of migration parity work. Live ledger comparison still required.

## Summary

| Source | Count | Notes |
|--------|-------|-------|
| SQL files on `main` right now | **51** | Full list below |
| Last known live Supabase ledger (2026-11-03 FINAL-ARCHITECTURE audit) | **108** | Latest recorded version then: `20261024100056` |
| New files on main after that audit | **4** | All dated 2026-11-08 — **not applied to production** |

**Status:** Parity remains **UNRESOLVED**.  
Do **not** apply, delete, rewrite, or force any migration against the live Supabase project until every live ledger entry has been mapped to source SQL (Git history / recovered dump / documented decision).

## Policy reminder (from TASK-QUEUE + SINGLE-SOURCE-OF-TRUTH)
- `no-migration-apply-or-repair-before-sql-provenance-reconciliation`
- Preserve existing code, schema, migrations and data
- One writer per file; evidence required

## Full ordered list of SQL files on main (51)

```
20260917150000_google_sheets_market_sync.sql
20260919_release_hardening.sql
20260923160714_advisor_followups_security_reports.sql
20260926160000_customer_end_to_end_flow.sql
20260927210000_task_engine_persistence.sql
20260927_provision_advisor_role_on_signup.sql
20260930145935_project_control_procurement_141_160.sql
20260930151310_project_accounting_201_220.sql
20260930170000_project_accounting_191_200.sql
20260930171000_ai_change_approval_188.sql
20260930182000_project_accounting_221_235.sql
20260930190000_project_kpi_324_342.sql
20260930193000_workflow_engine_343_367.sql
20260930195000_deal_control_368_376.sql
20261001130000_contract_control_377_385.sql
20261001140000_advisor_operations_386_400.sql
20261001150000_customer_experience_406_415.sql
20261001160000_ai_intelligence_425_430.sql
20261002133000_security_governance_591_608.sql
20261002134000_security_governance_591_608_rpc_revoke.sql
20261002134500_security_hardening_599_600.sql
20261002141000_security_governance_598_603.sql
20261002143000_security_governance_601.sql
20261002163000_security_606_telegram_sessions_deny.sql
20261002230000_customer_experience_c01_c40.sql
20261002233000_crm_import_quality_060_065.sql
20261004120000_task_engine_audit_log.sql
20261006170000_project_hse_corrective_actions.sql
20261006170001_task_engine_permissions.sql
20261006170002_task_engine_rls_scope.sql
20261006170003_task_engine_delegation.sql
20261006170004_task_engine_function_execute_hardening.sql
20261006231500_production_ui_governance.sql
20261012161148_performance_security_baseline.sql
20261012161339_optimize_rls_auth_function_initplans.sql
20261012161544_manager_edit_record_column_allowlist.sql
20261012190000_security_definer_rpc_hardening.sql
20261012193000_secure_crm_security_definer_rpcs.sql
20261012200000_security_definer_full_audit_hardening.sql
20261012201500_enforce_plan_resource_limits.sql
20261012203000_revoke_unused_security_definer_rpc_exposure.sql
20261017120000_scope_is_active_user_policies.sql
20261017121000_scope_activity_logs_policies_authenticated.sql
20261017122000_properties_owner_id_index.sql
20261017190000_property_file_triage.sql
20261017200000_import_batch_market_rollback.sql
20261019180000_import_raw_rows_manager_delete.sql
20261108153053_consolidate_rls_policies_and_centralize_role_checks.sql
20261108153251_set_shared_role_helper_security_invoker.sql
20261108153357_centralize_construction_project_role_predicates.sql
20261108160000_construction_project_role_shares.sql
```

## New on 2026-11-08 (unapplied)
These four files exist only on Git `main` at the time of this inventory. They must not be applied until parity work is complete and Product Owner / architecture review authorizes them:

1. `20261108153053_consolidate_rls_policies_and_centralize_role_checks.sql`
2. `20261108153251_set_shared_role_helper_security_invoker.sql`
3. `20261108153357_centralize_construction_project_role_predicates.sql`
4. `20261108160000_construction_project_role_shares.sql`

## Next required steps for parity (not done in this commit)
1. Pull current live `schema_migrations` (or equivalent) version list from Supabase project `beuestoewletjsgmigmf`.
2. Diff against the 51 filenames above + Git history for renamed/squashed entries.
3. For every live entry that has no matching current filename, recover the original SQL from Git history or a verified dump and document the mapping.
4. Only after a complete map exists may any new migration be considered for application.

## Related canonical files
- `.agent-control/STATE.md`
- `.agent-control/FINAL-ARCHITECTURE-RECOMMENDATION.md` (108 live records as of 2026-11-03)
- `.agent-control/TASK-QUEUE.yaml` → AUDIT-000-reconcile-baseline
- `BUILDWISE-SINGLE-SOURCE-OF-TRUTH.md`
