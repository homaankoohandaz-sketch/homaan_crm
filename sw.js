const CACHE='buildwise-shell-v4';
const SHELL=['./','./index.html','./manifest.webmanifest','./mobile-foundation.css','./buildwise-app.js'];
const isSameOrigin=u=>u.origin===self.location.origin;
const isDynamic=u=>u.pathname.includes('/functions/')||u.hostname.includes('supabase.co');
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;const u=new URL(event.request.url);if(!isSameOrigin(u)||isDynamic(u))return;event.respondWith(fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(c=>c.put(event.request,copy)).catch(()=>{});return response}).catch(()=>caches.match(event.request).then(r=>r||caches.match('./index.html'))))});