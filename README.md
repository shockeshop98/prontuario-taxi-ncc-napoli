# Prontuario interattivo Taxi NCC e trazione animale Napoli

A cura dell’Agente Antonio Balzano · U.O. San Lorenzo.

Prontuario di consultazione con 116 voci attive di catalogo, ricerca per sinonimi e parole simili, indice per servizio, importi, riferimenti normativi, formule orientative, suggerimenti e note operative. I riferimenti al regolamento identificano la delibera C.C. n. 80/2005. Non contiene registrazioni di controlli, generalità dei conducenti o relazioni di servizio.

## Revisione 1.8.6 / PDF 7.8

Revisione documentale del 10 ottobre 2026: 187 schede (113 Taxi, 70 NCC, 4 trazione animale), una pagina per scheda, PDF di 207 pagine e sei pagine di indice. Pubblicazione su GitHub Pages autorizzata dall’autore dopo la consegna locale. La versione pubblica di partenza è stata riscontrata: PWA 1.8.5 / PDF 7.7, 206 pagine. L’esito del rilascio si verifica nei [deploy del repository](https://github.com/shockeshop98/prontuario-taxi-ncc-napoli/actions), confrontando versione e build del sito.

Riferimenti ordinati CdS → L.21/1992 → regolamento → ulteriori atti. Il riquadro distingue accessorie CdS, adempimenti, segnalazione obbligatoria quando prevista e provvedimenti dell’ufficio; questi ultimi sono esclusi dalla copia. Gli adempimenti copiati hanno uno stato da completare e non attestano attività già compiute.

G24 conserva la fila dei passeggeri: lett. g proposta con ambiguità esplicita, non qualificazione certa né prelievo fuori posteggio. G28-01 distingue la ricevuta su richiesta; G28-02–04 restano relazioni finché non sono documentati atto efficace e presupposti. Importi invariati, con condizioni di applicazione visibili. R17–R18 restano rimosse; TC01 e gli originali del taxi collettivo sono conservati.

[Rapporto completo](RAPPORTO_REVISIONE_1.8.6.md), [tabella di tutte le schede](revisione/1.8.6/controllo-schede.csv), [esiti in JSON](revisione/1.8.6/controllo-schede.json), [registro delle fonti con hash e limiti](revisione/1.8.6/fonti.json). Il parere ART57/2026 riguarda un nuovo schema di regolamento: non è stata accertata la successiva approvazione/efficacia. Mancano diversi atti integrali, elencati nel rapporto; il controllo non attesta la vigenza assoluta né autorizza contestazioni automatiche.

Il nuovo PDF deve essere salvato nuovamente nella PWA. Le copie degli allegati originali invariati restano conservabili offline.

## Storia delle revisioni precedenti (non istruzioni correnti)

### Base 1.8.0 Taxi collettivo

La scheda **TC01** aggiunge la consultazione del collegamento Aeroporto di Capodichino – Stazione Centrale – Molo Beverello e viceversa, senza creare una nuova sanzione. Riporta l’O.D. n. 1/2019, la proroga dell’O.D. n. 10/2025 fino al **31/12/2026** e l’integrazione temporanea dell’O.D. n. 9/2026 sui veicoli con meno di sette posti a disposizione dell’utenza. Distingue il dispositivo dalle prescrizioni della delibera G.C. n. 634/2018 richiamate nelle premesse. Dopo la scadenza invita a verificare un’eventuale nuova proroga.

I tre originali sono in **Fonti e allegati** con apertura, download e salvataggio offline separato. La ricerca riconosce anche “taxi sharing”, “Alibus”, “sei euro”, “6 euro”, “Capodichino” e “meno di sette posti”. Le schede pertinenti rinviano a TC01 senza duplicare la disciplina né attribuire automaticamente importi. Il PDF 7.2 ha 204 pagine e collega TC01 a pagina 58. La revisione resta locale: nessun commit o pubblicazione. I dubbi documentali e operativi sono in [VERIFICA_TAXI_COLLETTIVO.md](VERIFICA_TAXI_COLLETTIVO.md).

Nella versione pubblica 1.7.0 il modello statico presenta 185 schede canoniche distinte per servizio e fascia. I03-01–04 rinviano a N04–N07; I07 e i suoi sinonimi rinviano alle quattro fasce G07. Il catalogo originario conserva i dati giuridici delle due voci rinviate, senza schede autonome. Ricerca e indice aprono direttamente il caso; ogni scheda mostra una sola tabella degli importi, testo orientativo e suggerimenti specifici. “Copia testo orientativo” copia la formula con segnaposto […], senza gli elenchi delle alternative. Nei casi con sospensione del documento il seguito è un blocco continuo; un’unica istruzione esterna alla formula indica di conservarne soltanto gli atti documentati e di adattarlo prima dell’uso. Le segnalazioni interne restano nelle note operative, non nel testo copiato. Non sono presenti questionari o dati compilati. I06, le schede di solo riferimento e quelle con base ancora da qualificare presentano una relazione senza frase finale del verbale. Il PDF normale 7.1 ha 203 pagine: copertina, sei pagine di indice collegato, cinque pagine introduttive, 185 schede di una pagina ciascuna e sei pagine di appendici e fonti. Formule e seguito operativo restano completi nella scheda; istruzioni comuni e approfondimenti sono richiamati nell’appendice. I caratteri delle schede restano a 9 pt senza riduzione automatica. “Scheda PDF” raggiunge la pagina del caso aperto. Il vecchio materiale delle guide resta nel repository come storico non caricato dalla PWA né impaginato nel PDF 7.1 pubblicato.

Nei testi orientativi per il verbale compare la frase finale sul Corso Pubblico, tranne nei casi di taxi e NCC abusivo G01, G02, I02, N01, N02, N03 e N12; nelle relazioni non compare. La nota operativa sulla segnalazione resta in ogni scheda. Per N02 e N03 la verifica del precedente richiede identità e ruolo personali, distinti dalla sola impresa, e il riscontro dell’Ufficio Verbali sui profili ancora dubbi. Gli esempi locali comprendono 21 rami e quattro situazioni aggiuntive.

## Pubblicazione con GitHub Pages

Repository pubblico: `shockeshop98/prontuario-taxi-ncc-napoli`. La sorgente Pages è il ramo `main`, cartella `/(root)`, con `.nojekyll`. L'indirizzo è `https://shockeshop98.github.io/prontuario-taxi-ncc-napoli/` quando il deployment di GitHub Pages risulta completato. `index.html` e `version.json` restano nella radice, insieme alle cartelle `assets` e `allegati`.

## Installazione e uso offline

Aprire il sito pubblicato da telefono tramite HTTPS. Nel browser scegliere “Installa app” o “Aggiungi alla schermata Home”. Dopo la prima apertura con rete, il prontuario, la ricerca, l’indice, la legenda e il testo ricercabile delle fonti sono disponibili offline. L’indicatore vicino alla versione mostra se il sito risponde alla richiesta di `version.json`; non deduce la raggiungibilità da `navigator.onLine`. La verifica riprende anche quando l’app torna in primo piano.

I PDF e il file di testo originali non vengono scaricati automaticamente. Il riquadro **PDF salvati nella PWA** mostra il conteggio. **Prepara PDF offline** apre gli allegati; si possono salvare singolarmente o usare **Salva i PDF mancanti** (circa 14,5 MB per tutti e dieci). Ogni scheda mostra dimensione e progresso. Attendere “Salvato nella PWA”. Gli aggiornamenti conservano le copie il cui contenuto corrisponde ancora ai file pubblicati; un allegato modificato va salvato nuovamente. Il browser può eliminare i dati locali per liberare spazio: controllare lo stato prima di usare un allegato senza rete. **Scarica PDF** invia un normale download al browser, separato dalla cache PWA; il sito non può confermare che il file sia arrivato nella cartella Download. Se il visualizzatore Android non apre il PDF, usare questo pulsante e aprire il file dalla cartella Download. Dalla versione 1.2.1 il service worker serve i PDF salvati anche quando il browser li richiede come navigazione di una nuova scheda.

Per provare la PWA in locale, usare `python3 -m http.server 8000` e aprire `http://localhost:8000` (non `file://`). Nei DevTools verificare manifest, service worker e modalità offline. I browser mobili richiedono HTTPS sul sito pubblicato.

## Aggiornamenti per i colleghi

Gli aggiornamenti dei file su `main` vengono ripubblicati sul medesimo indirizzo. La pagina verifica `version.json` all’apertura, ogni minuto e al ritorno in primo piano. Se rileva una revisione diversa mostra “Apri versione aggiornata”, senza interrompere la lettura. La versione 1.3.0 prepara il nuovo service worker e attende l’apertura esplicita della revisione prima di attivarlo. Se sono aperte più schede, le copie PDF ancora valide restano disponibili nella pagina precedente; questa segnala che occorre aprire la nuova versione quando si è terminata la lettura. Chi arriva da una revisione precedente può vedere per alcuni secondi “Aggiornamento della copia offline…” dopo il cambio pagina. Non occorre disinstallare la PWA. Quando la rete manca, rimane visibile la versione locale e la verifica online risulta non disponibile. La disponibilità dipende dal completamento della pubblicazione e dalla propagazione dei file; non è un aggiornamento istantaneo a ogni telefono.

Pubblicare sempre `index.html`, `version.json`, `sw.js`, `manifest.webmanifest`, icone, guide, script, fogli di stile e allegati aggiornati insieme. Dopo ogni modifica a questi file, eseguire `python3 scripts/update-build.py`: aggiorna coerentemente `BUILD_ID` nell’HTML, `build_id` nel JSON, `BUILD_ID` e le impronte degli allegati nel service worker; include nel build gli hash di tutte le risorse statiche precaricate. Se cambia la versione, impostarla prima sia in `version.json` sia nella costante `RELEASE` nell’HTML; aggiornare la data solo per una nuova revisione dei contenuti. Il service worker prepara la nuova revisione solo quando il relativo HTML è disponibile; al cambio di revisione conserva gli allegati salvati il cui hash SHA-256 corrisponde al file attuale, mantiene la cache precedente per le schede ancora aperte e rimuove le copie obsolete. **Aggiorna dal sito** forza una nuova richiesta di rete, controlla dimensione e hash e conserva la copia precedente in caso di errore. Le copie HTML scaricate in precedenza non cambiano da sole: per gli aggiornamenti usare il link del sito.

## Struttura

- `index.html`: prontuario e contenuti testuali; gli allegati vengono caricati solo quando richiesti.
- `scripts/operative-rules.js`, `scripts/static-demos.js`, `scripts/static-field-suggestions.js`, `scripts/static-demo-ui.js`, `scripts/taxi-collettivo.js`, `scripts/static-catalog.js`, `scripts/static-catalog-ui.js` e `assets/static-demo.css`: testi editoriali, suggerimenti contestuali accanto ai punti da completare, alias I03/I07 e impaginazione delle 187 schede locali, inclusa TC01 di consultazione. I suggerimenti distinguono fonte del fatto, riscontro del titolo, ufficio consultato per i precedenti ed estremi degli atti; restano fuori dalla copia. `data/guide-operative.json` e gli script del precedente compilatore restano soltanto come materiale storico e di verifica; non sono caricati dalla PWA.
- `version.json`: versione, data e identificatore della revisione.
- `sw.js`: cache della pagina e degli allegati salvati su richiesta.
- `manifest.webmanifest` e `assets/icon-*.png`: installazione e icone. L'originale T/N è in `assets/icon-source-tn.png`; `npm run generate:icons` crea icone normali e maskable, favicon e Apple touch icon.
- `assets/`: stemmi e icone; `polizia-locale-napoli.png` è una rielaborazione grafica dell’immagine fornita, non una fonte certificata dello stemma.
- `allegati/`: documenti originali e PDF normale del prontuario, conservati integralmente.
- `scripts/generate-prontuario-static.mjs`: rigenera da HTML pulito l’intero PDF 7.8, inclusi copertina, apparati, indici e collegamenti alle singole schede. `scripts/generate-prontuario.mjs` è il generatore storico, non usato da `npm run generate:pdf`.
- `.nojekyll`: pubblicazione statica senza elaborazione Jekyll.
- `CHANGELOG.md`: modifiche delle versioni pubblicate.

Per rigenerare: `npm ci`, predisporre Chromium (oppure `CHROMIUM_PATH`), `npm run generate:pdf`, `python3 scripts/update-build.py`, `npm run audit:cards`, `npm test`. Per le prove browser avviare `python3 -m http.server 8000 --bind 127.0.0.1` e poi `npm run test:browser` con Chromium disponibile. Quest’ultimo usa un profilo effimero e scrive gli esiti in `revisione/1.8.6/`. Il test non pubblica nulla. Per le icone: `npm run generate:icons` prima della rigenerazione del build.

La verifica pubblica riproducibile è in `scripts/verify-public-release.mjs`: eseguire `prepare` prima del deploy e `verify` dopo, impostando `CHROMIUM_PATH` e la stessa directory temporanea `RELEASE_VERIFY_DIR`. Prepara la vera cache 1.8.5, prova l’aggiornamento esplicito a 1.8.6, confronta le impronte dei file pubblici e verifica schede, copia e PDF offline. Profilo browser e risultati temporanei non vanno inclusi nel commit.

Le formule richiedono riscontri reali; gli importi delle basi non ancora qualificate non sono automaticamente applicabili. Originali GIT/EGAF conservati con attribuzione. Revisione proposta per validazione interna.

La verifica puntuale dei dubbi I02, G02, N02 e N03, con fonti ufficiali e quesito per l'Ufficio Verbali, è in [VERIFICA_NORMATIVA_GUIDE.md](VERIFICA_NORMATIVA_GUIDE.md). Non sostituisce la data di verifica generale del catalogo.

Documentazione ufficiale: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
