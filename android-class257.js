/* Android class dashboard: measure available height and share it across cards. */
(()=>{
 'use strict';
 if(!window.MualliMateAndroidNative||window.MualliMateAndroidClass257)return;
 const b='html.mm257-class body.mm257-class',v=b+' #classView#classView';
 const css=document.createElement('style');css.id='mm-android-class257';css.textContent=`
 html.mm257-class,${b}{height:100dvh!important;min-height:0!important;max-height:100dvh!important;overflow:hidden!important;padding-bottom:0!important}
 ${b} #mobileHomeDashboard#mobileHomeDashboard,${b} #mmAllClassesScreen{display:none!important}
 ${b}>.layout,${b}>.layout>main{height:auto!important;max-height:none!important;min-height:0!important;overflow:visible!important;box-sizing:border-box!important}
 ${b}>.layout>main{padding:6px max(8px,env(safe-area-inset-right,0px)) max(6px,env(safe-area-inset-bottom,0px)) max(8px,env(safe-area-inset-left,0px))!important}
 ${v}{display:grid!important;grid-template-columns:minmax(0,1fr)!important;grid-template-rows:minmax(0,1fr) 58px!important;align-content:stretch!important;gap:7px!important;width:100%!important;height:var(--mm-class-space257,auto)!important;max-height:var(--mm-class-space257,none)!important;min-height:0!important;margin:0!important;padding:0!important;box-sizing:border-box!important;overflow-x:hidden!important;overflow-y:auto!important;overscroll-behavior:contain!important;touch-action:pan-y!important}
 ${v}>#mmClassHomeBar{display:none!important}
 ${v}>.compact-class-summary{display:grid!important;grid-template-columns:minmax(0,1fr)!important;grid-template-rows:auto minmax(0,1fr) 46px 5px!important;align-content:stretch!important;gap:7px!important;height:100%!important;min-height:0!important;max-height:none!important;padding:9px!important;margin:0!important;box-sizing:border-box!important;overflow:visible!important}
 ${v} .compact-class-head{display:grid!important;grid-template-columns:minmax(0,1fr)!important;grid-template-rows:42px 62px!important;gap:7px!important;height:auto!important;min-height:0!important;max-height:none!important;margin:0!important;padding:0!important;overflow:visible!important}
 ${v} .compact-class-head>div:first-child{width:100%!important;height:42px!important;min-height:0!important;max-height:none!important;display:flex!important;justify-content:center!important;align-items:center!important;overflow:visible!important}
 ${v} #currentClassTitle{display:none!important}
 ${v} .mm-class-picker-shell{height:42px!important;min-height:0!important;max-height:42px!important;width:min(190px,100%)!important;margin:0!important;padding:0!important;border-radius:12px!important}
 ${v} .mm-class-picker-label{font-size:25px!important;line-height:1!important;padding:0 32px 0 10px!important}
 ${v} .mm-class-picker-arrow{font-size:18px!important;right:10px!important}
 ${v} .class-top-actions{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;grid-template-rows:minmax(0,1fr)!important;gap:6px!important;height:100%!important;min-height:0!important;max-height:none!important;margin:0!important;overflow:visible!important}
 ${v} .class-top-actions button{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:3px!important;height:100%!important;min-height:0!important;max-height:none!important;min-width:0!important;margin:0!important;padding:4px 2px!important;border-radius:13px!important;box-sizing:border-box!important;overflow:visible!important}
 ${v} .class-top-actions .mm-tool-icon{font-size:22px!important;line-height:24px!important;flex:0 0 auto!important}
 ${v} .class-top-actions .mm-tool-label{font-size:11px!important;line-height:1.12!important;white-space:normal!important;text-align:center!important;overflow-wrap:anywhere!important}
 ${v} .class-module-grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;grid-template-rows:repeat(3,minmax(0,1fr))!important;grid-auto-rows:minmax(0,1fr)!important;align-items:stretch!important;gap:7px!important;height:100%!important;min-height:0!important;max-height:none!important;margin:0!important;overflow:visible!important}
 ${v} .class-module-grid .class-module-btn,${v} .class-module-grid #taskOpen249{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:3px!important;grid-column:auto!important;height:100%!important;min-height:0!important;max-height:none!important;min-width:0!important;margin:0!important;padding:5px!important;border-radius:14px!important;box-sizing:border-box!important;overflow:visible!important}
 ${v} .class-module-btn span{font-size:25px!important;line-height:27px!important;margin:0!important;height:auto!important;flex:0 0 auto!important}
 ${v} .class-module-btn b{font-size:14px!important;line-height:1.12!important;white-space:normal!important;text-align:center!important;overflow-wrap:anywhere!important;margin:0!important;min-width:0!important;overflow:visible!important;letter-spacing:normal!important}
 ${v} .class-module-btn em{display:block!important;position:static!important;width:auto!important;min-width:0!important;min-height:0!important;height:auto!important;line-height:1.05!important;font-size:17px!important;margin:0!important;padding:0!important;background:transparent!important;border:0!important;flex:0 0 auto!important}
 ${v} .compact-stats.status-only{display:grid!important;grid-template-columns:1fr 1fr!important;grid-template-rows:minmax(0,1fr)!important;height:46px!important;min-height:0!important;max-height:none!important;gap:7px!important;margin:0!important;overflow:visible!important}
 ${v} .compact-stat{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:2px!important;min-height:0!important;height:100%!important;max-height:none!important;padding:3px 6px!important;margin:0!important;border-radius:12px!important;box-sizing:border-box!important}
 ${v} .compact-stat span{font-size:10px!important;line-height:1.15!important}
 ${v} .compact-stat b{font-size:18px!important;line-height:1.1!important}
 ${v} .compact-progress{height:5px!important;min-height:5px!important;max-height:5px!important;margin:0!important}
 ${v}>.overview-shortcuts{display:grid!important;grid-template-columns:1fr 1fr!important;grid-template-rows:minmax(0,1fr)!important;height:58px!important;min-height:0!important;max-height:none!important;margin:0!important;padding:0!important;gap:7px!important;overflow:visible!important}
 ${v} .overview-shortcut{display:grid!important;grid-template-columns:auto minmax(0,1fr) auto!important;gap:5px!important;align-items:center!important;height:100%!important;min-height:0!important;max-height:none!important;min-width:0!important;padding:5px 7px!important;margin:0!important;border-radius:13px!important;box-sizing:border-box!important;overflow:visible!important}
 ${v} .overview-shortcut-icon{font-size:18px!important;line-height:1!important}
 ${v} .overview-shortcut-text{min-width:0!important}
 ${v} .overview-shortcut-text b{display:block!important;font-size:11px!important;line-height:1.15!important;white-space:normal!important;overflow-wrap:anywhere!important}
 ${v} .overview-shortcut-text small{display:block!important;font-size:9px!important;line-height:1.15!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
 ${v} .overview-count{width:26px!important;min-width:26px!important;height:26px!important;line-height:24px!important;font-size:11px!important;padding:0!important;box-sizing:border-box!important}
 ${b}>header{min-height:0!important;gap:6px!important;padding-top:max(6px,env(safe-area-inset-top,0px))!important;padding-bottom:6px!important}
 ${b} #headerControls #profileChip.profile-chip{height:auto!important;min-height:62px!important;padding:7px 10px!important;grid-template-columns:42px minmax(0,1fr)!important;gap:9px!important}
 ${b} #profileChip #profileAvatarFallback,${b} #profileChip #headerProfilePhoto{width:42px!important;height:42px!important;min-width:42px!important;font-size:19px!important}
 ${b} #profileChip .profile-lines{gap:2px!important;min-width:0!important}
 ${b} #profileChip .profile-lines b{font-size:14px!important;line-height:1.15!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
 ${b} #profileChip .profile-lines span{font-size:10px!important;line-height:1.2!important}
 ${b} #profileChip .profile-lines #headerSchoolName>.mm-profile-school{margin-top:2px!important}
 ${b}>header .mm-menu-btn,${b}>header .mm-alert-bell{width:40px!important;height:40px!important;min-height:40px!important;font-size:25px!important}
 ${b}>header .premium-brand>img{width:38px!important;height:38px!important;min-width:38px!important}
 ${b}>header .premium-brand strong{font-size:20px!important}
 ${b}>header .premium-brand .tiny{font-size:9px!important;padding:2px 4px!important}
 @media(orientation:landscape){
 ${v}{grid-template-rows:minmax(0,1fr) 48px!important;gap:5px!important}
 ${v}>.compact-class-summary{grid-template-rows:48px minmax(0,1fr) 34px 4px!important;gap:5px!important;padding:6px!important}
 ${v} .compact-class-head{grid-template-columns:110px minmax(0,1fr)!important;grid-template-rows:48px!important;gap:6px!important}
 ${v} .compact-class-head>div:first-child,${v} .mm-class-picker-shell{height:48px!important;max-height:48px!important;width:110px!important}
 ${v} .mm-class-picker-label{font-size:24px!important}
 ${v} .class-top-actions button{flex-direction:row!important;gap:4px!important}
 ${v} .class-top-actions .mm-tool-icon{font-size:18px!important;line-height:20px!important}
 ${v} .class-top-actions .mm-tool-label{font-size:10px!important}
 ${v} .class-module-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-template-rows:repeat(2,minmax(0,1fr))!important;gap:5px!important}
 ${v} .class-module-grid .class-module-btn,${v} .class-module-grid #taskOpen249{flex-direction:row!important;gap:5px!important;padding:4px 6px!important}
 ${v} .class-module-btn span{font-size:20px!important;line-height:22px!important}
 ${v} .class-module-btn b{font-size:12px!important}
 ${v} .class-module-btn em{font-size:16px!important}
 ${v} .compact-stats.status-only{height:34px!important}
 ${v} .compact-stat{flex-direction:row!important;gap:7px!important}
 ${v} .compact-progress{height:4px!important;min-height:4px!important;max-height:4px!important}
 ${v}>.overview-shortcuts{height:48px!important}
 ${b} #headerControls #profileChip.profile-chip{min-height:46px!important;padding:4px 8px!important;grid-template-columns:32px minmax(0,1fr)!important}
 ${b} #profileChip #profileAvatarFallback,${b} #profileChip #headerProfilePhoto{width:32px!important;height:32px!important;min-width:32px!important;font-size:14px!important}
 ${b} #profileChip .profile-lines b{font-size:12px!important}
 ${b} #profileChip .profile-lines span{font-size:9px!important}
 }
 ${b}.mm257-short #classView#classView .class-module-btn span{font-size:20px!important;line-height:22px!important}
 ${b}.mm257-short #classView#classView .class-module-btn b{font-size:12px!important}
 ${b}.mm257-short #classView#classView .class-module-btn em{font-size:15px!important}
 ${b}.mm257-short #classView#classView>.compact-class-summary{grid-template-rows:auto minmax(0,1fr) 38px 4px!important;gap:5px!important;padding:7px!important}
 ${b}.mm257-short #classView#classView .compact-class-head{grid-template-rows:38px 54px!important;gap:5px!important}
 ${b}.mm257-short #classView#classView .compact-class-head>div:first-child,${b}.mm257-short #classView#classView .mm-class-picker-shell{height:38px!important;max-height:38px!important}
 ${b}.mm257-short #classView#classView .class-top-actions .mm-tool-icon{font-size:18px!important;line-height:20px!important}
 ${b}.mm257-short #classView#classView .class-top-actions .mm-tool-label{font-size:10px!important}
 ${b}.mm257-short #classView#classView .compact-stats.status-only{height:38px!important}
 ${b}.mm257-scroll #classView#classView{grid-template-rows:minmax(var(--mm-class-min257),1fr) 58px!important}
 @media(orientation:portrait){
 ${b}.mm257-tight #classView#classView{grid-template-rows:minmax(0,1fr) 48px!important;gap:5px!important}
 ${b}.mm257-tight #classView#classView .compact-class-head{grid-template-rows:34px 44px!important}
 ${b}.mm257-tight #classView#classView .compact-class-head>div:first-child,${b}.mm257-tight #classView#classView .mm-class-picker-shell{height:34px!important;max-height:34px!important}
 ${b}.mm257-tight #classView#classView>.compact-class-summary{grid-template-rows:auto minmax(0,1fr) 34px 4px!important}
 ${b}.mm257-tight #classView#classView .class-module-grid .class-module-btn,${b}.mm257-tight #classView#classView .class-module-grid #taskOpen249{display:grid!important;grid-template-columns:22px minmax(0,1fr) auto!important;gap:4px!important;padding:4px!important}
 ${b}.mm257-tight #classView#classView .class-module-btn b{text-align:left!important;font-size:11px!important}
 ${b}.mm257-tight #classView#classView .class-top-actions .mm-tool-icon{font-size:16px!important;line-height:18px!important}
 ${b}.mm257-tight #classView#classView .class-top-actions .mm-tool-label{font-size:9px!important}
 ${b}.mm257-tight #classView#classView .class-top-actions button{gap:1px!important;padding:2px!important}
 ${b}.mm257-tight #classView#classView .compact-stats.status-only{height:34px!important}
 ${b}.mm257-tight #classView#classView>.overview-shortcuts{height:48px!important}
 ${b}.mm257-tight.mm257-scroll #classView#classView{grid-template-rows:minmax(var(--mm-class-min257),1fr) 48px!important}
 }
 @media(orientation:landscape){${b}.mm257-short #classView#classView>.compact-class-summary{grid-template-rows:44px minmax(0,1fr) 30px 4px!important;gap:4px!important;padding:5px!important}${b}.mm257-short #classView#classView .compact-class-head{grid-template-rows:44px!important}${b}.mm257-short #classView#classView .compact-class-head>div:first-child,${b}.mm257-short #classView#classView .mm-class-picker-shell{height:44px!important;max-height:44px!important}${b}.mm257-short #classView#classView .compact-stats.status-only{height:30px!important}${b}.mm257-scroll #classView#classView{grid-template-rows:minmax(var(--mm-class-min257),1fr) 48px!important}}
 `;document.head.appendChild(css);
 let frame=0;
 function toggle(e,c,on){if(e.classList.contains(c)!==on)e.classList.toggle(c,on)}
 function put(e,k,v){if(e.style.getPropertyValue(k)!==v)e.style.setProperty(k,v)}
 function update(){frame=0;const body=document.body,html=document.documentElement,view=document.getElementById('classView');if(!view)return;
  const active=body.classList.contains('mm-class-open')&&!body.classList.contains('mm-all-classes-open')&&!body.classList.contains('class-module-page-open')&&getComputedStyle(view).display!=='none';
  toggle(body,'mm257-class',active);toggle(html,'mm257-class',active);if(!active){toggle(body,'mm257-short',false);toggle(body,'mm257-tight',false);toggle(body,'mm257-scroll',false);return;}
  const vh=Math.min(innerHeight,visualViewport?.height||innerHeight),space=Math.max(0,Math.floor(vh-view.getBoundingClientRect().top-8)),land=matchMedia('(orientation:landscape)').matches;
  put(view,'--mm-class-space257',space+'px');toggle(body,'mm257-short',space<(land?310:530));toggle(body,'mm257-tight',!land&&space<455);
  // Keep every control reachable on exceptionally small windows rather than clipping it.
  const minimum=land?210:300;put(view,'--mm-class-min257',minimum+'px');toggle(body,'mm257-scroll',space<minimum+53);
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(update)}
 function start(){const view=document.getElementById('classView');if(!view)return;new MutationObserver(schedule).observe(view,{childList:true,subtree:true,characterData:true});
  const clean=s=>String(s||'').split(/\s+/).filter(c=>!['mm257-class','mm257-short','mm257-tight','mm257-scroll'].includes(c)).sort().join(' ');
  new MutationObserver(rs=>{if(rs.some(r=>clean(r.oldValue)!==clean(document.body.className)))schedule()}).observe(document.body,{attributes:true,attributeFilter:['class'],attributeOldValue:true});
  if(window.ResizeObserver){const ro=new ResizeObserver(schedule);for(const e of document.querySelectorAll('body>header,#profileChip,#classView,body>.layout>main'))ro.observe(e);}schedule();
 }
 window.MualliMateAndroidClass257={version:257,refresh:schedule};for(const event of ['resize','orientationchange','pageshow'])addEventListener(event,schedule,{passive:true});window.visualViewport?.addEventListener('resize',schedule,{passive:true});
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
