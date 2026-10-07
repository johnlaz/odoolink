// OdooLink Landing Page Service Worker
// Scope: /odoolink/ (does NOT handle /odoolink/app/, which has its own SW)
const VERSION = '3.0';
const CACHE_NAME = 'odoolink-landing-v' + VERSION;
const STATIC_ASSETS = [
  '/odoolink/',
  '/odoolink/index.html',
  '/odoolink/manifest.json',
  '/odoolink/app/icon-192.png',
  '/odoolink/app/icon-512.png'
];
const CACHEABLE_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // The app has its own service worker
  if (url.pathname.startsWith('/odoolink/app/') && !url.pathname.match(/icon-(192|512)\.png$/)) return;

  if (url.hostname !== location.hostname) {
    if (!CACHEABLE_HOSTS.includes(url.hostname)) return;
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => cache.match(req).then(cached => {
        const net = fetch(req).then(res => {
          if (res && (res.status === 200 || res.type === 'opaque')) cache.put(req, res.clone());
          return res;
        }).catch(() => cached);
        return cached || net;
      }))
    );
    return;
  }

  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      fetch(req).then(res => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('/odoolink/index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(res => {
      if (res && res.status === 200 && res.type === 'basic') {
        const copy = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(req, copy));
      }
      return res;
    }))
  );
});
