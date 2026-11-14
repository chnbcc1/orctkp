const CACHE_NAME='ots-v7.8.324-classes-order';
const PREVIOUS_STABLE_CACHE='ots-v7.8.323-classes-order';
const APP_SHELL = ['./grade-averages321.css?v=7.8.324','./personal-optic320.js?v=7.8.324','./student-ui317.css?v=7.8.324','./booklet316.js?v=7.8.324',
'./oyss-source305.js?v=7.8.324',
'./oyss-core303.js?v=7.8.324', './oyss-report303.js?v=7.8.324', './oyss303.js?v=7.8.324','./dates312.js?v=7.8.324','./risk314.js?v=7.8.324','./risk314/sinif-risk-sablon.xlsx','./risk314/header.png','./risk314/row.png','./risk314/footer.png', './schedule-ocr266/offline302.js',
  "./storage300.js?v=7.8.324",'./duty-import297.js?v=7.8.324', './notifications296.js?v=7.8.324', './homework-buttons291.css?v=7.8.324', './button-colors290.css?v=7.8.324', './safe-area289.js?v=7.8.324', './reports288.js?v=7.8.324', './keyboard285.js?v=7.8.324', './ios-return279.js?v=7.8.324', './annual277.js?v=7.8.324', './classes-order274.js?v=7.8.324', './classes-scroll273.js?v=7.8.324', './schedule-classes272.js?v=7.8.272', './schedule-ocr266/eng.traineddata.gz', './schedule-ocr266/ENG-NOTICE', './schedule271.js?v=7.8.271', './schedule-ocr266/tesseract.min.js', './schedule-ocr266/worker.min.js', './schedule-ocr266/tesseract-core-lstm.wasm.js', './schedule-ocr266/tur.traineddata.gz', './schedule265.js?v=7.8.265', './excel264.js?v=7.8.264', './trial-report262.js', './android-class257.js', './pdf-engine246/pdf.min.js', './pdf-engine246/pdf.worker.min.js', './worksheet256.js', './tasks263.js', './lesson-subject247.js?v=7.8.324', './backup245.js', './home242.js', './menu240.js', './guidance-file-theme244.js', './assets/teacher-file/page-previews236.js', './teacher-file-theme239.js', './assets/teacher-file/paper.jpg', './assets/teacher-file/cover.jpg', './assets/teacher-file/bolum-kapaklari.pdf', './assets/teacher-file/pdf-lib.min.js', './assets/rehberlik_ataturk_v7881.png', './assets/rehberlik_istiklal_v7881.png', './index.html', './jszip.min.js', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png', './templates/ogrenci_bilgi_formu.pdf', './templates/ogrenci_gozlem_kaydi.pdf', './templates/rehberlik_servisine_yonlendirme_formu.pdf', './templates/psikolojik_destek_yonlendirme_formu.pdf', './templates/ev_ziyaret_formu.pdf', './templates/sinif_baskan_secim_tutanagi_bos.pdf', './templates/secim_sonucu_formu.pdf', './templates/exact/student_info_1.png', './templates/exact/student_info_2.png', './templates/exact/observation_1.png', './templates/exact/observation_2.png', './templates/exact/referral_1.png', './templates/exact/referral_2.png', './templates/exact/psych_1.png', './templates/exact/psych_2.png', './templates/exact/home_visit_1.png', './templates/exact/home_visit_2.png', './templates/exact/election_1.png', './templates/exact/election_result_1.png'];
self.addEventListener('install', event => { self.skipWaiting(); event.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(APP_SHELL))); });
self.addEventListener('activate', event => {
 event.waitUntil((async()=>{
   const names=await caches.keys();
   await Promise.all(names.filter(n=>n.startsWith('ots-')&&n!==CACHE_NAME&&n!==PREVIOUS_STABLE_CACHE).map(n=>caches.delete(n)));
   await self.clients.claim();
 })());
});
self.addEventListener('fetch', event => {
 if(event.request.method!=='GET') return;
 const url=new URL(event.request.url);
 if(event.request.mode==='navigate'||url.pathname.endsWith('/index.html')||url.pathname.endsWith('/')){
  event.respondWith((async()=>{try{const fresh=await fetch(event.request,{cache:'no-store'});const c=await caches.open(CACHE_NAME);c.put('./index.html',fresh.clone()).catch(()=>{});return fresh}catch(e){return (await (await caches.open(CACHE_NAME)).match('./index.html'))||Response.error()}})());return;
 }
 event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request)));
});

