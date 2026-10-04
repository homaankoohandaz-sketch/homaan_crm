const CONTEXT_TYPES = new Set(['crm', 'construction', 'procurement']);
const SUBJECT_TYPES = new Set(['deal', 'construction', 'purchase']);
const PRIORITIES = new Set(['critical', 'important', 'normal', 'low']);
const STATUSES = new Set(['open', 'in_progress', 'completed', 'rejected', 'overdue']);
const RESPONSES = new Set(['yes', 'no', null]);

/** Audit action vocabulary for Unified Task Engine (PHASE notification + audit). */
const AUDIT_ACTIONS = new Set([
  'created',
  'assigned',
  'responded',
  'completed',
  'rejected',
  'moved',
  'starred',
  'priority_changed',
  'notification_configured',
  'overdue_detected',
  'reminder_due',
  'due_today',
  'escalated',
]);

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

function asArray(tasks) {
  return Array.isArray(tasks) ? tasks : [];
}

function dayKey(value) {
  return String(value).slice(0, 10);
}

/** Pure audit event builder — Agent: Grok — 2026-10-04 */
export function buildTaskAuditEvent(task, action, {
  actor = null,
  now = new Date().toISOString(),
  detail = null,
} = {}) {
  if (!task || typeof task !== 'object') throw new TypeError('task is required');
  assertAllowed(action, AUDIT_ACTIONS, 'action');
  return Object.freeze({
    task_id: task.id ?? null,
    action,
    actor: actor ?? null,
    at: now,
    status: task.status ?? null,
    assigned_to: task.assigned_to ?? null,
    detail: detail ?? null,
  });
}

export function appendTaskAudit(task, action, options = {}) {
  const event = buildTaskAuditEvent(task, action, options);
  const prior = Array.isArray(task.audit_log) ? task.audit_log : [];
  return {
    ...task,
    audit_log: [...prior, event],
    updated_at: options.now ?? event.at,
  };
}

export function createTask(input, { now = new Date().toISOString(), actor = null } = {}) {
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

  const task = {
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
    audit_log: [],
    created_at: now,
    updated_at: now,
  };

  return appendTaskAudit(task, 'created', {
    actor: actor ?? input.created_by,
    now,
    detail: { assigned_to: input.assigned_to },
  });
}

export function respondToTask(task, response, { now = new Date().toISOString(), actor = null } = {}) {
  assertAllowed(response, new Set(['yes', 'no']), 'response');
  if (task.status === 'completed' || task.status === 'rejected') {
    return appendTaskAudit(
      { ...task, response, updated_at: now },
      'responded',
      { actor, now, detail: { response, note: 'terminal_status_preserved' } },
    );
  }
  const next = {
    ...task,
    response,
    status: 'in_progress',
    updated_at: now,
  };
  return appendTaskAudit(next, 'responded', { actor, now, detail: { response } });
}

export function completeTask(task, { now = new Date().toISOString(), actor = null } = {}) {
  if (task.status === 'completed') return task;
  if (task.status === 'rejected') {
    throw new Error('Rejected task cannot be completed');
  }
  const next = {
    ...task,
    status: 'completed',
    completed_at: now,
    updated_at: now,
  };
  return appendTaskAudit(next, 'completed', { actor, now });
}

export function rejectTask(task, reason = null, { now = new Date().toISOString(), actor = null } = {}) {
  if (!task || typeof task !== 'object') throw new TypeError('task is required');
  if (task.status === 'completed') {
    throw new Error('Completed task cannot be rejected');
  }
  if (task.status === 'rejected') return task;
  const next = {
    ...task,
    status: 'rejected',
    response: task.response ?? 'no',
    updated_at: now,
  };
  return appendTaskAudit(next, 'rejected', {
    actor,
    now,
    detail: reason != null ? { reason: String(reason) } : null,
  });
}

export function moveTaskToTomorrow(
  task,
  { tomorrow, now = new Date().toISOString(), actor = null } = {},
) {
  requireDateString(tomorrow, 'tomorrow');
  if (task.status === 'completed') {
    throw new Error('Completed task cannot be moved');
  }
  if (task.status === 'rejected') {
    throw new Error('Rejected task cannot be moved');
  }
  const next = {
    ...task,
    scheduled_date: tomorrow,
    moved_to_date: tomorrow,
    status: 'open',
    updated_at: now,
  };
  return appendTaskAudit(next, 'moved', {
    actor,
    now,
    detail: { scheduled_date: tomorrow },
  });
}

export function isTaskOverdue(task, now = new Date().toISOString()) {
  if (task.status === 'completed' || task.status === 'rejected' || !task.deadline) {
    return false;
  }
  return Date.parse(task.deadline) < Date.parse(now);
}

export function setTaskStarred(task, starred, { now = new Date().toISOString(), actor = null } = {}) {
  if (!task || typeof task !== 'object') throw new TypeError('task is required');
  const next = {
    ...task,
    starred: Boolean(starred),
    updated_at: now,
  };
  return appendTaskAudit(next, 'starred', {
    actor,
    now,
    detail: { starred: Boolean(starred) },
  });
}

export function setTaskPriority(task, priority, { now = new Date().toISOString(), actor = null } = {}) {
  if (!task || typeof task !== 'object') throw new TypeError('task is required');
  assertAllowed(priority, PRIORITIES, 'priority');
  const next = {
    ...task,
    priority,
    updated_at: now,
  };
  return appendTaskAudit(next, 'priority_changed', {
    actor,
    now,
    detail: { priority },
  });
}

export function configureTaskNotification(
  task,
  { enabled, reminder_at = null, notification_status = null, now = new Date().toISOString(), actor = null } = {},
) {
  if (!task || typeof task !== 'object') throw new TypeError('task is required');
  if (reminder_at != null) requireDateString(reminder_at, 'reminder_at');

  const notificationEnabled = Boolean(enabled);
  const next = {
    ...task,
    notification_enabled: notificationEnabled,
    reminder_at: notificationEnabled ? reminder_at : null,
    notification_status: notificationEnabled
      ? (notification_status ?? (reminder_at ? 'scheduled' : null))
      : null,
    updated_at: now,
  };
  return appendTaskAudit(next, 'notification_configured', {
    actor,
    now,
    detail: {
      enabled: notificationEnabled,
      reminder_at: next.reminder_at,
      notification_status: next.notification_status,
    },
  });
}

export function listTasksForDay(tasks, assigneeId, date) {
  requireString(assigneeId, 'assigneeId');
  requireDateString(date, 'date');
  const day = dayKey(date);
  return asArray(tasks).filter(
    (t) => t.assigned_to === assigneeId && dayKey(t.scheduled_date) === day,
  );
}

export function listTeamTasksForDay(tasks, date) {
  requireDateString(date, 'date');
  const day = dayKey(date);
  return asArray(tasks).filter((t) => dayKey(t.scheduled_date) === day);
}

export function listOverdueTasks(tasks, now = new Date().toISOString()) {
  return asArray(tasks).filter((t) => isTaskOverdue(t, now));
}

export function listStarredTasks(tasks) {
  return asArray(tasks).filter((t) => Boolean(t.starred));
}

export function listTasksByContext(tasks, contextType) {
  assertAllowed(contextType, CONTEXT_TYPES, 'context_type');
  return asArray(tasks).filter((t) => t.context_type === contextType);
}

export function listDueTodayTasks(tasks, date = new Date().toISOString()) {
  requireDateString(date, 'date');
  const day = dayKey(date);
  return asArray(tasks).filter((t) => {
    if (t.status === 'completed' || t.status === 'rejected') return false;
    if (dayKey(t.scheduled_date) === day) return true;
    if (t.deadline && dayKey(t.deadline) === day) return true;
    return false;
  });
}

export function listNotificationCandidates(tasks, now = new Date().toISOString()) {
  const day = dayKey(now);
  const nowMs = Date.parse(now);
  const out = [];

  for (const task of asArray(tasks)) {
    if (task.status === 'completed' || task.status === 'rejected') continue;

    if (task.notification_enabled && task.reminder_at) {
      const reminderMs = Date.parse(task.reminder_at);
      if (!Number.isNaN(reminderMs) && reminderMs <= nowMs) {
        out.push(
          buildTaskAuditEvent(task, 'reminder_due', {
            now,
            detail: { reminder_at: task.reminder_at },
          }),
        );
      }
    }

    if (dayKey(task.scheduled_date) === day || (task.deadline && dayKey(task.deadline) === day)) {
      out.push(buildTaskAuditEvent(task, 'due_today', { now, detail: { day } }));
    }

    if (isTaskOverdue(task, now)) {
      out.push(
        buildTaskAuditEvent(task, 'overdue_detected', {
          now,
          detail: { deadline: task.deadline },
        }),
      );
    }
  }

  return out;
}

export {
  CONTEXT_TYPES,
  SUBJECT_TYPES,
  PRIORITIES,
  STATUSES,
  RESPONSES,
  AUDIT_ACTIONS,
};
