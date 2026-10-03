// Editorial examples for three local demonstrations only. Nothing is selected by default.
export const inlineDemos = {
  rifiuto: {
    code: 'G03', type: 'taxi',
    segments: [
      'Durante il servizio taxi sul veicolo con C.P. n. {{fact_01}}, il conducente {{fact_02}} rifiutava, senza motivo legittimo, il trasporto richiesto da {{fact_03}} da {{fact_04}} a {{fact_05}}, all’interno dell’area di servizio obbligatorio.',
      'Il taxi risultava disponibile {{fact_06}}; il motivo addotto era {{fact_07}}, non giustificato da {{fact_08}}.',
      'La richiesta e il rifiuto erano accertati mediante {{fact_09}}.',
      'Il titolare della licenza è {{fact_10}}; la fascia applicabile risulta da {{fact_11}}.'
    ],
    provenanceFields: ['fact_09'],
    suggestions: {
      fact_01: ['____, letto sulla licenza esibita durante il controllo', '____, confermato dall’ufficio ____ con risposta n. ____'],
      fact_02: ['____, identificato mediante documento n. ____', '____, identificato tramite riscontro anagrafico ____'],
      fact_03: ['____, identificato mediante documento n. ____', '____, le cui generalità venivano verificate tramite ____'],
      fact_04: ['____, luogo della richiesta osservata dagli operanti', '____, punto di partenza indicato nella richiesta formalizzata n. ____'],
      fact_05: ['____, destinazione richiesta e udita dagli operanti', '____, destinazione risultante dalla dichiarazione formalizzata n. ____'],
      fact_06: ['come osservato alle ore ____ presso ____', 'secondo il turno in vigore ____ e la verifica del veicolo presso ____'],
      fact_07: ['____, pronunciato dal conducente alla presenza degli operanti', '____, riportato nella dichiarazione formalizzata n. ____'],
      fact_08: ['alcuna delle circostanze verificate mediante ____', 'quanto emerso dal riscontro dell’ufficio ____ del ____'],
      fact_09: [
        {text: 'osservazione diretta degli operanti, che udivano la richiesta e il rifiuto alle ____ in ____', provenance: 'direct'},
        {text: 'dichiarazione di ____ formalizzata nel verbale n. ____ del ____', provenance: 'statement'}
      ],
      fact_10: ['____, risultante dalla licenza C.P. n. ____ esaminata', '____, identificato dal riscontro dell’ufficio ____ del ____'],
      fact_11: ['attestazione dell’Ufficio Verbali n. ____ del ____ relativa al quinquennio ____', 'esame dei verbali n. ____ e dei loro esiti verificati presso ____'],
      act_documento_01: ['Napoli, come da verbale di ritiro n. ____', '____, secondo il verbale di ritiro n. ____ del ____'],
      act_permesso_01: ['____, indicato nel permesso provvisorio n. ____', '____, come riportato nel verbale n. ____'],
      act_custodia_01: ['____, identificato e nominato custode nel verbale n. ____', '____, nella qualità di ____ indicata nell’atto n. ____'],
      act_custodia_02: ['____, luogo riportato nel verbale di affidamento n. ____', '____, deposito indicato nell’atto n. ____'],
      act_custodia_03: ['____ del ____, effettivamente redatto durante il controllo', '____, con estremi verificati nell’atto di fermo']
    }
  },
  abusivo: {
    code: 'G01', type: 'taxi',
    segments: [
      'Il veicolo {{vehicle_identity}} era condotto da {{driver_identity}}.',
      '{{operator_identity}}.',
      'Gli operanti osservavano {{service_observation}}.',
      '{{service_indicators}}.',
      '{{service_documents}}.'
    ],
    provenanceFields: ['service_observation', 'service_indicators', 'service_documents'],
    suggestions: {
      vehicle_identity: ['di tipo autovettura, identificato mediante carta di circolazione n. ____', '____, identificato dai dati di immatricolazione verificati con ____'],
      driver_identity: ['____, identificato con documento n. ____', '____, le cui generalità risultavano dal riscontro ____'],
      operator_identity: ['Il servizio risultava esercitato da ____ secondo il riscontro ____', 'L’esercente del servizio risultava ____, distinto dal conducente ____, come da ____'],
      service_observation: [
        {text: 'il prelievo di ____ presso ____ alle ____ e la partenza del veicolo verso ____', provenance: 'direct'},
        {text: 'l’offerta della corsa a ____ e il successivo prelievo di ____ presso ____', provenance: 'direct'}
      ],
      service_indicators: [
        {text: 'Gli agenti udivano la richiesta di trasporto da ____ a ____ e l’indicazione del corrispettivo di ____', provenance: 'direct'},
        {text: 'La prenotazione ____ esaminata indicava utenti ____, luogo e ora del prelievo ____, corrispondenti a quanto osservato', provenance: 'document'}
      ],
      service_documents: [
        {text: 'La prenotazione ____ veniva esaminata, senza acquisizione di copia, e riportava ____', provenance: 'document'},
        {text: 'Non veniva esaminato alcun documento relativo alla corsa; tale circostanza non prova da sola l’assenza del titolo', provenance: 'direct'}
      ],
      license_subject: ['____, soggetto indicato nella risposta dell’ufficio n. ____', '____, identificato nel riscontro acquisito il ____'],
      license_office: ['____, che rispondeva con nota n. ____', '____, interpellato il ____ tramite ____'],
      license_date: ['____, data della risposta n. ____', '____, data del riscontro comunicato tramite ____'],
      license_response: ['la risposta n. ____ riportava l’esito della ricerca sul servizio svolto con il veicolo ____', 'l’ufficio comunicava ____ con riferimento al servizio e al veicolo ____'],
      service_vehicle_title_evidence: ['non risultava alcun titolo legittimante il servizio taxi con il veicolo ____, neppure intestato ad altro soggetto, come da risposta ____', 'il riscontro dell’ufficio ____ sul servizio osservato e sul veicolo ____ escludeva un titolo legittimante, con estremi ____'],
      license_holder: ['____, identificato dal provvedimento n. ____', '____, risultante dall’archivio licenze consultato il ____'],
      license_cp: ['____, riportato nel provvedimento n. ____', '____, confermato dall’ufficio ____ il ____'],
      license_order: ['n. ____ del ____, notificato con estremi ____', 'n. ____ del ____, acquisito presso ____'],
      license_effectiveness: ['risposta dell’ufficio ____ n. ____ del ____, che confermava l’efficacia alle ____', 'provvedimento ____ e riscontro ____ attestanti l’efficacia al momento del fatto ____'],
      act_patente_01: ['____, riportato nel verbale di ritiro n. ____', '____, come risulta dal documento ritirato e dall’atto n. ____'],
      act_patente_02: ['Napoli, come indicato nel verbale di ritiro n. ____', '____, sede indicata nell’atto n. ____'],
      act_sequestro_01: ['____ del ____, effettivamente redatto', '____, con estremi riportati nell’atto di sequestro'],
      act_documento_circolazione_01: ['verbale n. ____ del ____, che attesta il trattenimento eseguito', 'annotazione di trattenimento nel verbale n. ____ del ____'],
      act_custodia_01: ['____, identificato e nominato custode con verbale n. ____', '____, nella qualità di ____ risultante dall’atto n. ____'],
      act_custodia_02: ['____, luogo indicato nel verbale di custodia n. ____', '____, deposito risultante dall’atto n. ____']
    }
  },
  turno: {
    code: 'G23', type: 'taxi',
    segments: [
      'Con il veicolo taxi con C.P. n. {{fact_01}}, {{conduct_mode}} il servizio in {{fact_02}} alle ore {{fact_03}} del {{fact_04}}, in contrasto con il turno {{fact_05}} previsto da {{fact_06}}.',
      'Le deroghe e il cambio turno erano verificati mediante {{fact_07}}.'
    ],
    provenanceFields: ['fact_06', 'fact_07'],
    suggestions: {
      conduct_mode: ['effettuava', 'ometteva'],
      fact_01: ['____, letto sulla licenza esibita', '____, confermato dall’ufficio ____ con nota n. ____'],
      fact_02: ['____, luogo in cui il veicolo veniva osservato in servizio', '____, luogo del controllo documentato nel verbale n. ____'],
      fact_03: ['____, annotata dagli operanti durante l’osservazione', '____, risultante dal verbale di controllo n. ____'],
      fact_04: ['____, data dell’osservazione diretta', '____, data riportata nell’atto di controllo n. ____'],
      fact_05: ['assegnato per la fascia ____–____ al titolare ____', 'previsto per il giorno ____ dalle ____ alle ____'],
      fact_06: [
        {text: 'provvedimento comunale n. ____ del ____ esaminato in ____', provenance: 'document'},
        {text: 'ordine di servizio n. ____ vigente il ____, comunicato dall’ufficio ____', provenance: 'office'}
      ],
      fact_07: [
        {text: 'consultazione del registro turni ____ e risposta dell’ufficio ____ n. ____ del ____, dai quali non risultavano deroghe efficaci', provenance: 'office'},
        {text: 'esame del provvedimento ____ e riscontro dell’ufficio ____ del ____, che escludevano un cambio turno autorizzato', provenance: 'document'}
      ]
    }
  }
};
