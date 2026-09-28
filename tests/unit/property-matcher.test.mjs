import test from 'node:test';
import assert from 'node:assert/strict';
import { scorePropertyMatch, rankProperties } from '../../src/domains/matching/property-matcher.js';

test('matching scores region budget area and ranks deterministically', () => {
  const buyer = { region: 5, maxPrice: 1e10, minArea: 100, minBedrooms: 2, propertyType: 'apartment', barter: false };
  const properties = [
    { id: 'b', region: 5, price: 9e9, area: 120, bedrooms: 3, propertyType: 'apartment', barter: false },
    { id: 'a', region: 1, price: 5e9, area: 80, bedrooms: 1, propertyType: 'land', barter: true },
    { id: 'c', region: 5, price: 8e9, area: 150, bedrooms: 3, propertyType: 'apartment', barter: false }
  ];
  const ranked = rankProperties(buyer, properties);
  assert.equal(ranked.length, 3);
  assert.ok(ranked[0].score >= ranked[1].score);
  assert.ok(ranked[1].score >= ranked[2].score);
  assert.equal(ranked[2].property.id, 'a');
  assert.ok(ranked[0].score > ranked[2].score);
  assert.ok(['b', 'c'].includes(ranked[0].property.id));
  assert.deepEqual(rankProperties(buyer, []), []);
});

test('matching empty buyer criteria yields zero score without throw', () => {
  const r = scorePropertyMatch({}, { region: 1, price: 1 });
  assert.equal(r.score, 0);
  assert.equal(r.explainable, true);
});
