import assert from 'node:assert/strict'; import fs from 'node:fs';
globalThis.window = globalThis;
const s=fs.readFileSync('src/core/business-engines.js','utf8').replace('(window);','(globalThis);'); eval(s);
const p=BuildWiseContract.participation({land_value:100,investor_capital:50,owner_share_percent:60,investor_share_percent:40,exit_value:300});
assert.equal(p.investor_return,120); assert.equal(p.investor_profit,70);
assert.equal(BuildWiseContract.paymentSchedule([{amount:10},{amount:20}])[1].cumulative,30);
assert.equal(BuildWiseContract.validate({parties:[1,2],subject:'x',consideration:1,schedule:[]}).valid,true);
console.log('contract-engine: passed');

const template = BuildWiseContract.template({
  name: 'Participation Agreement',
  body: 'Land: {{land}}',
  variables: { land: '400m2' }
});
assert.equal(template.status, 'draft');
assert.equal(template.variables.land, '400m2');

const version = BuildWiseContract.version({
  contract_id: 'c1',
  version: 2,
  snapshot: { subject: 'Participation', consideration: 100 }
});
assert.equal(version.version, 2);
assert.equal(version.snapshot.consideration, 100);

assert.equal(BuildWiseContract.attachment({contract_id:'c1',file_id:'f1'}).status, 'active');
assert.equal(BuildWiseContract.approval({contract_id:'c1',approver_id:'u1'}).status, 'pending');
assert.equal(BuildWiseContract.signature({contract_id:'c1',signer_id:'u1'}).status, 'pending');
assert.equal(BuildWiseContract.obligation({contract_id:'c1',title:'Pay installment',amount:50}).status, 'open');
assert.equal(BuildWiseContract.milestone({contract_id:'c1',title:'Permit'}).status, 'pending');
assert.equal(BuildWiseContract.breachAlert({contract_id:'c1',title:'Late payment'}).status, 'open');
assert.equal(BuildWiseContract.linkToProject({contract_id:'c1',project_id:'p1'}).project_id, 'p1');
