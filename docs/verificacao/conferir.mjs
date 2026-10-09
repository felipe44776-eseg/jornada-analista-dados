// Conferência de UMA cena em tempo real pelo Chrome/Edge headless (DevTools Protocol), sem dependências.
// Uso:  node verificacao/conferir.mjs --saida <pasta> [--deck <arquivo.html>] [--cena 01] [--esperado <arquivo.json>] [tudo|real|teclas|dom|pdf]
//   --deck      arquivo montado (padrão: ..\index.html). Para um build privado, o arquivo gerado com -Destino.
//   --cena      id da cena (padrão: 01). O esperado sai de fonte\cena<id>\esperado.json, salvo se vier --esperado.
//  real    toca a cena com teclas de verdade, fotografa quadros no meio da animação ("quadros"), mede quanto tempo um
//          elemento fica inteiro e parado ("leitura"), confere o HUD ("hud") e o que está visível ("estado") ao fim de
//          cada passo, mede o pico de áudio e compara o fim natural de cada passo com o link direto ?parado=1
//  teclas  →, ←, R, M, N, End      dom  "textos" e "contagens" contra o roteiro, ciano só onde "acento" deixa      pdf  impressão
// Teto global de 300 s: o navegador é morto. Saída: PNGs e relatorio.json na pasta --saida. Código 1 se algo falhar.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { comparar } from './png.mjs';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2), opc = n => { const i = args.indexOf('--' + n); return i >= 0 ? args[i + 1] : null; };
const comValor = new Set(['saida', 'deck', 'cena', 'esperado'].flatMap(n => { const i = args.indexOf('--' + n); return i >= 0 ? [i, i + 1] : []; }));
const OUT = opc('saida') ? path.resolve(opc('saida')) : path.join(os.tmpdir(), 'deck-animado-verificacao');
const MODO = args.find((a, i) => !comValor.has(i) && !a.startsWith('--')) || 'tudo';
const CENA = /^\d+$/.test(opc('cena') || '') ? opc('cena').padStart(2, '0') : (opc('cena') || '01');
const DECK = path.resolve(opc('deck') || path.join(AQUI, '..', 'index.html'));
const ARQ_ESP = path.resolve(opc('esperado') || path.join(AQUI, '..', 'fonte', 'cena' + CENA, 'esperado.json'));
const ESP = JSON.parse(fs.readFileSync(ARQ_ESP, 'utf8'));
const URL0 = pathToFileURL(DECK).href, LINK = `${URL0}?cena=${CENA}`, ULTIMO = ESP.passos - 1;
const NAV = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe'].find(f => fs.existsSync(f));
const PORTA = 9337 + Math.floor(Math.random() * 400), PERFIL = path.join(OUT, '_perfil-conferir');
const sleep = ms => new Promise(r => setTimeout(r, ms));
fs.mkdirSync(OUT, { recursive: true });
const rel = { deck: DECK, cena: CENA, esperado: ARQ_ESP, navegador: NAV, erros: [], falhas: [] };
const falha = t => rel.falhas.push(t);
const gravar = () => fs.writeFileSync(path.join(OUT, 'relatorio.json'), JSON.stringify(rel, null, 1));

const proc = spawn(NAV, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--hide-scrollbars', '--mute-audio',
  `--user-data-dir=${PERFIL}`, '--window-size=1280,720', '--force-device-scale-factor=1', `--remote-debugging-port=${PORTA}`, 'about:blank'], { stdio: 'ignore' });
const matar = () => { try { proc.kill(); } catch {} };
const teto = setTimeout(() => { rel.erros.push('TETO GLOBAL de 300 s: navegador morto'); gravar(); matar(); process.exit(2); }, 300000);

/* funções que rodam dentro da página (viram texto) */
const NA_PAGINA = `
  window.__q = s => [...document.querySelectorAll(s)];
  window.__t = e => e.textContent.replace(/\\s+/g, ' ').trim();
  window.__vis = e => { for (let x = e; x && x.id !== 'palco'; x = x.parentElement) { const c = getComputedStyle(x); if (+c.opacity <= 0.5 || c.display === 'none' || c.visibility === 'hidden') return false; } return true; };
  window.__hud = () => { const h = document.querySelector('.jg-hud'); if (!h || !__vis(h)) return null; const j = h.querySelector('.jg-jog');
    return { vidas: __q('.jg-cor svg:not(.vazio)').length, fase: h.querySelector('.jg-fase b').textContent, nome: h.querySelector('.jg-nome').textContent, prazo: +h.querySelector('.jg-barra i').style.getPropertyValue('--p'), jogadores: !!j && __vis(j) }; };
  window.__estado = chaves => { const o = {}; chaves.forEach(([s, tipo]) => { const v = __q(s).filter(__vis); o[s] = tipo === 'number' ? v.length : tipo === 'string' ? (v[0] ? __t(v[0]) : '') : v.length > 0; }); return o; };
  0`;

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
    else if (m.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(m.params.type)) rel.erros.push('CONSOLE ' + m.params.type + ': ' + m.params.args.map(a => a.value ?? a.description).join(' '));
    else if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error') rel.erros.push('LOG ' + m.params.entry.text + ' ' + (m.params.entry.url || ''));
  };
  const send = (method, params = {}) => new Promise((ok, ko) => {
    const id = ++seq; pend.set(id, { ok, ko }); ws.send(JSON.stringify({ id, method, params }));
    setTimeout(() => { if (pend.has(id)) { pend.delete(id); ko(new Error('sem resposta: ' + method)); } }, 20000);
  });
  const ev = async expr => { const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }); if (r.exceptionDetails) throw new Error('eval: ' + (r.exceptionDetails.exception?.description || r.exceptionDetails.text)); return r.result.value; };
  const evJ = async expr => JSON.parse(await ev(`JSON.stringify(${expr})`));
  const foto = async nome => { const r = await send('Page.captureScreenshot', { format: 'png' }); const b = Buffer.from(r.data, 'base64'); fs.writeFileSync(path.join(OUT, nome), b); return b; };
  const TECLAS = { ' ': ['Space', 32], ArrowRight: ['ArrowRight', 39], ArrowLeft: ['ArrowLeft', 37], r: ['KeyR', 82], m: ['KeyM', 77], n: ['KeyN', 78], End: ['End', 35], Home: ['Home', 36] };
  const tecla = async key => {
    const [code, vk] = TECLAS[key], base = { key, code, windowsVirtualKeyCode: vk, nativeVirtualKeyCode: vk };
    await send('Input.dispatchKeyEvent', Object.assign({ type: key.length === 1 ? 'keyDown' : 'rawKeyDown' }, base, key.length === 1 ? { text: key } : {}));
    await send('Input.dispatchKeyEvent', Object.assign({ type: 'keyUp' }, base));
  };
  const estado = () => evJ('Object.assign(Deck.estado, { mudo: Som.mudo, ctx: Som.diag() ? Som.diag().ac.state : null, notas: document.getElementById("notas").classList.contains("aberto"), ind: document.getElementById("ind").textContent })');
  const ir = async u => { await send('Page.navigate', { url: u }); for (let i = 0; i < 50; i++) { await sleep(100); try { if (await ev('document.readyState === "complete" && typeof Deck === "object" && document.fonts.status === "loaded"')) { await ev(NA_PAGINA); return; } } catch {} } };
  const esperarFim = async (p, max) => { for (let i = 0; i < max / 100; i++) { const e = await estado(); if (!e.animando && e.p === p) return true; await sleep(100); } return false; };
  const congelar = sim => ev(sim ? "document.documentElement.classList.add('parado'); document.getElementById('ind').style.visibility='hidden'; 0" : "document.documentElement.classList.remove('parado'); document.getElementById('ind').style.visibility=''; 0");
  /* HUD e estado visível contra o esperado do passo p; devolve a lista de divergências */
  const conferirPasso = async p => {
    const d = [], hud = await evJ('__hud()'), eh = ESP.hud ? ESP.hud[p] : undefined;
    if (eh === null && hud) d.push('HUD devia estar escondido');
    if (eh) { if (!hud) d.push('HUD devia estar visível'); else for (const k in eh) { const ok = k === 'prazo' ? Math.abs(hud.prazo - eh.prazo) < 0.005 : hud[k] === eh[k]; if (!ok) d.push(`HUD ${k}: esperado ${eh[k]}, obtido ${hud[k]}`); } }
    const ee = ESP.estado && ESP.estado[p];
    let est = null;
    if (ee) { est = await evJ(`__estado(${JSON.stringify(Object.entries(ee).map(([s, v]) => [s, typeof v]))})`); for (const s in ee) if (est[s] !== ee[s]) d.push(`${s}: esperado ${JSON.stringify(ee[s])}, obtido ${JSON.stringify(est[s])}`); }
    d.forEach(x => falha(`passo ${p}: ${x}`));
    return { hud: hud ? `${hud.vidas} vidas · ${hud.fase} ${hud.nome} · prazo ${hud.prazo}${hud.jogadores ? ' · 2 jogadores' : ''}` : 'escondido', divergencias: d };
  };

  await send('Page.enable'); await send('Runtime.enable'); await send('Log.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 720, deviceScaleFactor: 1, mobile: false });
  const naturais = {};

  if (MODO === 'tudo' || MODO === 'real') {
    /* ---- 1. a cena inteira, com teclas, em tempo real ---- */
    await ir(LINK); await sleep(250);
    const abriu = await estado(); rel.aoAbrir = `cena ${abriu.id} · p=${abriu.p} animando=${abriu.animando} · ${abriu.passos} passos`;
    if (abriu.id !== CENA) falha(`o link ?cena=${CENA} abriu a cena ${abriu.id}`);
    if (abriu.passos !== ESP.passos) falha(`a cena tem ${abriu.passos} passos; o esperado.json diz ${ESP.passos}`);
    if (!(await esperarFim(0, 20000))) falha('o passo 0 não terminou sozinho');
    await sleep(900);
    rel.passos = [Object.assign({ passo: 0 }, await conferirPasso(0))];
    await congelar(true); await sleep(120); naturais[0] = await foto('natural-p0.png'); await congelar(false);
    await ev(`window.__am = { s: null, i: 0, d: [] }; setInterval(() => { const a = window.__am; if (!a.s) return; const el = document.querySelectorAll(a.s)[a.i]; if (!el) return; const b = el.getBoundingClientRect();
      a.d.push([Math.round(performance.now() - a.t0), Math.round(b.left + b.width / 2), Math.round(b.top + b.height / 2), __vis(el) ? +getComputedStyle(el).opacity : 0, Math.round(b.left), Math.round(b.right), Math.round(b.top), Math.round(b.bottom)]); }, 30); 0`);
    for (let p = 1; p <= ULTIMO; p++) {
      const lei = (ESP.leitura || []).find(l => l.passo === p);
      await ev(`window.__am.s = ${JSON.stringify(lei ? lei.seletor : null)}; window.__am.i = ${lei ? lei.indice || 0 : 0}; window.__am.d = []; window.__am.t0 = performance.now(); 0`);
      const t0 = Date.now();
      await tecla(p === 1 && ESP.primeiraTeclaComeca ? ' ' : 'ArrowRight');
      if (p === 1) rel.medidor = await ev(`(() => { const d = Som.diag(); if (!d) return 'sem contexto de áudio'; const an = d.ac.createAnalyser(); an.fftSize = 2048; d.saida.connect(an); const b = new Float32Array(2048); window.__pico = 0; window.__picoTotal = 0;
        setInterval(() => { an.getFloatTimeDomainData(b); let m = 0; for (let i = 0; i < b.length; i++) { const a = Math.abs(b[i]); if (a > m) m = a; } if (m > window.__pico) window.__pico = m; if (m > window.__picoTotal) window.__picoTotal = m; }, 12); return 'contexto ' + d.ac.state + ', ' + d.ac.sampleRate + ' Hz'; })()`);
      await ev('window.__pico = 0');
      const logo = await estado();
      if (logo.p !== p || !logo.animando) falha(`passo ${p}: logo depois da tecla, p=${logo.p} animando=${logo.animando}`);
      for (const t of (ESP.quadros && ESP.quadros[p]) || []) { const falta = t - (Date.now() - t0); if (falta > 0) await sleep(falta); await foto(`real-p${p}-t${String(t).padStart(5, '0')}.png`); }
      const terminou = await esperarFim(p, 25000), dur = Date.now() - t0;
      if (!terminou) falha(`passo ${p}: não terminou sozinho em 25 s`);
      await sleep(900);
      const pico = await ev('window.__pico');
      const reg = Object.assign({ passo: p, duracaoMs: dur, picoDeSaida: pico == null ? null : +pico.toFixed(3) }, await conferirPasso(p), { temporariosSobrando: await ev('document.querySelectorAll(".tp-fx > *").length') });
      await congelar(true); await sleep(120); naturais[p] = await foto(`natural-p${p}.png`); await congelar(false);
      if (lei) {                                                          // quanto tempo o elemento ficou inteiro e parado antes de sair
        const d = await evJ('window.__am.d'), inteira = s => s[3] >= 0.99 && s[4] >= 0 && s[5] <= 1280 && s[6] >= 0 && s[7] <= 720;
        let melhor = [0, 0], ini = -1, primeira = -1, saiu = -1;
        for (let j = 1; j < d.length; j++) {
          const parada = inteira(d[j]) && Math.abs(d[j][1] - d[j - 1][1]) + Math.abs(d[j][2] - d[j - 1][2]) <= 3;
          if (inteira(d[j]) && primeira < 0) primeira = d[j][0];
          if (primeira >= 0 && saiu < 0 && d[j][3] < 0.99) saiu = d[j][0];
          if (parada) { if (ini < 0) ini = d[j][0]; if (d[j][0] - ini > melhor[1] - melhor[0]) melhor = [ini, d[j][0]]; } else ini = -1;
        }
        reg.leitura = { elemento: `${lei.seletor}[${lei.indice || 0}]`, paradaEInteiraMs: melhor[1] - melhor[0], inteiraDesdeMs: primeira, saiuAosMs: saiu, inteiraAntesDeSairMs: saiu - primeira };
        if (lei.minimoParadaMs && reg.leitura.paradaEInteiraMs < lei.minimoParadaMs) falha(`passo ${p}: ${lei.seletor} ficou parada e inteira só ${reg.leitura.paradaEInteiraMs} ms (mínimo ${lei.minimoParadaMs})`);
      }
      rel.passos.push(reg); gravar();
    }
    rel.picoTotal = await ev('window.__picoTotal');
    if (rel.picoTotal >= 0.98) falha(`pico de áudio ${rel.picoTotal}: perto de estourar`);

    /* ---- 2. fim natural x link direto ---- */
    rel.linkDireto = [];
    for (let p = 0; p <= ULTIMO; p++) {
      await ir(`${LINK}&passo=${p}&parado=1`); await sleep(250);
      const c = await conferirPasso(p);
      await ev("document.getElementById('ind').style.visibility='hidden'; 0"); await sleep(80);
      const b = await foto(`link-p${p}.png`), cmp = naturais[p] ? comparar(naturais[p], b) : {};
      if (cmp.pixelsDiferentes > 200) falha(`passo ${p}: fim natural e link direto diferem em ${cmp.pixelsDiferentes} pixels (caixa ${cmp.caixa})`);
      rel.linkDireto.push(Object.assign({ passo: p, hud: c.hud, divergencias: c.divergencias }, cmp));
    }
    gravar();
  }

  if (MODO === 'tudo' || MODO === 'teclas') {
    /* ---- 3. teclas ---- */
    const T = []; const marca = async (oque, espera) => { const e = await estado(); const obtido = `p=${e.p} animando=${e.animando} mudo=${e.mudo} notas=${e.notas} som=${e.ctx}`; const ok = espera.split(' ').every(x => obtido.includes(x)); T.push({ oque, espera, obtido, ok }); if (!ok) falha(`tecla ${oque}: esperado ${espera}, obtido ${obtido}`); };
    await ir(LINK);
    if (ESP.primeiraTeclaComeca) { await sleep(150); await tecla(' '); await sleep(250); await marca('Espaço 150 ms depois de abrir: a primeira tecla já começa', 'p=1 animando=true som=running'); }
    else { await esperarFim(0, 20000); await tecla('ArrowRight'); await sleep(300); await marca('→ com o passo 0 terminado', 'p=1 animando=true som=running'); }
    await tecla('ArrowRight'); await sleep(200); await marca('→ durante a animação: pula para o fim', 'p=1 animando=false');
    if (ULTIMO >= 2) { await tecla('ArrowRight'); await sleep(400); await marca('→', 'p=2 animando=true'); await tecla('ArrowLeft'); await sleep(200); await marca('← durante a animação', 'p=1 animando=false'); }
    await tecla('m'); await sleep(150); await marca('M', 'mudo=true');
    await tecla('m'); await sleep(150); await marca('M de novo', 'mudo=false');
    await tecla('n'); await sleep(250); await marca('N', 'notas=true'); await foto('teclas-notas.png');
    rel.notasSecoes = await ev('[...document.querySelectorAll("#notas h3")].map(h => h.textContent).join(" | ")');
    await tecla('n'); await sleep(150); await marca('N de novo', 'notas=false');
    await tecla('End'); await sleep(250); const fimE = await estado(); T.push({ oque: 'End', obtido: `cena ${fimE.id} p=${fimE.p} animando=${fimE.animando}`, ok: !fimE.animando });
    await tecla('ArrowLeft'); await sleep(200); const antE = await estado(); T.push({ oque: '← depois de End', obtido: `cena ${antE.id} p=${antE.p}`, ok: !antE.animando });
    await ir(`${LINK}&passo=${Math.min(2, ULTIMO)}`); await tecla('r'); await sleep(300); const rE = await estado();
    T.push({ oque: 'R reinicia a cena', obtido: `cena ${rE.id} p=${rE.p}`, ok: rE.id === CENA && rE.p === 0 }); if (!(rE.id === CENA && rE.p === 0)) falha('R não reiniciou a cena');
    rel.teclas = T;
    gravar();
  }

  if (MODO === 'tudo' || MODO === 'dom') {
    /* ---- 4. texto e contagens lidos do DOM, contra o roteiro ---- */
    await ir(`${LINK}&passo=${ULTIMO}&parado=1`); await sleep(200);
    const div = [];
    for (const t of ESP.textos || []) {
      const obt = await evJ(`__q(${JSON.stringify(t.seletor)}).map(__t)`), esp = t.textos || [t.texto];
      if (JSON.stringify(obt) !== JSON.stringify(esp)) div.push({ seletor: t.seletor, esperado: esp, obtido: obt });
    }
    for (const c of ESP.contagens || []) { const n = await ev(`__q(${JSON.stringify(c.seletor)}).length`); if (n !== c.n) div.push({ seletor: c.seletor, esperado: c.n, obtido: n }); }
    div.forEach(x => falha(`texto ou contagem: ${x.seletor}: esperado ${JSON.stringify(x.esperado)}, obtido ${JSON.stringify(x.obtido)}`));
    const acento = await evJ(`(() => { const ok = ${JSON.stringify(ESP.acento || [])}; return [...new Set(__q('#palco *').filter(e => !e.closest('svg') && [getComputedStyle(e).color, getComputedStyle(e).backgroundColor, getComputedStyle(e).boxShadow].some(s => s.includes('0, 161, 184')) && !ok.some(s => e.matches(s))).map(e => e.className || e.tagName))]; })()`);
    acento.forEach(x => falha(`ciano fora da lista "acento": ${x}`));
    rel.dom = { textosConferidos: (ESP.textos || []).length, contagensConferidas: (ESP.contagens || []).length, divergencias: div, cianoForaDaLista: acento,
      menorTextoPx: await ev(`Math.min(...__q('#palco *').filter(e => e.children.length === 0 && e.textContent.trim() && !e.closest('svg')).map(e => parseFloat(getComputedStyle(e).fontSize)))`),
      recursosExternos: await ev(`__q('[src],[href]').map(e => e.getAttribute('src') || e.getAttribute('href')).filter(u => /^(https?:)?\\/\\//i.test(u)).length`) };
    if (rel.dom.menorTextoPx < 20) falha(`há texto de ${rel.dom.menorTextoPx} px no palco (mínimo 20)`);
    if (rel.dom.recursosExternos) falha('há recurso externo em src ou href');
    gravar();
  }

  if (MODO === 'tudo' || MODO === 'pdf') {
    /* ---- 5. impressão: uma página por cena do deck ---- */
    await ir(`${LINK}&passo=${Math.min(1, ULTIMO)}`); await sleep(300);
    const cenas = (await estado()).cenas, pdf = await send('Page.printToPDF', { printBackground: true, preferCSSPageSize: true });
    const pb = Buffer.from(pdf.data, 'base64'); fs.writeFileSync(path.join(OUT, 'deck.pdf'), pb);
    const txt = pb.toString('latin1'), pags = (txt.match(/\/Type\s*\/Page(?![s])/g) || []).length;
    rel.pdf = { paginas: pags, cenasNoDeck: cenas, mediaBox: [...new Set(txt.match(/\/MediaBox\s*\[[^\]]*\]/g) || [])].join(' '), estadoDepois: (await estado()).ind };
    if (pags !== cenas) falha(`PDF com ${pags} página(s) para ${cenas} cena(s)`);
  }
  try { await send('Browser.close'); } catch {}
}

main().catch(e => { rel.erros.push('FALHA DO ROTEIRO DE TESTE: ' + e.message); }).finally(() => {
  clearTimeout(teto); gravar();
  const ruim = rel.erros.length + rel.falhas.length;
  console.log(`cena ${CENA} · ${path.basename(DECK)} · relatório: ${path.join(OUT, 'relatorio.json')}`);
  console.log(`erros de JavaScript: ${rel.erros.length}  |  falhas de conferência: ${rel.falhas.length}`);
  rel.erros.concat(rel.falhas).slice(0, 12).forEach(x => console.log('  - ' + String(x).split('\n')[0]));
  setTimeout(() => { matar(); try { fs.rmSync(PERFIL, { recursive: true, force: true }); } catch {} process.exit(ruim ? 1 : 0); }, 800);
});
