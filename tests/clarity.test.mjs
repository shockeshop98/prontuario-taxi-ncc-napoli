import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const html=await readFile(new URL('../index.html',import.meta.url),'utf8');
const data=JSON.parse(html.match(/^const DATA=(.*);$/m)[1]);
const context=vm.createContext({completeRegRef:s=>s});
for(const name of ['caseNormativeRef','caseFormula'])vm.runInContext(html.split('\n').find(l=>l.startsWith(`function ${name}(`)),context);
for(const x of data.catalog){
 for(const type of ['Taxi','NCC']){
  context.item=x;context.type=type;
  const ref=vm.runInContext('caseNormativeRef(item,type)',context);
  if(ref.includes('CdS'))assert.ok(!ref.includes('L.R.'),`${x.id}: richiamo regionale nel riferimento CdS`);
 }
 if(x.kind==='taxi3')assert.match(x.responsibility,/art\.86 c\.3.*titolare/);
 if(x.kind==='local')assert.ok(!x.responsibility?.includes('destinatario è il titolare'));
 assert.ok(x.notes.some(n=>n.startsWith('Segnalazione al Corso Pubblico:')));
 assert.ok(!x.notes.some(n=>n.startsWith('Redazione del testo:')));
}
const refusal=data.catalog.find(x=>x.id==='rifiuto');
assert.match(refusal.formula,/il conducente \[GENERALITÀ\] rifiutava/);
assert.match(refusal.responsibility,/Se|se diverso/);
assert.ok(refusal.legalBackground.some(t=>t.includes('art.20')));
const taxi86=data.catalog.filter(x=>x.kind==='taxi3');
assert.equal(taxi86.length,6);
for(const x of taxi86)assert.match(x.responsibility,/conducente.*titolare della licenza/);
for(const id of ['nccserv','nccpubblico','nccfascia1','nccfascia2','nccfascia3','nccfascia4']){
 const x=data.catalog.find(item=>item.id===id);
 assert.match(x.responsibility,/conducente.*titolare dell’autorizzazione/);
}
assert.match(data.catalog.find(x=>x.id==='norole').verbaleRef,/L\.R\./);
assert.ok(html.includes('scripts/static-catalog-ui.js'));
assert.ok(!html.includes('src="scripts/guide-ui.mjs"'));
assert.ok(!html.includes('id="guidedPanel"'));
console.log('Chiarezza: responsabilità specifiche, 118 note, riferimenti CdS senza LR e consultazione statica OK');
