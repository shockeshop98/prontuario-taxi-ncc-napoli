import {verifyOriginal} from './private-originals.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
const root=new URL('../',import.meta.url);
const read=p=>fs.readFileSync(new URL(p,root),'utf8');
const data=JSON.parse(read('index.html').split('\n').find(l=>l.startsWith('const DATA=')).slice(11,-1));
const window={};
for(const name of ['static-demos','static-field-suggestions','operative-rules','static-demo-ui','taxi-collettivo','static-catalog','static-catalog-ui'])vm.runInNewContext(read(`scripts/${name}.js`),{window});
const layout=window.prontuarioStaticLayout(data.catalog,data.manualParts,data.staticPages);
const audit=JSON.parse(read('revisione/1.8.6/controllo-schede.json')).schede;
assert.equal(audit.length,187);
const rank=s=>/CdS|Codice della strada/i.test(s)?0:/L\.?\s*21\s*\/\s*1992|D\.Lgs\.|D\.L\.|L\.\s*689/.test(s)?1:/Regolamento comunale|\bReg\./i.test(s)?2:3;
for(const {item,type} of layout.rows){
 if(['R43','R44','R45','R46'].includes(item.code))continue; // Nuova scheda con audit 1.8.12, verificata in pausa-caldo.test.mjs

 const id=item.code+'/'+type,row=audit.find(r=>r.codice+'/'+r.servizio===id);
 assert.ok(row,`Copertura audit ${id}`);
 const before=JSON.parse(read('revisione/1.8.10/prima.json')).find(r=>r.item.code===item.code&&r.type===type);
 assert.equal(row.pagina_pdf,before.page,'Destinazione storica conservata');
 const refs=window.prontuarioOrderedReferences(window.prontuarioNormative(item,type));
 const ranks=Array.from(refs,rank);assert.deepEqual(ranks,[...ranks].sort((a,b)=>a-b),`Ordine ${id}`);
 if(item.kind==='collective-reference')continue;
 const demo=type==='Taxi'?window.prontuarioStaticDemos[item.demoBaseId||item.id]:null;
 const accessory=demo?window.prontuarioDemoAccessories(demo,item.demoVariant):window.prontuarioCatalogAccessorySections(item,type);
 const f=window.prontuarioFollowup(item,accessory);
 if(item.group)assert.match(f.report,/Segnalazione obbligatoria all’ufficio competente/);
 assert.equal(f.operators.includes('ritiro obbligatorio della licenza'),['c','d'].includes(item.group),`Ritiro comunale ${id}`);
 assert.doesNotMatch(row.formula_copiabile,/è stato|è stata|si dispone|si diffida|Corso Pubblico|diffida alla prima|sospensione 15\/30\/60|cinque giorni per le difese/i,`Copia ${id}`);
 assert.ok(row.presupposti&&row.fonti_e_articoli&&row.correzioni,`Motivazione ${id}`);
 const copy=row.formula_copiabile;
 const firstCds=copy.search(/CdS/),firstL21=copy.search(/L\.?\s*(?:n\.\s*)?21\s*\/\s*1992/),firstReg=copy.search(/Regolamento comunale/);
 if(firstCds>=0&&firstL21>=0)assert.ok(firstCds<firstL21,`Ordine CdS/L21 anche nella formula ${id}`);
 if(firstL21>=0&&firstReg>=0)assert.ok(firstL21<firstReg,`Ordine L21/regolamento nella formula ${id}`);
 if(firstCds>=0&&firstReg>=0)assert.ok(firstCds<firstReg,`Ordine CdS/regolamento nella formula ${id}`);
 if(window.prontuarioIsResidual(before.item))assert.match(row.dubbi_residui,/circolazione in servizio/);
}
const item=code=>layout.rows.find(r=>r.item.code===code&&r.type==='Taxi')?.item||layout.rows.find(r=>r.item.code===code)?.item;
assert.equal(window.prontuarioCatalogIsRelation(item('G24')),false);
assert.match(item('G24').ref,/lett\. g/);assert.match(item('G24').title,/ordine di fila nel posteggio/);
assert.match(item('G24').notes.join(' '),/specifica condizione della licenza resta un presupposto/);
assert.equal(window.prontuarioCatalogIsRelation(item('G28-01')),false);
assert.equal(item('G28-01').group,'a');
for(const c of ['G28-02','G28-03','G28-04']){
 assert.equal(window.prontuarioCatalogIsRelation(item(c)),true,c);
 assert.doesNotMatch(window.prontuarioNormative(item(c),'Taxi'),/lett\. n/);
}
assert.match(window.prontuarioStaticCatalog.T01.options.join(' '),/giorno precedente/);
assert.match(window.prontuarioLegalText(item('N10'),'NCC'),/art\.180 c\.7/);
assert.match(window.prontuarioOfficeGuide,/cinque giorni per le difese/);
assert.match(window.prontuarioOfficeGuide,/Taxi e NCC/);
for(const s of JSON.parse(read('revisione/1.8.6/fonti.json'))){
 if(s.file)verifyOriginal(s.file,s.sha256);
 if(s.stato.startsWith('Non acquisita'))assert.ok(!s.sha256,`Nessuna acquisizione fittizia ${s.id}`);
}
console.log('Revisione 1.8.6: 187 esiti documentati, ordine, presupposti, G24/G28, obblighi, copia e integrità fonti OK');
