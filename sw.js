const CACHE_NAME = 'piklu-server-v3'; // Incremented version to break old cache structures
const ASSETS = [
  './',
  './index.html',
  './css/design.css',
  './css/dark.css',
  './js/script.js',
  './manifest.json',
  './img/s.png',
  './img/bigS.png'
];

// Force immediate activation when installing the updated service worker file
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching fresh system layout assets.');
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting()) // Instantly boots the worker out of waiting phase
  );
});

// Clean out any old legacy cache storage buckets immediately
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Clearing old cache instance:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim()) // CRUCIAL: Forces the active worker to take immediate control of the page layout
  );
});

// Fetch interception strategy
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});