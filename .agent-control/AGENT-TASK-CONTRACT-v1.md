# BuildWise AI+H — Universal Agent Task Contract v1

Every dispatched task must contain:

- task_id
- objective
- requester
- specialist
- runtime
- priority
- scope_in
- scope_out
- inputs
- expected_outputs
- source_of_truth
- dependencies
- allowed_tools
- files_or_records_allowed
- approval_gates
- acceptance_tests
- deadline
- handoff_path

## Execution lifecycle

1. Master creates task contract.
2. Specialist confirms scope and dependencies.
3. Read-only research may run in parallel.
4. Shared code uses isolated workspace/branch.
5. Specialist performs work only inside scope.
6. Specialist records evidence and tests.
7. QA verifies material changes.
8. Master reconciles findings.
9. Human approval is requested if a gate is reached.
10. Only then may a gated action proceed.

## Failure states

BLOCKED: required dependency unavailable.
INSUFFICIENT_DATA: evidence is inadequate; do not fabricate.
CONFLICT: specialists disagree; preserve both findings and escalate to Master.
FAILED: implementation/test did not meet acceptance criteria.
READY_FOR_APPROVAL: technically verified but requires human authorization.
DONE: acceptance criteria and verification complete.

## Handoff minimum

status:
objective:
evidence:
inputs:
outputs:
actions_taken:
tests:
risks:
blockers:
next_action:
approval_required:
