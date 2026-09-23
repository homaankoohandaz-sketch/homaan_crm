import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateConstruction } from '../../src/domains/construction/calculations.js';
test('construction calculation is deterministic', () => {
  const result = calculateConstruction({
    land:210, coverage:70, reg:3, lowerRatio:75, lowerFloors:1, balcony:33, roof:20,
    efficiency:85, extraCount:0, extraArea:0, console:0, parking:0, storage:0,
    commercial:110.25, buildCost:40000000, services:0, extraBroker:0, engineering:0,
    renovation:3000000000, ownerPayment:0, landPrice:185000000, salePrice:180000000,
    commercialPrice:400000000
  });
  assert.equal(result.totalGross, 740);
  assert.equal(result.totalSellable, 629);
  assert.equal(result.commercial, 110.25);
  assert.equal(result.residentialSellable, 518.75);
  assert.ok(result.totalCapital > 0);
});
