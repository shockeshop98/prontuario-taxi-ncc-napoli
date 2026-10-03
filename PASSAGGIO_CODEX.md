# Passaggio a Codex

Proprietario: Antonio Balzano, Agente Polizia Municipale Napoli, U.O. San Lorenzo.

## Stato
Repository remoto pubblico: shockeshop98/prontuario-taxi-ncc-napoli. La sua storia iniziale era distinta dall'importazione locale: conservare entrambe le storie tramite merge ordinario. Non usare push --force. La configurazione Pages e l'indirizzo del sito sono descritti nel README.

## Obiettivo della trasformazione
Prontuario HTML trasformato in PWA installabile, leggibile su telefono e consultabile offline. Le 118 voci storiche del catalogo producono 185 schede canoniche di caso e fascia; I03-01–04 rinviano a N04–N07 e I07 alle fasce G07. Il compilatore guidato non è esposto. Le formule e i suggerimenti sono visibili nelle schede; la copia comprende la formula con […] e il seguito operativo pertinente. Un’unica istruzione esterna impone di conservare soltanto gli atti compiuti e di adattare il testo prima dell’uso. Non introdurre archivi di controlli, telemetria o invio dei dati.

## Requisiti da conservare
- Ordine: taxi, NCC, trazione animale.
- Una scheda per ogni fattispecie o variante esplicitamente separata, ricerca per sinonimi/parole simili, indice, legenda e note operative.
- Riferimenti normativi prima del testo orientativo del verbale.
- Citazione completa del regolamento: delibera C.C. n. 80/2005.
- Nel testo orientativo usare il veicolo con C.P.; evitare di ripetere la targa.
- Suggerimenti fotografici separati dal corpo del verbale.
- Attribuzione Antonio Balzano, Agente, U.O. San Lorenzo; conservare l'attribuzione delle fonti originali U.O. G.I.T. TURISTICA ed EGAF.
- PDF normale conservato; la versione light è stata rifiutata.
- Allegati: regolamento fornito dall'utente, tariffario 2024, prontuario GIT, EGAF articoli 85 e 86, PDF normale.
- Importi e norme: non modificarli automaticamente; verificare su fonti ufficiali prima di eventuali revisioni giuridiche. Non assumere che ogni illecito comunale confluisca automaticamente nel CdS.

## PWA
La versione 1.4.2 è pubblicata. La 1.7.0 è una revisione locale senza push. Il PDF normale 7.1 ha 203 pagine: copertina, sei pagine di indice collegato, cinque pagine introduttive, 185 schede di una pagina, tre pagine di appendice operativa e tre pagine di confronto e fonti; tutte le pagine sono ricreate da HTML pulito. Ricerca, indice e “Scheda PDF” puntano alla singola fascia; I03-01–04 e I07 sono alias. I06 e le voci con base da qualificare espongono una formula per la relazione, senza frase finale del verbale. `scripts/static-field-suggestions.js` aggiunge accanto ai segnaposto suggerimenti caso per caso per fatto, fonti, titolo, precedenti e atti; C.O. e U.O. hanno alternative distinte con data e riferimento. Le alternative orientative non compaiono nel testo copiato; il seguito operativo va adattato agli atti documentati secondo l’unica istruzione esterna alla formula. Norme, importi e responsabilità restano nel catalogo originario. La ricerca e le schede sono precaricate offline; il PDF 7.1 va salvato nuovamente nella PWA, mentre gli allegati originali ancora validi si conservano tra build.

Nella 1.5.5 la frase finale sul Corso Pubblico torna nei verbali diversi dai sette casi abusivi G01, G02, I02, N01, N02, N03 e N12; resta assente dalle relazioni. N02/N03 richiedono la verifica della persona interessata dalla conseguenza sulla patente e del suo ruolo nel precedente: la sola impresa porta alla relazione. I 21 esempi dei rami sono affiancati da quattro situazioni aggiuntive.

Lo stato “Sito raggiungibile” deriva da una richiesta a `version.json`, non da `navigator.onLine`. I messaggi di successo PDF sono brevi; gli errori rimangono visibili. “Aggiorna dal sito” bypassa la cache, verifica dimensione e SHA-256 e conserva una copia valida in caso di errore. Il nuovo worker attende la richiesta esplicita di aggiornamento, conserva per la scheda precedente l'ultima cache di PDF validi e segnala a una pagina con build differente che deve aprire la nuova versione.

`node tests/pwa.test.mjs` verifica build, asset, scope Pages, installazione simulata, navigazione PDF, migrazione, cache precedente, intervalli di byte e refresh di rete. Chromium con viewport mobili 360/390/430 px, verticale e orizzontale, ha verificato l'intestazione e l'assenza di overflow. Prove browser separate hanno verificato PDF offline, salvataggio multiplo e aggiornamento con due schede aperte. La tastiera Android fisica e il visualizzatore PDF del telefono restano da ricontrollare sul dispositivo reale.

## Avvio locale
Dalla cartella del repository: python -m http.server 8000
Aprire http://localhost:8000. La semplice apertura file:// non riproduce tutte le funzioni online.

## Versioni
index.html e sw.js contengono BUILD_ID; version.json contiene lo stesso build_id. Ogni modifica dell'HTML destinata alla pubblicazione deve rigenerare tutti e tre con `python3 scripts/update-build.py`. La data di revisione indica i contenuti della versione, non una nuova verifica normativa effettuata durante questo passaggio.

Per l'icona T/N, l'originale fornito è conservato in `assets/icon-source-tn.png`. `npm run generate:icons` produce le varianti any e maskable per il manifest, favicon e Apple touch icon. Le icone maskable tengono lettere e veicoli entro il cerchio centrale di diametro 80%. Rigenerare il build dopo ogni modifica a queste risorse; il service worker le precarica. La cartella `revisione_testi/` resta esclusa dal commit.

Per rigenerare il PDF normale: `npm ci`, installare Chromium per la versione di Playwright (`npx playwright install chromium`) e avviare `npm run generate:pdf` prima di `python3 scripts/update-build.py`. Se Chromium è già installato in un percorso diverso, impostare `CHROMIUM_PATH`. Il generatore corrente crea da HTML tutte le 203 pagine, compresi copertina, cinque pagine introduttive, 185 schede singole, sei indici e sei pagine di appendici e fonti; verifica i collegamenti. Le schede mantengono formule complete e caratteri fissi a 9 pt. Se una scheda supera la pagina, la generazione si ferma senza sostituire il PDF. `npm test` controlla formule, note, importi e PDF. Non includere `Supporto_Guidato/`, anteprime o backup in un commit.
