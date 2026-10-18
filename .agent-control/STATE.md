# BuildWise AI — Agent Control State

as_of: 2026-10-17
project: BuildWise AI
implementation_branch: buildwise-implementation
working_change_branches:
  - fix/encrypted-db-backup-2026-10-17
  - docs/reconcile-live-rls-evidence-2026-10-17
active_task: backup-encryption-and-live-security-reconciliation

## Verified project state

- PR #16 description reports green CI for Unit Tests, Application Validation, QA, Phase Code Map, and Agent Control Plane Validation.
- Authenticated runtime/UI acceptance has NOT been completed or verified. Do not mark Production E2E / checklist item 630 DONE.
- The old 2026-10-11 restore status is obsolete and must not be used to justify replacing or deleting current engine files.
- PR #20 proposes a documentation-only performance remediation runbook; it does not apply indexes or modify production schema.
- PR #21 is a draft proposing encrypted database backup artifacts and updated recovery gates. It is not merged.

## Database backup — OPEN / FAILING

- Current `main` workflow: `.github/workflows/database-backup.yml`.
- Known failed run: https://github.com/homaankoohandaz-sketch/homaan_crm/actions/runs/38116503290. It failed at credential validation; no artifact was produced.
- Current `main` workflow uploads a custom-format `pg_dump` artifact without application-level age encryption and retains it for 7 days. Do not treat this as a verified backup.
- Draft PR #21 proposes Supabase CLI logical dumps of roles/schema/data, age encryption before upload, SHA-256 checksums, a manifest, and 30-day artifact retention.
- Required repository Actions secret: `SUPABASE_DB_URL` (PostgreSQL connection URI, not an API key).
- Required repository Actions variable for PR #21: `BACKUP_AGE_RECIPIENT` (public `age1...` recipient key).
- The matching private age identity must be held separately outside the repository. Never upload plaintext database dumps to this public repository.
- Required evidence: successful manual workflow run, encrypted artifact with all dumps/manifest/checksums, checksum verification, decryption with the separately held identity, separate off-site copy, and successful restore drill in an isolated non-production Supabase project.
- No backup was run or restored by this review.

## Supabase security — live evidence and remaining review

Project: `beuestoewletjsgmigmf`.

Read-only catalog queries on 2026-10-17 found:

- `public.is_active_user()` is SECURITY DEFINER.
- `anon` does NOT currently have EXECUTE privilege on `public.is_active_user()`; `authenticated` does.
- The 12 policy names covered by the public-RLS audit currently target `authenticated`, not `public` or `anon`.
- The ordinary tables in the live `public` schema returned by the RLS-disabled-table check all had RLS enabled.
- Live migration history contains version `20261017044414`, name `scope_is_active_user_policies_20261017`. The checked-in proposal is `supabase/migrations/20261017120000_scope_is_active_user_policies.sql`, and version `20261017120000` was not present in the live migration list at query time.
- Therefore live policy/ACL behavior appears aligned with the intended restriction, but exact applied SQL-to-repository migration parity is NOT reconciled. Do not reapply the proposal or create a duplicate migration until the authoritative SQL for version `20261017044414` is recovered and compared.
- Supabase Security Advisor reported 14 authenticated-callable SECURITY DEFINER functions and leaked-password protection disabled at the last read (2026-10-17 09:49 UTC). The generic function warning requires per-function authorization review; do not blanket-revoke EXECUTE.
- `public.manager_edit_record(text,text,jsonb,text)` currently allowlists only `public_requests` and a fixed column list, requires manager authorization, limits patches to 30 keys, and writes an audit event. Keep the allowlist and role gate covered by tests.
- Leaked Password Protection is a Supabase Auth dashboard setting and remains a maintainer action; its enabled state has not been verified.

## Database performance — OPEN / EVIDENCE-BASED

- Supabase Performance Advisor reports 124 unindexed foreign-key findings and 34 multiple-permissive-policy findings.
- A read-only table-size/statistics query shows the live database is currently small by estimated row counts, with `activity_logs` the largest observed table (~7 MiB; ~3.6k estimated rows) and `properties` ~2.3 MiB. Statistics are sparse/stale on many tables.
- Do not add all 124 indexes blindly. Prioritize FK indexes using measured query plans, delete/update workload, and actual table growth; use staging or a maintenance plan for schema changes.
- Do not drop indexes solely because usage counters show zero; workload windows and statistics may be incomplete.
- PR #20 contains a read-only remediation plan; no production indexes were created or dropped during this review.

## Current release gates

- [ ] Merge/review PR #21 only after CI review and confirmation of encryption/configuration behavior.
- [ ] Set `SUPABASE_DB_URL` and `BACKUP_AGE_RECIPIENT`, run backup manually, verify encrypted artifact/checksums.
- [ ] Create a separate encrypted off-site copy and complete an isolated restore drill.
- [ ] Reconcile live migration version `20261017044414` with checked-in migration source before further ACL/migration changes.
- [ ] Enable Leaked Password Protection in Supabase Auth and verify it is enabled.
- [ ] Review the 14 SECURITY DEFINER functions individually; no blanket revocation.
- [ ] Complete authenticated browser E2E across roles and core CRM/project/procurement/finance flows.
- [ ] Review performance findings based on measured workload before applying indexes or consolidating policies.

## Evidence rules

- A green CI run does not prove authenticated runtime/UI acceptance.
- Do not mark checklist item 630 (Production E2E) DONE without authenticated runtime evidence.
- Do not mark backup strategy DONE until a successful encrypted artifact, checksum verification, off-site copy, and restore drill are evidenced.
- No production migration, destructive operation, merge, or deployment is authorized by this status document.


## Supabase Security Advisor refresh — 2026-10-17 11:05 UTC

- Latest Security Advisor output reports 14 authenticated-callable SECURITY DEFINER functions, anonymous-role policy findings on multiple tables, and 34 multiple-permissive-policy findings.
- This is broader than the focused 12-policy is_active_user() catalog query. Treat both as evidence with different scope; the complete policy inventory and predicate review remains OPEN. Do not claim all anon policies are restricted based only on the focused query.
- No broad EXECUTE revocations, policy deletions, index changes, or production SQL were applied. Function-by-function and policy-by-policy review is required.


## Full public-role policy inventory — 2026-10-17 11:12 UTC

- A complete live catalog query found 37 policies with role `public` across 14 public-schema tables. This is broader than the 12 policies in the focused is_active_user() audit. Because public includes anon, the entire set needs policy-by-policy authorization review and unauthenticated runtime testing.
- Current function ACL inventory found 40 SECURITY DEFINER functions in public; 14 are executable by authenticated and zero by anon. Advisor findings require per-function review, not blanket revocation.
- Do not apply the proposed 12-policy migration to production while the broader public-policy inventory and migration-version parity are unresolved. No production changes were made.


## Public intake runtime finding — 2026-10-17 11:15 UTC

- Read-only inspection of the deployed `public-request` Edge Function (active, verify_jwt=false) found POST-only handling with no OPTIONS preflight branch and no Access-Control-Allow-* headers, while the browser form uses fetch with Content-Type application/json. This likely blocks cross-origin browser submission at preflight; runtime browser verification is still pending.
- Draft PR #26 adds the missing source file to the implementation branch, handles OPTIONS/CORS, fails closed when the rate-limit lookup errors, and adds contract tests. It has not been deployed. Verify OPTIONS from the actual site origin and POST behavior before deployment.
- Draft PR #23's branch is now two commits behind `buildwise-implementation`; its CI passed on the previous head, but branch synchronization and rerunning CI are required before it can be considered merge-ready.
