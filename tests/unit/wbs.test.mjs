import assert from 'node:assert/strict';
import { createWbsItem, validateWbs, getReadyWbsItems, toWorkflow } from '../../src/domains/construction/wbs.js';

const items = [
  createWbsItem({id:'p',name:'فاز اجرا',type:'phase'}),
  createWbsItem({id:'w1',name:'سازه',type:'wbs',parent_id:'p'}),
  createWbsItem({id:'t1',name:'فونداسیون',type:'task',parent_id:'w1',duration_days:10}),
  createWbsItem({id:'t2',name:'اسکلت',type:'task',parent_id:'w1',depends_on:['t1'],duration_days:20}),
  createWbsItem({id:'m1',name:'تأیید اسکلت',type:'milestone',parent_id:'w1',depends_on:['t2'],duration_days:0})
];

assert.equal(validateWbs(items).valid, true);
assert.deepEqual(getReadyWbsItems(items, []).map(x=>x.id), ['t1']);
assert.deepEqual(getReadyWbsItems(items, ['t1']).map(x=>x.id), ['t2']);
const workflow = toWorkflow(items);
assert.deepEqual(workflow.steps.map(x=>x.id), ['t1','t2','m1']);
assert.deepEqual(workflow.steps[1].depends_on, ['t1']);
assert.equal(validateWbs([...items, createWbsItem({id:'bad',name:'bad',type:'task',depends_on:['missing']})]).error, 'missing_dependency');
assert.equal(validateWbs([
  createWbsItem({id:'a',name:'a',type:'task',depends_on:['b']}),
  createWbsItem({id:'b',name:'b',type:'task',depends_on:['a']})
]).error, 'dependency_cycle');
console.log('phase04 WBS tests: PASS');
