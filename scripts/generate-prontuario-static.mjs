#!/usr/bin/env node
// Impagina il prontuario di consultazione: una pagina per ogni caso e fascia.
import {readFile,writeFile,rename} from 'node:fs/promises';
import {resolve} from 'node:path';
import vm from 'node:vm';
import {chromium} from 'playwright-core';
import {PDFDocument,PDFName} from 'pdf-lib';
import {getDocument} from 'pdfjs-dist/legacy/build/pdf.mjs';

const root=resolve(import.meta.dirname,'..');
const pdfPath=resolve(root,'allegati/Prontuario_Taxi_NCC_Napoli.pdf');
const html=await readFile(resolve(root,'index.html'),'utf8');
const dataLine=html.split('\n').find(line=>line.startsWith('const DATA='));
if(!dataLine)throw Error('Catalogo incorporato non trovato');
const data=JSON.parse(dataLine.slice('const DATA='.length,-1));
const window={};
for(const name of ['scripts/static-demos.js','scripts/static-field-suggestions.js','scripts/static-demo-ui.js','scripts/static-catalog.js','scripts/static-catalog-ui.js']){
  vm.runInNewContext(await readFile(resolve(root,name),'utf8'),{window},{filename:name});
}
const layout=window.prontuarioStaticLayout(data.catalog,data.manualParts);
const byId=new Map(data.catalog.map(item=>[item.id,item]));
const version='7.1',today='3 ottobre 2026';
const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const regulation='Regolamento comunale (delibera C.C. n. 80/2005), ';
const finalSentence="Copia del presente verbale verrà inviata all'Ufficio Corso Pubblico.";
// Solo impaginazione PDF: i testi completi restano nelle schede PWA.
const commonNotes=[
  ['A1','Segnalazione al Corso Pubblico','Segnalazione al Corso Pubblico: trasmettere gli atti all’ufficio tramite il percorso dell’Ufficio Verbali. Restano distinti gli invii a Prefettura, UMC e altre autorità previsti per il caso.'],
  ['A1','Segnalazione al Corso Pubblico','Segnalazione al Corso Pubblico: trasmettere all’ufficio, tramite l’Ufficio Verbali, soltanto i fatti e gli atti pertinenti al servizio a trazione animale.'],
  ['A2','Punti e titolo comunale','I punti indicati dal regolamento riguardano la licenza taxi; sono distinti dai punti della patente. Il ritiro comunale va verificato secondo il gruppo e l’art.29 c.4.'],
  ['A2','Punti e titolo comunale','I punti sulla licenza taxi sono distinti dai punti della patente. Per questo gruppo non è previsto il ritiro immediato del titolo comunale.'],
  ['A3','Condizioni del titolo e qualificazione','Il prontuario GIT originario richiama la disciplina residuale. Taxi: art.86 c.3-bis; NCC: art.85 c.4-ter. Individuare la prescrizione del titolo e la fonte; escludere le fattispecie più gravi. La violazione regolamentare richiede qualificazione nel caso concreto.'],
  ['A3','Condizioni del titolo e qualificazione','Il prontuario GIT originario richiama il comma 3-bis. Per applicarlo, individuare la prescrizione della licenza e la sua fonte, escludendo i commi 2 e 3. La violazione regolamentare richiede qualificazione nel caso concreto. [EGAF nota 12; CDS86]'],
  ['A4','Relazione e contestazione','Usare il testo per contestazione soltanto dopo la verifica della base normativa e dei presupposti indicati nella scheda; altrimenti redigere una relazione di accertamento. La frase di invio del verbale si usa solo quando un verbale è stato effettivamente elevato.'],
  ['A4','Relazione e contestazione','Questa è una scheda di riferimento: il testo descrive i fatti per la relazione, non costituisce da solo una formula sanzionatoria. La segnalazione al Corso Pubblico riguarda i fatti e gli atti pertinenti al servizio.'],
  ['A5','Fasce e precedenti','Scegliere la fascia dopo il riscontro dei precedenti nel quinquennio: prima, seconda, terza, quarta o successiva. Il conteggio dei controlli nel file non prova la reiterazione.'],
  ['A5','Fasce e precedenti','Reiterazione: almeno due violazioni dello stesso soggetto in tre anni. Documentare il precedente; non contarle dai controlli registrati in questo file. [EGAF note 6–8]'],
  ['A5','Fasce e precedenti','Scegliere la fascia soltanto dopo il riscontro dei precedenti pertinenti nel quinquennio. Il numero dei controlli non dimostra da solo la reiterazione.'],
  ['A5','Fasce e precedenti','Per il riscontro negativo scrivere «presso la C.O. […]» se è stata consultata la Centrale Operativa; scrivere «presso la U.O. indicata in intestazione» soltanto se è stata consultata quella Unità Operativa. Non attribuire il riscontro a un ufficio diverso.'],
  ['A5','Fasce e precedenti','Prima di qualificare il fatto come prima violazione, verificare il precedente pertinente. Un riscontro incompleto non attribuisce automaticamente tale qualifica.'],
  ['A6','Atti e seguito operativo','Con documento di circolazione ritirato per sospensione, fermo del veicolo per lo stesso periodo; verbalizzare custodia e permesso limitato al trasferimento. [EGAF nota 11; CDS214 c.7; CDS217]'],
  ['A6','Atti e seguito operativo','Sequestro: applicare art.213; identificare custode, luogo e condizioni dell’affidamento. Il rinvio EGAF al §C4 non è stato fornito.'],
  ['A6','Atti e seguito operativo','La confisca esclude il PMR. Sequestro e confisca sono fasi distinte. Le sanzioni sulla patente richiedono un veicolo per la cui guida essa sia necessaria. [EGAF note 1, 5, 6 e 8]'],
  ['A6','Atti e seguito operativo','Revoca: indicare i precedenti verificati dello stesso soggetto nel triennio. La comunicazione ex art. 219 CdS va effettuata entro cinque giorni; non attestare revoca o consegna della patente già eseguite in assenza del relativo provvedimento.'],
  ['A6','Atti e seguito operativo','Ritiro del documento di circolazione, permesso limitato al trasferimento, fermo e custodia richiedono atti separati effettivamente eseguiti. Documento e copia del verbale vanno trasmessi all’UMC entro cinque giorni.'],
  ['A6','Atti e seguito operativo','Patente ritirata: trasmissione alla Prefettura entro cinque giorni. Sequestro e custodia richiedono atti separati; il verbale va trasmesso al Prefetto del luogo della violazione entro dieci giorni.'],
  ['A7','Fonti, dichiarazioni e titolo','La mancata esibizione del titolo non dimostra che non sia stato rilasciato. Verificare stato, veicolo cui si riferisce e servizio effettivamente svolto. [EGAF note 1, 5 e 10]'],
  ['A7','Fonti, dichiarazioni e titolo','Passeggeri: identificarli verificando generalità ed estremi di un documento di riconoscimento valido, ove disponibile; se non esibito, documentare le modalità alternative di accertamento dell’identità. Raccogliere separatamente dichiarazioni su richiesta/offerta, punto di prelievo, destinazione, prezzo pattuito o pagato e modalità di contatto, distinguendo ciò che ciascuno ha direttamente percepito.'],
  ['A7','Fonti, dichiarazioni e titolo','Rifiuto delle dichiarazioni: annotare il rifiuto di rendere o formalizzare/sottoscrivere dichiarazioni. Se sono state pronunciate frasi spontanee, l’operatore redige una relazione riportando quanto effettivamente udito, autore, momento e circostanze, distinguendolo dai fatti osservati. Se il passeggero non ha detto nulla, riportare solo il rifiuto e i riscontri disponibili; non ricostruire dichiarazioni inesistenti.'],
  ['A7','Fonti, dichiarazioni e titolo','La segnalazione al Corso Pubblico resta nelle note operative; non aggiungere la relativa frase al corpo del verbale di taxi abusivo. La mancata esibizione della licenza, da sola, non dimostra l’assenza del titolo.'],
  ['A7','Fonti, dichiarazioni e titolo','Per autobus controllare patente e CQC persone, dotazioni prescritte e loro efficienza. Eventuali illeciti autonomi richiedono elementi e norma propri; non dedurre un illecito penale dal solo richiamo storico agli estintori. [EGAF note 2 e 7]']
  ,['A7','Fonti, dichiarazioni e titolo','La sola mancata esibizione della licenza o una verifica pendente non dimostrano l’assenza del titolo: in quel caso descrivere soltanto i fatti accertati nella relazione.']
  ,['A7','Fonti, dichiarazioni e titolo','Distinguere conducente, esercente del servizio, intestatario del titolo e veicolo. Separare l’osservazione degli operanti dai dati letti nei documenti; una copia è acquisita soltanto se lo è stata davvero.']
  ,['A7','Fonti, dichiarazioni e titolo','Identificare i passeggeri e distinguere la dichiarazione formalizzata dalle parole spontanee riportate nella relazione. Se rifiutano di formalizzare, non attribuire loro dichiarazioni sottoscritte.']
  ,['A7','Fonti, dichiarazioni e titolo','Usare «dichiarazione acquisita» solo se formalizzata con un atto. Se il passeggero riferisce fatti senza formalizzarli, riportare nella relazione le parole ascoltate, la fonte e le circostanze, senza attribuirgli una dichiarazione sottoscritta.']
];
const commonNoteMap=new Map(commonNotes.map(([id,,text])=>[text,id]));
const commonRouteParts=[
  'Ritiro del documento di circolazione, menzione nel verbale, permesso limitato al luogo di custodia; documento e copia del verbale all’UMC entro 5 giorni. Fermo del veicolo per la durata della sospensione, con atti separati.',
  'Se trasmessa, documentare nel seguito interno la segnalazione all’Ufficio Verbali per il titolo comunale.',
  'UMC per il documento di circolazione; Ufficio Verbali per il seguito; Ufficio Corso Pubblico tramite il percorso dell’Ufficio Verbali.'
];
const appendixSummary={
  A1:[
    'Trasmettere gli atti pertinenti all’Ufficio Corso Pubblico tramite l’Ufficio Verbali, tenendo distinti gli invii a Prefettura, UMC e altre autorità previsti per il caso. Per la trazione animale trasmettere soltanto fatti e atti relativi a quel servizio. Annotare una segnalazione interna come già trasmessa soltanto se lo è stata.'
  ],
  A2:[
    'I punti del regolamento riguardano la licenza taxi e sono distinti dai punti della patente. Verificare gruppo e art. 29, comma 4, prima di indicare il ritiro del titolo; per il gruppo richiamato nelle schede G03 non è previsto il ritiro immediato.'
  ],
  A3:[
    'Per le condizioni del titolo individuare la prescrizione precisa, la fonte e la sua efficacia; escludere la fattispecie più specifica o grave prima di usare il riferimento residuale. Il prontuario GIT richiama, secondo il servizio, l’art. 86, comma 3-bis, CdS per taxi e l’art. 85, comma 4-ter, CdS per NCC. La sola violazione regolamentare richiede una qualificazione autonoma; per taxi escludere anche i commi 2 e 3 dell’art. 86. [EGAF nota 12]'
  ],
  A4:[
    'Una contestazione richiede base normativa e presupposti verificati. Se la base non è qualificata o la scheda è di solo riferimento, descrivere i fatti nella relazione; la relativa formula non costituisce da sola una sanzione. La frase finale di invio del verbale si usa solo per un verbale effettivamente elevato; la segnalazione dei fatti al Corso Pubblico resta distinta.'
  ],
  A5:[
    'Scegliere la fascia soltanto dopo riscontro dei precedenti pertinenti al soggetto o al veicolo indicato dalla scheda. Nel quinquennio distinguere prima, seconda, terza e quarta o successiva violazione; nei casi che prevedono il triennio verificare le violazioni dello stesso soggetto. Il conteggio dei controlli nel prontuario non prova la reiterazione. Un riscontro incompleto o pendente non attribuisce automaticamente la prima fascia.',
    'Per il riscontro negativo riportare la C.O. (Centrale Operativa) solo se realmente consultata; usare la U.O. indicata in intestazione solo se è stata consultata quella Unità Operativa. Riportare data e riferimento della risposta oppure l’altra fonte effettiva.'
  ],
  A6:[
    'Il testo copiato va adattato agli atti effettivamente compiuti: eliminare o correggere i periodi non eseguiti e completare gli estremi. Per la sospensione del documento di circolazione documentare ritiro e trasmissione all’UMC entro cinque giorni, autorizzazione al trasferimento per la via più breve, fermo per la durata della sospensione, custodia e relativi verbali separati. [EGAF nota 11; CDS214 c.7; CDS217]',
    'Per il sequestro applicare l’art. 213 CdS e identificare custode, luogo e condizioni dell’affidamento; il rinvio EGAF al §C4 non è stato fornito. Sequestro e confisca sono fasi distinte e la confisca esclude il pagamento in misura ridotta. La conseguenza sulla patente richiede un veicolo per la cui guida essa sia necessaria. [EGAF note 1, 5, 6 e 8]',
    'La patente ritirata va trasmessa alla Prefettura entro cinque giorni; il verbale per il sequestro va trasmesso al Prefetto del luogo della violazione entro dieci giorni. Per la revoca comunicare i presupposti verificati ai sensi dell’art. 219 CdS entro cinque giorni, senza attestare revoca o consegna della patente prima del provvedimento competente.'
  ],
  A7:[
    'La mancata esibizione della licenza o dell’autorizzazione, così come una verifica pendente, non dimostra l’assenza del titolo: in quel caso descrivere i soli fatti accertati nella relazione. Verificare stato del titolo, servizio e veicolo controllato.',
    'Distinguere conducente, esercente del servizio, intestatario del titolo e veicolo. Separare l’osservazione diretta dai dati dei documenti; una copia è acquisita soltanto se lo è stata davvero. Identificare i passeggeri e documentare richiesta, prelievo, destinazione, corrispettivo e fonte di ciascun fatto.',
    'Usare “dichiarazione acquisita” soltanto per un atto formalizzato. Se il passeggero rifiuta di dichiarare o sottoscrivere, annotare il rifiuto; riportare nella relazione soltanto le parole spontanee realmente ascoltate, con autore e circostanze, senza ricostruire dichiarazioni inesistenti.',
    'Per autobus verificare patente, CQC persone e dotazioni: eventuali illeciti autonomi richiedono elementi e norma propri; il solo richiamo storico agli estintori non prova un illecito penale. Nei verbali di taxi abusivo la segnalazione al Corso Pubblico resta operativa, senza la frase finale del verbale.'
  ]
};
function compactCaseNotes(notes,route,hasActs){
  const refs=new Set(),specific=[];
  for(const note of notes){
    const ref=commonNoteMap.get(note);
    if(ref)refs.add(ref);else specific.push(note);
  }
  let shortRoute=route||'';
  for(const part of commonRouteParts){
    if(shortRoute.includes(part)){
      refs.add(part.includes('Segnalazione')?'A1':'A6');
      shortRoute=shortRoute.replace(part,'').trim();
    }
  }
  if(hasActs)refs.add('A6');
  if(refs.size)specific.push(`Istruzioni comuni: v. appendice ${[...refs].sort().join(', ')}.`);
  return {notes:specific,route:shortRoute};
}
function pdfFormulaMarkup(markup){
  return markup
    .replaceAll('<p class="staticChoiceHint">Utilizzare la voce pertinente.</p>','')
    .replace(/<span class="staticPointHints" role="note"><strong>([^<]+)<\/strong>(?:<span class="staticPointHint">[^<]*<\/span>)+<\/span>/g,(whole,title)=>
      /^(?:Estremi del seguito sul documento|Estremi degli atti dell’abusivismo|Estremi del ritiro del titolo comunale)$/.test(title)?'':whole);
}
function normative(item,type){
  let ref=item.verbaleRef||item.ref;
  if(item.kind==='local'&&item.scope==='all'&&!item.noTitle){
    ref=ref.replace('Taxi: CdS art.86 c.3-bis; NCC: CdS art.85 c.4-ter (se condizione del titolo verificata)',type==='NCC'?'CdS art.85 c.4-ter (se condizione dell’autorizzazione verificata)':'CdS art.86 c.3-bis (se condizione della licenza verificata)');
  }
  return ref.replace(/\bReg\.\s*(?:(artt?\.)\s*)?(?=\d)/g,(_,article)=>regulation+(article||'art.')+' ');
}
function money(value){return /\d/.test(value)&&!/[A-Za-z]/.test(value)?`€ ${value}`:value}
function pageFrame(number,body,code='',className=''){
  return `<article class="page ${className}" data-page="${number}" data-code="${esc(code)}"><header><b>CONTROLLI TAXI E NCC NAPOLI</b><span>PRONTUARIO OPERATIVO ${version}</span></header><main class="content">${body}</main><footer><span>A cura dell’Agente Antonio Balzano · U.O. San Lorenzo<br>${today} · Revisione proposta per validazione interna</span><span>Pagina ${number}</span></footer></article>`;
}
const comuneLogo=`data:image/png;base64,${(await readFile(resolve(root,'assets/polizia-locale-napoli.png'))).toString('base64')}`;
const poliziaLogo=`data:image/png;base64,${(await readFile(resolve(root,'assets/polizia.png'))).toString('base64')}`;
function coverPage(){
  const sections=[['01','TAXI','Licenza, turno, tassametro, tariffe e posteggio'],['02','NCC','Autovetture e autobus, autorizzazione e modalità del servizio'],['03','TRAZIONE ANIMALE','Benessere, abilitazione e allestimento']];
  return pageFrame(1,`<div class="coverLogos"><img style="width:25mm;height:25mm;object-fit:contain" src="${comuneLogo}" alt="Stemma Polizia Municipale Napoli"><img style="width:25mm;height:25mm;object-fit:contain" src="${poliziaLogo}" alt="Stemma U.O. San Lorenzo"></div><p class="coverEyebrow">POLIZIA MUNICIPALE DI NAPOLI · U.O. SAN LORENZO</p><h1>Prontuario operativo<br>Taxi, NCC e trazione animale</h1><p class="coverAuthor"><b>ANTONIO BALZANO</b><br>Agente di Polizia Municipale · U.O. San Lorenzo</p><div class="coverRevision">REVISIONE ${version} · ${today.toUpperCase()}</div><table class="coverSections"><thead><tr><th>Sezione</th><th>Servizio</th><th>Contenuto</th></tr></thead><tbody>${sections.map(([n,name,description])=>`<tr><td>${n}</td><td>${name}</td><td>${description}</td></tr>`).join('')}</tbody></table><p>Una scheda per fattispecie e fascia. L’indice iniziale collega direttamente al caso pertinente; il seguito operativo nel testo va adattato agli atti documentati.</p><p class="coverAttribution">Rielaborazione del prontuario U.O. G.I.T. TURISTICA, del regolamento fornito e dei testi EGAF artt. 85 e 86. Le fonti originali conservano la propria attribuzione. Revisione proposta per validazione interna.</p>`,'','coverPage');
}
function overviewTable(items){
  return `<table class="overview"><thead><tr><th>Codice</th><th>Caso / fascia</th><th>Limiti edittali</th><th>PMR</th><th>Misura CdS</th></tr></thead><tbody>${items.map(item=>`<tr><td>${esc(item.code)}</td><td>${esc(item.title)}</td><td>${esc(money(item.payments[0][1]))}</td><td>${esc(money(item.payments[0][2]))}</td><td>${esc(window.prontuarioCatalogAccessoryText(item.payments[0][5]))}</td></tr>`).join('')}</tbody></table>`;
}
function introductoryPages(){
  const first=2+layout.indexPageCount;
  const pick=code=>layout.rows.find(row=>row.item.code===code)?.item;
  const taxiCodes=['G01','G02','G03-01','G03-02','G03-03','G03-04','G23'];
  const nccCodes=['I02','N01','N02','N03','N04','N05','N06','N07','N12'];
  const legend=`<h1>Legenda e guida alla lettura</h1><table class="legendTable"><thead><tr><th>Sigla o voce</th><th>Significato</th></tr></thead><tbody>${data.prontuario.legend.map(row=>`<tr><td><b>${esc(row.code)}</b></td><td>${esc(row.text)}</td></tr>`).join('')}</tbody></table><h3>Testo orientativo</h3><p>${esc(data.prontuario.formulaGuide)}</p><p>Le parentesi quadre indicano fatti e riscontri da completare. Le alternative sono suggerimenti: utilizzare solo la voce pertinente. La copia dalla PWA contiene la formula senza gli elenchi. Il seguito operativo deve corrispondere agli atti documentati: eliminare o adattare le parti non eseguite e completare gli estremi prima dell’uso.</p>`;
  const bases=`<h1>Basi giuridiche e seguito comunale</h1><p>Prima della contestazione identificare la fattispecie, il titolo applicabile, la fonte del riscontro e il soggetto cui si riferisce. Le schede di solo riferimento restano relazioni e richiedono una base autonoma per un’eventuale sanzione.</p><h3>Regolamento comunale · gruppi</h3><table class="legendTable"><thead><tr><th>Gruppo</th><th>Seguito previsto nel catalogo</th></tr></thead><tbody>${Object.entries(data.prontuario.groups).map(([group,text])=>`<tr><td><b>${esc(group||'Senza gruppo')}</b></td><td>${esc(text)}</td></tr>`).join('')}</tbody></table><p>Le durate comunali richiedono il riscontro della fascia e un provvedimento dell’ufficio; la scheda non le applica automaticamente. I punti sul titolo comunale restano distinti da quelli della patente.</p><h3>Basi residue da qualificare</h3><p>${esc(data.prontuario.localSanction)}</p>`;
  const taxi=`<h1>Taxi · quadro dei casi principali</h1><p>Importi in euro, spese escluse. Ogni scheda mostra soltanto la propria fascia. Le conseguenze sul titolo comunale richiedono un riscontro distinto.</p>${overviewTable(taxiCodes.map(pick))}<h3>Ambito e riscontri</h3><p>${esc(data.prontuario.egafIntroduction)}</p><p>Per i casi con reiterazione confrontare atti, date dei fatti e soggetto pertinente. Un controllo o una verifica pendente non attribuiscono automaticamente una fascia.</p>`;
  const ncc=`<h1>NCC · quadro dei casi principali</h1><p>Importi in euro, spese escluse. I03-01–04 sono alias delle schede canoniche N04–N07, rispettivamente prima, seconda, terza e quarta o successiva fascia.</p>${overviewTable(nccCodes.map(pick))}<p>N04–N07 riguardano il medesimo veicolo nel quinquennio. N01–N03 richiedono la verifica del precedente personale pertinente nel triennio, secondo i limiti operativi indicati nelle schede.</p>`;
  const law=`<h1>Controllo della legge quadro</h1><p>${esc(data.prontuario.lawAuditNote)}</p><table class="legendTable"><thead><tr><th>Articolo</th><th>Materia</th><th>Riscontro</th></tr></thead><tbody>${data.prontuario.lawAudit.map(row=>`<tr>${row.map(value=>`<td>${esc(value)}</td>`).join('')}</tr>`).join('')}</tbody></table><h3>Fonti EGAF</h3><p>${esc(data.prontuario.egafDateNote)}</p>`;
  return [legend,bases,taxi,ncc,law].map((body,index)=>pageFrame(first+index,body,'','introPage'));
}
function appendixPages(first){
  const appendixSection=id=>{
    const entries=commonNotes.filter(row=>row[0]===id);
    return `<section><h3>${id} · ${esc(entries[0][1])}</h3>${appendixSummary[id].map(note=>`<p>${esc(note)}</p>`).join('')}</section>`;
  };
  const commonPages=[
    `<h1>Appendice operativa · 1/3</h1><p>Le indicazioni comuni sono richiamate nelle singole schede. Le condizioni specifiche restano nella scheda pertinente.</p>${['A1','A2','A3'].map(appendixSection).join('')}`,
    `<h1>Appendice operativa · 2/3</h1><p>Le alternative sono orientative: usare la voce pertinente, distinguendo fatti osservati, dichiarazioni formalizzate e documenti esaminati.</p>${['A4','A5','A6'].map(appendixSection).join('')}`,
    `<h1>Appendice operativa · 3/3</h1>${appendixSection('A7')}`
  ];
  const audit=`<h1>Confronto con il regolamento</h1><p>Gli articoli 1–40 del regolamento comunale sono confrontati con le schede. Disposizioni organizzative e procedimenti sul titolo non diventano automaticamente verbali in strada.</p><table class="auditTable"><thead><tr><th>Articolo</th><th>Materia</th><th>Schede e seguito</th></tr></thead><tbody>${data.prontuario.audit.map(row=>`<tr><td>${esc(row.article)}</td><td>${esc(row.subject)}</td><td>${esc(row.ids.map(id=>byId.get(id)?.code||id).join(', ')||row.status)}</td></tr>`).join('')}</tbody></table>`;
  const sourceChunks=[data.prontuario.sources.slice(0,15),data.prontuario.sources.slice(15)];
  const sources=sourceChunks.map((chunk,index)=>`<h1>Fonti e riferimenti · ${index+1}/2</h1><p>Fonti e verifiche dichiarate nel catalogo. Le date delle fonti indicano il relativo stato di verifica, non una nuova verifica normativa della revisione editoriale.</p>${chunk.map(source=>`<section class="sourceEntry"><h3>${esc(source.id)} · ${esc(source.title)}</h3><p>${esc(source.text)}</p></section>`).join('')}`);
  return [...commonPages,audit,...sources].map((body,index)=>pageFrame(first+index,body,'','appendixPage'));
}
function indexPage(section,index,page){
  const start=index*layout.rowsPerIndexPage,batch=section.rows.slice(start,start+layout.rowsPerIndexPage);
  const rows=batch.map(({item,type})=>{
    const code=item.code,pdfPage=layout.pages[`${item.id}/${type}`];
    const span=layout.pageSpans?.[`${item.id}/${type}`]||1;
    return `<tr><td><a href="#case-${item.id}-${type}">${esc(code)}</a></td><td>${esc(item.title)}${window.prontuarioCatalogAliasCodes[code]?` (alias ${esc(window.prontuarioCatalogAliasCodes[code])})`:''}</td><td>${pdfPage}${span>1?`–${pdfPage+span-1}`:''}</td></tr>`;
  }).join('');
  return pageFrame(page,`<h1>Indice ${esc(section.label)} · ${index+1}/${section.indexPages}</h1><p>Aprire il codice per raggiungere direttamente la singola scheda e la fascia pertinente.</p><table class="index"><thead><tr><th>Codice</th><th>Fattispecie</th><th>Pagina</th></tr></thead><tbody>${rows}</tbody></table>`,'','indexPage');
}
function content(item,type){
  const demo=type==='Taxi'?window.prontuarioStaticDemos[item.demoBaseId||item.id]:null;
  if(demo){
    const variant=item.demoVariant;
    return {
      title:variant?.title||demo.title,
      normative:demo.normative.join('; '),
      accessories:window.prontuarioDemoAccessories(demo,variant),
      relation:false,
      parts:window.prontuarioDemoFormulaParts(demo,variant),
      formulaMarkup:window.prontuarioDemoFormulaMarkup(demo,variant,esc),
      groups:demo.suggestions,
      notes:variant?[`Usare questa fascia solo dopo aver verificato ${variant.previous} dello stesso titolare nel quinquennio. Un riscontro incompleto non prova la fascia.`,...demo.notes.slice(1)]:demo.notes,
      responsibility:demo.responsibility||item.responsibility,
      route:demo.destinations||'',
      acts:demo.acts
    };
  }
  const model=window.prontuarioCatalogModel(item,type);
  const previous=window.prontuarioCatalogPrevious(item,type);
  const relation=window.prontuarioCatalogIsRelation(item);
  const ending=[window.prontuarioCatalogLegalSentence(item,type),model.tail,previous,window.prontuarioCatalogOperational(item),item.formula.includes(finalSentence)&&!relation?finalSentence:''].filter(Boolean).join(' ');
  return {
    title:item.title,normative:normative(item,type),accessories:window.prontuarioCatalogAccessorySections(item,type),relation,
    parts:[model.lead,ending],formulaMarkup:window.prontuarioCatalogFormulaMarkup(item,type,esc),groups:[{title:'Circostanza pertinente',options:model.options,other:model.other}],
    notes:window.prontuarioCatalogNotes(item,model),responsibility:item.responsibility||'',route:window.prontuarioCatalogRoute(item),
    acts:window.prontuarioCatalogActs(item)
  };
}
const caseSectionCache=new Map();
function caseSections({item,type}){
  const cacheKey=`${item.id}/${type}`;
  if(caseSectionCache.has(cacheKey))return caseSectionCache.get(cacheKey);
  const view=content(item,type),row=item.payments[0];
  if(item.payments.length!==1)throw Error(`Scheda con più fasce: ${item.code}`);
  if(view.parts.length!==view.groups.length+1)throw Error(`Formula non coerente: ${item.code}`);
  const amounts=`<table class="amounts"><thead><tr><th>PMR</th><th>Entro 5 giorni</th><th>Oltre 60 giorni o procedura</th><th>Limiti edittali</th></tr></thead><tbody><tr><td>${esc(money(row[2]))}</td><td>${esc(money(row[3]))}</td><td>${esc(money(row[4]))}</td><td>${esc(money(row[1]))}</td></tr></tbody></table>`;
  const formula=`<div class="formula">${pdfFormulaMarkup(view.formulaMarkup)}</div>`;
  const compact=compactCaseNotes(view.notes,view.route,view.acts.length>0);
  const accessory=window.prontuarioAccessoryRows(view.accessories);
  const eyebrow=`${esc(item.code)} · ${esc(type.toUpperCase())}${item.group?` · GRUPPO ${esc(item.group.toUpperCase())}`:''}`;
  const sections={
    head:`<div class="eyebrow">${eyebrow}</div><h1>${esc(view.title)}</h1>`,
    normative:`<section><h3>Normativa violata</h3><p>${esc(view.normative)}</p></section>`,
    amounts:`<section><h3>Tabella importi</h3>${amounts}</section>`,
    accessories:`<section><h3>Sanzioni accessorie e punti</h3><table class="accessoryTable"><tbody><tr><th scope="row">Sanzioni accessorie CdS</th><td>${esc(accessory.cds)}</td></tr><tr><th scope="row">Seguito sul titolo — Regolamento comunale</th><td>${esc(accessory.municipal)}</td></tr>${accessory.other?`<tr><th scope="row">Altre misure e comunicazioni</th><td>${esc(accessory.other)}</td></tr>`:''}<tr><th scope="row">Decurtazione punti patente</th><td>${esc(accessory.patentPoints)}</td></tr></tbody></table></section>`,
    formula:`<section><h3>${view.relation?'Testo orientativo per la relazione':'Testo orientativo del verbale'}</h3>${formula}</section>`,
    notes:`<section><h3>Suggerimenti e note operative</h3>${compact.notes.length?`<ul>${compact.notes.map(note=>`<li>${esc(note)}</li>`).join('')}</ul>`:''}${view.responsibility?`<h3>Responsabilità</h3><p>${esc(view.responsibility)}</p>`:''}${compact.route?`<h3>Seguito operativo</h3><p>${esc(compact.route)}</p>`:''}</section><p class="sourceFoot">Fonti: ${esc(item.sources.join(', '))}.</p>`
  };
  caseSectionCache.set(cacheKey,sections);
  return sections;
}
function casePage(row,number,probeKey=''){
  const s=caseSections(row);
  const body=s.head+s.normative+s.amounts+s.accessories+s.formula+s.notes;
  return pageFrame(number,body,row.item.code,'casePage')
    .replace('<article class=',probeKey?`<article data-key="${probeKey}" class=`:'<article class=')
    .replace('<main class="content">',`<main class="content" id="case-${row.item.id}-${row.type}">`);
}

const style=`@page{size:A4;margin:0}*{box-sizing:border-box}html,body{margin:0;color:#142d42;font-family:Arial,"DejaVu Sans",sans-serif}.page{position:relative;width:210mm;height:296.9mm;break-after:page;overflow:hidden;background:#fff}.page:last-child{break-after:auto}.page header{position:absolute;top:6.5mm;left:18mm;right:18mm;display:flex;justify-content:space-between;border-bottom:1px solid #193d58;padding-bottom:2mm;font-size:7.2pt}.page header span{color:#506577}.content{position:absolute;top:22mm;left:18mm;right:18mm;bottom:20mm;font-size:var(--text-size,8.5pt);line-height:1.22;overflow:visible}.content h1{font-size:1.55em;line-height:1.15;color:#143650;margin:1mm 0 2mm}.content h3{font-size:1em;color:#1e5977;margin:1.5mm 0 .6mm}.content p{margin:.3mm 0 1mm}.content section{margin:1.3mm 0}.content ul{padding-left:4.2mm;margin:.4mm 0}.content li{margin:0 0 .7mm}.content li::marker{color:#26718a}.eyebrow{font-weight:bold;color:#13546e;letter-spacing:.04em}.content table{border-collapse:collapse;width:100%;table-layout:fixed;font-size:.92em;margin:.5mm 0}.content th,.content td{border:1px solid #b9cbd2;padding:1mm;text-align:left;vertical-align:top;overflow-wrap:anywhere}.content th{background:#edf4f6}.formula{background:#edf4f6;border-left:3px solid #126b73;padding:2mm 3mm}.formula p:first-child{font-weight:600}.formula .choiceHint{font-weight:bold;color:#155c61;font-size:.9em}.formula ul{margin:.3mm 0 1mm}.sourceFoot{border-top:1px solid #c7d3d8;padding-top:1mm;margin-top:1.5mm!important;color:#526571}.page footer{position:absolute;left:18mm;right:18mm;bottom:6.4mm;display:flex;justify-content:space-between;border-top:1px solid #cbd7dd;padding-top:1.4mm;font-size:7pt;line-height:1.35;color:#506577}.indexPage .content{font-size:8pt}.indexPage h1{margin-bottom:2mm}.indexPage .index{font-size:8pt;line-height:1.08}.indexPage th,.indexPage td{padding:1mm}.indexPage th:first-child{width:14%}.indexPage th:last-child{width:10%}.indexPage a{color:#155c61;text-decoration:none;font-weight:bold}`;
const extraStyle=`.casePage .content{top:20mm;bottom:18mm;font-size:9pt}.casePage .content section{margin:1mm 0}.casePage .content li{margin-bottom:.4mm}.casePage .accessoryTable{font-size:1em;line-height:1.1;margin:.3mm 0}.casePage .accessoryTable th,.casePage .accessoryTable td{padding:.6mm 1mm}.casePage .accessoryTable th{width:31%}.formula .staticFormulaPart{margin:.4mm 0}.formula .staticChoiceHint{font-weight:bold;color:#155c61;font-size:.9em}.formula .staticFormulaChoices{margin:.3mm 0 .8mm}.formula .staticPointHints{display:block;margin:.7mm 0 1mm 3mm;padding:.7mm 1.5mm;border-left:1px solid #73a9b2;color:#275368;font-size:1em;font-weight:400}.formula .staticPointHints strong{display:block;font-weight:700}.formula .staticPointHint{display:block;margin:.3mm 0}.operationNote{font-weight:600;color:#1b5667;background:#e7f1f3;border-left:2px solid #126b73;padding:1.2mm 2mm;margin:1mm 0}.coverPage .content{top:26mm;font-size:10pt}.coverLogos{display:flex;justify-content:space-between;align-items:center;margin:6mm 0 18mm}.coverEyebrow{letter-spacing:.08em;color:#1b5973;font-weight:bold}.coverPage h1{font-size:27pt;line-height:1.12;margin:5mm 0 9mm}.coverAuthor{font-size:12pt;line-height:1.5}.coverRevision{display:inline-block;background:#e7f1f3;color:#15455d;font-size:11pt;font-weight:bold;padding:3mm 5mm;margin:8mm 0}.coverSections{font-size:9pt!important}.coverAttribution{margin-top:12mm!important;color:#506577}.introPage .content{font-size:var(--text-size,8.5pt)}.introPage h1,.appendixPage h1{font-size:16pt;margin-bottom:3mm}.introPage .legendTable{font-size:.94em}.introPage .legendTable th:first-child{width:21%}.introPage .legendTable td,.introPage .legendTable th{padding:1.15mm}.introPage .overview{font-size:.89em}.introPage .overview th:first-child{width:11%}.introPage .overview th:nth-child(2){width:40%}.introPage .overview th:nth-child(3){width:16%}.introPage .overview th:nth-child(4){width:12%}.appendixPage .content{font-size:var(--text-size,8.4pt)}.appendixPage .auditTable{font-size:.89em}.appendixPage .auditTable th:first-child{width:13%}.appendixPage .auditTable th:nth-child(2){width:47%}.appendixPage .sourceEntry{margin:2mm 0;border-bottom:1px solid #e1e9eb;padding-bottom:1mm}.appendixPage .sourceEntry h3{margin:0 0 .3mm}`;
const caseFitStyle=`.casePage .content{top:18mm;bottom:15mm}.casePage .content section{margin:.4mm 0}.casePage .content h3{margin:.5mm 0 .2mm}.casePage .content ul{margin:.2mm 0}.casePage .content li{margin-bottom:.15mm}.casePage .content p{margin:.2mm 0 .5mm}.casePage .formula{padding:1.4mm 2mm}.casePage .formula .staticPointHints{margin:.3mm 0 .45mm 2mm;padding:.4mm 1mm}.casePage .formula .staticPointHint{margin:.1mm 0}.casePage .formula .staticFormulaChoices{margin:.15mm 0 .35mm}`;
const documentShell=body=>`<!doctype html><html lang="it"><head><meta charset="utf-8"><style>${style}${extraStyle}${caseFitStyle}</style></head><body>${body}</body></html>`;
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||chromium.executablePath(),headless:true,args:['--no-sandbox']});
let generatedBytes;
try{
  const page=await browser.newPage();
  await page.setContent(documentShell(layout.rows.map((row,index)=>casePage(row,0,`${index}:full`)).join('')),{waitUntil:'load'});
  const measurements=await page.evaluate(()=>[...document.querySelectorAll('.casePage')].map(article=>{
    const content=article.querySelector('.content');
    return {height:content.scrollHeight,available:content.clientHeight,fits:content.scrollHeight<=content.clientHeight+1};
  }));
  const overflowRows=layout.rows.map((row,index)=>({row,index})).filter(({index})=>!measurements[index].fits);
  if(overflowRows.length)throw Error('Schede ancora troppo lunghe a 9 pt, senza PDF modificato: '+overflowRows.map(({row,index})=>`${row.item.code}/${row.type} (+${measurements[index].height-measurements[index].available}px)`).join(', '));
  layout.pageSpans={};
  for(let index=0;index<layout.rows.length;index++){
    const {item,type}=layout.rows[index],key=`${item.id}/${type}`;
    layout.pages[key]=layout.firstCasePage+index;
    layout.pageSpans[key]=1;
  }
  const nextCasePage=layout.firstCasePage+layout.rows.length;
  for(const [alias,canonical] of Object.entries(window.prontuarioCatalogAliases)){
    const type=alias==='esposizionetariffario'?'Taxi':'NCC';
    layout.pages[`${alias}/${type}`]=layout.pages[`${canonical}/${type}`];
  }
  const indexPages=[];
  let nextIndexPage=2;
  for(const section of layout.sections)for(let index=0;index<section.indexPages;index++)indexPages.push(indexPage(section,index,nextIndexPage++));
  const introPages=introductoryPages();
  const casePages=layout.rows.map(row=>casePage(row,layout.pages[`${row.item.id}/${row.type}`]));
  const afterPages=appendixPages(nextCasePage);
  await page.setContent(documentShell(coverPage()+indexPages.join('')+introPages.join('')+casePages.join('')+afterPages.join('')),{waitUntil:'load'});
  const overflow=await page.evaluate(()=>{
    const failures=[];
    for(const article of document.querySelectorAll('.page')){
      const content=article.querySelector('.content');
      if(content.scrollHeight>content.clientHeight+1)failures.push(`${article.dataset.page} ${article.dataset.code}: ${content.scrollHeight}/${content.clientHeight}`);
    }
    return failures;
  });
  if(overflow.length)throw Error('Testo oltre il margine: '+overflow.join(', '));
  generatedBytes=await page.pdf({format:'A4',preferCSSPageSize:true,printBackground:true,margin:{top:0,right:0,bottom:0,left:0}});
  console.log(`Impaginazione: ${casePages.length} pagine per ${layout.rows.length} schede; caratteri fissi.`);
}finally{await browser.close()}
const generated=await PDFDocument.load(generatedBytes);
const output=generated;
const casePageCount=Object.values(layout.pageSpans).reduce((sum,span)=>sum+span,0);
if(output.getPageCount()!==layout.firstCasePage+casePageCount+5)throw Error('Numero totale di pagine incoerente');

let sectionOffset=0;
for(const section of layout.sections){
  for(let index=0;index<section.indexPages;index++){
    const page=output.getPage(1+sectionOffset+index),annotations=page.node.Annots();
    const batch=section.rows.slice(index*layout.rowsPerIndexPage,(index+1)*layout.rowsPerIndexPage);
    if(!annotations||annotations.size()!==batch.length)throw Error(`Indice ${section.label}/${index+1}: ${annotations?.size()} link per ${batch.length} righe`);
    for(let row=0;row<batch.length;row++){
      const {item,type}=batch[row],target=layout.pages[`${item.id}/${type}`];
      const annotation=output.context.lookup(annotations.get(row));
      annotation.set(PDFName.of('Dest'),output.context.obj([output.getPage(target-1).ref,PDFName.of('XYZ'),0,841.89,0]));
      annotation.delete(PDFName.of('A'));
    }
  }
  sectionOffset+=section.indexPages;
}
output.setTitle(`Prontuario operativo Taxi, NCC e trazione animale Napoli · ${version}`);
output.setAuthor('Antonio Balzano · U.O. San Lorenzo');
output.setSubject('Schede di consultazione per fattispecie e fascia, una pagina per caso');
const outputBytes=await output.save();
const pendingPath=pdfPath+'.next';
await writeFile(pendingPath,outputBytes);
await rename(pendingPath,pdfPath);
const searchable=await getDocument({data:new Uint8Array(outputBytes),standardFontDataUrl:resolve(root,'node_modules/pdfjs-dist/standard_fonts')+'/'}).promise;
const sourcePages=[];
for(let number=1;number<=searchable.numPages;number++){
  const page=await searchable.getPage(number);
  sourcePages.push((await page.getTextContent()).items.map(item=>item.str).join(' '));
}
await searchable.destroy();
data.sources[3].title=`Prontuario operativo ${version} · Antonio Balzano`;
data.sources[3].pages=sourcePages;
data.prontuario.version=version;
data.staticPages=layout.pages;
data.staticPageSpans=layout.pageSpans;
data.manualVariants=layout.rows.map(({item,type})=>({id:item.id,type:type==='Trazione animale'?'equina':type.toLowerCase(),page:layout.pages[`${item.id}/${type}`]}));
data.manualIndex=[];
let indexPageNumber=2;
for(const section of layout.sections)for(let index=0;index<section.indexPages;index++){
  data.manualIndex.push({type:section.type==='Trazione animale'?'equina':section.type.toLowerCase(),ids:section.rows.slice(index*layout.rowsPerIndexPage,(index+1)*layout.rowsPerIndexPage).map(({item})=>item.id),page:indexPageNumber++});
}
data.manualGuidePages={};data.manualGuideIndexPage=null;
data.manualLegendPage=2+layout.indexPageCount;
data.manualCommonPages=[layout.firstCasePage+casePageCount,layout.firstCasePage+casePageCount+1,layout.firstCasePage+casePageCount+2];
data.manualAuditPage=layout.firstCasePage+casePageCount+3;
for(const item of data.catalog){
  const types=item.scope==='all'?['Taxi','NCC']:item.scope==='equina'?['Trazione animale']:[item.scope==='ncc'?'NCC':'Taxi'];
  for(const type of types){
    const first=layout.sections.find(section=>section.type===type).rows.find(row=>row.item.id===item.id||row.item.demoBaseId===item.id);
    const target=first?layout.pages[`${first.item.id}/${type}`]:layout.pages[`${item.id}/${type}`];
    if(target){item.docPages[type==='Trazione animale'?'equina':type.toLowerCase()]=target;item.docPage=item.docPages[types[0]==='Trazione animale'?'equina':types[0].toLowerCase()];}
  }
}
await writeFile(resolve(root,'index.html'),html.replace(dataLine,'const DATA='+JSON.stringify(data)+';'));
console.log(`PDF ${version}: ${output.getPageCount()} pagine, ${layout.rows.length} schede, ${layout.indexPageCount} pagine di indice e collegamenti riallineati.`);
