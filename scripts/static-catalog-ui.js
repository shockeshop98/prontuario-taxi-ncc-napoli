(function () {
  const finalSentence = "Copia del presente verbale verrà inviata all'Ufficio Corso Pubblico.";
  const actText = {
    patente: ['Ritiro della patente', 'Ritirare la patente e trasmetterla alla Prefettura entro cinque giorni (art. 218 CdS). Stato ed estremi: […].'],
    sequestro: ['Sequestro del veicolo', 'Sequestrare ai fini della confisca con separato verbale (art. 213 CdS). Stato ed estremi: […].'],
    ritiro_documento: ['Trattenimento del documento di circolazione', 'Documentare il trattenimento del documento nel procedimento di sequestro. Stato ed estremi: […].'],
    custodia: ['Affidamento in custodia', 'Individuare custode e luogo secondo l’art. 213 CdS; documentare affidamento e condizioni con separato verbale. Stato ed estremi: […].'],
    revoca: ['Comunicazione dei presupposti di revoca', 'Comunicare al Prefetto entro cinque giorni i presupposti ex art. 219 CdS; la revoca compete al Prefetto. Stato ed estremi: […].'],
    sospensione: ['Ritiro, trasferimento e fermo', 'Ritirare il documento e inviarlo all’UMC entro cinque giorni; documentare permesso di trasferimento, fermo per la durata della sospensione e custodia (artt. 214 e 217 CdS). Stato ed estremi: […].']
  };
  const specificActs = {
    G02: ['sequestro','ritiro_documento','custodia','revoca'],
    I02: ['patente','sequestro','ritiro_documento','custodia'],
    N01: ['patente','sequestro','ritiro_documento','custodia'],
    N02: ['revoca','sequestro','ritiro_documento','custodia'],
    N03: ['revoca','sequestro','ritiro_documento','custodia'],
    N12: ['patente','sequestro','ritiro_documento','custodia']
  };
  const amount = value => /\d/.test(value) && !/[A-Za-z]/.test(value) ? `€ ${value}` : value;
  const previous = (item, type) => {
    const index = item.staticVariantIndex;
    if (index === undefined) return '';
    const subject = type === 'NCC' ? 'del medesimo veicolo' : 'del titolare della licenza';
    if (index === 0) return `Da accertamento presso […] del […] non risultavano precedenti pertinenti ${subject} nel quinquennio.`;
    const count = ['','Un precedente pertinente','Due precedenti pertinenti','Almeno tre precedenti pertinenti'][index];
    const source = index === 1 ? 'dal verbale n. […], per il fatto del […], accertato da […]' : 'dai verbali n. […], per i fatti del […], accertati da […]';
    return `${count} ${subject} nel quinquennio ${index === 1 ? 'risultava' : 'risultavano'} ${source}, come da riscontro […].`;
  };
  window.prontuarioCatalogPrevious = previous;
  window.prontuarioCatalogActs = item => {
    const baseCode = item.demoBaseCode || item.code;
    const ids = specificActs[baseCode] || (['taxi3','ncc3'].includes(item.kind) || ['N04','N05','N06','N07'].includes(baseCode) ? ['sospensione'] : []);
    return ids.map(id => ({title:actText[id][0],text:baseCode==='G07'&&id==='sospensione'
      ?actText[id][1].replace('fino a […], con l’avvertenza','fino a […], luogo indicato dall’interessato, con l’avvertenza')
      :actText[id][1]}));
  };
  window.prontuarioCatalogCopyText = formula => window.prontuarioCopyFormulaParts(formula);
  window.prontuarioCatalogIsRelation = item => item.referenceOnly || item.code === 'I06' || ['review','ordinance'].includes(item.kind);
  window.prontuarioCatalogProvision = (item,type) => {
    if(window.prontuarioCatalogIsRelation(item))return '';
    const ref=item.verbaleRef||item.ref||'';
    if(item.kind==='taxi3'||item.code==='G02')return '';
    if((item.demoBaseCode||item.code)==='R33')return 'L.21/1992 art.11 c.3';
    if(item.code==='N09')return 'L.218/2003 art.5 c.5';
    if(item.kind==='local'&&ref.includes('Regolamento comunale')){
      const part=ref.slice(ref.indexOf('Regolamento comunale')).split(';')[0];
      return type==='NCC'&&ref.includes('c.3 per NCC')?`${part}, comma 3 per NCC`:part;
    }
    if(item.kind==='ordinance')return '';
    if(item.kind==='review')return '';
    return ref.split(';')[0];
  };
  const legalCitation = source => source
    .replace(/\bartt?\.\s*/g,match=>match.startsWith('artt')?'artt. ':'art. ')
    .replace(/\bcc\.(\d+)/g,'commi $1')
    .replace(/\bc\.(\d+[\w-]*)\s+([a-z])(?=\s+e\s+c\.|,|$)/g,'comma $1, lett. $2')
    .replace(/\bc\.(\d+[\w-]*)/g,'comma $1')
    .replace(/\blett\.\s*/g,'lett. ')
    .replace(/(comma \d+[\w-]*)\s+(lett\.)/g,'$1, $2')
    .replace(/\b(artt?\.\s*\d+)\s+(?=comma|commi)/g,'$1, ');
  window.prontuarioCatalogLegalSentence = (item,type) => window.prontuarioLegalText(item,type);
  window.prontuarioCatalogOperational = item => {
    if(window.prontuarioCatalogIsRelation(item))return '';
    return window.prontuarioActStatus(item);
  };
  window.prontuarioCatalogAccessoryText = value => /^Carta (.+)$/.test(value) ? `Sospensione del documento di circolazione per ${value.slice(6)}.` : value;
  const municipalByGroup = {
    a:'Art. 29, comma 2, lett. a: diffida alla prima violazione; sospensione di 5 giorni alla seconda, 15 alle successive, da disporre dall’ufficio dopo riscontro della fascia.',
    b:'Art. 29, comma 2, lett. b: sospensione di 15, 30 o 60 giorni secondo la fascia verificata; provvedimento dell’ufficio. Nessun ritiro immediato del titolo (comma 4).',
    c:'Art. 29, comma 2, lett. c: sospensione di 15, 30 o 60 giorni secondo la fascia verificata; provvedimento dell’ufficio. Ritiro obbligatorio del titolo da parte degli operatori ex comma 4, accertata la violazione.',
    d:'Art. 29, comma 2, lett. d: sospensione di 30 o 60 giorni secondo la fascia verificata; provvedimento dell’ufficio. Ritiro obbligatorio del titolo da parte degli operatori ex comma 4, accertata la violazione.'
  };
  const pointsByGroup = {
    b:'5 punti sul titolo Taxi/NCC dalle violazioni successive alla prima, dopo riscontro della fascia.',
    c:'10 punti sul titolo Taxi/NCC, secondo il seguito comunale pertinente.',
    d:'20 o 30 punti sul titolo Taxi/NCC secondo la fascia verificata.'
  };
  window.prontuarioCatalogAccessorySections = (item,type) => {
    const original=item.payments[0][5]||'';
    const cdsMeasure=/^(?:Carta\b|Confisca\b|Sospensione del documento di circolazione\b|Nessuna accessoria CdS\b)/.test(original);
    const roleFollowup=['N04','N05','N06','N07'].includes(item.code);
    const other=item.code==='G54'
      ?'Comunicazioni art. 21, comma 2, L.R. Campania 10/2024'
      :roleFollowup?'Segnalazione a Comune e CCIAA per gli eventuali provvedimenti sul ruolo, distinta dalla misura CdS.'
      :!cdsMeasure&&!/^Nessuna\b/.test(original)?original:'';
    return {
      cds:item.staticModelCode?.startsWith('G28-')?'Non previste':cdsMeasure?window.prontuarioCatalogAccessoryText(original):'Non previste',
      municipal:item.staticModelCode?.startsWith('G28-')
        ?'Eventuale seguito disciplinare da definire dall’ufficio competente; nessun gruppo o provvedimento preimpostato.'
        :item.group ? municipalByGroup[item.group] : 'Nessuna misura comunale applicata automaticamente; verificare il seguito nelle note operative.',
      other,
      points:item.group ? pointsByGroup[item.group]||'Nessun punto comunale indicato per questo gruppo.' : 'Nessun punto precompilato in questa scheda.'
    };
  };
  const clarifiedNotes = {
    G12: {
      0:'Il prontuario originario associava automaticamente un importo e il ritiro della licenza: verificare invece la base e il seguito applicabili al caso concreto.'
    },
    N01: {
      0:'Riscontrare un autobus già immatricolato per NCC e un’autorizzazione sospesa o revocata. Per autobus di uso diverso vedere N12. [EGAF note 1 e 6]'
    },
    N02: {
      0:'Riscontrare un autobus già immatricolato per NCC e un’autorizzazione sospesa o revocata. Per autobus di uso diverso vedere N12. [EGAF note 1 e 6]'
    },
    N10: {
      1:'Il pagamento in misura ridotta segue il criterio della L. 689/1981; non applicare la riduzione CdS del 30%. [EGAF nota 26]'
    },
    N12: {
      0:'Per autobus di uso privato o di linea impiegato nel noleggio senza titolo si applica la fascia ordinaria indicata da EGAF. Verificare anche la disciplina della distrazione dal servizio di linea; non duplicare automaticamente sanzioni per lo stesso fatto. [EGAF nota 1]'
    },
    I06: {
      0:'Raccogliere modalità concrete del trasferimento, collegamento al soggiorno, titolo e risposta dell’ufficio prima di qualificare una violazione.',
      2:'Questa formula serve alla relazione sui fatti ancora da qualificare. Una contestazione richiede una base normativa e presupposti autonomamente verificati.'
    }
  };
  for(const code of ['R39','R40','R41','R42'])clarifiedNotes[code]={
    2:'Segnalazione al Corso Pubblico: trasmettere all’ufficio, tramite l’Ufficio Verbali, soltanto i fatti e gli atti pertinenti al servizio a trazione animale.',
    3:'Scheda di solo riferimento: la relazione descrive i fatti; un’eventuale contestazione richiede una base specifica verificata.'
  };
  const addedNotes = {
    G04:[
      'Tariffario ufficiale della delibera G.C. n. 258 del 27/06/2024: il supplemento Minivan è € 5 complessivi per vettura quando i passeggeri sono più di quattro oppure l’utente chiede espressamente una vettura da 7–9 posti. Se entrambe le condizioni ricorrono, il supplemento resta uno solo.',
      'Le tariffe predeterminate, da richiedere all’inizio della corsa, comprendono radio taxi, notturno, festivo, bagagli, animali e aeroporto. Sono esclusi i pedaggi autostradali e il supplemento Minivan di € 5. Verificare tratta e richiesta; non sommare G04 e G08 per il medesimo prezzo.',
      'Nell’extraurbana ordinaria con ritorno a vuoto il prezzo è il doppio del valore mostrato dal tassametro tarato alla tariffa ridotta del 50%; gli eventuali supplementi restano a carico del cliente e vanno individuati separatamente, senza presumere che siano raddoppiati. Non applicare questo criterio alle tariffe predeterminate.'
    ],
    G08:['Per la tariffa predeterminata richiesta all’inizio e per i supplementi, usare il tariffario della delibera G.C. n. 258/2024. Non duplicare G04 e G08 per lo stesso episodio; il raddoppio dell’extraurbana ordinaria con ritorno a vuoto riguarda l’importo del tassametro ridotto, non la tariffa predeterminata.'],
    G50:['Sulla tratta Aeroporto–Stazione Centrale–Molo Beverello l’O.D. n. 1/2019 indica anche la partenza dopo 15 minuti dall’arrivo dei primi tre passeggeri. Il rapporto con il limite di cinque minuti dell’art. 19, comma 4, richiede chiarimento dell’ufficio: rilevare separatamente arrivo, salita e partenza, senza presumere la violazione.'],
    G02:['Accertare separatamente se la licenza non è stata conseguita, è sospesa o è revocata; l’ufficio deve chiarire l’assenza di un titolo che legittimi il servizio con questo veicolo. Il precedente incompleto non prova la reiterazione: documentare il fatto attuale senza attribuirgli automaticamente una fascia.'],
    G07:['I07 è un rinvio a queste fasce. Il tariffario comunale contiene anche i supplementi: descrivere l’assenza o la copertura del prospetto soltanto quando rende non chiaramente leggibili gli avvisi richiesti dalla L. 21/1992, art. 12, comma 2. Le sole ulteriori difformità comunali richiedono qualificazione separata e non ricevono automaticamente gli importi G07.'],
    I02:['Titolo e destinazione d’uso sono verifiche distinte. Se entrambe le irregolarità sono accertate, descrivere entrambi i fatti senza duplicare automaticamente la sanzione; una verifica pendente va soltanto nella relazione. Il trattamento del solo uso non conforme resta un quesito da validare con l’Ufficio Verbali.'],
    N02:['Per la conseguenza sulla patente, verificare identità e ruolo della persona interessata nel fatto attuale e nel precedente: la sola coincidenza dell’impresa, del titolare o dell’obbligato in solido non basta. Se il precedente è incompleto, documentare il fatto attuale senza concludere sulla reiterazione e senza attribuirgli automaticamente la prima fascia.'],
    N03:['Per la conseguenza sulla patente, verificare identità e ruolo della persona interessata nel fatto attuale e nel precedente: la sola coincidenza dell’impresa, del titolare o dell’obbligato in solido non basta. Se il precedente è incompleto, documentare il fatto attuale senza concludere sulla reiterazione e senza attribuirgli automaticamente la prima fascia.']
  };
  window.prontuarioCatalogNotes = (item, model) => {
    const code=item.demoBaseCode||item.code;
    const confisca=item.payments[0]?.[2]==='Non ammesso'&&/confisca/i.test(item.payments[0]?.[5]||'');
    const procedure=confisca?['Il verbale va trasmesso entro 10 giorni al Prefetto del luogo della commessa violazione, ai sensi dell’art. 210, comma 3, CdS.']:[];
    return [...new Set([...item.notes.map((note,index)=>clarifiedNotes[code]?.[index]||note),...(model.notes||[]),...(addedNotes[code]||[]),...procedure])];
  };
  window.prontuarioCatalogRoute = item => item.group ? 'Segnalazione obbligatoria alle condizioni indicate nel riquadro; compilare stato e protocollo senza attestare invii non eseguiti.' : item.route||'';
  window.prontuarioCatalogFormulaMarkup = (item,type,esc) => {
    const model=window.prontuarioCatalogModel(item,type);
    const legal=window.prontuarioCatalogLegalSentence(item,type);
    const generatedPrior=previous(item,type);
    const relation=window.prontuarioCatalogIsRelation(item);
    const final=window.prontuarioFollowupFormula(item);
    const operational=window.prontuarioCatalogOperational(item);
    const priorStart=model.tail.search(/(?:Da accertamento presso|Il precedente pertinente|Un precedente pertinente|Due precedenti pertinenti|Almeno tre precedenti pertinenti)/);
    const evidenceText=(priorStart<0?model.tail:model.tail.slice(0,priorStart)).trim();
    const embeddedPrior=priorStart<0?'':model.tail.slice(priorStart).trim();
    const ending=[legal,model.tail,generatedPrior,operational,final].filter(Boolean).join(' ');
    const lead=window.prontuarioRenderFormulaPart(model.lead,[],esc);
    const main=`<p class="staticChoiceHint">Utilizzare la voce pertinente.</p><ul class="staticFormulaChoices" aria-label="Circostanza pertinente">${[...model.options,model.other].map(option=>`<li>${esc(option)}</li>`).join('')}</ul>`;
    const evidenceHint=window.prontuarioEvidenceHints(item.staticModelCode||item.demoBaseCode||item.code);
    const extraEvidence=evidenceText&&evidenceText.includes('[…]')?'':window.prontuarioRenderHint(evidenceHint,esc);
    const priorHints=text=>[window.prontuarioPriorOfficeHints(),...(/precedent[ei] pertinent[ei]/.test(text)&&!/non risultavano/.test(text)?[window.prontuarioPriorDetailHints(item,type)]:[])];
    const annotations=[];
    if(evidenceText&&evidenceText.includes('[…]'))annotations.push({after:evidenceText,hint:evidenceHint});
    if(embeddedPrior)annotations.push({after:embeddedPrior,hint:priorHints(embeddedPrior)});
    if(generatedPrior)annotations.push({after:generatedPrior,hint:priorHints(generatedPrior)});
    const actHint=window.prontuarioActHints(item,window.prontuarioCatalogActs(item));
    if(operational&&actHint)annotations.push({after:operational,hint:actHint});
    return lead+main+extraEvidence+window.prontuarioRenderFormulaPart(ending,annotations,esc);
  };
  window.prontuarioCatalogBody = function (item, type, helpers) {
    const {esc,sourceLink,date,normative} = helpers;
    const model = window.prontuarioCatalogModel(item,type);
    if (item.payments.length !== 1) throw Error(`Scheda non separata: ${item.code}`);
    const row = item.payments[0];
    const lastHeading = row[4].startsWith('Procedura') ? 'Procedura' : row[4] === 'Da verificare' || row[4] === 'Secondo la base' ? 'Esito da verificare' : 'Oltre 60 giorni';
    const amounts = `<table class="staticAmountsTable"><caption>Importi in euro, spese escluse</caption><colgroup><col class="staticAmountShort"><col class="staticAmountShort"><col class="staticAmountLong"></colgroup><thead><tr><th scope="col"><abbr title="Pagamento in misura ridotta">PMR</abbr><small>Misura ridotta</small></th><th scope="col">Entro 5 giorni</th><th scope="col">${esc(lastHeading)}</th></tr></thead><tbody><tr><td>${esc(amount(row[2]))}</td><td>${esc(amount(row[3]))}</td><td>${esc(amount(row[4]))}</td></tr></tbody><tfoot><tr><th scope="row" colspan="2">Limiti edittali</th><td>${esc(amount(row[1]))}</td></tr></tfoot></table>`;
    const actItems = window.prontuarioCatalogActs(item);
    const operationalUse = actItems.length ? `<p class="staticOperationalUse">${esc(window.prontuarioOperationalUseNote)}</p>` : '';
    const relation=window.prontuarioCatalogIsRelation(item);
    const formula = `<div class="formulaText" id="formulaText">${window.prontuarioCatalogFormulaMarkup(item,type,esc)}</div>`;
    const caution = item.staticVariantIndex === 0 ? '<p class="staticCopyWarning">Usare la prima fascia soltanto dopo un riscontro negativo. Se la verifica è pendente, non attribuire automaticamente la prima violazione.</p>' : '';
    const notes = window.prontuarioCatalogNotes(item,model);
    const accessory=window.prontuarioCatalogAccessorySections(item,type);
    const noteList = `<ul class="operativeNotes">${notes.map(note=>`<li>${esc(note)}</li>`).join('')}</ul>`;
    const sourceButtons = `${item.pages.map(sourceLink).join('')}${(item.regPages||[]).map(page=>`<button class="small" onclick="openPDF(0,${page})">Regolamento p.${page}</button>`).join('')}`;
    const route=window.prontuarioCatalogRoute(item);
    return `<section class="caseBlock staticNormative"><h3>Riferimenti normativi — obblighi e sanzioni</h3><p>${esc(window.prontuarioNormative(item,type))}</p></section>
      <section class="caseBlock staticAmounts"><h3>Tabella importi</h3>${window.prontuarioIsResidual(item)?`<p class="qualificationWarning">${esc(relation?"Importi della sola ipotesi CdS: non costituiscono una qualificazione accertata.":"Importi applicabili soltanto alla condizione del titolo accertata; non a ogni violazione comunale.")}</p>`:""}${amounts}</section>
      <section class="caseBlock staticAccessories"><h3>Sanzioni accessorie e adempimenti</h3>${window.prontuarioFollowupMarkup(item,accessory,esc)}</section>
      <section class="caseBlock staticFormula"><h3>${relation?'Testo orientativo per la relazione':'Testo orientativo del verbale'}</h3>${formula}${operationalUse}${caution}<button class="small" id="copyFormula">Copia testo orientativo</button><p class="muted">Usare solo la voce pertinente. La copia non include gli elenchi dei suggerimenti.</p></section>
      <section class="caseBlock staticSuggestions"><h3>Suggerimenti e note operative</h3><h4>Condizioni e verifiche</h4>${noteList}${item.responsibility?`<h4>Responsabilità</h4><p>${esc(item.responsibility)}</p>`:''}${route?`<h4>Seguito operativo</h4><p>${esc(route)}</p>`:''}<details class="caseSource"><summary>Approfondimenti e fonti</summary><div class="detailbody">${item.legalBackground?.length?`<ul>${item.legalBackground.map(note=>`<li>${esc(note)}</li>`).join('')}</ul>`:''}<p>Fonti: ${esc(item.sources.join(', '))}.</p><div class="toolbar">${sourceButtons}</div></div></details></section>
      <p class="caseFoot"><b>A cura dell’Agente Antonio Balzano · U.O. San Lorenzo.</b><br>${esc(item.origin)} · Revisione documentale ${date(item.reviewed||item.checked)} · limiti nelle fonti</p>`;
  };
  window.copyProntuarioCatalog = async function (toast) {
    const formula=document.getElementById('formulaText');
    if (!formula) return;
    try {await navigator.clipboard.writeText(window.prontuarioCatalogCopyText(formula));toast('Testo orientativo copiato con i segnaposto.');}
    catch {toast('Copia non disponibile. Seleziona la formula e usa soltanto le voci pertinenti.');}
  };
})();
