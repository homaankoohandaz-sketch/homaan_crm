/* BuildWise AI — canonical shared business engines. One reference for accounting, KPI, contracts, decisions and workflows. */
(function(global){
'use strict';
const n=v=>Number.isFinite(Number(v))?Number(v):0;
const pct=(a,b)=>n(b)?n(a)/n(b)*100:0;

/* Project accounting */
function costPerSellableM2(i={}){const total=n(i.land_current_value)+n(i.construction_current_cost)+n(i.design_cost)+n(i.permit_cost)+n(i.finance_cost)+n(i.other_cost),ratio=Math.max(0,Math.min(1,n(i.effective_ratio||.8))),sellable=n(i.total_built_area)*ratio;return {total_project_cost:total,sellable_area:sellable,cost_per_sellable_m2:sellable?total/sellable:null,effective_ratio:ratio}}
function unitCost(i={}){const x=costPerSellableM2(i),a=n(i.unit_sellable_area);return {...x,unit_sellable_area:a,unit_total_cost:x.cost_per_sellable_m2==null?null:x.cost_per_sellable_m2*a}}
function transaction(i={}){const q=n(i.quantity),p=n(i.unit_price),fx=n(i.fx_at_purchase),now=n(i.fx_now);return {historical_irr:q*p,purchase_usd:fx?q*p/fx:null,current_irr:q*n(i.current_unit_price),current_usd:now?q*n(i.current_unit_price)/now:null,replaceable_delta:q*(n(i.current_unit_price)-p)}}
global.BuildWiseProjectAccounting={costPerSellableM2,unitCost,transaction};

/* KPI */
function projectKPI(i={}){const pv=n(i.planned_value),ev=n(i.earned_value),ac=n(i.actual_cost);return {physical_progress_pct:n(i.actual_progress),planned_progress_pct:n(i.planned_progress),schedule_variance_pct:n(i.actual_progress)-n(i.planned_progress),cost_variance:ev-ac,schedule_variance:ev-pv,CPI:ac?ev/ac:null,SPI:pv?ev/pv:null,budget_used_pct:pct(ac,i.budget),forecast_cost:n(i.forecast_cost||ac)}}
function procurementKPI(i={}){return {ordered_value:n(i.ordered_value),received_value:n(i.received_value),committed_value:n(i.committed_value),budget:n(i.budget),delivery_on_time_pct:pct(i.on_time_deliveries,i.deliveries),budget_variance:n(i.budget)-n(i.committed_value),completion_pct:pct(i.received_value,i.ordered_value)}}
function crewKPI(i={}){return {planned_hours:n(i.planned_hours),actual_hours:n(i.actual_hours),planned_output:n(i.planned_output),actual_output:n(i.actual_output),productivity_pct:pct(i.actual_output,i.planned_output)}}
global.BuildWiseKPI={project:projectKPI,procurement:procurementKPI,crew:crewKPI};

/* Contracts */
function participation(input={}){const land=n(input.land_value),capital=n(input.investor_capital),ownerShare=n(input.owner_share_percent),investorShare=n(input.investor_share_percent),total=ownerShare+investorShare,normalized=total>0?{owner:ownerShare/total*100,investor:investorShare/total*100}:{owner:50,investor:50},valueAtExit=n(input.exit_value),investorReturn=valueAtExit*normalized.investor/100;return {land_value:land,investor_capital:capital,shares:normalized,investor_return:investorReturn,investor_profit:investorReturn-capital,capital_gap:Math.max(0,capital-land),status:capital>0&&valueAtExit>0?'ready':'insufficient_data'}}
function paymentSchedule(items=[]){return items.map((x,i)=>({...x,index:i+1,amount:n(x.amount),cumulative:items.slice(0,i+1).reduce((s,y)=>s+n(y.amount),0)}))}
function validateContract(contract={}){const required=['parties','subject','consideration','schedule'],missing=required.filter(k=>contract[k]===undefined||contract[k]===null||contract[k]===''),issues=[];if(!Array.isArray(contract.parties)||contract.parties.length<2)issues.push('parties');if(!Array.isArray(contract.schedule))issues.push('schedule');return {valid:missing.length===0&&issues.length===0,missing,issues}}
global.BuildWiseContract={participation,paymentSchedule,validate:validateContract};

/* Decisions */
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function opportunity(input={}){const value=n(input.expected_value),cost=n(input.total_cost),fees=n(input.fees),reserve=n(input.reserve),profit=value-cost-fees-reserve,margin=value?profit/value:0,score=Math.round(clamp((margin*100)*2+n(input.liquidity_score)*.25-n(input.risk_score)*.35,0,100));return {expected_value:value,total_cost:cost,fees,reserve,profit,margin,opportunity_score:score,status:value>0&&cost>0?'ready':'insufficient_data'}}
function match(subject,candidates=[],weights={}){const fields=Object.keys(weights);return candidates.map(c=>{let total=0,max=0;fields.forEach(f=>{const w=n(weights[f]);max+=w;if(String(subject[f]??'').trim()===String(c[f]??'').trim())total+=w});return {...c,match_score:max?Math.round(total/max*100):0}}).sort((a,b)=>b.match_score-a.match_score)}
function roi(input={}){const investment=n(input.investment),net=n(input.net_profit),years=n(input.years)||1;return {investment,net_profit:net,roi:investment?net/investment:0,annualized_roi:investment?Math.pow(Math.max(0,1+net/investment),1/years)-1:0}}
function risk(factors=[]){const weighted=factors.reduce((s,x)=>s+n(x.probability)*n(x.impact)*n(x.weight||1),0);return {score:Math.round(weighted),level:weighted>=70?'high':weighted>=35?'medium':'low',factors}}
function cashflow(periods=[]){let balance=0;return periods.map((p,i)=>{balance+=n(p.inflow)-n(p.outflow);return {...p,period:i+1,net:n(p.inflow)-n(p.outflow),balance}})}
function variance(actual,baseline){const b=n(baseline),a=n(actual);return {actual:a,baseline:b,variance:a-b,variance_pct:b?(a-b)/b:0}}
global.BuildWiseDecision={opportunity,match,roi,risk,cashflow,variance};

/* Workflow */
const clone=o=>JSON.parse(JSON.stringify(o||{}));
function createWorkflow(d={}){return {id:String(d.id||Date.now()),name:d.name||'BuildWise Workflow',version:Number(d.version||1),status:d.status||'draft',config:clone(d.config),steps:(d.steps||[]).map((s,i)=>({id:String(s.id||'step_'+(i+1)),name:String(s.name||s.title||('Step '+(i+1))),status:s.status||'pending',depends_on:(s.depends_on||[]).map(String),duration_days:Number(s.duration_days||0),role:s.role||null,parallel_group:s.parallel_group||null,metadata:clone(s.metadata)}))}}
function ready(w,done=[]){const x=new Set(done.map(String));return w.steps.filter(s=>s.status!=='done'&&s.depends_on.every(d=>x.has(String(d))))}
function parallelCandidates(w,done=[]){const g={};for(const s of ready(w,done)){const k=s.parallel_group||'__';(g[k]??=[]).push(s)}return Object.values(g).filter(x=>x.length>1).flat()}
function transition(w,id,status,meta={}){const o=clone(w),s=o.steps.find(x=>x.id===String(id));if(!s)throw Error('workflow_step_not_found');s.status=status;s.metadata={...s.metadata,...clone(meta)};return o}
function validateWorkflow(w){const ids=new Set(w.steps.map(s=>s.id)),issues=[];for(const s of w.steps)for(const d of s.depends_on)if(!ids.has(d))issues.push({step:s.id,type:'missing_dependency',dependency:d});return {valid:!issues.length,issues}}
global.BuildWiseWorkflow={create:createWorkflow,ready,parallelCandidates,transition,validate:validateWorkflow};
global.BuildWiseBusinessEngines={accounting:global.BuildWiseProjectAccounting,kpi:global.BuildWiseKPI,contract:global.BuildWiseContract,decision:global.BuildWiseDecision,workflow:global.BuildWiseWorkflow};
})(typeof window!=='undefined'?window:globalThis);
