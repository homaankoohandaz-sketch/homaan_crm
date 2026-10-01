const RFI_STATUSES = new Set(['open', 'answered', 'closed']);
const QUALITY_STATUSES = new Set(['open', 'passed', 'failed', 'waived']);
const HSE_STATUSES = new Set(['open', 'mitigated', 'closed']);
const RISK_STATUSES = new Set(['open', 'mitigated', 'closed', 'accepted']);
const ACTION_STATUSES = new Set(['open', 'in_progress', 'done', 'cancelled']);


const SUBMITTAL_STATUSES = new Set(['submitted', 'in_review', 'approved', 'rejected', 'resubmit']);
const EQUIPMENT_STATUSES = new Set(['available', 'in_use', 'maintenance', 'unavailable']);

const numberValue = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;

const text = (value, field) => {
  const v = String(value ?? '').trim();
  if (!v) throw new TypeError(field + ' is required');
  return v;
};
const status = (value, allowed, label, fallback) => {
  const v = value ?? fallback;
  if (!allowed.has(v)) throw new TypeError('invalid ' + label + ' status');
  return v;
};
const percent = (value) => Math.min(100, Math.max(0, Number(value) || 0));

export function createConstructionControlModel() {
  const baseRecord = (input = {}) => ({
    ...(input.id != null ? { id: input.id } : {}),
    title: text(input.title, 'title')
  });

  return Object.freeze({
    normalizeRfi(input = {}) {
      return { ...baseRecord(input), priority: input.priority ?? 'normal', status: status(input.status, RFI_STATUSES, 'RFI', 'open') };
    },
    normalizeQuality(input = {}) {
      return { ...baseRecord(input), status: status(input.status, QUALITY_STATUSES, 'quality', 'open') };
    },
    normalizeHse(input = {}) {
      return { ...baseRecord(input), severity: input.severity ?? 'medium', status: status(input.status, HSE_STATUSES, 'HSE', 'open') };
    },
    normalizeRisk(input = {}) {
      const probability = percent(input.probability);
      const impact = percent(input.impact);
      return { ...baseRecord(input), probability, impact, score: probability * impact / 100, status: status(input.status, RISK_STATUSES, 'risk', 'open') };
    },
    normalizeCorrectiveAction(input = {}) {
      return { ...baseRecord(input), status: status(input.status, ACTION_STATUSES, 'corrective action', 'open') };
    },
    normalizeSubmittal(input = {}) {
      return { ...baseRecord(input), status: status(input.status, SUBMITTAL_STATUSES, 'submittal', 'submitted') };
    },
    normalizeSiteDiary(input = {}) {
      return {
        ...(input.id != null ? { id: input.id } : {}),
        date: text(input.date, 'date'),
        weather: input.weather ?? null,
        notes: input.notes ?? ''
      };
    },
    normalizeDailyReport(input = {}) {
      return {
        ...(input.id != null ? { id: input.id } : {}),
        date: text(input.date, 'date'),
        progress_percent: percent(input.progress_percent),
        accomplishments: input.accomplishments ?? '',
        delays: input.delays ?? ''
      };
    },
    normalizeCrew(input = {}) {
      return {
        ...(input.id != null ? { id: input.id } : {}),
        name: text(input.name, 'name'),
        trade: input.trade ?? null,
        count: Math.max(0, numberValue(input.count))
      };
    },
    normalizeEquipment(input = {}) {
      const name = text(input.name, 'name');
      const current = input.status ?? 'available';
      if (!EQUIPMENT_STATUSES.has(current)) throw new TypeError('invalid equipment status');
      return {
        ...(input.id != null ? { id: input.id } : {}),
        name,
        type: input.type ?? null,
        status: current
      };
    },
    normalizeMaterial(input = {}) {
      return {
        ...(input.id != null ? { id: input.id } : {}),
        material_key: text(input.material_key, 'material_key'),
        name: text(input.name, 'name'),
        unit: input.unit ?? null,
        quantity: Math.max(0, numberValue(input.quantity))
      };
    },
    normalizeProgressPhoto(input = {}) {
      return {
        ...(input.id != null ? { id: input.id } : {}),
        url: text(input.url, 'url'),
        captured_at: input.captured_at ?? null,
        lat: input.lat == null ? null : numberValue(input.lat, null),
        lng: input.lng == null ? null : numberValue(input.lng, null),
        stage: input.stage ?? null,
        geotagged: input.lat != null && input.lng != null
      };
    },
    normalizeBeforeAfter(input = {}) {
      return {
        before_photo_id: input.before_photo_id ?? null,
        after_photo_id: input.after_photo_id ?? null,
        description: input.description ?? ''
      };
    }
  });
}
