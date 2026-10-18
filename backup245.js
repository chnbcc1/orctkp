/* Complete backup of application-owned document notes and media stores. */
(()=>{
 'use strict';
 const KEYS=['muallimateTeacherFileV1','muallimateTeacherFileV2','sokLocalLibrary7718'];
 const STORES=[{name:'OgrenciTakipMediaV1',store:'homeworkImages',keyPath:null},{name:'muallimateWorksheetStudioV1',store:'drafts',keyPath:'id'}];
 const copy=x=>JSON.parse(JSON.stringify(x));
 function open(spec){return new Promise((resolve,reject)=>{const q=indexedDB.open(spec.name,1);q.onupgradeneeded=()=>{if(!q.result.objectStoreNames.contains(spec.store))q.result.createObjectStore(spec.store,spec.keyPath?{keyPath:spec.keyPath}:undefined)};q.onsuccess=()=>resolve(q.result);q.onerror=()=>reject(q.error);q.onblocked=()=>reject(new Error('Veri deposu başka bir pencerede açık. Diğer uygulama pencerelerini kapatıp tekrar deneyin.'))})}
 async function read(spec){const db=await open(spec);try{return await new Promise((resolve,reject)=>{const tx=db.transaction(spec.store,'readonly'),out=[],q=tx.objectStore(spec.store).openCursor();q.onsuccess=()=>{const c=q.result;if(c){out.push({key:c.key,value:c.value});c.continue()}};tx.oncomplete=()=>resolve(out);tx.onabort=tx.onerror=()=>reject(tx.error||new Error('Veri deposu okunamadı.'))})}finally{db.close()}}
 async function write(spec,rows){const db=await open(spec);try{return await new Promise((resolve,reject)=>{const tx=db.transaction(spec.store,'readwrite'),s=tx.objectStore(spec.store);tx.oncomplete=resolve;tx.onabort=tx.onerror=()=>reject(tx.error||new Error('Veri deposu yazılamadı.'));try{s.clear();for(const r of rows){if(spec.keyPath)s.put(r.value);else s.put(r.value,r.key)}}catch(e){tx.abort();reject(e)}})}finally{db.close()}}
 function validate(extra){
  if(extra===undefined)return;
  if(!extra||extra.version!==1||!extra.localStorage||typeof extra.localStorage!=='object'||Array.isArray(extra.localStorage)||!Array.isArray(extra.stores)||extra.stores.length!==STORES.length)throw new Error('Ek yedek verileri geçersiz.');
  for(const [key,value]of Object.entries(extra.localStorage)){if(!KEYS.includes(key)||(value!==null&&typeof value!=='string'))throw new Error('Ek yedek anahtarı geçersiz.');if(value!==null)JSON.parse(value)}
  if(KEYS.some(k=>!Object.prototype.hasOwnProperty.call(extra.localStorage,k)))throw new Error('Belge notları yedek bölümü eksik.');
  for(const spec of STORES){const found=extra.stores.filter(s=>s.name===spec.name&&s.store===spec.store);if(found.length!==1||!Array.isArray(found[0].rows))throw new Error('Ek veri deposu yedeği eksik.');const seen=new Set();for(const row of found[0].rows){if(!row||typeof row.key!=='string'||seen.has(row.key)||row.value===undefined)throw new Error('Ek veri kaydı geçersiz.');seen.add(row.key);if(spec.keyPath){if(!row.value||typeof row.value!=='object'||row.value.id!==row.key)throw new Error('Çalışma yaprağı kaydı geçersiz.')}else if(typeof row.value!=='string')throw new Error('Ödev görseli kaydı geçersiz.')}}
 }
 async function supplement(){
  const local={};for(const k of KEYS)local[k]=localStorage.getItem(k);
  const stores=[];for(const spec of STORES)stores.push({name:spec.name,store:spec.store,rows:await read(spec)});
  const extra={version:1,localStorage:local,stores};validate(extra);return extra;
 }
 async function create(){
  // Persist in-memory images before reading the media store, including a just-added image.
  await persistHomeworkImages();
  return {backupType:'ogrenci-takip-tam-yedek',version:7,appVersion:APP_DATA_VERSION,exportedAt:new Date().toISOString(),state:copy(state),settings:copy(settings),schoolYearArchives:copy(loadSchoolYearArchives()),additionalData:await supplement()};
 }
 async function apply(restoredState,restoredSettings,archives,backup){
  validate(backup.additionalData);
  const extra=backup.additionalData,stored=copy(restoredState);if(extra)for(const c of stored.classes||[])for(const h of c.homeworks||[])if(h.imageKey)delete h.imageData;
  const values=new Map([[STORAGE_KEY,JSON.stringify(stored)],[SETTINGS_KEY,JSON.stringify(restoredSettings)]]);
  if(Array.isArray(archives))values.set(SCHOOL_ARCHIVE_KEY,JSON.stringify(archives));
  if(extra)for(const k of KEYS)values.set(k,extra.localStorage[k]);
  const before=new Map([...values.keys()].map(k=>[k,localStorage.getItem(k)])),oldStores=[];
  if(extra)for(const spec of STORES)oldStores.push(await read(spec));
  let touched=0;
  try{
   if(extra)for(const spec of STORES){touched++;await write(spec,extra.stores.find(s=>s.name===spec.name&&s.store===spec.store).rows)}
   for(const [k,v]of values){if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v)}
  }catch(error){
   const rollbackErrors=[];
   for(const [k,v]of before){try{if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v)}catch(e){rollbackErrors.push(e)}}
   for(let i=0;i<touched;i++){try{await write(STORES[i],oldStores[i])}catch(e){rollbackErrors.push(e)}}
   if(rollbackErrors.length)throw new Error('Geri yükleme tamamlanamadı ve önceki verilerin tamamı geri alınamadı. Uygulamayı kapatmadan mevcut yedeğinizi koruyun.');
   throw error;
  }
 }
 async function exportBackup(name,kind,verified){try{const backup=await create();if(verified)backup.verification={generatedBy:'MualliMate Sistem Sağlığı',dataVersion:APP_DATA_VERSION,additionalStores:backup.additionalData.stores.map(s=>({name:s.name,store:s.store,records:s.rows.length}))};await downloadBlob(JSON.stringify(backup,null,2),name,'application/json');window.mmRecordBackup884?.(backup,kind);return backup}catch(error){console.error(error);alert('Tam yedek hazırlanamadı: '+error.message)}}
 window.exportData=()=>exportBackup('ogrenci_takip_TAM_yedek.json','tam');
 window.exportTransferBackup=()=>exportBackup('ogrenci_takip_CIHAZ_AKTARIM_TAM_yedegi.json','cihaz aktarım');
 window.exportVerifiedBackup884=()=>exportBackup('MualliMate_DOGRULANMIS_TAM_YEDEK.json','doğrulanmış tam yedek',true);
 window.MualliMateBackup245={create,apply,validate,supplement};
})();
