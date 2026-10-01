import test from 'node:test';
import assert from 'node:assert/strict';
import { createConstructionControlModel } from '../../src/domains/construction/control.js';

test('construction control normalizes submittals, site and daily reports', () => {
  const c = createConstructionControlModel();
  assert.equal(c.normalizeSubmittal({title:'Shop drawing', status:'approved'}).status, 'approved');
  assert.equal(c.normalizeSiteDiary({date:'2026-10-01', weather:'sunny', notes:'site active'}).date, '2026-10-01');
  assert.equal(c.normalizeDailyReport({date:'2026-10-01', progress_percent:35}).progress_percent, 35);
});

test('construction control normalizes crew equipment material and progress evidence', () => {
  const c = createConstructionControlModel();
  assert.equal(c.normalizeCrew({name:'کارگاه', trade:'structure', count:8}).count, 8);
  assert.equal(c.normalizeEquipment({name:'Crane', type:'lifting', status:'available'}).status, 'available');
  assert.equal(c.normalizeMaterial({material_key:'cement', name:'Cement', unit:'bag', quantity:100}).quantity, 100);
  assert.equal(c.normalizeProgressPhoto({url:'https://example.test/p.jpg', lat:29.6, lng:52.5, stage:'structure'}).geotagged, true);
  assert.equal(c.normalizeBeforeAfter({before_photo_id:1, after_photo_id:2}).after_photo_id, 2);
});

test('construction control clamps progress and rejects invalid operational records', () => {
  const c = createConstructionControlModel();
  assert.equal(c.normalizeDailyReport({date:'2026-10-01', progress_percent:140}).progress_percent, 100);
  assert.throws(() => c.normalizeSubmittal({title:'x', status:'bad'}), /invalid submittal status/);
  assert.throws(() => c.normalizeEquipment({name:'x', status:'bad'}), /invalid equipment status/);
  assert.throws(() => c.normalizeProgressPhoto({url:'', stage:'structure'}), /url is required/);
});