import assert from 'node:assert/strict'; import fs from 'node:fs';
const s=fs.readFileSync('contract-engine.js','utf8').replace('(window);','(globalThis);'); eval(s);
const p=BuildWiseContract.participation({land_value:100,investor_capital:50,owner_share_percent:60,investor_share_percent:40,exit_value:300});
assert.equal(p.investor_return,120); assert.equal(p.investor_profit,70);
assert.equal(BuildWiseContract.paymentSchedule([{amount:10},{amount:20}])[1].cumulative,30);
assert.equal(BuildWiseContract.validate({parties:[1,2],subject:'x',consideration:1,schedule:[]}).valid,true);
console.log('contract-engine: passed');