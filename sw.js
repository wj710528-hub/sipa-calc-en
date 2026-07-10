// Cache-first navigation with background update; cache-first static assets; offline fallback.
const CACHE = 'sipa-calc-v3-english';
const CORE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './offline.html'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => key !== CACHE ? caches.delete(key) : null))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const isHTML =
    request.mode === 'navigate' ||
    (request.headers.get('accept') || '').includes('text/html');

  if(isHTML){
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      const cached = await cache.match('./index.html');
      const network = fetch(request)
        .then(response => {
          cache.put('./index.html', response.clone());
          return response;
        })
        .catch(() => null);

      return cached || await network || await cache.match('./offline.html');
    })());
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(request);

    if(cached){
      event.waitUntil(
        fetch(request)
          .then(response => cache.put(request, response.clone()))
          .catch(() => {})
      );
      return cached;
    }

    try{
      const response = await fetch(request);
      cache.put(request, response.clone());
      return response;
    }catch(error){
      return new Response('Offline', {status:503, statusText:'Offline'});
    }
  })());
});
