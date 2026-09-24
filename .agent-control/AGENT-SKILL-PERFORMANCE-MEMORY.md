# Skill: Performance Memory / Shared Change Ledger

## Goal
Give ChatGPT, Claude and Grok one compact, low-token view of what changed, why, verification status and what the next agent must know.

## Source of truth
- Code truth: Git commit/branch.
- Coordination truth: `.agent-control/memory/PERFORMANCE.md`.
- Short context: `.agent-control/BRIEF.md`.
- Detailed evidence: task contracts and handoffs.

## Mandatory event
After every meaningful task, append ONE compact record to PERFORMANCE.md:
`timestamp | task | agent | commit | status | paths | tests | decision/impact | next`

Keep each record <= 300 characters when practical. Never include secrets.

## Agent startup
1. Read BRIEF.md.
2. Read PERFORMANCE.md only from the latest snapshot section plus the last 5 events.
3. Read the assigned task contract.
4. Inspect the target commit/diff only if required.

## Change detection
Before editing:
- record base commit in the task/handoff.
After editing:
- record resulting commit and changed paths.
- record tests actually executed.
- record blockers and next owner.

## Token rule
Do not send whole files or history between agents.
Send:
- current commit SHA
- changed paths
- one-line intent
- verification result
- next action

## Conflict rule
If another agent changed a claimed path after the recorded base commit, stop and mark CONFLICT. Do not silently overwrite.

## Claude bridge
Claude has no direct GitHub runtime in the current architecture. Grok/ChatGPT must provide only:
`BRIEF + latest PERFORMANCE snapshot/events + task + relevant diff`.
Do not paste the repository history.

## Performance state
Use:
SYNCED = ledger matches verified commit
DIRTY = uncommitted/unverified work exists
CONFLICT = overlapping changes detected
BLOCKED = dependency/runtime unavailable
DONE = acceptance tests verified

## No fake completion
Never mark DONE from a proposed patch alone. DONE requires implementation + test + evidence.
