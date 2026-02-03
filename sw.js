const CACHE_NAME = 'park-cache-v1';
const urlsToCache = ['index.html','manifest.json','ikon-192.png','ikon-512.png'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
