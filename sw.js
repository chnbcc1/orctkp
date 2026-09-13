
const CACHE="ogrenci-takip-v6-6-private";
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
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener("activate",event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET") return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin){
    event.respondWith(new Response("Blocked by Local Data Mode",{status:403,statusText:"Blocked"}));
    return;
  }
  event.respondWith(
    caches.match(event.request).then(cached=>{
      if(cached) return cached;
      if(event.request.mode==="navigate") return caches.match("./index.html");
      return new Response("Not cached",{status:404,statusText:"Offline"});
    })
  );
});
