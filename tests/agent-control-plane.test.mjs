import test from 'node:test';
import assert from 'node:assert/strict';
import { createAgentControlPlane } from '../src/agent-control/control-plane.js';

const base = {
  task_id:'T-431', objective:'test', requester:'master', specialist:'coding',
  runtime:'github', priority:'normal', scope_in:['repo'], scope_out:['prod'],
  inputs:['x'], expected_outputs:['summary'], source_of_truth:['STATE.md'],
  dependencies:[], allowed_tools:['github'], files_or_records_allowed:['src/**'],
  approval_gates:[], acceptance_tests:['unit'], deadline:'2026-10-02', handoff_path:'STATE.md',
  kind:'implementation', preferred_model:'grok'
};

test('control plane rejects incomplete task contracts', () => {
  const p=createAgentControlPlane(); const x=p.validateTaskContract({task_id:'x'});
  assert.equal(x.valid,false); assert.ok(x.missing.includes('objective'));
});

test('control plane routes and authorizes a task against the worker registry', () => {
  const p=createAgentControlPlane({registry:{workers:{grok:{capability:['implement'],status:'available'}}}});
  const x=p.route(base); assert.equal(x.status,'ready'); assert.equal(x.worker,'grok');
  const a=p.authorize(base,{tools:['github']}); assert.equal(a.authorized,true);
});

test('result validation and handoff preserve evidence fields', () => {
  const p=createAgentControlPlane();
  assert.equal(p.validateResult({summary:'ok'},base).valid,true);
  const h=p.handoff(base,{model_used:'grok',outputs:['summary'],tests:['pass'],evidence:['ci']});
  assert.equal(h.task_id,'T-431'); assert.deepEqual(h.evidence,['ci']);
});

test('dispatch produces approval-ready state without an execution worker', async () => {
  const p=createAgentControlPlane({registry:{workers:{grok:{capability:['implement'],status:'available'}}}});
  const x=await p.dispatch(base,{tools:['github']});
  assert.equal(x.status,'ready'); assert.equal(x.approval_required,true);
});

test('dispatch converts worker failure into recovery state', async () => {
  const p=createAgentControlPlane({
    registry:{workers:{grok:{capability:['implement'],status:'available'}}},
    execute:async()=>{throw new Error('temporary')}
  });
  const x=await p.dispatch(base,{tools:['github']});
  assert.equal(x.status,'recovery_required'); assert.equal(x.recovery.retryable,true);
});
