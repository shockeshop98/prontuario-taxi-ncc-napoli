// Rigenera la tabella documentale; gli esiti motivati sono redatti in valutazioni.json,
// non dedotti dal solo superamento dei test o dalla presenza di un URL.
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..'),out=resolve(root,'revisione/1.8.6');
const data=JSON.parse(fs.readFileSync(resolve(root,'index.html'),'utf8').split('\n').find(l=>l.startsWith('const DATA=')).slice(11,-1));
const window={};
for(const name of ['static-demos','static-field-suggestions','operative-rules','static-demo-ui','taxi-collettivo','static-catalog','static-catalog-ui'])vm.runInNewContext(fs.readFileSync(resolve(root,`scripts/${name}.js`),'utf8'),{window});
const layout=window.prontuarioStaticLayout(data.catalog,data.manualParts,data.staticPages);
const judgments=JSON.parse(fs.readFileSync(resolve(out,'valutazioni.json'),'utf8'));
const sources=JSON.parse(fs.readFileSync(resolve(out,'fonti.json'),'utf8'));
const sourceById=new Map(sources.map(s=>[s.id,s]));
const regPages={4:[4],5:[5,6],6:[6],7:[6,7],8:[7],14:[9,10],15:[10],16:[10],17:[10,11],18:[11],19:[12],21:[13],22:[13,14],23:[14,15,16],24:[16],25:[16],26:[16],27:[16,17],28:[17],29:[17,18],30:[18],31:[18,19],32:[19],33:[19],34:[19],35:[19],36:[19],37:[20],38:[20],39:[20],40:[20]};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const decode=s=>s.replaceAll('&quot;','"').replaceAll('&#39;',"'").replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&');
const corrected=new Set(['G24','G28-01','G28-02','G28-03','G28-04','R01','R10','R14','R16','R35','R36','R37','R38','T01','N10','N09','G52','G53']);
const extraSources={G18:['SCORTA'],G23:['TURNI'],G46:['OS11'],G47:['OS11'],G48:['OD3'],G49:['OS11','CDS158'],G10:['CDS193'],N10:['CDS180'],N11:['DI226','CC163'],R28:['D422'],R42:['EQUINA'],TC01:['DGC634'],G28:['SERVIZIO_TAXI']};
const rows=layout.rows.map(({item,type})=>{
 const base=item.staticModelCode||item.demoBaseCode||item.code;
 assert.ok(judgments[base],`Valutazione manuale mancante ${base}`);
 const refs=window.prontuarioNormative(item,type);
 const regulatory=[...refs.matchAll(/Regolamento comunale[^;]*?art\.\s*(\d+)/g)].flatMap(m=>regPages[m[1]]||[]);
 const pages=[...new Set([...(item.regPages||[]),...regulatory,...(item.group?[16,17,18,19]:[])])].sort((a,b)=>a-b);
 const ids=[...new Set([...(item.sources||[]),...(extraSources[base]||[]),...(refs.includes('L.21/1992')?['L21']:[]),...(item.group?['REG']:[]),...(type==='NCC'&&refs.includes('CdS art.85')?['CDS85']:[]),...(['G28-01','G28-02','G28-03','G28-04'].includes(base)?['SERVIZIO_TAXI','DD_RICEVUTA']:[])])];
 const sourceDetails=ids.map(id=>{const s=sourceById.get(id);assert.ok(s,`Fonte senza stato ${id}`);return `${id}: ${s.stato}; ${s.consultazione}; ${s.url||s.file||''}`;});
 const relation=window.prontuarioCatalogIsRelation(item),collective=item.kind==='collective-reference';
 const demo=type==='Taxi'?window.prontuarioStaticDemos[item.demoBaseId||item.id]:null;
 const accessory=collective?{cds:'Non attribuite'}:demo?window.prontuarioDemoAccessories(demo,item.demoVariant):window.prontuarioCatalogAccessorySections(item,type);
 const followup=window.prontuarioFollowup(item,accessory);
 const body=collective?'':demo?window.prontuarioStaticDemoBody(item,type,{esc,sourceLink:()=>'',date:v=>v}):window.prontuarioCatalogBody(item,type,{esc,sourceLink:()=>'',date:v=>v});
 const parts=[...body.matchAll(/data-copy-text="([^"]*)"/g)].map(m=>decode(m[1]));
 const copy=parts.map((p,i)=>p+(i<parts.length-1?' […].':'')).join(' ');
 const residual=window.prontuarioIsResidual(item);
 const gaps=ids.filter(id=>!/^(Acquisita|Acquisito|Locale)/.test(sourceById.get(id).stato));
 const doubts=[residual?'Condizione del titolo, circolazione in servizio, esclusione ipotesi più specifiche; coordinamento LR10 art.21 c.5/TUEL7-bis/reg.29 c.3.':'',relation?'Scheda di riferimento/relazione: non attesta una fattispecie sanzionatoria già qualificata.':'',gaps.length?'Fonti non verificate integralmente in questa revisione: '+gaps.join(', ')+'.':'',refs.includes('Regolamento')?'Testo comunale successivo al parere ART57/2026: approvazione/efficacia non accertate; confermare con il Comune.':''].filter(Boolean).join(' ');
 return {codice:item.code,servizio:type,pagina_pdf:layout.pages[`${item.id}/${type}`],titolo:item.title,
  esito:corrected.has(base)?'Corretta con motivazione; limiti indicati':relation?'Corretta come consultazione, non validazione sanzionatoria':residual?'Condotta/rinvio riscontrati; applicazione CdS condizionata':'Corretta nei riscontri disponibili; adeguamento comune del seguito',
  fattispecie:item.facts||item.title,riferimenti_ordinati:refs,norma_sanzionatoria:relation?'Non attribuita automaticamente; eventuali importi solo ipotesi':window.prontuarioLegalText(item,type),
  importi:collective?'Nessuna sanzione; tariffa servizio €6':JSON.stringify(item.payments[0]),presupposti:judgments[base],
  accessorie_cds:collective?'Nessuna attribuita':followup.cds,adempimenti:collective?'Consultazione dei dispositivi, non formula di contestazione':followup.operators,segnalazione:collective?'Da qualificare per la singola condotta':followup.report,
  competenza:collective?'Comune, secondo gli atti del servizio':followup.office,
  fonti_e_articoli:sourceDetails.join(' | '),pagine_regolamento:pages.join(', '),pagine_git:(item.pages||[]).join(', '),
  correzioni:judgments[base]+' Adeguamenti trasversali: ordine fonti; obblighi/sanzioni distinti; adempimenti con stato, provvedimenti ufficio esclusi dalla copia.',
  dubbi_residui:doubts,formula_copiabile:copy};
});
assert.equal(rows.length,187);assert.equal(new Set(rows.map(r=>r.codice+'/'+r.servizio)).size,187);
fs.writeFileSync(resolve(out,'controllo-schede.json'),JSON.stringify({data:'2026-10-10',pwa:'1.8.6',pdf:'7.8',limite:'Controllo documentale, non attestazione di vigenza assoluta né qualificazione di fatti reali.',schede:rows},null,2)+'\n');
const headers=Object.keys(rows[0]),quote=v=>'"'+String(v??'').replaceAll('"','""')+'"';
fs.writeFileSync(resolve(out,'controllo-schede.csv'),'\uFEFF'+[headers,...rows.map(r=>headers.map(k=>r[k]))].map(r=>r.map(quote).join(';')).join('\n')+'\n');
console.log(`Audit documentale: ${rows.length} schede, ${Object.keys(judgments).length} valutazioni motivate, ${sources.length} fonti registrate.`);
