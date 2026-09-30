import assert from 'node:assert/strict';
import { createImportBatch, finalizeImportBatch, buildImportErrorIsolation, exportRecords, exportAsJson, createAuditEntry, appendAudit, buildActivityEvent, buildActivityTimeline, findSamePhoneCandidates } from '../src/domains/crm/operations.js';
import { editImportedRecord, createRollbackPlan, buildDataQualityDashboard } from '../src/domains/crm/data-quality.js';
import { analyzeLand, analyzeParticipation, analyzeBarter, compareScenarios } from '../src/domains/finance/real-estate-analysis.js';

const batch=createImportBatch({source:'excel',rowCount:2}); assert.equal(finalizeImportBatch(batch).status,'completed');
const isolated=buildImportErrorIsolation([{name:'ok'},null],r=>{if(!r)throw new Error('bad');return r}); assert.equal(isolated.errors.length,1);
const rows=[{id:1,name:'A',mobile:'09121234567'},{id:2,name:'B',mobile:'09121234567'}];
assert.equal(exportRecords(rows,{columns:['id','name']})[0].name,'A'); assert.equal(JSON.parse(exportAsJson(rows)).length,2);
assert.equal(appendAudit([],createAuditEntry({action:'update',entityType:'person'})).length,1);
const events=[buildActivityEvent({entityType:'person',entityId:1,action:'created',at:'2026-01-01'}),buildActivityEvent({entityType:'person',entityId:1,action:'updated',at:'2026-01-02'})]; assert.equal(buildActivityTimeline(events)[0].action,'updated');
assert.equal(findSamePhoneCandidates(rows)[0].mergeAllowed,false);
assert.equal(editImportedRecord(rows[0],{custom:'x'}).custom,'x'); assert.equal(createRollbackPlan({batchId:'b',insertedIds:[1]}).destructive,false);
assert.equal(buildDataQualityDashboard([...rows,{}]).duplicatePhoneGroups,1);
const land=analyzeLand({landArea:1000,landPrice:100,buildableRatio:2,constructionCostPerGrossM2:10,salePricePerSaleableM2:100,usefulRatio:.8}); assert.equal(land.usefulArea,1600);
assert.equal(analyzeParticipation({landValue:100,constructionCost:100,expectedRevenue:300}).impliedOwnerShare,.5);
assert.equal(analyzeBarter({offeredValue:100,receivedValue:90,cashAdjustment:10}).balanced,true);
assert.equal(compareScenarios([{landArea:1,salePricePerSaleableM2:10}]).length,1);
console.log('crm-realestate-batch: passed');
