// Suggerimenti redazionali accanto ai riscontri delle singole schede.
// Non sono dati di controllo: non vengono selezionati, salvati o copiati.
(function () {
  const evidence = {
    G02:['Titolo del servizio','Risposta dell’ufficio titoli […] del […] prot. […] sulla licenza per il veicolo indicato.','Provvedimento di sospensione o revoca n. […] ed efficacia confermata dall’ufficio […].'],
    G04:['Confronto tariffario','Tariffario comunale vigente esaminato: voce […] e supplemento […].','Ricevuta della corsa […] e calcolo […] confrontati con le voci applicabili.'],
    G05:['Area e deroga','Atto comunale […] che delimita l’area autorizzata; punto di prelievo osservato […].','Risposta dell’ufficio […] del […] prot. […] sull’eventuale deroga efficace.'],
    G06:['Omologazione del tassametro','Targhetta e documento di omologazione del modello […] esaminati.','Risposta dell’ufficio tecnico […] prot. […] sul modello o numero di serie […].'],
    G07:['Leggibilità degli avvisi','Osservazione diretta dalla posizione occupata dall’utente: voce sui supplementi […].','Prospetto comunale esaminato e posizione o copertura degli avvisi descritta in […].'],
    G08:['Calcolo del corrispettivo','Display del tassametro osservato durante la corsa […] e tariffario vigente […].','Prenotazione o ricevuta […] esaminata per la tariffa predeterminata richiesta.'],
    G09:['Posteggio e chiamata','Distanza misurata con […] e taxi o utenti in attesa osservati al posteggio […].','Registro radiotaxi […] esaminato per la chiamata e il punto di prelievo.'],
    G16:['Prescrizione dei segni','Segno distintivo osservato sul veicolo e confrontato con l’art. […] del regolamento.','Atto comunale […] esaminato per forma e posizione del contrassegno.'],
    G17:['Assegnazione e sovrapposizione','Atto di assegnazione dell’auto di scorta n. […] con periodo […].','Servizio del veicolo proprio osservato dalle […] alle […] o documentato da […].'],
    G18:['Allestimento dell’auto di scorta','Dotazione osservata nell’auto di scorta e confrontata con l’atto […].','Scheda di assegnazione o verifica tecnica […] esaminata per l’allestimento.'],
    G22:['Richiesta e posti disponibili','Richiesta e risposta osservate dagli operanti; posti liberi contati […].','Documento di circolazione esaminato per i posti omologati; dichiarazione formalizzata con atto […].'],
    G24:['Allontanamento dal posteggio','Percorso e distanza dal taxi osservati dagli operanti dalle […] alle […].','Turno e disponibilità al posteggio riscontrati dall’atto […] e dall’osservazione […].'],
    G26:['Avaria e sostituzione','Segnalazione del guasto […] e termine risultanti dall’atto […].','Risposta dell’ufficio […] del […] prot. […] sull’assenza della richiesta di sostituzione.'],
    G29:['Guida della città','Richiesta di esibizione e risposta osservate dagli operanti.','Formato ammesso confrontato con l’atto […] e con il documento esibito […].'],
    G34:['Stato libero e segnale','Segnale TAXI osservato spento mentre il taxi era libero dalle […] alle […].','Prescrizione sul servizio notturno esaminata nell’atto […].'],
    G36:['Percorso e viabilità','Tratto percorso osservato dagli operanti e itinerario più breve ricostruito da […].','Richiesta dell’utente formalizzata con atto […] e condizioni di traffico da […].'],
    G43:['Finalità della sosta','Offerta della corsa ai passanti osservata dagli operanti nel periodo […].','Accettazione sul posto della richiesta […] documentata da […].'],
    G46:['Pausa e ordinanza','Turno e obbligo del disco risultanti dall’ordinanza vigente […].','Disco non esposto osservato nel posteggio durante il periodo […].'],
    G47:['Durata della pausa','Primo e secondo rilievo degli operanti alle […] e alle […].','Disco orario esaminato e limite del turno tratto dall’ordinanza […].'],
    G48:['Vetrofonia e cambio turno','Cambio turno osservato dagli operanti; vetrofonia assente o difforme […].','Ordinanza vigente […] esaminata per la vetrofonia prescritta.'],
    G49:['Stallo e stato di servizio','Segnaletica dello stallo e stato fuori servizio osservati durante la sosta […].','Deroga eventualmente efficace verificata nell’atto […] o con risposta dell’ufficio […].'],
    G50:['Durata dell’attesa','Salita del primo passeggero e permanenza nello stallo osservate dalle […] alle […].','Orari di salita e ripartenza documentati dall’atto […] e confrontati con il limite.'],
    G51:['Visibilità dell’avviso','Avviso osservato dalla posizione degli utenti in […].','Posizione e testo prescritti confrontati con l’ordinanza o l’atto […].'],
    G52:['Stalli del taxi collettivo','Stallo di avvio osservato e confrontato con l’ordinanza vigente […].','Assegnazione al servizio collettivo verificata con l’atto […].'],
    I01:['Avvio e tassametro','Prelievo e display inattivo osservati dagli operanti nel tratto […].','Prenotazione […] esaminata per l’eventuale tariffa predeterminata richiesta.'],
    I09:['Comunicazione del sostituto','Ricevuta o protocollo della comunicazione […] esaminato.','Risposta dell’ufficio […] del […] prot. […] sul termine e sugli atti ricevuti.'],
    R01:['Chiamata radiotaxi','Registrazione della chiamata […] esaminata per il punto comunicato.','Punto effettivo di salita osservato dagli operanti o documentato da […].'],
    R07:['Colorazione prescritta','Colore della carrozzeria osservato e confrontato con l’atto […].','Scheda tecnica del veicolo […] esaminata per finitura e colore.'],
    R08:['Contrassegno sul tetto','Tetto e contrassegno osservati direttamente dagli operanti.','Prescrizione applicabile confrontata con l’atto comunale […].'],
    R11:['Dispositivo e immatricolazione','Documento di circolazione esaminato per data e categoria di immatricolazione.','Verifica tecnica del dispositivo […] effettuata da […] con atto […].'],
    R13:['Documenti dell’auto di scorta','Atto di assegnazione […] esaminato per il periodo e il C.P. sostituito.','Richiesta di esibizione e documenti effettivamente presenti a bordo […].'],
    R14:['Registro di assegnazione','Registro delle richieste […] esaminato per ordine e data.','Atto di assegnazione […] confrontato con l’auto e il C.P. […].'],
    R15:['Destinatario della scorta','Atto di concessione […] esaminato per il soggetto destinatario.','Registro delle assegnazioni […] confrontato con i soggetti ammessi dall’atto […].'],
    R16:['Segnalazione del collettivo','Insegna o display osservato sul veicolo durante il servizio […].','Atto […] esaminato per posizione e contenuto della segnalazione.'],
    R17:['Sigillo del tassametro','Sigillo e punto di applicazione osservati dagli operanti.','Ultima verifica o risigillatura documentata dal registro […].'],
    R18:['Posti offerti agli utenti','Documento di circolazione esaminato per il numero di posti omologati.','Posti realmente disponibili osservati nell’abitacolo durante il servizio […].'],
    R19:['Rimozione del sigillo','Intervento sul tassametro documentato dall’atto […] del […].','Risposta dell’ufficio […] prot. […] sull’autorizzazione alla rimozione.'],
    R20:['Officina e intervento','Fattura o scheda d’intervento […] esaminata per l’officina e l’operazione.','Risposta dell’ufficio […] prot. […] sull’abilitazione dell’officina.'],
    R21:['Verifica del tassametro','Registro della verifica periodica […] esaminato per la scadenza.','Risposta dell’ufficio tecnico […] prot. […] sull’ultimo controllo.'],
    R26:['Fine corsa e display','Arresto della corsa e display osservati direttamente dagli operanti.','Ricevuta o atto […] esaminato per l’importo finale mostrato.'],
    R28:['Uso privato e segno TAXI','Tragitto privato e contrassegno visibile osservati nel periodo […].','Prescrizione di occultamento tratta dall’atto […].'],
    T01:['Turno del sostituto','Comunicazione o ricevuta […] esaminata per il turno aggiuntivo.','Risposta dell’ufficio […] prot. […] sul turno e sugli atti pervenuti.'],
    G10:['Copertura assicurativa','Polizza n. […] esaminata per uso dichiarato e clausole di copertura.','Risposta dell’assicuratore […] prot. […] riferita all’impiego osservato.'],
    G11:['Evento e comunicazione','Documento […] esaminato per la data dell’evento e il termine.','Risposta dell’ufficio […] prot. […] sugli atti ricevuti dal soggetto obbligato.'],
    G12:['Prescrizione notificata','Atto […] esaminato per contenuto, notifica ed efficacia.','Risposta dell’ufficio […] prot. […] sulla prescrizione vigente al momento del fatto.'],
    G13:['Termine e convocazione','Convocazione […] esaminata per termine ed eventuale proroga.','Risposta dell’ufficio […] prot. […] sull’adempimento richiesto.'],
    G14:['Scadenza del requisito','Documento […] esaminato per scadenza e rinnovo.','Risposta dell’ufficio […] prot. […] sullo stato del requisito.'],
    G15:['Prescrizione applicabile','Atto del titolo […] esaminato per la prescrizione precisa.','Condotta osservata […] confrontata con risposta dell’ufficio […].'],
    G19:['Titolo e sua efficacia','Titolo esaminato: n. […], intestatario […], periodo di efficacia […].','Risposta dell’ufficio rilasciante […] prot. […] sull’efficacia al momento del fatto.'],
    G20:['Fonte del fatto riferito','Osservazione diretta degli operanti limitata a […].','Dichiarazione formalizzata con atto n. […] sul fatto […].'],
    G21:['Ordine e condotta successiva','Ordine […] esaminato per contenuto e destinatario.','Comportamento successivo osservato dagli operanti nel periodo […].'],
    G25:['Condizioni del veicolo','Difetto […] osservato dagli operanti durante il servizio […].','Verifica tecnica […] esaminata per la condizione concreta.'],
    G27:['Guasto durante il servizio','Guasto […] constatato dagli operanti nel periodo […].','Documento d’intervento […] esaminato e uso in servizio osservato […].'],
    G28:['Richiesta e rilascio','Richiesta dell’utente osservata dagli operanti; mancato rilascio rilevato […].','Dichiarazione formalizzata con atto […] e documento […] esaminato.'],
    G30:['Richiesta e risposta','Conversazione osservata direttamente dagli operanti: […].','Dichiarazione formalizzata con atto n. […] sulla richiesta e risposta.'],
    G31:['Prescrizione e condizione','Atto […] esaminato per la prescrizione di servizio.','Condizioni del veicolo o del servizio osservate dagli operanti […].'],
    G32:['Notifica e termine','Prova della notifica […] esaminata per la decorrenza delle 24 ore lavorative.','Risposta dell’ufficio […] prot. […] sulla mancata ricezione dell’atto dovuto.'],
    G33:['Guasto e corrispettivo','Guasto […] e volontà dell’utente osservati dagli operanti […].','Ricevuta […] esaminata per il corrispettivo; dichiarazione formalizzata con atto […].'],
    G35:['Oggetto rinvenuto','Rinvenimento osservato dagli operanti e oggetto identificato […].','Consegna o possibilità di restituzione documentata dall’atto […].'],
    G37:['Richiesta del servizio','Richiesta e risposta osservate direttamente dagli operanti […].','Atto […] esaminato sull’eventuale autorizzazione al servizio collettivo.'],
    G38:['Persona a bordo','Presenza della persona osservata nel tratto […] e rapporto riferito […].','Documento […] esaminato per l’appartenenza al nucleo o l’autorizzazione.'],
    G39:['Volontà e pericolo','Richiesta dell’utente e risposta osservate dagli operanti […].','Condizione di pericolo o forza maggiore documentata da […].'],
    G40:['Richiesta e capienza','Richiesta e risposta osservate dagli operanti; posti liberi contati […].','Documento di circolazione esaminato per i posti omologati.'],
    G41:['Richiesta e motivo','Motivo del rifiuto riferito dal conducente, riportato negli appunti […].','Condizione del veicolo osservata o documentata dall’atto tecnico […].'],
    G42:['Posteggio e accesso','Accesso o occupazione del posteggio osservati dagli operanti […].','Atto […] esaminato per assegnazione e condizioni dello stallo.'],
    G44:['Qualità del conducente','Titolo o incarico […] esaminato per il ruolo del conducente.','Risposta dell’ufficio […] prot. […] su comunicazioni o sostituzioni.'],
    G45:['Fonte della condotta','Condotta osservata direttamente dagli operanti nel periodo […].','Dichiarazione formalizzata con atto […] sul comportamento […].'],
    G53:['Pagamento elettronico','Richiesta dell’utente e rifiuto osservati dagli operanti […].','Terminale o ricevuta […] esaminati per l’eventuale impedimento tecnico.'],
    G54:['Fonte competente','Risposta dell’ufficio […] del […] prot. […] sul presupposto […].','Documento […] esaminato e confermato dalla fonte competente […].'],
    I06:['Trasferimento degli ospiti','Prelievo e partenza osservati dagli operanti; destinazione indicata nella prenotazione […].','Documento di soggiorno o prenotazione […] esaminato per collegamento e corrispettivo.'],
    I08:['Verifica tecnica','Parte […] esaminata dal tecnico […] con atto […].','Uso in servizio osservato dagli operanti e collegato alla difformità […].'],
    R02:['Titolo e prescrizione','Titolo […] esaminato per la clausola applicabile.','Risposta dell’ufficio […] prot. […] sulla prescrizione efficace.'],
    R03:['Persona e qualifica','Documento […] esaminato per il ruolo della persona interessata.','Risposta dell’ufficio […] prot. […] sulla qualifica richiesta.'],
    R05:['Termine e proroga','Atto […] esaminato per scadenza e proroga eventualmente concessa.','Risposta dell’ufficio […] prot. […] sul termine efficace.'],
    R06:['Scadenza e giustificazione','Documento […] esaminato per scadenza e rinnovo.','Giustificazione […] acquisita o risposta dell’ufficio […] prot. […].'],
    R09:['Dimensioni del veicolo','Dimensioni misurate dagli operanti con […] e annotate in […].','Requisito tecnico tratto dal documento o atto […].'],
    R10:['Omologazione del mezzo','Documento di omologazione […] esaminato per il requisito.','Verifica tecnica […] svolta da […] con atto […].'],
    R12:['Esposizione e risposta','Esposizione osservata direttamente dagli operanti dalla posizione […].','Risposta dell’ufficio […] prot. […] sull’atto o termine applicabile.'],
    R22:['Sospensione e termine','Provvedimento […] esaminato per decorrenza e soggetto obbligato.','Risposta dell’ufficio […] prot. […] sull’efficacia della sospensione.'],
    R23:['Evento e comunicazione','Documento […] esaminato per data dell’evento e termine.','Risposta comunale […] prot. […] sulla comunicazione ricevuta.'],
    R24:['Regola del gestore','Atto del gestore […] esaminato per regola e competenza.','Risposta dell’ufficio […] prot. […] sulla base applicabile al caso.'],
    R25:['Supplemento richiesto','Richiesta e causa del supplemento osservate dagli operanti […].','Tariffario […] e ricevuta […] esaminati per la voce applicabile.'],
    R27:['Interruzione della corsa','Tratta effettivamente osservata e causa dell’interruzione […].','Ricevuta […] e tariffario […] esaminati per il calcolo dovuto.'],
    R29:['Documenti ed efficacia','Documenti […] esaminati per intestatario e periodo di efficacia.','Risposta dell’ufficio […] prot. […] sulla base della contestazione.'],
    R30:['Fonte e decorrenza','Atto […] esaminato per notifica e decorrenza.','Risposta dell’ufficio […] prot. […] sulla conseguenza per il titolo.'],
    R31:['Durata del servizio','Periodi […] ricostruiti da registri o atti […].','Autorizzazioni e causa […] verificate con risposta dell’ufficio […].'],
    R35:['Fonte del fatto riferito','Osservazione diretta degli operanti limitata a […].','Dichiarazione formalizzata con atto n. […] sul fatto […].'],
    R36:['Oggetto e traiettoria','Oggetto e traiettoria osservati direttamente dagli operanti […].','Dichiarazione formalizzata con atto […] sulla provenienza dell’oggetto.'],
    R37:['Richiesta e cautele','Richiesta e risposta osservate dagli operanti […].','Documento […] esaminato per cautele applicabili all’animale.'],
    R38:['Condizioni del trasporto','Condizioni delle cose o degli animali osservate dagli operanti […].','Documento tecnico […] esaminato per il rischio concreto.'],
    I02:['Servizio e documento del veicolo','Prelievo e partenza osservati dagli operanti; prenotazione […] esaminata separatamente.','Documento di circolazione esaminato per l’annotazione effettiva dell’uso; risposta dell’ufficio titoli […].'],
    I04:['Rimessa effettiva','Sopralluogo presso la rimessa […] documentato nell’atto […].','Titolo di disponibilità […] esaminato e confrontato con risposta dell’ufficio […].'],
    I05:['Contrassegno NCC','Contrassegno osservato sul veicolo e confrontato con l’atto vigente […].','Ricevuta o domanda […] esaminata per il regime transitorio applicabile.'],
    R04:['Dipendente e comunicazione','Documento del rapporto […] esaminato per qualifica e data di impiego.','Risposta dell’ufficio […] prot. […] sulla comunicazione dovuta.'],
    R32:['Contrassegni NCC','Contrassegno e targa posteriore osservati dagli operanti […].','Prescrizione applicabile confrontata con l’atto […].'],
    R33:['Prenotazione e area','Stazionamento e acquisizione di nuova clientela osservati nel periodo […].','Prenotazione […] e eventuale deroga […] esaminate separatamente.'],
    R34:['Prenotazione e prestazione','Prenotazione […] esaminata per i termini contrattuali.','Prelievo e tratto realmente osservati dagli operanti confrontati con quei termini.'],
    N01:['Servizio NCC e titolo','Servizio con autobus osservato nel tratto […] e prenotazione […] esaminata.','Provvedimento di sospensione o revoca […] e conferma di efficacia dell’ufficio […] prot. […].'],
    N02:['Servizio NCC e titolo','Servizio con autobus osservato nel tratto […] e prenotazione […] esaminata.','Provvedimento di sospensione o revoca […] e conferma di efficacia dell’ufficio […] prot. […].'],
    N03:['Trasporto e titolo','Prelievo e percorso realmente osservati dagli operanti […].','Risposta dell’ufficio titoli […] prot. […] sul titolo riferito al veicolo e al servizio.'],
    N12:['Titolo dell’autobus','Risposta dell’ufficio […] prot. […] sull’assenza di autorizzazione per questo autobus.','Documento di circolazione […] esaminato per l’uso annotato, distinto dal servizio osservato.'],
    N04:['Modalità del servizio NCC','Stazionamento e accettazione di nuova clientela osservati dagli operanti […].','Prenotazione […] esaminata e confrontata con il prelievo effettivamente osservato.'],
    N05:['Modalità del servizio NCC','Stazionamento e accettazione di nuova clientela osservati dagli operanti […].','Prenotazione […] esaminata e confrontata con il prelievo effettivamente osservato.'],
    N06:['Modalità del servizio NCC','Stazionamento e accettazione di nuova clientela osservati dagli operanti […].','Prenotazione […] esaminata e confrontata con il prelievo effettivamente osservato.'],
    N07:['Modalità del servizio NCC','Stazionamento e accettazione di nuova clientela osservati dagli operanti […].','Prenotazione […] esaminata e confrontata con il prelievo effettivamente osservato.'],
    N08:['Condizione dell’autorizzazione','Autorizzazione […] esaminata per la clausola specifica efficace.','Servizio osservato […] confrontato con risposta dell’ufficio […] prot. […].'],
    N09:['Autorizzazione e servizio','Autorizzazione esistente ed efficace confermata dall’ufficio […] prot. […].','Servizio con autobus osservato dagli operanti nel tratto […].'],
    N10:['Conducente e rapporto','Documento del rapporto di lavoro […] richiesto ed esaminato a bordo.','Qualità del conducente verificata con atto […] e risposta dell’impresa […].'],
    N11:['Foglio di servizio','Foglio di servizio […] esaminato per il dato mancante e la data.','Atto attuativo o risposta dell’ufficio […] verificata per il regime vigente.'],
    R39:['Cavallo e veterinario','Condizioni dell’animale osservate dagli operanti nel periodo […].','Valutazione veterinaria formalizzata nell’atto […] sul cavallo identificato […].'],
    R40:['Idoneità del cavallo','Certificato veterinario […] esaminato per il requisito richiesto.','Risposta dell’ufficio veterinario […] prot. […] sull’idoneità e sulle eccezioni.'],
    R41:['Abilitazione e identificazione','Certificato annuale […] esaminato per scadenza e rinnovo.','Documento d’identificazione […] confrontato con il cavallo e con risposta veterinaria […].'],
    R42:['Allestimento della vettura','Ordinanza […] esaminata per la caratteristica prescritta.','Misura o verifica tecnica dell’allestimento […] documentata nell’atto […].']
  };
  const makeGroup=([title,first,second,other])=>({title,options:[first,second],other:other||`Altra fonte o modalità pertinente per ${title.toLowerCase()}: […]`});
  window.prontuarioEvidenceHints = code => {
    const entry=evidence[code];
    if(!entry)throw Error(`Suggerimenti sui riscontri mancanti: ${code}`);
    return makeGroup(entry);
  };
  window.prontuarioEvidenceHintCodes = Object.keys(evidence);

  window.prontuarioPriorOfficeHints = () => ({
    title:'Ufficio o fonte consultata per i precedenti',
    options:[
      'C.O. (Centrale Operativa), consultata il […], riscontro n. […].',
      'U.O. indicata in intestazione, consultata il […], riscontro n. […].'
    ],
    other:'Altro ufficio o fonte consultata: […].'
  });
  window.prontuarioPriorDetailHints = (item,type) => {
    const code=item.demoBaseCode||item.code;
    const subject=['N02','N03'].includes(code)?'della persona interessata dalla conseguenza sulla patente, con ruolo verificato':code==='G02'?'dello stesso soggetto':type==='NCC'?'del medesimo veicolo':'del titolare della licenza';
    return {
      title:'Estremi e pertinenza del precedente',
      options:[
        `Verbale n. […], fatto del […], organo accertatore […]; identità ${subject} riscontrata da […].`,
        `Atti dei precedenti n. […], date dei fatti […], organi accertatori […]; fonte del confronto […].`
      ],
      other:'Altro riscontro pertinente del precedente: […].'
    };
  };
  window.prontuarioActHints = (item,acts) => {
    if(!acts.length)return null;
    if(acts.some(act=>act.title==='Ritiro, trasferimento e fermo'))return {
      title:'Estremi del seguito sul documento',
      options:['Ritiro del documento di circolazione effettivamente eseguito e UMC destinatario […].','Autorizzazione al trasferimento, luogo indicato […] e fermo come da separato verbale.'],
      other:'Altro estremo dell’atto effettivamente compiuto: […].'
    };
    if((item.demoBaseCode||item.code)==='G23')return {
      title:'Estremi del ritiro del titolo comunale',
      options:['Verbale di ritiro della licenza n. […] effettivamente redatto.','Titolo comunale n. […] e ufficio destinatario […] indicati nell’atto.'],
      other:'Altro estremo del ritiro effettivo: […].'
    };
    return {
      title:'Estremi degli atti dell’abusivismo',
      options:['Ritiro patente o comunicazione dei presupposti documentati e Prefettura-UTG […].','Sequestro e custodia come da separato verbale; custode […] e luogo […].'],
      other:'Altro atto effettivamente compiuto e documentato: […].'
    };
  };
  window.prontuarioRenderHint = (group,esc) => `<span class="staticPointHints" role="note"><strong>${esc(group.title)}</strong>${[...group.options,group.other].map(option=>`<span class="staticPointHint">• ${esc(option)}</span>`).join('')}</span>`;
  window.prontuarioRenderFormulaPart = (raw,annotations,esc,showPlaceholder=false) => {
    let cursor=0,body='';
    for(const {after,hint} of annotations){
      const at=raw.indexOf(after,cursor);
      if(at<0)throw Error(`Punto del suggerimento mancante nella formula: ${after}`);
      const end=at+after.length;
      body+=esc(raw.slice(cursor,end))+(Array.isArray(hint)?hint:[hint]).map(group=>window.prontuarioRenderHint(group,esc)).join('');
      cursor=end;
    }
    body+=esc(raw.slice(cursor));
    if(showPlaceholder)body+=' <span class="staticInlinePlaceholder">[…].</span>';
    return `<p class="staticFormulaPart" data-copy-text="${esc(raw)}">${body}</p>`;
  };
  window.prontuarioCopyFormulaParts = formula => [...formula.querySelectorAll('.staticFormulaPart')]
    .map((part,index,parts)=>(part.dataset?.copyText||part.textContent.trim())+(index<parts.length-1?' […].':''))
    .join(' ');
})();
