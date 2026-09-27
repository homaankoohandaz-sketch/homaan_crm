# TASK-CRM-MVP-ROLE-ACCESS — CRM MVP usable vertical slice

status: QUEUED
task_id: TASK-CRM-MVP-ROLE-ACCESS
requester: chatgpt
specialist: crm
runtime: grok-github-worker
priority: P0
depends_on: TASK-000-ARCHITECTURE-BASELINE
preferred_model: grok
max_iterations: 3
base_sha: fa55ae52092bc3609e14545323565cc3480aff24
cache_keys: [role, protocol, tools]
context_budget: 2200
summarize_after_tools: true

## Objective

Stop CRM work from remaining theoretical. Deliver the smallest usable end-to-end CRM vertical slice for BuildWise:
login -> role -> permitted modules -> records/files -> usage limits -> manager visibility.

Do NOT continue broad feature completion. Do NOT build accounting, public presentation website, or a new frontend redesign in this task.

## Product role matrix

### Manager / owner-admin
Full operational visibility and editing.
Can see all CRM records, requests, phones, files, promotions, dashboards and controls.
Unlimited quotas.

### Consultant / advisor
Only these 3 product areas are visible:
1. Files / property listings
2. My dashboard
3. Land/property calculation
Facade idea is a sub-feature of land calculation and must NOT expose a floor plan.
No access to manager control center, other users' dashboards, construction control, accounting, internal notes, AI admin, automation, matching internals, or raw owner phone unless the record is explicitly assigned/authorized.

### Builder
Visible:
- builder dashboard
- builder/project files
- upload files
- own promotions
- construction/project control
- architecture idea
Accounting is a separate later workstream; do not implement accounting in this task.
Builder must not see unrelated CRM/internal manager data.

### Property owner
Visible:
- own/requested files
- plaque/property calculation
- architecture/building output including floor plan where permitted
- own request/status
No manager data, unrelated CRM data, or other owners' records.

Use existing role infrastructure where possible. If the current database only has manager/owner/staff, map staff -> consultant for backward compatibility and add the new role names only where code can safely support them. Do not break existing users.

## Usage limits for non-manager users

Use rolling 48-hour windows:
- land/property calculation: max 3 successful calculations
- file preview/display: max 3 successful previews
- facade generation/idea: max 1 successful generation
Manager is unlimited.

A rejected/failed operation must not consume a quota.
Quota checks must be centralized in one reusable helper, not duplicated across pages.
Record successful usage in the existing access/event infrastructure when possible.
If true server-side enforcement needs new RLS/RPC/schema, do NOT deploy it. Create a clearly marked migration/proposal only if needed and report NOT_APPLIED.

## CRM capture rules

1. Owner/customer phone number must be captured with the owner's request.
2. Builder identity must be captured with builder-uploaded files.
3. Records must be itemized/categorized so the manager can work quickly:
   - requests
   - people/phones
   - properties/files
   - builder/project files
   - promotions
   - calculation usage
4. Preserve existing duplicate-handling rules. Never merge records merely because surnames match. Same-phone records must remain distinct when they are distinct records.

## Existing runtime evidence

Supabase project: beuestoewletjsgmigmf.
Verified live tables include:
- app_roles
- owners
- properties
- property_documents
- property_images
- project_documents
- construction_projects
- project_results
- crm_people
- crm_requests
- crm_access_events
- promotions
- public_requests
- plan_usage_monthly

Verified current RLS behavior:
- properties, owners, property_documents, property_images, tasks, leads and deals are broadly readable by active users through is_active_user().
- public_requests is manager-readable or staff-readable.
- promotions currently allow manager/staff.
- construction_projects currently allows active-user read and can_write() write.
This means frontend-only hiding is NOT sufficient for production security. Treat server/RLS isolation as a separate gated hardening step.

Existing auth architecture:
- Supabase Auth session
- app_roles(user_id, role, active)
- shared server auth in supabase/functions/_shared/auth.ts
- service role must never reach the browser.

## Allowed files

Implementation:
- buildwise-app.js
- advisor-module.js
- analysis-engine-ui.js
- project-control.html
- tests/*

Security proposal only, NOT APPLIED:
- supabase/migrations/*

Coordination:
- .agent-control/memory/PERFORMANCE.md

Do not modify:
- .agent-control/tasks/TASK-CRM-MVP-ROLE-ACCESS.md
- production auth configuration
- live Supabase schema/RLS
- secrets
- website/landing design
- accounting engine
- unrelated construction modules

If another file is genuinely required, STOP and return SCOPE_ESCALATION before modifying it.

## Required implementation

1. Inspect current BuildWise navigation, role bootstrap, advisor module and calculation entry points.
2. Centralize role capability mapping.
3. Hide/disable navigation and direct route access for unauthorized roles.
4. Add manager-only data visibility to manager surfaces.
5. Add builder upload flow using existing project/property document infrastructure where possible.
6. Ensure owner request submission preserves phone and request details.
7. Add builder file metadata/identity capture.
8. Add rolling-48h quota helper for calculation, file preview and facade generation.
9. Ensure quota UI clearly shows remaining usage.
10. Keep facade generation separate from floor-plan output.
11. Add focused tests for:
   - role -> capabilities
   - hidden/blocked modules
   - quota windows and limits
   - failed operation does not consume quota
   - manager unlimited
   - owner/builder/consultant isolation rules at the UI/capability layer
12. Keep current UI and code structure; make the smallest changes that make the flow usable.
13. Update compact Performance memory once with actual result/evidence.

## Acceptance

DONE for this worker only when:
- CRM role/capability layer is implemented.
- End-to-end UI paths exist for consultant, builder and owner roles without exposing manager-only navigation.
- Builder can submit/upload a project file through the existing data model.
- Owner request captures phone.
- Quotas are centralized and tested.
- Existing manager flow remains intact.
- Focused tests pass.
- No production auth/RLS/schema change was applied.

Runtime limitation:
If authenticated multi-role runtime cannot be verified because no real test accounts are available, mark the result PARTIAL, not DONE, and state exactly what remains unverified.

## Handoff

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

Do not start another task.
