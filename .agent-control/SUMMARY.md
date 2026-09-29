# BuildWise AI — SUMMARY

Updated: 2026-09-29
Branch: buildwise-implementation

## Canonical governance
- Repository law: Conversation → Decision → Repository record → Implementation → Test → Runtime verification → State update.
- Canonical agent behavioral reference: `.agent-control/AGENT_EXECUTION_PROTOCOL.md`.
- All agents follow Source → Decision → Task → Reconcile → Implement → Test → Runtime Verify → Evidence → State → Done.
- Canonical architecture/decision documents are updated before creating another file for the same responsibility.
- Missing GitHub evidence means a decision is unrecorded.
- No duplicate specifications for an existing responsibility.

## Active task baseline
- Canonical active registry: `.agent-control/MASTER-CHECKLIST-v3-850.md`.
- This is the sole active acceptance/source-of-truth register.
- Task sequencing and acceptance mapping must reference this file only.

## Existing implementation baseline
- Tasks 001–020: existing implementation/audit baseline; do not rebuild.
- Tasks 011–012: implementation + focused test evidence.
- Task 010: implementation preserved/audited.
- Tasks 013–020: primarily audit/release-gate work.

## Architecture baseline
- Mother architecture: .agent-control/MASTER-ARCHITECTURE.md
- Execution protocol: .agent-control/AGENT_EXECUTION_PROTOCOL.md
- Current architecture phase: .agent-control/PHASE-CURRENT-ARCHITECTURE.md
- Decision ledger: .agent-control/DECISIONS.md
- Execution state: .agent-control/STATE.md

## Phase 04
Relational canonical path for hierarchy, schedule, BOQ, procurement, progress.
Integration test covers hierarchy→schedule→progress→boq→procurement.

## Release gate
main diverged — never force-update main. Preview buildwise-implementation for UI E2E.
