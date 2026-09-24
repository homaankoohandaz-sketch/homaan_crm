import assert from 'node:assert/strict'; import fs from 'node:fs'; import vm from 'node:vm';
const files=['workflow-engine.js','kpi-engine.js','procurement-engine.js','project-accounting-engine.js','builder-sales-engine.js'];
for(const f of files){const ctx={console,Date,crypto:{randomUUID:()=> 'test-id'}};ctx.globalThis=ctx;vm.runInNewContext(fs.readFileSync(f,'utf8'),ctx);assert.ok(Object.keys(ctx).some(k=>k.startsWith('BuildWise')) , f+' did not register');}
const ctx={crypto:{randomUUID:()=> 'w1'}};ctx.globalThis=ctx;vm.runInNewContext(fs.readFileSync('workflow-engine.js','utf8'),ctx);
const w=ctx.BuildWiseWorkflow.create({steps:[{id:'a',parallel_group:'site'},{id:'b',parallel_group:'site'},{id:'c',depends_on:['a']}]});
assert.equal(ctx.BuildWiseWorkflow.parallelCandidates(w).length,2); assert.equal(ctx.BuildWiseWorkflow.validate(w).valid,true);
const kctx={};kctx.globalThis=kctx;vm.runInNewContext(fs.readFileSync('kpi-engine.js','utf8'),kctx);assert.equal(kctx.BuildWiseKPI.project({planned_value:100,earned_value:80,actual_cost:100}).CPI,.8);
const actx={};actx.globalThis=actx;vm.runInNewContext(fs.readFileSync('project-accounting-engine.js','utf8'),actx);assert.equal(actx.BuildWiseProjectAccounting.costPerSellableM2({land_current_value:100,construction_current_cost:200,total_built_area:100,effective_ratio:.8}).cost_per_sellable_m2,3.75);
console.log('construction control engine tests: PASS');