const TYPES = new Set(['project', 'complex', 'building', 'phase', 'floor', 'unit']);
const STATUSES = new Set(['planned', 'active', 'on_hold', 'completed', 'cancelled']);

function requiredString(value, field) {
  if (typeof value !== 'string' || value.trim() === '') throw new TypeError(`${field} is required`);
}

export function createProjectNode(input, { now = new Date().toISOString() } = {}) {
  requiredString(input?.id, 'id');
  requiredString(input?.name, 'name');
  if (!TYPES.has(input.type)) throw new TypeError('Invalid type');
  if (input.parent_id != null) requiredString(String(input.parent_id), 'parent_id');
  if (input.status != null && !STATUSES.has(input.status)) throw new TypeError('Invalid status');
  return { id: input.id, name: input.name.trim(), type: input.type, parent_id: input.parent_id ?? null, status: input.status ?? 'planned', sort_order: Number.isFinite(Number(input.sort_order)) ? Number(input.sort_order) : 0, metadata: input.metadata && typeof input.metadata === 'object' ? { ...input.metadata } : {}, created_at: input.created_at ?? now, updated_at: now };
}

export function validateProjectHierarchy(nodes) {
  if (!Array.isArray(nodes)) throw new TypeError('nodes must be an array');
  const byId = new Map();
  for (const node of nodes) {
    if (!node?.id || byId.has(node.id)) return { valid: false, error: 'duplicate_node_id', node_id: node?.id ?? null };
    if (!TYPES.has(node.type)) return { valid: false, error: 'invalid_node_type', node_id: node.id };
    byId.set(node.id, node);
  }
  const order = ['project','complex','building','phase','floor','unit'];
  for (const node of nodes) {
    if (node.parent_id == null) continue;
    const parent = byId.get(node.parent_id);
    if (!parent) return { valid: false, error: 'missing_parent', node_id: node.id, parent_id: node.parent_id };
    if (order.indexOf(parent.type) >= order.indexOf(node.type)) return { valid: false, error: 'invalid_parent_type', node_id: node.id, parent_type: parent.type, node_type: node.type };
  }
  for (const node of nodes) {
    const seen = new Set([node.id]); let current = node;
    while (current.parent_id != null) {
      if (seen.has(current.parent_id)) return { valid: false, error: 'cycle', node_id: node.id };
      seen.add(current.parent_id); current = byId.get(current.parent_id); if (!current) break;
    }
  }
  return { valid: true, roots: nodes.filter(n => n.parent_id == null).map(n => n.id) };
}

export function getProjectChildren(nodes, parentId) {
  if (!Array.isArray(nodes)) throw new TypeError('nodes must be an array');
  return nodes.filter(node => node.parent_id === parentId).sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
}

export { TYPES, STATUSES };