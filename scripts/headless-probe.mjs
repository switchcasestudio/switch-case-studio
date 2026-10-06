// Headless Chrome probe over raw CDP, no dependencies (Node 22+ has WebSocket).
// Why: the MCP/visible automation window stops producing frames when occluded, so
// IntersectionObservers, video playback and scroll-driven state silently stall
// there (CLAUDE.md: occluded-window trap). New headless renders frames on its own.
//
//   node scripts/headless-probe.mjs <url> '<js expression, may be an async IIFE>' [--phone | --size WxH] [--reduced-motion] [--chrome-flags "..."] [--shot out.png]
//
// WebGL runs on SwiftShader so About's DepthImage (Three.js) can mount; with --disable-gpu its
// context creation threw and the route error boundary replaced the whole page mid-probe.
// --phone emulates 390×844 @2x (Chrome refuses windows narrower than ~500px, so
// --window-size cannot do this). The expression is evaluated with awaitPromise and
// its JSON value printed.
import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";

const [, , url, expr, ...flags] = process.argv;
// --chrome-flags="a b c" appends raw Chrome switches (e.g. frame-rate flags for timing probes).
const cfIdx = flags.indexOf("--chrome-flags"); const extraChrome = cfIdx !== -1 && flags[cfIdx + 1] ? flags[cfIdx + 1].split(" ").filter(Boolean) : [];
if (!url || !expr) { console.error("usage: node scripts/headless-probe.mjs <url> '<expr>' [--phone] [--shot file.png]"); process.exit(2); }
const CHROME = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// Hard stop: a probe that awaits something that never happens must not hang the caller.
const HARD_MS = Number(process.env.PROBE_TIMEOUT_MS) || 60000;
setTimeout(() => { console.error(`headless-probe: ${HARD_MS / 1000}s hard timeout`); process.exit(3); }, HARD_MS).unref();
// Launch with retry: a port already held by a dying Chrome makes /json time out.
let chrome, ws, id = 0; const pending = new Map();
for (let attempt = 0; attempt < 3 && !ws; attempt++) {
  const PORT = 9333 + Math.floor(Math.random() * 2000);
  chrome = spawn(CHROME, ["--headless=new", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--hide-scrollbars", `--remote-debugging-port=${PORT}`, "--window-size=1440,900", "--autoplay-policy=no-user-gesture-required", `--user-data-dir=/tmp/headless-probe-${PORT}`, ...extraChrome, "about:blank"], { stdio: "ignore" });
  for (let i = 0; i < 100 && !ws; i++) {
    try { const list = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json(); const page = list.find((t) => t.type === "page"); if (!page) throw new Error("no page"); const sock = new WebSocket(page.webSocketDebuggerUrl); await new Promise((r, j) => { sock.onopen = r; sock.onerror = j; }); ws = sock; } catch { await sleep(250); }
  }
  if (!ws) chrome.kill();
}
if (!ws) throw new Error("Chrome did not expose a debugging target after 3 launches");
process.on("exit", () => { try { chrome.kill(); } catch {} });
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
await send("Page.enable"); await send("Runtime.enable");
if (flags.includes("--phone")) await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
if (flags.includes("--reduced-motion")) await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
const sizeIdx = flags.indexOf("--size");
if (sizeIdx !== -1 && flags[sizeIdx + 1]) { const [w, h] = flags[sizeIdx + 1].split("x").map(Number); await send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: 1, mobile: false }); }
await send("Page.navigate", { url }); await sleep(2500);
const r = await send("Runtime.evaluate", { expression: expr, awaitPromise: true, returnByValue: true });
const value = r.result?.result?.value;
console.log(JSON.stringify(value !== undefined ? value : { noValue: true, raw: r }, null, 1));
const shotIdx = flags.indexOf("--shot");
if (shotIdx !== -1 && flags[shotIdx + 1]) { const shot = await send("Page.captureScreenshot", { format: "png" }); writeFileSync(flags[shotIdx + 1], Buffer.from(shot.result.data, "base64")); }
ws.close(); chrome.kill();
