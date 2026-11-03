# BuildWise AI — CRM-First Delivery Roadmap

Decision: D-028 | Effective: 2026-11-03
Authority: .agent-control/ARCHIVE-FREEZE.md

## Binding scope
BuildWise is being narrowed to a practical real-estate CRM and transaction workspace. Professional construction/project control, project accounting, market/feasibility intelligence and workflow-engine verticals are frozen for a possible future product. They are not part of the current BuildWise roadmap.

## Frozen — do not touch
- 066–100: municipal/market/valuation/feasibility intelligence.
- 191–235: project accounting and financial control.
- 343–367: workflow builder/engine and automation.
- 453–476: construction/project control.

## Active delivery sequence
1. Final architecture reconciliation: inspect actual repository, navigation, data model, role boundaries, runtime and deployment. Identify keep/rework/disable decisions.
2. Property bank: reliable property records, full details, attachments, ownership and status.
3. People and CRM: owners, buyers, builders, customers, advisors and duplicate-safe identity links.
4. Data intake: Excel import/export, validation, preview, error handling, rollback and manual entry.
5. Search and matching: Persian/Arabic normalization, useful filters, permission-aware results and matching real requests to real files.
6. Deals and follow-up: deal workspace, commission/fee tracking, customer contact history, assignments and reminders needed for brokerage.
7. Customer sharing: controlled property proposals and customer responses.
8. Roles/security: least-privilege permissions, phone visibility and manager oversight.
9. Operational AI: natural-language search and assistance limited to active CRM/property/deal data and authorized actions.
10. Release acceptance: automated tests, authenticated browser walkthrough, data integrity, role isolation, mobile UI and deployment SHA verification.

## Rules
- Do not start broad implementation until ARCH-001 final architecture is reviewed by Grok and Claude and approved by the Product Owner.
- Safe CRM bug fixes, test coverage and UI corrections may continue.
- Do not create a second app/repository yet.
- Preserve archived code, schema, migrations and records. No destructive cleanup.
- DONE means implementation + tests + runtime/UI + security evidence as applicable.
- Current active queue is .agent-control/TASK-QUEUE.yaml; canonical acceptance register is .agent-control/MASTER-CHECKLIST-v3-850.md.
