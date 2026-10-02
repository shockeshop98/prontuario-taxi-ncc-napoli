import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash, webcrypto} from 'node:crypto';
import vm from 'node:vm';

const root = fileURLToPath(new URL('../', import.meta.url));
const origin = 'http://localhost:8000/prontuario-taxi-ncc-napoli/';
const html = await readFile(join(root, 'index.html'), 'utf8');
const sw = await readFile(join(root, 'sw.js'), 'utf8');
const version = JSON.parse(await readFile(join(root, 'version.json'), 'utf8'));
const manifest = JSON.parse(await readFile(join(root, 'manifest.webmanifest'), 'utf8'));
assert.match(html, new RegExp(`BUILD_ID='${version.build_id}'`));
assert.match(sw, new RegExp(`BUILD_ID = '${version.build_id}'`));
const canonicalHtml = html.replace(`BUILD_ID='${version.build_id}'`, "BUILD_ID='__BUILD_ID__'");
const canonicalWorker = sw.replace(`BUILD_ID = '${version.build_id}'`, "BUILD_ID = '__BUILD_ID__'");
const corePaths = [...sw.match(/const CORE = \[(.*?)\];/s)[1].matchAll(/'([^']+)'/g)].map(match => match[1]);
const assetHashes = (await Promise.all(corePaths.filter(path => path.startsWith('assets/')).sort().map(async path => `${path}:${createHash('sha256').update(await readFile(join(root, path))).digest('hex')}\n`))).join('');
assert.equal(createHash('sha256').update(canonicalHtml + '\n' + canonicalWorker + '\n' + await readFile(join(root, 'manifest.webmanifest'), 'utf8') + '\n' + assetHashes).digest('hex'), version.build_id);
assert.equal(version.version, '1.4.2');
assert.ok(html.includes(`<span id="releaseInfo">Versione ${version.version} ·`), 'Versione visibile diversa da version.json');
assert.equal(manifest.display, 'standalone');
assert.equal(manifest.id, '/prontuario-taxi-ncc-napoli/');
for (const icon of manifest.icons) await readFile(join(root, icon.src));
new vm.Script(html.match(/<script>([\s\S]*?)<\/script>/)[1]);
const hashes = JSON.parse(sw.match(/^const DOC_HASHES = (.*);$/m)[1]);
const sourceMeta = JSON.parse(html.match(/^const SOURCE_META = (.*);$/m)[1]);
for (const [path, expected] of Object.entries(hashes)) {
  const bytes = await readFile(join(root, path));
  assert.equal(createHash('sha256').update(bytes).digest('hex'), expected);
  assert.deepEqual(sourceMeta[path], {bytes: bytes.length, sha256: expected});
}
assert.ok(corePaths.includes('assets/polizia-locale-napoli.png'));

const entries = new Map();
const caches = {
  async open(name) {
    if (!entries.has(name)) entries.set(name, new Map());
    const map = entries.get(name);
    const key = request => new URL(request.url || request.href || request, origin).href;
    return {
      async put(request, response) { map.set(key(request), response.clone()); },
      async match(request) { return map.get(key(request))?.clone(); },
      async delete(request) { return map.delete(key(request)); }
    };
  },
  async keys() { return [...entries.keys()]; },
  async delete(name) { return entries.delete(name); }
};
let online = true;
const networkFetch = async request => {
  if (!online) throw Error('offline');
  const path = new URL(request.url || request.href || request, origin).pathname.slice(new URL(origin).pathname.length) || 'index.html';
  try {
    const data = await readFile(join(root, path));
    return new Response(data, {status: 200, headers: {'Content-Type': path.endsWith('.pdf') ? 'application/pdf' : path.endsWith('.html') ? 'text/html; charset=utf-8' : 'application/octet-stream'}});
  } catch { return new Response('missing', {status: 404}); }
};
const listeners = {};
const self = {
  location: {href: `${origin}sw.js`},
  addEventListener(type, callback) { listeners[type] = callback; },
  async skipWaiting() {},
  clients: {async claim() {}}
};
vm.runInNewContext(sw, {self, caches, fetch: networkFetch, URL, Response, crypto: webcrypto, console});
async function lifecycle(type) {
  let promise;
  listeners[type]({waitUntil(value) { promise = value; }});
  await promise;
}
async function routed(path, {mode = 'same-origin', method = 'GET', headers = {}} = {}) {
  let promise;
  listeners.fetch({request: {url: new URL(path, origin).href, mode, method, headers: new Headers(headers)}, respondWith(value) { promise = value; }});
  assert.ok(promise, `route not intercepted: ${path}`);
  return promise;
}
await lifecycle('install');
const doc = 'allegati/Regolamento_Taxi_NCC_Napoli.pdf';
const bytes = await readFile(join(root, doc));
const oldCache = await caches.open('prontuario-docs-old-build');
await oldCache.put(new URL(doc, origin), new Response(bytes, {headers: {'Content-Type': 'application/pdf'}}));
const changedDoc = 'allegati/Tariffario_Taxi_2024.pdf';
await oldCache.put(new URL(changedDoc, origin), new Response('obsolete file', {headers: {'Content-Type': 'application/pdf'}}));
const revisedManual = 'allegati/Prontuario_Taxi_NCC_Napoli.pdf';
await oldCache.put(new URL(revisedManual, origin), new Response('precedente revisione', {headers: {'Content-Type': 'application/pdf'}}));
await lifecycle('activate');
assert.ok((await caches.keys()).includes('prontuario-docs-old-build'));
assert.equal(await oldCache.match(new URL(changedDoc, origin)), undefined);
assert.equal(await oldCache.match(new URL(revisedManual, origin)), undefined);
const cache = await caches.open(`prontuario-docs-${version.build_id}`);
assert.equal((await (await cache.match(new URL(doc, origin))).arrayBuffer()).byteLength, bytes.length);
assert.equal(await cache.match(new URL(changedDoc, origin)), undefined);
assert.equal(await cache.match(new URL(revisedManual, origin)), undefined);
const onlinePDFNavigation = await routed(changedDoc, {mode: 'navigate'});
assert.equal(onlinePDFNavigation.status, 200);
assert.equal(onlinePDFNavigation.headers.get('Content-Type'), 'application/pdf');
const refreshed = await routed(`${doc}?network=1`);
assert.equal(refreshed.status, 200);
online = false;
const offlinePage = await routed('?offline=1', {mode: 'navigate'});
assert.equal(offlinePage.status, 200);
assert.match(await offlinePage.text(), /Cerca una situazione/);

await assert.rejects(routed(`${changedDoc}?rev=${version.build_id}`));
await assert.rejects(routed(`${changedDoc}?rev=${version.build_id}`, {mode: 'navigate'}));
await assert.rejects(routed(`${doc}?network=1`));
const offlinePDFNavigation = await routed(`${doc}?rev=${version.build_id}`, {mode: 'navigate'});
assert.equal(offlinePDFNavigation.status, 200);
assert.equal(offlinePDFNavigation.headers.get('Content-Type'), 'application/pdf');
assert.equal((await offlinePDFNavigation.arrayBuffer()).byteLength, bytes.length);
const range = await routed(`${doc}?rev=${version.build_id}`, {headers: {Range: 'bytes=0-99'}});
assert.equal(range.status, 206);
assert.equal((await range.arrayBuffer()).byteLength, 100);
assert.equal(range.headers.get('Content-Range'), `bytes 0-99/${bytes.length}`);
const suffix = await routed(`${doc}?rev=${version.build_id}`, {headers: {Range: 'bytes=-50'}});
assert.equal((await suffix.arrayBuffer()).byteLength, 50);
const head = await routed(`${doc}?rev=${version.build_id}`, {method: 'HEAD'});
assert.equal(head.headers.get('Content-Length'), String(bytes.length));
const oldPageDoc = await routed(`${doc}?rev=${'0'.repeat(64)}`);
assert.equal(oldPageDoc.status, 200);
assert.equal((await oldPageDoc.arrayBuffer()).byteLength, bytes.length);
const previousPageDoc = await routed(`${doc}?rev=old-build`, {mode: 'navigate'});
assert.equal(previousPageDoc.headers.get('Content-Type'), 'application/pdf');
console.log('PWA: scoped installation, asset hashes, offline navigation, retained documents, network refresh and PDF ranges OK');
