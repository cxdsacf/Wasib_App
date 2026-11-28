'use strict';
(()=>{
const{$,$$,toast,modal,shut,dbPut,deliver,toPdf,jp,clamp,COLS,A}=WN,V=WNPdf,K=V.K,FF=V.FF,H=V.H,R=$('#pdoc');
const PT=(()=>{const e=document.createElement('div');e.contentEditable='plaintext-only';return e.contentEditable==='plaintext-only'})();
let hc='#fde047',sel=null,sd=null,hist=[],hi=-1,sv=0,dirty=0,U=Date.now(),dr=null,mv=null,pc='#000000';
const D=()=>V.D(),E=g=>{const e=D().nb.e;return e[g.i]||(e[g.i]=[])},pgOf=el=>D().pg[+el.closest('.ppw').dataset.i];
const ce=(e,on)=>{e.contentEditable=on?(PT?'plaintext-only':'true'):'false'};
const modeEl=g=>g.ov.querySelectorAll('.pl').forEach(e=>ce(e,D().m=='e'));
const mkMask=r=>{const m=document.createElement('div');m.className='pm'+(r.k=='x'||r.k=='h'?' px':'')+(r.k=='h'?' ph':'');m.dataset.u=r.u;m.style.cssText=`left:${r.m[0]*K}px;top:${r.m[1]*K}px;width:${r.m[2]*K}px;height:${r.m[3]*K}px;background:${r.b}`;return m};
const show=(e,r)=>{V.look(e,r);e.dataset.u=r.u;e.dataset.ed=1;e.textContent=r.t};
const apply=g=>{
if(!g.L||!D())return;
g.ov.querySelectorAll('.pm,.pa').forEach(e=>e.remove());
g.ov.querySelectorAll('.pl:not(.pa)').forEach(e=>{const l=g.L[+e.dataset.q];V.look(e,l);e.textContent=l.t;e.style.display='';delete e.dataset.ed;delete e.dataset.u});
E(g).forEach(r=>{
if(r.m)g.ov.prepend(mkMask(r));
if(r.hq)r.hq.forEach(q=>{const e=g.ov.querySelector(`.pl[data-q="${q}"]`);if(e)e.style.display='none'});
if(r.k=='t'){const e=g.ov.querySelector(`.pl[data-q="${r.q}"]`);if(e)show(e,r)}
else if(r.k=='a'){const e=document.createElement('div');e.className='pl pa';show(e,r);g.ov.append(e)}
});
modeEl(g)
};
const btn=()=>{$('#xun').disabled=hi<1;$('#xrd').disabled=hi>=hist.length-1};
const hpush=()=>{const s=JSON.stringify(D().nb.e);if(hist[hi]===s)return;hist.length=hi+1;hist.push(s);hi=hist.length-1;if(hist.length>60){hist.shift();hi--}btn()};
const commit=async()=>{const d=D();if(!d)return;clearTimeout(sv);hpush();dirty=0;d.nb.ts=Date.now();try{await dbPut(d.nb)}catch{toast('Could not save – storage may be full')}};
const chg=()=>{dirty=1;clearTimeout(sv);sv=setTimeout(commit,700)};
const desel=()=>{sd&&sd.remove();sd=sel=null};
const recOf=(e,g,mk)=>{
const u=e.dataset.u;
if(u)return E(g).find(r=>r.u==u);
if(!mk||!e.classList.contains('pl')||e.classList.contains('pa'))return null;
const q=+e.dataset.q,l=g.L[q],m=[l.x-1.5,l.y-l.s*.98,l.W+3,l.s*1.3],sp=V.samp(g,m[0],m[1],m[2],m[3]),r={u:String(++U),k:'t',q,o:l.t,m,b:sp.b,x:l.x,y:l.y,s:l.s,t:l.t,c:sp.c,f:l.f,w:l.w,i:l.i};
E(g).push(r);g.ov.prepend(mkMask(r));V.look(e,r);e.dataset.u=r.u;e.dataset.ed=1;return r
};
const showSel=()=>{
sd&&sd.remove();sd=null;
if(!sel||!sel.e.isConnected||!D())return;
const{e,g}=sel,pr=g.el.getBoundingClientRect(),b=e.getBoundingClientRect(),r=recOf(e,g,0);
if(b.width<1&&b.height<1)return;
sd=document.createElement('div');sd.className='psd';
Object.assign(sd.style,{left:b.left-pr.left-2+'px',top:b.top-pr.top-2+'px',width:Math.max(10,b.width)+4+'px',height:Math.max(10,b.height)+4+'px'});
sd.innerHTML=(r&&r.k=='a'?`<button class="m" data-h="m" aria-label="Move">${WN.ic('move')}</button>`:'')+`<button class="x" data-act="xd" aria-label="Delete">${WN.ic('trash-2')}</button>`;
g.el.append(sd)
};
const choose=(e,g)=>{sel={e,g};showSel()};
const edit=fn=>{
if(!sel)return toast('Tap a text first');
const{e,g}=sel,r=recOf(e,g,1);
if(!r||r.k=='x'||r.k=='h')return toast('Tap a text first');
fn(r);r.d=1;V.look(e,r);e.dataset.u=r.u;e.dataset.ed=1;showSel();chg()
};
const typed=e=>{const g=pgOf(e),r=recOf(e,g,1);if(!r)return;r.t=r.k=='a'?e.textContent.replace(/\n$/,''):e.textContent.replace(/\n/g,' ');chg();showSel()};
const done=e=>{
const d=D();if(!d)return;
const g=pgOf(e),r=recOf(e,g,0);
if(!r)return;
if((r.k=='t'&&!r.d&&r.t===r.o)||(r.k=='a'&&!r.t.trim())){E(g).splice(E(g).indexOf(r),1);if(sel&&sel.e===e)desel();apply(g);chg()}
};
const ui=m=>$$('#ptb .md').forEach(b=>b.classList.toggle('on',b.dataset.v==(m=='v'?'v':'e')));
const setMode=m=>{const d=D();if(!d)return;d.m=m;$('#pdfv').dataset.m=m;ui(m);d.pg.forEach(modeEl);desel();if(m=='v'&&document.activeElement&&document.activeElement.blur)document.activeElement.blur()};
const restore=()=>{D().nb.e=JSON.parse(hist[hi]);D().pg.forEach(apply);desel();dirty=1;clearTimeout(sv);sv=setTimeout(commit,700);btn()};
const add=()=>{
const d=D();if(!d)return;
if(d.m!='e')setMode('e');
const g=d.pg[d.cur],q=R.getBoundingClientRect(),pr=g.el.getBoundingClientRect(),z=d.z,s=Math.max(10,Math.round(g.w/38)),r={u:String(++U),k:'a',x:clamp((q.left+q.width/2-pr.left)/z-g.w*.2,10,g.w*.6),y:clamp((q.top+q.height/2-pr.top)/z,s+4,g.h-10),s,t:'Text',c:pc,f:'s',w:0,i:0};
E(g).push(r);apply(g);chg();
const e=g.ov.querySelector(`.pa[data-u="${r.u}"]`);
if(e){e.focus();const rg=document.createRange();rg.selectNodeContents(e);const gs=getSelection();gs.removeAllRanges();gs.addRange(rg);choose(e,g)}
};
const paint=(x,r)=>{
if(r.m){x.save();if(r.k=='h'){x.globalCompositeOperation='multiply';x.globalAlpha=.6}x.fillStyle=r.b;x.fillRect(r.m[0],r.m[1],r.m[2],r.m[3]);x.restore()}
if(r.t){x.font=`${r.i?'italic ':''}${r.w?'700 ':'400 '}${r.s}px ${FF[r.f]||FF.s}`;x.fillStyle=r.c;x.textBaseline='alphabetic';r.t.split('\n').forEach((ln,k)=>x.fillText(ln,r.x,r.y+k*r.s*1.2))}
};
const exp=async n=>{
const d=D();
if(d&&d.nb.id==n.id){clearTimeout(sv);await commit()}
const has=Object.values(n.e||{}).some(a=>a&&a.length),fn=n.name.replace(/[\\/:*?"<>|]+/g,'-')+'.pdf';
modal('<h2>Preparing PDF…</h2><p class="hint">Please wait a moment.</p>','pdf');
let doc;
try{
const buf=await V.bytes(n);
if(!has){shut();deliver(new Blob([buf],{type:'application/pdf'}),fn);return}
doc=await V.load(buf);
const J=[];
for(let i=1;i<=doc.numPages;i++){
const h=$('#mb .hint');if(h)h.textContent=`Page ${i} of ${doc.numPages}…`;
await new Promise(r=>setTimeout(r,0));
const p=await doc.getPage(i),b=p.getViewport({scale:1}),S=Math.min(2.2,2600/Math.max(b.width,b.height)),vp=p.getViewport({scale:S}),c=document.createElement('canvas');
c.width=Math.round(vp.width);c.height=Math.round(vp.height);
const x=c.getContext('2d');
await p.render({canvasContext:x,viewport:vp,background:'#fff'}).promise;
const L=(n.e||{})[i-1]||[];
if(L.length){x.save();x.scale(c.width/b.width,c.height/b.height);L.forEach(r=>paint(x,r));x.restore()}
J.push({im:[],ov:null,b:await jp(c),W:b.width,H:b.height})
}
const blob=toPdf(J);
shut();deliver(blob,fn)
}catch(e){modal('<h2>PDF failed</h2><p class="hint"></p>','pdf');$('#mb .hint').textContent=String(e&&e.message||e)}
finally{doc&&doc.destroy()}
};
H.built=apply;
H.zoom=()=>showSel();
H.flush=async()=>{clearTimeout(sv);if(dirty)await commit();desel()};
H.opened=()=>{hist=[JSON.stringify(D().nb.e)];hi=0;dirty=0;desel();ui('v');btn()};
V.exp=exp;
Object.assign(A,{
xm(v){setMode(v=='e'?'e':'v')},
xu(){if(!D())return;clearTimeout(sv);hpush();if(hi<1)return;hi--;restore()},
xr(){if(!D()||hi>=hist.length-1)return;hi++;restore()},
xa:add,
xh(){const d=D();if(!d)return;const C=['#fde047','#86efac','#fca5a5','#fdba74'];if(d.m=='h'){hc=C[(C.indexOf(hc)+1)%C.length];toast('Highlight colour changed')}else{setMode('h');toast('Drag over text to highlight. Tap again for another colour.')}$('[data-act=xh]').style.color=hc},
xe(){const d=D();if(!d)return;if(d.m=='x')return setMode('e');setMode('x');toast('Drag over the area you want to erase')},
xs(v){edit(r=>{r.s=clamp(r.s+(v=='+'?1:-1)*(r.s>=24?2:1),5,120)})},
xb(){edit(r=>{r.w=r.w?0:1})},
xi(){edit(r=>{r.i=r.i?0:1})},
xf(){edit(r=>{r.f=r.f=='s'?'r':r.f=='r'?'m':'s'})},
xc(){modal(`<h2>Text colour</h2><div class="dots">${COLS.map(c=>`<button data-act="xcv" data-v="${c}" style="background:${c}" aria-label="${c}"></button>`).join('')}<input type="color" id="xcc" value="${pc}" aria-label="Custom colour"></div>`,'xc')},
xcv(v,_,keep){if(!/^#[0-9a-f]{6}$/i.test(v))return;pc=v;$('#xcd').style.background=v;if(sel)edit(r=>{r.c=v});keep||shut()},
xd(){
if(!sel)return toast('Tap a text or an erased area first');
const{e,g}=sel,r=recOf(e,g,1);
if(!r)return;
if(r.k=='t'){r.t='';r.d=1}else E(g).splice(E(g).indexOf(r),1);
apply(g);desel();chg()
},
xex(){const d=D();d&&exp(d.nb)}
});
R.addEventListener('focusin',e=>{const t=e.target.closest&&e.target.closest('.pl'),d=D();if(t&&d&&d.m=='e')choose(t,pgOf(t))});
R.addEventListener('input',e=>{const t=e.target.closest&&e.target.closest('.pl');if(t)typed(t)});
R.addEventListener('focusout',e=>{const t=e.target.closest&&e.target.closest('.pl');if(t)done(t)});
R.addEventListener('beforeinput',e=>{const t=e.target.closest&&e.target.closest('.pl:not(.pa)');if(t&&/insertParagraph|insertLineBreak/.test(e.inputType))e.preventDefault()});
R.addEventListener('paste',e=>{if(PT)return;const t=e.target.closest&&e.target.closest('.pl');if(!t)return;e.preventDefault();const s=(e.clipboardData||window.clipboardData).getData('text/plain');if(s)document.execCommand('insertText',false,s)});
R.addEventListener('click',e=>{const m=e.target.closest&&e.target.closest('.pm.px'),d=D();if(m&&d&&d.m=='e')choose(m,pgOf(m))});
R.addEventListener('pointerdown',e=>{
const d=D();if(!d)return;
const h=e.target.closest('.psd button');
if(h){if(h.dataset.h=='m'&&sel){const r=recOf(sel.e,sel.g,0);if(r){mv={r,el:sel.e,g:sel.g,sx:e.clientX,sy:e.clientY,ox:r.x,oy:r.y,id:e.pointerId};try{h.setPointerCapture(e.pointerId)}catch{}}}return}
if(d.m=='x'||d.m=='h'){
const w=e.target.closest('.ppw');if(!w)return;
e.preventDefault();
const el=document.createElement('div');el.className='pdr';w.append(el);
dr={hl:d.m=='h',g:d.pg[+w.dataset.i],w,el,pr:w.getBoundingClientRect(),sx:e.clientX,sy:e.clientY,id:e.pointerId};
try{w.setPointerCapture(e.pointerId)}catch{}
return}
if(!e.target.closest('.pl,.pm.px,.psd'))desel()
});
document.addEventListener('pointermove',e=>{
if(mv&&e.pointerId==mv.id){const z=D().z;mv.r.x=clamp(mv.ox+(e.clientX-mv.sx)/z,0,mv.g.w-10);mv.r.y=clamp(mv.oy+(e.clientY-mv.sy)/z,5,mv.g.h);V.look(mv.el,mv.r);showSel()}
if(dr&&e.pointerId==dr.id){const a=Math.min(dr.sx,e.clientX)-dr.pr.left,b=Math.min(dr.sy,e.clientY)-dr.pr.top;Object.assign(dr.el.style,{left:a+'px',top:b+'px',width:Math.abs(e.clientX-dr.sx)+'px',height:Math.abs(e.clientY-dr.sy)+'px'})}
});
const up=e=>{
if(mv&&e.pointerId==mv.id){mv=null;chg()}
if(dr&&e.pointerId==dr.id){
const q=dr,z=D()?D().z:1;dr=null;q.el.remove();
if(!D())return;
const g=q.g,x=clamp((Math.min(q.sx,e.clientX)-q.pr.left)/z,0,g.w),y=clamp((Math.min(q.sy,e.clientY)-q.pr.top)/z,0,g.h),w=Math.min(Math.abs(e.clientX-q.sx)/z,g.w-x),h=Math.min(Math.abs(e.clientY-q.sy)/z,g.h-y);
if(w<6||h<6)return;
const sp=V.samp(g,x,y,w,h),hq=g.L?g.L.map((l,i)=>i).filter(i=>{const l=g.L[i],ix=Math.max(0,Math.min(x+w,l.x+l.W)-Math.max(x,l.x)),iy=Math.max(0,Math.min(y+h,l.y+l.s*.3)-Math.max(y,l.y-l.s*.98));return ix*iy>.6*l.W*l.s*1.28}):[];
if(q.hl){E(g).push({u:String(++U),k:'h',m:[x,y,w,h],b:hc});apply(g);chg();return}E(g).push({u:String(++U),k:'x',m:[x,y,w,h],b:sp.b,hq});apply(g);chg();setMode('e')
}
};
document.addEventListener('pointerup',up);
document.addEventListener('pointercancel',up);
document.addEventListener('mousedown',e=>{if(e.target.closest('#ptb button,#ptools button,.psd button'))e.preventDefault()});
$('#mb').addEventListener('input',e=>{if(e.target.id=='xcc')A.xcv(e.target.value,null,true)});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&dirty)commit()});
addEventListener('pagehide',()=>{if(dirty)commit()});
btn()
})();
