# SECURITY DEFINER Review — 2026-10-12

## Runtime snapshot

Supabase Security Advisor reported 25 functions in `public` that are both SECURITY DEFINER and executable by `authenticated`, with zero matching functions executable by `anon` in this finding. This is an execution-surface warning, not proof that all 25 functions are exploitable.

The advisor still reports 25 after this remediation because intentionally exposed authenticated RPCs remain SECURITY DEFINER. The goal is to close authorization/data-exposure flaws without breaking legitimate CRM operations or RLS policy helpers.

## Changes applied to live Supabase

### Migration: `security_definer_quota_rpc_hardening`
- `buildwise_check_limit(text,bigint)`: rejects negative/null amounts, requires an active account, rejects empty feature keys, uses an empty search_path, and defaults absent monthly usage rows to zero.
- `buildwise_consume(text,bigint)`: rejects zero/negative/null consumption amounts, requires an active account, uses an empty search_path, and has explicit authenticated-only grants.
- `buildwise_plan_status()`: requires an active account, uses an empty search_path, and has explicit authenticated-only grants.
- Negative amounts previously could reduce `plan_usage_monthly.used_count` through `buildwise_consume`; this path is now rejected.

### Migration: `secure_crm_security_definer_rpcs`
- `crm_phone_exists(text)`: limits phone-existence/person-id lookup to active owner/admin/manager/staff roles; rejects blank phone input; uses an empty search_path and schema-qualified pgcrypto digest.
- `crm_schedule_conflict(...)`: rejects invalid time ranges; managers can inspect selected/all schedules, while non-managers only receive conflict results for appointments they created.

## Verification

- Both migrations applied successfully to the connected Supabase project.
- Live SQL checks passed for negative quota amount rejection, inactive-account rejection, unauthorized phone lookup rejection, and invalid schedule-range rejection.
- Live ACL checks confirm the five functions remain executable by authenticated users for their intended RPC contracts and are not executable by anon.
- GitHub commit: `c6a138f26fbd72e02eae35df052bae2538ad1515` (security test updates included).
- CI migration gate and QA passed for the reviewed commit sequence. Unit tests currently fail earlier in the existing chain at `tests/advisor-signup.test.js` because it expects advisor-signup copy inside `buildwise-app.js`, while that file is currently a loader for an external bundle. Application Validation also fails at `tests/release-smoke.mjs` because the loader no longer contains the `supabase.createClient` marker. These failures are not caused by the SQL migrations and must be fixed separately before claiming the full suite passes.

## Remaining 20-function review

The remaining SECURITY DEFINER functions must not be blanket-revoked. Each has to be checked against direct frontend RPC use, RLS policy dependencies, and data visibility contracts.

| Function | Current disposition / next check |
|---|---|
| `buildwise_ai_control_scan(bigint)` | Retain pending review; live definition checks active user and project creator/manager authorization. Test project isolation. |
| `buildwise_project_dashboard(bigint)` | Retain pending review; live definition checks active user and project creator/manager authorization. Test project isolation. |
| `can_write()` | Authorization helper; likely used by policies/RPCs. Remove direct API exposure only after migrating dependent policies/callers. |
| `crm_deal_radar()` | Review whether all active users should see all open deal-radar rows; scope by assignment/role if needed. |
| `crm_manager_phone(bigint)` | Manager-gated; test non-manager gets NULL and manager gets only intended person record. |
| `crm_market_value(bigint)` | Active-user-gated; confirm property visibility rules and handle unknown property IDs explicitly. |
| `crm_match_score(bigint,bigint)` | Request ownership/assignment is checked; confirm property-level access and request/property relationship. |
| `crm_record_learning(...)` | Actor-bound write; validate event/entity types and prevent oversized or sensitive payloads. |
| `crm_register_phone(bigint,text)` | Owner/staff gate exists; test duplicate handling, identity-event audit, and role isolation. |
| `crm_run_matching(bigint,integer)` | Request ownership/assignment is checked; bound p_limit and ensure returned match rows are request-scoped. |
| `is_active_user()` | Helper reveals only caller's own active status; check RLS-policy dependencies before changing grants/schema. |
| `is_manager_user()` | Helper reveals only caller's own manager status; check RLS-policy dependencies before changing grants/schema. |
| `is_owner()` | Helper reveals only caller's own owner status; check RLS-policy dependencies before changing grants/schema. |
| `manager_bulk_delete_properties(bigint[])` | Manager-gated; add bounded batch size and audit/confirmation contract; verify referential effects. |
| `manager_delete_ui_module(text)` | Manager-gated; soft delete. Test immutable/system-critical module protection. |
| `manager_edit_record(text,text,jsonb,text)` | Manager-gated dynamic update; highest-priority remaining review: replace broad table access with an explicit table/column allowlist. |
| `manager_edit_ui_module(text,text,text,boolean,integer)` | Manager-gated; test protected module IDs and input lengths. |
| `my_role()` | Caller-only role lookup; check RLS-policy/client dependencies before changing grants/schema. |
| `reos_sync_property_graph(integer)` | Manager-gated and limit-bounded; verify graph writes cannot cross intended tenancy boundaries. |
| `rollback_import_batch(text)` | Manager-gated destructive rollback; test batch ownership, row counts, and audit trail. |

## Other outstanding security finding

Supabase Auth reports leaked-password protection disabled. This is a separate Auth dashboard configuration task and is not fixed by these SQL migrations.

## Status

- Quota amount bypass: FIXED + live SQL verified.
- Inactive-account access to plan RPCs: FIXED + live SQL verified.
- Phone identity enumeration by untrusted roles: RESTRICTED + live SQL verified.
- Cross-user schedule conflict probing: RESTRICTED + live SQL verified.
- All 25 advisor warnings: NOT CLEARED; function-by-function disposition and remaining remediation are tracked above.
- Full CI/runtime acceptance: NOT DONE because existing JavaScript validation failures remain.
