import {verifyOriginal} from './private-originals.mjs';
// Verifica i presupposti nuovi, la conservazione della revisione locale e le fonti originali.
import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'),d=JSON.parse(read('index.html').match(/^const DATA=(.*);$/m)[1]),before=JSON.parse(read('revisione/1.8.11/prima-data.json')),initial=JSON.parse(read('revisione/1.8.11/stato-iniziale.json')),w={};
for(const n of ['static-demos','static-field-suggestions','operative-rules','static-demo-ui','taxi-collettivo','static-catalog','static-catalog-ui','revision-g01-g43','revision-seconda-parte','revision-pausa-caldo','revision-equini-835'])vm.runInNewContext(read(`scripts/${n}.js`),{window:w});
const card=c=>d.catalog.find(i=>i.code===c),view=c=>w.prontuarioRevisionView(card(c),card(c).scope==='equina'?'Trazione animale':'Taxi'),changed=new Set(w.prontuarioIntegrationCodes),moneyChanged=new Set(['R39','R40','R41','R42','G49']);
for(const item of d.catalog){if(['R43','R44','R45','R46'].includes(item.code))continue; // Nuova scheda verificata separatamente
const old=before.catalog.find(i=>i.code===item.code);assert.ok(old);if(!moneyChanged.has(item.code))assert.deepEqual(item.payments,old.payments,`Importi conservati da 1.8.10: ${item.code}`);if(!changed.has(item.code))assert.deepEqual(item,old,`Scheda estranea conservata: ${item.code}`);}
for(const code of ['R39','R40','R41','R42']){
 assert.deepEqual(card(code).payments,[['Trazione animale art.70 c.4 secondo periodo','42–173','42','29,40','86,50','Ritiro della licenza']]);
 assert.match(view(code).normative,/art\. 70, comma 4, secondo periodo/);assert.doesNotMatch(view(code).normative,/art\. 86/);
 assert.match(view(code).notes.join(' '),/autore conferma/);assert.match(view(code).notes.join(' '),/nessuna licenza individuale/);
 const clause='La licenza è ritirata e sarà trasmessa all’Ufficio Corso Pubblico.';
 for(const variant of [undefined,...Object.keys(w.prontuarioSecondVariants[code]||{})]){
  const base=w.prontuarioSecondFormula(card(code),variant),executed=w.prontuarioSecondFormula(card(code),variant,false,['ritiro']);
  assert.doesNotMatch(base,/licenza è ritirata/);assert.equal(executed,base.replace('Copia del presente verbale',clause+' Copia del presente verbale'));
 }
 assert.equal(view(code).acts[0].text,clause);assert.match(view(code).acts[0].title,/Solo se ritiro materialmente eseguito/);
 const operators=w.prontuarioFollowup(card(code),view(code).accessories).operators;
 assert.match(operators,/ritirare.*contestualmente.*Ufficio Corso Pubblico del Comune di Napoli entro cinque giorni dal ritiro/);
 assert.match(operators,/termine ex art\. 216 CdS; destinatario organizzativo confermato dall’autore/);
 assert.equal(card(code).acts,operators);assert.equal(card(code).route,'Trazione animale: '+operators);
 assert.match(view(code).notes.join(' '),/indicazione organizzativa confermata dall’autore.*distinta dal testo normativo/);
 assert.match(view(code).notes.join(' '),/non è il destinatario testualmente indicato dall’art\. 216/);
}
assert.match(view('R39').notes.join(' '),/medico veterinario/);assert.match(view('R42').notes.join(' '),/ordinanza tecnica.*non è stata acquisita/i);
assert.match(w.prontuarioSecondFormula(card('G47')),/dalle ore.*alle ore.*30 minuti/);assert.match(view('G47').notes.join(' '),/foto acquisita.*originale ufficiale non reperito/i);
assert.match(view('G48').normative,/3\.D\.2/);assert.match(view('G48').normative,/OD\/2021\/0000298/);assert.match(view('G48').notes.join(' '),/6\/12\/24/);assert.match(view('G48').notes.join(' '),/non sospensione della licenza/);assert.equal(Object.keys(w.prontuarioSecondVariants.G48).length,3);
assert.deepEqual(card('G49').payments,[['CdS art.158 c.2 lett.d e c.5-bis','165–660','165','115,50','330','Rimozione del veicolo']]);assert.match(w.prontuarioFollowup(card('G49'),view('G49').accessories).patentPoints,/2 punti/);assert.match(view('G49').notes.join(' '),/pausa autorizzata/);
assert.equal(w.prontuarioSecondFormula(card('G50')),'Nel servizio taxi collettivo, con il veicolo indicato e C.P. n. […], permaneva in attesa senza partire oltre 15 minuti dall’arrivo dei primi tre passeggeri. Copia del presente verbale sarà inviata all’Ufficio Corso Pubblico.');
assert.match(view('G50').notes.join(' '),/arrivo dei primi tre alle ore.*permanenza senza partenza accertata alle ore/i);assert.match(view('G52').notes.join(' '),/corso Novara.*Arnaldo Lucci.*Beverello/);assert.match(view('G52').notes.join(' '),/documentalmente individuati al punto 2/);
assert.match(view('I09').notes.join(' '),/medesimo titolare nel campo obbligato solidale/);assert.match(view('I09').notes.join(' '),/non prova.*solidale con sé stessa/);assert.match(view('I09').notes.join(' '),/nessuna sanzione al titolare non conducente/);
for(const code of changed)assert.deepEqual(card(code).notes,JSON.parse(JSON.stringify(view(code).notes)),`Note indicizzate coerenti ${code}`);
assert.equal(card('R01').inactive,true);assert.equal(view('R01').status,'Applicabile soltanto dopo l’istituzione e l’attivazione dei punti con apposita segnaletica.');assert.doesNotMatch(w.prontuarioSecondFormula(card('R01'),undefined,true),/Copia del presente verbale/);
const hash=p=>createHash('sha256').update(fs.readFileSync(new URL('../'+p,import.meta.url))).digest('hex');for(const [file,sha]of Object.entries(initial.allegati))verifyOriginal('revisione/fonti-integrative/'+file,sha);
verifyOriginal('revisione/fonti-integrative/od_160419_0463_taxi_collettivo_2019 (1).pdf',hash('allegati/Taxi_Collettivo_OD_1_2019_originale.pdf'));
assert.equal(d.sources.length,before.sources.length+5);assert.equal(d.sources.filter(s=>s.url===before.sources[6].url).length,1);assert.match(d.sources[11].url,/O\.D\._298/);assert.equal(d.sources[11].pages.length,5);
assert.ok(!d.catalog.some(i=>i.code==='G51'));assert.equal(d.catalog.length,before.catalog.length+4);
console.log('Integrazione: art.70 e ritiro, G48 documento e tre alternative, G49 importi/punti, G50 arrivo, G52 stalli, I09 gestionale e R01 inattiva; originali e schede estranee conservati.');
