function clampPercent(value) {
  return Math.min(100, Math.max(0, Number(value) || 0));
}

export function calculateProgress({ planned = 0, actual = 0, weight = 1 } = {}) {
  const plannedValue = Math.max(0, Number(planned) || 0);
  const actualValue = Math.max(0, Number(actual) || 0);
  const safeWeight = Math.max(0, Number(weight) || 0);
  const percent = plannedValue === 0 ? (actualValue > 0 ? 100 : 0) : clampPercent(actualValue / plannedValue * 100);
  return {
    planned: plannedValue,
    actual: actualValue,
    percent,
    weight: safeWeight,
    earned_weight: safeWeight * percent / 100
  };
}

export function summarizeProgress(items = []) {
  if (!Array.isArray(items)) throw new TypeError('items must be an array');

  const normalized = items.map((item) => ({
    ...item,
    ...calculateProgress(item)
  }));
  const totalWeight = normalized.reduce((sum, item) => sum + item.weight, 0);
  const earnedWeight = normalized.reduce((sum, item) => sum + item.earned_weight, 0);
  const percent = totalWeight ? earnedWeight / totalWeight * 100 : 0;
  const scheduleVarianceDays = normalized.reduce((max, item) => {
    if (!item.baseline_finish || !item.forecast_finish) return max;
    const variance = Math.round((Date.parse(item.forecast_finish) - Date.parse(item.baseline_finish)) / 86400000);
    return Math.max(max, variance);
  }, 0);

  return {
    percent,
    remaining_percent: Math.max(0, 100 - percent),
    completed_items: normalized.filter((item) => item.percent >= 100).length,
    total_items: normalized.length,
    total_weight: totalWeight,
    earned_weight: earnedWeight,
    schedule_variance_days: scheduleVarianceDays,
    items: normalized
  };
}
