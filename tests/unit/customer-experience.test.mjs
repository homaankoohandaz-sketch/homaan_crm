import test from 'node:test';
import assert from 'node:assert/strict';
import { createCustomerExperience } from '../../src/domains/portal/customer-experience.js';

const e = createCustomerExperience();

test('walkthrough and floor plan viewer preserve ordered presentation state', () => {
  assert.deepEqual(e.walkthrough([{id:'entry'},{id:'lobby'}], 'lobby').current, 'lobby');
  assert.equal(e.floorPlanViewer({id:'p1',url:'/plan.svg',scale:100}, [{x:1}]).annotations[0].id, 'annotation-1');
});

test('unit selector and comparison preserve canonical unit presentation', () => {
  const units = [{id:1,floorId:2,status:'available',bedrooms:2,price:100},{id:2,floorId:3,status:'sold',bedrooms:3,price:200}];
  assert.deepEqual(e.unitSelector(units,{floorId:2,status:'available',bedrooms:2,maxPrice:150}).map(x=>x.id), [1]);
  const x=e.compareUnits([{price:100,area:50,bedrooms:2,floor:2},{price:180,area:90,bedrooms:3,floor:3}]);
  assert.deepEqual(x.rows[2],['pricePerMeter',2,2]);
});

test('customer intent, requirement collection and profile are structured', () => {
  assert.equal(e.detectIntent('برای سرمایه گذاری در شیراز').intent,'investment');
  const x=e.collectRequirement({intent:'living'},{location:'معالی آباد'});
  assert.deepEqual(x.missing,['budget']);
  assert.equal(e.buyerProfile({id:7},{intent:'living',budget:100}).customerId,7);
});

test('location recommendation is capped at four and price tier is deterministic', () => {
  const x=e.recommendLocations([{id:1,score:3},{id:2,score:5},{id:3,score:4},{id:4,score:2},{id:5,score:9}],10);
  assert.deepEqual(x.map(v=>v.id),[5,2,3,1]);
  assert.equal(e.locationPriceTier(100,{low:120,high:300}),'value');
});

test('customer price range never exceeds the five percent customer tolerance', () => {
  assert.deepEqual(e.customerPriceRange(1000),{estimate:1000,min:950,max:1050,tolerancePct:5});
});

test('scenario, proposal and customer-specific ROI preserve evidence', () => {
  const p=e.proposal({id:7},{id:9,title:'Unit A',price:1000,area:100},{customerEstimate:1000,expectedReturn:140,evidence:[{id:'c1',source:'market',value:980}]});
  assert.equal(p.priceRange.max,1050);
  assert.equal(p.evidence.length,1);
  const r=e.roi({id:7},{investment:100,proceeds:130});
  assert.equal(r.profit,30); assert.equal(r.roiPct,30);
});

test('customer journey includes visit and verified rating stages', () => {
  const x=e.requestJourney([{status:'created'},{status:'matched'},{status:'visited'}]);
  assert.equal(x.current,'visited'); assert.equal(x.next,'rated');
  const rating=e.verifiedRating({customerId:7,entityType:'builder',entityId:2,score:6},{id:9,verified:true});
  assert.equal(rating.score,5); assert.equal(rating.verified,true);
});

test('verified ratings aggregate into a public market score', () => {
  const x=e.aggregateRatings([{score:5,verified:true},{score:4,verified:true},{score:1,verified:false}]);
  assert.equal(x.count,2);
  assert.equal(x.average,4.5);
  assert.equal(x.marketScore,90);
});

test('privacy firewall removes blocked fields and does not expose internals', () => {
  const x=e.safeCustomerProperty({id:1,property_name:'A',street:'X',total_price:1000,mobile:'0912',internal_notes:'secret'},1000);
  assert.equal(x.priceRange.min,950);
  assert.equal(x.internalPrice,null);
  assert.equal(x.ownerPhone,null);
  assert.equal(x.internalNotes,null);
  assert.equal(x.street,'X');
  const masked=e.customerPrivacy({name:'A',phone:'0912',secret:'x'},{maskedFields:['phone'],blockedFields:['secret']});
  assert.equal(masked.secret,undefined);
  assert.equal(masked.phone,null);
});

test('notifications, marketplace and appointment retain canonical ownership', () => {
  assert.equal(e.notifications(7,[{customerId:7,createdAt:'2026-01-01'},{customerId:8}]).length,1);
  assert.equal(e.appointment({customerId:7,advisorId:'a1',unitId:4,startsAt:'2026-10-02T10:00:00Z'}).status,'requested');
  const m=e.marketplace([{id:1}],[{id:10,projectId:1,status:'available'}],{status:'available'});
  assert.equal(m.units.length,1);
});
