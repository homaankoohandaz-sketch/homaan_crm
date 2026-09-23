import test from 'node:test';
import assert from 'node:assert/strict';
import { createRepository } from '../../src/core/data/repository.js';
import { getRuntimeConfig } from '../../src/core/runtime/config.js';

test('runtime config normalizes the Supabase URL', () => {
  const config = getRuntimeConfig({ __BUILDWISE_CONFIG__: { SUPABASE_URL: 'https://example.supabase.co/' } });
  assert.equal(config.supabaseUrl, 'https://example.supabase.co');
  assert.equal(config.functionsBaseUrl, 'https://example.supabase.co/functions/v1');
});

test('repository rejects invalid table names', () => {
  assert.throws(() => createRepository({ from() {} }, 'bad-table-name!'), /Invalid table name/);
});

test('repository builds safe CRUD boundary', async () => {
  const calls = [];
  const chain = {
    select() { calls.push('select'); return this; },
    limit() { calls.push('limit'); return this; },
    eq() { calls.push('eq'); return this; },
    order() { calls.push('order'); return this; },
    maybeSingle() { return Promise.resolve({ data: { id: '1' }, error: null }); },
    insert() { calls.push('insert'); return this; },
    update() { calls.push('update'); return this; },
    single() { return Promise.resolve({ data: { id: '1' }, error: null }); }
  };
  const client = { from(table) { calls.push('from:' + table); return chain; } };
  const repo = createRepository(client, 'crm_people');

  await repo.list({ filters: [{ column: 'active', value: true }], limit: 10 });
  await repo.getById('1');
  await repo.create({ name: 'test' });
  await repo.updateById('1', { name: 'updated' });

  assert.deepEqual(calls, [
    'from:crm_people','select','limit','eq',
    'from:crm_people','select','eq',
    'from:crm_people','insert',
    'from:crm_people','update'
  ]);
});
