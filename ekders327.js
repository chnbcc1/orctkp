(() => {
  'use strict';
  const fields = ['lesson', 'prep', 'social', 'admin', 'duty', 'boarding', 'seminar', 'other'];
  const headings = ['Ek ders', 'Hazırlık', 'Rehberlik / kulüp', 'Yönetim', 'Okul nöbeti', 'Pansiyon nöbeti', 'Seminer', 'Diğer'];
  const number = value => Math.max(0, Math.min(99, Math.trunc(Number(value) || 0)));
  const weekday = date => (dateFromISO(date).getDay() + 6) % 7;
  const money = new Intl.NumberFormat('tr-TR', {style:'currency', currency:'TRY'});
  let month;
  let view;
  let snapshot;

  function period(key, mode) {
    const first = key + '-01';
    const next = shiftMonth(key, 1) + '-01';
    if (mode === 'calendar') return [first, addDaysISO(next, -1)];
    const boundary = date => weekday(date) >= 5
      ? addDaysISO(date, 7 - weekday(date))
      : addDaysISO(date, -weekday(date));
    return [boundary(first), addDaysISO(boundary(next), -1)];
  }

  const weekdays = ['Pazartesi','Salı','Çarşamba','Perşembe','Cuma'];
  const defaultPattern = [4,0,1,1,1];
  function dayStatus(iso, change = {}) {
    if (change.off) return 'off';
    if (change.status) return change.status;
    if (iso >= '2026-11-16' && iso <= '2026-11-22'
      || iso >= '2027-03-08' && iso <= '2027-03-14') return 'seminar';
    if (iso >= '2027-01-25' && iso <= '2027-02-07'
      || iso >= '2027-05-16' && iso <= '2027-05-19') return 'off';
    if (['01-01','04-23','05-01','05-19','07-15','08-30','10-29'].includes(iso.slice(5))) return 'holiday';
    return 'normal';
  }
  const statusLabels = {normal:'Normal gün', holiday:'Resmî tatil · ders görevi ödenir', off:'Ödemesiz gün', seminar:'Seminer'};
  function calculate(key, options, schedules, duties, changes) {
    const [start, end] = period(key, options.mode);
    const firstMonday = addDaysISO(start, -weekday(start));
    const lastSunday = addDaysISO(end, 6 - weekday(end));
    const result = [];
    const activeSchedules = schedules.filter(Boolean).sort((a,b) =>
      String(b.effectiveDate || '').localeCompare(String(a.effectiveDate || '')));
    const dutyDates = new Set(duties.filter(d => !d.type || d.type === 'school').map(d => d.date));
    const boardingDates = new Map();
    const boardingTotals = new Map();
    for (const entry of duties.filter(d => d.type === 'boarding').sort((a,b) => a.date.localeCompare(b.date))) {
      if (boardingDates.has(entry.date)) continue;
      const change = changes[entry.date] || {};
      const key = entry.date.slice(0,7);
      const used = boardingTotals.get(key) || 0;
      const eligibleHours = 8;
      const cap = key >= '2026-01' && key <= '2027-12' ? 64 : 56;
      const hours = ['off','seminar'].includes(dayStatus(entry.date, change)) || change.noBoarding ? 0 : Math.min(eligibleHours, cap - used);
      boardingDates.set(entry.date, hours);
      boardingTotals.set(key, used + hours);
    }
    for (let date = firstMonday; date <= lastSunday; date = addDaysISO(date, 7)) {
      let taught = 0;
      const weekRows = [];
      const fixed = options.role === 'teacher' && options.distribution === 'fixed';
      let dutyPaid = false;
      let socialPaid = false;
      for (let day = 0; day < 7; day++) {
        const iso = addDaysISO(date, day);
        const change = changes[iso] || {};
        const schedule = activeSchedules.find(s => !s.effectiveDate || s.effectiveDate <= iso);
        const def = SCHEDULE_DAYS.find(d => d.js === dateFromISO(iso).getDay());
        const slots = new Set();
        for (const entry of schedule?.entries || []) {
          if (!def || ![def.key, def.label, def.name].includes(entry.day)) continue;
          if (/^rehberlik(?:\s|\/|$)/i.test(entry.course || '')) continue;
          for (let p = number(entry.startPeriod || 1); p <= number(entry.endPeriod || entry.startPeriod || 1); p++) slots.add(p);
        }
        const status = dayStatus(iso, change);
        const regular = status === 'normal' || status === 'holiday';
        const count = !regular ? 0 : number(change.lessons ?? slots.size);
        const quota = options.role === 'admin' ? 6 : 15;
        const cap = options.role === 'admin' ? 6 : 15;
        const extra = total => Math.min(cap, Math.max(0, total - quota));
        const prep = total => Math.min(3, Math.floor(total / 10));
        const social = Boolean(options.social && day === Number(options.socialDay) && regular && !socialPaid);
        const duty = Boolean(dutyDates.has(iso) && day < 5 && status === 'normal' && !change.noDuty && !dutyPaid);
        const row = {
          iso, count, planned:slots.size, registered:dutyDates.has(iso), schedule:!!schedule,
          status,
          lesson:!regular ? 0 : number(change.paidLesson ?? (fixed ? options.pattern?.[day] ?? defaultPattern[day] : extra(taught + count) - extra(taught))),
          prep:options.role === 'admin' || fixed ? 0 : prep(taught + count) - prep(taught),
          social:social ? 2 : 0,
          admin:options.role === 'admin' && day < 5 && regular ? number(change.admin ?? options.admin) : 0,
          duty:duty ? 3 : 0,
          boarding:boardingDates.get(iso) || 0,
          boardingRegistered:boardingDates.has(iso),
          seminar:status === 'seminar' && day < 5 ? 3 : 0,
          other:regular ? number(change.other) : 0
        };
        taught += count;
        dutyPaid ||= duty;
        socialPaid ||= social;
        weekRows.push(row);
      }
      if (fixed) {
        const last = weekRows.slice(0,5).filter(row => row.status === 'normal' || row.status === 'holiday').at(-1);
        if (last) last.prep = Math.min(3, Math.floor(taught / 10));
      }
      result.push(...weekRows.filter(row => row.iso >= start && row.iso <= end));
    }
    return {start, end, rows:result};
  }

  function open(key) {
    month = /^\d{4}-(0[1-9]|1[0-2])$/.test(key || '') ? key : month || localISODate().slice(0,7);
    const data = settings.extraLessons327 || {};
    const shared = data.options || {};
    const options = {role:'teacher', mode:'week', distribution:'fixed', pattern:defaultPattern, social:false, socialDay:4, admin:4, tax:'', plus:0, rate:'', ...shared, ...data.periods?.[month], distribution:shared.distribution ?? 'fixed', pattern:shared.pattern ?? defaultPattern, social:shared.social ?? false, socialDay:shared.socialDay ?? 4, plus:shared.plus ?? 0, applyPlus:data.periods?.[month]?.applyPlus ?? true};
    const changes = data.days || {};
    const schedules = [settings.schedule, ...(settings.scheduleArchive || [])];
    const [from, to] = period(month, options.mode);
    const duties = dutyEntriesForRange(addDaysISO(from, -weekday(from)).slice(0,7)+'-01', addDaysISO(to, 6));
    const result = calculate(month, options, schedules, duties, changes);
    const totals = fields.map(field => result.rows.reduce((sum,row) => sum + row[field], 0));
    const hours = totals.reduce((sum,value) => sum + value, 0);
    const assumedRate = month.startsWith('2026-') ? 140 * (month < '2026-07' ? 1.387871 : 1.575512) : 0;
    const rate = Number(options.rate || assumedRate);
    const gross = rate * (hours + (totals[0] + totals[3]) * (options.applyPlus ? Number(options.plus) : 0) / 100);
    const net = options.tax === '' ? null : gross * (1 - Number(options.tax) / 100 - 0.00759);
    snapshot = {result, totals, hours};
    const select = (name, pairs) => '<select data-mm-setting="' + name + '">' + pairs.map(([value,label]) =>
      '<option value="' + value + '"' + (String(options[name]) === String(value) ? ' selected' : '') + '>' + label + '</option>').join('') + '</select>';
    const input = (name, max, step = 1) => '<input type="number" min="0" max="' + max + '" step="' + step + '" data-mm-setting="' + name + '" value="' + esc(options[name]) + '">';
    const [year, monthNumber] = month.split('-');
    const currentYear = Number(localISODate().slice(0,4));
    const firstYear = Math.min(currentYear - 10, Number(year));
    const lastYear = Math.max(currentYear + 5, Number(year));
    const months = Array.from({length:12}, (_, i) => {
      const value = String(i + 1).padStart(2, '0');
      const name = new Date(2020,i,1).toLocaleDateString('tr-TR',{month:'long'});
      return '<option value="'+value+'"'+(value===monthNumber?' selected':'')+'>'+name+'</option>';
    }).join('');
    const years = Array.from({length:lastYear-firstYear+1}, (_, i) => {
      const value = String(firstYear+i);
      return '<option value="'+value+'"'+(value===year?' selected':'')+'>'+value+'</option>';
    }).join('');
    el('modalTitle').textContent = 'Ek Ders Hesaplama';
    el('modalSubtitle').textContent = result.start.split('-').reverse().join('.') + ' – ' + result.end.split('-').reverse().join('.');
    el('modalBody').innerHTML = `
      <div class="form-grid mm-ek-form">
        <div class="mm-ek-period-picker">
          <label>Hesap ayı<select id="mmEkMonth">${months}</select></label>
          <label>Yıl<select id="mmEkYear">${years}</select></label>
        </div>
        <label>Dönem ${select('mode',[['calendar','Ay bütünlüğü'],['week','Hafta bütünlüğü (MEBBİS)']])}</label>
        <label>Görev ${select('role',[['teacher','Branş öğretmeni'],['admin','Müdür yardımcısı']])}</label>
        ${options.role === 'admin' ? '<label>Günlük yönetim saati ' + input('admin',24) + '</label>' : ''}
        ${options.role === 'teacher' ? '<label>Ders görevi dağılımı ' + select('distribution',[['fixed','İdarenin haftalık dağılımı'],['auto','Ders yüküne göre otomatik']]) + '</label>' : ''}
        ${options.role === 'teacher' && options.distribution === 'fixed' ? `<details class="mm-ek-period-picker"><summary>Haftalık saatleri düzenle</summary>${weekdays.map((name,i)=>'<label>'+name+'<input type="number" min="0" max="15" step="1" data-mm-pattern="'+i+'" value="'+number(options.pattern[i])+'"></label>').join('')}</details>` : ''}
        <label>Rehberlik / kulüp ${select('social',[['false','Yok'],['true','Var']])}</label>
        ${options.social ? '<label>Görevin çizelge günü ' + select('socialDay',[[0,'Pazartesi'],[1,'Salı'],[2,'Çarşamba'],[3,'Perşembe'],[4,'Cuma']]) + '</label>' : ''}
        <label>Öğrenim bilgisi ${select('plus',[[0,'Lisans'],[7,'Yüksek Lisans'],[20,'Doktora']])}</label>
        <label>Bu ay öğrenim artırımı ${select('applyPlus',[['true','Uygula'],['false','Artırımsız hesapla']])}</label>
        <label>Brüt gündüz saat ücreti (₺) ${input('rate',99999,0.000001)}</label>
        <label>Gelir vergisi (%) ${input('tax',40)}</label>
      </div>
      <p><b>${hours} saat</b>${rate ? ' · Brüt ' + money.format(gross) : ''}${rate && net !== null ? ' · Tahmini net ' + money.format(net) : ''}</p>
      <p>${fields.map((_,i) => headings[i] + ' ' + totals[i]).join(' · ')}</p>
      <p class="tiny">Ara tatil haftasında katılım varsa günde 3 saat seminer yazılır. Katılmadığınız günü Ödemesiz gün olarak işaretleyin. Resmî tatil satırının ödeme durumunu gün üzerinden değiştirebilirsiniz.</p>
      <p class="tiny">Ders programı, okul ve pansiyon nöbetleri otomatik okunur. İzin, rapor, tatil ve yapılmayan nöbet için ilgili günü düzenleyin. Planlı görevleri bordro öncesi kontrol edin.</p>
      <p class="tiny">${assumedRate ? 'Brüt saat ücreti boşsa 2026 gündüz tarifesi uygulanır. ' : 'Tutar için brüt saat ücretini girin. '}Net tahminde girdiğiniz vergi oranı ve binde 7,59 damga vergisi kullanılır.</p>
      <button type="button" id="mmEkCsv" class="secondary">Excel için CSV indir</button>
      <div class="mm-ek-days"><table class="mm-ek-table">
        <thead><tr><th>Gün</th><th>Ders yükü</th>${headings.map(h=>'<th>'+h+'</th>').join('')}</tr></thead>
        <tbody>${result.rows.map(r=>`<tr><td><button type="button" class="secondary" data-mm-day="${r.iso}">${r.iso.slice(5).split('-').reverse().join('.')}${r.status !== 'normal' ? ' · ' + statusLabels[r.status] : ''}${r.registered ? ' · Okul' : ''}${r.boardingRegistered ? ' · Pansiyon' : ''}</button></td><td data-label="Ders yükü">${r.count}${!r.schedule && changes[r.iso]?.lessons == null ? ' *' : ''}</td>${fields.map((f,i)=>'<td data-label="'+headings[i]+'">'+r[f]+'</td>').join('')}</tr>`).join('')}</tbody>
      </table></div>
      ${result.rows.some(r=>!r.schedule) ? '<p class="tiny">* Bu tarihe ait ders programı bulunamadı. Ders yükünü gün üzerinden girebilirsiniz.</p>' : ''}
      <p class="tiny"><a target="_blank" rel="noopener" href="https://personel.meb.gov.tr/www/personel-genel-mudurlugu-mevzuat/icerik/363">MEB ek ders mevzuatı</a> · <a target="_blank" rel="noopener" href="https://tut.meb.gov.tr/meb_iys_dosyalar/2025_03/06154241_24095622_ek_ders_modulu_uygulama_kilavuzu.pdf">MEBBİS hesaplama dönemi</a></p>`;
    view = el('modalBody');
    view.onchange = event => {
      const target = event.target;
      if (target.id === 'mmEkMonth' || target.id === 'mmEkYear') return open(el('mmEkYear').value + '-' + el('mmEkMonth').value);
      if (target.dataset.mmPattern != null) {
        const pattern = [...options.pattern];
        pattern[Number(target.dataset.mmPattern)] = Math.min(15,number(target.value));
        target.value = pattern[Number(target.dataset.mmPattern)];
        data.options = {...shared, pattern};
        settings.extraLessons327 = data;
        saveSettings();
        open();
        view.querySelector('details')?.setAttribute('open','');
        return;
      }
      const name = target.dataset.mmSetting;
      if (!name) return;
      const value = ['social','applyPlus'].includes(name) ? target.value === 'true' : target.value;
      settings.extraLessons327 = data;
      const sharedFields = ['social','socialDay','plus','distribution'];
      if (name !== 'applyPlus') data.options = {...shared, [name]:value};
      if (!sharedFields.includes(name)) {
        data.periods ||= {};
        data.periods[month] = {...data.periods[month], [name]:value};
      }
      saveSettings();
      open();
    };
    view.onclick = event => {
      const day = event.target.closest('[data-mm-day]')?.dataset.mmDay;
      if (day) editDay(day);
      if (event.target.id === 'mmEkCsv') exportCsv();
    };
    el('modal').classList.add('open');
  }

  function editDay(date) {
    const data = settings.extraLessons327 || {};
    const change = data.days?.[date] || {};
    const row = snapshot.result.rows.find(r => r.iso === date);
    view.onchange = null;
    view.onclick = null;
    el('modalSubtitle').textContent = dutyDate(date);
    view.innerHTML = `<form id="mmEkDayForm" class="form-grid mm-ek-form">
      <label>Gün durumu<select name="status"><option value="">Takvime göre (${statusLabels[dayStatus(date)]})</option>${Object.entries(statusLabels).map(([value,label])=>'<option value="'+value+'"'+((change.off?'off':change.status)===value?' selected':'')+'>'+label+'</option>').join('')}</select></label>
      <label>Ödenecek ders görevi (saat)<input name="paidLesson" type="number" min="0" max="24" value="${change.paidLesson ?? ''}"></label>
      <label>Ders yükü (programda ${row.planned})<input name="lessons" type="number" min="0" max="24" value="${change.lessons ?? ''}"></label>
      <label>Yönetim saati (günlük düzeltme)<input name="admin" type="number" min="0" max="24" value="${change.admin ?? ''}"></label>
      <label>Diğer gündüz ek ders saati<input name="other" type="number" min="0" max="24" value="${change.other ?? ''}"></label>
      ${row.registered ? '<label><input name="noDuty" type="checkbox" ' + (change.noDuty ? 'checked' : '') + '> Okul nöbeti yapılmadı</label>' : ''}
      ${row.boardingRegistered ? '<label><input name="noBoarding" type="checkbox" ' + (change.noBoarding ? 'checked' : '') + '> Pansiyon nöbeti yapılmadı</label>' : ''}
      <button type="submit">Kaydet</button><button type="button" id="mmEkDayBack" class="secondary">Geri</button>
    </form>`;
    el('mmEkDayBack').onclick = () => open();
    el('mmEkDayForm').onsubmit = event => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const next = {status:form.get('status'), noDuty:row.registered ? form.has('noDuty') : !!change.noDuty, noBoarding:row.boardingRegistered ? form.has('noBoarding') : !!change.noBoarding};
      for (const field of ['lessons','paidLesson','admin','other']) {
        if (form.get(field) !== '') next[field] = number(form.get(field));
      }
      data.days ||= {};
      data.days[date] = next;
      settings.extraLessons327 = data;
      saveSettings();
      open();
    };
  }

  function exportCsv() {
    const {result,totals} = snapshot;
    const lines = [['Tarih','Ders yükü',...headings],
      ...result.rows.map(row => [row.iso,row.count,...fields.map(f=>row[f])]), ['Toplam','',...totals]];
    const url = URL.createObjectURL(new Blob(['\ufeff' + lines.map(line=>line.join(';')).join('\r\n')], {type:'text/csv;charset=utf-8'}));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = month + '_Ek_Ders.csv';
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  }

  const style = document.createElement('style');
  style.textContent = `
    #modalBody:has(.mm-ek-form) {overflow-x:hidden;min-width:0}
    #modalBody .mm-ek-form, #modalBody .mm-ek-form label {min-width:0;max-width:100%}
    #modalBody .mm-ek-form input:not([type=checkbox]), #modalBody .mm-ek-form select {
      display:block;box-sizing:border-box;width:100%;min-width:0;max-width:100%;margin-inline:0
    }
    #modalBody .mm-ek-period-picker {display:grid;grid-template-columns:minmax(0,3fr) minmax(0,2fr);gap:8px;min-width:0;grid-column:1/-1}
    #modalBody .mm-ek-form select {width:100%!important;min-width:0!important;max-width:100%!important}
    #modal.open:has(.mm-ek-form), #modal.open:has(.mm-ek-form) #modalBody {
      overflow-x:hidden!important;overscroll-behavior-x:none;touch-action:pan-y pinch-zoom
    }
    html:has(#modal.open .mm-ek-form), body:has(#modal.open .mm-ek-form) {
      overflow-x:clip;overscroll-behavior-x:none
    }
    .mm-ek-days {margin-top:12px;min-width:0}
    #modalBody .mm-ek-table {width:100%;min-width:0;table-layout:fixed;text-align:center}
    .mm-ek-table th,.mm-ek-table td {overflow-wrap:anywhere}
    @media(max-width:720px) {
      #modalBody .mm-ek-table, #modalBody .mm-ek-table tbody {display:block}
      #modalBody .mm-ek-table thead {position:absolute;clip-path:inset(50%);width:1px;height:1px;overflow:hidden}
      #modalBody .mm-ek-table tr {display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:4px;margin:0 0 10px;padding:8px;border:1px solid #b9a88a55;border-radius:10px}
      #modalBody .mm-ek-table td {display:flex;align-items:center;justify-content:space-between;gap:6px;padding:5px;white-space:normal;min-width:0}
      #modalBody .mm-ek-table td:first-child {grid-column:1/-1}
      #modalBody .mm-ek-table td[data-label]::before {content:attr(data-label);text-align:left;font-size:.82em}
    }`;
  document.head.append(style);

  function updateVersionLabel() {
    const badge = document.querySelector('.mm-home-brand .tiny');
    if (badge && /^v7[.]8[.][0-9]+$/.test(badge.textContent.trim())) badge.textContent = 'v7.8.334';
  }

  document.addEventListener('DOMContentLoaded', updateVersionLabel);
  updateVersionLabel();
  const openSettingsBeforeExtraLessons = window.openSettings;
  if (typeof openSettingsBeforeExtraLessons === 'function') {
    window.openSettings = function (...args) {
      const result = openSettingsBeforeExtraLessons.apply(this,args);
      const body = el('modalBody');
      const schoolLabel = body?.querySelector('#profileSchool')?.previousElementSibling;
      if (!schoolLabel || schoolLabel.tagName !== 'LABEL' || body.querySelector('#mmEkProfileEducation')) return result;
      const label = document.createElement('label');
      label.textContent = 'Öğrenim Bilgisi';
      label.className = schoolLabel.className;
      label.htmlFor = 'mmEkProfileEducation';
      const picker = document.createElement('select');
      picker.id = 'mmEkProfileEducation';
      for (const [value,name] of [[0,'Lisans'],[7,'Yüksek Lisans'],[20,'Doktora']]) {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = name;
        picker.append(option);
      }
      picker.value = String(settings.extraLessons327?.options?.plus ?? 0);
      picker.addEventListener('change', () => {
        const data = settings.extraLessons327 ||= {};
        data.options = {...data.options, plus:Number(picker.value)};
        saveSettings();
      });
      picker.style.cssText = 'width:100%;margin:4px 0 10px';
      schoolLabel.before(label, picker);
      return result;
    };
  }
  window.openExtraLessons327 = open;
})();
