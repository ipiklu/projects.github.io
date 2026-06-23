const CACHE_NAME = 'v1_cache';
const ASSETS = [
  './',
  './index.html',
  // Add paths to your main CSS or JS files here if you want them cached offline
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});