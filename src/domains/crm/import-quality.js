import { normalizeRecord, normalizePhone, normalizeNumber } from '../../core/data-normalization.js';

export function normalizeImportRows(rows=[]){
  return (rows||[]).map((row,index)=>{
    const r=normalizeRecord(row);
    const rawPhone=r.mobile||r.phone||r.telephone||null;
    const mobile=normalizePhone(rawPhone);
    return {...r,_source_row:index+1,_source_raw:{...row},mobile,_phone_input:rawPhone,
      normalized_numbers:Object.fromEntries(Object.entries(r).map(([k,v])=>[k,normalizeNumber(v)]).filter(([,v])=>v!==null))};
  });
}
export function validateImportRows(rows=[]){
  const valid=[],invalid=[];
  for(const row of rows){
    const phoneInput=row._phone_input;
    const phone=row.mobile||row.phone;
    if((phoneInput!=null&&String(phoneInput).trim()!==''&&!phone)|| (phone&&!/^09\d{9}$/.test(phone)))
      invalid.push({...row,_error:'invalid_phone'});
    else valid.push(row);
  }
  return {valid,invalid};
}
export function buildImportPreview(rows=[]){
  const columns=[...new Set((rows||[]).flatMap(r=>Object.keys(r||{})))];
  return {rowCount:(rows||[]).length,columnCount:columns.length,columns,sample:(rows||[]).slice(0,20)};
}
export function rollbackPlan({batchId,insertedIds=[]}={}){
  return {status:'planned',batchId:batchId||null,ids:[...insertedIds],destructive:false,requiresExecution:true};
}
