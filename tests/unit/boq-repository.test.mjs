import test from 'node:test';
import assert from 'node:assert/strict';
import { createProjectBoqRepository } from '../../src/domains/construction/boq-repository.js';

function fakeClient() {
  const tables = { project_boq_items: [] };
  let seq = 1;
  const client = {
    from(table) {
      const state = { filters: [] };
      return {
        select() { return this; },
        eq(column, value) { state.filters.push({ column, value }); return this; },
        order() { return this; },
        limit() {
          return {
            then(resolve) {
              let rows = tables[table] ?? [];
              for (const f of state.filters) rows = rows.filter((r) => r[f.column] === f.value);
              resolve({ data: rows, error: null });
            }
          };
        },
        insert(payload) {
          assert.equal(payload.budget_amount, undefined);
          const row = { id: seq++, ...payload };
          tables[table].push(row);
          return { select: () => ({ single: () => Promise.resolve({ data: row, error: null }) }) };
        }
      };
    }
  };
  return { client, tables };
}

test('boq repository creates item on project_boq_items without generated budget_amount', async () => {
  const { client, tables } = fakeClient();
  const repo = createProjectBoqRepository(client);
  const row = await repo.createItem({
    project_id: 1,
    item_name: 'Cement',
    planned_qty: 10,
    unit_budget: 100
  });
  assert.equal(row.item_name, 'Cement');
  assert.equal(tables.project_boq_items.length, 1);
});
