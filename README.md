# Prontuario interattivo Taxi NCC e trazione animale Napoli

A cura dell’Agente Antonio Balzano · U.O. San Lorenzo.

Prontuario di consultazione con 118 fattispecie, ricerca per sinonimi e parole simili, indice per servizio, importi, riferimenti normativi, formule orientative, suggerimenti e note operative. I riferimenti al regolamento identificano la delibera C.C. n. 80/2005. Non contiene registrazioni di controlli, generalità dei conducenti o relazioni di servizio.

## Pubblicazione con GitHub Pages

Repository pubblico: `shockeshop98/prontuario-taxi-ncc-napoli`. La sorgente Pages è il ramo `main`, cartella `/(root)`, con `.nojekyll`. L'indirizzo è `https://shockeshop98.github.io/prontuario-taxi-ncc-napoli/` quando il deployment di GitHub Pages risulta completato. `index.html` e `version.json` restano nella radice, insieme alle cartelle `assets` e `allegati`.

## Installazione e uso offline

Aprire il sito pubblicato da telefono tramite HTTPS. Nel browser scegliere “Installa app” o “Aggiungi alla schermata Home”. Dopo la prima apertura con rete, il prontuario, la ricerca, l’indice, la legenda e il testo ricercabile delle fonti sono disponibili offline. L’indicatore vicino alla versione mostra lo stato della connessione; la verifica della revisione online riprende al ritorno della rete.

I PDF e il file di testo originali non vengono scaricati automaticamente. In **Fonti e allegati**, premere **Salva offline** per ciascun documento necessario e attendere “Salvato sul dispositivo”. Gli aggiornamenti conservano le copie il cui contenuto corrisponde ancora ai file pubblicati; un allegato modificato va salvato nuovamente. Il browser può eliminare i dati locali per liberare spazio: controllare lo stato prima di usare un allegato senza rete. **Scarica PDF** crea invece un normale download del browser. Se il visualizzatore Android non apre il PDF, usare questo pulsante e aprire il file dalla cartella Download. Dalla versione 1.2.1 il service worker serve i PDF salvati anche quando il browser li richiede come navigazione di una nuova scheda.

Per provare la PWA in locale, usare `python3 -m http.server 8000` e aprire `http://localhost:8000` (non `file://`). Nei DevTools verificare manifest, service worker e modalità offline. I browser mobili richiedono HTTPS sul sito pubblicato.

## Aggiornamenti per i colleghi

Gli aggiornamenti dei file su `main` vengono ripubblicati sul medesimo indirizzo. La pagina verifica `version.json` all’apertura, ogni minuto e al ritorno in primo piano. Se rileva una revisione diversa mostra “Apri versione aggiornata”, senza interrompere la lettura. La versione 1.2.1 attende che la nuova pagina e il relativo service worker siano pronti prima di aprirla; chi arriva da 1.1.0 può vedere per alcuni secondi “Aggiornamento della copia offline…” dopo il cambio pagina. Non occorre disinstallare la PWA. Quando la rete manca, rimane visibile la versione locale e la verifica online risulta non disponibile. La disponibilità dipende dal completamento della pubblicazione e dalla propagazione dei file; non è un aggiornamento istantaneo a ogni telefono.

Pubblicare sempre `index.html`, `version.json`, `sw.js`, `manifest.webmanifest`, le icone e gli allegati aggiornati insieme. Dopo ogni modifica a HTML, worker, manifest o allegati, eseguire `python3 scripts/update-build.py`: aggiorna coerentemente `BUILD_ID` nell’HTML, `build_id` nel JSON, `BUILD_ID` e le impronte degli allegati nel service worker. Se cambia la versione, impostarla prima sia in `version.json` sia nella costante `RELEASE` nell’HTML; aggiornare la data solo per una nuova revisione dei contenuti. Il service worker prepara la nuova revisione solo quando il relativo HTML è disponibile; al cambio di revisione conserva gli allegati salvati il cui hash SHA-256 corrisponde al file attuale e rimuove le copie obsolete. Le copie HTML scaricate in precedenza non cambiano da sole: per gli aggiornamenti usare il link del sito.

## Struttura

- `index.html`: prontuario e contenuti testuali; gli allegati vengono caricati solo quando richiesti.
- `version.json`: versione, data e identificatore della revisione.
- `sw.js`: cache della pagina e degli allegati salvati su richiesta.
- `manifest.webmanifest` e `assets/icon-*.png`: installazione e icone; le icone si rigenerano con `python3 scripts/generate-pwa-icons.py`.
- `assets/`: stemmi già presenti nel prontuario.
- `allegati/`: documenti originali e PDF normale del prontuario, conservati integralmente.
- `.nojekyll`: pubblicazione statica senza elaborazione Jekyll.

Versione 1.2.1, contenuti revisionati al 1 ottobre 2026. La versione PWA non rappresenta una nuova verifica normativa. Rielaborazione del prontuario U.O. G.I.T. TURISTICA, del regolamento fornito e delle diciture EGAF. Gli originali mantengono la propria attribuzione. Revisione proposta per validazione interna; fonti e limiti dell’aggiornamento sono riportati nel prontuario. Gli aggiornamenti normativi sono revisioni curate, non un’acquisizione automatica delle leggi da parte di GitHub.

Documentazione ufficiale: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
