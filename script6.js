
(function(){
  function classNameFromItem(item){
    const candidates=[...item.querySelectorAll("strong,b")];
    for(const el of candidates){
      const t=(el.textContent||"").trim();
      if(t && !/öğrenci|ödev/i.test(t)) return t;
    }
    const text=(item.textContent||"").trim();
    const m=text.match(/\b\d{1,2}\s*\/\s*[A-Za-zÇĞİÖŞÜçğıöşü]\b/);
    return m ? m[0].replace(/\s+/g,"") : "";
  }
  function ensureMobileClassNav_v729_disabled(){
    const realList=document.getElementById("classList");
    const addBtn=document.querySelector(".add-class-btn");
    if(!realList) return;

    let nav=document.getElementById("mobileClassNav");
    if(!nav){
      nav=document.createElement("div");
      nav.id="mobileClassNav";
      const strip=document.getElementById("mobileClassStrip");
      const anchor=strip || realList;
      const parent=anchor.parentNode;
      parent.insertBefore(nav,anchor);
    }

    nav.innerHTML="";
    const items=[...realList.querySelectorAll(".class-item")];
    items.forEach((item,idx)=>{
      const name=classNameFromItem(item);
      if(!name) return;
      const chip=document.createElement("button");
      chip.type="button";
      chip.className="mClassChip"+(item.classList.contains("active")?" active":"");
      chip.textContent=name;
      chip.onclick=()=>{ item.click(); setTimeout(ensureMobileClassNav_v729_disabled,0); };
      nav.appendChild(chip);
    });

    const plus=document.createElement("button");
    plus.type="button";
    plus.className="mClassAdd";
    plus.textContent="+";
    plus.title="Sınıf Ekle";
    plus.setAttribute("aria-label","Sınıf Ekle");
    plus.onclick=()=>{ if(addBtn) addBtn.click(); };
    nav.appendChild(plus);
  }

  window.refreshMobileClassNav_v729=ensureMobileClassNav_v729_disabled;
  window.addEventListener("DOMContentLoaded",()=>setTimeout(ensureMobileClassNav_v729_disabled,0));
  document.addEventListener("click",()=>setTimeout(ensureMobileClassNav_v729_disabled,0));
  const startObs=()=>{
    const list=document.getElementById("classList");
    if(!list) return;
    new MutationObserver(()=>setTimeout(ensureMobileClassNav_v729_disabled,0))
      .observe(list,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:["class"]});
    ensureMobileClassNav_v729_disabled();
  };
  window.addEventListener("DOMContentLoaded",startObs);
  setTimeout(startObs,100);
})();
