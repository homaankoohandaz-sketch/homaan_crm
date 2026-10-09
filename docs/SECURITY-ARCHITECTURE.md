# BuildWise AI — Security Architecture and Release Gates

Status: CANONICAL SECURITY STANDARD
Scope: Existing BuildWise AI / REOS repository only
Implementation branch: `buildwise-implementation`
Release branch: `main`
Owner: Architecture / Security QA
Last updated: 2026-10-09

## 1. Purpose and architectural fit

Security is a cross-cutting property of the existing REOS architecture, not a separate application or parallel security subsystem. Apply controls at the canonical boundaries:

- Browser/UI: `index.html`, `buildwise-app.js`, `src/ui/`
- Shared contracts and runtime: `src/core/`
- Domain data and workflows: `src/domains/`
- AI and worker actions: `src/ai/`, `src/agent-control/`
- Identity, persistence, policies and server functions: `supabase/`
- Regression evidence: `tests/`
- Decisions and execution truth: `.agent-control/`

Before implementation, reconcile existing controls and extend the canonical implementation. Do not create a parallel auth layer, duplicate repository, second permission engine, new checklist, or new application.

## 2. Security invariants

1. Authentication and authorization are distinct. Supabase Auth establishes identity; BuildWise role, active-account state, resource ownership and permitted action determine authorization.
2. Browser code may use only the Supabase publishable/anon key. Service-role keys, webhook secrets, AI provider keys and other credentials are server-side secrets only.
3. Every protected Edge Function verifies the caller through `supabase/functions/_shared/auth.ts` and declares allowed roles explicitly using the existing authorization contract.
4. UI hiding is not authorization. Enforce sensitive reads and writes with RLS, server-side checks and resource/ownership checks.
5. A user may access only records and files allowed by their role, ownership, assignment and business relationship. Do not rely on a client-supplied user ID, role, manager ID, property ID or file path as proof of permission.
6. CRM phone numbers, identity/contact details, customer requests, property files, deal data, project financials and internal AI/audit records are sensitive business data. Return only the minimum fields required by the current role and action.
7. Public or shareable customer outputs must pass an explicit field allowlist and masking/internal-data firewall. Never serialize internal records wholesale into customer views.
8. Excel, CSV, documents, images, AI output and imported records are untrusted input. Validate at the server/domain boundary, apply size/type/row limits, normalize safely, and preserve import provenance for review/rollback.
9. No real secret, credential, access token, customer phone number or sensitive production record may be committed to source, tests, screenshots, logs, prompts or security reports.
10. Security-sensitive production changes require the approval gates in AGENTS.md and the execution protocol. No silent key rotation, destructive data cleanup, auth rewrite, production migration or history rewrite.

## 3. Required control areas

### Identity, sessions and authorization
- Use the canonical Supabase Auth flow and shared auth helpers.
- Verify active account and role on the server for every protected operation.
- Use explicit allowlists for roles and actions; default deny when role, ownership or policy is missing.
- Check object-level authorization for each requested row, file, task, project and document (IDOR/BOLA protection).
- Keep error responses useful but avoid revealing whether a particular account exists.
- Apply provider-supported secure session/cookie settings and CSRF protections wherever cookie-based authentication is used. Do not add a second session system beside Supabase Auth.
- Apply rate limiting and abuse controls to login, password reset, verification, public request and AI endpoints. Avoid account-lockout rules that let attackers lock out other users.
- Ensure logout/revocation and password-reset behavior follow the existing provider's supported semantics.

### Supabase, RLS and privileged operations
- Review RLS on every exposed table and storage bucket; test allowed and denied operations for each BuildWise role.
- A table with RLS enabled but no policies is fail-closed, but must be documented and checked for intended usability.
- Review SECURITY DEFINER functions for fixed search_path, narrow grants, validated arguments, authorization checks and least privilege.
- Revoke unnecessary public/anon/authenticated EXECUTE grants. Privileged server operations may use service role only after verified identity and authorization.
- Validate foreign keys, tenant/manager scope and resource relationships; do not treat an opaque ID as authorization.
- Record policy and migration changes in repository migrations; never make an untracked live-only schema change.

### Secrets and deployment
- Keep credentials in the appropriate provider secret store/environment; never hardcode them in source or ship them to browser assets.
- Scan tracked files and diffs for accidental secrets before release. Redact secret values in evidence.
- Document ownership, purpose and rotation procedure for each production secret. Rotate only through an approved, coordinated migration; verify old credentials are no longer active where feasible.
- Keep implementation and production environments distinct. A successful deploy preview or public page load does not prove authenticated production behavior.
- Verify security headers, HTTPS, CORS allowlists and error handling in the actual hosting configuration; do not assume the frontend can enforce server-side headers.

### Import, upload and business data
- Validate file extension, detected content type, size, row count, encoding and schema; reject unsupported or malformed input safely.
- Ignore fully blank rows; do not create empty business records. Preserve source row numbers and import batch identity.
- Provide preview/validation and a traceable import result. Rollback must be scoped to the exact import batch and must not delete unrelated records.
- Protect uploaded files with role/ownership-scoped access. Do not trust client filenames or public object URLs for private files.
- Use parameterized database access and allowlisted sort/filter fields. Validate business rules on the server, not only in UI forms.
- Avoid storing payment-card data or authentication secrets. For third-party payment flows, verify transaction status server-side with the provider.

### AI, agents and external content
- Treat property descriptions, uploaded documents, web content, tool results and user prompts as untrusted data, not instructions that can override system policy.
- Give each AI/worker task the minimum allowed files, tools, data and permissions. Enforce authorization again at the action boundary.
- Require explicit approval for sensitive, financial, destructive, external-message or production actions according to the existing agent contract.
- Log action metadata and decisions without storing unnecessary private content or secrets. Separate model suggestions from committed business actions.
- Validate AI-generated queries, tool arguments and structured outputs before execution; never allow prompt text to grant permissions.

## 4. Verification protocol

For every security finding or change:

1. Identify the canonical code, policy, function or configuration and its current behavior.
2. State severity, impact, affected role/data, evidence and a safe reproduction path.
3. Add a failing regression test or controlled reproduction when feasible.
4. Implement the smallest compatible fix in the existing architecture.
5. Run focused tests, relevant security/architecture tests, and the applicable full validation suite.
6. Test both permitted and forbidden access paths, including cross-user/object access.
7. Verify persistence and deployed runtime where required. Never infer runtime safety from source inspection or CI alone.
8. Record commit, test evidence, runtime status, remaining risk and rollback path in canonical project state.

Security task status must use the repository's actual status vocabulary. Documentation-only work is not a security fix. CI PASS is not runtime acceptance. Do not mark a checklist item DONE without the evidence required by the canonical DONE rule.

## 5. Release gates

Block release when evidence confirms any of the following:
- a secret is exposed in browser assets, source, logs or public artifacts;
- an unauthorized role/user can read or mutate another user's protected data;
- a privileged endpoint performs an action without verified identity and explicit authorization;
- private customer/property files are publicly accessible without intended authorization;
- a critical injection, upload, authentication or authorization weakness is reproducible;
- a security migration is untracked or its deployed state is unknown.

For other findings, document severity, exploitability, affected assets, compensating controls, owner and due condition. Do not invent a clean bill of health when an environment cannot be tested.

## 6. Safe operating boundaries

Allowed by default: read-only repository review, static analysis, local/non-production tests, synthetic fixtures, additive documentation and focused regression tests.

Stop and request the required human gate before: production data deletion/modification, production migrations not already approved, real-secret rotation/revocation, authentication/session redesign, permission broadening, irreversible storage changes, destructive security tests, external notifications, or production deployment/merge.

Never test systems outside the user's authorized BuildWise environments. Do not run destructive tests against production. Keep findings and evidence private and redact secrets.

## 7. Initial known-risk register

The repository's historical execution baseline recorded these items; they must be re-verified against current code and live runtime before treating them as current facts:

- Production webhook secret handling was previously flagged for remediation; do not print or rotate the secret during audit.
- SECURITY DEFINER functions and their grants/policies require function-by-function review.
- Production authenticated end-to-end verification has previously been blocked by deployment/runtime access.
- Secret-management and webhook remediation were previously marked as requiring a human-controlled gate.

These are leads for verification, not assertions that the issues still exist today.

## 8. Definition of secure completion

A security item is complete only when the implementation or verified configuration exists, focused regression tests pass, relevant tests pass, permitted and denied behavior is evidenced, runtime verification is performed where applicable, and the canonical state/summary records the evidence and any residual limitations.
