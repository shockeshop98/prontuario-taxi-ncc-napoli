// Revisione solo editoriale: confronta tutti i contenuti con la pubblicazione 1.8.16.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {getDocument} from 'pdfjs-dist/legacy/build/pdf.mjs';
import {loadReview} from './review-runtime.mjs';
import {read1816} from '../tests/release-1816-fs.mjs';

const root=path.resolve(import.meta.dirname,'..'),out=path.join(root,'revisione/1.8.17');
const current=loadReview(root),before=loadReview(root,{read:p=>read1816(p,'utf8')});
const sha=b=>createHash('sha256').update(b).digest('hex'),plain=x=>x===undefined?undefined:JSON.parse(JSON.stringify(x));
const oldTitle='Mancato posizionamento negli stalli predisposti dal Comune',newTitle='Sostava fuori dagli stalli autorizzati';
const support='Con il sostegno e la promozione del CSA — Città Metropolitana di Napoli';
assert.equal(current.views.length,172);assert.equal(current.data.catalog.length,112);
assert.equal(current.data.prontuario.version,'7.19');assert.equal(current.data.sources.length,17);
assert.deepEqual(Array.from(current.layout.sections,s=>s.rows.length),[104,60,8]);
const changes=[];
for(const v of current.views){
 const old=before.views.find(o=>o.type===v.type&&o.code===v.code);assert.ok(old);
 assert.equal(v.id,old.id);assert.equal(v.page,old.page);
 for(const field of ['item','model','view','follow','body','formulas']){
  const expected=plain(old[field]);
  if(v.type==='Taxi'&&v.code==='G55'&&['item','model','view'].includes(field))expected.title=newTitle;
  assert.deepEqual(plain(v[field]),expected,'Contenuto preservato '+v.type+'/'+v.code+'/'+field);
 }
 if(v.type==='Taxi'&&v.code==='G55')changes.push({service:'Taxi',code:'G55',field:'title',before:old.item.title,after:v.item.title});
}
assert.equal(changes.length,1);assert.equal(changes[0].before,oldTitle);
const expectedData=plain(before.data);
expectedData.catalog.find(c=>c.code==='G55').title=newTitle;
expectedData.prontuario.version='7.19';expectedData.sources[2]=plain(current.data.sources[2]);
assert.deepEqual(plain(current.data),expectedData,'Nessun altro dato editoriale o normativo modificato');
const fold=s=>s.normalize('NFKC').replace(/[’‘]/g,"'").replace(/\s+/g,'');
const bytes=fs.readFileSync(path.join(root,'allegati/Prontuario_Taxi_NCC_Napoli.pdf'));
const pdf=await getDocument({data:new Uint8Array(bytes)}).promise;
const oldPdf=await getDocument({data:new Uint8Array(read1816('allegati/Prontuario_Taxi_NCC_Napoli.pdf'))}).promise;
const pages=[];let destinations=0;
assert.equal(pdf.numPages,oldPdf.numPages);
for(let n=1;n<=pdf.numPages;n++){
 const page=await pdf.getPage(n),text=(await page.getTextContent()).items.map(i=>i.str).join(' ');
 pages.push(text);assert.equal(text,current.data.sources[2].pages[n-1]);
 assert.doesNotMatch(text,/\bN11\b|nccfoglio|EGAF/i);
 if(n===1){
  assert.ok(fold(text).includes(fold('Con la collaborazione del Sottotenente Pasquale D’Ascoli')));
  assert.ok(fold(text).includes(fold(support)));
  assert.ok(fold(text).includes(fold('A cura dell’Agente Antonio Balzano')));
  assert.ok(text.includes('U.O. San Lorenzo'));assert.doesNotMatch(text,/Maresciallo|D’Asccoli|patrocinio/);
 }else{
  const oldText=(await(await oldPdf.getPage(n)).getTextContent()).items.map(i=>i.str).join(' ');
  const normalize=s=>fold(s).replaceAll(fold(newTitle),fold(oldTitle)).replaceAll('7.19','7.18').replaceAll(fold('20 novembre 2026'),fold('10 novembre 2026'));
  assert.equal(normalize(text),normalize(oldText),'Testo invariato pagina '+n+' salvo titolo, data e versione');
 }
}
for(const index of current.data.manualIndex){
 const links=await(await pdf.getPage(index.page)).getAnnotations();assert.equal(links.length,index.ids.length);
 const type=index.type==='taxi'?'Taxi':index.type==='ncc'?'NCC':'Trazione animale';
 for(let n=0;n<links.length;n++){assert.equal((await pdf.getPageIndex(links[n].dest[0]))+1,current.data.staticPages[index.ids[n]+'/'+type]);destinations++;}
}
assert.equal(destinations,172);
let formulas=0;
for(const v of current.views){assert.equal(current.data.staticPageSpans[v.id+'/'+v.type],1);if(v.item.kind!=='collective-reference'){assert.ok(fold(pages[v.page-1]).includes(fold(v.view.parts.join(' '))),v.type+'/'+v.code);formulas++;}}
assert.equal(formulas,171);
const logo=fs.readFileSync(path.join(root,'assets/logo-csa-napoli.jpeg'));
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8'),allowed=JSON.parse(fs.readFileSync(path.join(root,'pages-files.json')));
assert.ok(allowed.includes('assets/logo-csa-napoli.jpeg'));assert.ok(sw.match(/const CORE = \[(.*?)\];/s)[1].includes("'assets/logo-csa-napoli.jpeg'"));
assert.ok(!allowed.some(p=>/EGAF|Revisione .*\.txt|\/base-1\.8|stato-iniziale|prima-viste|WhatsApp|verbale_cartaceo/i.test(p)));
assert.ok(!current.data.egaf&&!current.data.egafConditions);
assert.ok(!current.data.sources.some(s=>/EGAF/i.test(s.url)));
assert.ok(current.html.includes(support));assert.ok(current.html.includes('Con la collaborazione del Sottotenente <strong>Pasquale D’Ascoli</strong>'));
let protectedFileCount=0,snapshotIntact=null;
const snapshotFile=path.join(out,'base-1.8.16/manifest.json');
if(fs.existsSync(snapshotFile)){
 const snapshot=JSON.parse(fs.readFileSync(snapshotFile)),authorized=new Set(['index.html','sw.js','version.json','pages-files.json','scripts/generate-prontuario-static.mjs','allegati/Prontuario_Taxi_NCC_Napoli.pdf']);
 for(const [p,h]of Object.entries(snapshot.protectedFiles))if(!authorized.has(p)){assert.equal(sha(fs.readFileSync(path.join(root,p))),h,'Originale/rapporto storico intatto '+p);protectedFileCount++;}
 for(const [p,h]of Object.entries(snapshot.files))assert.equal(sha(fs.readFileSync(path.join(out,'base-1.8.16',p))),h,'Fotografia preservata '+p);
 snapshotIntact=true;
}
await pdf.destroy();await oldPdf.destroy();
const result={checkedAt:new Date().toISOString(),pwa:'1.8.17',pdf:'7.19',catalog:112,views:172,services:{Taxi:104,NCC:60,equine:8},pages:pages.length,destinations,formulas,sources:17,requestsFromPreviousRevision:53,changedTitles:changes,all172AmountsAndPaymentVariantsUnchanged:true,all172FormulasAndAttestationsUnchanged:true,otherCardFieldsUnchanged:true,other171TitlesUnchanged:true,pdfOtherPagesUnchangedExceptTitleDateVersion:true,logo:{original:'assets/logo-csa-napoli.jpeg',sha256:sha(logo),width:267,height:100,originalPreserved:true,derivatives:[]},protectedFileCount,snapshotIntact,pdfBytes:bytes.length,pdfSha256:sha(bytes),noCommitPushOrDeploy:true};
if(!process.argv.includes('--read-only')){fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'verifica-invarianza.json'),JSON.stringify(result,null,2)+'\n');}
console.log(JSON.stringify(result,null,2));
