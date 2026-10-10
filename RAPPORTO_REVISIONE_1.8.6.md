# Revisione documentale 1.8.6 / PDF 7.8

Data: 10 ottobre 2026. Repository: `prontuario-taxi-ncc-napoli`. Revisione inizialmente consegnata per esame locale; pubblicazione GitHub Pages successivamente autorizzata dall’autore.

### Pubblicazione autorizzata dopo la consegna locale

L’autorizzazione comprende commit, push ordinario su `main` e GitHub Pages. Non modifica le valutazioni normative, i dubbi o lo stato delle fonti riportati sotto. I riferimenti a nessun commit/push/deploy nelle sezioni storiche descrivono la consegna locale precedente a questa autorizzazione.

Prima del rilascio è stata riscontrata la PWA pubblica 1.8.5, build `d75a19483d6ade84569d9f0bb9838ee8c6c6eb6e738dae9d35c9776eeaaae135`, con PDF 7.7 di 206 pagine, anche offline. Per il controllo successivo è predisposto `scripts/verify-public-release.mjs`, che confronta i file pubblici con quelli locali e prova l’aggiornamento della cache. Il deploy effettivo è consultabile nelle [esecuzioni GitHub Pages](https://github.com/shockeshop98/prontuario-taxi-ncc-napoli/actions); la sola autorizzazione non ne attesta il completamento.

Il controllo finale del diff ha allineato al 10 ottobre la data visibile nel piè di pagina della PWA. Build finale: `8c845bbbd176b1fb5eae30bc718be62f7343353d7da5d4819606e06f40837d5d`. Ripetuti con successo `npm test` e le prove browser su tutte le 187 schede negli otto viewport; aggiornate le impronte in `verifiche-finali.json`, che registra lo stato prima del commit/deploy. Il PDF è identico a quello già verificato: SHA-256 `e11169443dce5f38acf0b84c7540550efe380d2eef9bcb86379836164b5d7cfd`. Le note di pubblicazione distinguono autorizzazione ed esito effettivo; non sostituiscono alcun limite normativo.

Il controllo del diff preparato per il commit ha rilevato spazi finali e terminatori CRLF negli HTML acquisiti. `.gitattributes` conserva i byte delle sole copie in `revisione/1.8.6/fonti/` e le esclude dal controllo di spaziatura: non sono stati ripuliti o alterati gli originali per far passare il controllo. Per quei file vale la verifica SHA-256 del registro; codice, dati generati e documentazione restano sottoposti a `git diff --check`.

### Esito della pubblicazione e verifica del sito

Il commit dei contenuti [30f2639](https://github.com/shockeshop98/prontuario-taxi-ncc-napoli/commit/30f26391f794944e96b663dae72d3507678b303c) è stato inviato con push ordinario su `main`, senza force push. Il [deploy GitHub Pages 38052727758](https://github.com/shockeshop98/prontuario-taxi-ncc-napoli/actions/runs/38052727758) è terminato con successo il 10 ottobre 2026 alle 12:39 UTC. I quattro documenti personali sono rimasti locali e non tracciati.

Verifica browser pubblica del 10 ottobre 2026 completata sul [sito](https://shockeshop98.github.io/prontuario-taxi-ncc-napoli/), con la stessa build e lo stesso PDF indicati sopra:

- PWA 1.8.6, manifest di versione e worker concordanti; 11 file pubblici confrontati byte per byte tramite SHA-256 con i locali.
- [PDF 7.8](https://shockeshop98.github.io/prontuario-taxi-ncc-napoli/allegati/Prontuario_Taxi_NCC_Napoli.pdf): 207 pagine effettive, metadati 7.8 e identità SHA-256 confermata.
- Tutte le 187 schede aperte nel viewport 390×844, 187 collegamenti alle pagine PDF e 186 copie verificati; TC01 non offre una formula di verbale. Nessun overflow orizzontale o errore JavaScript rilevato.
- Ordine dei riferimenti verificato nel testo mostrato e copiato. Box informativo separato ed escluso dalla copia; nessuna attestazione automatica di attività compiute. Appunti reali provati per G24, G28-01–04 e G23; pagine rispettivamente 45, 86–89 e 44.
- Sei ricerche pubbliche controllate, compresi G24, ricevuta predeterminata, alias I03/I07 e taxi sharing.
- Aggiornamento esplicito dalla vera cache pubblica 1.8.5 preparata prima del deploy: conservato il regolamento invariato, non riutilizzata la copia obsoleta del prontuario. Salvato il PDF nuovo; riapertura PWA, ricerca e apertura PDF in nuova scheda riuscite senza rete, con risposta 200 del service worker.

Il primo tentativo del nuovo script di verifica si era fermato sul confronto delle intestazioni: `innerText` restituiva il maiuscolo imposto dal CSS. Il test ora legge `textContent` per confrontare l’etichetta effettiva; le verifiche non sono state eliminate. La prova è stata ripetuta integralmente dalla copia conservata del profilo anonimo 1.8.5 e superata. Il commit successivo documenta questi esiti e corregge soltanto lo script di verifica: non cambia i contenuti pubblicati, la build o il PDF.

Le prove pubbliche sono effettuate in Chromium con profilo anonimo temporaneo. Non attestano il comportamento della tastiera o del visualizzatore PDF di ogni telefono reale, né l’aggiornamento di tutti i dispositivi dei colleghi. I limiti normativi e le fonti non acquisite restano quelli elencati nelle sezioni seguenti.

## Risultato e perimetro

Controllate tutte le **187 schede** attive: 113 Taxi, 70 NCC, 4 trazione animale. Il catalogo di base conserva 116 voci; fasce, varianti, alias I03/I07 e TC01 spiegano la diversa consistenza. Il PDF 7.8 ha **207 pagine**, sei pagine di indice e una pagina per ciascuna scheda. Rispetto alle 206 pagine iniziali si aggiunge una pagina di appendice, non una scheda. Importi e fasce del catalogo iniziale sono conservati; la loro applicabilità è ora distinta dalla mera presenza in tabella.

Il controllo non equivale a un’attestazione assoluta di vigenza, né alla qualificazione di fatti reali non sottoposti all’esame. Dove manca il testo efficace o resta un problema interpretativo, l’esito lo dichiara e la scheda non lo trasforma in certezza.

La [tabella completa CSV](revisione/1.8.6/controllo-schede.csv) contiene una riga per ogni codice/servizio, incluse le schede risultate corrette nei riscontri disponibili. Sono indicati pagina PDF, condotta, riferimenti, norma sanzionatoria, importi, presupposti, accessorie, adempimenti, destinatari, competenze, fonti/articoli, pagine del regolamento e GIT, correzioni, dubbi e testo copiabile. Il [JSON equivalente](revisione/1.8.6/controllo-schede.json) è utilizzato nei test. Le [121 valutazioni motivate](revisione/1.8.6/valutazioni.json) sono redatte per fattispecie di base/variante ricevuta/TC01; non sono esiti dedotti automaticamente dal superamento dei test.

### Stato iniziale e conservazione

Riscontrati localmente PWA 1.8.5, PDF 7.7, 187 schede e 206 pagine. Il README conteneva ancora un riferimento alla pubblicazione 1.8.4: non è stato usato per smentire la pubblicazione 1.8.5 comunicata dall’utente. Nessuna verifica o modifica del deployment remoto.

Nessun `AGENTS.md` trovato nel repository o negli antenati ispezionati. Letti istruzioni del progetto, README, passaggio di consegne, rapporti precedenti e verifiche dedicate a guide, ricevute/tariffe e taxi collettivo. L’istruzione corrente di non pubblicare prevale sulle vecchie istruzioni di deploy.

Conservati i file personali già presenti e non tracciati: `ESEMPI_RICEVUTE_TARIFFE_1.8.2.md`, `RAPPORTO_REVISIONE_1.8.2.md`, `RAPPORTO_REVISIONE_1.8.3.md`, `verbale_cartaceo.jpg`. Conservati gli originali allegati, i rapporti storici e le attribuzioni. Nessun reset, commit, push o deploy.

## Fonti: lettura, acquisizione e limiti

Il [registro delle 53 fonti](revisione/1.8.6/fonti.json) separa copie locali, acquisizioni ufficiali, riscontri indiretti e documenti non acquisiti. Per i file effettivamente disponibili registra percorso, dimensione e SHA-256. Le nuove acquisizioni sono in [revisione/1.8.6/fonti](revisione/1.8.6/fonti); i cookie temporanei di acquisizione non sono inclusi.

| Fonte | Lettura e riscontro effettuati | Limite da conservare |
| --- | --- | --- |
| Regolamento comunale | Tutte le 20 pagine, artt.1–40, incluse procedure27–33 e trazione equina34–40. Scaricato anche il [PDF ufficiale](https://static-www.comune.napoli.it/wp-content/uploads/2025/05/Regolamento-per-il-trasporto-pubblico-non-di-linea.pdf): testo normalizzato identico al locale. | Identità del testo reperito, non prova dell’assenza di atti successivi. |
| Prontuario GIT/Turistica | Tutte le 30 pagine, prima pagina anche come immagine; confronto con tutte le fattispecie. | Fonte operativa originaria, non norma prevalente o necessariamente aggiornata. |
| EGAF85 e86 | Testo85 fornito e sette pagine86, queste ultime visualizzate integralmente. | Alcune note inferiori del PDF86 sono già tagliate nell’originale: nessuna ricostruzione inventata. |
| [CdS85](https://aci.gov.it/codice-della-strada/art-85/) e [CdS86](https://aci.gov.it/codice-della-strada/art-86/) | Articoli completi e note pubblicate da ACI; copie conservate. Altri articoli acquisiti:82,158,180,193,198,198-bis,202,203,210,213,214,217,218,219; consultate le parti pertinenti indicate nel registro. | Non dichiarata lettura dell’intero CdS. La decorrenza differita della riforma e gli atti applicativi richiedono il riscontro indicato sotto. |
| [L.21/1992 vigente](https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:1992-01-15;21!vig=2026-10-10) | Esportazione integrale Normattiva alla data del controllo, letta con note; distinto il PDF storico aggiornato all’8/01/2025. | Le note sulle pronunce costituzionali vanno lette insieme al testo, non ignorate conservando disposizioni caducate. |
| [L.218/2003](https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:2003-08-11;218!vig=2026-10-10) | Tutti i 12 articoli; in particolare5,6 e8. | Coordinamento con disciplina regionale e titolo effettivo. |
| L.R.Campania10/2024 | Testo coordinato ufficiale integralmente, comprese modifiche2026 e disposizioni transitorie; URL esatto nel registro. | Originale autonomo della L.R.7/2026 non acquisito: verifiche fondate sul coordinato regionale. |
| [L.689/1981](https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:1981-11-24;689!vig=2026-10-10), [TUEL](https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2000-08-18;267!vig=2026-10-10), [D.L.179/2012](https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legge:2012-10-18;179!vig=2026-10-10) | Acquisite esportazioni complete; letti rispettivamente artt.1–18, artt.7/7-bis, art.15 completo e note. | Non dichiarata lettura integrale delle prime due raccolte. |
| [Corte costituzionale163/2025](https://www.cortecostituzionale.it/scheda-pronuncia/2025/163) | Dispositivo, Considerato in diritto6–9 e contesto; copia ufficiale. | Sentenza56/2020 riscontrata nelle note Normattiva e nella163, non nuova acquisizione integrale autonoma. |
| Tariffe e ricevuta | DGC258/2024, tutte le14 pagine visualizzate; tariffario2024 pp.1–5; modello ricevuta p.1; [pagina comunale Servizio taxi](https://www.comune.napoli.it/articolo_tematico/trasporti-mobilita/taxi-e-ncc/taxi/servizio-taxi/) acquisita. | Originali D.D.72/2012 e135/2010 non acquisiti integralmente. La pagina informativa non li sostituisce. |
| Taxi collettivo | Letti integralmente originali locali OD1/2019 pp.1–4, OD10/2025 pp.1–3 e OD9/2026 pp.1–3. | Dispositivi distinti dalle premesse; DGC634/2018 integrale non acquisita. Non dichiarata nuova autenticazione online dei tre file locali. |
| [Circolare337750/2023](https://www.mimit.gov.it/images/stories/normativa/allegati/REGISTRO_UFFICIALEU.033775006-11-2023.pdf) | Tutte le8 pagine; seconda guida pp.7–8, a confronto con L.21 art.10 c.5-ter. | Non estendere il termine della seconda guida alla sostituzione ordinaria. |
| [Parere ART57/2026](https://www.autorita-trasporti.it/wp-content/uploads/2026/07/Parere-n.-57_2026_signed.pdf) | Tutte le8 pagine: parere del27/07/2026 su schema di nuovo regolamento di Napoli. | Non è il regolamento approvato. Successiva approvazione, pubblicazione ed efficacia non accertate. |

Non acquisite integralmente inoltre: O.S.11/2010, O.D.3 del22/03/2021, disposizione sull’allestimento auto di scorta, ordinanze equine, calendario turni efficace nell’ottobre2026, D.I.226/2024 e nota13498/2025 da fonte primaria. Per il D.I. è stata reperita la pagina ministeriale con pubblicazione31/10/2024, ma il download del PDF è fallito per certificato TLS anche nel tentativo autorizzato; nessuna elusione del controllo del certificato. Il registro non lo qualifica come acquisito. I titoli e le condizioni individuali delle licenze/autorizzazioni non sono stati forniti. Il D.Lgs422/1997 richiamato in R28 non è stato acquisito integralmente in questa revisione.

## G24: confronto delle lettere c e g

Letti integralmente art.23 c.1 lettere c e g (regolamento p.14), l’intero art.23 (pp.14–16), art.4 (p.4), art.29 (pp.17–18) e GIT p.16.

La lett. c impone correttezza, civismo e responsabilità: è una clausola generale, non una descrizione specifica del prelievo di persone esterne alla fila. La lett. g contiene l’ordine di precedenza nei posteggi autorizzati e, nella seconda parte, disponibilità al pubblico, prossimità alla vettura e risposta alle chiamate. Non nomina espressamente la fila dei passeggeri. L’art.4 c.3 riguarda la precedenza delle autovetture: non permette di sostituire i passeggeri con i veicoli nella condotta descritta.

Il riferimento proposto dal m.llo D’Ascoli è quindi inserito come **lett. g con ambito della fila da chiarire**, non come interpretazione dimostrata. La scheda resta su acquisizione/prelievo di persone esterne alla fila dei passeggeri. Non è stata trasformata in sosta a scopo di nolo fuori posteggio (G43) o in inizio servizio fuori Comune (G05). La formula è una relazione fattuale; gli importi CdS conservati sono espressamente soltanto ipotetici. Il gruppo A riguarda l’eventuale violazione della lett. g effettivamente accertata, non il solo fatto ancora da qualificare.

Da chiarire con il Comune: disciplina efficace della fila dei passeggeri nel luogo concreto, eventuale atto del gestore e precisa condizione della licenza. L’art.23 c.5 non consente di presumere una regola del gestore non acquisita.

## G28 e tariffe

Art.23 c.1 n (p.15) impone il documento richiesto dal cliente, fiscale secondo la disciplina pertinente o non fiscale secondo modello comunale. Il testo non impone da solo la consegna anticipata per una tariffa predeterminata. La pagina comunale distingue invece la ricevuta ordinaria su richiesta da quella predeterminata da consegnare prima della partenza.

- **G28-01:** mantenuta la prescrizione della lett. n e verificato gruppo A nell’elenco art.29 c.2. Art.86 c.3-bis subordinato ai propri presupposti.
- **G28-02:** eliminata la lett. n quale fondamento della consegna anticipata; D.D.72/2012 punto7b indicata come originale non acquisito. Formula di relazione, nessun gruppo assegnato per analogia.
- **G28-03–04:** modello diverso e compilazione incompleta restano distinti. Il modello disponibile non prova da solo efficacia e obbligatorietà di ogni campo: relazione, senza doppia sanzione automatica.
- **G28 NCC:** estensione della lett. n tramite art.23 c.3, non estensione delle tariffe predeterminate taxi.
- **G04/G08:** confermate le correzioni tariffarie precedenti: €5 Minivan per vettura, non per passeggero; presupposti alternativi; eccezioni della predeterminata e extraurbana ordinaria. Fonte: DGC258 pp.6–9, tariffario pp.1–5. Nessun nuovo importo introdotto.

La classificazione editoriale approvata in passato è conservata nei rapporti storici, ma non utilizzata come prova normativa. Non si afferma che il mancato reperimento dell’atto escluda sempre una sanzione: si afferma che questa revisione non può certificarla sulla base dei documenti mancanti.

## Riferimenti, accessorie e seguito comunale

Un modulo condiviso, `scripts/operative-rules.js`, ordina le disposizioni applicabili: CdS, L.21/1992 quando pertinente, regolamento comunale, ulteriori atti. È utilizzato da PWA, testo copiato e generatore PDF. Dati di base e metadati delle guide storiche sono riallineati; non sono aggiunte citazioni estranee per riempire tutti i livelli.

L’art.86 c.3-bis richiede circolazione in servizio e inosservanza di una condizione della licenza, fuori dai commi2–3. L’art.85 c.4-ter richiede la corrispondente condizione dell’autorizzazione NCC e l’esclusione dei commi4–4-bis. La mera violazione comunale non prova questi elementi. Il controllo regionale L.R.10 art.21 c.5 / TUEL7-bis e i €50 del vecchio art.29 c.3 restano un coordinamento da validare, non un cumulo automatico. Nessun importo alternativo è stato inventato.

Art.29 distingue:

- c.3: segnalazione obbligatoria degli operatori all’ufficio per violazioni accertate dei gruppi A–D;
- c.4: ritiro materiale obbligatorio del titolo per C/D; non attribuisce agli agenti la decisione di sospensione;
- c.1: contestazione dell’ufficio, cinque giorni per difese e decisione nei successivi trenta giorni;
- cc.7–9: quinquennio, disciplina per collaboratori/dipendenti/sostituti e compatibilità con L.689/1981;
- c.5: comunicazione delle sospensioni all’UMC, distinta dalla trasmissione del documento ritirato ex CdS;
- c.6: nelle aree gestite da terzi servono regolare segnalazione dell’autorità preposta e determinazione concordata ufficio/gestore. Non esteso automaticamente il ritiro del c.4.

Il destinatario documentato dagli atti comunali recenti è il **Servizio Trasporto Pubblico Locale e MaaS del Comune di Napoli**. Il regolamento usa la formula ufficio competente. Il percorso organizzativo interno tramite Ufficio Verbali deve essere confermato dal Comando: non è presentato come prescrizione testuale verificata.

I gruppi restano consultabili: A diffida/prima,5 giorni/seconda,15 successive; B15/30/60 giorni e5 punti dopo la prima; C15/30/60 e10 punti; D30/60 e20/30 punti. Art.28 riguarda titoli Taxi **e NCC**, distingue questi punti dalla patente, considera la misura maggiore per violazioni contestuali e prevede revoca a100 punti e bonus10 dopo sei mesi senza contestazioni. Le revoche art.31 sono della Commissione di disciplina presieduta dal dirigente; la decadenza art.32 è del dirigente. Distinti artt.30 e39. Nulla di ciò entra automaticamente nel testo copiato.

Conservate le vere accessorie CdS e le relative attività: sequestro213, fermo214 c.7, documento all’UMC entro5 giorni217, patente alla Prefettura entro5 giorni218, comunicazione dei presupposti al Prefetto219, verbale senza PMR al Prefetto entro10 giorni210 c.3. Il riquadro non chiama la segnalazione una sanzione accessoria CdS. Per NCC il raccordo L.21 art.11-bis/L.R.10 art.21 c.6 non diventa un inesistente obbligo generale di doppio invio: i diversi procedimenti restano distinti.

### Esempi effettivi della nuova rappresentazione

G23, riquadro: accessorie CdS non previste; ritiro obbligatorio del titolo per violazione del gruppo C accertata; **“Segnalazione obbligatoria all’ufficio competente”**, con destinatario Servizio TPL e MaaS e presupposto art.29 c.3. Il box separato spiega 15/30/60 giorni,10 punti e competenza dell’autorità. [Esempio mobile](revisione/1.8.6/riquadro-mobile.png).

Estratto copiabile G23:

> Adempimenti — stato ed estremi da completare: Ritiro del titolo comunale: […]. Gli atti sono da trasmettere al Servizio Trasporto Pubblico Locale e MaaS del Comune di Napoli per il seguito di competenza (regolamento, art.29, comma3). Stato della trasmissione: […].

Lo stato deve essere completato in modo veritiero: da effettuare, effettuato con estremi, oppure impedimento documentato. La presenza del segnaposto non rende facoltativo un obbligo. Non scrive che il titolo è già stato ritirato o che gli agenti hanno disposto la sospensione.

G24, relazione:

> Alla guida del veicolo indicato, con C.P. n. […], acquisiva clienti fuori dalla fila dei passeggeri in attesa al posteggio […], scavalcandoli. In particolare: […]. La fila, l’offerta della corsa e il prelievo, con luoghi e orari, risultavano da […].

G28-02, relazione:

> Alla guida del veicolo indicato, con C.P. n. […], accettava la corsa a tariffa predeterminata […] richiesta dall’utente all’inizio, ma non consegnava prima della partenza la ricevuta. In particolare: […]. Richiesta, partenza e mancata consegna risultavano da […].

Le formule complete di tutte le schede sono nella tabella; suggerimenti, alternative e box informativo non sono copiati. Non sono relazioni su fatti realmente accertati.

## Altre correzioni puntuali

| Schede | Modifica e motivazione |
| --- | --- |
| R01 | Art.4 c.6 riguarda attesa degli utenti e localizzazione comunale dei punti radiotaxi: non autonomo illecito del conducente per ogni diverso prelievo. Relazione. |
| R10 | Posti omologati distinti dal minimo collettivo art.19 c.3 e dalla deroga specifica OD9/2026. Non ripristinate R17/R18. |
| R14 | Art.18 c.8b menziona tassa di proprietà **o** assicurazione; corrette le note sui possibili motivi di decadenza, senza modificarne la fattispecie principale sul registro/ordine. |
| R16 | Art.19 c.6 permette al titolare di chiedere il ritorno al servizio individuale; non impone corsa a tassametro per singolo passeggero. Segni/display del c.1 distinti dalla tabella OD2019. |
| R35–38 | Art.23 c.6 si riferisce agli utenti taxi: avvertenza nelle copie NCC, niente estensione automatica. |
| T01 | L.21 art.10 c.5-ter: comunicazione della seconda guida entro il giorno precedente, non preventiva o contestuale. Distinta I09, sostituzione ordinaria. |
| N09 | Coordinamento transitorio L.R.10 art.37 c.4: titoli autobus preesistenti fino31/12/2026, non assenza del titolo dalla sola mancata copia. |
| N10 | L.218 art.6 c.2 obbligo, c.3 sanzione; L.R.10 art.27 c.3 distingue mera dimenticanza, rinviando a CdS180 c.7. L.218 art.8 obbliga l’autorità che applica la sanzione alla segnalazione alla Regione del titolo: non attribuito indistintamente a ogni operatore in ogni fase. |
| G52 | Note aggiornate agli atti collettivo2019/2025/2026 già disponibili, mantenendo verifica dello stallo e dell’efficacia. |
| G53 | D.L.179 art.15 cc.4/4-bis: €30+4%, esclusa oggettiva impossibilità tecnica, no PMR, rapporto al Prefetto territoriale. Obbligo e sanzione separati. |
| G54 | Comunicare agli enti espressamente elencati dalla L.R.10 art.21 c.2: CCIAA, GdF, UMC, Agenzia entrate, Ispettorato lavoro, INPS. Non sono accessorie CdS. |

Conservate le quattro fasce NCC con €528 nella quarta, distinte dagli €884 Taxi; quinquennio riferito al medesimo veicolo per85 c.4-bis e al titolare per86 c.3. Conservati i dubbi documentati su precedenti e concorso di illeciti, senza risolverli per analogia. Conservati TC01, scadenza31/12/2026, tariffa€6 con bagagli e deroga meno di sette posti limitata alla tratta. Il confronto cinque/quindici minuti e la DGC634 integrale restano aperti.

## Verifiche tecniche e file finali

Il generatore blocca la sostituzione del PDF se una scheda eccede la pagina; caratteri fissi a9pt, nessuna riduzione automatica. Le note tariffarie comuni sono consultabili nell’appendice A8. La mappa delle pagine è rigenerata insieme a indice, testo ricercabile PDF e collegamenti PWA.

Comandi di riproduzione:

```sh
CHROMIUM_PATH=/percorso/chromium npm run generate:pdf
python3 scripts/update-build.py
npm run audit:cards
npm test
git diff --check
# In un terminale separato:
python3 -m http.server 8000 --bind 127.0.0.1
CHROMIUM_PATH=/percorso/chromium npm run test:browser
```

Esiti finali e impronte sono registrati in `revisione/1.8.6/verifiche-finali.json`; prova browser riproducibile in [browser-check.json](revisione/1.8.6/browser-check.json). Il test browser usa un profilo effimero, non cache o dati personali.

- Suite `npm test`: struttura, importi iniziali invariati, alias, R17/R18 assenti, pagine PDF,187 destinazioni degli indici, copia, fonti, prescrizioni/adempimenti e integrità delle acquisizioni.
- Browser:187 schede in ciascuno degli8 viewport320×740,360×800,390×844,430×932 e relativi orizzontali; nessun overflow orizzontale, anche col box informativo aperto.186 formule copiabili per viewport; TC01 non ha copia.
- Copia reale negli appunti provata su G23, con stato degli adempimenti e senza box ufficio. Sei ricerche, inclusi G24, ricevuta predeterminata, I03/I07 e taxi sharing; ricerca anche offline.
- Cache: worker/build coerenti, originale invariato migrato, vecchio PDF con hash diverso scartato. Nuovo PDF salvato mediante comando PWA, reload offline, recupero integrale e richiesta parziale206 verificati. La prova attende il completamento del salvataggio: spegnere la rete durante il download non prepara il PDF offline.
- PDF: tutte le207 pagine controllate per testo, numerazione e collegamenti; controllo geometrico del generatore e ispezione visiva di pagine rappresentative. Tastiera fisica e visualizzatore PDF di un telefono reale non testati: la prova è Chromium locale.

File principali: [PWA](index.html), [versione/build](version.json), [PDF7.8](allegati/Prontuario_Taxi_NCC_Napoli.pdf), [tabella CSV](revisione/1.8.6/controllo-schede.csv), [registro fonti](revisione/1.8.6/fonti.json). Pagine stabili: G24 p.45, TC01 p.58, G28-02 p.87; appendici200–203, confronto204, fonti205–207.

Prima dell’uso sanzionatorio restano necessari: atti comunali mancanti, verifica dell’eventuale nuovo regolamento, condizioni dei titoli, regole del luogo e conferma dei punti interpretativi esposti. Non è necessaria una pubblicazione per esaminare localmente i file consegnati; questa revisione non l’ha eseguita.
