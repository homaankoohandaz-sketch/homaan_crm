# BUILDWISE BRIEF — execution state

Orientation source: .agent-control/SUMMARY.md
Architecture source: .agent-control/MASTER-ARCHITECTURE.md

updated: 2026-09-28
project: BuildWise AI | branch: buildwise-implementation
code_truth: GitHub
coordination_truth: .agent-control

## Current state
- Batch 20 is audited for in-repo scope; release is still PARTIAL.
- Latest audited CI is green for unit tests, control-plane validation and phase map.
- Supabase is ACTIVE_HEALTHY.
- Netlify production is READY on `main` commit `9118559130c8130eb7509a8f61a91499b55187d9`; it does not represent `buildwise-implementation`.
- GitHub Pages workflow is main-only.
- Authenticated browser CRUD remains unverified on the implementation branch.

## Live Supabase gate
- Live Procurement schema verified: `project_procurement`, `project_purchase_approvals`, `project_purchase_orders`, `project_procurement_deliveries`, `project_material_inventory`, `project_material_consumption`, `project_material_prices` exist. Dedicated HSE/corrective-action tables are not present.
- Security advisor remains open: SECURITY DEFINER execution findings and leaked-password protection disabled; no blanket revoke applied.
- manager_edit_record and reos_sync_property_graph perform manager checks internally; route_* functions support public-request routing.
- No production grant/function change is applied without explicit human approval.

## Release blockers
1. Feature-branch runtime/browser E2E.
2. Authenticated CRUD evidence.
3. Procurement/HSE schema decision.
4. Security hardening review.
5. PR #10 reconciliation and production deployment verification.
6. OPENAI_API_KEY for live AI.

Never force-update main. Do not call DONE from CI alone.


## 2026-10-06 reconciliation
- Canonical implementation HEAD: `a2a486d146926cff1213cf290cdd6613dad27092`.
- `main` is 5 commits ahead of `buildwise-implementation`; production Netlify remains `main` and is not implementation evidence.
- CI status on implementation HEAD includes a successful Netlify deploy-preview context, but the preview commit mapping is not independently established as the exact implementation HEAD; do not mark 630 DONE from it.
- Supabase migration history contains `20260930145935_project_control_procurement_141_160`; live inspection confirms its procurement tables exist.
- HSE/corrective-action work remains PARTIAL/TODO until a canonical schema and runtime evidence exist.
- Next execution gate: obtain an independently verifiable runtime deployment of exact implementation HEAD, then authenticated E2E; do not merge/force-update `main` merely to obtain a deploy.