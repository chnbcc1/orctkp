
(function(){
  function arrangeMobileClassStrip(){
    const list=document.getElementById("classList");
    const btn=document.querySelector(".add-class-btn");
    if(!list||!btn) return;
    let wrap=document.getElementById("mobileClassStrip");
    if(window.matchMedia("(max-width:700px)").matches){
      if(!wrap){
        wrap=document.createElement("div");
        wrap.id="mobileClassStrip";
        list.parentNode.insertBefore(wrap,list);
      }
      if(list.parentNode!==wrap) wrap.appendChild(list);
      if(btn.parentNode!==wrap) wrap.appendChild(btn);
    }else if(wrap){
      const parent=wrap.parentNode;
      parent.insertBefore(list,wrap);
      parent.insertBefore(btn,wrap.nextSibling);
      wrap.remove();
    }
  }
  window.addEventListener("resize",arrangeMobileClassStrip);
  window.addEventListener("DOMContentLoaded",arrangeMobileClassStrip);
  setTimeout(arrangeMobileClassStrip,0);
})();
