(function(){
const esc=x=>String(x??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
async function renderWorkflow343367(){
 if(!window.db||!window.pid)return;
 const root=document.querySelector('#content'); if(!root)return;
 const [defs,runs,templates,audit]=await Promise.all([
  db.from('workflow_definitions').select('*').or('project_id.is.null,project_id.eq.'+window.pid).order('created_at',{ascending:false}),
  db.from('workflow_runs').select('*').eq('project_id',window.pid).order('started_at',{ascending:false}).limit(20),
  db.from('workflow_templates').select('*').eq('active',true).order('domain'),
  db.from('workflow_audit').select('*').order('last_event_at',{ascending:false}).limit(20)
 ]);
 if(defs.error)return;
 const s=document.createElement('section');s.id='workflow-343-367';s.className='panel';
 s.innerHTML='<h3>Workflow Engine · ۳۴۳–۳۶۷</h3>'+
 '<div class="grid"><div class="card"><b>'+((defs.data||[]).length)+'</b><div class="muted">Workflow definitions</div></div><div class="card"><b>'+((runs.data||[]).length)+'</b><div class="muted">Recent runs</div></div><div class="card"><b>'+((templates.data||[]).length)+'</b><div class="muted">Templates</div></div></div>'+
 '<details open><summary><b>Workflow Templates</b></summary><div class="list">'+(templates.data||[]).map(t=>'<div class="item"><span><b>'+esc(t.name)+'</b><div class="muted">'+esc(t.domain)+' · '+esc(t.code)+'</div></span><button data-template="'+t.code+'">استفاده</button></div>').join('')+'</div></details>'+
 '<details open><summary><b>Workflow Runs / History</b></summary><div class="list">'+(runs.data||[]).map(r=>'<div class="item"><span>#'+r.id+' · '+esc(r.entity_type||'project')+' '+esc(r.entity_id||'')+'<div class="muted">'+esc(r.started_at)+'</div></span><span class="pill">'+esc(r.status)+'</span></div>').join('')||'<span class="muted">اجرایی ثبت نشده.</span>'+'</div></details>'+
 '<details><summary><b>Audit</b></summary><div class="list">'+(audit.data||[]).map(a=>'<div class="item"><span>'+esc(a.workflow_name)+' · Run #'+a.run_id+'</span><span>'+esc(a.run_status)+' · '+a.event_count+' events</span></div>').join('')+'</div></details>'+
 '<details><summary><b>Workflow Builder</b></summary><form id="wf-form" class="form"><label>Name<input name="name" required></label><label>Scope<select name="scope_type"><option value="project">Project</option><option value="global">Global</option><option value="builder">Builder</option><option value="user">User</option></select></label><label>Template<select name="template_code"><option value="">Custom</option>'+(templates.data||[]).map(t=>'<option value="'+esc(t.code)+'">'+esc(t.name)+'</option>').join('')+'</select></label><div class="full"><button class="primary">ساخت Workflow</button></div></form></details>';
 root.prepend(s);
 s.querySelector('#wf-form')?.addEventListener('submit',async e=>{
  e.preventDefault();const o=Object.fromEntries(new FormData(e.target).entries());
  const x=await db.from('workflow_definitions').insert({name:o.name,scope_type:o.scope_type,project_id:o.scope_type==='project'?window.pid:null,template_code:o.template_code||null,config:{builder_version:1}}).select().single();
  if(x.error){alert(x.error.message);return}
  if(o.template_code){const t=(templates.data||[]).find(t=>t.code===o.template_code);const steps=t?.config?.steps||['trigger','condition','action','approval','notification']; if(Array.isArray(steps)) await db.from('workflow_steps').insert(steps.map((type,i)=>({workflow_id:x.data.id,step_order:i+1,step_type:type,name:type+' step'})));}
  renderWorkflow343367();
 });
}
window.renderWorkflow343367=renderWorkflow343367;
setTimeout(renderWorkflow343367,1200);
})();