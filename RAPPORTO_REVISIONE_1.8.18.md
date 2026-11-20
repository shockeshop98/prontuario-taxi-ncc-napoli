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

`82f328c80313ddd8eb24fa26eb8491b0eec6c6c2eb925e3931fdc9a2a10e2b30`

**PDF 7.20:** 5825414 byte; SHA-256:

`9375f39e71b1e2a4df638e815bbaa3c3bb5bdd541168cb79550ea4be70efa5ad`

**Logo originale:** SHA-256 `1c1453f577d4bde9cc224209c399a7eab3d2c4d9e94fdd0e439c54cd41bbe82a`.

La verifica pubblica della prima build ha rilevato una risposta di navigazione HTML 1.8.17 accettata pur con worker e core 1.8.18: il controllo di corrispondenza della build era limitato agli URL con parametro rev. Ora anche gli URL senza parametro accettano soltanto l’HTML della build installata; le risposte precedenti lasciano intervenire il core. Conservato cache:no-store. Aggiunta regressione specifica per risposta obsoleta anche con no-store. PDF, logo, CSS e tutti i contenuti restano identici alla prima build; confronto di invarianza nuovamente PASS. Verifica pubblica della correzione in attesa del deploy.

L’autore ha autorizzato commit, push ordinario e deploy dopo i controlli. Prima del push è stata preparata la **vera installazione pubblica 1.8.17**, con 17 allegati salvati e riapertura offline riuscita; la verifica pubblica della nuova versione sarà registrata dopo il deploy. Nessun esito pubblico della 1.8.18 è anticipato in questo rapporto.

[Anteprima](revisione/1.8.18/anteprima.html) · [Confronto integrale](revisione/1.8.18/verifica-invarianza.json) · [Prove browser locali](revisione/1.8.18/browser-check.json) · [Integrità](revisione/1.8.18/integrita-originali.json) · [PDF completo](allegati/Prontuario_Taxi_NCC_Napoli.pdf).

Le verifiche sono tecniche e svolte in Chromium; nessuna prova su telefono fisico o nuova validazione normativa. La rimozione EGAF riguarda la distribuzione e le cache gestite dalla PWA; non cancella download autonomi o storico Git.

**Il PDF 7.20 deve essere salvato nuovamente nella PWA per usarlo offline.**
