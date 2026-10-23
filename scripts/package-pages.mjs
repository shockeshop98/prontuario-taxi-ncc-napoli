// Pubblica soltanto i percorsi approvati; non copia la radice del repository.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const root=path.resolve(import.meta.dirname,'..');
const files=JSON.parse(fs.readFileSync(path.join(root,'pages-files.json'),'utf8'));
assert.equal(new Set(files).size,files.length);
const excluded=/(?:EGAF_Art86_originale\.pdf|WhatsApp Image|verbale_cartaceo|diciture prontuario|ESEMPI_RICEVUTE_TARIFFE_1\.8\.2|RAPPORTO_REVISIONE_1\.8\.[23]|stato-iniziale|prima-data|prima-viste|node_modules|\.git\/|\.bak$|\.key$|\.pem$)/i;
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
const core=[...sw.match(/const CORE = \[(.*?)\];/s)[1].matchAll(/'([^']+)'/g)].map(m=>m[1]);
const data=JSON.parse(fs.readFileSync(path.join(root,'index.html'),'utf8').match(/^const DATA=(.*);$/m)[1]);
for(const file of [...core,...data.sources.map(s=>s.url),'sw.js','version.json'])assert.ok(files.includes(file),`Dipendenza mancante: ${file}`);
const out=path.join(root,'_site');
assert.ok(!fs.existsSync(out),'La directory _site deve essere assente: conservarla o spostarla prima di rigenerare.');
const report={version:JSON.parse(fs.readFileSync(path.join(root,'version.json'),'utf8')),files:[]};
for(const file of files){
 assert.ok(!excluded.test(file)&&!path.isAbsolute(file)&&!file.split('/').includes('..'),`Percorso non pubblicabile: ${file}`);
 const input=path.join(root,file);assert.ok(fs.lstatSync(input).isFile()&&!fs.lstatSync(input).isSymbolicLink(),file);
 const bytes=fs.readFileSync(input),target=path.join(out,file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(input,target);
 report.files.push({path:file,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});
}
fs.writeFileSync(path.join(out,'.nojekyll'),'');
fs.writeFileSync(path.join(out,'publication-manifest.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({files:files.length,version:report.version,pdf:report.files.find(f=>f.path==='allegati/Prontuario_Taxi_NCC_Napoli.pdf')},null,2));
