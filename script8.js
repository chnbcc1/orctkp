
(function(){
  function setLocked(on){
    document.documentElement.classList.toggle('app-locked',!!on);
    document.body.classList.toggle('app-locked',!!on);
  }
  const oldInit=window.initLock;
  window.initLock=function(){ if(oldInit) oldInit.apply(this,arguments); setLocked(!document.getElementById('lockScreen').classList.contains('hidden')); };
  const oldUnlock=window.unlockApp;
  window.unlockApp=function(){ const r=oldUnlock&&oldUnlock.apply(this,arguments); if(document.getElementById('lockScreen').classList.contains('hidden')) setLocked(false); return r; };
  const oldSetup=window.setupPin;
  window.setupPin=function(){ const r=oldSetup&&oldSetup.apply(this,arguments); if(document.getElementById('lockScreen').classList.contains('hidden')) setLocked(false); return r; };
  const oldLockNow=window.lockNow;
  window.lockNow=function(){ setLocked(true); return oldLockNow&&oldLockNow.apply(this,arguments); };
  document.addEventListener('DOMContentLoaded',function(){ const s=document.getElementById('lockScreen'); if(s&&!s.classList.contains('hidden')) setLocked(true); });
})();
