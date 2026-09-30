const text = (value) => String(value ?? "").trim();

export function buildSearchFilters({ search = "", fields = [], filters = [] } = {}) {
  return {
    search: text(search) || null,
    searchFields: [...new Set((fields || []).map(text).filter(Boolean))],
    filters: (filters || [])
      .filter((f) => f && text(f.column))
      .map((f) => ({ column: text(f.column), op: f.op || "eq", value: f.value }))
  };
}

export function applyLocalSearch(rows = [], { search = "", fields = [] } = {}) {
  const q = text(search).toLowerCase();
  if (!q) return [...rows];
  const keys = fields.length ? fields : Object.keys(rows[0] || {});
  return rows.filter((row) => keys.some((key) => text(row && row[key]).toLowerCase().includes(q)));
}

export function applyLocalFilters(rows = [], filters = []) {
  return (rows || []).filter((row) => (filters || []).every((filter) => {
    const actual = row && row[filter.column];
    switch (filter.op || "eq") {
      case "eq": return actual === filter.value;
      case "neq": return actual !== filter.value;
      case "gte": return Number(actual) >= Number(filter.value);
      case "lte": return Number(actual) <= Number(filter.value);
      case "in": return Array.isArray(filter.value) && filter.value.map(String).includes(String(actual));
      case "contains": return text(actual).toLowerCase().includes(text(filter.value).toLowerCase());
      case "is_null": return filter.value ? actual == null : actual != null;
      default: throw new TypeError("Unsupported filter operator: " + filter.op);
    }
  }));
}
