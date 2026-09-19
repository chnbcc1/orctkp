
const CACHE="ogrenci-takip-v7.6.54";
const ASSETS=[
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/apple-touch-icon.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install",event=>{
  event.waitUntil(
    caches.open(CACHE)
      .then(cache=>cache.addAll(ASSETS))
  );
});

self.addEventListener("activate",event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener("message",event=>{
  if(event.data==="SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET") return;

  const url=new URL(event.request.url);

  // Yerel Veri Modu: dış origin istekleri engellenir. Tek istisna PDF.js motorunun sabit iki dosyasıdır.
  if(url.origin!==self.location.origin){
    const allowedPDFAssets=new Set([
      "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js",
      "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js"
    ]);
    if(allowedPDFAssets.has(url.href)){
      event.respondWith(fetch(event.request,{cache:"force-cache"}));
      return;
    }
    event.respondWith(new Response("Blocked by Local Data Mode",{status:403,statusText:"Blocked"}));
    return;
  }

  // Sayfa gezinmelerinde ağdaki güncel uygulamayı tercih et.
  // Bu yalnızca aynı GitHub Pages origin'inden uygulama dosyasını çeker;
  // öğrenci verisi gönderilmez.
  if(event.request.mode==="navigate"){
    event.respondWith(
      fetch(event.request,{cache:"no-store"})
        .then(resp=>{
          const copy=resp.clone();
          caches.open(CACHE).then(cache=>cache.put("./index.html",copy)).catch(()=>{});
          return resp;
        })
        .catch(()=>caches.match("./index.html"))
    );
    return;
  }

  // Diğer yerel dosyalarda cache-first + arka planda güncelleme.
  event.respondWith(
    caches.match(event.request).then(cached=>{
      const network = fetch(event.request,{cache:"no-store"}).then(resp=>{
        const copy=resp.clone();
        caches.open(CACHE).then(cache=>cache.put(event.request,copy)).catch(()=>{});
        return resp;
      }).catch(()=>null);
      return cached || network.then(resp=>resp || new Response("Offline",{status:404}));
    })
  );
});
