# Agent Control State

status: CI GREEN | 609-626 VERIFIED
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

## 616-620 — CRM Import / Data Quality Tests
- 616 Import 2,000+ Row Test: PASS — 2,001-row normalization regression executed in Unit 748.
- 617 Multi-Sheet Excel Test: PASS — canonical data-import.js contract verified for all SheetNames, sheet provenance, row numbers and raw data.
- 618 Full Column Preservation Test: PASS — arbitrary normalized columns and _source_raw preserved.
- 619 Duplicate Test: PASS — same surname/phone alone produces no merge candidate; duplicate candidate remains property-code based and non-destructive.
- 620 Manager Edit Test: PASS — canonical editImportedRecord added to import-quality.js; edit preserves untouched fields and original record.
- Canonical contract: src/domains/crm/import-quality.js + src/core/data-normalization.js; no parallel data-quality.js module introduced.

## 621-626 — Project Control Tests
- 621 Project Accounting Test: PASS — accounting 191–235 surfaces verified in Unit 751.
- 622 Gantt Test: PASS — schedule overdue-state contract verified in Unit 751.
- 623 Procurement Test: PASS — approval, PO, delivery, inventory and risk surfaces verified in Unit 751.
- 624 KPI Test: PASS — catalog, alerts, trends, drill-down and custom builder verified in Unit 751.
- 625 Workflow Test: PASS — definitions, runs, templates, audit and builder verified in Unit 751.
- 626 AI Parallel Work Test: PASS — overlapping shared-resource work is blocked; eligible non-overlapping work is suggested.
- Fresh CI for commit e2a9f3b: Unit 751 PASS, Application Validation 848 PASS, Phase Code Map 528 PASS, Worker Runtime 625 PASS.

## Checklist source
- Current project source-of-truth is BUILDWISE-MASTER-CHECKLIST-v3, consolidated range 001-850.
- 850 is the acceptance/architecture register, not 850 completed features.
- Completion still requires implementation + test + runtime verification; UI/security verification applies where relevant.

## Next action
- Continue with 627–630: Mobile, PWA install, Customer Portal, Production E2E. Preserve the canonical-first rule.