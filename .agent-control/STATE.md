# Agent Control State

status: bridge_contract_ready
project: homaan_crm
control_plane_version: 0.2.0
active_task: phase-01-claude-codex-bridge

human_approval_required_for:
  - production deployment
  - destructive database/schema changes
  - secrets/authentication changes
  - irreversible Git operations
  - billing/cost commitments

## Active agents
- chatgpt: architect/orchestrator
- claude: reviewer/integrator (runtime connection pending)
- codex: implementer/debugger (runtime connection pending)
- qa: verifier contract defined

## Completed in this phase
- Shared agent roles and handoff chain defined.
- File-lock contract defined.
- Handoff contract defined.
- Vendor-neutral runtime bridge contract added.
- GitHub Actions validation added for control-plane contracts.

## Current blocker
The GitHub repository is ready, but no live Codex Environment/Workspace is registered and no direct Claude Code runtime connector is available in this ChatGPT session. Therefore live Claude -> Codex -> Claude execution cannot honestly be marked verified yet.

## Next objective
Register or expose the local runtimes from the user's desktop, then run the documentation-only bootstrap handoff before granting application-code write authority.
