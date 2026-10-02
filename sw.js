// Keep this identifier equal to BUILD_ID in index.html and build_id in version.json.
const BUILD_ID = 'aaccbfb8720ff3bb0620e8188a479da0c663b9f88b2e3f703116fa6bbf59d9d0';
const CORE_CACHE = `prontuario-core-${BUILD_ID}`;
const DOC_CACHE = `prontuario-docs-${BUILD_ID}`;
const PREFIX = 'prontuario-';
const ROOT = new URL('./', self.location.href);
const CORE = ['index.html', 'manifest.webmanifest', 'assets/polizia-locale-napoli.png', 'assets/polizia.png', 'assets/icon-192.png', 'assets/icon-512.png', 'assets/icon-maskable-192.png', 'assets/icon-maskable-512.png', 'assets/apple-touch-icon.png', 'assets/favicon.ico', 'assets/favicon-16.png', 'assets/favicon-32.png', 'assets/favicon-48.png'];
const DOCS = new Set([
  'allegati/EGAF_Art85_originale.txt',
  'allegati/EGAF_Art86_originale.pdf',
  'allegati/Prontuario_GIT_Turistica_originale.pdf',
  'allegati/Prontuario_Taxi_NCC_Napoli.pdf',
  'allegati/Regolamento_Taxi_NCC_Napoli.pdf',
  'allegati/Tariffario_Taxi_2024.pdf'
]);
// Generated from the published files by scripts/update-build.py.
const DOC_HASHES = {"allegati/EGAF_Art85_originale.txt": "594a78b6f7cd709205d6790508b42a970588b422dbd414fafe72a42919585610", "allegati/EGAF_Art86_originale.pdf": "5031c8e106940ba867dd62681871f4861c686c479986553a580687302434e582", "allegati/Prontuario_GIT_Turistica_originale.pdf": "0c7a2c95204eaee3f9d6c2c2b12c3fd54a87189225b68e2d04e3d1d0317c649a", "allegati/Prontuario_Taxi_NCC_Napoli.pdf": "2ab1d6f965805b47e1c21f5fd1b14cee0f8450d0bafc9615327d3ee35f52cff8", "allegati/Regolamento_Taxi_NCC_Napoli.pdf": "fb2fbc7f2367e0cd06f0e9ce4bfa28d1489b89482d15ace74055ea673a5616d0", "allegati/Tariffario_Taxi_2024.pdf": "1035beb038019089dd94a323f105af1dd39ffba115f71833607ed27bce8ae055"};

function relativePath(url) {
  if (url.origin !== ROOT.origin || !url.pathname.startsWith(ROOT.pathname)) return null;
  try { return decodeURIComponent(url.pathname.slice(ROOT.pathname.length)); }
  catch { return null; }
}

async function matchingIndex(response, build) {
  if (!response.ok) return false;
  const html = await response.clone().text();
  return html.includes(`BUILD_ID='${build}'`);
}

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CORE_CACHE);
    const index = await fetch(new URL('index.html', ROOT), {cache: 'no-store'});
    if (!await matchingIndex(index, BUILD_ID)) throw new Error('La revisione HTML non è ancora disponibile');
    await cache.put(new URL('index.html', ROOT), index);
    await Promise.all(CORE.slice(1).map(async path => {
      const url = new URL(path, ROOT);
      const response = await fetch(url, {cache: 'no-store'});
      if (!response.ok) throw new Error(`Risorsa mancante: ${path}`);
      await cache.put(url, response);
    }));
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    const currentDocs = await caches.open(DOC_CACHE);
    const olderDocs = names.filter(name => name.startsWith('prontuario-docs-') && name !== DOC_CACHE);
    const previousDocs = olderDocs.at(-1);
    for (const name of olderDocs) {
      const oldDocs = await caches.open(name);
      for (const path of DOCS) {
        const key = new URL(path, ROOT);
        const saved = await oldDocs.match(key);
        if (!saved || !saved.ok) continue;
        const digest = await crypto.subtle.digest('SHA-256', await saved.clone().arrayBuffer());
        const hash = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
        if (hash !== DOC_HASHES[path]) {
          await oldDocs.delete(key);
        } else if (!await currentDocs.match(key)) {
          await currentDocs.put(key, saved);
        }
      }
      if (name !== previousDocs) await caches.delete(name);
    }
    await Promise.all(names.filter(name => name.startsWith(PREFIX) && !name.startsWith('prontuario-docs-') && name !== CORE_CACHE).map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  if (event.data?.type === 'GET_BUILD_ID') event.ports?.[0]?.postMessage({buildId: BUILD_ID});
  if (event.data?.type === 'SKIP_WAITING') event.waitUntil(self.skipWaiting());
});

async function navigate(request) {
  const cache = await caches.open(CORE_CACHE);
  const url = new URL(request.url);
  const requestedBuild = url.searchParams.get('rev');
  try {
    const response = await fetch(request);
    if (response.ok && (!requestedBuild || await matchingIndex(response, requestedBuild))) {
      if (await matchingIndex(response, BUILD_ID)) await cache.put(new URL('index.html', ROOT), response.clone());
      return response;
    }
    if (requestedBuild) return new Response('La nuova revisione non è ancora disponibile. Torna indietro e riprova.', {status: 503, headers: {'Content-Type': 'text/plain; charset=utf-8'}});
  } catch (_) { /* Use the installed revision when disconnected. */ }
  return await cache.match(new URL('index.html', ROOT)) || Response.error();
}

async function attachment(request) {
  const url = new URL(request.url);
  if (url.searchParams.get('network') === '1') return fetch(request);
  const requestedBuild = url.searchParams.get('rev');
  const oldCacheName = `prontuario-docs-${requestedBuild}`;
  const usePrevious = requestedBuild && requestedBuild !== BUILD_ID && (await caches.keys()).includes(oldCacheName);
  const cache = await caches.open(usePrevious ? oldCacheName : DOC_CACHE);
  const key = new URL(url.pathname, ROOT.origin);
  const saved = await cache.match(key);
  if (saved) {
    if (request.method === 'HEAD') return new Response(null, {status: 200, headers: {
      'Content-Type': saved.headers.get('Content-Type') || 'application/octet-stream',
      'Content-Length': saved.headers.get('Content-Length') || String((await saved.clone().arrayBuffer()).byteLength),
      'Accept-Ranges': 'bytes'
    }});
    const range = request.headers.get('Range');
    if (!range) return saved;
    const bytes = await saved.arrayBuffer();
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (!match) return new Response(null, {status: 416, headers: {'Content-Range': `bytes */${bytes.byteLength}`}});
    if (!match[1] && !match[2]) return new Response(null, {status: 416, headers: {'Content-Range': `bytes */${bytes.byteLength}`}});
    const start = match[1] ? Number(match[1]) : Math.max(0, bytes.byteLength - Number(match[2]));
    const end = match[1] && match[2] ? Math.min(Number(match[2]), bytes.byteLength - 1) : bytes.byteLength - 1;
    if (start > end || start >= bytes.byteLength) return new Response(null, {status: 416, headers: {'Content-Range': `bytes */${bytes.byteLength}`}});
    return new Response(bytes.slice(start, end + 1), {status: 206, headers: {
      'Content-Type': saved.headers.get('Content-Type') || 'application/octet-stream',
      'Content-Range': `bytes ${start}-${end}/${bytes.byteLength}`,
      'Content-Length': String(end - start + 1),
      'Accept-Ranges': 'bytes'
    }});
  }
  return fetch(request);
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' && request.method !== 'HEAD') return;
  const url = new URL(request.url);
  const path = relativePath(url);
  if (path === null) return;
  if (DOCS.has(path)) {
    event.respondWith(attachment(request));
  } else if (request.mode === 'navigate' && request.method === 'GET') {
    event.respondWith(navigate(request));
  } else if (CORE.includes(path) && path !== 'index.html') {
    event.respondWith((async () => {
      const cache = await caches.open(CORE_CACHE);
      return await cache.match(new URL(path, ROOT)) || fetch(request);
    })());
  }
});
