(function(){
 async function loadProjectAccounting(){
  if(!window.db||!window.pid)return;
  const root=document.querySelector('#content'); if(!root)return;
  const [summary,commitments,payments]=await Promise.all([
   db.from('project_accounting_summary').select('*').eq('project_id',window.pid).single(),
   db.from('project_commitments').select('*').eq('project_id',window.pid),
   db.from('project_payments').select('*').eq('project_id',window.pid)
  ]);
  if(summary.error){toast(summary.error.message);return;}
  const s=summary.data||{};
  const committed=(commitments.data||[]).reduce((n,x)=>n+Number(x.committed_amount||0),0);
  const paid=(payments.data||[]).reduce((n,x)=>n+Number(x.amount||0),0);
  const el=document.createElement('section'); el.id='project-accounting-191-200';el.className='panel';
  el.innerHTML='<h3>Project Accounting · 191–200</h3><div class="list">'+
   '<div class="item"><b>Budget</b><br>'+Number(s.budget||0).toLocaleString()+' · Revised: '+Number(s.revised_budget||0).toLocaleString()+'</div>'+
   '<div class="item"><b>Actual Cost</b><br>'+Number(s.actual_cost||0).toLocaleString()+' · Committed: '+Number(s.committed_cost||committed).toLocaleString()+'</div>'+
   '<div class="item"><b>Forecast Cost</b><br>'+Number(s.forecast_cost||0).toLocaleString()+' · Remaining: '+Number(s.remaining_cost||0).toLocaleString()+'</div>'+
   '<div class="item"><b>Total Project Cost</b><br>'+Number(s.total_project_cost||0).toLocaleString()+' · Paid recorded: '+paid.toLocaleString()+'</div>'+
   '</div>';
  root.prepend(el);
 }
 window.loadProjectAccounting=loadProjectAccounting;
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',loadProjectAccounting);else loadProjectAccounting();
})();