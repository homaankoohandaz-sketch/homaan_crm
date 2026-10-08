import test from 'node:test';
import assert from 'node:assert/strict';
import { createProjectScheduleRepository } from '../../src/domains/construction/schedule-repository.js';

function fakeClient() {
  const tables = { project_schedule_tasks: [], project_milestones: [], project_wbs: [] };
  let seq = 1;
  const client = {
    from(table) {
      const state = { filters: [] };
      const chain = {
        select() { return this; },
        limit() { return this; },
        order() { return this; },
        eq(column, value) { state.filters.push({ column, value }); return this; },
        insert(payload) {
          const row = { id: seq++, ...payload };
          tables[table].push(row);
          return { select: () => ({ single: () => Promise.resolve({ data: row, error: null }) }) };
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

test('schedule repository creates task with parent and predecessors on relational table', async () => {
  const { client, tables } = fakeClient();
  const repo = createProjectScheduleRepository(client);
  const t1 = await repo.createTask({
    project_id: 1,
    title: 'A',
    planned_start: '2026-10-01',
    planned_finish: '2026-10-10'
  });
  const t2 = await repo.createTask({
    project_id: 1,
    title: 'B',
    parent_task_id: t1.id,
    predecessor_ids: [t1.id],
    planned_start: '2026-10-11',
    planned_finish: '2026-10-20'
  });
  assert.equal(t2.parent_task_id, t1.id);
  assert.deepEqual(t2.predecessor_ids, [t1.id]);
  assert.equal(tables.project_schedule_tasks.length, 2);
});

test('schedule repository lists milestones and wbs by project', async () => {
  const { client } = fakeClient();
  const repo = createProjectScheduleRepository(client);
  await repo.createMilestone({ project_id: 1, title: 'M1', planned_date: '2026-11-01' });
  await repo.createWbs({ project_id: 1, code: '1.1', title: 'W1' });
  const ms = await repo.listMilestones(1);
  const wbs = await repo.listWbs(1);
  assert.equal(ms.length, 1);
  assert.equal(wbs[0].code, '1.1');
});


test('schedule repository clamps progress and deduplicates predecessors', async () => {
  const { client } = fakeClient();
  const repo = createProjectScheduleRepository(client);
  const t = await repo.createTask({
    project_id: 1,
    title: 'A',
    progress: 180,
    predecessor_ids: [4, 4, null, 5]
  });
  assert.equal(t.progress, 100);
  assert.deepEqual(t.predecessor_ids, [4, 5]);
});

test('schedule repository updates task and milestone without crossing tables', async () => {
  const { client, tables } = fakeClient();
  const repo = createProjectScheduleRepository(client);
  const task = await repo.createTask({ project_id: 1, title: 'A' });
  const milestone = await repo.createMilestone({ project_id: 1, title: 'M1' });

  const updatedTask = await repo.updateTask(task.id, { progress: -20, status: 'active' });
  const updatedMilestone = await repo.updateMilestone(milestone.id, { status: 'done' });

  assert.equal(updatedTask.progress, 0);
  assert.equal(updatedTask.status, 'active');
  assert.equal(updatedMilestone.status, 'done');
  assert.equal(tables.project_schedule_tasks[0].status, 'active');
  assert.equal(tables.project_milestones[0].status, 'done');
});
