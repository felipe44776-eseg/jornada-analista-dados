// Conferência da tela de toque (celular e tablet) pelo Chrome/Edge headless (DevTools Protocol), sem dependências.
// Uso:  node verificacao/toque.mjs --saida <pasta> [--deck <arquivo.html>]
// Emula três aparelhos (celular em pé, celular deitado, tablet) com toque de verdade e confere: o palco cabe na tela,
// o texto de partida fala em toque, tocar à direita avança, tocar na borda esquerda volta, arrastar também, e o menu
// abre e troca de mundo. Depois confere que no computador nada mudou: sem controles e sem navegação por mouse.
// Teto global de 240 s. Saída: PNGs e toque.json na pasta --saida. Código 1 se algo falhar.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2), opc = n => { const i = args.indexOf('--' + n); return i >= 0 ? args[i + 1] : null; };
const OUT = opc('saida') ? path.resolve(opc('saida')) : path.join(os.tmpdir(), 'deck-animado-toque');
const DECK = path.resolve(opc('deck') || path.join(AQUI, '..', 'index.html'));
const URL0 = pathToFileURL(DECK).href;
const NAV = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe'].find(f => fs.existsSync(f));
const PORTA = 9800 + Math.floor(Math.random() * 400), PERFIL = path.join(OUT, '_perfil-toque');
const sleep = ms => new Promise(r => setTimeout(r, ms));
fs.mkdirSync(OUT, { recursive: true });
const rel = { deck: DECK, navegador: NAV, erros: [], checagens: [] };
const checar = (nome, ok, detalhe) => { rel.checagens.push({ nome, ok: !!ok, detalhe: detalhe ?? null }); console.log((ok ? 'PASSA  ' : 'FALHA  ') + nome + (ok || detalhe == null ? '' : '  ->  ' + JSON.stringify(detalhe))); };

const proc = spawn(NAV, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--hide-scrollbars', '--mute-audio',
  `--user-data-dir=${PERFIL}`, '--window-size=1280,720', '--force-device-scale-factor=1', `--remote-debugging-port=${PORTA}`, 'about:blank'], { stdio: 'ignore' });
const matar = () => { try { proc.kill(); } catch {} };
const teto = setTimeout(() => { rel.erros.push('TETO GLOBAL de 240 s: navegador morto'); fs.writeFileSync(path.join(OUT, 'toque.json'), JSON.stringify(rel, null, 1)); matar(); process.exit(2); }, 240000);

async function main() {
  let wsUrl = null;
  for (let i = 0; i < 60 && !wsUrl; i++) {
    try { const l = await (await fetch(`http://127.0.0.1:${PORTA}/json/list`)).json(); const pg = l.find(t => t.type === 'page'); if (pg) wsUrl = pg.webSocketDebuggerUrl; } catch {}
    if (!wsUrl) await sleep(200);
  }
  if (!wsUrl) throw new Error('o navegador não respondeu na porta de depuração');
  const ws = new WebSocket(wsUrl); await new Promise((ok, ko) => { ws.onopen = ok; ws.onerror = () => ko(new Error('websocket')); });
  let seq = 0; const pend = new Map();
  ws.onmessage = e => {
    const m = JSON.parse(e.data);
    if (m.id && pend.has(m.id)) { const q = pend.get(m.id); pend.delete(m.id); m.error ? q.ko(new Error(m.error.message)) : q.ok(m.result); }
    else if (m.method === 'Runtime.exceptionThrown') rel.erros.push('EXCEÇÃO ' + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text));
  };
  const send = (method, params = {}) => new Promise((ok, ko) => {
    const id = ++seq; pend.set(id, { ok, ko }); ws.send(JSON.stringify({ id, method, params }));
    setTimeout(() => { if (pend.has(id)) { pend.delete(id); ko(new Error('sem resposta: ' + method)); } }, 20000);
  });
  const evJ = async expr => { const r = await send('Runtime.evaluate', { expression: `JSON.stringify(${expr})`, returnByValue: true }); if (r.exceptionDetails) throw new Error('eval: ' + (r.exceptionDetails.exception?.description || r.exceptionDetails.text)); return r.result.value === undefined ? undefined : JSON.parse(r.result.value); };
  const foto = async nome => { const r = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(OUT, nome), Buffer.from(r.data, 'base64')); };
  const abrir = async url => { await send('Page.navigate', { url }); for (let i = 0; i < 80; i++) { await sleep(100); if (await evJ('typeof Deck !== "undefined" && Deck.estado.montada === true')) return; } throw new Error('o deck não carregou: ' + url); };
  const estado = () => evJ('(() => { const e = Deck.estado; return { c: e.c, p: e.p, animando: e.animando, toque: e.toque }; })()');
  const toque = async (x, y) => { await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] }); await sleep(40); await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await sleep(160); };
  const arrastar = async (x0, x1, y) => {
    await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x0, y }] });
    for (let k = 1; k <= 6; k++) { await sleep(16); await send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x0 + (x1 - x0) * k / 6, y }] }); }
    await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await sleep(160);
  };
  /* avança um passo e pula a animação dele: dois toques à direita, o segundo depois do primeiro */
  const assentar = async (w, h) => { if ((await estado()).animando) await toque(w * 0.8, h * 0.5); };

  await send('Page.enable'); await send('Runtime.enable');

  /* ---------- aparelhos de toque ---------- */
  const APARELHOS = [
    { nome: 'celular-em-pe', w: 390, h: 844 },
    { nome: 'celular-deitado', w: 844, h: 390 },
    { nome: 'tablet', w: 1024, h: 768 }
  ];
  for (const a of APARELHOS) {
    const { nome, w, h } = a, r = t => `${nome}: ${t}`;
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 2, mobile: true });
    await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
    await abrir(URL0);
    const e0 = await estado();
    checar(r('modo de toque ligado ao abrir'), e0.toque === true, e0);
    const q = await evJ('(() => { const b = document.getElementById("quadro").getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: b.height, vw: innerWidth, vh: innerHeight }; })()');
    const cabe = q.x >= -0.5 && q.y >= -0.5 && q.x + q.w <= q.vw + 0.5 && q.y + q.h <= q.vh + 0.5;
    checar(r('o palco cabe inteiro na tela'), cabe, q);
    checar(r('o palco usa toda a largura ou toda a altura'), Math.abs(q.w - q.vw) < 1.5 || Math.abs(q.h - q.vh) < 1.5, q);
    checar(r('texto de partida fala em toque'), (await evJ('document.querySelector(".jg-t-dica").textContent.trim()')) === 'Toque para começar');
    checar(r('botão de menu visível'), await evJ('(() => { const m = document.getElementById("tq-menu"); if (!m) return false; const b = m.getBoundingClientRect(); return b.width >= 44 && b.height >= 44 && b.right <= innerWidth && b.top >= 0; })()'));
    checar(r('aviso de girar só em pé'), (await evJ('getComputedStyle(document.getElementById("tq-girar")).display')) === (h > w ? 'block' : 'none'));
    checar(r('botão de tela cheia à vista, ao lado do menu'), await evJ('(() => { const t = document.getElementById("tc"), m = document.getElementById("tq-menu"); if (!t || !m) return false; const a = t.getBoundingClientRect(), b = m.getBoundingClientRect(); return getComputedStyle(t).opacity === "1" && a.width >= 44 && a.height >= 44 && a.left >= 0 && a.top >= 0 && a.right <= b.left; })()'));
    await sleep(700); await foto(`${nome}-1-titulo.png`);

    await toque(w * 0.1, h * 0.5);                                       // na tela de título, até o toque à esquerda começa
    let e = await estado();
    checar(r('qualquer toque começa o jogo'), e.c === 0 && e.p === 1, e);
    await assentar(w, h); e = await estado();
    checar(r('tocar durante a animação pula para o fim do passo'), e.p === 1 && e.animando === false, e);
    await toque(w * 0.8, h * 0.5); await assentar(w, h); e = await estado();
    checar(r('tocar à direita avança'), e.p === 2 && !e.animando, e);
    await foto(`${nome}-2-passo2.png`);
    await toque(w * 0.1, h * 0.5); e = await estado();
    checar(r('tocar na borda esquerda volta'), e.p === 1 && !e.animando, e);
    await toque(w * 0.5, h * 0.5); await assentar(w, h); e = await estado();
    checar(r('tocar no meio avança'), e.p === 2, e);
    await arrastar(w * 0.75, w * 0.25, h * 0.5); await assentar(w, h); e = await estado();
    checar(r('arrastar para a esquerda avança'), e.p === 3, e);
    await arrastar(w * 0.25, w * 0.75, h * 0.5); e = await estado();
    checar(r('arrastar para a direita volta'), e.p === 2, e);

    const m = await evJ('(() => { const b = document.getElementById("tq-menu").getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; })()');
    await toque(m.x, m.y); await sleep(200);                             // logo depois de arrastar: o navegador pode não gerar o clique, e o menu tem de abrir assim mesmo
    checar(r('o menu abre'), await evJ('document.getElementById("tq-painel").classList.contains("aberto")'));
    e = await estado();
    checar(r('abrir o menu não muda de passo'), e.p === 2, e);
    await foto(`${nome}-3-menu.png`);
    const b3 = await evJ('(() => { const b = document.querySelector("#tq-painel [data-c=\\"2\\"]").getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2, dentro: b.right <= innerWidth && b.bottom <= innerHeight }; })()');
    checar(r('o menu cabe na tela'), b3.dentro, b3);
    await toque(b3.x, b3.y); await sleep(300); e = await estado();
    checar(r('o menu leva ao mundo 3'), e.c === 2, e);
    checar(r('o menu fecha depois de escolher'), !(await evJ('document.getElementById("tq-painel").classList.contains("aberto")')));
    await assentar(w, h); await sleep(900); await foto(`${nome}-4-mundo3.png`);

    /* tela cheia pelo botão: entra, o ícone troca, o palco continua cabendo, e o mesmo botão sai */
    const antes = await estado();
    const tcb = await evJ('(() => { const b = document.getElementById("tc").getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; })()');
    await toque(tcb.x, tcb.y); await sleep(700);
    const cheia = await evJ('({ api: !!document.fullscreenElement, classe: document.documentElement.classList.contains("cheia"), rotulo: document.getElementById("tc").getAttribute("aria-label") })');
    checar(r('o botão entra em tela cheia'), cheia.api && cheia.classe && cheia.rotulo === 'Sair da tela cheia', cheia);
    e = await estado();
    checar(r('entrar em tela cheia não muda de passo'), e.c === antes.c && e.p === antes.p, e);
    const qc = await evJ('(() => { const b = document.getElementById("quadro").getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: b.height, vw: innerWidth, vh: innerHeight }; })()');
    checar(r('em tela cheia o palco continua cabendo'), qc.x >= -0.5 && qc.y >= -0.5 && qc.x + qc.w <= qc.vw + 0.5 && qc.y + qc.h <= qc.vh + 0.5, qc);
    await foto(`${nome}-5-tela-cheia.png`);
    const tcb2 = await evJ('(() => { const b = document.getElementById("tc").getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; })()');
    await toque(tcb2.x, tcb2.y); await sleep(700);
    checar(r('o mesmo botão sai da tela cheia'), await evJ('!document.fullscreenElement && !document.documentElement.classList.contains("cheia")'));
  }

  /* ---------- aparelho sem tela cheia no navegador (é o caso do iPhone): o botão explica o caminho pela Tela de Início ---------- */
  const semApi = await send('Page.addScriptToEvaluateOnNewDocument', { source: 'Element.prototype.requestFullscreen = undefined; Element.prototype.webkitRequestFullscreen = undefined;' });
  await send('Emulation.setDeviceMetricsOverride', { width: 844, height: 390, deviceScaleFactor: 2, mobile: true });
  await abrir(URL0);
  {
    const b = await evJ('(() => { const r = document.getElementById("tc").getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()');
    await toque(b.x, b.y); await sleep(300);
    const a = await evJ('(() => { const el = document.getElementById("tc-aviso"), r = el.getBoundingClientRect(); return { visivel: el.classList.contains("visivel"), texto: el.textContent, dentro: r.left >= 0 && r.right <= innerWidth && r.bottom <= innerHeight, cheia: !!document.fullscreenElement }; })()');
    checar('sem tela cheia no navegador: o botão mostra o caminho pela Tela de Início', a.visivel && /Tela de Início/.test(a.texto) && a.dentro && !a.cheia, a);
    const e1 = await estado();
    checar('sem tela cheia no navegador: tocar no botão não navega', e1.c === 0 && e1.p === 0, e1);
    await foto('sem-tela-cheia-aviso.png');
    const c = await evJ('(() => { const r = document.getElementById("tc-aviso").getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()');
    await toque(c.x, c.y); await sleep(200);
    checar('sem tela cheia no navegador: tocar no aviso fecha o aviso', !(await evJ('document.getElementById("tc-aviso").classList.contains("visivel")')));
  }
  await send('Page.removeScriptToEvaluateOnNewDocument', { identifier: semApi.identifier });

  /* ---------- computador: nada muda ---------- */
  await send('Emulation.setTouchEmulationEnabled', { enabled: false });
  await send('Emulation.clearDeviceMetricsOverride');
  await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 720, deviceScaleFactor: 1, mobile: false });
  await abrir(URL0);
  let e = await estado();
  checar('computador: modo de toque desligado', e.toque === false, e);
  checar('computador: sem controles de toque', await evJ('!document.getElementById("tq-menu") && !document.getElementById("tq-painel") && !document.getElementById("tq-dica")'));
  checar('computador: texto de partida fala em Espaço', (await evJ('document.querySelector(".jg-t-dica").textContent.trim()')) === 'Espaço para começar');
  for (const type of ['mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', { type, x: 1000, y: 360, button: 'left', clickCount: 1 });
  await sleep(250); e = await estado();
  checar('computador: clique do mouse não navega', e.c === 0 && e.p === 0 && e.toque === false, e);
  for (const type of ['keyDown', 'keyUp']) await send('Input.dispatchKeyEvent', { type, key: ' ', code: 'Space', windowsVirtualKeyCode: 32, nativeVirtualKeyCode: 32, text: type === 'keyDown' ? ' ' : undefined });
  await sleep(250); e = await estado();
  checar('computador: Espaço continua avançando', e.p === 1, e);
  /* tela cheia no computador: o botão fica escondido, aparece quando o mouse se mexe, e a tecla F continua valendo */
  await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 720, deviceScaleFactor: 1, mobile: false });
  await abrir(URL0);
  checar('computador: botão de tela cheia escondido com o mouse parado', (await evJ('getComputedStyle(document.getElementById("tc")).opacity')) === '0');
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 600, y: 300 }); await sleep(450);
  const bt = await evJ('(() => { const t = document.getElementById("tc"), b = t.getBoundingClientRect(); return { opacidade: getComputedStyle(t).opacity, x: b.left + b.width / 2, y: b.top + b.height / 2 }; })()');
  checar('computador: o botão aparece quando o mouse se mexe', bt.opacidade === '1', bt);
  await foto('computador-botao-tela-cheia.png');
  for (const type of ['mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', { type, x: bt.x, y: bt.y, button: 'left', clickCount: 1 });
  await sleep(700);
  checar('computador: o clique no botão entra em tela cheia', await evJ('!!document.fullscreenElement && document.documentElement.classList.contains("cheia")'));
  e = await estado();
  checar('computador: clicar no botão não navega', e.c === 0 && e.p === 0, e);
  for (const type of ['keyDown', 'keyUp']) await send('Input.dispatchKeyEvent', { type, key: 'f', code: 'KeyF', windowsVirtualKeyCode: 70, nativeVirtualKeyCode: 70, text: type === 'keyDown' ? 'f' : undefined });
  await sleep(700);
  checar('computador: a tecla F sai da tela cheia', await evJ('!document.fullscreenElement'));
  await sleep(2800);
  checar('computador: o botão some de novo com o mouse parado', (await evJ('getComputedStyle(document.getElementById("tc")).opacity')) === '0');

  checar('nenhum erro de JavaScript', rel.erros.length === 0, rel.erros);
  ws.close();
}

main().catch(err => { rel.erros.push(String(err && err.stack || err)); console.log('ERRO  ' + err.message); }).finally(() => {
  clearTimeout(teto); matar();
  const falhas = rel.checagens.filter(c => !c.ok).length + (rel.erros.length && !rel.checagens.some(c => c.nome === 'nenhum erro de JavaScript') ? 1 : 0);
  fs.writeFileSync(path.join(OUT, 'toque.json'), JSON.stringify(rel, null, 1));
  console.log(`\n${rel.checagens.filter(c => c.ok).length} de ${rel.checagens.length} checagens passaram`);
  setTimeout(() => { try { fs.rmSync(PERFIL, { recursive: true, force: true }); } catch {} process.exit(falhas ? 1 : 0); }, 400);
});
