// Keep this identifier equal to BUILD_ID in index.html and build_id in version.json.
const BUILD_ID = 'fa3e0abf313501199852ddc4c3ab875ae42435a27e5893d2a0a3d1307e4135d1';
const CORE_CACHE = `prontuario-core-${BUILD_ID}`;
const DOC_CACHE = `prontuario-docs-${BUILD_ID}`;
const PREFIX = 'prontuario-';
const ROOT = new URL('./', self.location.href);
const CORE = ['index.html', 'manifest.webmanifest', 'assets/comune.png', 'assets/polizia.png', 'assets/icon-192.png', 'assets/icon-512.png'];
const DOCS = new Set([
  'allegati/EGAF_Art85_originale.txt',
  'allegati/EGAF_Art86_originale.pdf',
  'allegati/Prontuario_GIT_Turistica_originale.pdf',
  'allegati/Prontuario_Taxi_NCC_Napoli.pdf',
  'allegati/Regolamento_Taxi_NCC_Napoli.pdf',
  'allegati/Tariffario_Taxi_2024.pdf'
]);

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
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith(PREFIX) && name !== CORE_CACHE && name !== DOC_CACHE).map(name => caches.delete(name)));
    await self.clients.claim();
  })());
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
  const cache = await caches.open(DOC_CACHE);
  const url = new URL(request.url);
  if (url.searchParams.has('rev') && url.searchParams.get('rev') !== BUILD_ID) return fetch(request);
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
  if (request.mode === 'navigate' && request.method === 'GET') {
    event.respondWith(navigate(request));
  } else if (DOCS.has(path)) {
    event.respondWith(attachment(request));
  } else if (CORE.includes(path) && path !== 'index.html') {
    event.respondWith((async () => {
      const cache = await caches.open(CORE_CACHE);
      return await cache.match(new URL(path, ROOT)) || fetch(request);
    })());
  }
});
