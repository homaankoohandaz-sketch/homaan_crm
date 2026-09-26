import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY") || "";
const OPENAI_MODEL = Deno.env.get("OPENAI_MODEL") || "gpt-5.6-luna";
const db = createClient(SUPABASE_URL, SERVICE_KEY);
const CORS = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"content-type","Access-Control-Allow-Methods":"GET,POST,OPTIONS"};
const html = (body:string) => new Response(body,{headers:{"Content-Type":"text/html; charset=utf-8",...CORS}});
const json = (body:unknown,status=200) => new Response(JSON.stringify(body),{status,headers:{"Content-Type":"application/json",...CORS}});
async function sha256(value:string){const h=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value));return [...new Uint8Array(h)].map(b=>b.toString(16).padStart(2,"0")).join("");}

async function loadShare(token:string){
  const hash=await sha256(token);
  const {data,error}=await db.from("customer_shares").select("id,title,message,status,expires_at,property_id,deal_id,advisor_id,properties(property_name,property_type,region,neighborhood,built_area,bedrooms,total_price,price_per_meter,description)").eq("token_hash",hash).maybeSingle();
  if(error||!data) return null;
  if(new Date(data.expires_at).getTime()<Date.now() || data.status==="revoked") return null;
  if(data.status==="sent") await db.from("customer_shares").update({status:"viewed",updated_at:new Date().toISOString()}).eq("id",data.id);
  const {data:assets}=data.property_id ? await db.from("property_documents").select("file_name,file_url,document_type,notes").eq("property_id",data.property_id).limit(20) : {data:[]};
  const {data:photos}=data.property_id ? await db.from("property_photos").select("file_name,file_url,is_main").eq("property_id",data.property_id).limit(20) : {data:[]};
  return {...data,assets:assets||[],photos:photos||[]};
}

async function saveResponse(token:string,message:string,choice:string){
  const share=await loadShare(token);
  if(!share) throw new Error("share_not_found_or_expired");
  const allowed=["approved","rejected","interested","question"];
  const responseStatus=allowed.includes(choice)?choice:"question";
  let aiSummary:string|null=null, aiConfidence:number|null=null;
  if(OPENAI_API_KEY){
    try{
      const prompt="پاسخ مشتری را در یکی از وضعیت‌های approved/rejected/interested/question طبقه‌بندی کن و یک خلاصه کوتاه فارسی بده. فقط JSON برگردان.";
      const r=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+OPENAI_API_KEY},body:JSON.stringify({model:OPENAI_MODEL,input:[{role:"system",content:prompt},{role:"user",content:message}],text:{format:{type:"json_schema",name:"customer_response",strict:true,schema:{type:"object",properties:{status:{type:"string",enum:allowed},summary:{type:"string"},confidence:{type:"number"}},required:["status","summary","confidence"],additionalProperties:false}}})});
      const out=await r.json();
      if(r.ok){const p=JSON.parse(out.output_text||"{}");aiSummary=p.summary||null;aiConfidence=Number(p.confidence)||null;}
    }catch(_){}
  }
  const {data,error}=await db.from("customer_responses").insert({share_id:share.id,response_status:responseStatus,message:String(message).slice(0,4000),ai_summary:aiSummary,ai_confidence:aiConfidence}).select("id,response_status,created_at").single();
  if(error) throw error;
  await db.from("customer_shares").update({status:"responded",updated_at:new Date().toISOString()}).eq("id",share.id);
  await db.from("crm_alerts").insert({alert_type:"customer_response",severity:responseStatus==="approved"?"high":"normal",property_id:share.property_id,assigned_to:share.advisor_id,created_by:share.advisor_id,title:"پاسخ مشتری دریافت شد",detail:{share_id:share.id,response_id:data.id,status:responseStatus}});
  return {ok:true,response:data};
}

Deno.serve(async(req)=>{
  if(req.method==="OPTIONS") return new Response("ok",{headers:CORS});
  const url=new URL(req.url), token=url.searchParams.get("token")||"";
  try{
    if(req.method==="GET"){
      const share=await loadShare(token); if(!share) return html("<!doctype html><meta charset='utf-8'><body dir='rtl' style='font-family:sans-serif;padding:40px'><h2>لینک نامعتبر یا منقضی شده است</h2></body>");
      const p=share.properties||{};
      const assets=(share.assets||[]).map((x:any)=>x.file_url?'<a href="'+x.file_url+'" target="_blank">دانلود '+(x.file_name||"فایل")+"</a>":"").join(" · ");
      const photos=(share.photos||[]).filter((x:any)=>x.file_url).map((x:any)=>'<img src="'+x.file_url+'" style="max-width:100%;border-radius:12px;margin:6px">').join("");
      const safe=JSON.stringify({token,title:share.title,message:share.message,property:p});
      return html(`<!doctype html><html lang="fa" dir="rtl"><meta name="viewport" content="width=device-width,initial-scale=1"><title>BuildWise</title><body style="font-family:Arial,sans-serif;max-width:680px;margin:auto;padding:24px;background:#f6f7f9"><main style="background:white;padding:24px;border-radius:18px"><h1>BuildWise AI</h1><h2>${share.title}</h2><p>${share.message}</p><h3>${p.property_name||"ملک پیشنهادی"}</h3><p>${[p.property_type,p.neighborhood,p.built_area&&p.built_area+" متر",p.bedrooms&&p.bedrooms+" خواب",p.total_price&&Number(p.total_price).toLocaleString("fa-IR")].filter(Boolean).join(" · ")}</p>${photos}<p>${assets}</p><hr><h3>نظر شما</h3><button onclick="send('approved')">تأیید می‌کنم</button> <button onclick="send('interested')">علاقه‌مندم</button> <button onclick="send('rejected')">مناسب نیست</button><textarea id="m" placeholder="پیام یا توضیح شما" style="width:100%;margin-top:16px;min-height:90px"></textarea><button onclick="send('question')" style="margin-top:8px">ارسال پیام</button><p id="out"></p></main><script>const C=${safe};async function send(c){const m=document.getElementById('m').value||c;const r=await fetch(location.href,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({message:m,choice:c})});const x=await r.json();document.getElementById('out').textContent=x.ok?'پاسخ شما ثبت شد. مشاور در جریان قرار گرفت.':(x.error||'خطا');}</script></body></html>`);
    }
    if(req.method==="POST"){
      const body=await req.json(); if(!body.message) return json({error:"message_required"},400);
      return json(await saveResponse(token,String(body.message),String(body.choice||"question")));
    }
    return json({error:"method_not_allowed"},405);
  }catch(e){return json({error:e instanceof Error?e.message:"internal_error"},500)}
});