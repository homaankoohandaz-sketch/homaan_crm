const CHANNELS=new Set(['instagram','youtube','linkedin']);
const FORMATS=new Set(['post','reel','story','video','article','case-study']);

export function buildBrandSystem(){
  return {
    name:'BuildWise AI',
    logo:{mark:'BW',usage:'consistent'},
    guidelines:{tone:'professional',language:'clear',claimPolicy:'no unsupported guarantees'},
    visual:{system:'minimal-real-estate',primary:'#17364a',accent:'#0d6657',highlight:'#d9b56d'},
    social:{instagram:true,youtube:true,linkedin:true}
  };
}

export function buildContentBrief({topic='',channel='instagram',format='post',audience='real-estate'}={}){
  const c=CHANNELS.has(channel)?channel:'instagram';
  const f=FORMATS.has(format)?format:'post';
  const clean=String(topic||'BuildWise AI').trim()||'BuildWise AI';
  return {
    brand:'BuildWise AI', topic:clean, channel:c, format:f, audience,
    hook:'یک مسئله واقعی در '+clean+' را در یک خروجی قابل‌فهم نشان بده.',
    body:'مسئله → داده → تحلیل → اقدام؛ بدون ادعای تضمین نتیجه.',
    cta:'برای بررسی نمونه عملی BuildWise وارد محصول شوید.',
    tags:['BuildWiseAI','RealEstateOS','PropTech']
  };
}

export function buildLaunchCalendar(items=[]){
  return [...items].sort((a,b)=>String(a.date||'').localeCompare(String(b.date||'')));
}

export function createLeadCaptureEvent({source='landing',campaign=null,requestId=null,metadata={}}={}){
  return {
    event:'lead_capture', source:String(source), campaign:campaign?String(campaign):null,
    requestId:requestId?String(requestId):null, destination:'crm',
    metadata, createdAt:new Date().toISOString()
  };
}

export function buildChannelPlan(topics=[]){
  return topics.map(topic=>CHANNELS.size?Object.fromEntries([...CHANNELS].map(channel=>[channel,buildContentBrief({topic,channel,format:channel==='instagram'?'reel':'article'})])):{});
}
