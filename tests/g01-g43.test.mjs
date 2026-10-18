import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
const root=new URL('../',import.meta.url),read=p=>fs.readFileSync(new URL(p,root),'utf8');
const html=read('index.html'),data=JSON.parse(html.split('\n').find(l=>l.startsWith('const DATA=')).slice(11,-1));
const before=JSON.parse(read('revisione/1.8.9/prima.json'));
const input=fs.readFileSync(new URL('revisione-indicazioni-G01-G43.txt',root));
assert.equal(createHash('sha256').update(input).digest('hex'),'f1457cc57eac84857e930f271caf8d2b8bccd9c92b6dc946b59ae165d1dfaa53','Indicazioni originali conservate');
const requested=[...input.toString().matchAll(/Codice\s+(G\d+(?:-\d+)?):/g)].map(m=>m[1]);
assert.equal(requested.length,38);assert.equal(new Set(requested).size,38);
const legacy={},window={};
for(const name of ['static-demos','static-field-suggestions','operative-rules','static-demo-ui','taxi-collettivo','static-catalog','static-catalog-ui'])for(const w of [legacy,window])vm.runInNewContext(read(`scripts/${name}.js`),{window:w});
vm.runInNewContext(read('scripts/revision-g01-g43.js'),{window});
assert.deepEqual(new Set(window.prontuarioRevisionCodes),new Set(requested));
assert.ok(html.includes('src="scripts/revision-g01-g43.js"'));
assert.ok(read('sw.js').includes("'scripts/revision-g01-g43.js'"));
const layout=window.prontuarioStaticLayout(data.catalog,data.manualParts,data.staticPages);
const revised=layout.rows.filter(r=>window.prontuarioRevisionApplies(r.item,r.type));
assert.equal(revised.length,38);assert.equal(layout.rows.length,187);
const helpers={esc:v=>String(v??'').replaceAll('&','&amp;').replaceAll('<','&lt;'),sourceLink:p=>String(p),date:v=>v,normative:i=>i.verbaleRef||i.ref};
const render=(w,item,type)=>type==='Taxi'&&w.prontuarioStaticDemos[item.demoBaseId||item.id]?w.prontuarioStaticDemoBody(item,type,helpers):w.prontuarioCatalogBody(item,type,helpers);
const normalizeItem=item=>JSON.parse(JSON.stringify(item, (key,value)=>['docPage','docPages'].includes(key)?undefined:value));
let preserved=0,combinations=0;
for(const {item,type} of layout.rows){
 const view=window.prontuarioRevisionView(item,type);
 if(!view){
  const old=before.rows.find(r=>r.code===item.code&&r.type===type);assert.ok(old);
  assert.deepEqual(normalizeItem(item),normalizeItem(old.item),`Dati fuori ambito conservati ${item.code}/${type}`);
  if(item.kind!=='collective-reference')assert.equal(render(window,item,type),render(legacy,old.item,type),`Rendering fuori ambito ${item.code}/${type}`);
  preserved++;continue;
 }
 assert.equal(type,'Taxi');assert.ok(requested.includes(item.code));assert.equal(item.payments.length,1);
 const old=before.rows.find(r=>r.code===item.code&&r.type===type);assert.deepEqual(JSON.parse(JSON.stringify(item.payments)),old.item.payments,`Importi, punti e misure invariati ${item.code}`);
 const copy=window.prontuarioRevisionFormula(item),body=render(window,item,type);
 assert.equal(copy,view.parts[0]);assert.equal(view.parts.length,1);assert.equal(view.groups.length,0);
 const originalResponsibility=legacy.prontuarioStaticDemos[item.demoBaseId||item.id]?.responsibility||item.responsibility||'';
 assert.equal(view.responsibility,originalResponsibility,`Responsabilità preservata ${item.code}`);
 assert.match(body,/Campi da completare/);assert.match(body,/Condizioni e verifiche — escluse dalla copia/);
 assert.doesNotMatch(copy,/Modificare|Basta|In particolare:|Norma sanzionatoria|Prescrizione:|se condizione|regolarmente in servizio e disponibile|è ritirat[oa]|è sottoposto|è autorizzato|sono documentati|sarà sottoposto/);
 assert.doesNotMatch(view.normative,/se condizione della licenza verificata/);
 assert.doesNotMatch(body,/Importi applicabili soltanto alla condizione del titolo accertata; non a ogni violazione comunale\./);
 if(!['G01','G02'].includes(item.code))assert.match(copy,/Copia del presente verbale sarà trasmessa all’Ufficio Corso Pubblico\.$/);
 else assert.doesNotMatch(copy,/Corso Pubblico/);
 const ids=Array.from(window.prontuarioRevisionClauses(item));
 for(let mask=0;mask<2**ids.length;mask++){
  const selected=ids.filter((_,i)=>mask&(1<<i)),text=window.prontuarioRevisionFormula(item,selected);
  assert.equal((text.match(/Copia del presente verbale/g)||[]).length,selected.includes('licenza')||['G01','G02'].includes(item.code)?0:1);
  assert.equal(text.includes('è autorizzato'),selected.includes('documento')&&selected.includes('trasferimento'));
  assert.equal(text.includes('Il fermo amministrativo e l’affidamento'),selected.includes('documento')&&selected.includes('fermo'));
  assert.doesNotMatch(text,/è ritirat[oa] e trasmess[oa]|è ritirat[oa] e inviat[oa]|si dispone|si diffida/);
  combinations++;
 }
 if(item.code.startsWith('G05-')){assert.equal(item.group,'');assert.doesNotMatch(view.normative,/Regolamento comunale/);assert.ok(!ids.includes('licenza'));assert.match(window.prontuarioFollowup(item,view.accessories).report,/Comune che ha rilasciato/);}
 if(/^G0[367]-/.test(item.code))assert.ok(!ids.includes('licenza'));
 if(/^G0[3-8]-0[34]$/.test(item.code)){const count=Number(item.code.at(-1))-1;for(let i=1;i<=count;i++)assert.ok(copy.includes(`${i}) verbale n. […]`));}
 if(window.prontuarioIsResidual(item))assert.match(view.notes.join(' '),/specifica condizione della licenza/);
}
assert.equal(preserved,149);
const card=code=>revised.find(r=>r.item.code===code).item;
assert.match(window.prontuarioRevisionView(card('G01'),'Taxi').accessories.cds,/4 a 12 mesi/);
assert.match(window.prontuarioRevisionView(card('G02'),'Taxi').accessories.cds,/Revoca della patente/);
assert.ok(!window.prontuarioRevisionClauses(card('G02')).includes('patente'));
assert.match(window.prontuarioRevisionExamples.G07[0],/assenti/);assert.match(window.prontuarioRevisionExamples.G07[1],/presenti/);
assert.match(window.prontuarioRevisionView(card('G08-01'),'Taxi').notes.join(' '),/predeterminata legittimamente applicabile/);
for(const term of ['€ 5 complessivi','resta uno solo','bagagli','ritorno a vuoto','senza presumere'])assert.ok(window.prontuarioRevisionView(card('G04-01'),'Taxi').notes.join(' ').includes(term),`Revisione tariffaria già approvata: ${term}`);
assert.match(window.prontuarioRevisionView(card('G06-01'),'Taxi').notes.join(' '),/mancata esibizione.*non prova/);
assert.match(window.prontuarioRevisionView(card('G07-01'),'Taxi').notes.join(' '),/I07 rinvia/);
assert.equal(card('G24').title,'Non rispetto dell’ordine di fila nel posteggio');
assert.doesNotMatch(JSON.stringify(card('G24')),/fila (?:dei )?passeggeri|persone esterne|ambito della fila da chiarire/);
for(const row of revised)assert.doesNotMatch(window.prontuarioRevisionFormula(row.item),/CAP|C\.A\.P\.|RCA|cinque giorni|5 giorni/);
console.log(`Revisione G01–G43: 38 codici, 149 schede conservate, ${combinations} combinazioni di attestazioni, presupposti, esempi e copia OK`);
