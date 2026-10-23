// 1.8.13: prescrizioni confermate dall’autore; integrale O.S.835/2014 non acquisito.
(function () {
  const w=window,codes=['R44','R45','R46'],applies=item=>codes.includes(item.code);
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const facts={
    R44:'Il giorno […] impiegava l’equino […] nella trazione della carrozza […] per complessive […] ore giornaliere, oltre il limite di 6 ore. Intervalli di impiego e fonti dell’accertamento: […].',
    R45:'Il giorno […] alle ore […] in […], con la carrozza […] trasportava […] passeggeri, oltre la capienza autorizzata di […] risultante da […]. Fatto accertato mediante […].',
    R46:'Il giorno […] alle ore […] in […], impiegava l’equino […] per la trazione della carrozza […] senza scarpe protettive. Condizione osservata e fonte dell’accertamento: […].'
  };
  const fields={
    R44:'Data; identificazione del medesimo equino e della carrozza; intervalli di effettivo impiego nella giornata, pause distinte, totale oltre sei ore e fonte di ciascun intervallo.',
    R45:'Data, ora, luogo, carrozza; numero di passeggeri trasportati, capienza autorizzata e documento pertinente; modalità dell’accertamento.',
    R46:'Data, ora, luogo, equino e carrozza; impiego osservato, descrizione concreta dell’assenza delle scarpe protettive e fonte, con foto se acquisite.'
  };
  const specific={
    R44:'Il limite di sei ore è giornaliero, riferito al medesimo equino: documentare gli intervalli e il totale. Non dedurre le ore di impiego dal solo turno del vetturino o dalla sola presenza in strada. Il testo integrale manca: non inventare criteri di computo delle pause o eccezioni.',
    R45:'Confrontare i passeggeri effettivamente trasportati con la capienza del documento autorizzativo della specifica carrozza. Verificare come il titolo tratta conducente e minori; non inventare equivalenze di posti o presumere la capienza dal solo numero di sedili.',
    R46:'Descrivere l’assenza delle scarpe protettive sull’equino durante l’impiego. La sola ferratura non è automaticamente prova delle scarpe; caratteristiche tecniche, eventuali equivalenze o eccezioni non sono documentate nell’integrale non acquisito. Non attribuire agli operatori diagnosi veterinarie.'
  };
  const shared=[
    'Prescrizione dell’O.S. n.835 del 17/06/2014 confermata dall’autore il 23/10/2026: indicazione dell’autore, distinta da acquisizione documentale. Integrale dell’ordinanza, punto dell’atto e clausola sanzionatoria non acquisiti. La conferma editoriale è già registrata; nel caso concreto documentare il fatto.',
    'Artt.7 e 7-bis D.Lgs.267/2000: art.7 disciplina il potere regolamentare, non determina da solo la sanzione. Art.7-bis, commi1 e1-bis, prevede €25–500, salvo diversa disposizione di legge, per regolamenti e ordinanze sindacali adottate su base legislativa o specifica norma regolamentare. Il fondamento e la disciplina applicabile a questa prescrizione restano da riscontrare nell’atto integrale.',
    'Se applicabile il regime generale TUEL: PMR €50 entro60giorni oltre spese, ex art.16 comma1 L.689/1981 (doppio di €25 più favorevole di €500/3). Salvo diversa delibera di Giunta ex comma2, non acquisita. Importi generali verificati, sanzione specifica dell’O.S.835/2014 non verificata documentalmente. Nessuno sconto del30%; dopo60giorni rapporto ex art.17 e procedimento ex art.18, senza raddoppio automatico.',
    'Caso distinto da R39–R42 (art.70 CdS) e R43 (caldo). Per il medesimo fatto verificare specialità ex art.9 L.689/1981 ed eventuali fatti autonomi: nessun cumulo automatico fra queste schede o con il caldo. Nessun ritiro della licenza, punto patente o altra misura CdS derivano automaticamente da questa scheda.'
  ];
  const status='Prescrizione confermata dall’autore. Integrale e sanzione specifica non acquisiti: qualificare la base prima della contestazione.';
  const amounts='<p class="qualificationWarning">Regime generale TUEL, se applicabile alla prescrizione: sanzione specifica dell’O.S.835/2014 non verificata documentalmente.</p><table class="staticAmountsTable amounts"><caption>Importi generali in euro, spese escluse · artt.7-bis TUEL e16 L.689/1981</caption><thead><tr><th>Limiti edittali</th><th>PMR entro60giorni</th><th>Dopo60giorni</th></tr></thead><tbody><tr><td>€ 25–500</td><td>€ 50 · salvo diversa delibera di Giunta</td><td>Rapporto ex art.17 e procedimento ex art.18 L.689/1981</td></tr></tbody></table>';
  const previousView=w.prontuarioRevisionView;
  w.prontuarioRevisionView=(item,type)=>{
    if(!applies(item))return previousView(item,type);
    const notes=[specific[item.code],...shared];
    return {title:item.title,status,normative:w.prontuarioNormative(item,type),accessories:{cds:'Non previste automaticamente',other:'',patentPoints:'Non previsti automaticamente'},relation:false,parts:[facts[item.code]],formulaMarkup:`<p class="staticFormulaPart" data-copy-text="${esc(facts[item.code])}">${esc(facts[item.code])}</p>`,groups:[],notes,pdfNotes:notes,amountsMarkup:amounts,responsibility:'Individuare l’autore della condotta e gli eventuali obbligati secondo artt.3 e6 L.689/1981; non dedurre automaticamente la responsabilità dalla sola titolarità della licenza.',route:'',acts:[]};
  };
  const previousFollowup=w.prontuarioFollowup;
  w.prontuarioFollowup=(item,accessory)=>!applies(item)?previousFollowup(item,accessory):{
    cds:'Nessuna misura CdS applicata automaticamente.',operators:'Documentare il fatto e la sua fonte; qualificare base, ambito ed efficacia dell’atto prima della contestazione. Integrale O.S.835/2014 non acquisito.',report:'Se ricorrono i presupposti del regime L.689/1981 e non interviene pagamento, rapporto all’autorità comunale competente ex art.17. Fatti pertinenti sul servizio all’Ufficio Corso Pubblico, senza attestare un invio già eseguito.',office:'Eventuali provvedimenti sul titolo richiedono presupposti propri e decisione dell’ufficio. Nessun ritiro, sospensione o revoca automatici da questa scheda.',other:'',patentPoints:'Non previsti automaticamente.'
  };
  const previousMarkup=w.prontuarioFollowupMarkup;
  w.prontuarioFollowupMarkup=(item,accessory,escape,pdf=false)=>{
    if(!applies(item))return previousMarkup(item,accessory,escape,pdf);
    const f=w.prontuarioFollowup(item,accessory);
    return `<table class="staticAccessoryTable"><tbody>${[['Sanzioni accessorie CdS',f.cds],['Adempimenti degli operatori',f.operators],['Segnalazione e destinatari',f.report],['Decurtazione punti patente',f.patentPoints]].map(([k,v])=>`<tr><th>${escape(k)}</th><td>${escape(v)}</td></tr>`).join('')}</tbody></table><aside class="officeInfo"><b>Provvedimenti dell’Amministrazione — non copiati</b><p>${escape(f.office)}</p></aside>`;
  };
  function body(item,type){
    const v=w.prontuarioRevisionView(item,type);
    return `<section class="caseBlock staticNormative"><h3>Riferimenti normativi — obblighi e sanzioni</h3><p>${esc(v.normative)}</p><p class="qualificationWarning">${esc(v.status)}</p></section><section class="caseBlock staticAmounts"><h3>Tabella importi</h3>${v.amountsMarkup}</section><section class="caseBlock staticAccessories"><h3>Sanzioni accessorie e adempimenti</h3>${w.prontuarioFollowupMarkup(item,v.accessories,esc)}</section><section class="caseBlock staticFormula" data-equini835-code="${item.code}"><h3>Testo orientativo del verbale</h3><div class="formulaText" id="formulaText">${v.formulaMarkup}</div><button class="small" id="copyFormula">Copia testo orientativo</button><h4>Campi essenziali</h4><p>${esc(fields[item.code])}</p></section><section class="caseBlock staticSuggestions"><h3>Suggerimenti e note operative</h3><ul class="operativeNotes">${v.notes.map(n=>`<li>${esc(n)}</li>`).join('')}</ul><h4>Responsabilità</h4><p>${esc(v.responsibility)}</p><details class="caseSource"><summary>Approfondimenti e fonti</summary><p>Prescrizione confermata dall’autore; l’originale integrale O.S.835/2014 non è acquisito. Registro della conferma e verifica separata TUEL/L.689 nel rapporto1.8.13.</p>${(item.sourceIndices||[]).map(i=>`<button class="small" onclick="openPDF(${i},1)">Indicazione dell’autore — non testo dell’ordinanza</button>`).join('')}</details></section>`;
  }
  for(const name of ['prontuarioStaticDemoBody','prontuarioCatalogBody']){const previous=w[name];w[name]=(item,type,helpers)=>applies(item)?body(item,type):previous(item,type,helpers);}
  w.prontuarioEquini835Codes=codes;w.prontuarioEquini835Applies=applies;w.prontuarioEquini835Formula=item=>facts[item.code];
})();
