# Skill: Performance Memory / Shared Change Ledger

## Goal
Give ChatGPT, Claude and Grok one compact, low-token view of what changed, why, verification status and what the next agent must know.

## Source of truth
- Code truth: Git commit/branch.
- Immediate execution truth: `.agent-control/NOW.md`.
- Coordination truth: `.agent-control/memory/PERFORMANCE.md`.
- Short context: `.agent-control/BRIEF.md`.
- Detailed evidence: task contracts and handoffs.

## Agent startup — progressive disclosure
1. Read `.agent-control/NOW.md` first. It answers: where are we, what is done, what is blocked, what is next.
2. Read BRIEF.md only for project orientation/rules.
3. Read only PERFORMANCE.md snapshot + last 5 events.
4. Read the assigned task contract.
5. Inspect only the minimum allowed files needed for the task.
6. Do not read HISTORY.md unless the current task has unresolved context that the hot layers cannot answer.
7. Never reread the whole repository just to recover prior context.

## Mandatory event
After every meaningful task, append ONE compact record to PERFORMANCE.md:
`timestamp | task | agent | commit | status | paths | tests | decision/impact | next`
Include positive result, negative result, failed approach/idea, useful approach, and blocker when relevant.
Keep each record <= 300 characters when practical. Never include secrets.

## NOW.md rule
NOW.md is the hot operational memory, not a history log.
It must stay short and answer only:
- current task/state
- verified done
- active blockers
- exact next actions
- things not to repeat
- startup order
Update it after every meaningful task that changes the next action, blocker, or verified state.

## Change detection
Before editing:
- record base commit in the task/handoff.
After editing:
- record resulting commit and changed paths.
- record tests actually executed.
- record blockers and next owner.
- record what worked / did not work when it affects future work.
- update NOW.md when the operational state changes.

## Token rule
Use progressive disclosure:
`NOW → BRIEF → PERFORMANCE(5) → TASK → MINIMUM CODE`.
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
HISTORY.md is cold archive and is not part of normal startup.

## Conflict rule
If another agent changed a claimed path after the recorded base commit, stop and mark CONFLICT. Do not silently overwrite.

## Claude bridge
Claude has no direct GitHub runtime in the current architecture. Grok/ChatGPT must provide only:
`NOW + BRIEF + latest PERFORMANCE snapshot/events + task + relevant diff`.
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
