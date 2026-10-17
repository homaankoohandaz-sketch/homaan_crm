import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const read = (p) => fs.readFileSync(new URL("../../" + p, import.meta.url), "utf8");
const migration = read("supabase/migrations/20261017120000_scope_is_active_user_policies.sql");
const app = read("buildwise-app.js");
const portal = read("supabase/functions/customer-portal/index.ts");

const policies = [
  ["app_roles", "app_roles_select_colleagues"],
  ["appointments", "appointments_select"],
  ["deals", "deals_select"],
  ["followups", "followups_select"],
  ["import_batches", "import_batches_select"],
  ["leads", "leads_select"],
  ["owners", "owners_select"],
  ["properties", "properties_select"],
  ["property_documents", "property_documents_select"],
  ["property_images", "property_images_select"],
  ["property_photos", "property_photos_select"],
  ["user_reports", "user_reports_insert"],
];

test("each public is_active_user policy is recreated for authenticated only", () => {
  for (const [table, policy] of policies) {
    assert.match(migration, new RegExp("drop policy if exists " + policy + " on public\\." + table + ";", "i"));
    assert.match(migration, new RegExp("create policy " + policy + " on public\\." + table + "[\\s\\S]*?to authenticated", "i"));
  }
  assert.match(migration, /revoke execute on function public\.is_active_user\(\) from PUBLIC, anon;/i);
  assert.match(migration, /grant execute on function public\.is_active_user\(\) to authenticated;/i);
});

test("public request entry continues through the public-request Edge Function", () => {
  assert.match(app, /functions\/v1\/public-request/);
  assert.match(app, /function renderPublic\(\)/);
  assert.match(app, /function submitPublicRequest\(\)/);
});

test("customer portal remains independent of anon table RLS via its service-role client", () => {
  assert.match(portal, /SUPABASE_SERVICE_ROLE_KEY/);
  assert.match(portal, /createClient\(SUPABASE_URL, SERVICE_KEY\)/);
  assert.match(portal, /db\.from\("customer_shares"\)/);
  assert.match(portal, /db\.from\("property_documents"\)/);
  assert.match(portal, /db\.from\("property_photos"\)/);
});
