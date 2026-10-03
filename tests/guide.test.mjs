import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {assessPrevious,compose} from '../scripts/composer-core.mjs';

const root = resolve(import.meta.dirname, '..');
const html = await readFile(resolve(root, 'index.html'), 'utf8');
const data = JSON.parse(html.split('\n').find(line => line.startsWith('const DATA=')).slice(11, -1));
const guidePack = JSON.parse(await readFile(resolve(root, 'data/guide-operative.json'), 'utf8'));
const sample = (field, prefix) => field.id === 'service_vehicle_title_outcome' ? 'absent' : `${prefix}_${field.id}`;
const legalFields = data.catalog.map(({id,code,ref,verbaleRef,sanction,payments,responsibility,kind,scope,referenceOnly}) =>
  ({id,code,ref,verbaleRef,sanction,payments,responsibility,kind,scope,referenceOnly}));
assert.equal(createHash('sha256').update(JSON.stringify(legalFields)).digest('hex'),
  'e3d723fda5ed10a174bba99fc4c1029cc5fc2c05209c1a7606a54e4224026612',
  'Norme, importi, responsabilità e classificazioni devono coincidere con il commit 6f6a381');
assert.equal(guidePack.guides.length, 118);
assert.equal(new Set(guidePack.guides.map(guide => guide.id)).size, 118);
assert.deepEqual(new Set(guidePack.guides.map(guide => guide.id)), new Set(data.catalog.map(item => item.id)));
const byId = new Map(data.catalog.map(item => [item.id, item]));
const regulation = 'Regolamento comunale (delibera C.C. n. 80/2005), ';
function normative(item, type) {
  let ref = item.verbaleRef || item.ref;
  if (item.kind === 'local' && item.scope === 'all' && !item.noTitle) {
    ref = ref.replace('Taxi: CdS art.86 c.3-bis; NCC: CdS art.85 c.4-ter (se condizione del titolo verificata)',
      type === 'ncc' ? 'CdS art.85 c.4-ter (se condizione dell’autorizzazione verificata)' : 'CdS art.86 c.3-bis (se condizione della licenza verificata)');
  }
  return ref.replace(/\bReg\.\s*(?:(artt?\.)\s*)?(?=\d)/g, (_, art) => regulation + (art || 'art.') + ' ');
}
const expectedVariants = new Set(data.catalog.flatMap(item => item.scope === 'all' ? [`${item.id}/taxi`,`${item.id}/ncc`] : [`${item.id}/${item.scope}`]));
const actualVariants = new Set();
let acts = 0;
for (const guide of guidePack.guides) {
  const item = byId.get(guide.id);
  assert.equal(guide.code, item.code);
  assert.equal(guide.title, item.title);
  if (item.responsibility) assert.equal(guide.responsibility, item.responsibility, `Responsabilità ${item.code}`);
  assert.equal(guide.scenario.automaticallyInserted, false);
  for (const value of [guide.scenario.text, guide.applicability.when, guide.applicability.notEnough, guide.applicability.verifyFirst, guide.officeHelp.category, guide.officeHelp.request]) assert.ok(value);
  assert.equal(guide.applicability.referenceOnly, !!item.referenceOnly);
  for (const [type, variant] of Object.entries(guide.variants)) {
    actualVariants.add(`${guide.id}/${type}`);
    assert.equal(variant.normativeRef, normative(item, type), `Riferimento ${item.code}/${type}`);
    assert.equal(variant.outputDefault, variant.licenseDecision || variant.dualCheckDecision || item.referenceOnly || ['local','review','ordinance'].includes(item.kind) ? 'relation' : 'verbale');
    assert.equal(variant.allowVerbale, !item.referenceOnly);
    assert.equal(new Set(variant.fields.map(field => field.id)).size, variant.fields.length);
    const values = Object.fromEntries(variant.fields.map(field => [field.id, `VERIFICATO_${field.id}`]));
    const decision=variant.licenseDecision;
    const selected=decision?.choices[0];
    if(selected)Object.assign(values,Object.fromEntries(selected.fields.map(field=>[field.id,sample(field,'RISCONTRO')])));
    const decisionOptions=selected?{evidenceState:'verified',licenseChoice:selected.id}:{};
    const dual=variant.dualCheckDecision;
    if(dual){
      decisionOptions.checkSelections={};
      for(const check of dual.checks){
        const choice=check.choices.find(entry=>entry.irregular)||check.choices[0];
        decisionOptions.checkSelections[check.id]=choice.id;
        Object.assign(values,Object.fromEntries(choice.fields.map(field=>[field.id,sample(field,'RISCONTRO')])));
      }
    }
    if(variant.previousDecision){
      decisionOptions.previousState='verified';
      decisionOptions.previousConfirmed=true;
      Object.assign(values,Object.fromEntries(variant.previousDecision.fields.map(field=>[field.id,`VERIFICATO_${field.id}`])));
      values.current_fact_date='2026-10-02';
      values.previous_fact_date='2025-09-15';
      values.previous_norm=variant.previousDecision.expectedNorm;
    }
    const base = compose(variant, {values,...decisionOptions});
    assert.equal(base.copyAllowed, true);
    assert.ok(!base.text.includes('{{'));
    assert.ok(!base.body.includes(guide.scenario.text), 'Lo scenario non entra automaticamente nel testo');
    const incomplete = {...values};
    delete incomplete[variant.fields[0].id];
    assert.equal(compose(variant, {values:incomplete,...decisionOptions}).copyAllowed, false);
    for (const act of variant.acts) {
      acts++;
      assert.equal(act.selectedByDefault, false);
      const filled = {...values, ...Object.fromEntries(act.fields.map(field => [field.id, `ESEGUITO_${field.id}`])),...(act.id==='ritiro_documento'?{act_sequestro_01:'ESEGUITO_sequestro'}:{})};
      const selectedActs=act.id==='ritiro_documento'?['sequestro',act.id]:[act.id];
      const composed = compose(variant, {values:filled, selectedActs,...decisionOptions});
      assert.equal(composed.copyAllowed, true);
      assert.ok(composed.body.includes('ESEGUITO_') || act.fields.length === 0);
      if (act.fields.length) {
        delete filled[act.fields[0].id];
        assert.equal(compose(variant, {values:filled, selectedActs,...decisionOptions}).copyAllowed, false);
      }
    }
    if (variant.requiresQualificationConfirmationForVerbale) {
      assert.equal(compose(variant, {values, ...decisionOptions, output:'verbale'}).copyAllowed, false);
      assert.equal(compose(variant, {values, ...decisionOptions, output:'verbale', qualificationConfirmed:true}).copyAllowed, true);
    }
    if (item.referenceOnly) assert.throws(() => compose(variant, {values, output:'verbale'}));
    const finalSentence="Copia del presente verbale verrà inviata all'Ufficio Corso Pubblico.";
    const excluded=new Set(['abusivo','abusivo2','abusivoncc','nccbusprima','nccbusreiterata','nccreiterata','nccbusaltro']);
    assert.ok(!compose(variant, {values, ...decisionOptions, output:'relation'}).body.includes(finalSentence));
    assert.equal(base.body.includes(finalSentence),base.copyAllowed&&variant.outputDefault==='verbale'&&!excluded.has(item.id),`Frase finale nel testo predefinito ${item.code}`);
    assert.equal(variant.finalSentence,variant.allowVerbale&&!excluded.has(item.id)?finalSentence:'',`Frase finale guida ${item.code}`);
    if(variant.allowVerbale){
      const verbale=compose(variant,{values,...decisionOptions,output:'verbale',qualificationConfirmed:true});
      assert.equal(verbale.body.split(finalSentence).length-1,excluded.has(item.id)?0:1,`Frase finale verbale ${item.code}`);
      assert.equal(verbale.body.endsWith(finalSentence),!excluded.has(item.id),`Posizione frase finale ${item.code}`);
    }
    assert.equal(compose(variant, {values, ...decisionOptions, sources:[{id:'statement',text:''}]}).copyAllowed, false);
  }
}
assert.deepEqual(actualVariants, expectedVariants);
assert.equal(acts, 64);
const g01=guidePack.guides.find(guide=>guide.code==='G01').variants.taxi;
assert.equal(g01.outputDefault,'relation');
assert.ok(g01.acts.some(act=>act.id==='patente'),'G01: procedimento del primo caso distinto');
assert.ok(!g01.acts.some(act=>act.id==='revoca'));
assert.equal(g01.licenseDecision.choices.length,3);
assert.deepEqual(g01.licenseDecision.choices.map(choice=>choice.id),['non_conseguita','sospesa','revocata']);
const facts=Object.fromEntries(g01.fields.map(field=>[field.id,'FATTO_VERIFICATO']));
assert.equal(compose(g01,{values:facts}).copyAllowed,false,'Nessuna scelta preselezionata');
for(const state of ['not_shown','pending']){
  const relation=compose(g01,{values:facts,evidenceState:state,output:'relation'});
  assert.equal(relation.copyAllowed,true);
  assert.ok(relation.body.includes('FATTO_VERIFICATO'));
  assert.ok(!relation.body.includes('Adibiva a servizio taxi'));
  assert.equal(compose(g01,{values:facts,evidenceState:state,output:'verbale',qualificationConfirmed:true}).copyAllowed,false);
  assert.equal(compose(g01,{values:facts,evidenceState:state,selectedActs:['sequestro']}).copyAllowed,false);
}
for(const choice of g01.licenseDecision.choices){
  const completed={...facts,...Object.fromEntries(choice.fields.map(field=>[field.id,sample(field,'PROVA')]))};
  const options={values:completed,evidenceState:'verified',licenseChoice:choice.id,output:'verbale',qualificationConfirmed:true};
  const composed=compose(g01,options);
  assert.equal(composed.copyAllowed,true,choice.id);
  assert.ok(!composed.body.includes('oppure'));
  assert.ok(!composed.body.includes('ovvero'));
  assert.ok(!composed.body.includes('{{'));
  assert.equal(compose(g01,{...options,values:{...completed,[choice.fields[0].id]:''}}).copyAllowed,false);
  if(choice.id==='non_conseguita'){
    assert.ok(!composed.body.includes('C.P. n.'));
    assert.ok(!choice.fields.some(field=>field.id==='license_cp'));
    assert.ok(composed.body.includes('PROVA_license_office'));
    assert.ok(composed.body.includes('PROVA_license_date'));
    assert.ok(composed.body.includes('PROVA_license_response'));
  }else{
    assert.ok(composed.body.includes('C.P. n. PROVA_license_cp'));
    assert.ok(composed.body.includes('PROVA_license_order'));
    assert.ok(composed.body.includes('PROVA_license_effectiveness'));
    assert.ok(!composed.body.includes('PROVA_license_office'));
  }
  assert.ok(!composed.body.includes('Il veicolo è sottoposto a sequestro'));
  const withAct=compose(g01,{...options,values:{...completed,act_sequestro_01:'ATTO_123'},selectedActs:['sequestro']});
  assert.ok(withAct.body.includes('ATTO_123'));
}
for(const code of ['G02','N01','N02','N03']){
  const variant=guidePack.guides.find(guide=>guide.code===code).variants[code.startsWith('G')?'taxi':'ncc'];
  const common=Object.fromEntries(variant.fields.map(field=>[field.id,`FATTO_${field.id}`]));
  const prior=variant.previousDecision;
  const priorOptions=prior?{previousState:'verified',previousConfirmed:true}:{};
  if(prior){
    Object.assign(common,Object.fromEntries(prior.fields.map(field=>[field.id,`FATTO_${field.id}`])));
    common.current_fact_date='2026-10-02';
    common.previous_fact_date='2025-09-15';
    common.previous_norm=prior.expectedNorm;
  }
  assert.equal(compose(variant,{values:common,evidenceState:'verified',...priorOptions}).copyAllowed,false,`${code}: nessun ramo preselezionato`);
  for(const state of ['not_shown','pending']){
    const relation=compose(variant,{values:common,evidenceState:state,...priorOptions});
    assert.equal(relation.copyAllowed,true,`${code}: relazione ${state}`);
    assert.equal(compose(variant,{values:common,evidenceState:state,output:'verbale',qualificationConfirmed:true,...priorOptions}).copyAllowed,false);
    assert.equal(compose(variant,{values:common,evidenceState:state,selectedActs:[variant.acts[0].id],...priorOptions}).copyAllowed,false);
  }
  for(const choice of variant.licenseDecision.choices){
    const values={...common,...Object.fromEntries(choice.fields.map(field=>[field.id,sample(field,'PROVA')]))};
    const options={values,evidenceState:'verified',licenseChoice:choice.id,output:'verbale',qualificationConfirmed:true,...priorOptions};
    const result=compose(variant,options);
    assert.equal(result.copyAllowed,true,`${code}/${choice.id}`);
    assert.doesNotMatch(result.body,/\b(?:oppure|ovvero)\b/i,`${code}/${choice.id}: alternativa cumulativa`);
    assert.ok(result.body.includes(`PROVA_${choice.fields[0].id}`));
    assert.equal(compose(variant,{...options,values:{...values,[choice.fields[0].id]:''}}).copyAllowed,false);
    if(choice.id==='non_conseguita')assert.ok(!choice.fields.some(field=>/number|cp/.test(field.id)),`${code}: numero inesistente`);
    assert.equal(variant.acts.every(act=>act.selectedByDefault===false),true);
    assert.ok(!result.body.includes('ESEGUITO_'));
    if(['G02','N02','N03'].includes(code)){
      assert.ok(result.body.includes('FATTO_previous_subject'));
      assert.ok(result.body.includes('FATTO_previous_source'));
      assert.equal(compose(variant,{...options,values:{...values,previous_source:''}}).copyAllowed,false);
      assert.doesNotMatch(compose(variant,{...options,values:{...values,previous_source:''}}).body,/Il fatto attuale .* ricade nel triennio/);
      assert.equal(compose(variant,{...options,previousConfirmed:false}).copyAllowed,false);
      assert.doesNotMatch(compose(variant,{...options,previousConfirmed:false}).body,/Il fatto attuale .* ricade nel triennio/);
      assert.equal(compose(variant,{...options,values:{...values,previous_norm:'CdS art.82 c.8'}}).copyAllowed,false);
      assert.equal(compose(variant,{...options,values:{...values,previous_source:'solo numero del verbale'}}).copyAllowed,false);
      assert.equal(compose(variant,{...options,values:{...values,previous_fact_date:'2023-10-02'}}).copyAllowed,false,'Il giorno di confine richiede verifica umana');
      const insufficient=compose(variant,{...options,previousState:'insufficient',values:{...values,previous_pending_detail:'Esito del fascicolo non disponibile'}});
      assert.equal(insufficient.copyAllowed,false);
      assert.doesNotMatch(insufficient.body,/Il fatto attuale .* ricade nel triennio/);
      const relation=compose(variant,{...options,previousState:'insufficient',output:'relation',values:{...values,previous_pending_detail:'Esito del fascicolo non disponibile'}});
      assert.equal(relation.copyAllowed,true);
      assert.match(relation.body,/Esito del fascicolo non disponibile/);
      assert.doesNotMatch(relation.body,/ricade nel triennio|reiterazione/i);
      if(['N02','N03'].includes(code)){
        assert.equal(prior.requiresPersonalLicenseCheck,true);
        for(const key of ['previous_license_person','previous_person_role','previous_person_source','previous_office_assessment']){
          const incompletePerson=compose(variant,{...options,values:{...values,[key]:''}});
          assert.equal(incompletePerson.copyAllowed,false,`${code}: manca ${key}`);
          assert.doesNotMatch(incompletePerson.body,/ricade nel triennio/i);
        }
        const companyOnly=compose(variant,{...options,output:'relation',previousState:'company_only',values:{...values,previous_pending_detail:'Il fascicolo precedente identifica soltanto l’impresa; identità e ruolo della persona restano da verificare'}});
        assert.equal(companyOnly.copyAllowed,true);
        assert.doesNotMatch(companyOnly.body,/ricade nel triennio|reiterazione/i);
        assert.equal(compose(variant,{...options,previousState:'company_only',values:{...values,previous_pending_detail:'Riscontro riferito soltanto all’impresa'}}).copyAllowed,false);
        const falseIdentity=compose(variant,{...options,values:{...values,previous_license_person:'Impresa Campione S.r.l.',previous_subject:'solo impresa coincidente',previous_person_role:'obbligato in solido'}});
        assert.equal(falseIdentity.copyAllowed,false,`${code}: la sola impresa non prova identità personale`);
        assert.doesNotMatch(falseIdentity.body,/ricade nel triennio/i);
      }
    }
  }
  if(code==='G02'){
    assert.ok(variant.acts.some(act=>act.id==='revoca'));
    assert.ok(!variant.acts.some(act=>act.id==='patente'));
  }
  if(['G02','N02','N03'].includes(code))assert.match(variant.licenseDecision.normativeReview,/Ufficio Verbali/);
  if(['N01','N02'].includes(code))assert.match(variant.baseTemplate,/L’autobus/);
  assert.ok(variant.fields.some(field=>field.id==='driver_identity'));
  assert.ok(variant.fields.some(field=>field.id==='operator_identity'));
  assert.ok(variant.fields.some(field=>field.id==='service_observation'));
  assert.ok(variant.fields.some(field=>field.id==='service_documents'));
  assert.doesNotMatch(variant.baseTemplate,/fotograf/i);
  assert.doesNotMatch(variant.baseTemplate,/Conducente identificato:|Documenti sul servizio acquisiti:|Osservazione diretta del trasporto:/);
}
const i02=guidePack.guides.find(guide=>guide.code==='I02').variants.ncc;
const dual=i02.dualCheckDecision;
assert.match(dual.normativeReview,/Art. 85, comma 4/);
const authorization=dual.checks.find(check=>check.id==='authorization');
const destination=dual.checks.find(check=>check.id==='destination');
const commonI02=Object.fromEntries(i02.fields.map(field=>[field.id,`FATTO_${field.id}`]));
assert.equal(compose(i02,{values:commonI02}).copyAllowed,false,'I02: verifiche non preselezionate');
for(const check of dual.checks){
  for(const choice of check.choices){
    const other=check===authorization?destination:authorization;
    const otherChoice=other.choices.find(entry=>entry.id==='pending');
    const values={...commonI02,...Object.fromEntries(choice.fields.map(field=>[field.id,sample(field,'PROVA')]))};
    const checkSelections={[check.id]:choice.id,[other.id]:otherChoice.id};
    const relation=compose(i02,{values,checkSelections});
    assert.equal(relation.copyAllowed,true,`I02/${check.id}/${choice.id}`);
    assert.ok(!relation.body.includes('{{'));
    const verbale=compose(i02,{values,checkSelections,output:'verbale',qualificationConfirmed:true});
    assert.equal(verbale.copyAllowed,!!choice.irregular,`I02/${check.id}/${choice.id}: verbale`);
    if(choice.id==='pending')assert.ok(!verbale.body.includes('PROVA_'));
    if(choice.fields.length)assert.equal(compose(i02,{values:{...values,[choice.fields[0].id]:''},checkSelections}).copyAllowed,false);
  }
}
const authIrregular=authorization.choices.find(choice=>choice.id==='non_conseguita');
const useIrregular=destination.choices.find(choice=>choice.id==='non_conforme');
const bothValues={...commonI02,...Object.fromEntries([...authIrregular.fields,...useIrregular.fields].map(field=>[field.id,sample(field,'PROVA')]))};
const both=compose(i02,{values:bothValues,checkSelections:{authorization:authIrregular.id,destination:useIrregular.id},output:'verbale',qualificationConfirmed:true});
assert.equal(both.copyAllowed,true);
assert.ok(both.body.includes('PROVA_auth_office'));
assert.ok(both.body.includes('PROVA_dest_document'));
assert.equal(both.text.split(i02.normativeRef).length-1,1,'I02: un solo riferimento, senza duplicare la sanzione');
assert.equal(compose(i02,{values:commonI02,checkSelections:{authorization:'pending',destination:'pending'},selectedActs:[i02.acts[0].id]}).copyAllowed,false);
const authEffective=authorization.choices.find(choice=>choice.id==='efficace');
const useConform=destination.choices.find(choice=>choice.id==='conforme');
for(const useChoice of [useIrregular,useConform]){
  const values={...commonI02,...Object.fromEntries([...authEffective.fields,...useChoice.fields].map(field=>[field.id,`PROVA_${field.id}`]))};
  const output=useChoice.irregular?'verbale':'relation';
  const result=compose(i02,{values,checkSelections:{authorization:'efficace',destination:useChoice.id},output,qualificationConfirmed:true});
  assert.equal(result.copyAllowed,true);
  assert.match(result.body,/intestata a PROVA_auth_holder/);
  assert.match(result.body,/destinazione «PROVA_dest_destination_annotation» e l’uso «PROVA_dest_use_annotation»/);
  assert.doesNotMatch(result.body,/non risultava conseguita/);
  if(!useChoice.irregular)assert.match(result.text,/Riferimento di consultazione \(nessuna irregolarità accertata\)/);
}
const g01Choice=g01.licenseDecision.choices[0];
const proseValues={...Object.fromEntries(g01.fields.map(field=>[field.id,`FATTO_${field.id}`])),...Object.fromEntries(g01Choice.fields.map(field=>[field.id,sample(field,'PROVA')])),act_sequestro_01:'ATTO_123'};
const proseOptions={values:proseValues,evidenceState:'verified',licenseChoice:g01Choice.id,output:'verbale',qualificationConfirmed:true};
const ordered=compose(g01,{...proseOptions,selectedActs:['sequestro'],sources:[
  {id:'direct',text:'Gli operanti osservavano il prelievo.'},
  {id:'document',text:'Dal documento P-7 risultava la prenotazione.',actText:'È stata acquisita copia del documento P-7.'},
  {id:'statement',text:'La dichiarazione di Tizio è verbalizzata nell’atto D-1.'},
  {id:'office',text:'L’ufficio ha confermato un dato ulteriore.'},
]});
const order=['FATTO_service_observation','Gli operanti osservavano il prelievo','Dal documento P-7','La dichiarazione di Tizio','PROVA_license_office','L’ufficio ha confermato','ATTO_123','È stata acquisita copia'];
assert.deepEqual(order.map(fragment=>ordered.body.indexOf(fragment)), [...order.map(fragment=>ordered.body.indexOf(fragment))].sort((a,b)=>a-b));
assert.ok(order.every(fragment=>ordered.body.includes(fragment)));
const g02=guidePack.guides.find(guide=>guide.code==='G02').variants.taxi;
const g02Choice=g02.licenseDecision.choices[0];
const g02Values={...Object.fromEntries(g02.fields.map(field=>[field.id,`FATTO_${field.id}`])),...Object.fromEntries(g02Choice.fields.map(field=>[field.id,sample(field,'PROVA')])),...Object.fromEntries(g02.previousDecision.fields.map(field=>[field.id,`PRECEDENTE_${field.id}`])),current_fact_date:'2026-10-02',previous_fact_date:'2025-09-15',previous_norm:g02.previousDecision.expectedNorm,act_sequestro_01:'ATTO_G02'};
const withPrevious=compose(g02,{values:g02Values,evidenceState:'verified',licenseChoice:g02Choice.id,previousState:'verified',previousConfirmed:true,output:'verbale',qualificationConfirmed:true,selectedActs:['sequestro']});
assert.equal(withPrevious.copyAllowed,true);
assert.ok(withPrevious.body.indexOf('PROVA_license_response')<withPrevious.body.indexOf('PRECEDENTE_previous_number'));
assert.ok(withPrevious.body.indexOf('PRECEDENTE_previous_number')<withPrevious.body.indexOf('ATTO_G02'));
assert.match(withPrevious.body,/02\/10\/2026/);
const examined=compose(g01,{...proseOptions,sources:[{id:'document',text:'Dal documento P-7 risultava la prenotazione.'}]});
assert.doesNotMatch(examined.body,/acquisita copia/);
assert.doesNotMatch(examined.body,/sequestro|Corso Pubblico/i);
const onlyReported=compose(g01,{...proseOptions,sources:[{id:'reported_relation',text:'Un utente riferiva un fatto.'}]});
assert.equal(onlyReported.copyAllowed,false);
assert.doesNotMatch(onlyReported.body,/Un utente riferiva/);
const reportedRelation=compose(g01,{...proseOptions,output:'relation',sources:[{id:'reported_relation',text:'Un utente riferiva un fatto.'}]});
assert.equal(reportedRelation.copyAllowed,true);
assert.match(reportedRelation.body,/Un utente riferiva/);
assert.equal(assessPrevious({expectedNorm:'CdS art.85 c.4',fields:[{id:'previous_norm'}]}, {previous_norm:'CdS art.86 c.2'},'verified',true).ready,false);
for (const [code,variant,options] of [
  ['G01',g01,{evidenceState:'verified',licenseChoice:'non_conseguita'}],
  ['G02',g02,{evidenceState:'verified',licenseChoice:'non_conseguita',previousState:'insufficient'}],
  ['N03',guidePack.guides.find(guide=>guide.code==='N03').variants.ncc,{evidenceState:'verified',licenseChoice:'non_conseguita',previousState:'insufficient'}],
  ['I02',i02,{checkSelections:{authorization:'non_conseguita',destination:'pending'}}],
]) {
  const choice=variant.licenseDecision?.choices.find(entry=>entry.id==='non_conseguita') || variant.dualCheckDecision.checks[0].choices.find(entry=>entry.id==='non_conseguita');
  const values={...Object.fromEntries(variant.fields.map(field=>[field.id,sample(field,'FATTO')])),...Object.fromEntries(choice.fields.map(field=>[field.id,sample(field,'RISCONTRO')])),previous_pending_detail:'Precedente incompleto, esito da verificare'};
  const base={values,output:'relation',...options};
  assert.equal(compose(variant,base).copyAllowed,true,`${code}: assenza per servizio e veicolo confermata`);
  for (const change of [{service_vehicle_title_outcome:'pending'},{service_vehicle_title_outcome:''},{service_vehicle_title_evidence:'non intestato al conducente'},{service_vehicle_title_evidence:''}]) {
    const blocked=compose(variant,{...base,values:{...values,...change}});
    assert.equal(blocked.copyAllowed,false,`${code}: riscontro limitato al conducente o incompleto`);
    if(change.service_vehicle_title_outcome==='pending'||change.service_vehicle_title_evidence==='non intestato al conducente')assert.doesNotMatch(blocked.body,/non risultava conseguit[ao]/i,`${code}: nessuna assenza affermata`);
  }
}
for (const guide of guidePack.guides) for (const variant of Object.values(guide.variants)) {
  const retention=variant.acts.find(act=>act.id==='ritiro_documento');
  if(!retention)continue;
  const choice=variant.licenseDecision?.choices[0] || variant.dualCheckDecision?.checks[0].choices[0];
  const values={...Object.fromEntries(variant.fields.map(field=>[field.id,sample(field,'FATTO')])),...Object.fromEntries((choice?.fields||[]).map(field=>[field.id,sample(field,'RISCONTRO')])),act_sequestro_01:'S-01',act_documento_circolazione_01:'verbale S-01'};
  const options={values,output:'relation',evidenceState:'verified',licenseChoice:choice?.id,checkSelections:{authorization:'non_conseguita',destination:'pending'},previousState:'insufficient',previous_pending_detail:'Precedente da verificare'};
  const alone=compose(variant,{...options,selectedActs:['sequestro']});
  assert.doesNotMatch(alone.body,/documento di circolazione è stato trattenuto/i,`${guide.code}: nessun trattenimento automatico`);
  const confirmed=compose(variant,{...options,selectedActs:['sequestro','ritiro_documento']});
  assert.match(confirmed.body,/documento di circolazione è stato trattenuto/i,`${guide.code}: atto confermato`);
  assert.equal(compose(variant,{...options,selectedActs:['ritiro_documento']}).copyAllowed,false,`${guide.code}: trattenimento senza sequestro`);
}
for(const code of ['G02','N02','N03']){
  const variant=guidePack.guides.find(guide=>guide.code===code).variants[code==='G02'?'taxi':'ncc'];
  const choice=variant.licenseDecision.choices[0];
  const values={...Object.fromEntries(variant.fields.map(field=>[field.id,sample(field,'FATTO')])),...Object.fromEntries(choice.fields.map(field=>[field.id,sample(field,'RISCONTRO')])),previous_pending_detail:'È noto soltanto il numero del precedente; esito e pertinenza non verificati'};
  const relation=compose(variant,{values,evidenceState:'verified',licenseChoice:choice.id,previousState:'insufficient',output:'relation'});
  assert.equal(relation.copyAllowed,true,`${code}: fatto attuale e relazione accessibili`);
  assert.match(relation.body,/FATTO_service_observation/);
  assert.doesNotMatch(relation.body,/prima violazione|ricade nel triennio|reiterazione/i);
  assert.equal(compose(variant,{values,evidenceState:'verified',licenseChoice:choice.id,previousState:'insufficient',output:'verbale',qualificationConfirmed:true}).copyAllowed,false);
}
const ui = await readFile(resolve(root, 'scripts/guide-ui.mjs'), 'utf8');
assert.match(ui,/data-guide-document="status"/);
assert.match(ui,/Solo esaminato/);
assert.match(ui,/Copia acquisita/);
assert.match(ui,/Estremi dell’atto di formalizzazione/);
assert.match(ui,/fatti_riferiti_solo_relazione|reported_relation/);
assert.doesNotMatch(ui, /localStorage|sessionStorage|indexedDB|caches\.|sendBeacon/);
assert.match(ui, /pagehide/);
assert.match(ui, /pageshow/);
assert.match(ui,/La scheda del fatto attuale resta consultabile/);
console.log('Dati operativi non esposti: 118 ID, 166 ambiti, 64 blocchi, catalogo giuridico invariato e privacy OK');
