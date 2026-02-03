self.addEventListener("install", e=>{
e.waitUntil(
caches.open("park").then(c=>{
return c.addAll([
"index.html",
"manifest.json",
"acilis.mp4"
]);
})
);
});

self.addEventListener("fetch", e=>{
e.respondWith(
caches.match(e.request).then(r=>{
return r || fetch(e.request);
})
);
});
