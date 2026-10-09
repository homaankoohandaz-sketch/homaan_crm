# BuildWise AI Identity, Authentication and Authorization

## Source of truth
Use the existing Supabase Auth integration and canonical authorization helpers. Do not introduce a second session provider, parallel role table or duplicate permission engine without an approved architecture decision.

## Identity and role enforcement
- Authenticate the caller on every protected server/Edge Function request; never trust a client-supplied user ID or role.
- Reuse supabase/functions/_shared/auth.ts and the existing role contract where applicable. Verify the current file and call sites before changing behavior.
- Resolve the user's current active account and role from trusted server-side data. If role/account status cannot be resolved, deny access.
- Declare explicit allowed roles/actions per protected operation. Apply least privilege and default deny.
- Enforce record-level rules: role, ownership, assignment and business relationship. A valid login does not grant access to all CRM, property, customer, project or procurement data.
- Check authorization on both reads and writes. Test direct API calls, not only hidden UI controls.
- Prevent IDOR/BOLA: changing a record ID, file path, project ID, task ID or customer ID must not expose another user's records.

## Session and account controls
- Follow the supported Supabase Auth session lifecycle and provider security guidance; do not hand-roll token storage or session management.
- Keep tokens out of logs, URLs, screenshots, analytics and error reports. Never inspect or export a user's browser token as a debugging shortcut.
- Apply rate limiting and abuse controls to login, recovery, verification and public request endpoints. Avoid fixed account lockout behavior that lets an attacker deny service to another user.
- Avoid revealing whether an email/phone account exists in public-facing auth errors.
- Apply secure cookie, CSRF and origin controls wherever the deployed authentication flow uses cookies; verify actual hosting behavior rather than assuming it.
- Account deletion, session revocation, password reset and identity-provider changes must follow existing provider semantics and be verified in a non-production environment first.

## Supabase RLS and privileged functions
- Review RLS on each exposed table and each Storage bucket. Verify policies for each real BuildWise role and for anonymous access.
- RLS enabled without a policy is fail-closed, but may break legitimate workflows; document and test both denial and intended access.
- Review SECURITY DEFINER functions individually: fixed search_path, validated arguments, minimal grants, explicit authorization and no privilege escalation.
- Revoke unnecessary EXECUTE grants from PUBLIC/anon/authenticated. Privileged server operations may use service role only after caller identity and authorization are verified.
- Do not accept role, owner, manager, tenant scope or permission claims from request payloads as authoritative.
- Put policy and schema changes in versioned migrations; no undocumented live-only edits.

## Required regression matrix
For every protected resource, test:
1. anonymous request is denied;
2. authenticated but wrong-role request is denied;
3. same-role user without ownership/assignment is denied;
4. authorized user can perform the intended action;
5. attempts to change IDs or role fields do not bypass the policy;
6. list, detail, export, upload, download, update and delete paths enforce the same boundary.

Never label authentication or role isolation DONE from unit tests alone when deployed authenticated runtime verification is required.