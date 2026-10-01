import test from 'node:test';
import assert from 'node:assert/strict';
import { createAIIntelligence } from '../../src/ai/intelligence-layer.js';

const ai = createAIIntelligence();

test('financial intelligence returns profit, margin and working position', () => {
  const x=ai.financial({revenue:1000,cost:700,cash:100,receivable:200,payable:150});
  assert.equal(x.profit,300); assert.equal(x.marginPct,30); assert.equal(x.netWorkingPosition,150);
});

test('procurement intelligence detects overdue exposure', () => {
  const x=ai.procurement({items:[{status:'open',amount:100,dueAt:'2020-01-01'},{status:'received',amount:50}]});
  assert.equal(x.open,1); assert.equal(x.overdue,1); assert.equal(x.exposure,100);
});

test('sales intelligence calculates conversion and won value', () => {
  const x=ai.sales({opportunities:[{status:'won',value:100},{status:'open',value:200}]});
  assert.equal(x.conversionPct,50); assert.equal(x.wonValue,100);
});

test('persistent memory query is deterministic', () => {
  const x=ai.memory({query:'roi',entries:[{title:'ROI',content:'scenario',tags:['finance']},{title:'CRM',content:'lead'}]});
  assert.equal(x.length,1); assert.equal(x[0].title,'ROI');
});

test('AI action execution requires explicit approval and executor', async () => {
  const action={type:'flag_risk',payload:{risk:'late payment'}};
  assert.equal(ai.action(action).status,'approval_required');
  const x=await ai.execute(action,{approved:true,executor:async a=>({accepted:a.type})});
  assert.equal(x.status,'executed'); assert.equal(x.result.accepted,'flag_risk');
});

test('explanation layer preserves evidence, assumptions and risks', () => {
  const x=ai.explain({decision:'review',evidence:['cashflow'],assumptions:['sale in 6 months'],risks:['delay']});
  assert.deepEqual(x.evidence,['cashflow']); assert.deepEqual(x.risks,['delay']); assert.ok(x.generatedAt);
});
