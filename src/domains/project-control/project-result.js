/**
 * Project Result layer — checklist 676-681
 * Agent: Grok (xAI) — 2026-10-04
 * Immutable/versioned analysis results; Room consumes published only.
 */

const STATUSES = new Set(['draft', 'published', 'superseded']);

function requireString(value, field) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError(`${field} is required`);
  }
}

function nextVersion(existing = []) {
  const nums = existing
    .map((r) => Number(r.version))
    .filter((n) => Number.isFinite(n) && n > 0);
  return (nums.length ? Math.max(...nums) : 0) + 1;
}

/**
 * Create a new Project Result version. Never mutates prior versions in place.
 */
export function createProjectResult(
  {
    project_id,
    payload = {},
    created_by = null,
    rooms = [],
    analysis = null,
  },
  { existing = [], now = new Date().toISOString() } = {},
) {
  requireString(project_id, 'project_id');
  const version = nextVersion(existing.filter((r) => r.project_id === project_id));
  return Object.freeze({
    id: `${project_id}-result-v${version}`,
    project_id,
    version,
    status: 'draft',
    payload: structuredClone ? structuredClone(payload) : JSON.parse(JSON.stringify(payload)),
    rooms: Array.isArray(rooms) ? [...rooms] : [],
    analysis: analysis == null ? null : analysis,
    created_by,
    created_at: now,
    published_at: null,
    superseded_at: null,
    supersedes: null,
  });
}

/**
 * Publish a draft result. Previous published version for the same project becomes superseded.
 * Prior objects are not mutated; returns { published, superseded }. 
 */
export function publishProjectResult(result, { priorPublished = null, now = new Date().toISOString() } = {}) {
  if (!result || result.status !== 'draft') {
    throw new Error('Only draft results can be published');
  }
  const published = Object.freeze({
    ...result,
    status: 'published',
    published_at: now,
    supersedes: priorPublished?.id ?? null,
  });
  let superseded = null;
  if (priorPublished && priorPublished.status === 'published') {
    superseded = Object.freeze({
      ...priorPublished,
      status: 'superseded',
      superseded_at: now,
    });
  }
  return { published, superseded };
}

/** Room must only read published results (681 companion). */
export function listPublishedResultsForRoom(results, project_id) {
  requireString(project_id, 'project_id');
  return (Array.isArray(results) ? results : []).filter(
    (r) => r.project_id === project_id && r.status === 'published',
  );
}

/** Recover any historical version including superseded (676-677). */
export function getResultVersion(results, project_id, version) {
  requireString(project_id, 'project_id');
  const v = Number(version);
  if (!Number.isFinite(v) || v < 1) throw new TypeError('version must be a positive number');
  return (
    (Array.isArray(results) ? results : []).find(
      (r) => r.project_id === project_id && Number(r.version) === v,
    ) ?? null
  );
}

/**
 * Architectural AI review operates on the project result layer (681), not raw mutable project rows.
 */
export function attachArchitecturalReview(result, review, { now = new Date().toISOString() } = {}) {
  if (!result || typeof result !== 'object') throw new TypeError('result is required');
  if (result.status === 'published' || result.status === 'superseded') {
    // Immutable published: return a new draft based on this result rather than mutating it.
    const draft = createProjectResult(
      {
        project_id: result.project_id,
        payload: result.payload,
        rooms: result.rooms,
        analysis: { ...(result.analysis || {}), architectural_review: review, reviewed_at: now },
        created_by: result.created_by,
      },
      { existing: [result], now },
    );
    return draft;
  }
  return Object.freeze({
    ...result,
    analysis: { ...(result.analysis || {}), architectural_review: review, reviewed_at: now },
  });
}

export function assertNotOverwritten(v1, v2) {
  if (!v1 || !v2) throw new TypeError('both versions required');
  if (v1.id === v2.id) throw new Error('v2 must be a new version id, not overwrite v1');
  if (Number(v2.version) <= Number(v1.version)) {
    throw new Error('v2 version must be greater than v1');
  }
  return true;
}

export { STATUSES };
