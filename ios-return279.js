/* iOS standalone: one persistent opaque viewport edge across every app surface. */
(()=>{'use strict';if(window.MualliMateReturn279)return;
const root=document.documentElement,body=document.body,header=document.querySelector('body>header'),main=document.querySelector('main'),$=id=>document.getElementById(id);
const ios=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1),standalone=matchMedia('(display-mode:standalone)'),mobile=matchMedia('(max-width:700px), (orientation:landscape) and (max-height:600px) and (hover:none) and (pointer:coarse)');
let frame=0,currentRoute='',surface='',lastActive=false;
const positions=new Map(),guard=document.createElement('div');guard.id='mmIosEdge279';guard.setAttribute('aria-hidden','true');guard.setAttribute('inert','');
const style=document.createElement('style');style.id='mm-ios-return279';style.textContent=`
#mmIosEdge279{display:none}
html.mm-ios-edge279 #mmIosEdge279{display:block!important;position:fixed!important;inset:0 0 auto 0!important;width:100%!important;height:calc(var(--safe-top,env(safe-area-inset-top,0px)) + 1px)!important;background:var(--mm-edge-color279,#043c35)!important;opacity:1!important;pointer-events:none!important;z-index:2147483647!important;filter:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;transform:none!important;transition:none!important;contain:paint}
html.mm-ios-frame279,body.mm-ios-frame279{height:100%!important;max-height:100%!important;overflow:hidden!important;overscroll-behavior:none!important}
body.mm-ios-frame279{position:fixed!important;inset:0!important;width:100%!important;height:auto!important;max-height:none!important;margin:0!important;padding-top:var(--safe-top,env(safe-area-inset-top,0px))!important;padding-bottom:0!important}
body.mm-ios-frame279>header{position:fixed!important;top:calc(var(--safe-top,env(safe-area-inset-top,0px)) + 1px)!important;left:0!important;right:0!important;width:100%!important;background:#043c35!important;filter:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;isolation:isolate}
body.mm-ios-frame279 #mm276headerSpace{display:block!important;height:var(--mm-header-space279)!important;min-height:var(--mm-header-space279)!important}
body.mm-ios-frame279 .layout{min-height:0!important;max-height:none!important;height:auto!important;overflow:visible!important}
body.mm-ios-frame279 main{box-sizing:border-box!important;height:var(--mm-main-height279)!important;max-height:var(--mm-main-height279)!important;min-height:0!important;overflow-y:auto!important;overflow-x:hidden!important;overscroll-behavior:contain!important;-webkit-overflow-scrolling:touch;touch-action:pan-y;scrollbar-width:none;scroll-behavior:auto!important;padding-bottom:calc(16px + env(safe-area-inset-bottom,0px))!important}
body.mm-ios-frame279 main::-webkit-scrollbar{display:none!important}
body.mm-ios-frame279.mm-all-classes-open main{overflow:hidden!important;padding-bottom:0!important}
body.mm-ios-frame279:not(.mm-class-open):not(.mm-all-classes-open) #mobileHomeDashboard{height:auto!important;min-height:0!important;max-height:none!important;overflow:visible!important;margin-bottom:0!important}
body.mm-ios-frame279 #modal{padding-top:calc(env(safe-area-inset-top,0px) + 12px)!important;padding-bottom:max(8px,env(safe-area-inset-bottom,0px))!important}
body.mm-ios-frame279 #modal>.modal-box{max-height:calc(100dvh - env(safe-area-inset-top,0px) - env(safe-area-inset-bottom,0px) - 24px)!important}
body.mm-ios-frame279 .class-module-overlay{padding-top:calc(env(safe-area-inset-top,0px) + 12px)!important}
`;document.head.appendChild(style);
function toggle(n,c,on){if(n.classList.contains(c)!==on)n.classList.toggle(c,on);}
function value(n,k,v){if(n.style.getPropertyValue(k)!==v)n.style.setProperty(k,v);}
function route(){if(body.classList.contains('mm-all-classes-open'))return 'classes';if(body.classList.contains('mm-class-open'))return 'class:'+String(typeof currentClassId==='undefined'?'':currentClassId);return 'home';}
function enabled(){return ios&&(standalone.matches||navigator.standalone===true)&&mobile.matches;}
function editing(){const e=document.activeElement;return !!(e&&e.matches('input:not([type=button]):not([type=submit]):not([type=checkbox]):not([type=radio]),textarea,select,[contenteditable=true]'));}
function sync(){frame=0;const on=enabled(),lock=$('lockScreen'),locked=lock&&!lock.classList.contains('hidden'),active=!!(on&&!locked&&header&&main);toggle(root,'mm-ios-edge279',on);if(on&&!guard.isConnected)body.appendChild(guard);toggle(root,'mm-ios-frame279',active);toggle(body,'mm-ios-frame279',active);
 if(!on){guard.remove();lastActive=false;return;}
 const nextSurface=locked?'lock':$('mmMobileDrawer')?.classList.contains('open')?'drawer':$('modal')?.classList.contains('open')?'modal':body.classList.contains('class-module-page-open')?'module':'app';
 if(nextSurface!==surface)surface=nextSurface;
 // Overlays are inset below this edge. Match the underlying header even while
 // a cream modal or module is open; sampling its title paints a visible line.
 const topSurface=locked?lock:header;
 const fallback=locked?'#0f172a':'#043c35';
 const color=topSurface?getComputedStyle(topSurface).backgroundColor:'',channels=color.match(/[\d.]+/g),opaque=channels&&(channels.length===3||Number(channels[3])===1);
 value(root,'--mm-edge-color279',opaque?color:fallback);
 if(!active){lastActive=false;return;}
 const spacer=$('mm276headerSpace');if(!spacer){const s=document.createElement('div');s.id='mm276headerSpace';s.setAttribute('aria-hidden','true');header.before(s);}
 value(body,'--mm-header-space279',(header.getBoundingClientRect().height+1)+'px');
 const v=window.visualViewport,modalOpen=!!window.MualliMateKeyboard285?.hasLayer()||!!$('modal')?.classList.contains('open'),bounds=window.MualliMateKeyboard285?.viewport(),bottom=bounds?bounds.top+bounds.height:v?v.offsetTop+v.height:innerHeight;
 // Resizing the hidden page behind a modal is unnecessary and moves its anchor.
 if(!modalOpen||!body.style.getPropertyValue('--mm-main-height279'))value(body,'--mm-main-height279',Math.max(0,Math.floor(bottom-main.getBoundingClientRect().top))+'px');
 const nextRoute=route();if(!lastActive||nextRoute!==currentRoute){currentRoute=nextRoute;main.scrollTop=positions.get(currentRoute)||0;}
 // iOS pans the visual viewport to the focused field. Do not fight that pan
 // on every viewport scroll event (the previous reset caused visible shaking).
 const keyboardVisible=!!(v&&innerHeight-v.height>100),zoomed=!!(v&&v.scale>1.05);
 lastActive=true;if(!editing()&&!keyboardVisible&&!zoomed&&scrollY!==0)window.scrollTo({top:0,left:0,behavior:'instant'});
 // Refresh the existing list's measured bounds after header spacing settles.
 if(body.classList.contains('mm-all-classes-open'))window.MualliMateClassesScroll273?.refresh();
}
function schedule(){if(!frame)frame=requestAnimationFrame(sync);}
main?.addEventListener('scroll',()=>{if(lastActive&&currentRoute===route())positions.set(currentRoute,main.scrollTop);},{passive:true});
const mo=new MutationObserver(records=>{if(records.every(r=>r.target===guard))return;schedule();});mo.observe(body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','hidden']});
const bodyStyle=new MutationObserver(schedule);bodyStyle.observe(body,{attributes:true,attributeFilter:['style']});
if(window.ResizeObserver){const ro=new ResizeObserver(schedule);if(header)ro.observe(header);}
for(const event of ['pageshow','popstate','hashchange','orientationchange','resize'])addEventListener(event,schedule,{passive:true});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule();});if(window.visualViewport){visualViewport.addEventListener('resize',schedule,{passive:true});visualViewport.addEventListener('scroll',schedule,{passive:true});}
standalone.addEventListener?.('change',schedule);mobile.addEventListener?.('change',schedule);if(document.fonts?.ready)document.fonts.ready.then(schedule);sync();
window.MualliMateReturn279={version:285,refresh:schedule,inspect:()=>({enabled:enabled(),active:body.classList.contains('mm-ios-frame279'),surface,route:currentRoute,edgeConnected:guard.isConnected,edgeTop:guard.isConnected?guard.getBoundingClientRect().top:null,edgeHeight:guard.isConnected?guard.getBoundingClientRect().height:null,documentScroll:scrollY,contentScroll:main?.scrollTop||0})};
})();
