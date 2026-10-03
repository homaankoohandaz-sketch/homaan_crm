# TASK — Customer Experience C01–C40 Reconciliation & Implementation

Status: IMPLEMENTATION SLICE
Date: 2026-10-02
Branch: buildwise-implementation

## Objective
Convert the canonical Customer Experience decision into executable work inside the existing BuildWise/REOS architecture. No parallel customer application, portal engine, rating engine, calendar engine, or learning loop is permitted.

## Source of truth
- Canonical product requirement: docs/requirements/CUSTOMER-EXPERIENCE-SPEC-v1.md
- Canonical acceptance registry: .agent-control/MASTER-CHECKLIST-v3-850.md
- Relevant existing task ranges: 401–415 and 418–432
- Customer capability identifiers: C01–C40

## Reconciliation
C01–C40 map into the existing customer/AI architecture:
- C01–C06: identity + AI entry + requirement/profile collection → 401, 411, 418–420, existing auth/CRM
- C07–C13: intent journeys + land/market/location intelligence → 066–100, 411, 422–424
- C14–C18: project/unit presentation → 401–409
- C19–C22: customer-safe valuation/ROI/scenario/evidence → 076–100, 412–413
- C23–C27: comparison, request, calendar, advisor, feedback → 409–415 + unified task/calendar/notification boundaries
- C28–C36: verified ratings, aggregation, market score, notifications, proposal → existing AI feedback/learning + 412/414 and new canonical rating persistence
- C37–C40: privacy, field permissions, masking, internal-data firewall → 591–603 security boundary + customer-specific safe output layer

## Required implementation
1. Extend src/domains/portal/customer-experience.js to cover the missing C01–C40 capability contracts without duplicating existing domain engines.
2. Add one canonical Supabase migration for customer profiles/requirements, location recommendations, verified interactions/ratings, proposal evidence and customer-safe rating aggregation.
3. Enforce customer-facing price ranges instead of exposing exact internal transaction values.
4. Enforce customer-safe location/media fields and field-level privacy rules.
5. Add focused tests for the new customer capability contract.
6. Update the current architecture map and control-plane summary/state.
7. Keep all relevant master checklist items PARTIAL until the required runtime/UI/security acceptance evidence exists.

## Acceptance
Implementation + focused tests + full CI + live Supabase/runtime + browser/UI + security verification where applicable. Contract existence alone is not DONE.
