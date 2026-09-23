/* BuildWise AI — contract calculation/validation primitives. */
(function(global){
 'use strict';
 const n=v=>Number.isFinite(Number(v))?Number(v):0;
 function participation(input={}){
  const land=n(input.land_value), capital=n(input.investor_capital), ownerShare=n(input.owner_share_percent), investorShare=n(input.investor_share_percent);
  const total=ownerShare+investorShare;
  const normalized=total>0?{owner:ownerShare/total*100,investor:investorShare/total*100}:{owner:50,investor:50};
  const valueAtExit=n(input.exit_value), investorReturn=valueAtExit*normalized.investor/100;
  return {land_value:land,investor_capital:capital,shares:normalized,investor_return:investorReturn,investor_profit:investorReturn-capital,capital_gap:Math.max(0,capital-land),status:capital>0&&valueAtExit>0?'ready':'insufficient_data'};
 }
 function paymentSchedule(items=[]){return items.map((x,i)=>({...x,index:i+1,amount:n(x.amount),cumulative:items.slice(0,i+1).reduce((s,y)=>s+n(y.amount),0)}));}
 function validate(contract={}){
  const required=['parties','subject','consideration','schedule'];
  const missing=required.filter(k=>contract[k]===undefined||contract[k]===null||contract[k]==='');
  const issues=[];
  if(!Array.isArray(contract.parties)||contract.parties.length<2) issues.push('parties');
  if(!Array.isArray(contract.schedule)) issues.push('schedule');
  return {valid:missing.length===0&&issues.length===0,missing,issues};
 }
 global.BuildWiseContract={participation,paymentSchedule,validate};
})(window);
