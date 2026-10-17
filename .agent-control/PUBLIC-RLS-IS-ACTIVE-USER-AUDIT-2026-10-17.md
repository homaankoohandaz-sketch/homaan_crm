# Public RLS / is_active_user audit — 2026-10-17

Scope: live catalog query on Supabase project `beuestoewletjsgmigmf`, plus repository source on `buildwise-implementation`. Proposed migration is not applied.

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
