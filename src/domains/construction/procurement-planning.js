const DAY = 86400000;

const asNumber = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;
const text = (value, field) => {
  const result = String(value ?? '').trim();
  if (!result) throw new TypeError(field + ' is required');
  return result;
};
const dateMs = (value) => Date.parse(value);
const daysUntil = (from, to) => Math.ceil((dateMs(to) - dateMs(from)) / DAY);

export function buildProcurementMasterPlan({ project_id, materials = [], purchases = [] } = {}) {
  const project = text(project_id, 'project_id');
  if (!Array.isArray(materials) || !Array.isArray(purchases)) throw new TypeError('materials and purchases must be arrays');
  const purchased = new Map();
  for (const purchase of purchases) {
    const id = text(purchase.material_id, 'material_id');
    purchased.set(id, (purchased.get(id) || 0) + Math.max(0, asNumber(purchase.quantity)));
  }
  return {
    project_id: project,
    materials: materials.map((material) => {
      const id = text(material.id, 'material id');
      const quantity = Math.max(0, asNumber(material.quantity));
      const ordered = purchased.get(id) || 0;
      return {
        ...material,
        quantity,
        ordered_quantity: ordered,
        outstanding_quantity: Math.max(0, quantity - ordered),
        required_at: material.required_at ?? null
      };
    })
  };
}

export function compareSupplierOffers(offers = []) {
  if (!Array.isArray(offers)) throw new TypeError('offers must be an array');
  return offers.map((offer) => {
    const unitPrice = Math.max(0, asNumber(offer.unit_price));
    const deliveryDays = Math.max(0, asNumber(offer.delivery_days));
    return {
      ...offer,
      total_score: unitPrice + deliveryDays,
      unit_price: unitPrice,
      delivery_days: deliveryDays
    };
  }).sort((a, b) => a.total_score - b.total_score);
}

export function createPurchaseRequest({ id = null, project_id, material_id, quantity, requested_at = null } = {}) {
  return {
    ...(id ? { id } : { id: `pr-${Date.now()}` }),
    project_id: text(project_id, 'project_id'),
    material_id: text(material_id, 'material_id'),
    quantity: Math.max(0, asNumber(quantity)),
    requested_at,
    status: 'requested'
  };
}

export function createPurchaseOrder(request, { id = null, supplier, unit_price = 0, ordered_at = null } = {}) {
  if (!request?.id) throw new TypeError('request is required');
  return {
    ...(id ? { id } : { id: `po-${Date.now()}` }),
    request_id: request.id,
    project_id: request.project_id,
    material_id: request.material_id,
    quantity: request.quantity,
    supplier: text(supplier, 'supplier'),
    unit_price: Math.max(0, asNumber(unit_price)),
    ordered_at,
    status: 'ordered'
  };
}

export function calculateDeliveryProgress({ ordered_quantity = 0, delivered_quantity = 0 } = {}) {
  const ordered = Math.max(0, asNumber(ordered_quantity));
  if (!ordered) return 0;
  return Math.min(100, Math.max(0, Number((Math.max(0, asNumber(delivered_quantity)) / ordered * 100).toFixed(2))));
}

export function calculateInventory(receipts = []) {
  if (!Array.isArray(receipts)) throw new TypeError('receipts must be an array');
  return receipts.reduce((result, row) => {
    const id = text(row.material_id, 'material_id');
    const current = result[id] || { received: 0, consumed: 0, on_hand: 0 };
    current.received += Math.max(0, asNumber(row.received));
    current.consumed += Math.max(0, asNumber(row.consumed));
    current.on_hand = Math.max(0, current.received - current.consumed);
    result[id] = current;
    return result;
  }, {});
}

export function calculateMaterialConsumption(rows = []) {
  if (!Array.isArray(rows)) throw new TypeError('rows must be an array');
  return rows.reduce((result, row) => {
    const id = text(row.material_id, 'material_id');
    result[id] = (result[id] || 0) + Math.max(0, asNumber(row.quantity));
    return result;
  }, {});
}

export function detectMaterialShortage({ on_hand = 0, committed = 0, required = 0 } = {}) {
  return Math.max(0, asNumber(on_hand)) - Math.max(0, asNumber(committed)) < Math.max(0, asNumber(required));
}

export function calculatePriceVariance({ purchase_price = 0, current_price = 0 } = {}) {
  const purchase = asNumber(purchase_price);
  if (purchase <= 0) return 0;
  return Number(((asNumber(current_price) - purchase) / purchase * 100).toFixed(2));
}

export function recordMaterialPrice({ material_id, price, currency = 'IRR', source, timestamp } = {}) {
  return {
    material_id: text(material_id, 'material_id'),
    price: Math.max(0, asNumber(price)),
    currency,
    source: text(source, 'source'),
    timestamp: text(timestamp, 'timestamp')
  };
}

export function forecastPurchaseNeed({ required_quantity = 0, ordered_quantity = 0, delivered_quantity = 0 } = {}) {
  return {
    required_quantity: Math.max(0, asNumber(required_quantity)),
    ordered_quantity: Math.max(0, asNumber(ordered_quantity)),
    delivered_quantity: Math.max(0, asNumber(delivered_quantity)),
    remaining_quantity: Math.max(0, asNumber(required_quantity) - Math.max(0, asNumber(delivered_quantity)))
  };
}

export function recommendPurchaseTiming({ required_at, lead_time_days = 0, as_of } = {}) {
  const required = text(required_at, 'required_at');
  const today = text(as_of, 'as_of');
  const days = daysUntil(today, required);
  return days <= Math.max(0, asNumber(lead_time_days)) ? 'order_now' : 'monitor';
}

export function calculateProcurementRisk({ required_at, as_of, lead_time_days = 0, shortage_quantity = 0, price_variance_percent = 0 } = {}) {
  const factors = [];
  const days = daysUntil(text(as_of, 'as_of'), text(required_at, 'required_at'));
  if (days <= Math.max(0, asNumber(lead_time_days))) factors.push('lead_time');
  if (asNumber(shortage_quantity) > 0) factors.push('shortage');
  if (Math.abs(asNumber(price_variance_percent)) >= 20) factors.push('price_variance');
  const level = factors.length >= 2 ? 'high' : factors.length === 1 ? 'medium' : 'low';
  return { level, factors };
}
