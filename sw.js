const CACHE='field-v1';
const ASSETS=['./','./index.html','./three.min.js','./manifest.json','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',function(e){ e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(ASSETS);})); self.skipWaiting(); });
self.addEventListener('activate',function(e){ e.waitUntil(caches.keys().then(function(keys){ return Promise.all(keys.map(function(k){ if(k!==CACHE) return caches.delete(k); })); }).then(function(){ return self.clients.claim(); })); });
self.addEventListener('fetch',function(e){ var req=e.request; var isHTML=req.mode==='navigate'||(req.headers.get('accept')||'').indexOf('text/html')>-1;
  if(isHTML){ e.respondWith(fetch(req).then(function(r){ var c=r.clone(); caches.open(CACHE).then(function(x){x.put('./index.html',c);}); return r; }).catch(function(){ return caches.match(req).then(function(r){return r||caches.match('./index.html');}); })); return; }
  e.respondWith(caches.match(req).then(function(r){ return r||fetch(req); })); });