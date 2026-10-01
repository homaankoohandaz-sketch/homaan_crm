import test from 'node:test';
import assert from 'node:assert/strict';
import { createCustomerExperience } from '../../src/domains/portal/customer-experience.js';

const e = createCustomerExperience();

test('walkthrough and floor plan viewer preserve ordered presentation state', () => {
  assert.deepEqual(e.walkthrough([{id:'entry'},{id:'lobby'}], 'lobby').current, 'lobby');
  assert.equal(e.floorPlanViewer({id:'p1',url:'/plan.svg',scale:100}, [{x:1}]).annotations[0].id, 'annotation-1');
});

test('unit selector filters by floor, status, bedrooms and price', () => {
  const units = [{id:1,floorId:2,status:'available',bedrooms:2,price:100},{id:2,floorId:3,status:'sold',bedrooms:3,price:200}];
  assert.deepEqual(e.unitSelector(units,{floorId:2,status:'available',bedrooms:2,maxPrice:150}).map(x=>x.id), [1]);
});

test('unit comparison calculates price per meter', () => {
  const x=e.compareUnits([{price:100,area:50,bedrooms:2,floor:2},{price:180,area:90,bedrooms:3,floor:3}]);
  assert.deepEqual(x.rows[2],['pricePerMeter',2,2]);
});

test('customer journey returns current and next state', () => {
  const x=e.requestJourney([{status:'created'},{status:'matched'},{status:'proposal_sent'}]);
  assert.equal(x.current,'proposal_sent'); assert.equal(x.next,'viewed');
});

test('customer assistant routes supported intents and escalates unknown requests', () => {
  assert.equal(e.assistant('قیمت این واحد چقدر است').intent,'price');
  assert.equal(e.assistant('یک سوال خاص').needsHuman,true);
});

test('proposal and customer-specific ROI are deterministic', () => {
  const p=e.proposal({id:7},{id:9,title:'Unit A',price:1000,area:100},{expectedReturn:140,assumptions:{holdingMonths:12}});
  assert.equal(p.customerId,7); assert.equal(p.expectedReturn,140);
  const r=e.roi({id:7},{investment:100,proceeds:130});
  assert.equal(r.profit,30); assert.equal(r.roiPct,30);
});

test('notifications and appointment workflow retain customer ownership', () => {
  assert.equal(e.notifications(7,[{customerId:7,createdAt:'2026-01-01'},{customerId:8}]).length,1);
  assert.equal(e.appointment({customerId:7,advisorId:'a1',startsAt:'2026-10-02T10:00:00Z'}).status,'requested');
});
