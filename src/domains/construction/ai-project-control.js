const DAY=86400000;
const clone=v=>JSON.parse(JSON.stringify(v));
const addDays=(iso,n)=>{const d=new Date(iso+'T00:00:00Z');d.setUTCDate(d.getUTCDate()+Number(n||0));return d.toISOString().slice(0,10)};
export function simulateProjectWhatIf({schedule,changes={}}={}){
 if(!schedule?.items) throw new TypeError('schedule is required');
 const delay=Number(changes.delay_days)||0;
 const taskShifts=changes.task_shifts??{};
 const items=schedule.items.map(item=>{
   const shift=Number(taskShifts[item.id]??delay)||0;
   return {...item,start_date:addDays(item.start_date,shift),finish_date:addDays(item.finish_date,shift),scenario_shift_days:shift};
 });
 const scenarioSchedule={...clone(schedule),start_date:addDays(schedule.start_date,delay),finish_date:addDays(schedule.finish_date,delay),items};
 return {
   scenario:{delay_days:delay,task_shifts:clone(taskShifts)},
   schedule:scenarioSchedule,
   finish_delta_days:Math.round((Date.parse(scenarioSchedule.finish_date)-Date.parse(schedule.finish_date))/DAY),
   cost_delta_percent:Number(changes.cost_delta_percent)||0,
   requires_human_approval:true,
   master_schedule_unchanged:true
 };
}
