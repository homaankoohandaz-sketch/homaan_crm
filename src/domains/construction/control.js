const RFI_STATUSES = new Set(['open', 'answered', 'closed']);
const QUALITY_STATUSES = new Set(['open', 'passed', 'failed', 'waived']);
const HSE_STATUSES = new Set(['open', 'mitigated', 'closed']);
const RISK_STATUSES = new Set(['open', 'mitigated', 'closed', 'accepted']);
const ACTION_STATUSES = new Set(['open', 'in_progress', 'done', 'cancelled']);

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
    }
  });
}
