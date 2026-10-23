/* Schedule PDF import: local PDF.js, top-down table coordinates, preview before save. */
(()=>{'use strict';if(window.MualliMateSchedule265)return;
 const root=new URL('./',document.currentScript.src);let engine=null,run=0;
 async function ensure(){
  const worker=new URL('pdf-engine246/pdf.worker.min.js',root).href;
  if(window.pdfjsLib){pdfjsLib.GlobalWorkerOptions.workerSrc=worker;return;}
  if(window.MualliMatePDF246){await MualliMatePDF246.ensure();return;}
  if(!engine)engine=new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=new URL('pdf-engine246/pdf.min.js',root).href;s.onload=()=>window.pdfjsLib?resolve():reject(Error('PDF motoru başlatılamadı.'));s.onerror=()=>{s.remove();reject(Error('Yerel PDF motoru yüklenemedi. Uygulamayı güncelleyin.'));};document.head.appendChild(s);}).catch(e=>{engine=null;throw e;});
  await engine;pdfjsLib.GlobalWorkerOptions.workerSrc=worker;
 }
 const day=text=>({PA:'Pa',PZ:'Pa',PAZARTESI:'Pa',SA:'Sa',SALI:'Sa',CA:'Ça',CARSAMBA:'Ça',PE:'Pe',PERSEMBE:'Pe',CU:'Cu',CUMA:'Cu'})[String(text||'').trim().toLocaleUpperCase('tr').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/İ|ı/g,'I').replace(/\.$/,'')]||null;
 function parse(items){
  const empty=()=>({id:uid(),name:'PDF Ders Programı',effectiveDate:'',periods:scheduleDefaultPeriods(),entries:[]});
  items=items.filter(v=>v.text&&Number.isFinite(v.x)&&Number.isFinite(v.y));
  const nums=items.filter(i=>/^(?:[1-9]|1[0-2])$/.test(i.text)),lines=[];
  for(const n of nums){let line=lines.find(l=>Math.abs(l.y-n.y)<Math.max(5,(n.h||10)*0.6));if(!line){line={y:n.y,items:[]};lines.push(line);}line.items.push(n);}
  const candidates=lines.map(l=>{const a=l.items.slice().sort((a,b)=>a.x-b.x),seq=[];for(const n of a)if(Number(n.text)===seq.length+1)seq.push(n);return seq;}).filter(a=>a.length>=3).sort((a,b)=>b.length-a.length||a[0].y-b[0].y);
  if(!candidates.length)return empty();const header=candidates[0],centers=header.map(i=>i.x+i.w/2),headerY=header.reduce((n,i)=>n+i.y,0)/header.length,gap=centers[1]-centers[0];
  const days=items.map(i=>({...i,day:day(i.text)})).filter(i=>i.day&&i.y>headerY&&i.x<centers[0]-gap*0.3).sort((a,b)=>a.y-b.y),rows=[];
  for(const d of days)if(!rows.some(v=>v.day===d.day))rows.push(d);
  if(!rows.length)return empty();
  const entries=[],period=x=>{let best=0;centers.forEach((c,i)=>{if(Math.abs(x-c)<Math.abs(x-centers[best]))best=i;});return best+1;};
  for(let di=0;di<rows.length;di++){
   const d=rows[di],upper=di?(rows[di-1].y+d.y)/2:(headerY+d.y)/2,lower=di+1<rows.length?(d.y+rows[di+1].y)/2:d.y+(di?(d.y-rows[di-1].y)/2:35);
   const row=items.filter(i=>i.y>upper&&i.y<lower&&i.x>centers[0]-gap*0.5&&!day(i.text)),classes=row.filter(i=>/^\d{1,2}\s*[-/]\s*[A-ZÇĞİÖŞÜ]$/iu.test(i.text)),courses=row.filter(i=>!classes.includes(i)&&/^[A-ZÇĞİÖŞÜa-zçğıöşü][A-ZÇĞİÖŞÜa-zçğıöşü. ()\-]{1,45}$/.test(i.text)&&!['ADI SOYADI','SINIF','DERS','TOPLAM'].includes(i.text.toLocaleUpperCase('tr'))).sort((a,b)=>a.x-b.x);
   for(let ci=0;ci<courses.length;ci++){
    const c=courses[ci],next=courses[ci+1]?.x??Infinity,matches=classes.filter(k=>k.x>=c.x-5&&k.x<next-5).sort((a,b)=>a.x-b.x);let cl=matches[matches.length-1];
    if(!cl)cl=classes.filter(k=>period(k.x+k.w/2)===period(c.x+c.w/2)).sort((a,b)=>Math.abs(a.y-c.y)-Math.abs(b.y-c.y))[0];
    if(!cl)continue;const sp=period(c.x+c.w/2),ep=Math.max(sp,period(cl.x+cl.w/2)),className=cl.text.replace(/\s+/g,'').replace('-','/').toLocaleUpperCase('tr'),course=c.text.trim().replace(/\s+/g,' ').toLocaleUpperCase('tr');
    if(!entries.some(e=>e.day===d.day&&e.startPeriod===sp&&e.className===className))entries.push({id:uid(),day:d.day,startPeriod:sp,endPeriod:ep,course,className});
   }
  }
  const result=empty();result.entries=entries;
  // Preserve configured clock times; only PDF lesson blocks are being imported.
  if(settings.schedule?.periods?.length)result.periods=JSON.parse(JSON.stringify(settings.schedule.periods));
  for(let no=1;no<=header.length;no++)if(!result.periods.some(p=>Number(p.no)===no))result.periods.push({no,start:'',end:''});
  result.periods.sort((a,b)=>Number(a.no)-Number(b.no));
  return result;
 }
 async function load(file){
  if(!file)return;const token=++run;let task=null,doc=null;
  try{
   el('modalSubtitle').textContent='PDF okunuyor…';window._schedulePdfCandidate=null;
   await ensure();if(token!==run)return;
   const data=await file.arrayBuffer();task=pdfjsLib.getDocument({data});doc=await task.promise;let best=null,textFound=false;
   for(let no=1;no<=doc.numPages;no++){
    if(token!==run)return;el('modalSubtitle').textContent='PDF okunuyor · '+no+' / '+doc.numPages;
    const p=await doc.getPage(no),tc=await p.getTextContent(),vp=p.getViewport({scale:1});
    const items=tc.items.map(it=>{const t=pdfjsLib.Util.transform(vp.transform,it.transform);return{text:String(it.str||'').trim(),x:t[4],y:t[5],w:Number(it.width||0),h:Math.abs(t[3])||10};}).filter(i=>i.text);
    textFound||=items.length>0;const candidate=parse(items);if(candidate.entries.length>(best?.entries.length||0))best=candidate;p.cleanup();
   }
   if(!best?.entries.length)throw Error(textFound?'Program tablosu algılanamadı. PDF düzeni desteklenen gün-satır / ders-saati-sütun biçiminde olmayabilir.':'PDF metin içermiyor. Taranmış veya fotoğraf PDF yerine metin tabanlı ders programını seçin.');
   if(token!==run)return;const now=new Date();best.name=file.name.replace(/\.pdf$/i,'');best.effectiveDate=[now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-');window._schedulePdfCandidate=best;openSchedule();
  }catch(e){if(token!==run)return;console.error(e);alert('PDF otomatik okunamadı: '+(e?.name==='PasswordException'?'PDF şifreli. Şifresiz bir kopyasını seçin.':e?.message||e));openSchedule();}
  finally{try{if(doc)await doc.destroy();else if(task)await task.destroy();}catch(_){}const input=document.getElementById('schedulePdfInput');if(token===run&&input)input.value='';}
 }
 window.parseSchedulePdfItems=parse;window.importSchedulePDF=load;window.MualliMateSchedule265={version:265,parse,ensure};
})();
