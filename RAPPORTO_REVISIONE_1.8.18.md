# PWA 1.8.18 / PDF 7.20 — sostituzione del logo CSA

Sostituito esclusivamente il logo CSA corrente con l’originale assets/logo-csa-nuovo.jpeg, al centro tra Polizia Turistica e U.O. San Lorenzo nella PWA e nella copertina del PDF completo. Nessun ritaglio, deformazione o ridisegno: dimensioni adattate alle proporzioni 1146×752. Il PDF incorpora il JPEG originale con la stessa impronta. Gli altri loghi, la dicitura di sostegno, i crediti e tutti i contenuti delle schede sono invariati.

Base: commit 21ae28be3683441d024a846036876ee774eb2f54, PWA 1.8.17 / PDF 7.19. Versioni aggiornate secondo le convenzioni del progetto. PDF rigenerato con scripts/generate-prontuario-static.mjs; build e impronte documentali allineate con scripts/update-build.py. Nessuna revisione normativa.

- 112 voci, **172 viste** (104 Taxi, 60 NCC, 8 equine), **193 pagine**, una pagina per scheda, 6 pagine d’indice e **172 destinazioni PDF**. 171 formule copiabili e 17 fonti.
- Confronto completo con la 1.8.17: tutti i campi delle 172 viste, importi, tabelle, alternative, formule, note e adempimenti identici. Testo di tutte le 193 pagine PDF identico salvo il numero di versione. Gli altri elementi grafici del PDF hanno le stesse impronte.
- npm test: PASS. git diff --check: PASS sullo stato corretto. Il controllo completo dei file selezionati ha rilevato uno spazio finale nel nuovo verificatore browser: corretto prima del push con un commit ordinario aggiuntivo, senza modifiche funzionali. I test correnti verificano il confronto con il commit pubblicato 1.8.17, senza dipendere dalla fotografia privata e senza riscrivere i rapporti storici.
- Prima build locale 7d86f4f7, grafica invariata nella build corrente. Chromium: intestazioni 360/390 px e desktop 1100 px; proporzioni originali, allineamento centrale, loghi completi, nessuna sovrapposizione o scorrimento orizzontale. Tutte le 172 viste e 171 copie controllate per ciascuna larghezza mobile. Copertina PDF reale rasterizzata e ispezionata visivamente.
- Prima build locale 7d86f4f7. Prima installazione e aggiornamento locale dalla 1.8.17 ricostruita dal commit pubblicato: 16 allegati invariati conservati, precedente PDF invalidato, nuovo PDF risalvato; chiusura e riapertura offline con SHA del logo e del PDF corrispondenti agli originali. Esclusione EGAF dalle cache mantenuta.
- 954 file preesistenti fuori ambito verificati per impronta, inclusi originali e rapporti storici. Vecchio e nuovo logo locali integri. Materiali personali, EGAF, input di lavoro, fotografie iniziali e temporanei esclusi dalla lista Pages. Il vecchio logo originale è conservato localmente, escluso dall’uso corrente e dalla lista dei file distribuiti.

**Build HTML / version.json / service worker:**

`5342fd257055d0e50e1d30fc02c41d62d844f6f17bb9ffbd1b8c719d720ab899`

**PDF 7.20:** 5825414 byte; SHA-256:

`9375f39e71b1e2a4df638e815bbaa3c3bb5bdd541168cb79550ea4be70efa5ad`

**Logo originale:** SHA-256 `1c1453f577d4bde9cc224209c399a7eab3d2c4d9e94fdd0e439c54cd41bbe82a`.

La verifica pubblica della prima build ha rilevato una risposta di navigazione HTML 1.8.17 accettata pur con worker e core 1.8.18: il controllo di corrispondenza della build era limitato agli URL con parametro rev. Ora anche gli URL delle pagine di ingresso PWA senza parametro accettano soltanto l’HTML della build installata, mantenendo consultabili anteprime e rapporti HTML; le risposte precedenti lasciano intervenire il core. Conservato cache:no-store. Aggiunta regressione specifica per risposta obsoleta anche con no-store. PDF, logo, CSS e tutti i contenuti restano identici alla prima build; confronto di invarianza nuovamente PASS. Verifica pubblica della correzione PASS sullo stesso profilo aggiornato dalla vera 1.8.17; esiti e sequenza delle build nel JSON di pubblicazione.

Pubblicazione autorizzata con push ordinario su main, senza force push. Commit editoriale 65868a969310eff8c24c0eff769c58de3e061868; correzione dello spazio finale 88277981519db4f0781acae55b8cf2c6b8b431df; correzione della navigazione 6b6965b8c377d2810f89fd755278e33f1f448e2d. [Workflow della build verificata riuscito](https://github.com/shockeshop98/prontuario-taxi-ncc-napoli/actions/runs/44755261361): npm ci, npm test, regressioni storiche, pacchetto tramite lista esplicita e deploy tutti PASS nella copia pulita. L’aggiornamento finale di questo rapporto non cambia build, logo, PDF o runtime.

**Verifiche pubbliche PWA/PDF concluse:**

- Versione 1.8.18 / PDF 7.20 e build coerenti. SHA di tutti i 93 percorsi ammessi della build verificata e del manifest corrispondenti al locale. PDF pubblico di 193 pagine identico byte per byte, testo di tutte le pagine corrispondente alla PWA e tutte le 172 destinazioni verificate.
- Nuovo logo caricato nel sito pubblico a 360/390 px, completo, centrato e proporzionato; dicitura, crediti e altri loghi conservati. Tutte le 172 viste e 171 copie per larghezza mobile, 67 combinazioni delle varianti, ricerca, indice, attestazioni e reset verificati. Nessun errore JavaScript nelle prove offline concluse. Anteprima HTML apribile e senza overflow a 360/390 px.
- Aggiornamento dalla **vera installazione pubblica 1.8.17 preparata prima del push**, con 17 allegati già salvati e riapertura offline iniziale riuscita: 16 allegati invariati mantenuti, vecchio PDF invalidato, nuovo PDF risalvato. Dopo chiusura e riapertura offline, logo e tutti i 17 allegati corrispondono alle impronte locali. Stessa verifica riuscita dopo prima installazione della 1.8.18. Il primo salvataggio del PDF nella prova di prima installazione ha restituito un messaggio generico di errore; il tentativo successivo è riuscito e tutte le impronte offline sono corrette. Causa non determinata; tentativi registrati nel JSON.
- Esclusioni EGAF e materiali riservati mantenute: 36 richieste dirette ai percorsi esclusi risultano 404; vecchi URL EGAF con query ricevono 410 dal worker e non restano nelle cache aggiornate. Un ulteriore percorso è verificato 404 con richiesta a query fresca dopo un 503 iniziale. L’URL del TXT di lavoro rimane HTTP 503 da GitHub anche con query fresca: questo controllo HTTP aggiuntivo è **inconcludente**, senza presentarlo come 404. L’asserzione 404 resta non superata per questo URL dopo i ricontrolli indipendenti; gli esiti PWA/PDF/offline sono stati salvati prima dell’asserzione. L’esclusione del TXT e degli altri materiali dal pacchetto è verificata tramite lista ammessa, manifest e impronte dei file distribuiti. Risposte 503 iniziali e controlli indipendenti sono conservati, senza attribuire una causa non accertata.

[Esiti pubblici completi](revisione/1.8.18/pubblicazione.json).

[Anteprima](revisione/1.8.18/anteprima.html) · [Confronto integrale](revisione/1.8.18/verifica-invarianza.json) · [Prove browser locali](revisione/1.8.18/browser-check.json) · [Integrità](revisione/1.8.18/integrita-originali.json) · [PDF completo](allegati/Prontuario_Taxi_NCC_Napoli.pdf).

Le verifiche sono tecniche e svolte in Chromium; nessuna prova su telefono fisico o nuova validazione normativa. La rimozione EGAF riguarda la distribuzione e le cache gestite dalla PWA; non cancella download autonomi o storico Git.

**Il PDF 7.20 deve essere salvato nuovamente nella PWA per usarlo offline.**
