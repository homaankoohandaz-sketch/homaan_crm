const arr = value => Array.isArray(value) ? value : [];
const num = value => Number.isFinite(Number(value)) ? Number(value) : 0;

export function createCustomerExperience() {
  return Object.freeze({
    walkthrough(stops = [], start = null) {
      const items = arr(stops).map((x, i) => ({ ...x, order: i + 1 }));
      const index = start == null ? 0 : Math.max(0, items.findIndex(x => x.id === start));
      return { stops: items, current: items[index]?.id ?? null, total: items.length };
    },

    floorPlanViewer(plan = {}, annotations = []) {
      return {
        planId: plan.id ?? null,
        url: plan.url ?? null,
        scale: num(plan.scale) || 1,
        annotations: arr(annotations).map((x, i) => ({ ...x, id: x.id ?? `annotation-${i + 1}` }))
      };
    },

    unitSelector(units = [], filters = {}) {
      return arr(units).filter(u => {
        if (filters.floorId != null && String(u.floorId) !== String(filters.floorId)) return false;
        if (filters.status && u.status !== filters.status) return false;
        if (filters.bedrooms != null && num(u.bedrooms) !== num(filters.bedrooms)) return false;
        if (filters.maxPrice != null && num(u.price) > num(filters.maxPrice)) return false;
        return true;
      });
    },

    compareUnits(units = []) {
      const items = arr(units);
      return {
        count: items.length,
        rows: [
          ['price', ...items.map(x => num(x.price))],
          ['area', ...items.map(x => num(x.area))],
          ['pricePerMeter', ...items.map(x => num(x.pricePerMeter || (num(x.price) && num(x.area) ? num(x.price) / num(x.area) : 0)))],
          ['bedrooms', ...items.map(x => num(x.bedrooms))],
          ['floor', ...items.map(x => num(x.floor))]
        ]
      };
    },

    requestJourney(events = []) {
      const order = ['created','qualified','matched','proposal_sent','viewed','responded','appointment','closed'];
      const seen = new Set(arr(events).map(x => x.status));
      const current = [...order].reverse().find(x => seen.has(x)) || 'created';
      return { current, completed: order.filter(x => seen.has(x)), next: order[order.indexOf(current) + 1] ?? null };
    },

    assistant(message = '', context = {}) {
      const text = String(message).trim();
      const lower = text.toLowerCase();
      let intent = 'general';
      if (/قیمت|price|هزینه/.test(lower)) intent = 'price';
      else if (/طبقه|floor|واحد|unit/.test(lower)) intent = 'unit';
      else if (/بازدید|appointment|قرار/.test(lower)) intent = 'appointment';
      else if (/بازده|roi|سود/.test(lower)) intent = 'roi';
      return { intent, context: { ...context }, needsHuman: intent === 'general' || !text };
    },

    proposal(customer = {}, property = {}, economics = {}) {
      return {
        customerId: customer.id ?? null,
        propertyId: property.id ?? null,
        title: property.title || 'پیشنهاد BuildWise',
        price: num(property.price),
        area: num(property.area),
        expectedReturn: num(economics.expectedReturn),
        assumptions: { ...economics.assumptions }
      };
    },

    roi(customer = {}, scenario = {}) {
      const investment = num(scenario.investment);
      const proceeds = num(scenario.proceeds);
      const profit = proceeds - investment;
      return {
        customerId: customer.id ?? null,
        investment,
        proceeds,
        profit,
        roiPct: investment ? profit / investment * 100 : 0,
        annualizedRoiPct: investment > 0 && proceeds >= 0 && num(scenario.years) > 0 ? ((Math.pow(proceeds / investment, 1 / num(scenario.years)) - 1) * 100) : 0
      };
    },

    notifications(customerId, events = []) {
      return arr(events).filter(x => String(x.customerId) === String(customerId))
        .sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
    },

    appointment(input = {}) {
      return {
        customerId: input.customerId ?? null,
        advisorId: input.advisorId ?? null,
        projectId: input.projectId ?? null,
        startsAt: input.startsAt ?? null,
        endsAt: input.endsAt ?? null,
        status: input.status || 'requested',
        notes: String(input.notes || '')
      };
    }
  });
}