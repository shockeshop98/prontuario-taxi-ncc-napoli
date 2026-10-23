import {verifyOriginal} from './private-originals.mjs';
import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'),d=JSON.parse(read('index.html').match(/^const DATA=(.*);$/m)[1]),before=JSON.parse(read('revisione/1.8.12/prima-data.json')),initial=JSON.parse(read('revisione/1.8.12/stato-iniziale.json')),w={};
for(const n of ['static-demos','static-field-suggestions','operative-rules','static-demo-ui','taxi-collettivo','static-catalog','static-catalog-ui','revision-g01-g43','revision-seconda-parte','revision-pausa-caldo','revision-equini-835'])vm.runInNewContext(read(`scripts/${n}.js`),{window:w});
const card=c=>d.catalog.find(i=>i.code===c),layout=w.prontuarioStaticLayout(d.catalog,d.manualParts,d.staticPages);
assert.deepEqual(d.catalog.filter(i=>!before.catalog.some(o=>o.code===i.code)).map(i=>i.code),['R43','R44','R45','R46']);assert.equal(layout.rows.length,190);assert.equal(d.catalog.length,119);
for(const old of before.catalog){const now=card(old.code);assert.deepEqual(now.payments,old.payments,`Tabelle precedenti conservate ${old.code}`);if(!['G46','G47'].includes(old.code))assert.deepEqual(now,old,`Scheda estranea conservata ${old.code}`);}
for(const code of ['G46','G47']){
 const item=card(code),v=w.prontuarioRevisionView(item,'Taxi'),notes=v.notes.join(' ');
 for(const pattern of [/almeno cinque stalli/,/non più di due tassisti/,/trenta minuti/,/ultimi due posti disponibili/,/disco.*(?:sul )?parabrezza/,/scali aeroportuali e ferroviari/,/segnaletica orizzontale e verticale/,/prot\. n\. 11 del 7 giugno 2010/,/1003 dell’8 giugno 2010/,/originale ufficiale non reperito/i])assert.match(notes,pattern,code);
 assert.doesNotMatch(notes,/nell’ultimo posto|non è verificato|secondo l’indicazione operativa confermata/);
 assert.equal(item.formula,w.prontuarioSecondFormula(item));assert.deepEqual(item.notes,JSON.parse(JSON.stringify(v.notes)));assert.equal(item.sourceIndices.length,1);
}
assert.match(w.prontuarioSecondFormula(card('G46'),'posizione'),/ultimi due posti disponibili/);assert.match(w.prontuarioSecondFormula(card('G46')),/sul parabrezza/);
const item=card('R43'),view=w.prontuarioRevisionView(item,'Trazione animale'),notes=view.notes.join(' '),follow=w.prontuarioFollowup(item,view.accessories);
assert.match(view.normative,/art\.7-bis/);assert.doesNotMatch(view.normative,/art\. ?70|art\. ?86/);
assert.deepEqual(item.payments,[['TUEL art.7-bis; L.689/1981 art.16','25–500','50','Non previsto','Rapporto ex art.17 L.689/1981','Nessuna accessoria CdS']]);
assert.match(notes,/presupposti congiunti/i);assert.match(notes,/12–16.*almeno una condizione.*≥30.*oppure.*2\/3/);assert.match(notes,/Fuori fascia o stagione questo divieto non si applica/);
assert.match(notes,/12 giugno al 15 settembre 2024/);assert.match(notes,/fino all’approvazione consiliare/);assert.match(notes,/esito non esaustivo/);
assert.match(notes,/PMR €50 entro 60 giorni/);assert.match(notes,/doppio di €25 più favorevole/);assert.match(notes,/deliberazione di Giunta ex comma 2/);assert.match(notes,/omettendo l’alternativa del doppio del minimo/);assert.match(notes,/art\.16 della L\.16\/2003.*incongruente/);assert.match(notes,/art\.16 della L\.3\/2003/);
assert.match(notes,/nessuna duplicazione automatica/);assert.match(notes,/specialità ex art\.9/);assert.deepEqual(JSON.parse(JSON.stringify(view.acts)),[]);assert.doesNotMatch(follow.cds,/Ritiro/);assert.match(follow.patentPoints,/Non previsti/);
for(const period of ['2025','2024'])for(const condition of ['temperatura','bollettino','entrambe']){
 const f=w.prontuarioCaldoFormula(item,condition,period);assert.match(f,/giorno \[…\] alle ore \[…\]/);assert.match(f,/fascia 12–16/);assert.match(f,new RegExp('ORDSI/'+period));assert.doesNotMatch(f,/ritirata|PMR|166,67|30%|Suggerimenti/);
 if(period==='2024')assert.match(f,/12 giugno–15 settembre 2024/);else assert.match(f,/1° giugno–15 settembre/);
 if(condition!=='bollettino')assert.match(f,/temperatura atmosferica.*fonte/i);if(condition!=='temperatura')assert.match(f,/bollettino.*Napoli.*giornata.*rischio/i);
 assert.equal((f.match(/in violazione dell’ordinanza/g)||[]).length,1);
}
assert.equal(item.formula,w.prontuarioCaldoFormula(item));assert.match(view.amountsMarkup,/PMR entro 60 giorni/);assert.doesNotMatch(view.amountsMarkup,/Entro 5 giorni|35|166,67/);
assert.equal(d.sources.length,before.sources.length+4);for(let i=0;i<before.sources.length;i++)if(![2,3].includes(i))assert.deepEqual(d.sources[i],before.sources[i]);
for(const [path,sha]of Object.entries(initial.fontiNuove))verifyOriginal(path,sha);
for(const code of ['P-EQ01','P-EQ02','P-EQ03'])assert.ok(!card(code),'Proposte non promosse a schede operative');
assert.match(read('revisione/1.8.12/proposte-OS835.md'),/integrale non acquisito/);
console.log('Pausa/caldo: foto e limiti, unica nuova R43 TUEL, sei varianti, PMR e incongruenze, destinatario R39–R42 e tutte le altre schede conservati; proposte storiche conservate, R44–R46 ora verificate in test autonomo.');
