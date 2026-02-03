const CACHE_NAME = 'kodular-app-cache-v1';
const urlsToCache = [
  './index.html',
  './park.html',
  './personel.html',
  './evrak.html',
  './settings.html',
  './style.css',
  './app.js'
];

// Install: cache dosyaları
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache açıldı ve dosyalar eklendi');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Activate: eski cache temizleme
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
  self.clients.claim();
});

// Fetch: cache veya network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
