// Regole condivise da schede, copia e PDF. Fonti e limiti: RAPPORTO_REVISIONE_1.8.6.md.
(function () {
  const office = 'Servizio Trasporto Pubblico Locale e MaaS del Comune di Napoli (ufficio competente per Taxi/NCC)';
  const code = item => item.staticModelCode || item.demoBaseCode || item.code;
  window.prontuarioMunicipalOffice = office;
  window.prontuarioOfficeGuide = 'La segnalazione trasmette fatti e atti per il procedimento sul titolo, non è una sanzione accessoria CdS. Il Servizio Trasporto Pubblico Locale e MaaS riceve gli atti; l’ufficio e la Commissione di disciplina esercitano le rispettive competenze degli artt. 27–32. Gli operatori non dispongono autonomamente diffida, sospensione o revoca. Art. 29, comma 1: contestazione dell’ufficio, cinque giorni per le difese e decisione nei successivi trenta giorni; comma 7: precedenti nell’ultimo quinquennio. Art. 28: punti sul titolo Taxi e NCC, distinti dalla patente; per più infrazioni contestuali si considera la decurtazione maggiore. Revoca a 100 punti, da adottare dall’autorità competente. Restano distinti i presupposti degli artt. 30–32. Il ritiro materiale ex art. 29, comma 4, è invece compito degli operatori per i gruppi C e D. Il percorso interno tramite Ufficio Verbali va confermato dal Comando.';
  window.prontuarioResidualWarning = 'Gli importi CdS residuali non discendono dalla sola violazione comunale: accertare circolazione in servizio e specifica condizione della licenza (art. 86, comma 3-bis) o dell’autorizzazione NCC (art. 85, comma 4-ter), escludendo rispettivamente i commi 2–3 o 4–4-bis. Per il solo regolamento verificare L.R. 10/2024, art. 21, comma 5, TUEL art. 7-bis e il coordinamento con i € 50 dell’art. 29, comma 3, senza cumulo automatico.';
  window.prontuarioOrderedReferences = value => {
    const rank = s => /CdS|Codice della strada/i.test(s) ? 0 : /L\.?\s*(?:n\.\s*)?21\s*\/\s*1992/.test(s) ? 1 : /Regolamento comunale|\bReg\./i.test(s) ? 2 : 3;
    const parts = (Array.isArray(value) ? value : String(value || '').split(';')).map(s=>s.trim()).filter(Boolean);
    const grouped=[];
    for(const part of parts) {
      if (/^c\.[23] per NCC/.test(part) && grouped.length) grouped[grouped.length-1]+='; '+part;
      else grouped.push(part);
    }
    return grouped.map((text,index)=>({text,index})).sort((a,b)=>rank(a.text)-rank(b.text)||a.index-b.index).map(p=>p.text);
  };
  window.prontuarioNormative = (item,type) => {
    let ref=item.verbaleRef||item.ref||'';
    if((item.demoBaseCode||item.code)==='R33'&&item.staticVariantIndex!==undefined)ref=ref.replace(/c\.4-bis(?! lett)/,'c.4-bis lett.'+String.fromCharCode(97+item.staticVariantIndex));
    ref=ref.replace('Taxi: CdS art.86 c.3-bis; NCC: CdS art.85 c.4-ter (se condizione del titolo verificata)',type==='NCC'?'CdS art.85 c.4-ter (solo se condizione dell’autorizzazione verificata)':'CdS art.86 c.3-bis (solo se condizione della licenza verificata)');
    return window.prontuarioOrderedReferences(ref).join('; ');
  };
  window.prontuarioIsResidual = item => /3-bis|4-ter/.test(item.verbaleRef||item.ref||'');
  window.prontuarioLegalText = (item,type) => {
    if(window.prontuarioCatalogIsRelation(item))return '';
    if(code(item)==='N10')return 'Prescrizione: L.218/2003 art.6 c.2. Norma sanzionatoria: art.6 c.3 della stessa legge; la mera dimenticanza del documento richiede la distinta verifica dell’art.180 c.7 CdS, richiamato dalla L.R.10/2024 art.27 c.3.';
    if(code(item)==='G53')return 'Prescrizione: D.L.179/2012 art.15 c.4. Norma sanzionatoria: art.15 c.4-bis dello stesso decreto; L.689/1981 per il procedimento, escluso il pagamento in misura ridotta.';
    if(code(item)==='G54')return 'Prescrizione: L.R.10/2024 artt.17 e 19 c.3 (iscrizione al ruolo). Norma sanzionatoria: art.21 c.1; comunicazioni obbligatorie: art.21 c.2.';
    const refs=window.prontuarioOrderedReferences(window.prontuarioNormative(item,type));
    const sanction=refs.filter(s=>/CdS/.test(s));
    const obligations=refs.filter(s=>!/CdS/.test(s));
    return [sanction.length?`Norma sanzionatoria: ${sanction.join('; ')}.`:'', obligations.length?`Prescrizione: ${obligations.join('; ')}.`:'',window.prontuarioIsResidual(item)?'Condizione del titolo e sua efficacia riscontrate in […]; escluse le fattispecie CdS più specifiche.':''].filter(Boolean).join(' ');
  };
  window.prontuarioFollowup = (item,accessory) => {
    const base=code(item),group=item.group;
    const relation=window.prontuarioCatalogIsRelation(item);
    const cds=Array.isArray(accessory.cds)?accessory.cds.join(' '):accessory.cds||'Non previste';
    const duties=[];
    if(/sospensione (?:del )?documento di circolazione/i.test(cds)) duties.push('Operatori: ritiro del documento, menzione nel verbale e trasmissione con copia all’UMC entro cinque giorni; permesso limitato al trasferimento e fermo con custodia per la durata della sospensione (artt. 214, comma 7, e 217 CdS).');
    if(/confisca/i.test(cds)) duties.push('Operatori: sequestro ai fini della confisca e custodia con atto separato (art. 213 CdS); trasmissione del verbale al Prefetto entro dieci giorni (art. 210, comma 3).');
    if(/sospensione (?:della )?patente|patente\s+4[–-]12/i.test(cds)) duties.push('Operatori: ritiro della patente e trasmissione alla Prefettura entro cinque giorni (art. 218 CdS).');
    if(/revoca.*patente|patente.*revoca/i.test(cds)) duties.push('Operatori: comunicazione dei presupposti di revoca al Prefetto entro cinque giorni (art. 219 CdS); non disporre autonomamente la revoca.');
    if(['c','d'].includes(group)) duties.push('Operatori: ritiro obbligatorio della licenza/autorizzazione comunale quando è accertata la violazione del gruppo '+group.toUpperCase()+' (regolamento, art. 29, comma 4); documentare e trasmettere il titolo. Il ritiro non è il provvedimento di sospensione.');
    let report=group?'Segnalazione obbligatoria all’ufficio competente: '+office+'. Presupposto: accertata violazione ricompresa nel gruppo '+group.toUpperCase()+' dell’art. 29, comma 2; obbligo degli operatori ex comma 3.':'Per il seguito comunale trasmettere i fatti pertinenti all’ufficio competente; non è dimostrato un obbligo generalizzato ex art. 29, comma 3, fuori dalle fattispecie elencate.';
    if(relation&&group)report+=' La sola ipotesi ancora da qualificare non prova tale presupposto.';
    if(base==='G54')report='Comunicazioni obbligatorie degli organi accertatori ex L.R. 10/2024, art. 21, comma 2: CCIAA competente, uffici provinciali Guardia di finanza, UMC, ufficio territoriale Agenzia delle entrate, Ispettorato del lavoro e INPS, accertato l’esercizio senza iscrizione al ruolo.';
    if(base==='N10')report='Segnalazione obbligatoria all’ufficio competente: l’autorità che applica la sanzione segnala alla Regione che ha rilasciato l’autorizzazione (L.218/2003 art.8). Gli operatori trasmettono gli atti per tale seguito. In Campania riscontrare il titolo e il Comune/SUAP competente (L.R.10/2024 artt.23, 27 e 33).';
    if(['N04','N05','N06','N07','R33'].includes(base))report='Trasmettere i riscontri al Comune titolare del procedimento NCC e, per il seguito sul ruolo, alla CCIAA competente. L.21/1992 art.11-bis e L.R.10/2024 art.21 c.6 prevedono regimi da coordinare, non un’identica misura automatica né un espresso obbligo generale di doppio invio a ogni controllo. Distinto l’invio obbligatorio del documento all’UMC.';
    if(base==='G53')report='Rapporto obbligatorio al Prefetto della provincia in cui è commessa la violazione, ex D.L.179/2012 art.15 c.4-bis e L.689/1981 art.17; non applicare automaticamente l’art.29 del regolamento.';
    const outcomes={a:'Gruppo A: diffida alla prima; sospensione di 5 giorni alla seconda, 15 alle successive.',b:'Gruppo B: sospensione 15/30/60 giorni; 5 punti dopo la prima.',c:'Gruppo C: sospensione 15/30/60 giorni; 10 punti per violazione.',d:'Gruppo D: sospensione 30/60 giorni; 20/30 punti.'};
    const officeText=(outcomes[group]||'Ulteriori provvedimenti solo se ne ricorrono i presupposti di legge e regolamento.')+' Decisione dell’autorità competente, non degli operanti. Punti comunali sul titolo Taxi/NCC, non sulla patente. Procedura e reiterazioni: legenda “Segnalazione e provvedimenti”.';
    return {cds,operators:duties.join(' ')||'Accertare e documentare la condotta, identificare il soggetto obbligato e la fonte applicabile. Nessun ritiro automatico previsto da questa scheda.',report,office:officeText,other:accessory.other||'',patentPoints:accessory.patentPoints||'No'};
  };
  window.prontuarioFollowupFormula = item => {
    if(window.prontuarioCatalogIsRelation(item))return '';
    if(['N04','N05','N06','N07','R33'].includes(code(item)))return 'Gli atti sono da trasmettere al Comune che ha rilasciato l’autorizzazione NCC e alla CCIAA competente per il ruolo. Stato della trasmissione: […].';
    if(['G53','G54','N10'].includes(code(item)))return 'Adempimenti di comunicazione: destinatari, stato ed estremi da completare secondo il riquadro […].';
    if(!item.group)return '';
    return 'Gli atti sono da trasmettere al Servizio Trasporto Pubblico Locale e MaaS del Comune di Napoli per il seguito di competenza (regolamento, art. 29, comma 3). Stato della trasmissione: […].';
  };
  window.prontuarioActStatus = item => {
    const acts=window.prontuarioCatalogActs(item);
    const labels=acts.map(a=>a.title);
    if(['c','d'].includes(item.group))labels.push('Ritiro del titolo comunale');
    return labels.length?'Adempimenti — stato ed estremi da completare: '+[...new Set(labels)].join('; ')+': […].':'';
  };
  window.prontuarioFollowupMarkup = (item,accessory,esc,pdf=false) => {
    const f=window.prontuarioFollowup(item,accessory);
    if(pdf){
      f.operators=f.operators.replace('Operatori: ritiro del documento, menzione nel verbale e trasmissione con copia all’UMC entro cinque giorni; permesso limitato al trasferimento e fermo con custodia per la durata della sospensione (artt. 214, comma 7, e 217 CdS).','Operatori: ritiro documento e invio all’UMC entro 5 giorni; permesso di trasferimento, fermo e custodia (artt. 214/217 CdS; appendice A6).');
      if(item.group)f.report='Segnalazione obbligatoria all’ufficio competente: Servizio Trasporto Pubblico Locale e MaaS, Comune di Napoli. Art. 29, comma 3: violazione del gruppo '+item.group.toUpperCase()+' accertata; non basta un’ipotesi ancora da qualificare.';
      else if(!['G53','G54','N10','N04','N05','N06','N07','R33'].includes(code(item)))f.report='Trasmettere i fatti pertinenti al Servizio TPL e MaaS; l’obbligo ex art. 29, comma 3, non si estende automaticamente fuori dall’elenco (appendice A1).';
      f.office=f.office.replace(' Decisione dell’autorità competente, non degli operanti. Punti comunali sul titolo Taxi/NCC, non sulla patente. Procedura e reiterazioni: legenda “Segnalazione e provvedimenti”.',' Solo autorità competente; punti sul titolo Taxi/NCC. Procedura: appendice A1–A2.');
    }
    const rows=[['Sanzioni accessorie CdS',f.cds],['Adempimenti obbligatori degli operatori',f.operators],['Segnalazione e destinatari',f.report],...(f.other?[['Altre misure e comunicazioni',f.other]]:[]),['Decurtazione punti patente',f.patentPoints]];
    const info=pdf?`<aside class="officeInfo"><b>Provvedimenti dell’Amministrazione — non copiati</b><p>${esc(f.office)}</p></aside>`:`<details class="officeInfo" data-no-copy><summary>Segnalazione e provvedimenti — informazione, non testo del verbale</summary><p>${esc(f.office)}</p><p>${esc(window.prontuarioOfficeGuide)}</p></details>`;
    return `<table class="staticAccessoryTable"><tbody>${rows.map(([label,value])=>`<tr><th scope="row">${esc(label)}</th><td>${esc(value)}</td></tr>`).join('')}</tbody></table>${info}`;
  };
})();
