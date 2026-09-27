const CONTEXT_TYPES = new Set(['crm', 'construction', 'procurement']);
const SUBJECT_TYPES = new Set(['deal', 'construction', 'purchase']);
const PRIORITIES = new Set(['critical', 'important', 'normal', 'low']);
const STATUSES = new Set(['open', 'in_progress', 'completed', 'rejected', 'overdue']);
const RESPONSES = new Set(['yes', 'no', null]);

function requireString(value, field) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError(`${field} is required`);
  }
}

function requireDateString(value, field) {
  requireString(value, field);
  if (Number.isNaN(Date.parse(value))) {
    throw new TypeError(`${field} must be a valid date`);
  }
}

function assertAllowed(value, allowed, field) {
  if (!allowed.has(value)) {
    throw new TypeError(`Invalid ${field}`);
  }
}

export function createTask(input, { now = new Date().toISOString() } = {}) {
  requireString(input?.id, 'id');
  requireString(input?.title, 'title');
  assertAllowed(input.context_type, CONTEXT_TYPES, 'context_type');
  assertAllowed(input.subject_type, SUBJECT_TYPES, 'subject_type');
  requireString(input.related_entity_id, 'related_entity_id');
  requireString(input.created_by, 'created_by');
  requireString(input.assigned_to, 'assigned_to');
  requireDateString(input.scheduled_date, 'scheduled_date');
  if (input.deadline != null) requireDateString(input.deadline, 'deadline');
  assertAllowed(input.priority ?? 'normal', PRIORITIES, 'priority');

  return {
    id: input.id,
    title: input.title.trim(),
    description: input.description?.trim() ?? '',
    context_type: input.context_type,
    subject_type: input.subject_type,
    related_entity_id: input.related_entity_id,
    created_by: input.created_by,
    assigned_to: input.assigned_to,
    delegated_by: input.delegated_by ?? null,
    scheduled_date: input.scheduled_date,
    scheduled_time: input.scheduled_time ?? null,
    deadline: input.deadline ?? null,
    recurrence: input.recurrence ?? null,
    priority: input.priority ?? 'normal',
    starred: Boolean(input.starred),
    status: 'open',
    response: null,
    completed_at: null,
    moved_to_date: null,
    notification_enabled: Boolean(input.notification_enabled),
    reminder_at: input.reminder_at ?? null,
    notification_status: input.notification_status ?? null,
    created_at: now,
    updated_at: now,
  };
}

export function respondToTask(task, response, { now = new Date().toISOString() } = {}) {
  assertAllowed(response, new Set(['yes', 'no']), 'response');
  if (task.status === 'completed') return { ...task, response, updated_at: now };
  return {
    ...task,
    response,
    status: 'in_progress',
    updated_at: now,
  };
}

export function completeTask(task, { now = new Date().toISOString() } = {}) {
  if (task.status === 'completed') return task;
  return {
    ...task,
    status: 'completed',
    completed_at: now,
    updated_at: now,
  };
}

export function moveTaskToTomorrow(
  task,
  { tomorrow, now = new Date().toISOString() } = {},
) {
  requireDateString(tomorrow, 'tomorrow');
  if (task.status === 'completed') {
    throw new Error('Completed task cannot be moved');
  }
  return {
    ...task,
    scheduled_date: tomorrow,
    moved_to_date: tomorrow,
    status: 'open',
    updated_at: now,
  };
}

export function isTaskOverdue(task, now = new Date().toISOString()) {
  if (task.status === 'completed' || task.status === 'rejected' || !task.deadline) {
    return false;
  }
  return Date.parse(task.deadline) < Date.parse(now);
}

export function setTaskStarred(task, starred, { now = new Date().toISOString() } = {}) {
  if (!task || typeof task !== 'object') throw new TypeError('task is required');
  return {
    ...task,
    starred: Boolean(starred),
    updated_at: now,
  };
}

export function setTaskPriority(task, priority, { now = new Date().toISOString() } = {}) {
  if (!task || typeof task !== 'object') throw new TypeError('task is required');
  assertAllowed(priority, PRIORITIES, 'priority');
  return {
    ...task,
    priority,
    updated_at: now,
  };
}

export function configureTaskNotification(
  task,
  { enabled, reminder_at = null, notification_status = null, now = new Date().toISOString() } = {},
) {
  if (!task || typeof task !== 'object') throw new TypeError('task is required');
  if (reminder_at != null) requireDateString(reminder_at, 'reminder_at');

  const notificationEnabled = Boolean(enabled);
  return {
    ...task,
    notification_enabled: notificationEnabled,
    reminder_at: notificationEnabled ? reminder_at : null,
    notification_status: notificationEnabled
      ? (notification_status ?? (reminder_at ? 'scheduled' : null))
      : null,
    updated_at: now,
  };
}

export { CONTEXT_TYPES, SUBJECT_TYPES, PRIORITIES, STATUSES, RESPONSES };
