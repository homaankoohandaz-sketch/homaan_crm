import { validateWbs } from './wbs.js';

function addDays(iso, days) {
  const date = new Date(iso + 'T00:00:00Z');
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function maxDate(values) {
  return values.filter(Boolean).reduce((max, value) => max === null || value > max ? value : max, null);
}

export function buildSchedule(wbsItems, { start_date = new Date().toISOString().slice(0, 10) } = {}) {
  const validation = validateWbs(wbsItems);
  if (!validation.valid) throw new Error(validation.error);

  const byId = new Map(wbsItems.map((item) => [String(item.id), item]));
  const computed = new Map();

  function visit(id, stack = new Set()) {
    if (computed.has(id)) return computed.get(id);
    if (stack.has(id)) throw new Error('dependency_cycle');
    stack.add(id);
    const item = byId.get(id);
    const dependencyFinishes = (item.depends_on ?? []).map((dep) => visit(String(dep), stack).finish_date);
    const itemStart = maxDate(dependencyFinishes) ?? start_date;
    const duration = Math.max(0, Number(item.duration_days) || 0);
    const result = {
      ...item,
      start_date: itemStart,
      finish_date: addDays(itemStart, duration)
    };
    stack.delete(id);
    computed.set(id, result);
    return result;
  }

  const items = wbsItems.map((item) => visit(String(item.id))).sort(
    (a, b) => a.start_date.localeCompare(b.start_date) || (a.sort_order ?? 0) - (b.sort_order ?? 0) || String(a.id).localeCompare(String(b.id))
  );

  return {
    start_date,
    finish_date: maxDate(items.map((item) => item.finish_date)) ?? start_date,
    items
  };
}

export function getCriticalItems(schedule) {
  if (!schedule?.items?.length) return [];
  const byId = new Map(schedule.items.map((item) => [String(item.id), item]));
  const end = schedule.finish_date;
  const terminal = schedule.items.filter((item) => item.finish_date === end);
  const ids = new Set();

  function walk(item) {
    if (!item || ids.has(item.id)) return;
    ids.add(item.id);
    for (const dep of item.depends_on ?? []) walk(byId.get(String(dep)));
  }

  terminal.forEach(walk);
  return schedule.items.filter((item) => ids.has(item.id));
}
