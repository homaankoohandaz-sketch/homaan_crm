import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createProjectResult,
  publishProjectResult,
  listPublishedResultsForRoom,
  getResultVersion,
  attachArchitecturalReview,
  assertNotOverwritten,
} from '../../src/domains/project-control/project-result.js';

test('676-678: versions are immutable and v2 does not overwrite v1', () => {
  const v1 = createProjectResult({
    project_id: 'proj-1',
    payload: { units: 8 },
    created_by: 'analyst',
  });
  assert.equal(v1.version, 1);
  assert.equal(v1.status, 'draft');

  const { published: pub1 } = publishProjectResult(v1);
  assert.equal(pub1.status, 'published');
  assert.ok(pub1.published_at);

  const v2draft = createProjectResult(
    { project_id: 'proj-1', payload: { units: 10 }, created_by: 'analyst' },
    { existing: [pub1] },
  );
  assert.equal(v2draft.version, 2);
  assertNotOverwritten(pub1, v2draft);

  const { published: pub2, superseded } = publishProjectResult(v2draft, {
    priorPublished: pub1,
  });
  assert.equal(pub2.version, 2);
  assert.equal(pub2.supersedes, pub1.id);
  assert.equal(superseded.status, 'superseded');
  assert.equal(superseded.version, 1);
  // original pub1 object identity not required; superseded is a new freeze copy
  assert.notEqual(pub2.id, pub1.id);
});

test('677: historical v1 remains recoverable after v2 publish', () => {
  const v1 = createProjectResult({ project_id: 'p', payload: { a: 1 } });
  const { published: pub1 } = publishProjectResult(v1);
  const v2 = createProjectResult({ project_id: 'p', payload: { a: 2 } }, { existing: [pub1] });
  const { published: pub2, superseded } = publishProjectResult(v2, { priorPublished: pub1 });
  const bag = [superseded, pub2];
  const recovered = getResultVersion(bag, 'p', 1);
  assert.equal(recovered.version, 1);
  assert.equal(recovered.status, 'superseded');
  assert.deepEqual(recovered.payload, { a: 1 });
});

test('679-680: Room only sees published results', () => {
  const d = createProjectResult({ project_id: 'p', payload: {} });
  const { published } = publishProjectResult(d);
  const draft2 = createProjectResult({ project_id: 'p', payload: { x: 1 } }, { existing: [published] });
  const visible = listPublishedResultsForRoom([published, draft2], 'p');
  assert.equal(visible.length, 1);
  assert.equal(visible[0].status, 'published');
});

test('681: architectural AI review attaches to result layer; published stays immutable', () => {
  const d = createProjectResult({ project_id: 'p', payload: { floors: 5 } });
  const { published } = publishProjectResult(d);
  const reviewedDraft = attachArchitecturalReview(published, { ok: true, notes: 'setbacks ok' });
  assert.equal(reviewedDraft.status, 'draft');
  assert.equal(reviewedDraft.version, 2);
  assert.equal(reviewedDraft.analysis.architectural_review.ok, true);
  assert.equal(published.status, 'published');
  assert.equal(published.analysis, null);
});
