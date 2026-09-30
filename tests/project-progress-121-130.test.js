import assert from 'node:assert/strict';
import {progressSnapshot,delayAssessment,buildRecoveryPlan,createScheduleVersion,projectSnapshot} from '../src/domains/project-control/progress.js';
const p=progressSnapshot({planned:40,actual:35,earned:30});assert.equal(p.actualVariance,-5);assert.equal(p.earnedProgress,30);
assert.equal(delayAssessment({plannedFinish:'2026-09-01',actualFinish:'2026-09-04'}).delayDays,3);
assert.equal(delayAssessment({plannedFinish:'2026-09-04',actualFinish:'2026-09-01'}).delayed,false);
assert.equal(buildRecoveryPlan({activities:[{name:'resequence'}]}).requiresHumanApproval,true);
assert.equal(createScheduleVersion({version:2,tasks:[{id:1}]}).tasks.length,1);
assert.equal(projectSnapshot({projectId:'p1'}).status,'active');
console.log('project-progress-121-130: passed');