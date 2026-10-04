import {
  buildProjectDashboard,
  buildMasterPlan,
  buildProjectCalendar,
  buildGanttRows,
  detectDelays,
  buildRecoveryPlan,
  createProjectVersion,
  createProjectSnapshot
} from '../domains/construction/project-management-core.js';

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

export function buildProjectManagementPanelModel({ project, schedule, progress = null, status = null, baseline = null, baselines = [] } = {}) {
  const dashboard = buildProjectDashboard({ project, schedule, progress, status, baseline });
  const masterPlan = buildMasterPlan(schedule);
  const calendar = buildProjectCalendar(schedule);
  const gantt = buildGanttRows(schedule);
  const delayItems = schedule.items.map((item) => ({
    id: item.id,
    baseline_finish: item.baseline_finish ?? item.constraints?.baseline_finish ?? item.finish_date,
    forecast_finish: item.forecast_finish ?? item.constraints?.forecast_finish ?? item.finish_date,
    progress: item.progress,
    metadata: item.metadata ?? item.constraints ?? {}
  }));
  const delays = detectDelays(delayItems);
  const recovery = buildRecoveryPlan(delays, schedule.items);
  const versions = baselines.map((row) => ({
    id: row.id,
    version_no: Number(row.version_no),
    name: row.name,
    created_at: row.created_at,
    snapshot: row.snapshot
  }));
  return {
    dashboard: {
      status: dashboard.kpis.status,
      progress_percent: dashboard.kpis.progress_percent,
      schedule_variance_days: dashboard.kpis.schedule_variance_days,
      time_variance_percent: dashboard.kpis.time_variance_percent,
      critical_tasks: dashboard.kpis.critical_tasks
    },
    master_plan: masterPlan,
    calendar,
    gantt,
    delays,
    recovery,
    versions
  };
}

export function renderProjectManagementPanel(model) {
  const d = model.dashboard;
  const critical = model.master_plan.critical_path.length;
  const delayHtml = model.delays.length
    ? model.delays.map((x) => '<div class="item"><b>'+esc(x.task_id)+'</b><span>'+esc(x.variance_days)+' روز · '+esc(x.reason)+' · '+esc(x.responsibility)+'</span></div>').join('')
    : '<span class="muted">تاخیر ثبت‌شده‌ای وجود ندارد.</span>';
  const versionHtml = model.versions.length
    ? model.versions.map((x) => '<div class="item"><b>V'+esc(x.version_no)+'</b><span>'+esc(x.name||'Snapshot')+'</span></div>').join('')
    : '<span class="muted">Baseline/Version ثبت نشده است.</span>';
  const calendarHtml = model.calendar.events.slice(0,20).map((x) =>
    '<div class="item"><span>'+esc(x.start)+' → '+esc(x.end)+'</span><b>'+esc(x.title)+'</b></div>'
  ).join('');
  const ganttHtml = model.gantt.slice(0,40).map((x) =>
    '<div class="item"><span>'+esc(x.start_date)+' → '+esc(x.finish_date)+' · '+esc(x.progress)+'%</span><b>'+esc(x.label)+'</b></div>'
  ).join('');
  const recoveryHtml = model.recovery.length
    ? model.recovery.map((x) => '<div class="item"><b>'+esc(x.task_id)+'</b><span>کاهش هدف: '+esc(x.target_reduction_days)+' روز</span></div>').join('')
    : '<span class="muted">Recovery plan موردی لازم نیست.</span>';
  const el = document.createElement('section');
  el.className = 'panel project-management-core-101-130';
  el.innerHTML =
    '<h2>Project Management Core · 101–130</h2>'+
    '<div class="grid">'+
      '<div class="card"><div class="muted">وضعیت</div><div class="metric">'+esc(d.status||'—')+'</div></div>'+
      '<div class="card"><div class="muted">پیشرفت</div><div class="metric">'+esc(d.progress_percent)+'%</div></div>'+
      '<div class="card"><div class="muted">انحراف زمان</div><div class="metric">'+esc(d.schedule_variance_days)+' روز</div></div>'+
      '<div class="card"><div class="muted">Critical</div><div class="metric">'+esc(critical)+'</div></div>'+
    '</div>'+
    '<div class="tabs">'+
      '<button data-pm-tab="master">Master Plan</button><button data-pm-tab="gantt">Gantt</button><button data-pm-tab="calendar">Calendar</button><button data-pm-tab="delay">Delay / Recovery</button><button data-pm-tab="versions">Versions / Snapshot</button>'+
    '</div>'+
    '<div data-pm-content>'+
      '<div class="list">'+ganttHtml+'</div>'+
    '</div>';
  const content = el.querySelector('[data-pm-content]');
  const renderTab = (tab) => {
    const map = {
      master: '<div class="list"><div class="item"><b>شروع</b><span>'+esc(model.master_plan.start_date)+'</span></div><div class="item"><b>پایان</b><span>'+esc(model.master_plan.finish_date)+'</span></div><div class="item"><b>مدت</b><span>'+esc(model.master_plan.duration_days)+' روز</span></div><div class="item"><b>Milestones</b><span>'+esc(model.master_plan.milestones.length)+'</span></div></div>',
      gantt: '<div class="list">'+ganttHtml+'</div>',
      calendar: '<div class="list">'+calendarHtml+'</div>',
      delay: '<h4>Delay</h4><div class="list">'+delayHtml+'</div><h4>Recovery</h4><div class="list">'+recoveryHtml+'</div>',
      versions: '<div class="list">'+versionHtml+'</div>'
    };
    content.innerHTML = map[tab] ?? map.gantt;
  };
  el.querySelectorAll('[data-pm-tab]').forEach((button) => button.addEventListener('click', () => renderTab(button.dataset.pmTab)));
  return el;
}

export async function renderProjectManagementCoreUI({ db = globalThis.db, projectId = globalThis.pid } = {}) {
  if (!db || !projectId) return null;
  const [projectResult, taskResult, baselineResult] = await Promise.all([
    db.from('construction_projects').select('id,title').eq('id', projectId).single(),
    db.from('project_schedule_tasks').select('*').eq('project_id', projectId).order('planned_start', { ascending: true }).limit(500),
    db.from('project_baselines').select('id,name,version_no,snapshot,created_at').eq('project_id', projectId).order('version_no', { ascending: false }).limit(20)
  ]);
  if (projectResult.error || taskResult.error || baselineResult.error) return null;
  const tasks = taskResult.data || [];
  const scheduleItems = tasks.map((row) => ({
    id: row.id,
    name: row.title,
    type: row.constraints?.type === 'milestone' || Number(row.duration_days) === 0 ? 'milestone' : 'task',
    start_date: row.planned_start,
    finish_date: row.planned_finish || row.planned_start,
    progress: Number(row.progress || 0),
    duration_days: Number(row.duration_days || 0),
    depends_on: Array.isArray(row.predecessor_ids) ? row.predecessor_ids.map(String) : [],
    baseline_finish: row.constraints?.baseline_finish ?? null,
    forecast_finish: row.constraints?.forecast_finish ?? null,
    metadata: row.constraints && typeof row.constraints === 'object' ? row.constraints : {}
  }));
  const schedule = {
    start_date: scheduleItems[0]?.start_date ?? null,
    finish_date: scheduleItems.reduce((max, x) => !max || x.finish_date > max ? x.finish_date : max, scheduleItems[0]?.finish_date ?? null),
    items: scheduleItems
  };
  const model = buildProjectManagementPanelModel({
    project: { id: projectResult.data.id, name: projectResult.data.title },
    schedule,
    progress: { percent: tasks.length ? tasks.reduce((n, x) => n + Number(x.progress || 0), 0) / tasks.length : 0 },
    status: { status: tasks.length && tasks.every((x) => Number(x.progress || 0) >= 100) ? 'completed' : tasks.some((x) => Number(x.progress || 0) > 0) ? 'active' : 'planned' },
    baselines: baselineResult.data || []
  });
  return renderProjectManagementPanel(model);
}

globalThis.BuildWiseProjectManagement = {
  buildProjectManagementPanelModel,
  renderProjectManagementPanel,
  renderProjectManagementCoreUI
};
