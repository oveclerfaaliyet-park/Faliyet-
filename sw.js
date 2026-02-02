const CACHE_NAME = "park-cache-v1";
const urlsToCache = ["./index.html","./manifest.json","./sw.js"];

self.addEventListener("install", e=>{
  e.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(urlsToCache)));
});

self.addEventListener("fetch", e=>{
  e.respondWith(caches.match(e.request).then(resp=>resp || fetch(e.request)));
});
