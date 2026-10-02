# Agent Control State

status: SYNTAX-FIXED | CI RECHECK PENDING | 616-620 BLOCKED ON CANONICAL IMPORT CONTRACT
project: BuildWise AI
branch: buildwise-implementation
active_task: checklist-609-620
last_batch: 609-615

## Security 601-608
- 599-600 were not reopened.
- 601 AI Data Permissions: implemented and live verified; actor/manager RLS boundaries confirmed.
- 602 Agent Tool Permissions: implemented and live verified; manager-only policy confirmed.
- 603 Production Action Approval: implemented and live verified; requester/pending + manager approval boundaries confirmed.
- 604 Secret Management: BLOCKED; production secret rotation requires external secret-management access.
- 605 Webhook Secret Remediation: BLOCKED pending controlled secret migration and webhook verification.
- 606 Security Advisor Cleanup: PARTIAL; telegram_sessions finding was remediated, but SECURITY DEFINER inventory and leaked-password protection remain.
- 607 SECURITY DEFINER Review: PARTIAL; function-by-function review required; no blanket revoke.
- 608 Permission Regression Tests: focused test added and wired into npm test.
- Evidence: .agent-control/SECURITY-601-608.md

## 609-615 — Testing / Release
- 609 Unit Tests: previously blocked by a real parser error in customer-experience.js.
- 610 Architecture Contract Tests: previously passing.
- 611 Graph Tests: previously passing.
- 612 Decision Engine Tests: previously passing.
- 613 Contract Engine Tests: previously passing.
- 614 Release Smoke Test: pending fresh CI/runtime verification.
- 615 JS Syntax Check: parser error fixed in commit 88c96fc6bd718f700323917fe27398e156ba2779.
- Local syntax verification: node --check passed for the repaired module.
- Fresh GitHub workflow lookup currently returns no run for the repair commits; therefore 609-615 remain unverified, not DONE.

## 616-620
- 616 Import 2,000+ Row Test: not started; canonical import contract must be identified first.
- 617 Multi-Sheet Excel Test: not started; same dependency.
- 618 Full Column Preservation Test: not started; same dependency.
- 619 Duplicate Test: existing normalization/data-quality paths need branch-compatible canonical implementation before test wiring.
- 620 Manager Edit Test: existing checklist/package references are present, but the referenced data-quality module is absent/incompatible on this branch; no duplicate implementation was introduced.

## Checklist source
- Current project source-of-truth is BUILDWISE-MASTER-CHECKLIST-v3, consolidated range 001-850.
- 850 is the acceptance/architecture register, not 850 completed features.
- Completion still requires implementation + test + runtime verification; UI/security verification applies where relevant.

## Next action
- Resolve the canonical CRM import/data-quality implementation on buildwise-implementation, then implement 616-620 against that single path.
