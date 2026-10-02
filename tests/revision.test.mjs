import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {getDocument} from 'pdfjs-dist/legacy/build/pdf.mjs';

const root = resolve(import.meta.dirname, '..');
const html = await readFile(resolve(root, 'index.html'), 'utf8');
const line = html.split('\n').find(value => value.startsWith('const DATA='));
assert.ok(line);
const data = JSON.parse(line.slice('const DATA='.length, -1));
const catalog = data.catalog;
const byId = new Map(catalog.map(item => [item.id, item]));
const finalSentence = "Copia del presente verbale verrà inviata all'Ufficio Corso Pubblico.";
const protectedFields = catalog.map(({formula, notes, ref, verbaleRef, responsibility, legalBackground, checked, ...rest}) => rest);
assert.equal(createHash('sha256').update(JSON.stringify(protectedFields)).digest('hex'),
  'b398e8d194913f94dec3d3cedbf92bf6ce0207054cb6b417655bf7737767b9c7',
  'Importi, qualificazioni, filtri, pagine e referenceOnly devono restare invariati rispetto alla 1.4.1');
assert.equal(catalog.length, 118);
assert.equal(data.prontuario.version, '6.2');
assert.equal(data.sources[3].title, 'Prontuario operativo 6.2 · Antonio Balzano');
assert.ok(data.sources[3].pages.every(text => !/PRONTUARIO OPERATIVO 6\.1|REVISIONE 6\.1/.test(text)),
  'Ricerca nell\'allegato: dicitura della versione precedente');
let withFinal = 0;
for (const item of catalog) {
  assert.ok(item.notes.some(note => note.startsWith('Segnalazione al Corso Pubblico:')), `Nota Corso Pubblico: ${item.code}`);
  const expectedFinal = !item.referenceOnly && !['abusivo', 'abusivo2'].includes(item.id);
  const count = item.formula.split(finalSentence).length - 1;
  assert.equal(count, expectedFinal ? 1 : 0, `Frase finale: ${item.code}`);
  if (expectedFinal) {
    assert.ok(item.formula.endsWith(finalSentence), `Posizione frase finale: ${item.code}`);
    withFinal++;
  }
}
assert.equal(withFinal, 108);
assert.equal(catalog.filter(item => item.referenceOnly).length, 8);
assert.match(html, /x\.referenceOnly\?'Testo per la relazione':'Testo orientativo del verbale'/);

const pdf = await getDocument({
  data:new Uint8Array(await readFile(resolve(root, 'allegati/Prontuario_Taxi_NCC_Napoli.pdf'))),
  standardFontDataUrl:resolve(root, 'node_modules/pdfjs-dist/standard_fonts') + '/'
}).promise;
assert.equal(pdf.numPages, 186);
assert.equal(data.manualVariants.length, 166);
const normalize = value => String(value).normalize('NFC').replace(/\s+/g, '').replace(/\u00ad/g, '');
const variants = new Map(data.manualVariants.map(item => [item.page, item]));
for (let number = 1; number <= pdf.numPages; number++) {
  const page = await pdf.getPage(number);
  const text = normalize((await page.getTextContent()).items.map(item => item.str).join(' '));
  assert.ok(text.includes(normalize('Antonio Balzano')), `Autore mancante a p.${number}`);
  const variant = variants.get(number);
  if (!variant) continue;
  const item = byId.get(variant.id);
  assert.equal(item.docPages[variant.type], number, `Mappa pagina ${item.code}`);
  assert.ok(text.includes(normalize(item.code)), `Codice p.${number}`);
  let formula = item.formula;
  if (item.topic !== 'equina' && item.scope === 'all') {
    formula = formula.replaceAll('[C.P. n. / autorizzazione n.] [TITOLO]', variant.type === 'ncc' ? 'autorizzazione n. [AUTORIZZAZIONE]' : 'C.P. n. [CP]');
  }
  formula = formula.replaceAll('[TAXI/NCC]', variant.type === 'ncc' ? 'NCC' : 'taxi');
  assert.ok(text.includes(normalize(formula)), `Formula incompleta p.${number} ${item.code}`);
  for (const [index, note] of item.notes.entries()) {
    assert.ok(text.includes(normalize(note)), `Nota incompleta p.${number} ${item.code} n.${index + 1}`);
  }
}
for (let index = 0; index < data.manualIndex.length; index++) {
  const page = await pdf.getPage(index + 2);
  const links = await page.getAnnotations();
  const section = data.manualIndex[index];
  assert.equal(links.length, section.ids.length, `Link indice p.${index + 2}`);
  for (let row = 0; row < links.length; row++) {
    const target = byId.get(section.ids[row]).docPages[section.type];
    assert.equal((await pdf.getPageIndex(links[row].dest[0])) + 1, target, `Destinazione indice p.${index + 2} r.${row + 1}`);
  }
}
console.log('Revisione: 118 schede, 108 frasi finali, note Corso Pubblico, 186 pagine PDF, 166 formule complete e indice collegato OK');
