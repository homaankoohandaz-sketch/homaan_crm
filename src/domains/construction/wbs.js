const TYPES = new Set(['project','phase','wbs','task','milestone']);
const STATUSES = new Set(['pending','ready','in_progress','blocked','done','cancelled']);

function str(value, field) {
  if (typeof value !== 'string' || value.trim() === '') throw new TypeError(field + ' is required');
}

export function createWbsItem(input, { now = new Date().toISOString() } = {}) {
  str(input?.id, 'id');
  str(input?.name, 'name');
  if (!TYPES.has(input.type)) throw new TypeError('Invalid WBS type');
  if (input.parent_id != null) str(String(input.parent_id), 'parent_id');
  if (input.status != null && !STATUSES.has(input.status)) throw new TypeError('Invalid WBS status');
  return {
    id: input.id,
    name: input.name.trim(),
    type: input.type,
    parent_id: input.parent_id ?? null,
    status: input.status ?? 'pending',
    sort_order: Number.isFinite(Number(input.sort_order)) ? Number(input.sort_order) : 0,
    duration_days: Math.max(0, Number(input.duration_days) || 0),
    depends_on: Array.isArray(input.depends_on) ? input.depends_on.map(String) : [],
    metadata: input.metadata && typeof input.metadata === 'object' ? { ...input.metadata } : {},
    created_at: input.created_at ?? now,
    updated_at: now
  };
}

export function validateWbs(items) {
  if (!Array.isArray(items)) throw new TypeError('items must be an array');
  const byId = new Map();
  for (const item of items) {
    if (!item?.id || byId.has(item.id)) return { valid:false, error:'duplicate_item_id', item_id:item?.id ?? null };
    if (!TYPES.has(item.type)) return { valid:false, error:'invalid_item_type', item_id:item.id };
    byId.set(item.id, item);
  }
  for (const item of items) {
    if (item.parent_id != null && !byId.has(item.parent_id))
      return { valid:false, error:'missing_parent', item_id:item.id, parent_id:item.parent_id };
    for (const dependency of item.depends_on ?? []) {
      if (!byId.has(dependency)) return { valid:false, error:'missing_dependency', item_id:item.id, dependency };
      if (dependency === item.id) return { valid:false, error:'self_dependency', item_id:item.id };
    }
  }
  for (const item of items) {
    const seen = new Set([item.id]);
    let current = item;
    while (current.parent_id != null) {
      if (seen.has(current.parent_id)) return { valid:false, error:'parent_cycle', item_id:item.id };
      seen.add(current.parent_id);
      current = byId.get(current.parent_id);
      if (!current) break;
    }
  }
  const dependencyVisit = new Set();
  const dependencyStack = new Set();
  function visit(id) {
    if (dependencyStack.has(id)) return true;
    if (dependencyVisit.has(id)) return false;
    dependencyVisit.add(id);
    dependencyStack.add(id);
    const item = byId.get(id);
    for (const dep of item.depends_on ?? []) if (visit(dep)) return true;
    dependencyStack.delete(id);
    return false;
  }
  for (const item of items) if (visit(item.id)) return { valid:false, error:'dependency_cycle', item_id:item.id };
  return { valid:true };
}

export function getReadyWbsItems(items, completedIds = []) {
  const completed = new Set(completedIds.map(String));
  return items.filter(item =>
    (item.type === 'task' || item.type === 'milestone') &&
    item.status !== 'done' &&
    (item.depends_on ?? []).every(dep => completed.has(String(dep)))
  ).sort((a,b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
}

export function toWorkflow(wbsItems, { id = 'construction-wbs', name = 'Construction WBS', version = 1 } = {}) {
  const validation = validateWbs(wbsItems);
  if (!validation.valid) throw new Error(validation.error);
  return {
    id, name, version, status:'draft',
    config:{ source:'buildwise-wbs' },
    steps:wbsItems.filter(x => x.type === 'task' || x.type === 'milestone').map((x, i) => ({
      id:String(x.id),
      name:x.name,
      status:x.status === 'done' ? 'done' : 'pending',
      depends_on:(x.depends_on ?? []).map(String),
      duration_days:x.duration_days,
      role:x.metadata?.role ?? null,
      parallel_group:x.metadata?.parallel_group ?? null,
      metadata:{ ...x.metadata, wbs_item_id:x.id, parent_id:x.parent_id }
    }))
  };
}

export { TYPES, STATUSES };
