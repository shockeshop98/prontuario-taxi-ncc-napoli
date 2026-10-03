import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const root=new URL('../',import.meta.url);
const html=fs.readFileSync(new URL('index.html',root),'utf8');
const data=JSON.parse(html.split('\n').find(line=>line.startsWith('const DATA=')).slice(11,-1));
const window={};
let copied='',activeParts=[];
const context={window,document:{getElementById:()=>({querySelectorAll:()=>activeParts.map(textContent=>({textContent}))})},navigator:{clipboard:{writeText:async text=>{copied=text}}}};
for(const name of ['scripts/static-demos.js','scripts/static-field-suggestions.js','scripts/static-demo-ui.js','scripts/static-catalog.js','scripts/static-catalog-ui.js'])
  vm.runInNewContext(fs.readFileSync(new URL(name,root),'utf8'),context,{filename:name});
const formulaParts=markup=>[...markup.matchAll(/<p class="staticFormulaPart" data-copy-text="([^"]*)">/g)]
  .map(match=>match[1].replaceAll('&quot;','"').replaceAll('&#39;',"'").replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&'));
const covered=new Set([...Object.keys(window.prontuarioStaticCatalog),'I03','I07',...Object.values(window.prontuarioStaticDemos).map(demo=>demo.code)]);
assert.deepEqual(covered,new Set(data.catalog.map(item=>item.code)));
const layout=window.prontuarioStaticLayout(data.catalog,data.manualParts,data.staticPages);
assert.deepEqual(new Set(window.prontuarioEvidenceHintCodes),new Set(Object.keys(window.prontuarioStaticCatalog)));
assert.equal(layout.rows.length,185);
assert.equal(new Set(layout.rows.map(({item,type})=>`${item.id}/${type}`)).size,185);
assert.ok(!layout.rows.some(({item})=>item.code.startsWith('I03-')));
assert.ok(!layout.rows.some(({item})=>item.code==='I07'));
for(let index=1;index<=4;index++)assert.equal(layout.pages[`nccserv-fascia-${index}/NCC`],layout.pages[`nccfascia${index}/NCC`]);
assert.equal(layout.pages['esposizionetariffario/Taxi'],layout.pages['avvisi-fascia-1/Taxi']);
assert.equal(data.catalog.find(item=>item.code==='I07').aliasTo,'G07');
const i03=data.catalog.find(item=>item.code==='I03');
for(let index=0;index<4;index++){
  const canonical=data.catalog.find(item=>item.code===`N0${index+4}`);
  assert.deepEqual(i03.payments[index].slice(1),canonical.payments[0].slice(1),`I03-0${index+1}: importi e accessorie`);
  assert.equal(i03.responsibility,canonical.responsibility,`I03-0${index+1}: responsabilità`);
  assert.equal(i03.ref.replace(' c.4-bis',' c.4-bis lett.'+String.fromCharCode(97+index)),canonical.ref,`I03-0${index+1}: riferimento`);
}
assert.equal(data.manualLegendPage,2+layout.indexPageCount);
assert.equal(data.manualAuditPage,layout.firstCasePage+layout.rows.length+3);
const helpers={esc:value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;'),sourceLink:()=>'',date:value=>value,normative:item=>item.verbaleRef||item.ref};
const finalSentence="Copia del presente verbale verrà inviata all'Ufficio Corso Pubblico.";
for(const {item,type} of layout.rows){
  if(type==='Taxi'&&window.prontuarioStaticDemos[item.demoBaseId||item.id])continue;
  const model=window.prontuarioCatalogModel(item,type);
  assert.equal(item.payments.length,1,`${item.code}: una sola fascia`);
  assert.ok(model.lead.endsWith(':'),`${item.code}: punto da integrare visibile`);
  assert.ok(model.options.length>=2&&model.options.length<=3,`${item.code}: alternative pertinenti`);
  assert.match(model.other,/^(Altra|Altro) .*: \[…\]$/,`${item.code}: ultima voce libera`);
  assert.ok(!/%(?:TITLE(?:_[A-Z]+)?|SUBJECT_TITLE)%/.test(JSON.stringify(model)),`${item.code}: titolo non espanso`);
  const rendered=window.prontuarioCatalogBody(item,type,helpers);
  const accessoryRows=window.prontuarioAccessoryRows(window.prontuarioCatalogAccessorySections(item,type));
  assert.doesNotMatch(accessoryRows.cds,/Seguito dell’ufficio|Seguito competente|Comunicazioni art\./,`${item.code}: seguito non CdS nella riga CdS`);
  if(accessoryRows.other)assert.match(rendered,/Altre misure e comunicazioni<\/th>/,`${item.code}: riga per altra fonte`);
  const headings=['Normativa violata','Tabella importi','Sanzioni accessorie e punti',window.prontuarioCatalogIsRelation(item)?'Testo orientativo per la relazione':'Testo orientativo del verbale','Suggerimenti e note operative'];
  headings.slice(1).forEach((heading,index)=>assert.ok(rendered.indexOf(headings[index])<rendered.indexOf(heading),`${item.code}: ordine ${heading}`));
  assert.equal((rendered.match(/class="staticAmountsTable"/g)||[]).length,1);
  assert.equal((rendered.match(/<tbody><tr>/g)||[]).length,2);
  assert.equal((rendered.match(/class="staticAccessoryTable"/g)||[]).length,1);
  assert.match(rendered,/Decurtazione punti patente<\/th><td>No<\/td>/);
  assert.ok(rendered.includes(model.other));
  const formula=rendered.match(/<div class="formulaText" id="formulaText">(.*?)<\/div>/s)?.[1];
  assert.ok(formula,`${item.code}: formula`);
  assert.equal((formula.match(/class="staticFormulaChoices"/g)||[]).length,1);
  const parts=formulaParts(formula);
  assert.equal(parts.length,2);
  const copy=parts[0]+' […]. '+parts[1];
  const expectedEnding=[window.prontuarioCatalogLegalSentence(item,type),model.tail,window.prontuarioCatalogPrevious(item,type),window.prontuarioCatalogOperational(item),item.formula.includes(finalSentence)&&!window.prontuarioCatalogIsRelation(item)?finalSentence:''].filter(Boolean).join(' ');
  assert.equal(parts[0],model.lead,`${item.code}: formula iniziale invariata`);
  assert.equal(parts[1],expectedEnding,`${item.code}: formula finale invariata`);
  assert.ok(formula.includes(window.prontuarioEvidenceHints(item.demoBaseCode||item.code).title),`${item.code}: fonte del fatto`);
  assert.ok(formula.includes(window.prontuarioEvidenceHints(item.demoBaseCode||item.code).other),`${item.code}: voce libera sul fatto`);
  assert.ok(!formula.includes('Fonte del numero C.P.')&&!formula.includes('Fonte del numero autorizzazione NCC'),`${item.code}: suggerimento superfluo sul numero del titolo`);
  if(/(?:Da accertamento presso|[Pp]recedent[ei] pertinent[ei])/.test(copy)){
    assert.ok(formula.includes('C.O. (Centrale Operativa), consultata il […]'),`${item.code}: C.O. precedenti`);
    assert.ok(formula.includes('U.O. indicata in intestazione, consultata il […]'),`${item.code}: U.O. precedenti`);
    assert.ok(formula.includes('Altro ufficio o fonte consultata: […]'),`${item.code}: fonte libera precedenti`);
  }
  assert.ok(copy.length<1600,`${item.code}: formula troppo lunga (${copy.length})`);
  assert.ok(!copy.includes(model.other),`${item.code}: alternativa copiata`);
  assert.ok(!copy.includes('Solo se eseguito:')&&!copy.includes('Solo se trasmessa:'),`${item.code}: istruzione interna alla formula`);
  assert.ok(!copy.includes('la segnalazione all’Ufficio Verbali per il seguito')&&!copy.includes('la segnalazione al Comune e alla CCIAA'),`${item.code}: trasmissione interna nella formula`);
  const expectedFinal=!window.prontuarioCatalogIsRelation(item)&&item.formula.includes(finalSentence);
  assert.equal(copy.includes(finalSentence),expectedFinal,`${item.code}: frase Corso Pubblico`);
  if(item.staticVariantIndex!==undefined){
    assert.ok(copy.includes('quinquennio'),`${item.code}: riscontro fascia`);
    if(item.staticVariantIndex>0)for(const value of ['verbale',item.staticVariantIndex===1?'fatto del':'fatti del',item.staticVariantIndex===1?'accertato da':'accertati da','riscontro'])assert.ok(copy.includes(value),`${item.code}: dato del precedente ${value}`);
    if(item.staticVariantIndex===0)assert.match(rendered,/Se la verifica è pendente, non attribuire automaticamente la prima violazione/);
  }
  const acts=window.prontuarioCatalogActs(item);
  assert.doesNotMatch(acts.map(act=>act.text).join(' '),/(?:sequestro|fermo|custodia)[^.]*verbale n\. \[…\]/i,`${item.code}: numero inesistente di sequestro o fermo`);
  for(const act of acts)assert.ok(formula.includes(act.text),`${item.code}: atto mancante`);
  assert.equal((rendered.match(/class="staticOperationalUse"/g)||[]).length,acts.length?1:0,`${item.code}: istruzione esterna`);
  assert.equal((rendered.match(/Solo se eseguito:/g)||[]).length,acts.length?1:0,`${item.code}: unica istruzione`);
  assert.ok(!rendered.includes('Diciture per atti effettivamente eseguiti'),`${item.code}: atti duplicati sotto la formula`);
  if(!window.prontuarioCatalogIsRelation(item)&&!['G02','G04','G05','G06','G07','G08','I02'].includes(item.demoBaseCode||item.code))assert.ok(window.prontuarioCatalogLegalSentence(item,type),`${item.code}: disposizione non indicata`);
}
const confiscaProcedure='Il verbale va trasmesso entro 10 giorni al Prefetto del luogo della commessa violazione, ai sensi dell’art. 210, comma 3, CdS.';
for(const code of ['G02','I02','N01','N02','N03','N12']){
  const item=data.catalog.find(value=>value.code===code);
  assert.ok(window.prontuarioCatalogNotes(item,window.prontuarioCatalogModel(item,item.scope==='ncc'?'NCC':'Taxi')).includes(confiscaProcedure),`${code}: procedura PMR non ammesso`);
}
const pos=data.catalog.find(value=>value.code==='G53');
assert.ok(!window.prontuarioCatalogNotes(pos,window.prontuarioCatalogModel(pos,'Taxi')).includes(confiscaProcedure),'POS non equiparato alla confisca CdS');
for(const type of ['Taxi','NCC']){
  const g54=data.catalog.find(item=>item.code==='G54');
  const rows=window.prontuarioAccessoryRows(window.prontuarioCatalogAccessorySections(g54,type));
  assert.equal(rows.cds,'Non previste');
  assert.match(rows.other,/art\. 21, comma 2, L\.R\. Campania 10\/2024/);
  assert.match(window.prontuarioCatalogBody(g54,type,helpers),/Altre misure e comunicazioni<\/th>/);
}
for(const code of ['N04','N05','N06','N07'])assert.match(window.prontuarioCatalogAccessorySections(data.catalog.find(item=>item.code===code),'NCC').other,/Comune e CCIAA/);
assert.equal(window.prontuarioStaticCatalog.N03.options.length,3);
assert.ok(window.prontuarioStaticCatalog.N03.options.every(option=>!option.includes('sospesa o revocata')));
assert.match(window.prontuarioStaticCatalog.G02.tail,/precedente pertinente dello stesso soggetto nel triennio/);
for(const code of ['G04','G05','G06','G08'])assert.doesNotMatch(window.prontuarioStaticCatalog[code].lead,/senza rispettare le disposizioni/,`${code}: condotta specifica nella formula`);
for(const code of ['G13','R03','R05','R22','R23','R29','R30','R31']){
  const item=data.catalog.find(value=>value.code===code);
  for(const type of ['Taxi','NCC'])assert.match(window.prontuarioCatalogModel(item,type).lead,/^(?:La licenza|L’autorizzazione|Il titolare|Per il titolare)/,`${code}/${type}: intestazione naturale`);
}
assert.match(window.prontuarioStaticCatalog.I02.options[0],/veicolo indicato/);
assert.match(window.prontuarioStaticCatalog.N02.tail,/persona interessata dalla conseguenza sulla patente/);
assert.match(window.prontuarioCatalogLegalSentence(data.catalog.find(item=>item.code==='G16'),'Taxi'),/comma 1, lett\. e, e il comma 3/);
assert.match(window.prontuarioCatalogLegalSentence(layout.rows.find(({item})=>item.code==='R33-01').item,'NCC'),/art\. 85, comma 4-bis, lett\. a/);
assert.equal(window.prontuarioCatalogLegalSentence(data.catalog.find(item=>item.code==='I02'),'NCC'),'');
const i06=data.catalog.find(item=>item.code==='I06');
const i06Html=window.prontuarioCatalogBody(i06,'Taxi',helpers);
assert.match(i06Html,/Testo orientativo per la relazione/);
assert.ok(!i06Html.match(/<div class="formulaText" id="formulaText">(.*?)<\/div>/s)?.[1].includes(finalSentence));
for(const code of ['G07-01','G07-02','G07-03','G07-04']){
  const row=layout.rows.find(({item})=>item.code===code);
  assert.ok(row);
  assert.match(window.prontuarioCatalogBody(row.item,'Taxi',helpers),/Il tariffario comunale contiene anche i supplementi/);
  assert.equal(window.prontuarioCatalogActs(row.item).length,1);
  assert.match(window.prontuarioCatalogOperational(row.item),/ritirato.*UMC.*via più breve.*avvertenza.*fermo.*separato verbale/s);
  assert.match(window.prontuarioCatalogOperational(row.item),/luogo indicato dall’interessato/);
  assert.match(window.prontuarioCatalogRoute(row.item),/segnalazione all’Ufficio Verbali/);
}
for(const code of ['N04','N05','N06','N07']){
  const item=data.catalog.find(value=>value.code===code);
  const html=window.prontuarioCatalogBody(item,'NCC',helpers);
  assert.match(html,/Sospensione del documento di circolazione per/);
  assert.ok(!html.includes('>Carta '));
}
const grouped=data.catalog.find(item=>item.code==='G04');
assert.ok(!window.prontuarioCatalogRoute(grouped).includes('Art.29 c.2 lett.d'));
assert.match(window.prontuarioCatalogAccessorySections(grouped,'Taxi').municipal,/Ritiro del titolo ex comma 4 solo se eseguito/);
for(const code of ['G12','N01','N02','N10','N12']){
  const item=data.catalog.find(value=>value.code===code);
  const model=window.prontuarioCatalogModel(item,item.scope==='ncc'?'NCC':'Taxi');
  assert.ok(window.prontuarioCatalogNotes(item,model).every(note=>!note.includes('€')),`${code}: importo ripetuto nelle note`);
}
for(const code of ['R39','R40','R41','R42']){
  const item=data.catalog.find(value=>value.code===code);
  assert.ok(!JSON.stringify(item).toLowerCase().includes('tassista'),`${code}: riferimento improprio al tassista`);
  assert.match(item.route,/trazione animale|cavallo|vettura|razza/);
}
const sample=layout.rows.find(({item})=>item.code==='G04-02');
activeParts=formulaParts(window.prontuarioCatalogBody(sample.item,sample.type,helpers));
await window.copyProntuarioCatalog(()=>{});
assert.equal(copied,activeParts[0]+' […]. '+activeParts[1]);
assert.ok(!copied.includes('Altra difformità'));
console.log('Catalogo statico: 185 casi canonici, alias I03/I07, relazioni, accessorie opzionali, copia e Corso Pubblico OK');
