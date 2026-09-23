/* BuildWise AI — deterministic decision engines used by UI previews and API payload builders. */
(function(global){
 'use strict';
 const num=v=>Number.isFinite(Number(v))?Number(v):0;
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 function opportunity(input={}){
   const value=num(input.expected_value), cost=num(input.total_cost), fees=num(input.fees), reserve=num(input.reserve);
   const profit=value-cost-fees-reserve, margin=value?profit/value:0;
   const score=Math.round(clamp((margin*100)*2+num(input.liquidity_score)*.25-num(input.risk_score)*.35,0,100));
   return {expected_value:value,total_cost:cost,fees,reserve,profit,margin,opportunity_score:score,status:value>0&&cost>0?'ready':'insufficient_data'};
 }
 function match(subject, candidates=[], weights={}){
   const fields=Object.keys(weights); return candidates.map(c=>{
     let total=0,max=0; fields.forEach(f=>{const w=num(weights[f]);max+=w; if(String(subject[f]??'').trim()===String(c[f]??'').trim())total+=w;});
     return {...c,match_score:max?Math.round(total/max*100):0};
   }).sort((a,b)=>b.match_score-a.match_score);
 }
 function roi(input={}){
   const investment=num(input.investment), net=num(input.net_profit), years=num(input.years)||1;
   return {investment,net_profit:net,roi:investment?net/investment:0,annualized_roi:investment?Math.pow(Math.max(0,1+net/investment),1/years)-1:0};
 }
 function risk(factors=[]){
   const weighted=factors.reduce((s,x)=>s+num(x.probability)*num(x.impact)*num(x.weight||1),0);
   return {score:Math.round(weighted),level:weighted>=70?'high':weighted>=35?'medium':'low',factors};
 }
 function cashflow(periods=[]){let balance=0;return periods.map((p,i)=>{balance+=num(p.inflow)-num(p.outflow);return {...p,period:i+1,net:num(p.inflow)-num(p.outflow),balance};});}
 function variance(actual,baseline){const b=num(baseline),a=num(actual);return {actual:a,baseline:b,variance:a-b,variance_pct:b?(a-b)/b:0};}
 global.BuildWiseDecision={opportunity,match,roi,risk,cashflow,variance};
})(window);
