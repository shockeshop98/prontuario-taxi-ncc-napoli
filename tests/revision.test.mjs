import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import vm from 'node:vm';
import {getDocument} from 'pdfjs-dist/legacy/build/pdf.mjs';

const root=resolve(import.meta.dirname,'..');
const html=await readFile(resolve(root,'index.html'),'utf8');
const data=JSON.parse(html.split('\n').find(line=>line.startsWith('const DATA=')).slice(11,-1));
const catalog=data.catalog;
const legalFields=catalog.map(({id,code,ref,verbaleRef,sanction,payments,responsibility,kind,scope,referenceOnly})=>
  ({id,code,ref,verbaleRef,sanction,payments,responsibility,kind,scope,referenceOnly}));
assert.equal(createHash('sha256').update(JSON.stringify(legalFields)).digest('hex'),
  'e3d723fda5ed10a174bba99fc4c1029cc5fc2c05209c1a7606a54e4224026612',
  'Norme, importi, responsabilità e qualificazioni del catalogo devono restare invariati');
assert.equal(catalog.length,118);
assert.equal(data.prontuario.version,'7.1');
assert.equal(data.sources[3].title,'Prontuario operativo 7.1 · Antonio Balzano');
const window={};
for(const name of ['scripts/static-demos.js','scripts/static-field-suggestions.js','scripts/static-demo-ui.js','scripts/static-catalog.js','scripts/static-catalog-ui.js'])
  vm.runInNewContext(await readFile(resolve(root,name),'utf8'),{window},{filename:name});
const layout=window.prontuarioStaticLayout(catalog,data.manualParts,data.staticPages);
assert.equal(layout.rows.length,185);
assert.equal(layout.indexPageCount,6);
assert.equal(layout.firstCasePage,13);
assert.deepEqual(layout.sections.map(section=>section.rows.length),[111,70,4]);
assert.deepEqual(data.staticPages,JSON.parse(JSON.stringify(layout.pages)));
const casePageCount=Object.values(data.staticPageSpans).reduce((sum,span)=>sum+span,0);
assert.equal(Object.keys(data.staticPageSpans).length,layout.rows.length);
assert.ok(Object.values(data.staticPageSpans).every(span=>span===1),'Una pagina per ciascun caso');
assert.equal(casePageCount,layout.rows.length);
assert.equal(data.manualCommonPages.length,3);
assert.equal(data.manualCommonPages[0],layout.firstCasePage+casePageCount);
assert.equal(data.manualAuditPage,layout.firstCasePage+casePageCount+3);
assert.equal(data.manualVariants.length,185);
for(let index=1;index<=4;index++)assert.equal(
  data.staticPages[`nccserv-fascia-${index}/NCC`],
  data.staticPages[`nccfascia${index}/NCC`],`Rinvio I03-0${index}`);
assert.equal(data.staticPages['esposizionetariffario/Taxi'],data.staticPages['avvisi-fascia-1/Taxi'],'Rinvio I07');
assert.equal(Object.keys(data.manualGuidePages).length,0);
assert.equal(data.manualGuideIndexPage,null);
const finalSentence="Copia del presente verbale verrà inviata all'Ufficio Corso Pubblico.";
const excluded=new Set(['abusivo','abusivo2','abusivoncc','nccbusprima','nccbusreiterata','nccreiterata','nccbusaltro']);
let withFinal=0;
for(const item of catalog){
  assert.ok(item.notes.some(note=>note.startsWith('Segnalazione al Corso Pubblico:')),`Nota Corso Pubblico ${item.code}`);
  const expected=!item.referenceOnly&&item.code!=='I06'&&!excluded.has(item.id);
  assert.equal(item.formula.split(finalSentence).length-1,expected?1:0,`Frase finale del catalogo ${item.code}`);
  if(expected)withFinal++;
}
assert.equal(withFinal,102);
assert.equal(catalog.filter(item=>item.referenceOnly).length,8);

const pdf=await getDocument({
  data:new Uint8Array(await readFile(resolve(root,'allegati/Prontuario_Taxi_NCC_Napoli.pdf'))),
  standardFontDataUrl:resolve(root,'node_modules/pdfjs-dist/standard_fonts')+'/'
}).promise;
assert.equal(pdf.numPages,layout.firstCasePage+casePageCount+5);
assert.equal(data.sources[3].pages.length,pdf.numPages);
const normalize=value=>String(value).normalize('NFC').replace(/\s+/g,'').replace(/\u00ad/g,'');
const pageText=[];
for(let number=1;number<=pdf.numPages;number++){
  const page=await pdf.getPage(number);
  const items=(await page.getTextContent()).items;
  const text=normalize(items.map(item=>item.str).join(' '));
  pageText[number]=text;
  assert.ok(text.includes(normalize('Antonio Balzano')),`Autore mancante a p.${number}`);
  assert.ok(!/PRONTUARIOOPERATIVO(?:6\.|7\.0)|REVISIONE(?:6\.|7\.0)/.test(text),`Vecchio livello di versione nel PDF p.${number}`);
  assert.equal((text.match(new RegExp(normalize(`Pagina ${number}`),'g'))||[]).length,1,`Numerazione PDF p.${number}`);
  assert.ok(!text.includes(normalize('SUPPORTO GUIDATO')),`Vecchia appendice a p.${number}`);
  assert.ok(!text.includes(normalize('Fonte del numero C.P.'))&&!text.includes(normalize('Numero letto nel titolo')),`Suggerimento ovvio p.${number}`);
  if(number>=layout.firstCasePage&&number<data.manualAuditPage){
    for(const item of items.filter(entry=>entry.str.startsWith('• ')&&entry.str.includes('[…]'))){
      assert.ok(Math.hypot(item.transform[0],item.transform[1])>=8.9,`Suggerimento troppo piccolo p.${number}: ${item.str}`);
    }
  }
}
for(const row of layout.rows){
  const {item,type}=row,base=item.demoBaseId||item.id;
  const number=layout.pages[`${item.id}/${type}`],span=data.staticPageSpans[`${item.id}/${type}`];
  const text=Array.from({length:span},(_,offset)=>pageText[number+offset]).join(' ');
  assert.ok(pageText[number].includes(normalize(item.code)),`Codice mancante p.${number}`);
  assert.ok(pageText[number].includes(normalize(item.title))||base==='abusivo'||base==='turno',`Titolo mancante p.${number}`);
  assert.ok(pageText[number].includes(normalize('Normativa violata')),`Normativa p.${number}`);
  assert.ok(pageText[number].includes(normalize('Tabella importi')),`Importi p.${number}`);
  assert.ok(text.includes(normalize('Suggerimenti e note operative')),`Note p.${number}`);
  assert.ok(text.includes(normalize('Altra'))||text.includes(normalize('Altro')),`Voce libera p.${number}`);
  const expectedFinal=!window.prontuarioCatalogIsRelation(item)&&!excluded.has(base);
  assert.equal(text.includes(normalize(finalSentence)),expectedFinal,`Corso Pubblico p.${number} ${item.code}`);
  assert.ok(text.includes(normalize(item.payments[0][1])),`Limiti edittali p.${number} ${item.code}`);
  if(window.prontuarioCatalogIsRelation(item))assert.ok(text.includes(normalize('Testo orientativo per la relazione')));
  const demo=type==='Taxi'?window.prontuarioStaticDemos[item.demoBaseId||item.id]:null;
  const acts=demo?demo.acts:window.prontuarioCatalogActs(item);
  for(const act of acts)assert.ok(text.includes(normalize(act.text)),`Seguito operativo non completo p.${number} ${item.code}: ${act.title}`);
  for(let offset=1;offset<span;offset++)assert.ok(pageText[number+offset].includes(normalize(item.code)),`Rinvio scheda p.${number+offset}`);
}
for(const type of ['Taxi','NCC']){
  const g54=layout.rows.find(row=>row.item.code==='G54'&&row.type===type);
  const text=pageText[layout.pages[`${g54.item.id}/${type}`]];
  assert.ok(text.includes(normalize('Sanzioni accessorie CdS Non previste')),`G54/${type}: comunicazioni escluse dalle accessorie CdS nel PDF`);
  assert.ok(text.includes(normalize('Altre misure e comunicazioni Comunicazioni art. 21, comma 2, L.R. Campania 10/2024')),`G54/${type}: comunicazioni regionali nella riga corretta`);
}
for(const [index,heading] of ['A1','A4','A7'].entries())assert.ok(pageText[data.manualCommonPages[index]].includes(heading),`Appendice operativa ${heading}`);
for(const section of data.manualIndex){
  const page=await pdf.getPage(section.page),links=await page.getAnnotations();
  assert.equal(links.length,section.ids.length,`Indice p.${section.page}`);
  for(let index=0;index<links.length;index++){
    const type=section.type==='equina'?'Trazione animale':section.type==='ncc'?'NCC':'Taxi';
    const target=data.staticPages[`${section.ids[index]}/${type}`];
    assert.equal((await pdf.getPageIndex(links[index].dest[0]))+1,target,`Indice p.${section.page} r.${index+1}`);
  }
}
await pdf.destroy();
console.log('Revisione: 118 voci di catalogo, 185 schede PDF, 6 indici, rinvii I03/I07, versioni pulite, norme, importi e Corso Pubblico OK');
