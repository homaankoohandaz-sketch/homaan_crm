const arr = value => Array.isArray(value) ? value : [];
const num = value => Number.isFinite(Number(value)) ? Number(value) : 0;
const text = value => String(value ?? '').trim();

const INTENTS = Object.freeze({
  living: /سکونت|زندگی|مسکونی|living/i,
  investment: /سرمایه|سرمایه.?گذاری|invest/i,
  sell: /فروش|sell/i,
  landOwner: /زمین.?دار|مالک زمین|زمینم|land.?owner/i,
  build: /ساخت|بساز|build/i,
  participation: /مشارکت|participation/i,
  barter: /تهاتر|barter/i,
  plotAnalysis: /تحلیل زمین|تحلیل ملک|آنالیز ملک|plot|property.?analysis/i
});

const maskValue = (value, visible = true) => visible ? value : null;

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

    detectIntent(message = '') {
      const value = text(message);
      for (const [intent, pattern] of Object.entries(INTENTS)) {
        if (pattern.test(value)) return { intent, confidence: 0.9, source: 'rule' };
      }
      if (/قیمت|price|هزینه/i.test(value)) return { intent: 'price', confidence: 0.8, source: 'rule' };
      if (/بازدید|appointment|قرار/i.test(value)) return { intent: 'appointment', confidence: 0.8, source: 'rule' };
      if (/بازده|roi|سود/i.test(value)) return { intent: 'roi', confidence: 0.8, source: 'rule' };
      return { intent: 'general', confidence: value ? 0.2 : 0, source: 'fallback' };
    },

    collectRequirement(current = {}, extracted = {}) {
      const merged = { ...current };
      for (const [key, value] of Object.entries(extracted || {})) {
        if (value !== null && value !== undefined && value !== '') merged[key] = value;
      }
      const requiredByIntent = {
        living: ['location','budget'],
        investment: ['budget'],
        landOwner: ['landArea','goal'],
        build: ['landArea','budget'],
        participation: ['budget'],
        barter: ['asset'],
        sell: ['propertyType'],
        plotAnalysis: ['landArea']
      };
      const missing = (requiredByIntent[merged.intent] || []).filter(k => merged[k] == null || merged[k] === '');
      return { profile: merged, missing, ready: missing.length === 0 };
    },

    buyerProfile(customer = {}, requirements = {}) {
      return {
        customerId: customer.id ?? null,
        intent: requirements.intent || 'general',
        budget: requirements.budget ?? null,
        location: requirements.location ?? null,
        areaMin: requirements.areaMin ?? null,
        areaMax: requirements.areaMax ?? null,
        bedrooms: requirements.bedrooms ?? null,
        priorities: arr(requirements.priorities)
      };
    },

    locationPriceTier(pricePerMeter, bands = {}) {
      const value = num(pricePerMeter);
      const low = num(bands.low);
      const high = num(bands.high);
      if (high > 0 && value >= high) return 'premium';
      if (low > 0 && value <= low) return 'value';
      return 'mid';
    },

    recommendLocations(locations = [], limit = 4) {
      return arr(locations)
        .map((x, i) => ({ ...x, _sourceIndex: i, score: num(x.score) }))
        .sort((a,b) => b.score - a.score || a._sourceIndex - b._sourceIndex)
        .slice(0, Math.min(4, Math.max(0, num(limit) || 4)))
        .map(({ _sourceIndex, ...x }, i) => ({ ...x, rank: i + 1 }));
    },

    marketplace(projects = [], units = [], filters = {}) {
      const selectedUnits = this.unitSelector(units, filters);
      const projectIds = new Set(selectedUnits.map(x => String(x.projectId)).filter(Boolean));
      return {
        projects: arr(projects).filter(p => !projectIds.size || projectIds.has(String(p.id))),
        units: selectedUnits
      };
    },

    customerPriceRange(estimate, tolerance = 0.05) {
      const value = num(estimate);
      const t = Math.min(0.05, Math.max(0, num(tolerance) || 0.05));
      return { estimate: value, min: value * (1 - t), max: value * (1 + t), tolerancePct: t * 100 };
    },

    comparableEvidence(items = []) {
      return arr(items).filter(x => x && x.supported !== false).map(x => ({
        id: x.id ?? null,
        source: text(x.source),
        value: num(x.value),
        distance: x.distance ?? null,
        timestamp: x.timestamp ?? null
      }));
    },

    scenarioCompare(scenarios = []) {
      return arr(scenarios).map((x, i) => ({
        ...x,
        rank: i + 1,
        roiPct: num(x.roiPct),
        profit: num(x.profit),
        liquidity: num(x.liquidity),
        risk: num(x.risk)
      })).sort((a,b) => b.roiPct - a.roiPct);
    },

    requestJourney(events = []) {
      const order = ['created','qualified','matched','proposal_sent','viewed','responded','appointment','visited','rated','closed'];
      const seen = new Set(arr(events).map(x => x.status));
      const current = [...order].reverse().find(x => seen.has(x)) || 'created';
      return { current, completed: order.filter(x => seen.has(x)), next: order[order.indexOf(current) + 1] ?? null };
    },

    assistant(message = '', context = {}) {
      const intent = this.detectIntent(message);
      return {
        intent: intent.intent,
        confidence: intent.confidence,
        context: { ...context },
        needsHuman: intent.intent === 'general' || !text(message)
      };
    },

    proposal(customer = {}, property = {}, economics = {}) {
      const range = this.customerPriceRange(economics.customerEstimate ?? property.price, economics.tolerance ?? 0.05);
      return {
        customerId: customer.id ?? null,
        propertyId: property.id ?? null,
        title: property.title || 'پیشنهاد BuildWise',
        priceRange: range,
        area: num(property.area),
        expectedReturn: num(economics.expectedReturn),
        assumptions: { ...economics.assumptions },
        evidence: this.comparableEvidence(economics.evidence)
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
        unitId: input.unitId ?? null,
        startsAt: input.startsAt ?? null,
        endsAt: input.endsAt ?? null,
        status: input.status || 'requested',
        notes: text(input.notes)
      };
    },

    verifiedRating(input = {}, interaction = {}) {
      const score = Math.max(1, Math.min(5, Math.round(num(input.score))));
      return {
        customerId: input.customerId ?? null,
        entityType: text(input.entityType),
        entityId: input.entityId ?? null,
        ratingKind: text(input.ratingKind || 'overall'),
        score,
        verified: interaction.verified === true,
        interactionId: interaction.id ?? null,
        comment: text(input.comment)
      };
    },

    aggregateRatings(ratings = []) {
      const verified = arr(ratings).filter(x => x.verified === true);
      if (!verified.length) return { count: 0, average: null, marketScore: null };
      const average = verified.reduce((s, x) => s + num(x.score), 0) / verified.length;
      return { count: verified.length, average, marketScore: Number((average * 20).toFixed(2)) };
    },

    customerPrivacy(value = {}, policy = {}) {
      const blocked = new Set(arr(policy.blockedFields));
      const masked = new Set(arr(policy.maskedFields));
      const out = {};
      for (const [key, fieldValue] of Object.entries(value || {})) {
        if (blocked.has(key)) continue;
        out[key] = masked.has(key) ? maskValue(fieldValue, false) : fieldValue;
      }
      return out;
    },

    safeCustomerProperty(property = {}, estimate = null) {
      const range = this.customerPriceRange(estimate ?? property.customerEstimate ?? property.total_price);
      return {
        id: property.id ?? null,
        propertyName: property.property_name ?? property.title ?? null,
        propertyType: property.property_type ?? null,
        region: property.region ?? null,
        neighborhood: property.neighborhood ?? null,
        street: property.street ?? null,
        area: num(property.built_area ?? property.area),
        bedrooms: num(property.bedrooms),
        priceRange: range,
        description: property.description ?? null,
        ownerPhone: null,
        ownerAddress: null,
        internalPrice: null,
        internalNotes: null,
        negotiation: null
      };
    }
  });
}
