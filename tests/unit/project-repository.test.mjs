import test from 'node:test';
import assert from 'node:assert/strict';
import { createProjectRepository } from '../../src/domains/construction/project-repository.js';

function fakeClient() {
  const rows = [];
  const client = {
    from() {
      const state = { op: null, payload: null, id: null };
      const chain = {
        select() { state.op = 'select'; return this; },
        eq(_column, value) { state.id = value; return this; },
        maybeSingle() { return Promise.resolve({ data: rows.find((x) => x.id === state.id) ?? null, error: null }); },
        insert(payload) {
          state.op = 'insert'; state.payload = payload;
          const row = { id: payload.id ?? 'project-1', ...payload };
          rows.push(row);
          return { select: () => ({ single: () => Promise.resolve({ data: row, error: null }) }) };
        },
        update(payload) {
          state.op = 'update'; state.payload = payload;
          return {
            eq(_column, value) {
              const index = rows.findIndex((x) => x.id === value);
              if (index >= 0) rows[index] = { ...rows[index], ...payload };
              return { select: () => ({ single: () => Promise.resolve({ data: rows[index] ?? null, error: null }) }) };
            }
          };
        }
      };
      return chain;
    }
  };
  return { client, rows };
}

test('project repository serializes canonical hierarchy into existing construction_projects assumptions', async () => {
  const { client, rows } = fakeClient();
  const repo = createProjectRepository(client);
  const hierarchy = [
    { id: 'p1', type: 'project', name: 'P1' },
    { id: 'c1', type: 'complex', name: 'C1', parentId: 'p1' },
    { id: 'b1', type: 'building', name: 'B1', parentId: 'c1' }
  ];

  const created = await repo.create({
    id: 'p1',
    title: 'P1',
    hierarchy,
    landArea: 210,
    totalGross: 798.5,
    totalSellable: 678.725,
    totalCapital: 73790000000,
    totalReturn: 146425500000,
    status: 'active'
  });

  assert.equal(created.title, 'P1');
  assert.deepEqual(rows[0].assumptions.projectHierarchy, hierarchy);
  assert.equal(rows[0].gross_built_area, 798.5);
  assert.equal(rows[0].net_sellable_area, 678.725);
  assert.equal(rows[0].estimated_cost, 73790000000);
  assert.equal(rows[0].expected_sale_price, 146425500000);
});

test('project repository reads hierarchy from existing assumptions without changing table shape', async () => {
  const { client, rows } = fakeClient();
  rows.push({
    id: 'p2',
    title: 'P2',
    assumptions: { projectHierarchy: [{ id: 'p2', type: 'project', name: 'P2' }] }
  });
  const repo = createProjectRepository(client);
  const result = await repo.getById('p2');
  assert.deepEqual(result.hierarchy, [{ id: 'p2', type: 'project', name: 'P2' }]);
});
