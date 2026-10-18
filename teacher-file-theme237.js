/* MualliMate v7.8.237 — Teacher dossier outputs only. No student data is written. */
(function () {
  'use strict';
  if (window.MualliMateTeacherTheme237) return;
  const W = 1240, H = 1754, GREEN = '#064e3b', GOLD = '#b89a56';
  const BASE = new URL('./assets/teacher-file/', document.currentScript.src).href;
  let images, pdfEngine, currentPages = [], previewGeneration = 0;
  const asset = name => new URL(name, BASE).href;
  const clone = value => JSON.parse(JSON.stringify(value));
  const filename = title => String(title || 'Ogretmen_Dosyasi').replace(/[\\/:*?"<>|]/g, '_');
  const source = () => window.teacherFileThemeData235();
  function loadImage(name) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Tema görseli yüklenemedi. İnternet bağlantısıyla uygulamayı bir kez açıp tekrar deneyin.'));
      img.src = asset(name);
    });
  }
  function backgrounds() {
    if (!images) images = Promise.all([loadImage('paper.jpg'), loadImage('cover.jpg')]).catch(e => { images = null; throw e; });
    return images;
  }
  function splitLines(ctx, value, width) {
    const lines = [];
    for (const paragraph of String(value == null ? '' : value).split(/\r?\n/)) {
      let line = '';
      for (const word of paragraph.split(/\s+/).filter(Boolean)) {
        if (ctx.measureText((line ? line + ' ' : '') + word).width <= width) {
          line = (line ? line + ' ' : '') + word;
          continue;
        }
        if (line) { lines.push(line); line = ''; }
        // Long school names, e-mail addresses and unspaced notes also wrap.
        for (const ch of Array.from(word)) {
          if (line && ctx.measureText(line + ch).width > width) { lines.push(line); line = ''; }
          line += ch;
        }
      }
      lines.push(line);
    }
    return lines.length ? lines : [''];
  }
  function headingLayout(ctx, cur) {
    const text = cur.cover ? 'TÜRKİYE YÜZYILI\nMAARİF MODELİ\nÖĞRETMEN DOSYASI' : cur.title;
    let size = cur.cover ? 59 : 64, lines;
    do {
      ctx.font = size + 'px Georgia, "Times New Roman", serif';
      lines = splitLines(ctx, text, 1000);
      if (lines.length * size * 1.18 <= 260) break;
      size--;
    } while (size > 18);
    const line = size * 1.18;
    return { lines, size, line, first: 738 - (lines.length - 1) * line };
  }
  function drawHeading(ctx, layout) {
    ctx.fillStyle = GREEN; ctx.textAlign = 'center';
    ctx.font = layout.size + 'px Georgia, "Times New Roman", serif';
    layout.lines.forEach((line, i) => ctx.fillText(line, W / 2, layout.first + i * layout.line));
    ctx.textAlign = 'left';
  }
  function wrappedCenter(ctx, text, y, size, maxWidth = 970) {
    ctx.font = size + 'px "Times New Roman", serif'; ctx.textAlign = 'center';
    const lines = splitLines(ctx, text, maxWidth);
    lines.forEach((line, i) => ctx.fillText(line, W / 2, y + i * size * 1.2));
    return y + lines.length * size * 1.2;
  }
  function singleCenter(ctx, text, y, size, width) {
    while (size > 12) {
      ctx.font = size + 'px "Times New Roman", serif';
      if (ctx.measureText(String(text || '')).width <= width) break;
      size--;
    }
    ctx.textAlign = 'center'; ctx.fillText(String(text || ''), W / 2, y);
  }
  function canvas(background) {
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const ctx = cv.getContext('2d');
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H); ctx.drawImage(background, 0, 0, W, H);
    return cv;
  }
  function tablePages(ctx, rows, summary) {
    const pages = [[]], startY = summary ? 930 : 842, bottomY = 1550, lineHeight = summary ? 28 : 31;
    let y = startY;
    ctx.font = (summary ? 22 : 25) + 'px "Times New Roman", serif';
    for (const row of rows || []) {
      const left = splitLines(ctx, row[0], summary ? 750 : 280), right = splitLines(ctx, row[1], summary ? 168 : 650);
      const maxLines = Math.max(left.length, right.length);
      for (let offset = 0; offset < maxLines;) {
        let available = Math.floor((bottomY - y - (summary ? 16 : 22)) / lineHeight);
        if (available < 1) { pages.push([]); y = startY; available = Math.floor((bottomY - y - (summary ? 16 : 22)) / lineHeight); }
        const count = Math.min(available, maxLines - offset);
        const cell = { left: left.slice(offset, offset + count), right: right.slice(offset, offset + count), height: Math.max(summary ? 44 : 50, count * lineHeight + (summary ? 16 : 22)) };
        pages[pages.length - 1].push(cell); y += cell.height; offset += count;
      }
    }
    return pages;
  }
  async function render(cur) {
    const [paper, cover] = await backgrounds();
    const measuring = canvas(paper), ctx = measuring.getContext('2d');
    const heading = headingLayout(ctx, cur);
    if (cur.cover) {
      const cv = canvas(cover), x = cv.getContext('2d'); drawHeading(x, heading);
      x.fillStyle = GREEN;
      let schoolSize = 35;
      while (schoolSize > 18) {
        x.font = schoolSize + 'px "Times New Roman", serif';
        if (splitLines(x, cur.rows.school || 'OKUL ADI', 970).length * schoolSize * 1.2 <= 120) break;
        schoolSize--;
      }
      wrappedCenter(x, cur.rows.school || 'OKUL ADI', 958, schoolSize);
      wrappedCenter(x, (cur.rows.year || '') + ' Eğitim Öğretim Yılı', 1100, 29);
      wrappedCenter(x, 'ÖĞRETMENİN ADI SOYADI', 1320, 41, 890);
      // The source template's name/branch box remains in place.
      singleCenter(x, cur.rows.teacher || 'ÖĞRETMEN ADI', 1461, 32, 620);
      singleCenter(x, cur.rows.branch || 'BRANŞ / GÖREV', 1497, 27, 620);
      return { canvases: [cv], chunks: [], heading };
    }
    const chunks = tablePages(ctx, cur.rows, cur.summary);
    const canvases = chunks.map((rows, pageIndex) => {
      const cv = canvas(paper), x = cv.getContext('2d'); drawHeading(x, heading);
      let y = cur.summary ? 930 : 842;
      const boundary = cur.summary ? 868 : 394;
      if (cur.summary) {
        (cur.context || []).forEach((text, i) => wrappedCenter(x, text, 835 + i * 32, 22, 1000));
      }
      for (const row of rows) {
        x.fillStyle = '#f5f5ec'; x.fillRect(88, y, boundary - 88, row.height);
        x.strokeStyle = '#b9c8bc'; x.lineWidth = 1.2;
        x.strokeRect(88, y, 980, row.height);
        x.beginPath(); x.moveTo(boundary, y); x.lineTo(boundary, y + row.height); x.stroke();
        x.fillStyle = GREEN; x.textAlign = 'left';
        x.font = (cur.summary ? 22 : 25) + 'px "Times New Roman", serif';
        row.left.forEach((line, i) => x.fillText(line, 101, y + (cur.summary ? 29 : 33) + i * (cur.summary ? 28 : 31)));
        x.fillStyle = '#243a31';
        row.right.forEach((line, i) => x.fillText(line, boundary + 16, y + (cur.summary ? 29 : 33) + i * (cur.summary ? 28 : 31)));
        y += row.height;
      }
      if (chunks.length > 1) {
        x.textAlign = 'center'; x.fillStyle = '#67786c'; x.font = '18px "Times New Roman", serif';
        x.fillText((pageIndex + 1) + ' / ' + chunks.length, 620, 1595);
      }
      return cv;
    });
    return { canvases, chunks, heading };
  }
  function showError(e) { console.error(e); alert(e && e.message ? e.message : 'Öğretmen dosyası çıktısı hazırlanamadı.'); }
  function closePreview() {
    previewGeneration++; currentPages = [];
    document.getElementById('teacherFilePreview')?.remove();
    if (!document.getElementById('modal')?.classList.contains('open')) window.openTeacherFileCenter();
  }
  async function preview(cur) {
    const generation = ++previewGeneration;
    document.getElementById('teacherFilePreview')?.remove();
    const root = document.createElement('div');
    root.id = 'teacherFilePreview'; root.className = 'guidance-preview-sheet mm-teacher-theme-preview';
    root.innerHTML = '<div class="guidance-preview-toolbar"><button class="secondary" data-action="back">← Dön</button><button data-action="pdf" disabled>📄 PDF</button><button class="secondary" data-action="word" disabled>📝 Word</button><button class="secondary" data-action="prev" disabled>‹</button><span class="mm-teacher-page-count" aria-live="polite"></span><button class="secondary" data-action="next" disabled>›</button></div><div class="mm-teacher-theme-stage"><p role="status">Temalı çıktı hazırlanıyor…</p></div>';
    document.body.appendChild(root);
    window._teacherFileCurrent = clone(cur);
    root.querySelector('[data-action="back"]').onclick = closePreview;
    root.querySelector('[data-action="pdf"]').onclick = () => teacherFilePdfCurrent();
    root.querySelector('[data-action="word"]').onclick = () => teacherFileWordCurrent();
    try {
      const result = await render(cur);
      if (generation !== previewGeneration || !root.isConnected) return;
      currentPages = result.canvases;
      let index = 0;
      const paint = () => {
        const stage = root.querySelector('.mm-teacher-theme-stage');
        stage.replaceChildren(currentPages[index]);
        currentPages[index].setAttribute('aria-label', cur.title + ' · Sayfa ' + (index + 1));
        root.querySelector('.mm-teacher-page-count').textContent = (index + 1) + ' / ' + currentPages.length;
        root.querySelector('[data-action="prev"]').disabled = index === 0;
        root.querySelector('[data-action="next"]').disabled = index === currentPages.length - 1;
      };
      root.querySelector('[data-action="prev"]').onclick = () => { if (index > 0) { index--; paint(); } };
      root.querySelector('[data-action="next"]').onclick = () => { if (index < currentPages.length - 1) { index++; paint(); } };
      for (const action of ['pdf', 'word']) root.querySelector('[data-action="' + action + '"]').disabled = false;
      paint();
    } catch (e) {
      if (generation === previewGeneration && root.isConnected) root.querySelector('.mm-teacher-theme-stage').textContent = e.message;
    }
  }
  async function save(blob, name, mime) { return saveOutputBlob(blob, name, mime); }
  async function exportPdf(cur) {
    const result = await render(cur);
    const lib = await library(), doc = await lib.PDFDocument.create();
    for (const canvas of result.canvases) {
      const image = await doc.embedJpg(canvas.toDataURL('image/jpeg', .97));
      const page = doc.addPage([595.28, 841.89]);
      page.drawImage(image, {x:0, y:0, width:595.28, height:841.89});
    }
    return save(new Blob([await doc.save()], {type:'application/pdf'}), filename(cur.cover ? 'Ogretmen_Dosyasi_Kapak' : cur.title) + '.pdf', 'application/pdf');
  }
  const xml = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
  function paragraph(text, opts = {}) {
    const size = opts.size || 24;
    let pr = '<w:spacing w:before="0" w:after="0" w:line="' + Math.round(size * 10 * 1.18) + '" w:lineRule="exact"/>';
    if (opts.center) pr += '<w:jc w:val="center"/>';
    if (opts.frame) {
      const [x, y, width] = opts.frame;
      pr += '<w:framePr w:w="' + Math.round(width * 1440 / 25.4) + '" w:x="' + Math.round(x * 1440 / 25.4) + '" w:y="' + Math.round(y * 1440 / 25.4) + '" w:hAnchor="page" w:vAnchor="page" w:wrap="none"/>';
    }
    return '<w:p><w:pPr>' + pr + '</w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:color w:val="064E3B"/><w:sz w:val="' + size + '"/></w:rPr><w:t xml:space="preserve">' + xml(text) + '</w:t></w:r></w:p>';
  }
  const ROOT_NS = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"';
  function imageAnchor() {
    return '<w:p><w:pPr><w:spacing w:before="0" w:after="0" w:line="1" w:lineRule="exact"/></w:pPr><w:r><w:drawing><wp:anchor distT="0" distB="0" distL="0" distR="0" simplePos="0" relativeHeight="0" behindDoc="1" locked="0" layoutInCell="1" allowOverlap="1"><wp:simplePos x="0" y="0"/><wp:positionH relativeFrom="page"><wp:posOffset>0</wp:posOffset></wp:positionH><wp:positionV relativeFrom="page"><wp:posOffset>0</wp:posOffset></wp:positionV><wp:extent cx="7560000" cy="10692000"/><wp:wrapNone/><wp:docPr id="1" name="Dokuma teması"/><wp:cNvGraphicFramePr/><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic><pic:nvPicPr><pic:cNvPr id="1" name="tema.jpg"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="rIdTheme"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="7560000" cy="10692000"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:anchor></w:drawing></w:r></w:p>';
  }
  async function exportWord(cur) {
    if (typeof JSZip === 'undefined') throw new Error('Word bileşeni yüklenemedi.');
    const result = await render(cur);
    const r = await fetch(asset(cur.cover ? 'cover.jpg' : 'paper.jpg'));
    if (!r.ok) throw new Error('Word tema görseli yüklenemedi.');
    const z = new JSZip(), prefix = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
    z.file('[Content_Types].xml', prefix + '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="jpg" ContentType="image/jpeg"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/header1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/></Types>');
    z.folder('_rels').file('.rels', prefix + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>');
    const word = z.folder('word');
    word.folder('media').file('tema.jpg', await r.arrayBuffer());
    word.folder('_rels').file('document.xml.rels', prefix + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rIdHeader" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header1.xml"/></Relationships>');
    word.folder('_rels').file('header1.xml.rels', prefix + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rIdTheme" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/tema.jpg"/></Relationships>');
    const layout = result.heading;
    let header = imageAnchor();
    layout.lines.forEach((line, i) => {
      // Canvas glyph bounds end above the same separator in the editable Word header.
      const y = (layout.first + i * layout.line - layout.size * .92) * 297 / H;
      header += paragraph(line, { center: true, size: Math.round(layout.size * 595.28 / W * 2), frame: [15, y, 180] });
    });
    if (cur.summary) (cur.context || []).forEach((text, i) => { header += paragraph(text, {center:true, size:21, frame:[15, (815 + i * 32) * 297 / H, 180]}); });
    word.file('header1.xml', prefix + '<w:hdr ' + ROOT_NS + '>' + header + paragraph('', {size:2}) + '</w:hdr>');
    let body = '';
    const columnLeft = cur.summary ? 7488 : 2940, columnRight = 9400 - columnLeft;
    if (cur.cover) {
      const fields = [
        [cur.rows.school || 'OKUL ADI', 155, 32],
        [(cur.rows.year || '') + ' Eğitim Öğretim Yılı', 183, 28],
        ['ÖĞRETMENİN ADI SOYADI', 218, 36],
        [cur.rows.teacher || 'ÖĞRETMEN ADI', 243, 29],
        [cur.rows.branch || 'BRANŞ / GÖREV', 249, 25]
      ];
      for (const [text, y, size] of fields) body += paragraph(text, { center: true, size, frame: [20, y, 170] });
      body += paragraph('');
    } else {
      result.chunks.forEach((rows, i) => {
        if (i) body += '<w:p><w:pPr><w:spacing w:before="0" w:after="0" w:line="1" w:lineRule="exact"/></w:pPr><w:r><w:br w:type="page"/></w:r></w:p>';
        body += '<w:tbl><w:tblPr><w:tblW w:w="9400" w:type="dxa"/><w:tblLayout w:type="fixed"/><w:tblBorders>' + ['top','left','bottom','right','insideH','insideV'].map(edge => '<w:' + edge + ' w:val="single" w:sz="4" w:color="B9C8BC"/>').join('') + '</w:tblBorders><w:tblCellMar><w:top w:w="60" w:type="dxa"/><w:left w:w="90" w:type="dxa"/><w:bottom w:w="60" w:type="dxa"/><w:right w:w="90" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid><w:gridCol w:w="' + columnLeft + '"/><w:gridCol w:w="' + columnRight + '"/></w:tblGrid>';
        for (const row of rows) body += '<w:tr><w:trPr><w:cantSplit/></w:trPr>' + [row.left, row.right].map((lines, c) => '<w:tc><w:tcPr><w:tcW w:w="' + (c ? columnRight : columnLeft) + '" w:type="dxa"/>' + (c ? '' : '<w:shd w:fill="F5F5EC"/>') + '</w:tcPr>' + lines.map(line => paragraph(line, {size:cur.summary ? 21 : 24})).join('') + '</w:tc>').join('') + '</w:tr>';
        body += '</w:tbl>';
      });
      body += paragraph('');
    }
    word.file('document.xml', prefix + '<w:document ' + ROOT_NS + '><w:body>' + body + '<w:sectPr><w:headerReference w:type="default" r:id="rIdHeader"/><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="' + Math.round((cur.summary ? 930 : 842) * 297 / H * 1440 / 25.4) + '" w:right="1500" w:bottom="1800" w:left="850" w:header="0" w:footer="0"/></w:sectPr></w:body></w:document>');
    const blob = await z.generateAsync({type:'blob', mimeType:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
    return save(blob, filename(cur.cover ? 'Ogretmen_Dosyasi_Kapak' : cur.title) + '.docx', blob.type);
  }
  function summary() {
    const data = source();
    return { title:'ÖĞRETMEN DOSYASI DURUM ÖZETİ', cover:false, summary:true, context:[data.profile.name + ' · ' + data.profile.branch, data.profile.school, data.profile.year], rows:[
      ...data.items.map(item => [item.id + '. ' + item.title, item.status])
    ] };
  }
  function library() {
    if (window.PDFLib) return Promise.resolve(window.PDFLib);
    if (!pdfEngine) pdfEngine = new Promise((resolve, reject) => {
      const s = document.createElement('script'); s.src = asset('pdf-lib.min.js');
      s.onload = () => window.PDFLib ? resolve(window.PDFLib) : reject(new Error('PDF bileşeni açılamadı.'));
      s.onerror = () => reject(new Error('Bölüm kapakları bileşeni yüklenemedi.'));
      document.head.appendChild(s);
    }).catch(e => { pdfEngine = null; throw e; });
    return pdfEngine;
  }
  async function sectionCovers(button) {
    if (button?.disabled) return;
    if (button) { button.disabled = true; button.textContent = 'PDF hazırlanıyor…'; }
    try {
      const data = source(), p = data.profile;
      const cur = {title:'Öğretmen Dosyası', cover:true, rows:{ school:p.school, year:p.year, teacher:p.name, branch:p.branch }};
      const [lib, response, rendered] = await Promise.all([library(), fetch(asset('bolum-kapaklari.pdf')), render(cur)]);
      if (!response.ok) throw new Error('Bölüm kapakları yüklenemedi.');
      const doc = await lib.PDFDocument.load(await response.arrayBuffer());
      const image = await doc.embedJpg(rendered.canvases[0].toDataURL('image/jpeg', .97));
      const {width, height} = doc.getPage(0).getSize();
      doc.removePage(0); const page = doc.insertPage(0, [width, height]);
      page.drawImage(image, {x:0,y:0,width,height});
      await save(new Blob([await doc.save()], {type:'application/pdf'}), 'Ogretmen_Dosyasi_Bolum_Kapaklari.pdf', 'application/pdf');
    } catch (e) { showError(e); }
    finally { if (button) { button.disabled = false; button.textContent = '📚 Bölüm Kapakları PDF'; } }
  }
  async function sectionPage(number, title) {
    if (!Number.isInteger(number) || number < 1 || number > 41) throw new Error('Dosya sayfası bulunamadı.');
    const [lib, response] = await Promise.all([library(), fetch(asset('bolum-kapaklari.pdf'))]);
    if (!response.ok) throw new Error('Öğretmen dosyası yüklenemedi.');
    const source = await lib.PDFDocument.load(await response.arrayBuffer()), doc = await lib.PDFDocument.create();
    const [page] = await doc.copyPages(source, [number - 1]); doc.addPage(page);
    await save(new Blob([await doc.save()], {type:'application/pdf'}), String(number).padStart(2,'0') + '_' + filename(title) + '.pdf', 'application/pdf');
  }
  let cardScroll = 0, cardFocus = null, previewImages;
  const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function returnToList(refresh = false) {
    const root = document.getElementById('teacherFileCard236');
    if (!root) return;
    root.remove();
    if (refresh) window.openTeacherFileCenter();
    const box = document.querySelector('#modal .modal-box');
    if (box) box.scrollTop = cardScroll;
    if (cardFocus?.isConnected) cardFocus.focus({preventScroll:true});
  }
  function openCard(title, html, subtitle = '') {
    returnToList();
    cardScroll = document.querySelector('#modal .modal-box')?.scrollTop || 0;
    cardFocus = document.activeElement;
    const root = document.createElement('div'); root.id = 'teacherFileCard236';
    root.className = 'mm-teacher-card-overlay';
    root.innerHTML = '<section class="mm-teacher-card" role="dialog" aria-modal="true" aria-labelledby="teacherFileCardTitle236"><div class="mm-teacher-card-head"><div class="mm-teacher-card-heading"><h3 id="teacherFileCardTitle236">' + escapeHtml(title) + '</h3>' + (subtitle ? '<p class="mm-teacher-card-subtitle">' + escapeHtml(subtitle) + '</p>' : '') + '</div><button class="secondary" data-card-back>← Geri</button></div><div class="mm-teacher-card-body">' + html + '</div></section>';
    document.body.appendChild(root);
    root.querySelector('[data-card-back]').onclick = () => returnToList();
    root.querySelector('[data-card-back]').focus({preventScroll:true});
    return root;
  }
  function orderedIds(ids) {
    const values = [...new Set(ids)].sort((a,b)=>a-b);
    if (!values.length || values.some(id=>!Number.isInteger(id)||id<1||id>41)) throw new Error('En az bir belge seçin.');
    return values;
  }
  async function selectedPdf(ids) {
    ids = orderedIds(ids);
    const [lib,response] = await Promise.all([library(),fetch(asset('bolum-kapaklari.pdf'))]);
    if (!response.ok) throw new Error('Öğretmen dosyası yüklenemedi.');
    const original = await lib.PDFDocument.load(await response.arrayBuffer()), doc = await lib.PDFDocument.create();
    for (const id of ids) {
      if (id === 1) {
        const p=source().profile, result=await render({title:'Öğretmen Dosyası',cover:true,rows:{school:p.school,year:p.year,teacher:p.name,branch:p.branch}});
        const image=await doc.embedJpg(result.canvases[0].toDataURL('image/jpeg',.97));
        const page=doc.addPage([595.28,841.89]);page.drawImage(image,{x:0,y:0,width:595.28,height:841.89});
      } else {
        const [page]=await doc.copyPages(original,[id-1]);doc.addPage(page);
      }
    }
    return new Blob([await doc.save()],{type:'application/pdf'});
  }
  function imageLibrary() {
    if (window.teacherFilePageImages236) return Promise.resolve(window.teacherFilePageImages236);
    if (!previewImages) previewImages = new Promise((resolve,reject)=>{
      const script=document.createElement('script');script.src=asset('page-previews236.js');
      script.onload=()=>window.teacherFilePageImages236 ? resolve(window.teacherFilePageImages236) : reject(new Error('Ön izleme yüklenemedi.'));
      script.onerror=()=>reject(new Error('Ön izleme yüklenemedi.'));document.head.appendChild(script);
    }).catch(e=>{previewImages=null;throw e});
    return previewImages;
  }
  async function previewSections(values) {
    const ids=orderedIds(values), generation=++previewGeneration;
    document.getElementById('teacherFilePreview')?.remove();
    const root=document.createElement('div');root.id='teacherFilePreview';root.className='guidance-preview-sheet mm-teacher-theme-preview';root.style.zIndex='2147483502';
    root.innerHTML='<div class="guidance-preview-toolbar"><button class="secondary" data-action="back">← Geri</button><button data-action="pdf" disabled>PDF Dışa Aktar</button><button class="secondary" data-action="prev" disabled>‹</button><span class="mm-teacher-page-count" aria-live="polite"></span><button class="secondary" data-action="next" disabled>›</button></div><div class="mm-teacher-theme-stage" aria-live="polite">Ön izleme hazırlanıyor…</div>';
    document.body.appendChild(root);root.querySelector('[data-action="back"]').onclick=()=>{previewGeneration++;root.remove()};
    let index=0,painting=0;
    async function paint(){
      const serial=++painting, id=ids[index],stage=root.querySelector('.mm-teacher-theme-stage');
      stage.textContent='Ön izleme hazırlanıyor…';
      root.querySelector('.mm-teacher-page-count').textContent=(index+1)+' / '+ids.length;
      root.querySelector('[data-action="prev"]').disabled=index===0;
      root.querySelector('[data-action="next"]').disabled=index===ids.length-1;
      let visual;
      if(id===1){const p=source().profile;visual=(await render({title:'Öğretmen Dosyası',cover:true,rows:{school:p.school,year:p.year,teacher:p.name,branch:p.branch}})).canvases[0]}
      else {const images=await imageLibrary();visual=new Image();visual.src=images[id];await visual.decode()}
      if(generation!==previewGeneration||serial!==painting||!root.isConnected)return;
      visual.setAttribute('aria-label',source().items.find(x=>x.id===id)?.title||'Belge');stage.replaceChildren(visual);
      root.querySelector('[data-action="pdf"]').disabled=false;
    }
    root.querySelector('[data-action="prev"]').onclick=()=>{if(index>0){index--;paint().catch(showError)}};
    root.querySelector('[data-action="next"]').onclick=()=>{if(index<ids.length-1){index++;paint().catch(showError)}};
    root.querySelector('[data-action="pdf"]').onclick=async()=>{
      const button=root.querySelector('[data-action="pdf"]');if(button.disabled)return;button.disabled=true;button.textContent='PDF hazırlanıyor…';
      try {await save(await selectedPdf(ids),ids.length===1?String(ids[0]).padStart(2,'0')+'_'+filename(source().items.find(x=>x.id===ids[0])?.title)+'.pdf':'Ogretmen_Dosyasi_Secilen_Belgeler.pdf','application/pdf')}
      catch(e){showError(e)}finally{button.disabled=false;button.textContent='PDF Dışa Aktar'}
    };
    try{await paint()}catch(e){if(root.isConnected)root.querySelector('.mm-teacher-theme-stage').textContent=e.message}
  }
  function openSelection() {
    const root=openCard('Belgeleri Seç','<p>Seçtiğiniz sayfalar dosya sırasıyla tek PDF olarak hazırlanır.</p><div class="mm-teacher-selection-actions"><button class="secondary" data-select-all>Tümünü Seç</button><button class="ghost" data-select-none>Seçimi Temizle</button></div><div class="mm-teacher-selection-list">'+source().items.map(item=>'<label><input type="checkbox" value="'+item.id+'"><span>'+item.id+'. '+escapeHtml(item.title)+'</span></label>').join('')+'</div><div class="mm-teacher-selection-footer"><span data-selected-count aria-live="polite">0 belge seçildi</span><button data-selected-preview disabled>Ön İzleme</button></div>');
    const checks=[...root.querySelectorAll('input[type="checkbox"]')];
    const update=()=>{const count=checks.filter(x=>x.checked).length;root.querySelector('[data-selected-count]').textContent=count+' belge seçildi';root.querySelector('[data-selected-preview]').disabled=!count};
    root.querySelector('[data-select-all]').onclick=()=>{checks.forEach(x=>x.checked=true);update()};
    root.querySelector('[data-select-none]').onclick=()=>{checks.forEach(x=>x.checked=false);update()};
    checks.forEach(x=>x.onchange=update);
    root.querySelector('[data-selected-preview]').onclick=()=>previewSections(checks.filter(x=>x.checked).map(x=>Number(x.value))).catch(showError);
  }
  window.teacherFileDismiss236 = function(){
    const preview=document.getElementById('teacherFilePreview');
    if(preview){previewGeneration++;preview.remove();return true}
    if(document.getElementById('teacherFileCard236')){returnToList();return true}
    return false;
  };
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&(document.getElementById('teacherFileCard236')||document.getElementById('teacherFilePreview'))){e.preventDefault();e.stopImmediatePropagation();window.teacherFileDismiss236()}},true);
  const cardStyle=document.createElement('style');
  cardStyle.textContent='.mm-teacher-card-overlay{position:fixed;inset:0;z-index:2147483501;background:#073c3333;display:flex;align-items:center;justify-content:center;padding:12px;box-sizing:border-box}.mm-teacher-card{width:min(720px,100%);max-height:88vh;max-height:88dvh;display:flex;flex-direction:column;background:#f7eed7;border:1px solid #cdbb8b;border-radius:20px;overflow:hidden;color:#213c32;box-shadow:0 15px 45px #0004;min-width:0}.mm-teacher-card .mm-teacher-card-head{display:flex;align-items:center;gap:10px;padding:14px;border-bottom:1px solid #d6c58f}.mm-teacher-card h3{flex:1;min-width:0;margin:0;overflow-wrap:anywhere;font-size:18px}.mm-teacher-card .mm-teacher-card-head button{flex:0 0 auto}.mm-teacher-card-body{padding:14px;overflow:auto;overscroll-behavior:contain;min-height:0}.mm-teacher-card textarea{box-sizing:border-box;width:100%;min-height:180px}.mm-teacher-selection-list{display:grid;gap:4px;margin:12px 0}.mm-teacher-selection-list label{display:flex;align-items:center;gap:10px;padding:12px 8px;border-bottom:1px solid #d8ccb0;cursor:pointer;font-size:14px;overflow-wrap:anywhere}.mm-teacher-selection-list input{flex:0 0 22px;width:22px;height:22px;accent-color:#076452}.mm-teacher-selection-actions{display:flex;gap:8px;flex-wrap:wrap}.mm-teacher-selection-footer{position:sticky;bottom:-14px;display:flex;align-items:center;justify-content:space-between;gap:8px;background:#f7eed7;padding:12px 0;border-top:1px solid #d6c58f}.mm-teacher-theme-stage img{display:block;max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;box-shadow:0 1px 12px #0002}';
  cardStyle.textContent += '\n#teacherFileCard236 .mm-teacher-card-head{position:relative!important;inset:auto!important;display:flex!important;flex-direction:row!important;align-items:flex-start!important;justify-content:space-between!important;flex:0 0 auto!important;gap:12px!important;width:100%!important;min-height:0!important;max-height:none!important;box-sizing:border-box!important;margin:0!important;padding:16px!important;background:#fff8e7!important;color:#203d33!important;border:0!important;border-bottom:1px solid #d8c99f!important;box-shadow:none!important}\n#teacherFileCard236 .mm-teacher-card-heading{flex:1 1 0!important;min-width:0!important;max-width:100%!important}\n#teacherFileCard236 h3{margin:0!important;padding:0!important;font-size:18px!important;line-height:1.3!important;color:#164d40!important;overflow-wrap:break-word!important;word-break:normal!important}\n#teacherFileCard236 .mm-teacher-card-subtitle{margin:6px 0 0!important;font-size:12px!important;line-height:1.45!important;color:#617064!important;overflow-wrap:anywhere!important}\n#teacherFileCard236 .mm-teacher-card-head button{flex:0 0 auto!important;width:auto!important;min-width:74px!important;max-width:95px!important;min-height:42px!important;padding:9px 12px!important;margin:0!important;font-size:13px!important;line-height:1.2!important;white-space:nowrap!important;align-self:flex-start!important}\n#teacherFileCard236 .mm-teacher-card{background:#f7eed7!important;max-height:calc(100dvh - 36px - env(safe-area-inset-top) - env(safe-area-inset-bottom))!important}\n#teacherFileCard236 .mm-teacher-card-body{padding:16px!important;line-height:1.5!important;font-size:14px!important;overflow-x:hidden!important;touch-action:pan-y!important;-webkit-overflow-scrolling:touch}\n#teacherFileCard236 .mm-teacher-card-body .card{padding:14px!important;margin:0 0 14px!important;border-radius:14px!important}\n#teacherFileCard236 .mm-teacher-card-body .card p{margin:8px 0 0!important;color:#5a695e!important;font-size:13px!important}\n#teacherFileCard236 .modal-actions{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:10px!important;margin:14px 0 0!important}\n#teacherFileCard236 .modal-actions button{width:100%!important;min-width:0!important;margin:0!important;padding:12px!important;font-size:14px!important}\n#teacherFileCard236 textarea{min-height:160px!important;max-height:35dvh!important;font-size:16px!important;padding:12px!important;line-height:1.5!important;resize:vertical!important}\n#teacherFileCard236 .mm-teacher-card-intro{margin:0 0 14px!important;color:#5a695e!important}\n#teacherFileCard236 .mm-teacher-legacy-record,#teacherFileCard236 .mm-teacher-empty{padding:14px;margin-bottom:10px;border:1px solid #d8c99f;border-radius:12px;background:#fffaf0;overflow-wrap:anywhere}\n#teacherFileCard236 .mm-teacher-selection-list{gap:0!important}\n#teacherFileCard236 .mm-teacher-selection-list label{line-height:1.4!important;font-size:14px!important;padding:12px 4px!important}\n#teacherFileCard236 .mm-teacher-selection-list input{margin:0!important;min-width:22px!important;max-width:22px!important;height:22px!important}\n#teacherFileCard236 .mm-teacher-selection-footer{bottom:-16px!important;gap:10px!important;font-size:13px!important}\n#teacherFileCard236 .mm-teacher-selection-footer button{width:auto!important;min-width:100px!important;font-size:13px!important;padding:11px!important}\n';
  document.head.appendChild(cardStyle);

  function install() {
    if (typeof window.teacherFileThemeData235 !== 'function') return;
    for (const name of ['teacherFileOpenCover','teacherFileOpenInfo','teacherFileOpenTermReport']) {
      const original = window[name];
      window[name] = function () {
        original.apply(this, arguments);
        const cur = window._teacherFileCurrent;
        if (cur) return preview(clone(cur));
      };
    }
    const open = window.openTeacherFileCenter;
    window.openTeacherFileCenter = function () {
      open.apply(this, arguments);
      const toolbar = document.querySelector('#modalBody .teacher-file-toolbar');
      if (toolbar && !toolbar.querySelector('[data-teacher-theme]')) {
        const btn = document.createElement('button'); btn.className = 'secondary'; btn.dataset.teacherTheme = '235';
        btn.textContent = '☑ Belgeleri Seç'; btn.onclick = openSelection; toolbar.appendChild(btn);
      }
    };
    window.teacherFilePdfCurrent = async () => { try { if (window._teacherFileCurrent) await exportPdf(clone(window._teacherFileCurrent)); } catch (e) { showError(e); } };
    window.teacherFileWordCurrent = async () => { try { if (window._teacherFileCurrent) await exportWord(clone(window._teacherFileCurrent)); } catch (e) { showError(e); } };
    window.teacherFileSummaryPdf = () => preview(summary());
  }
  const style = document.createElement('style'); style.id = 'teacher-file-theme237';
  style.textContent = '.mm-teacher-theme-preview{display:flex!important;flex-direction:column!important;overflow:hidden!important}.mm-teacher-theme-preview .guidance-preview-toolbar{flex:0 0 auto;display:flex;flex-wrap:wrap;gap:6px;align-items:center}.mm-teacher-theme-preview .guidance-preview-toolbar button{padding:9px 12px;font-size:13px}.mm-teacher-theme-stage{flex:1 1 0;min-width:0;min-height:0;overflow:hidden;display:flex;align-items:center;justify-content:center;padding:6px;box-sizing:border-box}.mm-teacher-theme-stage canvas{display:block;max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;box-shadow:0 1px 12px #0002}.mm-teacher-page-count{font-size:12px;font-weight:700;white-space:nowrap;color:#fff3d1}@media(max-width:420px){.mm-teacher-theme-preview .guidance-preview-toolbar button{padding:8px;font-size:12px}}';
  document.head.appendChild(style);
  window.MualliMateTeacherTheme237 = {render, preview, exportPdf, exportWord, sectionCovers, sectionPage, splitLines, summary, openCard, returnToList, openSelection, previewSections, selectedPdf};
  install();
})();
