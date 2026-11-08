import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateExcelConstructionModel, CONSTRUCTION_EXCEL_ROWS } from '../../src/domains/construction/excel-model.js';

const sample = {
  landArea: 397, plotWidth: 10, buildingRegulation: 6, groundCoveragePercent: 100,
  lowerBuildablePercent: 0, lowerFloorsForFormula: 0, displayedLowerFloors: 2,
  balconyArea: 60, rooftopArea: 25, efficiencyPercent: 80,
  additionalStoreyCount: 1, additionalStoreyArea: 397, consoleArea: 10,
  parkingArea: 75, storageArea: 60, constructionCostPerM2: 50000000,
  servicesCost: 0, extraDensityBrokerCost: 0, engineeringManagementCost: 0,
  permitCost: 7000000000, ownerPayment: 0, landPricePerM2: 100000000,
  residentialSalePricePerM2: 100000000, commercialSalePricePerM2: 150000000,
  commercialAreaMultiplier: 2, builderPercent: 75, ownerPercent: 25,
  monthlyRentPerM2: 1000000
};

test('reproduces the supplied M6 Excel model without dropping its rows', () => {
  const result = calculateExcelConstructionModel(sample);
  assert.equal(result.cells.C11, 397);
  assert.equal(result.cells.C12, 2382);
  assert.equal(result.cells.C16, 2864);
  assert.ok(Math.abs(result.cells.C20 - 2291.2) < 1e-9);
  assert.equal(result.cells.C25, 407);
  assert.equal(result.cells.C28, 3271);
  assert.ok(Math.abs(result.cells.C30 - 2116.6) < 1e-9);
  assert.equal(result.cells.C35, 406.5);
  assert.equal(result.cells.C36, 135.5);
  assert.equal(result.cells.C39, 163550000000);
  assert.equal(result.cells.C49, 46700000000);
  assert.equal(result.cells.C51, 210250000000);
  assert.equal(result.cells.C59, 361140000000);
  assert.equal(result.cells.C60, 150890000000);
  assert.ok(Math.abs(result.cells.C61 - 0.537118759445932) < 1e-10);
  assert.ok(Math.abs(result.cells.C72 - 1646.4681569560046) < 1e-9);
  assert.ok(Math.abs(result.cells.C77 - 470.1318430439952) < 1e-9);
  assert.equal(result.cells.C81, 635.2);
  assert.equal(result.cells.C83, 95280000000);
  assert.ok(Math.abs(result.cells.C89 - 0.41781580550479035) < 1e-10);
  assert.equal(CONSTRUCTION_EXCEL_ROWS.length, 81);
});

test('flags formula-model double counting instead of silently changing Excel outputs', () => {
  const result = calculateExcelConstructionModel(sample);
  assert.ok(result.warnings.some(item => item.code === 'ADDITIONAL_AREA_INCLUDED_TWICE'));
  assert.ok(result.warnings.some(item => item.code === 'COMMERCIAL_AREA_SUBTRACTED_FROM_SELLABLE'));
});

test('rejects impossible percentages and negative land area', () => {
  assert.throws(() => calculateExcelConstructionModel({ ...sample, groundCoveragePercent: 140 }), /groundCoveragePercent/);
  assert.throws(() => calculateExcelConstructionModel({ ...sample, landArea: -1 }), /landArea/);
});
