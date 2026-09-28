# Architecture Memory

## Decision A-001 — Vendor-neutral control plane
The project will not make the CRM itself dependent on Claude, Codex, Gemini, n8n, or a single orchestration product.

## Decision A-002 — Files are durable project truth
Important decisions, task contracts, acceptance criteria, and handoffs must be representable in Git.

## Decision A-003 — Runtime state is separate
Presence, locks, live messages, process IDs, and ephemeral sessions belong in the runtime layer, not in committed project memory.

## Decision A-004 — Human approval gates
Production deployment, destructive migrations, secrets/authentication changes, and irreversible operations require human approval.

## Decision A-005 — Shared memory + coordination
A shared memory mechanism alone is insufficient. The system also needs task ownership and file/resource locking.

## Decision A-006 — Canonical product checklist
There is exactly ONE canonical BuildWise master checklist. The latest agreed master reference is the 850-item specification. The older 675-item checklist and the intermediate 715-item expansion are historical inputs, not parallel execution backlogs.
- Never create a second competing master checklist.
- Never renumber existing canonical items merely to make phase folders convenient.
- New requirements are added only through the canonical checklist/change-control process.
- Phase plans, GitHub tasks and agent tasks reference canonical item IDs; they do not redefine them.

## Decision A-007 — Phase is an execution layer, not the source of truth
Phases organize implementation order. They do not own product requirements.
Canonical chain:
Master Checklist -> Phase -> Domain/Module -> Feature -> Component/Service -> Test -> Runtime Verification.
A feature may depend on multiple domains/phases; dependency mapping must be explicit.

## Decision A-008 — Domain-first repository architecture
GitHub source code is organized by stable software domains, not by phase numbers.
Canonical homes are under src/:
- src/core/ — shared business engines, domain contracts, permissions, workflow primitives
- src/domains/real-estate/
- src/domains/intelligence/
- src/domains/project/
- src/domains/schedule/
- src/domains/procurement/
- src/domains/accounting/
- src/domains/construction/
- src/domains/progress/
- src/domains/kpi/
- src/domains/deal/
- src/domains/sales/
- src/domains/customer/
- src/domains/ai/
- src/ui/
- src/shared/
Existing mature implementations are migrated into these canonical homes; parallel replacements are prohibited.

## Decision A-009 — No duplicate engines or parallel business logic
There must be one authoritative implementation for each business capability.
UI adapters, persistence adapters and compatibility wrappers may exist, but they must delegate to the canonical implementation.
Before creating a new engine/service, search the repository for an existing implementation and either reuse/extend it or document a deliberate architectural exception.

## Decision A-010 — Cross-domain integration is contract/event based
Domains are not isolated islands. Cross-domain relationships use shared types/contracts and explicit events/services.
Core example:
Project/WBS -> Procurement -> Purchase -> Invoice -> Accounting -> Warehouse -> Workshop Task -> Evidence -> Progress -> KPI -> AI Control.
Do not copy business logic between domains to create a local shortcut.

## Decision A-011 — Project control is the central spine
For construction/project functionality, Project + WBS + Schedule + Procurement + Accounting + Workshop + Progress + KPI form one connected control system.
A task, purchase, cost or progress record must retain its project/WBS context wherever applicable.

## Decision A-012 — AI is a cross-cutting layer
AI does not become a separate duplicate application domain that reimplements business logic.
AI reads canonical domain services/contracts, proposes actions, records explanations/audit data, and obeys permission and human-approval gates.

## Decision A-013 — Agents are workers, not architects
ChatGPT/Master owns architecture, decomposition, conflict resolution and synthesis.
Codex/Claude/Grok/other workers implement or review bounded tasks.
Workers must receive canonical item IDs, allowed paths, dependencies, acceptance criteria and test requirements.
A worker may not silently change architecture or create a competing domain.

## Decision A-014 — Task boundaries are file/domain boundaries
Every implementation task must specify:
- canonical checklist item IDs
- phase
- domain/module
- allowed files/paths
- dependencies
- acceptance criteria
- tests
- runtime/UI verification requirement
- handoff/status update
Workers must not modify unrelated domains without an explicit dependency reason.

## Decision A-015 — Definition of Done is immutable
A feature is DONE only when:
IMPLEMENTED + TESTED + RUNTIME VERIFIED + UI VERIFIED + SECURITY VERIFIED where applicable.
A passing syntax check alone is not DONE.
CI being queued/running is not DONE.
A claimed status must reflect evidence actually verified.

## Decision A-016 — Migration before deletion
When consolidating old/root implementations:
1. identify the authoritative implementation,
2. migrate references,
3. add/repair tests,
4. run syntax/unit/architecture checks,
5. runtime/UI verify where applicable,
6. re-audit references/orphans/duplicates,
7. only then delete the superseded implementation.
Never delete solely because filenames look duplicated.

## Decision A-017 — Phase progression rule
Implementation proceeds phase-by-phase without stopping for perfection.
At each phase:
1. implement the bounded scope,
2. test it,
3. fix discovered regressions,
4. record exact status and evidence,
5. continue to the next phase.
Known blockers are isolated and recorded; unrelated work continues.

## Decision A-018 — Decision recording rule
A material architecture/product decision is not considered durable until recorded in .agent-control/memory/ or another canonical project document and referenced by the relevant task.
Chat discussion alone is not the project source of truth.

## Decision A-019 — No silent reinterpretation
If a new requirement conflicts with a canonical decision, the conflict must be surfaced and resolved explicitly.
Agents must not silently reinterpret old requirements, renumber the master checklist, or substitute a different architecture.

## Decision A-020 — Current structural direction
The 2026-09-27 structural audit is the migration baseline:
- canonical src/ modules are preferred;
- root-level feature engines are transitional/migration targets;
- duplicate business implementations are prohibited;
- the existing Workflow Engine must be reused rather than replaced;
- WBS is canonical and must connect to the existing Workflow Engine;
- the next project-control sequence is Project Persistence -> Schedule/Milestone -> Progress/KPI, followed by dependent domains.

## Canonical implementation map

Master Checklist
  -> Phase
    -> Domain/Module
      -> Feature
        -> Component/Service
          -> Tests
            -> Runtime/UI/Security verification

Project control spine
  -> Project
  -> WBS
  -> Schedule/Milestone
  -> Procurement
  -> Accounting
  -> Workshop/Construction
  -> Progress
  -> KPI
  -> AI Control

Repository principle
  -> Domain-first source tree
  -> Shared contracts in src/core / src/shared
  -> No phase-number folders as architectural boundaries
  -> No duplicate engines
  -> No unrecorded architecture changes
