/* Weekly home timetable: use the full landscape height, preserving portrait. */
(()=>{
 'use strict';
 const style=document.createElement('style');style.id='mm-home241';
 style.textContent=`
 @media (orientation:landscape) and (max-height:600px) and (hover:none) and (pointer:coarse){
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week241{
   grid-template-columns:minmax(0,1.35fr) minmax(0,1fr)!important;
   grid-template-rows:minmax(0,.8fr) minmax(0,1fr) minmax(0,1.2fr)!important;
   gap:8px!important;
 }
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week241>#mmTodayLessons{grid-column:1!important;grid-row:1 / 4!important;padding:10px 12px!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week241>#mmDutyCard{grid-column:2!important;grid-row:1!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week241>.mm-home-card:nth-child(3){grid-column:2!important;grid-row:2!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week241>#mmClassesCard{grid-column:2!important;grid-row:3!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week241>.mm-home-card:not(#mmTodayLessons){padding:6px 9px!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week241 .mm-section-head{margin-bottom:4px!important;gap:4px!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week241 .mm-section-head b{font-size:12px!important;line-height:1.2!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week241 .mm-section-head button{font-size:10px!important;min-height:22px!important;padding:2px!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week241 #mmTodayLessons .mm217-week-scroll{flex:1 1 auto!important;min-height:0!important;max-height:none!important;overflow:auto!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week241 .mm217-week-table{height:100%!important;font-size:11px!important;line-height:1.1!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week241 .mm217-week-table th,
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week241 .mm217-week-table td{height:auto!important;padding:2px 1px!important;font-size:inherit!important;line-height:1.1!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week241 #mmDutyCard .mm-duty-line b{font-size:12px!important;line-height:1.15!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week241 #mmDutyCard .mm-duty-line small{font-size:9px!important;line-height:1.1!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week241 .mm-quick-grid{gap:4px!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week241 .mm-quick-grid button{padding:2px!important;grid-template-rows:18px auto!important;gap:2px!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week241 .mm-quick-grid button span{font-size:16px!important;height:18px!important;line-height:18px!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week241 .mm-quick-grid button b{font-size:9px!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week241 .mm-class-strip{grid-auto-columns:minmax(78px,1fr)!important;gap:4px!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week241 .mm-class-chip{padding:4px!important;grid-template-rows:auto auto minmax(12px,1fr)!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week241 .mm-class-chip b{font-size:14px!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week241 .mm-class-chip small{font-size:9px!important}
 @media(max-height:360px){
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week241>#mmTodayLessons{padding:6px 8px!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week241 .mm217-week-table{font-size:10px!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week241 .mm217-week-table th,
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week241 .mm217-week-table td{padding:1px!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week241 .mm-quick-grid button{display:flex!important;align-items:center!important;justify-content:center!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week241 .mm-quick-grid button span{display:none!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week241 .mm-class-chip{display:flex!important;flex-direction:column!important;justify-content:center!important;gap:1px!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week241 .mm-class-chip b{font-size:12px!important;margin:0!important}
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week241 .mm-class-chip small,
 body.mm-landscape-home-lock #mobileHomeDashboard.mm-week241 .mm-class-chip em{font-size:8px!important;min-height:0!important;line-height:1!important;margin:0!important;align-self:auto!important}
 }
 }
 `;
 document.head.appendChild(style);
 let frame=0;
 function update(){frame=0;const home=document.getElementById('mobileHomeDashboard');if(!home)return;
  const on=!!home.querySelector('#mmTodayLessons.mm217-week .mm217-week-table');
  if(home.classList.contains('mm-week241')!==on)home.classList.toggle('mm-week241',on);
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(update)}
 function start(){const home=document.getElementById('mobileHomeDashboard');if(!home)return;new MutationObserver(schedule).observe(home,{childList:true,subtree:true});schedule()}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
