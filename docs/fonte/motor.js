/* ================================================================
   MOTOR · registro de cenas, passos, teclas, link direto, impressão.

   Contrato de uma cena (objeto passado a Deck.registrar):
     id, titulo        identificação
     entrada           opcional. 'seca' = sem cortina ao entrar vindo da cena anterior (para a cena que
                       redesenha o último quadro da anterior e o desfaz no próprio passo 0)
     notas             { fala: '...', interacao: '...', rastreio: ['...', ...] }   (tecla N)
     montar(palco)     constrói o DOM dentro de `palco` no estado ANTES do passo 0
     desmontar()       solta referências (o motor esvazia o palco)
     passos[]          cada passo: { nome, ambiente?, tocar(ctx), fim() }
        tocar(ctx)     anima a partir do estado final do passo anterior e chama
                       ctx.concluir() ao terminar. Só agenda coisas pelo ctx
                       (ctx.em, ctx.anim, ctx.tween, ctx.temp), para tudo ser cancelável.
        fim()          aplica o estado final do passo, na hora, sem som. Idempotente.
        ambiente       som contínuo ao FIM do passo, ex.: { vento: 0.6 }. Herdado
                       pelos passos seguintes até alguém redefinir.
   Ir para o passo N = remontar a cena + fim() dos passos 0..N.
   ================================================================ */
const Deck = (() => {
  const W = 1280, H = 720;
  const cenas = [];
  const est = { c: 0, p: -1, animando: false, parado: false, montada: false, imprimindo: false };
  let quadro, palco, ind, notas, imp, exec = null, cortina = null;
  const CORTINA_MS = 700;

  function registrar(cena) { cenas.push(cena); return cena; }

  /* ---------- utilitários para as cenas ---------- */
  const util = {
    /* gerador pseudoaleatório com semente: o desenho sai igual em toda montagem */
    rng(semente) { let a = semente >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; },
    svg(nome, attrs) { const el = document.createElementNS('http://www.w3.org/2000/svg', nome); if (attrs) for (const k in attrs) el.setAttribute(k, attrs[k]); return el; },
    html(marcacao) { const t = document.createElement('template'); t.innerHTML = marcacao.trim(); return t.content.firstElementChild; },
    E: {
      lin: x => x, inQuad: x => x * x, outQuad: x => 1 - (1 - x) * (1 - x), inCubic: x => x * x * x, outCubic: x => 1 - Math.pow(1 - x, 3),
      inOut: x => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2, outBack: x => 1 + 2.70158 * Math.pow(x - 1, 3) + 1.70158 * Math.pow(x - 1, 2)
    }
  };

  /* ---------- execução de um passo: tudo nasce aqui e morre em encerrar() ---------- */
  function criarExec(aoConcluir) {
    const timers = new Set(), anims = new Set(), tweens = new Set(), temps = new Set();
    let viva = true;
    const ctx = {
      get viva() { return viva; },
      som: Som,
      /* temporizador cancelável */
      em(ms, fn) { const id = setTimeout(() => { timers.delete(id); if (viva) fn(); }, Math.max(0, ms)); timers.add(id); return id; },
      /* Web Animations; fill 'both' por padrão, cancelada no fim do passo (o estado final é o de fim()) */
      anim(el, quadros, op) {
        if (!el || !viva) return null;
        const o = typeof op === 'number' ? { duration: op } : Object.assign({}, op);
        if (o.fill == null) o.fill = 'both';
        const a = el.animate(quadros, o); anims.add(a); return a;
      },
      /* interpolação por quadro: fn(valorComCurva, progresso) */
      tween(dur, fn, op) {
        op = op || {}; const curva = op.curva || util.E.lin, tw = { id: 0 }, t0 = performance.now() + (op.atraso || 0);
        const tique = agora => {
          if (!viva) return;
          const p = (agora - t0) / dur;
          if (p >= 1) { fn(curva(1), 1); tweens.delete(tw); if (op.fim) op.fim(); return; }
          if (p >= 0) fn(curva(p), p);
          tw.id = requestAnimationFrame(tique);
        };
        tw.id = requestAnimationFrame(tique); tweens.add(tw); return tw;
      },
      /* elemento transitório (poeira, pedra que cai): removido no fim do passo */
      temp(el) { temps.add(el); return el; },
      soltar(el) { temps.delete(el); if (el) el.remove(); },
      /* tremor curto de um elemento (o "mundo" da cena, não o texto) */
      tremor(el, px, ms) {
        px = px || 6; const n = 7, q = [{ transform: 'translate(0px,0px)' }];
        for (let i = 1; i < n; i++) { const k = 1 - i / n, s = i % 2 ? 1 : -1; q.push({ transform: `translate(${(s * px * k * (0.55 + 0.45 * Math.random())).toFixed(1)}px,${(-s * px * k * 0.8).toFixed(1)}px)` }); }
        q.push({ transform: 'translate(0px,0px)' });
        return ctx.anim(el, q, { duration: ms || 240, easing: 'linear', fill: 'none' });
      },
      concluir() { if (viva) aoConcluir(); },
      encerrar() {
        viva = false;
        timers.forEach(clearTimeout); timers.clear();
        tweens.forEach(t => cancelAnimationFrame(t.id)); tweens.clear();
        anims.forEach(a => { try { a.cancel(); } catch (e) {} }); anims.clear();
        temps.forEach(el => el.remove()); temps.clear();
      }
    };
    return ctx;
  }
  function pararExec() { if (exec) { exec.encerrar(); exec = null; } est.animando = false; }

  /* ---------- montagem e navegação ---------- */
  /* cortina: ao avançar de uma cena para a seguinte, o último quadro da cena que sai fica por cima da que entra
     e se desfaz em CORTINA_MS. O palco velho vira a cortina sem ser movido no DOM (as animações de fundo não recomeçam). */
  function soltarCortina() { if (cortina) { cortina.remove(); cortina = null; } }
  function montar(i, comCortina) {
    soltarCortina();
    if (est.montada) { try { cenas[est.c].desmontar(); } catch (e) {} }
    if (comCortina && cenas[i].entrada !== 'seca' && est.montada && !est.parado && palco.firstChild) {
      const c = cortina = palco; c.removeAttribute('id'); c.classList.add('cortina');
      palco = document.createElement('div'); palco.id = 'palco'; palco.className = 'palco';
      quadro.insertBefore(palco, c);
      c.animate([{ opacity: 1 }, { opacity: 0 }], { duration: CORTINA_MS, easing: 'ease-in-out', fill: 'forwards' }).onfinish = () => { c.remove(); if (cortina === c) cortina = null; };
    } else palco.replaceChildren();
    est.c = i; est.p = -1; est.montada = true;
    cenas[i].montar(palco);
  }
  /* ?cena=02 acha pelo id; ?cena=2 acha a cena de id numérico 2; sem id que sirva, vale a posição no build */
  function acharCena(v) {
    if (v == null || v === '') return 0;
    let i = cenas.findIndex(c => String(c.id) === v);
    if (i < 0 && /^\d+$/.test(v)) i = cenas.findIndex(c => /^\d+$/.test(String(c.id)) && parseInt(c.id, 10) === parseInt(v, 10));
    if (i < 0 && /^\d+$/.test(v)) i = parseInt(v, 10) - 1;
    return Math.max(0, Math.min(cenas.length - 1, i));
  }
  /* número mostrado no indicador: o do id ('02' -> 2), para não mudar conforme o build */
  const numDaCena = i => /^\d+$/.test(String(cenas[i].id)) ? parseInt(cenas[i].id, 10) : i + 1;
  function ambienteDe(c, p) {
    for (let k = p; k >= 0; k--) { const a = cenas[c].passos[k].ambiente; if (a) return a; }
    return {};
  }
  /* estado final do passo p da cena c, sem animação e sem som de passo */
  function irPara(c, p) {
    c = Math.max(0, Math.min(cenas.length - 1, c));
    p = Math.max(0, Math.min(cenas[c].passos.length - 1, p));
    pararExec(); Som.cortar();
    montar(c);
    for (let k = 0; k <= p; k++) cenas[c].passos[k].fim();
    est.p = p;
    Som.ambiente(ambienteDe(c, p), 0.6);
    atualizarUI();
  }
  /* toca o passo p; pressupõe o estado final do passo p-1 */
  function tocar(p) {
    const passo = cenas[est.c].passos[p];
    pararExec(); Som.cortar();
    est.p = p; est.animando = true;
    const minha = exec = criarExec(() => {
      if (exec !== minha) return;
      passo.fim();                      // fixa o estado final em estilo inline...
      minha.encerrar(); exec = null;    // ...e só então solta as animações
      est.animando = false;
      Som.ambiente(ambienteDe(est.c, p), 1.5);
      atualizarUI();
    });
    atualizarUI();
    try { passo.tocar(minha); } catch (erro) { console.error(erro); irPara(est.c, p); }
  }
  function entrarCena(i, comCortina) {
    pararExec(); Som.cortar(); montar(i, comCortina);
    if (est.parado) irPara(i, 0); else tocar(0);
  }
  function avancar() {
    if (est.animando) { irPara(est.c, est.p); return; }          // pula para o fim do passo atual
    const n = cenas[est.c].passos.length;
    if (est.p < n - 1) { if (est.parado) irPara(est.c, est.p + 1); else tocar(est.p + 1); }
    else if (est.c < cenas.length - 1) entrarCena(est.c + 1, true);
    else piscar();
  }
  function voltar() {
    if (est.p > 0) irPara(est.c, est.p - 1);
    else if (est.c > 0) irPara(est.c - 1, cenas[est.c - 1].passos.length - 1);
    else irPara(0, 0);
  }
  function piscar() { ind.animate([{ opacity: 1 }, { opacity: .55 }], { duration: 500 }); }

  /* ---------- interface do apresentador ---------- */
  function atualizarUI() {
    const c = cenas[est.c];
    ind.innerHTML = `${numDaCena(est.c)} · ${Math.max(est.p, 0)}/${c.passos.length - 1}` + (Som.mudo ? '<span class="mudo">mudo</span>' : '');
    if (notas.classList.contains('aberto')) preencherNotas();
  }
  const esc = s => String(s).replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m]));
  function preencherNotas() {
    const c = cenas[est.c], n = c.notas || {}, passo = c.passos[Math.max(est.p, 0)];
    notas.innerHTML = `<h2>Cena ${numDaCena(est.c)} · passo ${Math.max(est.p, 0)} de ${c.passos.length - 1}</h2>` +
      `<p class="tit">${esc(c.titulo || c.id)}</p>` + (passo && passo.nome ? `<p>Agora: ${esc(passo.nome)}</p>` : '') +
      (n.fala ? `<h3>Fala</h3><p>${esc(n.fala)}</p>` : '') +
      (n.interacao ? `<h3>Interação com a turma</h3><p>${esc(n.interacao)}</p>` : '') +
      (n.rastreio && n.rastreio.length ? `<h3>Rastreio</h3><ul>${n.rastreio.map(r => `<li>${esc(r)}</li>`).join('')}</ul>` : '') +
      `<p class="teclas">→ ou Espaço: avança (ou pula a animação) · ←: volta · R: reinicia a cena · M: som · F: tela cheia · N: notas</p>`;
  }
  function alternarNotas() { if (notas.classList.toggle('aberto')) preencherNotas(); }
  function telaCheia() {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => {});
  }
  let escalaAnt = 0;
  function ajustar() {
    const s = Math.min(innerWidth / W, innerHeight / H);
    if (escalaAnt && Math.abs(s - escalaAnt) > 0.001) { quadro.style.display = 'none'; void quadro.offsetHeight; quadro.style.display = ''; }
    escalaAnt = s;
    quadro.style.transform = `translate(${Math.max(0, (innerWidth - W * s) / 2).toFixed(2)}px,${Math.max(0, (innerHeight - H * s) / 2).toFixed(2)}px) scale(${s.toFixed(5)})`;
  }
  function tecla(e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    const mapa = {
      'ArrowRight': avancar, ' ': avancar, 'Spacebar': avancar, 'PageDown': avancar, 'Enter': avancar,
      'ArrowLeft': voltar, 'PageUp': voltar,
      'r': () => entrarCena(est.c),
      'm': () => { Som.alternarMudo(); atualizarUI(); },
      'f': telaCheia, 'n': alternarNotas,
      'Home': () => entrarCena(0),
      'End': () => irPara(cenas.length - 1, 1e9)
    };
    if (/^[1-9]$/.test(k)) {                // ensaio: o número vai direto para a cena de mesmo id
      const i = cenas.findIndex(c => /^\d+$/.test(String(c.id)) && parseInt(c.id, 10) === +k);
      if (i >= 0 && !e.repeat) { e.preventDefault(); Som.destravar(); entrarCena(i); }
      return;
    }
    if (!mapa[k]) return;
    e.preventDefault();
    if (e.repeat) return;                 // tecla presa não atropela os passos
    Som.destravar();                      // política de autoplay: o áudio nasce aqui
    mapa[k]();
  }

  /* ---------- impressão: uma página por cena, estado final do último passo ---------- */
  let antes = null;
  function prepararImpressao() {
    if (est.imprimindo) return;
    est.imprimindo = true; antes = { c: est.c, p: Math.max(est.p, 0), parado: est.parado };
    pararExec(); Som.cortar();
    if (est.montada) { try { cenas[est.c].desmontar(); } catch (e) {} est.montada = false; }
    soltarCortina(); palco.replaceChildren(); imp.replaceChildren();
    document.documentElement.classList.add('imprimindo', 'parado');
    cenas.forEach(c => {
      const pg = document.createElement('div'); pg.className = 'pagina palco'; imp.appendChild(pg);
      c.montar(pg); c.passos.forEach(p => p.fim());
    });
  }
  function desfazerImpressao() {
    if (!est.imprimindo) return;
    cenas.forEach(c => { try { c.desmontar(); } catch (e) {} });
    imp.replaceChildren(); est.imprimindo = false;
    document.documentElement.classList.remove('imprimindo');
    if (!antes.parado) document.documentElement.classList.remove('parado');
    irPara(antes.c, antes.p);
  }

  /* ---------- partida ---------- */
  function iniciar() {
    quadro = document.getElementById('quadro'); palco = document.getElementById('palco');
    ind = document.getElementById('ind'); notas = document.getElementById('notas'); imp = document.getElementById('imp');
    const q = new URLSearchParams(location.search);
    if (q.has('oficina') || q.get('heroi') === '1') {                     // oficina: folhas dos componentes, sem cena
      ajustar(); addEventListener('resize', ajustar); document.documentElement.classList.add('parado');
      Oficina.abrir(palco, q.get('heroi') === '1' ? 'heroi' : q.get('oficina')); return;
    }
    if (!cenas.length) { palco.textContent = 'Nenhuma cena registrada.'; return; }
    const num = (nome, padrao) => { const v = parseInt(q.get(nome), 10); return Number.isFinite(v) ? v : padrao; };
    est.parado = q.get('parado') === '1';
    if (est.parado) { document.documentElement.classList.add('parado'); Som.travar(); }
    const c = acharCena(q.get('cena'));
    ajustar(); addEventListener('resize', ajustar);
    addEventListener('keydown', tecla);
    addEventListener('pointerdown', () => Som.destravar());
    addEventListener('beforeprint', prepararImpressao);
    addEventListener('afterprint', desfazerImpressao);
    const p0 = num('passo', 0);
    if (q.get('tocar') === '1' && !est.parado) {          // ensaio: parte do estado final do passo anterior e toca o passo pedido
      if (p0 > 0) { irPara(c, p0 - 1); tocar(Math.min(p0, cenas[c].passos.length - 1)); } else entrarCena(c);
    } else if (q.has('passo') || est.parado) irPara(c, p0); else entrarCena(c);
    if (q.get('imprimir') === '1') prepararImpressao();
  }
  return { registrar, iniciar, util, W, H, get estado() { return Object.assign({ cenas: cenas.length, id: cenas[est.c] ? String(cenas[est.c].id) : null, passos: cenas[est.c] ? cenas[est.c].passos.length : 0 }, est); } };
})();
