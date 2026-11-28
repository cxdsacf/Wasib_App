'use strict';
(()=>{
const{$,toast,ask,modal,shut,go,dbPut,FD}=WN,K=3,FF={s:'Arial,Helvetica,sans-serif',r:'"Times New Roman",Times,serif',m:'"Courier New",Courier,monospace'},CN='wn-pdf',kk=id=>'pdf/'+id,H={};
let D=null,io=null,vo=null;
pdfjsLib.GlobalWorkerOptions.workerSrc='lib/pdf.worker.min.js';
const bytes=async n=>{const r=await(await caches.open(CN)).match(kk(n.id));if(!r)throw new Error('missing');return r.arrayBuffer()};
const put=async(id,b)=>(await caches.open(CN)).put(kk(id),new Response(b));
const del=async n=>{try{await(await caches.open(CN)).delete(kk(n.id))}catch{}};
const load=b=>pdfjsLib.getDocument({data:new Uint8Array(b.slice(0)),isEvalSupported:false}).promise;
const hex=a=>'#'+a.map(v=>Math.round(v).toString(16).padStart(2,'0')).join('');
const look=(e,o)=>{e.style.cssText=`left:${o.x*K}px;top:${(o.y-.94*o.s)*K}px;font:${o.i?'italic ':''}${o.w?'700 ':'400 '}${o.s*K}px/1.2 ${FF[o.f]||FF.s};${o.c?'color:'+o.c+';':''}${o.W?'min-width:'+o.W*K+'px;':''}`};
const samp=(g,x,y,w,h)=>{const o={b:'#ffffff',c:'#000000'};try{const k=g.sc,c=g.cv;if(!k)return o;const X=Math.max(0,Math.floor(x*k)),Y=Math.max(0,Math.floor(y*k)),A=Math.min(c.width-X,Math.ceil(w*k)),B=Math.min(c.height-Y,Math.ceil(h*k));if(A<2||B<2)return o;const d=c.getContext('2d').getImageData(X,Y,A,B).data,n=d.length>>2,st=Math.max(1,Math.floor(n/4000)),m=new Map();let top=null;
for(let p=0;p<n;p+=st){const i=p*4,key=(d[i]>>4)<<8|(d[i+1]>>4)<<4|(d[i+2]>>4);let e=m.get(key);if(!e){e=[0,0,0,0];m.set(key,e)}e[0]++;e[1]+=d[i];e[2]+=d[i+1];e[3]+=d[i+2];if(!top||e[0]>top[0])top=e}
const bg=[top[1]/top[0],top[2]/top[0],top[3]/top[0]];let far=-1,fc=[0,0,0];
for(let p=0;p<n;p++){const i=p*4,dr=d[i]-bg[0],dg=d[i+1]-bg[1],db=d[i+2]-bg[2],q=dr*dr+dg*dg+db*db;if(q>far){far=q;fc=[d[i],d[i+1],d[i+2]]}}
return{b:hex(bg),c:far>900?hex(fc):'#000000'}}catch{return o}};
const thumb=async doc=>{const p=await doc.getPage(1),v=p.getViewport({scale:1}),c=document.createElement('canvas');c.width=180;c.height=260;const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,180,260);await p.render({canvasContext:x,viewport:p.getViewport({scale:180/v.width}),background:'#fff'}).promise;return c.toDataURL('image/jpeg',.7)};
const pick=()=>{const i=$('#pdff');i.value='';i.click()};
const impBuf=async(buf,fname)=>{
if(buf.byteLength>80e6)return toast('PDF is too large (max 80 MB)');
modal('<h2>Opening PDF…</h2><p class="hint">Please wait a moment.</p>','pdfi');
try{
const doc=await load(buf),n={id:Date.now()+'',name:(fname||'PDF').replace(/\.pdf$/i,'').slice(0,40)||'PDF',type:'pdf',n:doc.numPages,e:{},ts:Date.now()},fv=WN.fv();
if(fv!='r'&&fv!='f'&&FD().some(x=>x.id==fv))n.fid=fv;
await put(n.id,buf);
try{n.th=await thumb(doc)}catch{}
await dbPut(n);
doc.destroy();
shut();
await open(n,buf)
}catch(e){shut();toast(/password/i.test(String(e&&(e.name+e.message)))?'Password-protected PDFs are not supported':'Could not open this PDF')}
};
const imp=async f=>{if(!f)return;if(f.size>80e6)return toast('PDF is too large (max 80 MB)');impBuf(await f.arrayBuffer(),f.name)};
const setPg=i=>{D.cur=i;$('#ppg').textContent=`${i+1} / ${D.pg.length}`};
const layout=()=>{const z=D.zb*D.zm;D.z=z;D.pg.forEach(g=>{const s=g.el.style,c=g.cv.style,o=g.ov.style;s.width=c.width=g.w*z+'px';s.height=c.height=g.h*z+'px';o.width=g.w*K+'px';o.height=g.h*K+'px';o.transform=`scale(${z/K})`});H.zoom&&H.zoom()};
const fname=(g,fn)=>{try{return g.p.commonObjs.get(fn).name||''}catch{return''}};
const fam=(st,n)=>/mono|courier|consolas|typewriter/i.test(n)||st=='monospace'?'m':(/serif|times|georgia|garamond|roman|cambria|palatino|book/i.test(n)&&!/sans/i.test(n))||st=='serif'?'r':'s';
const lines=async g=>{
const tc=await g.p.getTextContent(),vp=g.p.getViewport({scale:1}),U=pdfjsLib.Util,out=[];let c=null;
const fin=()=>{if(c){c.t=c.t.replace(/\u00a0/g,' ').replace(/\s+$/,'');if(c.t.trim())out.push(c);c=null}};
for(const it of tc.items){
if(!it.str||!it.str.trim())continue;
const t=U.transform(vp.transform,it.transform),fs=Math.hypot(t[2],t[3]);
if(!(fs>1)||Math.abs(t[1])>fs*.3)continue;
const nm=fname(g,it.fontName),st=(tc.styles[it.fontName]||{}).fontFamily,o={s:it.str,x:t[4],y:t[5],w:it.width,fs,f:fam(st,nm),b:/bold|black|heavy|semibold|demi/i.test(nm)?1:0,i:/italic|oblique/i.test(nm)?1:0};
if(c&&Math.abs(o.y-c.y)<Math.max(o.fs,c.s)*.3&&o.x>=c.x+c.W-o.fs*.5&&o.x-(c.x+c.W)<o.fs*2.2){const gp=o.x-(c.x+c.W);if(gp>o.fs*.15&&!/\s$/.test(c.t)&&!/^\s/.test(o.s))c.t+=' ';c.t+=o.s;c.W=o.x+o.w-c.x;c.s=Math.max(c.s,o.fs)}
else{fin();c={t:o.s,x:o.x,y:o.y,W:o.w,s:o.fs,f:o.f,w:o.b,i:o.i}}
}
fin();
return out};
const ovl=g=>{g.ov.textContent='';g.L.forEach((l,q)=>{const e=document.createElement('div');e.className='pl';e.dataset.q=q;look(e,l);e.textContent=l.t;g.ov.append(e)});H.built&&H.built(g)};
const draw=async g=>{
if(!D)return;
const d=D,z=d.z,sc=Math.min(Math.max(1,devicePixelRatio||1)*z,3.5,Math.sqrt(8e6/(g.w*g.h)));
if(g.sc&&Math.abs(g.sc-sc)<.02)return;
const t=++g.t;
try{g.k&&g.k.cancel()}catch{}
const c=document.createElement('canvas');c.className='ppc';c.width=Math.ceil(g.w*sc);c.height=Math.ceil(g.h*sc);c.style.width=g.w*z+'px';c.style.height=g.h*z+'px';
const k=g.p.render({canvasContext:c.getContext('2d'),viewport:g.p.getViewport({scale:sc}),background:'#fff'});
g.k=k;
try{await k.promise}catch{return}
if(t!==g.t||D!==d)return;
g.cv.replaceWith(c);g.cv=c;g.sc=sc;
if(!g.L){try{g.L=await lines(g)}catch{g.L=[]}if(D!==d)return;ovl(g)}
};
const free=g=>{g.t++;try{g.k&&g.k.cancel()}catch{}g.cv.width=1;g.cv.height=1;g.sc=0};
const build=()=>{
const R=$('#pdoc');R.textContent='';
io&&io.disconnect();vo&&vo.disconnect();
D.zb=Math.min(3,(Math.min(innerWidth,900)-16)/D.pg[0].w);
D.pg.forEach(g=>{const w=document.createElement('div');w.className='ppw';w.dataset.i=g.i;w.innerHTML='<canvas class="ppc"></canvas><div class="pov"></div>';g.el=w;g.cv=w.firstChild;g.ov=w.lastChild;g.sc=0;g.t=0;R.append(w)});
layout();
io=new IntersectionObserver(es=>es.forEach(e=>{const g=D&&D.pg[+e.target.dataset.i];if(!g)return;e.isIntersecting?draw(g):free(g)}),{root:R,rootMargin:'700px 0px'});
vo=new IntersectionObserver(es=>{if(!D)return;es.forEach(e=>D.vr.set(+e.target.dataset.i,e.isIntersecting?e.intersectionRatio*D.pg[+e.target.dataset.i].h:0));let b=D.cur,m=0;D.vr.forEach((v,k)=>{if(v>m){m=v;b=k}});m>0&&setPg(b)},{root:R,threshold:[0,.1,.25,.5,.75,1]});
D.pg.forEach(g=>{io.observe(g.el);vo.observe(g.el)});
setPg(0);$('#pnm').textContent=D.nb.name;$('#pdfv').dataset.m='v';R.scrollTop=0;H.opened&&H.opened()
};
const open=async(n,buf)=>{
modal('<h2>Opening PDF…</h2><p class="hint">Please wait a moment.</p>','pdfi');
try{
buf=buf||await bytes(n);
const doc=await load(buf),pg=[];
for(let i=1;i<=doc.numPages;i++){const p=await doc.getPage(i),v=p.getViewport({scale:1});pg.push({i:i-1,p,w:v.width,h:v.height})}
n.e=n.e||{};
D={nb:n,doc,pg,zm:1,zb:1,z:1,cur:0,m:'v',vr:new Map()};
go('pdfv');
build();
history.pushState({p:1},'');
shut()
}catch(e){D=null;shut();toast('Could not open this PDF (file missing or damaged)')}
};
const close=async()=>{
if(!D)return;
H.flush&&await H.flush();
const d=D;D=null;
io&&io.disconnect();vo&&vo.disconnect();
$('#pdoc').textContent='';
try{await d.doc.destroy()}catch{}
go('home')
};
const zoom=d=>{
if(!D)return;
const R=$('#pdoc'),r=R.scrollTop/(R.scrollHeight||1),cx=(R.scrollLeft+R.clientWidth/2)/(R.scrollWidth||1);
D.zm=Math.min(4,Math.max(.5,D.zm*(d>0?1.25:.8)));
layout();
R.scrollTop=r*R.scrollHeight;R.scrollLeft=cx*R.scrollWidth-R.clientWidth/2;
clearTimeout(D.zt);D.zt=setTimeout(()=>D&&D.pg.forEach(g=>g.sc&&draw(g)),150)
};
const goto=async()=>{
if(!D)return;
const v=await ask('Go to page',{val:String(D.cur+1),ok:'Go'});
const i=parseInt(v,10);
if(i>=1&&i<=D.pg.length)D.pg[i-1].el.scrollIntoView()
};
Object.assign(WN.A,{vpk:pick,vb(){history.state&&history.state.p?history.back():close()},vzi(){zoom(1)},vzo(){zoom(-1)},vgo:goto});
$('#pdff').onchange=e=>{const f=e.target.files[0];e.target.value='';imp(f)};
window.WNPdf={K,FF,H,open,close,del,bytes,put,pick,impBuf,load,samp,look,on:()=>!!D,D:()=>D,hex}
})();
