const SPREADSHEET_ID='1A24ypEXoOT-10j1V83Qzpn-PcGTwNxmfMB2YkuijeMo';
const SOURCE_TYPE='google_sheets';

function syncMarketSheet(){
  const p=PropertiesService.getScriptProperties();
  const base=(p.getProperty('SUPABASE_URL')||'https://beuestoewletjsgmigmf.supabase.co').replace(/\/$/,'');
  const token=p.getProperty('SYNC_TOKEN');
  if(!token) throw new Error('Set SYNC_TOKEN in Script Properties');
  const ss=SpreadsheetApp.openById(SPREADSHEET_ID), sh=ss.getSheets()[0], v=sh.getDataRange().getValues();
  if(v.length<2) throw new Error('No data rows');
  const h=v[0].map(norm), rows=v.slice(1).map((r,i)=>mapRow(h,r,i+2)).filter(Boolean);
  const payload={source_type:SOURCE_TYPE,source_name:'Google Sheets - '+ss.getName()+' / '+sh.getName(),source_url:ss.getUrl()+'#gid='+sh.getSheetId(),sheet_id:SPREADSHEET_ID,sheet_name:sh.getName(),row_count:rows.length,rows:rows};
  const res=UrlFetchApp.fetch(base+'/functions/v1/google-sheets-sync',{method:'post',contentType:'application/json',muteHttpExceptions:true,headers:{'x-buildwise-sync-token':token},payload:JSON.stringify(payload)});
  if(res.getResponseCode()<200||res.getResponseCode()>=300) throw new Error(res.getContentText());
  return JSON.parse(res.getContentText());
}
function mapRow(h,r,n){
  const o={};h.forEach((x,i)=>o[x]=r[i]);
  const area=num(first(o,['area','metrage','meterage','متراژ','زیربنا','مساحت']));
  const total=num(first(o,['total_price','totalprice','price','total','قیمت','قیمت_کل']));
  const direct=num(first(o,['price_per_meter','pricepermeter','ppm','per_meter','قیمت_متری','قیمت_هر_متر']));
  const ppm=direct>0?direct:(area>0&&total>0?total/area:null);
  if(!(area>0)||!(ppm>0)) return null;
  const raw={};h.forEach((x,i)=>raw[x]=r[i]);
  return {external_id:String(first(o,['external_id','record_id','id','شناسه','کد','کد_ملک'])||('sheet-'+n+'-'+hash(JSON.stringify(raw)))),observed_at:date(first(o,['observed_at','date','listed_at','تاریخ','تاریخ_مشاهده']))||new Date().toISOString(),region:str(first(o,['region','zone','منطقه'])),neighborhood:str(first(o,['neighborhood','area_name','محله'])),property_type:str(first(o,['property_type','type','نوع_ملک','نوع'])),area:area,bedrooms:num(first(o,['bedrooms','bedroom','rooms','خواب','تعداد_خواب'])),age_years:num(first(o,['age_years','age','سن_بنا'])),floor_number:num(first(o,['floor_number','floor','طبقه'])),parking:bool(first(o,['parking','پارکینگ'])),elevator:bool(first(o,['elevator','آسانسور'])),storage:bool(first(o,['storage','انباری','انبار'])),total_price:total>0?total:null,price_per_meter:ppm,listing_status:str(first(o,['listing_status','status','وضعیت']))||'active',raw_payload:raw};
}
function norm(x){return String(x==null?'':x).trim().toLowerCase().replace(/[\s\-\/]+/g,'_').replace(/[()]/g,'')}
function first(o,ks){for(const k of ks){const v=o[norm(k)];if(v!==undefined&&v!==null&&String(v).trim()!=='')return v}return ''}
function num(x){if(x===''||x==null)return null;if(typeof x==='number')return isFinite(x)?x:null;let s=String(x).trim().replace(/[۰-۹]/g,c=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(c)).replace(/[٠-٩]/g,c=>'٠١٢٣٤٥٦٧٨٩'.indexOf(c)).replace(/[,٬]/g,'').replace(/تومان|ریال/gi,'');let n=Number(s);return isFinite(n)?n:null}
function bool(x){if(x===true||x===false)return x;let s=String(x==null?'':x).trim().toLowerCase();if(['true','1','yes','y','بله','دارد'].includes(s))return true;if(['false','0','no','n','خیر','ندارد'].includes(s))return false;return null}
function str(x){return x==null||String(x).trim()===''?null:String(x).trim()}
function date(x){if(!x)return null;let d=Object.prototype.toString.call(x)==='[object Date]'?x:new Date(x);return isNaN(d.getTime())?null:d.toISOString()}
function hash(s){const b=Utilities.computeDigest(Utilities.DigestAlgorithm.MD5,s);return b.map(x=>('0'+(x&255).toString(16)).slice(-2)).join('')}
