import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { escapeHtml, safeHttpsUrl } from "./html.mjs";
import { fetchWithTimeout, safeResponseJson, safeErrorCode } from "../_shared/security.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY") || "";
const OPENAI_MODEL = Deno.env.get("OPENAI_MODEL") || "gpt-5.6-luna";
const db = createClient(SUPABASE_URL, SERVICE_KEY);
const CORS = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"content-type","Access-Control-Allow-Methods":"GET,POST,OPTIONS"};
const SECURITY_HEADERS = {"Cache-Control":"no-store","X-Content-Type-Options":"nosniff","X-Frame-Options":"DENY","Referrer-Policy":"no-referrer","Content-Security-Policy":"default-src 'none'; img-src https: data:; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'"};
const html = (body:string,status=200) => new Response(body,{status,headers:{"Content-Type":"text/html; charset=utf-8",...SECURITY_HEADERS,...CORS}});
const json = (body:unknown,status=200) => new Response(JSON.stringify(body),{status,headers:{"Content-Type":"application/json","Cache-Control":"no-store","X-Content-Type-Options":"nosniff",...CORS}});
async function sha256(value:string){const h=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value));return [...new Uint8Array(h)].map(b=>b.toString(16).padStart(2,"0")).join("");}

async function loadShare(token:string){
  if(token.length<32 || token.length>128 || !/^[a-f0-9]+$/i.test(token)) return null;
  const hash=await sha256(token);
  const {data,error}=await db.from("customer_shares").select("id,title,message,status,expires_at,property_id,deal_id,advisor_id,properties(property_name,property_type,region,neighborhood,street,built_area,bedrooms,total_price,price_per_meter,description)").eq("token_hash",hash).maybeSingle();
  if(error||!data) return null;
  if(new Date(data.expires_at).getTime()<Date.now() || data.status==="revoked") return null;
  if(data.status==="sent") await db.from("customer_shares").update({status:"viewed",updated_at:new Date().toISOString()}).eq("id",data.id);
  const {data:assets}=data.property_id ? await db.from("property_documents").select("file_name,file_url,document_type,notes").eq("property_id",data.property_id).in("document_type",["photo","render","presentation"]).limit(20) : {data:[]};
  const {data:photos}=data.property_id ? await db.from("property_photos").select("file_name,file_url,is_main").eq("property_id",data.property_id).limit(20) : {data:[]};
  return {...data,assets:assets||[],photos:photos||[]};
}

async function saveResponse(token:string,message:string,choice:string){
  const share=await loadShare(token);
  if(!share) throw new Error("share_not_found_or_expired");
  const allowed=["approved","rejected","interested","question"];
  const cleanMessage=String(message).trim();
  if(!cleanMessage || cleanMessage.length>4000 || !allowed.includes(choice)) throw new Error("invalid_input");
  const responseStatus=choice;
  let aiSummary:string|null=null, aiConfidence:number|null=null;
  if(OPENAI_API_KEY){
    try{
      const prompt="پاسخ مشتری را در یکی از وضعیت‌های approved/rejected/interested/question طبقه‌بندی کن و یک خلاصه کوتاه فارسی بده. فقط JSON برگردان.";
      const r=await fetchWithTimeout("https://api.openai.com/v1/responses",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+OPENAI_API_KEY},body:JSON.stringify({model:OPENAI_MODEL,input:[{role:"system",content:prompt},{role:"user",content:message}],text:{format:{type:"json_schema",name:"customer_response",strict:true,schema:{type:"object",properties:{status:{type:"string",enum:allowed},summary:{type:"string"},confidence:{type:"number"}},required:["status","summary","confidence"],additionalProperties:false}}}})});
      const out=await safeResponseJson(r);
      if(r.ok && out?.output_text){const p=JSON.parse(out.output_text);if(allowed.includes(p.status)){aiSummary=String(p.summary||"").slice(0,500)||null;aiConfidence=Number.isFinite(Number(p.confidence))?Math.max(0,Math.min(1,Number(p.confidence))):null;}}
    }catch(_){ /* optional AI classification fails safely */ }
  }
  const {data,error}=await db.from("customer_responses").insert({share_id:share.id,response_status:responseStatus,message:cleanMessage,ai_summary:aiSummary,ai_confidence:aiConfidence}).select("id,response_status,created_at").single();
  if(error) throw error;
  await db.from("customer_shares").update({status:"responded",updated_at:new Date().toISOString()}).eq("id",share.id);
  await db.from("crm_alerts").insert({alert_type:"customer_response",severity:responseStatus==="approved"?"high":"normal",property_id:share.property_id,assigned_to:share.advisor_id,created_by:share.advisor_id,title:"پاسخ مشتری دریافت شد",detail:{share_id:share.id,response_id:data.id,status:responseStatus}});
  return {ok:true,response:data};
}

Deno.serve(async(req)=>{
  if(req.method==="OPTIONS") return new Response("ok",{headers:{...SECURITY_HEADERS,...CORS}});
  const url=new URL(req.url), token=url.searchParams.get("token")||"";
  try{
    if(req.method==="GET"){
      const share=await loadShare(token); if(!share) return html("<!doctype html><meta charset='utf-8'><body dir='rtl' style='font-family:sans-serif;padding:40px'><h2>لینک نامعتبر یا منقضی شده است</h2></body>",404);
      const p=share.properties||{};
      const assets=(share.assets||[]).map((x:any)=>{
        const fileUrl=safeHttpsUrl(x.file_url);
        if(!fileUrl) return "";
        return '<a href="'+escapeHtml(fileUrl)+'" target="_blank" rel="noopener noreferrer">دانلود '+escapeHtml(x.file_name||"فایل")+"</a>";
      }).filter(Boolean).join(" · ");
      const photos=(share.photos||[]).filter((x:any)=>x.file_url && x.is_main !== false).map((x:any)=>{
        const imageUrl=safeHttpsUrl(x.file_url);
        return imageUrl ? '<img src="'+escapeHtml(imageUrl)+'" alt="تصویر ملک" style="max-width:100%;border-radius:12px;margin:6px">' : "";
      }).filter(Boolean).join("");
      const estimate=Number(p.total_price)||0;
      const min=Math.round(estimate*0.95);
      const max=Math.round(estimate*1.05);
      const safeProperty={property_name:p.property_name,property_type:p.property_type,region:p.region,neighborhood:p.neighborhood,street:p.street,built_area:p.built_area,bedrooms:p.bedrooms,price_range:{min,max},description:p.description};
      return html(`<!doctype html><html lang="fa" dir="rtl"><meta name="viewport" content="width=device-width,initial-scale=1"><title>BuildWise</title><body style="font-family:Arial,sans-serif;max-width:680px;margin:auto;padding:24px;background:#f6f7f9"><main style="background:white;padding:24px;border-radius:18px"><h1>BuildWise AI</h1><h2>${escapeHtml(share.title)}</h2><p>${escapeHtml(share.message)}</p><h3>${escapeHtml(p.property_name||"ملک پیشنهادی")}</h3><p>${[p.property_type,p.neighborhood,p.street,p.built_area&&p.built_area+" متر",p.bedrooms&&p.bedrooms+" خواب"].filter(Boolean).map(escapeHtml).join(" · ")}</p><p>بازه قیمت مشتری: ${min.toLocaleString("fa-IR")} تا ${max.toLocaleString("fa-IR")}</p>${photos}<p>${assets}</p><hr><h3>نظر شما</h3><button onclick="send('approved')">تأیید می‌کنم</button> <button onclick="send('interested')">علاقه‌مندم</button> <button onclick="send('rejected')">مناسب نیست</button><textarea id="m" maxlength="4000" placeholder="پیام یا توضیح شما" style="width:100%;margin-top:16px;min-height:90px"></textarea><button onclick="send('question')" style="margin-top:8px">ارسال پیام</button><p id="out"></p></main><script>async function send(c){const m=document.getElementById('m').value||c;try{const r=await fetch(location.href,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({message:m,choice:c})});const x=await r.json();document.getElementById('out').textContent=x.ok?'پاسخ شما ثبت شد. مشاور در جریان قرار گرفت.':(x.error||'خطا');}catch(_){document.getElementById('out').textContent='ارتباط برقرار نشد. دوباره تلاش کنید.';}}</script></body></html>`);
    }
    if(req.method==="POST"){
      let body:any; try { body=await req.json(); } catch { return json({error:"invalid_json"},400); }
      if(!body || typeof body!=="object" || Array.isArray(body) || typeof body.message!=="string" || !body.message.trim()) return json({error:"message_required"},400);
      if(body.message.length>4000) return json({error:"invalid_input"},400);
      const choice=String(body.choice||"question"); if(!["approved","rejected","interested","question"].includes(choice)) return json({error:"invalid_input"},400);
      if(!token) return json({error:"share_not_found_or_expired"},404);
      return json(await saveResponse(token,body.message,choice));
    }
    return json({error:"method_not_allowed"},405);
  }catch(e){const code=safeErrorCode(e);console.error(JSON.stringify({event:"customer_portal_request_failed",code}));if(code==="share_not_found_or_expired")return json({error:code},404);if(code==="invalid_input"||code==="invalid_json"||code==="message_required")return json({error:code},400);return json({error:"internal_error"},500)}
});