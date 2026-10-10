/* Emergency restore: load canonical app from known-good commit, then grant tasks in ROLE_ACCESS */
(function(){
  var s=document.createElement('script');
  s.src='https://cdn.jsdelivr.net/gh/homaankoohandaz-sketch/homaan_crm@9eac80bd807181c088166a5c7be0558258713002/buildwise-app.js';
  s.onload=function(){
    try{
      /* Patch ROLE_ACCESS after parent app defines it — tasks was missing from every role */
      if(typeof ROLE_ACCESS!=='undefined'){
        var roles=['owner','manager','advisor','agent','builder','staff'];
        for(var i=0;i<roles.length;i++){
          var r=roles[i];
          if(ROLE_ACCESS[r] && ROLE_ACCESS[r].indexOf('tasks')===-1){
            ROLE_ACCESS[r]=ROLE_ACCESS[r].slice();
            ROLE_ACCESS[r].splice(1,0,'tasks');
          }
        }
      }
    }catch(e){console.error('ROLE_ACCESS patch failed',e);}
  };
  s.onerror=function(){console.error('Failed to load parent buildwise-app.js from CDN');};
  document.head.appendChild(s);
})();
