// OdooLink App Service Worker
// Scope: /odoolink/app/
// VERSION must match <meta name="oel-version"> in index.html (without the "v").
const VERSION = '15.38';
const CACHE_NAME = 'odoolink-app-v' + VERSION;
const STATIC_ASSETS = [
  '/odoolink/app/',
  '/odoolink/app/index.html',
  '/odoolink/app/manifest.json',
  '/odoolink/app/icon-192.png',
  '/odoolink/app/icon-512.png'
];
// Third-party hosts whose GET responses are cached at runtime so fonts and the
// Excel libraries keep working offline. Everything else cross-origin goes to network.
const CACHEABLE_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com', 'cdnjs.cloudflare.com'];

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

  // Local Python servers, API calls, and anything not explicitly cacheable: straight to network
  if (url.hostname !== location.hostname) {
    if (!CACHEABLE_HOSTS.includes(url.hostname)) return;
    event.respondWith(staleWhileRevalidate(req));
    return;
  }
  if (url.port === '7842' || url.port === '7843' || url.pathname.includes('/api/')) return;

  // HTML / navigations: network first so a new deploy is picked up immediately
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      fetch(req).then(res => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() =>
        caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('/odoolink/app/index.html'))
      )
    );
    return;
  }

  // Same-origin assets: cache first
  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(res => {
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, copy));
        }
        return res;
      });
    })
  );
});

function staleWhileRevalidate(req) {
  return caches.open(CACHE_NAME).then(cache =>
    cache.match(req).then(cached => {
      const network = fetch(req).then(res => {
        if (res && (res.status === 200 || res.type === 'opaque')) cache.put(req, res.clone());
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
}
