# Customer Experience — Durable Decision Record

Date: 2026-10-01
Project: BuildWise AI
Branch: buildwise-implementation
Authority: Human product decision recorded in GitHub

## Decision

The customer experience specification supplied in the BuildWise project conversation is a permanent in-scope BuildWise product requirement.

It must not remain only in conversation memory. The canonical repository specification is:
`docs/requirements/CUSTOMER-EXPERIENCE-SPEC-v1.md`

The specification is additive. It does not replace the master task registry, renumber tasks, or create a parallel architecture.

## Non-negotiable product decisions

- Customer interacts primarily through AI conversation.
- Customer supplies minimum necessary information; AI extracts intent, fills fields, and asks only missing required information.
- Customer can discover projects/units by area, inspect permitted media and plans, analyze their own plot, see customer-facing price ranges, evaluate ROI/scenarios, request visits, use calendar workflow, connect with an advisor, and rate valid interactions.
- Customer-facing price is a range; default target/unit tolerance is ±5% where evidence supports the estimate.
- Four location recommendations should be presented rather than an uncontrolled long list.
- Living, luxury, investment and land-owner journeys follow the requirement logic in the canonical specification.
- Rating/review data is a first-class BuildWise intelligence source and must use verified interactions, auditability and anti-manipulation controls.
- Customer must not receive internal owner data, exact address, private phone, exact internal transaction price, restricted specifications/media, sensitive numbers, other customers' data, internal calculations, negotiations, margins, risk assessments, notes or confidential deals.
- This experience remains inside the existing BuildWise architecture and must reuse canonical domains rather than creating parallel portal/CRM/AI/rating systems.

## Registry reconciliation

The current repository registry names customer-facing tasks 401–415 and AI/customer-related tasks 418–432. The C01–C40 list is a product-capability mapping, not a competing task registry. Missing C01–C40 capabilities must be mapped to existing 850-task IDs or explicitly added through the canonical registry change process; task numbers must never be invented.

## Memory rule

Future agents must read this repository record and the canonical specification when working on Customer/Portal/Showroom or customer-facing AI. If the requirement is not found in the repository, it must be treated as unrecorded rather than reconstructed from memory.
