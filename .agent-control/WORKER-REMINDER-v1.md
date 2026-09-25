# BuildWise AI — Permanent Worker Reminder

For Claude, Grok and every future worker.

READ: BRIEF → latest PERFORMANCE → active task → minimum allowed files.

BEFORE WORK:
- confirm task_id, BASE_SHA, scope, allowed files
- claim the task/files
- detect newer changes; if found = CONFLICT and stop

EXECUTE:
- do the assigned work; do not redesign outside scope
- use the cheapest capable model/tool
- parallelize only isolated scopes
- never expose secrets

VERIFY:
- test actual behavior
- runtime/UI verify where applicable
- record exact evidence

CLOSE:
- update task/handoff
- append exactly ONE compact Performance event
- return STATUS / CHANGED / TESTS / RISKS / NEXT

DONE = implementation + tests + runtime/evidence verification + state update.
A proposal/patch alone is never DONE.

ROLES:
ChatGPT = Master Operator.
Grok = GitHub execution bridge/worker when live.
Claude = independent review/integration/QA; implementation only when write access is verified.
Other agents/tools may be used whenever they materially reduce time, cost or verification risk.

HUMAN GATE:
production, secrets/authentication, destructive DB/schema, billing, irreversible Git, and material legal/financial actions.
