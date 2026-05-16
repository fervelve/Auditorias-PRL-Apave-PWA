// Service Worker — Registro de Visita a Obra (Eurocontrol)
const CACHE_NAME = 'rvo-eurocontrol-v3';
const BASE = '/Auditorias-PRL-Apave-PWA/';

const APP_ASSETS = [
  BASE,
  BASE + 'index.html',
  BASE + 'manifest.json',
  BASE + 'municipios.js',
  BASE + 'icons/icon-192.png',
  BASE + 'icons/icon-512.png',
  BASE + 'sw.js',
];

const CDN_ASSETS = [
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
];

// INSTALACIÓN: cachear uno a uno para no fallar en bloque
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    for (const url of APP_ASSETS) {
      try {
        const res = await fetch(url, { cache: 'reload' });
        if (res.ok) await cache.put(url, res);
        else console.warn('SW: respuesta no ok', url, res.status);
      } catch(e) { console.warn('SW: fallo descarga', url, e.message); }
    }
    for (const url of CDN_ASSETS) {
      try {
        const res = await fetch(url, { mode: 'cors' });
        if (res.ok) await cache.put(url, res);
      } catch(e) { console.warn('SW: CDN fallo', url); }
    }
    console.log('SW v3: instalacion completa');
  })());
  self.skipWaiting();
});

// ACTIVACIÓN: limpiar cachés antiguas
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
    await self.clients.claim();
    console.log('SW v3: activado');
  })());
});

// FETCH: Cache First siempre
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(event.request);
    if (cached) return cached;
    try {
      const res = await fetch(event.request);
      if (res && res.ok) cache.put(event.request, res.clone());
      return res;
    } catch(e) {
      const fallback = await cache.match(BASE + 'index.html');
      if (fallback) return fallback;
      return new Response('<h2>Sin conexion</h2><p>Abre la app con internet al menos una vez para activar el modo offline.</p>',
        { headers: { 'Content-Type': 'text/html' } });
    }
  })());
});
