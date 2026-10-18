// Serve esclusivamente su loopback e verifica la vera cache 1.8.8 -> revisione locale.
// Legge il commit di partenza; non modifica Git e non contatta il sito pubblico.
import fs from 'node:fs';import http from 'node:http';import os from 'node:os';
import {resolve,dirname,extname} from 'node:path';import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';
const root=resolve(import.meta.dirname,'..'),commit='34694b4e1859c3a384849fa0870c87774b98db56';
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const baseline=fs.mkdtempSync(resolve(os.tmpdir(),'prontuario-188-upgrade-'));
const original=name=>execFileSync('git',['show',`${commit}:${name}`],{cwd:root,maxBuffer:20*1024*1024});
const worker=original('sw.js').toString(),core=[...worker.match(/const CORE = \[(.*?)\];/s)[1].matchAll(/'([^']+)'/g)].map(m=>m[1]);
for(const name of [...core,'sw.js','version.json','allegati/Regolamento_Taxi_NCC_Napoli.pdf','allegati/Prontuario_Taxi_NCC_Napoli.pdf']){const p=resolve(baseline,name);fs.mkdirSync(dirname(p),{recursive:true});fs.writeFileSync(p,original(name));}
let state='before';
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.css':'text/css','.webmanifest':'application/manifest+json','.pdf':'application/pdf','.png':'image/png','.ico':'image/x-icon'};
const server=http.createServer((req,res)=>{
 const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname),dir=state==='before'?baseline:root,file=resolve(dir,'.'+(path==='/'?'/index.html':path));
 if(!file.startsWith(dir+'/')||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return;}
 const bytes=fs.readFileSync(file);res.writeHead(200,{'Content-Type':mime[extname(file)]||'application/octet-stream','Content-Length':bytes.length,'Cache-Control':'no-store'});res.end(bytes);
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const url=`http://127.0.0.1:${server.address().port}/`,release=JSON.parse(fs.readFileSync(resolve(root,'version.json')));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true,args:['--no-sandbox']});
const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'}),page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(e.message));const report={checkedAt:new Date().toISOString(),baselineCommit:commit,localOnly:true};
async function save(index){await page.evaluate(()=>{showView('sources');renderSources()});await page.locator(`[data-save-source="${index}"]`).click();await page.waitForFunction(i=>document.querySelector(`[data-source-state="${i}"]`).textContent.includes('Salvato nella PWA'),index,{timeout:60000});}
try{
 await page.goto(url);await page.waitForFunction(()=>navigator.serviceWorker.controller);
 report.before=await page.evaluate(()=>({version:RELEASE,build:BUILD_ID,pdf:DATA.prontuario.version}));
 assert.equal(report.before.version,'1.8.8');assert.equal(report.before.pdf,'7.10');
 await save(0);await save(3);
 await context.setOffline(true);await page.reload();await page.waitForSelector('#roadSearch');assert.equal(await page.evaluate(()=>RELEASE),'1.8.8');
 report.before.pdfSHA256=await page.evaluate(async()=>{const b=await(await fetch(sourceURL(3))).arrayBuffer();return [...new Uint8Array(await crypto.subtle.digest('SHA-256',b))].map(x=>x.toString(16).padStart(2,'0')).join('')});
 assert.equal(report.before.pdfSHA256,sha(original('allegati/Prontuario_Taxi_NCC_Napoli.pdf')));
 state='after';await context.setOffline(false);await page.evaluate(()=>checkForUpdates(true));
 await page.locator('#loadUpdate').waitFor({state:'visible',timeout:45000});await page.locator('#loadUpdate').click();
 await page.waitForFunction(expected=>BUILD_ID===expected,release.build_id,{timeout:60000});
 await page.waitForFunction(async()=>await activeWorkerBuild(await navigator.serviceWorker.getRegistration())===BUILD_ID,null,{timeout:60000});
 report.after=await page.evaluate(async()=>({version:RELEASE,build:BUILD_ID,pdf:DATA.prontuario.version,originalRetained:await sourceCached(0),oldManualDiscarded:!await sourceCached(3)}));
 assert.equal(report.after.version,'1.8.9');assert.equal(report.after.pdf,'7.11');assert.equal(report.after.originalRetained,true);assert.equal(report.after.oldManualDiscarded,true);
 await save(3);await context.setOffline(true);await page.reload();await page.waitForSelector('#roadSearch');
 report.after.offline=await page.evaluate(async()=>{
  openSanction('fila','Taxi');
  const bytes=await(await fetch(sourceURL(3))).arrayBuffer();
  return {version:RELEASE,build:BUILD_ID,code:document.getElementById('caseTitle').textContent,pdfSHA256:[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(x=>x.toString(16).padStart(2,'0')).join(''),moduleCached:typeof window.prontuarioRevisionFormula==='function'};
 });
 assert.equal(report.after.offline.moduleCached,true);assert.match(report.after.offline.code,/ordine di fila nel posteggio/);
 assert.equal(report.after.offline.pdfSHA256,sha(fs.readFileSync(resolve(root,'allegati/Prontuario_Taxi_NCC_Napoli.pdf'))));
 assert.deepEqual(errors,[]);report.jsErrors=errors;
 fs.writeFileSync(resolve(root,'revisione/1.8.9/aggiornamento-1.8.8-1.8.9.json'),JSON.stringify(report,null,2)+'\n');
 console.log('Vera PWA 1.8.8/PDF7.10 offline -> aggiornamento esplicito a 1.8.9/7.11: cache, fonti e SHA-256 PDF offline OK.');
}finally{await context.close();await browser.close();await new Promise(r=>server.close(r));}
