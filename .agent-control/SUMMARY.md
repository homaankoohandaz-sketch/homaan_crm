# BuildWise AI — SUMMARY

Updated: 2026-10-04
Branch: main

## CRITICAL — Source of truth

The full human + ChatGPT ledger lives on branch **`buildwise-implementation`**:

`.agent-control/SUMMARY.md` (full phase ledger, production smoke at https://buildwise-ai-h.netlify.app).

STATE.md: `branch: buildwise-implementation`.

A prior compaction of this file on `main` was incorrect. Do not use a shortened main SUMMARY as acceptance history.

## Governance (unchanged)
- Repository law: Conversation → Decision → Repository record → Implementation → Test → Runtime verification → State update.
- Canonical agent protocol: `.agent-control/AGENT_EXECUTION_PROTOCOL.md`
- Active register: `.agent-control/MASTER-CHECKLIST-v3-850.md`
- Mother architecture: `.agent-control/MASTER-ARCHITECTURE.md`

## Implementation rule
- One canonical file per responsibility.
- No parallel SUMMARY / STATE / task-engine copies.
- Merge to main only via PR (PR #12 from buildwise-implementation).
- Never force-update main.

## Integrity note (2026-10-04)
- market-intelligence unit test lives on `buildwise-implementation` against existing `src/domains/intelligence/market-intelligence.js`.
- See `.agent-control/memory/BRANCH-DISCIPLINE-2026-10-04.md` on that branch.
