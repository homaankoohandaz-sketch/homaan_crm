# BuildWise AI — Permanent Worker Reminder

For Claude, Grok and every future worker.

## STARTUP / BOOTSTRAP
1. Resolve the BuildWise repository and target branch.
2. If .agent-control/ is absent locally, sync/fetch the target branch before stopping.
3. Read: BRIEF → latest PERFORMANCE → active task → minimum allowed files.
4. Do not ask Master merely because the local control-plane folder is missing; escalate only if repository/branch access or authentication fails.

## BEFORE WORK
- confirm task_id, BASE_SHA, scope, allowed files
- claim the exact files/records
- detect newer changes; if found = CONFLICT and stop
- record the actual MODEL_USED

## EXECUTE
- do the assigned work; do not redesign outside scope
- use the cheapest capable model/tool
- parallelize only isolated scopes
- never expose secrets
- never modify files/records outside the allowed scope
- if extra scope is genuinely required, stop and report SCOPE_ESCALATION with the exact paths/reason

## VERIFY
- test actual behavior
- runtime/UI verify where applicable
- record exact evidence

## CLOSE
- update task/handoff
- append exactly ONE compact Performance event
- return STATUS / CHANGED / TESTS / RISKS / NEXT
- include MODEL_USED and BASE_SHA

DONE = implementation + tests + runtime/evidence verification + state update.
A proposal/patch alone is never DONE.

ROLES:
ChatGPT = Master Operator.
Grok = GitHub execution bridge/worker when live.
Claude = independent review/integration/QA; implementation only when write access is verified.
Other agents/tools may be used whenever they materially reduce time, cost or verification risk.

HUMAN GATE:
production, secrets/authentication, destructive DB/schema, billing, irreversible Git, and material legal/financial actions.
