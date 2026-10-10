# BuildWise AI — Security Architecture Index

**Status:** Canonical entry point for the BuildWise security standard  
**Scope:** Existing BuildWise AI / REOS repository only  
**Implementation branch:** buildwise-implementation  
**Release branch:** main  
**Last updated:** 2026-10-09

Security is a cross-cutting control layer across identity, CRM/data, property intelligence, construction/procurement, customer/builder portals, AI/agents, and release operations. Extend existing canonical modules; do not create a parallel application or security engine.

## Required five documents
1. [System security standard](security/security.md) — invariants, architectural boundaries, release blockers and safe-change policy.
2. [Authentication and authorization](security/auth.md) — Supabase Auth, server-side permissions, RLS, grants, Storage and role-isolation tests.
3. [Data and storage security](security/data.md) — sensitive data, customer field masking, Excel/CSV imports, uploads, exports, logs and retention.
4. [Authorized security testing](security/hack.md) — threat model, safe verification protocol, severity and finding report format.
5. [Security acceptance checklist](security/checklist.md) — evidence gates subordinate to the canonical 850-item Master Checklist.

## Architecture boundaries
- Shared contracts: src/core/
- Business rules: existing src/domains/
- Identity, RLS, migrations and Edge Functions: supabase/
- Regression tests: tests/
- Decisions and execution status: .agent-control/

## Release gate
Security completion requires implementation/configuration, regression tests, relevant validation, allowed/denied-path evidence, runtime verification where applicable, and canonical state updates. A documentation set, successful build, CI pass or public page load alone is not proof of secure runtime behavior.

Production data changes, live secret rotation/revocation, auth/session redesign, permission broadening, destructive testing and production deployment retain existing human approval gates.

## Known verification limitation
This entry point records the security standard; it does not certify that the current application, Supabase policies, secret configuration or production runtime has passed an audit. Those remain evidence-gated tasks.
