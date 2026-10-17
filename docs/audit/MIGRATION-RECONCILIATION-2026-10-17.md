# Migration reconciliation audit — 2026-10-17

## Scope and safety

- Repository: `homaankoohandaz-sketch/homaan_crm`
- Target branch: `buildwise-implementation`
- Branch head inspected: `06e9454d41c65331c28a6e83b25b4594e7f600e7`
- Supabase project ref: `beuestoewletjsgmigmf`
- Live migration records: 106
- Repository SQL migration files: 42
- This is a read-only reconciliation. No SQL migration was applied and no Supabase migration history was edited.
- The repository Git tree was not truncated.

## Executive result

- Exact timestamp/version matches between repository filenames and live history: **7**.
- Repository SQL files with no exact live version: **35**.
- Live migration records with no same-version SQL file on the target branch: **99**.
- Content equivalence: **not proven**. Supabase migration history returns version/name metadata, not the original SQL body. A matching version is not proof of identical SQL.
- Required security migration: live version `20261017044414`, live name `scope_is_active_user_policies_20261017`; its historical SQL file was not found by path-based GitHub history lookup. The proposed `20261017120000_scope_is_active_user_policies.sql` is a separate source file and must not be treated as equivalent.
- Current decision: **do not run the proposed migration and do not edit live history**.

## Per-file repository inventory

Status definitions:
- `VERSION_MATCH_CONTENT_UNVERIFIED`: timestamp matches a live migration version; SQL content still requires independent comparison.
- `NO_EXACT_LIVE_VERSION`: no exact timestamp match. This does not by itself prove the SQL change is absent from production; it could have been applied under another version or be absent.

| Repository migration file | Version | Status | Live history name (if exact version found) |
|---|---|---|---|
| `supabase/migrations/20260917150000_google_sheets_market_sync.sql` | 20260917150000 | NO_EXACT_LIVE_VERSION | — |
| `supabase/migrations/20260919_release_hardening.sql` | **NO 14-digit version** | NO_EXACT_LIVE_VERSION | — |
| `supabase/migrations/20260923160714_advisor_followups_security_reports.sql` | 20260923160714 | VERSION_MATCH_CONTENT_UNVERIFIED | 20260923_advisor_followups_security_reports |
| `supabase/migrations/20260926160000_customer_end_to_end_flow.sql` | 20260926160000 | NO_EXACT_LIVE_VERSION | — |
| `supabase/migrations/20260927210000_task_engine_persistence.sql` | 20260927210000 | NO_EXACT_LIVE_VERSION | — |
| `supabase/migrations/20260927_provision_advisor_role_on_signup.sql` | **NO 14-digit version** | NO_EXACT_LIVE_VERSION | — |
| `supabase/migrations/20260930145935_project_control_procurement_141_160.sql` | 20260930145935 | VERSION_MATCH_CONTENT_UNVERIFIED | project_control_procurement_141_160 |
| `supabase/migrations/20260930151310_project_accounting_201_220.sql` | 20260930151310 | VERSION_MATCH_CONTENT_UNVERIFIED | project_accounting_201_220 |
| `supabase/migrations/20260930170000_project_accounting_191_200.sql` | 20260930170000 | NO_EXACT_LIVE_VERSION | — |
| `supabase/migrations/20260930171000_ai_change_approval_188.sql` | 20260930171000 | NO_EXACT_LIVE_VERSION | — |
| `supabase/migrations/20260930182000_project_accounting_221_235.sql` | 20260930182000 | NO_EXACT_LIVE_VERSION | — |
| `supabase/migrations/20260930190000_project_kpi_324_342.sql` | 20260930190000 | NO_EXACT_LIVE_VERSION | — |
| `supabase/migrations/20260930193000_workflow_engine_343_367.sql` | 20260930193000 | NO_EXACT_LIVE_VERSION | — |
| `supabase/migrations/20260930195000_deal_control_368_376.sql` | 20260930195000 | NO_EXACT_LIVE_VERSION | — |
| `supabase/migrations/20261001130000_contract_control_377_385.sql` | 20261001130000 | NO_EXACT_LIVE_VERSION | — |
| `supabase/migrations/20261001140000_advisor_operations_386_400.sql` | 20261001140000 | NO_EXACT_LIVE_VERSION | — |
| `supabase/migrations/20261001150000_customer_experience_406_415.sql` | 20261001150000 | NO_EXACT_LIVE_VERSION | — |
| `supabase/migrations/20261001160000_ai_intelligence_425_430.sql` | 20261001160000 | NO_EXACT_LIVE_VERSION | — |
| `supabase/migrations/20261002133000_security_governance_591_608.sql` | 20261002133000 | NO_EXACT_LIVE_VERSION | — |
| `supabase/migrations/20261002134000_security_governance_591_608_rpc_revoke.sql` | 20261002134000 | NO_EXACT_LIVE_VERSION | — |
| `supabase/migrations/20261002134500_security_hardening_599_600.sql` | 20261002134500 | NO_EXACT_LIVE_VERSION | — |
| `supabase/migrations/20261002141000_security_governance_598_603.sql` | 20261002141000 | NO_EXACT_LIVE_VERSION | — |
| `supabase/migrations/20261002143000_security_governance_601.sql` | 20261002143000 | NO_EXACT_LIVE_VERSION | — |
| `supabase/migrations/20261002163000_security_606_telegram_sessions_deny.sql` | 20261002163000 | NO_EXACT_LIVE_VERSION | — |
| `supabase/migrations/20261002230000_customer_experience_c01_c40.sql` | 20261002230000 | NO_EXACT_LIVE_VERSION | — |
| `supabase/migrations/20261002233000_crm_import_quality_060_065.sql` | 20261002233000 | NO_EXACT_LIVE_VERSION | — |
| `supabase/migrations/20261004120000_task_engine_audit_log.sql` | 20261004120000 | NO_EXACT_LIVE_VERSION | — |
| `supabase/migrations/20261006170000_project_hse_corrective_actions.sql` | 20261006170000 | NO_EXACT_LIVE_VERSION | — |
| `supabase/migrations/20261006170001_task_engine_permissions.sql` | 20261006170001 | NO_EXACT_LIVE_VERSION | — |
| `supabase/migrations/20261006170002_task_engine_rls_scope.sql` | 20261006170002 | NO_EXACT_LIVE_VERSION | — |
| `supabase/migrations/20261006170003_task_engine_delegation.sql` | 20261006170003 | NO_EXACT_LIVE_VERSION | — |
| `supabase/migrations/20261006170004_task_engine_function_execute_hardening.sql` | 20261006170004 | VERSION_MATCH_CONTENT_UNVERIFIED | task_engine_permissions |
| `supabase/migrations/20261006231500_production_ui_governance.sql` | 20261006231500 | NO_EXACT_LIVE_VERSION | — |
| `supabase/migrations/20261012161148_performance_security_baseline.sql` | 20261012161148 | VERSION_MATCH_CONTENT_UNVERIFIED | performance_security_baseline_20261012220000 |
| `supabase/migrations/20261012161339_optimize_rls_auth_function_initplans.sql` | 20261012161339 | VERSION_MATCH_CONTENT_UNVERIFIED | optimize_rls_auth_function_initplans |
| `supabase/migrations/20261012161544_manager_edit_record_column_allowlist.sql` | 20261012161544 | VERSION_MATCH_CONTENT_UNVERIFIED | manager_edit_record_column_allowlist |
| `supabase/migrations/20261012190000_security_definer_rpc_hardening.sql` | 20261012190000 | NO_EXACT_LIVE_VERSION | — |
| `supabase/migrations/20261012193000_secure_crm_security_definer_rpcs.sql` | 20261012193000 | NO_EXACT_LIVE_VERSION | — |
| `supabase/migrations/20261012200000_security_definer_full_audit_hardening.sql` | 20261012200000 | NO_EXACT_LIVE_VERSION | — |
| `supabase/migrations/20261012201500_enforce_plan_resource_limits.sql` | 20261012201500 | NO_EXACT_LIVE_VERSION | — |
| `supabase/migrations/20261012203000_revoke_unused_security_definer_rpc_exposure.sql` | 20261012203000 | NO_EXACT_LIVE_VERSION | — |
| `supabase/migrations/20261017120000_scope_is_active_user_policies.sql` | 20261017120000 | NO_EXACT_LIVE_VERSION | — |

## Per-record live inventory

| Live version | Live name | Same-version repository file | Status |
|---|---|---|---|
| 20260830154536 | `v2_mobile_property_bank_security` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260830154605 | `v2_bulk_import_and_auth_helpers` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260830154725 | `v2_security_hardening` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260830154749 | `v2_mobile_image_storage` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260830161534 | `property_bank_runtime_fix_v2` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260830175304 | `property_bank_v4_foundation` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260830175316 | `property_bank_v4_first_user_and_auth` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260830175709 | `property_bank_security_v5_1` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260830204819 | `consolidate_roles_hierarchy_and_full_crm` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260830204903 | `security_cleanup_legacy_functions` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260830204920 | `restrict_direct_rpc_on_internal_helpers` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260830204934 | `fix_rls_helper_function_grants` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260830205557 | `fix_property_bank_roles_and_indexes` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260831080950 | `fix_existing_owner_account` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260831100313 | `add_email_based_pre_invite` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260831152838 | `add_tasks_calendar_types_and_mandatory_lead_fields` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260831220916 | `telegram_bot_infra` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260908091411 | `reset_owner_password_again` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260908091557 | `cleanup_owner_account_for_fresh_signup` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260908091749 | `confirm_owner_email_manually` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260908091847 | `reset_password_for_new_owner_account` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260908092533 | `reset_to_simple_password` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260910042546 | `auto_confirm_email_on_signup` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260910042617 | `expand_properties_fields_from_real_excel` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260910042706 | `restricted_properties_view_for_viewers` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260910042725 | `add_owner_name_column` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260910042840 | `fix_restricted_view_rent_detection` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260913155033 | `add_user_report_restriction_feature` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260913155127 | `allow_staff_view_colleagues_for_reporting` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260915102925 | `crm_ai_core_and_security_layer` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260915103018 | `crm_identity_registration_rpc` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260915103125 | `lock_sensitive_property_views` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260915103144 | `tighten_new_crm_api_grants` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260915103159 | `remove_public_inheritance_on_sensitive_api` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260916033841 | `secure_crm_register_phone` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260916033909 | `crm_safe_lead_owner_views` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260916152330 | `phase_04_11_intelligence_engine` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260916170321 | `buildwise_ai_plan_limit_engine` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260916170504 | `buildwise_project_control_foundation` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260916170534 | `buildwise_project_control_rls` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260916171153 | `buildwise_ai_first_control` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260916183422 | `fix_function_search_path_mutable` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260917125828 | `analysis_engines` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260917184049 | `google_sheets_market_sync` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260918035814 | `revoke_anon_execute_on_internal_rpcs` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260918035834 | `revoke_public_grant_authenticated_only_rpcs` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260918055158 | `gate01_security_public_request_promotion` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260918055311 | `public_request_rls_and_audit_policies` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260918055344 | `revoke_remaining_anon_manager_rpc` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260918145707 | `20260918190000_public_requests_staff_access` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260919105432 | `release_hardening_20260919` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260919105456 | `revoke_public_execute_manager_helper` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260920074239 | `p0_restrict_write_rpcs_to_writers` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260923155757 | `preserve_full_excel_sheet_data` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260923160714 | `20260923_advisor_followups_security_reports` | `supabase/migrations/20260923160714_advisor_followups_security_reports.sql` | VERSION_MATCH_CONTENT_UNVERIFIED |
| 20260923161959 | `20260923_request_routing_promotion_governance_ai_fields` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260923162915 | `20260923_homaan_ai_workspaces_manager_edit_engine` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260923163118 | `20260923_manager_edit_all_operational_tables` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260923230203 | `reos_graph_core` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260923230304 | `reos_graph_property_sync` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260924153221 | `project_result_layer_20260924` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260924153250 | `project_result_security_hardening_20260924` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260925203123 | `project_hierarchy` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260926124851 | `customer_end_to_end_flow` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260927175630 | `provision_advisor_role_on_signup` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260930145935 | `project_control_procurement_141_160` | `supabase/migrations/20260930145935_project_control_procurement_141_160.sql` | VERSION_MATCH_CONTENT_UNVERIFIED |
| 20260930151310 | `project_accounting_201_220` | `supabase/migrations/20260930151310_project_accounting_201_220.sql` | VERSION_MATCH_CONTENT_UNVERIFIED |
| 20260930151704 | `project_accounting_221_235` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260930152158 | `real_estate_cost_price_236_264` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260930152721 | `sales_engine_265_293` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260930153041 | `project_documents_kpi_294_323_v4` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260930153524 | `project_kpi_324_342` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260930154050 | `workflow_engine_343_367` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20260930154353 | `deal_control_368_376` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20261002100633 | `security_governance_591_608` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20261002100659 | `security_governance_591_608_rpc_revoke` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20261002100924 | `security_governance_598_603` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20261002101037 | `security_governance_601` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20261002101844 | `security_hardening_599_600` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20261006165739 | `project_hse_corrective_actions_20261006` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20261006165952 | `task_engine_persistence_live` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20261006170004 | `task_engine_permissions` | `supabase/migrations/20261006170004_task_engine_function_execute_hardening.sql` | VERSION_MATCH_CONTENT_UNVERIFIED |
| 20261006170045 | `task_engine_rls_scope` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20261006170213 | `task_engine_delegation_field` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20261006170337 | `task_engine_function_execute_hardening` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20261006170424 | `task_engine_function_public_execute_hardening` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20261006202958 | `20261006230000_crm_import_quality_runtime` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20261006203132 | `20261006231500_production_ui_governance` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20261012151436 | `secure_security_definer_project_and_crm_access` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20261012152511 | `security_definer_quota_rpc_hardening` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20261012152840 | `secure_crm_security_definer_rpcs` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20261012153023 | `harden_remaining_rpc_privacy_limits_and_manager_mutations` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20261012153059 | `fix_dynamic_editor_and_atomic_quota_edge_cases` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20261012153157 | `align_phone_registration_with_creator_authorization` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20261012153658 | `fix_extension_qualified_phone_hash_functions` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20261012153714 | `correct_phone_hash_schema_qualification` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20261012154516 | `enforce_plan_resource_limits_on_insert` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20261012154538 | `prevent_resource_quota_creator_spoofing` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20261012154757 | `allowlisted_public_request_manager_edit` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20261012155026 | `revoke_unused_security_definer_rpc_exposure` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20261012155239 | `fix_generated_phone_hash_registration` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20261012155442 | `bind_resource_quota_rows_to_authenticated_creator` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |
| 20261012161148 | `performance_security_baseline_20261012220000` | `supabase/migrations/20261012161148_performance_security_baseline.sql` | VERSION_MATCH_CONTENT_UNVERIFIED |
| 20261012161339 | `optimize_rls_auth_function_initplans` | `supabase/migrations/20261012161339_optimize_rls_auth_function_initplans.sql` | VERSION_MATCH_CONTENT_UNVERIFIED |
| 20261012161544 | `manager_edit_record_column_allowlist` | `supabase/migrations/20261012161544_manager_edit_record_column_allowlist.sql` | VERSION_MATCH_CONTENT_UNVERIFIED |
| 20261017044414 | `scope_is_active_user_policies_20261017` | — | NO_SAME_VERSION_SOURCE_ON_BRANCH |

## Security migration provenance

The target branch contains:
- `supabase/migrations/20261017120000_scope_is_active_user_policies.sql`
- `tests/unit/is-active-user-public-rls.test.mjs`
- `.agent-control/PUBLIC-RLS-IS-ACTIVE-USER-AUDIT-2026-10-17.md`

GitHub path history lookup for `supabase/migrations/20261017044414_scope_is_active_user_policies_20261017.sql` returned no commits. This only establishes that the exact path has no matching commit history in the accessible GitHub API response; it does not prove that the SQL cannot be recovered from another branch, an archived artifact, or a backup. Keep the status **content unverified** until the original SQL or a verifiable equivalent is recovered.

## Test and runtime evidence

- GitHub Actions unit test run `39003676095`: `npm test` completed successfully.
- GitHub Actions migration gate run `39003676096`: filename/duplicate-version validation succeeded; production migration preview was skipped by its manual/secret gate.
- These CI results are not live integration tests.
- Live Edge Functions were discovered as active: `public-request` version 4 (`verify_jwt=false`) and `customer-portal` version 3 (`verify_jwt=false`).
- The deployed `public-request` implementation uses a service-role client and inserts into `public_requests` only after validating `phone` and `request_type`; a valid POST creates production data. It was not submitted during this audit.
- The deployed `customer-portal` uses a service-role client. A valid share GET can update share status from `sent` to `viewed`; a valid POST inserts a customer response, updates the share and creates an alert. No valid test-share token was available, so these write paths were not exercised.
- The available tools do not provide a safe authenticated/anonymous HTTP integration harness with test identities. No test users or production records were created. A staging Supabase branch was not created because it can incur usage charges and would need a cost-confirmed workflow.

## Required follow-up before release approval

1. Recover original SQL for live version `20261017044414` from the migration artifact/CI release bundle or an authoritative database backup; verify by content hash and semantic diff.
2. For each `NO_EXACT_LIVE_VERSION` row, establish whether it was applied under a different timestamp/name using migration artifacts, commit history, and schema/function/policy evidence. Do not automatically apply the unmatched files.
3. In a staging environment, run the unit suite and integration tests for anon and authenticated roles. Use a dedicated test share and test request payload; assert no unrelated records are modified.
4. Record the test results and exact deployed function versions; only then decide whether a new corrective migration is needed.
5. Keep production unchanged until a reviewed, tested corrective plan is approved.

## Evidence references

- Target commit: https://github.com/homaankoohandaz-sketch/homaan_crm/commit/06e9454d41c65331c28a6e83b25b4594e7f600e7
- Proposed migration: https://github.com/homaankoohandaz-sketch/homaan_crm/blob/buildwise-implementation/supabase/migrations/20261017120000_scope_is_active_user_policies.sql
- Static test: https://github.com/homaankoohandaz-sketch/homaan_crm/blob/buildwise-implementation/tests/unit/is-active-user-public-rls.test.mjs
- Audit note: https://github.com/homaankoohandaz-sketch/homaan_crm/blob/buildwise-implementation/.agent-control/PUBLIC-RLS-IS-ACTIVE-USER-AUDIT-2026-10-17.md
- Unit workflow: https://github.com/homaankoohandaz-sketch/homaan_crm/actions/runs/39003676095
- Migration gate workflow: https://github.com/homaankoohandaz-sketch/homaan_crm/actions/runs/39003676096
