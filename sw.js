self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("takip-v1").then(cache => {
      return cache.addAll([
        "./",
        "./index.html",
        "./park.html",
        "./personel.html",
        "./evrak.html",
        "./settings.html",
        "./style.css",
        "./app.js"
      ]);
    })
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
