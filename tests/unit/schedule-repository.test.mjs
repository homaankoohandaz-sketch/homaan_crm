import test from 'node:test';
import assert from 'node:assert/strict';
import { createProjectScheduleRepository } from '../../src/domains/construction/schedule-repository.js';

function fakeClient() {
  const rows = [];
  return {
    rows,
    from() {
      const state = {};
      return {
        select() { return this; },
        eq(_column, id) { state.id = id; return this; },
        maybeSingle() { return Promise.resolve({ data: rows.find((x) => x.id === state.id) ?? null, error: null }); },
        update(payload) {
          return {
            eq(_column, id) {
              const row = rows.find((x) => x.id === id);
              if (!row) return { select: () => ({ single: () => Promise.resolve({ data: null, error: new Error('not found') }) }) };
              Object.assign(row, payload);
              return { select: () => ({ single: () => Promise.resolve({ data: row, error: null }) }) };
            }
          };
        }
      };
    }
  };
}

test('schedule repository stores schedule and milestones in existing project assumptions', async () => {
  const client = fakeClient();
  client.rows.push({ id: 'p1', assumptions: { projectHierarchy: [] } });
  const repo = createProjectScheduleRepository(client);
  const schedule = {
    start_date: '2026-10-01',
    finish_date: '2026-10-06',
    items: [{ id: 'm1', type: 'milestone', name: 'Structure start', start_date: '2026-10-06', finish_date: '2026-10-06' }]
  };

  const updated = await repo.save('p1', schedule);
  assert.deepEqual(updated.assumptions.projectSchedule, schedule);
  assert.deepEqual(updated.schedule, schedule);
});
