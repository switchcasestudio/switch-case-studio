// Record a real wheel-scroll of a live site as screencast frames (raw CDP).
// node scripts/record-scroll.mjs <url> <outDir> [W H DSF]   (case-study `longVideo`, see CLAUDE.md)
// Then: ffmpeg -f concat -safe 0 -i <outDir>/list.txt -vf "fps=30,scale=2400:1200:flags=lanczos:out_color_matrix=bt709:out_range=tv,format=yuv420p" -c:v libx264 -preset slow -crf 33 -tune animation -movflags +faststart -an -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 scroll.mp4
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
const [url, out, W = "1200", H = "600", DSF = "2"] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const PORT = 9400 + Math.floor(Math.random() * 500);
const chrome = spawn(CHROME, ["--headless=new", "--hide-scrollbars", `--force-device-scale-factor=${DSF}`, "--use-mock-keychain", "--password-store=basic",
  `--remote-debugging-port=${PORT}`, `--window-size=${W},${H}`, `--user-data-dir=/tmp/rec-${PORT}`, "about:blank"], { stdio: "ignore" });
process.on("exit", () => { try { chrome.kill(); } catch {} });
let ws;
for (let i = 0; i < 120 && !ws; i++) {
  try { const list = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json(); const p = list.find((t) => t.type === "page"); const s = new WebSocket(p.webSocketDebuggerUrl); await new Promise((r, j) => { s.onopen = r; s.onerror = j; }); ws = s; } catch { await sleep(250); }
}
let id = 0; const pending = new Map(); const frames = []; let recording = false;
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
ws.onmessage = (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); return; }
  if (d.method === "Page.screencastFrame") {
    const { data, metadata, sessionId } = d.params;
    if (recording) frames.push({ t: metadata.timestamp, data });
    send("Page.screencastFrameAck", { sessionId });
  }
};
const ev = async (expression) => (await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true })).result?.result?.value;
await send("Page.enable"); await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", { width: +W, height: +H, deviceScaleFactor: +DSF, mobile: false });
await send("Page.navigate", { url });
for (let i = 0; i < 60; i++) { if ((await ev("document.readyState")) === "complete") break; await sleep(500); }
await sleep(1500);
// Warm the page: wheel to the bottom so lazy media loads, then back to the top.
const wheel = (dy) => send("Input.dispatchMouseEvent", { type: "mouseWheel", x: +W / 2, y: +H / 2, deltaX: 0, deltaY: dy });
const height = await ev("document.documentElement.scrollHeight");
for (let y = 0; y < height + 2000; y += 400) { await wheel(400); await sleep(60); }
await sleep(2000);
await ev(`Promise.all([...document.images].map(i=>{i.loading='eager';return i.complete?0:new Promise(r=>{i.onload=i.onerror=r})}))`);
for (let y = 0; y < height + 2000; y += 800) { await wheel(-800); await sleep(40); }
await sleep(3000);
console.log("height", height, "scrollY at start", await ev("scrollY"));
// Record: 1.5s hold, steady wheel down, 2s hold at the bottom.
await send("Page.startScreencast", { format: "jpeg", quality: 92, everyNthFrame: 1, maxWidth: +W * +DSF, maxHeight: +H * +DSF });
await sleep(300); recording = true;
await sleep(1500);
const STEP = Number(process.env.STEP || 24), TICK = 50; // ~480px/s
let last = -1, still = 0;
while (still < 12) {
  await wheel(STEP); await sleep(TICK);
  const y = await ev("Math.round(scrollY)");
  still = y === last ? still + 1 : 0; last = y;
}
await sleep(2000);
recording = false;
await send("Page.stopScreencast");
frames.forEach((f, i) => writeFileSync(`${out}/f${String(i).padStart(5, "0")}.jpg`, Buffer.from(f.data, "base64")));
// ffmpeg concat list with real durations -> CFR later.
let list = "";
frames.forEach((f, i) => { const dur = i + 1 < frames.length ? frames[i + 1].t - f.t : 1 / 30; list += `file 'f${String(i).padStart(5, "0")}.jpg'\nduration ${dur.toFixed(4)}\n`; });
list += `file 'f${String(frames.length - 1).padStart(5, "0")}.jpg'\n`;
writeFileSync(`${out}/list.txt`, list);
const span = frames.at(-1).t - frames[0].t;
console.log("frames", frames.length, "seconds", span.toFixed(2), "fps", (frames.length / span).toFixed(1));
ws.close(); chrome.kill(); process.exit(0);
