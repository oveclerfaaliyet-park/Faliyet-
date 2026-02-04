const CACHE_NAME = "saha-takip-cache-v1";
const urlsToCache = [
    "/",
    "/index.html",
    "/park.html",
    "/personel.html",
    "/evrak.html",
    "/ayarlar.html",
    "/style.css",
    "/app.js"
];

// INSTALL
self.addEventListener("install", e=>{
    e.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache=>cache.addAll(urlsToCache))
    );
});

// ACTIVATE
self.addEventListener("activate", e=>{
    e.waitUntil(
        caches.keys().then(keys=>{
            return Promise.all(
                keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))
            );
        })
    );
});

// FETCH
self.addEventListener("fetch", e=>{
    e.respondWith(
        caches.match(e.request).then(response=>{
            return response || fetch(e.request);
        })
    );
});
