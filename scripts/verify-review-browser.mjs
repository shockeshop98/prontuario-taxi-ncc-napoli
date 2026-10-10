// Avviare prima python3 -m http.server 8000 --bind 127.0.0.1.
// Usa un profilo browser effimero: nessuna cache personale viene modificata.
import {chromium} from 'playwright-core';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const base=process.env.REVIEW_URL||'http://127.0.0.1:8000/';
const out=new URL('../revisione/1.8.6/',import.meta.url);
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true});
const context=await browser.newContext({permissions:['clipboard-read','clipboard-write'],reducedMotion:'reduce'});
const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
const report={version:'1.8.6',date:'2026-10-10',viewport:[],search:[],cache:{}};
try{
 await page.route('**/__seed',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><title>Cache di prova</title>'}));
 await page.goto(base+'__seed');
 await page.evaluate(async()=>{const c=await caches.open('prontuario-docs-revisione-precedente');
  const reg=new URL('allegati/Regolamento_Taxi_NCC_Napoli.pdf',location.href);await c.put(reg,await fetch(reg));
  await c.put(new URL('allegati/Prontuario_Taxi_NCC_Napoli.pdf',location.href),new Response('PDF precedente con hash diverso',{headers:{'Content-Type':'application/pdf'}}));
 });
 await page.goto(base);await page.waitForFunction(()=>navigator.serviceWorker.controller);
 await page.evaluate(async()=>{await navigator.serviceWorker.ready;await refreshSourceStates()});
 report.cache.migration=await page.evaluate(async()=>({reg:await sourceCached(0),manual:await sourceCached(3),worker:await activeWorkerBuild(await navigator.serviceWorker.getRegistration()),build:BUILD_ID,oldManual:!!await(await caches.open('prontuario-docs-revisione-precedente')).match(new URL(DATA.sources[3].url,location.href))}));
 assert.equal(report.cache.migration.reg,true);assert.equal(report.cache.migration.manual,false);assert.equal(report.cache.migration.oldManual,false);assert.equal(report.cache.migration.worker,report.cache.migration.build);
 const rows=await page.evaluate(()=>STATIC_LAYOUT.rows.map(({item,type})=>({id:item.id,code:item.code,type,collective:item.kind==='collective-reference'})));
 assert.equal(rows.length,187);
 for(const [width,height] of [[320,740],[360,800],[390,844],[430,932],[740,320],[800,360],[844,390],[932,430]]){
  await page.setViewportSize({width,height});
  const results=await page.evaluate(async rows=>{
   const failures=[];let copies=0;
   for(const row of rows){
    if(!openSanction(row.id,row.type))throw Error('Apertura '+row.id);
    const office=document.querySelector('.officeInfo');if(office)office.open=true;
    const overflow=document.documentElement.scrollWidth>innerWidth+1;
    const outside=[...document.querySelectorAll('#sanctionScreen table,#sanctionScreen .officeInfo')].some(e=>{const r=e.getBoundingClientRect();return r.left< -1||r.right>innerWidth+1});
    if(overflow||outside)failures.push(row.code+'/'+row.type);
    if(!row.collective){
     const f=document.getElementById('formulaText');const copy=window.prontuarioCatalogCopyText(f);
     if(/cinque giorni per le difese|diffida alla prima|è stato|è stata|Corso Pubblico/i.test(copy))throw Error('Copia impropria '+row.code);
     const saved=navigator.clipboard.writeText.bind(navigator.clipboard);let actual;
     navigator.clipboard.writeText=async text=>{actual=text};await copyFormula(findCase(row.id),row.type);navigator.clipboard.writeText=saved;
     if(actual!==copy)throw Error('Copia divergente '+row.code);
     copies++;
    }
    if(casePDFPage(findCase(row.id),row.type)!==STATIC_LAYOUT.pages[row.id+'/'+row.type])throw Error('PDF '+row.code);
   }return {failures,copies,cards:rows.length};
  },rows);
  assert.deepEqual(results.failures,[],`Overflow ${width}x${height}`);report.viewport.push({width,height,...results});console.log('Mobile',width,height,results.cards,'schede');
 }
 await page.setViewportSize({width:390,height:844});
 for(const [query,type,code] of [['G24','Taxi','G24'],['fila passeggeri','Taxi','G24'],['ricevuta predeterminata','Taxi','G28-02'],['I03','NCC','N04'],['I07','Taxi','G07-01'],['taxi sharing','Taxi','TC01']]){
  await page.evaluate(type=>{setRoadType(type);showView('help')},type);await page.locator('#roadSearch').fill(query);await page.locator('#roadSearch').press('Enter');
  const codes=await page.locator('#roadResults .codeTag').allTextContents();assert.ok(codes.includes(code),query+': '+codes);report.search.push({query,type,expected:code});
 }
 await page.evaluate(()=>openSanction('turno','Taxi'));await page.locator('.officeInfo summary').click();
 await page.locator('#copyFormula').click();const copied=await page.evaluate(()=>navigator.clipboard.readText());
 assert.match(copied,/Stato della trasmissione/);assert.doesNotMatch(copied,/cinque giorni per le difese|diffida alla prima|è stata/);
 report.clipboard={realClipboard:true,example:copied};
 await page.locator('#toast').waitFor({state:'hidden'});
 await page.locator('.staticAccessories').screenshot({path:new URL('riquadro-mobile.png',out).pathname});
 await page.evaluate(()=>openSanction('fila','Taxi'));await page.screenshot({path:new URL('g24-mobile.png',out).pathname,fullPage:true});
 await page.evaluate(()=>openSanction('ricevuta-predeterminata','Taxi'));await page.screenshot({path:new URL('g28-02-mobile.png',out).pathname,fullPage:true});
 await page.evaluate(()=>{showView('sources');renderSources()});await page.locator('[data-save-source="3"]').click();
 await page.waitForFunction(()=>document.querySelector('[data-source-state="3"]').textContent.includes('Salvato nella PWA'),{},{timeout:60000});
 assert.equal(await page.evaluate(()=>sourceCached(3)),true);report.cache.savedManual=true;
 await context.setOffline(true);await page.reload();await page.waitForSelector('#roadSearch');
 await page.evaluate(()=>openSanction('fila','Taxi'));assert.match(await page.locator('#sanctionScreen').innerText(),/fila dei passeggeri/);
 console.log('Offline state',await page.evaluate(async()=>({controller:navigator.serviceWorker.controller?.scriptURL,build:BUILD_ID,url:sourceURL(3).href,saved:await sourceCached(3),caches:await caches.keys()})));
 const pdf=await page.evaluate(async()=>{const r=await fetch(sourceURL(3));const b=await r.arrayBuffer();return {status:r.status,mime:r.headers.get('Content-Type'),bytes:b.byteLength,expected:SOURCE_META[DATA.sources[3].url].bytes};});
 assert.equal(pdf.status,200);assert.equal(pdf.bytes,pdf.expected);assert.match(pdf.mime,/application\/pdf/);report.cache.offlinePDF=pdf;
 const range=await page.evaluate(async()=>{const r=await fetch(sourceURL(3),{headers:{Range:'bytes=0-99'}});return {status:r.status,length:(await r.arrayBuffer()).byteLength};});assert.deepEqual(range,{status:206,length:100});report.cache.offlineRange=range;
 const navigation=context.waitForEvent('response',{predicate:r=>r.url().includes('/Prontuario_Taxi_NCC_Napoli.pdf')&&r.request().isNavigationRequest(),timeout:15000});
 const popupPromise=page.waitForEvent('popup');await page.locator('#casePDF').click();
 const pdfNavigation=await navigation,popup=await popupPromise;
 assert.equal(pdfNavigation.status(),200);assert.equal(pdfNavigation.fromServiceWorker(),true);
 report.cache.offlineOpen={status:pdfNavigation.status(),fromServiceWorker:pdfNavigation.fromServiceWorker(),url:pdfNavigation.url()};await popup.close();
 await page.evaluate(()=>{setRoadType('Taxi');showView('help')});await page.locator('#roadSearch').fill('ricevuta predeterminata');await page.locator('#roadSearch').press('Enter');assert.ok((await page.locator('#roadResults .codeTag').allTextContents()).includes('G28-02'));report.cache.offlineSearch=true;
 assert.deepEqual(errors,[]);report.jsErrors=errors;fs.writeFileSync(new URL('browser-check.json',out),JSON.stringify(report,null,2)+'\n');console.log('Copia, ricerca, migrazione cache, PDF e apertura offline OK');
}finally{await browser.close()}
