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
Include positive result, negative result, failed approach/idea, useful approach, and blocker when relevant.
Keep each record <= 300 characters when practical. Never include secrets.

## Agent startup — low token
1. Read BRIEF.md.
2. Read only PERFORMANCE.md snapshot + last 5 events.
3. Read the assigned task contract.
4. Inspect target commit/diff only if required.
5. Never reread the whole repository just to recover prior context.

## Change detection
Before editing:
- record base commit in the task/handoff.
After editing:
- record resulting commit and changed paths.
- record tests actually executed.
- record blockers and next owner.
- record what worked / did not work when it affects future work.

## Token rule
Do not send whole files or history between agents.
Send only:
- current commit SHA
- changed paths
- one-line intent
- verification result
- useful/failed approach if relevant
- next action

## History rule
PERFORMANCE.md is behavioral memory, not a narrative log.
Store only decision-useful facts:
- what changed
- what was tested
- what worked
- what failed
- why a path was rejected
- what to do next
Do not store explanations, chat transcripts, or repeated facts.
When history becomes large, archive old events and keep the active snapshot + last 5 events in the hot file.

## Conflict rule
If another agent changed a claimed path after the recorded base commit, stop and mark CONFLICT. Do not silently overwrite.

## Claude bridge
Claude has no direct GitHub runtime in the current architecture. Grok/ChatGPT must provide only:
`BRIEF + latest PERFORMANCE snapshot/events + task + relevant diff`.
Do not paste repository history.

## Performance state
Use:
SYNCED = ledger matches verified commit
DIRTY = uncommitted/unverified work exists
CONFLICT = overlapping changes detected
BLOCKED = dependency/runtime unavailable
DONE = acceptance tests verified

## No fake completion
Never mark DONE from a proposed patch alone. DONE requires implementation + test + evidence.
