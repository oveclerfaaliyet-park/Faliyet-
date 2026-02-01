const CACHE = "park-v1";

const FILES = [
  "index.html",
  "kayit.html",
  "ayarlar.html",
  "style.css",
  "app.js",
  "manifest.json",
  "icon-192.png",
  "acilis.mp4"
];

self.addEventListener("install", e=>{
  e.waitUntil(
    caches.open(CACHE).then(c=>c.addAll(FILES))
  );
});

self.addEventListener("fetch", e=>{
  e.respondWith(
    caches.match(e.request).then(r=> r || fetch(e.request))
  );
});
