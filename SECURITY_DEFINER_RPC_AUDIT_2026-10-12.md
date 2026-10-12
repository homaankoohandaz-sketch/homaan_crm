# BuildWise SECURITY DEFINER RPC Audit — 2026-10-12

Project: Supabase `beuestoewletjsgmigmf`  
Repository branch: `buildwise-implementation`

## Function-by-function usage review

| Function | Current caller / usage found | Decision |
|---|---|---|
| `buildwise_ai_control_scan` | No caller in the currently loaded app bundle or deployed `ai-orchestrator` | Project owner/manager guard retained; direct authenticated RPC revoked |
| `buildwise_check_limit` | Internal dependency of `buildwise_consume`; no direct UI caller | Direct authenticated RPC revoked |
| `buildwise_consume` | Deployed `ai-orchestrator`, before every OpenAI Responses call | Atomic quota update; denied requests return quota-exceeded |
| `buildwise_plan_status` | No caller in currently loaded app files | Active-user guard retained; direct authenticated RPC revoked |
| `buildwise_project_dashboard` | Referenced by `src/ui/project-views-493-500.js`, which is not loaded by current `index.html` | Project owner/manager guard retained; direct authenticated RPC revoked until UI integration |
| `can_write` | RLS policies across CRM, project and workflow tables | Kept executable as a policy helper |
| `crm_deal_radar` | Documentation only; no active caller found | Active-user guard retained; direct authenticated RPC revoked |
| `crm_manager_phone` | No active UI caller found; intended manager-only phone access path | Manager guard retained; callable only through authenticated guarded RPC |
| `crm_market_value` | Documentation only; no active caller found | Active-user guard retained; direct authenticated RPC revoked |
| `crm_match_score` | Internal dependency of `crm_run_matching`; no active UI caller | Request owner/assignee/manager guard retained; direct authenticated RPC revoked |
| `crm_phone_exists` | Deployed `ai-orchestrator` identity check, via caller JWT | Returns only `exists`; only owner/admin/manager/staff may call |
| `crm_record_learning` | No active caller found | Write-role, entity-type, reward-range and payload-size checks; direct authenticated RPC revoked |
| `crm_register_phone` | Deployed `ai-orchestrator` when creating a CRM request | Creator-scoped for non-staff; duplicate detection; fixed generated-column write error |
| `crm_run_matching` | No active UI caller; internal matcher endpoint | Request ownership guard retained; direct authenticated RPC revoked |
| `crm_schedule_conflict` | No active caller found | Assignee/lead scope checks and time-range validation; direct authenticated RPC revoked |
| `is_active_user` | RLS policies | Kept executable as a policy helper |
| `is_manager_user` | Active app bundle and RLS policies | Kept; checks current active role |
| `is_owner` | RLS policies | Kept executable as a policy helper |
| `manager_bulk_delete_properties` | Active `buildwise-app.js` bulk-delete UI | Manager-only; empty/null IDs rejected; maximum 500 IDs |
| `manager_delete_ui_module` | Active app module-governance UI | Manager-only |
| `manager_edit_record` | Active app's public-request edit UI | Manager-only; table allowlist includes `public_requests`; protected columns blocked; before/after audit logged |
| `manager_edit_ui_module` | Active app module-governance UI | Manager-only |
| `my_role` | Internal dependency of `crm_phone_exists`; no direct UI caller | Direct authenticated RPC revoked |
| `reos_sync_property_graph` | Loaded `src/domains/intelligence/graph.js` | Manager guard retained |
| `rollback_import_batch` | Loaded `src/domains/crm/data-import.js` | Manager-only; batch locked and rollback made idempotent |

## Fixes applied

- Added active-user plus project-owner/manager authorization to project dashboard and AI control scan.
- Added request owner/assignee/manager authorization to matching and score functions.
- Removed identity lookup responses containing person IDs, names, status, or match counts; the Edge Function now calls the boolean-only RPC using the caller JWT and gates the tool to trusted roles.
- Fixed phone registration to respect the generated `phone_hash` column; a rollback-only runtime test succeeded.
- Added strict table/column checks and row locking to the generic manager editor; preserved the active `public_requests` editor path.
- Bounded bulk property deletion and made import rollback lock the batch and return safely on repeated rollback.
- Made monthly quota consumption atomic and fail-closed for unconfigured features.
- Enforced `max_properties`, `max_leads`, and `max_projects` in database triggers; authenticated inserts cannot spoof or omit `created_by` to bypass quotas. Per-user advisory locks serialize concurrent inserts.
- Added server-side `max_ai_requests` consumption before each model call; quota exhaustion returns HTTP 429.
- Restored the complete app bundle in `buildwise-app.js` on `buildwise-implementation` instead of a remote-fetch stub, and added task access to the role navigation. This is not yet on production Netlify because its production branch is `main`.
- Revoked direct authenticated execution for 11 RPCs with no active caller; internal SECURITY DEFINER dependencies still work under the function owner.

## Verification

- Production SQL runtime: project dashboard returned the expected project JSON.
- Phone existence RPC returned a boolean-only result.
- Schedule-conflict RPC returned a scoped conflict result.
- Quota overflow test was denied; usage stayed at zero.
- Phone-registration test completed successfully inside a rollback-only transaction; no test person remained.
- Resource quota tests rejected a spoofed `created_by` and a null creator at a zero limit; test rows were absent and the configured limit remained unchanged.
- GitHub Actions: Application Validation, BuildWise QA, Migration Gate, Phase Code Map, Agent Control Plane Validation and Unit Tests passed on commit `09c75c2738bda58926bf0056294792bbf0d971f2`.

## Remaining explicit findings

- Supabase's generic advisor still reports 14 authenticated-callable SECURITY DEFINER functions. These are the RLS helpers and guarded RPCs still needed by the active app/Edge Function; the advisor does not evaluate the authorization guards.
- Supabase separately reports leaked-password protection disabled. This is an Auth dashboard setting and cannot be changed through the available Supabase database/Edge Function tools.
- `crm_manager_phone` is protected but has no active UI caller; manager phone display should be wired to this RPC if the current UI must reveal phone numbers to managers.
- Production Netlify is still on `main` commit `3f17befc09578db7df59be8c10c035bb0908097d`. PR #16 contains 135 commits; merging it would release a much larger change set, so it was not merged without the production-release gate.
