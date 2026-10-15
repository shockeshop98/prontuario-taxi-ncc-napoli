// Rimuove solo il fondo esterno connesso ai margini; conserva i pixel dello scudo.
import sharp from 'sharp';
import {resolve} from 'node:path';

const root=resolve(import.meta.dirname,'..');
const {data,info}=await sharp(resolve(root,'assets/logo-polizia-turistica.jpg'))
  .toColourspace('srgb').removeAlpha().raw().toBuffer({resolveWithObject:true});
const {width,height}=info;
const exterior=new Uint8Array(width*height);
const queue=new Uint32Array(width*height);
let head=0,tail=0;
function visit(index){
  if(exterior[index])return;
  const offset=index*3;
  const channels=[data[offset],data[offset+1],data[offset+2]];
  // Il bordo scuro chiuso separa il fondo dalle scritte e dai bianchi interni.
  if(Math.min(...channels)<160||Math.max(...channels)-Math.min(...channels)>45)return;
  exterior[index]=1;
  queue[tail++]=index;
}
for(let x=0;x<width;x++){visit(x);visit((height-1)*width+x)}
for(let y=0;y<height;y++){visit(y*width);visit(y*width+width-1)}
while(head<tail){
  const index=queue[head++],x=index%width,y=Math.floor(index/width);
  if(x>0)visit(index-1);
  if(x<width-1)visit(index+1);
  if(y>0)visit(index-width);
  if(y<height-1)visit(index+width);
}
const rgba=Buffer.alloc(width*height*4);
for(let index=0;index<width*height;index++){
  data.copy(rgba,index*4,index*3,index*3+3);
  rgba[index*4+3]=exterior[index]?0:255;
}
await sharp(rgba,{raw:{width,height,channels:4}}).png()
  .toFile(resolve(root,'assets/logo-polizia-turistica.png'));
console.log(`Stemma originale ${width}×${height}; ${tail} pixel esterni trasparenti, RGB conservati.`);
