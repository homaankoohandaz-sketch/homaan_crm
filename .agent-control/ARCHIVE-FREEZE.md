# ARCHIVE FREEZE — MANDATORY PRODUCT SCOPE GATE

Effective: 2026-11-03 | Decision: D-028 | Authority: Product Owner

## Absolute prohibition
The following checklist ranges are ARCHIVED and FROZEN. No person, AI, agent, worker, reviewer, architect, automated workflow, or future ChatGPT session may inspect them for implementation planning, claim them, assign them, estimate them, generate prompts for them, write code for them, reopen them, or treat them as BuildWise release requirements:

- 066–100 — municipal/market/land feasibility, liquidity, valuation scenarios, gold/dollar comparisons and investment reports.
- 191–235 — project accounting, ledger, project budgets, actual/committed costs, project payments/receipts, cash flow and audit.
- 343–367 — workflow builder/engine, triggers, conditions, actions, approvals, notifications, routing/escalation and workflow history.
- 453–476 — construction/project control, WBS, schedule/Gantt, baseline/variance, RFI, quality, HSE, site diary and progress controls.

This prohibition applies equally to ChatGPT (Master Operator), Grok, Claude, Codex, other agents, CI task generators, task queues, roadmap generation, and the human project owner while this freeze remains active. No one may reinterpret silence, old prompts, legacy documentation, existing code, tests, or database tables as permission to resume this work.

## Required behavior
1. Mark these IDs [ARCHIVED — FROZEN] in every current task inventory; retain original status only as historical metadata.
2. Exclude these IDs from active task selection, TODO extraction, sprint planning, estimates, progress denominators, release blockers, agent dispatch, and navigation.
3. Do not delete source code, schemas, migrations, production records, or historical tests as part of archiving. Preserve them untouched unless a separate, explicit data-safe extraction decision is made.
4. Shared components may be maintained only when strictly required by active CRM/property/deal functionality; do not extend archived business capability through a shared module.
5. Any worker that encounters an archived task must stop that task, leave files/data untouched, record FROZEN — DO NOT TOUCH, and return to the active CRM queue.
6. No one may remove this freeze, change its ranges, or create an exception without a new explicit written decision from the Product Owner recorded in .agent-control/DECISIONS.md and this file.
7. Do not create a second app/repository now. Project Control is only a possible future standalone product after BuildWise's final architecture and release strategy are approved.

## Active BuildWise objective
Deliver a reliable, fast, usable real-estate CRM and transaction workspace first: property bank/files, people/owners/buyers/builders, leads and public requests, Excel/data import, search/filter, matching, deal tracking, follow-up, customer sharing, role-based access, and operational AI limited to those workflows.

## Final-architecture gate
Before any further broad feature development, the Master Architect must audit the actual repository, UI, Supabase schema, current runtime and deployment; identify the smallest coherent BuildWise product; propose keep/rework/disable/archive decisions; define a short critical path and measurable acceptance tests; obtain review from Grok and Claude; and submit one consolidated final architecture decision to the Product Owner. Until that decision is recorded, only safe CRM-first implementation, defect fixes, tests, UI cleanup and verification are allowed. Archived ranges remain frozen even during that architecture review.
