import test from 'node:test';
import fs from 'node:fs';
import assert from 'node:assert/strict';

const read = (path) => fs.readFileSync(new URL(path, import.meta.url), 'utf8');

test('bulk importer preserves rollback identity for every supported target', () => {
  const agent = read('../../supabase/functions/crm-data-agent/index.ts');
  const migration = read('../../supabase/migrations/20261017200000_import_batch_market_rollback.sql');
  const importer = read('../../src/domains/crm/data-import.js');

  assert.match(agent, /properties:\s*\[[\s\S]*?"import_batch_id"/);
  assert.match(agent, /leads:\s*\[[\s\S]*?"import_batch_id"/);
  assert.match(agent, /market:\s*\[[\s\S]*?"import_batch_id",\s*"raw_payload"/);
  assert.match(agent, /from\("market_price_observations"\)\.upsert/);

  assert.match(migration, /add column if not exists import_batch_id text/i);
  assert.match(migration, /delete from public\.market_price_observations where import_batch_id = p_batch_id/i);
  assert.match(migration, /already_rolled_back/);
  assert.match(migration, /public\.is_manager_user\(\)/);
  assert.match(migration, /for update/);

  assert.match(importer, /from\('import_raw_rows'\)\.insert/);
  assert.match(importer, /failed_rows:failed\.length\+rawFailed\.length/);
});
