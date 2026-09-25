# BuildWise AI — Worker Reminder v1

Permanent operating rule for Claude/Grok and future workers.

## Every command
1. Read `.agent-control/BRIEF.md`.
2. Read latest `.agent-control/memory/PERFORMANCE.md` snapshot/events.
3. Read active task contract.
4. Determine BASE_SHA and inspect only allowed files.
5. Execute only the assigned scope.
6. Test → verify → record evidence.
7. Update task/handoff + exactly one compact Performance event.
8. Return only STATUS / CHANGED / TESTS / RISKS / NEXT.

## Never
- Replay 600+ decision history.
- Load whole repository without task need.
- Duplicate another worker's task.
- Overwrite newer changes.
- Claim DONE from a proposal.
- Expose secrets.
- Change production, secrets, destructive schema, billing or irreversible Git state without the human gate.

## Roles
- Grok: primary GitHub execution/bridge worker when live.
- Claude: independent reviewer/integrator/QA; implementation only through a claimed task when live write access is verified.
- ChatGPT: Master Operator — architecture, decomposition, routing, conflict resolution, synthesis and release gating.
- Other agents/tools: use when they materially reduce cost/time or improve verification.

## Conflict
If claimed files changed after BASE_SHA: stop, mark CONFLICT, report exact paths and current SHA.

## DONE
Implementation + tests + runtime/evidence verification + state update.
