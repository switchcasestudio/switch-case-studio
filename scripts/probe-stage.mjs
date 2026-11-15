// Step a service page's pinned stage by timeline units, screenshot each step and
// log what is on screen (raw CDP; rule "a pinned stage never shows an empty frame").
// node scripts/probe-stage.mjs <url> <outDir> <units> <intro> [from to step] [W H]
//   units = states + intro (5.5 for a continuous stage, 5 and intro 0 for a classic one);
//   t is in states: 0 is the first hold, a boundary is a whole number.
//   RANGES="0.85:1.15,1.85:2.15" (env) probes several windows in one run.
// Then: ffmpeg -pattern_type glob -i '<outDir>/p*.jpg' -vf "scale=480:-1,tile=6x5" -frames:v 1 sheet.png
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
const [url, out, UNITS = "5.5", INTRO = "0.5", FROM = "-0.4", TO = "", STEP = "0.05", W = "1440", H = "900"] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const PORT = 9400 + Math.floor(Math.random() * 500);
const chrome = spawn(CHROME, ["--headless=new", "--hide-scrollbars", "--force-device-scale-factor=1", "--use-mock-keychain", "--password-store=basic",
  `--remote-debugging-port=${PORT}`, `--window-size=${W},${H}`, `--user-data-dir=/tmp/probe-${PORT}`, "about:blank"], { stdio: "ignore" });
process.on("exit", () => { try { chrome.kill(); } catch {} });
let ws;
for (let i = 0; i < 120 && !ws; i++) {
  try { const list = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json(); const p = list.find((t) => t.type === "page"); const s = new WebSocket(p.webSocketDebuggerUrl); await new Promise((r, j) => { s.onopen = r; s.onerror = j; }); ws = s; } catch { await sleep(250); }
}
let id = 0; const pending = new Map(); const logs = [];
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
ws.onmessage = (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); return; }
  if (d.method === "Runtime.exceptionThrown") logs.push("EXC " + (d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text));
  if (d.method === "Runtime.consoleAPICalled" && d.params.type === "error") logs.push("ERR " + d.params.args.map((a) => a.value || a.description || "").join(" ").slice(0, 300));
};
const ev = async (expression) => (await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true })).result?.result?.value;
await send("Page.enable"); await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", { width: +W, height: +H, deviceScaleFactor: 1, mobile: false });
await send("Page.navigate", { url });
for (let i = 0; i < 60; i++) { if ((await ev("document.readyState")) === "complete") break; await sleep(500); }
await sleep(2500);
// The cookie banner is not the subject.
await ev(`(()=>{const s=document.createElement('style');s.textContent='[class*="consent"],[class*="cookie"]{display:none!important}';document.head.appendChild(s)})()`);
const geo = await ev(`(()=>{const st=document.querySelector('.bw-stage');const sp=st.closest('.pin-spacer')||st;const hd=document.querySelector('.site-header');return JSON.stringify({top:sp.getBoundingClientRect().top+scrollY,head:hd?hd.offsetHeight:0,vh:innerHeight,cls:st.className,spacer:sp.offsetHeight})})()`);
const g = JSON.parse(geo);
console.log("geo", geo);
const start = g.top - g.head;
const dist = +UNITS * 1.2 * g.vh;
const to = TO === "" ? +UNITS - +INTRO : +TO;
const rows = [];
let n = 0;
// RANGES="0.85:1.15,1.85:2.15" probes several windows in one run.
const ranges = process.env.RANGES ? process.env.RANGES.split(",").map((r) => r.split(":").map(Number)) : [[+FROM, to]];
const ticks = ranges.flatMap(([a, b]) => { const o = []; for (let t = a; t <= b + 1e-9; t += +STEP) o.push(t); return o; });
for (const t of ticks) {
  const y = Math.round(start + ((t + +INTRO) / +UNITS) * dist);
  await ev(`window.scrollTo({top:${y},behavior:'instant'})`);
  await sleep(1100);
  const m = await ev(`(()=>{const st=document.querySelector('.bw-stage');const r=st.getBoundingClientRect();
    const plates=[...st.querySelectorAll('.bw-state')].map(el=>{const p=el.matches('.bw-state--full')?el:el.querySelector('.bw-state__art');const cs=getComputedStyle(p);const es=getComputedStyle(el);
      return {k:el.dataset.state,vis:es.visibility,op:+es.opacity*+cs.opacity,clip:cs.clipPath,pe:es.pointerEvents};});
    const stick=[...st.querySelectorAll('.bw-state__sticker')].map(s=>{const b=s.getBoundingClientRect();return Math.round(b.top-r.top)+','+Math.round(b.left-r.left)});
    return JSON.stringify({y:Math.round(scrollY),top:Math.round(r.top),bg:getComputedStyle(st).backgroundColor,plates,stick})})()`);
  const shot = await send("Page.captureScreenshot", { format: "jpeg", quality: 80 });
  const name = `p${String(n++).padStart(3, "0")}.jpg`;
  writeFileSync(`${out}/${name}`, Buffer.from(shot.result.data, "base64"));
  rows.push({ t: +t.toFixed(3), name, ...JSON.parse(m) });
}
writeFileSync(`${out}/rows.json`, JSON.stringify(rows, null, 1));
console.log("shots", n, "logs", logs.slice(0, 12));
ws.close(); chrome.kill(); process.exit(0);
