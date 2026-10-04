import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildProcurementMasterPlan,
  compareSupplierOffers,
  createPurchaseRequest,
  createPurchaseOrder,
  calculateDeliveryProgress,
  calculateInventory,
  calculateMaterialConsumption,
  detectMaterialShortage,
  calculatePriceVariance,
  recordMaterialPrice,
  forecastPurchaseNeed,
  recommendPurchaseTiming,
  calculateProcurementRisk
} from '../../src/domains/construction/procurement-planning.js';

const materials = [
  { id:'m1', name:'cement', unit:'bag', quantity:100, required_at:'2026-10-10' },
  { id:'m2', name:'rebar', unit:'kg', quantity:1000, required_at:'2026-10-12' }
];

test('builds one procurement master plan from material requirements', () => {
  const plan = buildProcurementMasterPlan({
    project_id:'p1',
    materials,
    purchases:[{id:'po1', material_id:'m1', quantity:60, required_at:'2026-10-10'}]
  });
  assert.equal(plan.project_id,'p1');
  assert.equal(plan.materials.length,2);
  assert.equal(plan.materials[0].outstanding_quantity,40);
  assert.equal(plan.materials[0].required_at,'2026-10-10');
});

test('compares supplier offers without losing commercial fields', () => {
  const result = compareSupplierOffers([
    {supplier:'A', unit_price:100, delivery_days:5},
    {supplier:'B', unit_price:95, delivery_days:8}
  ]);
  assert.equal(result.length,2);
  assert.equal(result[0].supplier,'B');
  assert.equal(result[0].total_score < result[1].total_score,true);
});

test('creates purchase request and purchase order with traceable status', () => {
  const request=createPurchaseRequest({project_id:'p1',material_id:'m1',quantity:40,requested_at:'2026-10-03'});
  assert.equal(request.status,'requested');
  const order=createPurchaseOrder(request,{supplier:'A',unit_price:100,ordered_at:'2026-10-04'});
  assert.equal(order.status,'ordered');
  assert.equal(order.request_id,request.id);
});

test('delivery progress supports partial delivery and completion', () => {
  assert.equal(calculateDeliveryProgress({ordered_quantity:100,delivered_quantity:25}),25);
  assert.equal(calculateDeliveryProgress({ordered_quantity:100,delivered_quantity:100}),100);
});

test('inventory and consumption expose remaining stock and shortage', () => {
  const inventory=calculateInventory([
    {material_id:'m1',received:100,consumed:30},
    {material_id:'m1',received:20,consumed:10}
  ]);
  assert.equal(inventory.m1.on_hand,80);
  const consumption=calculateMaterialConsumption([
    {material_id:'m1',quantity:30},
    {material_id:'m1',quantity:10}
  ]);
  assert.equal(consumption.m1,40);
  assert.equal(detectMaterialShortage({on_hand:80,committed:70,required:30}),true);
});

test('price variance and dated price history are explicit', () => {
  assert.equal(calculatePriceVariance({purchase_price:120,current_price:150}),25);
  const record=recordMaterialPrice({material_id:'m1',price:150,currency:'IRR',source:'supplier-a',timestamp:'2026-10-03T10:00:00Z'});
  assert.equal(record.source,'supplier-a');
  assert.equal(record.timestamp,'2026-10-03T10:00:00Z');
});

test('purchase forecast and timing use required date and lead time', () => {
  const forecast=forecastPurchaseNeed({required_quantity:100,ordered_quantity:20,delivered_quantity:10});
  assert.equal(forecast.remaining_quantity,70);
  assert.equal(recommendPurchaseTiming({required_at:'2026-10-10',lead_time_days:5,as_of:'2026-10-06'}),'order_now');
});

test('procurement risk is bounded and explainable', () => {
  const risk=calculateProcurementRisk({required_at:'2026-10-05',as_of:'2026-10-03',lead_time_days:5,shortage_quantity:20,price_variance_percent:30});
  assert.equal(risk.level,'high');
  assert.ok(risk.factors.includes('lead_time'));
  assert.ok(risk.factors.includes('shortage'));
  assert.ok(risk.factors.includes('price_variance'));
});
