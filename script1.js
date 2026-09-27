
/* v7.6.51 — Masaüstü + Android PIN doğrudan buton düzeltmesi.
   Ana uygulama betiğinde daha sonra bir hata oluşsa bile PIN kutusunu ilk anda görünür yapar. */
(function(){
  const SETTINGS_KEY_BOOT="odevTakipV5Settings";
  function byId(id){return document.getElementById(id)}
  function pinHashBoot(v){let h=2166136261>>>0;v=String(v||"");for(let i=0;i<v.length;i++){h^=v.charCodeAt(i);h=Math.imul(h,16777619)}return (h>>>0).toString(16)}
  function readSettingsBoot(){try{return JSON.parse(localStorage.getItem(SETTINGS_KEY_BOOT)||"{}")||{}}catch(e){return {}}}
  function writeSettingsBoot(v){try{localStorage.setItem(SETTINGS_KEY_BOOT,JSON.stringify(v));return true}catch(e){return false}}
  function showPinBoot(){
    const screen=byId("lockScreen"), setup=byId("setupPinBox"), login=byId("loginPinBox"), info=byId("lockInfo");
    if(!screen||!setup||!login)return;
    screen.classList.remove("hidden");
    screen.style.display="flex";
    const st=readSettingsBoot();
    if(st.pinHash){setup.style.display="none";login.style.display="block";if(info)info.textContent="PIN ile giriş yapın."}
    else{setup.style.display="block";login.style.display="none";if(info)info.textContent="İlk kullanım: cihaz PIN'i oluşturun."}
  }
  // Ana betik yüklenemese bile masaüstünde kilit ekranı çalışabilsin.
  function unlockPinBoot(){
    const st=readSettingsBoot(), input=byId("loginPin");
    if(!st.pinHash){showPinBoot();return false}
    if(pinHashBoot(input&&input.value)!==st.pinHash){alert("PIN yanlış.");return false}
    const screen=byId("lockScreen");if(screen){screen.classList.add("hidden");screen.style.display="none"}
    if(input)input.value="";
    document.documentElement.classList.remove("app-locked");document.body.classList.remove("app-locked");
    try{if(window.settings&&typeof window.settings==="object")window.settings.pinHash=st.pinHash}catch(e){}
    try{if(typeof window.render==="function")window.render()}catch(e){}
    return false;
  }
  function setupPinBoot(){
    const a=(byId("newPin")||{}).value||"", b=(byId("newPin2")||{}).value||"";
    if(!/^\d{4,8}$/.test(a)){alert("PIN 4-8 rakam olmalı.");return false}
    if(a!==b){alert("PIN'ler aynı değil.");return false}
    const st=readSettingsBoot();st.pinHash=pinHashBoot(a);
    if(!writeSettingsBoot(st)){alert("PIN bu tarayıcıda kaydedilemedi.");return false}
    try{if(typeof settings!=="undefined"&&settings)settings.pinHash=st.pinHash}catch(e){}
    const screen=byId("lockScreen");if(screen){screen.classList.add("hidden");screen.style.display="none"}
    document.documentElement.classList.remove("app-locked");document.body.classList.remove("app-locked");
    try{if(typeof window.render==="function")window.render()}catch(e){}
    return false;
  }
  window.__pinBootSetup=setupPinBoot;
  window.__pinBootUnlock=unlockPinBoot;
  function bindPinKeys(){
    const a=byId("newPin"), b=byId("newPin2"), login=byId("loginPin");
    [a,b].forEach(x=>{if(x&&!x.dataset.pinKeyBound){x.dataset.pinKeyBound="1";x.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();setupPinBoot()}})}});
    if(login&&!login.dataset.pinKeyBound){login.dataset.pinKeyBound="1";login.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();unlockPinBoot()}})}
  }
  showPinBoot();bindPinKeys();
  document.addEventListener("DOMContentLoaded",function(){showPinBoot();bindPinKeys()},{once:true});
})();
