const V = 'ss-v1';
const CORE = ['/', '/index.html', '/blog.html', '/imprensa.html', '/tour.html', '/carreiras.html',
  '/style.css', '/script.js', '/pages.js', '/es.js', '/chatbot.js', '/manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k))))
    .then(() => self.clients.claim())
));

self.addEventListener('fetch', e => {
  const r = e.request, url = new URL(r.url);
  if (r.method !== 'GET' || url.origin !== location.origin || url.pathname.startsWith('/admin')) return;

  /* Páginas e dados: busca na rede primeiro e usa o cache se estiver offline */
  if (r.mode === 'navigate' || url.pathname.startsWith('/data/')) {
    e.respondWith(fetch(r).then(res => {
      const copy = res.clone(); caches.open(V).then(c => c.put(r, copy)); return res;
    }).catch(() => caches.match(r).then(m => m || caches.match('/index.html'))));
    return;
  }

  /* Demais arquivos: entrega do cache e atualiza em segundo plano */
  e.respondWith(caches.open(V).then(async c => {
    const cached = await c.match(r);
    const net = fetch(r).then(res => { if (res.ok) c.put(r, res.clone()); return res; }).catch(() => cached);
    return cached || net;
  }));
});