# TASK-007 — Procurement Control Vertical (131–160)

status: IMPLEMENTED_TESTED_RUNTIME_PUBLIC_PENDING_AUTH
branch: buildwise-implementation
pr: #16

## Scope
Procurement Master Plan through Procurement Risk:
131–160.

## Implementation
- Existing canonical planning logic in `src/domains/construction/procurement-planning.js` covers:
  master plan, supplier comparison, purchase request/order, delivery progress,
  inventory/consumption, shortage, price variance/history, forecast, timing, risk.
- Existing persistence UI/migration covers approval, PO, delivery/partial delivery,
  inventory, consumption, price lineage, forecast and risk.
- Added `src/domains/construction/procurement-control-repository.js` as the
  canonical project-scoped persistence adapter.
- Extended `src/domains/construction/project-control-repository.js` so the
  canonical Project Control vertical now includes procurement.
- Added focused repository tests.

## Verification cycle
1. TDD contract test added before implementation.
2. GitHub Actions on implementation branch:
   - BuildWise Unit Tests: SUCCESS
   - Application Validation: SUCCESS
   - BuildWise QA: SUCCESS
   - Phase Code Map: SUCCESS
   - Agent Control Plane Validation: SUCCESS
3. Public Deploy Preview smoke:
   `https://deploy-preview-16--buildwis-ai.netlify.app`
   reachable; BuildWise AI shell/role gate verified.
4. Authenticated procurement runtime/UI verification remains pending.

## Acceptance
Do not promote 131–160 to DONE until authenticated runtime/UI verification is completed.
