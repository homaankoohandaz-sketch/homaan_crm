import test from 'node:test';
import assert from 'node:assert/strict';
import { simulateProjectWhatIf } from '../../src/domains/construction/ai-project-control.js';

const schedule={start_date:'2026-10-01',finish_date:'2026-10-10',items:[
{id:'a',name:'A',type:'task',start_date:'2026-10-01',finish_date:'2026-10-05',duration_days:4,progress:0},
{id:'b',name:'B',type:'task',start_date:'2026-10-05',finish_date:'2026-10-10',duration_days:5,progress:0,depends_on:['a']}
]};

test('what-if simulation returns isolated schedule and deltas',()=>{
 const result=simulateProjectWhatIf({schedule,changes:{delay_days:2,cost_delta_percent:10}});
 assert.equal(result.scenario.delay_days,2);
 assert.equal(result.schedule.finish_date,'2026-10-12');
 assert.equal(result.cost_delta_percent,10);
 assert.notEqual(result.schedule,schedule);
 assert.equal(schedule.finish_date,'2026-10-10');
});
test('what-if never silently mutates master schedule',()=>{
 const result=simulateProjectWhatIf({schedule,changes:{task_shifts:{a:3}}});
 assert.equal(result.schedule.items[0].start_date,'2026-10-04');
 assert.equal(result.schedule.items[1].start_date,'2026-10-05');
 assert.equal(result.requires_human_approval,true);
});
