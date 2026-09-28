import test from 'node:test';
import assert from 'node:assert/strict';
import {
  decide,
  routeModel,
  canPerform,
  recordFeedback,
  masterDecisionLoop
} from '../src/core/decision-layer.js';

test('model router selects deterministic role-specific free/default route', () => {
  assert.equal(routeModel({task:'valuation',latency:'normal'}).model, 'chatgpt');
  assert.equal(routeModel({task:'code',latency:'fast'}).model, 'codex');
});

test('permission matrix denies unknown or destructive actions without approval', () => {
  assert.equal(canPerform('advisor','property.read'), true);
  assert.equal(canPerform('advisor','production.delete'), false);
  assert.equal(canPerform('manager','production.delete'), false);
  assert.equal(canPerform('owner','production.delete',{approved:true}), true);
});

test('decision layer returns evidence and approval gate', () => {
  const r = decide({type:'valuation',facts:[{source:'market',value:100}],action:'publish'});
  assert.equal(r.status,'needs_approval');
  assert.ok(r.evidence.length === 1);
});

test('feedback is append-only and bounded', () => {
  const state = {events:[]};
  const next = recordFeedback(state,{action:'match',outcome:'accepted',reward:1});
  assert.equal(next.events.length,1);
  assert.equal(state.events.length,0);
});

test('master loop follows canonical stages and stops at human approval', () => {
  const r = masterDecisionLoop({input:{property_id:1},identity:{type:'property',id:1},facts:[{source:'db',value:'ok'}]});
  assert.deepEqual(r.stages.slice(0,3),['INPUT','IDENTIFY','UNDERSTAND']);
  assert.equal(r.next,'HUMAN_APPROVAL');
});
