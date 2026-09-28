import test from 'node:test';
import assert from 'node:assert/strict';
import { createProjectProgressRepository } from '../../src/domains/construction/progress-repository.js';

test('progress repository stores KPI snapshot under existing project assumptions', async () => {
  const rows = [{ id: 'p1', assumptions: {} }];
  const client = {
    from() {
      let id;
      return {
        select() { return this; },
        eq(_column, value) { id = value; return this; },
        maybeSingle() { return Promise.resolve({ data: rows.find((x) => x.id === id) ?? null, error: null }); },
        update(payload) {
          return {
            eq(_column, value) {
              const row = rows.find((x) => x.id === value);
              Object.assign(row, payload);
              return { select: () => ({ single: () => Promise.resolve({ data: row, error: null }) }) };
            }
          };
        }
      };
    }
  };

  const repo = createProjectProgressRepository(client);
  const snapshot = { percent: 62.5, remaining_percent: 37.5, completed_items: 1, total_items: 2 };
  const result = await repo.save('p1', snapshot);

  assert.deepEqual(result.progress, snapshot);
  assert.deepEqual(result.assumptions.projectProgress, snapshot);
});
