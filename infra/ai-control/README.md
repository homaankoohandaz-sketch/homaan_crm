# BuildWise AI — Token Economy Control Plane

## Objective

ChatGPT remains the master orchestrator, but execution is delegated to external workers. The control plane is designed so the model sees only the minimum state required to route work and verify results.

## Runtime

1. ChatGPT: plan / route / approve / synthesize.
2. Cloudflare AI Gateway: one edge gateway for provider access, logging, caching, rate limiting and fallback controls.
3. Claude:
   - Haiku 4.5: cheap mechanical AI work.
   - Sonnet 4.6: implementation and normal reasoning.
   - Opus 4.8: architecture and hard problems only.
4. OpenAI API: fallback/final synthesis when explicitly selected.
5. Workers AI: deterministic/low-cost classification and extraction where quality is sufficient.
6. GitHub/Codex/Claude Code: repository execution. ChatGPT should receive artifacts and compact test results, not full agent transcripts.

## Critical token rule

Keep the prefix stable and put changing task data at the end. Anthropic prompt caching applies to the full prefix through the cache breakpoint. A 5-minute cache is the default; a 1-hour cache should be used only when the same prefix is expected to be reused after a 5–60 minute gap.

## Agent loop

- Hard limit: 4 turns.
- One retry after a failure.
- Stop when acceptance criteria pass.
- Return a compact result envelope:
  - status
  - changed files
  - tests
  - blockers
  - next action

Do not return full logs to ChatGPT.

## Cloudflare

The current Cloudflare AI Gateway REST API provides OpenAI-compatible, Responses-compatible and Anthropic-compatible endpoints. It also provides gateway-level logging, caching and rate limiting. The gateway should be the single model ingress for BuildWise.

Required secrets/values are supplied at deployment time and must never be committed:
- CLOUDFLARE_ACCOUNT_ID
- CLOUDFLARE_API_TOKEN
- CF_AIG_GATEWAY_ID

## Deployment boundary

This branch contains the control-plane implementation only. No production deployment or secret mutation is performed from the repository change.
