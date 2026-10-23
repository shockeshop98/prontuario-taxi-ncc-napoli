// Verifica la PWA effettiva, tutte le destinazioni e le varianti della seconda parte.
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
import {chromium} from 'playwright-core';import {getDocument} from 'pdfjs-dist/legacy/build/pdf.mjs';import {createCanvas} from '@napi-rs/canvas';import sharp from 'sharp';
const root=new URL('../',import.meta.url),out=new URL('revisione/'+JSON.parse(fs.readFileSync(new URL('version.json',root))).version+'/',root),normal=s=>String(s).normalize('NFC').replace(/\s+|\u00ad/g,'');
for(const dir of ['mobile-360','mobile-390','pdf-pagine'])fs.mkdirSync(new URL(dir+'/',out),{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true,args:['--no-sandbox']}),context=await browser.newContext({permissions:['clipboard-read','clipboard-write'],reducedMotion:'reduce'}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
const report={checkedAt:new Date().toISOString(),viewports:[],cards:[],variants:[],jsErrors:errors};
try{
 await page.goto(process.env.REVIEW_URL||'http://127.0.0.1:8000/');await page.waitForFunction(()=>navigator.serviceWorker.controller);
 const rows=await page.evaluate(()=>STATIC_LAYOUT.rows.map(({item,type})=>({id:item.id,code:item.code,type,page:STATIC_LAYOUT.pages[item.id+'/'+type],second:window.prontuarioSecondApplies(item),collective:item.kind==='collective-reference'})));
 assert.equal(rows.length,190);assert.ok(!rows.some(r=>r.code==='G51'));const changed=rows.filter(r=>r.second);assert.equal(changed.length,15);
 for(const width of [360,390]){
  await page.setViewportSize({width,height:844});
  for(const row of changed){
   await page.evaluate(r=>openSanction(r.id,r.type),row);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,`Overflow ${row.code}/${width}`);
   const result=await page.evaluate(async r=>{const item=findCase(r.id),v=window.prontuarioRevisionView(item,r.type),f=document.getElementById('formulaText');let actual;const saved=navigator.clipboard.writeText.bind(navigator.clipboard);navigator.clipboard.writeText=async t=>actual=t;await copyFormula(item,r.type);navigator.clipboard.writeText=saved;return {expected:v.parts[0],actual,visible:f.innerText.trim(),selected:window.prontuarioCatalogCopyText(f)};},row);
   assert.equal(result.actual,result.expected);assert.equal(result.visible,result.expected);assert.equal(result.selected,result.expected);assert.doesNotMatch(result.actual,/e\/o|(?:abilitazione o l’identificazione)|Esempi alternativi|Norma sanzionatoria/);
   await page.locator('#sanctionScreen').screenshot({path:new URL(`mobile-${width}/${row.code}.png`,out).pathname,style:'#toast{visibility:hidden!important}'});
   if(width===390)report.cards.push({...row,formula:result.actual});
  }
  report.viewports.push({width,cards:changed.length,overflow:false,copyMatches:true});
 }
 for(const code of ['G46','R41','G48']){
  const row=changed.find(r=>r.code===code);await page.evaluate(r=>openSanction(r.id,r.type),row);
  for(const input of await page.locator('[name="seconda-variant"]').all()){
   const variant=await input.inputValue();await input.check();await page.locator('#copyFormula').click();const actual=await page.evaluate(()=>navigator.clipboard.readText());
   const expected=await page.evaluate(({id,variant})=>window.prontuarioSecondFormula(findCase(id),variant),{id:row.id,variant});assert.equal(actual,expected);report.variants.push({code,variant,formula:actual});
  }
 }
 for(const row of changed){await page.evaluate(r=>openSanction(r.id,r.type),row);const input=page.locator('[data-seconda-verbale]');if(await input.count()){
  assert.doesNotMatch(await page.locator('#formulaText').innerText(),/Copia del presente verbale/);await input.check();await page.locator('#copyFormula').click();assert.match(await page.evaluate(()=>navigator.clipboard.readText()),/Copia del presente verbale sarà inviata/);await input.uncheck();assert.doesNotMatch(await page.locator('#formulaText').innerText(),/Copia del presente verbale/);
 }}
 report.withdrawal=[];
 for(const row of changed.filter(r=>r.type==='Trazione animale')){
  await page.evaluate(r=>openSanction(r.id,r.type),row);const input=page.locator('[data-seconda-act="ritiro"]');
  const obligation=/ritirare la licenza contestualmente.*Ufficio Corso Pubblico del Comune di Napoli entro cinque giorni dal ritiro/;
  assert.match(await page.locator('.staticAccessories').innerText(),obligation);
  assert.match(await page.locator('.operativeNotes').innerText(),/indicazione organizzativa confermata dall’autore.*distinta dal testo normativo/);
  const base=await page.locator('#formulaText').innerText();assert.doesNotMatch(base,/licenza è ritirata/);
  await page.locator('#copyFormula').click();assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),base);
  await input.check();await page.locator('#copyFormula').click();const copied=await page.evaluate(()=>navigator.clipboard.readText());
  assert.equal(copied,base.replace('Copia del presente verbale','La licenza è ritirata e sarà trasmessa all’Ufficio Corso Pubblico. Copia del presente verbale'));
  assert.equal(await page.locator('#formulaText').innerText(),copied);
  await input.uncheck();await page.locator('#copyFormula').click();assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),base);
  assert.match(await page.locator('.staticAccessories').innerText(),obligation);
  await input.check();await page.evaluate(r=>openSanction(r.id,r.type),row);assert.equal(await input.isChecked(),false);assert.equal(await page.locator('#formulaText').innerText(),base);
  report.withdrawal.push({code:row.code,obligationSeparateFromAttestation:true,recipient:'Ufficio Corso Pubblico del Comune di Napoli',deadline:'cinque giorni dal ritiro',organizationalIndicationFromAuthor:true,selectedCopy:copied,clearedAndReopened:true});
 }
 await page.evaluate(()=>{setRoadType('Taxi');showView('help')});await page.locator('#roadSearch').fill('R01');await page.locator('#roadSearch').press('Enter');
 report.inactiveSearch=await page.locator('#roadResults').innerText();assert.match(report.inactiveSearch,/Applicabile soltanto dopo l’istituzione e l’attivazione/);
 report.integrationSearch=[];for(const [query,code]of [['contraffazione','G48'],['Metropark','G52']]){await page.locator('#roadSearch').fill(query);await page.locator('#roadSearch').press('Enter');const codes=await page.locator('#roadResults .codeTag').allTextContents();assert.ok(codes.includes(code),`Ricerca note aggiornate ${query}`);report.integrationSearch.push({query,code,found:true});}
 const inactive=changed.find(r=>r.code==='R01');await page.evaluate(r=>openSanction(r.id,r.type),inactive);assert.match(await page.locator('#sanctionScreen').innerText(),/Applicabile soltanto dopo l’istituzione e l’attivazione/);assert.equal(await page.locator('[data-seconda-verbale]').count(),0);
 await page.evaluate(()=>{setRoadType('Taxi');showView('help')});await page.locator('#roadSearch').fill('G51');await page.locator('#roadSearch').press('Enter');assert.deepEqual(await page.locator('#roadResults .codeTag').allTextContents(),[]);
 report.allFormulas=await page.evaluate(async rows=>{const out=[];for(const r of rows){if(r.collective)continue;openSanction(r.id,r.type);const f=document.getElementById('formulaText');const parts=[...f.querySelectorAll('[data-copy-text]')].map(e=>e.dataset.copyText);let actual;const saved=navigator.clipboard.writeText.bind(navigator.clipboard);navigator.clipboard.writeText=async t=>actual=t;await copyFormula(findCase(r.id),r.type);navigator.clipboard.writeText=saved;out.push({...r,parts,hints:[...f.querySelectorAll('.staticPointHints')].map(e=>e.textContent),actual,expected:window.prontuarioCatalogCopyText(f)});}return out;},rows);for(const r of report.allFormulas)assert.equal(r.actual,r.expected,`Copia effettiva ${r.code}`);
 report.allDestinations=await page.evaluate(rows=>rows.map(r=>{const item=r.collective?window.prontuarioTaxiCollettivo.item:findCase(r.id);return {...r,actual:casePDFPage(item,r.type)}}),rows);for(const r of report.allDestinations)assert.equal(r.actual,r.page,`Destinazione PWA ${r.code}`);
 const content=await page.evaluate(()=>({catalog:DATA.catalog,notes:DATA.prontuario,models:window.prontuarioStaticCatalog,related:window.prontuarioTaxiCollettivo.related}));
 assert.doesNotMatch(JSON.stringify(content.catalog),/G51|collettivoavviso|richiamata nel prontuario|\(se condizione della licenza verificata\)|Importi applicabili soltanto alla condizione del titolo accertata; non a ogni violazione comunale\./);
 assert.ok(!content.models.G51&&!content.related.G51);
 assert.deepEqual(errors,[]);
}finally{await context.close();await browser.close();}
const bytes=fs.readFileSync(new URL('allegati/Prontuario_Taxi_NCC_Napoli.pdf',root)),pdf=await getDocument({data:new Uint8Array(bytes),standardFontDataUrl:new URL('node_modules/pdfjs-dist/standard_fonts/',root).pathname}).promise;
const data=JSON.parse(fs.readFileSync(new URL('index.html',root),'utf8').match(/^const DATA=(.*);$/m)[1]);
report.pdf={pages:pdf.numPages,cards:report.allDestinations.length,sha256:createHash('sha256').update(bytes).digest('hex'),destinations:0,fontSize:9};
const texts=[];for(let i=1;i<=pdf.numPages;i++){const p=await pdf.getPage(i);texts[i]=(await p.getTextContent()).items.map(e=>e.str).join(' ');assert.doesNotMatch(texts[i],/\bG51\b|richiamata nel prontuario|\(se condizione della licenza verificata\)|Importi applicabili soltanto alla condizione del titolo accertata; non a ogni violazione comunale\./);}
for(const r of report.cards){assert.ok(normal(texts[r.page]).includes(normal(r.formula)),`Formula PDF ${r.code}`);const p=await pdf.getPage(r.page),viewport=p.getViewport({scale:1.4}),canvas=createCanvas(Math.ceil(viewport.width),Math.ceil(viewport.height));await p.render({canvasContext:canvas.getContext('2d'),viewport}).promise;fs.writeFileSync(new URL(`pdf-pagine/${r.code}.png`,out),canvas.toBuffer('image/png'));}
for(const r of report.withdrawal){const text=normal(texts[report.cards.find(c=>c.code===r.code).page]);for(const expected of ['Ufficio Corso Pubblico del Comune di Napoli entro cinque giorni dal ritiro','indicazione organizzativa confermata dall’autore','distinta dal testo normativo','Solo se ritiro materialmente eseguito','La licenza è ritirata e sarà trasmessa all’Ufficio Corso Pubblico.'])assert.ok(text.includes(normal(expected)),`Ritiro, destinatario e fonte nel PDF ${r.code}: ${expected}`);}
for(const index of data.manualIndex){const p=await pdf.getPage(index.page),links=await p.getAnnotations();assert.equal(links.length,index.ids.length);for(let j=0;j<links.length;j++){const type=index.type==='equina'?'Trazione animale':index.type==='ncc'?'NCC':'Taxi';assert.equal((await pdf.getPageIndex(links[j].dest[0]))+1,data.staticPages[index.ids[j]+'/'+type]);report.pdf.destinations++;}}
assert.equal(report.pdf.destinations,190);
for(const r of report.allFormulas){let text=normal(texts[r.page]);for(const hint of r.hints)text=text.replaceAll(normal(hint),'');for(const part of r.parts)if(part.trim())assert.ok(text.includes(normal(part)),`Segmento copiato nel PDF, esclusi i suggerimenti esterni ${r.code}/${r.type}: ${part}`);}report.pdf.formulasCompared=report.allFormulas.length;
await pdf.destroy();
for(const kind of ['pdf-pagine','mobile-390'])for(let start=0;start<report.cards.length;start+=5){const batch=report.cards.slice(start,start+5),width=340,height=kind==='pdf-pagine'?500:1600,composites=[];for(const [i,r]of batch.entries()){composites.push({input:Buffer.from(`<svg width="340" height="32"><rect width="100%" height="100%" fill="#142d42"/><text x="12" y="24" fill="white" font-size="20">${r.code}</text></svg>`),left:i*width,top:0});composites.push({input:await sharp(new URL(`${kind}/${r.code}.png`,out).pathname).resize(width,height,{fit:'inside'}).png().toBuffer(),left:i*width,top:32});}await sharp({create:{width:width*batch.length,height:height+32,channels:3,background:'#e5edef'}}).composite(composites).png().toFile(new URL(`${kind}-tavola-${start/5+1}.png`,out).pathname);}
fs.writeFileSync(new URL('verifica-seconda-parte.json',out),JSON.stringify(report,null,2)+'\n');console.log('15 schede, varianti selezionabili, copia effettiva, 360/390 px, 190 destinazioni PWA/PDF e assenza G51: OK');
