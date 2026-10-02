export function buildGanttRows(tasks = []) {
  return tasks.map(t => ({
    id: t.id,
    title: t.title ?? t.name ?? 'Task',
    start: t.planned_start ?? t.start ?? null,
    end: t.planned_end ?? t.end ?? null,
    progress: Number(t.progress ?? t.actual_progress ?? 0)
  }));
}

export function buildKpiGroups(catalog = []) {
  return catalog.reduce((groups, item) => {
    const key = item.category ?? 'other';
    (groups[key] ??= []).push(item);
    return groups;
  }, {});
}

export function buildProcurementCalendar(items = []) {
  return [...items].sort((a, b) => String(a.required_date ?? a.delivery_date ?? '').localeCompare(String(b.required_date ?? b.delivery_date ?? '')));
}

export function buildFinancialSummary(rows = []) {
  const sum = key => rows.reduce((n, x) => n + Number(x[key] ?? 0), 0);
  const budget = sum('budget');
  const actual = sum('actual');
  const committed = sum('committed');
  return { budget, actual, committed, variance: budget - actual - committed };
}

export function buildUnitSalesMatrix(units = []) {
  return units.reduce((matrix, unit) => {
    const floor = String(unit.floor ?? unit.floor_id ?? 'unknown');
    (matrix[floor] ??= []).push(unit);
    return matrix;
  }, {});
}

export function reorderWorkflowSteps(steps = [], fromIndex, toIndex) {
  const out = [...steps];
  if (fromIndex < 0 || toIndex < 0 || fromIndex >= out.length || toIndex >= out.length) return out;
  const [item] = out.splice(fromIndex, 1);
  out.splice(toIndex, 0, item);
  return out;
}

export function buildTimeline(events = []) {
  return [...events].sort((a, b) => String(a.occurred_at ?? a.created_at ?? '').localeCompare(String(b.occurred_at ?? b.created_at ?? '')));
}

export function professionalAnimationTokens() {
  return {
    duration: { fast: 120, normal: 220, slow: 360 },
    easing: { standard: 'cubic-bezier(0.2, 0.8, 0.2, 1)', enter: 'cubic-bezier(0.16, 1, 0.3, 1)' }
  };
}

function esc(v) { return String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

async function queryTable(table, projectId, columns='*', orderBy=null) {
  if (!window.db || !projectId) return [];
  let q = window.db.from(table).select(columns).eq('project_id', projectId);
  if (orderBy) q = q.order(orderBy.column, { ascending: orderBy.ascending !== false });
  const r = await q;
  return r.error ? [] : (r.data || []);
}

function panel(title, body) {
  const el = document.createElement('section');
  el.className = 'panel project-view-panel';
  el.innerHTML = '<h3>' + esc(title) + '</h3>' + body;
  return el;
}

export async function renderGanttUI(projectId = globalThis.pid) {
  const tasks = buildGanttRows(await queryTable('project_schedule_tasks', projectId, '*', { column: 'planned_start' }));
  const rows = tasks.map(x => '<div class="metric-line"><b>' + esc(x.title) + '</b><span>' + esc(x.start || '—') + ' → ' + esc(x.end || '—') + ' · ' + x.progress + '%</span></div>').join('');
  return panel('Gantt · 493', rows || '<span class="muted">تسکی برای نمایش وجود ندارد.</span>');
}

export async function renderKpiDashboardUI(projectId = window.pid) {
  const groups = buildKpiGroups(await queryTable('project_kpi_catalog', projectId, '*', { column: 'kpi_code' }));
  const body = Object.entries(groups).map(([g, items]) => '<details open><summary><b>' + esc(g) + '</b></summary>' +
    items.map(x => '<div class="metric-line"><span>' + esc(x.kpi_name || x.kpi_code) + '</span><b>' + esc(x.value) + ' ' + esc(x.unit) + '</b></div>').join('') + '</details>').join('');
  return panel('KPI Dashboard · 494', body || '<span class="muted">KPI ثبت نشده است.</span>');
}

export async function renderProcurementCalendarUI(projectId = window.pid) {
  const rows = buildProcurementCalendar(await queryTable('project_procurement', projectId, '*', { column: 'required_date' }));
  return panel('Procurement Calendar · 495', rows.map(x => '<div class="metric-line"><span>' + esc(x.required_date || x.delivery_date || '—') + '</span><b>' + esc(x.material_name || x.description || x.item_name || 'Purchase') + '</b></div>').join('') || '<span class="muted">مورد خریدی وجود ندارد.</span>');
}

export async function renderFinancialDashboardUI(projectId = window.pid) {
  if (!window.db || !projectId) return panel('Financial Dashboard · 496', '<span class="muted">پروژه انتخاب نشده است.</span>');
  const r = await window.db.rpc('buildwise_project_dashboard', { p_project_id: projectId });
  const c = r.error ? {} : (r.data?.cost || {});
  const s = { budget: Number(c.budget || 0), actual: Number(c.actual || 0), committed: Number(c.committed || 0), variance: Number(c.budget || 0) - Number(c.actual || 0) - Number(c.committed || 0) };
  return panel('Financial Dashboard · 496', '<div class="stats"><div class="stat"><span>Budget</span><strong>' + s.budget.toLocaleString('fa-IR') + '</strong></div><div class="stat"><span>Actual</span><strong>' + s.actual.toLocaleString('fa-IR') + '</strong></div><div class="stat"><span>Committed</span><strong>' + s.committed.toLocaleString('fa-IR') + '</strong></div><div class="stat"><span>Remaining</span><strong>' + s.variance.toLocaleString('fa-IR') + '</strong></div></div>');
}

export async function renderUnitSalesMatrixUI(projectId = window.pid) {
  const floors = await queryTable('project_floors', projectId, 'id,floor_number,name');
  const floorIds = floors.map(x => x.id);
  let units = [];
  if (window.db && floorIds.length) {
    const r = await window.db.from('project_units').select('*').in('floor_id', floorIds);
    units = r.error ? [] : (r.data || []).map(u => ({...u, floor: floors.find(f => String(f.id) === String(u.floor_id))?.floor_number ?? u.floor_id, unit_id: u.unit_code ?? u.id, area: u.area_m2}));
  }
  const matrix = buildUnitSalesMatrix(units);
  const body = Object.entries(matrix).map(([floor, units]) => '<details open><summary><b>Floor ' + esc(floor) + '</b></summary>' +
    units.map(u => '<div class="metric-line"><span>#' + esc(u.unit_id || u.id) + ' · ' + esc(u.area || '—') + '</span><b>' + esc(u.status || '—') + '</b></div>').join('') + '</details>').join('');
  return panel('Unit Sales Matrix · 497', body || '<span class="muted">واحدی برای نمایش وجود ندارد.</span>');
}

export async function renderWorkflowUI(projectId = window.pid) {
  const rows = Array.isArray(window.__buildwiseWorkflowSteps) ? window.__buildwiseWorkflowSteps : [];
  const steps = [...rows].sort((a,b) => Number(a.position ?? 0) - Number(b.position ?? 0));
  const el = panel('Workflow · 498', '<div class="workflow-board"></div>');
  const board = el.querySelector('.workflow-board');
  steps.forEach((s, i) => {
    const card = document.createElement('article');
    card.className = 'integration-card';
    card.draggable = true;
    card.dataset.index = String(i);
    card.textContent = s.name || s.title || 'Step';
    card.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', String(i)));
    card.addEventListener('dragover', e => e.preventDefault());
    card.addEventListener('drop', e => {
      e.preventDefault();
      const from = Number(e.dataTransfer.getData('text/plain'));
      const reordered = reorderWorkflowSteps(steps, from, Number(card.dataset.index));
      board.innerHTML = '';
      reordered.forEach((item, idx) => {
        const n = document.createElement('article');
        n.className = 'integration-card';
        n.draggable = true;
        n.textContent = item.name || item.title || 'Step';
        n.dataset.index = String(idx);
        board.appendChild(n);
      });
    });
    board.appendChild(card);
  });
  return el;
}

export async function renderTimelineUI(projectId = window.pid) {
  const rows = buildTimeline(await queryTable('project_ai_alerts', projectId, 'id,title,created_at,severity,status'));
  return panel('Timeline · 499', rows.map(x => '<div class="metric-line"><span>' + esc(x.occurred_at || x.created_at || '—') + '</span><b>' + esc(x.title || x.event_type || 'Event') + '</b><span class="pill">' + esc(x.status || '') + '</span></div>').join('') || '<span class="muted">رویدادی وجود ندارد.</span>');
}

export function installProfessionalAnimationSystem() {
  const t = professionalAnimationTokens();
  document.documentElement.style.setProperty('--bw-motion-fast', t.duration.fast + 'ms');
  document.documentElement.style.setProperty('--bw-motion-normal', t.duration.normal + 'ms');
  document.documentElement.style.setProperty('--bw-motion-slow', t.duration.slow + 'ms');
  document.documentElement.style.setProperty('--bw-ease-standard', t.easing.standard);
  document.documentElement.style.setProperty('--bw-ease-enter', t.easing.enter);
  document.documentElement.classList.add('bw-motion-ready');
  return t;
}

globalThis.BuildWiseProjectViews = {
  renderGanttUI, renderKpiDashboardUI, renderProcurementCalendarUI,
  renderFinancialDashboardUI, renderUnitSalesMatrixUI, renderWorkflowUI,
  renderTimelineUI, installProfessionalAnimationSystem
};
if (typeof document !== 'undefined') installProfessionalAnimationSystem();


export async function renderAllProjectViews(projectId = window.pid) {
  const target = document.querySelector('#content');
  if (!target) return;
  const panels = await Promise.all([
    renderGanttUI(projectId),
    renderKpiDashboardUI(projectId),
    renderProcurementCalendarUI(projectId),
    renderFinancialDashboardUI(projectId),
    renderUnitSalesMatrixUI(projectId),
    renderWorkflowUI(projectId),
    renderTimelineUI(projectId)
  ]);
  const wrapper = document.createElement('div');
  wrapper.id = 'project-views-493-500';
  wrapper.append(...panels);
  target.prepend(wrapper);
  return wrapper;
}
globalThis.BuildWiseProjectViews.renderAllProjectViews = renderAllProjectViews;
