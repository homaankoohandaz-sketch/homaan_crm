# Agent Control State

status: SECURITY-601-608 AUDITED | 601-603 LIVE VERIFIED | 604-605 BLOCKED | 606-607 PARTIAL | 608 TEST WIRED
project: BuildWise AI
branch: buildwise-implementation
active_task: checklist-601-608
last_batch: 601-608
## Security 601-608
- 599-600 were not reopened.
- 601 AI Data Permissions: implemented and live verified; actor/manager RLS boundaries confirmed.
- 602 Agent Tool Permissions: implemented and live verified; manager-only policy confirmed.
- 603 Production Action Approval: implemented and live verified; requester/pending + manager approval boundaries confirmed.
- 604 Secret Management: BLOCKED; live Telegram webhook still contains a hard-coded secret. Rotation/deployment requires explicit human approval.
- 605 Webhook Secret Remediation: BLOCKED for the same controlled secret migration and webhook verification.
- 606 Security Advisor Cleanup: PARTIAL; live advisor still reports telegram_sessions fail-closed RLS-without-policy, 21 authenticated-executable SECURITY DEFINER functions, and leaked-password protection disabled.
- 607 SECURITY DEFINER Review: PARTIAL; live inventory verified; no blanket revoke performed because function-by-function intent/authorization must be reviewed.
- 608 Permission Regression Tests: focused test added and wired into npm test; full repository runtime remains unavailable here.
- Evidence: .agent-control/SECURITY-601-608.md

branch: buildwise-implementation
active_task: checklist-601-608
last_batch: 599-600
## Batch 493-500 — Project Presentation Views
- Added canonical `src/ui/project-views-493-500.js`; no duplicate project-control engine created.
- 493 Gantt UI: normalized existing project_schedule_tasks data.
- 494 KPI Dashboard UI: reused canonical project_kpi_catalog.
- 495 Procurement Calendar UI: reused canonical project_procurement.