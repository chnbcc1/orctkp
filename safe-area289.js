/* Landscape iPhone safe areas: fill only the missing part of each surface's
   existing gutter. Insets never accumulate and never alter exported pages. */
(()=>{'use strict';if(window.MualliMateSafeArea289)return;
const root=document.documentElement,body=document.body;
const ios=/iPhone|iPad|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
const style=document.createElement('style');style.id='mm-safe-area289';style.textContent=':root{--mm-safe-inset-left289:env(safe-area-inset-left,0px);--mm-safe-inset-right289:env(safe-area-inset-right,0px)}';document.head.appendChild(style);
const saved=new Map();let frame=0;
const properties=['border-left-width','border-right-width','border-left-style','border-right-style','border-left-color','border-right-color','box-sizing'];
const known='body>header,main,#lockScreen,#modal.open,#classModuleOverlay.open,#mmMobileDrawer.open,#schedule266,.s271shade,#teacherFileCard236,#teacherFilePreview,#worksheetStudio887,#ws255panel:not([hidden]),#wsDrafts887,#ws253cropper,#mm274order,#s272panel,#outputPickerOverlay,#docExportMenu,#recovery810Overlay,#dutySwapOverlay,#mm225ScheduleBackdrop,#mmBottomNav,.ws-overlay887,.ws-drafts887,.duty-swap-underlay,.guidance-blank-menu,.doc-export-menu,.guidance-preview-sheet,.doc-print-sheet,.mm-optic-review795,.mm-optic-preview795,.exact-form-preview7862,.blank-exact-preview7863,[role="dialog"],dialog[open]';
const number=v=>parseFloat(v)||0;
function remember(node,css){const values=new Map(properties.map(p=>[p,[node.style.getPropertyValue(p),node.style.getPropertyPriority(p)]]));const item={values,left:number(css.borderLeftWidth),right:number(css.borderRightWidth)};saved.set(node,item);return item;}
function write(node,key,value){if(node.style.getPropertyValue(key)!==value||node.style.getPropertyPriority(key)!=='important')node.style.setProperty(key,value,'important');}
function release(node,item){for(const [key,[value,priority]]of item.values)if(value)node.style.setProperty(key,value,priority);else node.style.removeProperty(key);saved.delete(node);}
function sync(){frame=0;const css=getComputedStyle(root),left=Math.max(0,number(css.getPropertyValue('--mm-safe-inset-left289'))),right=Math.max(0,number(css.getPropertyValue('--mm-safe-inset-right289'))),active=ios&&innerWidth>innerHeight&&(left>0||right>0);
 if(!active){for(const [n,s]of saved)release(n,s);return;}
 // Include dynamically created tool/preview layers, even if they have no ID.
 const fixed=[...new Set([...body.children,...body.querySelectorAll('[style*="position:fixed"],[style*="position: fixed"]')])].filter(n=>!n.matches('script,style,link,#mmIosEdge279,#mmDrawerBackdrop')&&getComputedStyle(n).position==='fixed'&&number(getComputedStyle(n).zIndex)>30);
 const nodes=[...new Set([...document.querySelectorAll(known),...fixed])].sort((a,b)=>a===b?0:a.compareDocumentPosition(b)&Node.DOCUMENT_POSITION_FOLLOWING?-1:1);
 for(const [n,s]of saved)if(!n.isConnected)release(n,s);
 for(const node of nodes){if(node.hidden||node.closest('[hidden],#modal:not(.open),#classModuleOverlay:not(.open),#mmMobileDrawer:not(.open)'))continue;const c=getComputedStyle(node),r=node.getBoundingClientRect();if(c.display==='none'||c.visibility==='hidden'||r.width<innerWidth*.35||r.height<35||r.right<=0||r.left>=innerWidth)continue;
  const old=saved.get(node),baseL=old?.left??number(c.borderLeftWidth),baseR=old?.right??number(c.borderRightWidth);
  const extraL=Math.max(0,left-r.left-number(c.paddingLeft)-baseL),extraR=Math.max(0,right-(innerWidth-r.right)-number(c.paddingRight)-baseR);
  if(extraL<.5&&extraR<.5&&!old)continue;
  const entry=old||remember(node,c);
  // A transparent edge inside the surface's border box narrows its content,
  // without competing with the keyboard controller's restored padding styles.
  write(node,'box-sizing','border-box');
  for(const [side,extra,base]of [['left',extraL,entry.left],['right',extraR,entry.right]]){
   write(node,'border-'+side+'-width',(Math.round((base+extra)*100)/100)+'px');
   if(extra>=.5){write(node,'border-'+side+'-style','solid');write(node,'border-'+side+'-color','transparent');}
   else for(const suffix of ['style','color']){const key='border-'+side+'-'+suffix,[value,priority]=entry.values.get(key);if(value){if(node.style.getPropertyValue(key)!==value||node.style.getPropertyPriority(key)!==priority)node.style.setProperty(key,value,priority);}else if(node.style.getPropertyValue(key))node.style.removeProperty(key);}
  }
 }
}
function schedule(){if(!frame)frame=requestAnimationFrame(sync);}
new MutationObserver(schedule).observe(body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','hidden','open','style']});
// CSS safe-area values can settle a frame after the orientation event.
for(const name of ['resize','orientationchange','pageshow'])addEventListener(name,schedule,{passive:true});
window.visualViewport?.addEventListener('resize',schedule,{passive:true});
if(window.ResizeObserver){const ro=new ResizeObserver(schedule);ro.observe(root);}
window.MualliMateSafeArea289={version:289,refresh:schedule,inspect:()=>({left:number(getComputedStyle(root).getPropertyValue('--mm-safe-inset-left289')),right:number(getComputedStyle(root).getPropertyValue('--mm-safe-inset-right289')),protected:saved.size})};sync();
})();
