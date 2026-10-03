// Reference implementation: pure composition, no storage or network APIs.
export function fillTemplate(template, fields, values){
 const missing=[];
 const text=template.replace(/\{\{([a-z0-9_]+)\}\}/g,(_,key)=>{
  const value=String(values[key]??'').trim();
  if(!value){missing.push(key);return `[${fields.find(f=>f.id===key)?.label||key}]`;}
  const date=dateParts(value);
  return date?`${String(date.day).padStart(2,'0')}/${String(date.month).padStart(2,'0')}/${date.year}`:value;
 });
 return {text,missing};
}
function dateParts(value){
 const match=/^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value||''));
 if(!match)return null;
 const [,year,month,day]=match.map(Number),date=new Date(Date.UTC(year,month-1,day));
 return date.getUTCFullYear()===year&&date.getUTCMonth()+1===month&&date.getUTCDate()===day?{year,month,day,date}:null;
}
function sameNorm(value,expected){
 const compact=String(value||'').toLowerCase().replace(/[\s.,;:()]/g,'');
 const target=expected.includes('86')?'86c2':'85c4';
 return [`cdsart${target}`,`art${target}cds`,`cdsart${target.replace('c','comma')}`,`art${target.replace('c','comma')}cds`].includes(compact);
}
export function assessPrevious(decision,values,state='',confirmed=false){
 if(!decision)return {ready:true,missing:[]};
 if(state==='insufficient'||state==='company_only')return {ready:false,missing:values.previous_pending_detail?.trim()?[]:['previous_pending_detail']};
 if(state!=='verified')return {ready:false,missing:['stato_precedente']};
 const missing=decision.fields.filter(field=>!String(values[field.id]??'').trim()).map(field=>field.id);
 if(!confirmed)missing.push('conferma_riscontro_precedente');
 if(!sameNorm(values.previous_norm,decision.expectedNorm))missing.push('norma_precedente_non_coerente');
 const current=dateParts(values.current_fact_date),previous=dateParts(values.previous_fact_date);
 if(!current||!previous)missing.push('date_fatti_non_valide');
 else{
  const anniversary=new Date(Date.UTC(previous.year+3,previous.month-1,previous.day));
  if(current.date<=previous.date||current.date>=anniversary)missing.push('triennio_da_verificare');
 }
 if(['previous_subject','previous_outcome','previous_source','previous_person_source','previous_office_assessment'].some(key=>/\b(?:non verificat[oaie]|non accertat[oaie]|non visionat[oaie]|non acquisit[oaie]|da verificare|da acquisire|da confermare|pendente|ignot[oaie]|non disponibile|solo numero|sola targa|nessun riscontro)\b/i.test(String(values[key]||''))))missing.push('riscontro_precedente_insufficiente');
 if(decision.requiresPersonalLicenseCheck){
  const person=String(values.previous_license_person||'').trim();
  const comparison=String(values.previous_subject||'').trim();
  const role=String(values.previous_person_role||'').trim();
  if(/^(?:l[’']?)?(?:impresa|societ[aà]|obbligat[oa] in solido)\b/i.test(person)||/\b(?:solo|sola|soltanto|unicamente)\s+(?:l[’']?)?(?:impresa|societ[aà]|titolare|obbligat[oa] in solido)\b/i.test(comparison)||/^(?:l[’']?)?(?:impresa|societ[aà]|obbligat[oa] in solido)\b/i.test(role))missing.push('identita_personale_non_verificata');
  if(/\b(?:non pertinente|non rilevante|non conclusiv[oa]|da valutare|dubbio)\b/i.test(String(values.previous_office_assessment||'')))missing.push('rilevanza_precedente_non_confermata');
 }
 return {ready:missing.length===0,missing};
}
export function compose(variant,{values={},selectedActs=[],sources=[],output=variant.outputDefault,qualificationConfirmed=false,includeContext=false,evidenceState='',licenseChoice='',checkSelections={},previousState='',previousConfirmed=false}={}){
 if(output==='verbale'&&!variant.allowVerbale)throw Error('Scheda di solo riferimento: usare la relazione.');
 if(!['verbale','relation'].includes(output))throw Error('Destinazione non valida.');
 const contextParts=[],conductParts=[],sourceParts=[],irregularParts=[],previousParts=[],actParts=[],missing=[];
 const previous=variant.previousDecision,prior=assessPrevious(previous,values,previousState,previousConfirmed);
 const textOutput=previous&&!prior.ready?'relation':output;
 if(includeContext&&variant.optionalContext){const context=fillTemplate(variant.optionalContext.template,variant.optionalContext.fields,values);contextParts.push(context.text);missing.push(...context.missing);}
 const base=fillTemplate(variant.licenseDecision&&textOutput==='relation'?variant.licenseDecision.relationFactsTemplate:variant.baseTemplate,variant.fields,values);
 conductParts.push(base.text);missing.push(...base.missing);
 const decision=variant.licenseDecision;
 const titleEvidence=String(values.service_vehicle_title_evidence||'').trim();
 const onlyDriverCheck=/\b(?:non|mai)\s+(?:era\s+)?intestat[ao]\s+al\s+conducente\b/i.test(titleEvidence)&&!/(?:nessun[ao]?\s+(?:titolo|licenza|autorizzazione)|assenza\s+(?:del|di\s+un)\s+titolo)/i.test(titleEvidence);
 if(decision){
  if(!decision.evidenceStates.some(state=>state.id===evidenceState))missing.push('stato_riscontro_titolo');
  if(output==='verbale'&&evidenceState!=='verified')missing.push('riscontro_conclusivo_titolo');
  if(evidenceState==='verified'){
   const choice=decision.choices.find(entry=>entry.id===licenseChoice);
   if(!choice){missing.push('stato_licenza');}
   else if(choice.id==='non_conseguita'&&(values.service_vehicle_title_outcome!=='absent'||onlyDriverCheck))missing.push('assenza_titolo_servizio_veicolo_non_confermata');
   else{const selected=fillTemplate(textOutput==='verbale'?choice.verbaleTemplate:choice.relationTemplate,choice.fields,values);irregularParts.push(selected.text);missing.push(...selected.missing);}
  }else if(decision.unverifiedNotes[evidenceState])irregularParts.push(decision.unverifiedNotes[evidenceState]);
  if(evidenceState!=='verified'&&selectedActs.length)missing.push('atti_da_valutare_dopo_riscontro');
 }
 const dual=variant.dualCheckDecision;
 let dualIrregular=0;
 if(dual){
  for(const check of dual.checks){
   const choice=check.choices.find(entry=>entry.id===checkSelections[check.id]);
   if(!choice){missing.push('scelta_'+check.id);continue;}
   const titleUnconfirmed=choice.id==='non_conseguita'&&(values.service_vehicle_title_outcome!=='absent'||onlyDriverCheck);
   if(choice.irregular&&!titleUnconfirmed)dualIrregular++;
   if(titleUnconfirmed){missing.push('assenza_titolo_servizio_veicolo_non_confermata');continue;}
   const template=textOutput==='verbale'?choice.verbaleTemplate:choice.relationTemplate;
   if(template){const filled=fillTemplate(template,choice.fields,values);irregularParts.push(filled.text);missing.push(...filled.missing);}
  }
  if(output==='verbale'&&!dualIrregular)missing.push('nessuna_irregolarita_verificata');
  if(selectedActs.length&&!dualIrregular)missing.push('atti_senza_irregolarita_verificata');
 }
 if(previous){
  missing.push(...prior.missing);
  if(prior.ready){const proof=fillTemplate(previous.verifiedTemplate,previous.fields,values);previousParts.push(proof.text);missing.push(...proof.missing);}
  else if(previousState==='insufficient'||previousState==='company_only'){
   const note=fillTemplate(previous.insufficientTemplate,[{id:'previous_pending_detail',label:'Dettaglio del precedente da verificare'}],values);
   previousParts.push(note.text);missing.push(...note.missing);
  }
  if(output==='verbale'&&!prior.ready)missing.push('precedente_non_verificato');
  if(selectedActs.length&&!prior.ready)missing.push('atti_da_valutare_dopo_precedente');
 }
 for(const key of selectedActs){
  const act=variant.acts.find(a=>a.id===key);if(!act)throw Error('Atto non previsto per questa variante.');
  const filled=fillTemplate(act.template,act.fields,values);actParts.push(filled.text);missing.push(...filled.missing);
 }
 if(selectedActs.includes('ritiro_documento')&&!selectedActs.includes('sequestro'))missing.push('trattenimento_senza_sequestro');
 for(const source of sources){
  const body=String(source.text??'').trim();if(!body){missing.push('source_'+source.id);continue;}
  if(source.id==='reported_relation'&&textOutput!=='relation'){
   missing.push('fatti_riferiti_solo_relazione');
   continue;
  }
  // Source text states only the provenance selected by the operator. Copy acquisition is a separate selected act.
  (source.id==='office'?irregularParts:sourceParts).push(body);
  if(source.actText)actParts.push(String(source.actText).trim());
 }
 if(textOutput==='verbale'&&variant.finalSentence)actParts.push(variant.finalSentence);
 const parts=[...contextParts,...conductParts,...sourceParts,...irregularParts,...previousParts,...actParts];
 const requiresQualification=output==='verbale'&&variant.requiresQualificationConfirmationForVerbale&&!qualificationConfirmed;
 const reference=dual&&textOutput==='relation'&&!dualIrregular?`Riferimento di consultazione (nessuna irregolarità accertata): ${variant.normativeRef}`:variant.normativeRef;
 return {text:reference+'\n\n'+parts.join(' '),body:parts.join(' '),missing,requiresQualification,copyAllowed:missing.length===0&&!requiresQualification};
}
