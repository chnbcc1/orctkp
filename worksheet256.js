/* Worksheet Studio 256. Existing IndexedDB drafts and image coordinates remain readable. */
(()=>{
 'use strict';
 if(window.MualliMateWorksheet256||typeof window.openWorksheetStudio887!=='function')return;
 const W=794,H=1123,M=32,G=20,uid=()=>window.crypto?.randomUUID?.()||('ws-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2)),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const original={open:window.openWorksheetStudio887,close:window.closeWorksheetStudio887};
 let selected=null,session=0,crop=null,busy=false,observer=null,fitFrame=0;
 function fitLater(){if(!fitFrame)fitFrame=requestAnimationFrame(()=>{fitFrame=0;if(document.getElementById("worksheetStudio887"))window.fitWorksheet887();if(crop?.fit)crop.fit();});}
 addEventListener("resize",fitLater,{passive:true});addEventListener("orientationchange",fitLater,{passive:true});window.visualViewport?.addEventListener("resize",fitLater,{passive:true});
 const ws=()=>window._worksheet887,page=()=>ws().pages[ws().current],all=()=>ws().pages.flatMap(p=>p.items),item=()=>all().find(i=>i.id===selected);
 function normalize(){const w=ws();w.layout253=w.layout253===2?2:1;if(w.theme254===undefined)w.theme254=!all().length;w.solution253=w.solution253||'blank';w.space253=Number(w.space253)||100;if(w.number253===undefined)w.number253=!all().length;for(const i of all()){i.space253=Math.max(0,Number(i.space253)||0);i.solution253=i.solution253||'blank';}return w;}
 const numberHeight=()=>ws().number253?24:0;
 function top(){return ws().theme254?186:(ws().title?82:32);}
 function notice(s){const e=document.getElementById('ws253notice');if(e)e.textContent=s;}
 function layout(){
  const w=normalize(),list=all(),columns=w.layout253,colW=(W-2*M-G*(columns-1))/columns,newPages=[];let p={id:uid(),items:[]},col=0,y=top();
  for(const i of list){
   const space=Math.min(240,Math.max(0,i.space253||0)),ratio=Number(i.ratio)>0?Number(i.ratio):i.w/i.h||1;
   let width=colW,height=width/ratio,maxImage=H-M-top()-numberHeight()-space;
   if(height>maxImage){height=maxImage;width=height*ratio;}
   const block=numberHeight()+height+space;
   if(y+block>H-M&&p.items.length){col++;y=top();if(col>=columns){newPages.push(p);p={id:uid(),items:[]};col=0;}}
   i.w=width;i.h=height;i.ratio=ratio;i.space253=space;i.x=M+col*(colW+G)+(colW-width)/2;i.y=y+numberHeight();p.items.push(i);y+=block+G;
  }
  newPages.push(p);w.pages=newPages;const selectedPage=newPages.findIndex(p=>p.items.some(i=>i.id===selected));w.current=selectedPage>=0?selectedPage:Math.min(w.current,newPages.length-1);render();notice(`${list.length} soru · ${newPages.length} sayfa. Yerleşim tüm sayfalara uygulandı.`);
 }
 function answerHTML(i){if(!i.space253)return '';return `<div class="ws253-answer ${esc(i.solution253)}" style="height:${i.space253}px" aria-hidden="true"></div>`;}
 function render(){
  const w=normalize(),host=document.getElementById('wsPage887');if(!host)return;let n=0;const numbers=new Map(all().map(i=>[i.id,++n]));
  host.innerHTML=paperHTML(w)+page().items.map(i=>`<div class="ws-item887${i.id===selected?' selected':''}" data-id="${esc(i.id)}" style="left:${i.x}px;top:${i.y}px;width:${i.w}px;height:${i.h}px" onpointerdown="worksheetDragStart887(event,'${esc(i.id)}')">${w.number253?`<span class="ws253-number">${numbers.get(i.id)}.</span>`:''}<img alt="Soru ${numbers.get(i.id)}" src="${esc(i.data)}">${answerHTML(i)}<button class="ws-delete887" aria-label="Soruyu sil" onpointerdown="event.stopPropagation()" onclick="event.stopPropagation();worksheetDeleteItem887('${esc(i.id)}')">×</button><span class="ws-resize887" onpointerdown="worksheetResizeStart887(event,'${esc(i.id)}')"></span></div>`).join('');
  const label=document.getElementById('wsPageLabel887');if(label)label.textContent=`${w.current+1} / ${w.pages.length} · ${all().length} soru`;
  const del=document.querySelector('#worksheetStudio887 .ws-bottom887 .danger');if(del)del.textContent=w.pages.length===1?'Sayfayı Temizle':'Sayfayı Sil';
  syncSelection();
  const fit=window.fitWorksheet887;if(typeof fit==='function')requestAnimationFrame(fit);
 }
 function controls(){
  const w=ws(),bar=document.createElement('div');bar.id='ws253controls';bar.className='ws-toolbar887';
  bar.innerHTML=`<label>Yerleşim<select id="ws253layout"><option value="1">Tek sütun</option><option value="2">İki sütun</option></select></label><label>Çözüm alanı<select id="ws253solution"><option value="none">Yok</option><option value="blank">Boş</option><option value="lined">Çizgili</option><option value="grid">Kareli</option></select></label><label>Alan yüksekliği<select id="ws253space"><option value="60">Kısa</option><option value="100">Orta</option><option value="180">Geniş</option></select></label><label class="ws253-check"><input id="ws254theme" type="checkbox" ${w.theme254?'checked':''}> Temalı başlık</label><label class="ws253-check"><input id="ws253number" type="checkbox" ${w.number253?'checked':''}> Soru numarası</label><button type="button" class="secondary" id="ws253apply">Seçili soruya uygula</button><button type="button" class="secondary" id="ws253applyall">Tüm sorulara uygula</button><span id="ws253notice" role="status">Görsel eklerken aynı fotoğraftan birden çok soru kırpabilirsiniz.</span>`;
  document.querySelector('#worksheetStudio887 .ws-stage887').before(bar);
  document.getElementById('ws253layout').value=String(w.layout253);document.getElementById('ws253solution').value=w.solution253;document.getElementById('ws253space').value=String(w.space253);
  document.getElementById('ws253layout').onchange=e=>{w.layout253=Number(e.target.value);layout()};
  document.getElementById('ws254theme').onchange=e=>{w.theme254=e.target.checked;layout();};
  document.getElementById('ws253number').onchange=e=>{w.number253=e.target.checked;layout()};
  for(const id of ['ws253solution','ws253space'])document.getElementById(id).onchange=()=>{w.solution253=document.getElementById('ws253solution').value;w.space253=Number(document.getElementById('ws253space').value);notice('Yeni sorular bu ayarla eklenir. Mevcut sorular için uygula düğmelerini kullanın.');};
  const apply=targets=>{for(const i of targets){i.space253=w.solution253==='none'?0:w.space253;i.solution253=w.solution253;}layout();};
  document.getElementById('ws253apply').dataset.ws253Selected='';document.getElementById('ws253apply').onclick=()=>{if(item())apply([item()]);};document.getElementById('ws253applyall').onclick=()=>apply(all());
 }
 window.openWorksheetStudio887=function(project=null){
  session++;selected=null;closeCrop();observer?.disconnect();original.open(project);normalize();
  const root=document.getElementById('worksheetStudio887'),bar=root.querySelector('.ws-toolbar887');
  bar.classList.add('ws255-header');
  bar.innerHTML=`<button class="secondary" onclick="closeWorksheetStudio887()">← Geri</button><strong>Yaprak Oluşturucu</strong><button onclick="exportWorksheetPdf887()">PDF</button>`;
  controls();const title=document.getElementById('wsTitleInput887');if(title){title.maxLength=120;title.placeholder='Test konusu / başlık';title.onchange=()=>layout();}
  compactMenus(root,bar,title);
  document.getElementById('ws253crop').onclick=()=>{const i=item();if(i)openCrop(i.data,{editId:i.id});};
  document.getElementById('ws253up').onclick=()=>reorder(-1);document.getElementById('ws253down').onclick=()=>reorder(1);
  if(window.ResizeObserver){observer=new ResizeObserver(fitLater);observer.observe(document.getElementById("wsStage887"));}render();
 };
 window.closeWorksheetStudio887=function(){session++;closeCrop();observer?.disconnect();return original.close();};
 window.renderWorksheet887=render;
 for(const name of ['worksheetAddPage887','worksheetDeletePage887','worksheetPrevPage887','worksheetNextPage887']){const previous=window[name];window[name]=function(){selected=null;return previous.apply(this,arguments);};}
 window.worksheetAutoLayout887=function(mode){if(mode)ws().layout253=mode==='grid'?2:1;layout();};
 function reorder(delta){const list=all(),at=list.findIndex(i=>i.id===selected),to=at+delta;if(at<0||to<0||to>=list.length)return;[list[at],list[to]]=[list[to],list[at]];ws().pages=[{id:uid(),items:list}];ws().current=0;layout();ws().current=ws().pages.findIndex(p=>p.items.some(i=>i.id===selected));render();}
 window.worksheetDeleteItem887=function(id){const p=page();p.items=p.items.filter(i=>i.id!==id);if(selected===id)selected=null;render();};
 function select(id){selected=id;document.querySelectorAll('.ws-item887').forEach(e=>e.classList.toggle('selected',e.dataset.id===id));syncSelection();}
 function syncSelection(){
  const list=all(),index=list.findIndex(i=>i.id===selected),active=index>=0;
  document.querySelectorAll('[data-ws253-selected]').forEach(b=>b.disabled=!active);
  const toolbar=document.getElementById('ws255selection');if(toolbar)toolbar.hidden=!active;
  const label=document.getElementById('ws255selectedlabel');if(label)label.textContent=active?`${index+1}. soru`:'';
  const prev=document.getElementById('ws253up'),next=document.getElementById('ws253down');if(prev)prev.disabled=index<=0;if(next)next.disabled=!active||index===list.length-1;
  fitLater();
 }
 function compactMenus(root,bar,title){
  const row=document.createElement('div');row.className='ws-toolbar887 ws255-actions';
  row.innerHTML=`<button class="secondary" id="ws255add" aria-haspopup="dialog">+ Ekle</button><button class="secondary" id="ws255layout" aria-haspopup="dialog">Sayfa Düzeni</button><button class="secondary" id="ws255drafts" aria-haspopup="dialog">Taslaklar</button>`;bar.after(row);
  const overlay=document.createElement('div');overlay.id='ws255panel';overlay.hidden=true;
  overlay.innerHTML=`<section role="dialog" aria-modal="true" aria-labelledby="ws255paneltitle" tabindex="-1"><div class="ws255-panelhead"><h2 id="ws255paneltitle"></h2><button class="secondary" id="ws255closepanel">Kapat</button></div><div data-ws255-panel="add" hidden class="ws255-stack"><label class="btn secondary" tabindex="0">Kamera<input type="file" accept="image/*" capture="environment" hidden onchange="worksheetAddImages887(event)"></label><label class="btn secondary" tabindex="0">Fotoğraf / Görsel Seç<input type="file" accept="image/*" multiple hidden onchange="worksheetAddImages887(event)"></label><label class="btn secondary" tabindex="0">PDF Seç<input type="file" accept="application/pdf,.pdf" multiple hidden onchange="worksheetAddImages887(event)"></label></div><div data-ws255-panel="layout" hidden></div><div data-ws255-panel="drafts" hidden class="ws255-stack"><button id="ws255save">Taslağı Kaydet</button><button class="secondary" id="ws255saved">Kayıtlı Taslakları Aç</button></div><div data-ws255-panel="page" hidden><button class="danger" onclick="worksheetDeletePage887()">Sayfayı Temizle</button></div></section>`;
  root.appendChild(overlay);
  const settings=overlay.querySelector('[data-ws255-panel="layout"]'),titleRow=title.parentElement;
  const label=document.createElement('label');label.className='ws255-titlelabel';label.textContent='Test konusu / başlık';label.appendChild(title);settings.appendChild(label);titleRow.remove();
  const controls=document.getElementById('ws253controls');settings.appendChild(controls);
  const auto=document.createElement('button');auto.className='secondary';auto.textContent='Otomatik Yerleştir';auto.onclick=()=>layout();settings.appendChild(auto);
  const hint=document.createElement('p');hint.className='ws255-hint';hint.textContent='Çözüm alanı ayarları yeni sorular için geçerlidir. Mevcut soruları değiştirmek için uygula düğmelerini kullanın.';settings.appendChild(hint);
  let returnFocus=null;
  function close(){overlay.hidden=true;[...root.children].filter(e=>e!==overlay).forEach(e=>e.inert=false);root.querySelectorAll('[data-ws255-opener]').forEach(b=>b.setAttribute('aria-expanded','false'));if(returnFocus?.isConnected)returnFocus.focus({preventScroll:true});fitLater();}
  function show(name,button){returnFocus=button;overlay.querySelectorAll('[data-ws255-panel]').forEach(p=>p.hidden=p.dataset.ws255Panel!==name);document.getElementById('ws255paneltitle').textContent={add:'Soru Ekle',layout:'Sayfa Düzeni',drafts:'Taslaklar',page:'Sayfa İşlemleri'}[name];if(name==='page')overlay.querySelector('.danger').textContent=ws().pages.length===1?'Sayfayı Temizle':'Sayfayı Sil';overlay.hidden=false;[...root.children].filter(e=>e!==overlay).forEach(e=>e.inert=true);root.querySelectorAll('[data-ws255-opener]').forEach(b=>b.setAttribute('aria-expanded',String(b===button)));document.getElementById('ws255closepanel').focus({preventScroll:true});}
  for(const [id,name]of [['ws255add','add'],['ws255layout','layout'],['ws255drafts','drafts']]){const b=document.getElementById(id);b.dataset.ws255Opener='';b.setAttribute('aria-expanded','false');b.onclick=()=>show(name,b);}
  document.getElementById('ws255closepanel').onclick=close;overlay.onclick=e=>{if(e.target===overlay)close();};
  overlay.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();close();}else if(e.key==='Tab'){const focusable=[...overlay.querySelectorAll('button,input,select,[tabindex="0"]')].filter(e=>!e.disabled&&e.getClientRects().length),first=focusable[0],last=focusable.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}else if((e.key==='Enter'||e.key===' ')&&e.target.matches('label.btn')){e.preventDefault();e.target.querySelector('input').click();}});
  overlay.addEventListener('change',e=>{if(e.target.type==='file')close();});
  document.getElementById('ws255save').onclick=async()=>{await saveWorksheetDraft887();if(root.isConnected)close();};document.getElementById('ws255saved').onclick=()=>{close();openWorksheetDrafts887();};
  overlay.querySelector('[data-ws255-panel="page"] button').addEventListener('click',close);
  const context=document.createElement('div');context.id='ws255selection';context.hidden=true;context.className='ws-toolbar887';
  context.innerHTML=`<span id="ws255selectedlabel"></span><button class="secondary" data-ws253-selected id="ws253crop">Kırp</button><button class="secondary" data-ws253-selected id="ws253up">← Önceye</button><button class="secondary" data-ws253-selected id="ws253down">Sonraya →</button><button class="secondary" id="ws255deselect" aria-label="Soru seçimini kaldır">×</button>`;
  const bottom=root.querySelector('.ws-bottom887');bottom.before(context);
  document.getElementById('ws255deselect').onclick=()=>select(null);
  const oldDanger=bottom.querySelector('.danger');oldDanger.remove();const more=document.createElement('button');more.id='ws255more';more.className='secondary';more.textContent='⋯';more.setAttribute('aria-label','Sayfa işlemleri');more.setAttribute('aria-haspopup','dialog');more.dataset.ws255Opener='';more.setAttribute('aria-expanded','false');more.onclick=()=>show('page',more);bottom.appendChild(more);
  bottom.querySelector('[onclick="worksheetAddPage887()"]').textContent='+ Sayfa';const nav=bottom.querySelectorAll('button');nav[0].setAttribute('aria-label','Önceki sayfa');nav[1].setAttribute('aria-label','Sonraki sayfa');
  document.getElementById('wsStage887').addEventListener('pointerdown',e=>{if(!e.target.closest('.ws-item887'))select(null);});
 }
 function gesture(ev,id,resizing){
  if(!resizing&&ev.target.closest('.ws-delete887,.ws-resize887'))return;ev.preventDefault();ev.stopPropagation();select(id);const i=item();if(!i)return;
  const scale=window._wsScale887||1,sx=ev.clientX,sy=ev.clientY,ox=i.x,oy=i.y,ow=i.w,ratio=i.ratio||i.w/i.h;
  const move=e=>{if(resizing){let width=Math.max(50,Math.min(W-M-i.x,ow+(e.clientX-sx)/scale)),height=width/ratio,max=H-M-i.y-(i.space253||0);if(height>max){height=max;width=height*ratio;}if(width>0&&height>0){i.w=width;i.h=height;}}else{i.x=Math.max(M,Math.min(W-M-i.w,ox+(e.clientX-sx)/scale));i.y=Math.max(top()+numberHeight(),Math.min(H-M-i.h-(i.space253||0),oy+(e.clientY-sy)/scale));}const n=document.querySelector(`.ws-item887[data-id="${id}"]`);if(n){Object.assign(n.style,{left:i.x+'px',top:i.y+'px',width:i.w+'px',height:i.h+'px'});}};
  const up=()=>{removeEventListener('pointermove',move);removeEventListener('pointerup',up);removeEventListener('pointercancel',up);};
  addEventListener('pointermove',move);addEventListener('pointerup',up,{once:true});addEventListener('pointercancel',up,{once:true});
 }
 window.worksheetDragStart887=(e,id)=>gesture(e,id,false);window.worksheetResizeStart887=(e,id)=>gesture(e,id,true);
 async function loadImage(src){return new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(Error('Görsel açılamadı.'));im.src=src;});}
 async function readFile(file){if(!file.type.startsWith('image/'))throw Error('Lütfen bir fotoğraf veya görsel seçin.');return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=()=>reject(Error('Görsel okunamadı.'));r.readAsDataURL(file);});}

 const assetRoot=new URL('./',document.currentScript.src),pendingLibraries=new Map();let pdfState=null,importId=0;
 async function ensureLibrary254(name,path,ready){
  if(ready())return;if(pendingLibraries.has(name))return pendingLibraries.get(name);
  const promise=new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=new URL(path,assetRoot).href;s.onload=()=>ready()?resolve():reject(Error('PDF bileşeni başlatılamadı.'));s.onerror=()=>{s.remove();reject(Error('Yerel PDF bileşeni yüklenemedi. Güncellemeyi kontrol edin.'));};document.head.appendChild(s);});
  pendingLibraries.set(name,promise);try{await promise;}catch(e){pendingLibraries.delete(name);throw e;}
 }
 function fitText(x,text,max,font=18){x.font=font+'px Arial';while(font>12&&x.measureText(text).width>max)x.font=(--font)+'px Arial';let t=text;while(t&&x.measureText(t+'…').width>max)t=t.slice(0,-1);return {text:t===text?t:t+'…',font};}
 const logoUrl=new URL('icons/icon-512.png',assetRoot).href;
 function paperHTML(w){
  const topic=fitText(document.createElement('canvas').getContext('2d'),w.title||'Çalışma Yaprağı',632,17);
  const line=w.layout253===2?`<line x1="397" y1="${w.theme254?180:top()}" x2="397" y2="1091" stroke="#bfae83" stroke-width="1"/>`:'';
  if(!w.theme254)return (w.title?`<div class="ws-title887">${esc(w.title)}</div>`:'')+`<svg class="ws254-paper" viewBox="0 0 794 1123">${line}</svg>`;
  return `<svg class="ws254-paper" viewBox="0 0 794 1123" xmlns="http://www.w3.org/2000/svg"><rect x="32" y="28" width="730" height="76" rx="10" fill="#07594c"/><path d="M42 104H752" stroke="#cfad57" stroke-width="3"/><image href="${logoUrl}" x="46" y="40" width="52" height="52"/><text x="112" y="61" fill="#fff7e2" font-family="Georgia,serif" font-size="26" font-weight="bold">MualliMate+</text><text x="112" y="88" fill="#f0d597" font-family="Arial" font-size="${topic.font}">${esc(topic.text)}</text><rect x="32" y="114" width="730" height="48" rx="7" fill="#fbf6e9" stroke="#d2c3a0"/><g font-family="Arial" font-size="13" fill="#214c40"><text x="46" y="143">Adı Soyadı:</text><text x="472" y="143">Sınıfı:</text><text x="636" y="143">No:</text></g><g stroke="#87958b" stroke-width=".8"><path d="M116 146H450M512 146H615M662 146H748"/></g>${line}</svg>`;
 }
 async function drawPaper(x,w){
  if(!w.theme254){if(w.title){x.fillStyle='#173d33';x.textAlign='center';const t=fitText(x,w.title,W-2*M,25);x.fillText(t.text,W/2,45);x.textAlign='left';}}
  else{
   x.fillStyle='#07594c';x.beginPath();x.roundRect?x.roundRect(M,28,W-2*M,76,10):x.rect(M,28,W-2*M,76);x.fill();x.strokeStyle='#cfad57';x.lineWidth=3;x.beginPath();x.moveTo(42,104);x.lineTo(752,104);x.stroke();
   const logo=await loadImage(logoUrl);x.drawImage(logo,46,40,52,52);x.fillStyle='#fff7e2';x.font='bold 26px Georgia';x.fillText('MualliMate+',112,61);x.fillStyle='#f0d597';const topic=fitText(x,w.title||'Çalışma Yaprağı',632,17);x.fillText(topic.text,112,88);
   x.fillStyle='#fbf6e9';x.fillRect(M,114,W-2*M,48);x.strokeStyle='#d2c3a0';x.lineWidth=.8;x.strokeRect(M,114,W-2*M,48);x.fillStyle='#214c40';x.font='13px Arial';x.fillText('Adı Soyadı:',46,143);x.fillText('Sınıfı:',472,143);x.fillText('No:',636,143);x.strokeStyle='#87958b';for(const[a,b]of[[116,450],[512,615],[662,748]]){x.beginPath();x.moveTo(a,146);x.lineTo(b,146);x.stroke();}
  }
  if(w.layout253===2){x.strokeStyle='#bfae83';x.lineWidth=1;x.beginPath();x.moveTo(W/2,w.theme254?180:(w.title?82:32));x.lineTo(W/2,H-M);x.stroke();}
 }
 function closeCrop(keepPdf=false){
  document.getElementById('ws253cropper')?.remove();crop=null;busy=false;
  if(!keepPdf&&pdfState){pdfState.closed=true;pdfState.doc.destroy().catch(()=>{});pdfState=null;}
 }
 async function openCrop(src,options={}){
  closeCrop(!!options.pdf);const stamp=session,im=await loadImage(src);if(stamp!==session||!document.getElementById('worksheetStudio887'))return;
  const overlay=document.createElement('div');overlay.id='ws253cropper';overlay.dataset.pdfPage=String(options.pdf?.page||'');overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','Soruyu kırp');
  overlay.innerHTML=`<section><header><b>${options.editId?'Soruyu Kırp':options.pdf?'PDF’den Soru Ekle':'Görselden Soru Ekle'}</b><button class="secondary" id="ws253cancel">Kapat</button></header><div class="ws254-view-tools"><div class="ws256-zoomgroup"><button class="secondary" id="ws254minus" aria-label="Uzaklaştır">−</button><span id="ws254zoom">100%</span><button class="secondary" id="ws254plus" aria-label="Yakınlaştır">+</button></div><button class="secondary" id="ws254fit">Sığdır</button><button class="secondary" id="ws254select" aria-pressed="false">Seç</button></div>${options.pdf?`<div class="ws254-pages"><button class="secondary" id="ws254prev" aria-label="Önceki PDF sayfası">‹</button><label><span>Sayfa</span><input id="ws254page" aria-label="PDF sayfa numarası" type="number" min="1" max="${options.pdf.doc.numPages}" value="${options.pdf.page}"><span>/ ${options.pdf.doc.numPages}</span></label><button class="secondary" id="ws254next" aria-label="Sonraki PDF sayfası">›</button></div>`:''}<p id="ws254hint" role="status">Kaydırın veya iki parmakla yakınlaştırın.</p><div class="ws253-crop-stage" id="ws254viewport"><div id="ws253surface"><img alt="Kırpılacak görsel" draggable="false"><div id="ws253selection" hidden></div></div></div><div class="ws253-crop-actions"><button id="ws253accept" disabled>${options.editId?'Kırpmayı Uygula':'Seçimi Ekle'}</button><button class="secondary" id="ws253next">${options.next?'Sonraki Dosya':'Bitir'}</button></div><small id="ws253cropinfo" role="status">Soruyu hazırlayın, Seç’e basıp çerçevesini çizin.</small></section>`;
  document.body.appendChild(overlay);const image=overlay.querySelector('img');image.src=src;crop={im,src,options,rect:null,stamp,zoom:1,mode:'pan'};const c=crop,viewport=document.getElementById('ws254viewport'),surface=document.getElementById('ws253surface'),pointers=new Map();let start=null,pinch=null;
  const valid=()=>!!c.rect&&c.rect.w*im.naturalWidth>=12&&c.rect.h*im.naturalHeight>=12;
  function paint(){if(crop!==c)return;const r=c.rect,selection=document.getElementById('ws253selection');selection.hidden=!r;if(r)Object.assign(selection.style,{left:r.x*100+'%',top:r.y*100+'%',width:r.w*100+'%',height:r.h*100+'%'});document.getElementById('ws253accept').disabled=busy||!valid();}
  function size(){const base=Math.min((viewport.clientWidth-12)/im.naturalWidth,(viewport.clientHeight-12)/im.naturalHeight,1);Object.assign(surface.style,{width:Math.max(1,im.naturalWidth*base*c.zoom)+'px',height:Math.max(1,im.naturalHeight*base*c.zoom)+'px'});document.getElementById('ws254zoom').textContent=Math.round(c.zoom*100)+'%';document.getElementById('ws254minus').disabled=c.zoom<=1;document.getElementById('ws254plus').disabled=c.zoom>=6;}
  function fit(){if(crop!==c)return;const old=surface.getBoundingClientRect(),vr=viewport.getBoundingClientRect(),cx=old.width?(vr.left+viewport.clientWidth/2-old.left)/old.width:.5,cy=old.height?(vr.top+viewport.clientHeight/2-old.top)/old.height:.5;size();viewport.scrollLeft=Math.max(0,cx*surface.offsetWidth-viewport.clientWidth/2);viewport.scrollTop=Math.max(0,cy*surface.offsetHeight-viewport.clientHeight/2);paint();}
  c.fit=fit;requestAnimationFrame(fit);
  function mode(value){c.mode=value;start=null;pinch=null;document.getElementById('ws254select').setAttribute('aria-pressed',String(value==='select'));viewport.style.cursor=value==='pan'?'grab':'crosshair';document.getElementById('ws254hint').textContent=value==='select'?'Seçim açık · Sorunun çevresini çizin.':'Kaydırın veya iki parmakla yakınlaştırın.';}
  document.getElementById('ws254select').onclick=()=>mode(c.mode==='select'?'pan':'select');
  function point(e){const r=image.getBoundingClientRect();return{x:Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),y:Math.max(0,Math.min(1,(e.clientY-r.top)/r.height))};}
  function zoomAt(zoom,clientX,clientY,anchor){if(crop!==c)return;const a=anchor||point({clientX,clientY});c.zoom=Math.max(1,Math.min(6,zoom));size();const r=surface.getBoundingClientRect();viewport.scrollLeft+=r.left+a.x*r.width-clientX;viewport.scrollTop+=r.top+a.y*r.height-clientY;paint();}
  function centerZoom(delta){const r=viewport.getBoundingClientRect();zoomAt(c.zoom+delta,r.left+viewport.clientWidth/2,r.top+viewport.clientHeight/2);}
  document.getElementById('ws254plus').onclick=()=>centerZoom(.5);document.getElementById('ws254minus').onclick=()=>centerZoom(-.5);document.getElementById('ws254fit').onclick=()=>{c.zoom=1;size();viewport.scrollLeft=0;viewport.scrollTop=0;paint();};
  const pair=()=>{const [a,b]=[...pointers.values()];return{distance:Math.hypot(a.x-b.x,a.y-b.y),x:(a.x+b.x)/2,y:(a.y+b.y)/2};};
  function beginPinch(){const p=pair();pinch={distance:Math.max(1,p.distance),zoom:c.zoom,anchor:point({clientX:p.x,clientY:p.y})};start=null;}
  viewport.onpointerdown=e=>{if(busy||e.button>0)return;e.preventDefault();viewport.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(c.mode==='select'){if(pointers.size===1){start={...point(e),id:e.pointerId};c.rect=null;paint();}return;}if(pointers.size===2){beginPinch();return;}if(pointers.size===1)start={id:e.pointerId,x:e.clientX,y:e.clientY,left:viewport.scrollLeft,top:viewport.scrollTop};};
  viewport.onpointermove=e=>{if(crop!==c||!pointers.has(e.pointerId)||busy)return;e.preventDefault();pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(c.mode==='select'){if(!start||e.pointerId!==start.id)return;const p=point(e);c.rect={x:Math.min(start.x,p.x),y:Math.min(start.y,p.y),w:Math.abs(p.x-start.x),h:Math.abs(p.y-start.y)};paint();return;}if(pointers.size>=2){if(!pinch)beginPinch();const p=pair();zoomAt(pinch.zoom*p.distance/pinch.distance,p.x,p.y,pinch.anchor);return;}if(start&&start.id===e.pointerId){viewport.scrollLeft=start.left+start.x-e.clientX;viewport.scrollTop=start.top+start.y-e.clientY;}};
  function end(e){pointers.delete(e.pointerId);if(start?.id===e.pointerId)start=null;pinch=null;if(c.mode==='pan'&&pointers.size===1){const [id,p]=pointers.entries().next().value;start={id,x:p.x,y:p.y,left:viewport.scrollLeft,top:viewport.scrollTop};}paint();}
  viewport.onpointerup=viewport.onpointercancel=viewport.onlostpointercapture=end;
  viewport.addEventListener('wheel',e=>{if(c.mode==='select'){e.preventDefault();return;}if(e.ctrlKey||e.metaKey){e.preventDefault();zoomAt(c.zoom*Math.exp(-e.deltaY*.008),e.clientX,e.clientY);}},{passive:false});
  viewport.addEventListener('touchmove',e=>e.preventDefault(),{passive:false});
  document.getElementById('ws253cancel').onclick=()=>closeCrop();
  document.getElementById('ws253next').onclick=()=>{const next=c.options.next;closeCrop();if(next)next();};document.getElementById('ws253accept').onclick=acceptCrop;
  c.resetSelection=()=>{c.rect=null;mode('pan');paint();};
  mode('pan');paint();
  if(options.pdf){const state=options.pdf,go=async n=>{if(busy||n<1||n>state.doc.numPages)return;busy=true;document.getElementById('ws253cropinfo').textContent='PDF sayfası hazırlanıyor…';for(const id of ['ws254prev','ws254next','ws254page','ws253accept'])document.getElementById(id).disabled=true;try{await showPdfPage(state,n);}catch(e){if(!state.closed&&stamp===session)alert('PDF sayfası açılamadı: '+e.message);}finally{busy=false;if(crop===c){document.getElementById('ws254prev').disabled=state.page===1;document.getElementById('ws254next').disabled=state.page===state.doc.numPages;document.getElementById('ws254page').disabled=false;document.getElementById('ws254page').value=state.page;paint();}}};document.getElementById('ws254prev').disabled=state.page===1;document.getElementById('ws254next').disabled=state.page===state.doc.numPages;document.getElementById('ws254prev').onclick=()=>go(state.page-1);document.getElementById('ws254next').onclick=()=>go(state.page+1);document.getElementById('ws254page').onchange=e=>{const n=Number(e.target.value);if(Number.isInteger(n)&&n>=1&&n<=state.doc.numPages)go(n);else e.target.value=state.page;};}
 }
 function boundedCanvas(width,height){const scale=Math.min(1,Math.sqrt(12000000/(width*height)),8192/width,8192/height),cv=document.createElement('canvas');cv.width=Math.max(1,Math.round(width*scale));cv.height=Math.max(1,Math.round(height*scale));return cv;}
 async function cropPixels(c){
  const r=c.rect;
  if(c.options.pdf){const state=c.options.pdf,p=await state.doc.getPage(state.page),base=p.getViewport({scale:1}),target=(ws().layout253===2?346:730)*300/96,scale=Math.max(300/72,Math.min(10,target/(base.width*r.w)));let viewport=p.getViewport({scale});const cv=boundedCanvas(viewport.width*r.w,viewport.height*r.h),actualScale=scale*cv.width/(viewport.width*r.w);viewport=p.getViewport({scale:actualScale});await p.render({canvasContext:cv.getContext('2d'),viewport,transform:[1,0,0,1,-viewport.width*r.x,-viewport.height*r.y],background:'rgb(255,255,255)'}).promise;p.cleanup();return cv;}
  const sw=Math.round(r.w*c.im.naturalWidth),sh=Math.round(r.h*c.im.naturalHeight),cv=boundedCanvas(sw,sh),x=cv.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,cv.width,cv.height);x.drawImage(c.im,Math.round(r.x*c.im.naturalWidth),Math.round(r.y*c.im.naturalHeight),sw,sh,0,0,cv.width,cv.height);return cv;
 }
 async function acceptCrop(){
  if(!crop||busy)return;const c=crop,r=c.rect;if(!r){document.getElementById('ws253cropinfo').textContent='Seç’e basıp sorunun çevresini çizin.';return;}if(r.w*c.im.naturalWidth<12||r.h*c.im.naturalHeight<12){document.getElementById('ws253cropinfo').textContent='Seçili alan çok küçük. Sorunun çevresini yeniden seçin.';return;}busy=true;document.getElementById('ws253accept').disabled=true;
  try{const cv=await cropPixels(c);if(c.stamp!==session||crop!==c)return;const data=cv.toDataURL('image/png'),width=cv.width,height=cv.height;cv.width=1;cv.height=1;
   if(c.options.editId){const i=all().find(i=>i.id===c.options.editId);if(!i)return;i.data=data;i.ratio=width/height;i.pixels254={width,height};layout();closeCrop();}
   else{const w=ws(),i={id:uid(),data,ratio:width/height,x:M,y:top(),w:width,h:height,pixels254:{width,height},space253:w.solution253==='none'?0:w.space253,solution253:w.solution253};page().items.push(i);selected=i.id;layout();c.resetSelection();const low=width<Math.min(i.w*2,900);document.getElementById('ws253cropinfo').textContent=`Eklendi. Toplam ${all().length} soru.${low?' Kaynak kesitin çözünürlüğü düşük; daha net fotoğraf veya özgün PDF kullanın.':' Yeni bir bölge seçerek devam edebilirsiniz.'}`;}
  }catch(e){if(c.stamp===session&&crop===c)alert('Soru eklenemedi: '+e.message);}finally{busy=false;const button=document.getElementById('ws253accept');if(button)button.disabled=!crop?.rect;}
 }
 async function showPdfPage(state,n){
  const request=++state.request,p=await state.doc.getPage(n),base=p.getViewport({scale:1}),viewport=p.getViewport({scale:Math.min(2,1700/Math.max(base.width,base.height))}),cv=document.createElement('canvas');cv.width=Math.ceil(viewport.width);cv.height=Math.ceil(viewport.height);await p.render({canvasContext:cv.getContext('2d'),viewport,background:'rgb(255,255,255)'}).promise;
  if(state.closed||state.stamp!==session||state.job!==importId||request!==state.request){cv.width=1;cv.height=1;return;}state.page=n;const src=cv.toDataURL('image/png');cv.width=1;cv.height=1;p.cleanup();await openCrop(src,{pdf:state,next:state.next});
 }
 window.worksheetAddImages887=async function(ev){
  const files=[...(ev.target.files||[])],stamp=session,job=++importId;ev.target.value='';let pos=0;if(!files.length)return;
  const next=async()=>{if(stamp!==session||job!==importId||pos>=files.length)return;const f=files[pos++];try{
   if(f.type==='application/pdf'||/\.pdf$/i.test(f.name)){
    notice('PDF cihazınızda açılıyor…');await ensureLibrary254('pdfjs','./pdf-engine246/pdf.min.js',()=>!!window.pdfjsLib);pdfjsLib.GlobalWorkerOptions.workerSrc=new URL('./pdf-engine246/pdf.worker.min.js',assetRoot).href;
    const task=pdfjsLib.getDocument({data:new Uint8Array(await f.arrayBuffer()),isEvalSupported:false}),doc=await task.promise;if(stamp!==session||job!==importId){await doc.destroy();return;}
    const state={doc,page:1,stamp,job,closed:false,request:0,next:pos<files.length?next:null};pdfState=state;await showPdfPage(state,1);notice(`${doc.numPages} sayfalık PDF açıldı.`);
   }else{const src=await readFile(f);if(stamp===session&&job===importId)await openCrop(src,{next:pos<files.length?next:null});}
  }catch(e){if(stamp===session)alert('Dosya açılamadı: '+e.message);if(pos<files.length)next();}};await next();
 };

 function drawAnswer(x,i){if(!i.space253)return;const y=i.y+i.h,h=i.space253;x.save();x.strokeStyle='#c5cfca';x.lineWidth=.7;if(i.solution253==='lined'){for(let yy=y+18;yy<y+h;yy+=18){x.beginPath();x.moveTo(i.x,yy);x.lineTo(i.x+i.w,yy);x.stroke();}}else if(i.solution253==='grid'){for(let yy=y+12;yy<y+h;yy+=12){x.beginPath();x.moveTo(i.x,yy);x.lineTo(i.x+i.w,yy);x.stroke();}for(let xx=i.x;xx<=i.x+i.w;xx+=12){x.beginPath();x.moveTo(xx,y);x.lineTo(xx,y+h);x.stroke();}}x.restore();}
 async function renderCanvas(p,w,start,pageNo){
  const cv=document.createElement('canvas');const scale=300/96;cv.width=Math.round(W*scale);cv.height=Math.round(H*scale);const x=cv.getContext('2d');x.scale(scale,scale);x.fillStyle='#fff';x.fillRect(0,0,W,H);
  await drawPaper(x,w);
  let n=start;for(const i of p.items){n++;const im=await loadImage(i.data),ratio=im.naturalWidth/im.naturalHeight,dw=Math.min(i.w,i.h*ratio),dh=dw/ratio;x.drawImage(im,i.x+(i.w-dw)/2,i.y+(i.h-dh)/2,dw,dh);if(w.number253){x.fillStyle='#173d33';x.font='bold 17px Arial';x.fillText(n+'.',i.x,i.y-6);}drawAnswer(x,i);}
  x.fillStyle='#6c7971';x.font='10px Arial';x.textAlign='right';x.fillText(`${pageNo+1} / ${w.pages.length}`,W-M,H-14);return cv;
 }
 async function canvases(){const w=normalize(),pages=[];let n=0;for(let i=0;i<w.pages.length;i++){pages.push(await renderCanvas(w.pages[i],w,n,i));n+=w.pages[i].items.length;}return pages;}
 async function pdf(){
  await ensureLibrary254('pdf-lib','./assets/teacher-file/pdf-lib.min.js',()=>!!window.PDFLib);
  const project=JSON.parse(JSON.stringify(normalize())),doc=await PDFLib.PDFDocument.create();let number=0;
  for(let i=0;i<project.pages.length;i++){
   notice(`Yüksek kaliteli PDF hazırlanıyor: ${i+1} / ${project.pages.length}`);
   const cv=await renderCanvas(project.pages[i],project,number,i);number+=project.pages[i].items.length;
   const blob=await new Promise((resolve,reject)=>cv.toBlob(b=>b?resolve(b):reject(Error('Sayfa görüntüsü hazırlanamadı.')),'image/png'));
   const image=await doc.embedPng(await blob.arrayBuffer());cv.width=1;cv.height=1;
   const p=doc.addPage([595.28,841.89]);p.drawImage(image,{x:0,y:0,width:595.28,height:841.89});await image.embed();
  }
  await saveOutputBlob(new Blob([await doc.save()],{type:'application/pdf'}),safe(project.title||'Calisma_Yapragi')+'.pdf','application/pdf');notice('PDF hazır.');
 }
 window.exportWorksheetPdf887=async()=>{try{await pdf();}catch(e){alert('PDF oluşturulamadı: '+e.message);}};
 const style=document.createElement('style');style.id='mm-worksheet253';style.textContent=`
 #worksheetStudio887{z-index:2147483100!important;height:100dvh!important;max-height:100dvh!important;box-sizing:border-box!important;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px);overflow:hidden!important}
 #worksheetStudio887 .ws-toolbar887,#worksheetStudio887 .ws-bottom887{flex:0 0 auto!important;box-sizing:border-box!important;max-width:100%;min-width:0;gap:5px!important;padding:6px!important;color:#173d33!important}
 #worksheetStudio887 .ws-toolbar887 button,#worksheetStudio887 .ws-toolbar887 .btn,#worksheetStudio887 .ws-bottom887 button{font-size:12px!important;min-height:36px!important;padding:6px 9px!important;line-height:1.2!important;margin:0!important;white-space:normal!important}
 #worksheetStudio887 .ws-toolbar887>label.btn{display:flex;align-items:center}
 #worksheetStudio887 #ws253controls label{display:flex;flex-direction:column;gap:2px;margin:0;min-width:0;font-size:11px!important}
 #worksheetStudio887 #ws253controls select{width:auto;min-width:0;min-height:32px;padding:4px 18px 4px 6px;font-size:12px;box-sizing:border-box}
 #worksheetStudio887 #ws253controls .ws253-check{flex-direction:row;align-items:center;gap:4px}
 #worksheetStudio887 #ws253controls input{width:18px;height:18px;margin:0}
 #worksheetStudio887 #ws253notice{font-size:11px;line-height:1.2;flex:1 1 200px;overflow-wrap:anywhere}
 #worksheetStudio887 .ws-stage887{min-width:0!important;flex:1 1 0!important;box-sizing:border-box!important}
 #worksheetStudio887 .ws-title887{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
 #worksheetStudio887 .ws-item887{box-sizing:border-box!important;border:0!important;outline:2px solid transparent;overflow:visible!important}
 #worksheetStudio887 .ws-item887.selected{outline-color:#0f8068}
 #worksheetStudio887 .ws-item887 img{object-fit:contain}
 #worksheetStudio887 .ws253-number{position:absolute;left:0;top:-24px;height:24px;font:bold 17px/24px Arial;color:#173d33;pointer-events:none}
 #worksheetStudio887 .ws253-answer{position:absolute;top:100%;left:0;width:100%;pointer-events:none;background-color:white}
 #worksheetStudio887 .ws253-answer.lined{background-image:repeating-linear-gradient(to bottom,transparent 0,transparent 17px,#c5cfca 17px,#c5cfca 18px)}
 #worksheetStudio887 .ws253-answer.grid{background-image:linear-gradient(#c5cfca 1px,transparent 1px),linear-gradient(90deg,#c5cfca 1px,transparent 1px);background-size:12px 12px}
 #worksheetStudio887 .ws-bottom887{gap:4px!important}
 #worksheetStudio887 .ws-bottom887 .ws-page-label887{min-width:64px;font-size:12px}
 #wsDrafts887{z-index:2147483150!important}
 #ws253cropper{position:fixed;inset:0;z-index:2147483200;background:rgba(0,24,20,.82);display:flex;align-items:center;justify-content:center;padding:max(8px,env(safe-area-inset-top,0px)) max(8px,env(safe-area-inset-right,0px)) max(8px,env(safe-area-inset-bottom,0px)) max(8px,env(safe-area-inset-left,0px));box-sizing:border-box;color:#173d33}
 #ws253cropper section{width:min(900px,100%);max-height:100%;overflow-y:auto;box-sizing:border-box;min-width:0;background:#fbf3df;border-radius:16px;padding:12px;display:flex;flex-direction:column;gap:8px}
 #ws253cropper header{position:static!important;display:flex!important;align-items:center!important;justify-content:space-between!important;gap:8px!important;background:transparent!important;color:#173d33!important;padding:0!important;min-height:0!important;box-shadow:none!important;border:0!important}
 #ws253cropper p{margin:0;font-size:13px;color:#173d33}
 #ws253cropper button{min-width:0;min-height:40px;font-size:13px;padding:8px 10px;white-space:normal}
 #ws253cropper small{color:#426052;font-size:12px}
 #ws253cropper .ws253-crop-stage{text-align:center;overflow:auto;min-height:0;background:#dbe4df;padding:6px}
 #ws253surface{display:inline-block;position:relative;max-width:100%;line-height:0;touch-action:none;user-select:none}
 #ws253surface img{display:block;max-width:100%;max-height:48dvh;width:auto;height:auto;pointer-events:none;user-select:none;-webkit-user-drag:none}
 #ws253selection{position:absolute;box-sizing:border-box;border:2px solid #087963;background:rgba(8,121,99,.12);pointer-events:none}
 #ws253cropper .ws253-crop-actions{display:flex;gap:6px;flex-wrap:wrap}
 #ws253cropper .ws253-crop-actions button{flex:1 1 150px}
 @media(max-width:600px){#worksheetStudio887 .ws-toolbar887 button,#worksheetStudio887 .ws-toolbar887 .btn{font-size:11px!important;padding:5px 7px!important}#worksheetStudio887 #wsTitleInput887{min-width:0!important;width:100%;flex:1 1 100%!important;height:34px;font-size:14px}#worksheetStudio887 .ws-toolbar887 .tiny{display:none}}
 @media(orientation:landscape) and (max-height:500px){#worksheetStudio887>.ws-toolbar887:first-child{flex-wrap:nowrap!important;overflow-x:auto!important}#worksheetStudio887>.ws-toolbar887:first-child>*{flex:0 0 auto}#worksheetStudio887 #ws253notice{display:none}#ws253surface img{max-height:36dvh}#ws253cropper section{gap:4px;padding:8px}#ws253cropper p{font-size:11px}#ws253cropper button{min-height:32px;padding:4px 8px;font-size:11px}}
 `;document.head.appendChild(style);
 const extra=document.createElement('style');extra.textContent=`
 #worksheetStudio887 .ws254-paper{position:absolute;inset:0;width:794px;height:1123px;pointer-events:none;z-index:0}
 #worksheetStudio887 .ws-item887{z-index:1}
 #ws253cropper .ws254-view-tools,#ws253cropper .ws254-pages{display:flex;align-items:center;gap:5px;flex-wrap:wrap}
 #ws253cropper .ws254-view-tools button{min-width:36px;min-height:34px;padding:5px 9px;font-size:12px}
 #ws253cropper .ws254-view-tools button[aria-pressed=true]{background:#07594c!important;color:#fff4d7!important;border-color:#c6a653!important}
 #ws253cropper #ws254zoom{font-size:12px;min-width:36px;text-align:center}
 #ws253cropper .ws254-pages label{display:flex;align-items:center;gap:4px;margin:0;font-size:12px}
 #ws253cropper .ws254-pages input{width:56px;min-width:0;height:34px;min-height:0;padding:3px;text-align:center;font-size:13px;box-sizing:border-box}
 #ws253cropper .ws254-pages button{min-height:34px;padding:5px 9px;font-size:12px}
 #ws253cropper #ws254viewport{display:block;height:min(45dvh,480px);min-height:120px;max-height:none;overflow:auto;position:relative;box-sizing:border-box;padding:6px;text-align:left;overscroll-behavior:contain;touch-action:pan-x pan-y}
 #ws253cropper #ws253surface{display:block;position:relative;max-width:none;max-height:none;margin:0 auto;line-height:0;touch-action:none;cursor:crosshair}
 #ws253cropper #ws253surface img{max-width:none;max-height:none;width:100%;height:100%;display:block;object-fit:fill}
 #ws253cropper #ws253selection{border-color:#087963;box-shadow:0 0 0 1px #fff6}
 @media(orientation:landscape) and (max-height:500px){#ws253cropper #ws254viewport{height:38dvh;min-height:90px}#ws253cropper section{max-height:100%;overflow-y:auto}}
 `;document.head.appendChild(extra);
 const compactStyle=document.createElement('style');compactStyle.textContent=`
 #worksheetStudio887 [hidden]{display:none!important}
 #worksheetStudio887 .ws255-header{display:grid!important;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;flex-wrap:nowrap!important;overflow:visible!important;background:#fbf3df;gap:8px!important;padding:6px 10px!important}
 #worksheetStudio887 .ws255-header strong{font-size:15px;text-align:center;min-width:0;line-height:1.2}
 #worksheetStudio887 .ws255-actions{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr));padding:0 10px 7px!important;border-top:0!important}
 #worksheetStudio887 .ws255-header button,#worksheetStudio887 .ws255-actions button,#worksheetStudio887 #ws255selection button,#worksheetStudio887 .ws-bottom887 button{min-height:44px!important;font-size:13px!important;padding:7px 9px!important;min-width:0!important}
 #worksheetStudio887 #ws255selection{display:flex;align-items:center;justify-content:center;background:#f2ead5;border-top:1px solid #d8cda9;flex-wrap:nowrap!important;gap:4px!important;padding:5px 7px!important}
 #worksheetStudio887 #ws255selectedlabel{font-size:12px;font-weight:bold;white-space:nowrap}
 #worksheetStudio887 #ws255selection button{flex:0 1 auto}
 #worksheetStudio887 .ws-bottom887{justify-content:center;flex-wrap:nowrap!important;padding:5px 8px!important;background:#fbf3df}
 #worksheetStudio887 #ws255more{font-size:23px!important;min-width:44px!important}
 #worksheetStudio887 .ws-stage887{overflow:auto;min-height:0!important}
 #worksheetStudio887 #ws255panel{position:absolute;inset:0;z-index:5;background:#002c2488;display:flex;align-items:center;justify-content:center;padding:12px;box-sizing:border-box}
 #worksheetStudio887 #ws255panel section{background:#fbf3df;color:#173d33;border:1px solid #d8cda9;border-radius:16px;padding:16px;box-sizing:border-box;width:min(480px,100%);max-height:100%;overflow:auto;overscroll-behavior:contain;box-shadow:0 10px 36px #001c2455}
 #worksheetStudio887 .ws255-panelhead{display:flex;gap:10px;justify-content:space-between;align-items:center;margin-bottom:14px}
 #worksheetStudio887 .ws255-panelhead h2{font-size:20px;margin:0;color:#173d33}
 #worksheetStudio887 #ws255panel button,#worksheetStudio887 #ws255panel label.btn{min-height:44px!important;font-size:14px!important;margin:0;box-sizing:border-box;white-space:normal}
 #worksheetStudio887 .ws255-stack{display:grid;gap:10px}
 #worksheetStudio887 .ws255-stack label.btn{display:flex;justify-content:center;align-items:center;cursor:pointer}
 #worksheetStudio887 .ws255-titlelabel{display:flex;flex-direction:column;gap:6px;font-size:14px}
 #worksheetStudio887 #wsTitleInput887{width:100%!important;min-width:0!important;min-height:44px!important;height:auto!important;font-size:16px!important;box-sizing:border-box}
 #worksheetStudio887 #ws253controls{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr));padding:14px 0!important;border:0!important;background:transparent;gap:12px!important}
 #worksheetStudio887 #ws253controls label{font-size:13px!important}
 #worksheetStudio887 #ws253controls label:first-child{grid-column:1/-1}
 #worksheetStudio887 #ws253controls select{width:100%;min-height:44px;font-size:16px}
 #worksheetStudio887 #ws253controls .ws253-check{font-size:14px!important;min-height:44px;gap:8px}
 #worksheetStudio887 #ws253controls input{width:22px;height:22px;flex-shrink:0}
 #worksheetStudio887 #ws253notice{grid-column:1/-1;font-size:12px;line-height:1.4}
 #worksheetStudio887 .ws255-hint{font-size:12px;line-height:1.5;margin:10px 0 0;color:#50675b}
 @media(max-width:350px){#worksheetStudio887 .ws255-header strong{font-size:13px}#worksheetStudio887 #ws255selection button{font-size:11px!important;padding:5px 7px!important}}
 @media(orientation:landscape) and (max-height:500px){#worksheetStudio887 #ws255panel section{width:min(600px,100%)}#worksheetStudio887 #ws255selection{position:absolute;bottom:60px;left:50%;transform:translateX(-50%);width:max-content;max-width:calc(100% - 20px);border:1px solid #d8cda9;border-radius:12px;z-index:3}#worksheetStudio887 #ws253notice{display:block}}
 `;document.head.appendChild(compactStyle);
 const cropStyle=document.createElement('style');cropStyle.textContent=`
 #ws253cropper{padding:max(8px,env(safe-area-inset-top,0px)) max(8px,env(safe-area-inset-right,0px)) max(8px,env(safe-area-inset-bottom,0px)) max(8px,env(safe-area-inset-left,0px));touch-action:none}
 #ws253cropper [hidden]{display:none!important}
 #ws253cropper section{width:min(1000px,100%);height:100%;max-height:100%;gap:7px;padding:12px;overflow:auto;min-height:0}
 #ws253cropper header{flex-shrink:0;display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;grid-template-rows:auto!important;align-items:center!important;flex-wrap:nowrap!important;gap:8px!important}
 #ws253cropper header b{font-size:17px;line-height:1.2;text-align:left;color:#173d33}
 #ws253cropper header button{font-size:13px;min-height:44px}
 #ws253cropper .ws254-view-tools{display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:8px;flex-shrink:0}
 #ws253cropper .ws256-zoomgroup{display:flex;align-items:center;gap:3px;min-width:0}
 #ws253cropper .ws254-view-tools button{min-width:44px;min-height:44px;padding:6px 10px;font-size:14px}
 #ws253cropper #ws254zoom{font-size:13px;min-width:40px;text-align:center}
 #ws253cropper #ws254select{min-width:64px}
 #ws253cropper .ws254-pages{display:grid;grid-template-columns:44px minmax(0,1fr) 44px;gap:8px;flex-shrink:0;align-items:center}
 #ws253cropper .ws254-pages label{display:flex;align-items:center;justify-content:center;gap:7px;font-size:13px;white-space:nowrap}
 #ws253cropper .ws254-pages button{min-height:40px;min-width:40px;font-size:22px;padding:3px 8px}
 #ws253cropper .ws254-pages input{width:60px;font-size:16px;height:40px}
 #ws253cropper #ws254hint{font-size:12px;line-height:1.3;flex-shrink:0}
 #ws253cropper #ws254viewport{height:auto;min-height:90px;flex:1 1 0;overflow:auto;touch-action:none;overscroll-behavior:none;cursor:grab}
 #ws253cropper #ws253surface{cursor:inherit}
 #ws253cropper .ws253-crop-actions{display:grid;grid-template-columns:minmax(0,1fr) auto;flex-shrink:0;gap:8px}
 #ws253cropper .ws253-crop-actions button{min-height:44px;font-size:14px;padding:7px 12px}
 #ws253cropper #ws253cropinfo{font-size:11px;line-height:1.3;flex-shrink:0}
 @media(orientation:landscape) and (max-height:500px){#ws253cropper section{display:grid;grid-template-columns:minmax(230px,310px) minmax(0,1fr);grid-template-rows:auto auto auto auto 1fr auto;column-gap:12px;padding:10px}#ws253cropper header,#ws253cropper .ws254-view-tools,#ws253cropper .ws254-pages,#ws253cropper #ws254hint,#ws253cropper .ws253-crop-actions,#ws253cropper #ws253cropinfo{grid-column:1}#ws253cropper header{grid-row:1}#ws253cropper .ws254-view-tools{grid-row:2}#ws253cropper .ws254-pages{grid-row:3}#ws253cropper #ws254hint{grid-row:4}#ws253cropper .ws253-crop-actions{grid-row:5;align-self:end}#ws253cropper #ws253cropinfo{grid-row:6}#ws253cropper #ws254viewport{grid-column:2;grid-row:1/-1;height:100%;min-height:90px;width:100%}}
 `;document.head.appendChild(cropStyle);
 window.MualliMateWorksheet256=window.MualliMateWorksheet255=window.MualliMateWorksheet254=window.MualliMateWorksheet253={version:256,layout,canvases,select,reorder};
})();
