
/* ===== v7.5.1 DATA-DRIVEN MOBILE CLASS NAV ===== */
(function(){
  function getClasses(){
    try{
      if(window.state && Array.isArray(window.state.classes)) return window.state.classes;
      if(typeof state!=="undefined" && state && Array.isArray(state.classes)) return state.classes;
    }catch(e){}
    return [];
  }
  function classId(c){
    return c?.id ?? c?.classId ?? c?.uuid ?? "";
  }
  function className(c){
    return String(c?.name ?? c?.className ?? c?.title ?? c?.label ?? "").trim();
  }
  function activeId(){
    try{
      if(window.state) return window.state.currentClassId ?? window.state.selectedClassId ?? window.state.activeClassId ?? "";
      if(typeof state!=="undefined" && state) return state.currentClassId ?? state.selectedClassId ?? state.activeClassId ?? "";
    }catch(e){}
    return "";
  }
  function selectClass(c){
    const id=classId(c);
    try{
      if(typeof selectClass==="function") return selectClass(id);
    }catch(e){}
    const real=[...document.querySelectorAll("#classList .class-item")];
    const name=className(c);
    const hit=real.find(el=>{
      const t=(el.textContent||"").replace(/\s+/g," ").trim();
      return t.includes(name);
    });
    if(hit) hit.click();
  }
  
function addClass(){
    const btn=document.querySelector(".add-class-btn");
    if(btn) btn.click();
  }
  function renderDataMobileClassNav(){
    let nav=document.getElementById("mobileClassNavData");
    if(!nav){
      nav=document.createElement("div");
      nav.id="mobileClassNavData";
      const heading=[...document.querySelectorAll("h1,h2,h3,h4")].find(el=>
        (el.textContent||"").trim().toLocaleUpperCase("tr-TR")==="SINIFLAR"
      );
      if(heading) heading.insertAdjacentElement("afterend",nav);
      else{
        const real=document.getElementById("classList");
        if(real) real.insertAdjacentElement("beforebegin",nav);
      }
    }
    if(!nav) return;
    nav.innerHTML="";
    const classes=getClasses();
    const aid=String(activeId());

    classes.forEach(c=>{
      const name=className(c);
      if(!name) return;
      const b=document.createElement("button");
      b.type="button";
      b.className="mDataClassChip"+(String(classId(c))===aid?" active":"");
      b.textContent=name;
      b.onclick=()=>{
        const real=[...document.querySelectorAll("#classList .class-item")];
        const hit=real.find(el=>(el.textContent||"").includes(name));
        if(hit) hit.click();
        setTimeout(renderDataMobileClassNav,0);
      };
      nav.appendChild(b);
    });

    const plus=document.createElement("button");
    plus.type="button";
    plus.className="mDataClassAdd";
    plus.textContent="+";
    plus.title="Sınıf Ekle";
    plus.setAttribute("aria-label","Sınıf Ekle");
    plus.onclick=addClass;
    nav.appendChild(plus);
  }

  window.refreshDataMobileClassNav=renderDataMobileClassNav;
  window.addEventListener("DOMContentLoaded",()=>setTimeout(renderDataMobileClassNav,50));
  document.addEventListener("click",()=>setTimeout(renderDataMobileClassNav,30));
  
})();

window.addEventListener("DOMContentLoaded",()=>{
  const nav=el("mobileClassNavFixed");
  if(nav) nav.addEventListener("scroll",updateMobileClassScrollHints,{passive:true});
  updateMobileClassScrollHints();
});
window.addEventListener("resize",updateMobileClassScrollHints);

setInterval(updateDutyStatus,30000);
document.addEventListener("visibilitychange",()=>{if(!document.hidden){try{updateProfileNextLesson()}catch(e){};try{updateDutyStatus()}catch(e){}}});
window.addEventListener("focus",()=>{try{updateProfileNextLesson()}catch(e){};try{updateDutyStatus()}catch(e){}});
