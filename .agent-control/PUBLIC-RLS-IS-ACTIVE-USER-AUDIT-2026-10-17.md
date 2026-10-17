# Public RLS / is_active_user audit — 2026-10-17

Scope: initial live catalog query on Supabase project `beuestoewletjsgmigmf`, plus repository source on `buildwise-implementation`. The original status below is historical; see **Live verification refresh** at the end for newer catalog evidence and the remaining migration-version reconciliation.

## Live RLS policies

The live `pg_policies` query filtered policies whose role is `public` or `anon` and whose USING/WITH CHECK expression contains `is_active_user()`. It returned these 12 records:

| Table | Policy | Command | Expression | Public flow needs direct anon table access? |
|---|---|---|---|---|
| `app_roles` | `app_roles_select_colleagues` | SELECT | `is_active_user()` | No direct anon use found; app reads after session exists. |
| `appointments` | `appointments_select` | SELECT | `is_active_user()` | No direct anon use found. |
| `deals` | `deals_select` | SELECT | `is_active_user()` | No direct anon use found; app deal screens are authenticated. |
| `followups` | `followups_select` | SELECT | `is_active_user()` | No direct anon use found. |
| `import_batches` | `import_batches_select` | SELECT | `is_active_user()` | No direct anon use found. |
| `leads` | `leads_select` | SELECT | `is_active_user()` | No direct anon use found; app lead screens are authenticated. |
| `owners` | `owners_select` | SELECT | `is_active_user()` | No direct anon use found. |
| `properties` | `properties_select` | SELECT | `is_active_user()` | Customer portal reads property fields through its service-role Edge Function; app file screens require session. |
| `property_documents` | `property_documents_select` | SELECT | `is_active_user()` | Customer portal reads selected photo/render/presentation documents through its service-role Edge Function. |
| `property_images` | `property_images_select` | SELECT | `is_active_user()` | No direct anon use found. |
| `property_photos` | `property_photos_select` | SELECT | `is_active_user()` | Customer portal reads photos through its service-role Edge Function. |
| `user_reports` | `user_reports_insert` | INSERT | `auth.uid() = reporter_id AND reporter_id <> reported_user_id AND is_active_user()` | No direct anon use found; the `auth.uid()` condition already requires an authenticated identity. |

## Edge Function and frontend evidence

- `buildwise-app.js` sends the public intake form to `/functions/v1/public-request`; it does not directly insert into `public_requests` from the browser.
- The repository path `supabase/functions/public-request/index.ts` was not found on the inspected implementation branch. Therefore the Edge Function's internal client/credential and database access could not be verified from source; do not infer that it uses the service role until its deployed/source implementation is checked.
- `supabase/functions/customer-portal/index.ts` explicitly creates its Supabase client with `SUPABASE_SERVICE_ROLE_KEY`. Its public GET/POST flow reads `customer_shares`, nested `properties`, `property_documents`, and `property_photos`, then writes response/share/alert rows through that service-role client. Those operations bypass table RLS and do not require anon EXECUTE on `is_active_user()`.
- Authenticated app startup calls `auth.getSession()` and reads `app_roles` only after confirming a user session.
- “No direct anon use found” means no direct browser query was found in the inspected source; it is not proof that no external client uses the REST API anonymously.

## Proposed migration and test

- `supabase/migrations/20261017120000_scope_is_active_user_policies.sql` drops/recreates all 12 identified policies for `authenticated`, then revokes function EXECUTE from `PUBLIC` and `anon` and grants it to `authenticated`.
- `tests/unit/is-active-user-public-rls.test.mjs` asserts the intended ACL/policy migration and that public intake continues to route through the public-request Edge Function while customer-portal continues to use its service-role client.
- These are static contract tests. They do NOT prove deployed public pages respond successfully at runtime. A live unauthenticated GET/POST test against a safe test share and a public-request submission test are still required after a reviewed deployment.
- This migration has NOT been applied to Supabase.


## Live verification refresh — 2026-10-17 10:57 UTC

A later read-only query against the same Supabase project found:

- The live migration history contains version `20261017044414`, named `scope_is_active_user_policies_20261017`.
- The repository contains `supabase/migrations/20261017120000_scope_is_active_user_policies.sql`, but version `20261017120000` was not present in the live migration list at the time of the query.
- Live `pg_policies` rows for the 12 named policies in this audit now show role `{authenticated}`, not `{public}` or `{anon}`.
- `has_function_privilege('anon', 'public.is_active_user()', 'EXECUTE')` returned false; authenticated EXECUTE returned true.
- All ordinary tables in the live `public` schema returned by the RLS-disabled table query had RLS enabled.

### Updated disposition

The **live behavior currently matches the intended policy scope and function ACL** for the reviewed helper. The old statement that the proposed migration is definitely unapplied is stale as a description of live behavior. However, the applied SQL source/version has not been reconciled byte-for-byte with the repository file: live history reports version `20261017044414`, while the checked-in proposal is timestamped `20261017120000`.

Do not reapply the proposed migration or create a duplicate timestamp migration merely to make the numbers match. First recover the exact SQL associated with live version `20261017044414` from the original change/authoritative deployment record, compare it with the checked-in file, and then correct repository migration parity through a reviewed, non-destructive change. Public customer flows still need authenticated/unauthenticated runtime regression tests; catalog evidence and static tests do not prove those flows work end to end.


## Security Advisor refresh — 2026-10-17 11:05 UTC

A fresh read of the Supabase Security Advisor returned broader findings than the targeted catalog query above:

- 14 SECURITY DEFINER functions are callable by authenticated. This is a review queue, not proof that all 14 are exploitable. Review each function body, authorization guard, exposed data, and intended caller before changing EXECUTE grants.
- The advisor reported anonymous-role policy findings on multiple tables, including activity_logs, agent_tool_permissions, and ai_actions. This is not identical in scope to the targeted query of the 12 named is_active_user() policies. Do not treat the earlier targeted result as proof that every policy in the project excludes anon; enumerate all live policies and inspect each USING/WITH CHECK predicate and role.
- The advisor also reported 34 multiple-permissive-policy findings. These are potential performance/maintainability issues and should be consolidated only after semantic equivalence and role behavior are verified.
- These advisor findings are newer evidence and remain unresolved. No grants, policies, or production schema were changed by this audit.
- Remediation order: (1) enumerate all anon/public policies and test access with an unauthenticated client; (2) review each SECURITY DEFINER function individually; (3) consolidate duplicate permissive policies only after tests. Do not blanket-revoke function EXECUTE or remove public policies needed by Edge Function-backed customer flows.


## Full live policy inventory — 2026-10-17 11:12 UTC

A separate read-only inventory now confirms **37 policies assigned to role `public` across 14 tables**: `activity_logs`, `app_roles`, `appointments`, `deals`, `followups`, `import_batches`, `invited_emails`, `leads`, `owners`, `properties`, `property_documents`, `property_images`, `property_photos`, and `user_reports`. Because `public` includes anonymous requests, these policies require explicit review even where predicates call helper functions that currently deny anon EXECUTE. The prior focused query covered only the 12 policies that call `is_active_user()` and was not a complete public-policy audit.

A catalog inventory also found **40 SECURITY DEFINER functions in `public`, of which 14 are executable by `authenticated` and none by `anon`** in the current privilege check. The advisor's 14-function warning is therefore confirmed as a review list, not by itself evidence of a privilege bypass.

### Immediate disposition

- Treat public-role policy scope as an open P0 security review item. For each of the 37 policies, verify whether direct anonymous access is intended and test the actual anon request path.
- Public intake/customer-share flows appear designed to use Edge Functions, but runtime checks and the deployed `public-request` implementation still need verification. Do not scope every policy to authenticated until that dependency check is complete.
- Do not apply the checked-in 12-policy proposal on production: the live inventory is broader, and the exact migration source/version mismatch remains unresolved.
