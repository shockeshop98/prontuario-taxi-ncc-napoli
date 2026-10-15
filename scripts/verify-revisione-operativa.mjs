import fs from 'node:fs/promises';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {chromium} from 'playwright-core';
import {getDocument} from 'pdfjs-dist/legacy/build/pdf.mjs';
import {createCanvas} from '@napi-rs/canvas';
import {examples,formulaFor} from '../revisione/1.8.8/proposta-operativa.mjs';

const root=resolve(import.meta.dirname,'..'),out=resolve(root,'revisione/1.8.8');
const base=process.env.REVIEW_BASE||'http://127.0.0.1:8000/';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true});
const report={checkedAt:new Date().toISOString(),viewports:[],copies:[],errors:[]};
try{
  const context=await browser.newContext({permissions:['clipboard-read','clipboard-write'],reducedMotion:'reduce'});
  const page=await context.newPage();page.on('pageerror',e=>report.errors.push(e.message));
  await page.goto(base+'revisione/1.8.8/anteprima-operativa.html');await page.waitForFunction(()=>window.reviewReady);
  assert.equal(await page.locator('.officeInfo').count(),0);
  assert.equal(await page.locator('body > header img').count(),2);
  assert.equal(await page.locator('#comuneLogo').count(),0);
  for(const e of examples){
    const card=page.locator(`.reviewCard[data-code="${e.code}"]`),select=card.locator('select');
    assert.equal(await select.inputValue(),'fatto');
    assert.equal(await card.locator('.reviewFormula').textContent(),formulaFor(e,'fatto'));
    assert.doesNotMatch(formulaFor(e,'fatto'),/è ritirat[oa]|è sottoposto a sequestro|è autorizzato/);
    for(const variant of e.variants){
      await select.selectOption(variant.id);await card.locator('.copyReview').click();
      const copied=await page.evaluate(()=>navigator.clipboard.readText());assert.equal(copied,formulaFor(e,variant.id));
      assert.doesNotMatch(copied,/Proposta da confermare|Indicazione interna|Punti patente|Norma sanzionatoria|Esempio pertinente/);
      if(e.abusive)assert.doesNotMatch(copied,/regolarmente in servizio|Corso Pubblico|autorizzato a condurre|C\.P\./);
      if(e.code==='G23')assert.doesNotMatch(copied,/regolarmente in servizio/);
      if(variant.id==='impedito')assert.doesNotMatch(copied,/è autorizzato/);
      report.copies.push({code:e.code,variant:variant.id,exact:true});
    }
    await select.selectOption(e.printVariant);
  }
  for(const [width,height] of [[360,800],[390,844],[430,932],[1440,1000]]){
    await page.setViewportSize({width,height});
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);assert.equal(overflow,false);
    await page.evaluate(()=>scrollTo(0,0));
    await page.locator('body > header').screenshot({path:resolve(out,`proposta-intestazione-${width}.png`)});
    for(const e of examples){
      const card=page.locator(`.reviewCard[data-code="${e.code}"]`);
      const r=await card.boundingBox();assert.ok(r.x>=0&&r.x+r.width<=width+1);
      await card.screenshot({path:resolve(out,`esempio-${e.code}-${width}.png`)});
      if(width===390)await card.locator('.formulaPanel').screenshot({path:resolve(out,`formula-${e.code}-390.png`)});
    }
    report.viewports.push({width,height,overflow:false,cards:4});
  }
  assert.deepEqual(report.errors,[]);
}finally{await browser.close()}

const options={standardFontDataUrl:resolve(root,'node_modules/pdfjs-dist/standard_fonts')+'/'};
const previewBytes=await fs.readFile(resolve(out,'Esempi_revisione_operativa.pdf'));
const pdf=await getDocument({...options,data:new Uint8Array(previewBytes)}).promise;
assert.equal(pdf.numPages,5,'Copertina e quattro esempi, una pagina ciascuno');
const normalized=s=>s.normalize('NFC').replace(/\s+/g,'');
for(let n=1;n<=pdf.numPages;n++){
  const page=await pdf.getPage(n);
  if(n>1){
    const content=(await page.getTextContent()).items.map(i=>i.str).join(' ');
    assert.ok(normalized(content).includes(normalized(formulaFor(examples[n-2],examples[n-2].printVariant))));
    assert.doesNotMatch(content,/Segnalazione e provvedimenti|Provvedimenti dell’Amministrazione — non copiati/);
  }
  const viewport=page.getViewport({scale:1.6}),canvas=createCanvas(Math.ceil(viewport.width),Math.ceil(viewport.height));
  await page.render({canvasContext:canvas.getContext('2d'),viewport}).promise;
  await fs.writeFile(resolve(out,n===1?'proposta-copertina.png':`proposta-pdf-${examples[n-2].code}.png`),canvas.toBuffer('image/png'));
}
await pdf.destroy();
const baseline=process.env.OPERATIVE_BASELINE||'/tmp/prontuario-operativa-baseline';
const readData=async p=>JSON.parse((await fs.readFile(p,'utf8')).split('\n').find(l=>l.startsWith('const DATA=')).slice(11,-1));
const before=await readData(resolve(baseline,'index.html')),after=await readData(resolve(root,'index.html'));
assert.deepEqual(after.catalog,before.catalog,'Catalogo, norme, importi, punti e formule conservati');
for(const key of Object.keys(before).filter(k=>!['sources','prontuario'].includes(k)))assert.deepEqual(after[key],before[key],key);
const clean=p=>Object.fromEntries(Object.entries(p).filter(([k])=>k!=='version'));
assert.deepEqual(clean(after.prontuario),clean(before.prontuario));
for(let i=0;i<before.sources.length;i++){
  if(i===3){const cleanSource=p=>Object.fromEntries(Object.entries(p).filter(([k])=>!['title','pages'].includes(k)));assert.deepEqual(cleanSource(before.sources[i]),cleanSource(after.sources[i]));}
  else assert.deepEqual(before.sources[i],after.sources[i]);
}
const fullBytes=await fs.readFile(resolve(root,'allegati/Prontuario_Taxi_NCC_Napoli.pdf'));
const oldPDF=await getDocument({...options,data:new Uint8Array(await fs.readFile(resolve(baseline,'Prontuario_Taxi_NCC_Napoli.pdf')))}).promise;
const fullPDF=await getDocument({...options,data:new Uint8Array(fullBytes)}).promise;
assert.equal(fullPDF.numPages,207);assert.equal(oldPDF.numPages,fullPDF.numPages);
const destinations=async(doc,page)=>Promise.all((await page.getAnnotations()).filter(a=>a.subtype==='Link').map(async a=>a.dest?{page:await doc.getPageIndex(a.dest[0])+1,rect:a.rect}:{url:a.url,rect:a.rect}));
let links=0;
for(let n=2;n<=fullPDF.numPages;n++){
  const oldPage=await oldPDF.getPage(n),newPage=await fullPDF.getPage(n);
  const text=async p=>(await p.getTextContent()).items.map(i=>i.str).join(' ').replaceAll('7.9','7.10');
  assert.equal(normalized(await text(oldPage)),normalized(await text(newPage)),'Testo del PDF completo p.'+n);
  const expected=await destinations(oldPDF,oldPage),actual=await destinations(fullPDF,newPage);assert.deepEqual(actual,expected,'Collegamenti p.'+n);links+=actual.length;
}
assert.equal(links,187);
const cover=await fullPDF.getPage(1),viewport=cover.getViewport({scale:1.6}),canvas=createCanvas(Math.ceil(viewport.width),Math.ceil(viewport.height));
await cover.render({canvasContext:canvas.getContext('2d'),viewport}).promise;
await fs.writeFile(resolve(out,'copertina-pdf-completo.png'),canvas.toBuffer('image/png'));
await oldPDF.destroy();await fullPDF.destroy();
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const initial=JSON.parse(await fs.readFile(resolve(baseline,'stato-iniziale.json'),'utf8'));
const expectedChanges=new Set(['index.html','sw.js','version.json','allegati/Prontuario_Taxi_NCC_Napoli.pdf','scripts/generate-prontuario-static.mjs','scripts/verify-review-browser.mjs','tests/pwa.test.mjs','tests/revision.test.mjs','CHANGELOG.md','README.md','PASSAGGIO_CODEX.md']);
for(const [path,hash] of Object.entries(initial))if(!expectedChanges.has(path))assert.equal(sha(await fs.readFile(resolve(root,path))),hash,'File locale conservato '+path);
report.catalogUnchanged=true;report.originalLocalFilesPreserved=true;
report.fullPDF={pages:207,unchangedPagesExceptVersion:206,unchangedDestinationsAndPositions:links,sha256:sha(fullBytes)};
report.previewPDF={pages:5,onePagePerExample:true,formulasMatch:true,sha256:sha(previewBytes)};
report.formulas=examples.map(e=>({code:e.code,variant:e.printVariant,formula:formulaFor(e,e.printVariant)}));
await fs.writeFile(resolve(out,'verifica-proposta.json'),JSON.stringify(report,null,2)+'\n');
console.log('Proposta OK: quattro viewport, varianti e copia esatte, PDF 5 pagine; catalogo e 206 pagine del PDF completo conservati, 187 collegamenti invariati.');
