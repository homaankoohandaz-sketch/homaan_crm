const TYPES=new Set(['photo','plan','3d','video','document']);
const required=(v,f)=>{const x=String(v??'').trim();if(!x)throw new TypeError(f+' is required');return x};
export function createMediaAssetModel(){return Object.freeze({create(input={}){if(!TYPES.has(input.type))throw new TypeError('invalid asset type');return {id:input.id??null,name:required(input.name,'name'),type:input.type,url:input.url?String(input.url).trim():null,projectId:required(input.projectId,'projectId'),unitId:input.unitId??null,metadata:input.metadata&&typeof input.metadata==='object'?{...input.metadata}:{} };}})}
