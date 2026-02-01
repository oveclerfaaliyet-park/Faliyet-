self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("park-cache").then(cache => {
      return cache.addAll([
        "./",
        "./index.html",
        "./acilis.mp4",
        "./manifest.json"
      ]);
    })
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request);
    })
  );
});
