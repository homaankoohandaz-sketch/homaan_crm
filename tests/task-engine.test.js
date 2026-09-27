import assert from 'node:assert/strict';
import {
  createTask,
  respondToTask,
  completeTask,
  moveTaskToTomorrow,
  isTaskOverdue,
} from '../src/core/task-engine.js';

const baseInput = {
  id: 'task-001',
  title: 'پیگیری مالک',
  context_type: 'crm',
  subject_type: 'deal',
  related_entity_id: 'deal-001',
  created_by: 'user-001',
  assigned_to: 'user-002',
  scheduled_date: '2026-09-28',
  scheduled_time: '10:30',
  deadline: '2026-09-28T18:00:00.000Z',
  priority: 'important',
};

const created = createTask(baseInput, {
  now: '2026-09-27T09:00:00.000Z',
});

assert.equal(created.status, 'open');
assert.equal(created.response, null);
assert.equal(created.starred, false);
assert.equal(created.priority, 'important');
assert.equal(created.notification_enabled, false);
assert.equal(created.created_at, '2026-09-27T09:00:00.000Z');

const answered = respondToTask(created, 'yes', {
  now: '2026-09-27T09:05:00.000Z',
});
assert.equal(answered.response, 'yes');
assert.equal(answered.status, 'in_progress');
assert.equal(answered.updated_at, '2026-09-27T09:05:00.000Z');

const completed = completeTask(answered, {
  now: '2026-09-27T09:10:00.000Z',
});
assert.equal(completed.status, 'completed');
assert.equal(completed.completed_at, '2026-09-27T09:10:00.000Z');

const moved = moveTaskToTomorrow(created, {
  tomorrow: '2026-09-29',
  now: '2026-09-28T08:00:00.000Z',
});
assert.equal(moved.scheduled_date, '2026-09-29');
assert.equal(moved.moved_to_date, '2026-09-29');

assert.equal(
  isTaskOverdue(
    { ...created, deadline: '2026-09-27T08:00:00.000Z', status: 'open' },
    '2026-09-27T09:00:00.000Z',
  ),
  true,
);

assert.equal(
  isTaskOverdue(
    { ...created, deadline: '2026-09-28T18:00:00.000Z', status: 'completed' },
    '2026-09-29T09:00:00.000Z',
  ),
  false,
);

assert.throws(
  () => createTask({ ...baseInput, priority: 'urgent' }),
  /Invalid priority/,
);

console.log('task engine contract: PASS');
