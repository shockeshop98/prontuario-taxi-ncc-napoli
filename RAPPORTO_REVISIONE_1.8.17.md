# PWA 1.8.17 / PDF 7.19 — pubblicazione e verifiche tecniche

Pubblicate le tre modifiche editoriali autorizzate, sulla base effettiva 1.8.16 / 7.18 (commit aff1effbf91442c8ff3e6775339d1f6eb42cf784). Tutti gli importi, i regimi di pagamento, le formule, le alternative, le attestazioni e gli altri campi delle 172 viste sono invariati. Le 121 viste fuori ambito della revisione precedente rimangono quindi preservate. Nessun nuovo riesame normativo: osservazioni e dubbi documentali precedenti restano separati e non vengono dichiarati risolti.

| Ambito | Risultato |
|---|---|
| G55 Taxi, pagina PDF 51, indice pagina 3 | Titolo «Sostava fuori dagli stalli autorizzati» nella scheda, nella ricerca, nell’indice e nel PDF. Codice e tutti gli altri campi conservati. |
| Crediti correnti PWA/PDF | «Con la collaborazione del Sottotenente Pasquale D’Ascoli» · «Polizia Turistica». Crediti dell’Agente Antonio Balzano e U.O. San Lorenzo conservati. |
| Intestazione PWA e copertina PDF | Polizia Turistica a sinistra, logo CSA originale al centro, U.O. San Lorenzo a destra, immagini complete e proporzionate. |

Dicitura: **«Con il sostegno e la promozione del CSA — Città Metropolitana di Napoli»**. Il testo identifica il sostegno e la promozione della struttura sindacale.

**Conteggi effettivi:** 112 voci, 172 viste (104 Taxi, 60 NCC, 8 equine), 193 pagine PDF, una pagina per ogni scheda, 6 pagine d’indice e 172 destinazioni controllate. 171 formule copiabili; 17 fonti.

**Build coerente tra HTML, version.json e service worker:**

`ba39672eb2bcd451cade1fc9f288b525679710777a446a5d671b2e5df736247b`

**PDF 7.19:** 5.800.736 byte, identico byte per byte al locale e alla consegna editoriale. SHA-256:

`eb601d89c9c6cd4ce9a7f7a08202538a2c5cb0c192d05eff77fe2552395976a3`

Logo originale assets/logo-csa-napoli.jpeg: 267×100 px, SHA-256 `d391fb42e8a8aca7b828b763da1a75e89527d949b44c78d1a12da33d44ded663`. Conservato integro, incluso nel precache e nella lista esplicita Pages.

## Esiti registrati

- `npm test` e `git diff --check`: PASS prima dei commit. Dopo la correzione offline, npm test e regressione della cache HTTP ripetuti con esito PASS. Workflow GitHub nella copia pulita: npm ci, npm test, regressioni storiche, pacchetto su lista esplicita e deploy tutti riusciti. [Workflow della build verificata](https://github.com/shockeshop98/prontuario-taxi-ncc-napoli/actions/runs/44741554446). I confronti automatici sono in sola lettura e non riscrivono i rapporti storici.
- [Confronto integrale con la 1.8.16](revisione/1.8.17/verifica-invarianza.json): tutte le 172 tabelle e formule invariate; unico cambiamento nei dati delle schede è il titolo G55. Testo PDF successivo alla copertina identico salvo titolo G55, data e numero di versione. 108 file protetti di originali e rapporti storici intatti; fotografie iniziali conservate soltanto localmente.
- Sito pubblico: versione e build HTML/worker/manifest coerenti; SHA di tutti gli 84 percorsi ammessi della build verificata corrispondenti al locale. PDF reale di 193 pagine, testo di tutte le pagine corrispondente alla PWA e 172 collegamenti dell’indice verificati. G55, crediti e dicitura controllati anche nel PDF.
- Browser Chromium sul pubblico: 172 viste e 171 copie per ciascuna larghezza 360/390 px; nessuno scorrimento orizzontale. Tre loghi caricati, ordine e proporzioni corretti, dicitura leggibile (almeno 13 px). Ricerca G55 per codice e titolo, indice e copia verificati. Tutte le 67 combinazioni delle varianti interessate controllate per tabella, copia, attestazioni e azzeramento; R33 Napoli/altro Comune e indipendenza degli adempimenti CdS conservate. Nessun errore JavaScript.
- Aggiornamento preparato **prima del push dalla vera PWA pubblica 1.8.16**, con le 17 fonti salvate e le impronte confrontate con il commit pubblicato. Nel passaggio alla prima build 1.8.17 conservati tutti i 16 allegati invariati, invalidato il vecchio PDF e rimosse le chiavi EGAF sintetiche di prova, comprese le query. Dopo la correzione tecnica, sullo **stesso profilo**: logo CSA e tutte le 17 fonti, incluso il nuovo PDF risalvato, verificati per SHA dopo chiusura e riapertura offline.
- Prima installazione pubblica: 17 fonti salvate e riaperte offline con impronte corrispondenti al locale, logo CSA disponibile offline, PDF con risposta Range 206 e copia G55 funzionante. Il primo tentativo di salvataggio della fonte 0 aveva restituito il messaggio generico di errore; il nuovo tentativo diagnostico è riuscito. Causa non determinata, evento conservato nel rapporto. La prova completa conclusiva ha esito positivo; eventuali tentativi aggiuntivi sono registrati nel JSON.
- N11 assente da ricerca e PDF corrente. Risorse EGAF assenti dall’elenco e dalla ricerca delle fonti, dal PDF, dal pacchetto e dalle cache gestite aggiornate. Vecchi URL con query: 410 tramite worker; 38 richieste dirette a materiali esclusi sul sito: 404. Originali locali e provenienza conservati. Nessuna eliminazione dichiarata di download autonomi o storico Git.

## Problema tecnico trovato sul pubblico e correzione

La prima verifica di riapertura offline ha trovato l’HTML 1.8.16 nella cache HTTP del browser, pur con worker e core aggiornati alla prima build 1.8.17. La navigazione ora usa `fetch(request, {cache: 'no-store'})`, lasciando al core installato il fallback offline. Aggiunta una regressione specifica; corretti soltanto service worker e build, senza alterare PDF, importi, formule o contenuti editoriali. Sequenza effettivamente provata: 1.8.16 pubblica → prima build 1.8.17 b196457a → build corretta ba39672e. La riapertura offline sulla build corretta è riuscita sul medesimo profilo. [Esito della correzione](revisione/1.8.17/pubblicazione.json).

## Distribuzione e limiti

Pubblicazione tramite `pages-files.json`: 85 percorsi espliciti, più .nojekyll e publication-manifest.json. Nessuna copia indiscriminata della cartella. Input TXT, documenti personali, fotografie dei controlli, estrazioni riservate, originali EGAF, fotografie iniziali e temporanei esclusi. Lavoro locale preesistente conservato. Commit editoriale 57148c8069ea8bb0772bef5c89a26e16475263d8; correzione tecnica c3030717646ac0edd07966838d50d7a52dd22ab6. Push ordinari su main, nessun force push o riscrittura della cronologia. L’aggiornamento finale della documentazione mantiene invariata la build verificata.

Le prove browser sono automatizzate in Chromium, senza prova su telefono fisico. Gli esiti attestano la coerenza tecnica con la consegna dell’autore, non una nuova validazione normativa. Le schermate locali e i risultati precedenti sono conservati come evidenza della fase locale; la build corrente è quella indicata sopra.

**Il PDF 7.19 deve essere salvato nuovamente nella PWA per usarlo offline.**

[PWA](https://shockeshop98.github.io/prontuario-taxi-ncc-napoli/) · [PDF 7.19](allegati/Prontuario_Taxi_NCC_Napoli.pdf) · [Anteprima](revisione/1.8.17/anteprima.html) · [Esiti pubblici completi](revisione/1.8.17/pubblicazione.json) · [Controlli locali precedenti](revisione/1.8.17/browser-check.json).
