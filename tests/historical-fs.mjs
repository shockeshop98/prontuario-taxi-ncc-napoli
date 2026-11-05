// Regressioni 1.8.13: oggetti Git della precedente pubblicazione, senza copie iniziali nel pacchetto.
// Le prove correnti restano pwa.test.mjs e terza-parte.test.mjs.
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
export const root=fileURLToPath(new URL('../',import.meta.url));
export const baseline=JSON.parse(fs.readFileSync(new URL('./release-baseline.json',import.meta.url),'utf8'));
const cache=new Map();
export function readBaseline(name,encoding){
  assert.ok(Object.hasOwn(baseline.files,name),'File non previsto nel contratto storico: '+name);
  if(!cache.has(name)){
    const bytes=execFileSync('git',['show',baseline.revision+':'+name],{cwd:root,maxBuffer:64*1024*1024});
    assert.equal(createHash('sha256').update(bytes).digest('hex'),baseline.files[name],'Oggetto storico alterato: '+name);
    cache.set(name,bytes);
  }
  return encoding?cache.get(name).toString(encoding):Buffer.from(cache.get(name));
}
function historicalRead(input,options){
  const name=input instanceof URL?fileURLToPath(input):String(input),relative=path.relative(root,path.resolve(name)).split(path.sep).join('/');
  if(Object.hasOwn(baseline.files,relative))return readBaseline(relative,typeof options==='string'?options:options?.encoding);
  return fs.readFileSync(input,options);
}
export default new Proxy(fs,{get(target,key){return key==='readFileSync'?historicalRead:target[key];}});
export const readFile=async(file,options)=>historicalRead(file,options);
