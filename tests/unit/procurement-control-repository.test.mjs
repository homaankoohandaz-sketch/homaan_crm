import test from 'node:test';
import assert from 'node:assert/strict';
import { createProjectProcurementControlRepository } from '../../src/domains/construction/procurement-control-repository.js';

function fakeClient() {
  const tables = { project_procurement: [] };
  return {
    from(table) {
      const state = { filters: [] };
      return {
        select() { return this; },
        limit() { return this; },
        order() { return this; },
        eq(column, value) { state.filters.push({ column, value }); return this; },
        then(resolve) {
          let rows = tables[table] || [];
          for (const f of state.filters) rows = rows.filter(row => row[f.column] === f.value);
          resolve({ data: rows, error: null });
        }
      };
    }
  };
}

test('procurement control snapshot exposes project-scoped plan and operational KPIs', async () => {
  const client = fakeClient();
  client.from('project_procurement');
  const originalFrom = client.from.bind(client);
  const rows = [
    { id: 1, project_id: 42, item_name: 'cement', quantity: 100, received_quantity: 40, required_at: '2026-10-10', status: 'ordered', supplier_name: 'A' },
    { id: 2, project_id: 42, item_name: 'rebar', quantity: 50, received_quantity: 50, required_at: '2026-10-12', status: 'delivered', supplier_name: 'B' }
  ];
  client.from = (table) => {
    const q = originalFrom(table);
    if (table === 'project_procurement') {
      const base = q;
      base.then = (resolve) => resolve({ data: rows, error: null });
      return base;
    }
    return q;
  };

  const repo = createProjectProcurementControlRepository(client);
  const snapshot = await repo.getVertical(42);

  assert.equal(snapshot.items.length, 2);
  assert.equal(snapshot.items[0].item_name, 'cement');
  assert.equal(snapshot.kpis.total_items, 2);
  assert.equal(snapshot.kpis.delivered_items, 1);
  assert.equal(snapshot.kpis.outstanding_quantity, 60);
  assert.equal(snapshot.kpis.open_items, 1);
});
