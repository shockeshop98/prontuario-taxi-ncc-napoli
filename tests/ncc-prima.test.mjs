import fs from './release-1815-fs.mjs';import path from 'node:path';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';import {createHash} from 'node:crypto';import {PDFDocument,PDFName} from 'pdf-lib';
import {loadReview} from '../scripts/review-runtime.mjs';import {read1815} from './release-1815-fs.mjs';
import {read1814,contract} from './release-1814-fs.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)),r=loadReview(root,{read:n=>read1815(n,'utf8')}),old=loadReview(root,{read:name=>read1814(name,'utf8')}),d=r.data,w=r.window,codes=Array.from(w.prontuarioNccPrima.codes);
assert.equal(JSON.parse(fs.readFileSync(path.join(root,'version.json'))).version,'1.8.15');assert.equal(d.prontuario.version,'7.17');assert.equal(codes.length,19);assert.equal(new Set(codes).size,19);
assert.equal(r.views.length,172);assert.deepEqual(Array.from(r.layout.sections,s=>s.rows.length),[103,61,8]);assert.equal(r.views.filter(v=>v.item.kind!=='collective-reference').length,171);
assert.equal(d.sources.length,19);for(let i=0;i<17;i++)if(i!==3)assert.deepEqual(d.sources[i],old.data.sources[i],'Fonte precedente '+i);
let changed=0,unchanged=0;for(const row of r.views){const previous=old.views.find(o=>o.id===row.id&&o.type===row.type);assert.ok(previous);if(row.type==='NCC'&&codes.includes(row.code)){assert.notDeepEqual(JSON.parse(JSON.stringify(row)),JSON.parse(JSON.stringify(previous)));changed++;}else{assert.deepEqual(JSON.parse(JSON.stringify(row)),JSON.parse(JSON.stringify(previous)),'Vista preservata '+row.code+'/'+row.type);unchanged++;}}
assert.equal(changed,19);assert.equal(unchanged,153);
const fold=s=>String(s).normalize('NFKC').replace(/[’‘]/g,"'").replace(/\s+/g,'');
const edition=s=>fold(s.replace(/PRONTUARIO OPERATIVO 7\.1[67]/,'PRONTUARIO OPERATIVO VERSIONE').replace(/[48] novembre 2026/,'DATA REVISIONE'));
const pdf=await PDFDocument.load(fs.readFileSync(path.join(root,'allegati/Prontuario_Taxi_NCC_Napoli.pdf')));assert.equal(pdf.getPageCount(),d.sources[3].pages.length);assert.equal(pdf.getPageCount(),193);
let copies=0,links=0;for(const row of r.views){const text=d.sources[3].pages[row.page-1];assert.ok(row.page>=1&&row.page<=pdf.getPageCount());assert.equal(d.staticPageSpans[row.id+'/'+row.type],1);assert.ok(text.includes(row.code));
 if(row.type!=='NCC'||!codes.includes(row.code)){const previous=old.views.find(v=>v.id===row.id&&v.type===row.type);assert.equal(edition(text),edition(old.data.sources[3].pages[previous.page-1]),'Pagina preservata '+row.code+'/'+row.type);}
 if(row.view)for(const part of row.view.parts)assert.ok(fold(text).includes(fold(part)),'Formula PDF '+row.code+'/'+row.type);
 if(row.type==='NCC'&&codes.includes(row.code)){
  const m=row.model;assert.ok(m.reviewReason&&m.reviewSources.length);assert.doesNotMatch(m.formula,/\blicenza\b|C\.P\.|tassametro|Da trattare con verbale amministrativo/);assert.deepEqual(m.sourceIndices.includes(17),true);
  assert.ok(fold(text).includes(fold(m.ref)),'Riferimenti PDF '+row.code);
  if(m.category!=='pos')assert.ok(fold(text).includes(fold(m.payment[1])),'Importi PDF '+row.code);
  for(let n=0;n<=m.options.length;n++){const f=w.prontuarioTerzaFormula(row.item,'NCC',n),base=n?m.options[n-1].text:m.formula;assert.ok(f.startsWith(base));assert.ok(fold(text).includes(fold(base)),'Alternativa PDF '+row.code+'/'+n);assert.doesNotMatch(f,/è ritirata|è sequestrato|è sospesa|è revocata|Da trattare con verbale amministrativo/);copies++;}
  for(const a of m.acts){const choice=a.category?m.options.findIndex(o=>o.category===a.category)+1:0;assert.ok(choice>=0);assert.ok(w.prontuarioTerzaFormula(row.item,'NCC',choice,[a.id]).includes(a.text));assert.ok(fold(text).includes(fold(a.text)),row.code+' attestazione PDF');}
 }
}
for(const index of d.manualIndex){const a=pdf.getPage(index.page-1).node.Annots();assert.equal(a.size(),index.ids.length);const type=index.type==='taxi'?'Taxi':index.type==='ncc'?'NCC':'Trazione animale';for(let i=0;i<a.size();i++){const dest=pdf.context.lookup(a.get(i)).get(PDFName.of('Dest'));assert.equal(dest.get(0).toString(),pdf.getPage(d.staticPages[index.ids[i]+'/'+type]-1).ref.toString());links++;}}assert.equal(links,172);
const missing=/\b(?:c\.|comma)\s*\d+(?:-(?:bis|ter|quater))?\s+([a-df-z])\b(?!-)/g;for(const [i,p]of d.sources[3].pages.entries()){assert.equal([...p.matchAll(missing)].length,0,'Lettere PDF '+(i+1));assert.doesNotMatch(p,/let\.\s*let\./);}
for(const v of r.views){const body=v.body.replace(/<[^>]*>/g,' ');assert.equal([...body.matchAll(missing)].length,0,'Lettere PWA '+v.code+'/'+v.type);}
const get=code=>r.views.find(v=>v.code===code&&v.type==='NCC'),model=c=>get(c).model;
for(const c of ['G11','G13','G32','R03','R05','R22','R23']){assert.equal(model(c).category,'tuel');assert.doesNotMatch(model(c).ref,/CdS art\.85/);}
for(const c of ['G10','G14','G44','R02']){assert.equal(model(c).category,'tuel');assert.ok(model(c).options.some(o=>o.category==='residual'));assert.match(model(c).ref,/solo nell’alternativa verificata/);}
for(const c of ['G12','I06']){assert.equal(model(c).category,'relation');assert.equal(model(c).payment[1],'Da qualificare');assert.ok(model(c).options.every(o=>o.category==='severe'));}
assert.equal(model('G12').options.length,2);assert.match(model('G12').options[0].text,/sospesa/);assert.doesNotMatch(model('G12').options[0].text,/revocata/);assert.match(model('G12').options[1].text,/revocata/);
assert.ok(model('G14').acts.some(a=>a.id==='ritiro-ufficio'));assert.match(model('G14').notes.join(' '),/puntoI.*possibile sospensione e ritiro/);assert.equal(model('G13').acts.length,0);assert.equal(model('R09').acts.length,0);assert.equal(model('R10').acts.length,0);assert.match(model('G44').acts[0].text,/autorizzazione NCC/);
assert.equal(model('R06').category,'relation');assert.doesNotMatch(model('R06').formula,/dieci giorni/);assert.doesNotMatch(model('R06').title,/dieci giorni/);
for(const c of ['G53','G54']){assert.match(model(c).notes.join(' '),/Indicazione operativa dell’autore: Da trattare con verbale amministrativo \(VV\)/);assert.doesNotMatch(w.prontuarioTerzaFormula(get(c).item,'NCC'),/VV|amministrativo/);}
assert.match(model('G53').formula,/30 \+ 4%/);assert.equal(model('G53').payment[2],'Non ammesso ex art.16 L.689/1981');assert.match(model('G54').notes.join(' '),/1.000/);
for(const n of ['218 c.6','216 c.6','128 c.2','218-ter c.8'])assert.ok(model('G32').notes.join(' ').includes(n),n);
assert.equal(model('R12').options[0].category,'advert');assert.equal(model('R12').options[0].payment[3],'301');assert.match(model('R12').notes.join(' '),/non fonda automaticamente una seconda contestazione/);
const outcomes=JSON.parse(fs.readFileSync(path.join(root,'revisione/1.8.15/esiti-richieste.json')));assert.equal(outcomes.length,19);assert.deepEqual(outcomes.map(q=>q.codice),codes);for(const q of outcomes){assert.ok(q.richiesta&&q.applicata&&q.motivazione&&q.fonti.length&&Object.hasOwn(q,'punto_aperto'));}
const meta=JSON.parse(fs.readFileSync(path.join(root,'revisione/1.8.15/riepilogo.json')));assert.equal(meta.schede,172);assert.equal(meta.pagine_pdf,pdf.getPageCount());assert.equal(meta.destinazioni,links);assert.equal(meta.formule,171);assert.equal(meta.viste_modificate,19);assert.equal(meta.viste_preservate,153);
const originalInput=new URL('../Revisione schede ncc prima parte.txt',import.meta.url);if(fs.existsSync(originalInput))assert.equal(createHash('sha256').update(fs.readFileSync(originalInput)).digest('hex'),meta.input_sha256);
for(const [name,hash]of Object.entries(contract.files))if(/^(allegati|revisione\/fonti-integrative)\//.test(name)&&name!=='allegati/Prontuario_Taxi_NCC_Napoli.pdf')assert.equal(createHash('sha256').update(fs.readFileSync(path.join(root,name))).digest('hex'),hash,'Originale conservato '+name);
const files=JSON.parse(fs.readFileSync(path.join(root,'pages-files.json')));assert.ok(files.includes('scripts/revision-ncc-prima.js'));assert.ok(files.includes(d.sources[17].url)&&files.includes(d.sources[18].url));assert.ok(!files.some(f=>/Revisione schede ncc prima parte|1\.8\.15\/(?:base-|fonti\/|stato-iniziale|prima-viste|richieste-iniziali)/i.test(f)));
console.log(`NCC1.8.15: ${changed} viste aggiornate, ${unchanged} preservate (103Taxi), ${pdf.getPageCount()} pagine, ${links} destinazioni, ${copies} scelte NCC;19esiti, ritiro condizionale e fonti conservate.`);
