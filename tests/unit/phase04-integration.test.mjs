import test from 'node:test';
import assert from 'node:assert/strict';
import { createHierarchyRepository } from '../../src/domains/construction/hierarchy-repository.js';
import { createProjectScheduleRepository } from '../../src/domains/construction/schedule-repository.js';
import { createProjectBoqRepository } from '../../src/domains/construction/boq-repository.js';
import { createProjectProgressRepository } from '../../src/domains/construction/progress-repository.js';
import { createProjectProcurementRepository } from '../../src/domains/construction/procurement-repository.js';

function fakeClient() {
  const tables = {
    project_complexes: [],
    project_buildings: [],
    project_floors: [],
    project_units: [],
    project_schedule_tasks: [],
    project_milestones: [],
    project_wbs: [],
    project_boq_items: [],
    project_procurement: []
  };
  let seq = 1;
  const client = {
    from(table) {
      const state = { filters: [], payload: null };
      return {
        select() { return this; },
        limit() { return this; },
        order() { return this; },
        eq(column, value) {
          state.filters.push({ column, value });
          return this;
        },
        insert(payload) {
          if (table === 'project_boq_items') assert.equal(payload.budget_amount, undefined);
          if (table === 'project_procurement') assert.equal(payload.total_price, undefined);
          const row = { id: seq++, ...payload };
          tables[table].push(row);
          return { select: () => ({ single: () => Promise.resolve({ data: row, error: null }) }) };
        },
        update(payload) {
          state.payload = payload;
          return {
            eq(_c, value) {
              const row = (tables[table] || []).find((x) => x.id === value);
              if (row) Object.assign(row, payload);
              return { select: () => ({ single: () => Promise.resolve({ data: row ?? null, error: null }) }) };
            }
          };
        },
        then(resolve, reject) {
          try {
            let rows = tables[table] ?? [];
            for (const f of state.filters) rows = rows.filter((r) => r[f.column] === f.value);
            resolve({ data: rows, error: null });
          } catch (e) { reject(e); }
        }
      };
    }
  };
  return { client, tables };
}

test('phase04 integration: hierarchy → schedule → progress → boq → procurement', async () => {
  const { client, tables } = fakeClient();
  const hier = createHierarchyRepository(client);
  const schedule = createProjectScheduleRepository(client);
  const progress = createProjectProgressRepository(client);
  const boq = createProjectBoqRepository(client);
  const proc = createProjectProcurementRepository(client);

  const cx = await hier.createComplex({ project_id: 42, name: 'Complex A' });
  const b = await hier.createBuilding({ complex_id: cx.id, name: 'Tower 1' });
  const f = await hier.createFloor({ building_id: b.id, floor_number: 1 });
  await hier.createUnit({ floor_id: f.id, unit_code: '101' });

  const t1 = await schedule.createTask({
    project_id: 42,
    title: 'Excavation',
    planned_start: '2026-10-01',
    planned_finish: '2026-10-10',
    progress: 100
  });
  await schedule.createTask({
    project_id: 42,
    title: 'Foundation',
    parent_task_id: t1.id,
    predecessor_ids: [t1.id],
    planned_start: '2026-10-11',
    planned_finish: '2026-10-30',
    progress: 40
  });

  const snap = await progress.get(42);
  assert.equal(snap.total_items, 2);
  assert.equal(snap.completed_items, 1);

  const item = await boq.createItem({ project_id: 42, item_name: 'Concrete', planned_qty: 50, unit_budget: 10 });
  const pr = await proc.create({
    project_id: 42,
    item_name: 'Concrete',
    boq_item_id: item.id,
    quantity: 50,
    unit_price: 10,
    status: 'requested'
  });

  assert.equal(pr.item_name, 'Concrete');
  assert.equal(tables.project_units.length, 1);
  assert.equal(tables.project_schedule_tasks.length, 2);
  assert.equal(tables.project_boq_items.length, 1);
  assert.equal(tables.project_procurement.length, 1);
});
