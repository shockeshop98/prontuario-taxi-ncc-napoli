import {compose} from './composer-core.mjs';
import {inlineDemos} from './inline-demo-data.mjs';

const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const token = /\{\{([a-z0-9_]+)\}\}/g;
const provenanceLabels = {
  direct: 'Osservazione diretta', document: 'Documento esaminato',
  statement: 'Dichiarazione formalizzata', office: 'Risposta dell’ufficio',
  reported_relation: 'Fatto riferito da riportare nella relazione'
};

export function hasInlineDemo(item, type) {
  return type === 'Taxi' && Boolean(inlineDemos[item?.id]);
}

function displayTemplate(template, fields) {
  return esc(template).replace(token, (_, key) => `<mark class="inlineSlot">${esc(fields.find(field => field.id === key)?.label || key)}</mark>`);
}

function fieldControl(field, demo) {
  const key = field.id;
  const name = 'inline-choice-' + key;
  if (field.input === 'select') return `<div class="inlinePoint" data-inline-point="${esc(key)}"><label for="inline-${esc(key)}">${esc(field.label)}</label><select id="inline-${esc(key)}" data-inline-select="${esc(key)}"><option value="">Seleziona solo dopo il riscontro</option>${field.options.map(option => `<option value="${esc(option.id)}">${esc(option.label)}</option>`).join('')}</select><details><summary>Che cosa verificare</summary><small>${esc(field.help)}</small></details></div>`;
  const suggestions = demo.suggestions[key];
  if (!suggestions || suggestions.length < 2 || suggestions.length > 3) throw Error(`Diciture mancanti per ${demo.code}/${key}`);
  const choices = suggestions.map((entry, index) => {
    const wording = typeof entry === 'string' ? entry : entry.text;
    const provenance = typeof entry === 'string' ? '' : entry.provenance;
    return `<label><input type="radio" name="${name}" data-inline-choice="${esc(key)}" value="${index}" data-provenance="${esc(provenance)}"> <span>${esc(wording)}</span></label>`;
  }).join('');
  const source = demo.provenanceFields.includes(key) ? `<label class="inlineSource">Provenienza della dicitura<select data-inline-provenance="${esc(key)}"><option value="">Indica la fonte</option>${Object.entries(provenanceLabels).map(([id,label]) => `<option value="${id}">${esc(label)}</option>`).join('')}</select></label>` : '';
  return `<div class="inlinePoint" data-inline-point="${esc(key)}"><strong>${esc(field.label)}</strong><div class="inlineChoices" role="group" aria-label="Diciture per ${esc(field.label)}">${choices}<label><input type="radio" name="${name}" data-inline-choice="${esc(key)}" value="other"> <span>Altro: descrivere ${esc(field.label.toLowerCase())} e il relativo riscontro…</span></label></div><label class="inlineEntry">Dicitura scelta e completata<textarea data-inline-value="${esc(key)}" autocomplete="off" placeholder="Completa gli spazi ____ oppure scrivi una dicitura diversa"></textarea></label>${source}<details><summary>Che cosa verificare</summary><small>${esc(field.help)}</small></details></div>`;
}

function sentence(template, fields, demo, showTemplate = true) {
  const keys = [...new Set([...template.matchAll(token)].map(match => match[1]))];
  const controls = keys.map(key => {
    const field = fields.find(entry => entry.id === key) || (key === 'conduct_mode' ? {id:key,label:'Condotta osservata',input:'text',help:'Scegli soltanto la condotta effettivamente riscontrata.'} : null);
    if (!field) throw Error(`Campo ${key} non definito in ${demo.code}`);
    return fieldControl(field, demo);
  }).join('');
  return `<div class="inlineSentence">${showTemplate ? `<p class="inlineSentenceText">${displayTemplate(template, fields)}</p>` : ''}<div class="inlineSentencePoints">${controls}</div></div>`;
}

function actBlock(act, demo) {
  return `<div class="inlineAct"><label class="guideCheck"><input type="checkbox" data-inline-act="${esc(act.id)}"> ${esc(act.label)}: confermo che l’atto è stato eseguito</label><div data-inline-act-body="${esc(act.id)}" hidden>${sentence(act.template, act.fields, demo)}<small>${esc(act.help)}</small></div></div>`;
}

export function renderInlineDemo(panel, guide, variant, onClose) {
  const demo = inlineDemos[guide.id];
  if (!demo || demo.code !== guide.code || demo.type !== 'taxi') throw Error('Dimostrazione non coerente');
  const original = guide.id === 'turno' ? variant.baseTemplate.replace('effettuava o ometteva', '{{conduct_mode}}') : variant.baseTemplate;
  if (demo.segments.join(' ') !== original) throw Error('Testo base della dimostrazione non coerente');
  const working = guide.id === 'turno' ? {...variant, baseTemplate:original, fields:[...variant.fields,{id:'conduct_mode',label:'Condotta osservata'}]} : variant;
  const baseFields = working.fields;
  const base = demo.segments.map(segment => sentence(segment, baseFields, demo)).join('');
  panel.hidden = false;
  panel.innerHTML = `<div class="guideHeader"><div><span class="badge">Anteprima locale · ${esc(demo.code)}</span><h3>Corpo del verbale · ${esc(guide.code)}</h3><p>${esc(guide.title)}. Le diciture sono esempi da verificare e completare.</p></div><button id="inlineClose" class="small">Torna alla scheda</button></div>
    <p class="inlineNorm"><b>Riferimento:</b> ${esc(working.normativeRef)}</p>
    <p class="guideCaution">${esc(guide.applicability.notEnough)} ${esc(guide.applicability.verifyFirst)}</p>
    <section class="inlineBody" aria-label="Corpo del verbale e diciture suggerite">${base}<div id="inlineTitleBlock"></div><div id="inlineActs">${working.acts.map(act => actBlock(act,demo)).join('')}</div><p class="inlineEnding">${esc(working.finalSentence || '')}</p></section>
    <section class="guideSection inlineOutput"><h4>Anteprima e copia</h4><label for="inlineOutput">Testo da comporre</label><select id="inlineOutput"><option value="">Seleziona dopo aver verificato i fatti</option>${working.allowVerbale ? '<option value="verbale">Verbale</option>' : ''}<option value="relation">Relazione sui fatti accertati</option></select>${working.requiresQualificationConfirmationForVerbale ? '<label class="guideCheck"><input id="inlineQualification" type="checkbox"> Ho verificato la base e i presupposti della contestazione.</label>' : ''}<p id="inlineStatus" role="status" aria-live="polite"></p><pre id="inlinePreview" tabindex="0"></pre><div class="toolbar"><button id="inlineCopy" disabled>Copia riferimento e testo composto</button><button id="inlineReset" class="small">Azzera compilazione</button></div><small>Nessun dato è salvato o inviato. La copia avviene solo su richiesta.</small></section>`;

  const q = selector => panel.querySelector(selector);
  function titleBlock() {
    if (!working.licenseDecision) return;
    const decision = working.licenseDecision;
    const currentState = q('#inlineEvidence')?.value || '';
    const currentChoice = q('#inlineLicense')?.value || '';
    q('#inlineTitleBlock').innerHTML = `<div class="inlineSentence"><p class="inlineSentenceText">${currentState === 'verified' && currentChoice ? displayTemplate(decision.choices.find(choice => choice.id === currentChoice).verbaleTemplate, decision.choices.find(choice => choice.id === currentChoice).fields) : 'Stato del titolo: da riscontrare e descrivere.'}</p><div class="inlineSentencePoints"><label for="inlineEvidence">Riscontro sul titolo</label><select id="inlineEvidence"><option value="">Nessuna scelta</option>${decision.evidenceStates.map(state => `<option value="${esc(state.id)}">${esc(state.label)}</option>`).join('')}</select><div id="inlineLicenseBox" ${currentState === 'verified' ? '' : 'hidden'}><label for="inlineLicense">Condizione accertata</label><select id="inlineLicense"><option value="">Nessuna scelta</option>${decision.choices.map(choice => `<option value="${esc(choice.id)}">${esc(choice.label)}</option>`).join('')}</select></div><div id="inlineLicenseFields"></div></div></div>`;
    q('#inlineEvidence').value = currentState;
    q('#inlineLicense').value = currentChoice;
    q('#inlineEvidence').onchange = event => {
      const value = event.target.value;
      q('#inlineLicenseBox').hidden = value !== 'verified';
      q('#inlineLicense').value = '';
      q('#inlineLicenseFields').replaceChildren();
      q('#inlineTitleBlock .inlineSentenceText').textContent = 'Stato del titolo: da riscontrare e descrivere.';
      if (value !== 'verified' && q('#inlineOutput').value === 'verbale') q('#inlineOutput').value = '';
      update();
    };
    q('#inlineLicense').onchange = event => {
      const choice = decision.choices.find(item => item.id === event.target.value);
      q('#inlineTitleBlock .inlineSentenceText').innerHTML = choice ? displayTemplate(choice.verbaleTemplate, choice.fields) : 'Stato del titolo: da riscontrare e descrivere.';
      q('#inlineLicenseFields').innerHTML = choice ? sentence(choice.verbaleTemplate, choice.fields, demo, false) + choice.fields.filter(field => field.input === 'select').map(field => fieldControl(field,demo)).join('') : '';
      if(q('#inlineQualification')) q('#inlineQualification').checked = false;
      update();
    };
  }
  titleBlock();

  function result() {
    const values = {}, missingChoices = [];
    for (const entry of panel.querySelectorAll('[data-inline-value]')) {
      const act = entry.closest('[data-inline-act-body]');
      if (act && act.hidden) continue;
      const key = entry.dataset.inlineValue;
      const choice = entry.closest('[data-inline-point]').querySelector('[data-inline-choice]:checked');
      const value = entry.value.trim();
      if (!choice || !value || /_{2,}/.test(value)) {missingChoices.push(key);continue;}
      if (demo.provenanceFields.includes(key) && !entry.closest('[data-inline-point]').querySelector('[data-inline-provenance]').value) {missingChoices.push(key+'_fonte');continue;}
      values[key] = value;
    }
    for (const entry of panel.querySelectorAll('[data-inline-select]')) {
      if (entry.value) values[entry.dataset.inlineSelect] = entry.value;
      else missingChoices.push(entry.dataset.inlineSelect);
    }
    const selectedActs = [...panel.querySelectorAll('[data-inline-act]:checked')].map(entry => entry.dataset.inlineAct);
    const output = q('#inlineOutput').value;
    const evidenceState = q('#inlineEvidence')?.value || '';
    const licenseChoice = q('#inlineLicense')?.value || '';
    if (!output) missingChoices.push('destinazione_del_testo');
    if (output === 'verbale' && working.licenseDecision && evidenceState !== 'verified') missingChoices.push('riscontro_conclusivo_titolo');
    if (output === 'verbale' && [...panel.querySelectorAll('[data-inline-provenance]')].some(entry => entry.value === 'reported_relation')) missingChoices.push('fatti_riferiti_solo_relazione');
    if (output === 'verbale' && selectedActs.includes('permesso') && !selectedActs.includes('documento')) missingChoices.push('permesso_senza_ritiro');
    if (output === 'verbale' && selectedActs.includes('custodia') && !(selectedActs.includes('documento') || selectedActs.includes('sequestro'))) missingChoices.push('custodia_senza_misura');
    const composed = compose(working,{values, selectedActs, output:output || 'relation', qualificationConfirmed:Boolean(q('#inlineQualification')?.checked), evidenceState, licenseChoice});
    return {...composed, missingChoices, copyAllowed: Boolean(output) && composed.copyAllowed && !missingChoices.length};
  }

  function update() {
    if (q('#inlineOutput')) {
      const verbale = q('#inlineOutput option[value="verbale"]');
      if (verbale && working.licenseDecision) verbale.disabled = q('#inlineEvidence')?.value !== 'verified';
    }
    const response = result();
    q('#inlinePreview').textContent = response.text;
    q('#inlineCopy').disabled = !response.copyAllowed;
    const count = new Set([...response.missing,...response.missingChoices]).size;
    q('#inlineStatus').textContent = count ? `${count} punti da scegliere o completare. Le parti tra parentesi sono segnaposto e non si possono copiare.` : response.requiresQualification ? 'Conferma i presupposti prima di copiare il verbale.' : 'Testo composto pronto: rileggilo prima di copiarlo.';
    q('.inlineEnding').hidden = q('#inlineOutput').value !== 'verbale' || !working.finalSentence;
  }

  panel.onchange = event => {
    const choice = event.target.closest('[data-inline-choice]');
    if (choice) {
      const point = choice.closest('[data-inline-point]');
      const entry = point.querySelector('[data-inline-value]');
      const selected = demo.suggestions[choice.dataset.inlineChoice]?.[Number(choice.value)];
      entry.value = choice.value === 'other' ? '' : (typeof selected === 'string' ? selected : selected.text);
      const provenance = point.querySelector('[data-inline-provenance]');
      if (provenance) provenance.value = choice.value === 'other' ? '' : (selected.provenance || '');
    }
    const act = event.target.closest('[data-inline-act]');
    if (act) q(`[data-inline-act-body="${act.dataset.inlineAct}"]`).hidden = !act.checked;
    update();
  };
  panel.oninput = event => {
    const entry = event.target.closest('[data-inline-value]');
    if (entry && !entry.closest('[data-inline-point]').querySelector('[data-inline-choice]:checked')) entry.closest('[data-inline-point]').querySelector('[data-inline-choice][value="other"]').checked = true;
    update();
  };
  q('#inlineClose').onclick = onClose;
  q('#inlineReset').onclick = () => renderInlineDemo(panel, guide, variant, onClose);
  q('#inlineCopy').onclick = async () => {
    const response = result();
    if (!response.copyAllowed) return;
    try { await navigator.clipboard.writeText(response.text); q('#inlineStatus').textContent = 'Riferimento e testo composto copiati.'; }
    catch { const range = document.createRange(), selection = window.getSelection(); range.selectNodeContents(q('#inlinePreview'));selection.removeAllRanges();selection.addRange(range);q('#inlinePreview').focus();q('#inlineStatus').textContent = 'Appunti non disponibili: testo selezionato, usa Copia sul dispositivo.'; }
  };
  update();
  panel.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
}
