// Revisione locale 1.8.12. R44–R46 sono integrate dalla successiva revisione1.8.13.
(function () {
  const w=window,applies=item=>item.code==='R43';
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const conditions={
    temperatura:'La temperatura atmosferica era di […] °C, come rilevata mediante […] in […] alle ore […], fonte del rilievo […].',
    bollettino:'Il bollettino del Ministero della Salute per l’area urbana di Napoli, emesso il […] e riferito alla giornata del […], prevedeva livello di rischio […] (2 o 3), come da copia […].',
    entrambe:'La temperatura atmosferica era di […] °C, rilevata mediante […] in […] alle ore […], fonte […]; inoltre il bollettino del Ministero della Salute per Napoli, emesso il […] e riferito alla giornata del […], prevedeva rischio […] (2 o 3), come da copia […].'
  };
  function formula(item,condition='temperatura',period='2025'){
    const season=period==='2024'?'12 giugno–15 settembre 2024':'1° giugno–15 settembre';
    const act=period==='2024'?'ORDSI/2024/0000443 del 10 giugno 2024':'ORDSI/2025/0000571 del 29 maggio 2025';
    return `Il giorno […] alle ore […], nella fascia 12–16 e nel periodo ${season}, in […], utilizzava l’equino […] per la trazione della vettura […] in violazione dell’ordinanza ${act}. ${conditions[condition]||conditions.temperatura}`;
  }
  const notes=[
    'Presupposti congiunti: periodo stagionale, fascia 12–16 e almeno una condizione tra temperatura atmosferica ≥30 °C oppure bollettino Napoli con rischio 2/3 per quella giornata. Fuori fascia o stagione questo divieto non si applica. Verificare e documentare il presupposto scelto; il solo caldo generico non basta.',
    '2024: soltanto dal 12 giugno al 15 settembre 2024. 2025: 1° giugno–15 settembre, senza limitazione al solo anno 2025; durata fino all’approvazione consiliare degli aggiornamenti del Regolamento per la tutela degli animali. Non reperite modifiche o revoche nei percorsi ufficiali consultati al 23/10/2026: esito non esaustivo, verificare atti successivi e clausola di durata prima dell’uso.',
    'TUEL art. 7-bis, commi 1 e 1-bis: €25–500, salvo diversa disposizione di legge. Art. 16, comma 1, L.689/1981: PMR €50 entro 60 giorni, oltre spese (doppio di €25 più favorevole di €500/3). Salvo diversa deliberazione di Giunta ex comma 2: nessuna acquisita per questo caso.',
    'Entrambe le ordinanze citano soltanto il terzo del massimo per il PMR, omettendo l’alternativa del doppio del minimo; non preimpostare €166,67 come unica misura. Il richiamo «art.16 della L.16/2003» è incongruente: l’art.7-bis fu introdotto dall’art.16 della L.3/2003. Non si tratta di una deroga di Giunta documentata.',
    'Se temperatura e bollettino ricorrono insieme, descriverli nella medesima violazione: nessuna duplicazione automatica. R39–R42 riguardano prescrizioni della licenza ex art.70 CdS; per lo stesso fatto verificare specialità ex art.9 L.689/1981 e fatti autonomi prima di ipotizzare cumuli. Nessuno sconto del 30%, punto o ritiro della licenza da questa scheda.',
    'Le ordinanze riguardano anche manifestazioni ludiche; questa formula è dedicata alla trazione della vettura. L’O.S.835/2014 è richiamata come salva se compatibile, ma il suo integrale non è acquisito: sei ore, capienza e scarpe protettive sono prescrizioni confermate dall’autore, con schede distinte R44–R46 e sanzione specifica non verificata documentalmente.'
  ];
  const amounts=()=>'<table class="staticAmountsTable amounts"><caption>Importi in euro, spese escluse · L.689/1981</caption><thead><tr><th>Limiti edittali</th><th>PMR entro 60 giorni</th><th>Dopo 60 giorni</th></tr></thead><tbody><tr><td>€ 25–500</td><td>€ 50 · salvo delibera di Giunta ex art.16, comma 2</td><td>Rapporto ex art.17; ordinanza ex art.18, nessun raddoppio automatico</td></tr></tbody></table>';
  const previousView=w.prontuarioRevisionView;
  w.prontuarioRevisionView=(item,type)=>{
    if(!applies(item))return previousView(item,type);
    return {title:item.title,status:'Verificare durata dell’ordinanza 2025 e atti successivi prima della contestazione.',normative:w.prontuarioNormative(item,type),accessories:{cds:'Non previste',other:'',patentPoints:'Non previsti'},relation:false,parts:[formula(item)],formulaMarkup:`<p class="staticFormulaPart" data-copy-text="${esc(formula(item))}">${esc(formula(item))}</p>`,groups:[],notes,pdfNotes:[...notes,'Alternativa da sostituire alla frase sulla temperatura: '+conditions.bollettino,'Se entrambe documentate, sostituire la stessa frase con: '+conditions.entrambe,'Per fatti del 2024 sostituire nella formula il periodo con «12 giugno–15 settembre 2024» e l’atto con «ORDSI/2024/0000443 del 10 giugno 2024». Le alternative non si sommano come violazioni.'],amountsMarkup:amounts(),responsibility:'Individuare l’autore dell’utilizzo e gli eventuali obbligati ex artt.3 e 6 L.689/1981, senza dedurli automaticamente dalla titolarità della licenza.',route:'',acts:[]};
  };
  const previousFollowup=w.prontuarioFollowup;
  w.prontuarioFollowup=(item,accessory)=>!applies(item)?previousFollowup(item,accessory):{
    cds:'Non previste da questa fattispecie TUEL.',operators:'Documentare data, ora, luogo, equino e impiego; acquisire temperatura con fonte del rilievo oppure bollettino Napoli pertinente. Verificare efficacia e durata dell’atto.',report:'In mancanza di pagamento, rapporto all’autorità comunale competente ex art.17 L.689/1981; per il seguito del titolo, trasmettere i fatti pertinenti all’Ufficio Corso Pubblico.',office:'Provvedimenti sul titolo solo con presupposti propri e decisione dell’ufficio. Nessun ritiro, sospensione o revoca automatici per questa violazione TUEL.',other:'',patentPoints:'Non previsti.'
  };
  const previousMarkup=w.prontuarioFollowupMarkup;
  w.prontuarioFollowupMarkup=(item,accessory,escape,pdf=false)=>{
    if(!applies(item))return previousMarkup(item,accessory,escape,pdf);
    const f=w.prontuarioFollowup(item,accessory);
    return `<table class="staticAccessoryTable"><tbody>${[['Sanzioni accessorie CdS',f.cds],['Adempimenti degli operatori',f.operators],['Segnalazione e destinatari',f.report],['Decurtazione punti patente',f.patentPoints]].map(([k,v])=>`<tr><th>${escape(k)}</th><td>${escape(v)}</td></tr>`).join('')}</tbody></table><aside class="officeInfo"><b>Provvedimenti dell’Amministrazione — non copiati</b><p>${escape(f.office)}</p></aside>`;
  };
  function body(item,type){
    const v=w.prontuarioRevisionView(item,type);
    const radios=(name,options)=>`<fieldset class="secondaChoices" data-no-copy>${options.map(([key,label],i)=>`<label><input type="radio" name="${name}" value="${key}" ${i===0?'checked':''}> ${label}</label>`).join('')}</fieldset>`;
    return `<section class="caseBlock staticNormative"><h3>Riferimenti normativi — obblighi e sanzioni</h3><p>${esc(v.normative)}</p><p class="qualificationWarning">${esc(v.status)}</p></section><section class="caseBlock staticAmounts"><h3>Tabella importi</h3>${v.amountsMarkup}</section><section class="caseBlock staticAccessories"><h3>Sanzioni accessorie e adempimenti</h3>${w.prontuarioFollowupMarkup(item,v.accessories,esc)}</section><section class="caseBlock staticFormula" data-caldo-code="R43"><h3>Testo orientativo del verbale</h3><h4>Ordinanza applicabile alla data del fatto</h4>${radios('caldo-periodo',[['2025','Disciplina 2025 · verificare clausola di durata'],['2024','Fatti del 12 giugno–15 settembre 2024']])}<h4>Condizione effettivamente accertata</h4>${radios('caldo-condizione',[['temperatura','Temperatura ≥30 °C documentata'],['bollettino','Bollettino Napoli rischio 2/3 pertinente'],['entrambe','Entrambe documentate · stessa violazione']])}<div class="formulaText" id="formulaText">${v.formulaMarkup}</div><button class="small" id="copyFormula">Copia testo orientativo</button><h4>Campi essenziali</h4><p>Data, ora nella fascia 12–16, luogo, equino e vettura; temperatura e fonte del rilievo oppure bollettino Napoli con data di emissione, giorno di validità, livello e copia acquisita. Completare solo con fatti riscontrati.</p></section><section class="caseBlock staticSuggestions"><h3>Suggerimenti e note operative</h3><ul class="operativeNotes">${notes.map(n=>`<li>${esc(n)}</li>`).join('')}</ul><h4>Responsabilità</h4><p>${esc(v.responsibility)}</p><details class="caseSource"><summary>Approfondimenti e fonti</summary>${(item.sourceIndices||[]).map((i,n)=>`<button class="small" onclick="openPDF(${i},1)">Ordinanza caldo ${n===0?'2024':'2025'} · integrale acquisito</button>`).join('')}<p>Rapporto caldo: revisione1.8.12. Prescrizioni O.S.835/2014 confermate dall’autore: R44–R46, revisione1.8.13.</p></details></section>`;
  }
  for(const name of ['prontuarioStaticDemoBody','prontuarioCatalogBody']){const previous=w[name];w[name]=(item,type,helpers)=>applies(item)?body(item,type):previous(item,type,helpers);}
  w.prontuarioCaldoApplies=applies;w.prontuarioCaldoFormula=formula;
  if(typeof document!=='undefined')document.addEventListener('change',event=>{
    const section=event.target.closest('[data-caldo-code]');if(!section)return;
    const text=formula(null,section.querySelector('[name="caldo-condizione"]:checked').value,section.querySelector('[name="caldo-periodo"]:checked').value),p=section.querySelector('.staticFormulaPart');p.textContent=text;p.dataset.copyText=text;
  });
})();
