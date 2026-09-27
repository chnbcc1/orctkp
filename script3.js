if("serviceWorker" in navigator && (location.protocol==="https:" || location.hostname==="localhost")){
  // v7.6.64-JPEG — Sessiz PWA güncellemesi: kullanıcıya güncelleme uyarısı gösterilmez
  // ve aktif oturum güncelleme nedeniyle yeniden yüklenmez.
  navigator.serviceWorker.register("./sw.js?v=7.7.58",{updateViaCache:"none"}).then(reg=>{
    reg.update().catch(()=>{});
    setInterval(()=>reg.update().catch(()=>{}),60*60*1000);
  }).catch(()=>{});
}