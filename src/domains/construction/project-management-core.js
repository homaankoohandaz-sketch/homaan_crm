import { validateProjectHierarchy } from './project-model.js';
import { validateWbs } from './wbs.js';
import { buildSchedule } from './schedule.js';
import { summarizeProgress } from './progress.js';

const DAY = 86400000;

function daysBetween(a, b) {
  return Math.round((Date.parse(b) - Date.parse(a)) / DAY);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function createBaseline(input = {}) {
  if (!input.schedule?.items) throw new TypeError('schedule is required');
  return Object.freeze({
    version: Number(input.version) || 1,
    created_at: input.created_at ?? new Date().toISOString(),
    schedule: clone(input.schedule)
  });
}

export function compareToBaseline(schedule, baseline) {
  if (!schedule?.items || !baseline?.schedule?.items) throw new TypeError('schedule and baseline are required');
  const baselineById = new Map(baseline.schedule.items.map((item) => [String(item.id), item]));
  const items = schedule.items.map((item) => {
    const base = baselineById.get(String(item.id));
    return {
      id: item.id,
      start_variance_days: base ? daysBetween(base.start_date, item.start_date) : null,
      finish_variance_days: base ? daysBetween(base.finish_date, item.finish_date) : null
    };
  });
  return {
    baseline_version: baseline.version,
    start_variance_days: daysBetween(baseline.schedule.start_date, schedule.start_date),
    finish_variance_days: daysBetween(baseline.schedule.finish_date, schedule.finish_date),
    items
  };
}

export function buildGanttRows(schedule) {
  if (!schedule?.items) throw new TypeError('schedule is required');
  return schedule.items.map((item) => ({
    id: String(item.id),
    label: item.name,
    type: item.type,
    parent_id: item.parent_id ?? null,
    start_date: item.start_date,
    finish_date: item.finish_date,
    duration_days: Math.max(0, daysBetween(item.start_date, item.finish_date)),
    progress: Math.min(100, Math.max(0, Number(item.progress) || 0)),
    dependencies: (item.depends_on ?? []).map(String)
  }));
}

export function calculateFloat(schedule) {
  if (!schedule?.items?.length) return [];
  const byId = new Map(schedule.items.map((item) => [String(item.id), item]));
  const successors = new Map(schedule.items.map((item) => [String(item.id), []]));
  for (const item of schedule.items) {
    for (const dep of item.depends_on ?? []) {
      const list = successors.get(String(dep));
      if (list) list.push(String(item.id));
    }
  }

  const memo = new Map();
  function latestFinish(id, stack = new Set()) {
    if (memo.has(id)) return memo.get(id);
    if (stack.has(id)) throw new Error('dependency_cycle');
    stack.add(id);
    const item = byId.get(id);
    const childStarts = (successors.get(id) ?? []).map((childId) => {
      const child = byId.get(childId);
      return Date.parse(child.start_date) - latestFinish(childId, stack);
    });
    stack.delete(id);
    const lf = childStarts.length ? Math.min(...childStarts) : Date.parse(schedule.finish_date);
    memo.set(id, lf);
    return lf;
  }

  return schedule.items.map((item) => {
    const latest = latestFinish(String(item.id));
    const slack = Math.max(0, Math.round((latest - Date.parse(item.finish_date)) / DAY));
    return { id: item.id, slack_days: slack, critical: slack === 0 };
  });
}

export function getProjectStatus({ progress_percent = 0, on_hold = false, cancelled = false } = {}) {
  if (cancelled) return 'cancelled';
  if (on_hold) return 'on_hold';
  const value = Number(progress_percent) || 0;
  if (value >= 100) return 'completed';
  if (value > 0) return 'active';
  return 'planned';
}

export function createProjectManagementModel(input = {}) {
  const hierarchyValidation = validateProjectHierarchy(input.hierarchy ?? []);
  if (!hierarchyValidation.valid) throw new Error(hierarchyValidation.error);
  const wbsValidation = validateWbs(input.wbs ?? []);
  if (!wbsValidation.valid) throw new Error(wbsValidation.error);

  const schedule = buildSchedule(input.wbs ?? [], { start_date: input.start_date });
  const progressItems = (input.wbs ?? []).filter((item) => item.type === 'task' || item.type === 'milestone');
  const progress = summarizeProgress(progressItems.map((item) => ({
    ...item,
    planned: item.duration_days || (item.type === 'milestone' ? 1 : 0),
    actual: item.progress >= 100 ? (item.duration_days || 1) : ((item.duration_days || 1) * (Number(item.progress) || 0) / 100),
    weight: item.duration_days || 1
  })));

  return Object.freeze({
    project: clone(input.project ?? null),
    hierarchy: clone(input.hierarchy ?? []),
    schedule,
    gantt: buildGanttRows(schedule),
    float: calculateFloat(schedule),
    progress,
    status: { progress_percent: progress.percent, status: getProjectStatus({ progress_percent: progress.percent }) }
  });
}
