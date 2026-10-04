import { validateProjectHierarchy } from './project-model.js';
import { validateWbs } from './wbs.js';
import { buildSchedule } from './schedule.js';
import { summarizeProgress } from './progress.js';

const DAY = 86400000;

function daysBetween(a, b) {
  return Math.round((Date.parse(b) - Date.parse(a)) / DAY);
}
function addDays(iso, days) {
  const d = new Date(iso + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + Number(days || 0));
  return d.toISOString().slice(0, 10);
}
function clone(value) { return JSON.parse(JSON.stringify(value)); }

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
  const finishVariance = daysBetween(baseline.schedule.finish_date, schedule.finish_date);
  return {
    baseline_version: baseline.version,
    start_variance_days: daysBetween(baseline.schedule.start_date, schedule.start_date),
    finish_variance_days: finishVariance,
    time_variance_percent: calculateTimeVariancePercent({
      baseline_duration_days: Math.max(1, daysBetween(baseline.schedule.start_date, baseline.schedule.finish_date)),
      variance_days: finishVariance
    }),
    items
  };
}

export function calculateTimeVariancePercent({ baseline_duration_days = 0, variance_days = 0 } = {}) {
  const base = Number(baseline_duration_days);
  if (!Number.isFinite(base) || base <= 0) return 0;
  return Number((Number(variance_days || 0) / base * 100).toFixed(2));
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
    if (!item) throw new Error('missing_dependency:' + id);
    const childStarts = (successors.get(id) ?? []).map((childId) => {
      const child = byId.get(childId);
      const childLatestFinish = latestFinish(childId, stack);
      const childDuration = Date.parse(child.finish_date) - Date.parse(child.start_date);
      return childLatestFinish - childDuration;
    });
    stack.delete(id);
    const lf = childStarts.length ? Math.min(...childStarts) : Date.parse(schedule.finish_date);
    memo.set(id, lf);
    return lf;
  }
  return schedule.items.map((item) => {
    const latest = latestFinish(String(item.id));
    const slack = Math.round((latest - Date.parse(item.finish_date)) / DAY);
    return { id: item.id, slack_days: slack, critical: slack <= 0 };
  });
}

export function buildProjectCalendar(schedule) {
  if (!schedule?.items) throw new TypeError('schedule is required');
  return {
    start_date: schedule.start_date,
    finish_date: schedule.finish_date,
    events: schedule.items.map((item) => ({
      id: String(item.id),
      title: item.name,
      start: item.start_date,
      end: item.finish_date,
      type: item.type,
      progress: Math.min(100, Math.max(0, Number(item.progress) || 0))
    }))
  };
}

export function buildMasterPlan(schedule) {
  if (!schedule?.items) throw new TypeError('schedule is required');
  const critical = new Set(calculateFloat(schedule).filter((x) => x.critical).map((x) => String(x.id)));
  return {
    start_date: schedule.start_date,
    finish_date: schedule.finish_date,
    duration_days: Math.max(0, daysBetween(schedule.start_date, schedule.finish_date)),
    tasks: schedule.items.filter((x) => x.type === 'task').length,
    milestones: schedule.items.filter((x) => x.type === 'milestone').map((x) => ({
      id: x.id, name: x.name, date: x.finish_date, progress: x.progress ?? 0
    })),
    critical_path: schedule.items.filter((x) => critical.has(String(x.id))).map((x) => x.id)
  };
}

export function buildProjectDashboard({ project = null, schedule = null, progress = null, status = null, baseline = null } = {}) {
  const variance = baseline && schedule ? compareToBaseline(schedule, baseline) : null;
  return {
    project: clone(project),
    kpis: {
      progress_percent: Number(progress?.percent ?? progress?.progress_percent ?? 0),
      status: status?.status ?? null,
      start_date: schedule?.start_date ?? null,
      finish_date: schedule?.finish_date ?? null,
      schedule_variance_days: variance?.finish_variance_days ?? 0,
      time_variance_percent: variance?.time_variance_percent ?? 0,
      critical_tasks: schedule ? calculateFloat(schedule).filter((x) => x.critical).length : 0
    },
    master_plan: schedule ? buildMasterPlan(schedule) : null,
    calendar: schedule ? buildProjectCalendar(schedule) : null,
    baseline_variance: variance
  };
}

export function detectDelays(items = [], { asOf = null } = {}) {
  if (!Array.isArray(items)) throw new TypeError('items must be an array');
  const reference = asOf ? Date.parse(asOf) : null;
  return items.filter((item) => {
    const baseline = Date.parse(item.baseline_finish);
    const forecast = Date.parse(item.forecast_finish);
    if (!Number.isFinite(baseline) || !Number.isFinite(forecast)) return false;
    return forecast > baseline || (reference != null && reference > baseline && Number(item.progress) < 100);
  }).map((item) => ({
    task_id: item.id,
    variance_days: daysBetween(item.baseline_finish, item.forecast_finish),
    reason: item.metadata?.delay_reason ?? item.delay_reason ?? 'unspecified',
    responsibility: item.metadata?.delay_responsibility ?? item.delay_responsibility ?? 'unassigned'
  }));
}

export function buildRecoveryPlan(delays = [], tasks = []) {
  const taskById = new Map(tasks.map((task) => [String(task.id), task]));
  return delays.map((delay) => ({
    task_id: delay.task_id,
    reason: delay.reason,
    responsibility: delay.responsibility,
    target_reduction_days: Math.max(0, Number(delay.variance_days) || 0),
    duration_days: Number(taskById.get(String(delay.task_id))?.duration_days) || null,
    actions: ['resequence', 'parallelize_safe_work', 'add_capacity_review']
  }));
}

export function reviseSchedule(schedule, { delay_days = 0, task_shifts = {} } = {}) {
  if (!schedule?.items) throw new TypeError('schedule is required');
  const globalShift = Number(delay_days) || 0;
  const items = schedule.items.map((item) => {
    const shift = Number(task_shifts[item.id] ?? globalShift) || 0;
    return {
      ...item,
      start_date: addDays(item.start_date, shift),
      finish_date: addDays(item.finish_date, shift),
      revision_shift_days: shift
    };
  });
  return {
    ...clone(schedule),
    start_date: addDays(schedule.start_date, globalShift),
    finish_date: addDays(schedule.finish_date, globalShift),
    items
  };
}

export function createProjectVersion({ version = 1, label = null, schedule, parent_version = null, created_at = new Date().toISOString() } = {}) {
  if (!schedule?.items) throw new TypeError('schedule is required');
  if (!Number.isInteger(Number(version)) || Number(version) < 1) throw new TypeError('version must be positive');
  return Object.freeze({
    version: Number(version),
    label: label ?? `Version ${version}`,
    parent_version: parent_version == null ? null : Number(parent_version),
    created_at,
    schedule: clone(schedule)
  });
}

export function createProjectSnapshot({ project = null, schedule = null, version = null, captured_at = new Date().toISOString() } = {}) {
  if (!schedule?.items) throw new TypeError('schedule is required');
  return Object.freeze({
    captured_at,
    project: clone(project),
    version: version ? clone(version) : null,
    schedule: clone(schedule),
    dashboard: buildProjectDashboard({ project, schedule, progress: null, status: null })
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
  const baseline = input.baseline ?? null;
  return Object.freeze({
    project: clone(input.project ?? null),
    hierarchy: clone(input.hierarchy ?? []),
    schedule,
    gantt: buildGanttRows(schedule),
    float: calculateFloat(schedule),
    progress,
    delays: detectDelays(input.delay_items ?? []),
    recovery_plan: buildRecoveryPlan(input.delay_items ? detectDelays(input.delay_items) : [], input.wbs ?? []),
    status: { progress_percent: progress.percent, status: getProjectStatus({ progress_percent: progress.percent }) },
    dashboard: buildProjectDashboard({ project: input.project, schedule, progress, status: { status: getProjectStatus({ progress_percent: progress.percent }) }, baseline }),
    master_plan: buildMasterPlan(schedule),
    calendar: buildProjectCalendar(schedule)
  });
}
