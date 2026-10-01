import test from 'node:test';
import assert from 'node:assert/strict';
import { verifyProgressEvidence } from '../../ai-project-control-engine.js';

test('progress verification compares declared progress with evidence', () => {
  const result = verifyProgressEvidence(
    [{ id: 1, progress: 60 }, { id: 2, progress: 20 }],
    [{ task_id: 1, progress: 70 }, { task_id: 2, progress: 20 }]
  );
  assert.equal(result.verifiedTaskCount, 1);
  assert.equal(result.mismatchCount, 1);
  assert.deepEqual(result.mismatches[0], { taskId: 1, declared: 60, evidenced: 70 });
});