// Carica gli stessi modelli dell'HTML per audit e regressioni senza DOM.
import fs from 'node:fs';import path from 'node:path';import vm from 'node:vm';
export function loadReview(root,{read=name=>fs.readFileSync(path.join(root,name),'utf8')}={}){
 const html=read('index.html'),data=JSON.parse(html.match(/^const DATA=(.*);$/m)[1]),window={};
 for(const [,name]of html.matchAll(/<script src="(scripts\/[^"?]+)"/g))vm.runInNewContext(read(name),{window},{filename:name});
 const layout=window.prontuarioStaticLayout(data.catalog,data.manualParts,data.staticPages);
 const views=layout.rows.map(({item,type})=>{const model=window.prontuarioTerzaDefinition(item,type),view=window.prontuarioRevisionView(item,type);return {code:item.code,id:item.id,type,page:data.staticPages[item.id+'/'+type],item,model,view,follow:view?window.prontuarioFollowup(item,view.accessories):null,body:item.kind==='collective-reference'?'':window.prontuarioCatalogBody(item,type,{sourceLink:()=>'',esc:s=>String(s),date:s=>String(s)}),formulas:model?Array.from({length:model.options.length+1},(_,i)=>window.prontuarioTerzaFormula(item,type,i)):view?.parts||[]};});
 return {html,data,window,layout,views};
}
