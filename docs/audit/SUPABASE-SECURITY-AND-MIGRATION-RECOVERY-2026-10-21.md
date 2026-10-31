# Supabase security and migration recovery runbook — 2026-10-21

## Current evidence

- Live Supabase migration history has 107 entries.
- The repository reconciliation report records migration versions that do not match a live version, plus versions whose SQL bodies have not been verified.
- Security Advisor reports 14 SECURITY DEFINER functions executable by authenticated.
- The migration in this branch changes operational RLS policies from PUBLIC to authenticated and removes PUBLIC/anon EXECUTE on the 14 flagged functions.

## Why migration repair is not a shortcut

Supabase migration repair changes only supabase_migrations.schema_migrations; it does not execute SQL or validate the actual schema. Mark a version applied only after proving the corresponding schema/data changes already exist. Marking a missing migration applied without proof can skip required changes. Never bulk-mark every mismatch as applied or reverted.

Official references:
- https://supabase.com/docs/guides/deployment/database-migrations
- https://supabase.com/docs/reference/cli/supabase-migration-list
- https://supabase.com/docs/guides/database/functions
- https://supabase.com/docs/guides/database/postgres/row-level-security

## Controlled recovery procedure

Run from a trusted environment with the Supabase CLI linked to the correct project and with a verified backup.

1. Capture current migration status and a secure schema backup:
   supabase migration list
   supabase db dump --linked --schema public --file before-security-hardening.sql

2. Reconcile every repository migration file with live history. Compare timestamps, inspect SQL, and query the live catalog for expected tables, columns, constraints, functions, triggers, and policies. Classify each mismatch as exact already-applied, equivalent under another version (only after SQL equivalence is proven), not applied, or unresolved. Do not apply or repair unresolved entries.

3. Test the proposed migration against a disposable/local database:
   supabase db reset
   supabase test db
   Run build/unit tests too. If history prevents a clean reset, reconstruct a clean baseline in a disposable environment; do not use production as a test environment.

4. Preview remote changes:
   supabase db push --dry-run
   If history mismatch remains, stop and use supabase migration repair --status applied <timestamp> only when database evidence proves the SQL is already present. Use --status reverted only when evidence proves it was not applied. These commands alter the ledger only.

5. Deploy only when the dry run lists exactly the expected migration(s), backup is verified, and tests pass:
   supabase db push
   Re-run Security Advisor, migration list, and authorization tests immediately afterward.

## Required security tests

- Anonymous users cannot select/insert/update/delete CRM operational data.
- Signed-in non-manager users cannot invoke manager-only destructive/editing operations.
- Owners/managers retain intended permissions and ordinary staff retain intended CRM workflows.
- crm_phone_exists and crm_manager_phone do not permit unauthorized phone enumeration/disclosure.
- manager_edit_record enforces a strict table/column allowlist, including malicious identifiers.
- Inspect all 14 function bodies and call sites before revoking authenticated EXECUTE. RLS helpers such as is_owner(), can_write(), and is_active_user() may be required by policies; a blanket revoke can break access control.
- Every exposed SECURITY DEFINER function must have a safe pinned search_path and validate caller identity, role, and caller-controlled arguments.

## Scope of this branch

The migration is proposed and reviewable; this commit has not applied it to production. It intentionally does not rewrite the migration ledger or indiscriminately revoke authenticated execution. The remaining authenticated SECURITY DEFINER warnings must be individually classified and tested before release.
