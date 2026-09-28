/**
 * BuildWise market intelligence — deterministic, source-aware calculations.
 * Scenario outputs are explicitly non-guaranteed.
 */
const num=v=>Number.isFinite(Number(v))?Number(v):0;
const date=v=>new Date(v);
const validDate=v=>v && !Number.isNaN(date(v).getTime());
export function calculateLiquidity(i={}){
  const demand=Math.max(0,num(i.monthlyDemand)), supply=Math.max(0,num(i.comparableSupply));
  const days=Math.max(0,num(i.daysOnMarket)), price=Math.max(0,num(i.askingPrice));
  if(!price) return {status:'insufficient_data',score:0,expectedDaysToSell:null};
  const pressure=demand/(supply||1);
  const score=Math.round(Math.max(0,Math.min(100,50+pressure*25-Math.max(0,days-30)*0.5)));
  const expectedDaysToSell=Math.max(7,Math.round((supply+1)/(demand||0.25)*30));
  return {status:'ready',score,expectedDaysToSell,demandSupplyRatio:pressure};
}
export function buildMarketSnapshot(rows=[],{asOf=new Date().toISOString(),maxAgeDays=30}={}){
  const end=date(asOf), valid=(rows||[]).filter(r=>validDate(r.observed_at)&&num(r.price_per_meter)>0)
    .filter(r=>(end-date(r.observed_at))/86400000>=0&&(end-date(r.observed_at))/86400000<=maxAgeDays);
  if(!valid.length)return {status:'insufficient_data',observationCount:0,latestObservedAt:null,averagePricePerMeter:null};
  valid.sort((a,b)=>date(b.observed_at)-date(a.observed_at));
  const average=valid.reduce((s,r)=>s+num(r.price_per_meter),0)/valid.length;
  return {status:'ready',observationCount:valid.length,latestObservedAt:valid[0].observed_at,averagePricePerMeter:Math.round(average),ageDays:(end-date(valid[0].observed_at))/86400000};
}
export function compareToBenchmark({propertyPrice,benchmarkPrice,unitsPerProperty=1}={},kind='benchmark'){
  const p=num(propertyPrice), b=num(benchmarkPrice)*Math.max(num(unitsPerProperty),1);
  return {kind,propertyPrice:p,benchmarkPrice:b,multiple:b?p/b:null,delta:b?p-b:null};
}
export function historicalWindow(rows=[],months=6,asOf=new Date().toISOString()){
  const end=date(asOf), start=new Date(end); start.setMonth(start.getMonth()-Math.max(0,months));
  return (rows||[]).filter(r=>validDate(r.observed_at)&&date(r.observed_at)>=start&&date(r.observed_at)<=end)
    .sort((a,b)=>date(a.observed_at)-date(b.observed_at));
}
export function buildScenarioSeries(baseValue,{monthlyGrowth=0,months=12}={}){
  const base=num(baseValue), count=Math.max(0,Math.floor(num(months)));
  return Array.from({length:count+1},(_,m)=>({month:m,value:base*Math.pow(1+num(monthlyGrowth),m)}));
}
export function buildInvestmentProposal(i={}){
  const investment=num(i.investment), exitValue=num(i.exitValue), profit=exitValue-investment;
  if(!investment||!exitValue)return {status:'insufficient_data',isGuarantee:false,label:'scenario',disclaimer:'سناریو تضمین نتیجه یا سود نیست.'};
  return {status:'ready',investment,exitValue,netProfit:profit,roi:profit/investment*100,confidence:Math.max(0,Math.min(100,num(i.confidence))),label:'scenario',isGuarantee:false,disclaimer:'این خروجی سناریو/برآورد است و تضمین نتیجه، قیمت یا سود محسوب نمی‌شود.'};
}
