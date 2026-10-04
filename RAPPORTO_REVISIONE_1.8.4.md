# Revisione locale PWA 1.8.4 / PDF 7.6

4 ottobre 2026 · Build `22a94ea097bdaa7b7600aa45ed21bcdfda26e63afdeda9fc71b1b41bd491293d`.

## Correzione circoscritta

In G28-01–04 la disposizione dirigenziale n. 72 del 10/02/2012 è stata rimossa dal riquadro “Normativa violata” della PWA e del PDF. G28-01 mantiene il riferimento pertinente all’art. 23, comma 1, lett. n, del regolamento comunale – delibera C.C. n. 80/2005. G28-02–04 riportano nel riquadro l’art. 86, comma 3-bis, CdS, senza aggiungere articoli comunali non verificati per tempi, modello o compilazione. La D.D. n. 72 resta richiamata nelle note, nell’approfondimento sulle fonti e in [VERIFICA_RICEVUTE_TARIFFE.md](VERIFICA_RICEVUTE_TARIFFE.md).

L’autore ha confermato l’inquadramento operativo delle quattro schede nell’art. 86, comma 3-bis, CdS. Questa decisione è distinta dalla verifica documentale: la D.D. n. 72 del 10/02/2012, la D.D. n. 135 del 28/05/2010 e la delibera G.C. n. 634/2018 restano da acquisire integralmente. Non è preimpostata alcuna classificazione del seguito disciplinare comunale.

Importi, accessorie, formule copiate, suggerimenti e frase finale al Corso Pubblico restano quelli della revisione 1.8.3. I quattro casi restano distinti, alle pagine PDF 89–92. Il PDF aggiornato deve essere salvato nuovamente per l’uso offline; il service worker conserva gli allegati originali con hash invariato.

## Verifiche

`npm test` completo e `git diff --check` superati. Il controllo delle quattro schede verifica separatamente il riquadro normativo della PWA e del PDF, il richiamo alla D.D. nelle fonti, importi e copia. Il PDF 7.6 ha 209 pagine, con G28-01–04 a pagina 89–92; le quattro pagine sono state ispezionate visivamente e restano leggibili.

L’anteprima HTTPS serve la build 1.8.4 e il PDF remoto ha lo stesso SHA-256 del file locale: `c3c4ef3952fe9a3638ab62d21ec478eb3e3db9f6cafac14f1930e09af2b6319c`. In Chromium mobile a 390 px sono stati verificati ricerca, ritorno ai risultati, assenza di scorrimento orizzontale, copia senza suggerimenti, link alle pagine corrette e riapertura offline del PDF salvato (HTTP 200, `application/pdf`, 5.525.842 byte). La prova su Android reale resta a carico dell’autore.
