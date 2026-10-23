# Revisione locale PWA 1.8.10 / PDF 7.12

21 ottobre 2026. **Nessun reset, commit, push o deploy.** Partenza effettiva: commit `7cd86c8`, PWA 1.8.9 / PDF 7.11; file tracciati puliti, solo `diciture prontuario seconda parte.txt` non tracciato. File dell’autore letto integralmente e conservato, con impronta nello [stato iniziale](revisione/1.8.10/stato-iniziale.json). Fotografie iniziali in [prima-data.json](revisione/1.8.10/prima-data.json) e [prima.json](revisione/1.8.10/prima.json), senza riscrivere la revisione 1.8.9.

Lette le istruzioni di progetto, README, passaggio di consegne e rapporti precedenti, comprese le verifiche sul taxi collettivo e i limiti delle revisioni 1.8.6, 1.8.8 e 1.8.9. Nessun AGENTS.md trovato. Le vecchie autorizzazioni alla pubblicazione sono storiche: prevale il divieto corrente. Non sono stati acquisiti atti interni o condizioni individuali delle licenze.

## Risultato e consultazione

- [Anteprima locale con immagini e confronto](revisione/1.8.10/anteprima.html).
- [Confronto prima/dopo per tutti i 16 codici](revisione/1.8.10/confronto-prima-dopo.md), [JSON](revisione/1.8.10/confronto-prima-dopo.json), [CSV](revisione/1.8.10/confronto-prima-dopo.csv).
- [Confronto della pulizia editoriale trasversale](revisione/1.8.10/pulizia-trasversale.md), con formule complete prima/dopo delle ulteriori schede interessate.
- [PWA locale](index.html), [PDF completo 7.12](allegati/Prontuario_Taxi_NCC_Napoli.pdf), [copertura e destinazioni correnti](revisione/1.8.10/controllo-schede.json).
- [Registro delle fonti e dei limiti](revisione/1.8.10/fonti.json).

Anteprima servita su **http://127.0.0.1:8000/revisione/1.8.10/anteprima.html**; PWA completa su http://127.0.0.1:8000/. Per riavviarla: `python3 -m http.server 8000 --bind 127.0.0.1` dalla radice del repository. Aprire via HTTP per provare service worker e offline.

Conteggi effettivi: **115 voci attive di catalogo, 186 schede PDF/PWA** (112 Taxi, 70 NCC, 4 trazione animale), inclusa TC01 di consultazione; **207 pagine**, sei pagine di indice e **186 destinazioni**. Le schede restano di una pagina, corpo a 9 pt. Composizione: copertina 1, indici 6, introduzioni 5, schede 186, appendici operative 4, confronto regolamento 1, fonti 4. G51 toglie una pagina di scheda; la nuova fonte CDS70 porta l’elenco fonti da 36 a 37 voci, creando una quarta pagina: il totale resta 207 per questa ragione, non per mantenere il vecchio numero. Conservati i due stemmi, crediti, attribuzioni, TC01, alias I03/I07 e rimozione R17/R18.

Importi, punti e misure nei dati sono conservati per tutte le schede superstiti salvo **G52**, espressamente richiesta: tabella € 86–338, PMR € 86, entro cinque giorni € 60,20, oltre sessanta € 169 oltre spese alle condizioni dell’art. 203, comma 3. Nessun punto patente o ritiro aggiunto per analogia. G50 conserva numericamente la precedente tabella come ipotesi non qualificata; la diversa condotta temporale non riceve automaticamente il vecchio gruppo A. Le altre modifiche trasversali eliminano diciture e riordinano fonti; non costituiscono una nuova validazione integrale.

## Confronto tra file dell’autore e prompt

I due testi enumerano gli stessi 16 codici: 15 aggiornamenti e G51 da eliminare. Nessuna discrepanza sostanziale nell’elenco o negli importi richiesti. Il prompt chiarisce come applicare le indicazioni: alternative fuori dalla copia, due fonti di accertamento distinte per il cavallo, niente “e/o”, verifica del titolo e del soggetto, nessuna norma estesa per analogia. Le correzioni “vetrofania”, punteggiatura e maiuscole dell’Ufficio Corso Pubblico non cambiano la condotta.

Le differenze sostanziali rispetto al **risultato desiderato dall’autore** derivano dai conflitti documentati sotto: norma per la trazione animale, 30 minuti non riscontrati, decorrenza dei 15 minuti, sosta del taxi fuori servizio, ruolo del titolare I09 e portata di R01. Non sono scelte tacite né dichiarazioni di inesistenza degli atti mancanti.

## Modifiche applicate e adattate

| Codice | Risultato locale |
|---|---|
| R39 | Testo breve richiesto, campo sulla condotta. Note distinguono osservazioni personali da valutazione veterinaria identificata con autore, data e atto. |
| R40 | Art. 36, comma 1, inserito; conservata l’eccezione del comma 2. Formula ed esempi separati; documentazione mancante distinta dall’assenza sostanziale dell’idoneità. |
| R41 | Formula con irregolarità specifica: selezione abilitazione annuale, identificazione oppure altra irregolarità descritta. Gli esempi sono fuori dalla copia. Non si copia l’alternativa generica “abilitazione o identificazione”. |
| R42 | Formula richiesta e campo difformità; estremi dell’ordinanza lasciati da compilare dopo acquisizione. Nessun atto tecnico inventato. |
| G46 | Tre scelte: disco assente, posizione diversa dall’ultimo posto, entrambe accertate. Nessun “e/o”. Art. 86, comma 3-bis, come riferimento potenziale, senza importi automatici finché mancano ordinanza e condizione del titolo. |
| G47 | Due orari e limite da completare dall’ordinanza vigente. I 30 minuti restano nella nota come indicazione dell’autore non riscontrata, non diventano una prescrizione certificata. |
| G48 | Formula abbreviata e termine “vetrofania”. Art. 86 potenziale; O.D. 3/2021 da acquisire integralmente. |
| G49 | Relazione abbreviata. Corretto D.Lgs. 422/1997, art. 14, comma 6; aggiunti commi sanzionatori e disposizioni su rimozione e punti. Valori richiesti spiegati come ipotesi generale, senza attribuirli automaticamente al taxi fuori servizio. |
| G50 | Nuovo titolo neutro e relazione con orario di arrivo dei primi tre e permanenza in attesa. Non si afferma un superamento illecito dalla salita del terzo. Riferimenti 2019/2025/2026 coordinati con TC01; dubbio cinque/quindici minuti conservato. |
| G51 | Eliminata da catalogo, ricerca, sinonimi, raccolta taxi collettivo, modelli attivi, suggerimenti, indice, PDF, riferimenti TC01 e copertura corrente. Nessun rinvio a fattispecie diversa; eliminato anche il rinvio descrittivo alla scheda autonoma dell’avviso nella nota R16. |
| G52 | Formula richiesta; O.D. 1/2019 e atti 2025/2026, stalli e limiti nelle note; tabella art. 86 residuale, con verifica della condizione della licenza. |
| I01 | Formula esatta richiesta, senza chiusura al Corso Pubblico. Tariffa predeterminata legittima e collettivo restano nelle note. |
| I09 | Formula sul titolare con un campo unico per la comunicazione/documento mancante; 48 ore corrette. Nessuna duplicazione automatica nei ruoli; conducente e cooperativa/consorzio distinti. Qualificazione della sanzione al titolare non conducente aperta. |
| R01 | Testo richiesto, mantenuto come relazione: la disposizione citata non dimostra da sola un divieto generale del conducente. |
| R07 | Testo richiesto, con un solo campo per difformità concreta e prescrizione. |
| R08 | Testo richiesto. Note distinguono insegna assente, segnale spento e occultamento nell’uso proprio. |

Le formule di relazione **non dichiarano automaticamente l’esistenza di un verbale**. Per R39–R42, G46–G50, I09 e R01, la frase «Copia del presente verbale sarà inviata all’Ufficio Corso Pubblico» è una clausola selezionabile solo se il verbale è effettivamente elevato su base verificata. Nel PDF la stessa clausola è fuori dalla formula base. Questo adattamento applica la distinzione richiesta fra relazione, verbale e attività realmente compiuta. L’invio è al futuro; una trasmissione già eseguita richiede data e protocollo reali. Per G52/R07/R08 la chiusura è nella formula base, per I01 resta assente. Obblighi e provvedimenti dell’autorità non sono resi facoltativi dalle selezioni.

Le tre diciture da eliminare sono assenti dal rendering operativo, dai nuovi testi copiati e dall’intero PDF. Il presupposto sostanziale è nelle note: condizione del titolo, fonte ed efficacia; esclusione delle fattispecie specifiche. Sono intatti gli originali documentali, il loro testo ricercabile e i rapporti storici, che possono ancora contenere quelle parole o il codice eliminato. I dati del vecchio compilatore in `data/guide-operative.json` restano materiale storico non caricato dalla PWA: il relativo test li confronta con il catalogo storico, mentre i nuovi test controllano il catalogo attivo.

## Trazione equina: elenco completo e norma verificata

La categoria effettiva contiene **soltanto quattro schede**, R39, R40, R41, R42: sono state controllate tutte. Nessun’altra scheda viene resa equina per la sola presenza di un riferimento generale. Nel layout, l’ambito condiviso “all” riguarda Taxi/NCC e non genera schede equine nascoste.

La richiesta comune era: **«inserire … l’art. 86, comma 3-bis, CdS … a tutti quelli trazione equina»**. L’[art. 86](https://aci.gov.it/codice-della-strada/art-86/), rubricato per autovetture, motocicli e velocipedi, non si estende automaticamente alla distinta categoria dei veicoli a trazione animale. L’[art. 70 CdS](https://aci.gov.it/codice-della-strada/art-70/) disciplina specificamente il servizio di piazza con vetture a trazione animale e slitte. Il comma 4 distingue servizio senza licenza e inosservanza delle condizioni di una licenza ottenuta. È questa seconda ipotesi il riferimento integrato nelle quattro schede, con il collegamento al titolo ancora da accertare nel caso concreto.

| Scheda | Obbligo comunale controllato | Disposizione sanzionatoria pertinente e limite |
|---|---|---|
| R39 | Artt. 34–35: rispetto, dignità e benessere anche durante riposo; art. 39 sul successivo provvedimento | Art. 70, comma 4, secondo periodo, se l’obbligo integra una condizione della licenza. Ulteriori illeciti sul benessere richiedono propri fatti e norme; non sono qualificati per analogia. |
| R40 | Art. 36, comma 1: razze da tiro soggette a valutazione morfologica o di categoria di peso; comma 2: eccezione certificata per animali già in esercizio | Art. 70, comma 4, secondo periodo, per la condizione del titolo effettivamente violata. Il solo certificato non esibito non dimostra inidoneità. |
| R41 | Art. 37, commi 1–4: abilitazione necessaria, annualità, identificazione e rinnovo; art. 39 | Art. 70, comma 4, secondo periodo, per la specifica condizione della licenza accertata. Verifica tecnica/veterinaria distinta da osservazione diretta. |
| R42 | Art. 38, comma 1: rinvio a ordinanza sulle caratteristiche delle vetture | Art. 70, comma 4, secondo periodo, solo dopo acquisizione della prescrizione tecnica e collegamento al titolo. Ordinanza pertinente non acquisita. |

Fonte comunale: [regolamento ufficiale](https://static-www.comune.napoli.it/wp-content/uploads/2025/05/Regolamento-per-il-trasporto-pubblico-non-di-linea.pdf), pp. 19–20. L’art. 36, comma 1, corrisponde alla materia R40, ma non prova da solo né un obbligo generico di esibizione né l’inidoneità di ogni cavallo diverso dalle razze elencate: conservato comma 2.

Art. 70, comma 4, secondo periodo: € 42–173 e ritiro della licenza. Se accertata questa esatta ipotesi, la proposta è PMR € 42, entro cinque giorni € 29,40, oltre sessanta € 86,50 oltre spese alle condizioni dell’art. 203, comma 3. Art. 70, comma 4, primo periodo e comma 5: assenza di licenza, € 87–344 e confisca; è una condotta diversa da quelle delle quattro schede. Il [ritiro ex art. 216](https://aci.gov.it/codice-della-strada/art-216/) è distinto dalla revoca riservata all’ufficio dall’art. 39 comunale. Il rapporto propone questi valori condizionati; nelle quattro tabelle non viene precompilata una nuova sanzione in mancanza del collegamento concreto con la licenza. **Da confermare solo tale collegamento e l’eventuale diversa base per fatti autonomi; non l’estensione dell’art. 86 per analogia.**

## Punti circoscritti da confermare, con correzione proposta

### G46, G47, G48 — ordinanze, obbligo e titolo

Richiesta: aggiunta art. 86, comma 3-bis; disco/ultimo posto, pausa oltre **30 minuti**, vetrofania nel cambio turno. Fonte sanzionatoria verificata: [art. 86, comma 3-bis](https://aci.gov.it/codice-della-strada/art-86/), condizioni della licenza fuori dai commi 2 e 3. Il testo non dimostra che qualunque prescrizione di un’ordinanza sia automaticamente una condizione del titolo.

I richiami locali indicano O.S. 11/2010 per G46–G47 e O.D. 3 del 22/03/2021 per G48. **Testi integrali, eventuali modifiche ed efficacia attuale non acquisiti**, anche dopo ricerca mirata nelle fonti comunali. Non si afferma che non esistano. Da acquisire: dispositivo vigente e clausola della licenza che recepisce l’obbligo; per G47 il limite esatto e per G46 ultimo posto/disco. Proposta applicata: riferimenti potenziali, formule utilizzabili come relazione, nessun importo o ritiro preimpostato; G47 lascia il numero dei minuti da completare dall’atto.

### G49 — sosta del taxi titolare fuori servizio

Richiesta: «CdS art. 158, comma 2, lett. d; d.l. 422/97 art. 14», PMR € 165, entro cinque € 115,50, oltre sessanta € 330, rimozione e 2 punti.

La natura corretta del secondo atto è **D.Lgs. 19 novembre 1997, n. 422**, art. 14, **comma 6**: consente l’uso proprio fuori servizio del taxi, non sanziona la sosta. Fonte acquisita: [banca dati ufficiale della Giustizia tributaria](https://def.giustiziatributaria.gov.it/DocTribFrontend/executePrintArticolo.do?articolo=Articolo+14&codiceOrdinamento=0000000000000140000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000&id=%7B91639DFA-4C08-43A0-AECB-C9388D71ACEC%7D), articolo completo, due pagine; anche nota di coordinamento all’art. 86 ACI. Il regolamento comunale, art. 26, disciplina l’occultamento dell’insegna in uso proprio, senza provare da solo che questo taxi sia escluso dalla riserva dello specifico posteggio.

L’[art. 158, comma 2, lett. d e comma 5-bis](https://aci.gov.it/codice-della-strada/art-158/) prevede, per le autovetture nella fattispecie di sosta vietata pertinente, € 165–660. Gli importi richiesti sono coerenti con tale ipotesi generale: € 165 in misura ridotta, € 115,50 con riduzione del 30% ex [art. 202](https://aci.gov.it/codice-della-strada/art-202/), € 330 quale metà del massimo ex [art. 203, comma 3](https://aci.gov.it/codice-della-strada/art-203/), in assenza di pagamento e ricorso, oltre spese. Rimozione: [art. 159, comma 1, lett. b](https://aci.gov.it/codice-della-strada/art-159/), che comprende le violazioni dell’art. 158, comma 2. I 2 punti sono riscontrati nella [tabella ufficiale Normattiva, versione 12 vigente dal 12/04/2025](https://www.normattiva.it/atto/caricaArticolo?art.versione=12&art.idGruppo=17&art.flagTipoArticolo=1&art.codiceRedazionale=092G0306&art.idArticolo=1&art.idSottoArticolo=1&art.idSottoArticolo1=10&art.dataPubblicazioneGazzetta=1992-05-18&art.progressivo=0&), riga art. 158, comma 2, lettere d e h. L’articolo 126-bis da solo non contiene la tabella; la pagina ACI che ha reindirizzato all’indice e la tabella comunale storica sono registrate come tali, senza scambiarle per tabella corrente.

**Conflitto non numerico ma applicativo:** essere un taxi fuori servizio non dimostra, da solo, occupazione abusiva dello stallo. Servono riserva e segnaletica efficaci, disciplina applicabile al taxi titolare, turnazione ed eventuale pausa autorizzata. Non è stata acquisita la prescrizione che esclude quel taxi dallo stallo in quelle condizioni. Proposta: relazione breve; riferimenti completi e valori condizionati nelle note, tabella ancora da qualificare. **Da confermare solo l’applicazione alla precisa condotta**, senza negare i valori dell’ipotesi generale e senza confonderla con l’occupazione da parte di un altro veicolo.

### G50 — 15 minuti e momento iniziale

Richiesta: «superava il limite di 15 minuti di attesa dopo la salita del terzo passeggero». Fonte primaria letta integralmente: [O.D. 1 del 16/04/2019](allegati/Taxi_Collettivo_OD_1_2019_originale.pdf), punto **4.3**, p. 2, e clausola di efficacia p. 3. Il dispositivo parla di partenza dopo 15 minuti dall’**arrivo dei primi tre passeggeri**. Non dice “salita del terzo” e non qualifica espressamente quel tempo con la stessa formulazione di un limite massimo dell’art. 19, comma 4, comunale, che parla di cinque minuti dalla salita del primo.

L’[O.D. 10/2025](allegati/Taxi_Collettivo_OD_10_2025_originale.pdf), dispositivo p. 2, proroga al 31/12/2026; l’[O.D. 9/2026](allegati/Taxi_Collettivo_OD_9_2026_originale.pdf), dispositivo p. 3, integra sui posti, lasciando ferme le altre disposizioni. Non modificano il momento iniziale indicato dal punto 4.3. L’abrogazione delle ordinanze incompatibili non prova da sola una modifica del regolamento consiliare. D.G.C. 634/2018 integrale ancora da acquisire.

Proposta applicata: relazione che registra arrivo dei primi tre e permanenza osservata; arrivo, salita e partenza restano distinguibili nelle note. **Da confermare il coordinamento e l’esatta condotta sanzionabile**, non la presenza materiale del punto 4.3. Rimangono i quesiti precedenti TC01 su turni, premesse e regolamento; non è dichiarata una proroga oltre il 31/12/2026 né l’assenza certa di altri atti non indicizzati.

### G52 — stalli e importi art. 86

L’O.D. 1/2019, punto 2, individua: Aeroporto area ex NCC presso rotonda viale Ruffo di Calabria, fronte Polizia Locale, **4** posti; corso Novara n. 3, **2**; corso Arnaldo Lucci presso Metropark, **3**; Molo Beverello via C. Colombo, corsia destra verso via Marina presso semaforo/fermata ANM, **5**. Punto 5 e p. 3: efficacia dall’installazione della segnaletica. Il divieto di eccedere gli stalli e l’allontanamento dei veicoli in eccesso compaiono anche nelle premesse riferite alla DGC634.

Formula, tabella art. 86 e riferimenti 2019/2025/2026 applicati. Restano da verificare **specifica condizione della licenza**, stallo/segnaletica installati e atti successivi sul luogo. Non sono inventati nuovi stalli o limiti e non si estende la scheda ad altre tratte senza i relativi atti. TC01 conserva i propri limiti e perde soltanto il rinvio a G51.

### I09 — titolare, autore e obbligato in solido

Richiesta non recepita letteralmente: «Indicare come trasgressore e come obbligato solidale il titolare della licenza; inserire il conducente in altri soggetti».

Regolamento, art. **7, commi 2–4**, p. 7: obbligo del titolare; se la licenza è conferita, comunicazione della cooperativa o del consorzio. Comma 3: comunicazione immediata e documentazione **entro 48 ore**, non 24; correzione dell’incoerenza locale documentata. La [L. 21/1992, art. 10](https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:1992-01-15;21~art10!vig=2026-10-21), acquisita singolarmente, permette la sostituzione nel turno assegnato a chi possiede i requisiti professionali e morali; non si rendono obbligatorie le sole causali storiche comunali. Seconda guida in turno aggiuntivo: commi 5-bis/5-ter e T01, senza estendere il suo termine alla sostituzione ordinaria.

L. 689/1981, [art. 3](https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:1981-11-24;689~art3!vig=2026-10-21): responsabilità personale; [art. 6](https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:1981-11-24;689~art6!vig=2026-10-21): presupposti della solidarietà. Per il CdS: [art. 196](https://aci.gov.it/codice-della-strada/art-196/). Nessuna di queste disposizioni impone di duplicare la medesima persona nei due ruoli. Inoltre il comma 3-bis dell’art. 86 riguarda chi guida il taxi: il mero titolare non conducente autore di un’omissione documentale non vi rientra automaticamente.

Dicitura proposta e applicata nelle note: **«Individuare il titolare tenuto all’adempimento e accertare l’omissione personalmente imputabile; in caso di conferimento verificare cooperativa o consorzio. Indicare il conducente tra gli altri soggetti se non è autore dell’omissione. Inserire un distinto obbligato in solido solo quando ne ricorrono i presupposti della norma applicabile, senza duplicare il trasgressore».** Da confermare la qualificazione sanzionatoria dell’omissione del titolare non conducente; la formula resta una relazione. Non si attribuisce automaticamente al conducente la violazione dell’obbligo altrui.

### R01 — punti radiotaxi

Regolamento art. **4, comma 6**, p. 4: punti presso stazioni ferroviarie, marittime e aeroportuali e attesa degli utenti; distanza di 50 metri per la localizzazione dei punti. Non fonda da solo un divieto generale del conducente per ogni diverso prelievo. Formula richiesta applicata come relazione; occorre l’atto che istituisce il punto e la pertinente condizione del titolo per qualificare una sanzione. È mantenuto il dubbio già documentato, non dichiarato risolto.

## Verifiche e limiti

Gli esiti sono documentati nel [riepilogo finale](revisione/1.8.10/esito-finale.json), nel [log npm test](revisione/1.8.10/esito-npm-test.txt), nelle [prove mirate](revisione/1.8.10/verifica-seconda-parte.json), nelle [prove browser complete](revisione/1.8.10/browser-check.json) e nella [migrazione reale 1.8.9 → 1.8.10](revisione/1.8.10/aggiornamento-1.8.9-1.8.10.json).

I controlli comprendono: `npm test`, `git diff --check`, conservazione degli originali tramite SHA-256, confronto fra formula visibile, funzione di copia effettiva e testo PDF, tutte le 186 destinazioni degli indici e della PWA, G51 assente dai percorsi attivi, diciture eliminate dal rendering/PDF, layout di tutte le schede in nove dimensioni incluse 360 e 390 px, selezioni G46/R41 e clausola di invio, salvataggio PDF, migrazione della fonte valida e riapertura offline con SHA-256. Tutte le 15 schede modificate sono rappresentate nelle immagini PWA e PDF dell’anteprima, con controllo visivo. Prove locali Chromium, non prova su telefono fisico o sito pubblico.

I test sono aggiornati per rimozione/versione/paginazione reali e per l’unica nuova tabella autorizzata G52; il nuovo test controlla anche la conservazione delle altre schede e degli originali. Le verifiche storiche non vengono riscritte per adattarle alle nuove pagine: l’audit corrente rinvia agli esiti precedenti senza certificarli di nuovo. `npm run audit:cards` ora produce la copertura corrente in 1.8.10, evitando di sovrascrivere 1.8.6. I vecchi generatori di anteprime storiche non sono stati eseguiti.

**Dubbi anteriori conservati:** decorrenza differita della L. 193/2024, precedenti art. 86/art. 8-bis L. 689, D.D. 72/2012 e 135/2010 integrali, coordinamento sanzioni comunali/regionali, approvazione di un eventuale nuovo regolamento, disposizioni interne su CAP/patente/RCA e termini di invio licenza, limiti degli originali EGAF, turni e ulteriori questioni TC01. La nuova verifica non li dichiara risolti. Il PDF nuovo deve essere salvato esplicitamente nella PWA; gli originali invariati rimangono validi in cache.
