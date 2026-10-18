// Verifica locale dei 38 codici richiesti. Nessuna scrittura remota.
import fs from 'node:fs';import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {chromium} from 'playwright-core';
import {getDocument} from 'pdfjs-dist/legacy/build/pdf.mjs';
import {createCanvas} from '@napi-rs/canvas';
import sharp from 'sharp';
const root=new URL('../',import.meta.url),out=new URL('revisione/1.8.9/',root);
for(const name of ['mobile-390','pdf-pagine','desktop'])fs.mkdirSync(new URL(name+'/',out),{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true,args:['--no-sandbox']});
const context=await browser.newContext({reducedMotion:'reduce'}),page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(e.message));
const report={checkedAt:new Date().toISOString(),viewports:[],cards:[],jsErrors:errors};
try{
 await page.goto(process.env.REVIEW_URL||'http://127.0.0.1:8000/');await page.waitForFunction(()=>navigator.serviceWorker.controller);
 const rows=await page.evaluate(()=>STATIC_LAYOUT.rows.filter(r=>window.prontuarioRevisionApplies(r.item,r.type)).map(({item,type})=>({id:item.id,code:item.code,type,page:STATIC_LAYOUT.pages[item.id+'/'+type],formula:window.prontuarioRevisionFormula(item),clauses:Array.from(window.prontuarioRevisionClauses(item))})));
 assert.equal(rows.length,38);
 for(const width of [360,390,1440]){
  await page.setViewportSize({width,height:width===1440?1000:844});
  for(const row of rows){
   await page.evaluate(r=>openSanction(r.id,r.type),row);
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);assert.equal(overflow,false,`${row.code} ${width}`);
   const defaultCopy=await page.evaluate(()=>window.prontuarioCatalogCopyText(document.getElementById('formulaText')));
   assert.equal(defaultCopy,row.formula);
   assert.equal((await page.locator('#formulaText').innerText()).trim(),row.formula);
   const actual=await page.evaluate(async r=>{
    let actual;const saved=navigator.clipboard.writeText.bind(navigator.clipboard);
    navigator.clipboard.writeText=async text=>{actual=text};await copyFormula(findCase(r.id),r.type);navigator.clipboard.writeText=saved;return actual;
   },row);assert.equal(actual,row.formula);
   if(width===390)await page.locator('.staticFormula').screenshot({path:new URL(`mobile-390/${row.code}.png`,out).pathname,style:'#toast{visibility:hidden!important}'});
   if(width===1440&&['G01','G03-04','G05-01','G07-01','G08-01','G23','G24'].includes(row.code))await page.locator('#sanctionScreen').screenshot({path:new URL(`desktop/${row.code}.png`,out).pathname,style:'#toast{visibility:hidden!important}'});
  }
  report.viewports.push({width,cards:rows.length,overflow:false,copyMatches:true});
 }
 await page.setViewportSize({width:390,height:844});
 for(const row of rows){
  await page.evaluate(r=>openSanction(r.id,r.type),row);
  let checked=0;
  for(let mask=0;mask<2**row.clauses.length;mask++){
   await page.evaluate(({row,mask})=>{
    const section=document.querySelector('[data-revision-code]');
    for(const input of section.querySelectorAll('[data-revision-act]'))input.checked=false;
    for(const [i,id] of row.clauses.entries())if(mask&(1<<i)){const input=section.querySelector(`[data-revision-act="${id}"]`);input.checked=true;input.dispatchEvent(new Event('change',{bubbles:true}));}
   },{row,mask});
   const result=await page.evaluate(r=>{
    const ids=[...document.querySelectorAll('[data-revision-act]:checked')].map(e=>e.dataset.revisionAct);
    const copy=window.prontuarioCatalogCopyText(document.getElementById('formulaText'));
    return {copy,expected:window.prontuarioRevisionFormula(findCase(r.id),ids)};
   },row);assert.equal(result.copy,result.expected);checked++;
  }
  report.cards.push({...row,attestationCombinations:checked});
 }
 assert.deepEqual(errors,[]);
}finally{await context.close();await browser.close()}
const bytes=fs.readFileSync(new URL('allegati/Prontuario_Taxi_NCC_Napoli.pdf',root));
report.pdf={sha256:createHash('sha256').update(bytes).digest('hex'),pages:207,cards:187,fontSize:9};
const pdf=await getDocument({data:new Uint8Array(bytes),standardFontDataUrl:new URL('node_modules/pdfjs-dist/standard_fonts/',root).pathname}).promise;
assert.equal(pdf.numPages,207);
const normal=s=>s.normalize('NFC').replace(/\s+|\u00ad/g,'');
for(const row of report.cards){
 const p=await pdf.getPage(row.page),text=(await p.getTextContent()).items.map(e=>e.str).join(' ');
 assert.ok(normal(text).includes(normal(row.formula)),`PDF/formula ${row.code}`);
 const viewport=p.getViewport({scale:1.3}),canvas=createCanvas(Math.ceil(viewport.width),Math.ceil(viewport.height));
 await p.render({canvasContext:canvas.getContext('2d'),viewport}).promise;
 fs.writeFileSync(new URL(`pdf-pagine/${row.code}.png`,out),canvas.toBuffer('image/png'));
}
for(const [number,name] of [[1,'copertina']]){
 const p=await pdf.getPage(number),viewport=p.getViewport({scale:1.3}),canvas=createCanvas(Math.ceil(viewport.width),Math.ceil(viewport.height));await p.render({canvasContext:canvas.getContext('2d'),viewport}).promise;fs.writeFileSync(new URL(`${name}.png`,out),canvas.toBuffer('image/png'));
}
await pdf.destroy();
// Tavole in gruppi di otto: etichette leggibili e immagini singole disponibili accanto.
for(const kind of ['pdf-pagine','mobile-390'])for(let start=0;start<report.cards.length;start+=8){
 const batch=report.cards.slice(start,start+8),width=kind==='pdf-pagine'?386:340,height=kind==='pdf-pagine'?565:800;
 const composites=[];
 for(const [i,row] of batch.entries()){
  const top=Math.floor(i/4)*(height+36),left=(i%4)*width;
  const label=Buffer.from(`<svg width="${width}" height="36"><rect width="100%" height="100%" fill="#142d42"/><text x="12" y="25" fill="white" font-size="20">${row.code}</text></svg>`);
  composites.push({input:label,top,left});
  composites.push({input:await sharp(new URL(`${kind}/${row.code}.png`,out).pathname).resize(width,height,{fit:'inside',withoutEnlargement:true}).extend({top:0,bottom:0,left:0,right:0}).png().toBuffer(),top:top+36,left});
 }
 await sharp({create:{width:width*4,height:(height+36)*2,channels:3,background:'#e5edef'}}).composite(composites).png().toFile(new URL(`${kind}-tavola-${start/8+1}.png`,out).pathname);
}
fs.writeFileSync(new URL('verifica-g01-g43.json',out),JSON.stringify(report,null,2)+'\n');
console.log('38 schede: copia reale, 360/390/1440 px, attestazioni, PDF e anteprime verificate.');
