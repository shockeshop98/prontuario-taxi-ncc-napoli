#!/usr/bin/env node
// Rigenera le pagine delle schede del PDF normale e conserva l'apparato
// introduttivo, l'indice e le fonti del PDF precedente.
import {readFile, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {chromium} from 'playwright-core';
import {PDFDocument, PDFName, StandardFonts, rgb} from 'pdf-lib';
import {getDocument} from 'pdfjs-dist/legacy/build/pdf.mjs';

const root = resolve(import.meta.dirname, '..');
const pdfPath = resolve(root, 'allegati/Prontuario_Taxi_NCC_Napoli.pdf');
const html = await readFile(resolve(root, 'index.html'), 'utf8');
const dataLine = html.split('\n').find(line => line.startsWith('const DATA='));
if (!dataLine) throw Error('DATA non trovato in index.html');
const data = JSON.parse(dataLine.slice('const DATA='.length, -1));
const byId = new Map(data.catalog.map(item => [item.id, item]));
const variants = data.manualVariants.toSorted((a, b) => a.page - b.page);
const guidePack = JSON.parse(await readFile(resolve(root, 'data/guide-operative.json'), 'utf8'));
const guideById = new Map(guidePack.guides.map(guide => [guide.id, guide]));
const basePageCount = 186;
const indexRowsPerPage = 42;
const guideIndexPages = Math.ceil(variants.length / indexRowsPerPage);
const guidesPerPage = 2;
const guidePageCount = Math.ceil(variants.length / guidesPerPage);
const guideStart = basePageCount + guideIndexPages + 1;
const guidePages = {};
if (variants.length !== 166 || variants[0].page !== 16 || variants.at(-1).page !== 183) {
  throw Error('Mappa del PDF inattesa: controllare manualVariants prima della rigenerazione');
}
for (const variant of variants) {
  const item = byId.get(variant.id);
  if (!item || item.docPages?.[variant.type] !== variant.page) throw Error(`Pagina incoerente: ${variant.id} ${variant.type}`);
}
if (guideById.size !== 118 || guidePack.guides.length !== 118) throw Error('Pacchetto guide incompleto');
for (const [index, variant] of variants.entries()) {
  const guide = guideById.get(variant.id);
  if (!guide || guide.code !== byId.get(variant.id).code || !guide.variants[variant.type]) throw Error(`Guida PDF incoerente: ${variant.id} ${variant.type}`);
  guidePages[`${variant.id}/${variant.type}`] = guideStart + Math.floor(index / guidesPerPage);
}
data.manualGuidePages = guidePages;
data.manualGuideIndexPage = basePageCount + 1;

const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const label = type => ({taxi:'Taxi', ncc:'NCC', equina:'Trazione animale'})[type];
const regulation = 'Regolamento comunale (delibera C.C. n. 80/2005), ';
function normative(item, type) {
  let ref = item.verbaleRef || item.ref;
  if (item.kind === 'local' && item.scope === 'all' && !item.noTitle) {
    ref = ref.replace('Taxi: CdS art.86 c.3-bis; NCC: CdS art.85 c.4-ter (se condizione del titolo verificata)',
      type === 'ncc' ? 'CdS art.85 c.4-ter (se condizione dell’autorizzazione verificata)' : 'CdS art.86 c.3-bis (se condizione della licenza verificata)');
  }
  return ref.replace(/\bReg\.\s*(?:(artt?\.)\s*)?(?=\d)/g, (_, art) => regulation + (art || 'art.') + ' ');
}
function formula(item, type) {
  let value = item.formula || '';
  if (item.topic !== 'equina' && item.scope === 'all') {
    value = value.replaceAll('[C.P. n. / autorizzazione n.] [TITOLO]', type === 'ncc' ? 'autorizzazione n. [AUTORIZZAZIONE]' : 'C.P. n. [CP]');
  }
  return value.replaceAll('[TAXI/NCC]', type === 'ncc' ? 'NCC' : 'taxi');
}
function section(title, body, className = '') {
  return `<section class="block ${className}"><h3>${escapeHtml(title)}</h3>${body}</section>`;
}
function paragraph(value, className = '') { return `<p class="${className}">${escapeHtml(value)}</p>`; }
function paymentTable(item, type) {
  let rows = item.payments || [];
  if (item.scope === 'all' && item.kind === 'local') rows = rows.map(row => [row[0].replace('Taxi art.86 c.3-bis / NCC art.85 c.4-ter', type === 'ncc' ? 'NCC art.85 c.4-ter' : 'Taxi art.86 c.3-bis'), ...row.slice(1)]);
  const head = ['Base / fascia','Min–max €','PMR €','Entro 5 gg €','Oltre 60 gg €','Misure'];
  return `<table><thead><tr>${head.map(cell => `<th>${escapeHtml(cell)}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table>`+
    (item.paymentNotes || []).map(note => paragraph(note, 'detail')).join('');
}
function staticTemplate(template, fields) {
  return template.replace(/\{\{([a-z0-9_]+)\}\}/g, (_, id) => `[${id === 'license_cp' ? 'CP' : fields.find(field => field.id === id)?.label || id}]`);
}
function guidedFormula(variant) {
  const decision = variant.licenseDecision;
  return section('Testo orientativo del verbale · scegliere una sola condizione',
    paragraph('Usare soltanto il ramo confermato. La sola mancata esibizione o una verifica pendente consentono soltanto la relazione sui fatti accertati.', 'detail') +
    paragraph(staticTemplate(variant.baseTemplate, variant.fields), 'formula') +
    decision.choices.map(choice => `<p class="formula"><b>${escapeHtml(choice.label)}:</b> ${escapeHtml(staticTemplate(choice.verbaleTemplate, choice.fields))}</p>`).join('')) +
    section('Blocchi da riportare soltanto per atti eseguiti', `<ul>${variant.acts.map(act => `<li><b>${escapeHtml(act.label)}:</b> ${escapeHtml(staticTemplate(act.template, act.fields))}</li>`).join('')}</ul>`);
}
function dualFormula(variant) {
  const decision=variant.dualCheckDecision;
  return section('Testo orientativo · verifiche indipendenti',
    paragraph(decision.caution, 'detail')+
    decision.checks.map(check => `<p class="formula"><b>${escapeHtml(check.label)}:</b> ${check.choices.map(choice => escapeHtml(choice.label)).join(' · ')}.</p>`).join('')+
    paragraph(staticTemplate(variant.baseTemplate,variant.fields),'formula')+
    paragraph('Per ciascuna verifica riportare soltanto l’esito confermato e i relativi riscontri. Il dettaglio è nella guida PDF.', 'detail'))+
    section('Blocchi da riportare soltanto per atti eseguiti', `<ul>${variant.acts.map(act => `<li><b>${escapeHtml(act.label)}:</b> ${escapeHtml(staticTemplate(act.template,act.fields))}</li>`).join('')}</ul>`);
}
function casePage(variant) {
  const item = byId.get(variant.id), type = variant.type;
  const guided=guideById.get(item.id)?.variants[type];
  const details = (item.notes || [item.note]).filter(Boolean);
  const money = section('Sanzione pecuniaria e misure', paragraph(item.sanction) + paymentTable(item, type));
  const body = [
    `<div class="eyebrow">${escapeHtml(item.code)} <span>· ${escapeHtml(label(type).toUpperCase())}</span>${item.pages?.length ? ` <span>· GIT p.${item.pages.join(', ')}</span>` : ''}${item.group ? ` <span>· GRUPPO ${escapeHtml(item.group.toUpperCase())}</span>` : ''}</div>`,
    `<h1>${escapeHtml(item.title)}</h1>`,
    paragraph(normative(item, type), 'introRef'),
    `<div class="metric"><strong>${escapeHtml(item.ui.value)}</strong><span>${escapeHtml(item.ui.detail)}</span></div>`,
    money,
    item.responsibility ? section('Chi risponde della violazione', paragraph(item.responsibility)) : '',
    section('Riferimento normativo', paragraph(normative(item, type))),
    guided?.licenseDecision ? guidedFormula(guided) : guided?.dualCheckDecision ? dualFormula(guided) : section(item.referenceOnly ? 'Testo orientativo per la relazione' : 'Testo orientativo del verbale', paragraph(formula(item, type), 'formula')),
    `<div class="twocol">${section('Accertamenti e documenti', paragraph(item.facts))}${section('Da acquisire', paragraph(item.documents))}</div>`,
    section('Suggerimenti', `<ul>${(item.suggestions || []).map(note => `<li>${escapeHtml(note)}</li>`).join('')}</ul>`),
    section('Note operative', `<ul>${details.map(note => `<li>${escapeHtml(note)}</li>`).join('')}</ul>`),
    section('Atti e seguito', paragraph(item.route)),
    item.legalBackground?.length ? section('Approfondimento regionale · distinto dalla contestazione CdS', `<ul>${item.legalBackground.map(note => `<li>${escapeHtml(note)}</li>`).join('')}</ul>`) : '',
    `<p class="sourceFoot">Fonti: ${escapeHtml((item.sources || []).join(', '))}. ${item.pages?.length ? `GIT p.${item.pages.join(', ')}. ` : ''}Legenda p.10. Gli atti compiuti vanno registrati separatamente.</p>`
  ].join('');
  return `<article class="page" data-page="${variant.page}" data-code="${escapeHtml(item.code)}"><header><b>CONTROLLI TAXI E NCC NAPOLI</b><span>PRONTUARIO OPERATIVO 6.9</span></header><main class="content">${body}</main><footer><span>A cura dell’Agente Antonio Balzano · U.O. San Lorenzo<br>2 ottobre 2026&nbsp; | &nbsp;Revisione proposta per validazione interna</span><span>Pagina ${variant.page}</span></footer></article>`;
}
function guideHeader(page, title, body, className = '') {
  return `<article class="page ${className}" data-page="${page}"><header><b>CONTROLLI TAXI E NCC NAPOLI</b><span>PRONTUARIO OPERATIVO 6.9 · SUPPORTO GUIDATO</span></header><main class="content"><h1>${escapeHtml(title)}</h1>${body}</main><footer><span>A cura dell’Agente Antonio Balzano · U.O. San Lorenzo<br>2 ottobre 2026&nbsp; | &nbsp;Guide in bozza da verificare nel caso concreto</span><span>Pagina ${page}</span></footer></article>`;
}
function guideIndexPage(index) {
  const start = index * indexRowsPerPage;
  const rows = variants.slice(start, start + indexRowsPerPage).map((variant, row) => {
    const item = byId.get(variant.id);
    return `<tr><td>${escapeHtml(item.code)}</td><td><a href="#guide-${start + row}">${escapeHtml(item.title)}</a></td><td>${escapeHtml(label(variant.type))}</td><td>${guidePages[`${variant.id}/${variant.type}`]}</td></tr>`;
  }).join('');
  const intro = index === 0 ? '<p>Le pagine di supporto guidato presentano suggerimenti statici: situazione, elementi da verificare, limite del singolo riscontro e categoria di ufficio da verificare. La scheda completa resta nell’indice iniziale.</p>' : '';
  return guideHeader(basePageCount + index + 1, `Indice del supporto guidato · ${index + 1}/${guideIndexPages}`, `${intro}<table class="guideIndex"><thead><tr><th>Codice</th><th>Casistica</th><th>Servizio</th><th>Pagina</th></tr></thead><tbody>${rows}</tbody></table>`, 'guideIndexPage');
}
function guideCard(variant, index) {
  const item = byId.get(variant.id), guide = guideById.get(variant.id);
  return `<section class="guideCard" id="guide-${index}"><div class="eyebrow">${escapeHtml(item.code)} · ${escapeHtml(label(variant.type))} · Scheda PDF p.${variant.page}</div><h2>${escapeHtml(item.title)}</h2><p class="guideDraft">Guida operativa in bozza · verificare i presupposti nel caso concreto</p>${[
    ['Situazione esemplificativa', guide.scenario.text],
    ['Quando ricorre', guide.applicability.when],
    ['Non basta', guide.applicability.notEnough],
    ['Verifica prima', guide.applicability.verifyFirst],
    ['Ufficio o categoria da verificare', guide.officeHelp.category],
    ['Oggetto dell’interlocuzione', guide.officeHelp.request],
    ...(guide.variants[variant.type].licenseDecision ? [['Scelta dello stato del titolo', guide.variants[variant.type].licenseDecision.staticGuidance]] : []),
    ...(guide.variants[variant.type].dualCheckDecision ? [['Verifiche indipendenti', guide.variants[variant.type].dualCheckDecision.staticGuidance]] : []),
    ...((guide.variants[variant.type].licenseDecision?.normativeReview || guide.variants[variant.type].dualCheckDecision?.normativeReview) ? [['Verifica normativa e limite operativo', guide.variants[variant.type].licenseDecision?.normativeReview || guide.variants[variant.type].dualCheckDecision?.normativeReview]] : [])
  ].map(([title, value]) => `<div class="guidePoint"><b>${escapeHtml(title)}.</b> ${escapeHtml(value)}</div>`).join('')}</section>`;
}
function guideContentPage(index) {
  const batch = variants.slice(index * guidesPerPage, (index + 1) * guidesPerPage);
  return guideHeader(guideStart + index, 'Supporto guidato · casi e verifiche', batch.map((variant, row) => guideCard(variant, index * guidesPerPage + row)).join(''), 'guideContentPage');
}
const style = `@page{size:A4;margin:0}*{box-sizing:border-box}html,body{margin:0;padding:0;color:#142d42;font-family:Arial,"DejaVu Sans",sans-serif}.page{position:relative;width:210mm;height:296.9mm;break-after:page;overflow:hidden;background:white}.page:last-child{break-after:auto}.page header{position:absolute;top:6.5mm;left:18mm;right:18mm;display:flex;justify-content:space-between;border-bottom:1px solid #193d58;padding-bottom:2mm;font-size:7.3pt;letter-spacing:.02em}.page header span{color:#506577}.content{position:absolute;top:22mm;left:18mm;right:18mm;bottom:20mm;font-size:var(--text-size,8.5pt);line-height:1.21;overflow:visible}.content h1{font-size:1.65em;line-height:1.1;margin:1.5mm 0 1mm;color:#143650}.content h3{font-size:1em;line-height:1.15;margin:0 0 .7mm;color:#1e5977}.content p{margin:.1mm 0 .7mm}.content .introRef{color:#425a6a;font-weight:600;margin-bottom:1.6mm}.eyebrow{font-weight:bold;color:#13546e;letter-spacing:.045em}.eyebrow span{font-weight:normal}.metric{display:flex;gap:3mm;align-items:baseline;padding:1mm 1.6mm;background:#edf5f7;border-left:2px solid #27768d}.metric span{color:#4b6575}.block{margin-top:1.4mm}.block .formula{font-weight:600;line-height:1.26}.twocol{display:grid;grid-template-columns:1fr 1fr;gap:3mm}.content ul{padding-left:4mm;margin:.2mm 0 0}.content li{margin:0 0 .65mm;padding-left:.2mm}.content li::marker{color:#26718a}.content table{border-collapse:collapse;width:100%;table-layout:fixed;font-size:.92em;line-height:1.15;margin:.7mm 0}.content th,.content td{border:1px solid #b9cbd2;padding:.65mm .7mm;text-align:left;vertical-align:top;overflow-wrap:anywhere}.content th{background:#edf4f6}.content th:first-child{width:18%}.content th:last-child{width:21%}.detail{color:#4a6170}.sourceFoot{border-top:1px solid #c7d3d8;padding-top:1mm;margin-top:1.3mm!important;color:#526571}.page footer{position:absolute;left:18mm;right:18mm;bottom:6.4mm;display:flex;justify-content:space-between;border-top:1px solid #cbd7dd;padding-top:1.4mm;font-size:7pt;line-height:1.35;color:#506577}.page footer span:last-child{white-space:nowrap}`;
const guideStyle = `.guideIndexPage .content{font-size:8.5pt}.guideIndexPage .content h1{margin-bottom:2mm}.guideIndexPage .content p{margin-bottom:2.5mm}.guideIndex{font-size:8pt!important;line-height:1.08!important}.guideIndex th,.guideIndex td{padding:.58mm .7mm!important}.guideIndex th:first-child{width:10%}.guideIndex th:nth-child(3){width:17%}.guideIndex th:last-child{width:9%}.guideContentPage .content{font-size:9pt;line-height:1.25}.guideCard{border:1px solid #c6d5dc;border-left:3px solid #26718a;padding:3mm;margin:3mm 0 5mm;break-inside:avoid}.guideCard h2{font-size:12pt;margin:1mm 0}.guideDraft{color:#7b4c17;font-weight:bold;margin-bottom:2mm!important}.guidePoint{margin:1.5mm 0}.guidePoint b{color:#1e5977}`;
const sheet = `<!doctype html><html lang="it"><head><meta charset="utf-8"><style>${style}${guideStyle}</style></head><body>${variants.map(casePage).join('')}${Array.from({length:guideIndexPages},(_,i)=>guideIndexPage(i)).join('')}${Array.from({length:guidePageCount},(_,i)=>guideContentPage(i)).join('')}</body></html>`;

const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || chromium.executablePath(), headless:true, args:['--no-sandbox']});
let generatedBytes;
try {
  const page = await browser.newPage();
  await page.setContent(sheet, {waitUntil:'load'});
  const tooTall = await page.evaluate(() => {
    const failed = [];
    for (const article of document.querySelectorAll('.page')) {
      const content = article.querySelector('.content');
      for (let size = 8.5; size >= (article.classList.contains('guideContentPage') ? 9 : article.classList.contains('guideIndexPage') ? 8.5 : 6.5); size -= .2) {
        if (article.classList.contains('guideContentPage') || article.classList.contains('guideIndexPage')) break;
        content.style.setProperty('--text-size', `${size.toFixed(1)}pt`);
        if (content.scrollHeight <= content.clientHeight + 1) break;
      }
      if (content.scrollHeight > content.clientHeight + 1) failed.push(`${article.dataset.page} ${article.dataset.code}: ${content.scrollHeight}/${content.clientHeight}px`);
    }
    return failed;
  });
  if (tooTall.length) throw Error('Testi oltre il margine di pagina: ' + tooTall.join(', '));
  generatedBytes = await page.pdf({format:'A4', preferCSSPageSize:true, printBackground:true, margin:{top:0,right:0,bottom:0,left:0}});
} finally { await browser.close(); }

const generated = await PDFDocument.load(generatedBytes);
if (generated.getPageCount() !== variants.length + guideIndexPages + guidePageCount) throw Error(`Stampa: ${generated.getPageCount()} pagine inattese`);
const original = await PDFDocument.load(await readFile(pdfPath));
if (original.getPageCount() < basePageCount) throw Error(`PDF di partenza inatteso: ${original.getPageCount()} pagine`);
const output = await PDFDocument.create();
const oldPages = await output.copyPages(original, Array.from({length:basePageCount}, (_, i) => i));
const newPages = await output.copyPages(generated, Array.from({length:generated.getPageCount()}, (_, i) => i));
for (let i = 0; i < 186; i++) output.addPage(i >= 15 && i <= 182 && i !== 109 && i !== 178 ? newPages[variants.findIndex(v => v.page === i + 1)] : oldPages[i]);
for (let i = variants.length; i < newPages.length; i++) output.addPage(newPages[i]);

// I riferimenti interni delle pagine indice vengono ricreati verso le nuove
// pagine, poiché la copia di un'annotazione conserva il riferimento al vecchio PDF.
for (let index = 0; index < data.manualIndex.length; index++) {
  const page = output.getPage(index + 1);
  const annotations = page.node.Annots();
  const ids = data.manualIndex[index].ids;
  if (!annotations || annotations.size() !== ids.length) throw Error(`Indice ${index + 2}: link inattesi`);
  for (let row = 0; row < ids.length; row++) {
    const target = byId.get(ids[row])?.docPages?.[data.manualIndex[index].type];
    if (!target) throw Error(`Indice senza destinazione: ${ids[row]}`);
    const annotation = output.context.lookup(annotations.get(row));
    annotation.set(PDFName.of('Dest'), output.context.obj([output.getPage(target - 1).ref, PDFName.of('XYZ'), 0, 841.89, 0]));
    annotation.delete(PDFName.of('A'));
  }
}
for (let index = 0; index < guideIndexPages; index++) {
  const page = output.getPage(basePageCount + index);
  const annotations = page.node.Annots();
  const rows = variants.slice(index * indexRowsPerPage, (index + 1) * indexRowsPerPage);
  if (!annotations || annotations.size() !== rows.length) throw Error(`Indice guide ${index + 1}: link inattesi`);
  for (let row = 0; row < rows.length; row++) {
    const target = guidePages[`${rows[row].id}/${rows[row].type}`];
    const annotation = output.context.lookup(annotations.get(row));
    annotation.set(PDFName.of('Dest'), output.context.obj([output.getPage(target - 1).ref, PDFName.of('XYZ'), 0, 841.89, 0]));
    annotation.delete(PDFName.of('A'));
  }
}

// Le pagine non relative alle schede mantengono impaginazione e contenuti
// originali. Si aggiorna soltanto la dicitura editoriale di versione/data.
const regular = await output.embedFont(StandardFonts.Helvetica);
const bold = await output.embedFont(StandardFonts.HelveticaBold);
for (let i = 0; i < 186; i++) {
  if (i >= 15 && i <= 182 && i !== 109 && i !== 178) continue;
  const page = output.getPage(i);
  page.drawRectangle({x:220,y:811,width:125,height:16,color:rgb(1,1,1)});
  page.drawText('PRONTUARIO OPERATIVO 6.9',{x:222.62,y:815.689,size:8,font:bold,color:rgb(.08,.2,.29)});
  page.drawRectangle({x:50,y:17,width:61,height:13,color:rgb(1,1,1)});
  page.drawText('2 ottobre 2026',{x:51.1,y:20.789,size:7.5,font:regular,color:rgb(.28,.37,.44)});
  if (i === 0) {
    page.drawRectangle({x:50,y:329,width:152,height:17,color:rgb(1,1,1)});
    page.drawText('REVISIONE 6.9   /   2 OTTOBRE 2026',{x:51.1,y:333.589,size:9,font:bold,color:rgb(.08,.2,.29)});
  }
}
output.setTitle('Prontuario operativo Taxi, NCC e trazione animale Napoli · 6.9');
output.setAuthor('Antonio Balzano · U.O. San Lorenzo');
output.setSubject('Revisione dei testi orientativi del 2 ottobre 2026');
const outputBytes = await output.save();
await writeFile(pdfPath, outputBytes);
// Keep the in-app full-text search synchronized with the revised attachment.
const searchable = await getDocument({data:new Uint8Array(outputBytes),standardFontDataUrl:resolve(root,'node_modules/pdfjs-dist/standard_fonts')+'/'}).promise;
const sourcePages=[];
for(let number=1;number<=searchable.numPages;number++){
  const page=await searchable.getPage(number);
  // Le pagine introduttive riusate hanno la vecchia dicitura sotto il riquadro
  // bianco: nell'indice ricercabile conserviamo soltanto la versione visibile.
  sourcePages.push((await page.getTextContent()).items.map(item=>item.str).join(' ')
    .replaceAll('PRONTUARIO OPERATIVO 6.1','PRONTUARIO OPERATIVO 6.9')
    .replaceAll('PRONTUARIO OPERATIVO 6.2','PRONTUARIO OPERATIVO 6.9')
    .replaceAll('PRONTUARIO OPERATIVO 6.3','PRONTUARIO OPERATIVO 6.9')
    .replaceAll('PRONTUARIO OPERATIVO 6.4','PRONTUARIO OPERATIVO 6.9')
    .replaceAll('PRONTUARIO OPERATIVO 6.5','PRONTUARIO OPERATIVO 6.9')
    .replaceAll('PRONTUARIO OPERATIVO 6.6','PRONTUARIO OPERATIVO 6.9')
    .replaceAll('PRONTUARIO OPERATIVO 6.7','PRONTUARIO OPERATIVO 6.9')
    .replaceAll('PRONTUARIO OPERATIVO 6.8','PRONTUARIO OPERATIVO 6.9')
    .replaceAll('REVISIONE 6.1','REVISIONE 6.9')
    .replaceAll('REVISIONE 6.2','REVISIONE 6.9')
    .replaceAll('REVISIONE 6.3','REVISIONE 6.9')
    .replaceAll('REVISIONE 6.4','REVISIONE 6.9')
    .replaceAll('REVISIONE 6.5','REVISIONE 6.9')
    .replaceAll('REVISIONE 6.6','REVISIONE 6.9')
    .replaceAll('REVISIONE 6.7','REVISIONE 6.9')
    .replaceAll('REVISIONE 6.8','REVISIONE 6.9'));
}
data.sources[3].pages=sourcePages;
await writeFile(resolve(root,'index.html'),html.replace(dataLine,'const DATA='+JSON.stringify(data)+';'));
await searchable.destroy();
console.log(`PDF normale rigenerato: ${output.getPageCount()} pagine, ${variants.length} schede e guide statiche, indici e autore su ogni pagina.`);
