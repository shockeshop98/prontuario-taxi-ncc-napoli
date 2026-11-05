// Revisione 1.8.14 — modelli comuni a PWA e PDF. Fonti e motivazioni nel rapporto locale.
(function () {
  const w=window;
  const close='Copia del presente verbale sarà inviata all’Ufficio Corso Pubblico.';
  const regulation='Regolamento comunale (delibera C.C. n. 80/2005), ';
  const removed=['R16','T01','G15','G28-03','I08','R29','R31','R36'];
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function normalize(value){
    let result=String(value??'')
      .replace(/\s*\(solo se condizione della licenza verificata\)/gi,'')
      .replace(/Importi applicabili soltanto alla condizione del titolo accertata; non a ogni violazione comunale\.?/gi,'')
      .replace(/\s*\((?:solo )?se condizione (?:della licenza|dell’autorizzazione|del titolo) verificata\)/gi,'')
      .replace(/\blett\.\s*/g,'let. ').replace(/\bletter[ae]\s+(?=[a-z][),;\s])/g,'let. ')
      .replace(/\b(c\.|comma)\s*(\d+(?:-(?:bis|ter|quater|quinquies|sexies))?)\s*,?\s+([a-z])(?=\s*(?:[),;:.]|$|e\s+[a-z](?:[),;\s]|$)))/g,'$1 $2 let. $3')
      .replace(/\b(c\.|comma)\s*(\d+(?:-(?:bis|ter|quater|quinquies|sexies))?)\s*,?\s+([a-df-np-z])\b(?![.-])/g,'$1 $2 let. $3')
      .replace(/\b(cc\.|commi)\s*(\d+(?:\s*(?:,|e|-)\s*\d+)*)\s+([a-z])(?=\s*(?:[),;:.]|$))/g,'$1 $2 let. $3')
      .replace(/(let\.\s*[a-z]\)?\s*(?:,|e|o)\s*)([a-z])\b(?!\.)/g,'$1let. $2')
      .replace(/\blet\.\s*let\.\s*/g,'let. ')
      .replace(/\bT01\b/g,'L. 21/1992 art. 10, commi 5-bis e 5-quater');
    for(;;){const next=result.replace(/(let\.\s*[a-z]\)?\s*(?:,|e|o)\s*)([a-z])\b(?!\.)/g,'$1let. $2');if(next===result)break;result=next;}
    return result;
  }
  const tree=value=>typeof value==='string'?normalize(value):Array.isArray(value)?value.map(tree):value&&typeof value==='object'?Object.fromEntries(Object.entries(value).map(([k,v])=>[k,tree(v)])):value;
  w.prontuarioEditorialText=normalize;
  const oldOrdered=w.prontuarioOrderedReferences;
  w.prontuarioOrderedReferences=refs=>oldOrdered(refs).map(normalize).sort((a,b)=>rank(a)-rank(b));
  function rank(s){return /^(?:CdS|C\.d\.S\.)/.test(s)?0:/^L\.?\s*21\//.test(s)?1:/^Regolamento comunale/.test(s)?2:3;}
  for(const name of ['prontuarioNormative','prontuarioLegalText','prontuarioFollowupFormula','prontuarioActStatus']){
    const prev=w[name];if(prev)w[name]=(...args)=>normalize(prev(...args));
  }
  const originalVariants=w.prontuarioCatalogVariantItems;
  w.prontuarioCatalogVariantItems=catalog=>originalVariants(catalog).filter(i=>!removed.includes(i.code));
  const originalReceipts=w.prontuarioReceiptCaseItems;
  w.prontuarioReceiptCaseItems=catalog=>originalReceipts(catalog).filter(i=>!removed.includes(i.code));
  const retiredIds=['collettivodisplay','secondaguida','dispositivi','ricevuta-modello','alterazione','trasferimentotitolo','sospensioneingiustificata','utenteoggetti'];
  for(const code of removed){delete w.prontuarioStaticCatalog[code];if(w.prontuarioTaxiCollettivo)delete w.prontuarioTaxiCollettivo.related[code];}
  for(const id of retiredIds)delete w.prontuarioStaticDemos[id];
  for(const [alias,target]of Object.entries(w.prontuarioCatalogAliases))if(retiredIds.includes(alias)||retiredIds.includes(target))delete w.prontuarioCatalogAliases[alias];
  const rates={
    residual:['Condizione del titolo','86–338','86','60,20','169','Non previste'],
    tuel:['Regime generale TUEL','25–500','50 entro 60 giorni','Non previsto','Rapporto ex art. 17 L.689/1981','Non previste'],
    document:['Art.180 c.7','42–173','42','29,40','86,50','Non previste'],
    relation:['Relazione','Da qualificare','Non preimpostato','Non preimpostato','Secondo la base verificata','Nessuna misura presunta'],
    severe:['Servizio senza titolo efficace','1.812–7.249','Non ammesso','Non applicabile','Procedura Prefetto','Confisca; patente 4–12 mesi'],
    role:['Art.21 c.1 regionale','500–3.000','1.000 entro 60 giorni','Non previsto','Rapporto ex L.689/1981','Comunicazioni regionali'],
    pos:['Art.15 c.4-bis','30 € + 4% della transazione','Non ammesso ex art.16 L.689/1981','Non previsto','Rapporto al Prefetto','Non previste'],
    employment:['Omissione sostanziale impresa','500–2.000','666,67 entro 60 giorni','Non previsto','Rapporto L.689/1981','Non previste']
  };
  const facts={
    R11:'Durante il servizio guidava il taxi indicato, con C.P. n. […], privo dei dispositivi antinquinamento prescritti dal titolo […]. Difformità e riscontro: […].',
    R13:'Sul taxi di scorta indicato, assegnato al C.P. n. […], non teneva a bordo l’autorizzazione dell’auto di scorta […], richiesta dagli operanti e non esibita secondo […].',
    R14:'Il concessionario […] assegnava l’auto di scorta indicata al C.P. n. […] senza annotare l’assegnazione nel registro […], come riscontrato mediante […].',
    R15:'Il concessionario […] concedeva l’auto di scorta indicata, relativa al C.P. n. […], al soggetto non ammesso […]. Requisito mancante e riscontro: […].',
    R19:'Sul veicolo indicato, con C.P. n. […], il sigillo ufficiale del tassametro risultava rimosso senza l’autorizzazione prevista. Riscontro: […].',
    R20:'Sul tassametro del veicolo indicato, con C.P. n. […], era eseguito l’intervento […] dall’officina […] non autorizzata, come riscontrato mediante […].',
    R21:'Il tassametro del veicolo indicato, con C.P. n. […], non era stato verificato e risigillato dopo […], secondo il riscontro […].',
    R26:'A fine corsa, sul veicolo indicato con C.P. n. […], non arrestava il tassametro. Fatto osservato: […].',
    R28:'Fuori dal proprio turno, durante l’uso privato del taxi indicato, con C.P. n. […], guidava mantenendo visibile l’insegna TAXI. Luogo, ora e riscontro: […].',
    G10:'Il veicolo indicato, con C.P. n. […], era impiegato nel servizio nonostante la polizza n. […] della compagnia […] riportasse uso privato. Clausola e riscontro dell’assicuratore: […].',
    G11:'Per la licenza C.P. n. […], il soggetto obbligato […] ometteva di comunicare al Comune l’evento […] del […] entro cinque giorni, secondo il protocollo […].',
    G12:'Con il veicolo indicato, con C.P. n. […], svolgeva il servizio in contrasto con il provvedimento n. […] del […], efficace dal […]. Prescrizione, fatto e riscontro: […].',
    G13:'La licenza C.P. n. […] non risultava sottoposta alla vidimazione quinquennale dovuta; l’ultima vidimazione era del […], secondo il riscontro dell’ufficio […].',
    G14:'Per il veicolo indicato, con C.P. n. […], ometteva la visita tecnica comunale dovuta entro […], secondo il riscontro […].',
    G19:'Conducente del veicolo indicato, adibito a taxi con C.P. n. […], non portava con sé la licenza prescritta […], richiesta dagli operanti e non disponibile secondo […].',
    G20:'Durante il servizio con il veicolo indicato, con C.P. n. […], teneva verso […] una condotta scorretta: […]. Fatto accertato mediante […].',
    G21:'Durante il servizio con il veicolo indicato, con C.P. n. […], non osservava la disposizione […] impartita dagli agenti […]. Fatto e riscontro: […].',
    G25:'Il veicolo indicato, con C.P. n. […], impiegato nel servizio presentava condizioni di pulizia o efficienza difformi: […]. Riscontro: […].',
    G27:'Durante il servizio sul veicolo indicato, con C.P. n. […], il tassametro risultava inefficiente. Guasto e accertamento: […].',
    'G28-01':'Alla guida del veicolo indicato, con C.P. n. […], dopo la corsa ordinaria a tassametro non rilasciava la ricevuta richiesta dall’utente […]. Riscontro: […].',
    'G28-02':'Alla guida del veicolo indicato, con C.P. n. […], accettava la corsa a tariffa predeterminata […] richiesta dall’utente all’inizio, ma non consegnava prima della partenza la ricevuta. Riscontro: […].',
    'G28-04':'Alla guida del veicolo indicato, con C.P. n. […], rilasciava per la corsa […] una ricevuta del modello comunale non compilata nei dati pertinenti […], come riscontrato mediante […].',
    G30:'Durante il servizio con il veicolo indicato, con C.P. n. […], non forniva all’utente i chiarimenti richiesti sul prezzo. Domanda, risposta e riscontro: […].',
    G31:'Durante il servizio con il veicolo indicato, con C.P. n. […], indossava abbigliamento inidoneo: […]. Prescrizione e riscontro: […].',
    G32:'Per la licenza C.P. n. […], il soggetto obbligato […] non comunicava all’ufficio il provvedimento […] notificato il […] entro le successive ventiquattro ore lavorative. Protocollo e riscontro: […].',
    G33:'Dopo l’avaria del tassametro durante la corsa, con il veicolo indicato, con C.P. n. […], proseguiva senza informare subito l’utente del guasto […], come risultava da […].',
    G35:'Dopo il rinvenimento dell’oggetto […] sul veicolo indicato, con C.P. n. […], non lo restituiva al proprietario identificato […], pur essendo possibile […]. Riscontro: […].',
    G37:'Durante la corsa richiesta da […], con il veicolo indicato, con C.P. n. […], faceva salire la persona estranea […] senza il consenso del richiedente, come risultava da […].',
    G38:'Durante il servizio con il veicolo indicato, con C.P. n. […], teneva a bordo l’animale […] appartenente al conducente, come accertato mediante […].',
    G39:'Con il veicolo indicato, con C.P. n. […], interrompeva di propria iniziativa la corsa […] contro la volontà dell’utente. Luogo, motivo addotto e riscontro: […].',
    G40:'Con il veicolo indicato, con C.P. n. […], rifiutava il trasporto del bagaglio […] compatibile con la capienza utile, come riscontrato mediante […].',
    G41:'Con il veicolo indicato, con C.P. n. […], rifiutava all’utente il trasporto dell’ausilio per la mobilità […], adducendo […]. Riscontro: […].',
    G42:'Durante la sosta nel parcheggio autorizzato […], presso il veicolo indicato, con C.P. n. […], provocava schiamazzi: […]. Fatto osservato da […].',
    G44:'Il titolare […] della licenza C.P. n. […] consentiva la conduzione in servizio del veicolo indicato a […], privo del requisito […] verificato presso […]. Consenso o condotta personalmente imputabile al titolare: […].',
    G45:'Durante la corsa sul veicolo indicato, con C.P. n. […], il conducente fumava […], come osservato dagli operanti […].',
    G53:'Per la corsa […], sul veicolo indicato, con C.P. n. […], rifiutava il pagamento elettronico di € […] richiesto dall’utente mediante […]. Circostanze del rifiuto e riscontri: […]. Sanzione: € 30 + 4% di € […] = € […].',
    G54:'Con il veicolo indicato, con C.P. n. […], conduceva terze persone nella corsa […] senza iscrizione al ruolo conducenti richiesto. La CCIAA […] attestava l’assenza dell’iscrizione con risposta […] del […].',
    I06:'Il veicolo indicato effettuava il trasferimento degli ospiti […] da […] a […] per la struttura ricettiva […]. Collegamento al soggiorno, organizzazione e corrispettivo diretto o indiretto risultavano da […].',
    R02:'Durante il servizio con il veicolo indicato, con C.P. n. […], il titolo esibito non recava allegato l’elenco prescritto di collaboratori o sostituti […], come riscontrato mediante […].',
    R03:'Il titolare […] della licenza C.P. n. […] impiegava il collaboratore o sostituto […] dal […] senza comunicarne i dati al Comune. Obbligo, protocollo e riscontro: […].',
    R05:'Il titolare […] della licenza C.P. n. […] non iniziava il servizio entro sessanta giorni dalla notifica del titolo del […]. Scadenza, eventuale proroga e riscontro: […].',
    R06:'Dopo la sostituzione del veicolo indicato, con C.P. n. […], il titolare […] non iniziava il servizio entro dieci giorni dall’immatricolazione del […]. Giustificazioni e riscontro: […].',
    R09:'Il veicolo indicato, con C.P. n. […], impiegato nel servizio presentava un bagagliaio non idoneo alle dotazioni richieste. Difformità e riscontro: […].',
    R10:'Il veicolo indicato, con C.P. n. […], impiegato nel servizio aveva […] posti omologati per i soli passeggeri, escluso il conducente, fuori dal limite regolamentare da quattro a otto. Documento e riscontro: […].',
    R12:'Sul veicolo indicato, con C.P. n. […], esponeva la pubblicità […] senza l’autorizzazione comunale richiesta, secondo il riscontro […].',
    R22:'Il titolare […] della licenza C.P. n. […] sospendeva il servizio dal […] senza comunicarlo al Comune entro cinque giorni. Protocollo e riscontro: […].',
    R23:'Il titolare […] della licenza C.P. n. […] ometteva di comunicare entro cinque giorni al Comune il cambio di domicilio del […]. Nuovo domicilio e fonte documentale: […].',
    R24:'Nell’area […] gestita da […], con il veicolo indicato, con C.P. n. […], inosservava la prescrizione […] applicabile al servizio in forza dell’atto […]. Fatto e riscontro: […].',
    R25:'Durante il servizio con il veicolo indicato, con C.P. n. […], chiedeva € […] per l’ausilio di mobilità […] dell’utente. Richiesta e riscontro: […].',
    R27:'Interrotta la corsa […] per avaria o forza maggiore, con il veicolo indicato, con C.P. n. […], addebitava € […] per la tratta […] non effettuata. Prezzo, percorso e riscontro: […].',
    R30:'Per il titolare […] della licenza C.P. n. […] non risultava più presente il requisito […]. Fonte, decorrenza e accertamento: […].',
    R35:'Sul veicolo indicato, con C.P. n. […], l’utente […] fumava durante la corsa. Fatto e fonte dell’accertamento: […].',
    R37:'Sul veicolo indicato, con C.P. n. […], l’utente […] pretendeva il trasporto dell’animale […] senza le cautele […] concordate con il tassista per evitare danni o imbrattamento. Fatto e riscontro: […].',
    R38:'Sul veicolo indicato, con C.P. n. […], l’utente […] pretendeva il trasporto di cose o animali in condizioni non sicure. Richiesta, rischio e riscontro: […].'
  };
  const alternatives={
    R13:[['Licenza sostituita','Sul taxi di scorta indicato, assegnato al C.P. n. […], non teneva a bordo la licenza sostituita […], richiesta dagli operanti e non esibita secondo […].'],['Altro documento','Sul taxi di scorta indicato, assegnato al C.P. n. […], mancava il documento […] prescritto da […], come accertato mediante […].']],
    R14:[['Ordine delle richieste','Il concessionario […] assegnava l’auto di scorta indicata al C.P. n. […] fuori dall’ordine delle richieste […] risultante dal registro […].'],['Altra irregolarità','Il concessionario […] assegnava l’auto di scorta indicata al C.P. n. […] con l’irregolarità procedurale […] prevista da […], secondo […].']],
    R26:[['Importo non mostrato','A fine corsa, sul veicolo indicato con C.P. n. […], non mostrava all’utente l’importo dovuto, come accertato mediante […].']],
    G27:[['Contachilometri','Durante il servizio sul veicolo indicato, con C.P. n. […], il contachilometri risultava inefficiente. Guasto e accertamento: […].']],
    G33:[['Prosecuzione senza richiesta','Dopo l’avaria del tassametro durante la corsa, con il veicolo indicato, con C.P. n. […], proseguiva senza espressa richiesta dell’utente, secondo il riscontro […].']],
    G35:[['Deposito omesso','Dopo il rinvenimento dell’oggetto […] sul veicolo indicato, con C.P. n. […], non lo depositava presso l’ufficio comunale entro ventiquattro ore. Data, termine e riscontro: […].']],
    G41:[['Cane guida','Con il veicolo indicato, con C.P. n. […], rifiutava all’utente l’accesso con il cane guida […], adducendo […]. Riscontro: […].']],
    G42:[['Consumo di cibo','Durante la sosta nel parcheggio autorizzato […], presso il veicolo indicato, con C.P. n. […], consumava […], come osservato da […].']],
    G45:[['Fumo consentito all’utente','Durante la corsa sul veicolo indicato, con C.P. n. […], il conducente consentiva all’utente […] di fumare […]. Condotta propria del conducente e riscontro: […].']],
    R25:[['Cane guida','Durante il servizio con il veicolo indicato, con C.P. n. […], aggiungeva € […] al prezzo della corsa per il cane guida […]. Richiesta e riscontro: […].']],
    R27:[['Supplemento dopo interruzione','Interrotta la corsa […] per avaria o forza maggiore, con il veicolo indicato, con C.P. n. […], richiedeva il supplemento […] nonostante l’impossibilità del servizio sostitutivo. Riscontro: […].']],
    R35:[['Consumo di cibo','Sul veicolo indicato, con C.P. n. […], l’utente […] consumava […] durante la corsa. Fatto e fonte dell’accertamento: […].']]
  };
  const obligation={G20:'23 c. 1 let. c',G21:'23 c. 1 let. d',G25:'23 c. 1 let. h',G27:'23 c. 1 let. l',G28:'23 c. 1 let. n','G28-01':'23 c. 1 let. n',G30:'23 c. 1 let. q',G31:'23 c. 1 let. r',G32:'23 c. 1 let. s',G33:'23 c. 1 let. t',G35:'23 c. 1 let. j',G37:'23 c. 2 let. b',G38:'23 c. 2 let. c',G39:'23 c. 2 let. d',G40:'23 c. 2 let. f',G41:'23 c. 2 let. g',G42:'23 c. 2 let. i',G45:'23 c. 2 let. j',R09:'17 c. 1 let. f',R10:'17 c. 1 let. g',R12:'17 c. 1 let. j',R25:'23 c. 2 let. g',R27:'24',R35:'23 c. 6 let. a',R37:'23 c. 6 let. c',R38:'23 c. 6 let. d'};
  const municipal=new Set(['R14','R15','G10','G11','G13','G14','G32','G44','R02','R03','R04','R05','R06','R22','R23','R30']);
  const relations=new Set(['G28-02','G28-04','R24','R30','I06','I04','I05','N11']);
  const userCodes=['R35','R37','R38'];
  const toNCC=s=>s.replace(/la licenza C\.P\./g,'l’autorizzazione NCC').replace(/La licenza C\.P\./g,'L’autorizzazione NCC').replace(/della licenza C\.P\./g,'dell’autorizzazione NCC').replace(/C\.P\./g,'autorizzazione NCC').replace(/adibito a taxi/g,'adibito a NCC').replace(/taxi indicato/g,'veicolo NCC indicato');
  const particular={
    R11:['Art.17 c.1 let. h: veicoli immatricolati dal 01/01/1992; identificare il dispositivo previsto dal decreto tecnico applicabile. Accertare guida, specifica prescrizione del titolo ed efficacia; distinguere un eventuale illecito tecnico CdS con elementi autonomi.'],
    R13:['Art.180 c.3 riguarda licenza e autorizzazione; per un diverso documento identificare la disposizione propria. La sola mancata esibizione non dimostra l’assenza del titolo.'],
    R14:['Responsabile: concessionario per l’assegnazione. L’art.86 c.3-bis colpisce chi guida il taxi: non fonda la sanzione al concessionario per la sola procedura. Regime comunale TUEL, senza ritiro automatico. Art.18 c.8 let. c: decadenza della licenza di scorta per inosservanza dell’ordine, da accertare e disporre dall’ufficio.'],
    R15:['Responsabile: concessionario. La sola concessione non è guida di taxi ex art.86 c.3-bis; l’eventuale condotta del conducente richiede un accertamento distinto. Art.18 c.8 let. d: decadenza per violazione dei divieti del c.6, riservata all’ufficio.'],
    R19:['Distinguere rimozione del sigillo e alterazione dello strumento: non presumere entrambe. Documentare chi compie o utilizza la condotta e la specifica condizione del titolo.'],
    R20:['Identificare officina, tipo di intervento e mancanza dell’autorizzazione. La sola attività dell’officina non equivale a guida del taxi: importi residuali solo per il distinto impiego personalmente imputabile.'],
    R21:['Indicare l’evento che rende dovute verifica e risigillatura e il controllo d’ufficio. Non dedurre automaticamente una manomissione.'],
    R26:['Selezionare la sola omissione accertata. Se ricorrono entrambe, descriverle nel campo del fatto dopo verifica; nessun doppio verbale automatico.'],
    R28:['L’uso proprio fuori servizio è consentito dall’art.14 c.6 D.Lgs.422/1997. Il fatto riguarda l’insegna non occultata, non il mero uso privato; verificare guida e prescrizione della licenza applicabile.'],
    G10:['Uso assicurativo non conforme e assenza della copertura RCA sono fatti distinti. Acquisire clausole e risposta dell’assicuratore; art.144 D.Lgs.209/2005 distingue opponibilità al danneggiato e rivalsa. Non applicare automaticamente art.193 CdS o ritiro della licenza.'],
    G11:['Termine di cinque giorni ex art.5 c.7; distinguere conferimento e recesso/decadenza e individuare titolare, cooperativa o consorzio obbligato. Non sanzionare il titolare con art.86 per una mera omissione senza guida.'],
    G12:['Art.86 c.2 richiede effettivo servizio taxi senza licenza, con licenza sospesa o revocata; NCC: art.85 c.4. Un generico provvedimento inosservato non basta. Selezionare lo stato accertato; per la relazione generica non è preimpostata una sanzione.'],
    G13:['Validità quinquennale ex art.16 c.1; verificare rinnovi, vidimazioni e disposizioni applicabili. Gruppo B: l’art.29 c.4 non dispone il ritiro immediato per questa sola omissione.'],
    G14:['Distinguere visita tecnica comunale, termine effettivamente dovuto e revisione CdS art.80. La sola omissione non fonda il ritiro della licenza; eventuali provvedimenti spettano all’ufficio.'],
    G19:['Art.180 c.3 contempla il titolo di autorizzazione o licenza, non ogni documento: i documenti di circolazione sono nel comma 1, CAP/CQC nel comma 5. Non estendere automaticamente la tabella a documenti diversi.', 'Invito ex art.180 c.8 solo se esistenza e validità non sono verificabili tramite banche dati pubbliche accessibili, salvo impossibilità tecnica all’accertamento. Precisare documento, ufficio e termine; sanzione per inottemperanza solo senza giustificato motivo. L’attestazione entra nella copia solo se l’invito è realmente impartito.'],
    G27:['Per NCC verificare il contachilometri; non trasferire l’obbligo del tassametro taxi. Distinguere inefficienza e manomissione, che richiede la propria prova.'],
    'G28-02':['La pagina ufficiale comunale conferma la ricevuta prima della partenza per la tariffa predeterminata; D.D.72/2012 e135/2010 integrali non acquisite. Art.23 c.1 let. n riguarda il documento su richiesta. Art.86 c.3-bis richiede la precisa condizione efficace della licenza: tabella non attivata per sola analogia.'],
    'G28-04':['Individuare i campi obbligatori pertinenti al servizio e la fonte che li prescrive; non imporre cumulativamente dati di tariffa ordinaria e predeterminata. Integrali D.D.72/2012 e135/2010 non acquisiti: resta relazione, con art.86 c.3-bis solo dopo qualificazione della condizione della licenza.'],
    G30:['Descrivere la richiesta concreta e la risposta. Per NCC il prezzo è concordato: non applicare tassametro o tariffario taxi.'],
    G32:['Termine: ventiquattro ore lavorative dalla notifica. Responsabile è il soggetto tenuto alla comunicazione, non automaticamente il conducente identificato al controllo.'],
    G33:['Selezionare mancata informazione o assenza di richiesta espressa. NCC: nessun obbligo di tassametro dedotto dal rinvio comunale; la variante resta solo relazione su una concreta prescrizione applicabile.'],
    G35:['Restituzione al proprietario oppure deposito entro ventiquattro ore presso l’ufficio comunale competente: descrivere l’omissione effettiva e la data del rinvenimento.'],
    G37:['Escludere consenso del richiedente e disciplina specifica del taxi collettivo. Per NCC verificare prenotazione e gruppo degli utenti; non dedurre un illecito dalla sola presenza di più passeggeri.'],
    G39:['Escludere richiesta dei passeggeri, forza maggiore e evidente pericolo. Descrivere motivo addotto e riscontri.'],
    G41:['Per gli NCC il rinvio dell’art.23 c.3 include la let. g del comma 2. Distinguere il rifiuto dal supplemento R25, senza cumulo automatico per lo stesso fatto.'],
    G42:['Il rinvio NCC riguarda parcheggi in cui la sosta NCC è consentita: non autorizza l’uso dei posteggi taxi. Scegliere schiamazzi oppure cibo secondo il fatto accertato.'],
    G44:['Contestare o notificare al titolare autore del consenso, identificando il conducente in “altri soggetti”; provare la responsabilità personale, distinta dalla sola titolarità. Per NCC distinguere dipendente, familiare e sostituzione ammessa da L.21/1992 art.10 c.2-bis; non estendere l’art.7 comunale riservato ai taxi.', 'Verificare titolo, comunicazioni e regime vigente anche quando il documento di sostituzione appare scaduto. Non è acquisita una base per il ritiro automatico del permesso di sostituzione. Resta distinto il ritiro del titolo comunale ex art.29 c.4, gruppo C, se ricorre la violazione accertata.'],
    G45:['Distinguere fumo del conducente e consenso al fumo dell’utente. Un fatto dell’utente non prova automaticamente una condotta del conducente; verificare la disciplina speciale antifumo, senza cumulo automatico.'],
    G53:['Sanzione € 30 più 4% del valore della transazione rifiutata; usare la calcolatrice e completare la formula. Nessun PMR ex art.16 L.689/1981 e nessuna riduzione del30%. Rapporto al Prefetto del luogo della violazione; il Corso Pubblico non sostituisce tale destinatario.', 'Documentare richiesta, importo, carta o strumento prescritto e rifiuto. Escludere oggettiva impossibilità tecnica: la sola assenza di contanti dell’utente non è il fatto sanzionato.'],
    G54:['Ruolo conducenti per autovetture fino a nove posti compreso il conducente: L.R.10/2024 art.17 cc.3 e6, art.21 cc.1–2; L.21/1992 art.6. Non estendere ai conducenti autobus il ruolo delle autovetture.', 'Assenza dell’iscrizione da attestazione della CCIAA competente, non dalla sola mancata esibizione. L’art.19 c.3 esclude limiti territoriali; la revisione pendente mantiene validità fino alla notifica dell’esito (c.5). PMR € 1.000 entro 60 giorni; comunicazioni a CCIAA, GdF, UMC, Agenzia Entrate, INL e INPS.'],
    I06:['Art.13-bis L.R.10/2024 consente il trasferimento gratuito, accessorio e riservato ai propri ospiti, senza corrispettivo diretto o indiretto, sulle tratte connesse al soggiorno. Le agenzie usano vettori autorizzati; il pacchetto non deroga ai titoli.', 'Il solo trasferimento non gratuito non dimostra automaticamente tutti i presupposti dell’art.85 c.4: verificare attività professionale NCC, uso del veicolo e assenza del titolo. Selezionare relazione o ipotesi abusiva verificata; evitare duplicazione con I02 per il medesimo fatto.'],
    R02:['Distinguere elenco prescritto, effettiva allegazione ed esistenza della comunicazione; la mancanza dell’allegato non dimostra una persona priva dei requisiti.'],
    R03:['Contestare al titolare per l’omissione personalmente imputabile; conducente in “altri soggetti”. Non aggiungere automaticamente ritiro o art.86/85 alla sola mancata comunicazione.', 'Per taxi coordinare art.7 comunale con L.R.10/2024 art.11 c.5: comunicazione e perfezionamento entro 24 ore, anziché riproporre automaticamente il precedente termine locale di 48 ore. Per NCC verificare art.6 e tipologia del rapporto.'],
    R05:['Sessanta giorni dalla notifica; proroga motivata fino ad altri sessanta giorni nei casi regolamentari. La decadenza ex art.32 è riservata all’ufficio; l’omesso avvio non equivale a guida taxi o utilizzo NCC ex CdS.'],
    R06:['Dieci giorni dall’immatricolazione, salvo giustificazione. Il comma 4 menziona la licenza: per NCC il termine non va esteso senza la specifica disposizione o condizione dell’autorizzazione applicabile; variante NCC per relazione.'],
    R09:['Art.17 c.2 rinvia per NCC anche alla let. f del comma 1. Descrivere volume, dotazioni e concreta inidoneità; nessun ritiro del titolo imposto dalla sola difformità.'],
    R10:['Quattro–otto posti per passeggeri, conducente escluso; rinvio NCC art.17 c.2 alla let. g. È requisito di omologazione, distinto dal numero di persone effettivamente trasportate ex art.169 CdS. Nessun ritiro automatico.'],
    R12:['Per NCC l’art.17 c.2 rinvia alla let. j del comma 1. Distinguere autorizzazione comunale e presupposti dell’eventuale specifico art.23 CdS; nessun cumulo automatico.'],
    R22:['Art.23 c.4: cinque giorni. L’art.7 c.5 riguarda la sostituzione taxi e non va trasferito automaticamente agli NCC. La comunicazione omessa non comporta automaticamente ritiro o decadenza.'],
    R23:['Termine di cinque giorni. Acquisire documento recente con nuovo domicilio, data dell’evento e protocollo comunale; l’istruzione documentale resta fuori dalla copia.'],
    R24:['Acquisire atto del gestore, ambito, efficacia e prescrizione concretamente violata. Art.23 c.5 non introduce una sanzione CdS indistinta per ogni area: resta relazione se manca la precisa base. art.21 c.3 L.R.10/2024 sul servizio taxi di piazza non si trasferisce agli NCC.'],
    R25:['Il divieto di supplemento per ausili e cani guida si applica anche agli NCC per il rinvio art.23 c.3 alla let. g del comma 2. Non equivale all’applicazione del tariffario taxi agli NCC.'],
    R27:['Art.24: senza servizio sostitutivo, solo percorso effettuato e nessun supplemento. NCC: documentare prezzo contrattuale e quota riferibile alla prestazione; la let. e dell’art.23 c.2 sui compensi del tassametro non è richiamata dal c.3.'],
    R30:['Indicare requisito, fonte, decorrenza e titolo interessato. Art.30 riguarda la perdita del requisito dell’art.5 c.1 let. a; art.31 c.1 let. a ha presupposti propri. Sospensione e revoca competono all’ufficio: nessun ritiro automatico o applicazione di art.86 per la sola perdita del requisito.'],
    R35:['Responsabile è l’utente; l’art.86 c.3-bis non sanziona la sua condotta. Art.23 c.6 riguarda espressamente il taxi: nessuna estensione automatica agli NCC. Distinguere cibo e fumo e verificare la disciplina speciale antifumo prima della contestazione.'],
    R37:['Responsabile è l’utente; l’art.23 c.6 riguarda espressamente il taxi. Nessun art.86/85 o responsabilità del conducente per il solo comportamento dell’utente; per NCC resta relazione senza estensione del divieto locale.'],
    R38:['Responsabile è l’utente. Nel testo comunale le let. c e d sono tipograficamente spezzate: descrivere la richiesta concreta e la norma di sicurezza pertinente. Nessun addebito automatico al conducente; per NCC resta relazione, poiché l’art.23 c.6 riguarda il taxi.']
  };
  function definition(item,type){
    const ncc=type==='NCC',code=item.code,base=item.demoBaseCode||code;
    if(!ncc&&!Object.hasOwn(facts,code)&&code!=='I09')return null;
    if(removed.includes(code))return null;
    const old=w.prontuarioCatalogModel(item,type);
    let formula=facts[code]||old.lead.replace(/\s*In particolare:.*$/,'').replace(/:$/,'')+' Fatto e riscontro: […].';
    let ref=normalize(item.ref||item.verbaleRef),category=municipal.has(code)?'tuel':relations.has(code)||item.referenceOnly?'relation':w.prontuarioIsResidual(item)?'residual':'existing';
    if(code==='R30')category='relation';
    let notes=[...(particular[code]||[])],options=(alternatives[code]||[]).map(([label,text])=>({label,text}));
    if(['R11','R19','R20','R21','R26','R28'].includes(code))category='residual';
    let responsibility=userCodes.includes(code)?'Utente autore del fatto; identificare la persona e la fonte. Nessuna responsabilità automatica del conducente.':municipal.has(code)?'Individuare l’autore personalmente responsabile e l’eventuale obbligato in solido secondo artt.3 e6 L.689/1981. La titolarità da sola non prova l’omissione.':item.responsibility||'Identificare autore della condotta e soggetto obbligato; documentare la responsabilità personale.';
    if(obligation[code])ref=regulation+'art. '+obligation[code]+(ncc&&(/^G/.test(code)||code==='R25')&&!userCodes.includes(code)?'; art. 23 c. 3':ncc&&['R09','R10','R12'].includes(code)?'; art. 17 c. 2':'');
    if(code==='R27'&&!ncc)ref+='; art. 23 c. 2 let. e';
    if(ncc){formula=toNCC(formula);options=options.map(o=>({...o,text:toNCC(o.text)}));}
    if(code==='R13'||code==='G19'){
      category='document';ref='CdS art.180 cc.3 e7';
      if(code==='R13')ref+='; '+regulation+'art.18 c.3';
      if(code==='R13')options=options.map((o,i)=>i===1?{...o,category:'relation'}:o);
      if(code==='G19'&&ncc)formula='Conducente del veicolo indicato, adibito a NCC con autorizzazione n. […], non portava con sé l’autorizzazione prescritta […], richiesta dagli operanti e non disponibile secondo […].';
    }
    if(code==='G10')ref=regulation+'art.5 c.3 let. g; D.Lgs.209/2005 art.144';
    if(code==='R22')ref=regulation+'art.23 c.4'+(ncc?'':'; art.7 c.5');
    if(code==='G53'){category='pos';ref='D.L.179/2012 art.15 cc.4 e4-bis; L.689/1981 (art.16 escluso)';}
    if(code==='R35')notes.push('Per il fumo riscontrare la specifica disciplina speciale applicabile (L.3/2003 art.51 e L.584/1975 art.7, con aggiornamenti), anche presenza di minori o gestanti. La presente formula resta relazione per questa qualificazione; il consumo di cibo nel taxi ha il distinto regime comunale.');
    if(code==='G54'){category='role';ref='L.21/1992 art.6; L.R.10/2024 art.17 cc.3 e6, art.19 cc.3 e5, art.21 cc.1 e2; L.689/1981 art.16';}
    if(code==='G44'){
      ref='L.21/1992 art.10'+(ncc?' c.2-bis':'')+'; '+regulation+'art.6'+(ncc?'':'; art.7')+'; art.23 c.2 let. k'+(ncc?' e c.3':'')+'; art.29 c.2 let. c e c.4';
      if(!ncc)options=[{label:'Sostituzione alla guida scaduta — assenza di titolo efficace verificata',text:'Il titolare […] della licenza C.P. n. […] consentiva la conduzione in servizio al sostituto […] oltre il periodo autorizzato, scaduto il […]. Assenza di proroghe o comunicazioni efficaci e condotta del titolare risultavano da […].'}];
    }
    if(userCodes.includes(code))category='relation';
    if(!ncc&&['R37','R38'].includes(code))category='tuel';
    if(!ncc&&code==='R35')options=options.map(o=>({...o,category:'tuel'}));
    if(code==='R14')ref=regulation+'art.18 c.4 e c.8 let. c';
    if(code==='R15')ref=regulation+'art.18 c.6 e c.8 let. d';
    if(code==='R20'){
      category='relation';ref='CdS art.86 c.3-bis (per la guida con specifica condizione violata); '+regulation+'art.22 cc.4 e5';
      options=[{label:'Guida in servizio e condizione del titolo verificate',text:'Durante il servizio guidava il taxi indicato, con C.P. n. […], il cui tassametro era stato sottoposto all’intervento […] dall’officina […] non autorizzata. Condizione della licenza, intervento e riscontri: […].',category:'residual'}];
    }
    if(code==='G12'){
      category='relation';ref=(ncc?'CdS art.85 c.4':'CdS art.86 c.2')+' (solo servizio senza titolo efficace); provvedimento specifico';
      options=['sospesa','revocata'].map(state=>({label:'Servizio con '+(ncc?'autorizzazione ':'licenza ')+state+' — stato verificato',text:ncc?'Adibiva l’autovettura indicata a servizio NCC con autorizzazione n. […] '+state+' dal provvedimento […] notificato il […] ed efficace al momento del fatto. Servizio e riscontri: […].':'Svolgeva servizio taxi con il veicolo indicato e licenza C.P. n. […] '+state+' dal provvedimento […] notificato il […] ed efficace al momento del fatto. Servizio e riscontri: […].',category:'severe'}));
      notes.push('Prima di usare la tabella ordinaria verificare i precedenti: seconda violazione della stessa persona nel triennio, G02 per taxi o N03 per autovettura NCC; revoca riservata al Prefetto. Un riscontro pendente non prova la prima violazione.');
    }
    if(code==='I06'){
      ref='CdS art.85 c.4 (se NCC senza titolo); L.21/1992 artt.3 e8; L.R.10/2024 art.13-bis, introdotto da L.R.7/2026';
      options=[{label:'Autovettura NCC abusiva — presupposti verificati',text:'Adibiva l’autovettura indicata a servizio professionale NCC per il trasferimento di ospiti della struttura […], dietro corrispettivo […], senza autorizzazione efficace, secondo il riscontro dell’ufficio […]. Modalità, uso del veicolo e fonti: […].',category:'severe'}];
      notes.push('Identificare categoria e uso del veicolo; per gli autobus verificare il titolo specifico e le distinte fasce N01/N12, senza trasferire la tabella dell’autovettura.');
      notes.push('Tabella ordinaria: verificare i precedenti della stessa persona nel triennio; per la seconda violazione dell’autovettura NCC usare N03, senza duplicare il fatto.');
    }
    if(ncc&&code==='G27'){formula='Durante il servizio sul veicolo indicato, con autorizzazione NCC n. […], il contachilometri risultava inefficiente. Guasto e accertamento: […].';options=[];}
    if(ncc&&code==='G28')formula='Dopo la corsa […] con il veicolo indicato e autorizzazione NCC n. […], non rilasciava il documento della corsa richiesto dall’utente […]. Richiesta e riscontro: […].';
    if(ncc&&code==='G33'){category='relation';formula='Durante il servizio NCC […] con autorizzazione n. […], il dispositivo […] presentava il guasto […]. Prescrizione effettivamente applicabile, condotta e fonte: […].';options=[];}
    if(ncc&&code==='R06')category='relation';
    if(ncc&&code==='R04'){category='tuel';formula='Il titolare dell’autorizzazione NCC n. […] impiegava il dipendente […] dal […] senza comunicare l’assunzione o produrre il documento […] prescritto. Obbligo e protocollo: […].';notes.push('Art.6 c.5: obbligo del titolare NCC per il dipendente. Non confondere con sostituzione taxi o con prova dell’impiego autobus ex L.218/2003.');}
    if(ncc&&code==='R32'){category='residual';formula='Durante il servizio NCC con il veicolo indicato e autorizzazione n. […], mancava il contrassegno nazionale […] oppure la targa posteriore […], secondo il fatto e il riscontro […].';options=[{label:'Targa posteriore',text:'Durante il servizio NCC con il veicolo indicato e autorizzazione n. […], mancava la targa posteriore prescritta, come riscontrato mediante […].'}];formula='Durante il servizio NCC con il veicolo indicato e autorizzazione n. […], mancava il contrassegno nazionale sul parabrezza o sul lunotto […], come riscontrato mediante […].';notes.push('Art.12 c.5 L.21/1992: contrassegni «noleggio» su parabrezza e lunotto e targa posteriore inamovibile con NCC, Comune e numero. I05 riguarda il diverso contrassegno regionale, che non sostituisce quelli nazionali.');}
    if(ncc&&code==='I04'){category='relation';ref='CdS art.85 c.4-bis (se servizio in violazione degli artt.3 e11); L.21/1992 artt.3 e11; L.R.10/2024 art.4 c.3';formula='La rimessa dichiarata per l’autorizzazione NCC n. […] non risultava effettiva secondo il sopralluogo […] e il titolo di disponibilità […]. Servizio osservato e riscontri: […].';notes.push('Sede operativa e almeno una rimessa fisica nel Comune autorizzante; ulteriori rimesse nella stessa Provincia o Città metropolitana previa comunicazione. Sede virtuale non sufficiente. La sola carenza amministrativa non prova un servizio in violazione dell’art.85 c.4-bis: verificare utilizzo e fascia nel quinquennio, v. N04–N07.');}
    if(ncc&&code==='I05'){category='relation';formula='Sul veicolo indicato, con autorizzazione NCC n. […] rilasciata il […], il contrassegno regionale presentava la difformità […]. Termine applicabile, documentazione trasmessa e validazione risultavano da […].';notes.push('L.R.7/2026 efficace dall’11/08/2026: autorizzazioni già in essere, produzione e invio entro 180 giorni (07/02/2027). Al04/11/2026 termine ancora pendente; dopo il termine verificare la prova del tempestivo invio per validazione. Comune: quindici giorni per validare. Per nuovi titoli verificare il regime ordinario; nessuna equiparazione automatica a NCC senza autorizzazione.','Contrassegno15×10 cm verticale, bianco/blu, visibile: stemma e Comune, numero e anno del titolo, targa. Conservati i distinti contrassegni nazionali dell’art.12 c.5 L.21/1992.');}
    if(ncc&&code==='N11'){category='relation';ref='L.21/1992 art.11 c.4; Corte cost.56/2020 e163/2025; annullamento D.I.226/2024; Garante, parere23/09/2026';formula='Durante il servizio NCC con autorizzazione n. […], la prenotazione […] e il foglio di servizio disponibile […] presentavano il fatto […], accertato mediante […]. Prescrizione vigente alla data del fatto e fonte: […].';notes.push('Il Garante23/09/2026 dà conto dell’annullamento integrale del D.I.226/2024 da parte del TAR Lazio e valuta un nuovo schema: il parere non è un decreto efficace. Nuovo atto sostitutivo non acquisito in questa revisione. Resta il dovere di legge, ma modalità e base concreta vanno qualificate prima di contestare.','Non applicare attesa obbligatoria di 20 minuti, uso esclusivo dell’app ministeriale o automatico rientro dopo ogni corsa. Corte56/2020 ha eliminato il rientro generalizzato; Corte163/2025 ha inciso sulle prescrizioni del decreto, anche annullato integralmente dal TAR.');}
    if(ncc&&code==='N09'){category='document';ref='CdS art.180 cc.3 e7; L.218/2003 art.5 c.5; L.R.10/2024 artt.23 e37 c.4';formula='Durante il servizio con l’autobus indicato, il conducente non portava a bordo la copia conforme del titolo NCC […] prescritto ed esistente, come verificato mediante […].';notes.push('In Campania distinguere copia conforme del titolo ancora efficace e ricevuta SCIA con comunicazioni SUAP nel nuovo regime. I vecchi titoli comunali conservano efficacia fino al 31/12/2026: al 04/11/2026 non sono automaticamente scaduti. Mera assenza materiale del titolo: art.180, non assenza dell’autorizzazione ex art.85 c.4.');}
    if(ncc&&code==='N10'){category='document';ref='CdS art.180 c.7 (mera dimenticanza); L.218/2003 art.6 cc.2 e3; L.R.10/2024 art.27 cc.3 e4; L.689/1981 art.16';formula='Alla guida dell’autobus NCC indicato, il conducente […] non portava con sé il documento […] del rapporto di lavoro, esistente secondo […] ma dimenticato, come accertato mediante […].';options=[{label:'Violazione sostanziale dell’impresa',text:'L’impresa […] impiegava sull’autobus NCC indicato il conducente […] senza predisporre la documentazione […] del rapporto prescritta dall’art.6 c.2 L.218/2003. Omissione sostanziale e riscontro: […].',category:'employment'}];notes.push('Mera dimenticanza del conducente: art.27 c.3 regionale rinvia all’art.180 c.7 CdS (€ 42–173; PMR42, entro 5giorni29,40, oltre 60giorni86,50). Violazione sostanziale dell’impresa: € 500–2.000, PMR € 666,67 entro 60 giorni ex art.16 L.689, nessuno sconto 30%. Non cumulare automaticamente le due qualificazioni.','Distinguere dipendente da titolare, socio o collaboratore familiare verificabile tramite registro imprese; CQC persone e patente sono documenti diversi. Autorità che applica la sanzione: comunicazione ex art.8 L.218/2003, con atti a Comune/SUAP competente.');}
    if(ncc&&(['N04','N05','N06','N07'].includes(code)||base==='R33')){
      category='existing';formula='Il titolare […] dell’autorizzazione NCC n. […] utilizzava il veicolo indicato per il servizio […] in violazione della prescrizione […] degli artt.3 o11 L.21/1992. Condotta e riscontro: […].';
      responsibility='Titolare dell’autorizzazione, anche diverso dal conducente: art.85 c.4-bis. Verificare l’intestatario effettivo, anche cooperativa o consorzio in caso di conferimento; il conducente è identificato per gli atti sul veicolo, senza attribuirgli automaticamente la sanzione pecuniaria del titolare.';
      if(base==='R33')formula='Il titolare […] dell’autorizzazione NCC n. […] utilizzava il veicolo indicato, in attesa in […], per acquisire clientela sul posto senza prenotazione, come riscontrato mediante […].';
      const index=code.startsWith('N0')?Number(code.slice(-1))-4:item.staticVariantIndex;
      ref='CdS art.85 c.4-bis let. '+['a','b','c','d'][index]+'; L.21/1992 artt.3 e11'+(base==='R33'?'; '+regulation+'art.4 cc.8 e10':'');
      formula+=' Fascia e precedenti del medesimo veicolo nel quinquennio: […].';
      notes.push('Sanzione pecuniaria al titolare dell’autorizzazione; fascia riferita al medesimo veicolo nel quinquennio, non al semplice numero di controlli. Per il ritiro identificare il conducente e documentare gli atti.','Prenotazioni anche tecnologiche; attesa di cliente già prenotato e spazi NCC autorizzati vanno distinti dall’acquisizione di traffico nei posteggi taxi. Nessun rientro generalizzato dopo ogni corsa (Corte56/2020). L.21/1992 art.11-bis e art.21 c.6 L.R.10/2024 richiedono coordinamento per specialità, senza cumuli automatici. N04–N07 e R33-01–04 non vanno duplicati per lo stesso fatto.');
    }
    if(ncc&&['I02','N01','N02','N03','N12'].includes(code)){
      formula=code==='N12'?'Adibiva l’autobus indicato, immatricolato a uso […], a servizio NCC senza autorizzazione efficace per quel veicolo. Servizio e riscontro dell’autorità: […].':code==='N01'||code==='N02'?'Adibiva l’autobus indicato, immatricolato per NCC, al servizio […] con titolo n. […] sospeso o revocato dal provvedimento […] efficace dal […]. Notifica e riscontro: […].':'Adibiva il veicolo indicato a servizio NCC […] senza autorizzazione efficace per il veicolo, come attestato dall’ufficio […] con risposta […]. Servizio e fonti: […].';
      if(['N01','N02'].includes(code)){formula=formula.replace('sospeso o revocato','sospeso');options=[{label:'Titolo revocato',text:formula.replace('sospeso dal','revocato dal')}];}
      if(['N02','N03'].includes(code)){const prior=' Precedente della stessa persona nel triennio: verbale […] per il fatto del […], come verificato mediante […].';formula+=prior;options=options.map(o=>({...o,text:o.text+prior}));}
      notes.push('Accertare servizio, uso risultante dal documento e stato del titolo presso l’autorità. La sola mancata esibizione non prova assenza, sospensione o revoca. Autobus già immatricolato NCC: € 1.998–7.993; altro uso: € 1.812–7.249.','Confisca: nessun PMR. Prima violazione, sospensione patente4–12 mesi; seconda della stessa persona nel triennio, revoca da disporre dal Prefetto. Sequestro e confisca restano distinti; nessuna revoca già eseguita nella copia.');
    }
    if(ncc&&code==='N08'){category='residual';formula='Utilizzava il veicolo indicato, munito di autorizzazione NCC n. […], in violazione della condizione specifica […] efficace dal […]. Condotta, fonte e riscontro: […].';notes.push('Art.85 c.4-ter riguarda l’utilizzo del veicolo autorizzato fuori dai commi 4 e4-bis. Individuare la condizione dell’autorizzazione e la persona responsabile dell’utilizzo, non la mera qualità di titolare.');}
    if(ncc&&code==='R34'){category='residual';formula='Con il veicolo indicato e autorizzazione NCC n. […], eseguiva la prestazione […] in difformità dai termini della prenotazione […]. Condizione del titolo, difformità e riscontro: […].';notes.push('Il prezzo NCC è liberamente concordato ex L.21/1992 art.13 c.3. Il rinvio comunale al rientro dopo ogni contratto non prevale sulla Corte56/2020; non usarlo per contestare rientri automatici.');}
    if(code==='I09'){category='relation';formula='Il titolare della licenza C.P. n. […] impiegava il sostituto […] dal […] omettendo la comunicazione […] o il perfezionamento entro ventiquattro ore, secondo il protocollo […].';ref='L.21/1992 art.10; '+regulation+'art.7; L.R.10/2024 art.11 c.5';notes=['L.R.10/2024 art.11 c.5: comunicazione immediata e perfezionamento entro 24 ore. Prevale sul precedente termine locale di 48 ore: l’istruzione precedente dell’autore è conservata nello storico, non riproposta come termine vigente.','Distinguere sostituzione e turno aggiuntivo ammesso da L.21/1992 art.10 cc.5-bis e5-quater e art.11 c.6 L.R.10/2024. La rimozione editoriale della scheda sul secondo turno non dichiara inesistente tale facoltà. Nessun ritiro automatico del permesso senza base specifica.'];}
    if(category==='residual'){
      ref=(ncc?'CdS art.85 c.4-ter; ':'CdS art.86 c.3-bis; ')+ref.replace(/^CdS[^;]*;?\s*/,'');
      formula+=ncc?' Utilizzo e specifica condizione dell’autorizzazione risultavano da […].':' Guida e specifica condizione della licenza risultavano da […].';
      notes.push(ncc?'Presupposto CdS: utilizzo del veicolo autorizzato in violazione della specifica condizione […] del titolo […] efficace dal […], fuori dai commi 4 e4-bis; la sola norma comunale non prova questo elemento.':'Presupposto CdS: guida del taxi munito di licenza e violazione della specifica condizione […] del titolo […] efficace dal […], fuori dai commi 2 e3; la sola norma comunale non prova questo elemento.');
    }
    if(category==='tuel'){
      ref=ref.replace(/^CdS[^;]*;?\s*/,'')+'; D.Lgs.267/2000 art.7-bis; L.R.10/2024 art.21 c.5; L.689/1981 art.16';
      notes.push('Regime generale comunale: € 25–500, PMR € 50 entro 60 giorni ex art.16 L.689/1981, salvo diversa delibera di Giunta non acquisita. Art.29 c.3 comunale indica € 50: coordinamento con la successiva L.R.10/2024 art.21 c.5, non minimo edittale di € 50. Nessuno sconto 30% né punti patente.');
    }
    if(ncc&&ref.includes('Regolamento comunale'))notes.push('Ambito: vetture NCC del regolamento, artt.1–2; disciplina autobus distinta.');
    if(ncc&&['I02','N03'].includes(code))formula=formula.replace('Adibiva il veicolo indicato','Adibiva l’autovettura indicata');
    if(ncc&&(['N04','N05','N06','N07','I04','I05'].includes(code)||base==='R33'))notes.push('Ambito L.21/1992: non trasferire automaticamente agli autobus le modalità delle autovetture NCC.');
    const payment=rates[category]||item.payments[0];
    const acts=[];
    if(code==='G19'||code==='R13'||(ncc&&code==='N09'))acts.push({id:'invito',title:'Invito realmente impartito e non escluso dalla verifica in banca dati',text:'L’interessato è invitato a presentarsi entro […] giorni presso […] per esibire […], non verificabile tramite banche dati pubbliche accessibili per […]. L’inottemperanza senza giustificato motivo comporta le conseguenze dell’art.180 c.8 CdS.'});
    if(['c','d'].includes(item.group))acts.push({id:'titolo',title:'Ritiro del titolo comunale materialmente eseguito',text:ncc?'L’autorizzazione NCC è ritirata e sarà trasmessa all’Ufficio Corso Pubblico.':'La licenza è ritirata e sarà trasmessa all’Ufficio Corso Pubblico.'});
    if(ncc&&(['N04','N05','N06','N07'].includes(code)||base==='R33'))acts.push({id:'documento',title:'Ritiro del documento e atti sul veicolo effettivamente eseguiti',text:'Il documento di circolazione è ritirato e sarà trasmesso con copia del verbale all’UMC entro cinque giorni. Permesso di trasferimento, fermo e custodia sono documentati negli atti separati […].'});
    if(ncc&&['I02','N01','N12'].includes(code))acts.push({id:'patente',title:'Ritiro della patente materialmente eseguito',text:'La patente è ritirata e sarà trasmessa alla Prefettura entro cinque giorni.'});
    if(ncc&&['I02','N01','N02','N03','N12'].includes(code))acts.push({id:'sequestro',title:'Sequestro e custodia effettivamente eseguiti',text:'Il veicolo è sequestrato ai fini della confisca con affidamento in custodia, come da separati atti […].'});
    if(['G12','I06'].includes(code)){
      acts.push({id:'patente',category:'severe',title:'Solo nell’ipotesi CdS grave: patente materialmente ritirata',text:'La patente è ritirata e sarà trasmessa alla Prefettura entro cinque giorni.'});
      acts.push({id:'sequestro',category:'severe',title:'Solo nell’ipotesi CdS grave: sequestro e custodia eseguiti',text:'Il veicolo è sequestrato ai fini della confisca con affidamento in custodia, come da separati atti […].'});
    }
    return tree({code,type,title:ncc&&code==='G27'?'Contachilometri NCC inefficiente':ncc&&code==='G33'?'NCC: guasto di un dispositivo — relazione':item.title,formula,options,category,payment,ref,notes,responsibility,acts,close:!['I06','R37','R38','I02','N01','N02','N03','N12'].includes(code),relation:category==='relation',group:item.group});
  }
  const definitions=new Map();
  function get(item,type){const key=item.code+'/'+type;if(!definitions.has(key))definitions.set(key,definition(item,type));return definitions.get(key);}
  w.prontuarioTerzaDefinition=get;
  w.prontuarioTerzaRemoved=removed;
  w.prontuarioTerzaApplies=(item,type)=>!!get(item,type);
  w.prontuarioServiceItem=(item,type)=>{
    if(!item)return item;const model=get(item,type);
    return model?{...item,title:model.title,ref:model.ref,verbaleRef:model.ref,payments:[model.payment],reviewType:type,referenceOnly:model.relation,formula:model.formula,facts:model.formula,notes:model.notes,tip:model.notes[0]||'',responsibility:model.responsibility,documents:'Acquisire titolo, atto e fonte del riscontro pertinenti al fatto.',sources:['REV1814',...(model.ref.includes('Regolamento comunale')?['REG']:[])],sourceIndices:[16]}:tree(item);
  };
  const prevLayout=w.prontuarioStaticLayout;
  w.prontuarioStaticLayout=(catalog,parts,pages)=>{
    const result=prevLayout(catalog,parts,pages);
    for(const section of result.sections)section.rows=section.rows.filter(r=>!removed.includes(r.item.code)).map(r=>({...r,item:w.prontuarioServiceItem(r.item,r.type)}));
    result.rows=result.sections.flatMap(s=>s.rows);return result;
  };
  function selectedModel(item,type,choice=0){const model=get(item,type);if(!model)return null;const option=choice>0?model.options[choice-1]:null;return {...model,...(option?{formula:option.text,category:option.category||model.category,payment:rates[option.category]||model.payment}:{}),relation:(option?.category||model.category)==='relation'};}
  function formula(item,type,choice=0,done=[],verbale=false){const m=selectedModel(item,type,choice);return [m.formula,...m.acts.filter(a=>done.includes(a.id)&&(!a.category||a.category===m.category)).map(a=>a.text),m.close&&(!m.relation||verbale)?close:''].filter(Boolean).join(' ');}
  w.prontuarioTerzaFormula=formula;
  function amounts(model){
    if(model.category==='pos')return '<p>€ 30 + 4% del valore della transazione rifiutata. Usare la calcolatrice in fondo alla scheda. Pagamento in misura ridotta non ammesso (art.16 L.689/1981 escluso).</p>';
    const p=model.payment;
    const table=`<table class="staticAmountsTable amounts"><caption>Importi in euro, spese escluse</caption><thead><tr><th>Limiti</th><th>PMR</th><th>Entro 5 giorni</th><th>Oltre 60 giorni / procedura</th></tr></thead><tbody><tr>${[p[1],p[2],p[3],p[4]].map(x=>`<td>${esc(x)}</td>`).join('')}</tr></tbody></table>`;
    const alternatives=model.options.filter(o=>o.category&&o.category!==model.category).map(o=>{const p=o.category==='employment'?['500–2.000','666,67 entro 60 giorni','Nessuno sconto 30%','Rapporto L.689']:rates[o.category]?.slice(1,5);return `<p>${esc(o.label)}: ${esc(p?.join(' · ')||'Base da qualificare')}.</p>`;}).join('');
    return table+alternatives;
  }
  function follow(item,type,choice=0){
    const m=selectedModel(item,type,choice),base=item.demoBaseCode||item.code;
    const f={cds:'Non previste per questa qualificazione.',operators:'Accertare condotta, soggetto, fonte e presupposti; documentare gli atti effettivi.',report:'Fatti pertinenti sul servizio all’Ufficio Corso Pubblico. Invii ad altre autorità secondo la base specifica.',office:'Diffida, sospensione, decadenza o revoca del titolo comunale spettano all’ufficio, con presupposti propri; non entrano nella formula.',patentPoints:'Non previsti per questa fattispecie.'};
    if(item.group){const groups={a:'Gruppo A: diffida alla prima violazione; sospensione 5/15 giorni nelle fasce successive.',b:'Gruppo B: sospensione 15/30/60 giorni;5punti sul titolo dalle violazioni successive alla prima.',c:'Gruppo C: sospensione 15/30/60 giorni;10punti sul titolo.',d:'Gruppo D: sospensione 30/60 giorni;20/30punti sul titolo.'};f.office+=' '+(groups[item.group]||'')+' Art.28–29: punti sul titolo comunale distinti dalla patente; fascia e decisione dell’ufficio.';}
    if(m.category==='relation')f.operators='Redigere relazione; prima di contestare qualificare la disposizione e i presupposti indicati nelle note.';
    if(item.code==='G19'||item.code==='R13'||item.code==='N09')f.operators+=' Invito art.180 c.8 soltanto alle condizioni della nota e se effettivamente impartito.';
    if(['c','d'].includes(item.group))f.operators='Accertata la violazione del gruppo '+item.group.toUpperCase()+', ritirare il titolo comunale ex art.29 c.4, distinto dal permesso di sostituzione. Trasmettere all’ufficio comunale; attestazione nella copia soltanto se eseguito.';
    if(['N04','N05','N06','N07'].includes(item.code)||base==='R33'){
      f.cds=w.prontuarioCatalogAccessoryText(item.payments[0][5]);f.operators='Ritirare il documento di circolazione, inviarlo con copia del verbale all’UMC entro cinque giorni; permesso di trasferimento, fermo per la durata della sospensione e custodia con atti separati (artt.214 c.7 e217 CdS).';f.report='UMC per il documento; Comune e CCIAA per il seguito da coordinare ex art.11-bis L.21/1992 e art.21 c.6 L.R.10/2024, senza cumuli automatici.';
    }
    if(['I02','N01','N02','N03','N12'].includes(item.code)||m.category==='severe'){
      const rec=['N02','N03'].includes(item.code);
      f.cds='Confisca del veicolo; '+(rec?'revoca della patente per seconda violazione della stessa persona nel triennio.':'sospensione patente da 4 a12 mesi.');
      f.operators='Sequestro e custodia con atti separati ex art.213 CdS; verbale al Prefetto entro dieci giorni. '+(rec?'Comunicare i presupposti della revoca al Prefetto entro cinque giorni ex art.219, senza attestare una revoca già disposta.':'Ritirare la patente e trasmetterla alla Prefettura entro cinque giorni ex art.218.');f.report='Prefetto competente per sequestro e patente; ufficio titolare del procedimento per i fatti sul servizio.';
    }
    if(item.code==='G53')f.report='Rapporto ex art.17 L.689/1981 al Prefetto del luogo della violazione; distinto invio dei fatti pertinenti al Corso Pubblico.';
    if(item.code==='G54')f.report='Comunicazioni ex art.21 c.2 L.R.10/2024 a CCIAA, Guardia di Finanza, UMC, Agenzia Entrate, INL e INPS.';
    if(item.code==='N10')f.report='Atti a Comune/SUAP competente; autorità che applica la sanzione: segnalazione ex art.8 L.218/2003.';
    return tree(f);
  }
  const prevView=w.prontuarioRevisionView;
  w.prontuarioRevisionView=(item,type)=>{
    const m=get(item,type);if(!m)return tree(prevView(item,type));
    const text=formula(item,type),notes=m.notes.length?m.notes:['Completare fatto e fonte; distinguere osservazione diretta, documenti e dichiarazioni.'];
    return {title:m.title,status:m.relation?'Relazione: qualificare la base indicata nelle note.':'',normative:m.ref,accessories:{cds:follow(item,type).cds},relation:m.relation,parts:[text],formulaMarkup:`<p class="staticFormulaPart" data-copy-text="${esc(text)}">${esc(text)}</p>`,groups:[],notes,pdfNotes:[...notes,...(m.options.length?['Alternative da sostituire alla sola condotta base: '+m.options.map(o=>o.label+': '+o.text).join(' / ')]:[])],amountsMarkup:amounts(m),responsibility:m.responsibility,route:'',acts:m.acts};
  };
  const prevFollow=w.prontuarioFollowup,prevFollowMarkup=w.prontuarioFollowupMarkup;
  w.prontuarioFollowup=(item,a)=>get(item,item.reviewType||'Taxi')?follow(item,item.reviewType||'Taxi'):tree(prevFollow(item,a));
  w.prontuarioFollowupMarkup=(item,a,escape,pdf=false)=>{
    const type=item.reviewType||'Taxi';if(!get(item,type))return normalize(prevFollowMarkup(item,a,escape,pdf));
    const f=follow(item,type);
    return `<table class="staticAccessoryTable"><tbody>${[['Sanzioni accessorie CdS',f.cds],['Adempimenti obbligatori degli operatori',f.operators],['Segnalazioni e destinatari',f.report],['Punti patente',f.patentPoints]].map(([k,v])=>`<tr><th>${escape(k)}</th><td>${escape(v)}</td></tr>`).join('')}</tbody></table><aside class="officeInfo"><b>Provvedimenti dell’ufficio — esclusi dalla copia</b><p>${escape(f.office)}</p></aside>`;
  };
  function body(item,type){
    const m=get(item,type),v=w.prontuarioRevisionView(item,type);
    const choices=m.options.length?`<fieldset data-terza-choices><legend>Condotta effettivamente accertata</legend>${[{label:'Condotta base'},...m.options].map((o,i)=>`<label><input type="radio" name="terza-choice" value="${i}" ${i===0?'checked':''}> ${esc(o.label)}</label>`).join('')}</fieldset>`:'';
    return `<section class="caseBlock staticNormative"><h3>Riferimenti normativi — obblighi e sanzioni</h3><p>${esc(v.normative)}</p>${v.status?`<p class="qualificationWarning">${esc(v.status)}</p>`:''}</section><section class="caseBlock staticAmounts"><h3>Tabella importi</h3><div data-terza-amounts>${v.amountsMarkup}</div></section><section class="caseBlock staticAccessories"><h3>Sanzioni accessorie e adempimenti</h3><div data-terza-follow>${w.prontuarioFollowupMarkup({...item,reviewType:type},v.accessories,esc)}</div></section><section class="caseBlock staticFormula" data-terza-code="${item.code}" data-terza-type="${type}"><h3>${v.relation?'Testo orientativo per la relazione':'Testo orientativo del verbale'}</h3>${choices}<div class="formulaText" id="formulaText">${v.formulaMarkup}</div><button class="small" id="copyFormula">Copia testo orientativo</button>${m.acts.map(a=>`<label class="secondaConfirm"><input type="checkbox" data-terza-act="${a.id}"> ${esc(a.title)}</label>`).join('')}${m.relation&&m.close?'<label class="secondaConfirm"><input type="checkbox" data-terza-verbale> Verbale effettivamente elevato su base verificata: aggiungere invio futuro</label>':''}<h4>Campi essenziali — istruzioni escluse dalla copia</h4><p>Data, ora, luogo, veicolo, soggetto e titolo pertinenti; condotta effettiva e fonte del riscontro. Completare […] senza attestare attività non eseguite.</p></section><section class="caseBlock staticSuggestions"><h3>Suggerimenti e note operative</h3><ul class="operativeNotes">${v.notes.map(n=>`<li>${esc(n)}</li>`).join('')}</ul><h4>Responsabilità</h4><p>${esc(v.responsibility)}</p><details class="caseSource"><summary>Approfondimenti e fonti</summary><p>Verifica al 04/11/2026. Fonti e adattamenti nel RAPPORTO_REVISIONE_1.8.14.md locale.</p><button class="small" onclick="openPDF(16,1)">Sintesi delle fonti e dei limiti — salvabile offline</button>${(item.regPages||[]).map(p=>`<button class="small" onclick="openPDF(0,${p})">Regolamento p.${p}</button>`).join('')}</details></section>`;
  }
  for(const name of ['prontuarioStaticDemoBody','prontuarioCatalogBody']){const prev=w[name];w[name]=(item,type,helpers)=>get(item,type)?body({...item,reviewType:type},type):normalize(prev(item,type,helpers));}
  if(typeof document!=='undefined')document.addEventListener('change',event=>{
    const section=event.target.closest('[data-terza-code]');if(!section)return;
    const type=section.dataset.terzaType,item=STATIC_LAYOUT.rows.find(r=>r.item.code===section.dataset.terzaCode&&r.type===type)?.item;if(!item)return;
    if(event.target.matches('[name="terza-choice"]'))for(const input of section.querySelectorAll('[data-terza-act],[data-terza-verbale]'))input.checked=false;
    const choice=Number(section.querySelector('[name="terza-choice"]:checked')?.value||0),done=[...section.querySelectorAll('[data-terza-act]:checked')].map(i=>i.dataset.terzaAct),verbale=!!section.querySelector('[data-terza-verbale]:checked');
    const text=formula(item,type,choice,done,verbale),p=section.querySelector('.staticFormulaPart');p.textContent=text;p.dataset.copyText=text;
    const container=section.parentElement,m=selectedModel(item,type,choice);
    container.querySelector('[data-terza-amounts]').innerHTML=amounts({...m,options:[]});
    const f=follow(item,type,choice);container.querySelector('[data-terza-follow]').innerHTML=`<table class="staticAccessoryTable"><tbody>${[['Sanzioni accessorie CdS',f.cds],['Adempimenti obbligatori',f.operators],['Destinatari',f.report],['Punti patente',f.patentPoints]].map(([k,v])=>`<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}</tbody></table><aside class="officeInfo">${esc(f.office)}</aside>`;
  });
})();
