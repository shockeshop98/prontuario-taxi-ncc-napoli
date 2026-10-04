import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import vm from 'node:vm';

const root=resolve(import.meta.dirname,'..');
const html=await readFile(resolve(root,'index.html'),'utf8');
const data=JSON.parse(html.split('\n').find(line=>line.startsWith('const DATA=')).slice(11,-1));
const worker=await readFile(resolve(root,'sw.js'),'utf8');
const window={};
for(const name of ['scripts/static-demos.js','scripts/taxi-collettivo.js','scripts/static-catalog.js'])
  vm.runInNewContext(await readFile(resolve(root,name),'utf8'),{window},{filename:name});
const c=window.prontuarioTaxiCollettivo;
assert.equal(data.catalog.length,118,'Il catalogo sanzionatorio originario resta invariato');
assert.ok(!data.catalog.some(item=>item.code==='TC01'));
assert.equal(c.item.code,'TC01');
assert.equal(c.item.referenceOnly,true);
assert.equal(c.item.payments.length,0,'La scheda di consultazione non attribuisce importi');
assert.ok(data.manualParts.find(part=>part.type==='taxi').cases.includes(c.item.id));
const layout=window.prontuarioStaticLayout(data.catalog,data.manualParts,data.staticPages);
assert.equal(layout.rows.length,189);
assert.equal(layout.pages[`${c.item.id}/Taxi`],data.staticPages[`${c.item.id}/Taxi`]);
for(const term of ['taxi sharing','collettivo','Alibus','sei euro','6 euro','aeroporto','Capodichino','meno di sette posti'])
  assert.ok(c.item.searchTerms.toLowerCase().includes(term.toLowerCase()),`Sinonimo ${term}`);
assert.equal(c.afterExpiry(new Date('2026-12-31T12:00:00')),false);
assert.equal(c.afterExpiry(new Date('2027-01-01T12:00:00')),true);
assert.match(c.operative.join(' '),/€ 6.*bagagli compresi/);
assert.match(c.operative.join(' '),/meno di sette posti a disposizione dell’utenza/);
assert.match(c.premises.join(' '),/non avviare il tassametro/);
assert.match(c.premises.join(' '),/ricevuta di € 6/);
assert.match(c.limits.join(' '),/cinque minuti.*15 minuti|15 minuti.*cinque minuti/);
for(const code of Object.keys(c.related))assert.ok(layout.rows.some(row=>row.item.code===code&&row.type==='Taxi')||data.catalog.some(item=>item.code===code),`Rinvio ${code}`);
for(const [index,hash] of [[6,'7b00c00d07c3ea75228137861beb64af43d884ff87a3d851017dd56789b3f13a'],[7,'91ae0ba4c7c0cae01dc3717222c915ff140460ed12f7b67d425e36737af4cd18'],[8,'e8aa118e80ee1077305e3a6ec853ecf8c22a5e5497ad50b6cb1a39ae77b926d5']]){
  const source=data.sources[index];
  assert.ok(worker.includes(source.url),`Cache ${source.url}`);
  assert.equal(createHash('sha256').update(await readFile(resolve(root,source.url))).digest('hex'),hash,`Originale ${source.url}`);
  assert.ok(source.pages.length>=3,`Testo ricercabile ${source.url}`);
}
console.log('Taxi collettivo: TC01 senza importi, atti distinti, 8 ricerche, 11 rinvii, 3 originali integri e offline OK');
