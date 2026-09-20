# Agent Control State

status: specification_frozen_runtime_bootstrap_pending
project: BuildWise AI+H
control_plane_version: 1.0.0
active_task: phase-02-agent-runtime-bootstrap

## Master
- chatgpt: master orchestrator / architect / synthesis

## Specialist team — 21
- coding
- app
- website
- devops_infra
- qa_security
- crm
- land_development
- market_valuation
- deal_intelligence
- sales_engineering
- document_contract
- ai_assistant
- project_control
- visual_3d
- branding
- marketing
- video
- instagram
- youtube
- meta_analytics
- research_web

## Specification status
- [x] Full BuildWise AI+H agent specification v1 written.
- [x] Universal task contract written.
- [x] Runtime/model matrix written.
- [x] Specialist responsibilities, inputs, outputs, dependencies, guardrails and success criteria defined.
- [x] Product AI Operating System loop defined.
- [x] Data ownership boundaries defined.
- [x] Trigger/dependency matrix defined.

## Runtime status
- ChatGPT Master is active in this conversation.
- Claude/Codex/Gemini/n8n are configured as target runtimes but live worker connection is not verified by this control plane.
- Codex Tasks runtime was queried during bootstrap; the connector currently returns UNAUTHORIZED because Codex runtime authentication is not available in this session. Therefore no live worker was started.
- Therefore agents are SPECIFIED but not yet OPERATIONAL as autonomous workers.

## Critical product rules
- Login/bootstrap remains protected.
- Domain logic is centralized; agents must use business tools.
- Unknown data is not invented.
- Mutations require audit trail.
- Alerts require owner, deadline, evidence and status.
- Database migrations are serialized.
- Production/destructive/secrets/billing/sensitive-public actions remain gated.

## Human approval gates
- production deployment
- destructive database/schema changes
- secrets/authentication changes
- irreversible Git operations
- billing/cost commitments
- sensitive public social actions
- material legal/financial commitments

## Next objective
Bootstrap one real worker runtime, execute documentation-only handoff, then read-only audit, then a tiny isolated non-production implementation. Only after passing these tests may runtime status change to operational.
