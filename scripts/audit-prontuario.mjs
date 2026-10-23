// Copertura corrente e rinvii: conserva l'audit normativo storico senza riscriverlo.
import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const release=JSON.parse(read('version.json'));
const d=JSON.parse(read('index.html').match(/^const DATA=(.*);$/m)[1]),w={};
for(const n of ['static-demos','static-field-suggestions','operative-rules','static-demo-ui','taxi-collettivo','static-catalog','static-catalog-ui','revision-g01-g43','revision-seconda-parte','revision-pausa-caldo','revision-equini-835'])vm.runInNewContext(read(`scripts/${n}.js`),{window:w});
const layout=w.prontuarioStaticLayout(d.catalog,d.manualParts,d.staticPages),old=JSON.parse(read('revisione/1.8.6/controllo-schede.json')).schede;
const rows=layout.rows.map(({item,type})=>{
 const inherited=old.find(r=>r.codice===item.code&&r.servizio===type);assert.ok(inherited||['R43','R44','R45','R46'].includes(item.code),`Copertura storica ${item.code}/${type}`);
 const view=w.prontuarioRevisionView(item,type);
 return {codice:item.code,servizio:type,pagina_pdf:layout.pages[item.id+'/'+type],titolo:item.title,riferimenti_ordinati:w.prontuarioNormative(item,type),formula: view?.parts.join(' ')||null,note_mirate:(w.prontuarioSecondApplies(item)||['R43','R44','R45','R46'].includes(item.code))?view.notes:[],verifica:['R44','R45','R46'].includes(item.code)?'Revisione1.8.13: prescrizione confermata dall’autore; regime generale TUEL verificato separatamente, sanzione specifica non acquisita':['G46','G47','R43'].includes(item.code)?'Revisione 23/10/2026: pausa fotografata e ordinanze caldo, rapporto 1.8.12':w.prontuarioSecondApplies(item)?'Integrazione 22/10/2026; riscontri documentali e indicazioni dell’autore nel rapporto 1.8.11':'Nessuna nuova validazione normativa; vedere rapporti precedenti',audit_storico:inherited?{file:'revisione/1.8.6/controllo-schede.json',codice:inherited.codice,servizio:inherited.servizio,pagina_storica:inherited.pagina_pdf}:null};
});
assert.equal(rows.length,190);assert.equal(new Set(rows.map(r=>r.codice+'/'+r.servizio)).size,190);assert.ok(!rows.some(r=>r.codice==='G51'));
const out=new URL('../revisione/'+release.version+'/',import.meta.url);fs.mkdirSync(out,{recursive:true});fs.writeFileSync(new URL('controllo-schede.json',out),JSON.stringify({data:release.updated_at,pwa:release.version,pdf:d.prontuario.version,limite:'Copertura e destinazioni attuali; nuova verifica normativa limitata ai punti del rapporto 1.8.13, senza chiudere dubbi anteriori.',schede:rows},null,2)+'\n');
const quote=s=>'"'+String(s??'').replaceAll('"','""')+'"';fs.writeFileSync(new URL('controllo-schede.csv',out),'codice;servizio;pagina_pdf;verifica\n'+rows.map(r=>[r.codice,r.servizio,r.pagina_pdf,r.verifica].map(quote).join(';')).join('\n')+'\n');
console.log('Copertura corrente: 190 schede, 190 destinazioni; audit storico conservato.');
