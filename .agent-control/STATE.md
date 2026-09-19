# Agent Control State

status: bootstrap
project: homaan_crm
control_plane_version: 0.1.0
active_task: bootstrap-control-plane
human_approval_required_for:
  - production deployment
  - destructive database/schema changes
  - secrets/authentication changes
  - irreversible Git operations
  - billing/cost commitments

## Active agents
No runtime agents registered yet.

## Current objective
Install the shared coordination contract for Claude Code, Codex, and future MCP agents.

## Next objective
Connect a runtime orchestrator/bridge and shared memory server without coupling the CRM to one vendor.
