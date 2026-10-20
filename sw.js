const CACHE = 'income-journal-cache-v11';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icon-512.png', './apple-touch-icon.png', './illustrated-celebration-1.png', './illustrated-celebration-2.png', './illustrated-celebration-3.png', './illustrated-celebration-4.png'];
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(
    keys.filter((key) => key.startsWith('income-journal-cache-') && key !== CACHE)
      .map((key) => caches.delete(key))
  )).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    // Prefer current app HTML after publishing an update; fall back to offline copy.
    event.respondWith(fetch(req).then((response) => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(req, copy));
      }
      return response;
    }).catch(() => caches.match(req).then((cached) => cached || caches.match('./index.html'))));
  } else {
    event.respondWith(caches.match(req).then((cached) => cached || fetch(req)));
  }
});
