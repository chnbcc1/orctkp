/* MualliMate v7.8.305 — scenario tables retain sheet, exam and column identity. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.MualliMateSource305=api;})(typeof window!=='undefined'?window:globalThis,()=>{'use strict';
const text=v=>String(v??'').replace(/\s+/g,' ').trim();
const norm=v=>text(v).toLocaleLowerCase('tr').replace(/ı/g,'i').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const codeRx=/^((?:[A-ZÇĞİÖŞÜ]{1,12}\.)?\d{1,2}(?:\.\d+){2,5})\.?\s+([\s\S]+)/i;
function outcome(value){const m=text(value).match(codeRx);return m?{code:m[1],text:m[2].trim()}:null;}
function address(a){const m=String(a).match(/^([A-Z]+)(\d+)$/i);if(!m)throw Error('Geçersiz Excel hücresi.');let col=0;for(const c of m[1].toUpperCase())col=col*26+c.charCodeAt(0)-64;return {row:+m[2],col};}
function grid(sheet){const cells=new Map(sheet.cells.map(c=>[c.row+','+c.col,c.value]));return (r,c,merged=false)=>{const direct=cells.get(r+','+c);if(direct!==undefined&&direct!=='')return direct;if(merged){const m=(sheet.merges||[]).find(m=>r>=m.r1&&r<=m.r2&&c>=m.c1&&c<=m.c2);if(m)return cells.get(m.r1+','+m.c1)||'';}return '';};}
function examIdentity(value){const n=norm(value),p=n.match(/([12])\.?\s*donem/),s=n.match(/donem\s*([12])\.?\s*(?:ortak\s*)?(?:yazili|sinav)/);return p&&s?{period:p[1],slot:'exam'+s[1]}:null;}
function catalog(sheets){const tables=[],notices=[],warnings=[];for(const sheet of sheets){const at=grid(sheet),intro=sheet.cells.filter(c=>c.row<=5).map(c=>text(c.value)).join(' '),gm=intro.match(/(9|10|11|12)\s*\.?\s*SINIF/i)||String(sheet.name).match(/^(9|10|11|12)$/),grade=gm?gm[1]:'',course=/matematik/i.test(norm(intro))?'Matematik':'';
 const headers=sheet.cells.filter(c=>/^senaryo\s*\d+$/i.test(norm(c.value)));const headerRows=[...new Set(headers.map(c=>c.row))].sort((a,b)=>a-b);
 for(const h of headers){const scenario=norm(h.value).match(/\d+/)[0];let identity=null;for(let r=h.row-1;r>=Math.max(1,h.row-8);r--){identity=examIdentity(at(r,h.col,true));if(identity)break;}
  if(!identity){warnings.push(sheet.name+' sayfasında Senaryo '+scenario+' için dönem/yazılı başlığı bulunamadı.');continue;}
  const end=headerRows.find(r=>r>h.row)||Infinity,rows=sheet.cells.filter(c=>c.row>h.row&&c.row<end).map(c=>({cell:c,out:outcome(c.value)})).filter(c=>c.out),outs=[],bad=[];
  for(const {cell,out} of rows){const raw=at(cell.row,h.col),v=text(raw);if(v===''||v==='-'||v==='—'||v==='0')continue;if(!/^\d{1,3}$/.test(v)||+v>100){bad.push('Satır '+cell.row+': '+v);continue;}outs.push({...out,count:+v,row:cell.row});}
  if(bad.length)warnings.push(sheet.name+' / Senaryo '+scenario+': soru sayıları kontrol edilmeli ('+bad.join(', ')+').');
  if(outs.length){const duplicate=new Set(outs.map(o=>o.code)).size!==outs.length;tables.push({id:sheet.name+':'+h.row+':'+h.col,sheet:sheet.name,grade,course,...identity,scenario,outcomes:outs,total:outs.reduce((s,o)=>s+o.count,0),valid:!bad.length&&!duplicate,warning:duplicate?'Aynı çıktı kodu birden çok satırda yer alıyor.':bad.join('; ')});}
 }
 for(const c of sheet.cells){const v=text(c.value);if(/ulke geneli|kilavuz|yayimlanacaktir/.test(norm(v)))notices.push({sheet:sheet.name,grade,text:v});}
 }return {tables,notices,warnings};}
async function readXlsx(file,Zip,Parser){const zip=await Zip.loadAsync(await file.arrayBuffer()),xml=async path=>{const part=zip.file(path);if(!part)return null;const raw=await part.async('string');if(raw.length>10000000)throw Error('Excel sayfası çok büyük. İlgili sayfayı ayrı dosya seçin.');const doc=new Parser().parseFromString(raw,'application/xml');if(doc.getElementsByTagName('parsererror').length)throw Error('Excel XML içeriği okunamadı.');return doc;};
 const ss=await xml('xl/sharedStrings.xml'),strings=ss?[...ss.getElementsByTagName('si')].map(si=>[...si.getElementsByTagName('t')].map(t=>t.textContent).join('')):[],wb=await xml('xl/workbook.xml'),rels=await xml('xl/_rels/workbook.xml.rels');
 const targets=new Map(rels?[...rels.getElementsByTagName('Relationship')].map(r=>[r.getAttribute('Id'),r.getAttribute('Target')]):[]),sheets=[];
 const defs=wb?[...wb.getElementsByTagName('sheet')].map(s=>({name:s.getAttribute('name'),target:targets.get(s.getAttribute('r:id'))})):Object.keys(zip.files).filter(n=>/^xl\/worksheets\/sheet\d+\.xml$/.test(n)).sort().map((n,i)=>({name:String(i+1),target:n}));
 if(defs.length>30)throw Error('En fazla 30 sayfalı Excel seçin.');
 for(const def of defs){if(!def.target)continue;const path=def.target.startsWith('/')?def.target.slice(1):def.target.startsWith('xl/')?def.target:'xl/'+def.target;if(path.split('/').includes('..'))throw Error('Excel sayfa yolu desteklenmiyor.');const doc=await xml(path);if(!doc)continue;const cells=[];
 for(const c of doc.getElementsByTagName('c')){const ref=c.getAttribute('r');if(!ref)continue;const a=address(ref);if(a.row>50000||a.col>1000)throw Error('Excel tablo sınırı aşıldı.');const type=c.getAttribute('t'),v=c.getElementsByTagName('v')[0]?.textContent||'',value=type==='s'?strings[+v]||'':type==='inlineStr'?[...c.getElementsByTagName('t')].map(t=>t.textContent).join(''):v;if(value!=='')cells.push({...a,value});if(cells.length>100000)throw Error('Excel hücre sayısı çok fazla.');}
 const merges=[...doc.getElementsByTagName('mergeCell')].map(m=>{const [f,t]=m.getAttribute('ref').split(':'),a=address(f),b=address(t||f);return {r1:a.row,c1:a.col,r2:b.row,c2:b.col};});sheets.push({name:def.name,cells,merges});
 }
 const result=catalog(sheets);result.text=sheets.map(s=>'SAYFA: '+s.name+'\n'+[...new Set(s.cells.map(c=>c.row))].sort((a,b)=>a-b).map(r=>s.cells.filter(c=>c.row===r).sort((a,b)=>a.col-b.col).map(c=>c.value).join('\t')).join('\n')).join('\n\n');return result;
}
return {outcome,address,examIdentity,catalog,readXlsx};});
