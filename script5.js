
(function(){
  function refreshMobileClassLabels(){
    const list=document.getElementById("classList");
    if(!list) return;
    list.querySelectorAll(".class-item").forEach(item=>{
      let label=item.querySelector(".mobileClassName");
      const source=item.querySelector("strong,b");
      const name=source ? source.textContent.trim() : "";
      if(!label){
        label=document.createElement("span");
        label.className="mobileClassName";
        item.appendChild(label);
      }
      if(name) label.textContent=name;
    });
  }
  const run=()=>setTimeout(refreshMobileClassLabels,0);
  window.addEventListener("DOMContentLoaded",run);
  document.addEventListener("click",run);
  const obs=new MutationObserver(run);
  window.addEventListener("DOMContentLoaded",()=>{
    const list=document.getElementById("classList");
    if(list) obs.observe(list,{childList:true,subtree:true,characterData:true});
    run();
  });
  setTimeout(refreshMobileClassLabels,50);
})();
