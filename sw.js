self.addEventListener('install', e=>{
  e.waitUntil(
    caches.open('faaliyet-cache').then(cache=>{
      return cache.addAll([
        '.',
        'index.html',
        'manifest.json',
        'acilis.mp4',
        'pexels-eberhardgross-1301976.jpg',
        'pexels-eberhardgross-1612351.jpg',
        'pexels-skylar-kang-6044198.jpg'
      ]);
    })
  );
});

self.addEventListener('fetch', e=>{
  e.respondWith(
    caches.match(e.request).then(r=>r||fetch(e.request))
  );
});
