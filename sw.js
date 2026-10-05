const CACHE_NAME='ots-v7.8.142-optic-v3-classic-portrait';
const PREVIOUS_STABLE_CACHE='ots-v7.8.119-test-analysis-mobile-table-fit';
const APP_SHELL = ['./assets/rehberlik_ataturk_v7881.png', './assets/rehberlik_istiklal_v7881.png', './index.html', './jszip.min.js', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png', './templates/ogrenci_bilgi_formu.pdf', './templates/ogrenci_gozlem_kaydi.pdf', './templates/rehberlik_servisine_yonlendirme_formu.pdf', './templates/psikolojik_destek_yonlendirme_formu.pdf', './templates/ev_ziyaret_formu.pdf', './templates/sinif_baskan_secim_tutanagi_bos.pdf', './templates/secim_sonucu_formu.pdf', './templates/exact/student_info_1.png', './templates/exact/student_info_2.png', './templates/exact/observation_1.png', './templates/exact/observation_2.png', './templates/exact/referral_1.png', './templates/exact/referral_2.png', './templates/exact/psych_1.png', './templates/exact/psych_2.png', './templates/exact/home_visit_1.png', './templates/exact/home_visit_2.png', './templates/exact/election_1.png', './templates/exact/election_result_1.png'];
self.addEventListener('install', event => { self.skipWaiting(); event.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(APP_SHELL)).catch(()=>{})); });
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
  event.respondWith((async()=>{try{const fresh=await fetch(event.request,{cache:'no-store'});const c=await caches.open(CACHE_NAME);c.put('./index.html',fresh.clone()).catch(()=>{});return fresh}catch(e){return (await caches.match('./index.html'))||Response.error()}})());return;
 }
 event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request)));
});
