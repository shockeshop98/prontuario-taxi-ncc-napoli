# Integrazione locale PWA 1.8.11 / PDF 7.13

22 ottobre 2026. Integrata la revisione **locale 1.8.10 / PDF 7.12**, già presente con modifiche non committate. Il commit resta `7cd86c8`, relativo alla base pubblicata 1.8.9; non è stato usato per cancellare il lavoro successivo. Nessun reset, commit, push o deploy. Fotografia iniziale nei file [stato iniziale](revisione/1.8.11/stato-iniziale.json), [dati](revisione/1.8.11/prima-data.json) e [schede rese](revisione/1.8.11/prima.json). La prova di migrazione usa una copia reale della 1.8.10 locale, non una ricostruzione dalla 1.8.9.

Lette le istruzioni di progetto e i rapporti precedenti; nessun AGENTS.md trovato. Conservati gli originali, i rapporti e le verifiche delle revisioni precedenti. Il [rapporto 1.8.10](RAPPORTO_REVISIONE_1.8.10.md) è storico e non è riscritto: questa integrazione aggiorna soltanto i suoi punti espressamente precisati. Nessuna nuova scheda creata.

## Consegna e conteggi effettivi

- [Anteprima locale con confronto e immagini PWA/PDF](revisione/1.8.11/anteprima.html): http://127.0.0.1:8000/revisione/1.8.11/anteprima.html.
- [PWA](index.html), [PDF 7.13 rigenerato](allegati/Prontuario_Taxi_NCC_Napoli.pdf), [confronto prima/dopo](revisione/1.8.11/confronto-prima-dopo.md), [JSON](revisione/1.8.11/confronto-prima-dopo.json), [CSV](revisione/1.8.11/confronto-prima-dopo.csv).
- [Inventario dei nove allegati letti integralmente](revisione/1.8.11/allegati-letti.md), [registro delle fonti e impronte](revisione/1.8.11/fonti.json), [copertura corrente](revisione/1.8.11/controllo-schede.json).

**115 voci nel catalogo**, che comprende anche voci di riferimento e R01 esplicitamente inattiva; non significa 115 violazioni attualmente contestabili. **186 schede**: 112 Taxi, compresa TC01, 70 NCC, 4 trazione animale. **207 pagine PDF**, sei indici, **186 destinazioni**; ogni scheda occupa una pagina con corpo a 9 pt. Dodici schede integrate, tre ulteriori schede della seconda parte conservate e ricontrollate (I01, R07, R08); aggiornati i rinvii temporali di TC01. G51 rimane assente da tutti i percorsi attivi.

Composizione PDF: copertina 1, indici 6, introduzioni 5, schede 186, appendici operative 4, confronto regolamento 1, fonti 4. Le fonti riepilogate passano da 37 a 38 senza richiedere un’altra pagina. Conservati entrambi gli stemmi e i crediti approvati. Dodici allegati salvabili nella PWA, uno dei quali testuale; l’aggiunta è soltanto l’O.D. 3/2021.

## Riscontri documentali acquisiti

Tutti i **nove nuovi allegati** sono stati letti integralmente: sette immagini EGAF, compresi testo, tabelle e note visibili; quattro pagine del PDF collettivo; cinque pagine del PDF cambio turno, comprese le premesse e il dispositivo. L’anteprima e il prontuario non ripubblicano le schermate EGAF. Gli originali restano nella cartella fornita, con SHA-256 verificati.

Il PDF `od_160419_0463_taxi_collettivo_2019 (1).pdf` coincide byte per byte con [l’O.D. 1/2019 già archiviata](allegati/Taxi_Collettivo_OD_1_2019_originale.pdf), SHA-256 `7b00c00d07c3ea75228137861beb64af43d884ff87a3d851017dd56789b3f13a`. Non è stato creato un duplicato fra le fonti PWA. Conservate [proroga O.D. 10/2025](allegati/Taxi_Collettivo_OD_10_2025_originale.pdf) al 31/12/2026 e [integrazione O.D. 9/2026](allegati/Taxi_Collettivo_OD_9_2026_originale.pdf) sui posti delle vetture.

Il nuovo atto sul cambio turno è **O.D. n. 3 del 22/03/2021**; **OD/2021/0000298 è la registrazione**, non il numero dell’ordinanza. Il nome del file non è stato alterato. SHA-256 `4e44f34b40802ee9837f5cf07f38e09a950a6ff93ae447072cda26f289543c03`.

Sono acquisiti e riscontrati gli articoli CdS [70](https://aci.gov.it/codice-della-strada/art-70/), [86](https://aci.gov.it/codice-della-strada/art-86/), [158](https://aci.gov.it/codice-della-strada/art-158/), [159](https://aci.gov.it/codice-della-strada/art-159/), [202](https://aci.gov.it/codice-della-strada/art-202/), [203](https://aci.gov.it/codice-della-strada/art-203/) , [210](https://aci.gov.it/codice-della-strada/art-210/), [213](https://aci.gov.it/codice-della-strada/art-213/) e [216](https://aci.gov.it/codice-della-strada/art-216/) dal sito istituzionale ACI, nonché gli articoli [226](https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.del.presidente.della.repubblica:1992-12-16;495~art226!vig=2026-10-22) e [399](https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.del.presidente.della.repubblica:1992-12-16;495~art399!vig=2026-10-22) del regolamento CdS su Normattiva. Sono verifiche mirate degli articoli, non dell’intero ordinamento. Per i 2 punti G49 resta la tabella ufficiale Normattiva versione 12, già acquisita nella 1.8.10, riga art.158 comma2 lett.d e h; non si usa il vecchio collegamento ACI che rinviava all’indice.

## Indicazioni operative confermate dall’autore

Sono applicate, senza riproporre la stessa richiesta di conferma: natura di prescrizioni della licenza degli obblighi R39–R42; disco e ultimo posto G46; pausa di 30 minuti G47; utilizzo degli stalli solo da taxi in servizio G49; mancata partenza oltre 15 minuti dall’arrivo dei primi tre G50; compilazione tecnica dei campi I09; assenza attuale dei punti radiotaxi R01.

Queste precisazioni sono distinte dai documenti: non costituiscono acquisizione di licenze individuali, dell’O.S.11/2010, dell’ordinanza tecnica R42 o di un manuale del gestionale. La successiva verifica del fatto concreto, della segnaletica, della prescrizione individuale e dell’autore della condotta rimane necessaria e non richiede di riconfermare l’impostazione editoriale.

## Trazione equina: EGAF e tutte le schede della categoria

La categoria contiene soltanto **R39, R40, R41 e R42**: controllate tutte. Il confronto dei sette estratti EGAF distingue tre casi, senza trasformarli automaticamente in nuove schede.

| Estratto EGAF | Condotta e fonte ufficiale | Conseguenze e rapporto con R39–R42 |
|---|---|---|
| 070-01 | Servizio pubblico o di piazza senza licenza: art.70 comma1, comma4 primo periodo e comma5 CdS | €87–344 e confisca; PMR escluso per art.210 comma3, sequestro ex art.213 e invio del verbale al prefetto entro dieci giorni. Non descrive nessuna delle quattro condotte richieste, che presuppongono la licenza. Non applicati questi importi o la confisca alle quattro schede. |
| 070-02 | Licenza ottenuta, ma condizioni non rispettate: art.70 comma4 secondo periodo CdS | €42–173, PMR €42, entro cinque giorni €29,40 ex art.202, oltre sessanta €86,50 ex art.203 comma3, oltre spese e alle condizioni della legge; ritiro della licenza. Inquadramento applicato a tutte le quattro schede in base alla conferma dell’autore, con riscontro della prescrizione concretamente violata. |
| 070-03 | Vettura non sottoposta alla revisione prescritta: art.70 comma2 lett.c e art.226 comma7 regolamento; art.70 comma4 secondo periodo quando la revisione è condizione della licenza | La revisione della vettura è quinquennale e richiede riscontro di scadenza, convocazione e condizione del titolo; non coincide con l’abilitazione annuale del cavallo R41, né con la sola difformità di allestimento R42. Il procedimento comunale per vettura inidonea o mancata presentazione è distinto dall’immediato ritiro sanzionatorio per condizioni violate. Nessuna scheda nuova e nessuna attestazione automatica di omessa revisione. |

Gli estratti riportano anche targa di servizio, requisiti del conducente, ambito comunale, caratteristiche della vettura e capienza: usati come supporto, senza aggiungere condotte estranee. L’art.226 distingue requisiti del titolare/conducenti, idoneità dell’animale, approvazione della vettura e revisione. La corretta norma specifica resta l’art.70, senza estendere l’art.86 ai veicoli a trazione animale.

| Scheda controllata | Prescrizione e riscontro | Norma sanzionatoria applicata |
|---|---|---|
| R39 | Regolamento comunale artt.34–35 e39; condotta concreta, distinguendo osservazione degli operatori e valutazione veterinaria nominativa con atto/data. | Art.70 comma4 secondo periodo; tabella €42/€29,40/€86,50 e ritiro. Nessuna diagnosi veterinaria attribuita agli operatori. |
| R40 | Art.36 comma1 corrisponde alla materia; mantenuta l’eccezione certificata del comma2. Idoneità sostanziale distinta da mancata esibizione o risposta documentale non ottenuta. | Stesso art.70 e tabella; esempi fuori dalla copia. |
| R41 | Art.37 commi1–4 e39: abilitazione annuale e identificazione; scelta della specifica irregolarità e fonte. | Stesso art.70 e tabella; nessuna confusione con revisione della vettura. |
| R42 | Art.38 comma1: allestimento difforme; campo per estremi dell’ordinanza tecnica e difformità concreta. Ordinanza non acquisita. | Stesso art.70 e tabella sulla prescrizione confermata dall’autore; riscontro dell’ordinanza e della prescrizione necessario prima della contestazione concreta. |

**Ritiro e attestazione:** l’art.70 impone il ritiro nella fattispecie accertata. Le tabelle e il seguito lo indicano come obbligatorio. La casella di copia aggiunge l’attestazione soltanto quando il ritiro è materialmente eseguito; non rende facoltativo l’obbligo. Art.216: contestualità, menzione nel verbale e invio entro cinque giorni. Nessuna revoca disposta dagli operatori; l’art.39 comunale riguarda l’ufficio. L’art.399 regolamento consente il solo trasferimento autorizzato al deposito con annotazioni reali, non la prosecuzione del servizio, e non viene copiato come permesso già concesso.

**Destinatario organizzativo confermato dall’autore il 23 ottobre 2026:** per R39–R42 la licenza ritirata deve essere trasmessa all’Ufficio Corso Pubblico del Comune di Napoli. Resta invariato il termine di cinque giorni dal ritiro già verificato ex art.216 CdS ([testo ACI](https://aci.gov.it/codice-della-strada/art-216/), ricontrollato il 23 ottobre). Il destinatario è registrato come indicazione organizzativa dell’autore, distinta dal testo normativo: il testo generale dell’art.216 comma1 indica l’ufficio trasporti per autorizzazioni e licenze e la nota 5 EGAF indica il sindaco che ha rilasciato il titolo. Non è stato acquisito un nuovo atto speciale o organizzativo di coordinamento e non si attribuisce all’art.216 il destinatario comunale confermato. L’indicazione dell’autore risolve il destinatario operativo delle quattro schede; la differenza fra le fonti resta documentata.

PWA, note operative e PDF indicano il destinatario e il termine. La clausola copiabile è esattamente «La licenza è ritirata e sarà trasmessa all’Ufficio Corso Pubblico.»: si aggiunge soltanto selezionando il ritiro materialmente eseguito. Nella formula base non compare alcuna attestazione del ritiro; l’obbligo resta chiaramente indicato negli adempimenti anche quando la casella non è selezionata. L’invio della licenza è distinto dall’invio della copia del verbale. Nessun commit, push o deploy autorizzato in questo aggiornamento locale.

## Modifiche per scheda

| Codice | Prima locale 1.8.10 → risultato 1.8.11 |
|---|---|
| R39–R42 | Dal collegamento alla licenza lasciato aperto alla conferma operativa dell’autore: quattro tabelle art.70 e ritiro. Formule specifiche conservate, chiusura futura al Corso Pubblico inserita nella formula base; attestazione del ritiro distinta. |
| G46 | Conservate le tre alternative disco/ultimo posto/entrambe. Obblighi confermati dall’autore; O.S.11/2010 integrale ancora non acquisita. Nessun “e/o” copiato. |
| G47 | Dal limite da completare a **30 minuti** secondo l’autore, con orari osservati di inizio e fine. Non si dichiara verificato il testo dell’O.S.11/2010. |
| G48 | Dalla generica vetrofania e atto mancante ai **cartellini sui vetri anteriore e posteriore**, selezionabili singolarmente o entrambi. O.D.178/2019 punto **3.D.2**, riportato nell’O.D.3/2021 p.4. Dispositivo2021 punti 1–2 p.5: **6/12/24 mesi** prima/seconda/terza infrazione, sul **conducente autore**, titolare o sostituto. È sospensione del diritto al cambio turno, adottata dall’autorità competente; non sospensione della licenza. Mancata esposizione distinta da alterazione/contraffazione, senza attestare automaticamente falsi o illeciti penali. Punto3 riduce a 12 mesi l’anzianità per l’ammissione al cambio turno. |
| G49 | Dalla sola relazione con qualificazione aperta alla condotta e tabella richieste sulla base operativa confermata: **€165 / €115,50 / €330, rimozione e 2 punti**. Riferimenti CdS158 comma2 lett.d e5-bis;159 comma1 lett.b;126-bis tabella; poi D.Lgs.422/1997 art.14 comma6 e regolamento art.26. Il D.Lgs. consente uso proprio fuori servizio, non sanziona la sosta. Verificare segnaletica, stato del servizio e pausa autorizzata; la regola sugli stalli è attribuita all’autore, non a una nuova ordinanza acquisita. €330 è metà del massimo nei presupposti art.203 comma3, non un aumento incondizionato dopo 60 giorni; riduzione entro 5 giorni ex art.202. Rimozione dovuta e materiale esecuzione distinte. |
| G50 | Dalla relazione temporale neutra alla **mancata partenza oltre 15 minuti dall’arrivo dei primi tre**. Formula esatta ricevuta, senza “salita”; due orari e fonte del rilievo fuori dalla copia base. Art.86 comma3-bis e O.D.1/2019 punto4.3, con proroga 2025/integrazione 2026; tabella precedente conservata, specifica condizione del titolo da riscontrare. Nessuna nuova dichiarazione di abrogazione del limite generale di cinque minuti, nessuna ripetuta richiesta della conferma operativa già ricevuta. |
| G52 | Stalli dichiarati documentalmente conosciuti, non ancora da individuare: O.D.1/2019 punto2 e clausola di efficacia punto5. Aeroporto area ex NCC, rotonda viale Ruffo di Calabria:4; corso Novara3:2; corso Arnaldo Lucci ingresso Metropark:3; Molo Beverello via C. Colombo, corsia verso via Marina presso semaforo/fermata ANM:5. Segnaletica effettiva ed eventuali modifiche successive restano verifiche separate. Tabella art.86 e coordinamento TC01 conservati. |
| I09 | Applicata la richiesta gestionale: **titolare nel campo trasgressore; medesimo titolare nel campo obbligato solidale; conducente in altri soggetti se diverso**. Non è solidarietà giuridica con sé stesso. Responsabilità personale dell’omissione distinta, inclusi cooperativa/consorzio e48 ore dell’art.7. Campo formula precisa comunicazione/documento omesso. Nessuna norma sanzionatoria nuova inventata per il titolare non conducente; relazione e base ancora da qualificare. Restano da chiarire funzionamento dei campi e uscita del gestionale con il relativo manuale, senza sostituire la compilazione confermata. |
| R01 | Autore: punti attualmente non installati. Conservata consultabile con stato **“Applicabile soltanto dopo l’istituzione e l’attivazione dei punti con apposita segnaletica.”** Stato in apertura della scheda, risultati di ricerca, indice PWA e scheda PDF. Nessuna chiusura automatica da verbale per un illecito attualmente non contestabile in assenza dei punti. Art.4 comma6 conservato, con i precedenti limiti sulla sua portata. |
| I01, R07, R08 | Lavoro 1.8.10 conservato; ricontrollate formule/copia/PDF. I01 senza chiusura al Corso Pubblico e con eccezioni nelle note. |
| TC01 | Aggiornati nota di partenza e rinvio G50; invariati tratta, tariffa, stalli, proroga 2025, integrazione 2026 e ulteriori dubbi. G51 resta rimossa. |

Formule complete prima/dopo, riferimenti, tabelle, note e alternative sono nel confronto allegato. Importi e punti di tutte le altre schede sono preservati dalla fotografia1.8.10: variazioni soltanto R39–R42 e G49; G52 era già aggiornata nella revisione precedente.

Le relazioni G46, G47, G48 e I09 conservano la chiusura selezionabile soltanto per un verbale effettivamente elevato su base verificata. Non è la stessa conferma editoriale chiesta all’autore: è attestazione del fatto di aver elevato il verbale nel singolo caso. Nel PDF la clausola è separata dalla formula base. R39–R42, G49 e G50 ora hanno la chiusura futura nella base; I01 resta senza, R01 inattiva senza. Istruzioni ed esempi non vengono copiati; “entrambe” è selezionabile solo se entrambe le condotte sono state accertate.

## Confronto con il file originario dell’autore

Il file `diciture prontuario seconda parte.txt` è stato letto integralmente e conservato senza modifica. Le successive precisazioni prevalgono esplicitamente su questi punti sostanziali:

- Art.86 richiesto originariamente per gli equini → art.70 specifico, ora confermato anche nell’impostazione operativa.
- G48 generica vetrofania → cartellini identificativi sui due vetri secondo il documento2021.
- G50 salita del terzo → **arrivo dei primi tre**, permanenza senza partire, formula attuale confermata; nessuna equivalenza tacita fra arrivo e salita.
- I09 doppio ruolo ora applicato come compilazione tecnica del gestionale, con distinzione dalla solidarietà giuridica.
- R01 conservata soltanto per futura attivazione, essendo i punti non installati secondo l’autore.

G49 mantiene i valori richiesti e corregge la natura dell’atto in **D.Lgs.422/1997 art.14 comma6**, non “d.l.”. G47 applica 30 minuti senza inventare l’acquisizione dell’atto. G51 già eliminata; non viene ricreata. Le altre differenze sono grammaticali, abbreviazioni o separazione delle alternative e non cambiano la condotta richiesta.

## Soli documenti ancora mancanti per questa integrazione

1. O.S.11/2010 integrale, modifiche ed efficacia attuale per G46–G47. Le indicazioni operative su disco, ultimo posto e 30 minuti sono già confermate.
2. Ordinanza tecnica pertinente all’art.38 comma1 per R42. Campo conservato; non inventati numero/data.
3. Licenze o prescrizioni individuali da riscontrare nel caso concreto. Per R39–R42 l’impostazione di prescrizione della licenza è confermata dall’autore: non è un punto editoriale ancora da approvare. Per l’art.86 resta il nesso con la specifica condizione del titolo, fuori dai commi 2 e 3.
4. Originale autonomo O.D.178/2019 ed eventuali prototipi/allegati non contenuti nelle cinque pagine 2021. Il punto 3.D.2 è comunque documentalmente disponibile perché riportato nel nuovo atto; **l’O.D.3/2021 non è più mancante**.
5. Manuale/disposizione del gestionale per codifica ruoli e verbale generato I09; atto sul percorso organizzativo di trasmissione del titolo ritirato, per la discrepanza art.216/nota EGAF. Non è inventata una base sanzionatoria personale per il titolare non conducente.
6. Eventuali atti successivi sul singolo stallo e, solo in caso di futura attivazione R01, relativo atto istitutivo e segnaletica. La loro acquisizione non è simulata; l’individuazione documentale degli stalli G52 è già acquisita.

Nessun dubbio estraneo dichiarato risolto: restano quelli dei rapporti precedenti su decorrenza L.193/2024, precedenti art.86 e art.8-bis L.689, D.D.72/2012 e135/2010 integrali, coordinamento comunale/regionale, nuovo regolamento, disposizioni interne CAP/patente/RCA, D.G.C.634/2018, turni e ulteriori quesiti TC01. La conferma operativa G50 risolve la formulazione da applicare in questa revisione; non documenta una modifica del regolamento generale.

## Verifiche

Per l’aggiornamento del **23 ottobre**, gli esiti correnti sono nel [riepilogo ritiro equino](revisione/1.8.11/esito-ritiro-equino-23ottobre.json), [npm test](revisione/1.8.11/esito-npm-test.txt), [prove mirate mobile/copia/PDF](revisione/1.8.11/verifica-seconda-parte.json) e [browser completo](revisione/1.8.11/browser-check.json). Verificati la clausola esatta per tutti i quattro codici, selezione/deselezione/riapertura, obbligo sempre visibile, fonte organizzativa distinta dalla norma, tutte le 185 formule e le 186 destinazioni, nove dimensioni, invalidazione del vecchio PDF e apertura offline del nuovo. PDF di 207 pagine, sei indici e 186 schede senza overflow a 9 pt; controllo visivo PWA/PDF. Build finale `da4ad1adbe6bac3d444548f76fce2e9be9dd37042788c404512fe0e7350747ef`. Tutte le tabelle, le schede estranee e le fonti originali sono conservate rispetto alla fotografia locale prima di questo intervento; `git diff --check` superato. Nessun commit, push o deploy.

Il [riepilogo del 22 ottobre](revisione/1.8.11/esito-finale.json) e la [migrazione reale 1.8.10→1.8.11](revisione/1.8.11/aggiornamento-1.8.10-1.8.11.json) restano evidenze della precedente integrazione, con la build e l’impronta PDF di quella verifica.

Controlli: npm test; git diff --check; integrità SHA-256 dei nove nuovi allegati, originali già archiviati e file autore; confronto formula visibile/copia effettiva/PDF per tutte le 185 schede con formula; tutte le 186 destinazioni PWA e indici PDF; assenza G51 e delle tre diciture eliminate dai contenuti operativi; varianti G46/R41/G48 e attestazione di ritiro dei quattro equini; stato R01 anche nei risultati; 186 schede in nove dimensioni, comprese 360 e 390 px; controllo visivo delle 15 schede della seconda parte in PWA e PDF; migrazione da vera cache 1.8.10, conservazione allegato invariato, invalidazione vecchio prontuario, salvataggio nuovo PDF e O.D. 3/2021, riapertura offline con impronta PDF verificata.

I test sono aggiornati per le variazioni autorizzate, con tabelle attese esplicite e confronto di tutte le altre schede con la fotografia locale 1.8.10. Non sono indeboliti per mascherare difetti: il nuovo test controlla anche confini della fonte, ruoli I09, stato R01, tre alternative G48 e invarianti degli originali. Sono prove locali Chromium; nessuna dichiarazione di verifica su telefono fisico o di pubblicazione. Gli audit correnti scrivono nella cartella 1.8.11 senza sovrascrivere lo storico.

Riproduzione: `npm run generate:pdf`, `python3 scripts/update-build.py`, `npm run audit:cards`, `npm test`, `git diff --check`. Con Chromium: `npm run test:browser`, `node scripts/verify-seconda-parte.mjs`, `node scripts/verify-local-upgrade.mjs`. `node scripts/generate-integrazione-review.mjs` aggiorna il confronto dalla fotografia locale conservata. Il percorso temporaneo della baseline serve solo a riprodurre la migrazione in questa sessione. Per riavviare l’anteprima: `python3 -m http.server 8000 --bind 127.0.0.1` dalla radice. Nessun commit, push o deploy.
