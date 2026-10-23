// I soli input esclusi dalla pubblicazione possono mancare nella clone pubblica.
// Se presenti, il loro hash deve sempre corrispondere alla revisione iniziale.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export function verifyOriginal(path, hash) {
  const file = new URL('../' + path, import.meta.url);
  const privateInput = path === 'allegati/EGAF_Art86_originale.pdf' ||
    path === 'diciture prontuario seconda parte.txt' ||
    /^revisione\/fonti-integrative\/WhatsApp Image .*\.jpeg$/.test(path) ||
    path === 'revisione/fonti-integrative/od_160419_0463_taxi_collettivo_2019 (1).pdf';
  if (privateInput && !fs.existsSync(file)) return;
  assert.equal(createHash('sha256').update(fs.readFileSync(file)).digest('hex'), hash, `Originale intatto ${path}`);
}
