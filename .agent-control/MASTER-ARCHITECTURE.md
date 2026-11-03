# BuildWise AI — MASTER ARCHITECTURE

## 1. Mission
BuildWise AI is the focused real-estate CRM and transaction workspace. Professional market intelligence, project accounting, workflow automation and construction/project control are deferred to a future product decision.

## 2. Mother architecture
User / Manager
→ Identity & Permissions
→ CRM / Data Foundation
→ Core property / deal operations
→ CRM search, import, matching and follow-up
→ Customer / Builder Portals
→ AI Decision & Action Layer
→ Agent / Automation Control Plane
→ QA / Security / Deployment

Cross-cutting: audit, versioning, evidence, permissions, memory, analytics.

## 3. Product phases
### 01 — CRM Core & Identity
People, owners, buyers, investors, builders, suppliers, properties, requests, leads, files, phones, import, normalization, permissions, audit.

### 02 — Deferred: Land / Market Intelligence
Checklist 066–100 is archived. No active implementation of municipal-rule intelligence, market feeds, liquidity/price comparisons, gold/dollar comparison, investment scenarios or investment reports in the current BuildWise delivery.

### 03 — Matching / Deal Intelligence
Opportunity detection, matching, deal workspace, risk, participation, barter, investor/builder/supplier/property matching.

### 04 — Deferred: Project / Construction Control
Checklist 453–476 is archived for a future Project Control app. Do not expand WBS, schedule, Gantt, baseline, variance, RFI, quality, HSE, site diary or construction-progress capabilities in the current BuildWise delivery.

### 05 — Deferred: Project Accounting
Checklist 191–235 is archived. Project ledger, project budgets, actual/committed cost, cash flow, project payables/receivables, payment workflows and financial audit are deferred. Core property/deal payment notes required for brokerage operations remain distinct and may stay in scope.

### 06 — Customer / Builder Portals & Showroom
Customer room, builder workspace, project presentation, media, floor/unit views, requests, shareable outputs.

### 07 — AI / Agents (bounded core only)
Keep only the minimum AI/agent infrastructure needed by active CRM and data workflows. Checklist 343–367 workflow engine, triggers, conditions, actions, approvals, notifications, escalation and workflow history is archived.

### 08 — Website / Marketing / Content
Landing site, product demos, PWA presentation, Instagram/YouTube/LinkedIn content, real-estate video/content bot.

### 09 — Release / Security / Operations
Tests, security, RLS, secrets, deployment, observability, backup, rollback, environment separation.

## 4. Canonical implementation structure
- `index.html`: application entry.
- `buildwise-app.js`: current primary browser application.
- `src/core/`: shared infrastructure and runtime.
- `src/domains/crm/`: CRM domain.
- `src/domains/construction/`: preserved historical/deferred domain; do not expand in current BuildWise scope.
- `src/domains/finance/`: preserve shared contracts and historical/deferred modules; do not expand project accounting or archived feasibility features.
- `src/domains/matching/`: matching domain.
- `src/ai/`: AI gateway/contracts.
- `src/agent-control/`: runtime worker registry/adapter.
- `supabase/`: database, migrations and Edge Functions.
- `tests/`: verification.
- `.agent-control/`: coordination, decisions, task state and agent memory.

Root-level legacy engines/pages are transitional. Do not add new root-level feature engines. Migrate only when a task requires it and preserve behavior with tests.

## 5. Agent decision rules
1. ChatGPT = architect/operator: decide scope, dependencies and acceptance.
2. Worker = bounded implementation/review only.
3. No worker may invent architecture outside this document.
4. Allowed files are hard boundaries.
5. One task = one clear purpose.
6. No production/destructive/auth/security/billing action without the required human gate.
7. Never claim DONE without implementation + tests + runtime evidence.
8. When two files implement the same role, choose one canonical file and migrate/remove the duplicate; do not maintain both indefinitely.
9. Stable decisions belong here; execution status belongs in `.agent-control/STATE.md`. Do not create another status/state file.

## 6. Current decisions
- BuildWise current delivery is narrowed to a usable real-estate CRM and transaction workspace; archived project-control capabilities may later return or become a standalone app.
- Accounting and public presentation may progress independently and must not block the core CRM launch.
- n8n is optional and never a hard dependency.
- External workers are considered operational only after runtime + authentication + repository access + bounded non-production execution + tests + evidence.
- Supabase live state is verified independently from GitHub.
- The master checklist is acceptance truth; it is not a daily context dump.

## 7. Consolidation rule
One canonical implementation per responsibility. Do not create v2/v3/FINAL/NEW copies when extending the same responsibility. Split only for a genuinely different product phase/domain, independent lifecycle, or necessary isolation to prevent unsafe coupling. Merge by migrating references, testing, verifying, then removing the superseded implementation. Phase separation is a valid reason to split; code chronology is not.

## 8. Token-control rule
Never scan the whole repository for routine work. Start with SUMMARY → MASTER-ARCHITECTURE → relevant phase → exact task → minimum allowed files.

## 9. Change rule
Every architecture or structural change must update `.agent-control/SUMMARY.md` with a one-line ledger entry.

## 10. Decision-as-time rule — MANDATORY
**Every decision costs time. Therefore a decision is not considered real until it is recorded in the repository.**

The canonical workflow is:

**Conversation → Decision → Repository record → Implementation → Test → Runtime verification → State update**

Rules:
1. A material product, architecture, data-model, workflow, security, agent, deployment or task-planning decision must not remain only in chat.
2. The final decision must be written to the canonical repository document before implementation proceeds.
3. Existing canonical documents must be updated before creating a new document. Do not create another file merely to record a decision that belongs in an existing ledger/specification.
4. A later decision must explicitly supersede the earlier decision; historical decisions are retained.
5. If a decision cannot be found in GitHub, agents must treat it as **unrecorded**, not assume it is authoritative.
6. Agents must not claim that a decision was registered, implemented or verified unless the repository evidence exists.
7. When a decision changes architecture, update `DECISIONS.md`, `MASTER-ARCHITECTURE.md`, the owning phase, and `SUMMARY.md` as required by the change protocol.
8. The 850-task master reference is a planning/acceptance source only when its exact committed version is present and verifiable in GitHub. Agents must never invent missing task numbers.

## 11. Single-workspace rule — 2026-10-07
The repository and canonical implementation branch are the only active BuildWise engineering workspace. Old branches are historical pointers, not parallel development environments. New work must target `buildwise-implementation` and be released through `main`.

## 12. Current architecture phase — 2026-09-27
The current architecture phase is tracked separately in `.agent-control/PHASE-CURRENT-ARCHITECTURE.md`.

The next cross-domain implementation slice is the **Unified Task Engine**: CRM/file/customer follow-up, construction/workshop follow-up, and procurement/purchasing follow-up. Shared capabilities are assignment, calendar, notification, reminder, priority, starred promotion, Yes/No response, completion, move-to-tomorrow and audit.

Architecture decisions are durably indexed in `.agent-control/DECISIONS.md`.


## 13. Security architecture — canonical standard (2026-10-09)

Security is cross-cutting across Identity & Permissions, CRM/data, construction/procurement, customer/builder portals, AI/agents and release operations. It is not a separate application or duplicate permission engine.

Canonical security documents:
- `docs/security/security.md` — system-wide security invariants, release blockers and safe-change gates.
- `docs/security/auth.md` — Supabase Auth, server authorization, RLS, Storage, grants and role-isolation acceptance.
- `docs/security/data.md` — sensitive data, customer field masking, Excel/CSV import, uploads, exports, logs and retention.
- `docs/security/hack.md` — authorized threat review, safe testing procedure, severity and finding report format.
- `docs/security/checklist.md` — verification checklist subordinate to the canonical 850-item Master Checklist.
- `docs/SECURITY-ARCHITECTURE.md` — entry point and architecture-wide release gates.

Implementation boundaries: shared contracts in `src/core/`; business behavior in existing `src/domains/`; auth/RLS/migrations/Edge Functions in `supabase/`; regression evidence in `tests/`; decision and status records in `.agent-control/`. Extend canonical implementations; do not create parallel auth, security, audit or task engines.

Security DONE standard: implementation/configuration + regression tests + relevant validation + allowed/denied-path evidence + runtime verification when applicable + canonical state update. CI or documentation alone is not runtime acceptance. Production data changes, secret rotation, auth redesign, permission broadening, destructive testing and production release retain existing human approval gates.


## 14. Product scope boundary — 2026-11-03
The following canonical checklist ranges are archived from current BuildWise delivery: 066–100, 191–235, 343–367 and 453–476. The archive is a product-scope boundary, not a code/data deletion instruction. Keep existing files, schemas, migrations and user data intact. Do not surface archived capabilities as active navigation or spend implementation cycles on them. Shared dependencies may remain only where required by active CRM functionality and must not silently expand the deferred product. The future Project Control app is a possible later extraction, not an approved second app/repository today.
