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

const QUERY_ERROR_HTML = '<span class="muted">بارگذاری داده‌ها با خطا مواجه شد. صفحه را تازه کنید یا با مدیر سامانه تماس بگیرید.</span>';

function reportQueryError(table, error) {
  // Keep details in the developer console, not in the customer-facing UI.
  console.error('BuildWise project view query failed', { table, code: error?.code || 'unknown' });
}

async function queryTable(table, projectId, columns='*', orderBy=null) {
  if (!window.db) return { data: [], error: { code: 'database_unavailable' } };
  if (!projectId) return { data: [], error: null };
  let q = window.db.from(table).select(columns).eq('project_id', projectId);
  if (orderBy) q = q.order(orderBy.column, { ascending: orderBy.ascending !== false });
  const r = await q;
  if (r.error) reportQueryError(table, r.error);
  return { data: r.data || [], error: r.error || null };
}

function panel(title, body) {
  const el = document.createElement('section');
  el.className = 'panel project-view-panel';
  el.innerHTML = '<h3>' + esc(title) + '</h3>' + body;
  return el;
}

export async function renderGanttUI(projectId = globalThis.pid) {
  const result = await queryTable('project_schedule_tasks', projectId, '*', { column: 'planned_start' });
  if (result.error) return panel('Gantt · 493', QUERY_ERROR_HTML);
  const tasks = buildGanttRows(result.data);
  const rows = tasks.map(x => '<div class="metric-line"><b>' + esc(x.title) + '</b><span>' + esc(x.start || '—') + ' → ' + esc(x.end || '—') + ' · ' + x.progress + '%</span></div>').join('');
  return panel('Gantt · 493', rows || '<span class="muted">تسکی برای نمایش وجود ندارد.</span>');
}

export async function renderKpiDashboardUI(projectId = window.pid) {
  const result = await queryTable('project_kpi_catalog', projectId, '*', { column: 'kpi_code' });
  if (result.error) return panel('KPI Dashboard · 494', QUERY_ERROR_HTML);
  const groups = buildKpiGroups(result.data);
  const body = Object.entries(groups).map(([g, items]) => '<details open><summary><b>' + esc(g) + '</b></summary>' +
    items.map(x => '<div class="metric-line"><span>' + esc(x.kpi_name || x.kpi_code) + '</span><b>' + esc(x.value) + ' ' + esc(x.unit) + '</b></div>').join('') + '</details>').join('');
  return panel('KPI Dashboard · 494', body || '<span class="muted">KPI ثبت نشده است.</span>');
}

export async function renderProcurementCalendarUI(projectId = window.pid) {
  const result = await queryTable('project_procurement', projectId, '*', { column: 'required_date' });
  if (result.error) return panel('Procurement Calendar · 495', QUERY_ERROR_HTML);
  const rows = buildProcurementCalendar(result.data);
  return panel('Procurement Calendar · 495', rows.map(x => '<div class="metric-line"><span>' + esc(x.required_date || x.delivery_date || '—') + '</span><b>' + esc(x.material_name || x.description || x.item_name || 'Purchase') + '</b></div>').join('') || '<span class="muted">مورد خریدی وجود ندارد.</span>');
}

export async function renderFinancialDashboardUI(projectId = window.pid) {
  if (!window.db) return panel('Financial Dashboard · 496', QUERY_ERROR_HTML);
  if (!projectId) return panel('Financial Dashboard · 496', '<span class="muted">پروژه انتخاب نشده است.</span>');
  const r = await window.db.rpc('buildwise_project_dashboard', { p_project_id: projectId });
  if (r.error) {
    reportQueryError('rpc:buildwise_project_dashboard', r.error);
    return panel('Financial Dashboard · 496', QUERY_ERROR_HTML);
  }
  const c = r.data?.cost || {};
  const s = { budget: Number(c.budget || 0), actual: Number(c.actual || 0), committed: Number(c.committed || 0), variance: Number(c.budget || 0) - Number(c.actual || 0) - Number(c.committed || 0) };
  return panel('Financial Dashboard · 496', '<div class="stats"><div class="stat"><span>Budget</span><strong>' + s.budget.toLocaleString('fa-IR') + '</strong></div><div class="stat"><span>Actual</span><strong>' + s.actual.toLocaleString('fa-IR') + '</strong></div><div class="stat"><span>Committed</span><strong>' + s.committed.toLocaleString('fa-IR') + '</strong></div><div class="stat"><span>Remaining</span><strong>' + s.variance.toLocaleString('fa-IR') + '</strong></div></div>');
}

export async function renderUnitSalesMatrixUI(projectId = window.pid) {
  const floorResult = await queryTable('project_floors', projectId, 'id,floor_number,name');
  if (floorResult.error) return panel('Unit Sales Matrix · 497', QUERY_ERROR_HTML);
  const floors = floorResult.data;
  const floorIds = floors.map(x => x.id);
  let units = [];
  if (window.db && floorIds.length) {
    const r = await window.db.from('project_units').select('*').in('floor_id', floorIds);
    if (r.error) {
      reportQueryError('project_units', r.error);
      return panel('Unit Sales Matrix · 497', QUERY_ERROR_HTML);
    }
    units = (r.data || []).map(u => ({...u, floor: floors.find(f => String(f.id) === String(u.floor_id))?.floor_number ?? u.floor_id, unit_id: u.unit_code ?? u.id, area: u.area_m2}));
  }
  const matrix = buildUnitSalesMatrix(units);
  const body = Object.entries(matrix).map(([floor, units]) => '<details open><summary><b>Floor ' + esc(floor) + '</b></summary>' +
    units.map(u => '<div class="metric-line"><span>#' + esc(u.unit_id || u.id) + ' · ' + esc(u.area || '—') + '</span><b>' + esc(u.status || '—') + '</b></div>').join('') + '</details>').join('');
  return panel('Unit Sales Matrix · 497', body || '<span class="muted">واحدی برای نمایش وجود ندارد.</span>');
}

export async function renderWorkflowUI(projectId = window.pid) {
  const rows = Array.isArray(window.__buildwiseWorkflowSteps) ? window.__buildwiseWorkflowSteps : [];
  let orderedSteps = [...rows].sort((a,b) => Number(a.position ?? 0) - Number(b.position ?? 0));
  const el = panel('Workflow · 498', '<div class="workflow-board"></div>');
  const board = el.querySelector('.workflow-board');

  // Re-render through one path so every card keeps its drag handlers after a reorder.
  const renderCards = () => {
    board.replaceChildren();
    orderedSteps.forEach((step, index) => {
      const card = document.createElement('article');
      card.className = 'integration-card';
      card.draggable = true;
      card.dataset.index = String(index);
      card.textContent = step.name || step.title || 'Step';
      card.addEventListener('dragstart', event => {
        event.dataTransfer.setData('text/plain', String(index));
      });
      card.addEventListener('dragover', event => event.preventDefault());
      card.addEventListener('drop', event => {
        event.preventDefault();
        const from = Number(event.dataTransfer.getData('text/plain'));
        const to = Number(card.dataset.index);
        if (!Number.isInteger(from) || !Number.isInteger(to) || from === to) return;
        orderedSteps = reorderWorkflowSteps(orderedSteps, from, to);
        renderCards();
      });
      board.appendChild(card);
    });
  };

  renderCards();
  return el;
}

export async function renderTimelineUI(projectId = window.pid) {
  const result = await queryTable('project_ai_alerts', projectId, 'id,title,alert_type,created_at,severity,status');
  if (result.error) return panel('Timeline · 499', QUERY_ERROR_HTML);
  const rows = buildTimeline(result.data);
  return panel('Timeline · 499', rows.map(x => '<div class="metric-line"><span>' + esc(x.occurred_at || x.created_at || '—') + '</span><b>' + esc(x.title || x.alert_type || 'Event') + '</b><span class="pill">' + esc(x.status || '') + '</span></div>').join('') || '<span class="muted">رویدادی وجود ندارد.</span>');
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
