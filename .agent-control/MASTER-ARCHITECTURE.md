# BuildWise AI — MASTER ARCHITECTURE

## 1. Mission
BuildWise AI is a Real Estate Operating System for real estate, development, construction, investment, sales and project control.

## 2. Mother architecture
User / Manager
→ Identity & Permissions
→ CRM / Data Foundation
→ Real-estate Intelligence
→ Project / Construction OS
→ Sales / Finance / Procurement
→ Customer / Builder Portals
→ AI Decision & Action Layer
→ Agent / Automation Control Plane
→ QA / Security / Deployment

Cross-cutting: audit, versioning, evidence, permissions, memory, analytics.

## 3. Product phases
### 01 — CRM Core & Identity
People, owners, buyers, investors, builders, suppliers, properties, requests, leads, files, phones, import, normalization, permissions, audit.

### 02 — Land / Feasibility / Valuation
Land analysis, municipal evidence, development feasibility, construction cost, valuation, comparables, ROI and scenarios.

### 03 — Matching / Deal Intelligence
Opportunity detection, matching, deal workspace, risk, participation, barter, investor/builder/supplier/property matching.

### 04 — Project & Construction Control
Project hierarchy, WBS, schedule, Gantt, dependencies, BOQ, procurement, progress, quality, HSE, RFI, risk and corrective action.

### 05 — Finance / Procurement / Sales
Project accounting, cash flow, commitments, payments, material purchasing, sales inventory, pricing, offers and proposals.

### 06 — Customer / Builder Portals & Showroom
Customer room, builder workspace, project presentation, media, floor/unit views, requests, shareable outputs.

### 07 — AI / Agents / Automation
Section AI, AI gateway, tool registry, task contracts, model routing, workers, handoffs, memory, audit, approvals and failure recovery.

### 08 — Website / Marketing / Content
Landing site, product demos, PWA presentation, Instagram/YouTube/LinkedIn content, real-estate video/content bot.

### 09 — Release / Security / Operations
Tests, security, RLS, secrets, deployment, observability, backup, rollback, environment separation.

## 4. Canonical implementation structure
- `index.html`: application entry.
- `buildwise-app.js`: current primary browser application.
- `src/core/`: shared infrastructure and runtime.
- `src/domains/crm/`: CRM domain.
- `src/domains/construction/`: construction domain.
- `src/domains/finance/`: finance/feasibility domain.
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
- BuildWise remains a unified REOS, not a collection of independent apps.
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
