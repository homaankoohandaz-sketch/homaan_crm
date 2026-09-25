/* BuildWise Hierarchy Panel — Project → Complex → Building → Phase → Floor → Unit
 * Requires: global db, pid, me, esc, toast, $ from project-control.html
 * Safe when tables missing: shows apply-migration message.
 */
(function(){
  async function renderHierarchy(){
    var c=document.getElementById('content');
    if(!c)return;
    c.innerHTML='<section class="panel"><h3>سلسله‌مراتب پروژه</h3><p class="muted">Project → Complex → Building → Phase → Floor → Unit</p><div class="actions"><button class="primary" onclick="window.hAddComplex()">+ مجتمع</button><button onclick="window.hAddBuilding()">+ ساختمان</button><button onclick="window.hAddFloor()">+ طبقه</button><button onclick="window.hAddUnit()">+ واحد</button><button onclick="window.renderHierarchy()">نوسازی</button></div><div id="hTree" class="muted">در حال بارگذاری...</div></section>';
    try{
      var complexes=await db.from('project_complexes').select('id,name,code,status,sort_order').eq('project_id',pid).order('sort_order');
      if(complexes.error){
        if(/relation|does not exist|schema cache/i.test(complexes.error.message||'')){
          document.getElementById('hTree').innerHTML='<div class="item warn"><div><b>جدول سلسله‌مراتب هنوز اعمال نشده</b><p class="muted">فایل migration: supabase/migrations/20260925_project_hierarchy.sql را در Supabase SQL Editor اجرا کنید.</p></div></div>';
          return;
        }
        throw complexes.error;
      }
      var cx=complexes.data||[];
      if(!cx.length){document.getElementById('hTree').innerHTML='<div class="item info"><div>هنوز مجتمعی ثبت نشده. با «+ مجتمع» شروع کنید.</div></div>';return;}
      var out='';
      for(var i=0;i<cx.length;i++){
        var complex=cx[i];
        out+='<div class="item"><div><b>مجتمع: '+esc(complex.name)+'</b> <span class="pill">'+esc(complex.code||'')+' · '+esc(complex.status)+'</span></div></div>';
        var buildings=await db.from('project_buildings').select('id,name,code,floors_planned,status').eq('complex_id',complex.id).order('sort_order');
        var bd=buildings.data||[];
        for(var j=0;j<bd.length;j++){
          var b=bd[j];
          out+='<div class="item" style="margin-right:18px"><div><b>ساختمان: '+esc(b.name)+'</b> <span class="pill">'+esc(b.code||'')+' · طبقات '+ (b.floors_planned!=null?b.floors_planned:'—') +'</span></div></div>';
          var floors=await db.from('project_floors').select('id,floor_number,name,area_m2,status').eq('building_id',b.id).order('floor_number');
          var fd=floors.data||[];
          for(var k=0;k<fd.length;k++){
            var f=fd[k];
            out+='<div class="item" style="margin-right:36px"><div><b>طبقه '+esc(f.floor_number)+'</b> '+esc(f.name||'')+' · '+(f.area_m2!=null?f.area_m2:'—')+' m² <span class="pill">'+esc(f.status)+'</span></div></div>';
            var units=await db.from('project_units').select('id,unit_code,unit_type,area_m2,bedrooms,status').eq('floor_id',f.id).order('sort_order');
            var ud=units.data||[];
            for(var m=0;m<ud.length;m++){
              var u=ud[m];
              out+='<div class="item" style="margin-right:54px"><div>واحد <b>'+esc(u.unit_code)+'</b> · '+esc(u.unit_type||'')+' · '+(u.area_m2!=null?u.area_m2:'—')+' m² · '+(u.bedrooms!=null?u.bedrooms:'—')+' خواب <span class="pill">'+esc(u.status)+'</span></div></div>';
            }
          }
        }
      }
      document.getElementById('hTree').innerHTML=out||'<div class="muted">خالی</div>';
    }catch(e){console.error(e);document.getElementById('hTree').innerHTML='<div class="item alert"><div>'+esc(e.message||e)+'</div></div>';}
  }
  window.renderHierarchy=renderHierarchy;
  window.hAddComplex=async function(){
    var name=prompt('نام مجتمع'); if(!name)return;
    var code=prompt('کد (اختیاری)')||null;
    var r=await db.from('project_complexes').insert({project_id:pid,name:name.trim(),code:code,status:'active',created_by:me&&me.id||null});
    if(r.error)return toast(r.error.message); toast('مجتمع ثبت شد'); renderHierarchy();
  };
  window.hAddBuilding=async function(){
    var cx=await db.from('project_complexes').select('id,name').eq('project_id',pid).order('sort_order');
    if(cx.error||!cx.data||!cx.data.length)return toast('ابتدا مجتمع بسازید');
    var cid=Number(prompt('شناسه مجتمع:\n'+cx.data.map(function(x){return x.id+': '+x.name;}).join('\n')));
    if(!cid)return; var name=prompt('نام ساختمان'); if(!name)return;
    var floors=Number(prompt('تعداد طبقات برنامه‌ای')||0)||null;
    var r=await db.from('project_buildings').insert({complex_id:cid,name:name.trim(),floors_planned:floors,status:'active',created_by:me&&me.id||null});
    if(r.error)return toast(r.error.message); toast('ساختمان ثبت شد'); renderHierarchy();
  };
  window.hAddFloor=async function(){
    var b=await db.from('project_buildings').select('id,name,complex_id').order('id');
    var cxIds=(await db.from('project_complexes').select('id').eq('project_id',pid)).data||[];
    var set={}; cxIds.forEach(function(x){set[x.id]=1;});
    var list=(b.data||[]).filter(function(x){return set[x.complex_id];});
    if(!list.length)return toast('ابتدا ساختمان بسازید');
    var bid=Number(prompt('شناسه ساختمان:\n'+list.map(function(x){return x.id+': '+x.name;}).join('\n')));
    if(!bid)return; var num=Number(prompt('شماره طبقه')); if(num===''||Number.isNaN(num))return toast('شماره طبقه لازم است');
    var name=prompt('نام طبقه (اختیاری)')||null; var area=Number(prompt('متراژ (اختیاری)')||'')||null;
    var r=await db.from('project_floors').insert({building_id:bid,floor_number:num,name:name,area_m2:area,status:'active',created_by:me&&me.id||null});
    if(r.error)return toast(r.error.message); toast('طبقه ثبت شد'); renderHierarchy();
  };
  window.hAddUnit=async function(){
    var f=await db.from('project_floors').select('id,floor_number,name,building_id').order('id').limit(100);
    if(f.error||!f.data||!f.data.length)return toast('ابتدا طبقه بسازید');
    var fid=Number(prompt('شناسه طبقه:\n'+f.data.map(function(x){return x.id+': طبقه '+x.floor_number+' '+(x.name||'');}).join('\n')));
    if(!fid)return; var code=prompt('کد واحد'); if(!code)return;
    var type=prompt('نوع (residential/commercial/parking/storage)','residential')||'residential';
    var area=Number(prompt('متراژ')||'')||null; var bed=Number(prompt('خواب')||'')||null;
    var r=await db.from('project_units').insert({floor_id:fid,unit_code:code.trim(),unit_type:type,area_m2:area,bedrooms:bed,status:'available',created_by:me&&me.id||null});
    if(r.error)return toast(r.error.message); toast('واحد ثبت شد'); renderHierarchy();
  };
})();
