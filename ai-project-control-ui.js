import { buildAiProjectControlReport } from './ai-project-control-engine.js';

(function(){
  const esc=v=>String(v??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  async function runAiProjectControl(){
    if(!window.db||!window.pid) return;
    const content=document.querySelector('#content');
    if(!content) return;
    const [t,p,r,projectRow] = await Promise.all([
      db.from('project_schedule_tasks').select('*').eq('project_id',window.pid).order('planned_start',{ascending:true}).limit(500),
      db.from('project_procurement').select('*').eq('project_id',window.pid).limit(500),
      db.from('project_resources').select('*').eq('project_id',window.pid).limit(500),
      db.from('construction_projects').select('*').eq('id',window.pid).single()
    ]);
    if(t.error){toast(t.error.message);return;}
    const tasks=(t.data||[]).map(x=>({...x,resource_ids:Array.isArray(x.constraints?.resource_ids)?x.constraints.resource_ids:[]}));
    const report=buildAiProjectControlReport({tasks,procurement:p.data||[],resources:r.data||[],project:projectRow.data||{}});
    const existing=document.getElementById('ai-project-control-panel');
    if(existing) existing.remove();
    const panel=document.createElement('section');
    panel.id='ai-project-control-panel';
    panel.className='panel';
    panel.innerHTML='<h3>AI Project Control · 161–180</h3>'+
      '<p class="muted">تحلیل خواندنی است؛ هیچ تغییر مستقیمی در Master Schedule انجام نمی‌شود.</p>'+
      '<div class="list">'+
      '<div class="item"><b>161–165 Schedule / Critical Path</b><br>تاخیر: '+report.schedule.overdue.length+' · بحرانی: '+report.schedule.criticalOverdue+' · CPM: '+report.criticalPath.durationDays+' روز · Dependency missing: '+report.dependency.missing.length+' · Cycle: '+report.dependency.cycles.length+'</div>'+
      '<div class="item"><b>166–169 Procurement / Material / Cost / Recovery</b><br>Material conflicts: '+report.material.conflicts.length+' · High procurement predictions: '+report.procurementPrediction.filter(x=>x.predictedRisk==='high').length+' · Cost variance: '+Number(report.cost.variancePercent||0).toFixed(1)+'%</div>'+
      '<div class="item"><b>181–184 Workspace / Zoning / Floor / Trade</b><br>Workspace conflicts: '+report.workspace.conflicts.length+' · Zones: '+report.zoning.length+' · Floors: '+report.floorParallelism.length+'</div>'+ '<div class="item"><b>170–180 Parallel Work / Conflict</b><br>Parallel candidates: '+report.parallelSuggestions.length+' · Resource: '+report.resource.sharedResourceConflicts.length+' · Team: '+report.resource.teamConflicts.length+' · Physical: '+report.physical.conflicts.length+' · Equipment: '+report.equipment.equipment.length+' · Material: '+report.material.conflicts.length+' · Unassigned crew tasks: '+report.crew.unassignedTaskCount+'</div>'+
      '<div class="item"><b>185–187 Simulation / Optimization / Trade-off</b><br>Optimization candidates: '+report.parallelSuggestions.length+' · Cost variance: '+Number(report.cost.variancePercent||0).toFixed(1)+'%</div>'+ '<div class="item"><b>188–190 Approval / Explanation / Schedule Safety</b><br>AI is read-only; critical changes require human approval.</div>'+ '<div class="item"><b>AI Assistant / Recommendations</b><ul>'+report.recommendations.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul></div>'+
      (report.alerts.length?'<div class="item"><b>Alerts</b>'+report.alerts.map(x=>'<div>'+esc(x.severity)+' · '+esc(x.title)+' · '+Number(x.count||1)+'</div>').join('')+'</div>':'<div class="item">No AI control alerts detected.</div>')+
      '</div>';
    content.prepend(panel);
    if(report.alerts.length){
      const rows=report.alerts.map(x=>({project_id:window.pid,alert_type:x.type,severity:x.severity,title:x.title,explanation:'Deterministic project-control analysis',evidence:report, recommendation:report.recommendations.join(' '),status:'open',source:'buildwise-ai-project-control',metadata:{tasks:tasks.length}}));
      const ins=await db.from('project_ai_alerts').insert(rows);
      if(ins.error) toast(ins.error.message);
    }
    return report;
  }
  window.runAiProjectControl=runAiProjectControl;
  function hook(){
    const b=document.createElement('button');
    b.type='button'; b.textContent='AI Project Control';
    b.className='primary';
    b.onclick=runAiProjectControl;
    const target=document.querySelector('.tabs')||document.querySelector('#content');
    if(target && !document.getElementById('ai-project-control-button')){b.id='ai-project-control-button';target.prepend(b);}
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',hook); else hook();
})();