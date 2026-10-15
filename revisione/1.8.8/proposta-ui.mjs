import {examples,formulaFor} from './proposta-operativa.mjs';
for(const example of examples){
  const card=document.querySelector(`[data-code="${example.code}"]`);
  const select=card.querySelector('select');
  const update=()=>{
    card.querySelector('.reviewFormula').textContent=formulaFor(example,select.value);
    card.querySelector('.executionCondition').textContent=example.variants.find(v=>v.id===select.value).condition;
    card.querySelector('.variantLabel').textContent=select.selectedOptions[0].textContent;
  };
  select.addEventListener('change',update);update();
  card.querySelector('.copyReview').addEventListener('click',async()=>{
    const status=card.querySelector('[role="status"]');
    try{await navigator.clipboard.writeText(formulaFor(example,select.value));status.textContent='Formula copiata. Verifica che gli adempimenti attestati siano stati eseguiti.'}
    catch{status.textContent='Seleziona e copia il solo testo della formula.'}
  });
}
window.reviewReady=true;
