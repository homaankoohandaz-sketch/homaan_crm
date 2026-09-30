import assert from 'node:assert/strict';
import {createPurchaseRequest,approvePurchaseRequest,createPurchaseOrder,recordDelivery,materialInventory} from '../src/domains/procurement/operations.js';
let r=createPurchaseRequest({projectId:'p',materialId:'m',quantity:100,requiredDate:'2026-10-01'});assert.equal(r.status,'requested');
r=approvePurchaseRequest(r,{approvedBy:'u1'});assert.equal(r.status,'approved');
const o=createPurchaseOrder(r,{orderId:'po1'});assert.equal(o.status,'ordered');
assert.equal(recordDelivery(o,{quantity:40}).status,'partial');
assert.equal(recordDelivery(o,{quantity:100}).status,'delivered');
assert.equal(materialInventory({opening:10,received:20,consumed:15}).available,15);
console.log('procurement-131-140: passed');