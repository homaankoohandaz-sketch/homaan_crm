import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync('buildwise-app.js', 'utf8');
const signupPath = 'supabase/functions/advisor-signup/index.ts';
assert.ok(fs.existsSync(signupPath), 'advisor signup edge function must exist');
const fn = fs.readFileSync(signupPath, 'utf8');

assert.match(app, /ثبت.?نام.*مشاور/);
assert.match(app, /signUp\(/);
assert.match(app, /advisor-signup/);
assert.match(fn, /role.*advisor/);
assert.match(fn, /active.*false/);
assert.match(fn, /app_roles/);
assert.match(fn, /getUser\(/);
assert.doesNotMatch(fn, /owner|manager|builder/);

console.log('advisor signup contract: PASS');
