# TASK-000-ARCHITECTURE-BASELINE — BuildWise executable architecture

status: READY
task_id: TASK-000-ARCHITECTURE-BASELINE
priority: P0
preferred_model: grok
reviewer: claude
max_iterations: 3
allowed_files:
  - .agent-control/ARCHITECTURE-BASELINE.md
  - .agent-control/PRODUCT-MODULE-MATRIX.yaml
  - .agent-control/ROLE-CAPABILITY-MATRIX.yaml
  - .agent-control/TASK-QUEUE.yaml
  - .agent-control/STATE.md
  - .agent-control/BRIEF.md
  - .agent-control/memory/PERFORMANCE.md
  - .agent-control/handoffs/*
  - BUILDWISE-100-CHECKLIST.md
  - EXECUTION_BASELINE_2026-09-20.md
  - PHASES_04_11.md
  - RELEASE_READINESS.md

## Objective
Turn the existing BuildWise specification into one executable architecture and dependency graph BEFORE broad feature coding.

## Rules
- Inspect canonical control-plane files first.
- Inspect the repository and current branch before deciding.
- Do not invent new product requirements that conflict with existing decisions.
- Preserve the Real Estate Operating System concept.
- Separate product layers:
  1. Core platform/auth/permissions/audit
  2. CRM
  3. Land/property calculation
  4. Matching/deal intelligence
  5. Construction control
  6. Architecture/visual ideas
  7. Customer/owner/builder portals
  8. Promotion
  9. Accounting as an independent future workstream
  10. Public presentation website as an independent workstream
- Architecture is not the frontend design.
- Architecture is not accounting implementation.
- Do not mark existing partial work as DONE without evidence.

## Required outputs

### 1. ARCHITECTURE-BASELINE.md
Define:
- system layers
- modules
- entities
- ownership boundaries
- data flows
- auth/RBAC/RLS boundary
- file/storage boundary
- AI/tool boundary
- worker/control-plane boundary
- event/workflow boundary
- audit/telemetry boundary
- deployment boundary
- module dependencies
- what can run in parallel
- what must be serialized
- release gates

### 2. PRODUCT-MODULE-MATRIX.yaml
For each role:
manager, consultant, builder, owner
define visible modules, readable entities, writable entities, hidden modules and quota classes.

Apply the user's current role policy:
consultant = files + personal dashboard + land calculation + facade idea without plan.
builder = own dashboard/files/uploads/promotions + construction control + architecture ideas.
owner = own files + property/plaque calculation + architecture/building output including plans where permitted.
manager = full operational visibility.
No role may infer permission merely from hidden UI; server authorization is required.

### 3. ROLE-CAPABILITY-MATRIX.yaml
Use capability IDs rather than page-name checks.
Examples:
crm.people.read
crm.people.phone.read
crm.request.create
files.list.assigned
files.upload.own
land.calculate
facade.generate
architecture.plan.view
construction.read
construction.write
promotion.create.own
manager.all

Quotas:
land_calculation = 3 / rolling 48h
file_preview = 3 / rolling 48h
facade_generation = 1 / rolling 48h
manager = unlimited

### 4. TASK-QUEUE.yaml
Create a dependency-aware execution queue.
The first task MUST be TASK-000 architecture.
After architecture, the critical path is:
platform/auth -> CRM vertical slice -> land calculation -> role/RLS hardening -> owner/builder portal -> project control -> matching/deal -> remaining checklist.
Accounting and public website are separate queues and must not block the core app.

Convert the current checklist into atomic tasks where possible. Preserve IDs and mark current state PARTIAL/TODO/BLOCKED based on evidence.

### 5. State update
Set active task to TASK-000-ARCHITECTURE-BASELINE.
Do not claim runtime completion.

## Acceptance
DONE only when all four architecture artifacts exist, are internally consistent, and the queue has an explicit critical path and parallel lanes.
Return:
STATUS
MODEL_USED
BASE_SHA
HEAD
CHANGED
TESTS
EVIDENCE
RISKS
NEXT
