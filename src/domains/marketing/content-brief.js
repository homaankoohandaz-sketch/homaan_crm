const CHANNELS=new Set(['instagram','youtube','linkedin','website','telegram']);
const OBJECTIVES=new Set(['lead','awareness','education','listing','project']);
const clean=(v,f)=>{const x=String(v??'').trim();if(!x)throw new TypeError(f+' is required');return x};
export function createContentBriefModel(){return Object.freeze({create(input={}){const channel=input.channel;if(!CHANNELS.has(channel))throw new TypeError('invalid channel');const objective=input.objective;if(!OBJECTIVES.has(objective))throw new TypeError('invalid objective');return {title:clean(input.title,'title'),channel,objective,facts:input.facts&&typeof input.facts==='object'?{...input.facts}:{},cta:input.cta?String(input.cta).trim():null,created_at:input.created_at??null};}})}
