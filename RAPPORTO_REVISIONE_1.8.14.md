# Revisione locale PWA 1.8.14 / PDF 7.16

Revisione documentale datata **4 novembre 2026**; conclusione dei controlli tecnici il **5 novembre 2026**. Le interrogazioni normative richiedono la vigenza al 4 novembre; date effettive delle acquisizioni nel registro fonti. La fase locale si è conclusa senza commit, push o deploy; la successiva pubblicazione è stata autorizzata dall’autore. Gli esiti effettivi sono registrati in fondo al rapporto.

## Risultato

| Voce | Prima | Dopo |
|---|---:|---:|
| PWA / PDF | 1.8.13 / 7.15 | 1.8.14 / 7.16 |
| Voci di catalogo, inclusi rinvii e consultazione | 119 | 112 |
| Schede PDF | 190 | **172** |
| Taxi | 112 | 103 |
| NCC | 70 | 61 |
| Trazione animale | 8 | 8 |
| Pagine PDF | 211 | **193** |
| Indici collegati | 6 | 6 |
| Destinazioni delle schede | 190 | **172** |
| Formule copiabili | 189 | 171 |
| Allegati consultabili | 16 | 17 |

I conteggi comprendono schede di riferimento e R01 esplicitamente inattiva: non sono 172 fattispecie tutte automaticamente contestabili. TC01 resta consultazione senza formula sanzionatoria. Una pagina per scheda, testo a 9 pt, indice e pagine ricalcolati dal catalogo effettivo.

Build: `53e242ecce7fcba5d85d184684be8a5af7f19940e09e2f0fc61f86b58a0dc86e`.

PDF: `allegati/Prontuario_Taxi_NCC_Napoli.pdf`, 5.791.646 byte.

SHA-256: `1cc65c8dab3193109c07d9fe9043db702709bd757f7e6b1c9b2274973432fc79`.

## Fotografia iniziale e copertura del TXT

Il repository era su `main`, HEAD `455190e5a96281102b154fbc5eae1fd88c41f57c`, PWA 1.8.13 / PDF 7.15. Nessun AGENTS.md trovato nel repository o negli antenati consultati. Consultati README, PASSAGGIO_CODEX e le istruzioni tecniche storiche; la richiesta corrente di revisione locale prevale sulle vecchie istruzioni di pubblicazione.

Prima delle modifiche sono stati salvati localmente stato, dati, 190 viste e tabella iniziale delle richieste. Questi originali e la fotografia `revisione/1.8.14/base-1.8.13/` restano locali, esclusi dal commit e dal pacchetto Pages. La regressione storica riproducibile legge invece gli oggetti Git della pubblicazione precedente `455190e5a96281102b154fbc5eae1fd88c41f57c`, con contratto di impronte in `tests/release-baseline.json`. Nessuna copia iniziale è aggiunta per far passare i test.

Il TXT è stato letto integralmente. Originale conservato, 24.947 byte, SHA-256 `499410597718b44ac16b0ac91c8d9e60540d41d05d69e49b44e4ffac05119bab`.

**63 richieste, tutte con esito: 31 applicate e 32 adattate con motivazione.** La [tabella completa](revisione/1.8.14/esiti-txt.md), disponibile anche in [CSV](revisione/1.8.14/esiti-txt.csv) e [JSON](revisione/1.8.14/esiti-txt-pubblicabili.json), indica per ciascun codice le parti applicate, quelle corrette rispetto al TXT e la ragione normativa o documentale. Non è stata richiesta una nuova conferma delle indicazioni dell’autore.

## Rimozioni e rinvii

Rimossi R16, T01, G15, G28-03, I08, R29, R31 e R36 da catalogo attivo, varianti, ricerca, alias pertinenti, formule e PDF. Nessun codice superstite rinumerato. Rimosso anche il rinvio residuo TC01→R16, individuato dalla prova browser.

Questi otto codici corrispondevano a 13 schede di servizio. I06 è ora nei soli NCC: eliminata anche la sua vista Taxi. La revisione autonoma ha inoltre escluso le viste NCC di G33, R35, R37 e R38: tassametro e divieti espressamente rivolti agli utenti Taxi non costituiscono automaticamente obblighi NCC. Le quattro voci Taxi rimangono. Riduzione totale: 18 viste, da 190 a 172.

La rimozione editoriale di R16 non certifica l’abrogazione dell’art.19. T01 è ritirata dal catalogo, ma il turno aggiuntivo rimane previsto dalla L.21/1992 art.10, commi 5-bis e 5-quater, e dall’art.11 c.6 L.R.10/2024: i rinvii ora richiamano le norme, senza dichiarare inesistente tale facoltà. TC01 conserva gli atti specifici del collettivo.

I03 e I03-01–04 rimangono rinvii alle sole N04–N07. N04–N07 e R33-01–04 non vanno duplicati per il medesimo fatto di stazionamento/acquisizione della clientela. La presenza di più disposizioni o accessi al catalogo non comporta un cumulo.

## Riferimenti e formule

Riferimenti editoriali correnti con **“let.”**, anche nei richiami multipli. Articoli e commi con suffissi bis/ter rimangono distinti dalle lettere; nessun “let.” duplicato. Controllati tutti i corpi delle schede e tutte le 193 pagine PDF. Ordine dei riferimenti: CdS, eventuale L.21/1992, regolamento comunale, ulteriori atti pertinenti.

Le due diciture indicate all’inizio del TXT sono eliminate dalle schede. Dove necessario rimane una sola nota sul presupposto specifico: guida del taxi o utilizzo NCC, condizione del titolo, fonte ed efficacia. Originali degli atti, relative estrazioni nella sezione Fonti e rapporti storici non sono stati uniformati retroattivamente.

Le formule sono brevi e descrivono fatti e riscontri. Le scelte alternative sostituiscono la sola condotta pertinente; esempi, istruzioni e spiegazioni rimangono fuori dalla copia. Le attestazioni di ritiro, sequestro, custodia o invito entrano soltanto dopo conferma dell’operatore; il cambio di condotta azzera le attestazioni selezionate. Gli obblighi restano negli adempimenti. Diffida, sospensione, decadenza o revoca da disporre dall’autorità non entrano nella formula.

Per una relazione, la frase sull’invio futuro del verbale viene aggiunta solo quando il verbale è stato effettivamente elevato su base verificata. Il futuro non attesta un invio già compiuto.

## Verifica NCC e principali adattamenti sostanziali

La [matrice completa NCC](revisione/1.8.14/controllo-tutte-ncc.md), con [CSV dettagliato](revisione/1.8.14/controllo-tutte-ncc.csv) e [JSON](revisione/1.8.14/controllo-tutte-ncc.json), comprende tutte le **70 viste iniziali**: 61 correnti e nove escluse. Comprende varianti, schede condivise e rinvii I03. Ogni riga distingue obbligo, sanzione, importi anche alternativi, soggetto, punti, misure, adempimenti, destinatari, ufficio, formula e limite specifico.

- **R14/R15, G11/G13/G14/G32/G44, R02/R03/R04/R05/R22/R23:** una mera omissione del titolare o del concessionario non è automaticamente guida Taxi ex art.86 c.3-bis o utilizzo NCC ex art.85 c.4-ter. Regime comunale separato, dove applicabile. G44 richiede prova personale del consenso; conducente distinto dal titolare. Il ritiro del titolo del gruppo C è distinto dal permesso di sostituzione.
- **G12:** il provvedimento generico non basta per art.86 c.2. Scelte separate per servizio con licenza sospesa o revocata; NCC art.85 c.4 con propri presupposti. Precedenti da verificare: G02 o N03 per la seconda violazione della stessa persona nel triennio. Nessuna revoca già disposta dagli operatori.
- **G19/R13/N09:** titolo esistente non a bordo distinto da assenza dell’autorizzazione. Art.180 cc.3/7, €42–173, PMR42, entro cinque giorni29,40, oltre sessanta86,50. Altri documenti richiedono il proprio comma. Invito c.8 solo se non verificabile in banca dati pubblica accessibile, salvo impossibilità tecnica, e se realmente impartito.
- **G10:** uso privato indicato in polizza distinto dall’assenza RCA; Codice assicurazioni art.144, opponibilità e rivalsa. Nessun art.193 o ritiro della licenza per la sola difformità contrattuale.
- **I06:** trasferimento ricettivo gratuito, accessorio e riservato agli ospiti distinto dal trasporto professionale oneroso. Art.13-bis regionale non rende ogni corrispettivo automaticamente un art.85 c.4. Categoria del veicolo, uso, servizio e assenza del titolo vanno accertati; autobus con propria disciplina.
- **N04–N07/R33:** art.85 c.4-bis al titolare dell’autorizzazione, anche diverso dal conducente; fasce del medesimo veicolo nel quinquennio. Nessun tassametro, tariffario, posteggio o turno Taxi trasferito agli NCC.
- **R35/R37/R38:** responsabile utente, senza automatica attribuzione al conducente. Nessun art.86/85 al cliente per analogia. Cibo e fumo distinti; il ramo fumo richiede il coordinamento della disciplina speciale. Per le condotte comunali Taxi qualificate si distingue TUEL; escluse le viste NCC impropriamente estese.
- **G53:** €30 più 4% della transazione, formula variabile e calcolatrice coerenti. Art.16 L.689 escluso, nessuna riduzione del 30%, rapporto al Prefetto distinto dal Corso Pubblico.
- **G54:** ruolo autovetture fino a nove posti compreso il conducente, non requisiti professionali autobus. Art.17 regionale per l’obbligo; art.19 c.3 esclude limiti territoriali. Risposta della CCIAA sull’assenza dell’iscrizione, non sola mancata esibizione. €500–3.000, PMR1.000 entro 60 giorni, comunicazioni agli enti previsti.

TUEL: art.7 non determina da solo un importo. Coordinati art.7-bis, art.21 c.5 L.R.10/2024 e art.16 L.689: regime generale €25–500, PMR €50 entro 60 giorni, salvo disposizione speciale o diversa delibera di Giunta non acquisita. I €50 dell’art.29 c.3 comunale non sono trasformati in un minimo edittale di €50. Nessuno sconto 30% o punto patente importato dal CdS. Le misure sul titolo e i relativi punti comunali restano distinti.

Per i casi CdS gravi, sequestro e confisca sono distinti; verificare anche proprietà ed estraneità del terzo ex art.213 c.9. Art.210 c.3: verbale al Prefetto entro dieci giorni e regime del PMR; art.218: patente ritirata alla Prefettura entro cinque giorni. Documento di circolazione all’UMC e provvedimenti prefettizi restano distinti. Il prontuario non attesta automaticamente alcuno di questi atti.

## Fonti e aggiornamenti

Regolamento C.C.80/2005, 20 pagine, riletto integralmente. [FONTI.md](revisione/1.8.14/FONTI.md) e [registro con SHA-256](revisione/1.8.14/fonti.json) distinguono acquisizioni valide, consultazioni ufficiali e risposte tecniche prive dell’atto. I file `acquisizioni*.json` documentano i tentativi iniziali; il registro finale è `fonti.json`.

Consultati gli articoli pertinenti di CdS, L.21/1992, L.218/2003, TUEL, L.689/1981, Codice assicurazioni e normativa POS. Acquisita la riproduzione della circolare Interno13498/05.05.2025, letta visivamente in tutte le quattro pagine: documento ministeriale ospitato da SILP, non assunto come commento sindacale. P.3 nota6 indica decorrenza01/05/2025 degli artt.85/86 modificati.

[L.R.10/2024 coordinata](https://www.regione.campania.it/normativa/item.php?pgCode=G19I231R2073&refresh=on) e [L.R.7/2026](https://www.regione.campania.it/normativa/item.php?pgCode=G19I231R2150&refresh=on): art.13-bis, rimessa effettiva, contrassegno regionale, SCIA autobus e termini transitori. Per titoli NCC già esistenti, 180 giorni dall’11/08/2026 per contrassegno/documentazione, con tutela della tempestiva richiesta di validazione; il termine è ancora pendente alla data della revisione. Titoli autobus precedenti efficaci fino al 31/12/2026. N10 distingue dimenticanza del conducente (€42–173) e omissione sostanziale dell’impresa (€500–2.000, PMR666,67, senza 30%). I09 è coordinata con il perfezionamento regionale entro 24 ore, non ripropone il precedente termine locale48 ore.

Corte56/2020: eliminato il rientro generalizzato dopo ogni corsa;137/2024: blocco nuovi titoli in attesa del registro;206/2024: non elimina la necessità del titolo NCC;163/2025: specifiche prescrizioni del D.I.226. Il [parere Garante23/09/2026](https://www.garanteprivacy.it/web/guest/home/docweb/-/docweb-display/docweb/10302983) documenta l’annullamento integrale del decreto da parte del TAR e valuta un nuovo schema, che non è presentato come decreto efficace. Ordinanza14/2026 relativa al Veneto: estinzione, non deroga estesa alla Campania.

Nuova risorsa PWA: `allegati/Fonti_revisione_1.8.14.txt`, sintesi editoriale con collegamenti ufficiali e limiti, salvabile offline anche dalle schede aggiornate. Non è il TXT di lavoro né un originale normativo.

## Revisioni precedenti conservate

R39–R42 mantengono obbligo di ritiro, termine di cinque giorni e destinatario **Ufficio Corso Pubblico**, indicazione organizzativa confermata dall’autore distinta dall’art.216. Clausola del ritiro soltanto se materialmente eseguito. G46/G47 mantengono cinque stalli, due tassisti, trenta minuti, ultimi due posti disponibili, disco sul parabrezza, esclusione scali e segnaletica; prot.11/07.06.2010 distinto dal progressivo1003/08.06.2010.

R43 mantiene stagione **e**12–16 **e**(temperatura≥30°C **o** bollettino Napoli rischio2/3), senza duplicare per entrambe le condizioni. Distinti2024, disciplina2025 e clausola di durata. G51 rimane rimossa.

R44–R46 restano operative sulle prescrizioni confermate dall’autore: sei ore giornaliere, capienza autorizzata e scarpe protettive. Integrale O.S.835/17.06.2014 e sanzione specifica non acquisiti; nessun punto dell’atto inventato. Regime generale TUEL condizionato e distinto dagli artt.70/85/86 CdS, senza ritiro, punti o cumuli automatici.

## Controlli eseguiti

| Controllo | Esito ed evidenza |
|---|---|
| `npm test` | PASS: integrità build/SW, cache e Range, icone, revisione corrente,172 destinazioni e146 varianti |
| `npm run test:historical` | PASS:13 suite precedenti sulla fotografia1.8.13; non presentate come verifica dei testi nuovi |
| `git diff --check` | PASS; anche217file nuovi controllati senza diagnostica whitespace, HEAD iniziale invariato e indice Git vuoto |
| `npm run audit:cards` | PASS:172 schede,70 viste NCC iniziali e63 richieste con esito |
| PDF completo |193 pagine, una per scheda a9 pt; nessun superamento dei margini;172link dell’indice verificati nel PDF |
| Riferimenti/importi/formule PWA–PDF | PASS; tutte le pagine controllate per lettere senza “let.” e duplicazioni |
| Browser360/390px | PASS su tutte le172 schede: nessun overflow, stemmi e crediti completi, copia e pagine PDF corrispondenti |
| Varianti e clipboard | PASS:146 varianti, attestazioni e azzeramento al cambio di condotta;18ricerche di codici ritirati senza risultati |
| Migrazione reale locale | PASS:1.8.13→1.8.14; originali validi conservati, vecchio manuale scartato, nuovo PDF risalvato e SHA verificato offline |
| Prima installazione e riapertura | PASS con profilo temporaneo, chiusura e riapertura di Chromium offline; PDF e sintesi fonti disponibili |
| Pacchetto pubblico locale |146percorsi espliciti, hash confrontati col locale; nessun deploy |
| Privacy | Nessun identificativo fiscale nel nuovo HTML/PDF; nessuna nuova struttura di dati di controllo; nel manuale solo i due stemmi con relative maschere |

Evidenze in stato e controlli repository (registro locale escluso), [controlli statici](revisione/1.8.14/controlli-statici.json), [browser](revisione/1.8.14/browser-check.json), [varianti e riapertura](revisione/1.8.14/varianti-installazione-offline.json), [migrazione](revisione/1.8.14/aggiornamento-1.8.13-1.8.14.json) e [privacy/pacchetto](revisione/1.8.14/controllo-privacy-pacchetto.json). Prove locali Chromium, non una nuova verifica su telefono fisico o sul sito pubblico. Il timeout iniziale della prima installazione è stato ripetuto isolatamente con60 secondi; risultato finale positivo. Il server locale interrotto è stato riavviato prima delle prove conclusive.

## Limiti documentali specifici

- G28-02/G28-04: integrali D.D.72/2012 e135/2010 e precisa condizione del titolo non acquisiti; nessuna tabella sanzionatoria attivata per analogia.
- N11: nuovo decreto FDSE efficace non reperito nella ricerca; integrali delle singole sentenze TAR richiamate dal Garante non acquisiti. Restano distinti il dovere di legge e le modalità concretamente contestabili.
- G44: nessuna base acquisita per ritirare automaticamente il permesso di sostituzione scaduto; verificare anche comunicazioni/proroghe efficaci. Ritiro del titolo del gruppo C distinto.
- R06 NCC: estensione del termine locale dieci giorni non documentata dal solo riferimento alla licenza; resta relazione. R24: occorre il preciso atto efficace del gestore. R30: perdita del requisito e provvedimento dell’ufficio non diventano automaticamente una sanzione in strada.
- R35 ramo fumo e G45: coordinamento della specifica disciplina antifumo prima della qualificazione; nessun importo nazionale universale o cumulo preimpostato.
- Restano i limiti precedenti: integrale/sanzione O.S.835/2014, originale ufficiale pausa2010, ordinanza tecnica R42, eventuale diversa delibera Giunta PMR. Il parere ART57/2026 sullo schema non prova un nuovo regolamento approvato. Per G13/G14 il calendario e lo stato del singolo titolo richiedono il relativo riscontro; il Modello A2026 acquisito non è l’integrale della disposizione.

Sono limiti circoscritti, non richieste di riconferma delle prescrizioni dell’autore. Originali personali, foto dei controlli, schermate EGAF integrali e TXT di lavoro restano locali. Le esclusioni di pubblicazione sono conservate; il PDF EGAF86 originale è ancora presente localmente e assente dal pacchetto. Anche fotografia iniziale e fonti grezze di questa revisione sono fuori dall’elenco Pages.

## Risultati da aprire

[Anteprima](revisione/1.8.14/anteprima.html) · [confronto interattivo delle190 viste iniziali](revisione/1.8.14/confronto-prima-dopo.html) · [confronto riepilogativo](revisione/1.8.14/confronto-prima-dopo.md) · [tutti gli esiti TXT](revisione/1.8.14/esiti-txt.md) · [tutte le schede NCC](revisione/1.8.14/controllo-tutte-ncc.csv) · [PDF completo](allegati/Prontuario_Taxi_NCC_Napoli.pdf).

**Il PDF aggiornato deve essere salvato nuovamente nella PWA per l’uso offline.**

## Pubblicazione autorizzata — verifiche prima del commit

Controllate le istruzioni disponibili, lo stato Git, il diff e il remoto: `main` remoto coincide con la base `455190e`; nessun aggiornamento altrui da integrare. Nessun AGENTS.md presente. Restano integralmente i contenuti e i limiti documentali approvati, comprese le precisazioni TUEL e le conferme dell’autore; nessuna nuova modifica normativa durante la pubblicazione. Il PDF e la build conservano le impronte sopra riportate.

I test storici leggono la versione precedente dalla cronologia Git, verificando le impronte dei 44 file obbligatori; in CI il checkout acquisisce la cronologia completa. I file obbligatori correnti restano controllati senza deroghe. Il TXT può essere assente nella copia pubblicabile; se presente deve mantenere la sua impronta. Le 63 righe di esito pubblicate contengono codice, decisione, motivazione e schede interessate, senza riprodurre il testo grezzo dell’input.

La selezione dei file da committare è esplicita. Il pacchetto Pages usa una lista distinta e include rapporto, anteprima, confronto, esiti e matrici; esclude gli originali riservati, il TXT, le fotografie iniziali e le fonti grezze di questa revisione. Gli originali esclusi restano presenti localmente.

**Verifiche locali prima della pubblicazione: PASS.** `npm test` e tutte le 13 suite storiche superate sia nel repository di lavoro sia nella clone pulita, dopo `npm ci` (zero vulnerabilità segnalate). La clone non contiene TXT, EGAF integrale, foto personali, fotografie iniziali o fonti grezze della revisione. Prova negativa superata: rimuovendo soltanto nella clone il nuovo allegato obbligatorio, la suite fallisce con ENOENT; originale subito ripristinato. Nessun controllo obbligatorio reso facoltativo. I test ordinari verificano gli esiti senza riscrivere le evidenze pubblicate.

Ripetuta con esito positivo la migrazione locale dopo il passaggio agli oggetti Git. Pacchetto preparato dalla clone e impronte verificate; corretto un errore sintattico nel filtro di esclusione prima del commit, aggiunto controllo sintattico a `npm test`. `git diff --check` superato. [Dettaglio tecnico locale](revisione/1.8.14/pubblicazione/verifiche-locali.json).

Preparata prima del deploy una vera installazione del sito pubblico 1.8.13 / PDF7.15: tutti i 16 allegati salvati e verificati con SHA-256. Un primo salvataggio è andato in timeout; la ripresa con riscontro esplicito dello stato si è conclusa positivamente per tutti i file. Il profilo temporaneo è conservato fuori dal repository per provare l’aggiornamento effettivo.

Commit, workflow e prove sul sito aggiornato: da registrare dopo il completamento delle rispettive attività.
