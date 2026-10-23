<!-- Stato di rilascio: 1.8.13 / PDF 7.15; sezioni precedenti conservate come storico. -->
# Prontuario interattivo Taxi NCC e trazione animale Napoli

A cura dell’Agente Antonio Balzano · U.O. San Lorenzo.

Prontuario di consultazione con 119 voci di catalogo, comprese voci di consultazione e R01 esplicitamente inattiva, ricerca per sinonimi e parole simili, indice per servizio, importi, riferimenti normativi, formule orientative, suggerimenti e note operative. I riferimenti al regolamento identificano la delibera C.C. n. 80/2005. Non contiene registrazioni di controlli, generalità dei conducenti o relazioni di servizio.

## Revisione 1.8.13 / PDF 7.15 · O.S.835/2014

[Anteprima](revisione/1.8.13/anteprima.html), [rapporto e fonti](RAPPORTO_REVISIONE_1.8.13.md), [confronto prima/dopo](revisione/1.8.13/confronto-prima-dopo.md). Prescrizioni confermate dall’autore: R44 impiego oltre sei ore giornaliere, R45 passeggeri oltre capienza autorizzata, R46 equino senza scarpe protettive. Integrale O.S.835/2014 e sanzione specifica restano non acquisiti; nessun punto dell’atto inventato. Regime generale TUEL €25–500 e PMR€50 entro60giorni, se applicabile e salvo diversa delibera di Giunta, verificato separatamente. Nessun ritiro, punto o misura CdS automatici; cumuli con R39–R43 da escludere in assenza dei relativi presupposti.

119voci,190schede,211pagine,6indici e16allegati. R39–R42 integralmente conservate, Corso Pubblico incluso; R43 aggiorna solo il rinvio alle nuove schede. PDF e build rigenerati. Pubblicazione completata e verificata; esiti nel rapporto.

## Revisione locale 1.8.12 / PDF 7.14 · 23 ottobre 2026

[Anteprima](revisione/1.8.12/anteprima.html), [confronto prima/dopo](revisione/1.8.12/confronto-prima-dopo.md), [rapporto e fonti](RAPPORTO_REVISIONE_1.8.12.md). G46/G47 aggiornate dalla foto acquisita: almeno cinque stalli, non più di due tassisti, trenta minuti, ultimi due posti disponibili e disco sul parabrezza; scali aeroportuali/ferroviari esclusi, efficacia dalla segnaletica. Prot.11 del7/6/2010 distinto dal progressivo1003 dell’8/6/2010; originale ufficiale non reperito.

R43 è l’unica nuova scheda: caldo equini, stagione e fascia12–16 insieme a temperatura≥30°C oppure bollettino Napoli rischio2/3. ORDSI443/2024 limitata al12/6–15/9/2024; ORDSI571/2025 stagione1/6–15/9 fino all’approvazione degli aggiornamenti del regolamento animali, con verifica di atti successivi. TUEL€25–500, PMR€50 entro60giorni salvo diversa delibera di Giunta non acquisita; incongruenze del dispositivo documentate. Nessuno sconto30%, punto o ritiro da questa fattispecie. Le tre [proposte O.S.835/2014](revisione/1.8.12/proposte-OS835.md) restano separate perché l’integrale non è stato reperito.

R39–R42 conservate integralmente, compreso il destinatario Corso Pubblico e l’attestazione del solo ritiro materiale.116voci,187schede,208pagine,6indici;15allegati salvabili offline. PDF e build rigenerati; nessun commit, push o deploy.

## Integrazione locale 1.8.11 / PDF 7.13 · 22 ottobre 2026

Aggiornamento locale del 23 ottobre: per R39–R42 la licenza ritirata va trasmessa all’Ufficio Corso Pubblico del Comune di Napoli entro cinque giorni dal ritiro, mantenendo il termine già verificato ex art.216 CdS. Il destinatario è un’indicazione organizzativa confermata dall’autore, distinta dal testo normativo; nessun nuovo atto organizzativo acquisito. Clausola PWA/PDF: «La licenza è ritirata e sarà trasmessa all’Ufficio Corso Pubblico.», copiata soltanto se il ritiro è materialmente eseguito; l’obbligo resta negli adempimenti. PDF e build rigenerati, nessun commit, push o deploy.

Conservata la revisione locale 1.8.10, senza commit, push o deploy. [Rapporto aggiornato](RAPPORTO_REVISIONE_1.8.11.md), [anteprima locale](revisione/1.8.11/anteprima.html), [confronto prima/dopo](revisione/1.8.11/confronto-prima-dopo.md), [inventario dei nove allegati letti](revisione/1.8.11/allegati-letti.md) e [PDF corrente](allegati/Prontuario_Taxi_NCC_Napoli.pdf). 115 voci di catalogo, incluse le voci di consultazione e R01 inattiva; 186 schede, una pagina ciascuna a 9 pt, 207 pagine e sei indici. Nessuna nuova scheda e G51 sempre assente; originali, due stemmi, crediti e rapporti storici conservati.

R39–R42: art.70, prescrizioni della licenza confermate dall’autore, tabella €42/€29,40/€86,50 e ritiro; attestazione distinta dall’obbligo. G48: acquisita l’O.D.3/2021, registrazione OD/2021/0000298; cartellini su entrambi i vetri e sospensione del diritto al cambio turno di 6/12/24 mesi sul conducente responsabile. G49: applicati importi, rimozione e 2 punti; G50: mancata partenza oltre 15 minuti dall’arrivo dei primi tre. I09 conserva la duplicazione tecnica richiesta nel gestionale senza farne solidarietà giuridica. R01 è consultabile con stato di futura attivazione anche nei risultati. G47 applica 30 minuti secondo l’autore: testo integrale O.S.11/2010 ancora da acquisire. Stalli G52 già individuati nell’O.D.1/2019; proroga 2025 e integrazione 2026 conservate. Il nuovo PDF collettivo è identico all’archiviato, senza duplicazione fra le fonti.

Anteprima: `python3 -m http.server 8000 --bind 127.0.0.1`, poi http://127.0.0.1:8000/revisione/1.8.11/anteprima.html. Riproduzione: `npm run generate:pdf`, `python3 scripts/update-build.py`, `npm run audit:cards`, `npm test`, `git diff --check`. Con Chromium: `npm run test:browser`, `node scripts/verify-seconda-parte.mjs`, `node scripts/verify-local-upgrade.mjs` (vera baseline locale 1.8.10); `node scripts/generate-integrazione-review.mjs` rigenera l’anteprima corrente. L’audit scrive in 1.8.11. Non eseguire i generatori delle revisioni storiche per aggiornare questa consegna. Il prontuario modificato va salvato di nuovo nella PWA; l’O.D.3/2021 è un nuovo allegato salvabile. Gli altri originali invariati restano in cache.

## Stato precedente 1.8.10 / PDF 7.12 · seconda parte

La sezione seguente conserva lo stato precedente; fonti, dubbi e comandi correnti sono aggiornati nella sezione 1.8.11 sopra.

Revisione del 21 ottobre 2026, **senza commit, push o deploy**. [Rapporto con fonti e punti da confermare](RAPPORTO_REVISIONE_1.8.10.md), [anteprima locale](revisione/1.8.10/anteprima.html), [confronto completo prima/dopo](revisione/1.8.10/confronto-prima-dopo.md) e [PDF corrente](allegati/Prontuario_Taxi_NCC_Napoli.pdf). G51 eliminata: 115 voci attive, 186 schede di una pagina, 207 pagine totali, sei indici. La nuova pagina fonti compensa la pagina di scheda eliminata; conteggi ricavati dal generatore. Conservati originali, rapporti storici, due stemmi e crediti.

15 schede aggiornate e pulizia editoriale trasversale. Trazione animale: art. 70 CdS, con collegamento al titolo da verificare; art. 86 non esteso automaticamente. Restano aperti ordinanze G46–G48, applicazione G49 al taxi fuori servizio, coordinamento temporale G50, responsabilità/sanzione I09 e gli ulteriori dubbi nel rapporto. G52 adotta la tabella art. 86 con i presupposti nelle note. Le relazioni aggiungono la frase sul verbale solo dopo conferma che sia effettivamente elevato.

Anteprima: `python3 -m http.server 8000 --bind 127.0.0.1`, poi http://127.0.0.1:8000/revisione/1.8.10/anteprima.html. Riproduzione: `npm run generate:pdf`, `python3 scripts/update-build.py`, `npm run audit:cards`, `npm test`, `git diff --check`. Con Chromium disponibile: `npm run test:browser`, `node scripts/verify-seconda-parte.mjs`, `node scripts/verify-local-upgrade.mjs`; `node scripts/generate-seconda-parte-review.mjs` aggiorna il confronto senza riscrivere la fotografia iniziale. L’audit corrente scrive in 1.8.10; non eseguire i generatori delle anteprime storiche per questa consegna.

## Revisione precedente 1.8.9 / PDF 7.11 · G01–G43

Revisione editoriale del 18 ottobre 2026: [anteprima dei 38 codici effettivamente enumerati](revisione/1.8.9/anteprima.html), [rapporto con fonti, conflitti e richieste da confermare](RAPPORTO_REVISIONE_1.8.9.md), [confronto integrale prima/dopo](revisione/1.8.9/confronto-prima-dopo.md) e [PDF completo](allegati/Prontuario_Taxi_NCC_Napoli.pdf). Il file dichiara 39 codici ma ne enumera 38; nessun codice aggiunto. Conservate 187 schede, 207 pagine, importi e altre 149 schede; G24 ora riguarda il turno di fila dei taxi. Formule brevi, esempi e note fuori dalla copia, attestazioni solo per atti confermati. I punti normativi controversi restano nel rapporto, senza introdurre obblighi non verificati. **La revisione non costituisce una validazione normativa completa.**

La [proposta precedente dei quattro esempi](revisione/1.8.8/anteprima-operativa.html) resta separata e invariata. Le nuove indicazioni dell’autore si applicano soltanto ai 38 codici elencati; nessuna estensione generale di quella proposta. Gli avvisi su CAP/patente/RCA e sul termine interno di cinque giorni restano non confermati. Dopo la consegna locale l’autore ha autorizzato commit, push ordinario su `main` e deploy GitHub Pages delle sole modifiche completate, mantenendo tutti i dubbi documentati e senza ulteriori modifiche normative. Il rapporto e gli esiti locali conservano la data e lo stato della verifica precedente alla pubblicazione.

Per riprodurre: `npm run generate:pdf`, `python3 scripts/update-build.py`, `npm test`, `git diff --check`. Con server locale attivo e `CHROMIUM_PATH` impostato: `npm run test:browser`, `node scripts/verify-g01-g43.mjs`; poi `node scripts/generate-g01-g43-review.mjs` per aggiornare il confronto e l’anteprima senza sovrascrivere lo stato iniziale. Le immagini e gli esiti sono in `revisione/1.8.9/`.

## Stato pubblicato di partenza 1.8.8 e proposta operativa precedente

PWA 1.8.8 / PDF completo 7.10: rimossi dalla sola intestazione e copertina lo stemma della Municipale; conservati Polizia Turistica, U.O. San Lorenzo e crediti. Contenuto delle 187 schede, importi, punti e 187 collegamenti PDF conservati; 207 pagine, una pagina per scheda. Data documentale 10/10/2026.

La [proposta operativa del 15 ottobre](revisione/1.8.8/anteprima-operativa.html) presenta **quattro esempi da valutare prima dell’estensione**: G19, G23, G03-01 e G01, con [PDF dedicato](revisione/1.8.8/Esempi_revisione_operativa.pdf), schermate e formule complete. Nello stato 1.8.8, solo negli esempi erano eliminato il vecchio box informativo e introdotti avviso sulla licenza, formule brevi e varianti per gli atti eseguiti; le 187 schede complete mantenevano la struttura precedente. Il [rapporto documentale](RAPPORTO_PROPOSTA_OPERATIVA_1.8.8.md) distingue ritiro verificato dei gruppi C/D dalla disposizione interna da acquisire per C.A.P./patente/RCA e termine di invio della licenza. L’autorizzazione precedente alla pubblicazione riguardava lo stato 1.8.8, senza estendere la proposta oltre i quattro esempi, e non confermava gli obblighi ancora privi della disposizione interna. La revisione locale 1.8.9 ha istruzioni e ambito distinti, descritti sopra.

Dopo aver avviato il server locale, `CHROMIUM_PATH=... node scripts/generate-revisione-operativa.mjs` rigenera la proposta HTML/PDF e `CHROMIUM_PATH=... node scripts/verify-revisione-operativa.mjs` controlla copia, varianti, mobile e conservazione rispetto alla copia iniziale in `/tmp/prontuario-operativa-baseline` (sostituibile con `OPERATIVE_BASELINE`). Esiti in `revisione/1.8.8/verifica-proposta.json`. Le prove ordinarie restano `npm test` e `npm run test:browser`. Per il PDF completo, usare sempre `npm run generate:pdf`, poi `python3 scripts/update-build.py`.

## Revisione grafica locale precedente 1.8.7 / PDF 7.9

Intestazione PWA e copertina PDF con tre stemmi originali, nell’ordine Polizia Municipale, Polizia Turistica con il canguro, U.O. San Lorenzo. Crediti centrati: «A cura dell’Agente Antonio Balzano» / «U.O. San Lorenzo» e «Con la collaborazione del Maresciallo Pasquale D’Ascoli» / «Polizia Turistica», con maggiore evidenza ai nomi.

Revisione grafica del 14 ottobre 2026. La revisione documentale resta quella del 10 ottobre: norme, importi, formule, 187 schede, collegamenti e numerazione conservati. PDF di 207 pagine, una pagina per scheda e sei pagine di indice. Nuovo stemma offline in `assets/logo-polizia-turistica.png`; JPG originale conservato. `node scripts/prepare-turistica-logo.mjs` riproduce lo scontorno modificando soltanto il canale alpha del fondo esterno connesso ai margini, senza ridisegnare né ritoccare i pixel dello scudo.

Anteprime locali in [revisione/1.8.7/anteprima.html](revisione/1.8.7/anteprima.html); esiti browser in [browser-check.json](revisione/1.8.7/browser-check.json) e confronto con la base in [verifiche-grafica.json](revisione/1.8.7/verifiche-grafica.json). Verificati desktop, mobile 360/390 px e apertura offline di PWA, nuovo stemma e PDF salvato. `npm test` e `git diff --check` superati. Nessun commit, push o deploy: risultato locale da esaminare. Il nuovo PDF va salvato nuovamente nella PWA; gli allegati originali invariati restano conservabili offline.

## Revisione documentale di base 1.8.6 / PDF 7.8

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

Repository pubblico: `shockeshop98/prontuario-taxi-ncc-napoli`. Pages è pubblicato dal workflow `.github/workflows/pages.yml` dopo un push ordinario su `main`. L’artefatto contiene soltanto i file elencati in `pages-files.json`, preparati da `scripts/package-pages.mjs`; la radice del repository non viene pubblicata integralmente. L'indirizzo è `https://shockeshop98.github.io/prontuario-taxi-ncc-napoli/` quando il deployment di GitHub Pages risulta completato. `index.html` e `version.json` restano nella radice, insieme alle cartelle `assets` e `allegati`.

## Installazione e uso offline

Aprire il sito pubblicato da telefono tramite HTTPS. Nel browser scegliere “Installa app” o “Aggiungi alla schermata Home”. Dopo la prima apertura con rete, il prontuario, la ricerca, l’indice, la legenda e il testo ricercabile delle fonti sono disponibili offline. L’indicatore vicino alla versione mostra se il sito risponde alla richiesta di `version.json`; non deduce la raggiungibilità da `navigator.onLine`. La verifica riprende anche quando l’app torna in primo piano.

I PDF e il file di testo originali non vengono scaricati automaticamente. Il riquadro **PDF salvati nella PWA** mostra il conteggio. **Prepara PDF offline** apre gli allegati; si possono salvare singolarmente o usare **Salva i PDF mancanti** (sedici allegati nella revisione corrente, compreso il testo EGAF art.85). Ogni scheda mostra dimensione e progresso. Attendere “Salvato nella PWA”. Gli aggiornamenti conservano le copie il cui contenuto corrisponde ancora ai file pubblicati; un allegato modificato va salvato nuovamente. Il browser può eliminare i dati locali per liberare spazio: controllare lo stato prima di usare un allegato senza rete. **Scarica PDF** invia un normale download al browser, separato dalla cache PWA; il sito non può confermare che il file sia arrivato nella cartella Download. Se il visualizzatore Android non apre il PDF, usare questo pulsante e aprire il file dalla cartella Download. Dalla versione 1.2.1 il service worker serve i PDF salvati anche quando il browser li richiede come navigazione di una nuova scheda.

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
- `scripts/generate-prontuario-static.mjs`: rigenera da HTML pulito l’intero PDF corrente 7.15, inclusi copertina, apparati, indici e collegamenti alle singole schede. `scripts/generate-prontuario.mjs` è il generatore storico, non usato da `npm run generate:pdf`.
- `.nojekyll`: pubblicazione statica senza elaborazione Jekyll.
- `CHANGELOG.md`: modifiche delle versioni pubblicate.

Per rigenerare: `npm ci`, predisporre Chromium (oppure `CHROMIUM_PATH`), `npm run generate:pdf`, `python3 scripts/update-build.py`, `npm run audit:cards`, `npm test`. Per le prove browser avviare `python3 -m http.server 8000 --bind 127.0.0.1` e poi `npm run test:browser` con Chromium disponibile. Quest’ultimo usa un profilo effimero e scrive gli esiti in `revisione/<versione>/`. Il test non pubblica nulla. Per le icone: `npm run generate:icons` prima della rigenerazione del build.

La verifica pubblica riproducibile è in `scripts/verify-public-release.mjs`: eseguire `prepare` prima del deploy e `verify` dopo, impostando `CHROMIUM_PATH` e la stessa directory temporanea `RELEASE_VERIFY_DIR`. Prepara la vera cache 1.8.5, prova l’aggiornamento esplicito a 1.8.6, confronta le impronte dei file pubblici e verifica schede, copia e PDF offline. Profilo browser e risultati temporanei non vanno inclusi nel commit.

Le formule richiedono riscontri reali; gli importi delle basi non ancora qualificate non sono automaticamente applicabili. Originali GIT/EGAF conservati con attribuzione. Revisione proposta per validazione interna.

La verifica puntuale dei dubbi I02, G02, N02 e N03, con fonti ufficiali e quesito per l'Ufficio Verbali, è in [VERIFICA_NORMATIVA_GUIDE.md](VERIFICA_NORMATIVA_GUIDE.md). Non sostituisce la data di verifica generale del catalogo.

Documentazione ufficiale: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Pacchetto di pubblicazione 1.8.13

Pubblicazione autorizzata della revisione locale, conservando le modifiche1.8.10–1.8.13.190schede,211pagine PDF,190destinazioni. Gli originali EGAF integrali e gli input riservati restano locali; il vecchio PDF EGAF è sostituito da una nota di provenienza ed eliminato dalle cache durante l’aggiornamento. La cronologia Git precedente non viene riscritta. Vedere il rapporto1.8.13 per controlli ed esiti. Il PDF7.15 deve essere salvato nuovamente nella PWA.
