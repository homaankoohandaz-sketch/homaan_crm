# BuildWise AI Security Standard

**Status:** Active security standard for the existing BuildWise AI REOS repository  
**Canonical implementation branch:** buildwise-implementation  
**Release branch:** main

## Mission and boundaries
Security is a cross-cutting property of the existing REOS architecture, not a parallel app or independent permission engine. Extend the canonical implementation. Do not create duplicate auth, data, audit, task or security subsystems. GitHub is code truth; Supabase is live runtime truth; the 850-item checklist is acceptance truth; .agent-control/ is coordination truth.

## Non-negotiable invariants
1. Default deny: unknown role, missing ownership, ambiguous policy or failed verification means no access.
2. Supabase Auth establishes identity; server-side authorization decides which action and records that identity may access.
3. Browser code may contain only the public/publishable Supabase key. Service-role, AI-provider, webhook and other secrets stay server-side.
4. UI hiding is not access control. Enforce permissions in RLS and server-side functions/repositories.
5. Check object-level access on every protected record, file, task, project, contract and document; IDs supplied by a client are not proof of permission.
6. Return the minimum fields needed for the current role. Treat contact phones, customer requests, private property files, deal terms, project finance and internal AI/audit data as sensitive.
7. Customer/shareable outputs use explicit field allowlists and masking; never serialize internal objects wholesale.
8. Imports, uploads, AI output, browser content and external tool results are untrusted input.
9. No credentials, tokens, production PII or sensitive record snapshots in source, logs, tests, prompts, commits or reports.
10. No security claim is complete without evidence. Documentation, build success, CI, or a page loading alone do not prove secure runtime behavior.

## Architecture-specific boundaries
- Shared security contracts belong in existing src/core/ and existing auth helper supabase/functions/_shared/auth.ts where applicable.
- Business rules remain in their existing src/domains/ module.
- Database policy and schema changes belong in versioned supabase/ migrations.
- Security regression tests belong in tests/ and must use synthetic data.
- AI/worker access follows existing bounded task contracts and permission gates.
- Record decisions and verified status in canonical .agent-control/DECISIONS.md, .agent-control/MASTER-ARCHITECTURE.md, .agent-control/SUMMARY.md, and .agent-control/STATE.md as appropriate. Do not create competing status/checklist files.

## Release-blocking conditions
Block release if a reproducible critical/high issue allows secret exposure, unauthorized cross-user/object access, unauthenticated privileged actions, unintended public access to private files, or a critical injection/upload/authentication/authorization bypass. For other findings, record severity, exploitability, affected data, compensating controls, owner and acceptance condition.

## Safe change policy
Read-only review, static checks, synthetic-data tests and reversible code changes are allowed. Stop for the required human gate before production data deletion/modification, unapproved production migrations, secret rotation/revocation, auth/session redesign, broadening permissions, destructive tests, irreversible storage changes or production release actions. Never test outside authorized BuildWise environments.

## Definition of secure completion
A security item is complete only when the fix/configuration exists, regression tests pass, allowed and denied paths are tested, relevant validation passes, runtime evidence exists where applicable, and canonical project state records evidence and residual risks.