// Revisione locale 1.8.9: esclusivamente i 38 codici presenti nelle indicazioni dell'autore.
// Decisioni, fonti e punti da confermare: RAPPORTO_REVISIONE_1.8.9.md.
(function () {
  const w=window;
  const single=['G01','G02','G09','G16','G17','G18','G22','G23','G24','G26','G29','G34','G36','G43'];
  const codes=[...single,...Array.from({length:6},(_,i)=>Array.from({length:4},(_,j)=>`G0${i+3}-0${j+1}`)).flat()];
  const base=item=>(item.demoBaseCode||item.staticModelCode||item.code).split('-')[0];
  const applies=(item,type='Taxi')=>type==='Taxi'&&codes.includes(item.code);
  const close='Copia del presente verbale sarà trasmessa all’Ufficio Corso Pubblico.';
  const facts={
    G01:'Adibiva a servizio taxi il veicolo indicato senza la prescritta licenza. Nella fattispecie si accertava […].',
    G02:'Adibiva a servizio taxi il veicolo indicato senza la prescritta licenza. Nella fattispecie si accertava […]. La violazione era commessa per la seconda volta in tre anni dal medesimo soggetto, come da precedente verbale n. […] per il fatto del […], accertato da […], verificato presso […] in data […].',
    G03:'Alla guida del veicolo indicato, con C.P. n. […], disponibile al servizio taxi, rifiutava senza motivo legittimo la corsa verso […].',
    G04:'Alla guida del veicolo indicato, con C.P. n. […], effettuava la corsa […] applicando una tariffa difforme da quella amministrata: […].',
    G05:'Alla guida del veicolo indicato, con C.P. n. […] e licenza rilasciata dal Comune di […], iniziava il servizio taxi in […], fuori dall’area autorizzata, prelevando n. […] utenti diretti a […].',
    G06:'Alla guida del veicolo indicato, con C.P. n. […], svolgeva il servizio taxi senza tassametro omologato. Irregolarità accertata: […].',
    G07:'Alla guida del veicolo indicato, con C.P. n. […], svolgeva il servizio taxi senza rendere chiaramente leggibili all’utente gli avvisi sulle tariffe e sui supplementi. Condizione accertata: […].',
    G08:'Alla guida del veicolo indicato, con C.P. n. […], determinava il corrispettivo della corsa […] in difformità dalle modalità tariffarie applicabili. Condotta accertata: […].',
    G09:'Con il veicolo indicato, con C.P. n. […], prelevava utenti a meno di 100 metri dal posteggio […], mentre vi erano taxi o utenti in attesa.',
    G16:'Con il veicolo indicato, con C.P. n. […], presentava segni distintivi taxi difformi dal regolamento: […].',
    G17:'Durante l’assegnazione dell’auto di scorta […] al C.P. n. […] dal […] al […], utilizzava contemporaneamente anche il veicolo taxi proprio indicato per il servizio […], come accertato mediante […].',
    G18:'L’auto di scorta indicata, assegnata al C.P. n. […], aveva allestimento difforme: […], rispetto alla dotazione prescritta dall’atto […].',
    G22:'Con il veicolo indicato, con C.P. n. […], rifiutava all’utente l’occupazione del posto omologato […] disponibile, come accertato mediante […].',
    G23:'Con il veicolo indicato, con C.P. n. […], appartenente al gruppo […] con orario di servizio […], svolgeva il servizio taxi fuori dal proprio turno. Attività accertata in data […] alle ore […]: […].',
    G24:'Alla guida del veicolo indicato, con C.P. n. […], non rispettava il proprio turno di fila nel posteggio […], precedendo il taxi […] che lo precedeva nell’ordine di arrivo.',
    G26:'A seguito dell’avaria del veicolo indicato, con C.P. n. […], ometteva la richiesta di sostituzione prescritta. Circostanze accertate: […].',
    G29:'Durante il servizio taxi, sul veicolo indicato, con C.P. n. […], non teneva disponibile la guida della città.',
    G34:'Con il veicolo indicato, con C.P. n. […], libero in servizio notturno, manteneva spento il segnale luminoso TAXI.',
    G36:'Con il veicolo indicato, con C.P. n. […], percorreva nella corsa […] la via […] anziché il percorso più breve applicabile […], senza specifica richiesta del cliente.',
    G43:'Con il veicolo indicato, con C.P. n. […], sostava in […], fuori dal posteggio autorizzato, allo scopo di acquisire clienti. Condotta accertata: […].'
  };
  const examples={
    G01:['Licenza mai rilasciata: indicare il riscontro dello stato del titolo.','Licenza revocata o sospesa: sostituire la condizione iniziale con quella accertata e gli estremi del provvedimento.'],
    G02:['Licenza mai rilasciata, oppure revocata o sospesa: scegliere il solo stato verificato del titolo.'],
    G04:['Richiedeva € […] anziché € […] dovuti per […], secondo il tariffario […].','Applicava il supplemento […] non dovuto nella corsa […].'],
    G06:['Tassametro assente nell’abitacolo.','Tassametro modello […] n. […] privo di omologazione, secondo il riscontro tecnico […].'],
    G07:['Avvisi totalmente assenti, come constatato […].','Avvisi presenti in […], ma non leggibili dalla posizione dell’utente per […].'],
    G08:['Richiedeva € […] mentre il tassametro indicava € […], senza supplementi legittimamente dovuti.','Riscuoteva il prezzo concordato di € […] senza utilizzare il tassametro, fuori dai casi di tariffa predeterminata applicabile, come accertato mediante […].'],
    G17:['Corsa osservata dagli operanti durante il periodo di assegnazione documentato.','Sovrapposizione dei servizi risultante dal riscontro […] del […].'],
    G18:['Dotazione […] mancante.','Dotazione […] presente ma non conforme per […].'],
    G22:['Posto […] libero e previsto dal documento del veicolo; rifiuto constatato […].'],
    G43:['Offriva la corsa ai passanti […], come osservato dagli operanti.','Attendeva richieste e accettava la corsa di […], come risultava da […].']
  };
  const clauseText={
    documento:'Il documento di circolazione è ritirato e sarà trasmesso con copia del presente verbale all’UMC di […].',
    trasferimento:'Il conducente è autorizzato a condurre il veicolo per la via più breve fino a […], luogo indicato dall’interessato per la custodia, con l’avvertenza che il veicolo sarà sottoposto a fermo amministrativo per tutta la durata della sospensione del documento di circolazione.',
    fermo:'Il fermo amministrativo e l’affidamento in custodia sono documentati con separato verbale n. […] del […].',
    licenza:'La licenza è ritirata e sarà trasmessa all’Ufficio Corso Pubblico con copia del presente verbale.',
    patente:'La patente è ritirata e sarà trasmessa alla Prefettura-UTG di […].',
    sequestro:'Il veicolo è sottoposto a sequestro ai fini della confisca e il documento di circolazione è trattenuto, come da separato verbale n. […] del […].'
  };
  const clauseLabels={documento:'Ritiro del documento eseguito; invio all’UMC ancora da effettuare',trasferimento:'Permesso effettivamente rilasciato; trasferimento consentito e luogo di custodia individuato',fermo:'Separato verbale di fermo e custodia effettivamente redatto',licenza:'Licenza Napoli ritirata per questa violazione del gruppo C/D; invio ancora da effettuare',patente:'Patente ritirata per sospensione ex art. 218 CdS; invio ancora da effettuare',sequestro:'Sequestro eseguito, documento trattenuto e separato verbale redatto'};
  const index=item=>item.demoVariant?.paymentIndex??item.staticVariantIndex;
  function prior(item){
    if(!/^G0[3-8]-/.test(item.code))return '';
    const n=index(item);
    if(n===0)return 'Da accertamento presso […] del […], riferimento […], non risultavano precedenti violazioni pertinenti del titolare della licenza nel quinquennio.';
    const list=Array.from({length:n},(_,i)=>`${i+1}) verbale n. […], fatto del […], organo […]`).join('; ');
    return `Da accertamento presso […] del […], riferimento […], risultavano ${n===1?'una precedente violazione pertinente':n===2?'due precedenti violazioni pertinenti':'almeno tre precedenti violazioni pertinenti'} del titolare della licenza nel quinquennio: ${list}.`;
  }
  function clauses(item){
    const b=base(item);
    if(b==='G01')return ['patente','sequestro'];
    if(b==='G02')return ['sequestro'];
    const ids=/^G0[3-8]$/.test(b)?['documento','trasferimento','fermo']:[];
    if(['G04','G08','G17','G23'].includes(b))ids.push('licenza');
    return ids;
  }
  function formula(item,selected=[]){
    const b=base(item),allowed=clauses(item),chosen=selected.filter(id=>allowed.includes(id)&&(!['trasferimento','fermo'].includes(id)||selected.includes('documento')));
    return [facts[b],prior(item),...chosen.map(id=>clauseText[id]),b==='G05'?'Gli atti saranno trasmessi anche al Comune di […] che ha rilasciato la licenza.':'',!['G01','G02'].includes(b)&&!chosen.includes('licenza')?close:''].filter(Boolean).join(' ');
  }
  function notes(item){
    const b=base(item),out=[];
    if(/^G0[3-8]$/.test(b))out.push('Fascia: stesso titolare nel quinquennio, non il solo veicolo o conducente. Art. 86, comma 3, non definisce “stesso genere”: non limitare automaticamente i precedenti al medesimo codice del prontuario. Art. 8-bis L. 689/1981 disciplina la stessa indole, l’esecutività e l’esclusione del pagamento ridotto, salvo regimi speciali. Verificare fatti, norme ed esiti; il coordinamento per i precedenti dubbi resta da confermare. Un riscontro incompleto non prova la prima violazione.');
    if(/^G0[3-8]$/.test(b))out.push('Resta aperta la verifica della decorrenza differita ex art. 25, comma 3, L. 193/2024, legata al decreto sul foglio di servizio elettronico. Importi e fasce conservati dalla revisione precedente, senza convalidare questo punto.');
    if(['G01','G02'].includes(b))out.push('Accertare l’effettivo servizio taxi e lo stato della licenza: mancata esibizione non equivale ad assenza. L’art. 82, comma 4, CdS richiede l’onerosità dell’uso di terzi, non dimostra che il prezzo debba essere già materialmente pagato. Documentare richiesta, trasporto e corrispettivo pattuito o pagato.');
    if(b==='G01')out.push('Verificare che non ricorra la reiterazione dello stesso soggetto nel triennio ex art. 86, comma 2; in quel caso consultare G02.');
    if(b==='G02')out.push('Art. 86, comma 2: medesimo soggetto, almeno due violazioni in tre anni. Art. 219, comma 2: comunicazione al Prefetto entro cinque giorni; revoca e ordine di consegna competono al Prefetto. Nessun ritiro immediato della patente precompilato in assenza di un distinto provvedimento eseguibile.');
    if(b==='G05')out.push('Solo licenza di altro Comune: verificare area comunale/comprensoriale, accordi tra sindaci (L. 21/1992, artt. 2, 4 comma 5, 5-bis comma 1-bis e 11 comma 2) ed eventuali discipline del luogo, anche aeroportuale. Non basta essere fuori dal Comune. Nessun ritiro della licenza fondato sul regolamento di Napoli; inviare i fatti al Comune rilasciante.');
    if(b==='G04')out.push(...w.prontuarioCatalogNotes(item,w.prontuarioCatalogModel(item,'Taxi')).filter(n=>n.startsWith('Tariffario ufficiale')||n.startsWith('Le tariffe predeterminate, da richiedere')||n.startsWith('Nell’extraurbana ordinaria')));
    if(b==='G06')out.push('La mancata esibizione di un documento non prova da sola l’assenza di omologazione del tassametro: occorre il riscontro tecnico pertinente.');
    if(['G06','G07','G08'].includes(b))out.push('Per l’obbligo del tassametro verificare anche l’eventuale esonero ex art. 14, comma 3, L. 21/1992, se pertinente al titolo e al Comune.');
    if(b==='G07')out.push('Scegliere tra avvisi assenti e avvisi presenti ma non leggibili: non attestare entrambe le condizioni. Distinguere i supplementi ex art. 12, comma 2, L. 21/1992 dalla sola modalità locale di esposizione.');
    if(b==='G07')out.push('I07 rinvia a queste fasce. Le sole ulteriori difformità comunali di esposizione, se gli avvisi sui supplementi restano chiaramente leggibili, richiedono qualificazione separata e non ricevono automaticamente gli importi G07.');
    if(b==='G08')out.push('Distinguere mancato uso del tassametro, richiesta difforme dall’importo indicato e tariffa predeterminata legittimamente applicabile: quest’ultima non integra da sola la violazione. Verificare G04 per la tariffa e I01 per la sola attivazione, senza cumulo automatico. Tariffe e ricevuta: appendice A8 e G28-02, con i dubbi già aperti.');
    if(b==='G08')out.push(...w.prontuarioCatalogNotes(item,w.prontuarioCatalogModel(item,'Taxi')).filter(n=>n.startsWith('Per la tariffa predeterminata richiesta')));
    if(['G03','G06','G07'].includes(b))out.push('Il titolo del Comune di Napoli non basta per il ritiro della licenza: art. 29, comma 4, limitato ai gruppi C/D. Per questa scheda non è preimpostato; l’eventuale provvedimento successivo compete all’Amministrazione.');
    if(['G04','G08','G17','G23'].includes(b))out.push(`Ritiro materiale della licenza: solo titolo Napoli e accertata violazione del gruppo ${item.group.toUpperCase()} ex art. 29, comma 4; documentare l’atto. Diffida, sospensione o revoca sono provvedimenti dell’autorità competente.`);
    if(w.prontuarioIsResidual(item))out.push('Art. 86, comma 3-bis: individuare la specifica condizione della licenza violata e la sua fonte […]; escludere i commi 2 e 3. La sola inosservanza comunale non rende applicabili gli importi CdS. In mancanza del presupposto, relazione dei fatti e qualificazione da confermare.');
    if(b==='G09')out.push('Art. 4, comma 5, regolamento: verificare l’eccezione per il prelievo richiesto tramite radiotaxi; documentare distanza e presenza di taxi o utenti in attesa.');
    if(b==='G24')out.push('Art. 4, comma 3, e art. 23, comma 1, lett. g, regolamento: ordine di arrivo dei taxi. Verificare scelta dell’utente per servizi aggiuntivi e chiamata radio, prima di qualificare il superamento della fila. Gruppo A; nessun ritiro immediato della licenza ex art. 29, comma 4.');
    if(b==='G23')out.push('Confrontare giorno, ora, gruppo, licenza e ordinanza dei turni vigente alla data del fatto; verificare deroghe e cambi turno. Non usare un calendario scaduto.');
    if(b==='G29')out.push('Art. 23, comma 1, lett. p: guida della città rilasciata dal Comune di Napoli. Le eventuali disposizioni comunali sul formato ammesso restano da acquisire.');
    if(b==='G36')out.push('Art. 23, comma 2, lett. a: oltre alla richiesta del cliente, verificare gli accertati problemi di viabilità che giustifichino il percorso diverso.');
    return out;
  }
  function accessories(item){
    const b=base(item),demo=w.prontuarioStaticDemos[item.demoBaseId||item.id];
    const value=demo?w.prontuarioDemoAccessories(demo,item.demoVariant):w.prontuarioCatalogAccessorySections(item,'Taxi');
    if(b==='G01')value.cds='Sospensione della patente da 4 a 12 mesi; confisca del veicolo (art. 86, comma 2, CdS).';
    if(b==='G02')value.cds='Revoca della patente; confisca del veicolo (art. 86, comma 2, CdS).';
    return value;
  }
  function normative(item){
    const demo=w.prontuarioStaticDemos[item.demoBaseId||item.id];
    let value=demo?w.prontuarioOrderedReferences(demo.normative).join('; '):w.prontuarioNormative(item,'Taxi');
    if(base(item)==='G05')value='CdS art. 86, comma 3; L. 21/1992 artt. 2, 4 comma 5, 5-bis comma 1-bis e 11 comma 2';
    return value.replace(/\s*\((?:solo )?se condizione della licenza verificata\)/g,'');
  }
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const formulaMarkup=item=>`<p class="staticFormulaPart" data-copy-text="${esc(formula(item))}">${esc(formula(item))}</p>`;
  function body(item,type,helpers){
    const view=w.prontuarioRevisionView(item,type),row=item.payments[0];
    const amount=v=>/\d/.test(v)&&!/[A-Za-z]/.test(v)?'€ '+v:v;
    const fields=(['G01','G02'].includes(base(item))?'Stato della licenza, condotta e relativo riscontro'+(base(item)==='G02'?'; precedente del medesimo soggetto nel triennio e fonte della verifica':''):'C.P. e circostanza accertata')+(prior(item)?'; ufficio/fonte, data del riscontro ed estremi di ciascun precedente':'')+(w.prontuarioIsResidual(item)?'; condizione del titolo e fonte nelle note di accertamento':'')+'. I segnaposto […] vanno completati prima dell’uso.';
    const examplesHtml=(examples[base(item)]||[]).length?`<h4>Esempi alternativi — esclusi dalla copia</h4><ul>${examples[base(item)].map(s=>`<li>${esc(s)}</li>`).join('')}</ul>`:'';
    const ids=clauses(item);
    return `<section class="caseBlock staticNormative"><h3>Riferimenti normativi — obblighi e sanzioni</h3><p>${esc(view.normative)}</p></section>
      <section class="caseBlock staticAmounts"><h3>Tabella importi</h3>${w.prontuarioIsResidual(item)?'<p class="qualificationWarning">CdS residuale: verificare la specifica condizione della licenza (note operative).</p>':''}<table class="staticAmountsTable"><caption>Importi in euro, spese escluse</caption><thead><tr><th>PMR</th><th>Entro 5 giorni</th><th>Oltre 60 giorni o procedura</th></tr></thead><tbody><tr>${[row[2],row[3],row[4]].map(v=>`<td>${esc(amount(v))}</td>`).join('')}</tr></tbody><tfoot><tr><th colspan="2">Limiti edittali</th><td>${esc(amount(row[1]))}</td></tr></tfoot></table></section>
      <section class="caseBlock staticAccessories"><h3>Sanzioni accessorie e adempimenti</h3>${w.prontuarioFollowupMarkup(item,view.accessories,esc)}</section>
      <section class="caseBlock staticFormula" data-revision-code="${esc(item.code)}"><h3>Testo orientativo del verbale</h3><div class="formulaText" id="formulaText">${formulaMarkup(item)}</div><button class="small" id="copyFormula">Copia testo orientativo</button><p class="muted">La copia include soltanto la formula e le attestazioni selezionate.</p>
      <h4>Campi da completare</h4><p>${esc(fields)}</p>${ids.length?`<fieldset class="revisionActs" data-no-copy><legend>Attestazioni: aggiungere soltanto gli atti eseguiti</legend><p>Queste selezioni descrivono gli atti compiuti; non rendono facoltativi gli adempimenti obbligatori del riquadro precedente.</p>${ids.map(id=>`<label><input type="checkbox" data-revision-act="${id}"> ${esc(clauseLabels[id])}</label>`).join('')}${ids.includes('trasferimento')?'<p>Permesso soltanto per il trasferimento al luogo di custodia, se nessun’altra causa impedisce la circolazione (patente, RCA, condizioni del veicolo). Non è autorizzazione a proseguire il servizio.</p>':''}<p>Per invii già eseguiti sostituire il futuro con data, destinatario e protocollo effettivi. Nessuna trasmissione è attestata automaticamente.</p></fieldset>`:''}</section>
      <section class="caseBlock staticSuggestions"><h3>Suggerimenti e note operative</h3>${examplesHtml}<h4>Condizioni e verifiche — escluse dalla copia</h4><ul class="operativeNotes">${view.notes.map(s=>`<li>${esc(s)}</li>`).join('')}</ul>${view.responsibility?`<h4>Responsabilità</h4><p>${esc(view.responsibility)}</p>`:''}<details class="caseSource"><summary>Approfondimenti e fonti</summary><p>Fonti: ${esc(item.sources.join(', '))}. Revisione mirata: RAPPORTO_REVISIONE_1.8.9.md.</p><div class="toolbar">${(item.pages||[]).map(helpers.sourceLink).join('')}${(item.regPages||[]).map(p=>`<button class="small" onclick="openPDF(0,${p})">Regolamento p.${p}</button>`).join('')}</div></details></section><p class="caseFoot">A cura dell’Agente Antonio Balzano · U.O. San Lorenzo. Revisione editoriale 18 ottobre 2026; questioni normative aperte nel rapporto.</p>`;
  }
  w.prontuarioRevisionCodes=codes;
  w.prontuarioRevisionApplies=applies;
  w.prontuarioRevisionFormula=formula;
  w.prontuarioRevisionClauses=clauses;
  w.prontuarioRevisionClauseText=clauseText;
  w.prontuarioRevisionExamples=examples;
  const previousFollowup=w.prontuarioFollowup;
  w.prontuarioFollowup=(item,accessory)=>{
    const f=previousFollowup(item,accessory);
    if(!applies(item))return f;
    if(base(item)==='G05'){
      f.report='Trasmettere i fatti e gli atti al Comune che ha rilasciato la licenza. Distinto l’invio del documento di circolazione all’UMC entro cinque giorni ex art. 217 CdS.';
      f.office='Provvedimenti sul titolo di altro Comune: autorità competente del Comune rilasciante. Nessun ritiro o punto comunale fondato sul regolamento di Napoli.';
    }else if(['c','d'].includes(item.group))f.operators=f.operators.replace('licenza/autorizzazione comunale','licenza del Comune di Napoli');
    return f;
  };
  w.prontuarioRevisionView=(item,type)=>{
    if(!applies(item,type))return null;
    const operativeNotes=notes(item);
    return {title:item.title,normative:normative(item),accessories:accessories(item),relation:false,parts:[formula(item)],formulaMarkup:formulaMarkup(item),groups:[],notes:operativeNotes,pdfNotes:[...operativeNotes,...(examples[base(item)]?.length?['Esempi alternativi, esclusi dalla formula base: '+examples[base(item)].join(' / ')]:[])],responsibility:w.prontuarioStaticDemos[item.demoBaseId||item.id]?.responsibility||item.responsibility||'',route:'',acts:clauses(item).map(id=>({title:clauseLabels[id],text:clauseText[id]}))};
  };
  // Conserva i renderer preesistenti per tutte le schede fuori dall'ambito concordato.
  for(const name of ['prontuarioStaticDemoBody','prontuarioCatalogBody']){
    const previous=w[name];
    w[name]=(item,type,helpers)=>applies(item,type)?body(item,type,helpers):previous(item,type,helpers);
  }
  if(typeof document!=='undefined')document.addEventListener('change',event=>{
    if(!event.target.matches('[data-revision-act]'))return;
    const section=event.target.closest('[data-revision-code]');
    const item=STATIC_LAYOUT.rows.find(r=>r.type==='Taxi'&&r.item.code===section.dataset.revisionCode)?.item;
    if(!item)return;
    const doc=section.querySelector('[data-revision-act="documento"]');
    if(doc&&!doc.checked)for(const input of section.querySelectorAll('[data-revision-act="trasferimento"],[data-revision-act="fermo"]'))input.checked=false;
    const selected=[...section.querySelectorAll('[data-revision-act]:checked')].map(e=>e.dataset.revisionAct);
    const p=section.querySelector('.staticFormulaPart'),text=formula(item,selected);
    p.textContent=text;p.dataset.copyText=text;
  });
})();
