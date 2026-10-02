import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import sharp from 'sharp';

const root=resolve(import.meta.dirname,'..');
const asset=name=>resolve(root,'assets',name);
const html=await readFile(resolve(root,'index.html'),'utf8');
const worker=await readFile(resolve(root,'sw.js'),'utf8');
const manifest=JSON.parse(await readFile(resolve(root,'manifest.webmanifest'),'utf8'));
const expected=[
  ['icon-192.png',192,'any'],['icon-512.png',512,'any'],
  ['icon-maskable-192.png',192,'maskable'],['icon-maskable-512.png',512,'maskable']
];
assert.deepEqual(manifest.icons.map(icon=>[icon.src.split('/').at(-1),Number(icon.sizes.split('x')[0]),icon.purpose]),expected);
assert.equal(manifest.id,'/prontuario-taxi-ncc-napoli/');
for(const [name,size] of [...expected.map(([name,size])=>[name,size]),['apple-touch-icon.png',180],...([16,32,48].map(size=>[`favicon-${size}.png`,size]))]){
  const info=await sharp(asset(name)).metadata();
  assert.equal(info.width,size,name);assert.equal(info.height,size,name);
  assert.match(worker,new RegExp(name.replace('.','\\.')));
}
for(const name of ['favicon.ico','favicon-16.png','favicon-32.png','favicon-48.png','apple-touch-icon.png'])assert.ok(html.includes(`assets/${name}`));

for(const size of [192,512]){
  const {data,info}=await sharp(asset(`icon-maskable-${size}.png`)).raw().toBuffer({resolveWithObject:true});
  let outsideArtwork=0,white=0,red=0;
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){
    const i=(y*size+x)*info.channels,r=data[i],g=data[i+1],b=data[i+2];
    if(info.channels===4)assert.equal(data[i+3],255,`Sfondo maskable opaco ${size}`);
    const distance=Math.hypot(x+.5-size/2,y+.5-size/2);
    const salient=(r>110&&r>g*1.35)||(r>160&&g>160&&b>160);
    if(distance>size*.4&&salient)outsideArtwork++;
    if(distance<size*.4&&r>180&&g>180&&b>180)white++;
    if(distance<size*.4&&r>140&&r>g*1.5)red++;
  }
  assert.equal(outsideArtwork,0,`Ritaglio circolare maskable ${size}`);
  assert.ok(white>size*size*.015&&red>size*size*.001,`Lettere e accenti visibili ${size}`);
}
const favicon16=(await sharp(asset('favicon-16.png')).raw().toBuffer({resolveWithObject:true}));
let bright=0;
for(let i=0;i<favicon16.data.length;i+=favicon16.info.channels)if(favicon16.data[i]>150&&favicon16.data[i+1]>150)bright++;
assert.ok(bright>=35,'Il favicon 16 px deve mantenere contrasto sufficiente');
const ico=await readFile(asset('favicon.ico'));
assert.equal(ico.readUInt16LE(0),0);assert.equal(ico.readUInt16LE(2),1);assert.equal(ico.readUInt16LE(4),3);
for(let index=0;index<3;index++){
  const start=6+index*16,size=[16,32,48][index];
  assert.equal(ico.readUInt8(start),size);assert.equal(ico.readUInt8(start+1),size);
  const length=ico.readUInt32LE(start+8),offset=ico.readUInt32LE(start+12);
  assert.deepEqual(ico.subarray(offset,offset+length),await readFile(asset(`favicon-${size}.png`)));
}
console.log('Icone: manifest, Apple, favicon, leggibilità 16 px e zona sicura maskable OK');
