(function () {
  const id = 'taxi-collettivo-aeroporto-stazione-molo';
  const title = 'Taxi collettivo — Aeroporto, Stazione Centrale, Molo Beverello';
  const summary = 'Aeroporto di Capodichino – Stazione Centrale – Molo Beverello e viceversa; € 6 per passeggero, bagagli compresi. Taxi con capienza omologata: l’integrazione del 2026 ammette temporaneamente anche vetture con meno di sette posti a disposizione dell’utenza. Servizio riservato a chi non è di turno in aeroporto. Proroga fino al 31/12/2026.';
  const references = [
    'Ordinanza dirigenziale n. 1 del 16/04/2019 (OD/2019/0000463): attivazione, postazioni, percorsi e modalità operative.',
    'Ordinanza dirigenziale n. 10 del 01/12/2025 (OD/2025/0002122 del 02/12/2025): proroga fino al 31/12/2026.',
    'Ordinanza dirigenziale n. 9 del 06/08/2026 (1065O/2026/0000009): integrazione temporanea sui posti a disposizione dell’utenza.',
    'Richiami: delibera G.C. n. 634 del 20/12/2018; art. 19 del Regolamento comunale – delibera C.C. n. 80/2005. O.D. n. 9 del 19/05/2022 (OD/2022/0000595): proroga storica al 31/12/2023, reperita sul sito del Comune.'
  ];
  const operative = [
    'Tratta attivata: Aeroporto di Capodichino – Stazione Centrale – Molo Beverello e viceversa. L’O.D. 2019 ha efficacia dall’installazione della segnaletica orizzontale e verticale.',
    'Tariffa: € 6 per ciascun passeggero, bagagli compresi. La tabella deve indicare € 6 a persona per l’andata o il ritorno, indipendentemente dalla salita o discesa alle fermate intermedie.',
    'Turno: può effettuare questo servizio soltanto chi non è di turno in aeroporto. La tabella “TAXI Collettivo” è esposta sul parabrezza anteriore dal momento in cui il taxi occupa lo stallo dedicato; reca logo del Comune, percorso e tariffa leggibili.',
    'Partenza: il dispositivo dell’O.D. 2019 indica 15 minuti dall’arrivo dei primi tre passeggeri. Rilevare separatamente arrivo, salita e partenza; vedere l’ambiguità con l’art. 19, comma 4, del regolamento.',
    'Postazioni dedicate e numero massimo di stalli: Aeroporto, area ex NCC presso la rotonda di viale Ruffo di Calabria, fronte postazione della Polizia Locale: 4; Stazione Centrale, andata, corso Novara n. 3: 2; Stazione Centrale, ritorno, corso Arnaldo Lucci presso l’ingresso Metropark: 3; Molo Beverello, via C. Colombo, corsia destra verso via Marina presso semaforo/fermata ANM: 5.',
    'Andata: Aeroporto – viale Ruffo di Calabria – via O. Salomone – via del Riposo – via Don Bosco – piazza Carlo III – via Arenaccia – corso Novara – piazza Garibaldi – corso Umberto – via A. Depretis – piazza Municipio – via C. Colombo.',
    'Ritorno: via C. Colombo – via A. Vespucci – corso A. Lucci – piazza Garibaldi – corso Novara – via Arenaccia – piazza Carlo III – via Don Bosco – largo S. Maria del Pianto – via Comandante Umberto Maddalena – Aeroporto.',
    'Integrazione 2026: su questo servizio sono temporaneamente ammesse anche autovetture con meno di sette posti a disposizione dell’utenza. Verificare comunque l’omologazione e la capienza del veicolo; non estendere la deroga ad altre tratte. Il solo numero inferiore a sette non costituisce automaticamente una violazione su questa tratta nel periodo documentato.'
  ];
  const premises = [
    'Le premesse dei tre atti richiamano la delibera G.C. n. 634/2018: fermate diverse e distanti da quelle ALIBUS; nessun veicolo oltre gli stalli consentiti; i veicoli in eccesso si allontanano.',
    'Nel medesimo richiamo alla delibera si indica di non avviare il tassametro per il trasporto cumulativo e di rilasciare, prima della partenza, a ciascun utente una ricevuta di € 6 con il numero del taxi. Queste frasi sono nelle premesse, non fra i punti autonomi del dispositivo dell’O.D. 2019: verificare la delibera e il titolo applicabile prima di qualificare una violazione. Il tassametro non avviato non dimostra un difetto del sigillo.'
  ];
  const limits = [
    'Art. 19, comma 4, del regolamento: massimo cinque minuti in parcheggio dalla salita del primo passeggero; O.D. 2019, punto 4.3: partenza dopo 15 minuti dall’arrivo dei primi tre. I presupposti temporali e il rapporto tra le due prescrizioni richiedono chiarimento dell’ufficio competente; non presumere che l’una abroghi l’altra.',
    '“Non di turno in aeroporto” e “taxi di turno” compaiono nello stesso dispositivo del 2019: verificare la turnazione applicabile senza confondere il turno generale con quello aeroportuale.',
    'Il rapporto fra l’integrazione dirigenziale del 2026 e l’art. 19, comma 3, del regolamento va validato dall’ufficio competente. La scheda non assegna automaticamente importi o sanzioni: servono disposizione applicabile e riscontri propri. Dopo il 31/12/2026 verificare una nuova proroga.'
  ];
  const related = {
    G04:'Tariffa collettiva € 6: verificare tratta e atto applicabile prima del confronto economico; evitare doppioni con G08.',
    G08:'Per il prezzo del taxi collettivo considerare la tariffa specifica per passeggero; il tassametro spento non prova da solo un prezzo illecito.',
    I01:'Il richiamo alla delibera G.C. n. 634/2018 prevede tassametro non avviato nel trasporto cumulativo: non presumere la violazione per la sola mancata attivazione.',
    'G28-02':'La ricevuta di € 6 prima della partenza è richiamata negli atti del collettivo. G28-02 riguarda invece la corsa a tariffa predeterminata richiesta dall’utente: verificare la prescrizione applicabile, senza equiparare automaticamente le due ipotesi.',
    G50:'Il limite di cinque minuti dell’art. 19, comma 4, va confrontato con i 15 minuti indicati dall’O.D. 2019: rilevare gli orari e chiedere chiarimento prima di qualificare il fatto.',
    G51:'L’avviso interno sui cinque minuti è distinto dalla tabella identificativa sul parabrezza prescritta dall’O.D. 2019.',
    G52:'Per questa tratta gli stalli e la segnaletica sono individuati dall’O.D. 2019, prorogata al 31/12/2026; verificare postazione, numero dei posti e segnaletica effettiva.',
    R16:'Distinguere l’insegna e il display dell’art. 19, comma 1, dalla tabella sul parabrezza richiesta dall’O.D. 2019; non attribuire automaticamente la stessa sanzione.',
    G43:'Verificare se la sosta riguarda uno stallo del collettivo e quale segnaletica si applica prima di usare la scheda generale sui posteggi.'
  };
  const item = {
    id, code:'TC01', title, scope:'taxi', topic:'collettivo', kind:'collective-reference', referenceOnly:true,
    ref:'O.D. n. 1 del 16/04/2019; O.D. n. 10 del 01/12/2025; O.D. n. 9 del 06/08/2026; Regolamento comunale – delibera C.C. n. 80/2005, art. 19',
    facts:'Proroga fino al 31/12/2026. Tariffa 6 euro per passeggero con bagagli, tassametro, ricevuta, tabella identificativa, turno, fermate e stalli.',
    searchTerms:'taxi sharing collettivo Alibus sei euro 6 euro aeroporto Capodichino Stazione Centrale Molo Beverello meno di sette posti sette posti',
    sources:['OD2019','OD2025','OD2026','REG'], payments:[]
  };
  window.prontuarioTaxiCollettivo = {item,summary,references,operative,premises,limits,related,sourceIndices:[6,7,8],
    afterExpiry(date=new Date()) {return date.getFullYear()>2026;}
  };
})();
