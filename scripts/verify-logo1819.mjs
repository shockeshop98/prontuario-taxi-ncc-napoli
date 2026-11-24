// Ridimensionamento CSA: confronto completo con la pubblicazione 1.8.18.
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
import {getDocument,OPS,Util} from 'pdfjs-dist/legacy/build/pdf.mjs';import {PDFDocument,PDFName,PDFRawStream} from 'pdf-lib';import sharp from 'sharp';
import {loadReview} from './review-runtime.mjs';import {read1818} from '../tests/release-1818-fs.mjs';
const root=path.resolve(import.meta.dirname,'..'),out=path.join(root,'revisione/1.8.19'),sha=b=>createHash('sha256').update(b).digest('hex'),plain=x=>JSON.parse(JSON.stringify(x));
const current=loadReview(root),before=loadReview(root,{read:p=>read1818(p,'utf8')}),release=JSON.parse(fs.readFileSync(path.join(root,'version.json')));
assert.equal(release.version,'1.8.19');assert.equal(current.data.prontuario.version,'7.21');assert.equal(current.views.length,172);assert.equal(current.data.catalog.length,112);assert.equal(current.data.sources.length,17);
assert.deepEqual(plain(current.views),plain(before.views),'Tutti i campi, importi, formule, titoli e varianti delle 172 viste devono rimanere invariati');
const expected=plain(before.data);expected.prontuario.version='7.21';expected.sources[2]=plain(current.data.sources[2]);assert.deepEqual(plain(current.data),expected,'Nessun altro dato modificato');
const shell=html=>html.replace(/^const DATA=.*;$/m,'const DATA=__CHECKED__;').replace(/^const SOURCE_META = .*;$/m,'const SOURCE_META = __HASHES__;').replace(/BUILD_ID='[a-f0-9]{64}'/,"BUILD_ID='__BUILD__'");
const expectedShell=shell(before.html).replace('max-width:100%;max-height:138px;justify-self:center','max-width:75%;max-height:103.5px;justify-self:center').replace('.brand img.csaLogo{max-height:104px}','.brand img.csaLogo{max-height:78px}').replaceAll('1.8.18','1.8.19').replace('revisione editoriale del 20/11/2026','revisione editoriale del 24/11/2026');
assert.equal(shell(current.html),expectedShell,'Solo dimensioni CSA e metadati autorizzati nella PWA');
const support='Con il sostegno e la promozione del CSA — Città Metropolitana di Napoli';assert.ok(current.html.includes(support));
const credits=html=>html.match(/<div class="brandCredits">(.*?)<\/div>/s)[1];assert.equal(credits(current.html),credits(before.html));
const logoPath='assets/logo-csa-nuovo.jpeg',logo=fs.readFileSync(path.join(root,logoPath)),meta=await sharp(logo).metadata();assert.equal(meta.width,1146);assert.equal(meta.height,752);
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8'),allowed=JSON.parse(fs.readFileSync(path.join(root,'pages-files.json')));assert.ok(allowed.includes(logoPath));assert.ok(!allowed.includes('assets/logo-csa-napoli.jpeg'));assert.ok(sw.match(/const CORE = \[(.*?)\];/s)[1].includes(logoPath));assert.ok(!sw.includes('logo-csa-napoli.jpeg'));
assert.ok(current.html.includes('src="'+logoPath+'"'));assert.ok(!current.html.includes('logo-csa-napoli.jpeg'));assert.ok(!allowed.some(p=>/EGAF|Revisione .*\.txt|\/base-1\.8|stato-iniziale|prima-viste|WhatsApp|verbale_cartaceo/i.test(p)));
const pdfBytes=fs.readFileSync(path.join(root,'allegati/Prontuario_Taxi_NCC_Napoli.pdf')),oldBytes=read1818('allegati/Prontuario_Taxi_NCC_Napoli.pdf');
const pdf=await getDocument({data:new Uint8Array(pdfBytes)}).promise,oldPdf=await getDocument({data:new Uint8Array(oldBytes)}).promise;assert.equal(pdf.numPages,193);assert.equal(oldPdf.numPages,193);
const pages=[];let destinations=0,formulas=0;
for(let n=1;n<=193;n++){
 const text=(await(await pdf.getPage(n)).getTextContent()).items.map(i=>i.str).join(' '),old=(await(await oldPdf.getPage(n)).getTextContent()).items.map(i=>i.str).join(' ');
 assert.equal(text.replaceAll('7.21','7.20').replaceAll('24 NOVEMBRE 2026','20 NOVEMBRE 2026').replaceAll('24 novembre 2026','20 novembre 2026'),old,'Testo PDF invariato salvo versione, pagina '+n);assert.equal(text,current.data.sources[2].pages[n-1]);assert.doesNotMatch(text,/\bN11\b|nccfoglio|EGAF/i);pages.push(text);
}
for(const index of current.data.manualIndex){const links=await(await pdf.getPage(index.page)).getAnnotations();assert.equal(links.length,index.ids.length);const type=index.type==='taxi'?'Taxi':index.type==='ncc'?'NCC':'Trazione animale';for(let i=0;i<links.length;i++){assert.equal((await pdf.getPageIndex(links[i].dest[0]))+1,current.data.staticPages[index.ids[i]+'/'+type]);destinations++;}}
const fold=s=>s.normalize('NFKC').replace(/[’‘]/g,"'").replace(/\s+/g,'');for(const v of current.views){assert.equal(current.data.staticPageSpans[v.id+'/'+v.type],1);if(v.item.kind!=='collective-reference'){assert.ok(fold(pages[v.page-1]).includes(fold(v.view.parts.join(' '))),v.type+'/'+v.code);formulas++;}}
assert.equal(destinations,172);assert.equal(formulas,171);
async function images(bytes){const doc=await PDFDocument.load(bytes),result=[];for(const [n,page]of doc.getPages().entries()){const objects=page.node.Resources()?.lookup(PDFName.of('XObject'));if(!objects)continue;for(const [,ref]of objects.entries()){const image=doc.context.lookup(ref);if(!(image instanceof PDFRawStream)||String(image.dict.get(PDFName.of('Subtype')))!=='/Image')continue;result.push({page:n+1,width:Number(String(image.dict.get(PDFName.of('Width')))),height:Number(String(image.dict.get(PDFName.of('Height')))),sha256:sha(image.contents)});}}return result;}
const newImages=await images(pdfBytes),oldImages=await images(oldBytes),newCsa=newImages.filter(i=>i.width===1146&&i.height===752);assert.equal(newCsa.length,1);assert.equal(newCsa[0].page,1);assert.deepEqual(newImages,oldImages,'Tutte le immagini PDF originali intatte');assert.equal(newCsa[0].sha256,sha(logo));
async function coverGeometry(doc){
 const op=await(await doc.getPage(1)).getOperatorList(),stack=[],images=[];let matrix=[1,0,0,1,0,0];
 for(let i=0;i<op.fnArray.length;i++){const fn=op.fnArray[i],args=op.argsArray[i];if(fn===OPS.save)stack.push([...matrix]);else if(fn===OPS.restore)matrix=stack.pop();else if(fn===OPS.transform)matrix=Util.transform(matrix,args);else if(fn===OPS.paintImageXObject)images.push({width:args[1],height:args[2],matrix:[...matrix]});}
 return images;
}
const geometry=await coverGeometry(pdf),oldGeometry=await coverGeometry(oldPdf);assert.equal(geometry.length,3);assert.equal(oldGeometry.length,3);
for(let i=0;i<3;i++){const a=geometry[i].matrix,b=oldGeometry[i].matrix;if(i===1){for(const n of [0,3])assert.ok(Math.abs(a[n]/b[n]-.75)<.001,'PDF CSA at 75%');for(const [size,position]of [[0,4],[3,5]])assert.ok(Math.abs(a[position]+a[size]/2-b[position]-b[size]/2)<.5,'PDF CSA center unchanged within Chromium print quantization (0.5 pt)');}else assert.deepEqual(geometry[i],oldGeometry[i],'Other PDF badges same size and position');}
await pdf.destroy();await oldPdf.destroy();
const result={checkedAt:new Date().toISOString(),baseCommit:'1f076e2818c10d34e01da714475289fc3a3decd1',version:release,catalog:112,views:172,pages:193,destinations,formulas,sources:17,all172CardFieldsUnchanged:true,allAmountsAndPaymentVariantsUnchanged:true,allFormulasAndAttestationsUnchanged:true,creditsAndSupportTextUnchanged:true,allPdfTextUnchangedExceptVersion:true,otherPdfLogosUnchanged:true,coverLogoGeometry:{before:oldGeometry,after:geometry,csaScale:.75},logo:{path:logoPath,width:meta.width,height:meta.height,sha256:sha(logo),pdfGraphicOccurrences:newCsa},pdf:{version:'7.21',bytes:pdfBytes.length,sha256:sha(pdfBytes)}};
if(!process.argv.includes('--read-only')){fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'verifica-invarianza.json'),JSON.stringify(result,null,2)+'\n');}console.log(JSON.stringify(result,null,2));
