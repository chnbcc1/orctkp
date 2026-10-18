/* MualliMate v7.8.239 — themed guidance dossier; original forms are copied intact. */
(function(){
 'use strict';
 if(window.MualliMateGuidanceTheme239)return;
 const ROOT=new URL('./',document.currentScript.src).href, W=1240,H=1754;
 const theme=()=>window.MualliMateTeacherTheme239;
 const source=()=>{const d=window.guidanceDossierData238?.();if(!d)throw new Error('Önce bir sınıf seçin.');return JSON.parse(JSON.stringify(d))};
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const safe=s=>String(s||'Rehberlik_Dosyasi').replace(/[\\/:*?"<>|]/g,'_');
 const FORMS={
 9:{pdf:'secim_sonucu_formu.pdf',images:['election_result_1.png']},
 12:{pdf:'ogrenci_bilgi_formu.pdf',images:['student_info_1.png','student_info_2.png']},
 14:{pdf:'ogrenci_gozlem_kaydi.pdf',images:['observation_1.png','observation_2.png']},
 15:{pdf:'rehberlik_servisine_yonlendirme_formu.pdf',images:['referral_1.png','referral_2.png']},
 16:{pdf:'psikolojik_destek_yonlendirme_formu.pdf',images:['psych_1.png','psych_2.png']},
 17:{pdf:'ev_ziyaret_formu.pdf',images:['home_visit_1.png','home_visit_2.png']}
 };
 const imageCache=new Map();let pdfPromise,generation=0;
 function image(path){if(!imageCache.has(path))imageCache.set(path,new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>{imageCache.delete(path);reject(new Error('Dosya görseli yüklenemedi. Uygulamayı internet bağlantısıyla yeniden açıp deneyin.'))};im.src=new URL(path,ROOT).href}));return imageCache.get(path)}
 function pdfLibrary(){
  if(window.PDFLib)return Promise.resolve(window.PDFLib);
  if(!pdfPromise)pdfPromise=new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=new URL('assets/teacher-file/pdf-lib.min.js',ROOT).href;s.onload=()=>window.PDFLib?resolve(window.PDFLib):reject(new Error('PDF bileşeni açılamadı.'));s.onerror=()=>reject(new Error('PDF bileşeni yüklenemedi.'));document.head.appendChild(s)}).catch(e=>{pdfPromise=null;throw e});
  return pdfPromise;
 }
 function ordered(ids,data){const valid=new Set(data.items.map(x=>x.id)),result=[...new Set(ids)].sort((a,b)=>a-b);if(!result.length||result.some(id=>!valid.has(id)))throw new Error('En az bir belge seçin.');return result}
 function pagesFor(ids,includeForms,data){return ordered(ids,data).flatMap(id=>[{id,type:'section'},...(includeForms&&FORMS[id]?FORMS[id].images.map((path,i)=>({id,type:'form',path,index:i})):[])])}
 function centered(ctx,text,y,size,width=970){
  while(size>16){ctx.font=size+'px "Times New Roman",serif';if(theme().splitLines(ctx,text,width).length*size*1.2<=120)break;size--}
  const lines=theme().splitLines(ctx,text,width);ctx.fillStyle='#064e3b';ctx.textAlign='center';lines.forEach((line,i)=>ctx.fillText(line,W/2,y+i*size*1.2));return y+lines.length*size*1.2;
 }
 async function renderSection(id,data=source()){
  const item=data.items.find(x=>x.id===id);if(!item)throw new Error('Bölüm bulunamadı.');
  if(id===2)return theme().renderSharedPage(3);
  const title=id===1?'SINIF REHBERLİK DOSYASI':item.title.toLocaleUpperCase('tr-TR');
  const result=await theme().render({title,cover:false,rows:[]});let cv=result.canvases[0],x=cv.getContext('2d');
  if(id===1){
   const cover=await image('assets/teacher-file/cover.jpg');x.clearRect(0,0,W,H);x.drawImage(cover,0,0,W,H);
   const h=result.heading;x.fillStyle='#064e3b';x.textAlign='center';x.font=h.size+'px Georgia,"Times New Roman",serif';h.lines.forEach((line,i)=>x.fillText(line,W/2,h.first+i*h.line));
   centered(x,data.profile.school,958,35);centered(x,data.profile.year+' Eğitim Öğretim Yılı',1100,29);centered(x,data.className+' SINIFI',1180,35);
   centered(x,'SINIF REHBER ÖĞRETMENİ',1320,37,890);
   for(const [text,y,start]of[[data.profile.teacher,1477,32]]){let size=start;do{x.font=size+'px "Times New Roman",serif';if(x.measureText(text).width<620)break;size--}while(size>12);x.textAlign='center';x.fillText(text,W/2,y)}
  }else if(id===3){
   const anthem=data.anthem,flag=await image('assets/rehberlik_istiklal_v7881.png');
   // Keep the flag above the fixed heading; print all ten stanzas below the separator.
   x.drawImage(flag,0,0,flag.naturalWidth,Math.round(flag.naturalHeight*.29),410,435,420,164);
   const columns=[anthem.paragraphs.slice(0,5),anthem.paragraphs.slice(5)];let size=23;
   const lines=p=>p.split(/\r?\n|\\n/);
   do{x.font=size+'px "Times New Roman",serif';if(columns.flat().every(p=>lines(p).every(line=>x.measureText(line).width<=490)))break;size--}while(size>14);
   const lh=size*1.38,gap=22; x.textAlign='left';x.fillStyle='#20372d';x.font=size+'px "Times New Roman",serif';
   columns.forEach((stanzas,col)=>{let y=855;for(const stanza of stanzas){for(const line of lines(stanza)){x.fillText(line,105+col*530,y);y+=lh}y+=gap}});
   x.strokeStyle='#c9ad69';x.lineWidth=1;x.beginPath();x.moveTo(615,825);x.lineTo(615,1558);x.stroke();
   x.font='bold 24px "Times New Roman",serif';x.textAlign='right';x.fillText(anthem.author,1130,1610);
  }
  return cv;
 }
 async function renderPage(page,data){
  if(page.type==='section')return renderSection(page.id,data);
  const im=await image('templates/exact/'+page.path),cv=document.createElement('canvas');cv.width=im.naturalWidth;cv.height=im.naturalHeight;cv.getContext('2d').drawImage(im,0,0);return cv;
 }
 async function createPdf(ids,includeForms=false,data=source()){
  ids=ordered(ids,data);const lib=await pdfLibrary(),doc=await lib.PDFDocument.create();
  for(const id of ids){
   if(id===2){doc.addPage(await theme().portraitPdfPage(doc));continue}
   const cv=await renderSection(id,data),im=await doc.embedJpg(cv.toDataURL('image/jpeg',.97)),page=doc.addPage([595.28,841.89]);page.drawImage(im,{x:0,y:0,width:595.28,height:841.89});cv.width=cv.height=1;
   if(includeForms&&FORMS[id]){const response=await fetch(new URL('templates/'+FORMS[id].pdf,ROOT));if(!response.ok)throw new Error('Hazır form yüklenemedi: '+data.items.find(x=>x.id===id).title);const original=await lib.PDFDocument.load(await response.arrayBuffer());for(const p of await doc.copyPages(original,original.getPageIndices()))doc.addPage(p)}
  }
  doc.setTitle(data.className+' Sınıf Rehberlik Dosyası');doc.setAuthor(data.profile.teacher);
  return new Blob([await doc.save()],{type:'application/pdf'});
 }
 function closePreview(){generation++;document.getElementById('guidanceThemePreview238')?.remove()}
 async function preview(ids,includeForms=false,data=source()){
  const pages=pagesFor(ids,includeForms,data);closePreview();const token=generation;
  const root=document.createElement('div');root.id='guidanceThemePreview238';root.className='guidance-preview-sheet mm-teacher-theme-preview';root.style.zIndex='2147483503';
  root.innerHTML='<div class="guidance-preview-toolbar"><button class="secondary" data-guidance-back>← Geri</button><button data-guidance-pdf disabled>PDF Dışa Aktar</button><button class="secondary" data-guidance-prev disabled>‹</button><span class="mm-teacher-page-count" aria-live="polite"></span><button class="secondary" data-guidance-next disabled>›</button><span class="mm-guidance-preview-title"></span></div><div class="mm-teacher-theme-stage" aria-live="polite">Ön izleme hazırlanıyor…</div>';
  document.body.appendChild(root);root.querySelector('[data-guidance-back]').onclick=closePreview;let index=0,paintToken=0;
  async function paint(){const serial=++paintToken,entry=pages[index],stage=root.querySelector('.mm-teacher-theme-stage');stage.textContent='Ön izleme hazırlanıyor…';root.querySelector('.mm-teacher-page-count').textContent=(index+1)+' / '+pages.length;root.querySelector('.mm-guidance-preview-title').textContent=data.items.find(x=>x.id===entry.id).title+(entry.type==='form'?' · Hazır boş form':'');root.querySelector('[data-guidance-prev]').disabled=index===0;root.querySelector('[data-guidance-next]').disabled=index===pages.length-1;
   const cv=await renderPage(entry,data);if(token!==generation||serial!==paintToken||!root.isConnected){cv.width=cv.height=1;return}cv.setAttribute('aria-label',data.items.find(x=>x.id===entry.id).title);stage.replaceChildren(cv);root.querySelector('[data-guidance-pdf]').disabled=false;
  }
  const error=e=>{if(root.isConnected)root.querySelector('.mm-teacher-theme-stage').textContent=e.message};
  root.querySelector('[data-guidance-prev]').onclick=()=>{if(index>0){index--;paint().catch(error)}};root.querySelector('[data-guidance-next]').onclick=()=>{if(index<pages.length-1){index++;paint().catch(error)}};
  root.querySelector('[data-guidance-pdf]').onclick=async()=>{const b=root.querySelector('[data-guidance-pdf]');if(b.disabled)return;b.disabled=true;b.textContent='PDF hazırlanıyor…';try{const blob=await createPdf(ids,includeForms,data);await window.saveOutputBlob(blob,safe(data.className)+'_Rehberlik_Dosyasi'+(ids.length===1?'_'+safe(data.items.find(x=>x.id===ids[0]).title):'')+'.pdf','application/pdf')}catch(e){alert(e.message)}finally{b.disabled=false;b.textContent='PDF Dışa Aktar'}};
  await paint().catch(error);
 }
 function selection(){
  let data;try{data=source()}catch(e){alert(e.message);return}
  const root=theme().openCard('Rehberlik Dosyası Oluştur','<p class="mm-teacher-card-intro">Bölümleri seçin; ön izlemeden tek PDF olarak dışa aktarın.</p><div class="mm-teacher-selection-actions"><button class="secondary" data-guidance-all>Tümünü Seç</button><button class="ghost" data-guidance-none>Seçimi Temizle</button></div><label class="mm-guidance-include-forms"><input type="checkbox" data-guidance-forms checked><span>Hazır boş formları da ekle<small>Formlar ilgili bölüm kapağının arkasına, mevcut sayfa düzenleriyle eklenir.</small></span></label><div class="mm-teacher-selection-list">'+data.items.map(item=>'<label><input type="checkbox" data-guidance-id="'+item.id+'"><span>'+item.id+'. '+esc(item.title)+(FORMS[item.id]?'<small class="mm-guidance-form-note">Hazır form: '+FORMS[item.id].images.length+' sayfa</small>':'')+'</span></label>').join('')+'</div><div class="mm-teacher-selection-footer"><span data-guidance-count aria-live="polite">0 bölüm seçildi</span><button data-guidance-preview disabled>Ön İzleme</button></div>',data.className+' · '+data.profile.year);
  const checks=[...root.querySelectorAll('[data-guidance-id]')],forms=root.querySelector('[data-guidance-forms]');const chosen=()=>checks.filter(x=>x.checked).map(x=>Number(x.dataset.guidanceId));
  const update=()=>{const ids=chosen(),count=ids.length?pagesFor(ids,forms.checked,data).length:0;root.querySelector('[data-guidance-count]').textContent=ids.length+' bölüm · '+count+' sayfa';root.querySelector('[data-guidance-preview]').disabled=!ids.length};
  checks.forEach(x=>x.onchange=update);forms.onchange=update;
  root.querySelector('[data-guidance-all]').onclick=()=>{checks.forEach(x=>x.checked=true);update()};root.querySelector('[data-guidance-none]').onclick=()=>{checks.forEach(x=>x.checked=false);update()};root.querySelector('[data-guidance-preview]').onclick=()=>preview(chosen(),forms.checked,data);update();
 }
 const originalCenter=window.openGuidanceFileCenter;
 window.openGuidanceFileCenter=function(){const result=originalCenter.apply(this,arguments);if(!window.guidanceDossierData238?.()||!document.querySelector('#modalBody .guidance-list'))return result;
  const toolbar=document.querySelector('#modalBody .guidance-toolbar');if(toolbar&&!toolbar.querySelector('[data-guidance-dossier]')){const button=document.createElement('button');button.dataset.guidanceDossier='238';button.textContent='☑ Rehberlik Dosyası Oluştur';button.onclick=selection;toolbar.appendChild(button)}
  document.querySelectorAll('#modalBody .guidance-item').forEach((row,i)=>{if(i<3)return;const b=document.createElement('button');b.className='secondary';b.dataset.guidanceSection=String(i+1);b.textContent='Kapak Ön İzleme';b.onclick=()=>preview([i+1]);row.querySelector('.guidance-item-actions')?.appendChild(b)});return result;
 };
 window.guidanceOpenCover=()=>preview([1]);window.guidanceOpenAtaturk7881=()=>preview([2]);window.guidanceOpenIstiklal7881=()=>preview([3]);
 const dismiss=window.teacherFileDismiss236;
 window.teacherFileDismiss236=function(){if(document.getElementById('guidanceThemePreview238')){closePreview();return true}return dismiss?.()||false};
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.getElementById('guidanceThemePreview238')){e.preventDefault();e.stopImmediatePropagation();closePreview()}},true);
 const style=document.createElement('style');style.textContent='#modalBody .guidance-toolbar [data-guidance-dossier]{grid-column:1/-1;width:100%}.mm-guidance-preview-title{color:#fff3d1;font-size:12px;flex-basis:100%;line-height:1.3}.mm-guidance-include-forms{display:flex!important;align-items:flex-start!important;gap:10px!important;padding:12px!important;margin:14px 0!important;border:1px solid #d6c58f!important;border-radius:12px!important;background:#fff8e7!important;font-size:14px!important}.mm-guidance-include-forms input{width:22px!important;min-width:22px!important;height:22px!important;margin:0!important;accent-color:#076452}.mm-guidance-include-forms small,.mm-guidance-form-note{display:block;font-size:11px;color:#647467;margin-top:4px;line-height:1.4}';document.head.appendChild(style);
 window.MualliMateGuidanceTheme239={source,renderSection,createPdf,preview,selection,pagesFor,forms:FORMS,renderAnthem:()=>renderSection(3,{items:[{id:3,title:'İstiklal Marşı'}],anthem:window.G_STATIC7874.anthem})};
})();
