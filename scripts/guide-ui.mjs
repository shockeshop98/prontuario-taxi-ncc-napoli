import {assessPrevious,compose} from './composer-core.mjs';
import {hasInlineDemo,renderInlineDemo} from './inline-demo-ui.mjs';

const host = window.prontuarioGuideHost;
let panel;
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const variantKey = type => type === 'Trazione animale' ? 'equina' : type.toLowerCase();
let guidePromise;
let active = null;

function fieldHTML(field) {
  const id = 'guide-' + field.id;
  const control = field.input === 'textarea'
    ? `<textarea id="${id}" data-guide-field="${escapeHTML(field.id)}" autocomplete="off"></textarea>`
    : field.input === 'select'
    ? `<select id="${id}" data-guide-field="${escapeHTML(field.id)}"><option value="">Seleziona, nessuna opzione è preselezionata</option>${field.options.map(option=>`<option value="${escapeHTML(option.id)}">${escapeHTML(option.label)}</option>`).join('')}</select>`
    : `<input id="${id}" data-guide-field="${escapeHTML(field.id)}" type="${field.input === 'date' ? 'date' : 'text'}" autocomplete="off">`;
  return `<div class="guideField"><label for="${id}">${escapeHTML(field.label)}</label>${field.context ? `<small>Nel testo: ${escapeHTML(field.context)}</small>` : ''}${control}<small>${escapeHTML(field.help)}</small></div>`;
}

function sourceHTML(choice) {
  const id = escapeHTML(choice.id);
  const office = choice.id === 'office';
  const document = choice.id === 'document';
  const statement = choice.id === 'statement';
  return `<div class="guideChoice"><label><input type="checkbox" data-guide-source="${id}"> ${escapeHTML(choice.label)}</label><div data-guide-source-box="${id}" hidden><p>${escapeHTML(choice.help)}</p><small>Struttura suggerita, da adattare: ${escapeHTML(choice.template)}</small>${office ? `
    <div class="guideFields">
      <label>Ufficio effettivamente interpellato<input data-guide-office="name" autocomplete="off"></label>
      <label>Data e ora<input data-guide-office="time" autocomplete="off"></label>
      <label>Canale<input data-guide-office="channel" autocomplete="off"></label>
      <label>Stato del riscontro<select data-guide-office="status"><option value="">Seleziona</option><option value="ottenuto">Ottenuto</option><option value="pendente">Pendente</option></select></label>
      <label>Contenuto della risposta<textarea data-guide-office="content" autocomplete="off"></textarea></label>
      <label>Estremi della risposta o della richiesta<input data-guide-office="reference" autocomplete="off"></label>
    </div>` : document ? `<div class="guideFields">
      <label>Documento ed estremi<input data-guide-document="reference" autocomplete="off"></label>
      <label>Dato letto nel documento<textarea data-guide-document="content" autocomplete="off"></textarea></label>
      <label>Operazione effettiva<select data-guide-document="status"><option value="">Seleziona</option><option value="examined">Solo esaminato</option><option value="copy_acquired">Copia acquisita</option></select></label>
    </div>` : statement ? `<div class="guideFields">
      <label>Dichiarante<input data-guide-statement="person" autocomplete="off"></label>
      <label>Contenuto della dichiarazione<textarea data-guide-statement="content" autocomplete="off"></textarea></label>
      <label>Estremi dell’atto di formalizzazione<input data-guide-statement="reference" autocomplete="off"></label>
    </div>` : `<textarea data-guide-source-text="${id}" autocomplete="off" aria-label="${escapeHTML(choice.label)}"></textarea>`}
    ${choice.id === 'reported_relation' ? `<label>Stato della relazione<select data-guide-relation-status><option value="">Seleziona</option><option value="da_redigere">Da redigere</option><option value="redatta">Già redatta</option></select></label><label>Estremi, solo se già redatta<input data-guide-relation-reference autocomplete="off"></label>` : ''}
  </div></div>`;
}

function actHTML(act) {
  return `<div class="guideChoice"><label><input type="checkbox" data-guide-act="${escapeHTML(act.id)}"> ${escapeHTML(act.label)}</label><div data-guide-act-box="${escapeHTML(act.id)}" hidden><p>${escapeHTML(act.help)}</p><div class="guideFields">${act.fields.map(fieldHTML).join('')}</div></div></div>`;
}

function licenseDecisionHTML(decision) {
  return `<section class="guideSection"><h4>${escapeHTML(decision.heading||'Stato della licenza')} · scelta obbligatoria per il verbale</h4><p class="guideCaution">${escapeHTML(decision.caution||'La sola mancata esibizione o una verifica pendente non bastano a compilare il verbale. In questi casi è disponibile soltanto la relazione sui fatti accertati.')}</p>
    <label for="guideEvidenceState">Stato del riscontro sul titolo</label><select id="guideEvidenceState"><option value="">Seleziona, nessuna opzione è preselezionata</option>${decision.evidenceStates.map(state=>`<option value="${escapeHTML(state.id)}">${escapeHTML(state.label)}</option>`).join('')}</select>
    <div id="guideLicenseBox" hidden><label for="guideLicenseChoice">${escapeHTML(decision.choiceLabel||'Condizione della licenza confermata')}</label><select id="guideLicenseChoice"><option value="">Seleziona una sola condizione</option>${decision.choices.map(choice=>`<option value="${escapeHTML(choice.id)}">${escapeHTML(choice.label)}</option>`).join('')}</select><div id="guideLicenseFields" class="guideFields"></div></div>
    <p class="muted">${escapeHTML(decision.staticGuidance)}</p>${decision.normativeReview ? `<p class="guideCaution"><b>Verifica normativa e limite operativo:</b> ${escapeHTML(decision.normativeReview)}</p>` : ''}</section>`;
}

function dualCheckHTML(decision) {
  return `<section class="guideSection"><h4>${escapeHTML(decision.heading)}</h4><p class="guideCaution">${escapeHTML(decision.caution)}</p>${decision.checks.map(check=>`<div class="guideChoice"><label for="guide-check-${escapeHTML(check.id)}">${escapeHTML(check.label)}</label><select id="guide-check-${escapeHTML(check.id)}" data-guide-check="${escapeHTML(check.id)}"><option value="">Seleziona l’esito verificato</option>${check.choices.map(choice=>`<option value="${escapeHTML(choice.id)}">${escapeHTML(choice.label)}</option>`).join('')}</select><div class="guideFields" data-guide-check-fields="${escapeHTML(check.id)}"></div></div>`).join('')}<p class="muted">${escapeHTML(decision.staticGuidance)}</p>${decision.normativeReview ? `<p class="guideCaution"><b>Verifica normativa e limite operativo:</b> ${escapeHTML(decision.normativeReview)}</p>` : ''}</section>`;
}

function previousDecisionHTML(decision) {
  return `<section class="guideSection"><h4>${escapeHTML(decision.heading)}</h4><p class="guideCaution">${escapeHTML(decision.caution)}</p>
    <p>Disposizione attesa nell’atto precedente: <b>${escapeHTML(decision.expectedNorm)}</b>.</p>
    <label for="guidePreviousState">Stato del riscontro sul precedente</label><select id="guidePreviousState"><option value="">Seleziona, nessuna opzione è preselezionata</option><option value="verified">${decision.requiresPersonalLicenseCheck?'Precedente e identità personale documentati':'Precedente documentato e verificato'}</option>${decision.requiresPersonalLicenseCheck?'<option value="company_only">Riscontro riferito alla sola impresa o al solo titolare</option>':''}<option value="insufficient">Riscontro insufficiente o pendente</option></select>
    <div id="guidePreviousFields" hidden><div class="guideFields">${decision.fields.map(fieldHTML).join('')}</div><label class="guideCheck"><input id="guidePreviousConfirmed" type="checkbox"> ${decision.requiresPersonalLicenseCheck?'Ho confrontato atti, identità e ruolo della persona interessata dalla patente. Questa conferma non risolve da sola i dubbi giuridici: occorre il riscontro dell’Ufficio Verbali indicato sopra.':'Ho confrontato identità, norma, esito e date dei fatti con gli atti e con l’Ufficio Verbali per i dubbi ancora aperti.'}</label></div>
    <div id="guidePreviousPending" class="guideFields" hidden><p class="guideCaution">La scheda del fatto attuale resta consultabile e compilabile se il fatto è accertato autonomamente. Il precedente incompleto consente solo una relazione, senza conclusione sulla reiterazione e senza qualifica automatica di prima violazione.</p><label for="guide-previous_pending_detail">${decision.requiresPersonalLicenseCheck?'Che cosa è noto sull’impresa o sulla persona e che cosa resta da verificare':'Che cosa è noto e che cosa resta da verificare'}</label><textarea id="guide-previous_pending_detail" data-guide-field="previous_pending_detail" autocomplete="off"></textarea></div>
  </section>`;
}

function reset() {
  active = null;
  if (panel) {
    panel.onchange = null;
    panel.oninput = null;
    panel.replaceChildren();
    panel.hidden = true;
  }
  panel = null;
}

async function guides() {
  if (!guidePromise) guidePromise = fetch(new URL('../data/guide-operative.json', import.meta.url))
    .then(response => { if (!response.ok) throw Error('Guide non disponibili'); return response.json(); })
    .then(data => { if (data.guides?.length !== 118 || data.schemaVersion !== 1) throw Error('Pacchetto guide incompleto'); return data; })
    .catch(error => { guidePromise = null; throw error; });
  return guidePromise;
}

function render(guide, variant, type) {
  active = {guide, variant, type};
  panel.hidden = false;
  panel.innerHTML = `<div class="guideHeader"><div><span class="badge">Bozza editoriale · supporto guidato</span><h3>Supporto guidato · ${escapeHTML(guide.code)}</h3><p>I suggerimenti non sono fatti accertati e non vengono inseriti automaticamente.</p></div><button id="guideClose" class="small">Torna alla scheda</button></div>
    <div class="guideStages" aria-label="Passi del supporto">1. Presupposti · 2. Campi e provenienza · 3. Atti · 4. Anteprima</div>
    <section class="guideSection"><h4>Quando ricorre e cosa verificare</h4><p><b>Situazione esemplificativa:</b> ${escapeHTML(guide.scenario.text)}</p><p><b>Elementi da ricostruire:</b> ${escapeHTML(guide.applicability.when)}</p><p><b>Non basta:</b> ${escapeHTML(guide.applicability.notEnough)}</p><p><b>Verifica prima:</b> ${escapeHTML(guide.applicability.verifyFirst)}</p><p class="guideCaution">${escapeHTML(guide.applicability.qualification)}</p></section>
    ${variant.licenseDecision ? licenseDecisionHTML(variant.licenseDecision) : ''}
    ${variant.dualCheckDecision ? dualCheckHTML(variant.dualCheckDecision) : ''}
    ${variant.previousDecision ? previousDecisionHTML(variant.previousDecision) : ''}
    <details class="guideSection" open><summary>Descrivi il fatto · ${variant.fields.length} campi</summary><div class="guideDetail"><p>${escapeHTML(guide.descriptionHelp.prompt)}</p><p class="muted">${escapeHTML(guide.descriptionHelp.documentPrompt)}</p><div class="guideFields">${variant.fields.map(fieldHTML).join('')}</div>
      <label class="guideCheck"><input id="guideContext" type="checkbox"> Aggiungi data, ora e luogo se non già presenti nel testo</label>
      <div id="guideContextBox" class="guideFields" hidden>${variant.optionalContext?.fields.map(fieldHTML).join('') || ''}</div></div></details>
    <details class="guideSection"><summary>Provenienza dei riscontri e ufficio interpellato</summary><div class="guideDetail"><p>${escapeHTML(guide.evidenceHelp.focus)}</p><p><b>Ufficio/categoria da verificare:</b> ${escapeHTML(guide.officeHelp.category)}</p><p>${escapeHTML(guide.officeHelp.request)}</p><p class="guideCaution">Indica solo l'ufficio effettivamente interpellato. Una richiesta pendente non è una risposta ottenuta.</p>${guide.evidenceHelp.choices.map(sourceHTML).join('')}${guide.evidenceHelp.passengerRefusal ? `<p class="guideCaution">${escapeHTML(guide.evidenceHelp.passengerRefusal)}</p>` : ''}</div></details>
    <details class="guideSection"><summary>Atti eseguiti e seguito</summary><div class="guideDetail"><p>${escapeHTML(guide.procedure.existingText)}</p><p class="guideCaution">${escapeHTML(guide.procedure.actsAreNotOptionalObligations)}</p>${variant.acts.map(actHTML).join('') || '<p>Nessun blocco di atto predefinito per questa scheda.</p>'}<p>${escapeHTML(guide.procedure.corsoPubblico)}</p><label class="guideCheck"><input id="guideProcedureReviewed" type="checkbox"> Ho confrontato gli atti selezionati con il seguito dovuto indicato nella scheda.</label></div></details>
    <details class="guideSection"><summary>Suggerimenti documentali e fotografici</summary><div class="guideDetail"><p>${escapeHTML(guide.descriptionHelp.documentPrompt)}</p><ul>${guide.procedure.photographicSuggestions.map(note => `<li>${escapeHTML(note)}</li>`).join('')}</ul></div></details>
    <section class="guideSection"><h4>Anteprima e copia</h4><label for="guideOutput">Destinazione del testo</label><select id="guideOutput">${variant.allowVerbale ? '<option value="verbale">Verbale</option>' : ''}<option value="relation">Relazione</option></select>
      ${variant.requiresQualificationConfirmationForVerbale ? '<label class="guideCheck"><input id="guideQualification" type="checkbox"> Ho verificato esplicitamente la base e i presupposti per la contestazione.</label>' : ''}
      <p id="guideStatus" role="status" aria-live="polite"></p><pre id="guidePreview" tabindex="0"></pre><div class="toolbar"><button id="guideCopy" disabled>Copia riferimento e testo composto</button><button id="guideReset" class="small">Azzera compilazione</button></div><small>Nessun dato compilato è salvato o inviato. La copia negli appunti avviene solo con questo pulsante.</small></section>`;
  panel.querySelector('#guideOutput').value = variant.outputDefault;
  if (variant.licenseDecision) {
    const evidence=panel.querySelector('#guideEvidenceState'),choice=panel.querySelector('#guideLicenseChoice');
    panel.querySelector('#guideOutput option[value="verbale"]').disabled=true;
    evidence.onchange=()=>{
      const verified=evidence.value==='verified';
      panel.querySelector('#guideLicenseBox').hidden=!verified;
      panel.querySelector('#guideOutput option[value="verbale"]').disabled=!verified;
      if(!verified)panel.querySelector('#guideOutput').value='relation';
      panel.querySelector('#guideQualification').checked=false;
      choice.value='';
      panel.querySelector('#guideLicenseFields').replaceChildren();
      update();
    };
    choice.onchange=()=>{
      const selected=variant.licenseDecision.choices.find(entry=>entry.id===choice.value);
      panel.querySelector('#guideQualification').checked=false;
      const fields=panel.querySelector('#guideLicenseFields');
      fields.innerHTML=selected?selected.fields.map(fieldHTML).join(''):'';
      fields.querySelectorAll('input,textarea,select').forEach(input=>input.addEventListener('input',update));
      update();
    };
  }
  if (variant.dualCheckDecision) {
    const verbale=panel.querySelector('#guideOutput option[value="verbale"]');
    verbale.disabled=true;
    for(const check of variant.dualCheckDecision.checks){
      const input=panel.querySelector(`[data-guide-check="${check.id}"]`);
      input.onchange=()=>{
        const selected=check.choices.find(choice=>choice.id===input.value);
        const fields=panel.querySelector(`[data-guide-check-fields="${check.id}"]`);
        fields.innerHTML=selected?selected.fields.map(fieldHTML).join(''):'';
        fields.querySelectorAll('input,textarea,select').forEach(field=>field.addEventListener('input',update));
        panel.querySelector('#guideQualification').checked=false;
        const irregular=variant.dualCheckDecision.checks.some(entry=>entry.choices.find(choice=>choice.id===panel.querySelector(`[data-guide-check="${entry.id}"]`).value)?.irregular);
        verbale.disabled=!irregular;
        if(!irregular)panel.querySelector('#guideOutput').value='relation';
        update();
      };
    }
  }
  if (variant.previousDecision) {
    const state=panel.querySelector('#guidePreviousState');
    state.onchange=()=>{
      panel.querySelector('#guidePreviousFields').hidden=state.value!=='verified';
      panel.querySelector('#guidePreviousPending').hidden=!['insufficient','company_only'].includes(state.value);
      panel.querySelector('#guidePreviousConfirmed').checked=false;
      panel.querySelector('#guideOutput').value='relation';
      update();
    };
  }
  panel.querySelector('#guideClose').onclick = reset;
  panel.querySelector('#guideReset').onclick = () => render(guide, variant, type);
  panel.querySelector('#guideContext').onchange = event => { panel.querySelector('#guideContextBox').hidden = !event.target.checked; update(); };
  for (const input of panel.querySelectorAll('[data-guide-act]')) input.onchange = () => {
    panel.querySelector(`[data-guide-act-box="${input.dataset.guideAct}"]`).hidden = !input.checked; update();
  };
  for (const input of panel.querySelectorAll('[data-guide-source]')) input.onchange = () => {
    panel.querySelector(`[data-guide-source-box="${input.dataset.guideSource}"]`).hidden = !input.checked; update();
  };
  for (const input of panel.querySelectorAll('input,textarea,select')) input.addEventListener('input', update);
  for (const input of panel.querySelectorAll('input[type=checkbox],select')) input.addEventListener('change', update);
  panel.querySelector('#guideCopy').onclick = copy;
  update();
  panel.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
}

function officeSource(missing) {
  const value = key => panel.querySelector(`[data-guide-office="${key}"]`)?.value.trim() || '';
  const name=value('name'),time=value('time'),channel=value('channel'),status=value('status'),content=value('content'),reference=value('reference');
  for(const key of ['name','time','channel','status'])if(!value(key))missing.push('ufficio_'+key);
  if(status==='ottenuto' && (!content || !reference))missing.push('ufficio_risposta_o_estremi');
  if(status==='pendente' && content)missing.push('ufficio_pendente_con_risposta');
  if(!name||!time||!channel||!status||(status==='ottenuto'&&(!content||!reference)))return '';
  if(status==='ottenuto')return `L’ufficio ${name}, interpellato il ${time} tramite ${channel}, comunicava ${content.replace(/[.!?]+$/,'')}; la risposta recava gli estremi ${reference}.`;
  return `L’ufficio ${name} è stato interpellato il ${time} tramite ${channel}${reference?`, con richiesta ${reference}`:''}; la risposta era ancora pendente.`;
}

function result() {
  const values={};
  for(const input of panel.querySelectorAll('[data-guide-field]'))values[input.dataset.guideField]=input.value;
  const selectedActs=[...panel.querySelectorAll('[data-guide-act]:checked')].map(input=>input.dataset.guideAct);
  const extraMissing=[],sources=[];
  for(const input of panel.querySelectorAll('[data-guide-source]:checked')){
    const id=input.dataset.guideSource;
    let text,actText;
    if(id==='office')text=officeSource(extraMissing);
    else if(id==='document'){
      const value=key=>panel.querySelector(`[data-guide-document="${key}"]`).value.trim();
      const reference=value('reference'),content=value('content'),status=value('status');
      if(!reference||!content||!status)extraMissing.push('documento_estremi_dato_operazione');
      text=reference&&content&&status?`Dal documento ${reference}, esaminato durante il controllo, risultava ${content.replace(/[.!?]+$/,'')}.`:'';
      if(text&&status==='copy_acquired')actText=`È stata acquisita copia del documento ${reference}.`;
    }else if(id==='statement'){
      const value=key=>panel.querySelector(`[data-guide-statement="${key}"]`).value.trim();
      const person=value('person'),content=value('content'),reference=value('reference');
      if(!person||!content||!reference)extraMissing.push('dichiarazione_formalizzata_estremi');
      text=person&&content&&reference?`${person} ha dichiarato ${content.replace(/[.!?]+$/,'')}, come risulta dal verbale ${reference}.`:'';
    }
    else{
      const body=panel.querySelector(`[data-guide-source-text="${id}"]`).value.trim();
      if(!body)extraMissing.push('riscontro_'+id);
      if(id==='reported_relation'){
        const status=panel.querySelector('[data-guide-relation-status]').value;
        const reference=panel.querySelector('[data-guide-relation-reference]').value.trim();
        if(!status || (status==='redatta'&&!reference))extraMissing.push('stato_o_estremi_relazione');
        if(status==='da_redigere' && /come da relazione|relazione n[.°º]?/i.test(body))extraMissing.push('relazione_non_ancora_redatta');
        text=body&&status&&!(status==='redatta'&&!reference)?`Nel corso del controllo, ${body.replace(/[.!?]+$/,'')}.`:'';
        if(text&&status==='redatta')text+=` Tali fatti sono riportati nella relazione di servizio ${reference}.`;
      }else{
        text=body?(id==='direct'?`Gli operanti osservavano inoltre ${body.replace(/[.!?]+$/,'')}.`:body):'';
      }
    }
    sources.push({id,text,actText});
  }
  const output=panel.querySelector('#guideOutput').value;
  const evidenceState=panel.querySelector('#guideEvidenceState')?.value||'';
  const licenseChoice=panel.querySelector('#guideLicenseChoice')?.value||'';
  const checkSelections=Object.fromEntries([...panel.querySelectorAll('[data-guide-check]')].map(input=>[input.dataset.guideCheck,input.value]));
  const previousState=panel.querySelector('#guidePreviousState')?.value||'';
  const previousConfirmed=panel.querySelector('#guidePreviousConfirmed')?.checked||false;
  const base=compose(active.variant,{values,selectedActs,sources,output,evidenceState,licenseChoice,checkSelections,previousState,previousConfirmed,qualificationConfirmed:panel.querySelector('#guideQualification')?.checked||false,includeContext:panel.querySelector('#guideContext').checked});
  const conflicts=[];
  if(selectedActs.includes('permesso')&&!selectedActs.includes('documento'))conflicts.push('Permesso selezionato senza ritiro del documento: verifica la coerenza degli atti.');
  if(selectedActs.includes('custodia')&&!selectedActs.includes('sequestro')&&!selectedActs.includes('documento'))conflicts.push('Custodia/fermo selezionati senza il relativo provvedimento: verifica la sequenza.');
  if(active.variant.licenseDecision && evidenceState==='verified' && panel.querySelector('[data-guide-source="office"]:checked') && panel.querySelector('[data-guide-office="status"]').value==='pendente')conflicts.push(`${active.guide.code}: il riscontro sul titolo è indicato come conclusivo, ma la risposta dell’ufficio risulta pendente.`);
  if(active.variant.dualCheckDecision && checkSelections.authorization && checkSelections.authorization!=='pending' && panel.querySelector('[data-guide-source="office"]:checked') && panel.querySelector('[data-guide-office="status"]').value==='pendente')conflicts.push('I02: l’autorizzazione è indicata come verificata, ma la risposta dell’ufficio risulta pendente.');
  const reviewed=panel.querySelector('#guideProcedureReviewed').checked;
  return {...base,missing:[...new Set([...base.missing,...extraMissing])],conflicts,copyAllowed:base.copyAllowed&&!extraMissing.length&&!conflicts.length&&reviewed,reviewed};
}

function update() {
  if(!active || panel.hidden)return;
  let verbaleAllowed=active.variant.allowVerbale;
  if(active.variant.previousDecision){
    const values=Object.fromEntries([...panel.querySelectorAll('[data-guide-field]')].map(input=>[input.dataset.guideField,input.value]));
    const prior=assessPrevious(active.variant.previousDecision,values,panel.querySelector('#guidePreviousState').value,panel.querySelector('#guidePreviousConfirmed').checked);
    verbaleAllowed&&=prior.ready;
  }
  if(active.variant.licenseDecision)verbaleAllowed&&=panel.querySelector('#guideEvidenceState').value==='verified';
  if(active.variant.licenseDecision&&panel.querySelector('#guideLicenseChoice').value==='non_conseguita')verbaleAllowed&&=panel.querySelector('[data-guide-field="service_vehicle_title_outcome"]')?.value==='absent';
  if(active.variant.dualCheckDecision&&panel.querySelector('[data-guide-check="authorization"]')?.value==='non_conseguita')verbaleAllowed&&=panel.querySelector('[data-guide-field="service_vehicle_title_outcome"]')?.value==='absent';
  if(active.variant.dualCheckDecision)verbaleAllowed&&=active.variant.dualCheckDecision.checks.some(check=>check.choices.find(choice=>choice.id===panel.querySelector(`[data-guide-check="${check.id}"]`).value)?.irregular);
  if(panel.querySelector('[data-guide-source="reported_relation"]:checked'))verbaleAllowed=false;
  const verbale=panel.querySelector('#guideOutput option[value="verbale"]');
  if(verbale){
    verbale.disabled=!verbaleAllowed;
    if(!verbaleAllowed&&panel.querySelector('#guideOutput').value==='verbale')panel.querySelector('#guideOutput').value='relation';
  }
  const response=result();
  panel.querySelector('#guidePreview').textContent=response.text;
  panel.querySelector('#guideCopy').disabled=!response.copyAllowed;
  const messages=[];
  if(response.missing.length)messages.push(`${response.missing.length} campi da completare nei blocchi scelti.`);
  if(response.requiresQualification)messages.push('Per il verbale serve confermare la base e i presupposti.');
  if(active.variant.licenseDecision){
    const state=panel.querySelector('#guideEvidenceState').value;
    if(!state)messages.push('Seleziona lo stato del riscontro sul titolo.');
    else if(state==='verified'&&!panel.querySelector('#guideLicenseChoice').value)messages.push('Scegli una sola condizione del titolo.');
    else if(state!=='verified')messages.push('La mancata esibizione o la verifica pendente non bastano per il verbale: compila soltanto la relazione sui fatti accertati.');
  }
  if(response.missing.includes('assenza_titolo_servizio_veicolo_non_confermata'))messages.push('Per “titolo non conseguito” serve il riscontro dell’assenza di un titolo che legittimi questo servizio con il veicolo controllato. La sola mancata intestazione al conducente non basta: se il riscontro è incompleto, scegli verifica pendente.');
  if(active.variant.dualCheckDecision){
    const checks=active.variant.dualCheckDecision.checks;
    for(const check of checks)if(!panel.querySelector(`[data-guide-check="${check.id}"]`).value)messages.push(`Seleziona l’esito della verifica: ${check.label}.`);
    if(checks.some(check=>panel.querySelector(`[data-guide-check="${check.id}"]`).value==='pending'))messages.push('Una verifica pendente non viene presentata come violazione.');
    if(panel.querySelector('#guideOutput').value==='relation' && !checks.some(check=>check.choices.find(choice=>choice.id===panel.querySelector(`[data-guide-check="${check.id}"]`).value)?.irregular))messages.push('Nessuna irregolarità verificata: disponibile soltanto la relazione.');
  }
  if(active.variant.previousDecision){
    const state=panel.querySelector('#guidePreviousState').value;
    if(!state)messages.push('Scegli lo stato del riscontro sul precedente.');
    else if(state==='insufficient'||state==='company_only')messages.push('Precedente non verificato: la scheda del fatto attuale resta disponibile se accertato autonomamente; solo relazione, senza conclusione sulla reiterazione né qualifica automatica di prima violazione.');
    else if(response.missing.some(key=>['conferma_riscontro_precedente','norma_precedente_non_coerente','date_fatti_non_valide','triennio_da_verificare','riscontro_precedente_insufficiente','identita_personale_non_verificata','rilevanza_precedente_non_confermata'].includes(key)))messages.push('Precedente o identità personale insufficienti: completa i riscontri e verifica i dubbi con l’Ufficio Verbali.');
    if(active.variant.previousDecision.requiresPersonalLicenseCheck&&state==='verified'&&response.missing.some(key=>['previous_license_person','previous_subject','previous_person_role','previous_person_source','previous_office_assessment'].includes(key)))messages.push('Per N02/N03 servono identità e ruolo personali documentati. Se il riscontro riguarda solo l’impresa o resta incompleto, scegli il relativo stato per comporre la relazione.');
  }
  if(panel.querySelector('[data-guide-source="reported_relation"]:checked'))messages.push('I fatti soltanto riferiti entrano esclusivamente nella relazione, senza essere presentati come dichiarazione formalizzata.');
  if(!response.reviewed)messages.push('Controlla gli atti e il seguito indicati nella scheda.');
  messages.push(...response.conflicts);
  panel.querySelector('#guideStatus').textContent=messages.join(' ')||'Testo composto: rileggilo prima di copiarlo.';
}

async function copy() {
  const response=result();
  if(!response.copyAllowed)return;
  try{
    await navigator.clipboard.writeText(response.text);
    panel.querySelector('#guideStatus').textContent='Riferimento e testo composto copiati.';
  }catch{
    const range=document.createRange(),selection=window.getSelection(),preview=panel.querySelector('#guidePreview');
    range.selectNodeContents(preview);selection.removeAllRanges();selection.addRange(range);preview.focus();
    panel.querySelector('#guideStatus').textContent='Appunti non disponibili: testo selezionato, usa Copia sul dispositivo.';
  }
}

async function open() {
  const current=host.currentCase();
  if(!current?.item)return;
  panel=document.getElementById('guidedPanel');
  if(!panel)return;
  panel.hidden=false;
  panel.innerHTML='<p class="guideLoading" role="status">Caricamento del supporto guidato…</p>';
  try{
    const data=await guides();
    const still=host.currentCase();
    if(still?.item?.id!==current.item.id || still.type!==current.type)return reset();
    const guide=data.guides.find(entry=>entry.id===current.item.id);
    const variant=guide?.variants[variantKey(current.type)];
    if(!variant || guide.code!==current.item.code || variant.normativeRef!==host.normativeRef(current.item,current.type))throw Error('Guida non coerente con la scheda corrente');
    if(hasInlineDemo(current.item,current.type))renderInlineDemo(panel,guide,variant,reset);
    else render(guide,variant,current.type);
  }catch{
    active=null;
    panel.innerHTML='<p class="guideCaution" role="alert">Supporto guidato non disponibile o non coerente con questa scheda. La consultazione rapida e il PDF restano accessibili.</p><button id="guideClose" class="small">Torna alla scheda</button>';
    panel.querySelector('#guideClose').onclick=reset;
  }
}

window.prontuarioGuide={open,reset};
window.addEventListener('pagehide',reset);
window.addEventListener('pageshow',event=>{if(event.persisted)reset()});
