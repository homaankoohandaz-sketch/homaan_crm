/* BuildWise AI — shared data normalization and entity-resolution primitives.
   Browser-safe, dependency-free. Used before persistence so Excel/manual/API inputs share one shape. */
(function(global){
  'use strict';
  const digits = value => String(value ?? '')
    .replace(/[۰-۹]/g,c=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(c))
    .replace(/[٠-٩]/g,c=>'٠١٢٣٤٥٦٧٨٩'.indexOf(c));
  const normalizeText = value => String(value ?? '')
    .normalize('NFKC').trim().replace(/[يى]/g,'ی').replace(/ك/g,'ک')
    .replace(/[\u200c\u200d]/g,' ').replace(/[\s\-\/]+/g,' ')
    .replace(/\s+/g,' ').toLowerCase();
  const normalizeKey = value => normalizeText(value).replace(/[()]/g,'').replace(/\s+/g,'_');
  const normalizePhone = value => {
    let s=digits(value).replace(/[^0-9+]/g,'');
    if(s.startsWith('+98')) s='0'+s.slice(3);
    if(s.startsWith('0098')) s='0'+s.slice(4);
    if(s.length===10 && s.startsWith('9')) s='0'+s;
    return s;
  };
  const normalizeNumber = value => {
    if(value==='' || value==null) return null;
    const s=digits(value).replace(/[,٬،]/g,'').replace(/تومان|ریال/gi,'').trim();
    const n=Number(s);
    return Number.isFinite(n)?n:null;
  };
  const normalizeRecord = record => {
    const out={};
    Object.entries(record||{}).forEach(([key,value])=>{
      out[normalizeKey(key)] = typeof value==='string' ? value.trim() : value;
    });
    return out;
  };
  const identityKeys = record => {
    const r=normalizeRecord(record);
    const phone=normalizePhone(r.mobile||r.phone||r.telephone||r.موبایل||r.تلفن);
    const code=normalizeText(r.property_code||r.code||r.کد||r.کد_ملک);
    const name=normalizeText(r.full_name||r.name||r.نام||r.owner_name);
    return {phone:phone||null,code:code||null,name:name||null};
  };
  const duplicateKey = record => {
    const i=identityKeys(record);
    if(i.code) return 'code:'+i.code;
    if(i.phone) return 'phone:'+i.phone;
    return i.name ? 'name:'+i.name : null;
  };
  global.BuildWiseNormalize={digits,normalizeText,normalizeKey,normalizePhone,normalizeNumber,normalizeRecord,identityKeys,duplicateKey};
})(window);
