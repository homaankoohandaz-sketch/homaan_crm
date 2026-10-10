import test from 'node:test';
import assert from 'node:assert/strict';
import { createProjectRepository } from '../../src/domains/construction/project-repository.js';

function fakeClient() {
  const rows = [];
  const client = {
    from() {
      const state = { id: null };
      return {
        select() { return this; },
        eq(_c, value) { state.id = value; return this; },
        maybeSingle() {
          return Promise.resolve({ data: rows.find((x) => x.id === state.id) ?? null, error: null });
        },
        insert(payload) {
          const row = { id: payload.id ?? 'project-1', ...payload };
          rows.push(row);
          return { select: () => ({ single: () => Promise.resolve({ data: row, error: null }) }) };
        },
        update(payload) {
          return {
            eq(_c, value) {
              const index = rows.findIndex((x) => x.id === value);
              if (index >= 0) rows[index] = { ...rows[index], ...payload };
              return { select: () => ({ single: () => Promise.resolve({ data: rows[index] ?? null, error: null }) }) };
            }
          };
        }
      };
    }
  };
  return { client, rows };
}

test('project repository persists project fields without hierarchy in assumptions', async () => {
  const { client, rows } = fakeClient();
  const repo = createProjectRepository(client);
  const created = await repo.create({
    id: 'p1',
    title: 'P1',
    hierarchy: [{ id: 'x', type: 'complex' }],
    landArea: 210,
    totalGross: 798.5,
    totalSellable: 678.725,
    totalCapital: 73790000000,
    totalReturn: 146425500000,
    status: 'active',
    createdBy: 'manager-1'
  });
  assert.equal(created.title, 'P1');
  assert.equal(rows[0].gross_built_area, 798.5);
  assert.equal(rows[0].created_by, 'manager-1');
  assert.ok(!rows[0].assumptions?.projectHierarchy);
});

test('project repository reads project row without inventing hierarchy from assumptions', async () => {
  const { client, rows } = fakeClient();
  rows.push({ id: 'p2', title: 'P2', assumptions: { projectHierarchy: [{ id: 'legacy' }] } });
  const repo = createProjectRepository(client);
  const result = await repo.getById('p2');
  assert.equal(result.title, 'P2');
  assert.equal(result.hierarchy, undefined);
});
