# Agent Control State

status: SYNTAX-FIXED | 609-615 RECHECK IN PROGRESS | 616-620 NEXT
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
- Do not mark 609-615 DONE until CI/runtime evidence confirms the full gate.

## Next
- 616 Import 2,000+ Row Test
- 617 Multi-Sheet Excel Test
- 618 Full Column Preservation Test
- 619 Duplicate Test
- 620 Manager Edit Test

## Prior
- 493-500 project presentation views implemented on canonical project-control data.
