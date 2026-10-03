(function () {
  const finalSentence = "Copia del presente verbale verrà inviata all'Ufficio Corso Pubblico.";
  const actText = {
    patente: ['Ritiro della patente', 'La patente n. […] è stata ritirata con verbale n. […] per la trasmissione alla Prefettura-UTG di […].'],
    sequestro: ['Sequestro del veicolo', 'Il veicolo indicato è stato sottoposto a sequestro amministrativo ai fini della confisca, come da separato verbale.'],
    ritiro_documento: ['Trattenimento del documento di circolazione', 'Il documento di circolazione è stato trattenuto come risulta dall’atto effettivamente eseguito n. […].'],
    custodia: ['Affidamento in custodia', 'Il veicolo indicato è stato affidato a […] per la custodia in […], come da separato verbale.'],
    revoca: ['Comunicazione dei presupposti di revoca', 'I presupposti per la revoca della patente sono stati comunicati alla Prefettura-UTG di […] con atto n. […].'],
    sospensione: ['Ritiro, trasferimento e fermo', 'Il documento di circolazione è stato ritirato e sarà trasmesso all’UMC di […] entro cinque giorni. Il conducente è stato autorizzato al trasferimento del veicolo per la via più breve fino a […], con l’avvertenza del fermo per la durata della sospensione del documento di circolazione, come da separato verbale.']
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
  window.prontuarioCatalogLegalSentence = (item,type) => {
    if(item.code==='I02')return '';
    if((item.demoBaseCode||item.code)==='G07')return '';
    if(item.code==='G53')return 'La condotta violava l’art. 15, commi 4 e 4-bis, del D.L. n. 179/2012, come modificato nel 2026.';
    if(item.code==='G16')return 'La condotta violava l’art. 17, comma 1, lett. e, e il comma 3 del regolamento comunale – delibera C.C. n. 80/2005.';
    if((item.demoBaseCode||item.code)==='R33'){
      const letter='abcd'[item.staticVariantIndex];
      return `La condotta violava l’art. 11, comma 3, della L. n. 21/1992 e l’art. 4, commi 8 e 10, del regolamento comunale – delibera C.C. n. 80/2005; era sanzionata dall’art. 85, comma 4-bis, lett. ${letter}, CdS.`;
    }
    const ref=window.prontuarioCatalogProvision(item,type);
    if(!ref)return '';
    if(ref.startsWith('Regolamento comunale')){
      let article=legalCitation(ref.slice(ref.indexOf('),')+2).trim());
      article=article.replace(/^art\.\s*(\d+)\s+e\s+(\d+)/,'artt. $1 e $2').replace(/^art\./,'l’art.').replace(/^artt\./,'gli artt.');
      article=article.replace(/, comma 3 per NCC$/,', applicabile al NCC ai sensi del comma 3');
      return `La condotta violava ${article} del regolamento comunale – delibera C.C. n. 80/2005.`;
    }
    if(ref.startsWith('CdS art.'))return `La condotta era sanzionata dall’${legalCitation(ref.slice(4))} del CdS.`;
    const law=ref.match(/^(.+?) art(t?)\.\s*(.+)$/);
    if(law){
      const source=law[1].startsWith('L.R.')?`della ${law[1]}`:law[1].startsWith('L.')?`della L. n. ${law[1].slice(2)}`:law[1].startsWith('D.L.')?`del D.L. n. ${law[1].slice(4)}`:`di ${law[1]}`;
      return `La condotta violava ${law[2]?'gli ':'l’'}${legalCitation(`${law[2]?'artt.':'art.'} ${law[3]}`)} ${source}.`;
    }
    return `La disposizione pertinente era ${ref}.`;
  };
  window.prontuarioCatalogOperational = item => {
    if(window.prontuarioCatalogIsRelation(item))return '';
    return window.prontuarioCatalogActs(item).map(act=>act.text).join(' ');
  };
  window.prontuarioCatalogAccessoryText = value => /^Carta (.+)$/.test(value) ? `Sospensione del documento di circolazione per ${value.slice(6)}.` : value;
  const municipalByGroup = {
    a:'Art. 29, comma 2, lett. a: diffida alla prima violazione; sospensione di 5 giorni alla seconda, 15 alle successive, da disporre dall’ufficio dopo riscontro della fascia.',
    b:'Art. 29, comma 2, lett. b: sospensione di 15, 30 o 60 giorni secondo la fascia verificata; provvedimento dell’ufficio. Nessun ritiro immediato del titolo (comma 4).',
    c:'Art. 29, comma 2, lett. c: sospensione di 15, 30 o 60 giorni secondo la fascia verificata; provvedimento dell’ufficio. Ritiro del titolo ex comma 4 solo se eseguito.',
    d:'Art. 29, comma 2, lett. d: sospensione di 30 o 60 giorni secondo la fascia verificata; provvedimento dell’ufficio. Ritiro del titolo ex comma 4 solo se eseguito.'
  };
  const pointsByGroup = {
    b:'5 punti sulla licenza taxi dalle violazioni successive alla prima, dopo riscontro della fascia.',
    c:'10 punti sulla licenza taxi, secondo il seguito comunale pertinente.',
    d:'20 o 30 punti sulla licenza taxi secondo la fascia verificata.'
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
      cds:cdsMeasure?window.prontuarioCatalogAccessoryText(original):'Non previste',
      municipal:item.group ? municipalByGroup[item.group] : 'Nessuna misura comunale applicata automaticamente; verificare il seguito nelle note operative.',
      other,
      points:item.group && type==='Taxi' ? pointsByGroup[item.group]||'Nessun punto comunale indicato per questo gruppo.' : item.group ? 'Punti comunali: verificare l’applicabilità al titolo NCC prima di riportarli.' : 'Nessun punto precompilato in questa scheda.'
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
  window.prontuarioCatalogRoute = item => {
    if(!item.group)return item.route||'';
    const route=(item.route||'').split(/Art\.29 c\.2 lett\.[a-d]:/)[0].trim();
    return route.includes('Ufficio Verbali')?route:`${route} Se trasmessa, documentare nel seguito interno la segnalazione all’Ufficio Verbali per il titolo comunale.`.trim();
  };
  window.prontuarioCatalogFormulaMarkup = (item,type,esc) => {
    const model=window.prontuarioCatalogModel(item,type);
    const legal=window.prontuarioCatalogLegalSentence(item,type);
    const generatedPrior=previous(item,type);
    const relation=window.prontuarioCatalogIsRelation(item);
    const final=item.formula.includes(finalSentence)&&!relation?finalSentence:'';
    const operational=window.prontuarioCatalogOperational(item);
    const priorStart=model.tail.search(/(?:Da accertamento presso|Il precedente pertinente|Un precedente pertinente|Due precedenti pertinenti|Almeno tre precedenti pertinenti)/);
    const evidenceText=(priorStart<0?model.tail:model.tail.slice(0,priorStart)).trim();
    const embeddedPrior=priorStart<0?'':model.tail.slice(priorStart).trim();
    const ending=[legal,model.tail,generatedPrior,operational,final].filter(Boolean).join(' ');
    const lead=window.prontuarioRenderFormulaPart(model.lead,[],esc);
    const main=`<p class="staticChoiceHint">Utilizzare la voce pertinente.</p><ul class="staticFormulaChoices" aria-label="Circostanza pertinente">${[...model.options,model.other].map(option=>`<li>${esc(option)}</li>`).join('')}</ul>`;
    const evidenceHint=window.prontuarioEvidenceHints(item.demoBaseCode||item.code);
    const extraEvidence=evidenceText&&evidenceText.includes('[…]')?'':window.prontuarioRenderHint(evidenceHint,esc);
    const priorHints=text=>[window.prontuarioPriorOfficeHints(),...(/precedent[ei] pertinent[ei]/.test(text)&&!/non risultavano/.test(text)?[window.prontuarioPriorDetailHints(item,type)]:[])];
    const annotations=[];
    if(evidenceText&&evidenceText.includes('[…]'))annotations.push({after:evidenceText,hint:evidenceHint});
    if(embeddedPrior)annotations.push({after:embeddedPrior,hint:priorHints(embeddedPrior)});
    if(generatedPrior)annotations.push({after:generatedPrior,hint:priorHints(generatedPrior)});
    if(operational)annotations.push({after:operational,hint:window.prontuarioActHints(item,window.prontuarioCatalogActs(item))});
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
    const accessory=window.prontuarioAccessoryRows(window.prontuarioCatalogAccessorySections(item,type));
    const noteList = `<ul class="operativeNotes">${notes.map(note=>`<li>${esc(note)}</li>`).join('')}</ul>`;
    const sourceButtons = `${item.pages.map(sourceLink).join('')}${(item.regPages||[]).map(page=>`<button class="small" onclick="openPDF(0,${page})">Regolamento p.${page}</button>`).join('')}`;
    const route=window.prontuarioCatalogRoute(item);
    return `<section class="caseBlock staticNormative"><h3>Normativa violata</h3><p>${esc(normative(item,type))}</p></section>
      <section class="caseBlock staticAmounts"><h3>Tabella importi</h3>${amounts}</section>
      <section class="caseBlock staticAccessories"><h3>Sanzioni accessorie e punti</h3><table class="staticAccessoryTable"><tbody><tr><th scope="row">Sanzioni accessorie CdS</th><td>${esc(accessory.cds)}</td></tr><tr><th scope="row">Seguito sul titolo — Regolamento comunale</th><td>${esc(accessory.municipal)}</td></tr>${accessory.other?`<tr><th scope="row">Altre misure e comunicazioni</th><td>${esc(accessory.other)}</td></tr>`:''}<tr><th scope="row">Decurtazione punti patente</th><td>${esc(accessory.patentPoints)}</td></tr></tbody></table></section>
      <section class="caseBlock staticFormula"><h3>${relation?'Testo orientativo per la relazione':'Testo orientativo del verbale'}</h3>${formula}${operationalUse}${caution}<button class="small" id="copyFormula">Copia testo orientativo</button><p class="muted">Usare solo la voce pertinente. La copia non include gli elenchi dei suggerimenti.</p></section>
      <section class="caseBlock staticSuggestions"><h3>Suggerimenti e note operative</h3><h4>Condizioni e verifiche</h4>${noteList}${item.responsibility?`<h4>Responsabilità</h4><p>${esc(item.responsibility)}</p>`:''}${route?`<h4>Seguito operativo</h4><p>${esc(route)}</p>`:''}<details class="caseSource"><summary>Approfondimenti e fonti</summary><div class="detailbody">${item.legalBackground?.length?`<ul>${item.legalBackground.map(note=>`<li>${esc(note)}</li>`).join('')}</ul>`:''}<p>Fonti: ${esc(item.sources.join(', '))}.</p><div class="toolbar">${sourceButtons}</div></div></details></section>
      <p class="caseFoot"><b>A cura dell’Agente Antonio Balzano · U.O. San Lorenzo.</b><br>${esc(item.origin)} · Verifica normativa ${date(item.checked)}</p>`;
  };
  window.copyProntuarioCatalog = async function (toast) {
    const formula=document.getElementById('formulaText');
    if (!formula) return;
    try {await navigator.clipboard.writeText(window.prontuarioCatalogCopyText(formula));toast('Testo orientativo copiato con i segnaposto.');}
    catch {toast('Copia non disponibile. Seleziona la formula e usa soltanto le voci pertinenti.');}
  };
})();
