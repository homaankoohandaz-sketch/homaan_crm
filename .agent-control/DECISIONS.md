# BuildWise AI — Decision Ledger

Updated: 2026-09-27

This is the durable memory index for architectural decisions.
New decisions are appended; old decisions are not silently rewritten.

## D-001 — Product identity
Decision: BuildWise AI is a Real Estate Operating System (REOS), not a simple CRM.
Impact: CRM is one bounded domain inside a larger connected operating system.

## D-002 — Connected graph
Decision: Person, Property, Lead, Deal, Project, Unit, Contract, Money, Task, Document, Schedule and Procurement are connected entities.
Impact: Cross-domain tasks and actions must preserve entity relationships.

## D-003 — Bounded domains
Decision: Shared infrastructure belongs in src/core/; business logic belongs in bounded domain modules.
Impact: Avoid new monolithic root engines and duplicate feature implementations.

## D-004 — AI / worker model
Decision: ChatGPT is the architecture/operator layer. Workers execute bounded implementation/review tasks only when runtime and permissions are verified.
Impact: Worker claims require evidence. No worker is considered live from documentation alone.

## D-005 — Low-token control plane
Decision: .agent-control/ is the durable coordination layer. Use compact orientation, state, tasks, handoffs and decisions instead of replaying history.
Impact: Worker context is assembled from minimum required files.

## D-006 — Truth boundaries
Decision: GitHub = code truth; Supabase = live runtime truth; Master Checklist = acceptance truth; .agent-control/ = coordination truth.
Impact: Documentation cannot substitute for runtime evidence.

## D-007 — Unified Task Engine
Decision: Follow-up, task assignment, calendar scheduling, notification, response, completion and audit use one shared Task Engine.
Three contexts: CRM / File / Customer; Construction / Workshop; Procurement / Purchasing.
Impact: Do not implement three independent task systems.

## D-008 — Task assignment
Decision: A manager/authorized user can assign a task to another user and place it directly on the assignee's calendar.
Impact: Assignment is a first-class relation, not a text note.

## D-009 — Task response
Decision: Assigned users can respond Yes/No, mark completion, or move the task to tomorrow.
Impact: Task status and response are separately auditable.

## D-010 — Task priority
Decision: Priority has four levels: Critical, Important, Normal, Low.
Impact: Priority is independent from Starred/Promotion.

## D-011 — Starred promotion
Decision: A task can be Starred/Promoted independently of priority.
Impact: Starred tasks are highlighted in the assignee's work view.

## D-012 — Notification
Decision: Notification is a first-class field/capability with in-app and push channels when supported.
Required events: assignment, reminder, due-today, overdue, escalation.

## D-013 — Task traceability
Decision: Every task keeps creator, assignee, related business object, timestamps, responses, status changes and notification history.
Impact: Task activity must be auditable.

## D-014 — Architecture phase tracking
Decision: The current architecture phase has its own GitHub document and branch so it can be inspected without mixing architecture work with production implementation.
Branch: architecture/current-phase.
Next implementation slice: Unified Task Engine.

## D-015 — No rebuild
Decision: Continue from the existing BuildWise repository and current architecture. Do not create a parallel BuildWise implementation.
Impact: New work must attach to the canonical architecture and existing domains.

## D-016 — Optional automation
Decision: n8n is optional and never a hard dependency.

## D-017 — Completion standard
Decision: DONE means implemented + tested + runtime verified + UI verified where applicable + security verified where applicable.

## Decision change protocol
When a later decision changes one of these: append a new decision; identify the superseded decision; update PHASE-CURRENT-ARCHITECTURE.md; update MASTER-ARCHITECTURE.md; update SUMMARY.md; never delete the historical decision.