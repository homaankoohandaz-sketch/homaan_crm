export function calculateBoq(items = []) {
  if (!Array.isArray(items)) throw new TypeError('items must be an array');
  const seen = new Set();
  const normalized = items.map((item) => {
    if (!item?.id) throw new TypeError('id is required');
    if (seen.has(item.id)) throw new Error('duplicate_item_id');
    seen.add(item.id);
    const quantity = Math.max(0, Number(item.quantity) || 0);
    const unitCost = Math.max(0, Number(item.unit_cost) || 0);
    return {
      ...item,
      quantity,
      unit_cost: unitCost,
      total: quantity * unitCost
    };
  });
  const by_category = {};
  for (const item of normalized) {
    const category = item.category || 'uncategorized';
    by_category[category] = (by_category[category] || 0) + item.total;
  }
  return {
    items: normalized,
    total: normalized.reduce((sum, item) => sum + item.total, 0),
    by_category
  };
}
