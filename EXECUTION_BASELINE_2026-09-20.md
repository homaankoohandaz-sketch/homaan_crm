# BuildWise AI — Execution Baseline Audit
Date: 2026-09-20
Branch: buildwise-implementation
Repository: homaankoohandaz-sketch/homaan_crm
Status: AUDIT-IN-PROGRESS

## Actions completed in this run
- Verified GitHub connection for homaankoohandaz-sketch with admin/maintain/push permissions.
- Fast-forwarded buildwise-implementation to the current main commit so implementation work is not based on the stale pre-agent-stack branch.
- Verified the 21-specialist BuildWise control-plane specification is present.
- Queried the live Supabase project and its current Edge Functions.
- Queried Supabase security/performance advisors.
- Verified Netlify has an existing buildwise-ai-h site, but the project remains a legacy/diagnostic deployment path.
- Verified the Codex Tasks runtime is currently unavailable to this session because authentication is missing.

## Current live backend facts
Supabase project: beuestoewletjsgmigmf
Status: ACTIVE_HEALTHY
Database: PostgreSQL 17

Current public schema includes CRM, matching, market/valuation, construction/project-control, AI audit, public request, promotion and security tables. Representative live tables include:
- owners, properties, leads, deals, tasks, appointments
- crm_people, crm_requests, crm_alerts, ai_actions
- construction_projects, project_scenarios
- project_phases, project_wbs, project_milestones, project_schedule_tasks
- project_boq_items, project_commitments, project_change_orders, project_procurement
- project_payments, project_daily_logs, project_quality_checks
- project_risks, project_rfis, project_submittals, project_site_observations
- project_progress_snapshots, project_documents, project_resources
- ai_audit_events, learning_events, market/valuation tables
- public_requests, request_agent_routes, promotions, security_events

Live Edge Functions verified ACTIVE:
- property-bank
- telegram-bot
- app
- storage-setup
- ai-orchestrator
- media-ai
- google-sheets-sync
- crm-data-agent
- public-request
- buildwise-app

## Important implementation finding
The current ai-orchestrator is an operational CRM AI gateway, not yet the complete BuildWise multi-agent operating layer. Its current tool surface is concentrated around property search, identity checks, buyer-request creation with confirmation, and chat. The full specialist-agent tool registry described in the frozen specification is not yet live.

The buildwise-app Edge Function is currently serving a bundled/static frontend asset package. This is useful as a delivery mechanism, but it does not by itself prove end-to-end functionality of the underlying product workflows.

## Release / QA findings
- The repository contains CI/QA workflow definitions, but no workflow runs are currently recorded for buildwise-implementation.
- Supabase security advisor currently reports one RLS-enabled table with no policies (telegram_sessions, intentionally fail-closed according to release notes) and multiple SECURITY DEFINER functions executable by authenticated users. These require explicit review before production hardening.
- Supabase performance advisor reports multiple permissive-policy and unused-index findings. These are not automatically production blockers, but require profiling and cleanup.
- A security-sensitive Telegram webhook secret is present in deployed function source rather than being cleanly managed as a provider secret. This is a P0 security-hardening item; do not rotate/change it automatically without the required human approval gate.

## Runtime blocker
Codex Tasks currently returns UNAUTHORIZED because no authenticated Codex execution environment is connected to this ChatGPT session. Therefore autonomous implementation workers cannot honestly be marked operational yet.

## Next executable sequence
1. Authenticate/register one Codex worker runtime.
2. Run documentation-only handoff.
3. Run read-only repository audit.
4. Run read-only application smoke audit.
5. Run one tiny isolated non-production implementation.
6. Review with QA/security.
7. Only then enable broader specialist execution.
