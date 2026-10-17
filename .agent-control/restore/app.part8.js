
if('serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
window.addEventListener('DOMContentLoaded',()=>boot());
