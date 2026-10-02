# Prontuario interattivo Taxi NCC e trazione animale Napoli

A cura dell’Agente Antonio Balzano · U.O. San Lorenzo.

Prontuario di consultazione con 118 fattispecie, ricerca per sinonimi e parole simili, indice per servizio, importi, riferimenti normativi, formule orientative, suggerimenti e note operative. I riferimenti al regolamento identificano la delibera C.C. n. 80/2005. Non contiene registrazioni di controlli, generalità dei conducenti o relazioni di servizio.

## Pubblicazione con GitHub Pages

Repository pubblico: `shockeshop98/prontuario-taxi-ncc-napoli`. La sorgente Pages è il ramo `main`, cartella `/(root)`, con `.nojekyll`. L'indirizzo è `https://shockeshop98.github.io/prontuario-taxi-ncc-napoli/` quando il deployment di GitHub Pages risulta completato. `index.html` e `version.json` restano nella radice, insieme alle cartelle `assets` e `allegati`.

## Installazione e uso offline

Aprire il sito pubblicato da telefono tramite HTTPS. Nel browser scegliere “Installa app” o “Aggiungi alla schermata Home”. Dopo la prima apertura con rete, il prontuario, la ricerca, l’indice, la legenda e il testo ricercabile delle fonti sono disponibili offline. L’indicatore vicino alla versione mostra se il sito risponde alla richiesta di `version.json`; non deduce la raggiungibilità da `navigator.onLine`. La verifica riprende anche quando l’app torna in primo piano.

I PDF e il file di testo originali non vengono scaricati automaticamente. Il riquadro **PDF salvati nella PWA** mostra il conteggio. **Prepara PDF offline** apre gli allegati; si possono salvare singolarmente o usare **Salva i PDF mancanti** (circa 10 MB per tutti e cinque). Ogni scheda mostra dimensione e progresso. Attendere “Salvato nella PWA”. Gli aggiornamenti conservano le copie il cui contenuto corrisponde ancora ai file pubblicati; un allegato modificato va salvato nuovamente. Il browser può eliminare i dati locali per liberare spazio: controllare lo stato prima di usare un allegato senza rete. **Scarica PDF** invia un normale download al browser, separato dalla cache PWA; il sito non può confermare che il file sia arrivato nella cartella Download. Se il visualizzatore Android non apre il PDF, usare questo pulsante e aprire il file dalla cartella Download. Dalla versione 1.2.1 il service worker serve i PDF salvati anche quando il browser li richiede come navigazione di una nuova scheda.

Per provare la PWA in locale, usare `python3 -m http.server 8000` e aprire `http://localhost:8000` (non `file://`). Nei DevTools verificare manifest, service worker e modalità offline. I browser mobili richiedono HTTPS sul sito pubblicato.

## Aggiornamenti per i colleghi

Gli aggiornamenti dei file su `main` vengono ripubblicati sul medesimo indirizzo. La pagina verifica `version.json` all’apertura, ogni minuto e al ritorno in primo piano. Se rileva una revisione diversa mostra “Apri versione aggiornata”, senza interrompere la lettura. La versione 1.3.0 prepara il nuovo service worker e attende l’apertura esplicita della revisione prima di attivarlo. Se sono aperte più schede, le copie PDF ancora valide restano disponibili nella pagina precedente; questa segnala che occorre aprire la nuova versione quando si è terminata la lettura. Chi arriva da una revisione precedente può vedere per alcuni secondi “Aggiornamento della copia offline…” dopo il cambio pagina. Non occorre disinstallare la PWA. Quando la rete manca, rimane visibile la versione locale e la verifica online risulta non disponibile. La disponibilità dipende dal completamento della pubblicazione e dalla propagazione dei file; non è un aggiornamento istantaneo a ogni telefono.

Pubblicare sempre `index.html`, `version.json`, `sw.js`, `manifest.webmanifest`, le icone e gli allegati aggiornati insieme. Dopo ogni modifica a HTML, worker, manifest, immagini, icone o allegati, eseguire `python3 scripts/update-build.py`: aggiorna coerentemente `BUILD_ID` nell’HTML, `build_id` nel JSON, `BUILD_ID` e le impronte degli allegati nel service worker; include nel build anche gli hash delle immagini e delle icone precaricate. Se cambia la versione, impostarla prima sia in `version.json` sia nella costante `RELEASE` nell’HTML; aggiornare la data solo per una nuova revisione dei contenuti. Il service worker prepara la nuova revisione solo quando il relativo HTML è disponibile; al cambio di revisione conserva gli allegati salvati il cui hash SHA-256 corrisponde al file attuale, mantiene la cache precedente per le schede ancora aperte e rimuove le copie obsolete. **Aggiorna dal sito** forza una nuova richiesta di rete, controlla dimensione e hash e conserva la copia precedente in caso di errore. Le copie HTML scaricate in precedenza non cambiano da sole: per gli aggiornamenti usare il link del sito.

## Struttura

- `index.html`: prontuario e contenuti testuali; gli allegati vengono caricati solo quando richiesti.
- `version.json`: versione, data e identificatore della revisione.
- `sw.js`: cache della pagina e degli allegati salvati su richiesta.
- `manifest.webmanifest` e `assets/icon-*.png`: installazione e icone. L'originale T/N è in `assets/icon-source-tn.png`; `npm run generate:icons` crea icone normali e maskable, favicon e Apple touch icon.
- `assets/`: stemmi e icone; `polizia-locale-napoli.png` è una rielaborazione grafica dell’immagine fornita, non una fonte certificata dello stemma.
- `allegati/`: documenti originali e PDF normale del prontuario, conservati integralmente.
- `scripts/generate-prontuario.mjs`: rigenera le pagine del PDF normale dopo una revisione dei testi e mantiene copertina, indice, fonti, autore e numerazione.
- `.nojekyll`: pubblicazione statica senza elaborazione Jekyll.
- `CHANGELOG.md`: modifiche delle versioni pubblicate.

La versione 1.4.1 con la nuova icona T/N è pubblicata. La revisione di chiarezza 1.4.2 e il PDF normale 6.2 sono preparati localmente per la verifica dell'autore; non sono pubblicati. Le 166 schede del PDF mantengono le sezioni Taxi, NCC e trazione animale. I testi orientativi e le note sono stati revisionati il 2 ottobre 2026; la verifica normativa dichiarata resta quella del 1 ottobre 2026. Per rigenerare il PDF: `npm ci`, `npx playwright install chromium` (oppure impostare `CHROMIUM_PATH` a un Chromium già presente), `npm run generate:pdf`, `python3 scripts/update-build.py`, `npm test`. Per rigenerare le icone: `npm run generate:icons` prima di `python3 scripts/update-build.py`. La versione PWA non rappresenta una nuova verifica normativa. Rielaborazione del prontuario U.O. G.I.T. TURISTICA, del regolamento fornito e delle diciture EGAF. Gli originali mantengono la propria attribuzione. Revisione proposta per validazione interna; fonti e limiti dell’aggiornamento sono riportati nel prontuario. Gli aggiornamenti normativi sono revisioni curate, non un’acquisizione automatica delle leggi da parte di GitHub.

Documentazione ufficiale: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
