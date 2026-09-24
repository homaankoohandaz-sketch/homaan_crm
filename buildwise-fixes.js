/* BuildWise AI — compatibility fixes only.
   Canonical property/search UI lives in buildwise-app.js.
   Manager edits are audited through manager_edit_record.
*/
(function(){
  'use strict';
  const style=document.createElement('style');
  style.textContent='.full-property-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.full-property-grid>div{background:#f7f9f9;border:1px solid #e4e8ea;border-radius:9px;padding:10px;display:flex;flex-direction:column;gap:4px}.full-property-grid small{color:#7a858c;font-size:10px}.full-property-grid strong{font-size:12px}@media(max-width:760px){.full-property-grid{grid-template-columns:1fr}}';
  document.head.appendChild(style);
})();