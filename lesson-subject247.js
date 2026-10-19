(function(){
 'use strict';
 const clean=value=>String(value||'').trim().slice(0,80);
 function courses(className){
  const unique=new Map();
  for(const row of settings.schedule?.entries||[]){
   const course=clean(row.course);
   if(course&&normName(row.className)===normName(className)&&!unique.has(normName(course)))unique.set(normName(course),course);
  }
  return [...unique.values()];
 }
 window.classLessonCourse=function(className){
  const c=state.classes.find(c=>normName(c.name)===normName(className));
  const chosen=clean(c?.lessonCourse247);if(chosen)return chosen;
  const options=courses(className);return options.length===1?options[0]:'';
 };
 const originalOpen=window.openClassLessonInfo;
 window.openClassLessonInfo=function(){
  const c=cls();if(!c)return;
  if(!classLessonCourse(c.name))return chooseCourse();
  return originalOpen.apply(this,arguments);
 };
 function chooseCourse(){
  const c=cls();if(!c)return;
  const options=courses(c.name),selected=classLessonCourse(c.name);
  el('modalTitle').textContent='Sınıfın Dersi';
  el('modalSubtitle').textContent=c.name;
  el('modalBody').innerHTML=`<div class="notice">${options.length>1?'Bu sınıf için birden fazla ders var. Görüntülemek istediğiniz dersi seçin veya yazın.':'Bu sınıfta takip edeceğiniz dersin adını veya kısa kodunu girin.'} Ders otomatik olarak matematik kabul edilmez.</div><label style="display:block;margin-top:16px">Ders / Kısa Kod<input id="lessonCourse247" list="lessonCourses247" maxlength="80" value="${esc(selected)}" placeholder="Örn. Fizik, Türkçe, MAT" style="box-sizing:border-box;width:100%;min-width:0;margin-top:8px"></label><datalist id="lessonCourses247">${options.map(x=>`<option value="${esc(x)}"></option>`).join('')}</datalist><div class="modal-actions"><button id="lessonSave247">Dersi Kaydet</button><button id="lessonCancel247" class="secondary">Vazgeç</button></div>`;
  el('lessonSave247').onclick=()=>{
   const value=clean(el('lessonCourse247').value);if(!value)return alert('Ders adını veya kısa kodunu girin.');
   if(cls()?.id!==c.id)return;
   const previous=c.lessonCourse247;c.lessonCourse247=value;
   try{if(save()===false){c.lessonCourse247=previous;return;}}catch(error){c.lessonCourse247=previous;alert('Ders kaydedilemedi: '+error.message);return;}
   originalOpen();
  };
  el('lessonCancel247').onclick=()=>{if(selected)originalOpen();else closeModal();};
  el('modal').classList.add('open');
 }
 const detail=window.openLessonDetail;
 window.openLessonDetail=function(){
  const result=detail.apply(this,arguments);
  if(el('modalTitle')?.textContent==='Ders Bilgisi'){
   const hero=el('modalBody')?.querySelector('.quick-lesson-hero');
   if(hero&&!hero.querySelector('[data-lesson-subject247]')){
    const button=document.createElement('button');button.type='button';button.className='secondary';button.dataset.lessonSubject247='';button.textContent='Dersi Değiştir';button.style.marginTop='12px';button.onclick=chooseCourse;hero.appendChild(button);
   }
  }
  return result;
 };
 const editor=window.openScheduleEntryEditor;
 window.openScheduleEntryEditor=function(id){
  const result=editor.apply(this,arguments),input=el('seCourse');
  if(input){
   const existing=(settings.schedule?.entries||[]).find(e=>e.id===id);
   input.value=existing?String(existing.course||''):'';
   input.placeholder='Örn. Fizik, Türkçe, MAT';
  }
  return result;
 };
})();
