'use strict';
(()=>{
const C=window.WN_CFG||{},LS=localStorage,FILES=['app-body.txt','css/style.css','js/app.js','js/ai/format.js','js/pdf/viewer.js','js/pdf/editor.js'],PDFJ=['js/pdf/viewer.js','js/pdf/editor.js'],
N=(()=>{try{return!!(window.Capacitor&&Capacitor.isNativePlatform&&Capacitor.isNativePlatform())}catch{return false}})(),
rd=k=>{try{return JSON.parse(LS.getItem(k)||'null')}catch{return null}},wr=(k,v)=>{try{LS.setItem(k,JSON.stringify(v))}catch{}},rm=k=>{try{LS.removeItem(k)}catch{}},
own=async p=>{const r=await fetch(p,{cache:'no-cache'});if(!r.ok)throw new Error(p);return r.text()},
ld=s=>new Promise((ok,no)=>{const e=document.createElement('script');e.src=s;e.onload=()=>ok();e.onerror=()=>no(new Error('load'));document.body.append(e)}),
bl=t=>URL.createObjectURL(new Blob([t],{type:'text/javascript'})),
sweep=async k=>{try{for(const n of await caches.keys())if(n.startsWith('wn-ota-')&&n!==k)await caches.delete(n)}catch{}},
stored=async()=>{const m=rd('wnota');if(!N||!m||!m.c||m.apk!==C.build||rd('wnbad')===m.sha)return null;try{const c=await caches.open(m.c),o={};for(const f of FILES){const r=await c.match(f);if(!r)return null;o[f]=await r.text()}return{m,o}}catch{return null}};
let live=null,busy=0,OO=null,pp=null;
const src=f=>OO?bl(OO.o[f]):f;
window.WN_LOADPDF=()=>pp||(pp=(async()=>{await ld('lib/pdf.min.js');for(const f of PDFJ)await ld(src(f))})().catch(e=>{pp=null;throw e}));
const ver=()=>C.build?'build '+C.build.slice(0,7)+(live?' · live '+live.sha.slice(0,7):''):'dev';
const sha=async()=>{try{const r=await fetch(`https://api.github.com/repos/${C.repo}/commits/${C.branch||'main'}`,{headers:{Accept:'application/vnd.github.sha'},cache:'no-store'});if(!r.ok)return null;const t=(await r.text()).trim();return/^[0-9a-f]{40}$/.test(t)?t:null}catch{return null}};
const grab=async ref=>{try{const T={};for(const f of FILES){const r=await fetch(`https://raw.githubusercontent.com/${C.repo}/${ref}/www/${f}`,{cache:'no-store'});if(!r.ok)return null;const t=await r.text();if(t.length<20)return null;T[f]=t}return T}catch{return null}};
const hash=async T=>{const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(FILES.map(f=>T[f]).join('\0')));return'h'+[...new Uint8Array(b)].slice(0,8).map(x=>x.toString(16).padStart(2,'0')).join('')};
const upd=async force=>{
if(!N||!C.repo||!C.build)return'off';
if(busy)return'latest';
busy=1;
try{
const now=Date.now();
if(!force&&now-(+LS.getItem('wnchk')||0)<3e5)return'latest';
LS.setItem('wnchk',String(now));
const cur=rd('wnota')||{};
let id=await sha(),T;
if(id){
if(id===C.build){if(cur.sha){rm('wnota');await sweep('')}return'latest'}
if(cur.sha===id&&cur.apk===C.build)return'latest';
if(id===rd('wnbad'))return'latest';
T=await grab(id)
}else{
T=await grab(C.branch||'main');
if(!T)return'err';
id=await hash(T);
if(cur.sha===id&&cur.apk===C.build)return'latest';
if(id===rd('wnbad'))return'latest'
}
if(!T)return'err';
const nm='wn-ota-'+id.slice(0,12),c=await caches.open(nm);
for(const f of FILES)await c.put(f,new Response(T[f]));
wr('wnota',{sha:id,apk:C.build,c:nm});
await sweep(nm);
if(window.WN)WN.toast('Update ready','Restart',async()=>{try{await WN.commit()}catch{}location.reload()});
return'ready'
}catch{return'err'}finally{busy=0}
};
window.WN_UPD=upd;
window.WN_VER=ver;
const start=async()=>{
const bt=document.getElementById('bt');
let O=await stored();OO=O;
if(!O&&rd('wnota'))rm('wnota');
try{
const body=O?O.o['app-body.txt']:await own('app-body.txt'),d=new DOMParser().parseFromString(body,'text/html');
document.body.append(...d.body.childNodes);
if(O){const s=document.createElement('style');s.textContent=O.o['css/style.css'].replace(/url\(\.\.\/assets\//g,'url(assets/');document.head.append(s);live=O.m}
else{const l=document.createElement('link');l.rel='stylesheet';l.href='css/style.css';document.head.append(l);await new Promise(r=>{l.onload=l.onerror=r})}
await ld(src('js/app.js'));await ld(src('js/ai/format.js'));
if(!document.body.dataset.s)throw new Error('init')
}catch(e){
if(O){wr('wnbad',O.m.sha);rm('wnota');location.reload();return}
if(bt)bt.textContent='Could not start the app. Please reinstall the latest version.';
return
}
const b=document.getElementById('boot');
if(b){b.classList.add('off');setTimeout(()=>b.remove(),400)}
setTimeout(()=>upd(),2500);

document.addEventListener('visibilitychange',()=>{if(!document.hidden)upd()})
};
start()
})();
