import test from 'node:test';
import assert from 'node:assert/strict';
import { createProjectProgressRepository } from '../../src/domains/construction/progress-repository.js';

function fakeClient() {
  const tables = {
    project_schedule_tasks: [
      { id: 1, project_id: 'p1', title: 'A', progress: 100, planned_start: '2026-10-01', planned_finish: '2026-10-05' },
      { id: 2, project_id: 'p1', title: 'B', progress: 50, planned_start: '2026-10-06', planned_finish: '2026-10-15' }
    ]
  };
  const client = {
    from(table) {
      const state = { filters: [], id: null, payload: null };
      const chain = {
        select() { return this; },
        limit() { return this; },
        order() { return this; },
        eq(column, value) {
          if (state.payload) state.id = value;
          else state.filters.push({ column, value });
          return this;
        },
        insert(payload) {
          const row = { id: tables[table].length + 1, ...payload };
          tables[table].push(row);
          return { select: () => ({ single: () => Promise.resolve({ data: row, error: null }) }) };
        },
        update(payload) {
          state.payload = payload;
          return {
            eq(_c, value) {
              const row = tables[table].find((x) => x.id === value);
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
      return chain;
    }
  };
  return { client, tables };
}

test('progress repository derives KPI from relational schedule task progress', async () => {
  const { client } = fakeClient();
  const repo = createProjectProgressRepository(client);
  const snap = await repo.get('p1');
  assert.equal(snap.total_items, 2);
  assert.equal(snap.completed_items, 1);
  assert.ok(snap.percent >= 70 && snap.percent <= 80);
});

test('progress repository save updates task progress then recomputes', async () => {
  const { client, tables } = fakeClient();
  const repo = createProjectProgressRepository(client);
  const snap = await repo.save('p1', { items: [{ id: 2, progress: 100 }] });
  assert.equal(tables.project_schedule_tasks.find((t) => t.id === 2).progress, 100);
  assert.equal(snap.completed_items, 2);
  assert.equal(snap.percent, 100);
});


test('progress repository exposes KPI snapshot from canonical task progress', async () => {
  const { client } = fakeClient();
  const repo = createProjectProgressRepository(client);
  const kpi = await repo.getKpis('p1');
  assert.equal(kpi.total_items, 2);
  assert.equal(kpi.completed_items, 1);
  assert.equal(kpi.delayed_items, 0);
  assert.ok(kpi.progress_percent >= 70 && kpi.progress_percent <= 80);
});
