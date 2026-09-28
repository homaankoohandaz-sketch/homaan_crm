import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateBoq } from '../../src/domains/construction/boq.js';

test('calculateBoq calculates line totals and project totals', () => {
  const result = calculateBoq([
    { id: 'c1', description: 'Concrete', quantity: 10, unit_cost: 5000000, category: 'structure' },
    { id: 's1', description: 'Steel', quantity: 2, unit_cost: 20000000, category: 'structure' }
  ]);

  assert.equal(result.total, 90000000);
  assert.equal(result.by_category.structure, 90000000);
  assert.equal(result.items[0].total, 50000000);
});

test('calculateBoq rejects duplicate line identifiers', () => {
  assert.throws(() => calculateBoq([
    { id: 'x', description: 'A', quantity: 1, unit_cost: 10 },
    { id: 'x', description: 'B', quantity: 1, unit_cost: 10 }
  ]), /duplicate_item_id/);
});
