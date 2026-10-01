# Passaggio a Codex

Proprietario: Antonio Balzano, Agente Polizia Municipale Napoli, U.O. San Lorenzo.

## Stato
Repository locale autonomo con commit iniziale. Repository remoto creato: shockeshop98/prontuario-taxi-ncc-napoli. Nessun push eseguito da questo repository locale. Il remoto contiene un README iniziale e ha una storia distinta. GitHub Pages non è stato attivato. Non usare push --force: recuperare e integrare la storia remota prima di pubblicare.

## Obiettivo prossimo
Trasformare questo prontuario HTML in una PWA installabile, leggibile su telefono e consultabile offline. Il progetto attuale è un prontuario di sola consultazione. Non reinserire moduli di controllo, dati dei conducenti, archivi o generazione di relazioni.

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
Progettare cache offline e aggiornamenti senza lasciare versioni normative stale nascoste. Mostrare versione e data; distinguere disponibilità online/offline; permettere di caricare una nuova revisione. Allegati voluminosi scaricabili su richiesta. Verificare uso da telefono, ricerca, allegati e riapertura offline.

## Avvio locale
Dalla cartella del repository: python -m http.server 8000
Aprire http://localhost:8000. La semplice apertura file:// non riproduce tutte le funzioni online.

## Versioni
index.html contiene BUILD_ID; version.json contiene lo stesso build_id. Ogni modifica dell'HTML destinata alla pubblicazione deve rigenerare entrambi coerentemente. La data di revisione indica i contenuti della versione, non una nuova verifica normativa effettuata durante questo passaggio.
