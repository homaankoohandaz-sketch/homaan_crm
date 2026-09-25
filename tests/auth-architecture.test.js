import assert from 'node:assert/strict';
import fs from 'node:fs';

const authPath = 'supabase/functions/_shared/auth.ts';
const sheetsPath = 'supabase/functions/google-sheets-sync/index.ts';

assert.ok(fs.existsSync(authPath), 'shared auth module must exist');
const auth = fs.readFileSync(authPath, 'utf8');
const sheets = fs.readFileSync(sheetsPath, 'utf8');

assert.match(auth, /SUPABASE_ANON_KEY/);
assert.match(auth, /SUPABASE_SERVICE_ROLE_KEY/);
assert.match(auth, /getUser\(/);
assert.match(auth, /app_roles/);
assert.match(auth, /active/);
assert.match(auth, /requireRole/);

assert.match(sheets, /_shared\/auth/);
assert.match(sheets, /requireRole/);
assert.doesNotMatch(sheets, /auth\.replace\(['"]Bearer /);

console.log('auth architecture contract: PASS');
