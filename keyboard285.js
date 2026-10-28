/* A single iPhone keyboard/scroll owner for every app layer. No application data. */
(()=>{'use strict';if(window.MualliMateKeyboard285)return;
const root=document.documentElement,body=document.body,$=id=>document.getElementById(id);
const selectors='#modal.open,#classModuleOverlay.open,#schedule266,.s271shade,#teacherFileCard236,#teacherFilePreview,#worksheetStudio887,#ws255panel:not([hidden]),#wsDrafts887,#ws253cropper,#mm274order,#s272panel,#outputPickerOverlay,#docExportMenu,#recovery810Overlay,#dutySwapOverlay,#mmMobileDrawer.open,.guidance-preview-sheet,.doc-print-sheet,.mm-optic-review795,.mm-optic-preview795,.exact-form-preview7862,.blank-exact-preview7863,[role="dialog"][aria-modal="true"],dialog[open]';
const frozen=new Map(),parents=new Map(),managed=new Map(),timers=[],fullHeights=new Map();let frame=0,layer=null,pending=false,touching=false,tx=0,ty=0,lastHeight=0;
const enabled=()=>!!window.MualliMateReturn279?.inspect().enabled;
// Safari can shrink innerHeight AND pan the visual viewport when opening its
// keyboard. Clamping that pan to innerHeight-height incorrectly discarded it.
const viewport=()=>{const v=window.visualViewport,rawHeight=v?.height||innerHeight,scale=v?.scale||1,key=innerWidth,full=Math.max(fullHeights.get(key)||0,innerHeight,rawHeight<=innerHeight+2?rawHeight:0),height=Math.min(rawHeight,full);fullHeights.set(key,full);return {top:full-height>100||scale>1.05?Math.max(0,v?.offsetTop||0):0,height,scale,full};};
// Native option pickers do not open the text keyboard or need an editing page.
const editable=e=>!!(e?.matches?.('textarea,input:not([type=button]):not([type=submit]):not([type=checkbox]):not([type=radio]):not([type=file]):not([type=range]):not([type=hidden]),[contenteditable=true]')&&!e.disabled&&e.getClientRects().length);
const visible=e=>!!(e&&!e.hidden&&!e.closest('[hidden],[inert],#modal:not(.open),#classModuleOverlay:not(.open),#mmMobileDrawer:not(.open)')&&e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden'&&getComputedStyle(e).display!=='none'&&getComputedStyle(e).opacity!=='0');
function write(node,key,value,map=managed){let saved=map.get(node);if(!saved){saved=new Map();map.set(node,saved);}if(!saved.has(key))saved.set(key,[node.style.getPropertyValue(key),node.style.getPropertyPriority(key)]);if(node.style.getPropertyValue(key)!==value||node.style.getPropertyPriority(key)!=='important')node.style.setProperty(key,value,'important');}
function restore(map){for(const [node,saved]of map)for(const [key,[value,priority]]of saved)if(value)node.style.setProperty(key,value,priority);else node.style.removeProperty(key);map.clear();}
function stack(e){const a=[];for(let n=e;n&&n!==body;n=n.parentElement){const c=getComputedStyle(n);if(c.zIndex!=='auto')a.unshift(Number(c.zIndex)||0);}return a;}
function compare(a,b){if(a.contains(b))return -1;if(b.contains(a))return 1;const x=stack(a),y=stack(b);for(let i=0;i<Math.max(x.length,y.length);i++)if((x[i]||0)!==(y[i]||0))return(x[i]||0)-(y[i]||0);return a.compareDocumentPosition(b)&Node.DOCUMENT_POSITION_FOLLOWING?-1:1;}
function describe(node){
 if(node.id==='mmMobileDrawer')return {node,container:node,owner:node,side:true};
 if(node.id==='modal')return {node,container:node.querySelector('.modal-box'),owner:node.querySelector('.modal-box'),head:node.querySelector('.modal-head'),card:true};
 if(node.id==='classModuleOverlay')return {node,container:node.querySelector('.class-module-shell'),owner:node.querySelector('.class-module-body'),head:node.querySelector('.class-module-head')};
 if(node.id==='schedule266')return {node,container:node,owner:node.querySelector('.s266body'),head:node.querySelector('.s266header')};
 if(node.id==='teacherFileCard236')return {node,container:node.querySelector('.mm-teacher-card'),owner:node.querySelector('.mm-teacher-card-body'),head:node.querySelector('.mm-teacher-card-head')};
 const container=node.querySelector(':scope > section,:scope > .s271dialog,:scope > .mm274dialog,:scope > .s272dialog,:scope > [role=dialog]')||node;
 const owner=node.id==='worksheetStudio887'?node.querySelector('.ws-stage887'):node.querySelector('.mm-optic-review-body795,.mm-optic-preview-stage795,.guidance-preview-stage,.exact-form-stage7862,.blank-exact-stage7863')||container;
 return {node,container,owner:owner||container,head:container.querySelector(':scope > header,:scope > .ws255-panelhead,:scope > .mm274head'),card:container!==node,popover:node.hasAttribute('data-mm-popover')};
}
function choose(){
 // A role on a card inside a known backdrop describes that same layer.
 const fixed=[...body.children].filter(n=>{if(!visible(n)||n.matches('header,#lockScreen,#mmIosEdge279,#mmDrawerBackdrop,#mmMobileDrawer:not(.open)'))return false;const c=getComputedStyle(n),r=n.getBoundingClientRect();return c.position==='fixed'&&Number(c.zIndex)>30&&c.pointerEvents!=='none'&&c.opacity!=='0'&&r.right>0&&r.left<innerWidth&&r.bottom>0&&r.top<innerHeight&&r.height>innerHeight*.4&&r.width>innerWidth*.5;});
 const candidates=[...new Set([...document.querySelectorAll(selectors),...fixed])].filter(visible);
 const nodes=candidates.filter(n=>!n.matches('[role=dialog]')||!candidates.some(parent=>parent!==n&&parent.contains(n)));
 if(nodes.length)return describe(nodes.sort(compare).at(-1));
 const main=document.querySelector('main');if(editable(document.activeElement)&&main?.contains(document.activeElement))return {node:main,container:main,owner:main,head:document.querySelector('body>header'),page:true};
 return null;
}
function clearFrozen(node,entry){restore(entry.styles);for(const [s,p]of entry.scrolls)if(s.isConnected){s.scrollTop=p.top;s.scrollLeft=p.left;}frozen.delete(node);}
function backgroundNodes(front){const nodes=[];for(let n=front;n&&n!==body;n=n.parentElement){for(const sibling of n.parentElement?.children||[])if(sibling!==n&&sibling.id!=='mmIosEdge279'&&(visible(sibling)||frozen.has(sibling))&&!sibling.matches('script,style,link'))nodes.push(sibling);}return nodes;}
function freezeBackground(front,v){
 const ancestors=new Set();for(let n=front.parentElement;n&&n!==body;n=n.parentElement)ancestors.add(n);
 for(const [node,e]of parents)if(!ancestors.has(node)){restore(e.styles);if(node.isConnected){node.scrollTop=e.top;node.scrollLeft=e.left;}parents.delete(node);}
 for(const node of ancestors)if(!parents.has(node)){const styles=new Map();parents.set(node,{top:node.scrollTop,left:node.scrollLeft,styles});write(node,'overflow','hidden',styles);write(node,'touch-action','auto',styles);}
 const drawer=front.id==='mmMobileDrawer',wanted=new Set(backgroundNodes(front).filter(n=>!drawer||n.id!=='mmDrawerBackdrop')); 
 for(const [node,entry]of frozen)if(!wanted.has(node)||!node.isConnected)clearFrozen(node,entry);
 for(const node of wanted){const context=drawer||(front.hasAttribute('data-mm-popover')&&node.matches('#modal.open,#classModuleOverlay.open,#teacherFileCard236,#worksheetStudio887,#schedule266'));const old=frozen.get(node);if(old?.context===context)continue;if(old)clearFrozen(node,old);const styles=new Map(),scrolls=new Map();
  for(const s of [node,...node.querySelectorAll('*')])if(s===node||s.matches('main,.modal-box,.class-module-body,.s266body,.mm-teacher-card-body,.ws-stage887,#mmAllClassesScreen')||s.scrollHeight>s.clientHeight+1||s.scrollWidth>s.clientWidth+1)scrolls.set(s,{top:s.scrollTop,left:s.scrollLeft});
  frozen.set(node,{styles,scrolls,context});
  // Keep layout intact. Do not translate, resize or clone the underlying app.
  // Drawers retain the live page beneath their scrim; editing pages stay opaque.
  if(!context)write(node,'opacity','0',styles);write(node,'pointer-events','none',styles);write(node,'overflow','hidden',styles);write(node,'touch-action','none',styles);
 }
 holdBackground(v);
}
function holdBackground(v){
 for(const [node,e]of parents)if(node.isConnected){if(Math.abs(node.scrollTop-e.top)>.5)node.scrollTop=e.top;if(Math.abs(node.scrollLeft-e.left)>.5)node.scrollLeft=e.left;}
 for(const [node,e]of frozen){if(!node.isConnected)continue;
  for(const [s,p]of e.scrolls)if(s.isConnected){if(Math.abs(s.scrollTop-p.top)>.5)s.scrollTop=p.top;if(Math.abs(s.scrollLeft-p.left)>.5)s.scrollLeft=p.left;}
 }
}
function fit(l,v){
 const node=l.node,owner=l.owner,container=l.container;if(!owner)return;
 if(l.page){const top=Math.max(v.top,l.head?.getBoundingClientRect().bottom||v.top),available=Math.max(80,v.top+v.height-top);write(node,'position','fixed');write(node,'top',top+'px');write(node,'left','0px');write(node,'right','0px');write(node,'width','100%');write(owner,'height',available+'px');write(owner,'max-height',available+'px');}
 else{
  write(node,'position','fixed');write(node,'inset',l.side?'auto auto auto 0':'auto 0 auto 0');write(node,'top',v.top+'px');write(node,'height',v.height+'px');write(node,'max-height',v.height+'px');if(!l.side)write(node,'width','100%');write(node,'box-sizing','border-box');write(node,'overflow','hidden');write(node,'touch-action','auto');
  write(node,'padding-top','max(12px, calc(var(--safe-top, env(safe-area-inset-top, 0px)) - '+v.top+'px + 12px))');write(node,'padding-bottom','12px');
  if(!l.side&&!l.popover){const color=getComputedStyle(node).backgroundColor,parts=color.match(/[\d.]+/g);if(!parts||parts.length===4&&Number(parts[3])<1)write(node,'background','#efe4ce');}
  if(l.card){if(node.id!=='modal')write(node,'display','flex');write(node,'align-items','center');write(node,'justify-content','center');}
  if(container!==node){write(container,'max-height','100%');write(container,'box-sizing','border-box');if(!l.card)write(container,'height','100%');}
  if(node.id==='modal'){
   // On iPhone forms are one opaque full-height page, not a floating card over
   // another card. Only its content scrolls; its title stays inside that page.
   write(node,'padding-left','0px');write(node,'padding-right','0px');write(node,'padding-bottom','0px');
   write(owner,'display','block');write(owner,'height','100%');write(owner,'width','100%');write(owner,'margin','0px');write(owner,'border-radius','0px');write(owner,'border','0px');const content=$('modalBody');write(content,'overflow','visible');write(content,'height','auto');write(content,'max-height','none');write(content,'padding-bottom','32px');
   if(l.head){write(l.head,'position','sticky');write(l.head,'top','0px');write(l.head,'z-index','8');}
  }
  if(owner!==container){const available=Math.max(40,node.getBoundingClientRect().bottom-12-owner.getBoundingClientRect().top);write(owner,'max-height',available+'px');}
 }
 write(owner,'min-height','0px');write(owner,'overflow-y','auto');write(owner,'overscroll-behavior','contain');write(owner,'touch-action','pan-y pinch-zoom');write(owner,'scroll-behavior','auto');write(owner,'overflow-anchor','none');write(owner,'scroll-padding-bottom','24px');write(owner,'scrollbar-width','none');
 if(l.head&&owner.contains(l.head))write(owner,'scroll-padding-top',(l.head.getBoundingClientRect().height+12)+'px');
}
function reveal(l){
 const field=document.activeElement;if(!pending||touching||!editable(field)||!l.owner?.contains(field))return;pending=false;
 const r=l.owner.getBoundingClientRect(),h=l.head?.getBoundingClientRect(),f=field.getBoundingClientRect(),v=viewport(),top=Math.max(r.top,v.top,l.owner.contains(l.head)?h.bottom:r.top)+12,bottom=Math.min(r.bottom,v.top+v.height)-20;
 if(bottom<=top)return;let delta=0;if(f.height>bottom-top||f.top<top)delta=f.top-top;else if(f.bottom>bottom)delta=f.bottom-bottom;
 // Scroll the nearest form owner only, never scrollIntoView on the document.
 if(delta)l.owner.scrollTop+=delta;
}
function sync(){
 frame=0;if(!enabled()){restore(managed);for(const [n,e]of frozen)clearFrozen(n,e);for(const e of parents.values())restore(e.styles);parents.clear();layer=null;return;}
 const v=viewport();
 const next=choose(),changed=next?.node!==layer?.node;
 if(changed){if(!next?.popover&&!next?.side)restore(managed);layer=next;pending=editable(document.activeElement);window.MualliMateReturn279?.refresh();}
 if(!layer){if(v.full-v.height<100&&!editable(document.activeElement)){for(const [n,e]of frozen)clearFrozen(n,e);for(const e of parents.values())restore(e.styles);parents.clear();}else holdBackground(v);lastHeight=v.height;return;}
 freezeBackground(layer.node,v);fit(layer,v);
 if(Math.abs(lastHeight-v.height)>2&&!touching)pending=true;lastHeight=v.height;reveal(layer);holdBackground(v);
}
function schedule(){if(!frame)frame=requestAnimationFrame(sync);}
function focus(e){if(!enabled()||!editable(e.target))return;timers.splice(0).forEach(clearTimeout);pending=true;sync();if(layer?.owner?.contains(e.target)){const o=layer.owner,r=o.getBoundingClientRect(),h=layer.head?.getBoundingClientRect(),top=Math.max(r.top,o.contains(layer.head)?h.bottom:r.top)+16,anchor=e.target.closest('label')||e.target;o.scrollTop+=anchor.getBoundingClientRect().top-top;}for(const ms of [80,200,420])timers.push(setTimeout(()=>{if(document.activeElement===e.target&&!touching){pending=true;schedule();}},ms));}
document.addEventListener('focusin',focus,true);
document.addEventListener('focusout',()=>{timers.splice(0).forEach(clearTimeout);schedule();},true);
document.addEventListener('touchstart',e=>{touching=true;pending=false;timers.splice(0).forEach(clearTimeout);if(e.touches.length===1){tx=e.touches[0].clientX;ty=e.touches[0].clientY;}if(enabled())sync();},{capture:true,passive:true});
document.addEventListener('touchmove',e=>{
 if(!enabled()||!layer||e.touches.length!==1||!e.cancelable)return;
 const t=e.touches[0],dx=t.clientX-tx,dy=t.clientY-ty;tx=t.clientX;ty=t.clientY;if(Math.max(Math.abs(dx),Math.abs(dy))<1)return;
 const inside=layer.node.contains(e.target),vertical=Math.abs(dy)>=Math.abs(dx),delta=vertical?dy:dx;
 if(inside){
  // Dedicated canvas/optic/crop editors retain their own pointer gestures.
  if(e.target.closest?.('canvas,.ws254-viewport,.mm-optic-review-box795')||getComputedStyle(e.target).touchAction==='none')return;
  if(!vertical&&e.target.closest?.('input,textarea,[contenteditable=true]'))return;
  for(let node=e.target;node&&layer.node.contains(node);node=node.parentElement){const css=getComputedStyle(node),overflow=vertical?css.overflowY:css.overflowX,max=vertical?node.scrollHeight-node.clientHeight:node.scrollWidth-node.clientWidth,pos=vertical?node.scrollTop:node.scrollLeft;
   if(/auto|scroll|overlay/.test(overflow)&&max>1&&((delta>0&&pos>.5)||(delta<0&&pos<max-.5)))return;if(node===layer.node)break;
  }
 }
 e.preventDefault();
},{capture:true,passive:false});
for(const name of ['touchend','touchcancel'])document.addEventListener(name,()=>{touching=false;},{passive:true});
document.addEventListener('scroll',()=>{if(frozen.size)holdBackground(viewport());},{capture:true,passive:true});
new MutationObserver(schedule).observe(body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','hidden','open','inert']});
for(const name of ['resize','orientationchange','pageshow','popstate','hashchange'])addEventListener(name,schedule,{passive:true});
if(window.visualViewport){visualViewport.addEventListener('resize',schedule,{passive:true});visualViewport.addEventListener('scroll',schedule,{passive:true});}
const style=document.createElement('style');style.textContent='body.mm-ios-frame279.modal-page-locked{touch-action:auto!important}body.mm-ios-frame279 :is(input:not([type=checkbox]):not([type=radio]),textarea,select){font-size:max(16px,1em)!important;scroll-margin-block:16px!important}body.mm-ios-frame279 #modal.open .modal-box::-webkit-scrollbar{display:none!important}';document.head.appendChild(style);
window.MualliMateKeyboard285={version:292,refresh:schedule,viewport,hasLayer:()=>!!layer,inspect:()=>({surface:layer?.node.id||layer?.node.className||'',frozen:frozen.size,editing:editable(document.activeElement),height:viewport().height,top:viewport().top})};sync();
})();
