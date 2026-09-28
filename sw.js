const CACHE_NAME = "ots-v7.7.74";
const CORE = ["./", "./index.html"];
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE)).catch(()=>{}));
});
self.addEventListener("activate", event => {
  event.waitUntil((async()=>{
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (req.mode === "navigate" || url.pathname.endsWith("/index.html") || url.pathname.endsWith("/")) {
    event.respondWith((async()=>{
      try {
        const fresh = await fetch(req, {cache:"no-store"});
        const cache = await caches.open(CACHE_NAME);
        cache.put("./index.html", fresh.clone()).catch(()=>{});
        return fresh;
      } catch(e) {
        return (await caches.match("./index.html")) || (await caches.match("./"));
      }
    })());
    return;
  }
  event.respondWith((async()=>{
    const cached = await caches.match(req);
    const network = fetch(req).then(async res=>{
      if(res && res.ok){ const cache=await caches.open(CACHE_NAME); cache.put(req,res.clone()).catch(()=>{}); }
      return res;
    }).catch(()=>null);
    return cached || (await network) || Response.error();
  })());
});
