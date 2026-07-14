// OdooLink App Service Worker
// Scope: /odoolink/app/
const CACHE_NAME = 'odoolink-app-v13';
const STATIC_ASSETS = [
  '/odoolink/app/',
  '/odoolink/app/index.html',
  '/odoolink/app/manifest.json',
  '/odoolink/app/icons/icon-192.png',
  '/odoolink/app/icons/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      const local    = STATIC_ASSETS.filter(u => !u.startsWith('http'));
      const external = STATIC_ASSETS.filter(u =>  u.startsWith('http'));
      return cache.addAll(local).then(() =>
        Promise.allSettled(
          external.map(url => fetch(url).then(r => cache.put(url, r)).catch(() => {}))
        )
      );
    }).then(() => self.skipWaiting())
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
  const url = new URL(event.request.url);

  // Let API/backend requests go straight to network
  const isApiCall =
    url.hostname !== location.hostname ||
    url.port === '7842' || url.port === '7843' ||  // Python proxy servers
    url.pathname.includes('/api/') ||
    url.hostname.includes('api.groq.com') ||
    url.hostname.includes('googleapis');

  if (isApiCall) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type === 'opaque') return response;
        const clone = response.clone();
        caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
        return response;
      }).catch(() => caches.match('/odoolink/app/index.html'));
    })
  );
});
