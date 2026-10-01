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
La versione 1.2.1 mantiene manifest, icone, service worker e salvataggio su richiesta dei singoli allegati. La ricerca mobile mostra i risultati subito sotto la barra e con Invio chiude la tastiera e raggiunge i risultati. I PDF si aprono senza affidarsi a `navigator.onLine`; il worker instrada le richieste agli allegati prima delle navigazioni HTML, anche offline. In caso di errore compare un messaggio con HTTP o stato offline e un'azione utile. È disponibile anche **Scarica PDF**. Il service worker verifica gli hash SHA-256 degli allegati già salvati e migra solo le copie ancora identiche ai file pubblicati. L'identità della PWA nel manifest è fissata al percorso Pages già usato, così l'installazione esistente viene aggiornata.

`node tests/pwa.test.mjs` verifica versione, hash, installazione simulata, migrazione degli allegati, navigazione offline e intervalli di byte dei PDF. Chromium headless con viewport 390×844 ha verificato ricerca, Invio, PDF della scheda, salvataggio e riapertura offline di un allegato. Le prove di aggiornamento 1.1.0 → 1.2.0 e 1.2.0 → 1.2.1 hanno conservato un PDF offline senza disinstallare; la prova browser ora controlla anche il tipo `application/pdf` della risposta realmente aperta. Resta da verificare su un telefono reale l'apertura nel lettore PDF e il download del dispositivo.

## Avvio locale
Dalla cartella del repository: python -m http.server 8000
Aprire http://localhost:8000. La semplice apertura file:// non riproduce tutte le funzioni online.

## Versioni
index.html e sw.js contengono BUILD_ID; version.json contiene lo stesso build_id. Ogni modifica dell'HTML destinata alla pubblicazione deve rigenerare tutti e tre con `python3 scripts/update-build.py`. La data di revisione indica i contenuti della versione, non una nuova verifica normativa effettuata durante questo passaggio.
