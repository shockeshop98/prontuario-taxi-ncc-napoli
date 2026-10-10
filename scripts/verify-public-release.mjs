// Verifica di pubblicazione senza scritture remote. Usare un profilo effimero:
// RELEASE_VERIFY_DIR=$(mktemp -d) CHROMIUM_PATH=/... node ... prepare|verify
// Eseguire prepare PRIMA del deploy e verify DOPO, con la stessa directory.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {chromium} from 'playwright-core';
import {getDocument} from 'pdfjs-dist/legacy/build/pdf.mjs';
const root=resolve(import.meta.dirname,'..');
const mode=process.argv[2],dir=process.env.RELEASE_VERIFY_DIR;
assert.ok(['prepare','verify'].includes(mode)&&dir&&fs.statSync(dir).isDirectory(),'Directory temporanea e modalità richieste');
const base='https://shockeshop98.github.io/prontuario-taxi-ncc-napoli/';
const version=JSON.parse(fs.readFileSync(resolve(root,'version.json'),'utf8'));
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const context=await chromium.launchPersistentContext(resolve(dir,'browser-profile'),{executablePath:process.env.CHROMIUM_PATH,headless:true,viewport:{width:390,height:844},permissions:['clipboard-read','clipboard-write'],reducedMotion:'reduce'});
const page=await context.newPage();for(const p of context.pages())if(p!==page)await p.close();
const errors=[];page.on('pageerror',e=>errors.push(e.message));
async function save(index){
 await page.evaluate(()=>{showView('sources');renderSources()});
 await page.locator(`[data-save-source="${index}"]`).click();
 await page.waitForFunction(index=>document.querySelector(`[data-source-state="${index}"]`).textContent.includes('Salvato nella PWA'),index,{timeout:60000});
 assert.equal(await page.evaluate(index=>sourceCached(index),index),true);
}
try{
 if(mode==='prepare'){
  await page.goto(base,{waitUntil:'networkidle'});await page.waitForFunction(()=>navigator.serviceWorker.controller);
  const before=await page.evaluate(async()=>({release:RELEASE,build:BUILD_ID,worker:await activeWorkerBuild(await navigator.serviceWorker.getRegistration()),pdfVersion:DATA.prontuario.version,pdfPages:DATA.sources[3].pages.length}));
  assert.equal(before.release,'1.8.5');assert.equal(before.build,before.worker);
  await save(0);await save(3);
  await context.setOffline(true);await page.reload();assert.equal(await page.evaluate(()=>BUILD_ID),before.build);
  before.saved=await page.evaluate(async()=>({reg:await sourceCached(0),pdf:await sourceCached(3)}));
  assert.equal(before.saved.reg,true);assert.equal(before.saved.pdf,true);
  fs.writeFileSync(resolve(dir,'before.json'),JSON.stringify(before,null,2)+'\n');console.log('PWA precedente preparata',before);
 }else{
  const before=JSON.parse(fs.readFileSync(resolve(dir,'before.json'),'utf8'));
  // La prima apertura senza rete prova la conservazione della vera revisione precedente.
  await context.setOffline(true);await page.goto(base);await page.waitForSelector('#roadSearch');
  assert.equal(await page.evaluate(()=>BUILD_ID),before.build);
  await context.setOffline(false);await page.evaluate(()=>checkForUpdates(true));
  await page.locator('#loadUpdate').waitFor({state:'visible',timeout:45000});
  await page.locator('#loadUpdate').click();
  await page.waitForFunction(build=>BUILD_ID===build,version.build_id,{timeout:60000});
  await page.waitForFunction(()=>document.getElementById('offlineStatus').textContent.includes('pront'),null,{timeout:60000});
  const report={url:base,checked_at:new Date().toISOString(),before,expected:version};
  report.current=await page.evaluate(async()=>({release:RELEASE,build:BUILD_ID,worker:await activeWorkerBuild(await navigator.serviceWorker.getRegistration()),pdfVersion:DATA.prontuario.version,pdfPages:DATA.sources[3].pages.length,regSaved:await sourceCached(0),oldPdfStillSaved:await sourceCached(3),cacheNames:await caches.keys()}));
  assert.equal(report.current.release,'1.8.6');assert.equal(report.current.build,version.build_id);assert.equal(report.current.worker,version.build_id);
  assert.equal(report.current.pdfVersion,'7.8');assert.equal(report.current.pdfPages,207);assert.equal(report.current.regSaved,true);assert.equal(report.current.oldPdfStillSaved,false);
  const paths=['index.html','version.json','sw.js','assets/static-demo.css','scripts/operative-rules.js','scripts/static-catalog.js','scripts/static-catalog-ui.js','scripts/static-demos.js','scripts/static-demo-ui.js','scripts/taxi-collettivo.js','allegati/Prontuario_Taxi_NCC_Napoli.pdf'];
  report.publicFiles=[];
  for(const path of paths){
   const response=await context.request.get(new URL(path,base).href,{headers:{'Cache-Control':'no-cache'}});assert.equal(response.status(),200,path);
   const bytes=await response.body(),local=fs.readFileSync(resolve(root,path));assert.equal(sha(bytes),sha(local),path);
   report.publicFiles.push({path,sha256:sha(bytes),bytes:bytes.length});
   if(path.endsWith('.pdf')){
    fs.writeFileSync(resolve(dir,'Prontuario_pubblico_7.8.pdf'),bytes);
    const pdf=await getDocument({data:new Uint8Array(bytes),standardFontDataUrl:resolve(root,'node_modules/pdfjs-dist/standard_fonts')+'/'}).promise;
    assert.equal(pdf.numPages,207);assert.match((await pdf.getMetadata()).info.Title,/7\.8/);report.pdfPages=pdf.numPages;
    await pdf.destroy();
   }
  }
  report.allCards=await page.evaluate(async()=>{
   let copies=0,links=0;const failures=[];
   for(const {item,type} of STATIC_LAYOUT.rows){
    if(!openSanction(item.id,type))throw Error('Apertura '+item.code);
    if(document.documentElement.scrollWidth>innerWidth+1)failures.push(item.code+'/'+type);
    const page=casePDFPage(item,type);if(documentURL(3,page).hash!=='#page='+page)throw Error('Link PDF '+item.code);links++;
    if(item.kind==='collective-reference')continue;
    const refs=prontuarioOrderedReferences(prontuarioNormative(item,type));
    const rank=s=>/CdS|Codice della strada/i.test(s)?0:/L\.?\s*(?:n\.\s*)?21\s*\/\s*1992/.test(s)?1:/Regolamento comunale|\bReg\./i.test(s)?2:3;
    const ranks=refs.map(rank);if(ranks.some((n,i)=>i&&n<ranks[i-1]))throw Error('Ordine '+item.code);
    const displayed=document.querySelector('.staticNormative').innerText;
    const visibleCds=displayed.search(/CdS|Codice della strada/),visibleLaw=displayed.search(/L\.?\s*(?:n\.\s*)?21\s*\/\s*1992/),visibleReg=displayed.indexOf('Regolamento comunale');
    if(visibleCds>=0&&visibleLaw>=0&&visibleCds>visibleLaw||visibleLaw>=0&&visibleReg>=0&&visibleLaw>visibleReg||visibleCds>=0&&visibleReg>=0&&visibleCds>visibleReg)throw Error('Ordine visibile '+item.code);
    const box=document.querySelector('.officeInfo');if(!box||!box.hasAttribute('data-no-copy'))throw Error('Box '+item.code);box.open=true;
    let actual;const saved=navigator.clipboard.writeText.bind(navigator.clipboard);navigator.clipboard.writeText=async text=>{actual=text};
    await copyFormula(item,type);navigator.clipboard.writeText=saved;
    if(!actual||/diffida alla prima|cinque giorni per le difese|si dispone|è stato|è stata|Corso Pubblico/i.test(actual))throw Error('Copia '+item.code);
    const cds=actual.indexOf('CdS'),law=actual.search(/L\.?\s*(?:n\.\s*)?21\s*\/\s*1992/),reg=actual.indexOf('Regolamento comunale');
    if(cds>=0&&law>=0&&cds>law||law>=0&&reg>=0&&law>reg||cds>=0&&reg>=0&&cds>reg)throw Error('Ordine copia '+item.code);
    copies++;
   }return {cards:STATIC_LAYOUT.rows.length,copies,links,overflow:failures};
  });
  assert.deepEqual(report.allCards,{cards:187,copies:186,links:187,overflow:[]});
  report.search=[];
  for(const [query,type,code] of [['G24','Taxi','G24'],['fila passeggeri','Taxi','G24'],['ricevuta predeterminata','Taxi','G28-02'],['I03','NCC','N04'],['I07','Taxi','G07-01'],['taxi sharing','Taxi','TC01']]){
   await page.evaluate(type=>{setRoadType(type);showView('help')},type);await page.locator('#roadSearch').fill(query);await page.locator('#roadSearch').press('Enter');
   assert.ok((await page.locator('#roadResults .codeTag').allTextContents()).includes(code),query);report.search.push({query,type,code});
  }
  report.cases=[];
  for(const [id,type,expectedPage] of [['fila','Taxi',45],['ricevuta-ordinaria','Taxi',86],['ricevuta-predeterminata','Taxi',87],['ricevuta-modello','Taxi',88],['ricevuta-incompleta','Taxi',89],['turno','Taxi',44]]){
   // Il CSS visualizza le intestazioni in maiuscolo: verificare il testo del DOM,
   // senza confondere text-transform con una diversa etichetta della scheda.
   await page.evaluate(({id,type})=>openSanction(id,type),{id,type});const body=await page.locator('#sanctionScreen').textContent();
   if(id==='fila'){assert.match(body,/fila dei passeggeri/);assert.match(body,/lett\. g/);assert.match(body,/qualificazione da chiarire/);}
   if(id==='ricevuta-predeterminata'){assert.match(body,/Testo orientativo per la relazione/);assert.match(body,/originale non acquisito/);assert.match(body,/prima della partenza/);}
   assert.match(body,/Sanzioni accessorie e adempimenti/);assert.match(body,/Adempimenti obbligatori degli operatori/);
   const target=await page.evaluate(({id,type})=>casePDFPage(findCase(id),type),{id,type});assert.equal(target,expectedPage,id);
   await page.locator('#copyFormula').click();const copy=await page.evaluate(()=>navigator.clipboard.readText());assert.doesNotMatch(copy,/diffida alla prima|cinque giorni per le difese|si dispone|è stato|è stata/);
   report.cases.push({id,type,page:target,copy});
  }
  await save(3);await context.setOffline(true);await page.reload();await page.waitForSelector('#roadSearch');
  assert.equal(await page.evaluate(()=>BUILD_ID),version.build_id);await page.evaluate(()=>openSanction('fila','Taxi'));
  const navigation=context.waitForEvent('response',{predicate:r=>r.url().includes('/Prontuario_Taxi_NCC_Napoli.pdf')&&r.request().isNavigationRequest(),timeout:15000});
  const popupPromise=page.waitForEvent('popup');await page.locator('#casePDF').click();const response=await navigation,popup=await popupPromise;
  assert.equal(response.status(),200);assert.equal(response.fromServiceWorker(),true);await popup.close();
  report.offline={release:'1.8.6',pdfStatus:response.status(),pdfFromServiceWorker:response.fromServiceWorker()};
  await page.evaluate(()=>{setRoadType('Taxi');showView('help')});await page.locator('#roadSearch').fill('ricevuta predeterminata');await page.locator('#roadSearch').press('Enter');
  assert.ok((await page.locator('#roadResults .codeTag').allTextContents()).includes('G28-02'));report.offline.search=true;
  assert.deepEqual(errors,[]);report.jsErrors=errors;
  fs.writeFileSync(resolve(dir,'public-check.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
 }
}finally{await context.close()}
