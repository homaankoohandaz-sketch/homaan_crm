/* BuildWise Project Control — Procurement 141–160
 * 141 approval · 142 PO · 143/144 delivery · 145/146 inventory/consumption
 * 147 shortage · 148–157 price lineage · 158 forecast · 159 timing · 160 risk
 */
(function(){
  const escP = window.esc || (x=>String(x??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const moneyP = window.money || (x=>Number(x||0).toLocaleString('fa-IR'));
  const formP=(kind,title,fields)=>`<section class="panel"><h3>${title}</h3><form class="form" data-pform="${kind}">${fields.map(f=>`<label class="${f.full?'full':''}">${f.label}${f.ta?`<textarea name="${f.n}" rows="3"></textarea>`:`<input name="${f.n}" type="${f.type||'text'}" ${f.req?'required':''}>`}</label>`).join('')}<div class="full"><button class="primary">ثبت</button></div></form></section>`;

  async function refreshProcurement(){
    const c=document.querySelector('#content');
    if(!c || !window.db || !window.pid) return;
    const [p,a,po,d,i,con,pr] = await Promise.all([
      db.from('project_procurement_control').select('*').eq('project_id',window.pid).order('id',{ascending:false}).limit(100),
      db.from('project_purchase_approvals').select('*').eq('project_id',window.pid).order('id',{ascending:false}).limit(50),
      db.from('project_purchase_orders').select('*').eq('project_id',window.pid).order('id',{ascending:false}).limit(50),
      db.from('project_procurement_deliveries').select('*').eq('project_id',window.pid).order('id',{ascending:false}).limit(50),
      db.from('project_material_inventory').select('*').eq('project_id',window.pid).order('material_name').limit(100),
      db.from('project_material_consumption').select('*').eq('project_id',window.pid).order('id',{ascending:false}).limit(50),
      db.from('project_material_prices').select('*').order('effective_at',{ascending:false}).limit(100)
    ]);
    if(p.error){ toast(p.error.message); return; }
    const rows=p.data||[], approvals=a.data||[], orders=po.data||[], deliveries=d.data||[], inventory=i.data||[], consumption=con.data||[], prices=pr.data||[];
    c.innerHTML =
      formP('approval','141 · درخواست تأیید خرید',[
        {n:'procurement_id',label:'Purchase ID',type:'number',req:true},
        {n:'note',label:'یادداشت',ta:true,full:true}
      ])+
      formP('po','142 · Purchase Order',[
        {n:'procurement_id',label:'Purchase ID',type:'number',req:true},
        {n:'po_number',label:'شماره سفارش',req:true},
        {n:'supplier_name',label:'تأمین‌کننده'},
        {n:'ordered_at',label:'تاریخ سفارش',type:'date'},
        {n:'expected_delivery_at',label:'تحویل مورد انتظار',type:'date'},
        {n:'quantity',label:'مقدار',type:'number'},
        {n:'unit',label:'واحد'},
        {n:'unit_price_toman',label:'نرخ تومان',type:'number'},
        {n:'notes',label:'شرح',ta:true,full:true}
      ])+
      formP('delivery','143/144 · ثبت تحویل / تحویل جزئی',[
        {n:'procurement_id',label:'Purchase ID',type:'number',req:true},
        {n:'purchase_order_id',label:'PO ID',type:'number'},
        {n:'delivered_at',label:'تاریخ تحویل',type:'date'},
        {n:'quantity',label:'مقدار تحویل',type:'number',req:true},
        {n:'accepted_quantity',label:'مقدار تأییدشده',type:'number'},
        {n:'rejected_quantity',label:'مقدار مردود',type:'number'},
        {n:'notes',label:'شرح',ta:true,full:true}
      ])+
      formP('inventory','145 · موجودی مصالح',[
        {n:'material_key',label:'کلید ماده',req:true},
        {n:'material_name',label:'نام ماده',req:true},
        {n:'unit',label:'واحد'},
        {n:'on_hand_quantity',label:'موجودی',type:'number'},
        {n:'reserved_quantity',label:'رزرو',type:'number'},
        {n:'reorder_point',label:'نقطه سفارش',type:'number'}
      ])+
      formP('consumption','146 · مصرف مصالح',[
        {n:'material_inventory_id',label:'Inventory ID',type:'number',req:true},
        {n:'quantity',label:'مقدار مصرف',type:'number',req:true},
        {n:'consumed_at',label:'تاریخ',type:'date'},
        {n:'procurement_id',label:'Purchase ID',type:'number'},
        {n:'boq_item_id',label:'BOQ ID',type:'number'},
        {n:'notes',label:'شرح',ta:true,full:true}
      ])+
      formP('price','148–157 · قیمت و منبع',[
        {n:'procurement_id',label:'Purchase ID (اختیاری)',type:'number'},
        {n:'material_key',label:'کلید ماده',req:true},
        {n:'material_name',label:'نام ماده',req:true},
        {n:'unit',label:'واحد'},
        {n:'price_toman',label:'قیمت تومان',type:'number',req:true},
        {n:'price_usd',label:'معادل دلار',type:'number'},
        {n:'effective_at',label:'زمان اعتبار',type:'datetime-local'},
        {n:'source',label:'منبع',req:true},
        {n:'source_url',label:'آدرس منبع'},
        {n:'is_live',label:'Live؟ (true/false)'},
        {n:'notes',label:'شرح',ta:true,full:true}
      ])+
      formP('forecast','158/159/160 · پیش‌بینی خرید و ریسک',[
        {n:'procurement_id',label:'Purchase ID',type:'number',req:true},
        {n:'forecast_required_date',label:'تاریخ نیاز',type:'date'},
        {n:'forecast_quantity',label:'مقدار پیش‌بینی',type:'number'},
        {n:'recommended_purchase_date',label:'تاریخ خرید پیشنهادی',type:'date'},
        {n:'procurement_risk_score',label:'امتیاز ریسک ۰–۱۰۰',type:'number'},
        {n:'procurement_risk_level',label:'سطح ریسک'}
      ])+
      '<section class="panel"><h3>141–160 · کنترل عملیاتی</h3><div class="list">'+rows.map(x=>`<div class="item"><div><b>#${x.id} ${escP(x.item_name)}</b><div class="muted">وضعیت ${escP(x.status)} · approval ${escP(x.approval_status)} · تحویل ${x.delivery_percent}% · مانده ${x.outstanding_quantity} · خرید ${moneyP(x.purchase_price_toman)} · قیمت جاری ${moneyP(x.current_price_toman)} · variance ${x.live_price_variance_percent}% · risk ${x.calculated_risk_level}</div></div><button type="button" onclick="window.bwApprove(${x.id})">تأیید</button></div>`).join('')+'</div></section>'+
      '<section class="panel"><h3>Approval / PO / Delivery</h3><div class="list">'+approvals.map(x=>`<div class="item">Approval #${x.id} · Purchase #${x.procurement_id} · ${escP(x.status)}</div>`).join('')+orders.map(x=>`<div class="item">PO ${escP(x.po_number)} · ${escP(x.status)} · ${moneyP(x.total_price_toman)}</div>`).join('')+deliveries.map(x=>`<div class="item">Delivery #${x.id} · Purchase #${x.procurement_id} · ${x.quantity} / accepted ${x.accepted_quantity} / rejected ${x.rejected_quantity}</div>`).join('')+'</div></section>'+
      '<section class="panel"><h3>145/146 · Inventory</h3><div class="list">'+inventory.map(x=>`<div class="item">#${x.id} ${escP(x.material_name)} · موجودی ${x.on_hand_quantity} · رزرو ${x.reserved_quantity} · reorder ${x.reorder_point} ${x.on_hand_quantity-x.reserved_quantity<=x.reorder_point?'<b class="danger">SHORTAGE</b>':''}</div>`).join('')+'</div></section>'+
      '<section class="panel"><h3>148–157 · Price History</h3><div class="list">'+prices.map(x=>`<div class="item">${escP(x.material_name)} · ${moneyP(x.price_toman)} تومان · $${x.price_usd||0} · ${escP(x.source)} · ${new Date(x.effective_at).toLocaleString('fa-IR')} ${x.is_live?'<b class="ok">LIVE</b>':''}</div>`).join('')+'</div></section>';

    c.querySelectorAll('form[data-pform]').forEach(f=>f.addEventListener('submit', async e=>{
      e.preventDefault();
      const o=Object.fromEntries(new FormData(f).entries());
      const n=k=>o[k]===undefined||o[k]===''?null:o[k];
      let r;
      if(f.dataset.pform==='approval'){
        r=await db.from('project_purchase_approvals').insert({project_id:window.pid,procurement_id:Number(o.procurement_id),requested_by:window.me?.id||null,note:n('note')});
      } else if(f.dataset.pform==='po'){
        r=await db.from('project_purchase_orders').insert({project_id:window.pid,procurement_id:Number(o.procurement_id),po_number:o.po_number,supplier_name:n('supplier_name'),ordered_at:n('ordered_at'),expected_delivery_at:n('expected_delivery_at'),quantity:Number(o.quantity||0),unit:n('unit'),unit_price_toman:Number(o.unit_price_toman||0),notes:n('notes')}).select('id').single();
        if(!r.error) await db.from('project_procurement').update({purchase_order_id:r.data.id,ordered_at:n('ordered_at'),supplier_name:n('supplier_name'),status:'ordered'}).eq('id',Number(o.procurement_id)).eq('project_id',window.pid);
      } else if(f.dataset.pform==='delivery'){
        r=await db.from('project_procurement_deliveries').insert({project_id:window.pid,procurement_id:Number(o.procurement_id),purchase_order_id:n('purchase_order_id')?Number(o.purchase_order_id):null,delivered_at:n('delivered_at'),quantity:Number(o.quantity||0),accepted_quantity:Number(o.accepted_quantity||0),rejected_quantity:Number(o.rejected_quantity||0),notes:n('notes')});
        if(!r.error){
          const q=await db.from('project_procurement').select('quantity,received_quantity,rejected_quantity').eq('id',Number(o.procurement_id)).eq('project_id',window.pid).single();
          if(!q.error){
            const received=Number(q.data.received_quantity||0)+Number(o.accepted_quantity||0), rejected=Number(q.data.rejected_quantity||0)+Number(o.rejected_quantity||0), total=Number(q.data.quantity||0);
            await db.from('project_procurement').update({received_quantity:received,rejected_quantity:rejected,delivered_at:n('delivered_at'),status:received>=total&&total>0?'delivered':'partially_delivered'}).eq('id',Number(o.procurement_id)).eq('project_id',window.pid);
          }
        }
      } else if(f.dataset.pform==='inventory'){
        r=await db.from('project_material_inventory').upsert({project_id:window.pid,material_key:o.material_key,material_name:o.material_name,unit:n('unit'),on_hand_quantity:Number(o.on_hand_quantity||0),reserved_quantity:Number(o.reserved_quantity||0),reorder_point:Number(o.reorder_point||0),last_counted_at:new Date().toISOString()},{onConflict:'project_id,material_key'});
      } else if(f.dataset.pform==='consumption'){
        const id=Number(o.material_inventory_id), qty=Number(o.quantity||0);
        const q=await db.from('project_material_inventory').select('on_hand_quantity').eq('id',id).eq('project_id',window.pid).single();
        if(q.error){toast(q.error.message);return;}
        if(Number(q.data.on_hand_quantity)<qty){toast('موجودی کافی نیست');return;}
        r=await db.from('project_material_consumption').insert({project_id:window.pid,material_inventory_id:id,quantity:qty,consumed_at:n('consumed_at'),procurement_id:n('procurement_id')?Number(o.procurement_id):null,boq_item_id:n('boq_item_id')?Number(o.boq_item_id):null,notes:n('notes')});
        if(!r.error) r=await db.from('project_material_inventory').update({on_hand_quantity:Number(q.data.on_hand_quantity)-qty,updated_at:new Date().toISOString()}).eq('id',id).eq('project_id',window.pid);
      } else if(f.dataset.pform==='price'){
        r=await db.from('project_material_prices').insert({material_key:o.material_key,material_name:o.material_name,unit:n('unit'),price_toman:Number(o.price_toman||0),price_usd:Number(o.price_usd||0),effective_at:n('effective_at')||new Date().toISOString(),source:o.source,source_url:n('source_url'),is_live:String(o.is_live).toLowerCase()==='true',notes:n('notes')});
        if(!r.error && n('procurement_id')){
          const pid2=Number(o.procurement_id);
          const current=await db.from('project_procurement').select('purchase_price_toman').eq('id',pid2).eq('project_id',window.pid).single();
          if(current.error){r=current; } else {
            const purchase=Number(current.data.purchase_price_toman||0);
            const currentPrice=Number(o.price_toman||0);
            r=await db.from('project_procurement').update({
              current_price_toman:currentPrice,
              current_price_usd:Number(o.price_usd||0),
              current_price_timestamp:n('effective_at')||new Date().toISOString(),
              current_price_source:o.source,
              price_variance_toman:currentPrice-purchase,
              price_variance_percent:purchase>0?((currentPrice-purchase)/purchase)*100:0
            }).eq('id',pid2).eq('project_id',window.pid);
          }
        }
      } else if(f.dataset.pform==='forecast'){
        const id=Number(o.procurement_id), score=Math.max(0,Math.min(100,Number(o.procurement_risk_score||0)));
        r=await db.from('project_procurement').update({forecast_required_date:n('forecast_required_date'),forecast_quantity:Number(o.forecast_quantity||0),recommended_purchase_date:n('recommended_purchase_date'),procurement_risk_score:score,procurement_risk_level:o.procurement_risk_level||'low'}).eq('id',id).eq('project_id',window.pid);
      }
      if(r?.error){toast(r.error.message);return;}
      toast('ثبت شد'); await refreshProcurement();
    }));
  }

  window.bwApprove=async function(id){
    const r=await db.from('project_purchase_approvals').insert({project_id:window.pid,procurement_id:id,requested_by:window.me?.id||null,status:'approved',decided_by:window.me?.id||null,decided_at:new Date().toISOString(),note:'Approved from Project Control'});
    if(r.error){toast(r.error.message);return;}
    const u=await db.from('project_procurement').update({approval_status:'approved',approved_at:new Date().toISOString(),status:'approved'}).eq('id',id).eq('project_id',window.pid);
    if(u.error){toast(u.error.message);return;}
    toast('خرید تأیید شد'); await refreshProcurement();
  };

  function hook(){
    window.pid=typeof pid!=='undefined'?pid:null;
    window.me=typeof me!=='undefined'?me:null;
    window.db=typeof db!=='undefined'?db:null;
    const tab=[...document.querySelectorAll('.tab')].find(x=>x.dataset.t==='procurement');
    if(tab){
      tab.onclick=async()=>{document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b===tab));window.pid=pid;window.me=me;await refreshProcurement();};
    }
    if(window.pid) window.setTimeout(()=>{window.pid=pid;window.me=me;window.db=db;},0);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',hook); else hook();
  window.refreshProcurement141160=refreshProcurement;
})();