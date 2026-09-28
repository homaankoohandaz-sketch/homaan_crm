import test from 'node:test';
import assert from 'node:assert/strict';
import { createHierarchyRepository } from '../../src/domains/construction/hierarchy-repository.js';

function fakeClient() {
  const tables = {
    project_complexes: [],
    project_buildings: [],
    project_floors: [],
    project_units: []
  };
  let seq = 1;
  const client = {
    from(table) {
      const state = { filters: [] };
      const chain = {
        select() { return this; },
        eq(column, value) { state.filters.push({ column, value }); return this; },
        order() { return this; },
        limit() { return this; },
        then(resolve) {
          let rows = tables[table] ?? [];
          for (const f of state.filters) rows = rows.filter((r) => r[f.column] === f.value);
          resolve({ data: rows, error: null });
        },
        insert(payload) {
          const row = { id: seq++, ...payload };
          tables[table].push(row);
          return { select: () => ({ single: () => Promise.resolve({ data: row, error: null }) }) };
        }
      };
      return chain;
    }
  };
  return { client, tables };
}

test('hierarchy repository creates complex/building/floor/unit relational chain', async () => {
  const { client, tables } = fakeClient();
  const repo = createHierarchyRepository(client);
  const cx = await repo.createComplex({ project_id: 1, name: 'C1', code: 'C' });
  assert.equal(cx.name, 'C1');
  const b = await repo.createBuilding({ complex_id: cx.id, name: 'B1', floors_planned: 2 });
  assert.equal(b.complex_id, cx.id);
  const f = await repo.createFloor({ building_id: b.id, floor_number: 1, name: 'F1' });
  assert.equal(f.building_id, b.id);
  const u = await repo.createUnit({ floor_id: f.id, unit_code: 'U1', unit_type: 'residential' });
  assert.equal(u.floor_id, f.id);
  assert.equal(tables.project_units.length, 1);
});

test('hierarchy repository rejects missing project_id on complex', async () => {
  const { client } = fakeClient();
  const repo = createHierarchyRepository(client);
  await assert.rejects(() => repo.createComplex({ name: 'X' }), /project_id/);
});
