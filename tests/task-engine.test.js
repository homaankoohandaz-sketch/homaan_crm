import assert from 'node:assert/strict';
import {
  createTask,
  respondToTask,
  completeTask,
  rejectTask,
  moveTaskToTomorrow,
  isTaskOverdue,
  setTaskStarred,
  setTaskPriority,
  configureTaskNotification,
  listTasksForDay,
  listTeamTasksForDay,
  listOverdueTasks,
  listStarredTasks,
  listTasksByContext,
  listDueTodayTasks,
  listNotificationCandidates,
  buildTaskAuditEvent,
  appendTaskAudit,
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
  actor: 'user-001',
});

assert.equal(created.status, 'open');
assert.equal(created.response, null);
assert.equal(created.starred, false);
assert.equal(created.priority, 'important');
assert.equal(created.notification_enabled, false);
assert.equal(created.created_at, '2026-09-27T09:00:00.000Z');
assert.ok(Array.isArray(created.audit_log));
assert.equal(created.audit_log[0].action, 'created');
assert.equal(created.audit_log[0].actor, 'user-001');

const answered = respondToTask(created, 'yes', {
  now: '2026-09-27T09:05:00.000Z',
  actor: 'user-002',
});
assert.equal(answered.response, 'yes');
assert.equal(answered.status, 'in_progress');
assert.equal(answered.updated_at, '2026-09-27T09:05:00.000Z');
assert.equal(answered.audit_log.at(-1).action, 'responded');

const completed = completeTask(answered, {
  now: '2026-09-27T09:10:00.000Z',
  actor: 'user-002',
});
assert.equal(completed.status, 'completed');
assert.equal(completed.completed_at, '2026-09-27T09:10:00.000Z');
assert.equal(completed.audit_log.at(-1).action, 'completed');

const moved = moveTaskToTomorrow(created, {
  tomorrow: '2026-09-29',
  now: '2026-09-28T08:00:00.000Z',
  actor: 'user-002',
});
assert.equal(moved.scheduled_date, '2026-09-29');
assert.equal(moved.moved_to_date, '2026-09-29');
assert.equal(moved.audit_log.at(-1).action, 'moved');

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

const starred = setTaskStarred(created, true, {
  now: '2026-09-27T09:15:00.000Z',
  actor: 'user-001',
});
assert.equal(starred.starred, true);
assert.equal(starred.audit_log.at(-1).action, 'starred');

const reprioritized = setTaskPriority(starred, 'critical', {
  now: '2026-09-27T09:20:00.000Z',
});
assert.equal(reprioritized.priority, 'critical');
assert.equal(reprioritized.audit_log.at(-1).action, 'priority_changed');

const notified = configureTaskNotification(reprioritized, {
  enabled: true,
  reminder_at: '2026-09-28T09:30:00.000Z',
  now: '2026-09-27T09:25:00.000Z',
});
assert.equal(notified.notification_enabled, true);
assert.equal(notified.reminder_at, '2026-09-28T09:30:00.000Z');
assert.equal(notified.notification_status, 'scheduled');
assert.equal(notified.audit_log.at(-1).action, 'notification_configured');

assert.throws(
  () => setTaskPriority(created, 'urgent'),
  /Invalid priority/,
);

assert.throws(
  () => configureTaskNotification(created, {
    enabled: true,
    reminder_at: 'not-a-date',
  }),
  /reminder_at must be a valid date/,
);

const rejected = rejectTask(created, 'not relevant', {
  now: '2026-09-27T10:00:00.000Z',
  actor: 'user-001',
});
assert.equal(rejected.status, 'rejected');
assert.equal(rejected.audit_log.at(-1).action, 'rejected');
assert.equal(rejected.audit_log.at(-1).detail.reason, 'not relevant');
assert.throws(() => completeTask(rejected), /Rejected task cannot be completed/);
assert.throws(
  () => moveTaskToTomorrow(rejected, { tomorrow: '2026-09-30' }),
  /Rejected task cannot be moved/,
);

console.log('task engine mutation contracts: PASS');

// Calendar / query helpers — PHASE-CURRENT-ARCHITECTURE required views
const tCrm = createTask({
  ...baseInput,
  id: 't1',
  assigned_to: 'u-a',
  scheduled_date: '2026-10-04',
  deadline: '2026-10-10T18:00:00.000Z',
});
const tCon = createTask({
  ...baseInput,
  id: 't2',
  context_type: 'construction',
  subject_type: 'construction',
  related_entity_id: 'wbs-1',
  assigned_to: 'u-b',
  scheduled_date: '2026-10-04',
  deadline: '2026-10-03T12:00:00.000Z',
});
const tStar = setTaskStarred(
  createTask({
    ...baseInput,
    id: 't3',
    assigned_to: 'u-a',
    scheduled_date: '2026-10-05',
    deadline: '2026-10-12T18:00:00.000Z',
  }),
  true,
);
const bag = [tCrm, tCon, tStar];

assert.equal(listTasksForDay(bag, 'u-a', '2026-10-04').length, 1);
assert.equal(listTasksForDay(bag, 'u-a', '2026-10-04')[0].id, 't1');
assert.equal(listTeamTasksForDay(bag, '2026-10-04').length, 2);
assert.equal(listOverdueTasks(bag, '2026-10-04T00:00:00.000Z').map((t) => t.id).join(','), 't2');
assert.equal(listStarredTasks(bag).length, 1);
assert.equal(listTasksByContext(bag, 'crm').length, 2);
assert.equal(listTasksByContext(bag, 'construction').length, 1);
assert.throws(() => listTasksByContext(bag, 'sales'), /Invalid context_type/);

assert.equal(listDueTodayTasks(bag, '2026-10-04').map((t) => t.id).sort().join(','), 't1,t2');

const withReminder = configureTaskNotification(tCrm, {
  enabled: true,
  reminder_at: '2026-10-03T08:00:00.000Z',
  now: '2026-10-03T07:00:00.000Z',
});
const candidates = listNotificationCandidates(
  [withReminder, tCon],
  '2026-10-04T00:00:00.000Z',
);
const actions = candidates.map((e) => e.action);
assert.ok(actions.includes('reminder_due'));
assert.ok(actions.includes('due_today'));
assert.ok(actions.includes('overdue_detected'));

const evt = buildTaskAuditEvent(tCrm, 'escalated', { actor: 'manager', now: '2026-10-04T12:00:00.000Z' });
assert.equal(evt.action, 'escalated');
assert.equal(evt.task_id, 't1');
const withEsc = appendTaskAudit(tCrm, 'escalated', { actor: 'manager', now: '2026-10-04T12:00:00.000Z' });
assert.equal(withEsc.audit_log.at(-1).action, 'escalated');

console.log('task engine calendar query contracts: PASS');
console.log('task engine audit/reject/notification contracts: PASS');
