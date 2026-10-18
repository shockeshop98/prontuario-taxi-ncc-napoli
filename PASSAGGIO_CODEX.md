# Passaggio a Codex

Proprietario: Antonio Balzano, Agente Polizia Municipale Napoli, U.O. San Lorenzo.

## Stato corrente — 18 ottobre 2026, revisione G01–G43

PWA **1.8.9 / PDF 7.11**. Dopo la revisione locale, **l’autore ha autorizzato commit, push ordinario su main e deploy GitHub Pages delle modifiche completate**. Conservare tutte le questioni normative aperte; nessuna ulteriore modifica normativa autorizzata in questa pubblicazione e nessuna validazione normativa completa dichiarata. Partenza effettiva: commit `34694b4e1859c3a384849fa0870c87774b98db56`, PWA1.8.8/PDF7.10; tracciati puliti, solo `revisione-indicazioni-G01-G43.txt` non tracciato. File letto integralmente e conservato. Le indicazioni enumerano 38 codici univoci, non 39: nessun codice inventato. Nuove formule, esempi e note separate solo per questi 38; renderer condiviso PWA/PDF in `scripts/revision-g01-g43.js`. G24 ora riguarda la fila dei taxi; vecchia condotta soltanto nello storico. Altre 149 schede, importi, due stemmi, crediti, R17/R18 rimossi e proposta dei quattro esempi conservati. 187 schede / 207 pagine, una pagina per scheda, 9 pt.

Consegna: `RAPPORTO_REVISIONE_1.8.9.md`, `revisione/1.8.9/anteprima.html`, confronto completo prima/dopo MD/CSV/JSON e PDF principale rigenerato. I JSON di verifica documentano copia, mobile360/390, tutte le 187 destinazioni, cache/offline e vero aggiornamento locale dalla 1.8.8. Fotografia iniziale in `revisione/1.8.9/prima.json`, da non sovrascrivere. `npm test` include il nuovo controllo dei 38 codici, 149 schede conservate e 276 combinazioni delle attestazioni. Non usare la vecchia aspettativa G24/fila dei passeggeri per la nuova fattispecie.

Restano aperti decorrenza L.193/2024, coordinamento dei precedenti art.86c.3/art.8-bis L.689 e altri dubbi anteriori. Pagamento già materialmente eseguito non reso requisito assoluto; G02 nessun ritiro patente precompilato senza provvedimento, G03/G06/G07 nessun ritiro licenza per il solo titolo Napoli. CAP/patente/RCA e termine interno di 5 giorni restano proposte non confermate, fuori dagli obblighi delle schede e dalla copia. Le attestazioni selezionabili richiedono atti effettivi; nessuna guida autorizzata automaticamente se mancano altre condizioni di circolazione. Rapporto e registro fonti distinguono verifiche riuscite e pagine di errore Normattiva HTTP 200.

## Stato pubblicato di partenza — proposta operativa del 15 ottobre 2026

PWA **1.8.8 / PDF completo 7.10** con soli stemmi Turistica e San Lorenzo. Le 187 schede, tutti gli importi e punti e le 187 destinazioni PDF sono conservati. Data documentale del catalogo 10/10/2026. La nuova struttura operativa è limitata a **quattro esempi da valutare**, in `revisione/1.8.8/anteprima-operativa.html` e `Esempi_revisione_operativa.pdf` (copertina più quattro pagine). Vecchio box eliminato, avviso sulla licenza e formule brevi soltanto in questi esempi; nessuna estensione alle altre schede prima della valutazione espressa dell’autore. Il rapporto `RAPPORTO_PROPOSTA_OPERATIVA_1.8.8.md` documenta fonti, conflitti e disposizione del Comando da acquisire per ritiro CAP/patente/RCA e termini di invio della licenza. Una valutazione favorevole della struttura non prova gli obblighi ancora non riscontrati. L’autore ha successivamente autorizzato commit, push ordinario su `main` e deploy GitHub Pages dello stato attuale 1.8.8 / 7.10. Non estendere la nuova struttura oltre i quattro esempi; l’autorizzazione a pubblicare non conferma gli obblighi ancora non riscontrati.

## Stato precedente — revisione grafica locale del 14 ottobre 2026

PWA **1.8.7 / PDF 7.9**. Tre stemmi originali in intestazione e copertina: Municipale, Turistica, San Lorenzo. Crediti di Antonio Balzano e collaborazione di Pasquale D’Ascoli con appartenenze separate. Nuovo asset trasparente `assets/logo-polizia-turistica.png`, riproducibile con `node scripts/prepare-turistica-logo.mjs`; JPG originale intatto. Cache e build aggiornate. PDF: 207 pagine, 187 schede di una pagina, sei indici e tutti i collegamenti conservati. Nessuna revisione normativa: data documentale 10/10/2026 e contenuti della base integri. Anteprime e prove in `revisione/1.8.7/`; `npm test`, prove browser desktop/mobile/offline e `git diff --check` superati. Il risultato è soltanto locale: l’utente ha richiesto di esaminarlo prima di qualsiasi commit, push o deploy.

## Stato precedente — 10 ottobre 2026

Revisione **1.8.6 / PDF 7.8**, 187 schede di una pagina, 207 pagine totali. Pubblicazione GitHub Pages autorizzata dall’autore dopo la revisione locale; stato di partenza pubblico verificato: 1.8.5 / PDF 7.7. Verificare il completamento del rilascio nei deploy GitHub e la build del sito. Leggere prima `RAPPORTO_REVISIONE_1.8.6.md` e la tabella `revisione/1.8.6/controllo-schede.csv`. G24 e G28-02–04 hanno qualificazione non conclusa; il seguito comunale e la copia sono stati rielaborati. Istruzioni correnti di rigenerazione, test e verifica pubblica nel README. Le indicazioni sottostanti descrivono lo stato storico 1.8.5 e precedente: non ripristinare il vecchio invio automatico al Corso Pubblico né la lett. n per il rilascio anticipato.

## Stato storico
Repository remoto pubblico: shockeshop98/prontuario-taxi-ncc-napoli. La sua storia iniziale era distinta dall'importazione locale: conservare entrambe le storie tramite merge ordinario. Non usare push --force. La configurazione Pages e l'indirizzo del sito sono descritti nel README.

## Obiettivo della trasformazione
Prontuario HTML trasformato in PWA installabile, leggibile su telefono e consultabile offline. Le 116 voci attive del catalogo e le varianti editoriali producono 187 schede di caso e fascia nella revisione locale 1.8.5; I03-01–04 rinviano a N04–N07 e I07 alle fasce G07. R17 e R18 sono state eliminate dal catalogo attivo; gli originali documentali restano integri e la disciplina specifica pertinente è raccolta in TC01. Il compilatore guidato non è esposto. Le formule e i suggerimenti sono visibili nelle schede; la copia comprende la formula con […] e il seguito operativo pertinente.

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
La revisione locale è **1.8.5 / PDF 7.7**, 206 pagine: 187 schede di una pagina, sei pagine di indice, G24 a pagina 45, TC01 a pagina 58 e G28-02 a pagina 87. La versione 1.8.4 resta pubblicata su GitHub Pages. G24 riguarda l’acquisizione e il prelievo di persone esterne alla fila dei passeggeri; un eventuale prelievo fuori posteggio è distinto. G28-02 riporta l’art. 23, comma 1, lett. n, nelle norme e la D.D. 72/2012, punto 7, lett. b, nelle note. Il file ufficiale indicizzato della D.D. 72/2012 restituisce attualmente 404 e la D.D. 135/2010 integrale resta da acquisire. Dettagli in `RAPPORTO_REVISIONE_1.8.5.md`.

La revisione locale 1.8.0 aggiunge TC01, scheda di sola consultazione sul taxi collettivo Aeroporto–Stazione Centrale–Molo Beverello. I tre originali 2019, 2025 e 2026 sono in `allegati/` e in Fonti e allegati con salvataggio offline. Il PDF 7.2 ha 204 pagine e la scheda TC01 è a pagina 58; norme, importi e responsabilità delle 118 voci storiche restano invariati. La scadenza documentata è il 31/12/2026; verificare eventuale nuova proroga. Il rapporto tra le disposizioni su partenza, tassametro/ricevuta richiamate nelle premesse e la temporanea deroga sui posti richiede validazione dell’ufficio. Dettagli in `VERIFICA_TAXI_COLLETTIVO.md`.
La versione 1.7.0 è pubblicata. La 1.8.0 è una revisione locale senza push. Il PDF normale 7.2 ha 204 pagine: copertina, sei pagine di indice collegato, cinque pagine introduttive, 186 schede di una pagina, inclusa TC01 di sola consultazione, tre pagine di appendice operativa e tre pagine di confronto e fonti; tutte le pagine sono ricreate da HTML pulito. Ricerca, indice e “Scheda PDF” puntano alla singola fascia; I03-01–04 e I07 sono alias. I06 e le voci con base da qualificare espongono una formula per la relazione, senza frase finale del verbale. `scripts/static-field-suggestions.js` aggiunge accanto ai segnaposto suggerimenti caso per caso per fatto, fonti, titolo, precedenti e atti; C.O. e U.O. hanno alternative distinte con data e riferimento. Le alternative orientative non compaiono nel testo copiato; il seguito operativo va adattato agli atti documentati secondo l’unica istruzione esterna alla formula. Norme, importi e responsabilità restano nel catalogo originario. La ricerca e le schede sono precaricate offline; il PDF 7.2 va salvato nuovamente nella PWA, mentre gli allegati originali ancora validi si conservano tra build.

Nella 1.5.5 la frase finale sul Corso Pubblico torna nei verbali diversi dai sette casi abusivi G01, G02, I02, N01, N02, N03 e N12; resta assente dalle relazioni. N02/N03 richiedono la verifica della persona interessata dalla conseguenza sulla patente e del suo ruolo nel precedente: la sola impresa porta alla relazione. I 21 esempi dei rami sono affiancati da quattro situazioni aggiuntive.

Lo stato “Sito raggiungibile” deriva da una richiesta a `version.json`, non da `navigator.onLine`. I messaggi di successo PDF sono brevi; gli errori rimangono visibili. “Aggiorna dal sito” bypassa la cache, verifica dimensione e SHA-256 e conserva una copia valida in caso di errore. Il nuovo worker attende la richiesta esplicita di aggiornamento, conserva per la scheda precedente l'ultima cache di PDF validi e segnala a una pagina con build differente che deve aprire la nuova versione.

`node tests/pwa.test.mjs` verifica build, asset, scope Pages, installazione simulata, navigazione PDF, migrazione, cache precedente, intervalli di byte e refresh di rete. Chromium con viewport mobili 360/390/430 px, verticale e orizzontale, ha verificato l'intestazione e l'assenza di overflow. Prove browser separate hanno verificato PDF offline, salvataggio multiplo e aggiornamento con due schede aperte. La tastiera Android fisica e il visualizzatore PDF del telefono restano da ricontrollare sul dispositivo reale.

## Avvio locale
Dalla cartella del repository: python -m http.server 8000
Aprire http://localhost:8000. La semplice apertura file:// non riproduce tutte le funzioni online.

## Versioni
index.html e sw.js contengono BUILD_ID; version.json contiene lo stesso build_id. Ogni modifica dell'HTML destinata alla pubblicazione deve rigenerare tutti e tre con `python3 scripts/update-build.py`. La data di revisione indica i contenuti della versione, non una nuova verifica normativa effettuata durante questo passaggio.

Per l'icona T/N, l'originale fornito è conservato in `assets/icon-source-tn.png`. `npm run generate:icons` produce le varianti any e maskable per il manifest, favicon e Apple touch icon. Le icone maskable tengono lettere e veicoli entro il cerchio centrale di diametro 80%. Rigenerare il build dopo ogni modifica a queste risorse; il service worker le precarica. La cartella `revisione_testi/` resta esclusa dal commit.

Per rigenerare il PDF normale: `npm ci`, installare Chromium per la versione di Playwright (`npx playwright install chromium`) e avviare `npm run generate:pdf` prima di `python3 scripts/update-build.py`. Se Chromium è già installato in un percorso diverso, impostare `CHROMIUM_PATH`. Il generatore corrente crea da HTML tutte le 206 pagine, compresi copertina, cinque pagine introduttive, 187 schede singole, inclusa TC01, sei indici e sei pagine di appendici e fonti; verifica i collegamenti. Le schede mantengono formule complete e caratteri fissi a 9 pt. Se una scheda supera la pagina, la generazione si ferma senza sostituire il PDF. `npm test` controlla formule, note, importi e PDF. Non includere pacchetti, anteprime o backup in un commit.
