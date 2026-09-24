# Performance Memory Protocol

## Purpose
A lightweight shared memory protocol for ChatGPT + Claude + Grok without n8n.

The memory is a **Git-backed change ledger**, not a second database.

### What it solves
- All agents see the same latest commit/state.
- Each meaningful change has one compact event.
- Agents can resume after hours/days without replaying chat history.
- Token use stays low because agents read a snapshot and recent events, not the repository.

### What it does not solve
- It is not real-time messaging.
- Claude cannot independently read GitHub while its current runtime has no GitHub connector.
- Git does not replace task/file locking.

## Minimal handoff packet
```
HEAD: <sha>
TASK: <id>
CHANGED: <paths>
RESULT: <DONE|BLOCKED|CONFLICT|READY>
TESTS: <short evidence>
DECISION: <one line>
NEXT: <agent> -> <action>
```

Target: <= 120 tokens.

## Operating loop
1. Master creates task.
2. Worker records base SHA.
3. Worker edits isolated branch.
4. Worker tests.
5. Worker commits.
6. Worker appends one event.
7. Master/next worker reads only latest snapshot + event.
8. QA verifies the diff.
9. Master reconciles and updates BRIEF.

## Low-cost shortcut for Iran
Do not add n8n or a new hosted orchestration database for this layer.
Use:
GitHub repository + .agent-control + GitHub Actions only where automation is useful.

If GitHub Actions is unavailable, the same protocol works manually through the GitHub connector/CLI.

## Automatic option
A small GitHub Action may regenerate a compact commit-derived snapshot on push. It must not rewrite source code, expose secrets, or trigger an infinite workflow loop.

## Safety
- Never store secrets, tokens, credentials or sensitive personal data.
- Production, auth/secrets, destructive migrations and irreversible Git operations remain human gates.
