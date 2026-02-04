self.addEventListener("install",e=>{
  e.waitUntil(
    caches.open("saha").then(c=>c.addAll([
      "index.html","park.html","personel.html","evrak.html",
      "settings.html","app.js","style.css"
    ]))
  );
});

self.addEventListener("fetch",e=>{
  e.respondWith(
    caches.match(e.request).then(r=>r||fetch(e.request))
  );
});
