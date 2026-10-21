const CACHE='income-journal-cache-v20';
const ASSETS=["./","./index.html","./manifest.webmanifest","./icon-512.png","./apple-touch-icon.png","./reward-welldone-top.webp","./reward-welldone-bottom.webp","./reward-adventure-top.webp","./reward-adventure-bottom.webp","./reward-future-top.webp","./reward-future-bottom.webp","./reward-rest-top.webp","./reward-rest-bottom.webp"];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('income-journal-cache-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{let req=event.request;if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;
  if(req.mode==='navigate')event.respondWith(fetch(req).then(r=>{if(r.ok){let copy=r.clone();caches.open(CACHE).then(c=>c.put(req,copy));}return r;}).catch(()=>caches.match(req).then(r=>r||caches.match('./index.html'))));
  else event.respondWith(caches.match(req).then(r=>r||fetch(req)));
});
