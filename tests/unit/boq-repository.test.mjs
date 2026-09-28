import test from 'node:test';
import assert from 'node:assert/strict';
import { createProjectBoqRepository } from '../../src/domains/construction/boq-repository.js';

test('BOQ repository persists calculated BOQ under existing project assumptions', async () => {
  const rows = [{ id: 'p1', assumptions: { existing: true } }];
  const client = {
    from() {
      let id;
      return {
        select() { return this; },
        eq(_column, value) { id = value; return this; },
        maybeSingle() {
          return Promise.resolve({ data: rows.find((x) => x.id === id) ?? null, error: null });
        },
        update(payload) {
          return {
            eq(_column, value) {
              const row = rows.find((x) => x.id === value);
              if (!row) return { select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) };
              Object.assign(row, payload);
              return { select: () => ({ single: () => Promise.resolve({ data: row, error: null }) }) };
            }
          };
        }
      };
    }
  };

  const repo = createProjectBoqRepository(client);
  const items = [
    { id: 'c1', description: 'Concrete', quantity: 10, unit_cost: 5000000, category: 'structure' },
    { id: 'f1', description: 'Finish', quantity: 4, unit_cost: 2500000, category: 'finish' }
  ];

  const result = await repo.save('p1', items);

  assert.equal(result.boq.total, 60000000);
  assert.equal(result.boq.by_category.structure, 50000000);
  assert.equal(result.boq.by_category.finish, 10000000);
  assert.deepEqual(result.assumptions.existing, true);
  assert.deepEqual(result.assumptions.projectBoq, result.boq);
});

test('BOQ repository returns null for an unknown project', async () => {
  const client = {
    from() {
      return {
        select() { return this; },
        eq() { return this; },
        maybeSingle() { return Promise.resolve({ data: null, error: null }); }
      };
    }
  };

  const repo = createProjectBoqRepository(client);
  assert.equal(await repo.save('missing', []), null);
});
