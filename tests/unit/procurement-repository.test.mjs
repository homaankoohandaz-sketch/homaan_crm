import test from 'node:test';
import assert from 'node:assert/strict';
import { createProjectProcurementRepository } from '../../src/domains/construction/procurement-repository.js';

test('procurement repository creates normalized project procurement records', async () => {
  const inserted = [];
  const client = {
    from() {
      return {
        insert(payload) {
          inserted.push(payload);
          return { select: () => ({ single: () => Promise.resolve({ data: { id: 7, ...payload }, error: null }) }) };
        }
      };
    }
  };

  const repo = createProjectProcurementRepository(client);
  const result = await repo.create({
    project_id: 3,
    item_name: 'میلگرد',
    quantity: '12',
    unit_price: '25000000',
    status: 'ordered',
    specification: 'A3'
  });

  assert.equal(result.id, 7);
  assert.equal(result.quantity, 12);
  assert.equal(result.unit_price, 25000000);
  assert.equal(inserted[0].item_name, 'میلگرد');
  assert.equal(inserted[0].status, 'ordered');
  assert.equal(inserted[0].total_price, undefined);
});

test('procurement repository rejects invalid input before persistence', async () => {
  let called = false;
  const client = {
    from() {
      return {
        insert() { called = true; throw new Error('must not persist'); }
      };
    }
  };

  const repo = createProjectProcurementRepository(client);
  await assert.rejects(() => repo.create({ project_id: 3, item_name: '', quantity: 1 }), /item_name is required/);
  await assert.rejects(() => repo.create({ project_id: 3, item_name: 'A', status: 'unknown' }), /invalid procurement status/);
  assert.equal(called, false);
});

test('procurement repository scopes listing to a project', async () => {
  const filters = [];
  const client = {
    from() {
      return {
        select() { return this; },
        limit() { return this; },
        eq(column, value) { filters.push({ column, value }); return this; },
        order() { return this; },
        then(resolve) { return Promise.resolve({ data: [{ id: 1, project_id: 9 }], error: null }).then(resolve); }
      };
    }
  };

  const repo = createProjectProcurementRepository(client);
  const rows = await repo.listByProject(9);
  assert.deepEqual(rows, [{ id: 1, project_id: 9 }]);
  assert.deepEqual(filters, [{ column: 'project_id', value: 9 }]);
});
