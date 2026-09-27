# Agent Coordination Protocol v0.1

## Task lifecycle
ready -> claimed -> working -> review -> done
blocked may branch from any active state.

## Claim
An agent must claim a task and its files before editing.

## Lock semantics
Runtime locks are advisory for now and become mandatory once the bridge is installed.
A lock contains: agent, task, path, timestamp, expiry.

## Message
Messages must contain:
- from
- to
- task
- type
- body
- timestamp

Types: request, handoff, review, blocker, decision, status.

## Review
The implementing agent cannot self-approve a production change.
Cross-agent review is preferred.

## Memory
Durable decisions go to Git. Ephemeral coordination stays in the runtime bridge.
