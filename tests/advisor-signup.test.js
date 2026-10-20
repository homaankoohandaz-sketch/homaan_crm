import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync('buildwise-app.js', 'utf8');
const migrationPath = 'supabase/migrations/20260927_provision_advisor_role_on_signup.sql';
assert.ok(fs.existsSync(migrationPath), 'advisor signup migration must exist');
const migration = fs.readFileSync(migrationPath, 'utf8');

assert.match(app, /ثبت.?نام.*مشاور/);
assert.match(app, /renderAdvisorSignup/);
assert.match(app, /db\.functions\.invoke\('advisor-signup'/);
assert.doesNotMatch(app, /db\.auth\.signUp\(/, 'signup must go through the server-side function');
const fn = fs.readFileSync('supabase/functions/advisor-signup/index.ts', 'utf8');
assert.match(fn, /validatePassword\(/);
assert.match(fn, /auth\.signUp\(/);
assert.match(fn, /requested_role: "advisor"/);
assert.equal(fs.readFileSync('supabase/functions/advisor-signup/password-policy.mjs', 'utf8').trim(),
  fs.readFileSync('src/core/password-policy.js', 'utf8').replace(/^if \(typeof window.*\n?/m, '').trim(), 'function copy must match src/core/password-policy.js');

assert.match(migration, /requested_role.*advisor/);
assert.match(migration, /app_roles/);
assert.match(migration, /role, active, email/);
assert.match(migration, /'advisor', false/);
assert.match(migration, /on_auth_user_created_provision_advisor/);
assert.match(migration, /security definer/);
assert.match(migration, /revoke execute.*from public, anon, authenticated/);
assert.doesNotMatch(migration, /requested_role.*(?:owner|manager|builder)/);

console.log('advisor signup contract: PASS');
