// Regressione storica 1.8.14; revisione corrente in ncc-prima.test.mjs.
import fs from './release-1814-fs.mjs';
import vm from 'node:vm';
import {baseline,readBaseline} from './historical-fs.mjs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {PDFDocument,PDFName} from 'pdf-lib';
const root=new URL('../',import.meta.url),read=p=>fs.readFileSync(new URL(p,root),'utf8'),html=read('index.html');
const d=JSON.parse(html.match(/^const DATA=(.*);$/m)[1]),before=JSON.parse(readBaseline('index.html','utf8').match(/^const DATA=(.*);$/m)[1]),initial={input:baseline.input,sha256Originali:baseline.files},w={};
for(const name of [...html.matchAll(/<script src="(scripts\/[^"?]+)"/g)].map(m=>m[1]))vm.runInNewContext(read(name),{window:w});
assert.equal(w.prontuarioEditorialText('art.23 c.2 a; art.17 c.1 f; art.31 c.1 a'),'art.23 c. 2 let. a; art.17 c. 1 let. f; art.31 c. 1 let. a');
assert.equal(w.prontuarioEditorialText('c.3-bis; art.13-bis; c.1 let. a, c e f'),'c.3-bis; art.13-bis; c.1 let. a, let. c e let. f');
const calc=vm.runInNewContext('('+html.match(/^function posAmount[^\n]+/m)[0]+')');
for(const [input,expected]of [['0','30,00'],['50','32,00'],['12,50','30,50'],['0.13','30,01'],['1000000','40030,00'],['-1',null],['1,234',null],['abc',null]])assert.equal(calc(input),expected);
const layout=w.prontuarioStaticLayout(d.catalog,d.manualParts,d.staticPages),rows=layout.rows;
assert.equal(d.prontuario.version,'7.16');assert.equal(JSON.parse(read('version.json')).version,'1.8.14');
assert.equal(d.catalog.length,112);assert.equal(rows.length,172);assert.deepEqual(Array.from(layout.sections,s=>s.rows.length),[103,61,8]);
assert.equal(d.prontuario.totalCount,d.catalog.length);assert.equal(d.manualVariants.length,rows.length);assert.equal(d.manualIndex.reduce((n,p)=>n+p.ids.length,0),rows.length);
for(let i=0;i<before.sources.length;i++)if(i!==3)assert.deepEqual(d.sources[i],before.sources[i],'Fonte testuale precedente invariata '+i);
const removed=['R16','T01','G15','G28-03','I08','R29','R31','R36','G51'];
const card=(code,type='Taxi')=>rows.find(r=>r.item.code===code&&r.type===type)?.item;
for(const code of removed){assert.ok(!rows.some(r=>r.item.code===code));assert.ok(!d.catalog.some(i=>i.code===code));}
for(const code of w.prontuarioTerzaRemoved){assert.ok(!w.prontuarioStaticCatalog[code]);assert.ok(!w.prontuarioTaxiCollettivo.related[code]);}
for(const code of Object.keys(w.prontuarioTaxiCollettivo.related))assert.ok(rows.some(r=>r.type==='Taxi'&&(r.item.code===code||r.item.demoBaseCode===code)),'Rinvio TC01 orfano: '+code);
assert.equal(card('I06','Taxi'),undefined);assert.ok(card('I06','NCC'));
const aliases=JSON.parse(html.match(/^const roadAliases=(.*);$/m)[1]);
for(const i of before.catalog.filter(i=>removed.includes(i.code)))assert.ok(!Object.hasOwn(aliases,i.id));
if(fs.existsSync(new URL(initial.input.file,root)))assert.equal(createHash('sha256').update(fs.readFileSync(new URL(initial.input.file,root))).digest('hex'),initial.input.sha256,'TXT originale intatto');
for(const [name,hash]of Object.entries(initial.sha256Originali)){
 assert.equal(createHash('sha256').update(readBaseline(name)).digest('hex'),hash,'Fotografia integra '+name);
 if(/^(allegati|revisione\/fonti-integrative)\//.test(name)&&name!=='allegati/Prontuario_Taxi_NCC_Napoli.pdf')assert.equal(createHash('sha256').update(fs.readFileSync(new URL(name,root))).digest('hex'),hash,'Originale '+name);
}
const forbidden=/\(solo se condizione della licenza verificata\)|Importi applicabili soltanto alla condizione del titolo accertata; non a ogni violazione comunale/;
const missingLetter=/\b(?:c\.|comma)\s*\d+(?:-(?:bis|ter|quater))?\s+([a-df-z])\b(?!-)/g;
const strip=s=>s.replace(/<[^>]+>/g,' ').replaceAll('&nbsp;',' '),compact=s=>s.normalize('NFKC').replace(/\s+/g,'').replace(/[’‘]/g,"'");
const pdf=await PDFDocument.load(fs.readFileSync(new URL('allegati/Prontuario_Taxi_NCC_Napoli.pdf',root)));
assert.equal(pdf.getPageCount(),d.sources[3].pages.length);assert.equal(pdf.getPageCount(),193);
for(const [i,text]of d.sources[3].pages.entries()){assert.equal([...text.matchAll(missingLetter)].length,0,'Lettera senza let. nel PDF p.'+(i+1));assert.doesNotMatch(text,/let\.\s*let\./,'let. duplicato p.'+(i+1));}
let checkedLinks=0,checkedCopies=0;
const audit=[];
for(const {item,type}of rows){
 const page=d.staticPages[item.id+'/'+type];assert.ok(page>0&&page<=pdf.getPageCount());assert.equal(d.staticPageSpans[item.id+'/'+type],1);
 const text=d.sources[3].pages[page-1];assert.match(text,new RegExp(item.code.replaceAll('-','\\-')));
 const view=w.prontuarioRevisionView(item,type),m=w.prontuarioTerzaDefinition(item,type);
 const body=item.kind==='collective-reference'?'':w.prontuarioCatalogBody(item,type,{sourceLink:()=>'',esc:s=>String(s),date:s=>String(s)});
 assert.doesNotMatch(body,forbidden,item.code+'/'+type);assert.doesNotMatch(text,forbidden,item.code+' PDF');
 assert.equal([...strip(body).matchAll(missingLetter)].length,0,'Lettera senza let.: '+item.code+'/'+type+' '+[...strip(body).matchAll(missingLetter)].map(x=>x[0]));
 if(view){
   assert.ok(compact(text).includes(compact(view.normative)),'Riferimenti PDF '+item.code+'/'+type);
   for(const part of view.parts)assert.ok(compact(text).includes(compact(part)),'Formula PDF '+item.code+'/'+type);
 }
 if(m){
   assert.ok(view);assert.equal(view.parts.length,1);assert.equal(view.groups.length,0);
   if(m.category==='pos'){assert.match(text,/30/);assert.match(text,/4%/);}else assert.ok(compact(text).includes(compact(m.payment[1])),'Importi PDF '+item.code+'/'+type);
   const base=w.prontuarioTerzaFormula(item,type);
   assert.doesNotMatch(base,/è ritirata|è ritirato|è sequestrato|è invitato|diffida|è revocata|è sospesa/,'Attestazione automatica '+item.code);
   for(let n=0;n<=m.options.length;n++){
     const copy=w.prontuarioTerzaFormula(item,type,n),expected=n?m.options[n-1].text:m.formula;
     assert.ok(copy.startsWith(expected));assert.doesNotMatch(copy,/Utilizzare la voce|Indicare il tipo|Usare la calcolatrice/);
     if(n&&expected!==m.formula)assert.ok(!copy.includes(m.formula),'Alternative cumulate '+item.code);
     checkedCopies++;
   }
   for(const act of m.acts){
     const choice=act.category?m.options.findIndex(o=>o.category===act.category)+1:0;
     assert.ok(w.prontuarioTerzaFormula(item,type,choice,[act.id]).includes(act.text),item.code+' '+act.id);
     assert.ok(!base.includes(act.text));
   }
   if(type==='NCC'){assert.doesNotMatch(base,/C\.P\.|licenza taxi|tassametro|tariffa predeterminata|turno taxi/);audit.push({code:item.code,type,page,category:m.category,ref:m.ref,payment:m.payment,formula:m.formula,notes:m.notes});}
 }
}
for(const index of d.manualIndex){
 const annots=pdf.getPage(index.page-1).node.Annots();assert.equal(annots.size(),index.ids.length);
 const type=index.type==='taxi'?'Taxi':index.type==='ncc'?'NCC':'Trazione animale';
 for(let n=0;n<index.ids.length;n++){
   const annotation=pdf.context.lookup(annots.get(n)),dest=annotation.get(PDFName.of('Dest'));
   assert.equal(dest.get(0).toString(),pdf.getPage(d.staticPages[index.ids[n]+'/'+type]-1).ref.toString());checkedLinks++;
 }
}
assert.equal(checkedLinks,rows.length);assert.equal(audit.length,61);
const def=(code,type='Taxi')=>w.prontuarioTerzaDefinition(card(code,type),type);
assert.equal(def('G19').category,'document');assert.equal(def('G19').ref,'CdS art.180 cc.3 e7');assert.match(def('G19').notes.join(' '),/banche dati.*impossibilità tecnica/);
assert.deepEqual(Array.from(card('G19').sources),['REV1814']);assert.ok(card('G19').sourceIndices.includes(16));
assert.equal(def('G12').category,'relation');assert.ok(def('G12').options.every(o=>o.category==='severe'));assert.doesNotMatch(def('G12').options[0].text,/sospesa o revocata/);
assert.equal(def('G10').category,'tuel');assert.doesNotMatch(def('G10').ref,/CdS art\.193/);assert.equal(def('G10').acts.length,0);
assert.equal(def('G44').category,'tuel');assert.match(def('G44').notes.join(' '),/responsabilità personale|personalmente/);assert.ok(def('G44').acts.some(a=>a.id==='titolo'));
for(const code of ['G13','G14','R03','R05','R06','R09','R10','R22','R30'])assert.ok(!def(code).acts.some(a=>a.id==='titolo'),code+' ritiro per analogia');
for(const code of ['R35','R37','R38']){assert.equal(def(code).category,code==='R35'?'relation':'tuel');assert.match(def(code).responsibility,/Utente/);assert.doesNotMatch(def(code).ref,/art\.86/);}
assert.equal(def('G53').category,'pos');assert.match(def('G53').formula,/30 \+ 4%/);assert.match(def('G53').notes.join(' '),/Prefetto.*Corso Pubblico/);
assert.equal(def('N09','NCC').category,'document');assert.equal(def('N10','NCC').options[0].category,'employment');
assert.match(def('I05','NCC').notes.join(' '),/07\/02\/2027/);assert.match(def('N09','NCC').notes.join(' '),/31\/12\/2026/);
assert.match(def('N11','NCC').notes.join(' '),/annullamento integrale/);assert.doesNotMatch(def('N11','NCC').ref,/nelle parti vigenti/);
assert.match(def('I06','NCC').notes.join(' '),/diretto o indiretto/);assert.equal(def('I06','NCC').options[0].category,'severe');
for(const code of ['R44','R45','R46']){const v=w.prontuarioRevisionView(card(code,'Trazione animale'),'Trazione animale');assert.match(v.status,/Prescrizione confermata dall’autore/);assert.match(v.notes.join(' '),/Integrale.*non acquisiti/);assert.equal(v.acts.length,0);}
for(const code of ['R39','R40','R41','R42']){const item=card(code,'Trazione animale'),v=w.prontuarioRevisionView(item,'Trazione animale');const f=w.prontuarioFollowup(item,v.accessories);assert.match(f.operators,/Corso Pubblico.*cinque giorni/);assert.doesNotMatch(w.prontuarioSecondFormula(item),/La licenza è ritirata/);assert.match(w.prontuarioSecondFormula(item,null,false,['ritiro']),/La licenza è ritirata e sarà trasmessa all’Ufficio Corso Pubblico/);}
assert.match(w.prontuarioSecondFormula(card('G46')),/parabrezza/);assert.match(w.prontuarioSecondVariants.G46.posizione,/ultimi due posti disponibili/);
const pagesFiles=JSON.parse(read('pages-files.json'));assert.ok(pagesFiles.includes('scripts/revision-terza.js'));assert.ok(!pagesFiles.some(p=>/EGAF_Art86_originale|WhatsApp|revisione testi terza parte|base-1\.8\.13|1\.8\.14\/prima/.test(p)));
const outcomes=JSON.parse(read('revisione/1.8.14/esiti-txt-pubblicabili.json')),requests=baseline.requestIds;assert.equal(outcomes.length,63);assert.deepEqual(outcomes.map(r=>r.id),requests);for(const row of outcomes){assert.ok(['Applicata','Adattata con motivazione'].includes(row.esito));assert.ok(row.motivazione.length>30);}
const nccTable=JSON.parse(read('revisione/1.8.14/controllo-tutte-ncc.json'));assert.equal(nccTable.schede.length,70);assert.equal(nccTable.schede.filter(r=>r.pagina_pdf).length,61);
const evidence=JSON.parse(read('revisione/1.8.14/controlli-statici.json'));for(const [key,value]of Object.entries({version:'1.8.14',pdf:'7.16',cards:rows.length,pages:pdf.getPageCount(),links:checkedLinks,copyVariants:checkedCopies,ncc:61,missingEditorialLetters:0}))assert.equal(evidence[key],value,'Evidenza statica '+key);
console.log(`Regressione storica1.8.14: ${rows.length} schede, ${pdf.getPageCount()} pagine, ${checkedLinks} destinazioni, ${checkedCopies} varianti, 61 NCC, rimozioni e fonti precedenti conservate.`);
