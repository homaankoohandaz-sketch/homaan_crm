/**
 * BuildWise AI decision layer.
 * Keeps routing, permissions and the canonical decision loop deterministic.
 */
const clone=o=>JSON.parse(JSON.stringify(o||{}));
const ROUTES=[
  {when:i=>i.task==='code',model:'codex'},
  {when:i=>i.task==='review',model:'claude'},
  {when:i=>['valuation','land','market'].includes(i.task),model:'chatgpt'},
  {when:i=>i.task==='research',model:'web-research'},
];
export function routeModel(input={}){
  return ROUTES.find(x=>x.when(input))||{model:'chatgpt'};
}
const PERMISSIONS={
  advisor:new Set(['property.read','lead.read','match.read','deal.read']),
  staff:new Set(['property.read','property.write','lead.read','lead.write','match.read']),
  manager:new Set(['property.read','property.write','lead.read','lead.write','deal.read','deal.write']),
  builder:new Set(['property.read','property.write','deal.read','deal.write','project.read','project.write']),
  owner:new Set(['property.read','property.write','lead.read','lead.write','deal.read','deal.write','project.read','project.write'])
};
export function canPerform(role,action,ctx={}){
  if(ctx.approved===true&&ctx.production===true)return ['owner','manager'].includes(role)||role==='owner';
  return Boolean(PERMISSIONS[role]?.has(action));
}
export function decide({type='general',facts=[],action=null}={}){
  const evidence=(facts||[]).map((f,i)=>({id:i+1,source:f.source||'unknown',value:f.value}));
  const highImpact=['publish','delete','execute','contract','payment'].includes(action);
  return {status:highImpact?'needs_approval':'ready',type,action,evidence,confidence:evidence.length?Math.min(95,50+evidence.length*10):10};
}
export function recordFeedback(state={},event={}){
  const next=clone(state); next.events=Array.isArray(next.events)?next.events.slice():[];
  next.events.push({...clone(event),timestamp:event.timestamp||new Date().toISOString()});
  return next;
}
export function masterDecisionLoop(input={}){
  const stages=['INPUT','IDENTIFY','UNDERSTAND','ANALYZE','MATCH','CALCULATE','SIMULATE','RECOMMEND','HUMAN_APPROVAL','EXECUTE','MONITOR','MEASURE','LEARN'];
  return {stages,input:clone(input),next:'HUMAN_APPROVAL',status:'awaiting_human_approval'};
}
