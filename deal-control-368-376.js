(function(){
const e=x=>String(x??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
async function renderDealControl368376(){
 if(!window.db)return; const root=document.querySelector('#content');if(!root)return;
 const ws=window.dealWorkspaceId;
 if(!ws)return;
 const [control,timeline,actions,followups,risks,calc,payments]=await Promise.all([
 db.from('deal_workspace_control').select('*').eq('workspace_id',ws).maybeSingle(),
 db.from('deal_timeline_events').select('*').eq('workspace_id',ws).order('created_at',{ascending:false}).limit(20),
 db.from('deal_actions').select('*').eq('workspace_id',ws).order('due_at'),
 db.from('deal_followups').select('*').eq('workspace_id',ws).order('due_at'),
 db.from('deal_risks').select('*').eq('workspace_id',ws).order('score',{ascending:false}),
 db.from('deal_participation_calculations').select('*').eq('workspace_id',ws).order('created_at',{ascending:false}).limit(1),
 db.from('deal_payment_schedules').select('*').eq('workspace_id',ws).order('installment_no')
 ]);
 if(control.error)return;
 const s=document.createElement('section');s.className='panel';s.id='deal-control-368-376';
 s.innerHTML='<h3>Deal Workspace Control · ۳۶۸–۳۷۶</h3><div class="grid">'+
 [['Timeline',timeline.data?.length||0],['Open Actions',(actions.data||[]).filter(x=>x.status!=='done'&&x.status!=='cancelled').length],['Follow-ups',(followups.data||[]).filter(x=>x.status==='open').length],['Risks',(risks.data||[]).filter(x=>x.status==='open').length]].map(x=>'<div class="card"><b>'+x[1]+'</b><div class="muted">'+x[0]+'</div></div>').join('')+'</div>'+
 '<details open><summary><b>Deal Timeline</b></summary><div class="list">'+(timeline.data||[]).map(x=>'<div class="item"><span><b>'+e(x.title)+'</b><div class="muted">'+e(x.event_type)+' · '+e(x.created_at)+'</div></span></div>').join('')+'</div></details>'+
 '<details><summary><b>Actions / Follow-ups</b></summary><div class="list">'+(actions.data||[]).map(x=>'<div class="item"><span>'+e(x.title)+'</span><span>'+e(x.status)+'</span></div>').join('')+(followups.data||[]).map(x=>'<div class="item"><span>'+e(x.title)+'</span><span>'+e(x.due_at||'')+'</span></div>').join('')+'</div></details>'+
 '<details><summary><b>Deal Risk</b></summary><div class="list">'+(risks.data||[]).map(x=>'<div class="item"><span>'+e(x.title)+'<div class="muted">'+e(x.risk_type)+'</div></span><b>'+Number(x.score||0).toFixed(1)+'</b></div>').join('')+'</div></details>'+
 '<details><summary><b>Participation / Payment Schedule</b></summary><div class="list">'+(calc.data||[]).map(x=>'<div class="item"><span>Investor '+Number(x.investor_share_percent||0)+'% · Owner '+Number(x.owner_share_percent||0)+'%</span><span>'+Number(x.investor_value||0).toLocaleString()+'</span></div>').join('')+(payments.data||[]).map(x=>'<div class="item"><span>#'+x.installment_no+' · '+e(x.due_at)+'</span><b>'+Number(x.amount||0).toLocaleString()+'</b></div>').join('')+'</div></details>';
 root.prepend(s);
}
window.renderDealControl368376=renderDealControl368376;setTimeout(renderDealControl368376,1000);
})();