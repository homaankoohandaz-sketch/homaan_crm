# BuildWise AI — Executable Architecture Baseline

## 1. System layers

1. **Identity & Access**
   - Supabase Auth
   - app_roles
   - capability resolution
   - RLS/server authorization
   - quotas
   - audit events

2. **Core CRM**
   - people/phones
   - owners
   - builders
   - buyers/investors
   - properties/files
   - requests
   - leads/deals
   - activities/follow-ups
   - promotions

3. **Real-estate intelligence**
   - land/property calculation
   - valuation/comparables
   - development feasibility
   - participation/barter
   - matching/deal radar

4. **Project / Construction OS**
   - project hierarchy
   - WBS
   - schedule/Gantt
   - BOQ
   - procurement
   - commitments/payments
   - RFI/submittals
   - quality/HSE/risk/progress

5. **Architecture / Media**
   - architecture ideas
   - facade ideas
   - plan/floor/unit visualization
   - media assets
   - rendering jobs

6. **Portals**
   - consultant workspace
   - builder workspace
   - owner/customer room
   - manager control center

7. **AI operating layer**
   - section assistants
   - retrieval/tool routing
   - action execution
   - memory
   - audit
   - model routing

8. **Control plane**
   - task queue
   - worker registry
   - context packs
   - evidence/handoffs
   - performance memory
   - automated execution loop

9. **Delivery**
   - GitHub CI
   - Netlify/PWA delivery
   - Supabase runtime
   - release gates

10. **Independent workstreams**
   - Project Accounting: separate product module; must not block CRM/core launch.
   - Public presentation website: separate frontend/product surface; must not block app launch.

## 2. Core dependency graph

Identity/Access
  -> CRM data model
  -> capability/RLS enforcement
  -> CRM vertical slice
  -> land calculation
  -> owner/builder portals
  -> project control
  -> matching/deal intelligence
  -> remaining product modules

Cross-cutting lanes can run in parallel:
- QA/security
- tests
- data import/normalization
- valuation evidence
- architecture/facade ideas
- deployment/observability
- AI routing/control-plane

Database migrations and auth/RLS changes are serialized.

## 3. Truth boundaries

- GitHub = source-code truth.
- Supabase = live schema/RLS/function/runtime truth.
- Control Plane = execution/state truth.
- Product checklist = acceptance truth.
- Runtime evidence beats documentation claims.

## 4. Authorization model

UI visibility is convenience only.
Actual authorization must be enforced server-side.

Permission resolution:
user -> role(s) -> capability set -> resource scope -> operation -> quota -> audit

Resource scope:
- manager: global operational scope
- consultant: assigned/allowed files and own workspace
- builder: own projects/files/promotions and permitted construction workspace
- owner: own properties/requests/files and permitted calculations/architecture outputs

## 5. Quota model

Rolling 48-hour successful-operation quotas:
- land_calculation: 3
- file_preview: 3
- facade_generation: 1
- manager: unlimited

Failed/rejected operations do not consume quota.
Quota logic must be centralized and server-enforceable.

## 6. File model

All uploaded files carry:
- owner/uploader identity
- role
- entity type
- entity id
- project/property relationship
- visibility scope
- file type
- created_at
- audit reference

Builder uploads are associated with the builder identity.
Owner requests preserve the submitted phone number and request payload.

## 7. Product release slices

### Slice A — usable CRM
Login -> role -> dashboard -> records/files -> request capture -> upload -> visibility -> quotas -> audit.

### Slice B — usable land intelligence
Property input -> calculation -> evidence -> scenario -> architecture/facade idea.

### Slice C — customer/builder portals
Builder upload/promotion/project view.
Owner request/file/calculation/architecture room.

### Slice D — project control
Project hierarchy -> WBS -> schedule -> BOQ -> procurement -> progress -> risk/quality/HSE.

### Slice E — intelligence
Matching -> deal radar -> recommendations -> AI actions.

Accounting and public website remain separate queues.

## 8. Definition of Done

A task is VERIFIED only when:
implementation exists
+ focused tests pass
+ runtime/evidence is verified for the scope
+ state/evidence is recorded.

Code existing alone is never DONE.
