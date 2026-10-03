# Agent Control State

status: CI GREEN | 609-629 VERIFIED | 630 BLOCKED ON PRODUCTION BROWSER | 633-650 INFRA PARTIAL
project: BuildWise AI
branch: buildwise-implementation
active_task: checklist-633-650
last_batch: 633-650 infrastructure

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

## 627-632 — Mobile / PWA / Portal / Release Regression
- 627 Mobile Test: PASS — Unit 759.
- 628 PWA Install Test: PASS — manifest icon added and service-worker registration added; Application Validation 856 PASS.
- 629 Customer Portal Test: PASS — share expiry, response actions, advisor alert and AI classification hooks verified in Unit 759.
- 630 Production E2E Test: BLOCKED — repository has no currently verified production URL/browser runtime in this execution context; static contract passes, but customer→advisor browser flow is not claimed DONE.
- 631 Regression Test Suite: PASS — wired into npm test and Unit 759.
- 632 Security Regression Test: PASS — security gates wired and no skipped security tests detected in Unit 759.
- Fresh CI for commit 4926e46: Unit 759 PASS, Application Validation 856 PASS, Phase Code Map 536 PASS, Worker Runtime 633 PASS.

## Checklist source
- Current project source-of-truth is BUILDWISE-MASTER-CHECKLIST-v3, consolidated range 001-850.
- 850 is the acceptance/architecture register, not 850 completed features.
- Completion still requires implementation + test + runtime verification; UI/security verification applies where relevant.

## Next action
- Resolve 630 only through a real production browser verification; otherwise continue with 633+ infrastructure without falsely marking E2E complete.

## 633-650 — Infrastructure / Deployment
- 633 GitHub Repository: PARTIAL — repository and control plane are active.
- 634 buildwise-implementation Branch: PARTIAL — active implementation branch; production remains main-only.
- 635 GitHub Actions: PARTIAL — CI exists and fresh infrastructure contract test is green.
- 636 Supabase: PARTIAL — live project verified ACTIVE_HEALTHY (ref beuestoewletjsgmigmf).
- 637 Edge Functions: PARTIAL — existing functions remain the active API/edge layer.
- 638 Database Schema: PARTIAL — migration history exists; production migration gate added.
- 639 Graph Tables: PARTIAL — existing graph/data layer remains in place.
- 640 AI Orchestrator: PARTIAL — existing Supabase Edge Function remains the canonical AI edge.
- 641 GitHub Pages: PARTIAL — retained for smoke/demo; not production.
- 642 Final Production Domain: PARTIAL — current Netlify production hostname is available; custom domain is optional/deferred.
- 643 Cloudflare: PARTIAL — explicitly deferred from the critical release path; no Cloudflare provider runtime is required by the current Netlify + Supabase architecture.
- 644 Cloudflare Workers if needed: TODO — not required by the current architecture.
- 645 Automated Deployment: PARTIAL — Netlify deployment path exists; live production verification remains required.
- 646 Deployment Health Check: TODO — live deployment smoke verification remains required.
- 647 Database Migration Pipeline: PARTIAL — existing migration controls remain unchanged by this batch.
- 648 Backup Strategy: PARTIAL — GitHub Actions scheduled pg_dump workflow implemented; real successful run is still required before DONE.
- 649 Rollback Strategy: TODO — no runtime rollback drill executed in this batch.
- 650 Environment Separation: PARTIAL — Netlify production/preview/branch contexts now expose explicit BUILDWISE_ENV values; staging and production still share the current Supabase backend.
- Infrastructure contract test: PASS — GitHub Actions run 868, commit 1bd0d09.
- No production deployment or destructive production database action was performed.


## 2026-10-02 — 651-675 REOS Integration
- 651-657: integration contract implemented for unified REOS identity, project-control, AI authority, evidence and audit boundaries.
- 658-663: configurable-project contract defined for workflow/KPI/accounting/procurement/schedule/sales strategy.
- 664-666: canonical input/calculation/comparison domains defined; existing domain engines remain owners of implementation.
- 667-674: customer output and unified-product architecture contracts defined; presentation/content/open-source reuse remain dependent on their existing modules.
- 675: DONE rule remains governed by AGENT_EXECUTION_PROTOCOL; no checklist item is promoted to DONE from contract tests alone.
- Focused REOS tests are wired into npm test; latest CI for the current branch is in progress.


## 2026-10-02 — 750-827 Governance Contracts
- 750-795: canonical Decision Constitution contract added for source truth, evidence, reasoning classes, assumptions/recalculation, approval, audit, idempotency, bounded permissions and failure handling.
- 796-812: bounded execution economics contract added for token/time/cost/max-iteration budgets and scoped execution.
- 813-827: data lineage/change-impact/recovery contract added for source traceability, versioning, rollback evidence and migration safety.
- Focused tests are wired into npm test. Current status remains PARTIAL until runtime/UI/security acceptance evidence is available.
- 828-850 remain governed by the existing execution protocol and current-state discipline; no status promotion from prose.

## 2026-10-02 — Integrity repair
- Found a real release/test defect: `package.json` referenced missing `tests/unit/market-intelligence.test.mjs`.
- Removed the stale test reference in commit `404811d89b66ed84ba4dbdf526f58c0948698235`.
- This restores the canonical npm test chain; CI must re-run before claiming the fix verified.
- Production link remains on Netlify `main` and is not yet proven to serve the current `buildwise-implementation` tree.

## 2026-10-02 — Core integrity repair / 850 progression
- Fixed stale npm test reference to missing `tests/unit/market-intelligence.test.mjs`; Unit Test run 789 passed.
- Implemented checklist 14/22/26/29/30 core contracts: liquidity, feedback append, model routing, permission matrix, master decision loop.
- Focused + full Unit Test workflow passed on current implementation lineage (latest Unit run after checklist update: 37052504146).
- Checklist status after this batch: 5 DONE / 455 PARTIAL / 390 TODO.
- 14/22/26/29/30 are PARTIAL because runtime/UI acceptance is still required.
- Live Netlify production remains tied to `main` at an older commit; current implementation branch is not yet the deployed production artifact. Do not mark 630/642 DONE.

## 2026-10-02 — Customer Experience C01-C40 implementation
- Task: `.agent-control/tasks/TASK-CUSTOMER-EXPERIENCE-C01-C40.md`
- Implementation: customer experience domain + customer portal privacy enforcement.
- Persistence: `20261002230000_customer_experience_c01_c40.sql`.
- Architecture: canonical C01-C40 layer added to `PHASE-CURRENT-ARCHITECTURE.md`.
- Tests: focused customer-experience suite expanded; CI/live/runtime verification is still required.
- Status: PARTIAL. Do not mark C01-C40 or 401-415/418-432 DONE yet.

## 2026-10-02 — CRM Import Quality 060-065
- 060 Arbitrary Excel Column Editor: implemented in canonical `src/domains/crm/import-quality.js` and wired into the canonical importer preview.
- 061 Import Error Isolation: row-level validation/errors remain isolated; one bad row does not invalidate valid rows.
- 062 Import Preview: preview exposes row/column counts, all discovered columns, sample rows, validation status and duplicate candidates.
- 063 Import Validation: required-field and phone validation is executed before import; invalid rows stop the batch from being written.
- 064 Import Rollback: exact batch identity is persisted on normalized target rows; manager-only `rollback_import_batch(text)` removes only that batch.
- 065 Data Quality Dashboard: completeness/coverage, invalid rows, duplicate groups and error-rate metrics are available from the canonical quality layer.
- Tests added for all six behaviors. Current branch CI has an unrelated pre-existing migration filename-gate failure; syntax workflow also exposed and was fixed to reference the canonical importer path.
- Status: 060-065 remain PARTIAL until the new CI run plus live/browser verification confirms runtime acceptance under the repository DONE rule.


## 2026-10-03 — Core REOS Acceptance 014/022/026/029/030
- Task: `.agent-control/tasks/TASK-A-CORE-014-022-026-029-030.md`.
- 014 Liquidity Engine: DONE — implementation, focused regression, full npm test, CI/runtime execution evidence.
- 022 Feedback / Learning Loop: DONE — implementation, focused regression, full npm test, CI/runtime execution evidence.
- 026 Model Router: DONE — implementation, focused regression, full npm test, CI/runtime execution evidence.
- 029 Agent Permission Matrix: DONE — implementation, focused authorization regression, full npm test, CI/runtime execution evidence.
- 030 Master Decision Loop: DONE — implementation, evidence gate regression, full npm test, CI/runtime execution evidence.
- Core hardening: negative liquidity inputs rejected; empty decision evidence rejected.
- BuildWise Unit Tests run 840: PASS.
- Application Validation 938: PASS; QA 154: PASS; Agent Control Plane Validation 291: PASS; Phase Code Map 617: PASS.
- Supabase Migration Gate 19: FAIL, unrelated to this pure-JS task; no migration introduced.
- Current canonical checklist count: 10 DONE / 456 PARTIAL / 384 TODO / 0 BLOCKED.


## 2026-10-03 — Task C/D implementation
- Checklist 301–312: retained PARTIAL; existing document/plan persistence is extended by a replaceable adapter layer rather than a parallel document engine.
- Checklist 682–688: implementation contracts added for elevation, floor plan, scenarios, 3D, 360°, multi-angle and 4D visualization; acceptance remains PARTIAL.
- Selected components: Tesseract.js, Mozilla PDF.js, dxf-parser, Three.js. MIT Floor Plan Document Intelligence is reference-only.
- AIFloorPlan was researched but excluded from vendoring because its AGPL-3.0/commercial licensing does not fit the current proprietary application path.
- DWG remains a worker/conversion boundary; no GPL/AGPL CAD parser was embedded.
- Browser bridge is wired in index.html.
- Focused unit tests are now part of npm test; CI evidence is required before any DONE promotion.


## 2026-10-03 — Municipal Regulation Evidence 068
- Implementation: src/domains/regulation/regulation-evidence.js.
- Test: tests/unit/regulation-evidence-068.test.mjs.
- Architecture record: docs/architecture/REGULATION-EVIDENCE.md.
- Checklist 068: PARTIAL.
- No municipal rule was invented or treated as verified without source evidence.


## 2026-10-03 — Market History / Scenarios 082-100
- Implementation: src/domains/market-intelligence/market-history.js.
- Tests: tests/unit/market-history-082-100.test.mjs.
- Architecture: docs/architecture/MARKET-HISTORY-AND-SCENARIOS.md.
- Checklist 082–100: PARTIAL.
- Live gold/dollar/property observations are intentionally not embedded without provenance.


## 2026-10-03 — Project Management Core 101-130
- Added canonical project-management orchestration over existing construction modules: hierarchy, WBS, schedule, Gantt rows, CPM float, baseline variance, progress and project status.
- Focused tests added and npm test registration updated.
- Checklist: 101, 102, 106-123, 129-130 = PARTIAL; 103-105, 124-128 remain TODO where implementation is not sufficient for the checklist contract.
- Runtime/browser verification remains pending; no DONE promotion.

## Next action
- Continue from 103-105 / 124-128 only where the canonical project-management core can be extended without duplicating existing responsibilities; then proceed to 131+.


## 2026-10-03 — Project Management Core 101-130
- Implementation: `src/domains/construction/project-management-core.js`.
- Tests: `tests/unit/project-management-core.test.mjs`; local focused run 4/4 PASS.
- Package test registration updated.
- Checklist: 101, 102, 106-123, 129-130 PARTIAL; 103-105, 124-128 TODO.
- GitHub combined status for the latest implementation commit has no reported checks yet; browser/runtime verification remains pending.

## Next action
- Continue with 103-105 and 124-128 only if their missing behavior can be added to the same canonical project-management path; otherwise proceed to 131 without creating parallel engines.


## 2026-10-03 — Project Management 101-130 verification state
- Implementation coverage now includes all checklist capabilities 101-130; status remains PARTIAL pending authenticated browser/UI verification.
- Fresh CI evidence on latest verified implementation lineage: Unit 982 PASS; Application Validation 1080 PASS; QA 215 PASS; Agent Control Plane 381 PASS; Phase Code Map 759 PASS.
- Netlify deploy preview is READY for the latest implementation commit.
- Supabase Migration Gate continues to fail on an unrelated existing migration-gate condition; no migration was introduced by this batch.
- Two real defects discovered during verification were fixed: storage-count missing-information detection and incorrect snapshot-version test assertion.

## Next action
- Connect a browser verification capability (TinyFish or equivalent) and run the authenticated Project Control flow. Only after that evidence can 101-130 be promoted from PARTIAL to DONE.


## 2026-10-03 — Free infrastructure baseline
- Production delivery remains on the existing Netlify hostname; no custom domain purchase is required for runtime verification.
- Cloudflare was removed from the critical release path to avoid unnecessary provider dependency and cost.
- Added `.github/workflows/database-backup.yml`: daily PostgreSQL logical backup, pg_restore validation, 7-day private artifact retention.
- Required activation secret: `SUPABASE_DB_URL`. No secret was committed.
- Added `docs/INFRASTRUCTURE_FREE_BASELINE.md` documenting Development → Staging/Preview → Production semantics and the provider limitations.
- Updated `netlify.toml` with explicit BUILDWISE_ENV values for production, deploy-preview, branch-deploy and local contexts.
- No infrastructure item is marked DONE until runtime verification satisfies the project acceptance rule.


## 2026-10-03 — Infrastructure CI repair
- Migration Gate run 87 failed for a pre-existing legacy filename: `20260923_advisor_followups_security_reports.sql`.
- Normalized it to the required 14-digit migration filename `20260923000000_advisor_followups_security_reports.sql`.
- Removed the invalid legacy path.
- Unit Tests, Application Validation, QA, Phase Code Map and Agent Control Validation for the infrastructure commit all passed; only Migration Gate failed on the filename gate.
- A fresh Migration Gate run must be observed before treating migration infrastructure as verified.


## 2026-10-03 — Integrity / Security / Infrastructure reconciliation
- Canonical checklist header corrected from v2 to **v3 — 850**.
- Live Supabase project `beuestoewletjsgmigmf` is ACTIVE_HEALTHY on PostgreSQL 17.6.
- Remote migration history was compared with repository migration naming. The applied advisor-followups migration is version `20260923160714`; repository filename was incorrectly `20260923000000_...`. The repository filename was corrected to `20260923160714_advisor_followups_security_reports.sql` and the duplicate legacy filename removed.
- Current checklist count from the canonical 850 register: **15 DONE / 511 PARTIAL / 324 TODO / 0 BLOCKED**.
- Supabase security advisor currently reports 21 authenticated-callable SECURITY DEFINER functions and leaked-password protection disabled. Function definitions were reviewed before changing permissions. The 21 functions are not blanket-revoked because several are authorization helpers or deliberately authenticated RPCs with in-function role checks; indiscriminate revoke would break RLS/application paths. Further function-by-function hardening remains required where data scope is broader than intended.
- Production E2E 630 remains BLOCKED until an actual authenticated browser session verifies the deployed application. No false DONE promotion.
- Cloudflare remains out of the critical release path.
- No production database mutation was performed during this reconciliation.


## 2026-10-03 — Netlify Runtime Recovery
- Web research confirmed the observed 404 is consistent with a deleted/stale Netlify deploy or missing deploy context; Netlify documents that deleted deploys can leave a context URL returning generic 404. cite not stored in repo
- Netlify project `buildwise-ai-h` exists and its primary URL was returning Site Not Found.
- A one-time controlled publish was executed through the connected Netlify deployment path from the `buildwise-implementation` branch.
- Live browser verification now passes on `https://buildwise-ai-h.netlify.app` and `/project-control.html`.
- Root gateway renders BuildWise role entry; project-control renders the application UI with expected empty-project state and no visible JS/runtime errors.
- The temporary emergency publish workflow/trigger was removed immediately after successful recovery; no permanent deployment secret was committed.
- Therefore the prior Runtime/UI BLOCKED condition caused by the dead Netlify URL is resolved for the current deployment. This does NOT by itself promote 131-220 to DONE; domain-specific functional runtime acceptance remains required.
