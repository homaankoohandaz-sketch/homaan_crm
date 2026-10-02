# Agent Control State

status: CI GREEN | 609-615 VERIFIED | NEXT 616-620
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
- 609 Unit Tests: PASS — fresh GitHub Actions run 745 completed successfully.
- 610 Architecture Contract Tests: PASS within Unit 745.
- 611 Graph Tests: PASS within Unit 745.
- 612 Decision Engine Tests: PASS within Unit 745.
- 613 Contract Engine Tests: PASS within Unit 745.
- 614 Release/Application Validation: PASS — fresh run 842.
- 615 JS Syntax Check: PASS — fresh Application Validation run 842.
- Phase Code Map: PASS — run 522.
- Autonomous Worker Runtime: PASS — run 619.
- Regression fixes verified through CI: project-control variance semantics, progress-evidence verification, canonical import test path/coverage, browser/global runtime compatibility, landing analytics/conversion markers, and security-test assertion contracts.

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
- Execute 616-620 against the canonical `src/domains/crm/import-quality.js` + `src/core/data-normalization.js` contract. Do not create parallel CRM data-quality implementations.