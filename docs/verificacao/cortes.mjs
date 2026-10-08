// Confere os cortes entre cenas no deck completo: abre o último passo de cada cena, aperta → e fotografa
// antes da tecla e 80, 350 e 1100 ms depois (a cortina do motor dura 700 ms).
// Uso:  node verificacao/cortes.mjs --saida <pasta> [--deck <arquivo.html>]
// Saída: corte-NN-MM-{0-antes,1-80ms,2-350ms,3-1100ms}.png e cortes.json. Teto de 120 s.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url)), args = process.argv.slice(2), opc = n => { const i = args.indexOf('--' + n); return i >= 0 ? args[i + 1] : null; };
const OUT = opc('saida') ? path.resolve(opc('saida')) : path.join(os.tmpdir(), 'deck-animado-verificacao');
const URL0 = pathToFileURL(path.resolve(opc('deck') || path.join(AQUI, '..', 'index.html'))).href;
const NAV = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(f => fs.existsSync(f));
const PORTA = 9800 + Math.floor(Math.random() * 150), PERFIL = path.join(OUT, '_perfil-cortes'), sleep = ms => new Promise(r => setTimeout(r, ms));
fs.mkdirSync(OUT, { recursive: true });
const rel = { erros: [], cortes: [] };
const proc = spawn(NAV, ['--headless=new', '--disable-gpu', '--no-first-run', '--hide-scrollbars', '--mute-audio', `--user-data-dir=${PERFIL}`, '--window-size=1280,720', '--force-device-scale-factor=1', `--remote-debugging-port=${PORTA}`, 'about:blank'], { stdio: 'ignore' });
const fechar = cod => { fs.writeFileSync(path.join(OUT, 'cortes.json'), JSON.stringify(rel, null, 1)); try { proc.kill(); } catch {} setTimeout(() => { try { fs.rmSync(PERFIL, { recursive: true, force: true }); } catch {} process.exit(cod); }, 600); };
setTimeout(() => { rel.erros.push('TETO de 120 s'); fechar(2); }, 120000);

(async () => {
  let wsUrl = null;
  for (let i = 0; i < 60 && !wsUrl; i++) { try { const pg = (await (await fetch(`http://127.0.0.1:${PORTA}/json/list`)).json()).find(t => t.type === 'page'); if (pg) wsUrl = pg.webSocketDebuggerUrl; } catch {} if (!wsUrl) await sleep(200); }
  const ws = new WebSocket(wsUrl); await new Promise(ok => { ws.onopen = ok; });
  let seq = 0; const pend = new Map();
  ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m.result || {}); pend.delete(m.id); } else if (m.method === 'Runtime.exceptionThrown') rel.erros.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text); };
  const send = (method, params = {}) => new Promise(ok => { const id = ++seq; pend.set(id, ok); ws.send(JSON.stringify({ id, method, params })); });
  const ev = async x => (await send('Runtime.evaluate', { expression: x, returnByValue: true })).result?.value;
  const foto = async nome => fs.writeFileSync(path.join(OUT, nome), Buffer.from((await send('Page.captureScreenshot', { format: 'png' })).data, 'base64'));
  await send('Page.enable'); await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 720, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: URL0 + '?passo=0&parado=1' }); await sleep(1200);
  const n = await ev('Deck.estado.cenas');
  for (let k = 1; k < n; k++) {
    const de = String(k).padStart(2, '0'), para = String(k + 1).padStart(2, '0'), base = `corte-${de}-${para}`;
    await send('Page.navigate', { url: `${URL0}?cena=${de}&passo=99` }); await sleep(1500);
    await foto(`${base}-0-antes.png`);
    const idsRepetidos = await ev(`(() => { const ids = [...document.querySelectorAll('#palco [id]')].map(e => e.id).filter(i => i.startsWith('jg-al')); return ids.length - new Set(ids).size; })()`);
    const t0 = Date.now(), tecla = { key: 'ArrowRight', code: 'ArrowRight', windowsVirtualKeyCode: 39, nativeVirtualKeyCode: 39 };
    await send('Input.dispatchKeyEvent', Object.assign({ type: 'rawKeyDown' }, tecla)); await send('Input.dispatchKeyEvent', Object.assign({ type: 'keyUp' }, tecla));
    for (const [t, nome] of [[80, '1-80ms'], [350, '2-350ms'], [1100, '3-1100ms']]) { const f = t - (Date.now() - t0); if (f > 0) await sleep(f); await foto(`${base}-${nome}.png`); }
    rel.cortes.push({ corte: `${de} -> ${para}`, depois: await ev('Deck.estado.id + " p=" + Deck.estado.p + " animando=" + Deck.estado.animando'), cortinaSobrando: await ev('document.querySelectorAll(".cortina").length'), palcos: await ev('document.querySelectorAll("#palco").length'), idsDeAliadoRepetidos: idsRepetidos });
  }
  console.log(JSON.stringify(rel, null, 1)); fechar(rel.erros.length ? 1 : 0);
})().catch(e => { rel.erros.push('FALHA: ' + e.message); fechar(1); });
