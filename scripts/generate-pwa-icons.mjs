#!/usr/bin/env node
// Generate install, maskable, favicon and Apple icons from the supplied T/N art.
import {readFile, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import sharp from 'sharp';

const assets = resolve(import.meta.dirname, '../assets');
const source = resolve(assets, 'icon-source-tn.png');
const metadata = await sharp(source).metadata();
if (metadata.width !== 1254 || metadata.height !== 1254 || metadata.channels !== 3) {
  throw Error('Sorgente T/N inattesa: controllare dimensioni e trasparenza prima di generare le icone.');
}

const navy = {r:12, g:44, b:74};
const png = async (size, options = {}) => {
  const {maskable = false, favicon = false} = options;
  if (maskable) {
    // Artwork occupies 78% of the canvas. Its furthest vehicle corner then
    // falls within the centered 80%-diameter safe circle, with extra slack.
    const inset = Math.round(size * .11);
    const side = size - 2 * inset;
    const {data,info} = await sharp(source).resize(side, side, {kernel:'lanczos3'})
      .ensureAlpha().raw().toBuffer({resolveWithObject:true});
    const feather = Math.max(4,Math.round(side * .05));
    for (let y = 0; y < side; y++) for (let x = 0; x < side; x++) {
      const distance = Math.min(x,y,side - 1 - x,side - 1 - y);
      const t = Math.min(1,distance / feather);
      data[(y * side + x) * info.channels + 3] = Math.round(255 * t * t * (3 - 2 * t));
    }
    const art = await sharp(data,{raw:{width:side,height:side,channels:info.channels}}).png().toBuffer();
    return sharp({create:{width:size,height:size,channels:3,background:navy}})
      .composite([{input:art,left:inset,top:inset}]).flatten({background:navy})
      .png({compressionLevel:9}).toBuffer();
  }
  if (favicon) {
    // Trim empty outer background at tiny sizes; keep the T/N and both cars.
    return sharp(source).extract({left:150,top:190,width:954,height:954})
      .resize(size,size,{kernel:'lanczos3'}).sharpen({sigma:.6})
      .png({compressionLevel:9}).toBuffer();
  }
  return sharp(source).resize(size,size,{kernel:'lanczos3'}).png({compressionLevel:9}).toBuffer();
};

for (const size of [192,512]) {
  await writeFile(resolve(assets, `icon-${size}.png`), await png(size));
  await writeFile(resolve(assets, `icon-maskable-${size}.png`), await png(size,{maskable:true}));
}
await writeFile(resolve(assets, 'apple-touch-icon.png'), await png(180));

const favicons = [];
for (const size of [16,32,48]) {
  const bytes = await png(size,{favicon:true});
  favicons.push({size,bytes});
  await writeFile(resolve(assets, `favicon-${size}.png`),bytes);
}
let offset = 6 + favicons.length * 16;
const header = Buffer.alloc(offset);
header.writeUInt16LE(1,2);
header.writeUInt16LE(favicons.length,4);
for (const [index,{size,bytes}] of favicons.entries()) {
  const start = 6 + index * 16;
  header.writeUInt8(size,start);
  header.writeUInt8(size,start+1);
  header.writeUInt16LE(1,start+4);
  header.writeUInt16LE(32,start+6);
  header.writeUInt32LE(bytes.length,start+8);
  header.writeUInt32LE(offset,start+12);
  offset += bytes.length;
}
await writeFile(resolve(assets,'favicon.ico'),Buffer.concat([header,...favicons.map(item=>item.bytes)]));
console.log('Icone T/N generate: any 192/512, maskable 192/512, Apple 180, favicon 16/32/48 e ICO.');
