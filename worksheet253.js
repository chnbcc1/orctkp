/* Worksheet Studio 253. Existing IndexedDB drafts and image coordinates remain readable. */
(()=>{
 'use strict';
 if(window.MualliMateWorksheet253||typeof window.openWorksheetStudio887!=='function')return;
 const W=794,H=1123,M=32,G=20,uid=()=>window.crypto?.randomUUID?.()||('ws-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2)),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const original={open:window.openWorksheetStudio887,close:window.closeWorksheetStudio887};
 let selected=null,session=0,crop=null,busy=false,observer=null,fitFrame=0;
 function fitLater(){if(!fitFrame)fitFrame=requestAnimationFrame(()=>{fitFrame=0;if(document.getElementById("worksheetStudio887"))window.fitWorksheet887();});}
 addEventListener("resize",fitLater,{passive:true});addEventListener("orientationchange",fitLater,{passive:true});window.visualViewport?.addEventListener("resize",fitLater,{passive:true});
 const ws=()=>window._worksheet887,page=()=>ws().pages[ws().current],all=()=>ws().pages.flatMap(p=>p.items),item=()=>all().find(i=>i.id===selected);
 function normalize(){const w=ws();w.layout253=w.layout253===2?2:1;w.solution253=w.solution253||'blank';w.space253=Number(w.space253)||100;if(w.number253===undefined)w.number253=!all().length;for(const i of all()){i.space253=Math.max(0,Number(i.space253)||0);i.solution253=i.solution253||'blank';}return w;}
 const numberHeight=()=>ws().number253?24:0;
 function top(){return ws().title?82:32;}
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
  host.innerHTML=(w.title?`<div class="ws-title887">${esc(w.title)}</div>`:'')+page().items.map(i=>`<div class="ws-item887${i.id===selected?' selected':''}" data-id="${esc(i.id)}" style="left:${i.x}px;top:${i.y}px;width:${i.w}px;height:${i.h}px" onpointerdown="worksheetDragStart887(event,'${esc(i.id)}')">${w.number253?`<span class="ws253-number">${numbers.get(i.id)}.</span>`:''}<img alt="Soru ${numbers.get(i.id)}" src="${esc(i.data)}">${answerHTML(i)}<button class="ws-delete887" aria-label="Soruyu sil" onpointerdown="event.stopPropagation()" onclick="event.stopPropagation();worksheetDeleteItem887('${esc(i.id)}')">×</button><span class="ws-resize887" onpointerdown="worksheetResizeStart887(event,'${esc(i.id)}')"></span></div>`).join('');
  const label=document.getElementById('wsPageLabel887');if(label)label.textContent=`${w.current+1} / ${w.pages.length} · ${all().length} soru`;
  const del=document.querySelector('#worksheetStudio887 .ws-bottom887 .danger');if(del)del.textContent=w.pages.length===1?'Sayfayı Temizle':'Sayfayı Sil';
  document.querySelectorAll('[data-ws253-selected]').forEach(b=>b.disabled=!item());
  const fit=window.fitWorksheet887;if(typeof fit==='function')requestAnimationFrame(fit);
 }
 function controls(){
  const w=ws(),bar=document.createElement('div');bar.id='ws253controls';bar.className='ws-toolbar887';
  bar.innerHTML=`<label>Yerleşim<select id="ws253layout"><option value="1">Tek sütun</option><option value="2">İki sütun</option></select></label><label>Çözüm alanı<select id="ws253solution"><option value="none">Yok</option><option value="blank">Boş</option><option value="lined">Çizgili</option><option value="grid">Kareli</option></select></label><label>Alan yüksekliği<select id="ws253space"><option value="60">Kısa</option><option value="100">Orta</option><option value="180">Geniş</option></select></label><label class="ws253-check"><input id="ws253number" type="checkbox" ${w.number253?'checked':''}> Soru numarası</label><button type="button" class="secondary" id="ws253apply">Seçili soruya uygula</button><button type="button" class="secondary" id="ws253applyall">Tüm sorulara uygula</button><span id="ws253notice" role="status">Görsel eklerken aynı fotoğraftan birden çok soru kırpabilirsiniz.</span>`;
  document.querySelector('#worksheetStudio887 .ws-stage887').before(bar);
  document.getElementById('ws253layout').value=String(w.layout253);document.getElementById('ws253solution').value=w.solution253;document.getElementById('ws253space').value=String(w.space253);
  document.getElementById('ws253layout').onchange=e=>{w.layout253=Number(e.target.value);layout()};
  document.getElementById('ws253number').onchange=e=>{w.number253=e.target.checked;layout()};
  for(const id of ['ws253solution','ws253space'])document.getElementById(id).onchange=()=>{w.solution253=document.getElementById('ws253solution').value;w.space253=Number(document.getElementById('ws253space').value);notice('Yeni sorular bu ayarla eklenir. Mevcut sorular için uygula düğmelerini kullanın.');};
  const apply=targets=>{for(const i of targets){i.space253=w.solution253==='none'?0:w.space253;i.solution253=w.solution253;}layout();};
  document.getElementById('ws253apply').dataset.ws253Selected='';document.getElementById('ws253apply').onclick=()=>{if(item())apply([item()]);};document.getElementById('ws253applyall').onclick=()=>apply(all());
 }
 window.openWorksheetStudio887=function(project=null){
  session++;selected=null;closeCrop();observer?.disconnect();original.open(project);normalize();
  const bar=document.querySelector('#worksheetStudio887 .ws-toolbar887');
  bar.innerHTML=`<button class="secondary" onclick="closeWorksheetStudio887()">← Geri</button><label class="btn secondary">📷 Kamera<input type="file" accept="image/*" capture="environment" hidden onchange="worksheetAddImages887(event)"></label><label class="btn secondary">🖼 Görsel Ekle<input type="file" accept="image/*" multiple hidden onchange="worksheetAddImages887(event)"></label><button class="secondary" onclick="worksheetAutoLayout887()">Otomatik Yerleştir</button><button class="secondary" data-ws253-selected id="ws253crop">Kırp</button><button class="secondary" data-ws253-selected id="ws253up">Önceye Al</button><button class="secondary" data-ws253-selected id="ws253down">Sonraya Al</button><button class="secondary" onclick="saveWorksheetDraft887()">Taslağı Kaydet</button><button class="secondary" onclick="openWorksheetDrafts887()">Taslaklar</button><button onclick="exportWorksheetPdf887()">PDF</button>`;
  controls();const title=document.getElementById('wsTitleInput887');if(title){title.maxLength=120;title.onchange=()=>layout();}
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
 function select(id){selected=id;document.querySelectorAll('.ws-item887').forEach(e=>e.classList.toggle('selected',e.dataset.id===id));document.querySelectorAll('[data-ws253-selected]').forEach(b=>b.disabled=false);}
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
 function closeCrop(){document.getElementById('ws253cropper')?.remove();crop=null;busy=false;}
 async function openCrop(src,options={}){
  closeCrop();const stamp=session,im=await loadImage(src);if(stamp!==session||!document.getElementById('worksheetStudio887'))return;
  const overlay=document.createElement('div');overlay.id='ws253cropper';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','Soruyu kırp');
  overlay.innerHTML=`<section><header><b>${options.editId?'Seçili Soruyu Kırp':'Görselden Soru Ekle'}</b><button class="secondary" id="ws253cancel">Kapat</button></header><p>Parmağınızla veya fareyle sorunun çevresine bir dikdörtgen çizin.</p><div class="ws253-crop-stage"><div id="ws253surface"><img alt="Kırpılacak görsel"><div id="ws253selection"></div></div></div><div class="ws253-crop-actions"><button class="secondary" id="ws253full">Tam Alanı Seç</button><button id="ws253accept">${options.editId?'Kırpmayı Uygula':'Seçili Bölgeyi Soru Ekle'}</button><button class="secondary" id="ws253next">${options.next?'Sonraki Görsel':'Bitir'}</button></div><small id="ws253cropinfo" role="status">${options.editId?'Kaynak görsel yalnızca uyguladığınızda değişir.':'Aynı görselden birden fazla soru ekleyebilirsiniz.'}</small></section>`;
  document.body.appendChild(overlay);const image=overlay.querySelector('img');image.src=src;crop={im,src,options,rect:{x:0,y:0,w:1,h:1},stamp};let start=null;
  const surface=document.getElementById('ws253surface');
  function point(e){const r=image.getBoundingClientRect();return {x:Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),y:Math.max(0,Math.min(1,(e.clientY-r.top)/r.height))};}
  function paint(){if(!crop)return;const r=crop.rect;Object.assign(document.getElementById('ws253selection').style,{left:r.x*100+'%',top:r.y*100+'%',width:r.w*100+'%',height:r.h*100+'%'});}
  surface.onpointerdown=e=>{if(busy)return;e.preventDefault();start=point(e);surface.setPointerCapture(e.pointerId);};
  surface.onpointermove=e=>{if(!start||!crop)return;const p=point(e);crop.rect={x:Math.min(start.x,p.x),y:Math.min(start.y,p.y),w:Math.abs(p.x-start.x),h:Math.abs(p.y-start.y)};paint();};
  surface.onpointerup=surface.onpointercancel=()=>{start=null;};
  document.getElementById('ws253full').onclick=()=>{crop.rect={x:0,y:0,w:1,h:1};paint();};
  document.getElementById('ws253cancel').onclick=closeCrop;
  document.getElementById('ws253next').onclick=()=>{const next=crop.options.next;closeCrop();if(next)next();};
  document.getElementById('ws253accept').onclick=acceptCrop;paint();
 }
 async function acceptCrop(){
  if(!crop||busy)return;const c=crop,r=c.rect,sw=Math.round(r.w*c.im.naturalWidth),sh=Math.round(r.h*c.im.naturalHeight);if(sw<12||sh<12){document.getElementById('ws253cropinfo').textContent='Seçili alan çok küçük. Sorunun çevresini yeniden seçin.';return;}
  busy=true;
  try{const scale=Math.min(1,2000/Math.max(sw,sh)),cv=document.createElement('canvas');cv.width=Math.max(1,Math.round(sw*scale));cv.height=Math.max(1,Math.round(sh*scale));const x=cv.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,cv.width,cv.height);x.drawImage(c.im,Math.round(r.x*c.im.naturalWidth),Math.round(r.y*c.im.naturalHeight),sw,sh,0,0,cv.width,cv.height);const data=cv.toDataURL('image/jpeg',.96);if(c.stamp!==session)return;
   if(c.options.editId){const i=all().find(i=>i.id===c.options.editId);if(!i)return;i.data=data;i.ratio=cv.width/cv.height;layout();closeCrop();}
   else{const w=ws(),i={id:uid(),data,ratio:cv.width/cv.height,x:M,y:top(),w:cv.width,h:cv.height,space253:w.solution253==='none'?0:w.space253,solution253:w.solution253};page().items.push(i);selected=i.id;layout();document.getElementById('ws253cropinfo').textContent=`Eklendi. Toplam ${all().length} soru. Başka bir bölge seçebilir veya Bitir düğmesine basabilirsiniz.`;}
  }catch(e){alert('Soru eklenemedi: '+e.message);}finally{busy=false;}
 }
 window.worksheetAddImages887=async function(ev){
  const files=[...(ev.target.files||[])],stamp=session;ev.target.value='';let pos=0;if(!files.length)return;
  const next=async()=>{if(stamp!==session||pos>=files.length)return;const f=files[pos++];try{const src=await readFile(f);if(stamp!==session)return;await openCrop(src,{next:pos<files.length?next:null});}catch(e){alert(e.message);if(pos<files.length)next();}};await next();
 };
 function drawAnswer(x,i){if(!i.space253)return;const y=i.y+i.h,h=i.space253;x.save();x.strokeStyle='#c5cfca';x.lineWidth=.7;if(i.solution253==='lined'){for(let yy=y+18;yy<y+h;yy+=18){x.beginPath();x.moveTo(i.x,yy);x.lineTo(i.x+i.w,yy);x.stroke();}}else if(i.solution253==='grid'){for(let yy=y+12;yy<y+h;yy+=12){x.beginPath();x.moveTo(i.x,yy);x.lineTo(i.x+i.w,yy);x.stroke();}for(let xx=i.x;xx<=i.x+i.w;xx+=12){x.beginPath();x.moveTo(xx,y);x.lineTo(xx,y+h);x.stroke();}}x.restore();}
 async function renderCanvas(p,w,start,pageNo){
  const cv=document.createElement('canvas');cv.width=W*2;cv.height=H*2;const x=cv.getContext('2d');x.scale(2,2);x.fillStyle='#fff';x.fillRect(0,0,W,H);
  if(w.title){x.fillStyle='#173d33';let font=25;x.textAlign='center';x.font='bold '+font+'px Arial';while(font>16&&x.measureText(w.title).width>W-2*M)x.font='bold '+(--font)+'px Arial';let text=w.title;while(text.length&&x.measureText(text+'…').width>W-2*M)text=text.slice(0,-1);x.fillText(text===w.title?text:text+'…',W/2,45);x.textAlign='left';}
  let n=start;for(const i of p.items){n++;const im=await loadImage(i.data),ratio=im.naturalWidth/im.naturalHeight,dw=Math.min(i.w,i.h*ratio),dh=dw/ratio;x.drawImage(im,i.x+(i.w-dw)/2,i.y+(i.h-dh)/2,dw,dh);if(w.number253){x.fillStyle='#173d33';x.font='bold 17px Arial';x.fillText(n+'.',i.x,i.y-6);}drawAnswer(x,i);}
  x.fillStyle='#6c7971';x.font='10px Arial';x.textAlign='right';x.fillText(`${pageNo+1} / ${w.pages.length}`,W-M,H-14);return cv;
 }
 async function canvases(){const w=normalize(),pages=[];let n=0;for(let i=0;i<w.pages.length;i++){pages.push(await renderCanvas(w.pages[i],w,n,i));n+=w.pages[i].items.length;}return pages;}
 async function pdf(){
  const project=JSON.parse(JSON.stringify(normalize())),count=project.pages.length,encode=s=>new TextEncoder().encode(s),objects={},kids=[];let number=0;
  objects[1]=encode('<< /Type /Catalog /Pages 2 0 R >>');
  for(let i=0;i<count;i++){
   const cv=await renderCanvas(project.pages[i],project,number,i);number+=project.pages[i].items.length;const raw=atob(cv.toDataURL('image/jpeg',.94).split(',')[1]),image=Uint8Array.from(raw,c=>c.charCodeAt(0)),im=3+i*3,content=im+1,page=im+2;
   const stream=encode('q\n595.28 0 0 841.89 0 0 cm\n/Im0 Do\nQ\n');
   objects[im]=new Blob([encode(`<< /Type /XObject /Subtype /Image /Width ${cv.width} /Height ${cv.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${image.length} >>\nstream\n`),image,encode('\nendstream')]);
   objects[content]=new Blob([encode(`<< /Length ${stream.length} >>\nstream\n`),stream,encode('endstream')]);
   objects[page]=encode(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /XObject << /Im0 ${im} 0 R >> >> /Contents ${content} 0 R >>`);kids.push(`${page} 0 R`);cv.width=1;cv.height=1;
  }
  objects[2]=encode(`<< /Type /Pages /Count ${count} /Kids [${kids.join(' ')}] >>`);
  const parts=[encode('%PDF-1.4\n')],offsets=[0],max=2+count*3;let pos=parts[0].length;
  for(let i=1;i<=max;i++){offsets[i]=pos;const blob=new Blob([encode(`${i} 0 obj\n`),objects[i],encode('\nendobj\n')]);parts.push(blob);pos+=blob.size;}
  let tail=`xref\n0 ${max+1}\n0000000000 65535 f \n`;for(let i=1;i<=max;i++)tail+=String(offsets[i]).padStart(10,'0')+' 00000 n \n';
  tail+=`trailer\n<< /Size ${max+1} /Root 1 0 R >>\nstartxref\n${pos}\n%%EOF`;parts.push(encode(tail));
  await saveOutputBlob(new Blob(parts,{type:'application/pdf'}),safe(project.title||'Calisma_Yapragi')+'.pdf','application/pdf');
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
 window.MualliMateWorksheet253={version:253,layout,canvases,select,reorder};
})();
