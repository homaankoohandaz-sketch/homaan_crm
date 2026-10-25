/* BuildWise UI motion controller. Progressive enhancement only; no auth/data mutation. */
(function(){
 'use strict';
 if(window.__bwMotionControllerLoaded)return;
 window.__bwMotionControllerLoaded=true;
 const reduce=()=>window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const seen=new WeakSet();
 function placeLiquidIndicator(){
   const nav=document.getElementById('bottomNav');
   if(!nav)return;
   const active=nav.querySelector('.nav-item.active');
   if(!active){nav.style.setProperty('--bw-pill-width','0px');return}
   const nr=nav.getBoundingClientRect(),ar=active.getBoundingClientRect();
   nav.style.setProperty('--bw-pill-left',Math.max(0,ar.left-nr.left)+'px');
   nav.style.setProperty('--bw-pill-width',Math.max(0,ar.width)+'px');
 }
 function animateNewSurfaces(root){
   if(reduce())return;
   const selectors='.stats > *, .data-grid > *, .two-col > *, .auth-card, .public-hero, .public-grid > *';
   const nodes=[];
   if(root.nodeType===1&&root.matches&&root.matches(selectors))nodes.push(root);
   if(root.querySelectorAll)nodes.push(...root.querySelectorAll(selectors));
   nodes.forEach(el=>{if(seen.has(el))return;seen.add(el);el.classList.add('bw-motion-enter')});
 }
 function sync(){
   animateNewSurfaces(document.body);
   placeLiquidIndicator();
 }
 const start=()=>{sync();const target=document.body;if(!target)return;
   const observer=new MutationObserver(records=>{
     let navDirty=false;
     for(const record of records){
       if(record.type==='childList'&&record.addedNodes.length)record.addedNodes.forEach(n=>{if(n.nodeType===1)animateNewSurfaces(n)});
       if(record.target&&record.target.closest&&record.target.closest('#bottomNav'))navDirty=true;
       if(record.type==='attributes'&&record.target&&record.target.closest&&record.target.closest('#bottomNav'))navDirty=true;
     }
     if(navDirty||document.getElementById('bottomNav'))requestAnimationFrame(placeLiquidIndicator);
   });
   observer.observe(target,{childList:true,subtree:true,attributes:true,attributeFilter:['class','hidden']});
   document.addEventListener('click',e=>{if(e.target.closest('#bottomNav .nav-item'))requestAnimationFrame(placeLiquidIndicator)},true);
   window.addEventListener('resize',placeLiquidIndicator,{passive:true});
   window.addEventListener('orientationchange',()=>setTimeout(placeLiquidIndicator,80),{passive:true});
   if(document.fonts&&document.fonts.ready)document.fonts.ready.then(placeLiquidIndicator).catch(()=>{});
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
