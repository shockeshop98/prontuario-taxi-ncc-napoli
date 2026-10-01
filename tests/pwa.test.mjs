import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import vm from 'node:vm';

const root = fileURLToPath(new URL('../', import.meta.url));
const origin = 'http://localhost:8000/';
const html = await readFile(join(root, 'index.html'), 'utf8');
const sw = await readFile(join(root, 'sw.js'), 'utf8');
const version = JSON.parse(await readFile(join(root, 'version.json'), 'utf8'));
const manifest = JSON.parse(await readFile(join(root, 'manifest.webmanifest'), 'utf8'));
assert.match(html, new RegExp(`BUILD_ID='${version.build_id}'`));
assert.match(sw, new RegExp(`BUILD_ID = '${version.build_id}'`));
const canonicalHtml = html.replace(`BUILD_ID='${version.build_id}'`, "BUILD_ID='__BUILD_ID__'");
const canonicalWorker = sw.replace(`BUILD_ID = '${version.build_id}'`, "BUILD_ID = '__BUILD_ID__'");
assert.equal(createHash('sha256').update(canonicalHtml + '\n' + canonicalWorker + '\n' + await readFile(join(root, 'manifest.webmanifest'), 'utf8')).digest('hex'), version.build_id);
assert.equal(version.version, '1.1.0');
assert.equal(manifest.display, 'standalone');
for (const icon of manifest.icons) await readFile(join(root, icon.src));
new vm.Script(html.match(/<script>([\s\S]*?)<\/script>/)[1]);

const entries = new Map();
const caches = {
  async open(name) {
    if (!entries.has(name)) entries.set(name, new Map());
    const map = entries.get(name);
    const key = request => new URL(request.url || request.href || request, origin).href;
    return {
      async put(request, response) { map.set(key(request), response.clone()); },
      async match(request) { return map.get(key(request))?.clone(); }
    };
  },
  async keys() { return [...entries.keys()]; },
  async delete(name) { return entries.delete(name); }
};
let online = true;
const networkFetch = async request => {
  if (!online) throw Error('offline');
  const path = new URL(request.url || request.href || request, origin).pathname.slice(1) || 'index.html';
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
vm.runInNewContext(sw, {self, caches, fetch: networkFetch, URL, Response, console});
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
await lifecycle('activate');
online = false;
const offlinePage = await routed('?offline=1', {mode: 'navigate'});
assert.equal(offlinePage.status, 200);
assert.match(await offlinePage.text(), /Cerca una situazione/);

const doc = 'allegati/Regolamento_Taxi_NCC_Napoli.pdf';
await assert.rejects(routed(`${doc}?rev=${version.build_id}`));
const cache = await caches.open(`prontuario-docs-${version.build_id}`);
const bytes = await readFile(join(root, doc));
await cache.put(new URL(doc, origin), new Response(bytes, {headers: {'Content-Type': 'application/pdf'}}));
const range = await routed(`${doc}?rev=${version.build_id}`, {headers: {Range: 'bytes=0-99'}});
assert.equal(range.status, 206);
assert.equal((await range.arrayBuffer()).byteLength, 100);
assert.equal(range.headers.get('Content-Range'), `bytes 0-99/${bytes.length}`);
const suffix = await routed(`${doc}?rev=${version.build_id}`, {headers: {Range: 'bytes=-50'}});
assert.equal((await suffix.arrayBuffer()).byteLength, 50);
const head = await routed(`${doc}?rev=${version.build_id}`, {method: 'HEAD'});
assert.equal(head.headers.get('Content-Length'), String(bytes.length));
await assert.rejects(routed(`${doc}?rev=${'0'.repeat(64)}`));
console.log('PWA: version, installation, offline navigation and saved PDF ranges OK');
