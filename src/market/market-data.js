import {randomUUID} from 'node:crypto';

export function registerSource({name,url=null,reliability=0,observedAt=new Date().toISOString(),type='external'}={}){
  return {name:String(name||'unknown'),url,type,reliability:Math.max(0,Math.min(1,Number(reliability)||0)),observedAt};
}
export function createMarketSnapshot({source,asset,value,currency='IRR',observedAt=new Date().toISOString(),metadata={}}={}){
  return {id:randomUUID(),source:String(source||'unknown'),asset:String(asset||'unknown'),value:Number(value),currency:String(currency),observedAt,metadata};
}
export function selectFallbackSnapshot(snapshots=[]){
  return [...snapshots].filter(x=>x?.valid!==false).sort((a,b)=>String(b.observedAt||'').localeCompare(String(a.observedAt||'')))[0]||null;
}
export function buildDailySnapshotBatch(items=[]){
  return items.map(x=>createMarketSnapshot(x));
}
