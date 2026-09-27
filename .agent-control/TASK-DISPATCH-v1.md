# BuildWise Task Dispatch v1

Purpose: provide agents with enough shared state to act without Hooman manually relaying routine status.

## Dispatch envelope
A task envelope should contain only:
- TASK_ID
- OWNER
- REVIEWER
- BASE_SHA
- GOAL
- FILES_ALLOWED
- ACCEPTANCE_CRITERIA
- TESTS_REQUIRED
- CURRENT_STATUS
- NEXT_ACTION

## Startup
Worker reads:
1. governance
2. BRIEF
3. latest performance events
4. active task envelope
5. minimum required files/diff

## Worker result
Return:
HEAD: <sha>
TASK: <id>
CHANGED: <paths>
RESULT: <DONE|BLOCKED|CONFLICT|READY>
TESTS: <evidence>
DECISION: <one line>
NEXT: <agent> -> <action>

## Event-driven rule
No always-on LLM coordinator is required. GitHub state + lightweight CI/dispatcher should carry routine state. Invoke an AI worker only when a task requires reasoning or implementation.

## Routing defaults
- Architecture/design/requirements -> ChatGPT
- Coding/refactor/debug/tests -> Claude, or ChatGPT for small scoped changes
- GitHub/control-plane/repository operations -> Grok
- Independent review/integration/QA -> Claude
- Final architecture/integration/release decision -> ChatGPT

## Safety
If BASE_SHA is stale, files overlap with newer work, or acceptance criteria cannot be verified, stop and return CONFLICT/BLOCKED instead of guessing.
