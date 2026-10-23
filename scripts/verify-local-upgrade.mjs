// Serve su loopback la fotografia della precedente revisione locale 1.8.12.
// Verifica la migrazione reale alla 1.8.13 senza modificare Git o il sito pubblico.
import fs from 'node:fs';import http from 'node:http';
import {resolve,extname} from 'node:path';
import {createHash} from 'node:crypto';import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';
const root=resolve(import.meta.dirname,'..');
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const baseline=JSON.parse(fs.readFileSync(resolve(root,'revisione/1.8.13/stato-iniziale.json'))).baseline;
const original=name=>fs.readFileSync(resolve(baseline,name));
let state='before';
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.css':'text/css','.webmanifest':'application/manifest+json','.pdf':'application/pdf','.png':'image/png','.ico':'image/x-icon','.txt':'text/plain; charset=utf-8'};
const server=http.createServer((req,res)=>{
 const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname),dir=state==='before'?baseline:root,file=resolve(dir,'.'+(path==='/'?'/index.html':path));
 if(!file.startsWith(dir+'/')||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return;}
 const bytes=fs.readFileSync(file);res.writeHead(200,{'Content-Type':mime[extname(file)]||'application/octet-stream','Content-Length':bytes.length,'Cache-Control':'no-store'});res.end(bytes);
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const url=`http://127.0.0.1:${server.address().port}/`,release=JSON.parse(fs.readFileSync(resolve(root,'version.json')));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true,args:['--no-sandbox']});
const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'}),page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(e.message));const report={checkedAt:new Date().toISOString(),baselineLocalVersion:'1.8.12',baselineDirectory:baseline,localOnly:true};
async function save(index){await page.evaluate(()=>{showView('sources');renderSources()});await page.locator(`[data-save-source="${index}"]`).click();await page.waitForFunction(i=>{const s=document.querySelector(`[data-source-state="${i}"]`).textContent;return s.includes('Salvato nella PWA')||s.includes('Salvataggio non riuscito');},index,{timeout:60000});assert.match(await page.locator(`[data-source-state="${index}"]`).innerText(),/Salvato nella PWA/,`Salvataggio fonte ${index}`);}
try{
 await page.goto(url);await page.waitForFunction(()=>navigator.serviceWorker.controller);
 report.before=await page.evaluate(()=>({version:RELEASE,build:BUILD_ID,pdf:DATA.prontuario.version}));
 assert.equal(report.before.version,'1.8.12');assert.equal(report.before.pdf,'7.14');
 await save(0);await save(3);
 await context.setOffline(true);await page.reload();await page.waitForSelector('#roadSearch');assert.equal(await page.evaluate(()=>RELEASE),'1.8.12');
 report.before.pdfSHA256=await page.evaluate(async()=>{const b=await(await fetch(sourceURL(3))).arrayBuffer();return [...new Uint8Array(await crypto.subtle.digest('SHA-256',b))].map(x=>x.toString(16).padStart(2,'0')).join('')});
 assert.equal(report.before.pdfSHA256,sha(original('allegati/Prontuario_Taxi_NCC_Napoli.pdf')));
 state='after';await context.setOffline(false);await page.evaluate(()=>checkForUpdates(true));
 await page.locator('#loadUpdate').waitFor({state:'visible',timeout:45000});await page.locator('#loadUpdate').click();
 await page.waitForFunction(expected=>BUILD_ID===expected,release.build_id,{timeout:60000});
 await page.waitForFunction(async()=>await activeWorkerBuild(await navigator.serviceWorker.getRegistration())===BUILD_ID,null,{timeout:60000});
 report.after=await page.evaluate(async()=>({version:RELEASE,build:BUILD_ID,pdf:DATA.prontuario.version,originalRetained:await sourceCached(0),oldManualDiscarded:!await sourceCached(3)}));
 assert.equal(report.after.version,'1.8.13');assert.equal(report.after.pdf,'7.15');assert.equal(report.after.originalRetained,true);assert.equal(report.after.oldManualDiscarded,true);
 await save(3);await save(11);await save(12);await save(13);await save(14);await save(15);await context.setOffline(true);await page.reload();await page.waitForSelector('#roadSearch');
 report.after.offline=await page.evaluate(async()=>{
  openSanction('fila','Taxi');
  const bytes=await(await fetch(sourceURL(3))).arrayBuffer();
  return {version:RELEASE,build:BUILD_ID,code:document.getElementById('caseTitle').textContent,pdfSHA256:[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(x=>x.toString(16).padStart(2,'0')).join(''),moduleCached:typeof window.prontuarioRevisionFormula==='function',secondModuleCached:typeof window.prontuarioSecondFormula==='function',removedAbsent:!DATA.catalog.some(i=>i.code==='G51')};
 });
 assert.equal(report.after.offline.moduleCached,true);assert.equal(report.after.offline.secondModuleCached,true);assert.equal(report.after.offline.removedAbsent,true);
 report.after.offline.secondCard=await page.evaluate(()=>{openSanction('disco','Taxi');return document.querySelector('[data-seconda-code]').dataset.secondaCode});assert.equal(report.after.offline.secondCard,'G46');report.after.offline.heat=await page.evaluate(()=>{openSanction('equinacaldo','Trazione animale');return document.getElementById('formulaText').textContent});assert.match(report.after.offline.heat,/ORDSI\/2025\/0000571/);report.after.offline.equini835=await page.evaluate(()=>{openSanction('equinascarpeprotettive','Trazione animale');return document.getElementById('formulaText').textContent});assert.match(report.after.offline.equini835,/senza scarpe protettive/);assert.match(report.after.offline.code,/ordine di fila nel posteggio/);
 assert.equal(report.after.offline.pdfSHA256,sha(fs.readFileSync(resolve(root,'allegati/Prontuario_Taxi_NCC_Napoli.pdf'))));
 report.after.offline.newDocument=await page.evaluate(async()=>{const r=await fetch(sourceURL(11));return {status:r.status,bytes:(await r.arrayBuffer()).byteLength}});assert.equal(report.after.offline.newDocument.status,200);assert.ok(report.after.offline.newDocument.bytes>10000);
 assert.deepEqual(errors,[]);report.jsErrors=errors;
 fs.writeFileSync(resolve(root,'revisione/1.8.13/aggiornamento-1.8.12-1.8.13.json'),JSON.stringify(report,null,2)+'\n');
 console.log('Vera PWA locale 1.8.12/PDF7.14 offline -> aggiornamento esplicito a 1.8.13/7.15: cache, fonti e SHA-256 PDF offline OK.');
}finally{await context.close();await browser.close();await new Promise(r=>server.close(r));}
