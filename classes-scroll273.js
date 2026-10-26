/* Keep the classes page in the viewport; only its list scrolls when necessary. */
(()=>{'use strict';if(window.MualliMateClassesScroll273)return;
const root=document.documentElement,body=document.body,mq=matchMedia('(max-width:700px), (orientation:landscape) and (max-height:600px) and (hover:none) and (pointer:coarse)');
const header=document.querySelector('body>header'),spacer=document.createElement('div');spacer.id='mm276headerSpace';spacer.setAttribute('aria-hidden','true');if(header)header.before(spacer);
const style=document.createElement('style');style.id='mm-classes-scroll273';style.textContent=`
html.mm-classes-scroll273,body.mm-classes-scroll273{height:100%!important;max-height:100%!important;overflow:hidden!important;overscroll-behavior:none!important}
body.mm-classes-scroll273{position:fixed!important;inset:0!important;width:100%!important;height:auto!important;max-height:none!important;padding-bottom:0!important}
html.mm-shell278,body.mm-shell278{overflow:hidden!important;overscroll-behavior:none!important;height:100%!important;max-height:100%!important}
body.mm-shell278{position:fixed!important;inset:0!important;width:100%!important;height:auto!important;max-height:none!important;padding-bottom:0!important}
body.mm-shell278>header{position:fixed!important;top:var(--safe-top,0px)!important;left:0!important;right:0!important;width:100%!important;background:#043c35!important;z-index:20;filter:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important}
body.mm-shell278 #mm276headerSpace{display:block;height:var(--mm-header-height276,0px)}
body.mm-shell278.mm-class-open .layout{min-height:0!important;height:auto!important;max-height:none!important}
body.mm-shell278.mm-class-open main{height:var(--mm-class-main-height278)!important;max-height:var(--mm-class-main-height278)!important;min-height:0!important;overflow-y:auto!important;overflow-x:hidden!important;overscroll-behavior:contain;touch-action:pan-y;-webkit-overflow-scrolling:touch;padding-bottom:calc(14px + env(safe-area-inset-bottom,0px))!important;scrollbar-width:none}
body.mm-shell278.mm-class-open main::-webkit-scrollbar{display:none}
@media(orientation:portrait){body.mm-shell278.mm-class-open #classView{height:auto!important;max-height:none!important;min-height:0!important;overflow:visible!important}}
#mm276headerSpace{display:none}
body.mm-shell278 #mm276headerSpace{display:block}
body.mm-classes-scroll273 #mm276headerSpace{display:block;height:var(--mm-header-height276,0px);flex:none}
body.mm-classes-scroll273>header{position:fixed!important;top:var(--safe-top,0px)!important;left:0!important;right:0!important;width:100%!important;z-index:20;background:#043c35!important;filter:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important}
body.mm-classes-scroll273 .layout,body.mm-classes-scroll273 main{height:auto!important;max-height:none!important;min-height:0!important;overflow:visible!important}
body.mm-classes-scroll273 main{padding-bottom:0!important;margin-bottom:0!important}
body.mm-classes-scroll273 #mmAllClassesScreen{box-sizing:border-box!important;display:block!important;height:var(--mm-classes-height273)!important;max-height:var(--mm-classes-height273)!important;min-height:0!important;overflow-y:auto!important;overflow-x:hidden!important;-webkit-overflow-scrolling:touch;overscroll-behavior-y:contain;touch-action:pan-y!important;padding-bottom:calc(16px + env(safe-area-inset-bottom,0px))!important;scroll-padding-top:86px}
body.mm-classes-scroll273 #mmAllClassesScreen .mm-classes-page-head{position:sticky;top:0;z-index:2}
`;document.head.appendChild(style);
let frame=0,observed=null,ro=null;
function setClassShell(node,on){if(node.classList.contains('mm-shell278')!==on)node.classList.toggle('mm-shell278',on);}
function setClass(node,on){if(node.classList.contains('mm-classes-scroll273')!==on)node.classList.toggle('mm-classes-scroll273',on);}
function sync(){frame=0;const host=document.getElementById('mmAllClassesScreen'),lock=document.getElementById('lockScreen'),blocked=body.classList.contains('modal-page-locked')||!!document.querySelector('#modal.open,#mmMobileDrawer.open,.class-module-overlay.open')||!!(lock&&!lock.classList.contains('hidden'));
 const shell=mq.matches&&(body.classList.contains('mm-class-open')||body.classList.contains('mm-all-classes-open'))&&!(lock&&!lock.classList.contains('hidden'));
 setClassShell(root,shell);setClassShell(body,shell);
 if(shell&&header){const h=header.getBoundingClientRect().height+'px';if(body.style.getPropertyValue('--mm-header-height276')!==h)body.style.setProperty('--mm-header-height276',h);const main=document.querySelector('main'),v=window.visualViewport;if(main){const available=Math.max(0,Math.floor((v?v.offsetTop+v.height:innerHeight)-main.getBoundingClientRect().top))+'px';if(body.style.getPropertyValue('--mm-class-main-height278')!==available)body.style.setProperty('--mm-class-main-height278',available);}}
 const active=mq.matches&&body.classList.contains('mm-all-classes-open')&&host&&!host.hidden&&!blocked;
 setClass(root,!!active);setClass(body,!!active);
 if(!active){if(shell&&window.ResizeObserver&&!ro){ro=new ResizeObserver(schedule);if(header)ro.observe(header);}return;}
 if(header){const h=header.getBoundingClientRect().height+'px';if(body.style.getPropertyValue('--mm-header-height276')!==h)body.style.setProperty('--mm-header-height276',h);}
 // Use the visible viewport, including Safari/PWA rotation and browser chrome.
 const v=window.visualViewport,bottom=v?v.offsetTop+v.height:innerHeight,top=host.getBoundingClientRect().top,height=Math.max(0,Math.floor(bottom-top)),value=height+'px';
 if(host.style.getPropertyValue('--mm-classes-height273')!==value)host.style.setProperty('--mm-classes-height273',value);
 if(window.ResizeObserver&&observed!==host){ro?.disconnect();ro=new ResizeObserver(schedule);ro.observe(host);const header=document.querySelector('header');if(header)ro.observe(header);observed=host;}
}
function schedule(){if(!frame)frame=requestAnimationFrame(sync);}
const mo=new MutationObserver(schedule);mo.observe(body,{attributes:true,attributeFilter:['class']});
const host=document.getElementById('mmAllClassesScreen');if(host)new MutationObserver(schedule).observe(host,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden']});
const modal=document.getElementById('modal');if(modal)new MutationObserver(schedule).observe(modal,{attributes:true,attributeFilter:['class']});
addEventListener('resize',schedule,{passive:true});addEventListener('orientationchange',schedule,{passive:true});
if(window.visualViewport){visualViewport.addEventListener('resize',schedule,{passive:true});visualViewport.addEventListener('scroll',schedule,{passive:true});}
// The legacy return path scrollIntoView() moves the document underneath the header.
const oldClose=window.closeClassModule;
window.closeClassModule=function(scrollBack=true){if(mq.matches&&body.classList.contains('mm-class-open')&&activeClassModuleOrigin==='class'){const main=document.querySelector('main'),top=main?.scrollTop||0;const r=oldClose.call(this,false);if(scrollBack)requestAnimationFrame(()=>{if(body.classList.contains('mm-class-open')&&!body.classList.contains('class-module-page-open')){if(main)main.scrollTop=top;window.scrollTo(0,0);schedule();}});return r;}return oldClose.apply(this,arguments);};
if(document.fonts?.ready)document.fonts.ready.then(schedule);schedule();window.MualliMateClassesScroll273={version:278,refresh:schedule};
})();
