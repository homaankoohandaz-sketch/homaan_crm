import test from 'node:test';
import assert from 'node:assert/strict';
import { createTaskRepository } from '../src/core/task-repository.js';

const baseTask = {
  id: 'task-001',
  title: 'پیگیری مالک',
  context_type: 'crm',
  subject_type: 'deal',
  related_entity_id: 'deal-001',
  created_by: 'user-001',
  assigned_to: 'user-002',
  scheduled_date: '2026-09-28',
  priority: 'normal',
};

function createFakeClient() {
  const rows = new Map();
  return {
    rows,
    from(table) {
      assert.equal(table, 'tasks');
      return new Query(rows);
    },
  };
}

class Query {
  constructor(rows) {
    this.rows = rows;
    this.filters = [];
    this.payload = null;
    this.operation = null;
  }

  select() { return this; }
  limit() { return this; }
  order() { return this; }
  in() { return this; }
  gte() { return this; }
  lte() { return this; }
  ilike() { return this; }
  neq() { return this; }
  is() { return this; }

  eq(column, value) {
    this.filters.push([column, value]);
    return this;
  }

  maybeSingle() {
    const row = this.find();
    return Promise.resolve({ data: row ?? null, error: null });
  }

  single() {
    if (this.operation === 'update') {
      const id = this.filters.find(([column]) => column === 'id')?.[1];
      const current = this.rows.get(id);
      const row = current ? { ...current, ...this.payload } : null;
      if (row) this.rows.set(id, row);
      return Promise.resolve({ data: row, error: null });
    }
    const row = this.payload ?? this.find();
    return Promise.resolve({ data: row ?? null, error: null });
  }

  insert(payload) {
    this.operation = 'insert';
    this.payload = payload;
    this.rows.set(payload.id, payload);
    return this;
  }

  update(payload) {
    this.operation = 'update';
    this.payload = payload;
    return this;
  }

  find() {
    const id = this.filters.find(([column]) => column === 'id')?.[1];
    return id ? this.rows.get(id) : [...this.rows.values()][0];
  }

  // Awaitable list result for repository.list()
  then(resolve, reject) {
    return Promise.resolve({ data: [...this.rows.values()], error: null }).then(resolve, reject);
  }
}

test('task repository persists canonical task lifecycle changes', async () => {
  const client = createFakeClient();
  const repo = createTaskRepository(client);

  const created = await repo.create(baseTask, { now: '2026-09-27T09:00:00.000Z' });
  assert.equal(created.status, 'open');

  const answered = await repo.respond('task-001', 'yes', {
    now: '2026-09-27T09:05:00.000Z',
  });
  assert.equal(answered.status, 'in_progress');
  assert.equal(answered.response, 'yes');

  const starred = await repo.setStarred('task-001', true, {
    now: '2026-09-27T09:06:00.000Z',
  });
  assert.equal(starred.starred, true);

  const completed = await repo.complete('task-001', {
    now: '2026-09-27T09:10:00.000Z',
  });
  assert.equal(completed.status, 'completed');
  assert.equal(completed.completed_at, '2026-09-27T09:10:00.000Z');
});

test('task repository returns null for missing task mutation', async () => {
  const repo = createTaskRepository(createFakeClient());
  assert.equal(await repo.complete('missing-task'), null);
});

test('task repository validates before persistence', async () => {
  const repo = createTaskRepository(createFakeClient());
  await assert.rejects(
    () => repo.create({ ...baseTask, priority: 'urgent' }),
    /Invalid priority/,
  );
});

test('task repository maps canonical task fields to the live tasks schema', async () => {
  const client = createFakeClient();
  const repo = createTaskRepository(client);
  await repo.create({ ...baseTask, scheduled_time: '10:30', deadline: '2026-09-28T18:00:00.000Z' });
  const persisted = client.rows.get('task-001');
  assert.equal(persisted.context_type, 'crm');
  assert.equal(persisted.subject_type, 'deal');
  assert.equal(persisted.related_entity_id, 'deal-001');
  assert.equal(persisted.scheduled_date, '2026-09-28');
  assert.equal(persisted.scheduled_time, '10:30');
  assert.equal(persisted.deadline, '2026-09-28T18:00:00.000Z');
});

test('task repository calendar queries filter via canonical engine helpers', async () => {
  const client = createFakeClient();
  const repo = createTaskRepository(client);

  await repo.create({
    ...baseTask,
    id: 't1',
    assigned_to: 'u-a',
    scheduled_date: '2026-10-04',
    deadline: '2026-10-10T18:00:00.000Z',
  });
  await repo.create({
    ...baseTask,
    id: 't2',
    context_type: 'construction',
    subject_type: 'construction',
    related_entity_id: 'wbs-1',
    assigned_to: 'u-b',
    scheduled_date: '2026-10-04',
    deadline: '2026-10-03T12:00:00.000Z',
  });
  await repo.create({
    ...baseTask,
    id: 't3',
    assigned_to: 'u-a',
    scheduled_date: '2026-10-05',
    deadline: '2026-10-12T18:00:00.000Z',
  });
  await repo.setStarred('t3', true);

  const day = await repo.listForDay('u-a', '2026-10-04');
  assert.equal(day.length, 1);
  assert.equal(day[0].id, 't1');

  const team = await repo.listTeamForDay('2026-10-04');
  assert.equal(team.length, 2);

  const overdue = await repo.listOverdue('2026-10-04T00:00:00.000Z');
  assert.equal(overdue.map((t) => t.id).join(','), 't2');

  const starred = await repo.listStarred();
  assert.equal(starred.length, 1);
  assert.equal(starred[0].id, 't3');

  const crm = await repo.listByContext('crm');
  assert.equal(crm.length, 2);
});
