// Revisione mirata 1.8.16: decisioni dell’autore applicate alla sola vista indicata.
(function(){
 const w=window, clone=x=>JSON.parse(JSON.stringify(x));
 const changes={
  "Taxi/G55": {
    "code": "G55",
    "type": "Taxi",
    "ref": "CdS art. 86 c. 3-bis; Regolamento comunale – delibera C.C. n. 80/2005, art. 4 c. 3",
    "rate": "residual",
    "formulaHeading": "Testo orientativo del verbale",
    "requestedFormula": "Durante il servizio con il veicolo indicato, con C.P. n. […], non prendeva posto negli stalli regolarmente predisposti dal comune, siti in […]. Copia del presente verbale sarà inviata all’Ufficio Corso Pubblico."
  },
  "Taxi/G46": {
    "code": "G46",
    "type": "Taxi",
    "ref": "CdS art. 86 c. 3-bis; ordinanza sindacale prot. n. 11 del 7 giugno 2010",
    "rate": "residual"
  },
  "Taxi/G47": {
    "code": "G47",
    "type": "Taxi",
    "ref": "CdS art. 86 c. 3-bis; ordinanza sindacale prot. n. 11 del 7 giugno 2010",
    "rate": "residual"
  },
  "Taxi/G48": {
    "code": "G48",
    "type": "Taxi",
    "ref": "CdS art. 86 c. 3-bis; O.D. n. 178 del 13/02/2019, punto 3.D.2",
    "rate": "residual"
  },
  "Taxi/I09": {
    "code": "I09",
    "type": "Taxi",
    "ref": "CdS art. 86 c. 3-bis; Regolamento comunale (delibera C.C. n. 80/2005), art. 7",
    "rate": "residual"
  },
  "Taxi/R14": {
    "code": "R14",
    "type": "Taxi",
    "ref": "CdS art. 86 c. 3-bis; Regolamento comunale (delibera C.C. n. 80/2005), art. 18 c. 4 e c. 8 let. c",
    "rate": "residual"
  },
  "Taxi/R15": {
    "code": "R15",
    "type": "Taxi",
    "ref": "CdS art. 86 c. 3-bis; Regolamento comunale (delibera C.C. n. 80/2005), art. 18 c. 6 e c. 8 let. d",
    "rate": "residual"
  },
  "Taxi/R20": {
    "code": "R20",
    "type": "Taxi",
    "ref": "CdS art. 86 c. 3-bis; Regolamento comunale (delibera C.C. n. 80/2005), art. 22 c. 4 e c. 5",
    "rate": "residual"
  },
  "Taxi/G10": {
    "code": "G10",
    "type": "Taxi",
    "ref": "CdS art. 86 c. 3-bis; Regolamento comunale (delibera C.C. n. 80/2005), art. 5 c. 3 let. g",
    "rate": "residual"
  },
  "Taxi/G11": {
    "code": "G11",
    "type": "Taxi",
    "ref": "CdS art. 86 c. 3-bis; Regolamento comunale (delibera C.C. n. 80/2005), art. 5 c. 7; art. 29 c. 2 let. a",
    "rate": "residual"
  },
  "Taxi/G12": {
    "code": "G12",
    "type": "Taxi",
    "ref": "CdS art. 86 c. 2; provvedimento specifico",
    "rate": "severe",
    "formulaHeading": "Testo orientativo per la relazione",
    "requestedFormula": "Svolgeva servizio taxi con il veicolo indicato e licenza C.P. n. […] [sospesa/revocata] dal provvedimento […] notificato il […] ed efficace al momento del fatto. Servizio e riscontri: […]. Copia del presente verbale sarà inviata all’Ufficio Corso Pubblico."
  },
  "Taxi/G13": {
    "code": "G13",
    "type": "Taxi",
    "ref": "CdS art. 86 c. 3-bis; Regolamento comunale (delibera C.C. n. 80/2005), art. 16 c. 1; art. 29 c. 2 let. b",
    "rate": "residual"
  },
  "Taxi/G14": {
    "code": "G14",
    "type": "Taxi",
    "ref": "CdS art. 86 c. 3-bis; Regolamento comunale (delibera C.C. n. 80/2005), art. 16 c. 3 e c. 4",
    "rate": "residual"
  },
  "Taxi/G28-02": {
    "code": "G28-02",
    "type": "Taxi",
    "ref": "CdS art. 86 c. 3-bis; Regolamento comunale (delibera C.C. n. 80/2005), art. 23 c. 1 let. n; art. 29 c. 2 let. a",
    "rate": "residual",
    "formulaHeading": "Testo orientativo per la relazione",
    "requestedFormula": "Alla guida del veicolo indicato, con C.P. n. […], accettava la corsa a tariffa predeterminata […] richiesta dall’utente all’inizio, ma non consegnava prima della partenza la ricevuta. Riscontro: […]. Copia del presente verbale sarà inviata all’Ufficio Corso Pubblico."
  },
  "Taxi/G28-04": {
    "code": "G28-04",
    "type": "Taxi",
    "ref": "CdS art. 86 c. 3-bis; Regolamento comunale (delibera C.C. n. 80/2005), art. 23 c. 1 let. n; art. 29 c. 2 let. a",
    "rate": "residual"
  },
  "Taxi/G32": {
    "code": "G32",
    "type": "Taxi",
    "addNote": "Guida effettivamente accertata: distinguere patente sospesa (art. 218 c. 6; per sospensione breve art. 218-ter c. 8) e ritiro ai sensi dell’art. 216 (c. 6). Per ritiro ex art. 218 verificare decorrenza e regime; art. 128 c. 2 per revisione/inidoneità temporanea. Verificare provvedimento, efficacia e permessi. Il solo veicolo presente o la comunicazione omessa non bastano; nessun secondo verbale automatico.",
    "ref": "CdS art. 86 c. 3-bis; Regolamento comunale (delibera C.C. n. 80/2005), art. 23 c. 1 let. s",
    "rate": "residual"
  },
  "Taxi/G44": {
    "code": "G44",
    "type": "Taxi",
    "addNote": "Indicazione operativa dell’autore: da contestare su verbali amministrativi (VV).",
    "ref": "CdS art. 86 c. 3-bis; Regolamento comunale (delibera C.C. n. 80/2005), art. 6; art. 7; art. 23 c. 2 let. k; art. 29 c. 2 let. c e c. 4",
    "rate": "residual"
  },
  "Taxi/R02": {
    "code": "R02",
    "type": "Taxi",
    "ref": "CdS art. 86 c. 3-bis; Regolamento comunale (delibera C.C. n. 80/2005), art. 6 c. 4",
    "rate": "residual"
  },
  "Taxi/R03": {
    "code": "R03",
    "type": "Taxi",
    "ref": "CdS art. 86 c. 3-bis; Regolamento comunale (delibera C.C. n. 80/2005), art. 6 c. 4",
    "rate": "residual"
  },
  "Taxi/R05": {
    "code": "R05",
    "type": "Taxi",
    "ref": "CdS art. 86 c. 3-bis; Regolamento comunale (delibera C.C. n. 80/2005), art. 15 c. 1 e c. 2; art. 32",
    "rate": "residual"
  },
  "Taxi/R06": {
    "code": "R06",
    "type": "Taxi",
    "ref": "CdS art. 86 c. 3-bis; Regolamento comunale (delibera C.C. n. 80/2005), art. 15 c. 4",
    "rate": "residual"
  },
  "Taxi/R22": {
    "code": "R22",
    "type": "Taxi",
    "ref": "CdS art. 86 c. 3-bis; Regolamento comunale (delibera C.C. n. 80/2005), art. 23 c. 4; art. 7 c. 5",
    "rate": "residual"
  },
  "Taxi/R23": {
    "code": "R23",
    "type": "Taxi",
    "ref": "CdS art. 86 c. 3-bis; Regolamento comunale (delibera C.C. n. 80/2005), art. 23 c. 4",
    "rate": "residual"
  },
  "Taxi/R24": {
    "code": "R24",
    "type": "Taxi",
    "ref": "CdS art. 86 c. 3-bis; Regolamento comunale (delibera C.C. n. 80/2005), art. 23 c. 5; art. 29 c. 6",
    "rate": "residual"
  },
  "Taxi/R30": {
    "code": "R30",
    "type": "Taxi",
    "ref": "CdS art. 86 c. 3-bis; Regolamento comunale (delibera C.C. n. 80/2005), art. 5 c. 3; art. 30; art. 31 c. 1 let. a",
    "rate": "residual"
  },
  "Taxi/R35": {
    "code": "R35",
    "type": "Taxi",
    "ref": "CdS art. 86 c. 3-bis; Regolamento comunale (delibera C.C. n. 80/2005), art. 23 c. 6 let. a",
    "rate": "residual"
  },
  "Taxi/R37": {
    "code": "R37",
    "type": "Taxi",
    "ref": "CdS art. 86 c. 3-bis; Regolamento comunale (delibera C.C. n. 80/2005), art. 23 c. 6 let. c",
    "rate": "residual"
  },
  "Taxi/R38": {
    "code": "R38",
    "type": "Taxi",
    "ref": "CdS art. 86 c. 3-bis; Regolamento comunale (delibera C.C. n. 80/2005), art. 23 c. 6 let. d",
    "rate": "residual"
  },
  "NCC/G10": {
    "code": "G10",
    "type": "NCC",
    "ref": "CdS art. 85 c. 4-ter; Regolamento comunale (delibera C.C. n. 80/2005), art. 5 c. 3 let. g",
    "rate": "residual"
  },
  "NCC/G11": {
    "code": "G11",
    "type": "NCC",
    "ref": "CdS art. 85 c. 4-ter; Regolamento comunale (delibera C.C. n. 80/2005), art. 5 c. 7; art. 29 c. 2 let. a",
    "rate": "residual"
  },
  "NCC/G12": {
    "code": "G12",
    "type": "NCC",
    "ref": "CdS art. 85 c. 4",
    "rate": "severe"
  },
  "NCC/G13": {
    "code": "G13",
    "type": "NCC",
    "ref": "CdS art. 85 c. 4-ter; Regolamento comunale (delibera C.C. n. 80/2005), art. 16 c. 1; art. 29 c. 2 let. b",
    "rate": "residual"
  },
  "NCC/G14": {
    "code": "G14",
    "type": "NCC",
    "ref": "CdS art. 85 c. 4-ter; Regolamento comunale (delibera C.C. n. 80/2005), art. 16 c. 3 e c. 4",
    "rate": "residual"
  },
  "NCC/G32": {
    "code": "G32",
    "type": "NCC",
    "ref": "CdS art. 85 c. 4-ter; Regolamento comunale (delibera C.C. n. 80/2005), art. 23 c. 1 let. s; art. 23 c. 3",
    "rate": "residual"
  },
  "NCC/G44": {
    "code": "G44",
    "type": "NCC",
    "ref": "CdS art. 85 c. 4-ter; Regolamento comunale (delibera C.C. n. 80/2005), art. 6; art. 23 c. 2 let. k e c. 3; art. 29 c. 2 let. c e c. 4",
    "rate": "residual"
  },
  "NCC/I06": {
    "code": "I06",
    "type": "NCC",
    "ref": "CdS art. 85 c. 4 (se NCC senza titolo); L. 21/1992 art. 3; art. 8; L.R. 10/2024 art. 13-bis, introdotto da L.R. 7/2026",
    "rate": "severe",
    "requestedFormula": "Adibiva l’autovettura indicata a servizio professionale NCC per il trasferimento di ospiti della struttura […], dietro corrispettivo […], senza autorizzazione efficace, secondo il riscontro dell’ufficio […]. Modalità, uso del veicolo e fonti: […].",
    "formulaHeading": "Testo orientativo per la relazione"
  },
  "NCC/R02": {
    "code": "R02",
    "type": "NCC",
    "ref": "CdS art. 85 c. 4-ter; Regolamento comunale (delibera C.C. n. 80/2005), art. 6 c. 4",
    "rate": "residual"
  },
  "NCC/R03": {
    "code": "R03",
    "type": "NCC",
    "ref": "CdS art. 85 c. 4-ter; Regolamento comunale (delibera C.C. n. 80/2005), art. 6 c. 4",
    "rate": "residual"
  },
  "NCC/R05": {
    "code": "R05",
    "type": "NCC",
    "ref": "CdS art. 85 c. 4-ter; Regolamento comunale (delibera C.C. n. 80/2005), art. 15 c. 1 e c. 2; art. 32",
    "rate": "residual"
  },
  "NCC/R06": {
    "code": "R06",
    "type": "NCC",
    "ref": "CdS art. 85 c. 4-ter; Regolamento comunale (delibera C.C. n. 80/2005), art. 15 c. 4",
    "rate": "residual"
  },
  "NCC/R22": {
    "code": "R22",
    "type": "NCC",
    "ref": "CdS art. 85 c. 4-ter; Regolamento comunale (delibera C.C. n. 80/2005), art. 23 c. 4",
    "rate": "residual"
  },
  "NCC/R23": {
    "code": "R23",
    "type": "NCC",
    "ref": "CdS art. 85 c. 4-ter; Regolamento comunale (delibera C.C. n. 80/2005), art. 23 c. 4",
    "rate": "residual"
  },
  "NCC/R24": {
    "code": "R24",
    "type": "NCC",
    "ref": "CdS art. 85 c. 4-ter; Regolamento comunale (delibera C.C. n. 80/2005), art. 23 c. 5; art. 29 c. 6",
    "rate": "residual"
  },
  "NCC/R30": {
    "code": "R30",
    "type": "NCC",
    "ref": "CdS art. 85 c. 4-ter; Regolamento comunale (delibera C.C. n. 80/2005), art. 5 c. 3; art. 30; art. 31 c. 1 let. a",
    "rate": "residual",
    "formulaHeading": "Testo orientativo per la relazione",
    "requestedFormula": "Per il titolare […] dell’autorizzazione NCC n. […] non risultava più presente il requisito […]. Fonte, decorrenza e accertamento: […]. La licenza è ritirata e sarà inviata all’Ufficio Corso Pubblico con copia del presente verbale."
  },
  "NCC/I04": {
    "code": "I04",
    "type": "NCC",
    "ref": "CdS art. 85 c. 4-bis (se servizio in violazione degli artt. 3 e 11); L. 21/1992 art. 3; art. 11; L.R. 10/2024 art. 4 c. 3",
    "rate": "ncc-bis",
    "formulaHeading": "Testo orientativo per la relazione",
    "requestedFormula": "La rimessa dichiarata per l’autorizzazione NCC n. […] non risultava effettiva secondo il sopralluogo […] e il titolo di disponibilità […]. Copia del presente verbale sarà inviata all’Ufficio Corso Pubblico."
  },
  "NCC/I05": {
    "code": "I05",
    "type": "NCC",
    "ref": "CdS art. 85 c. 4-ter; L.R. 10/2024 art. 19-bis introdotto dalla L.R. 7/2026",
    "rate": "residual",
    "formulaHeading": "Testo orientativo per la relazione",
    "requestedFormula": "Sul veicolo indicato, con autorizzazione NCC n. […] rilasciata il […], il contrassegno regionale presentava la difformità […] o non esposto in maniera ben visibile. Copia del presente verbale sarà inviata all’Ufficio Corso Pubblico."
  },
  "NCC/R04": {
    "code": "R04",
    "type": "NCC",
    "ref": "CdS art. 85 c. 4-ter; Regolamento comunale (delibera C.C. n. 80/2005), art. 6 c. 5; art. 29 c. 2 let. a",
    "rate": "residual"
  },
  "NCC/R33-01": {
    "code": "R33-01",
    "type": "NCC",
    "formulaHeading": "Testo orientativo del verbale",
    "requestedFormula": "Il titolare […] dell’autorizzazione NCC n. […] utilizzava il veicolo indicato, in attesa in […], per acquisire clientela sul posto senza prenotazione, come riscontrato mediante […]. Il documento di circolazione è ritirato e sarà trasmesso con copia del verbale all’UMC entro cinque giorni. Permesso di trasferimento, fermo e custodia sono documentati negli atti separati […]. La licenza viene ritirata e sarà inviata all’Ufficio Corso Pubblico con copia del presente verbale."
  },
  "NCC/R33-02": {
    "code": "R33-02",
    "type": "NCC",
    "formulaHeading": "Testo orientativo del verbale",
    "requestedFormula": "Il titolare […] dell’autorizzazione NCC n. […] utilizzava il veicolo indicato, in attesa in […], per acquisire clientela sul posto senza prenotazione, come riscontrato mediante […]. Seconda violazione nel quinquennio, primo verbale [estremi primo verbale]. Il documento di circolazione è ritirato e sarà trasmesso con copia del verbale all’UMC entro cinque giorni. Permesso di trasferimento, fermo e custodia sono documentati negli atti separati […]. La licenza viene ritirata e sarà inviata all’Ufficio Corso Pubblico con copia del presente verbale."
  },
  "NCC/R33-03": {
    "code": "R33-03",
    "type": "NCC",
    "formulaHeading": "Testo orientativo del verbale",
    "requestedFormula": "Il titolare […] dell’autorizzazione NCC n. […] utilizzava il veicolo indicato, in attesa in […], per acquisire clientela sul posto senza prenotazione, come riscontrato mediante […]. Terza violazione nel quinquennio, primo verbale [estremi secondo verbale]. Il documento di circolazione è ritirato e sarà trasmesso con copia del verbale all’UMC entro cinque giorni. Permesso di trasferimento, fermo e custodia sono documentati negli atti separati […]. La licenza viene ritirata e sarà inviata all’Ufficio Corso Pubblico con copia del presente verbale."
  },
  "NCC/R33-04": {
    "code": "R33-04",
    "type": "NCC",
    "formulaHeading": "Testo orientativo del verbale",
    "requestedFormula": "Il titolare […] dell’autorizzazione NCC n. […] utilizzava il veicolo indicato, in attesa in […], per acquisire clientela sul posto senza prenotazione, come riscontrato mediante […]. Quarta o successiva violazione nel quinquennio, primo verbale [estremi Terzo o successivo verbale]. Il documento di circolazione è ritirato e sarà trasmesso con copia del verbale all’UMC entro cinque giorni. Permesso di trasferimento, fermo e custodia sono documentati negli atti separati […]. La licenza viene ritirata e sarà inviata all’Ufficio Corso Pubblico con copia del presente verbale."
  }
};
 const residual=['Condizione del titolo — comma indicato dall’autore','86–338','86','60,20','169','Non previste'];
 const severe=['Servizio senza titolo efficace','1.812–7.249','Non ammesso','Non applicabile','Procedura Prefetto','Confisca; patente 4–12 mesi'];
 const paymentNote='Limiti €86–338; PMR €86 entro 60 giorni, €60,20 entro 5 giorni ex art. 202 CdS; oltre 60 giorni €169 (metà del massimo, art. 203 c. 3), oltre spese, se non proposto ricorso. Nessuna accessoria CdS o punto patente per questo comma.';
 // Le osservazioni sulla qualificazione sono conservate nel rapporto locale separato.
 // Qui si eliminano soltanto condizioni/qualificazioni incompatibili con l’applicazione richiesta.
 const noteReplacements={
  R14:['Responsabile della procedura di assegnazione: concessionario. Art. 18 c. 8 let. c: decadenza della licenza di scorta per inosservanza dell’ordine, da accertare e disporre dall’ufficio.'],
  R15:['Responsabile della concessione: concessionario. Art. 18 c. 8 let. d: decadenza per violazione dei divieti del c. 6, riservata all’ufficio.'],
  R20:['Identificare officina, tipo di intervento e mancanza dell’autorizzazione.'],
  'G28-02':['La pagina comunale acquisita indica la consegna della ricevuta prima della partenza per la tariffa predeterminata. Gli integrali D.D. 72/2012 e 135/2010 restano non acquisiti; osservazioni documentali nel rapporto locale separato.'],
  'G28-04':['Individuare i campi obbligatori pertinenti al servizio e la fonte che li prescrive; non imporre cumulativamente dati di tariffa ordinaria e predeterminata. Gli integrali D.D. 72/2012 e 135/2010 restano non acquisiti.'],
  R24:['Acquisire atto del gestore, ambito, efficacia e prescrizione concretamente violata.'],
  R30:['Indicare requisito, fonte, decorrenza e titolo interessato. Art. 30: requisito dell’art. 5 c. 1 let. a; art. 31 c. 1 let. a: revoca di competenza dell’ufficio. Sospensione e revoca non sono provvedimenti disposti dagli operatori.'],
  R35:['Responsabile della condotta descritta: utente. Selezionare soltanto fumo oppure consumo di cibo secondo il fatto accertato.'],
  R37:['Responsabile della condotta descritta: utente. Individuare la persona e documentare il fatto.'],
  R38:['Responsabile della condotta descritta: utente. Nel testo comunale le let. c e let. d sono tipograficamente spezzate: descrivere la richiesta concreta e la norma di sicurezza pertinente.']
 };
 const cache=new Map();
 w.prontuarioUltimeDefinition=(item,type,base)=>{
  const c=changes[type+'/'+item.code];if(!c)return base;const key=type+'/'+item.code;if(cache.has(key))return cache.get(key);
  let m=base?clone(base):null;
  if(!m&&['G46','G47','G48','G55'].includes(item.code)){const v=w.prontuarioUltimeLegacyView(item,type)||{parts:[item.formula],normative:item.ref,notes:[],pdfNotes:[]};m={code:item.code,type,title:item.title,formula:v.parts[0],options:[],category:'relation',payment:item.payments[0],ref:v.normative,notes:clone(v.notes),responsibility:v.responsibility||'',acts:[],close:false,relation:true,group:item.group||'',sourceIndices:item.sourceIndices||[],sourceIndex:item.sourceIndices?.[0]};
   if(item.code==='G46'||item.code==='G48'){const variants=v.pdfNotes.find(n=>n.startsWith('Condotte alternative,'))?.split(': ').slice(1).join(': ').split(' / ')||[];m.options=variants.map((text,i)=>({label:item.code==='G46'?['Posizione','Disco e posizione'][i]:['Vetro posteriore','Entrambi i vetri'][i],text}));}
  }
  if(!m)return base;
  // Una modifica dei riferimenti/importi conserva il testo base già visibile.
  if(c.rate&&m.relation)m.close=false;
  if(c.ref){m.ref=c.ref;m.category=c.rate;m.payment=clone(c.rate==='severe'?severe:residual);m.conditionalRelation=false;
   // Rimuove alternative di qualificazione, preserva le alternative fattuali.
   m.options=m.options.filter(o=>!o.category||!(/presupposti CdS|condizione del titolo|condizione dell’autorizzazione/.test(o.label))).map(o=>{const v=clone(o);delete v.category;delete v.payment;return v;});
   m.notes=m.notes.filter(n=>!/La sola violazione del regolamento non basta|Regime generale comunale:|Omissione comunale:|Art.85 c.4-ter:|La scelta CdS sostituisce|Formula per relazione: aggiungere|Prima di contestare acquisire obbligo NCC|La sola omissione del titolare non integra|La mancata comunicazione, anche se emersa|Mancato avvio significa omissione|La mera comunicazione omessa non integra|La comunicazione omessa non prova|Non ricavare importi|Importi e ritiro non automatici/.test(n));
   if(noteReplacements[item.code]){const common=m.notes.filter(n=>/^Ambito/.test(n));m.notes=[...common,...noteReplacements[item.code]];}
   m.notes=m.notes.map(n=>n.replace(' Non sanzionare il titolare con art.86 per una mera omissione senza guida.','').replace(' Non aggiungere automaticamente ritiro o art.86/85 alla sola mancata comunicazione.','').replace('; l’omesso avvio non equivale a guida taxi o utilizzo NCC ex CdS.','.').replace(' Omissione comunale distinta dall’eventuale guida, non art.85 c.4-ter automatico.','').replace(' Sola titolarità o omissione del titolare non bastano per art.85 c.4-ter.',''));
   if(item.code==='R06')m.notes=[...m.notes.filter(n=>/^Ambito/.test(n)),'Art. 15 c. 4: dieci giorni dall’immatricolazione, salvo giustificazione; decadenza di competenza dell’ufficio. Il dubbio documentale sull’ambito NCC resta nel rapporto separato.'];
   if(c.rate==='residual')m.notes.push(paymentNote);
  }
  if(c.formulaHeading)m.formulaHeading=c.formulaHeading;
  if(item.code==='G12'){
   const ncc=type==='NCC',noun=ncc?'autorizzazione NCC':'licenza C.P.';
   const originalOptions=base.options;
   m.formula=ncc?originalOptions[0].text:c.requestedFormula.replace('[sospesa/revocata]','sospesa').replace(/ Copia del presente verbale sarà inviata all’Ufficio Corso Pubblico\.$/,'');
   m.options=[{label:'Servizio con '+noun+' revocata',text:ncc?originalOptions[1].text:m.formula.replace(' sospesa dal',' revocata dal')}];m.category='severe';m.payment=clone(severe);m.close=true;
   m.notes=m.notes.filter(n=>!/formula base resta relazione|relazione generica/.test(n));m.notes.push('Selezionare soltanto titolo sospeso oppure revocato. Identici limiti €1.812–7.249; PMR escluso per la confisca (art. 210 c. 3 CdS), nessuno sconto entro 5 giorni, nessun importo automatico ex art. 203 oltre 60 giorni: procedura al Prefetto.');
  }
  if(c.requestedFormula&&!['G12','I05','R30'].includes(item.code)&&!item.code.startsWith('R33-')){m.formula=c.requestedFormula.replace('dal comune,','dal Comune,').replace(/ Copia del presente verbale sarà inviata all’Ufficio Corso Pubblico\.$/,'');m.close=/ Copia del presente verbale sarà inviata/.test(c.requestedFormula);}
  if(item.code==='G28-02'||item.code==='I06')m.options=[];
  if(item.code==='I05'){m.formula='Sul veicolo indicato, con autorizzazione NCC n. […] rilasciata il […], il contrassegno regionale presentava la difformità […].';m.options=[{label:'Contrassegno non esposto in maniera ben visibile',text:'Sul veicolo indicato, con autorizzazione NCC n. […] rilasciata il […], il contrassegno regionale non era esposto in maniera ben visibile.'}];m.close=true;}
  if(item.code==='R30'&&type==='NCC'){m.formula='Per il titolare […] dell’autorizzazione NCC n. […] non risultava più presente il requisito […]. Fonte, decorrenza e accertamento: […].';m.close=false;m.acts=[{id:'titolo',title:'Autorizzazione NCC materialmente ritirata',text:'L’autorizzazione è ritirata e sarà inviata all’Ufficio Corso Pubblico con copia del presente verbale.'}];}
  if(item.code==='I04'){
   m.category='ncc-bis';m.bandSelection=true;m.baseLabel='Prima violazione';
   const bands=[['Prima','178–672','178','124,60','336','Carta 1 mese'],['Seconda','264–1.010','264','184,80','505','Carta 1–2 mesi'],['Terza','356–1.344','356','249,20','672','Carta 2–4 mesi'],['Quarta o successiva','528–2.020','528','369,60','1.010','Carta 4–8 mesi']];
   m.payment=bands[0];m.options=bands.slice(1).map((payment,i)=>({label:payment[0]+' violazione',text:m.formula,category:'ncc-bis-'+(i+2),payment}));
   m.notes=m.notes.filter(n=>!/^Sede operativa/.test(n));m.notes.push('Sede operativa e almeno una rimessa fisica nel Comune autorizzante; ulteriori rimesse nella stessa Provincia o Città metropolitana previa comunicazione.','Condizione indicata dall’autore: servizio in violazione degli artt. 3 e 11 L. 21/1992. Fascia del medesimo veicolo nel quinquennio; quattro tabelle N04–N07. PMR al minimo ex art. 202 CdS; riduzione del 30% entro 5 giorni ammessa per la sospensione del documento di circolazione. Oltre 60 giorni metà del massimo ex art. 203 c. 3, oltre spese se non proposto ricorso.');
  }
  if(item.code==='G55')m.notes=['Condotta distinta dalla sosta a scopo di nolo fuori posteggio G43 e dall’ordine di fila G24.',paymentNote];
  if(item.code.startsWith('R33-')){
   const n=Number(item.code.slice(-2)),lead=c.requestedFormula.split(' Il documento di circolazione')[0].split(/ Seconda violazione| Terza violazione| Quarta o successiva violazione/)[0];
   const prior=['','Seconda violazione nel quinquennio per il medesimo veicolo; primo verbale: […].','Terza violazione nel quinquennio per il medesimo veicolo; primo verbale: […]; secondo verbale: […].','Quarta o successiva violazione nel quinquennio per il medesimo veicolo; estremi del primo, secondo, terzo e degli eventuali ulteriori verbali precedenti pertinenti: […].'];
   m.formula=[lead,prior[n-1]].filter(Boolean).join(' ');m.napoliCondition=true;m.close=false;
   m.acts=[{id:'documento',title:'Documento di circolazione materialmente ritirato',text:'Il documento di circolazione è ritirato e sarà trasmesso con copia del verbale all’UMC entro cinque giorni.'},{id:'atti-veicolo',title:'Permesso di trasferimento, fermo e custodia documentati negli atti separati',text:'Permesso di trasferimento, fermo e custodia sono documentati negli atti separati […].'},{id:'titolo-napoli',condition:'napoli',title:'Solo titolo del Comune di Napoli: autorizzazione comunale materialmente ritirata',text:'L’autorizzazione NCC viene ritirata e sarà inviata all’Ufficio Corso Pubblico con copia del presente verbale.'}];
   m.notes.push('Ritiro dell’autorizzazione comunale richiesto dall’autore esclusivamente per titoli rilasciati dal Comune di Napoli. Gli adempimenti CdS sul documento di circolazione e sul veicolo restano autonomi e valgono anche per titoli di altri Comuni.');
  }
  if(c.addNote)m.notes.push(c.addNote);
  m.reviewLabel='Revisione 1.8.16: decisioni dell’autore applicate. Osservazioni normative e documenti mancanti conservati nel rapporto locale separato; nessuna attestazione di validazione aggiunta.';
  m.relation=m.category==='relation';cache.set(key,m);return m;
 };
 w.prontuarioUltimeFollowup=(item,type,choice,f)=>{
  const c=changes[type+'/'+item.code];if(!c)return f;const m=cache.get(type+'/'+item.code);f=clone(f);
  if(c.rate==='residual'){f.cds='Il comma richiesto non prevede sanzioni accessorie CdS né punti patente; seguito comunale distinto.';if(/^Redigere relazione;/.test(f.operators))f.operators='Accertare condotta, soggetto e fonte; documentare gli atti effettivi.';}
  if(item.code==='R30'&&type==='NCC'){f.operators='Ritirare l’autorizzazione NCC e inviarla all’Ufficio Corso Pubblico con copia del verbale, secondo l’indicazione dell’autore. Inserire l’attestazione del ritiro nella copia soltanto dopo conferma dell’esecuzione materiale.';f.report='Autorizzazione NCC e copia del verbale all’Ufficio Corso Pubblico.';}
  if(item.code==='I04'){const payment=choice>0?m.options[choice-1].payment:m.payment;f.cds='Sospensione del documento di circolazione: '+payment[5].replace('Carta ','')+'.';f.operators='Ritirare il documento di circolazione e inviarlo con copia del verbale all’UMC entro cinque giorni; permesso di trasferimento, fermo per la durata della sospensione e custodia con atti separati. Attestare soltanto attività materialmente eseguite.';f.report='Documento di circolazione e copia del verbale all’UMC; copia del verbale e fatti pertinenti sul titolo all’Ufficio Corso Pubblico.';}
  if(item.code.startsWith('R33-')){f.operators+=' Per la sola autorizzazione rilasciata dal Comune di Napoli, ritirare il titolo comunale e inviarlo all’Ufficio Corso Pubblico con copia del verbale, secondo l’indicazione operativa dell’autore. Per titoli di altri Comuni questa clausola non si applica. Documento/UMC, trasferimento, fermo e custodia restano indipendenti dal Comune emittente.';f.report+=' Autorizzazione del Comune di Napoli: Ufficio Corso Pubblico; documento di circolazione: UMC.';}
  return f;
 };
 w.prontuarioUltime={changes};
})();
