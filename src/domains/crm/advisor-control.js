const rows = value => Array.isArray(value) ? value : [];

export function createAdvisorControl() {
  return Object.freeze({
    routeRequest({ requestId, advisorId, reason = 'manual' } = {}) {
      return { requestId: requestId ?? null, advisorId: advisorId ?? null, reason, status: advisorId ? 'assigned' : 'unassigned' };
    },

    workload(advisorId, items = []) {
      const scoped = rows(items).filter(x => x?.assignedTo === advisorId);
      const completed = scoped.filter(x => x.status === 'completed' || x.status === 'closed').length;
      return { advisorId, open: scoped.length - completed, completed, total: scoped.length };
    },

    kpi(advisorId, input = {}) {
      const requests = rows(input.requests).filter(x => x?.advisorId === advisorId);
      const followups = rows(input.followups).filter(x => x?.assignedTo === advisorId);
      const responses = rows(input.responses).filter(x => x?.advisorId === advisorId);
      const accepted = responses.filter(x => x.response === 'accepted').length;
      return {
        advisorId,
        requests: requests.length,
        followupsCompleted: followups.filter(x => x.status === 'completed').length,
        followupsOpen: followups.filter(x => x.status !== 'completed').length,
        responses: responses.length,
        acceptanceRatePct: responses.length ? accepted / responses.length * 100 : 0
      };
    },

    scorecard(input = {}) {
      const weights = { response: 0.25, completion: 0.30, workload: 0.20, outcome: 0.25 };
      const score = (
        Number(input.responseRatePct || 0) * weights.response +
        Number(input.completionRatePct || 0) * weights.completion +
        Number(input.workloadHealthPct || 0) * weights.workload +
        Number(input.customerOutcomePct || 0) * weights.outcome
      );
      return { score, weights, metrics: { ...input } };
    },

    promotion({ advisorId, itemId, reason = '' } = {}) {
      return { advisorId: advisorId ?? null, itemId: itemId ?? null, reason, status: 'proposed' };
    },

    hotSlot({ advisorId, slot, reason = '' } = {}) {
      return { advisorId: advisorId ?? null, slot: slot ?? null, reason, status: 'proposed' };
    },

    transfer({ requestId, fromAdvisorId, toAdvisorId, actorId } = {}) {
      return { requestId: requestId ?? null, fromAdvisorId: fromAdvisorId ?? null, toAdvisorId: toAdvisorId ?? null, actorId: actorId ?? null, status: 'transferred' };
    }
  });
}
