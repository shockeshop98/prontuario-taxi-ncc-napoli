// Esempi di revisione: non caricati dal catalogo PWA né dal PDF completo.
export const closing='Copia del presente verbale sarà trasmessa all’Ufficio Corso Pubblico.';
export const licenceNotice={
  title:'Licenza comunale di Napoli · ritiro e trasmissione',
  verified:'Gruppi C e D: ritiro materiale degli operatori nei casi previsti dall’art. 29, comma 4. Sospensione e revoca competono all’autorità competente.',
  proposed:'Indicazione interna da confermare: per C.A.P. o patente scaduti e per effettiva scopertura RCA, ritiro della licenza e invio tempestivo al Corso Pubblico; negli altri casi di ritiro previsto, invio entro 5 giorni. Occorre acquisire la disposizione del Comando che ne stabilisce presupposti, competenza e termini.',
  limit:'La scadenza o la mancata esibizione di un documento non dimostrano da sole la perdita del requisito. I 5 giorni proposti riguardano l’invio della licenza già ritirata: non consentono di continuare il servizio.'
};
const documentPending='Il documento di circolazione è ritirato e sarà trasmesso all’UMC di […]. Il conducente è autorizzato a condurre il veicolo per la via più breve fino a […] (luogo indicato dall’interessato), con l’avvertenza che lo stesso sarà sottoposto a fermo amministrativo per tutta la durata di sospensione del documento di circolazione, come da separato verbale.';
const documentSent=documentPending.replace('sarà trasmesso','trasmesso');
export const examples=[
  {
    code:'G19',id:'licbordo',type:'Taxi',label:'Caso ordinario',
    lead:'Alla guida del taxi C.P. n°----- regolarmente in servizio e disponibile, non teneva a bordo la licenza comunale, la cui esistenza e validità erano riscontrate presso […] in data […].',
    variants:[{id:'fatto',label:'Fatto accertato',acts:'',condition:'Esempio riferito a taxi nel proprio turno e libero da passeggeri. Licenza esistente e valida; condizione del titolo documentata prima di usare l’art. 86, comma 3-bis.'}],
    duties:'Nessun ritiro automatico della licenza per la sola assenza a bordo. Documentare il riscontro del titolo e trasmettere gli atti pertinenti.',
    conflict:'«Regolarmente in servizio e disponibile» è utilizzabile solo se turno e disponibilità sono stati effettivamente riscontrati. La mancata esibizione non equivale ad abusivismo o perdita del requisito.',
    examples:['Riscontro del titolo presso l’ufficio competente, con data e riferimento della risposta.'],
    sources:['REG artt. 23, comma 1, lett. a, e 29','CdS art. 86, comma 3-bis'],
    printVariant:'fatto'
  },
  {
    code:'G23',id:'turno',type:'Taxi',label:'Ritiro della licenza',
    lead:'Alla guida del taxi C.P. n°----- svolgeva il servizio alle ore […], fuori dal turno […] previsto dall’atto vigente […], senza deroga o cambio turno autorizzato, come riscontrato presso […] in data […].',
    variants:[
      {id:'fatto',label:'Solo fatto · adempimenti da documentare',acts:'',condition:'Il ritiro è obbligatorio quando è accertata la violazione del gruppo C. Questa visualizzazione non attesta che sia già avvenuto e non lo rende facoltativo.'},
      {id:'ritiro',label:'Ritiro della licenza eseguito',acts:'La licenza è ritirata e sarà trasmessa all’Ufficio Corso Pubblico.',condition:'Usare solo dopo il ritiro effettivo della licenza. L’invio è ancora da eseguire; annotare gli estremi nel relativo atto. Nessuna sospensione o revoca è qui attribuita agli operatori.'}
    ],
    duties:'Accertata la violazione del gruppo C, ritiro della licenza da parte degli operatori ex art. 29, comma 4; trasmissione all’ufficio competente. Il termine interno di 5 giorni resta da confermare.',
    conflict:'Apertura adattata: «regolarmente in servizio» contraddirebbe il servizio fuori turno. Il termine proposto per l’invio non autorizza a proseguire il servizio. L’art. 86, comma 3-bis richiede la condizione del titolo accertata.',
    examples:['Turno previsto 07:00–14:00 e servizio accertato alle 15:10, senza deroga: dati soltanto illustrativi.'],
    sources:['REG artt. 23, comma 1, lett. f, e 29, commi 2, lett. c, e 4','CdS art. 86, comma 3-bis'],
    printVariant:'ritiro'
  },
  {
    code:'G03-01',id:'rifiuto-prima',type:'Taxi',label:'Ritiro del documento di circolazione',
    lead:'Alla guida del taxi C.P. n°----- regolarmente in servizio e disponibile, rifiutava senza motivo legittimo la corsa richiesta per […] nel territorio comunale. Dal riscontro presso […] del […] non risultavano precedenti pertinenti del titolare nel quinquennio.',
    variants:[
      {id:'fatto',label:'Solo fatto · adempimenti da documentare',acts:'',condition:'Ritiro del documento, fermo e custodia sono adempimenti dovuti nella fattispecie accertata. Attestarli soltanto per le attività realmente eseguite.'},
      {id:'ritiro',label:'Ritiro, permesso e separato verbale eseguiti · invio da fare',acts:documentPending,condition:'Usare solo con documento ritirato, permesso limitato effettivamente rilasciato e separato verbale redatto. L’invio all’UMC è ancora da eseguire. Verificare patente e copertura RCA valide, idoneità del veicolo, custodia praticabile e assenza di altri impedimenti alla circolazione.'},
      {id:'trasmesso',label:'Anche trasmissione all’UMC già effettuata',acts:documentSent,condition:'Usare solo con documento ritirato e invio all’UMC già effettuato, permesso limitato effettivamente rilasciato e separato verbale redatto. Patente e RCA devono essere valide, il veicolo idoneo e la custodia praticabile, senza altri impedimenti alla guida. Il permesso riguarda soltanto il trasferimento in custodia, non la ripresa del servizio.'},
      {id:'impedito',label:'Trasferimento alla guida non consentito',acts:'Il documento di circolazione è ritirato e sarà trasmesso all’UMC di […]. Il trasferimento del veicolo nel luogo di custodia […] è eseguito mediante […], come da separato verbale n. […].',condition:'Usare soltanto dopo il ritiro e il trasferimento effettivi, con separato verbale redatto. Nessuna autorizzazione alla guida: completare gli estremi dell’impedimento negli atti. Fermo e custodia devono essere documentati.'}
    ],
    duties:'Sospensione del documento di circolazione: ritiro degli operatori e invio con copia del verbale all’UMC entro 5 giorni (art. 217). Fermo per pari durata (art. 214, comma 7). Permesso esclusivamente per raggiungere la custodia, se consentito.',
    conflict:'Permesso applicabile alla sospensione prevista dall’art. 86, comma 3; non al generico ritiro di un documento. Se patente, RCA, sicurezza del veicolo o altra misura impediscono la guida, usare il trasferimento senza autorizzazione al conducente. Nessun ritiro automatico della licenza comunale per il solo gruppo B.',
    examples:['Destinazione richiesta entro il Comune; disponibilità iniziale del taxi e motivo del rifiuto riscontrati.'],
    sources:['CdS artt. 86, comma 3, lett. a, 214, comma 7, e 217','REG artt. 23, comma 1, lett. o, e 29, comma 2, lett. b'],
    printVariant:'trasmesso'
  },
  {
    code:'G01',id:'abusivo',type:'Taxi',label:'Caso abusivo',
    lead:'Con il veicolo […] esercitava il servizio taxi senza licenza, trasportando un passeggero da […] a […] per il corrispettivo concordato di euro […]. L’assenza della licenza era riscontrata presso […] in data […]. Dal riscontro presso […] del […] non risultavano precedenti pertinenti dello stesso soggetto nel triennio.',
    variants:[
      {id:'fatto',label:'Solo fatto · adempimenti da documentare',acts:'',condition:'Occorrono esercizio effettivo del servizio e assenza del titolo accertati; la sola mancata esibizione non basta. Sequestro e ritiro patente dovuti non diventano facoltativi perché non ancora attestati.'},
      {id:'atti',label:'Sequestro e ritiro patente eseguiti',acts:'Il veicolo è sottoposto a sequestro ai fini della confisca, con custodia presso […], come da separato verbale n. […]. La patente è ritirata e sarà trasmessa alla Prefettura di […].',condition:'Usare solo se sequestro, custodia, separato verbale e ritiro della patente sono già eseguiti. Esempio riferito ad autovettura per cui è richiesta la patente; il provvedimento di sospensione compete al Prefetto.'}
    ],
    duties:'Sequestro ai fini della confisca e custodia con atti separati; ritiro della patente per il successivo provvedimento prefettizio. Nessun permesso automatico di trasferimento ex art. 217 e nessuna licenza inesistente da ritirare.',
    conflict:'Escluse sia l’apertura del taxi regolare sia la chiusura generica al Corso Pubblico. L’eventuale segnalazione pertinente resta fuori dal corpo copiabile. Il trattenimento del documento nel sequestro non è sospensione ex art. 217.',
    examples:['Corrispettivo pattuito riscontrato con la richiesta e il trasporto effettivi, non con la sola presenza del passeggero.'],
    sources:['CdS artt. 86, comma 2, 213 e 218','L. 21/1992 art. 8'],
    printVariant:'atti',abusive:true
  }
];
export function formulaFor(example,variantId){
  const variant=example.variants.find(v=>v.id===variantId)||example.variants[0];
  return [example.lead,variant.acts,example.abusive?'':closing].filter(Boolean).join('\n\n');
}
