// prepare prima del deploy, verify dopo, mantenendo RELEASE_VERIFY_DIR.
// Il profilo effimero conserva la vera installazione pubblica 1.8.14.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {chromium} from 'playwright-core';
import {getDocument} from 'pdfjs-dist/legacy/build/pdf.mjs';
const root=resolve(import.meta.dirname,'..'),mode=process.argv[2],dir=process.env.RELEASE_VERIFY_DIR;
assert.ok(['prepare','verify'].includes(mode)&&dir&&fs.statSync(dir).isDirectory());
const base='https://shockeshop98.github.io/prontuario-taxi-ncc-napoli/';
const version=JSON.parse(fs.readFileSync(resolve(root,'version.json'),'utf8'));
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const norm=s=>s.normalize('NFKC').replace(/[’‘]/g,"'").replace(/\s+/g,'').replace(/\u00ad/g,'').toLowerCase();
const options={executablePath:process.env.CHROMIUM_PATH,headless:true,viewport:{width:390,height:844},permissions:['clipboard-read','clipboard-write'],reducedMotion:'reduce'};
const context=await chromium.launchPersistentContext(resolve(dir,'browser-profile'),options);
const page=await context.newPage();for(const p of context.pages())if(p!==page)await p.close();
const errors=[];page.on('pageerror',e=>errors.push(e.message));
async function save(p,index){
 await p.evaluate(()=>{showView('sources');renderSources()});await p.locator(`[data-save-source="${index}"]`).click();
 await p.waitForFunction(i=>/Salvato nella PWA|Salvataggio non riuscito/.test(document.querySelector(`[data-source-state="${i}"]`).textContent),index,{timeout:75000});
 assert.match(await p.locator(`[data-source-state="${index}"]`).innerText(),/Salvato nella PWA/,'Fonte '+index);
 assert.equal(await p.evaluate(i=>sourceCached(i),index),true);
}
async function offlinePDF(p){
 const result=await p.evaluate(async()=>{const r=await fetch(sourceURL(3)),bytes=await r.arrayBuffer();return {status:r.status,sha256:[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(x=>x.toString(16).padStart(2,'0')).join('')};});
 assert.equal(result.status,200);assert.equal(result.sha256,sha(fs.readFileSync(resolve(root,'allegati/Prontuario_Taxi_NCC_Napoli.pdf'))));return result;
}
async function offlineDocuments(p){
 const sources=JSON.parse(fs.readFileSync(resolve(root,'index.html'),'utf8').match(/^const DATA=(.*);$/m)[1]).sources;
 const docs=await p.evaluate(async()=>{const result=[];for(const index of [3,17,18]){const r=await fetch(sourceURL(index)),bytes=await r.arrayBuffer();result.push({index,status:r.status,sha256:[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(x=>x.toString(16).padStart(2,'0')).join('')});}return result;});
 for(const doc of docs){assert.equal(doc.status,200);assert.equal(doc.sha256,sha(fs.readFileSync(resolve(root,sources[doc.index].url))));}return docs;
}
let report;
try{
 if(mode==='prepare'){
  await page.goto(base,{waitUntil:'networkidle'});await page.waitForFunction(()=>navigator.serviceWorker.controller);
  const before=await page.evaluate(async()=>({release:RELEASE,build:BUILD_ID,worker:await activeWorkerBuild(await navigator.serviceWorker.getRegistration()),pdfVersion:DATA.prontuario.version,pdfPages:DATA.sources[3].pages.length}));
  assert.equal(before.release,'1.8.14');assert.equal(before.build,before.worker);
  for(let i=0;i<17;i++){console.log('Prepara allegato',i);if(!await page.evaluate(n=>sourceCached(n),i))await save(page,i);}
  before.pdfSHA256=await page.evaluate(async()=>{const b=await(await fetch(sourceURL(3))).arrayBuffer();return [...new Uint8Array(await crypto.subtle.digest('SHA-256',b))].map(n=>n.toString(16).padStart(2,'0')).join('')});
  before.savedSources=await page.evaluate(async()=>{const rows=[];for(let i=0;i<DATA.sources.length;i++){const bytes=await(await fetch(sourceURL(i))).arrayBuffer();rows.push({index:i,path:DATA.sources[i].url,cached:await sourceCached(i),sha256:[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(n=>n.toString(16).padStart(2,'0')).join('')});}return rows;});assert.ok(before.savedSources.every(s=>s.cached));
  assert.equal(before.pdfVersion,'7.16');assert.equal(before.pdfPages,193);assert.equal(before.pdfSHA256,'1cc65c8dab3193109c07d9fe9043db702709bd757f7e6b1c9b2274973432fc79');
  await context.setOffline(true);await page.reload();assert.equal(await page.evaluate(()=>BUILD_ID),before.build);
  before.saved=await page.evaluate(async()=>({reg:await sourceCached(0),provenance:await sourceCached(2),pdf:await sourceCached(3)}));
  assert.deepEqual(before.saved,{reg:true,provenance:true,pdf:true});
  fs.writeFileSync(resolve(dir,'before.json'),JSON.stringify(before,null,2)+'\n');console.log('PWA precedente preparata',before);
 }else{
  const before=JSON.parse(fs.readFileSync(resolve(dir,'before.json'),'utf8'));
  await context.setOffline(true);await page.goto(base);await page.waitForSelector('#roadSearch');
  const installed=await page.evaluate(()=>BUILD_ID);
  if(installed===before.build){
   await context.setOffline(false);await page.evaluate(()=>checkForUpdates(true));await page.locator('#loadUpdate').waitFor({state:'visible',timeout:60000});await page.locator('#loadUpdate').click();
   await page.waitForFunction(build=>BUILD_ID===build,version.build_id,{timeout:60000});
   await page.waitForFunction(()=>document.getElementById('offlineStatus').textContent.includes('pront'),null,{timeout:60000});
   fs.writeFileSync(resolve(dir,'upgrade-checkpoint.json'),JSON.stringify({from:before.build,to:version.build_id,checkedAt:new Date().toISOString()})+'\n');
  }else{
   assert.equal(installed,version.build_id);const checkpoint=JSON.parse(fs.readFileSync(resolve(dir,'upgrade-checkpoint.json')));
   assert.equal(checkpoint.from,before.build);assert.equal(checkpoint.to,version.build_id);await context.setOffline(false);
  }
  report={localOnly:false,url:base,checkedAt:new Date().toISOString(),before,expected:version};
  report.current=await page.evaluate(async()=>({release:RELEASE,build:BUILD_ID,worker:await activeWorkerBuild(await navigator.serviceWorker.getRegistration()),pdfVersion:DATA.prontuario.version,pdfPages:DATA.sources[3].pages.length,regSaved:await sourceCached(0),manualSaved:await sourceCached(3),removedSourceCached:await Promise.all((await caches.keys()).filter(n=>n.startsWith('prontuario-docs-')).map(async n=>!!await(await caches.open(n)).match(new URL('allegati/EGAF_Art86_originale.pdf',location.href))))}));
  assert.equal(report.current.release,'1.8.15');assert.equal(report.current.build,version.build_id);assert.equal(report.current.worker,version.build_id);
  assert.equal(report.current.pdfVersion,'7.17');assert.equal(report.current.pdfPages,193);assert.equal(report.current.regSaved,true);
  report.retainedSources=await page.evaluate(async previous=>{const result=[];for(const source of previous.filter(s=>s.index!==3)){const cached=await sourceCached(source.index);if(!cached)throw Error('Allegato invariato perso '+source.path);const bytes=await(await fetch(sourceURL(source.index))).arrayBuffer();const hash=[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(n=>n.toString(16).padStart(2,'0')).join('');if(hash!==source.sha256)throw Error('Hash allegato '+source.path);result.push({path:source.path,cached,sha256:hash});}return result;},before.savedSources);assert.equal(report.retainedSources.length,16);assert.ok(report.current.removedSourceCached.every(v=>!v));
  const checkpoint=JSON.parse(fs.readFileSync(resolve(dir,'upgrade-checkpoint.json')));report.migration=checkpoint.migration||report.current;assert.equal(report.migration.manualSaved,false);checkpoint.migration=report.migration;fs.writeFileSync(resolve(dir,'upgrade-checkpoint.json'),JSON.stringify(checkpoint,null,2)+'\n');
  // La richiesta HTTP evita di confondere cache browser e contenuto pubblicato.
  const files=JSON.parse(fs.readFileSync(resolve(root,'pages-files.json'),'utf8'));
  report.publicFiles=[];let pdfBytes;
  for(const path of files){
   const r=await context.request.get(new URL(path,base).href,{headers:{'Cache-Control':'no-cache'}});assert.equal(r.status(),200,path);
   const bytes=await r.body();assert.equal(sha(bytes),sha(fs.readFileSync(resolve(root,path))),path);report.publicFiles.push({path,sha256:sha(bytes),bytes:bytes.length});
   if(path==='allegati/Prontuario_Taxi_NCC_Napoli.pdf')pdfBytes=bytes;
  }
  fs.writeFileSync(resolve(dir,'Prontuario_pubblico_7.17.pdf'),pdfBytes);
  const pdf=await getDocument({data:new Uint8Array(pdfBytes),standardFontDataUrl:resolve(root,'node_modules/pdfjs-dist/standard_fonts')+'/'}).promise;
  assert.equal(pdf.numPages,193);assert.match((await pdf.getMetadata()).info.Title,/7\.17/);
  const texts=[];for(let n=1;n<=pdf.numPages;n++){texts[n]=(await(await pdf.getPage(n)).getTextContent()).items.map(i=>i.str).join(' ');assert.doesNotMatch(texts[n],/\b(?:c\.|comma)\s*\d+(?:-(?:bis|ter|quater))?\s+([a-df-z])\b(?!-)/,'Lettera senza let. PDF '+n);assert.doesNotMatch(texts[n],/let\.\s*let\./);}
  const data=await page.evaluate(()=>DATA);let pdfLinks=0;
  for(const index of data.manualIndex){const links=await(await pdf.getPage(index.page)).getAnnotations();assert.equal(links.length,index.ids.length);for(let n=0;n<links.length;n++){const type=index.type==='equina'?'Trazione animale':index.type==='ncc'?'NCC':'Taxi';assert.equal((await pdf.getPageIndex(links[n].dest[0]))+1,data.staticPages[index.ids[n]+'/'+type]);pdfLinks++;}}
  assert.equal(pdfLinks,172);report.pdf={version:'7.17',pages:193,sha256:sha(pdfBytes),indexDestinations:pdfLinks};
  report.mobile=[];
  for(const width of [360,390]){
   await page.setViewportSize({width,height:844});await page.evaluate(()=>{setRoadType('Taxi');showView('help')});
   const header=await page.evaluate(()=>({logos:[...document.querySelectorAll('.brandLogos img')].map(i=>({id:i.id,loaded:i.complete&&i.naturalWidth>0,fit:getComputedStyle(i).objectFit,left:i.getBoundingClientRect().left,right:i.getBoundingClientRect().right})),credits:document.querySelector('.brandCredits').textContent,overflow:document.documentElement.scrollWidth>innerWidth}));
   assert.equal(header.overflow,false);assert.deepEqual(header.logos.map(i=>i.id),['turisticaLogo','poliziaLogo']);assert.ok(header.logos.every(i=>i.loaded&&i.fit==='contain'&&i.left>=0&&i.right<=width));assert.ok(header.logos[0].right<header.logos[1].left);
   assert.match(header.credits,/Antonio Balzano.*San Lorenzo/);assert.match(header.credits,/Pasquale D’Ascoli.*Polizia Turistica/);
   const all=await page.evaluate(async()=>{
    const result=[];
    for(const {item,type}of STATIC_LAYOUT.rows){
     if(!openSanction(item.id,type))throw Error('Apertura '+item.code);
     if(document.documentElement.scrollWidth>innerWidth+1)throw Error('Overflow '+item.code);
     const target=casePDFPage(item,type);if(target!==STATIC_LAYOUT.pages[item.id+'/'+type]||documentURL(3,target).hash!=='#page='+target)throw Error('PDF '+item.code);
     const body=document.getElementById('sanctionScreen').innerText;if(/\b(?:c\.|comma)\s*\d+(?:-(?:bis|ter|quater))?\s+([a-df-z])\b(?!-)/.test(body))throw Error('Lettera senza let. '+item.code+'/'+type);
     const row={code:item.code,type,page:target};
     if(item.kind!=='collective-reference'){
      const f=document.getElementById('formulaText');row.parts=[...f.querySelectorAll('[data-copy-text]')].map(e=>e.dataset.copyText);row.hints=[...f.querySelectorAll('.staticPointHints')].map(e=>e.textContent);row.expected=window.prontuarioCatalogCopyText(f);
      const original=navigator.clipboard.writeText.bind(navigator.clipboard);navigator.clipboard.writeText=async text=>row.copy=text;await copyFormula(findCase(item.id),type);navigator.clipboard.writeText=original;
      if(row.copy!==row.expected)throw Error('Copia '+item.code);
     }result.push(row);
    }return result;
   });
   assert.equal(all.length,172);assert.equal(all.filter(r=>r.copy).length,171);
   for(const row of all){assert.ok(norm(texts[row.page]).includes(norm(row.code)),row.code);let text=norm(texts[row.page]);for(const hint of row.hints||[])text=text.replaceAll(norm(hint),'');for(const part of row.parts||[])assert.ok(text.includes(norm(part)),`Copia/PDF ${row.code}/${row.type}`);}
   await page.screenshot({path:resolve(dir,`pubblico-${width}.png`),fullPage:true});
   report.mobile.push({width,cards:all.length,copies:171,destinations:172,overflow:false,header});
  }
  report.cases=[];
  for(const code of ['R44','R45','R46']){
   const item=data.catalog.find(i=>i.code===code);await page.evaluate(id=>openSanction(id,'Trazione animale'),item.id);
   const body=await page.locator('#sanctionScreen').innerText();assert.match(body,/Prescrizione confermata dall’autore/);assert.match(body,/sanzione specifica.*non verificata documentalmente/);assert.match(body,/Regime generale TUEL, se applicabile/);assert.equal(await page.locator('input[type="checkbox"]').count(),0);
   await page.locator('#copyFormula').click();const copy=await page.evaluate(()=>navigator.clipboard.readText());assert.equal(copy,item.formula);assert.ok(norm(texts[item.docPage]).includes(norm(copy)));assert.doesNotMatch(copy,/PMR|ritirata|30%|punti/);
   report.cases.push({code,page:item.docPage,copy});await page.locator('#sanctionScreen').screenshot({path:resolve(dir,`${code}-390.png`)});
  }
  report.search=[];
  for(const [query,type,code]of [['sei ore giornaliere','Trazione animale','R44'],['capienza carrozza','Trazione animale','R45'],['scarpe protettive','Trazione animale','R46'],['pausa','Taxi','G46'],['caldo','Trazione animale','R43'],['ricevuta predeterminata','Taxi','G28-02']]){
   await page.evaluate(t=>{setRoadType(t);showView('help')},type);await page.locator('#roadSearch').fill(query);await page.locator('#roadSearch').press('Enter');assert.ok((await page.locator('#roadResults .codeTag').allTextContents()).includes(code),query);report.search.push({query,type,code});
  }
  report.removedSearch=[];for(const type of ['Taxi','NCC'])for(const code of ['R16','T01','G15','G28-03','I08','R29','R31','R36','G51']){const results=await page.evaluate(({type,code})=>rankedSearch(relevantCards(type),code).map(i=>i.code),{type,code});assert.deepEqual(results,[],code+'/'+type);report.removedSearch.push({code,type,results:0});}
  const excluded=['Revisione schede ncc prima parte.txt','revisione/1.8.15/stato-iniziale.json','revisione/1.8.15/richieste-iniziali.json','revisione/1.8.15/prima-viste.json','revisione/1.8.15/fonti-acquisizioni.json','revisione/1.8.15/fonti/CdS-art85.html','revisione/1.8.15/base-1.8.14/index.html','allegati/EGAF_Art86_originale.pdf','verbale_cartaceo.jpg','diciture prontuario seconda parte.txt','ESEMPI_RICEVUTE_TARIFFE_1.8.2.md','revisione/fonti-integrative/WhatsApp Image 2026-10-21 at 23.20.24.jpeg','revisione/fonti-integrative/WhatsApp Image 2026-10-23 at 09.53.07.jpeg','revisione/1.8.13/prima-data.json','revisione testi terza parte.txt','revisione/1.8.14/prima-data.json','revisione/1.8.14/prima-viste.json','revisione/1.8.14/stato-iniziale.json','revisione/1.8.14/richieste-iniziali.json','revisione/1.8.14/esiti-txt.json','revisione/1.8.14/base-1.8.13/index.html','revisione/1.8.14/fonti/CdS-art85.html'];
  report.excluded=[];for(const path of excluded){const r=await context.request.get(new URL(path,base).href);assert.equal(r.status(),404,path);report.excluded.push({path,status:r.status()});}
  await save(page,2);await save(page,3);await save(page,15);await save(page,16);await save(page,17);await save(page,18);await context.setOffline(true);await page.reload();await page.waitForSelector('#roadSearch');assert.equal(await page.evaluate(()=>BUILD_ID),version.build_id);report.upgradedOffline=await offlinePDF(page);report.upgradedOffline.docs=await offlineDocuments(page);
  const range=await page.evaluate(async()=>{const r=await fetch(sourceURL(3),{headers:{Range:'bytes=0-99'}});return {status:r.status,length:(await r.arrayBuffer()).byteLength};});
  assert.deepEqual(range,{status:206,length:100});report.upgradedOffline.range=range;
  await pdf.destroy();assert.deepEqual(errors,[]);report.jsErrors=errors;
 }
}finally{await context.close()}
if(mode==='verify'){
 const freshProfile=resolve(dir,'fresh-profile-'+Date.now());
 let fresh=await chromium.launchPersistentContext(freshProfile,options);
 try{const p=await fresh.newPage();await p.goto(base);await p.waitForFunction(()=>navigator.serviceWorker.controller);await p.waitForFunction(()=>document.getElementById('offlineStatus').textContent.includes('pront'));assert.equal(await p.evaluate(()=>BUILD_ID),version.build_id);await save(p,3);await save(p,17);await save(p,18);}finally{await fresh.close();}
 fresh=await chromium.launchPersistentContext(freshProfile,options);
 try{
  await fresh.setOffline(true);const p=await fresh.newPage();await p.goto(base);await p.waitForSelector('#roadSearch');assert.equal(await p.evaluate(()=>BUILD_ID),version.build_id);report.freshInstallReopenedOffline=await offlinePDF(p);report.freshInstallReopenedOffline.docs=await offlineDocuments(p);
  await p.evaluate(()=>{setRoadType('Trazione animale');showView('help')});await p.locator('#roadSearch').fill('scarpe protettive');await p.locator('#roadSearch').press('Enter');assert.ok((await p.locator('#roadResults .codeTag').allTextContents()).includes('R46'));report.freshInstallReopenedOffline.search=true;
  const item=await p.evaluate(()=>DATA.catalog.find(i=>i.code==='R44'));await p.evaluate(id=>openSanction(id,'Trazione animale'),item.id);await p.locator('#copyFormula').click();assert.equal(await p.evaluate(()=>navigator.clipboard.readText()),item.formula);report.freshInstallReopenedOffline.copy=true;
 }finally{await fresh.close();}
 fs.writeFileSync(resolve(dir,'public-check.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({current:report.current,pdf:report.pdf,mobile:report.mobile.map(({width,cards,copies})=>({width,cards,copies})),excluded:report.excluded,offline:report.freshInstallReopenedOffline},null,2));
}
