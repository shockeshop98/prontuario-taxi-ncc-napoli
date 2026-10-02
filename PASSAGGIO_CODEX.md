# Passaggio a Codex

Proprietario: Antonio Balzano, Agente Polizia Municipale Napoli, U.O. San Lorenzo.

## Stato
Repository remoto pubblico: shockeshop98/prontuario-taxi-ncc-napoli. La sua storia iniziale era distinta dall'importazione locale: conservare entrambe le storie tramite merge ordinario. Non usare push --force. La configurazione Pages e l'indirizzo del sito sono descritti nel README.

## Obiettivo della trasformazione
Prontuario HTML trasformato in PWA installabile, leggibile su telefono e consultabile offline. Il progetto resta di sola consultazione. Non reinserire moduli di controllo, dati dei conducenti, archivi o generazione di relazioni.

## Requisiti da conservare
- Ordine: taxi, NCC, trazione animale.
- Una scheda per ogni fattispecie, ricerca per sinonimi/parole simili, indice, legenda e note operative.
- Riferimenti normativi prima del testo orientativo del verbale.
- Citazione completa del regolamento: delibera C.C. n. 80/2005.
- Nel testo orientativo usare il veicolo con C.P.; evitare di ripetere la targa.
- Suggerimenti fotografici separati dal corpo del verbale.
- Attribuzione Antonio Balzano, Agente, U.O. San Lorenzo; conservare l'attribuzione delle fonti originali U.O. G.I.T. TURISTICA ed EGAF.
- PDF normale conservato; la versione light è stata rifiutata.
- Allegati: regolamento fornito dall'utente, tariffario 2024, prontuario GIT, EGAF articoli 85 e 86, PDF normale.
- Importi e norme: non modificarli automaticamente; verificare su fonti ufficiali prima di eventuali revisioni giuridiche. Non assumere che ogni illecito comunale confluisca automaticamente nel CdS.

## PWA
La versione 1.4.1 pubblicata include la nuova icona T/N. La revisione di chiarezza 1.4.2 è preparata localmente per la verifica dell'autore e non è pubblicata. Il PDF normale 6.2 è rigenerato con 186 pagine e indice collegato; il PDF modificato va salvato nuovamente offline, mentre gli allegati originali ancora validi si conservano. La versione 1.3.0 ha aggiornato l'intestazione con lo stemma locale fornito, lo stemma trasparente di San Lorenzo, titolo e autore centrati. Il prontuario e la ricerca sono disponibili offline dopo l'attivazione del worker; i cinque PDF richiedono salvataggio separato nella PWA. Conteggio, dimensioni e progresso sono visibili in pagina. I file nella cartella Download restano separati dalla cache PWA.

Lo stato “Sito raggiungibile” deriva da una richiesta a `version.json`, non da `navigator.onLine`. I messaggi di successo PDF sono brevi; gli errori rimangono visibili. “Aggiorna dal sito” bypassa la cache, verifica dimensione e SHA-256 e conserva una copia valida in caso di errore. Il nuovo worker attende la richiesta esplicita di aggiornamento, conserva per la scheda precedente l'ultima cache di PDF validi e segnala a una pagina con build differente che deve aprire la nuova versione.

`node tests/pwa.test.mjs` verifica build, asset, scope Pages, installazione simulata, navigazione PDF, migrazione, cache precedente, intervalli di byte e refresh di rete. Chromium con viewport mobili 360/390/430 px, verticale e orizzontale, ha verificato l'intestazione e l'assenza di overflow. Prove browser separate hanno verificato PDF offline, salvataggio multiplo e aggiornamento con due schede aperte. La tastiera Android fisica e il visualizzatore PDF del telefono restano da ricontrollare sul dispositivo reale.

## Avvio locale
Dalla cartella del repository: python -m http.server 8000
Aprire http://localhost:8000. La semplice apertura file:// non riproduce tutte le funzioni online.

## Versioni
index.html e sw.js contengono BUILD_ID; version.json contiene lo stesso build_id. Ogni modifica dell'HTML destinata alla pubblicazione deve rigenerare tutti e tre con `python3 scripts/update-build.py`. La data di revisione indica i contenuti della versione, non una nuova verifica normativa effettuata durante questo passaggio.

Per l'icona T/N, l'originale fornito è conservato in `assets/icon-source-tn.png`. `npm run generate:icons` produce le varianti any e maskable per il manifest, favicon e Apple touch icon. Le icone maskable tengono lettere e veicoli entro il cerchio centrale di diametro 80%. Rigenerare il build dopo ogni modifica a queste risorse; il service worker le precarica. La cartella `revisione_testi/` resta esclusa dal commit.

Per rigenerare il PDF normale dopo una revisione delle schede: `npm ci`, installare Chromium per la versione di Playwright (`npx playwright install chromium`) e avviare `npm run generate:pdf` prima di `python3 scripts/update-build.py`. Se Chromium è già installato in un percorso diverso, impostare `CHROMIUM_PATH`. Il generatore mantiene copertina, pagine introduttive, indice e fonti dal PDF esistente, sostituisce le 166 pagine di schede e collega nuovamente le voci dell'indice. `npm test` controlla anche la completezza delle formule e delle note nel PDF. Non includere `revisione_testi/` o `index.html.prima-revisione-testi.bak` in un commit.
