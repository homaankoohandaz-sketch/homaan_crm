import test from 'node:test';
import assert from 'node:assert/strict';
import { buildProjectManagementPanelModel } from '../../src/ui/project-management-101-130.js';

test('101-130 UI adapter exposes dashboard, master plan, calendar, delays and versions', () => {
  const model = buildProjectManagementPanelModel({
    project:{id:1,name:'Project A'},
    schedule:{start_date:'2026-10-01',finish_date:'2026-10-06',items:[
      {id:1,name:'Excavate',type:'task',start_date:'2026-10-01',finish_date:'2026-10-03',progress:100,depends_on:[]},
      {id:2,name:'Foundation',type:'task',start_date:'2026-10-03',finish_date:'2026-10-06',progress:50,depends_on:[1]},
      {id:3,name:'Structure',type:'milestone',start_date:'2026-10-06',finish_date:'2026-10-06',progress:0,depends_on:[2]}
    ]},
    progress:{percent:58.33},
    status:{status:'active'},
    baselines:[{version_no:2,name:'Revision 2',snapshot:{finish_date:'2026-10-08'}}]
  });
  assert.equal(model.dashboard.status,'active');
  assert.equal(model.master_plan.milestones.length,1);
  assert.equal(model.calendar.events.length,3);
  assert.equal(model.versions[0].version_no,2);
  assert.equal(model.gantt.length,3);
});