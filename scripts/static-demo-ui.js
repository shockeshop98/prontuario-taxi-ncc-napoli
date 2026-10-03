(function () {
  const finalSentence="Copia del presente verbale verrà inviata all'Ufficio Corso Pubblico.";
  window.prontuarioOperationalUseNote='Solo se eseguito: conserva nel testo copiato il seguito operativo che corrisponde agli atti effettivamente compiuti; elimina o adatta il resto e completa gli estremi prima dell’uso.';
  window.prontuarioDemoFormulaParts = (demo,variant) => {
    const parts=demo.formulaParts.map(part=>variant?part.replace('[RISCONTRO_PRECEDENTI]',variant.previousFormula):part);
    const optional=demo.acts.map(act=>act.text).join(' ');
    const last=parts.length-1;
    parts[last]=(parts[last].includes(finalSentence)?parts[last].replace(finalSentence,`${optional} ${finalSentence}`):`${parts[last]} ${optional}`).trim();
    return parts;
  };
  window.prontuarioDemoAccessories = function (demo, variant) {
    if(variant)return {
      cds:[demo.accessories[variant.paymentIndex]],
      municipal:`Art. 29, comma 2, lett. b: ${variant.municipalSuspension} di sospensione della licenza per la fascia verificata; provvedimento dell’ufficio competente, non già applicato dagli operanti.`,
      points:`Punti comunali: ${variant.municipalPoints}.`
    };
    if(demo.code==='G23')return {cds:[demo.accessories[0]],municipal:demo.accessories[1],points:demo.accessories[2]};
    return {cds:demo.accessories,municipal:'Segnalazione all’ufficio competente per il seguito sul titolo; nessuna misura comunale applicata automaticamente.',points:'Nessun punto precompilato in questa scheda.'};
  };
  window.prontuarioAccessoryRows = accessory => {
    const cds=Array.isArray(accessory.cds)?accessory.cds.join(' '):accessory.cds;
    const municipalPoints=accessory.points||'';
    const municipal=[accessory.municipal, /punti comunali|punti sulla licenza/i.test(municipalPoints) ? municipalPoints : ''].filter(Boolean).join(' ');
    return {cds,municipal,other:accessory.other||'',patentPoints:accessory.patentPoints||'No'};
  };
  window.prontuarioStaticDemoCopyText = formula => window.prontuarioCopyFormulaParts(formula);
  window.prontuarioDemoFormulaMarkup = (demo,variant,esc) => {
    const parts=window.prontuarioDemoFormulaParts(demo,variant);
    const destinationHint={
      title:'Destinazione richiesta',options:['Destinazione ascoltata direttamente dagli operanti: […].','Destinazione riferita in dichiarazione formalizzata con atto n. […].'],other:'Altra fonte della destinazione richiesta: […].'
    };
    const turnHint={
        title:'Turno e atto applicabile',options:['Calendario dei turni […] esaminato per gruppo, fascia e giorno.','Risposta dell’ufficio […] prot. […] sul turno applicabile.'],other:'Altro riscontro del turno e dell’atto: […].'
      };
    const conditionHint={
        title:'Condizione del titolo',options:['Clausola […] letta nella licenza C.P. n. […].','Condizione confermata dall’ufficio […] con risposta n. […].'],other:'Altra fonte della condizione della licenza: […].'
      };
    let html=window.prontuarioRenderFormulaPart(parts[0],[],esc,demo.code==='G01');
    const factSource=demo.code==='G01'?{
      title:'Fonte dell’accertamento del servizio taxi',
      options:['Offerta, accettazione e prelievo osservati direttamente dagli operanti: […].','Dichiarazione formalizzata con atto n. […] sui fatti riferiti dal passeggero.'],
      other:'Altra modalità pertinente di accertamento del servizio: […].'
    }:demo.code==='G23'?{
      title:'Fonte della condotta relativa al turno',
      options:['Servizio svolto fuori fascia osservato dagli operanti nel periodo […].','Registro dei turni […] e risposta dell’ufficio […] esaminati per il turno non svolto.'],
      other:'Altra fonte della condotta relativa al turno: […].'
    }:null;
    for(let index=0;index<demo.suggestions.length;index++){
      const group=demo.suggestions[index];
      html+=`<p class="staticChoiceHint">Utilizzare la voce pertinente.</p><ul class="staticFormulaChoices" aria-label="${esc(group.title)}">${[...group.options,group.other].filter(Boolean).map(option=>`<li>${esc(option)}</li>`).join('')}</ul>`;
      if(index===0&&demo.code==='G01')html+=`<p class="staticCopyWarning">Per licenza sospesa o revocata, sostituire la prima frase; non aggiungere l’alternativa a ‘senza avere ottenuto’.</p>`;
      if(index===0&&demo.code==='G03')html+=window.prontuarioRenderHint(destinationHint,esc);
      if(index===0&&demo.code==='G23')html+=window.prontuarioRenderHint(turnHint,esc)+window.prontuarioRenderHint(conditionHint,esc);
      if((demo.code==='G01'?index===1:index===0)&&factSource)html+=window.prontuarioRenderHint(factSource,esc);
      const part=parts[index+1];
      const annotations=[];
      if(demo.code==='G03'&&index===1){
        annotations.push({after:variant.previousFormula,hint:[window.prontuarioPriorOfficeHints(),...(variant.paymentIndex?[window.prontuarioPriorDetailHints({code:'G03'},'Taxi')]:[])]});
      }
      const operational=demo.acts.map(act=>act.text).join(' ');
      if(operational&&index===demo.suggestions.length-1&&demo.code!=='G01')annotations.push({after:operational,hint:window.prontuarioActHints({code:demo.code},demo.acts)});
      html+=window.prontuarioRenderFormulaPart(part,annotations,esc,demo.code==='G01'&&index===0);
    }
    return html;
  };
  window.prontuarioStaticDemoBody = function (item, type, helpers) {
    const {esc,sourceLink,date} = helpers;
    const demo = window.prontuarioStaticDemos[item.demoBaseId || item.id];
    const variant = item.demoVariant;
    if (!demo || type !== 'Taxi' || demo.code !== (item.demoBaseCode || item.code)) throw Error('Scheda dimostrativa non coerente');
    if (demo.formulaParts.length !== demo.suggestions.length + 1) throw Error('Punti della formula non coerenti con i suggerimenti');
    if (item.payments.length !== 1) throw Error('Una scheda deve mostrare una sola fascia di importi');
    const row=item.payments[0];
    const payment=row[2]==='Non ammesso'?'Non ammesso':`€ ${row[2]}`;
    const fiveDays=row[3]==='Non applicabile'?'Non applicabile':`€ ${row[3]}`;
    const afterSixty=row[4].includes('Prefetto')?'Prefetto':`€ ${row[4]}`;
    const finalHeading=item.id==='abusivo'?'Procedura':`Oltre 60 giorni <small>${item.id==='turno'?'Importo a titolo esecutivo':'Importo a ruolo'}</small>`;
    const amounts=`<table class="staticAmountsTable"><caption>Importi in euro, spese escluse</caption><colgroup><col class="staticAmountShort"><col class="staticAmountShort"><col class="staticAmountLong"></colgroup><thead><tr><th scope="col"><abbr title="Pagamento in misura ridotta">PMR</abbr><small>Misura ridotta</small></th><th scope="col">Entro 5 giorni</th><th scope="col">${finalHeading}</th></tr></thead><tbody><tr><td>${esc(payment)}</td><td>${esc(fiveDays)}</td><td>${esc(afterSixty)}</td></tr></tbody><tfoot><tr><th scope="row" colspan="2">Limiti edittali</th><td>€ ${esc(row[1])}</td></tr></tfoot></table>`;
    const accessories=window.prontuarioAccessoryRows(window.prontuarioDemoAccessories(demo,variant));
    const formula=`<div class="formulaText" id="formulaText">${window.prontuarioDemoFormulaMarkup(demo,variant,esc)}</div>`;
    const notes=variant?[
      `Usare questa fascia solo dopo aver verificato ${variant.previous} dello stesso titolare nel quinquennio. Un riscontro incompleto non prova la fascia.`,
      ...demo.notes.slice(1)
    ]:demo.notes;
    const operationalUse=demo.acts.length ? `<p class="staticOperationalUse">${esc(window.prontuarioOperationalUseNote)}</p>` : '';
    const responsibility=demo.responsibility||item.responsibility;
    return `<section class="caseBlock staticNormative"><h3>Normativa violata</h3><ul>${demo.normative.map(ref=>`<li>${esc(ref)}</li>`).join('')}</ul></section>
      <section class="caseBlock staticAmounts"><h3>Tabella importi</h3>${amounts}</section>
      <section class="caseBlock staticAccessories"><h3>Sanzioni accessorie e punti</h3><table class="staticAccessoryTable"><tbody><tr><th scope="row">Sanzioni accessorie CdS</th><td>${esc(accessories.cds)}</td></tr><tr><th scope="row">Seguito sul titolo — Regolamento comunale</th><td>${esc(accessories.municipal)}</td></tr>${accessories.other?`<tr><th scope="row">Altre misure e comunicazioni</th><td>${esc(accessories.other)}</td></tr>`:''}<tr><th scope="row">Decurtazione punti patente</th><td>${esc(accessories.patentPoints)}</td></tr></tbody></table></section>
      <section class="caseBlock staticFormula"><h3>Testo orientativo del verbale</h3>${formula}${operationalUse}${variant?.paymentIndex===0||demo.code==='G01'?'<p class="staticCopyWarning">Solo con riscontro negativo: indicare la C.O. o la U.O. realmente consultata. Se la verifica è pendente, non usare questa formula per attribuire la prima violazione.</p>':''}<button class="small" id="copyFormula">Copia testo orientativo</button><p class="muted">La copia usa i segnaposto […], senza includere le alternative.</p></section>
      <section class="caseBlock staticSuggestions"><h3>Suggerimenti e note operative</h3><h4>Condizioni e verifiche</h4><ul class="operativeNotes">${notes.map(note=>`<li>${esc(note)}</li>`).join('')}</ul>${responsibility?`<h4>Responsabilità</h4><p>${esc(responsibility)}</p>`:''}<h4>Uffici destinatari</h4><p>${esc(demo.destinations)}</p><details class="caseSource"><summary>Approfondimenti e fonti</summary><div class="detailbody">${item.legalBackground?.length ? `<h4>Quadro regionale · approfondimento</h4><ul>${item.legalBackground.map(note=>`<li>${esc(note)}</li>`).join('')}</ul>` : ''}<p>Fonti: ${esc(item.sources.join(', '))}. ${item.group ? 'Gruppo comunale '+item.group.toUpperCase()+'. ' : ''}I punti comunali riguardano il titolo; i provvedimenti dell’ufficio restano distinti.</p><div class="toolbar">${item.pages.map(sourceLink).join('')}${(item.regPages||[]).map(page => `<button class="small" onclick="openPDF(0,${page})">Regolamento p.${page}</button>`).join('')}<button class="small" onclick="openPDF(0)">Regolamento fornito</button>${item.topic==='tariffe' ? '<button class="small" onclick="openPDF(4)">Tariffario taxi 2024</button>' : ''}</div></div></details></section>
      <p class="caseFoot"><b>A cura dell’Agente Antonio Balzano · U.O. San Lorenzo.</b><br>${esc(item.origin)} · Verifica normativa ${date(item.checked)}</p>`;
  };
  window.copyProntuarioStaticDemo = async function (toast) {
    const formula = document.getElementById('formulaText');
    if (!formula) return;
    const copyText=window.prontuarioStaticDemoCopyText(formula);
    try { await navigator.clipboard.writeText(copyText); toast('Testo orientativo copiato con i segnaposto.'); }
    catch {
      toast('Copia non disponibile. Seleziona la formula e usa soltanto le voci pertinenti.');
    }
  };
})();
