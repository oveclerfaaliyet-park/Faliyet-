const CACHE_NAME='kodular-app-cache-v1';
const urlsToCache=[
  './index.html','./park.html','./personel.html','./evrak.html','./settings.html',
  './style.css','./app.js'
];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(urlsToCache)));
  self.skipWaiting();
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>{if(k!==CACHE_NAME)return caches.delete(k);}))));
  self.clients.claim();
});
self.addEventListener('fetch',e=>{
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});
