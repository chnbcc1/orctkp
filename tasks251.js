(function(){
 'use strict';
 const types={event:'Etkinlik / Malzeme',performance:'Performans Ödevi',project:'Proje Ödevi',document:'Belge / Diğer Teslim'};
 const states=['unchecked','yes','no','exempt'];
 const esc=window.esc;
 let cid=null,lid=null,filter='all',query='',showArchive=false;
 const current=()=>state.classes.find(c=>c.id===cid);
 const lists=()=>current()?.taskLists249||[];
 const record=()=>lists().find(l=>l.id===lid);
 const members=l=>l.members.filter(s=>s.active!==false);
 const items=l=>l.items.filter(i=>i.active!==false);
 const date=()=>localISODate(new Date());
 const labels=l=>['Kontrol edilmedi','Teslim etti','Teslim etmedi','Muaf'];
 const status=(l,s,i)=>states.includes(l.marks?.[s]?.[i])?l.marks[s][i]:'unchecked';
 function commit(change){
  const c=current();if(!c)return false;
  const before=JSON.parse(JSON.stringify(c.taskLists249||[]));
  try{change();if(save()===false){c.taskLists249=before;return false;}return true;}
  catch(e){c.taskLists249=before;alert('Liste kaydedilemedi: '+e.message);return false;}
 }
 function shell(title,html){
  el('modalTitle').textContent=title;el('modalSubtitle').textContent=current()?.name||'';
  el('modalBody').innerHTML='<div id="mmTasks249">'+html+'</div>';el('modal').classList.add('open');
 }
 function button(text,action,extra=''){return `<button type="button" class="secondary" data-task-action="${action}" ${extra}>${text}</button>`;}
 function bind(){el('mmTasks249').onclick=async event=>{
  const b=event.target.closest('[data-task-action]');if(!b)return;
  const a=b.dataset.taskAction;
  if(a==='new'){lid=null;editor();}
  if(a==='open'){lid=b.dataset.id;filter='all';query='';detail();}
  if(a==='back')home();
  if(a==='edit')editor();
  if(a==='cancel'){if(record())detail();else home();}
  if(a==='save')saveEditor();
  if(a==='add-item')addItemRow();
  if(a==='mark'){
   const l=record();if(!l)return;
   const s=b.dataset.student,i=b.dataset.item,chosen=b.dataset.status;if(!['yes','no','exempt'].includes(chosen))return;const next=status(l,s,i)===chosen?'unchecked':chosen;
   const box=el('modalBody'),top=box.scrollTop,parent=box.closest('.modal-box'),outer=parent?.scrollTop||0;
   if(commit(()=>{l.marks||={};l.marks[s]||={};l.marks[s][i]=next;l.updatedAt=new Date().toISOString();})){detail();box.scrollTop=top;if(parent)parent.scrollTop=outer;}
  }
  if(a==='archive'){
   const l=record();if(!l)return;
   if(commit(()=>{l.archived=!l.archived;l.updatedAt=new Date().toISOString();}))home();
  }
  if(a==='all-students')el('mmTasks249').querySelectorAll('[data-member]').forEach(n=>n.checked=true);
  if(a==='no-students')el('mmTasks249').querySelectorAll('[data-member]').forEach(n=>n.checked=false);
  if(a==='pdf'||a==='blank-pdf'){
   b.disabled=true;try{await pdf(a==='blank-pdf');}catch(e){alert('PDF hazırlanamadı: '+e.message);}finally{b.disabled=false;}
  }
  if(a==='csv'){try{await csv();}catch(e){alert('CSV hazırlanamadı: '+e.message);}}
 };
 }
 function home(){
  lid=null;
  const rows=lists().filter(l=>showArchive?true:!l.archived).slice().sort((a,b)=>(b.updatedAt||b.createdAt).localeCompare(a.updatedAt||a.createdAt));
  shell('Görev ve Teslim Takibi',`<div class="task249-actions">${button('+ Yeni Liste','new')}<label><input id="taskArchive249" type="checkbox" ${showArchive?'checked':''}> Arşivdekileri göster</label></div><p class="tiny">Etkinlik malzemelerini, performans ve proje teslimlerini ayrı listelerde takip et. Teslim işaretleri not puanlarını değiştirmez.</p>${rows.map(l=>`<button type="button" class="task249-list" data-task-action="open" data-id="${esc(l.id)}"><b>${esc(l.title)}</b><span>${esc(types[l.type]||types.event)} · ${members(l).length} öğrenci · ${items(l).length} madde${l.due?' · Son teslim: '+esc(l.due):''}${l.archived?' · Arşiv':''}</span></button>`).join('')||'<div class="empty">Henüz kontrol listesi yok. Yeni Liste ile başlayabilirsin.</div>'}`);
  el('taskArchive249').onchange=e=>{showArchive=e.target.checked;home();};bind();
 }
 function roster(l){
  const rows=(l?.members||[]).map(x=>({...x}));
  for(const s of current().students||[])if(!rows.some(x=>x.id===s.id))rows.push({id:s.id,name:s.name,number:s.number,active:!l});
  return rows;
 }
 function itemRow(item){return `<div class="task249-item" data-item-id="${esc(item.id)}"><input data-label maxlength="100" aria-label="Madde adı" value="${esc(item.label||'')}" placeholder="Örn. Cetvel veya Proje ödevi"><label><input data-active type="checkbox" ${item.active!==false?'checked':''}> Listede göster</label></div>`;}
 function addItemRow(){
  if(el('taskItems249').children.length>=20)return alert('Bir listede en fazla 20 madde olabilir.');
  el('taskItems249').insertAdjacentHTML('beforeend',itemRow({id:uid(),label:'',active:true}));
 }
 function editor(){
  const l=record(),r=roster(l);
  shell(l?'Listeyi Düzenle':'Yeni Kontrol Listesi',`<div class="task249-form"><label>Liste adı<input id="taskTitle249" maxlength="120" value="${esc(l?.title||'')}" placeholder="Örn. 1. Dönem Proje Teslimi"></label><label>Tür<select id="taskType249">${Object.entries(types).map(([k,v])=>`<option value="${k}" ${l?.type===k?'selected':''}>${v}</option>`).join('')}</select></label><label>Verilme / etkinlik tarihi<input id="taskDate249" type="date" value="${esc(l?.date||date())}"></label><label>Son teslim tarihi (isteğe bağlı)<input id="taskDue249" type="date" value="${esc(l?.due||'')}"></label></div><p><b>Kontrol edilecekler</b></p><div id="taskItems249">${(l?.items||[{id:uid(),label:'',active:true}]).map(itemRow).join('')}</div>${button('+ Madde Ekle','add-item')}<p class="tiny">Eski bir maddeyi gizlemek için “Listede göster” işaretini kaldır. İşaretlemeleri saklanır. Bir maddenin adını değiştirirsen eski işaretleri aynı maddede kalır.</p><p><b>Öğrenciler</b></p><div class="task249-actions">${button('Tümünü Seç','all-students')}${button('Seçimi Temizle','no-students')}</div><div class="task249-members">${r.map(s=>`<label><input type="checkbox" data-member="${esc(s.id)}" ${s.active!==false?'checked':''}> ${esc(s.number||'')} · ${esc(s.name)}</label>`).join('')||'<p>Önce sınıfa öğrenci eklemelisin.</p>'}</div><p class="tiny">Yeni öğrenciler düzenleme ekranına eklenir; listeye almak için seçebilirsin. Seçimini kaldırdığın öğrencinin eski işaretleri silinmez.</p><div class="task249-actions">${button('Listeyi Kaydet','save')}${button('Vazgeç','cancel')}</div>`);
  bind();
 }
 function saveEditor(){
  const title=el('taskTitle249').value.trim(),type=el('taskType249').value,day=el('taskDate249').value,due=el('taskDue249').value;
  if(!title)return alert('Liste adını girin.');
  if(due&&day&&due<day)return alert('Son teslim tarihi verilme tarihinden önce olamaz.');
  const old=record(),rows=[...el('taskItems249').children].map(n=>({id:n.dataset.itemId,label:n.querySelector('[data-label]').value.trim(),active:n.querySelector('[data-active]').checked}));
  if(rows.some(i=>i.active&&!i.label))return alert('Görünen maddelerin adlarını doldurun.');
  if(!rows.some(i=>i.active&&i.label))return alert('En az bir kontrol maddesi olmalı.');
  const selected=new Set([...el('mmTasks249').querySelectorAll('[data-member]:checked')].map(n=>n.dataset.member));
  if(!selected.size)return alert('En az bir öğrenci seçin.');
  const now=new Date().toISOString(),newId=old?.id||uid();
  const value={...(old||{}),id:newId,title,type,date:day,due,createdAt:old?.createdAt||now,updatedAt:now,items:rows.filter(i=>i.label||old?.items.some(x=>x.id===i.id)),members:roster(old).map(s=>({...s,active:selected.has(s.id)})),marks:old?.marks||{},notes:old?.notes||{},archived:old?.archived||false};
  if(commit(()=>{current().taskLists249||=[];const ix=current().taskLists249.findIndex(l=>l.id===newId);if(ix<0)current().taskLists249.push(value);else current().taskLists249[ix]=value;})){lid=newId;filter='all';query='';detail();}
 }
 function visible(l){return members(l).filter(s=>{
  if(query&&!normName((s.number||'')+' '+s.name).includes(normName(query)))return false;
  return filter==='all'||items(l).some(i=>status(l,s.id,i.id)===filter);
 });}
 function counters(l){const n={unchecked:0,yes:0,no:0,exempt:0};for(const s of members(l))for(const i of items(l))n[status(l,s.id,i.id)]++;return n;}
 function studentsHTML(l){
  const names=labels(l);
  return visible(l).map(s=>`<article class="task249-student"><b>${esc(s.number||'')} · ${esc(s.name)}</b><div class="task249-cells">${items(l).map(i=>{const mark=status(l,s.id,i.id);return `<div><span>${esc(i.label)}</span><div class="task250-options" role="group" aria-label="${esc(i.label)}">${['yes','no','exempt'].map(value=>`<button type="button" data-task-action="mark" data-student="${esc(s.id)}" data-item="${esc(i.id)}" data-status="${value}" class="task249-mark task250-choice ${mark===value?'task249-'+value+' is-active':''}" aria-pressed="${mark===value}" aria-label="${esc(s.name+' · '+i.label+' · '+names[states.indexOf(value)])}">${esc(names[states.indexOf(value)])}</button>`).join('')}</div></div>`;}).join('')}</div><label class="tiny">Öğrenci notu<input data-note-student="${esc(s.id)}" maxlength="500" value="${esc(l.notes?.[s.id]||'')}" placeholder="İsteğe bağlı kısa not"></label></article>`).join('')||'<div class="empty">Bu filtreye uyan öğrenci yok.</div>';
 }
 function bindNotes(){el('taskStudents249').querySelectorAll('[data-note-student]').forEach(input=>input.oninput=()=>{
  const l=record(),value=input.value;if(!l)return;
  if(!commit(()=>{l.notes||={};l.notes[input.dataset.noteStudent]=value;l.updatedAt=new Date().toISOString();}))input.value=record()?.notes?.[input.dataset.noteStudent]||'';
 });}
 function detail(){
  const l=record();if(!l)return home();const n=counters(l),names=labels(l);
  shell('Görev ve Teslim Takibi',`<div class="task249-actions">${button('← Listeler','back')}${button('Listeyi Düzenle','edit')}</div><h3>${esc(l.title)}</h3><p class="tiny">${esc(types[l.type])}${l.date?' · Tarih: '+esc(l.date):''}${l.due?' · Son teslim: '+esc(l.due):''}${l.due&&l.due<date()&&(n.no||n.unchecked)?' · Teslim tarihi geçti':''}</p><div class="notice">${n.yes} ${esc(names[1].toLocaleLowerCase('tr-TR'))} · ${n.no} ${esc(names[2].toLocaleLowerCase('tr-TR'))} · ${n.unchecked} kontrol edilmedi · ${n.exempt} muaf <small>(öğrenci × madde)</small></div><p class="tiny">Uygun durumu seç. Seçili düğmeye yeniden dokununca seçim kalkar. Değişiklikler otomatik kaydedilir.</p><div class="task249-form"><label>Öğrenci ara<input id="taskSearch249" value="${esc(query)}" placeholder="Ad veya numara"></label><label>Göster<select id="taskFilter249"><option value="all">Tüm öğrenciler</option>${states.map((s,i)=>`<option value="${s}" ${filter===s?'selected':''}>${esc(names[i])}</option>`).join('')}</select></label></div><div id="taskStudents249">${studentsHTML(l)}</div><div class="task249-actions">${button('PDF · İşaretli','pdf')}${button('PDF · Boş Liste','blank-pdf')}${button('Excel / CSV','csv')}${button(l.archived?'Arşivden Çıkar':'Arşivle','archive')}</div><p class="tiny">Çıktılar filtreye bakılmaksızın bu listenin seçili tüm öğrencilerini ve görünen maddelerini içerir.</p>`);
  el('taskSearch249').oninput=e=>{query=e.target.value;el('taskStudents249').innerHTML=studentsHTML(record());bindNotes();};
  el('taskFilter249').onchange=e=>{filter=e.target.value;el('taskStudents249').innerHTML=studentsHTML(record());bindNotes();};
  bindNotes();bind();
 }
 async function csv(){
  const l=record();if(!l)return;
  const cell=v=>{let s=String(v??'');if(/^\s*[=+@-]/.test(s)||/^[\t\r\n]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';};
  const rows=[['Liste',l.title,'Tür',types[l.type],'Tarih',l.date,'Son teslim',l.due],['Sınıf','No','Öğrenci',...items(l).map(i=>i.label),'Not'],...members(l).map(s=>[current().name,s.number,s.name,...items(l).map(i=>labels(l)[states.indexOf(status(l,s.id,i.id))]),l.notes?.[s.id]||''])];
  await saveOutputBlob(new Blob(['\uFEFF'+rows.map(r=>r.map(cell).join(';')).join('\r\n')],{type:'text/csv;charset=utf-8'}),safe(l.title)+'_Kontrol.csv','text/csv;charset=utf-8');
 }
 function fit(ctx,text,x,y,width,font=22){ctx.font=font+'px Arial';let s=String(text||'');if(ctx.measureText(s).width>width){while(s.length&&ctx.measureText(s+'…').width>width)s=s.slice(0,-1);s+='…';}ctx.fillText(s,x,y);}
 function canvases(l,blank){
  const output=[],students=members(l),columns=items(l),chunks=[];
  for(let i=0;i<columns.length;i+=4)chunks.push(columns.slice(i,i+4));
  for(const chunk of chunks)for(let start=0;start<students.length;start+=26){
   const cv=document.createElement('canvas');cv.width=1240;cv.height=1754;const ctx=cv.getContext('2d');ctx.fillStyle='#fcf8eb';ctx.fillRect(0,0,1240,1754);ctx.fillStyle='#064e42';ctx.fillRect(0,0,1240,210);ctx.fillStyle='#fff9e7';fit(ctx,l.title,55,65,1130,34);fit(ctx,`${current().name} · ${types[l.type]}`,55,110,1130,25);fit(ctx,`Tarih: ${l.date||'—'} · Son teslim: ${l.due||'—'}${blank?' · Boş kontrol listesi':''}`,55,153,1130,22);
   const widths=[80,320,...chunk.map(()=>510/chunk.length),220],xs=[40];for(const width of widths)xs.push(xs[xs.length-1]+width);
   const headers=['No','Öğrenci',...chunk.map(i=>i.label),'Not'];let y=250;
   ctx.fillStyle='#e2d7b7';ctx.fillRect(40,y,Math.min(xs.at(-1)-40,1160),48);ctx.fillStyle='#173f36';headers.forEach((h,i)=>{
    const isItem=i>=2&&i<2+chunk.length;
    ctx.save();ctx.textAlign=isItem?'center':'left';fit(ctx,h,isItem?xs[i]+widths[i]/2:xs[i]+7,y+31,widths[i]-14,21);ctx.restore();
   });y+=48;
   for(const [index,s] of students.slice(start,start+26).entries()){
    ctx.fillStyle=index%2?'#fffdf7':'#eaf1ec';ctx.fillRect(40,y,Math.min(xs.at(-1)-40,1160),45);ctx.fillStyle='#173f36';
    fit(ctx,s.number,xs[0]+7,y+29,widths[0]-14,17);
    fit(ctx,s.name,xs[1]+7,y+29,widths[1]-14,21);
    chunk.forEach((item,j)=>{
     const col=j+2,cx=xs[col]+widths[col]/2;
     ctx.save();
     if(blank){
      // A real 5.4 mm writing box, independent of PDF font glyphs.
      const size=32;ctx.fillStyle='#ffffff';ctx.strokeStyle='#52675f';ctx.lineWidth=2;
      ctx.fillRect(cx-size/2,y+(45-size)/2,size,size);ctx.strokeRect(cx-size/2,y+(45-size)/2,size,size);
     }else{
      const value=status(l,s.id,item.id),palette={yes:['#dcefe2','#1c6b3a'],no:['#f7dcda','#a1322b'],exempt:['#e2e6ef','#50617b'],unchecked:['#fff0c2','#8a6519']}[value];
      const label=labels(l)[states.indexOf(value)];let font=chunk.length>=4?14:17;
      ctx.font=font+'px Arial';while(font>12&&ctx.measureText(label).width>widths[col]-24){font--;ctx.font=font+'px Arial';}
      const badge=Math.min(widths[col]-12,ctx.measureText(label).width+24);
      ctx.fillStyle=palette[0];ctx.fillRect(cx-badge/2,y+7.5,badge,30);
      ctx.fillStyle=palette[1];ctx.textAlign='center';fit(ctx,label,cx,y+29,badge-12,font);
     }
     ctx.restore();
    });
    ctx.fillStyle='#173f36';fit(ctx,blank?'':l.notes?.[s.id]||'',xs.at(-2)+7,y+29,widths.at(-1)-14,17);y+=45;
   }
   ctx.fillStyle='#52675f';fit(ctx,`Öğrenci: ${students.length} · Gösterilen maddeler: ${chunk.map(i=>i.label).join(', ')}`,40,1570,1160,20);fit(ctx,'MualliMate+ ile hazırlanmıştır.',40,1698,850,18);output.push(cv);
  }
  for(let i=0;i<output.length;i++){const ctx=output[i].getContext('2d');ctx.fillStyle='#52675f';ctx.font='18px Arial';ctx.fillText(`${i+1} / ${output.length}`,1110,1698);}
  return output;
 }
 async function pdf(blank){
  const l=record();if(!l)return;
  const pages=canvases(l,blank),encode=s=>new TextEncoder().encode(s),objects={},kids=[];
  objects[1]=encode('<< /Type /Catalog /Pages 2 0 R >>');
  for(let i=0;i<pages.length;i++){
   const cv=pages[i],raw=atob(cv.toDataURL('image/jpeg',.94).split(',')[1]),image=Uint8Array.from(raw,c=>c.charCodeAt(0)),im=3+i*3,content=im+1,page=im+2;
   const stream=encode('q\n595.28 0 0 841.89 0 0 cm\n/Im0 Do\nQ\n');
   objects[im]=new Blob([encode(`<< /Type /XObject /Subtype /Image /Width ${cv.width} /Height ${cv.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${image.length} >>\nstream\n`),image,encode('\nendstream')]);
   objects[content]=new Blob([encode(`<< /Length ${stream.length} >>\nstream\n`),stream,encode('endstream')]);
   objects[page]=encode(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /XObject << /Im0 ${im} 0 R >> >> /Contents ${content} 0 R >>`);kids.push(`${page} 0 R`);
  }
  objects[2]=encode(`<< /Type /Pages /Count ${pages.length} /Kids [${kids.join(' ')}] >>`);
  const parts=[encode('%PDF-1.4\n')],offsets=[0],max=2+pages.length*3;let pos=parts[0].length;
  for(let i=1;i<=max;i++){offsets[i]=pos;const blob=new Blob([encode(`${i} 0 obj\n`),objects[i],encode('\nendobj\n')]);parts.push(blob);pos+=blob.size;}
  let tail=`xref\n0 ${max+1}\n0000000000 65535 f \n`;for(let i=1;i<=max;i++)tail+=String(offsets[i]).padStart(10,'0')+' 00000 n \n';
  tail+=`trailer\n<< /Size ${max+1} /Root 1 0 R >>\nstartxref\n${pos}\n%%EOF`;parts.push(encode(tail));
  await saveOutputBlob(new Blob(parts,{type:'application/pdf'}),safe(l.title)+(blank?'_Bos':'_Kontrol')+'.pdf','application/pdf');
 }
 function installButton(){const grid=document.querySelector('#classView .class-module-grid');if(grid&&!el('taskOpen249')){const b=document.createElement('button');b.id='taskOpen249';b.className='class-module-btn';b.innerHTML='<span>☑️</span><b>Görev ve Teslim Takibi</b>';b.onclick=()=>api.open();grid.appendChild(b);}}
 const css=document.createElement('style');css.textContent=`#mmTasks249{min-width:0}#mmTasks249 *{box-sizing:border-box}#mmTasks249 input:not([type=checkbox]),#mmTasks249 select{min-width:0;width:100%;max-width:100%}#mmTasks249 input[type=date]{display:block;min-height:44px}#mmTasks249 label{display:block}#mmTasks249 .task249-actions{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}#mmTasks249 .task249-actions button{flex:1 1 140px;min-width:0}#mmTasks249 .task249-form{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}#mmTasks249 .task249-item{padding:10px;border:1px solid #d9ceaa;border-radius:14px;margin:8px 0}#mmTasks249 .task249-members{display:grid;gap:10px;max-height:300px;overflow:auto;padding:8px}#mmTasks249 .task249-list{display:block;width:100%;text-align:left;margin:10px 0;white-space:normal}#mmTasks249 .task249-list span{display:block;font-size:.85em;margin-top:6px}#mmTasks249 .task249-student{padding:14px;margin:12px 0;background:#fffdf6;border:1px solid #d8cda9;border-radius:16px}#mmTasks249 .task249-cells{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:12px 0}#mmTasks249 .task249-cells span{display:block;font-size:.9em;margin-bottom:5px;overflow-wrap:anywhere}#mmTasks249 .task249-mark{width:100%;min-width:0;min-height:44px;white-space:normal;font-size:.9em;padding:10px 6px}#mmTasks249 .task249-yes{background:#dcefe2;color:#15502d}#mmTasks249 .task249-no{background:#f9e1df;color:#842b28}#mmTasks249 .task249-exempt{background:#e5e7ed;color:#465265}#mmTasks249 .task249-unchecked{background:#f5edd7;color:#544c35}#mmTasks249 h3{overflow-wrap:anywhere}@media(max-width:420px){#mmTasks249 .task249-form,#mmTasks249 .task249-cells{grid-template-columns:minmax(0,1fr)}}`;document.head.appendChild(css);

 const fixes=document.createElement('style');fixes.textContent=`
 #classView .class-module-grid #taskOpen249{grid-column:auto!important;min-height:82px!important}
 #mmTasks249 .task249-form>label{min-width:0;max-width:100%}
 #mmTasks249 .task249-form>label:has(input[type=date]){overflow:hidden}
 #mmTasks249 input[type=date]{box-sizing:border-box!important;width:100%!important;max-width:100%!important;min-width:0!important;inline-size:100%!important;min-inline-size:0!important;max-inline-size:100%!important;-webkit-appearance:none;appearance:none;font-size:16px;padding-inline:10px}
 #mmTasks249 input[type=date]::-webkit-date-and-time-value{min-width:0;text-align:left}
 #mmTasks249 input[type=date]::-webkit-datetime-edit{min-width:0;max-width:100%;padding:0}
 #mmTasks249 .task250-options{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;width:100%;min-width:0}
 #mmTasks249 .task250-choice{margin:0;min-width:0;min-height:48px;padding:8px 4px;line-height:1.2;font-size:13px;border:2px solid #d8cda9;background:#f8f2e4;color:#4d554e;box-shadow:none}
 #mmTasks249 .task250-choice.is-active.task249-yes{background:#cfe9d8;color:#174f31;border-color:#237845}
 #mmTasks249 .task250-choice.is-active.task249-no{background:#f4d4d0;color:#812e29;border-color:#aa4940}
 #mmTasks249 .task250-choice.is-active.task249-exempt{background:#dde2eb;color:#39475f;border-color:#617089}
 `;document.head.appendChild(fixes);
 const api=window.MualliMateTasks249={open(){const c=cls();if(!c)return alert('Önce bir sınıf seçin.');modalHistory=[];cid=c.id;lid=null;filter='all';query='';showArchive=false;home();},canvases,version:251};
 installButton();document.addEventListener('DOMContentLoaded',installButton);
})();
