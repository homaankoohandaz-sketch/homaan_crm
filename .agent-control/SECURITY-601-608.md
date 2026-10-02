# SECURITY 601–608 — Execution Record

Date: 2026-10-02
Branch: buildwise-implementation
Rule: 599–600 are closed and are not reopened.

## 601 AI Data Permissions — PASS / LIVE VERIFIED
- AI audit-event access is manager-or-actor scoped.
- AI audit inserts require an active authenticated actor matching `auth.uid()`.
- AI alerts are authenticated-user readable and mutation-scoped to manager/assignee.
- AI change approvals require an active requester matching `auth.uid()` and initial status `pending`.
- Live Supabase verification confirms the relevant tables and policies exist.

## 602 Agent Tool Permissions — PASS / LIVE VERIFIED
- `agent_tool_permissions` exists.
- RLS policy is manager-only.
- `allowed`, `requires_approval`, environment and allowed-role boundaries are persisted.

## 603 Production Action Approval — PASS / LIVE VERIFIED
- `production_action_approvals` exists.
- New requests are restricted to the authenticated requester and `pending` status.
- Approval/update is manager-gated.
- Production/irreversible actions remain human approval gates.

## 604 Secret Management — BLOCKED
- Current live Telegram implementation still contains a hard-coded webhook secret.
- Do not rotate or deploy a replacement automatically.
- Required next action: move the value to a provider secret/environment variable, then deploy and verify.

## 605 Webhook Secret Remediation — BLOCKED
- Current live `telegram-bot` function is still using the hard-coded webhook secret.
- Required next action is the same controlled secret migration as 604, followed by webhook verification.

## 606 Security Advisor Cleanup — PARTIAL
Live security advisor still reports:
- 1 RLS-enabled table without policy: `public.telegram_sessions` (documented fail-closed design).
- 21 authenticated-executable SECURITY DEFINER functions.
- Leaked-password protection disabled.
No blanket revoke was performed because several SECURITY DEFINER functions are intentional application RPCs and require function-by-function review.

## 607 SECURITY DEFINER Review — PARTIAL
- Inventory verified live.
- Authenticated execution remains on 21 SECURITY DEFINER functions.
- Some are intentionally used by CRM/project operations; others are internal helpers already revoked.
- Function-by-function authorization review is still required before further grants/revokes.

## 608 Permission Regression Tests — PASS (STATIC)
- Focused 601–608 regression test added.
- Existing security-governance tests remain wired into `npm test`.
- Full repository runtime is still not executable from this environment, so this is not a DONE/runtime claim.

## Acceptance
601–603: implemented + live verified.
604–605: blocked on controlled secret migration/production deployment.
606–607: partial pending advisor/function-level remediation.
608: static regression coverage added.
