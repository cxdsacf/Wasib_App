'use strict';
(()=>{
const{$,toast,go,esc,clamp}=WN,W=360,BL='#1d4ed8',OR='#f26a00',BR='#8b4513';
const CL={red:'#dc2626',green:'#15803d',purple:'#7e22ce',teal:'#0f766e',pink:'#db2777',gray:'#4b5563',black:'#000000',blue:BL,orange:'#ea580c',brown:BR,navy:'#1e3a8a',maroon:'#9f1239',magenta:'#c026d3'};
const PROMPT=`You are an expert study-notes formatter and designer for the "Wasib Notes" app. My raw notes are at the bottom of this message, or I will send them right after your first question.

STEP 1 - ASK ME FIRST (do this before formatting anything)
Reply ONLY with this short question, then wait for my answer:
"Which extras should I add to your notes? Reply with the numbers (example: 1,2,4) or ALL or NONE.
1. Tables (comparisons and lists as tables)
2. Graphs and charts (bar, line, pie)
3. Diagrams and flow charts
4. Simple illustrations
5. Colored highlights for important points"
If my notes are not included yet, also ask me to paste them together with my answer. Do not format anything until I reply.

STEP 2 - FORMAT THE NOTES
After my reply, write the final result using ONLY the extras I chose. Reformat my notes into a clean, professional Markdown document that I will copy and paste straight into my notebook app.

GOLDEN RULE
- Keep 100% of my original information: facts, numbers, names, definitions, steps and examples. Do NOT delete, shorten, summarise, translate or invent anything.
- Keep my language exactly as it is (English, Urdu, Roman Urdu, Hindi).

STRUCTURE
- Use exactly one "# " main title at the top.
- Use "## " for main sections and "### " for sub-sections. Use "####", "#####", "######" only when deeper levels are really needed.
- Write short, clear paragraphs and leave one blank line between blocks.
- Use "- " for bullet points and "1. " for numbered steps. Indent nested points by two spaces.
- Use **bold** for key terms and *italic* for light emphasis.

EXAMPLES
- Write every example on its own line starting with "Example:" (or inside a "> " quote). The app shows examples in Saddle Brown automatically.

TEXT COLORS
- The app applies these colors by itself, so do NOT color these yourself:
  Main headings (# and ##) = Blue
  Example text = Saddle Brown
  Headings ### to ###### = Vibrant Orange
- For ALL other text choose colors yourself, according to the meaning of the content, with tags like:
  {red}important warning{/red}
  {green}correct answer or benefit{/green}
  {purple}definition{/purple}
  {teal}note{/teal}
  {pink}tip{/pink}
  {gray}side remark{/gray}
  Allowed colors: red, green, purple, teal, pink, gray, black, navy, maroon, magenta. Use colors sparingly so the page stays easy to read.

TABLES (only if I chose 1)
- Write real Markdown tables: a header row, a separator row like |---|---|, then the data rows. Keep every cell short. The app draws them as neat colored tables.

GRAPHS AND CHARTS (only if I chose 2)
- Use ONLY numbers that exist in my notes. Never invent data.
- Write each chart as a fenced block that starts with three backticks and the word chart, containing ONE valid JSON object, then close the fence:
  {"type":"bar","title":"Short title","labels":["A","B","C"],"series":[{"name":"Marks","data":[10,20,15]}]}
- "type" can be bar, line or pie. Use one entry in "series" for pie. Use several entries in "series" to compare groups. Every "data" list must be numbers only and as long as "labels".

DIAGRAMS (only if I chose 3)
- Draw diagrams, flow charts and formulas as plain text art inside a code block fenced with three backticks. Keep every line at most 36 characters. Use boxes like [ Box ], arrows like --> and v, and lines like | and +--+.

ILLUSTRATIONS (only if I chose 4)
- If a picture helps, add ONE simple SVG inside a fenced block that starts with three backticks and the word svg. Use viewBox="0 0 300 200", no scripts, no external links, no embedded images.
- If my notes mention a picture, keep its place with a line like: ![short caption](image)  I will add the picture myself.

OUTPUT
- Reply with the formatted Markdown ONLY. No introduction, no explanation, no closing remark.
- Do not wrap the whole answer inside one big code block. Only chart, svg and diagram blocks use fences.
- I will copy your answer and paste it directly into the app, so tables, charts and graphics must follow the formats above exactly.

MY NOTES:
(paste your notes here)`;
let GN=0;
const PAL=['#7138E8','#FF7185','#3FA7F0','#34C98B','#F5B335','#FF8A5B'],TC='#19264A';
const xe=t=>String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const mc=document.createElement('canvas').getContext('2d');
const mw=(t,b)=>{mc.font=(b?'700 ':'500 ')+'11px sans-serif';return mc.measureText(t).width};
const wrapT=(t,w,b)=>{const o=[];let l='';for(let wd of String(t).split(/\s+/)){while(mw(wd,b)>w&&wd.length>1){let k=wd.length-1;while(k>1&&mw(wd.slice(0,k),b)>w)k--;if(l){o.push(l);l=''}o.push(wd.slice(0,k));wd=wd.slice(k)}const tr=l?l+' '+wd:wd;if(!l||mw(tr,b)<=w)l=tr;else{o.push(l);l=wd}}o.push(l);return o};
const tblSvgs=rows=>{const n=Math.max(...rows.map(r=>r.length)),TW=290,PX=6,LH=14;rows=rows.map(r=>Array.from({length:n},(_,i)=>r[i]||''));
const nat=Array.from({length:n},(_,c)=>Math.max(30,Math.min(140,Math.max(...rows.map((r,ri)=>mw(r[c],!ri)))+2*PX+2))),sm=nat.reduce((a,b)=>a+b,0),cw=nat.map(x=>x*TW/sm);
const ce=rows.map((r,ri)=>r.map((t,c)=>wrapT(t,cw[c]-2*PX,!ri))),rh=ce.map(r=>Math.max(...r.map(l=>l.length))*LH+10),ch=[];let cur=[0],h=rh[0];
for(let r=1;r<rows.length;r++){if(h+rh[r]>330&&cur.length>1){ch.push(cur);cur=[0];h=rh[0]}cur.push(r);h+=rh[r]}ch.push(cur);
return ch.map(ix=>{const H=ix.reduce((a,r)=>a+rh[r],0);let y=0,b='';
ix.forEach((r,k)=>{b+=`<rect x="0" y="${y}" width="${TW}" height="${rh[r]}" fill="${k?(k%2?'#FFFFFF':'#F6EFFF'):'#7138E8'}"/>`;let x=0;ce[r].forEach((ls,c)=>{ls.forEach((t,li)=>{b+=`<text x="${(x+PX).toFixed(1)}" y="${y+16+li*LH}" font-family="sans-serif" font-size="11" font-weight="${k?500:700}" fill="${k?TC:'#fff'}">${xe(t)}</text>`});x+=cw[c];if(c<n-1)b+=`<line x1="${x.toFixed(1)}" y1="${y}" x2="${x.toFixed(1)}" y2="${y+rh[r]}" stroke="${k?'#DCC8FF':'#ffffff55'}"/>`});y+=rh[r];if(k)b+=`<line x1="0" y1="${y}" x2="${TW}" y2="${y}" stroke="#E9DAFF"/>`});
return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${TW} ${H}" width="${TW}" height="${H}"><clipPath id="c"><rect width="${TW}" height="${H}" rx="9"/></clipPath><g clip-path="url(#c)">${b}</g><rect x=".5" y=".5" width="${TW-1}" height="${H-1}" rx="9" fill="none" stroke="#B58CFF"/></svg>`})};
const fm=v=>{const a=Math.abs(v);return a>=1e6?+(v/1e6).toFixed(1)+'M':a>=1e3?+(v/1e3).toFixed(1)+'k':String(+v.toFixed(2))};
const cut=(t,n)=>t.length>n?t.slice(0,n-1)+'…':t;
const chartSvg=d=>{const ty=String(d.type||'bar').toLowerCase(),lb=(d.labels||[]).map(String),sr=(d.series||(d.data?[{name:'',data:d.data}]:[])).map(q=>({n:String(q.name||''),d:(q.data||[]).map(v=>+v||0)})).filter(q=>q.d.length);
if(!lb.length||!sr.length)return null;const W=300,H=225,tt=d.title?`<text x="150" y="20" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="700" fill="${TC}">${xe(cut(String(d.title),42))}</text>`:'';let b='';
if(ty=='pie'||ty=='doughnut'){const v=sr[0].d.map(x=>Math.max(0,x)),tot=v.reduce((a,c)=>a+c,0)||1,cx=95,cy=128,r=70;let a0=-Math.PI/2;
v.forEach((x,i)=>{const a1=a0+x/tot*Math.PI*2,c=PAL[i%6];if(x/tot>.9999)b+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${c}"/>`;else if(x>0)b+=`<path d="M${cx} ${cy}L${(cx+r*Math.cos(a0)).toFixed(1)} ${(cy+r*Math.sin(a0)).toFixed(1)}A${r} ${r} 0 ${a1-a0>Math.PI?1:0} 1 ${(cx+r*Math.cos(a1)).toFixed(1)} ${(cy+r*Math.sin(a1)).toFixed(1)}Z" fill="${c}" stroke="#fff" stroke-width="2"/>`;
if(x/tot>.06){const m=(a0+a1)/2;b+=`<text x="${(cx+r*.62*Math.cos(m)).toFixed(1)}" y="${(cy+r*.62*Math.sin(m)+4).toFixed(1)}" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="700" fill="#fff">${Math.round(x/tot*100)}%</text>`}a0=a1});
if(ty=='doughnut')b+=`<circle cx="${cx}" cy="${cy}" r="${r*.45}" fill="#fff"/>`;
b+=lb.slice(0,v.length).map((t,i)=>`<rect x="180" y="${58+i*20}" width="10" height="10" rx="3" fill="${PAL[i%6]}"/><text x="196" y="${67+i*20}" font-family="sans-serif" font-size="10" fill="${TC}">${xe(cut(t,13))} (${fm(sr[0].d[i])})</text>`).slice(0,8).join('')}
else{const all=sr.flatMap(q=>q.d),hi=Math.max(0,...all),lo=Math.min(0,...all),raw=((hi-lo)||1)/4,mg=10**Math.floor(Math.log10(raw)),st=[1,2,2.5,5,10].map(x=>x*mg).find(x=>x>=raw),top=Math.ceil(hi/st)*st,bot=Math.floor(lo/st)*st,px=40,pw=W-px-12,py=34,ph=H-py-(sr.length>1?58:44),Y=v=>py+ph-(v-bot)/((top-bot)||1)*ph,n=lb.length,gw=pw/n;
for(let v=bot,k=0;v<=top+st/1e3&&k<9;v+=st,k++){const y=Y(v).toFixed(1);b+=`<line x1="${px}" y1="${y}" x2="${W-12}" y2="${y}" stroke="${v==0?'#B7A6DD':'#EDE4FA'}"/><text x="${px-5}" y="${(+y+3).toFixed(1)}" text-anchor="end" font-family="sans-serif" font-size="9" fill="#68718A">${fm(v)}</text>`}
const fs=n>7?8:9;lb.forEach((t,i)=>{b+=`<text x="${(px+gw*(i+.5)).toFixed(1)}" y="${py+ph+14}" text-anchor="middle" font-family="sans-serif" font-size="${fs}" fill="#68718A">${xe(cut(t,n>7?6:10))}</text>`});
if(ty=='line')sr.forEach((q,k)=>{const c=PAL[k%6],pt=q.d.slice(0,n).map((v,i)=>[px+gw*(i+.5),Y(v)]);if(sr.length==1&&pt.length>1)b+=`<path d="M${pt[0][0].toFixed(1)} ${Y(0).toFixed(1)}L${pt.map(a=>a[0].toFixed(1)+' '+a[1].toFixed(1)).join('L')}L${pt[pt.length-1][0].toFixed(1)} ${Y(0).toFixed(1)}Z" fill="${c}" opacity=".12"/>`;b+=`<polyline points="${pt.map(a=>a[0].toFixed(1)+','+a[1].toFixed(1)).join(' ')}" fill="none" stroke="${c}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`+pt.map((a,i)=>`<circle cx="${a[0].toFixed(1)}" cy="${a[1].toFixed(1)}" r="3.5" fill="#fff" stroke="${c}" stroke-width="2"/>${sr.length==1&&n<=9?`<text x="${a[0].toFixed(1)}" y="${(a[1]-8).toFixed(1)}" text-anchor="middle" font-family="sans-serif" font-size="9" font-weight="700" fill="${TC}">${fm(q.d[i])}</text>`:''}`).join('')});
else{const bw=Math.min(34,gw*.76/sr.length);sr.forEach((q,k)=>q.d.slice(0,n).forEach((v,i)=>{const x=px+gw*i+(gw-bw*sr.length)/2+bw*k,y0=Y(0),y1=Y(v);b+=`<rect x="${x.toFixed(1)}" y="${Math.min(y0,y1).toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(1,Math.abs(y0-y1)).toFixed(1)}" rx="3" fill="${PAL[k%6]}"/>`;if(sr.length==1&&n<=9)b+=`<text x="${(x+bw/2).toFixed(1)}" y="${(Math.min(y0,y1)-4).toFixed(1)}" text-anchor="middle" font-family="sans-serif" font-size="9" font-weight="700" fill="${TC}">${fm(v)}</text>`}))}
if(sr.length>1){let x=px;sr.forEach((q,k)=>{const t=cut(q.n||'Series '+(k+1),12);b+=`<rect x="${x}" y="${H-16}" width="10" height="10" rx="3" fill="${PAL[k%6]}"/><text x="${x+14}" y="${H-7}" font-family="sans-serif" font-size="10" fill="${TC}">${xe(t)}</text>`;x+=24+t.length*5.6})}}
return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><rect width="${W}" height="${H}" rx="14" fill="#fff"/><rect x=".5" y=".5" width="${W-1}" height="${H-1}" rx="14" fill="none" stroke="#DCC8FF"/>${tt}${b}</svg>`};
const tryChart=c=>{try{const t=c.replace(/^\s*(chart|json)\s*\n/i,'').trim();if(t[0]!='{')return null;const d=JSON.parse(t);return d&&(d.labels||d.series||d.data)?d:null}catch{return null}};
const hx=c=>CL[c.toLowerCase()]||(/^#[0-9a-f]{6}$/i.test(c)?c:null);
const inl=s=>{
let t=esc(s);
t=t.replace(/!\[([^\]]*)\]\([^)]*\)/g,'$1').replace(/\[([^\]]+)\]\([^)]*\)/g,'$1');
t=t.replace(/`([^`]+)`/g,'<span style="font-family:monospace;color:#0f766e">$1</span>');
t=t.replace(/\*\*([^*]+)\*\*/g,'<b>$1</b>').replace(/__([^_]+)__/g,'<b>$1</b>');
t=t.replace(/(^|[\s(>])\*([^*\s][^*]*?)\*(?=[\s).,;:!?<]|$)/g,'$1<i>$2</i>').replace(/(^|[\s(>])_([^_\s][^_]*?)_(?=[\s).,;:!?<]|$)/g,'$1<i>$2</i>');
for(let k=0;k<3;k++)t=t.replace(/\{(#[0-9a-fA-F]{6}|[a-zA-Z]+)\}([\s\S]*?)\{\/(?:#?\w+)?\}/g,(m,c,x)=>{const h=hx(c);return h?`<span style="color:${h}">${x}</span>`:x});
return t.replace(/\{\/?(?:red|green|purple|teal|pink|gray|black|blue|orange|brown|navy|maroon|magenta)?\}/g,m=>m=='{}'?m:'')
};
const plain=s=>s.replace(/!\[([^\]]*)\]\([^)]*\)/g,'$1').replace(/\[([^\]]+)\]\([^)]*\)/g,'$1').replace(/\{\/?\w*\}/g,'').replace(/[*_`]/g,'').trim();
const EX=/^(example|examples|eg|e\.g\.|misaal|misal|مثال)\b\s*[:\-–.]?/i;
const parse=(src,o={})=>{
const L=String(src).replace(/\r\n?/g,'\n').split('\n'),out=[],gfx=[];
let title='',first=!!o.title,ex=0,i=0,prev='';
const push=(h,k)=>{out.push(h);prev=k||'b'};
const blank=()=>{};
const col=()=>ex?` style="color:${BR}"`:'';
while(i<L.length){
const tr=L[i].trim();
if(/^```/.test(tr)){
const lang=tr.slice(3).trim().toLowerCase(),buf=[];i++;
while(i<L.length&&!/^```/.test(L[i].trim())){buf.push(L[i]);i++}
i++;
const code=buf.join('\n');
const cd=!lang||lang=='chart'||lang=='json'?tryChart(code):null,cs=cd&&chartSvg(cd);
if(cs){const id=++GN;gfx.push({id,k:'svg',v:cs,mw:292});push(`<div class="gmk" data-g="${id}">&nbsp;</div>`,'g')}
else if(lang=='svg'||/^\s*<svg[\s>]/i.test(code)){const id=++GN;gfx.push({id,k:'svg',v:code});push(`<div class="gmk" data-g="${id}">&nbsp;</div>`,'g')}
else buf.forEach(l=>push(`<div style="font-family:monospace;font-size:12px;color:#0f766e">${esc(l)||'<br>'}</div>`,'c'));
ex=0;continue}
if(!tr){ex=0;blank();i++;continue}
let m;
if((m=/^(#{1,6})\s+(.+?)\s*#*$/.exec(tr))){
let n=m[1].length;
if(n==1){if(first){first=0;title=plain(m[2])}else n=2}
if(n>=2)blank();
push(`<h${n} style="color:${n<=2?BL:OR}">${inl(m[2])}</h${n}>`,'h');
ex=0;i++;continue}
if(/^(-{3,}|\*{3,}|_{3,})$/.test(tr)){ex=0;blank();i++;continue}
if((m=/^!\[([^\]]*)\]\(([^)]*)\)$/.exec(tr))){
if(/^data:image\/(png|jpe?g|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(m[2])){const id=++GN;gfx.push({id,k:'img',v:m[2]});push(`<div class="gmk" data-g="${id}">&nbsp;</div>`,'g')}
else push(`<div style="color:#6b7280;font-style:italic">🖼 ${esc(m[1]||'Image')}</div>`,'p');
i++;continue}
if(tr[0]=='|'){
const rows=[];
while(i<L.length&&L[i].trim()[0]=='|'){rows.push(L[i].trim());i++}
const rr=rows.filter(r=>!/^[\s|:\-]+$/.test(r)).map(r=>r.replace(/^\||\|$/g,'').split('|').map(x=>plain(x.trim())));
if(rr.length)tblSvgs(rr).forEach(sv=>{const id=++GN;gfx.push({id,k:'svg',v:sv,mw:292});push(`<div class="gmk" data-g="${id}">&nbsp;</div>`,'g')});
continue}
if((m=/^>\s?(.*)$/.exec(tr))){ex=1;push(`<div${col()}>${inl(m[1])||'<br>'}</div>`,'q');i++;continue}
if((m=/^(\s*)([-*+]|\d+[.)])\s+(.*)$/.exec(L[i]))){
const lv=Math.min(3,Math.floor(m[1].replace(/\t/g,'  ').length/2)),num=/\d/.test(m[2]),mk=num?m[2].replace(')','.'):(lv?'◦':'•');
if(EX.test(m[3]))ex=1;
push(`<div style="padding-left:${1.4+lv*1.2}em;text-indent:-1.4em${ex?';color:'+BR:''}">${mk} ${inl(m[3])}</div>`,'l');
i++;continue}
if(EX.test(tr))ex=1;
push(`<div${col()}>${inl(tr)}</div>`,'p');
i++}
return{html:out.join(''),gfx,title}
};
const h2m=html=>{
const d=new DOMParser().parseFromString(html,'text/html'),BLK=/^(p|div|h[1-6]|ul|ol|li|pre|blockquote|table|tr|hr|section|article)$/;
const il=n=>{
if(n.nodeType==3)return n.data.replace(/\s+/g,' ');
if(n.nodeType!=1)return'';
const t=n.tagName.toLowerCase();
if(/^(script|style|button|svg|path)$/.test(t))return'';
const c=[...n.childNodes].map(il).join('');
if(t=='strong'||t=='b')return c.trim()?`**${c.trim()}**`:c;
if(t=='em'||t=='i')return c.trim()?`*${c.trim()}*`:c;
if(t=='code')return'`'+c+'`';
if(t=='br')return' ';
if(t=='img'){const s=n.getAttribute('src')||'';return`\n![${(n.alt||'image').replace(/[\]\n]/g,' ')}](${/^data:image\/(png|jpe?g|webp|gif);base64,/.test(s)?s:'image'})\n`}
return c};
const w=(n,ind)=>{
if(n.nodeType==3)return n.data.trim()?n.data.replace(/\s+/g,' ')+'\n':'';
if(n.nodeType!=1)return'';
const t=n.tagName.toLowerCase();
if(/^(script|style|button)$/.test(t))return'';
if(t=='svg')return'\n```svg\n'+n.outerHTML+'\n```\n';
if(/^h[1-6]$/.test(t))return'\n'+'#'.repeat(+t[1])+' '+il(n).trim()+'\n';
if(t=='pre')return'\n```\n'+n.textContent.replace(/\n$/,'')+'\n```\n';
if(t=='hr')return'\n---\n';
if(t=='blockquote')return'\n'+[...n.childNodes].map(c=>w(c,ind)).join('').split('\n').filter(x=>x.trim()).map(x=>'> '+x).join('\n')+'\n';
if(t=='ul'||t=='ol'){let k=0;return'\n'+[...n.children].filter(c=>c.tagName=='LI').map(li=>{k++;const sub=[...li.children].filter(c=>/^(ul|ol)$/i.test(c.tagName)),own=[...li.childNodes].filter(c=>!(c.nodeType==1&&/^(ul|ol)$/i.test(c.tagName))).map(il).join('').trim();return'  '.repeat(ind)+(t=='ol'?k+'. ':'- ')+own+'\n'+sub.map(s=>w(s,ind+1)).join('')}).join('')}
if(t=='table'){const rows=[...n.querySelectorAll('tr')].map(r=>'| '+[...r.children].map(c=>il(c).trim()).join(' | ')+' |');return rows.length?'\n'+rows[0]+'\n|'+rows[0].split('|').slice(2).map(()=>'---|').join('')+'\n'+rows.slice(1).join('\n')+'\n':''}
if(BLK.test(t)&&[...n.children].some(c=>BLK.test(c.tagName.toLowerCase())))return[...n.childNodes].map(c=>w(c,ind)).join('');
if(BLK.test(t))return il(n).trim()?il(n).trim()+'\n':'';
return[...n.childNodes].map(c=>w(c,ind)).join('')};
return[...d.body.childNodes].map(c=>w(c,0)).join('').replace(/\n{3,}/g,'\n\n')
};
const isMd=t=>/^#{1,6}\s+\S/m.test(t)||/^```/m.test(t)||/\*\*[^*\n]{1,80}\*\*/.test(t)||/\{(?:red|green|purple|teal|pink|gray|black|navy|maroon|magenta|#[0-9a-f]{6})\}[\s\S]+?\{\/\w*\}/i.test(t)||(/^\s*[-*]\s+\S/m.test(t)&&t.length>150);
const svgUrl=code=>{
let s=String(code).replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi,'').replace(/\son\w+\s*=\s*("[^"]*"|'[^']*')/gi,'').replace(/(xlink:)?href\s*=\s*("(?!#)[^"]*"|'(?!#)[^']*')/gi,'');
if(!/<svg[^>]*xmlns=/i.test(s))s=s.replace(/<svg/i,'<svg xmlns="http://www.w3.org/2000/svg"');
const vb=/viewBox\s*=\s*["']([\d.\-\s,]+)["']/i.exec(s);
if(!/<svg[^>]*\swidth=/i.test(s)){const p=vb?vb[1].trim().split(/[\s,]+/).map(Number):[0,0,300,200];s=s.replace(/<svg/i,`<svg width="${p[2]||300}" height="${p[3]||200}"`)}
return'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s)
};
const toImg=(src,jpg)=>new Promise((ok,no)=>{
const im=new Image();
im.onload=()=>{const nw=im.naturalWidth||300,nh=im.naturalHeight||200,k=Math.min(src.startsWith('data:image/svg')?Math.max(1,900/nw):1,1400/Math.max(nw,nh)),w=Math.max(1,Math.round(nw*k)),h=Math.max(1,Math.round(nh*k)),c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');if(jpg){x.fillStyle='#fff';x.fillRect(0,0,w,h)}x.drawImage(im,0,0,w,h);ok({u:c.toDataURL(jpg?'image/jpeg':'image/png',.9),w,h})};
im.onerror=()=>no(new Error('img'));
im.src=src
});
const place=async list=>{
for(const g of list){
const mk=document.querySelector(`.gmk[data-g="${g.id}"]`);
if(!mk)continue;
try{
const r=await toImg(g.k=='svg'?svgUrl(g.v):g.v,/^data:image\/jpe?g/.test(g.v)),pg=mk.closest('.pg'),L=pg.querySelector('.lay');
let w=Math.min(g.mw||232,r.w),h=Math.round(w*r.h/r.w);
if(h>360){h=360;w=Math.round(h*r.w/r.h)}
WN.reflow();await new Promise(z=>requestAnimationFrame(()=>z()));const q=pg.getBoundingClientRect(),k=q.width/W,y=clamp(Math.round((mk.getBoundingClientRect().top-q.top)/k)+(g.mw?10:0),50,486-h),x=Math.round((W-w)/2);
L.insertAdjacentHTML('beforeend',`<img class="it im" alt="" src="${r.u}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px">`);
mk.removeAttribute('data-g');
WN.reflow()
}catch{mk.removeAttribute('data-g')}
}
WN.ahead();WN.save()
};
const paste=(cd,t)=>{
const tx=cd.getData('text/plain')||'',hm=cd.getData('text/html')||'';
let md=null;
if(isMd(tx))md=tx;
else if(hm&&/<(h[1-6]|strong|b|table|ul|ol|blockquote|pre|svg)\b/i.test(hm)){const m=h2m(hm);if(isMd(m)||/^\s*[-*]\s|^\|/m.test(m))md=m}
if(md===null)return false;
const hasT=!!(WN.pgs()[0]&&WN.pgs()[0].querySelector('.txt h1')&&WN.pgs()[0].querySelector('.txt h1').textContent.trim()),r=parse(md,{title:!hasT&&t.closest('.pg')===WN.pgs()[0]&&!t.textContent.trim()});
t.focus();
const g=getSelection(),tp=document.createElement('template');
let b=null;
if(g.rangeCount){let n=g.anchorNode;while(n&&n!==t&&n.parentNode!==t)n=n.parentNode;if(n&&n!==t&&t.contains(n))b=n}
tp.innerHTML=r.html;
const fr=tp.content,last=fr.lastChild;
if(!last)return false;
if(b&&!b.textContent.replace(/\u00a0/g,'').trim()&&!(b.querySelector&&b.querySelector('img')))b.replaceWith(fr);
else if(b)b.after(fr);
else t.append(fr);
const rg=document.createRange();rg.selectNodeContents(last);rg.collapse(false);g.removeAllRanges();g.addRange(rg);
t.dispatchEvent(new Event('input',{bubbles:true}));
if(r.gfx.length)setTimeout(()=>place(r.gfx),200);
toast('Notes formatted ✓');
return true
};
const copy=async t=>{
try{await navigator.clipboard.writeText(t);return true}catch{}
const a=document.createElement('textarea');a.value=t;a.setAttribute('readonly','');a.style.cssText='position:fixed;top:0;left:0;opacity:0';document.body.append(a);a.select();a.setSelectionRange(0,t.length);
let ok=false;try{ok=document.execCommand('copy')}catch{}
a.remove();return ok
};
$('#aipr').value=PROMPT;
const flash=b=>{const e=b.querySelector('span'),o=e&&e.textContent;b.classList.add('ok');if(e)e.textContent='Copied!';setTimeout(()=>{b.classList.remove('ok');if(e)e.textContent=o},1600)};
Object.assign(WN.A,{
ai(){go('aif');$('#aif').scrollTop=0},
async aic(_,b){if(await copy(PROMPT)){b&&flash(b);toast('Prompt copied ✓ Paste it in any AI tool')}else toast('Press and hold the prompt, then choose Copy')}
});
window.WNAI={parse,paste,h2m,PROMPT,place}
})();
