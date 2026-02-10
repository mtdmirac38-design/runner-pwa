const CACHE_NAME = 'skyrunner-cache-v1';
const RUNTIME_CACHE = 'skyrunner-runtime-v1';
const API_CACHE = 'skyrunner-api-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/index.css',
  '/styles/animations.css',
  '/offline.html',
  '/assets/index-BF-b9Ng1.js',
  '/assets/index-D-Pw_67U.css',
  '/assets/manifest-Dv5Wz8QH.json',
  '/icon.svg',
];
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache and precaching app shell');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME, RUNTIME_CACHE, API_CACHE];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
          return Promise.resolve();
        })
      );
    }).then(() => self.clients.claim())
  );
});
function offlineJsonResponse() {
  return new Response(JSON.stringify({ error: 'offline', message: 'You are offline.' }), {
    status: 503,
    headers: { 'Content-Type': 'application/json' },
  });
}
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (!url.protocol.startsWith('http')) {
    return;
  }
  if (request.method !== 'GET' || url.protocol === 'ws:' || url.protocol === 'wss:') {
    return;
  }
  if (url.pathname.includes('vite') || url.search.includes('t=') || url.pathname.includes('client')) {
    return;
  }
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put('/index.html', copy));
          return response;
        })
        .catch(() => caches.match('/index.html').then((r) => r || caches.match('/offline.html')))
    );
    return;
  }
  if (url.pathname.startsWith('/api/') || url.pathname.includes('/api')) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(API_CACHE).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        })
        .catch(() =>
          caches.match(request).then((cached) => {
            return cached || offlineJsonResponse();
          })
        )
    );
    return;
  }
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const networkFetch = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && request.method === 'GET') {
            const copy = networkResponse.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        })
        .catch(() => null);
      return cachedResponse || networkFetch || caches.match('/offline.html');
    })
  );
});
