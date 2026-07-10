const CACHE = 'sipa-calc-en-v2-20260711';
const OWN_CACHE_PREFIXES = ['sipa-calc-en-', 'sipa-calc-v3-english'];
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
      Promise.all(
        keys.map(key => {
          const belongsToThisApp = OWN_CACHE_PREFIXES.some(prefix => key.startsWith(prefix));
          return belongsToThisApp && key !== CACHE ? caches.delete(key) : null;
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const acceptsHTML =
    request.mode === 'navigate' ||
    (request.headers.get('accept') || '').includes('text/html');

  if (acceptsHTML) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      try {
        const response = await fetch(request);
        if (response && response.ok) {
          await cache.put('./index.html', response.clone());
        }
        return response;
      } catch (error) {
        return (
          await cache.match('./index.html') ||
          await cache.match('./offline.html')
        );
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(request);

    const network = fetch(request)
      .then(response => {
        if (response && response.ok) cache.put(request, response.clone());
        return response;
      })
      .catch(() => null);

    return cached || await network || new Response('Offline', {
      status: 503,
      statusText: 'Offline'
    });
  })());
});
