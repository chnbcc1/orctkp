/* Weekly home timetable: fit the natural table above quick actions, preserving portrait. */
(()=>{
 'use strict';
 const style=document.createElement('style');style.id='mm-home242';
 style.textContent=`
 @media (orientation:landscape) and (max-height:600px) and (hover:none) and (pointer:coarse){
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week242{
   grid-template-columns:minmax(0,1.35fr) minmax(0,1fr)!important;
   grid-template-rows:var(--mm-week-row242,auto) minmax(0,1fr)!important;
   gap:8px!important;
 }
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week242>#mmTodayLessons{grid-column:1!important;grid-row:1!important;padding:6px 10px!important;height:auto!important;max-height:none!important;align-self:start!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week242>#mmDutyCard{grid-column:2!important;grid-row:1 / 3!important;height:calc(50% - 4px)!important;align-self:start!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week242>.mm-home-card:nth-child(3){grid-column:1!important;grid-row:2!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week242>#mmClassesCard{grid-column:2!important;grid-row:1 / 3!important;height:calc(50% - 4px)!important;align-self:end!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week242>.mm-home-card:not(#mmTodayLessons){padding:6px 9px!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week242 .mm-section-head{margin-bottom:4px!important;gap:4px!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week242 .mm-section-head b{font-size:12px!important;line-height:1.2!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week242 .mm-section-head button{font-size:10px!important;min-height:22px!important;padding:2px!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week242 #mmTodayLessons .mm217-week-scroll{flex:0 0 auto!important;min-height:0!important;max-height:none!important;overflow:auto!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week242 .mm217-week-table{height:auto!important;font-size:var(--mm-week-font242,11px)!important;line-height:1.1!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week242 .mm217-week-table caption{display:none!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week242 .mm217-week-table th,
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week242 .mm217-week-table td{height:var(--mm-week-cell242,17px)!important;padding:0 1px!important;font-size:inherit!important;line-height:1!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week242 #mmDutyCard .mm-duty-line b{font-size:12px!important;line-height:1.15!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week242 #mmDutyCard .mm-duty-line small{font-size:9px!important;line-height:1.1!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week242 > .mm-home-card:nth-child(3) .mm-quick-grid{gap:4px!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week242 > .mm-home-card:nth-child(3) .mm-quick-grid button{padding:2px!important;grid-template-rows:18px auto!important;gap:2px!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week242 > .mm-home-card:nth-child(3) .mm-quick-grid button span{font-size:16px!important;height:18px!important;line-height:18px!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week242 > .mm-home-card:nth-child(3) .mm-quick-grid button b{font-size:9px!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week242 .mm-class-strip{grid-auto-columns:minmax(78px,1fr)!important;gap:4px!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week242 .mm-class-chip{padding:4px!important;grid-template-rows:auto auto minmax(12px,1fr)!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week242 .mm-class-chip b{font-size:14px!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week242 .mm-class-chip small{font-size:9px!important}
 @media(max-height:360px){
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week242 #mmTodayLessons .mm-section-head button{min-height:16px!important;line-height:1!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week242 #mmTodayLessons .mm-section-head b{font-size:11px!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week242>#mmTodayLessons{padding:4px 8px!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week242 .mm217-week-table{font-size:var(--mm-week-font242,10px)!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week242 .mm217-week-table th,
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week242 .mm217-week-table td{padding:0 1px!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week242 > .mm-home-card:nth-child(3) .mm-quick-grid button{display:flex!important;align-items:center!important;justify-content:center!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week242 > .mm-home-card:nth-child(3) .mm-quick-grid button span{display:none!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week242 .mm-class-chip{display:flex!important;flex-direction:column!important;justify-content:center!important;gap:1px!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week242 .mm-class-chip b{font-size:12px!important;margin:0!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week242 .mm-class-chip small,
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week242 .mm-class-chip em{font-size:8px!important;min-height:0!important;line-height:1!important;margin:0!important;align-self:auto!important}
 }
 }
 `;
 document.head.appendChild(style);
 let frame=0;
 function put(node,name,value){if(node.style.getPropertyValue(name)!==value)node.style.setProperty(name,value)}
 function update(){frame=0;const home=document.getElementById('mobileHomeDashboard');if(!home)return;
  const table=home.querySelector('#mmTodayLessons.mm217-week .mm217-week-table'),on=!!table;
  if(home.classList.contains('mm-week242')!==on)home.classList.toggle('mm-week242',on);
  if(!on)return;
  table.setAttribute('aria-label','Haftalık ders programı');
  if(!matchMedia('(orientation:landscape) and (max-height:600px) and (hover:none) and (pointer:coarse)').matches)return;
  const card=document.getElementById('mmTodayLessons'),head=card.querySelector('.mm-section-head'),cs=getComputedStyle(card);
  const chrome=head.getBoundingClientRect().height+parseFloat(getComputedStyle(head).marginBottom)+parseFloat(cs.paddingTop)+parseFloat(cs.paddingBottom)+4;
  const rows=table.rows.length,available=home.clientHeight-8-65-chrome;
  const cell=Math.max(10,Math.min(18,Math.floor(available/rows))),font=Math.min(11,Math.max(9,cell-2));
  put(home,'--mm-week-cell242',cell+'px');put(home,'--mm-week-font242',font+'px');
  const height=Math.ceil(card.getBoundingClientRect().height);
  put(home,'--mm-week-row242',height+'px');
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(update)}
 function start(){const home=document.getElementById('mobileHomeDashboard');if(!home)return;new MutationObserver(schedule).observe(home,{childList:true,subtree:true});if(window.ResizeObserver)new ResizeObserver(schedule).observe(home);schedule()}
 addEventListener('resize',schedule,{passive:true});addEventListener('orientationchange',schedule,{passive:true});
 if(window.visualViewport)visualViewport.addEventListener('resize',schedule,{passive:true});
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
