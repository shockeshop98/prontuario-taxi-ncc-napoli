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
La versione 1.1.0 aggiunge `manifest.webmanifest`, icone, `sw.js`, pagina offline e salvataggio su richiesta dei singoli allegati. Versione e data dei contenuti restano visibili; l'indicatore online/offline e il controllo di `version.json` segnalano quando una revisione non è verificabile o quando è disponibile una nuova versione. Il service worker prepara una nuova cache solo se trova l'HTML con il BUILD_ID corrispondente; al cambio di revisione rimuove le vecchie copie locali degli allegati. `node tests/pwa.test.mjs` verifica installazione simulata, apertura offline e intervalli di byte dei PDF. Chromium headless con viewport 390×844 ha verificato ricerca, salvataggio di un PDF e riapertura offline. Resta da verificare su un telefono reale l'installazione e l'apertura degli allegati nel lettore PDF del dispositivo.

## Avvio locale
Dalla cartella del repository: python -m http.server 8000
Aprire http://localhost:8000. La semplice apertura file:// non riproduce tutte le funzioni online.

## Versioni
index.html e sw.js contengono BUILD_ID; version.json contiene lo stesso build_id. Ogni modifica dell'HTML destinata alla pubblicazione deve rigenerare tutti e tre con `python3 scripts/update-build.py`. La data di revisione indica i contenuti della versione, non una nuova verifica normativa effettuata durante questo passaggio.
