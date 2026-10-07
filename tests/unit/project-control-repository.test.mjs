import test from 'node:test';
import assert from 'node:assert/strict';
import { createProjectControlRepository } from '../../src/domains/construction/project-control-repository.js';

function fakeClient() {
  const tables = {
    construction_projects: [],
    project_schedule_tasks: [],
    project_milestones: []
  };
  let seq = 1;
  const client = {
    from(table) {
      const state = { filters: [] };
      return {
        select() { return this; },
        limit() { return this; },
        order() { return this; },
        eq(column, value) { state.filters.push({ column, value }); return this; },
        maybeSingle() {
          const row = (tables[table] || []).find(x => x.id === state.filters.find(f => f.column === 'id')?.value) ?? null;
          return Promise.resolve({ data: row, error: null });
        },
        insert(payload) {
          const row = { id: seq++, ...payload };
          tables[table].push(row);
          return { select: () => ({ single: () => Promise.resolve({ data: row, error: null }) }) };
        },
        update(payload) {
          return {
            eq(_column, value) {
              const row = (tables[table] || []).find(x => x.id === value);
              if (row) Object.assign(row, payload);
              return { select: () => ({ single: () => Promise.resolve({ data: row ?? null, error: null }) }) };
            }
          };
        },
        then(resolve, reject) {
          try {
            let rows = tables[table] || [];
            for (const f of state.filters) rows = rows.filter(r => r[f.column] === f.value);
            resolve({ data: rows, error: null });
          } catch (e) { reject(e); }
        }
      };
    }
  };
  return { client, tables };
}

test('project control repository loads one canonical vertical snapshot', async () => {
  const { client, tables } = fakeClient();
  tables.construction_projects.push({ id: 42, title: 'Tower' });
  tables.project_schedule_tasks.push({ id: 1, project_id: 42, title: 'Excavation', progress: 50, planned_start: '2026-10-01', planned_finish: '2026-10-05' });
  tables.project_milestones.push({ id: 2, project_id: 42, title: 'Foundation', planned_date: '2026-10-10' });

  const repo = createProjectControlRepository(client);
  const snapshot = await repo.getVertical(42);

  assert.equal(snapshot.project.title, 'Tower');
  assert.equal(snapshot.tasks.length, 1);
  assert.equal(snapshot.milestones.length, 1);
  assert.equal(snapshot.progress.percent, 50);
});

test('project control repository persists project changes without mixing schedule data', async () => {
  const { client, tables } = fakeClient();
  tables.construction_projects.push({ id: 42, title: 'Old', status: 'draft' });
  const repo = createProjectControlRepository(client);

  const updated = await repo.updateProject(42, { title: 'New', status: 'active' });

  assert.equal(updated.title, 'New');
  assert.equal(tables.construction_projects[0].title, 'New');
  assert.equal(tables.project_schedule_tasks.length, 0);
});
