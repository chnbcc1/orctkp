/* Bell read state is independent of active student follow-up and homework totals. */
(()=>{'use strict';
const field='bellRead296',scope=()=>[String(settings.currentSchoolYear||''),String(currentPeriod)];
function snapshot(){
 const rows=[];
 for(const c of state.classes||[]){
  const a=getSmartAlerts(c),groups={missing:a.missingRows,streak:a.streakRows,lowCompletion:a.lowCompletionRows,missingGrade:a.missingGradeRows,lowGrade:a.lowGradeRows,trialAbsence:a.repeatedTrialAbsenceRows,trialDecline:a.trialDeclineRows};
  for(const issue of smartAlertIssueSnapshot(a)){
   const source=(groups[issue.type]||[]).find(x=>x.student.id===issue.student.id);let evidence=[];
   if(issue.type==='missing'||issue.type==='streak')evidence=(source?.homeworks||[]).map(h=>'hw:'+h.id);
   else if(issue.type==='lowCompletion')evidence=a.hs.filter(h=>['missing','partial'].includes(status(c,issue.student.id,h.id))).map(h=>'hw:'+h.id);
   else if(issue.type==='missingGrade')evidence=(source?.missing||[]).map(x=>'grade:'+x);
   else if(issue.type==='lowGrade'){const g=getGradeRecord(c,issue.student.id);evidence=['exam1','exam2','perf1','perf2','project'].filter(k=>parseGrade(g[k])!==null).map(k=>k+':'+g[k]);}
   else if(issue.type==='trialAbsence')evidence=(source?.trials||[]).map(t=>'trial:'+t.id);
   else if(issue.type==='trialDecline')evidence=[JSON.stringify([source?.previous?.t?.id,source?.current?.t?.id,source?.previous?.n,source?.current?.n])];
   rows.push({...issue,classObj:c,key:JSON.stringify([...scope(),c.id,issue.student.id,issue.type]),evidence:[...new Set(evidence.length?evidence:[issue.type])].sort()});
  }
 }
 return rows;
}
function readMap(){const r=settings[field];return r&&typeof r==='object'&&!Array.isArray(r)?r:{};}
function reconcile(rows){
 const old=readMap(),next={...old},active=new Set(rows.map(r=>r.key)),prefix=scope();let changed=false;
 for(const k of Object.keys(next)){let parts;try{parts=JSON.parse(k)}catch{delete next[k];changed=true;continue;}
  if(parts[0]===prefix[0]&&parts[1]===prefix[1]&&!active.has(k)){delete next[k];changed=true;}
 }
 for(const row of rows){if(Array.isArray(next[row.key])){const kept=next[row.key].filter(token=>row.evidence.includes(token));if(kept.length!==next[row.key].length){next[row.key]=kept;changed=true;}}}
 if(changed){settings[field]=next;if(saveSettings()===false)settings[field]=old;}
 return readMap();
}
function unread(row,map){const known=Array.isArray(map[row.key])?map[row.key]:[];return row.evidence.some(token=>!known.includes(token));}
function refresh(){
 const rows=snapshot(),map=reconcile(rows),count=rows.filter(r=>unread(r,map)).length,badge=document.getElementById('mmAlertBellBadge'),bell=document.getElementById('mmAlertBell');
 if(badge){badge.textContent=count>99?'99+':String(count);badge.hidden=count===0;badge.setAttribute('aria-label',count+' okunmamış bildirim');}
 if(bell){bell.title='Bildirimler';bell.setAttribute('aria-label',count?`Bildirimler · ${count} okunmamış`:'Bildirimler · okunmamış bildirim yok');}
 return {rows,count};
}
window.updateBellNotifications296=refresh;
window.openBellNotifications296=function(){
 const {rows,count}=refresh(),map=readMap(),groups=new Map();
 for(const row of rows){if(!groups.has(row.classObj.id))groups.set(row.classObj.id,{c:row.classObj,rows:[]});groups.get(row.classObj.id).rows.push(row);}
 document.getElementById('modalTitle').textContent='Bildirimler';
 document.getElementById('modalSubtitle').textContent=`${currentPeriod}. Dönem · ${count} yeni · ${rows.length} aktif uyarı`;
 const body=document.getElementById('modalBody');
 body.innerHTML='<p class="tiny">Bu ekranda görüntülenen bildirimler okundu olarak işaretlenir. Aktif uyarıların ayrıntılarını sınıfınızdan inceleyebilirsiniz.</p>'+(rows.length?[...groups.values()].map((g,i)=>`<section class="card" style="padding:14px;margin-bottom:12px"><div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap"><b>${esc(g.c.name)}</b><button type="button" class="secondary" data-bell-class="${i}">Uyarıları incele</button></div>${g.rows.map(r=>`<div style="padding:10px 0;border-top:1px solid var(--border);margin-top:8px;overflow-wrap:anywhere"><b>${esc((r.student.number?r.student.number+' - ':'')+r.student.name)}</b> ${unread(r,map)?'<span style="color:#075448;font-weight:700">· Yeni</span>':''}<div>${esc(r.label)}${r.detail?' · '+esc(r.detail):''}</div></div>`).join('')}</section>`).join(''):'<div class="card" style="padding:18px">Şu anda aktif bildirim yok.</div>');
 const classes=[...groups.values()];body.querySelectorAll('[data-bell-class]').forEach(b=>b.onclick=()=>openDailyClassAlerts(classes[+b.dataset.bellClass].c.id));
 document.getElementById('modal').classList.add('open');
 const previous=settings[field],next={...map};rows.forEach(r=>next[r.key]=r.evidence);
 if(JSON.stringify(next)!==JSON.stringify(map)){settings[field]=next;if(saveSettings()===false)settings[field]=previous;}
 refresh();
};
refresh();
})();
