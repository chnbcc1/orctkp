/* MualliMate v7.8.240 — grouped portrait/landscape drawer only. */
(function(){
 'use strict';
 const drawer=document.getElementById('mmMobileDrawer'),nav=drawer?.querySelector('.mm-drawer-nav');
 if(!drawer||!nav||drawer.dataset.mmMenu240)return;
 const originals=new Map([...nav.querySelectorAll('button')].map(b=>[b.querySelector('span')?.textContent.trim(),b]));
 const paths={
  'Ana Ekran':'M3 10 12 3l9 7M5 9v12h5v-7h4v7h5V9',
  'Sınıflarım':'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M16 3a4 4 0 0 1 0 8M22 21v-2a4 4 0 0 0-3-3.87M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  'Ödevler':'M4 3h12l4 4v14H4V3m12 0v5h4M8 12h8M8 16h6',
  'Denemeler':'M4 20h17M7 16v-5M12 16V6M17 16V9',
  'Ders Programı':'M4 5h16v16H4V5M4 10h16M8 3v4M16 3v4M8 14h2M14 14h2M8 18h2',
  'Nöbet':'M12 3 3 7v6c0 5 9 9 9 9s9-4 9-9V7L12 3m-4 9 3 3 5-6',
  'Öğretmen Dosyası':'M3 7V4h7l2 3h9v14H3V7m5 5h8m-8 4h6',
  'Rehberlik Dosyası':'M3 7V4h7l2 3h9v14H3V7m11 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0m-6 7v-1a4 4 0 0 1 8 0v1',
  'Belge Asistanı':'M4 3h12l4 4v14H4V3m12 0v5h4M8 12h8M8 16h4',
  'Raporlar':'M4 3h16v18H4V3m4 14v-4m4 4V7m4 10v-7',
  'Eğitim Yılı ve Arşiv':'M3 4h18v5H3V4m2 5v12h14V9m-10 4h6',
  'Ayarlar':'M4 7h16M4 17h16M9 4v6M15 14v6',
  'Genel Arama':'M20 20l-5-5m2-6a7 7 0 1 1-14 0 7 7 0 0 1 14 0'
 };
 function icon(title){return '<span class="mm-nav-icon240" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="'+paths[title]+'"/></svg></span>'}
 function button(title){
  const original=originals.get(title);if(!original)return null;
  const b=original.cloneNode(false);b.className='mm-nav-item240';b.dataset.menuItem240=title;b.innerHTML=icon(title)+'<span class="mm-nav-label240">'+title+'</span>';return b;
 }
 drawer.dataset.mmMenu240='true';nav.replaceChildren();nav.setAttribute('aria-label','Uygulama bölümleri');
 for(const [title,items]of[
  ['Başlangıç',['Ana Ekran','Sınıflarım']],
  ['Ders ve Takip',['Ödevler','Denemeler','Ders Programı','Nöbet']],
  ['Belgeler',['Öğretmen Dosyası','Rehberlik Dosyası','Belge Asistanı','Raporlar']],
  ['Arşiv ve Yönetim',['Eğitim Yılı ve Arşiv','Ayarlar']]
 ]){
  const group=document.createElement('div');group.className='mm-nav-group240';
  const label=document.createElement('div');label.className='mm-nav-heading240';label.textContent=title;
  const list=document.createElement('div');list.className='mm-nav-grid240';
  for(const name of items){const b=button(name);if(b)list.appendChild(b)}
  group.append(label,list);nav.appendChild(group);
 }
 const search=button('Genel Arama');if(search){search.classList.add('mm-drawer-search240');drawer.querySelector('.mm-drawer-head').after(search)}
 const foot=drawer.querySelector('.mm-drawer-foot');if(foot)foot.textContent='Veri güvenliği ve sistem araçları Ayarlar içinde.';
 const oldSettings=window.openSettings;
 window.openSettings=function(){
  const result=oldSettings.apply(this,arguments),body=document.getElementById('modalBody');if(!body)return result;
  if(![...body.querySelectorAll('button')].some(b=>(b.getAttribute('onclick')||'').includes('openSystemHealth884'))){
   const box=document.createElement('div');box.className='mm-settings-system240';box.innerHTML='<h3>Veri ve Sistem</h3><p>Saklama alanını ve yedek durumunu kontrol edin.</p><button class="secondary" onclick="openSystemHealth884()">Sistem Sağlığı / Yedek Doğrulama</button>';body.appendChild(box);
  }
  return result;
 };
 const css=document.createElement('style');css.id='mm-drawer-style240';
 css.textContent=`
#mmMobileDrawer[data-mm-menu240] .mm-drawer-nav{display:block!important;grid-template-columns:none!important;gap:0!important;padding:0!important;min-height:0!important;overflow-y:auto!important;overflow-x:hidden!important;overscroll-behavior:contain!important;-webkit-overflow-scrolling:touch;scrollbar-width:none}
#mmMobileDrawer[data-mm-menu240] .mm-drawer-nav::-webkit-scrollbar{display:none}
#mmMobileDrawer[data-mm-menu240] .mm-nav-group240{margin:0!important;padding:6px 0!important;border-bottom:1px solid #e6d5a51f!important}
#mmMobileDrawer[data-mm-menu240] .mm-nav-group240:last-child{border-bottom:0!important}
#mmMobileDrawer[data-mm-menu240] .mm-nav-heading240{font-size:10px!important;font-weight:800!important;letter-spacing:.08em!important;color:#cfbb8a!important;line-height:1.3!important;padding:1px 10px 4px!important}
#mmMobileDrawer[data-mm-menu240] .mm-nav-grid240{display:grid!important;grid-template-columns:minmax(0,1fr)!important;gap:2px 8px!important}
#mmMobileDrawer[data-mm-menu240] button.mm-nav-item240{box-sizing:border-box!important;display:flex!important;flex-direction:row!important;justify-content:flex-start!important;align-items:center!important;gap:11px!important;width:100%!important;min-width:0!important;max-width:100%!important;min-height:44px!important;height:auto!important;padding:10px!important;margin:0!important;border:1px solid transparent!important;border-radius:10px!important;background:transparent!important;color:#fff5df!important;font-size:14px!important;font-weight:650!important;line-height:1.3!important;text-align:left!important;box-shadow:none!important;overflow:hidden!important;white-space:normal!important;touch-action:manipulation!important}
#mmMobileDrawer[data-mm-menu240] button.mm-nav-item240:hover,#mmMobileDrawer[data-mm-menu240] button.mm-nav-item240:active{background:#fff2ce12!important;border-color:#e1c17b30!important}
#mmMobileDrawer[data-mm-menu240] button.mm-nav-item240:focus-visible{outline:2px solid #e7c36d!important;outline-offset:-2px!important}
#mmMobileDrawer[data-mm-menu240] button.mm-nav-item240 .mm-nav-icon240{display:inline-flex!important;flex:0 0 24px!important;width:24px!important;min-width:24px!important;align-items:center!important;justify-content:center!important;margin:0!important;padding:0!important;color:#e5c87e!important}
#mmMobileDrawer[data-mm-menu240] .mm-nav-icon240 svg{display:block;width:22px;height:22px;flex:none}
#mmMobileDrawer[data-mm-menu240] button.mm-nav-item240 .mm-nav-label240{display:block!important;flex:1 1 0!important;min-width:0!important;max-width:100%!important;margin:0!important;padding:0!important;line-height:1.3!important;overflow-wrap:normal!important;word-break:normal!important;text-align:left!important}
#mmMobileDrawer[data-mm-menu240] button.mm-drawer-search240{flex:0 0 auto!important;background:#fff4d914!important;border-color:#e1c17b4d!important;margin:12px 0 4px!important;min-height:44px!important;color:#fff6e5!important}
#mmMobileDrawer[data-mm-menu240] .mm-drawer-foot{flex:0 0 auto!important;font-size:10px!important;line-height:1.4!important;padding:10px 8px 0!important;margin:0!important;color:#c7cfbf!important}
.mm-settings-system240{border-top:1px solid #d9d4c3;margin-top:18px;padding-top:16px}.mm-settings-system240 h3{margin:0 0 6px}.mm-settings-system240 p{font-size:12px;color:#607166;margin:0 0 10px}.mm-settings-system240 button{width:100%}
@media(max-width:700px), (orientation:landscape) and (max-height:600px) and (hover:none) and (pointer:coarse){
 #mmMobileDrawer.mm-mobile-drawer[data-mm-menu240]{display:flex!important;flex-direction:column!important;width:min(90vw,360px)!important;height:100vh!important;height:100dvh!important;max-height:100dvh!important;padding:calc(12px + env(safe-area-inset-top)) calc(12px + env(safe-area-inset-right)) calc(12px + env(safe-area-inset-bottom)) calc(12px + env(safe-area-inset-left))!important;box-sizing:border-box!important;overflow:hidden!important}
 #mmMobileDrawer[data-mm-menu240] .mm-drawer-head{flex:0 0 auto!important;width:100%!important;min-width:0!important;grid-template-columns:42px minmax(0,1fr) 34px!important;padding:0 0 12px!important;gap:9px!important}
 #mmMobileDrawer[data-mm-menu240] .mm-drawer-head>div{min-width:0!important}
 #mmMobileDrawer[data-mm-menu240] #mmDrawerTeacher{font-size:12px!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
 #mmMobileDrawer[data-mm-menu240] .mm-drawer-nav{flex:1 1 0!important;width:100%!important}
}
@media(orientation:landscape) and (min-width:480px){
 #mmMobileDrawer.mm-mobile-drawer[data-mm-menu240]{width:min(76vw,560px)!important}
 #mmMobileDrawer[data-mm-menu240] .mm-nav-grid240{grid-template-columns:repeat(2,minmax(0,1fr))!important}
 #mmMobileDrawer[data-mm-menu240] .mm-nav-group240{padding:8px 0!important}
 #mmMobileDrawer[data-mm-menu240] button.mm-nav-item240{min-height:42px!important;padding:9px!important;font-size:13px!important;gap:9px!important}
}
`;
 document.head.appendChild(css);
})();
