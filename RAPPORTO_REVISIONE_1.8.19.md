# PWA 1.8.19 / PDF 7.21 — riduzione del logo CSA

Ridotte del 25% larghezza e altezza del logo CSA rispetto alla 1.8.18, nella PWA e nella copertina del PDF. Conservati JPEG originale 1146×752, proporzioni, immagine intera e centraggio nella griglia esistente. Invariati dimensioni e posizione degli stemmi Polizia Turistica e U.O. San Lorenzo, testi, crediti e dicitura di sostegno.

PWA: limite CSA desktop da 138 a 103,5 px e mobile da 104 a 78 px; larghezza massima dal 100% al 75% della stessa colonna. PDF: altezza da 34 a 25,5 mm, larghezza massima al 75%. Griglie e spaziatura esistenti conservati. Le coordinate PDF tengono conto dell’arrotondamento di stampa di Chromium entro 0,5 pt; gli altri due stemmi mantengono esattamente coordinate e dimensioni precedenti.

Confronto con il commit `1f076e2818c10d34e01da714475289fc3a3decd1`: tutti i campi delle 172 schede, importi, formule, alternative, note, adempimenti e riferimenti normativi identici. Tutto il catalogo PWA è identico salvo metadati del PDF; il resto dell’HTML differisce soltanto per dimensioni CSA e metadati di pubblicazione. Tutte le 193 pagine PDF hanno testo identico salvo versione/data. Immagini incorporate identiche per impronta; 172 destinazioni, 171 formule copiabili e 17 fonti conservate.

PDF rigenerato con `npm run generate:pdf`; impronte, build HTML, manifest e cache riallineate con `python3 scripts/update-build.py`.

Build: `8892744aa4607ab19a049d2014babc4f0c43ca957fd86050e4b427e7a7c0c026`.

PDF: 5825886 byte; SHA-256 `999ef5a28fe3a483502ac9a54ba13d7d18047aa83bd37dfa0d18a79b65adebed`.

Verifiche locali: `npm test`, `npm run test:historical`, `npm run test:browser` e `git diff --check`. Prove e confronti in [verifica-invarianza.json](revisione/1.8.19/verifica-invarianza.json) e [browser-check.json](revisione/1.8.19/browser-check.json): desktop 1100 px, mobile 360/390 px, copertina reale rasterizzata, prima installazione e migrazione 1.8.18 → 1.8.19 con riapertura offline. Sedici allegati invariati conservati; vecchio manuale invalidato e nuovo PDF salvato nuovamente.

Materiali riservati, file temporanei e modifiche estranee esclusi dal commit e dalla lista Pages. Il PDF 7.21 deve essere salvato nuovamente nella PWA per l’uso offline. Nessuna revisione normativa.
