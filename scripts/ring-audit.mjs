// Border and focus-ring audit (2026-11-18, owner: "the border is too close to
// the text ... fix it across the app"). Headless Chrome over raw CDP, like
// headless-probe.mjs, but it presses Tab for real: a scripted focus() does not
// show :focus-visible in headless Chrome, so a probe expression cannot see a
// ring. For one page it reports
//   rest      elements whose own border stands nearer their text than the gap
//   focus     tab stops whose focus ring stands nearer their text than the gap
//   clips     tab stops whose ring is cut off by an overflow-clipping ancestor
//   noOutline tab stops that draw no outline (check they show focus another way)
// Expected noise: closed FAQ answers, the contact form's hidden trap field,
// items scrolled out of a sideways scroller, links inside a sentence (3px by
// design, `$ring-gap-inline`).
//
//   node scripts/ring-audit.mjs <url> [WxH | phone] [horizontal gap, 6] [vertical gap, 2]
//
// Serve a build first (`npx serve build -l 4317`); never a second dev server.
import { spawn } from "node:child_process";
const [, , url, size = "1440x900", HG = "6", VG = "2"] = process.argv;
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
setTimeout(() => { console.error("timeout"); process.exit(3); }, 150000).unref();
let chrome, ws, id = 0; const pending = new Map();
for (let a = 0; a < 3 && !ws; a++) {
  const PORT = 9333 + Math.floor(Math.random() * 2000);
  chrome = spawn(CHROME, ["--headless=new", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--hide-scrollbars", `--remote-debugging-port=${PORT}`, "--window-size=1440,900", `--user-data-dir=/tmp/headless-probe-${PORT}`, "about:blank"], { stdio: "ignore" });
  for (let i = 0; i < 100 && !ws; i++) { try { const list = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json(); const page = list.find((t) => t.type === "page"); const sock = new WebSocket(page.webSocketDebuggerUrl); await new Promise((r, j) => { sock.onopen = r; sock.onerror = j; }); ws = sock; } catch { await sleep(250); } }
  if (!ws) chrome.kill();
}
process.on("exit", () => { try { chrome.kill(); } catch {} });
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expression) => (await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true })).result?.result?.value;
await send("Page.enable"); await send("Runtime.enable");
if (size === "phone") await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
else { const [w, h] = size.split("x").map(Number); await send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: 1, mobile: false }); }
await send("Page.navigate", { url }); await sleep(2500);
await ev(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));const H=document.documentElement.scrollHeight;for(let y=0;y<H;y+=700){window.scrollTo({top:y,behavior:'instant'});await sleep(40);}window.scrollTo({top:0,behavior:'instant'});await sleep(500);
const vis=el=>{if(el.checkVisibility&&!el.checkVisibility({checkOpacity:true,checkVisibilityCSS:true}))return false;const r=el.getBoundingClientRect();return r.width>3&&r.height>3;};
const alpha=c=>{const m=c.match(/rgba?\\(([^)]+)\\)/);if(!m)return 1;const p=m[1].split(/[,\\/ ]+/).filter(Boolean);return p.length>3?parseFloat(p[3]):1;};
const textRect=el=>{
  if(/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)){const r=el.getBoundingClientRect(),cs=getComputedStyle(el);if(['checkbox','radio','range'].includes(el.type))return null;return {left:r.left+parseFloat(cs.borderLeftWidth)+parseFloat(cs.paddingLeft),right:r.right-parseFloat(cs.borderRightWidth)-parseFloat(cs.paddingRight),top:r.top+3,bottom:r.bottom-3};}
  const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let n,u=null,c=0;
  while((n=w.nextNode())&&c<400){if(!n.nodeValue.trim())continue;const p=n.parentElement;if(!p||!vis(p))continue;if(p.closest('.sr-only,[class*=cta-rest],svg'))continue;const rg=document.createRange();rg.selectNodeContents(n);for(const r of rg.getClientRects()){if(r.width<1||r.height<1)continue;c++;u=u?{left:Math.min(u.left,r.left),right:Math.max(u.right,r.right),top:Math.min(u.top,r.top),bottom:Math.max(u.bottom,r.bottom)}:{left:r.left,right:r.right,top:r.top,bottom:r.bottom};}}
  return u;};
const name=el=>{const c=(typeof el.className==='string'?el.className:'').split(/\\s+/).filter(Boolean).slice(0,2).join('.');return el.tagName.toLowerCase()+(c?'.'+c:'')+(el.id?'#'+el.id:'');};
const txt=el=>(el.textContent||el.placeholder||el.getAttribute('aria-label')||'').trim().replace(/\\s+/g,' ').slice(0,24);
window.__rest=()=>{const out=new Map();for(const el of document.querySelectorAll('body *')){if(el.closest('#cursor-dot,svg,.sr-only'))continue;if(!vis(el))continue;const cs=getComputedStyle(el);
  const b={left:parseFloat(cs.borderLeftWidth),right:parseFloat(cs.borderRightWidth),top:parseFloat(cs.borderTopWidth),bottom:parseFloat(cs.borderBottomWidth)};const on={};let any=false,clear=true;
  for(const s of ['left','right','top','bottom']){const S=s[0].toUpperCase()+s.slice(1);on[s]=b[s]>0&&cs['border'+S+'Style']!=='none';if(on[s]){any=true;if(alpha(cs['border'+S+'Color'])>0.06)clear=false;}}
  if(!any)continue;const t=textRect(el);if(!t)continue;const r=el.getBoundingClientRect();const g={};
  if(on.left)g.left=Math.round(t.left-(r.left+b.left));if(on.right)g.right=Math.round((r.right-b.right)-t.right);if(on.top)g.top=Math.round(t.top-(r.top+b.top));if(on.bottom)g.bottom=Math.round((r.bottom-b.bottom)-t.bottom);
  if((g.left<${HG})||(g.right<${HG})||(g.top<${VG})||(g.bottom<${VG})){const k=name(el);const worst=Math.min(...Object.values(g));if(!out.has(k)||out.get(k).worst>worst)out.set(k,{worst,s:'REST '+k+' '+JSON.stringify(g)+(clear?' (clear)':'')+' "'+txt(el)+'"'});}}
  return [...out.values()].sort((a,b)=>a.worst-b.worst).map(v=>v.s);};
window.__focus=()=>{const el=document.activeElement;if(!el||el===document.body)return {none:true};const cs=getComputedStyle(el);const r=el.getBoundingClientRect();const key=name(el)+'|'+Math.round(r.left+scrollX)+','+Math.round(r.top+scrollY);
  const fv=el.matches(':focus-visible');const hasOutline=cs.outlineStyle!=='none'&&parseFloat(cs.outlineWidth)>0;const t=textRect(el);
  if(!t||!vis(el))return {key,skip:true};
  let g=null,how='';
  if(hasOutline){const off=parseFloat(cs.outlineOffset)||0;how='outline off'+off;g={left:Math.round(t.left-(r.left-off)),right:Math.round((r.right+off)-t.right),top:Math.round(t.top-(r.top-off)),bottom:Math.round((r.bottom+off)-t.bottom)};}
  else{how='NO-OUTLINE';}
  let clip='';if(hasOutline){const off=parseFloat(cs.outlineOffset)||0,w=parseFloat(cs.outlineWidth)||0;const R={left:r.left-off-w,right:r.right+off+w,top:r.top-off-w,bottom:r.bottom+off+w};let a=el.parentElement;while(a&&a!==document.body){const as=getComputedStyle(a);if(as.overflowX!=='visible'||as.overflowY!=='visible'){const ar=a.getBoundingClientRect();const sides=[];if(as.overflowX!=='visible'){if(R.left<ar.left-0.5)sides.push('L'+Math.round(ar.left-R.left));if(R.right>ar.right+0.5)sides.push('R'+Math.round(R.right-ar.right));}if(as.overflowY!=='visible'){if(R.top<ar.top-0.5)sides.push('T'+Math.round(ar.top-R.top));if(R.bottom>ar.bottom+0.5)sides.push('B'+Math.round(R.bottom-ar.bottom));}if(sides.length){clip=name(a)+' '+sides.join(',');break;}}a=a.parentElement;}}
  return {key,name:name(el),fv,how,g,clip,txt:txt(el)};};
})()`);
const rest = await ev("window.__rest()");
const clips = new Map(); const seen = new Map(); let first = null, steps = 0, noRing = new Set();
for (; steps < 260; steps++) {
  await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9, nativeVirtualKeyCode: 9 });
  await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9, nativeVirtualKeyCode: 9 });
  await sleep(35);
  const f = await ev("window.__focus()");
  if (!f || f.none) { if (steps > 3) break; continue; }
  if (first === null) first = f.key; else if (f.key === first) break;
  if (f.skip) continue;
  if (!f.g) { noRing.add(f.name); continue; }
  if (f.clip) clips.set(f.name, `CLIP ${f.name} ${f.how} by ${f.clip} "${f.txt}"`);
  const g = f.g;
  if (g.left < +HG || g.right < +HG || g.top < +VG || g.bottom < +VG) {
    const worst = Math.min(g.left, g.right, g.top, g.bottom);
    if (!seen.has(f.name) || seen.get(f.name).worst > worst) seen.set(f.name, { worst, s: `FOCUS ${f.name} ${JSON.stringify(g)} ${f.how} "${f.txt}"` });
  }
}
console.log(JSON.stringify({ url, size, tabStops: steps, rest, focus: [...seen.values()].sort((a, b) => a.worst - b.worst).map((v) => v.s), noOutline: [...noRing], clips: [...clips.values()] }, null, 1));
ws.close(); chrome.kill(); process.exit(0);
