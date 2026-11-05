import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';import {chromium} from 'playwright-core';
const root=path.resolve(import.meta.dirname,'..'),base=process.env.REVIEW_URL||'http://127.0.0.1:8000/',out=process.env.REVIEW_OUT||path.join(root,'revisione/1.8.14');
fs.mkdirSync(out,{recursive:true});
const profile=fs.mkdtempSync(path.join(os.tmpdir(),'prontuario-1814-install-'));
const launch=offline=>chromium.launchPersistentContext(profile,{executablePath:process.env.CHROMIUM_PATH,headless:true,args:['--no-sandbox'],viewport:{width:390,height:844},permissions:['clipboard-read','clipboard-write'],offline,reducedMotion:'reduce'});
let context=await launch(false),page=context.pages()[0];const errors=[],report={localOnly:!base.startsWith('https://'),url:base,profileEphemeral:true,checkedAt:new Date().toISOString(),variants:[],removedSearch:[]};
page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto(base);await page.waitForFunction(()=>navigator.serviceWorker.controller,null,{timeout:60000});
 report.firstInstall=await page.evaluate(async()=>({version:RELEASE,build:BUILD_ID,manifest:document.querySelector('link[rel="manifest"]').href,worker:await activeWorkerBuild(await navigator.serviceWorker.getRegistration()),coreCaches:(await caches.keys()).filter(n=>n.startsWith('prontuario-core-'))}));
 assert.equal(report.firstInstall.version,'1.8.14');assert.equal(report.firstInstall.worker,report.firstInstall.build);assert.equal(report.firstInstall.coreCaches.length,1);
 report.variants=await page.evaluate(async()=>{
  const result=[];
  for(const {item,type}of STATIC_LAYOUT.rows){
   const model=window.prontuarioTerzaDefinition(item,type);if(!model)continue;
   openSanction(item.id,type);
   const section=document.querySelector('[data-terza-code]');if(!section)throw Error('Nuova scheda non renderizzata '+item.code+'/'+type);
   const copy=async expected=>{let actual;const save=navigator.clipboard.writeText;navigator.clipboard.writeText=async value=>{actual=value};try{await copyFormula(findCase(item.id,type),type)}finally{navigator.clipboard.writeText=save}if(actual!==expected)throw Error('Clipboard '+item.code+'/'+type);};
   for(let choice=0;choice<=model.options.length;choice++){
    const radio=section.querySelector(`[name="terza-choice"][value="${choice}"]`);if(radio){radio.checked=true;radio.dispatchEvent(new Event('change',{bubbles:true}));}
    await copy(window.prontuarioTerzaFormula(item,type,choice));
    const checks=[...section.querySelectorAll('[data-terza-act]')];
    for(const check of checks){
     check.checked=true;check.dispatchEvent(new Event('change',{bubbles:true}));
     await copy(window.prontuarioTerzaFormula(item,type,choice,[check.dataset.terzaAct]));
     check.checked=false;check.dispatchEvent(new Event('change',{bubbles:true}));
    }
    const verbale=section.querySelector('[data-terza-verbale]');if(verbale){verbale.checked=true;verbale.dispatchEvent(new Event('change',{bubbles:true}));await copy(window.prontuarioTerzaFormula(item,type,choice,[],true));verbale.checked=false;verbale.dispatchEvent(new Event('change',{bubbles:true}));}
    result.push({code:item.code,type,choice,acts:checks.length});
   }
  }
  return result;
 });
 for(const type of ['Taxi','NCC'])for(const code of ['R16','T01','G15','G28-03','I08','R29','R31','R36','G51']){
  const found=await page.evaluate(({type,code})=>rankedSearch(relevantCards(type),code).map(c=>c.code),{type,code});assert.deepEqual(found,[],code+'/'+type);report.removedSearch.push({code,type,results:found.length});
 }
 for(const [type,code,file]of [['Taxi','G19','g19-mobile-390.png'],['NCC','G44','g44-ncc-mobile-390.png'],['NCC','N10','n10-mobile-390.png'],['NCC','I06','i06-mobile-390.png']]){
  await page.evaluate(({type,code})=>{const row=STATIC_LAYOUT.rows.find(r=>r.type===type&&r.item.code===code);openSanction(row.item.id,type);scrollTo(0,0)},{type,code});await page.screenshot({path:path.join(out,file),fullPage:true});
 }
 await page.evaluate(()=>openSanction('posref','Taxi'));await page.locator('#posValue').fill('50');assert.match(await page.locator('#posResult').innerText(),/32,00/);
 await page.locator('#copyFormula').click();const actual=await page.evaluate(()=>navigator.clipboard.readText());assert.match(actual,/30 \+ 4%/);report.realClipboard=true;
 for(const index of [3,16]){
  await page.evaluate(()=>{showView('sources');renderSources()});await page.locator(`[data-save-source="${index}"]`).click();
  await page.waitForFunction(i=>document.querySelector(`[data-source-state="${i}"]`).textContent.includes('Salvato nella PWA'),index,{timeout:60000});
 }
 await context.close();context=await launch(true);page=context.pages()[0];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base);await page.waitForSelector('#roadSearch');
 report.offlineRestart=await page.evaluate(async()=>{
  const r=await fetch(sourceURL(3)),bytes=await r.arrayBuffer(),sha=[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(n=>n.toString(16).padStart(2,'0')).join('');
  const summary=await fetch(sourceURL(16));openSanction('nccbusemployment','NCC');
  return {version:RELEASE,build:BUILD_ID,pdfStatus:r.status,pdfBytes:bytes.byteLength,pdfSHA256:sha,summaryStatus:summary.status,summaryText:await summary.text(),code:document.querySelector('[data-terza-code]').dataset.terzaCode,logos:[...document.querySelectorAll('.brandLogos img')].every(i=>i.complete&&i.naturalWidth>0)};
 });
 assert.equal(report.offlineRestart.version,'1.8.14');assert.equal(report.offlineRestart.pdfStatus,200);assert.equal(report.offlineRestart.summaryStatus,200);assert.match(report.offlineRestart.summaryText,/13-bis/);assert.equal(report.offlineRestart.code,'N10');assert.equal(report.offlineRestart.logos,true);
 assert.equal(report.offlineRestart.pdfSHA256,createHash('sha256').update(fs.readFileSync(path.join(root,'allegati/Prontuario_Taxi_NCC_Napoli.pdf'))).digest('hex'));
 delete report.offlineRestart.summaryText;await page.screenshot({path:path.join(out,'riapertura-offline-390.png'),fullPage:true});
 assert.deepEqual(errors,[]);report.jsErrors=errors;
 fs.writeFileSync(path.join(out,'varianti-installazione-offline.json'),JSON.stringify(report,null,2)+'\n');console.log('Varianti effettive DOM e clipboard:',report.variants.length,'; ricerche rimosse:',report.removedSearch.length,'; prima installazione e riapertura dopo chiusura Chromium offline OK.');
}finally{await context.close();}
