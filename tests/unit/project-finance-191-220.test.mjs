import test from 'node:test';
import assert from 'node:assert/strict';
import { createProjectFinanceModel } from '../../src/domains/finance/project-finance.js';

test('191-200 finance core exposes ledger, accounts, budget and forecast',()=>{
  const f=createProjectFinanceModel();
  const ledger=f.ledger({projectId:'p1',entries:[{accountId:'construction',amount:100},{accountId:'construction',amount:-20}]});
  assert.equal(ledger.projectId,'p1');
  assert.equal(ledger.balanceByAccount.construction,80);
  const budget=f.budgetControl({budget:1000,revisedBudget:1200,actual:700,committed:300,remaining:200});
  assert.deepEqual(budget,{budget:1000,revisedBudget:1200,actual:700,committed:300,remaining:200,totalProjectCost:1200});
});

test('201-220 finance core groups cost dimensions and exposes current variance',()=>{
  const f=createProjectFinanceModel();
  const result=f.costControl({entries:[
    {wbsId:'w1',phaseId:'p1',floorId:'f1',unitId:'u1',contractorId:'c1',supplierId:'s1',materialId:'m1',purchaseId:'po1',invoiceId:'i1',paymentId:'pay1',date:'2026-10-01',amount:100},
    {wbsId:'w1',phaseId:'p2',floorId:'f2',unitId:'u2',contractorId:'c2',supplierId:'s1',materialId:'m2',purchaseId:'po2',invoiceId:'i2',paymentId:'pay2',date:'2026-10-02',amount:50}
  ],currentCostIndex:120,baseCostIndex:100});
  assert.equal(result.byWbs.w1,150);
  assert.equal(result.byPhase.p2,50);
  assert.equal(result.byDate['2026-10-02'],50);
  assert.equal(result.totalCurrentValue,180);
  assert.equal(result.varianceVsBudget,30);
});
