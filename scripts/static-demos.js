// Tre schede editoriali di consultazione. Norme e importi provengono dal catalogo.
window.prontuarioStaticDemos = {
  rifiuto: {
    code: 'G03',
    title: 'Taxi: rifiuto della corsa senza motivo legittimo',
    variants: [
      {id:'rifiuto-prima', code:'G03-01', title:'Taxi: rifiuto della corsa senza motivo legittimo – prima violazione', paymentIndex:0, ordinal:'prima violazione', previous:'nessun precedente pertinente', previousFormula:'Da accertamento presso […] del […] non risultavano precedenti pertinenti del titolare nel quinquennio.', municipalSuspension:'15 giorni', municipalPoints:'Non previsti per la prima violazione'},
      {id:'rifiuto-seconda', code:'G03-02', title:'Taxi: rifiuto della corsa senza motivo legittimo – seconda violazione', paymentIndex:1, ordinal:'seconda violazione', previous:'un precedente pertinente', previousFormula:'Un precedente pertinente del titolare nel quinquennio risultava dal verbale n. […], per il fatto del […], accertato da […], come da riscontro […].', municipalSuspension:'30 giorni', municipalPoints:'5 punti sulla licenza taxi'},
      {id:'rifiuto-terza', code:'G03-03', title:'Taxi: rifiuto della corsa senza motivo legittimo – terza violazione', paymentIndex:2, ordinal:'terza violazione', previous:'due precedenti pertinenti', previousFormula:'Due precedenti pertinenti del titolare nel quinquennio risultavano dai verbali n. […], per fatti del […], accertati da […], come da riscontro […].', municipalSuspension:'60 giorni', municipalPoints:'5 punti sulla licenza taxi'},
      {id:'rifiuto-quarta-successiva', code:'G03-04', title:'Taxi: rifiuto della corsa senza motivo legittimo – quarta o successiva violazione', paymentIndex:3, ordinal:'quarta o successiva violazione', previous:'almeno tre precedenti pertinenti', previousFormula:'Almeno tre precedenti pertinenti del titolare nel quinquennio risultavano dai verbali n. […], per fatti del […], accertati da […], come da riscontro […].', municipalSuspension:'60 giorni', municipalPoints:'5 punti sulla licenza taxi'}
    ],
    normative: [
      'CdS art. 86, comma 3',
      'L. 21/1992, art. 2',
      'Regolamento comunale – delibera C.C. n. 80/2005, art. 23, comma 1, lett. o'
    ],
    accessories: [
      'Prima violazione: sospensione del documento di circolazione per 1 mese.',
      'Seconda violazione: sospensione del documento di circolazione per 1–2 mesi.',
      'Terza violazione: sospensione del documento di circolazione per 2–4 mesi.',
      'Violazioni successive: sospensione del documento di circolazione per 4–8 mesi.',
      'Misure comunali sul titolo: sospensione della licenza di 15, 30 o 60 giorni e cinque punti dalla violazione successiva alla prima.'
    ],
    responsibility:'Descrivere e identificare il conducente che ha rifiutato la corsa. Il destinatario della sanzione è il titolare della licenza; se è persona diversa, contestare o notificare al titolare.',
    notes:[
      'Verificare richiesta, destinazione, disponibilità del taxi, risposta e motivo addotto. La corsa extraurbana può essere facoltativa; una fotografia da sola non ricostruisce la conversazione.',
      'Usare «dichiarazione acquisita» solo se formalizzata con un atto. Se il passeggero riferisce fatti senza formalizzarli, riportare nella relazione le parole ascoltate, la fonte e le circostanze, senza attribuirgli una dichiarazione sottoscritta.',
      'Scegliere la fascia soltanto dopo il riscontro dei precedenti pertinenti nel quinquennio. Il numero dei controlli non dimostra da solo la reiterazione.',
      'Per il riscontro negativo scrivere «presso la C.O. […]» se è stata consultata la Centrale Operativa; scrivere «presso la U.O. indicata in intestazione» soltanto se è stata consultata quella Unità Operativa. Non attribuire il riscontro a un ufficio diverso.',
      'Per lo stesso fatto già sanzionato in questa scheda non aggiungere automaticamente un secondo importo regionale.',
      'I punti sulla licenza taxi sono distinti dai punti della patente. Per questo gruppo non è previsto il ritiro immediato del titolo comunale.',
      'Ritiro del documento di circolazione, permesso limitato al trasferimento, fermo e custodia richiedono atti separati effettivamente eseguiti. Documento e copia del verbale vanno trasmessi all’UMC entro cinque giorni.'
    ],
    destinations:'UMC per il documento di circolazione; Ufficio Verbali per il seguito; Ufficio Corso Pubblico tramite il percorso dell’Ufficio Verbali.',
    amountNote:'Importi in euro, spese escluse. Oltre 60 giorni è indicato l’importo a ruolo, non un secondo pagamento in misura ridotta.',
    formulaParts: [
      'Alla guida del veicolo indicato, con C.P. n. […], disponibile al servizio taxi, rifiutava senza motivo legittimo la corsa richiesta verso […], in violazione dell’art. 2 della L. n. 21/1992. In particolare:',
      'Il fatto era accertato mediante:',
      "[RISCONTRO_PRECEDENTI] Copia del presente verbale verrà inviata all'Ufficio Corso Pubblico."
    ],
    suggestions: [
      {title:'Circostanza del rifiuto', options:[
        'Alla richiesta rispondeva […] e non effettuava la corsa.',
        'Adduceva […] come motivo del rifiuto e non effettuava la corsa.'
      ], other:'Altra circostanza del rifiuto accertata: […]'},
      {title:'Fonte dell’accertamento', options:[
        'Osservazione diretta degli operanti: […].',
        'Dichiarazione acquisita con atto n. […].'
      ], other:'Altra modalità di accertamento: […]'}
    ],
    acts: [
      {title:'Ritiro, trasferimento e fermo', text:'Il documento di circolazione è stato ritirato e sarà trasmesso all’UMC di […] entro cinque giorni. Il conducente è stato autorizzato al trasferimento del veicolo per la via più breve fino a […], luogo indicato dall’interessato, con l’avvertenza del fermo per la durata della sospensione del documento di circolazione, come da separato verbale.'}
    ]
  },
  abusivo: {
    code: 'G01',
    title: 'Taxi abusivo: licenza non conseguita, sospesa o revocata – prima violazione verificata',
    normative: [
      'CdS art. 86, comma 2',
      'L. 21/1992, art. 8'
    ],
    accessories: [
      'Sospensione della patente da 4 a 12 mesi.',
      'Sequestro del veicolo ai fini della confisca. La confisca non è già disposta dagli operanti.'
    ],
    notes:[
      'La sola mancata esibizione della licenza o una verifica pendente non dimostrano l’assenza del titolo: in quel caso descrivere soltanto i fatti accertati nella relazione.',
      'Se la licenza è sospesa o revocata, sostituire l’intera prima frase della formula con la condizione pertinente; non conservare «senza avere ottenuto» e non sommare condizioni alternative.',
      'La sola prenotazione non qualifica il servizio come taxi: descrivere le modalità concrete dell’offerta e del prelievo, indicando le fonti dei riscontri.',
      'Il riscontro dell’ufficio deve riguardare il servizio e il veicolo controllato ed escludere un titolo legittimante anche in capo a un soggetto diverso dal conducente; verificare sostituzione e auto di scorta.',
      'Titolo: indicare l’ufficio realmente consultato (C.O., U.O. indicata in intestazione o altro), data e riferimento del riscontro sull’assenza del titolo o sull’efficacia della sospensione o revoca al momento del fatto.',
      'Distinguere conducente, esercente del servizio, intestatario del titolo e veicolo. Separare l’osservazione degli operanti dai dati letti nei documenti; una copia è acquisita soltanto se lo è stata davvero.',
      'Identificare i passeggeri e distinguere la dichiarazione formalizzata dalle parole spontanee riportate nella relazione. Se rifiutano di formalizzare, non attribuire loro dichiarazioni sottoscritte.',
      'Prima di qualificare il fatto come prima violazione, verificare il precedente pertinente. Un riscontro incompleto non attribuisce automaticamente tale qualifica.',
      'Precedenti: annotare ufficio o fonte consultata (C.O., U.O. indicata in intestazione o altro), data e riferimento; la prima fascia richiede un riscontro negativo dello stesso soggetto nel triennio.',
      'Patente ritirata: trasmissione alla Prefettura entro cinque giorni. Sequestro e custodia richiedono atti separati.',
      'Il verbale va trasmesso entro 10 giorni al Prefetto del luogo della commessa violazione, ai sensi dell’art. 210, comma 3, CdS.'
    ],
    destinations:'Prefettura-UTG per la patente e il seguito di competenza; Prefetto del luogo della violazione per il verbale; Ufficio Verbali e Ufficio Corso Pubblico per la segnalazione interna.',
    formulaParts: [
      'Adibiva a servizio taxi il veicolo indicato senza avere ottenuto la prescritta licenza:',
      'Il servizio era accertato mediante:',
      ''
    ],
    suggestions: [
      {title:'Condizione della licenza', options:[
        'Non aveva conseguito la licenza.',
        'Esercitava con licenza sospesa, come da provvedimento […].',
        'Esercitava con licenza revocata, come da provvedimento […].'
      ]},
      {title:'Modalità concrete del servizio taxi', options:[
        'Offriva la corsa verso […], concordava € […] e prelevava il passeggero, come osservato dagli operanti.',
        'Accettava la richiesta di corsa, prelevava il passeggero e percorreva il tratto […]; corrispettivo […] riscontrato da […].'
      ], other:'Altra modalità del servizio taxi accertata: […]'}
    ],
    acts: [
      {title:'Ritiro della patente, sequestro e custodia', text:'La patente di guida è stata ritirata per la trasmissione alla Prefettura-UTG di […]. Il veicolo, di cui è stato trattenuto il documento di circolazione, è stato sottoposto a sequestro amministrativo ai fini della confisca, come da separato verbale, e affidato, con segnalazione visibile dello stato di sequestro, a […] che lo custodirà presso […].'}
    ]
  },
  turno: {
    code: 'G23',
    title: 'Taxi: servizio fuori turno o turno assegnato non svolto',
    normative: [
      'CdS art. 86, comma 3-bis',
      'Regolamento comunale – delibera C.C. n. 80/2005, art. 23, comma 1, lett. f'
    ],
    accessories: [
      'CdS: Non previste.',
      'Misura comunale sul titolo: sospensione da determinare dall’ufficio secondo i precedenti verificati.',
      'Punti comunali: dieci sulla licenza taxi, distinti dai punti della patente.'
    ],
    notes:[
      'Applicare la contestazione CdS soltanto se la prescrizione della licenza è identificata e documentata; la sola violazione del regolamento comunale non basta. Escludere prima le fattispecie CdS più specifiche.',
      'La sospensione comunale è di 15, 30 o 60 giorni secondo i precedenti pertinenti nel quinquennio; non attribuire una fascia senza riscontro.',
      'Confrontare giorno, ora, gruppo, licenza e ordinanza dei turni vigente al momento del fatto; verificare anche deroghe e cambio turno. Non usare un calendario scaduto.',
      'La sola assenza dal punto controllato non prova il mancato svolgimento del turno: documentare il servizio non effettuato e il riscontro relativo alla fascia assegnata.',
      'Il ritiro del titolo comunale previsto per il gruppo va documentato e trasmesso secondo il percorso interno soltanto se effettivamente eseguito.',
      'La sanzione comunale non è un’alternativa automatica alla sanzione CdS per lo stesso fatto. Una fotografia del disco o della vetrofonia integra, ma non sostituisce, il riscontro sull’atto vigente.'
    ],
    destinations:'Ufficio Verbali per il seguito e Ufficio Corso Pubblico tramite il percorso interno.',
    amountNote:'Oltre 60 giorni è indicato l’importo a titolo esecutivo, oltre alle spese.',
    formulaParts:[
      'Con il veicolo indicato, C.P. n. […], non rispettava il turno […] stabilito dall’atto vigente […], in violazione della condizione della licenza […] e dell’art. 23, comma 1, lett. f, del regolamento comunale – delibera C.C. n. 80/2005:',
      'L’esito della verifica su deroghe o cambio turno era:',
      "Copia del presente verbale verrà inviata all'Ufficio Corso Pubblico."
    ],
    suggestions: [
      {title:'Condotta osservata', options:[
        'Svolgeva servizio nella fascia […], fuori dal turno indicato.',
        'Non svolgeva il turno assegnato dalle […] alle […], come documentato dal registro […] e confermato dall’ufficio […] con risposta n. […].'
      ], other:'Altra condotta relativa al turno accertata: […]'},
      {title:'Riscontro pertinente', options:[
        'L’ufficio […] confermava con risposta n. […] l’assenza di deroghe efficaci.',
        'Il registro […] non riportava un cambio autorizzato per quel turno.'
      ], other:'Altro riscontro pertinente su deroghe o cambio turno: […]'}
    ],
    acts: [
      {title:'Ritiro del titolo comunale', text:'La licenza C.P. n. […] è stata ritirata, come da verbale n. […], per la trasmissione secondo il percorso dell’ufficio competente.'}
    ]
  }
};

// Le varianti di G03 conservano il catalogo originale come fonte di importi, PDF e metadati.
window.prontuarioDemoCaseItems = function (catalog) {
  const original = catalog.find(item => item.id === 'rifiuto');
  const demo = window.prontuarioStaticDemos.rifiuto;
  if (!original || original.code !== demo.code || original.payments.length !== demo.variants.length) throw Error('Fasce G03 non coerenti con il catalogo');
  return demo.variants.map(variant => ({
    ...original,
    id: variant.id,
    code: variant.code,
    title: variant.title,
    payments: [original.payments[variant.paymentIndex]],
    demoBaseId: original.id,
    demoBaseCode: original.code,
    demoVariant: variant,
    ui: {...original.ui, value: 'Caso specifico', detail: 'Fascia verificata nel quinquennio'}
  }));
};
