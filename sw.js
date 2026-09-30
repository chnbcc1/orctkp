const CACHE_NAME='ots-v7.8.38-navigation-origin';
const APP_SHELL = ['./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png'];
self.addEventListener('install', event => { self.skipWaiting(); event.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(APP_SHELL)).catch(()=>{})); });
self.addEventListener('activate', event => { event.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', event => {
 if(event.request.method!=='GET') return;
 const url=new URL(event.request.url);
 if(event.request.mode==='navigate'||url.pathname.endsWith('/index.html')||url.pathname.endsWith('/')){
  event.respondWith((async()=>{try{const fresh=await fetch(event.request,{cache:'no-store'});const c=await caches.open(CACHE_NAME);c.put('./index.html',fresh.clone()).catch(()=>{});return fresh}catch(e){return (await caches.match('./index.html'))||Response.error()}})());return;
 }
 event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request)));
});
