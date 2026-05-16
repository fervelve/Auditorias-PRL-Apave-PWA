// Service Worker — Registro de Visita a Obra (Eurocontrol)
const CACHE_NAME = 'rvo-eurocontrol-v2';
const BASE = '/Auditorias-PRL-Apave-PWA/';

// Archivos propios de la app (siempre en caché)
const APP_ASSETS = [
  BASE,
  BASE + 'index.html',
  BASE + 'manifest.json',
  BASE + 'municipios.js',
  BASE + 'icons/icon-192.png',
  BASE + 'icons/icon-512.png',
];

// Librerías externas a cachear en la primera carga
const CDN_ASSETS = [
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
  'https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap',
];

// ── INSTALACIÓN: precachear todos los assets ──────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      // Cachear assets de la app (críticos)
      await cache.addAll(APP_ASSETS);

      // Cachear CDN assets (no críticos — no falla si no hay red)
      await Promise.allSettled(
        CDN_ASSETS.map(url =>
          fetch(url, { mode: 'cors' })
            .then(res => { if(res.ok) cache.put(url, res); })
            .catch(() => {})
        )
      );
    })
  );
  self.skipWaiting();
});

// ── ACTIVACIÓN: limpiar cachés antiguas ─────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ── FETCH: Cache First para assets propios, Network First para el resto ──
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Assets propios de la app → Cache First
  if (url.origin === self.location.origin || APP_ASSETS.some(a => event.request.url.includes(a.replace('./', '')))) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(res => {
          if (res && res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
          }
          return res;
        }).catch(() => caches.match('./index.html'));
      })
    );
    return;
  }

  // CDN y externos → Cache First (offline-friendly)
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(res => {
        if (res && res.ok) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
        }
        return res;
      }).catch(() => {
        // Sin red y sin caché → devolver respuesta vacía para no bloquear
        return new Response('', { status: 503, statusText: 'Offline' });
      });
    })
  );
});
