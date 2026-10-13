/* ================================================================
   MOTOR · registro de cenas, passos, teclas, toque, link direto, impressão.

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
  const est = { c: 0, p: -1, animando: false, parado: false, montada: false, imprimindo: false, toque: false };
  let quadro, palco, ind, notas, imp, exec = null, cortina = null, tq = null;
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
    if (est.toque) dicasDeToque(palco);
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
    if (tq) {
      tq.som.textContent = Som.mudo ? 'Ligar o som' : 'Tirar o som';
      if (tq.cheia) tq.cheia.textContent = emTelaCheia() ? 'Sair da tela cheia' : 'Tela cheia';
      tq.mundos.forEach((b, i) => b.setAttribute('aria-current', i === est.c ? 'true' : 'false'));
    }
  }
  const esc = s => String(s).replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m]));
  function preencherNotas() {
    const c = cenas[est.c], n = c.notas || {}, passo = c.passos[Math.max(est.p, 0)];
    notas.innerHTML = `<h2>Cena ${numDaCena(est.c)} · passo ${Math.max(est.p, 0)} de ${c.passos.length - 1}</h2>` +
      `<p class="tit">${esc(c.titulo || c.id)}</p>` + (passo && passo.nome ? `<p>Agora: ${esc(passo.nome)}</p>` : '') +
      (n.fala ? `<h3>Fala</h3><p>${esc(n.fala)}</p>` : '') +
      (n.interacao ? `<h3>Interação com a turma</h3><p>${esc(n.interacao)}</p>` : '') +
      (n.rastreio && n.rastreio.length ? `<h3>Rastreio</h3><ul>${n.rastreio.map(r => `<li>${esc(r)}</li>`).join('')}</ul>` : '') +
      (est.toque
        ? `<p class="teclas">Toque à direita: avança (ou pula a animação) · toque na borda esquerda: volta · arrastar para os lados também vale · o botão do canto abre o menu</p>`
        : `<p class="teclas">→ ou Espaço: avança (ou pula a animação) · ←: volta · R: reinicia a cena · M: som · F: tela cheia · N: notas</p>`);
  }
  function alternarNotas() { if (notas.classList.toggle('aberto')) preencherNotas(); }
  /* ---------- tela cheia: tecla F, botão do canto (computador e toque) e item do menu ----------
     Funciona em computador, Android e iPad. O iPhone não tem a função no navegador: lá o botão explica o caminho
     pela Tela de Início. Aberto pela Tela de Início o deck já vem sem as barras, e o botão nem aparece. */
  const raiz = document.documentElement;
  const tcPedir = raiz.requestFullscreen || raiz.webkitRequestFullscreen;
  const tcSair = document.exitFullscreen || document.webkitExitFullscreen;
  const emTelaCheia = () => !!(document.fullscreenElement || document.webkitFullscreenElement);
  const emAppInstalado = () => navigator.standalone === true || !!(window.matchMedia && (matchMedia('(display-mode: standalone)').matches || matchMedia('(display-mode: fullscreen)').matches));
  let tc = null, tcAviso = null, tcSome = 0, tcAvisoSome = 0;
  function telaCheia() {
    if (emTelaCheia()) { try { const r = tcSair.call(document); if (r && r.catch) r.catch(() => {}); } catch (e) {} return; }
    if (!tcPedir) { avisarTelaCheia(); return; }
    /* no celular, a tela cheia já pede o aparelho deitado, onde o palco fica maior (nem todo navegador deixa travar) */
    const deitar = () => { try { if (est.toque && screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(() => {}); } catch (e) {} };
    try { const r = tcPedir.call(raiz); if (r && r.then) r.then(deitar).catch(() => {}); else deitar(); } catch (e) {}
  }
  function avisarTelaCheia() {
    if (!tcAviso) return;
    tcAviso.classList.add('visivel'); clearTimeout(tcAvisoSome);
    tcAvisoSome = setTimeout(() => tcAviso.classList.remove('visivel'), 9000);
  }
  function aoMudarTelaCheia() {
    const cheia = emTelaCheia();
    raiz.classList.toggle('cheia', cheia);
    if (tc) { const t = cheia ? 'Sair da tela cheia' : 'Tela cheia'; tc.setAttribute('aria-label', t); tc.title = t + ' (F)'; }
    if (!cheia) { try { if (screen.orientation && screen.orientation.unlock) screen.orientation.unlock(); } catch (e) {} }
    ajustar(); if (est.montada) atualizarUI();
  }
  function criarTelaCheia() {
    if (emAppInstalado()) return;
    tc = util.html('<button id="tc" class="no-print" type="button" aria-label="Tela cheia" title="Tela cheia (F)"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path class="entra" d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"/><path class="sai" d="M9 4v5H4M20 9h-5V4M15 20v-5h5M4 15h5v5"/></svg></button>');
    tcAviso = util.html('<div id="tc-aviso" class="no-print" role="status">Neste aparelho o navegador não tem tela cheia. Para ver sem as barras, toque em <b>Compartilhar</b> e em <b>Adicionar à Tela de Início</b>, e abra por lá.</div>');
    document.body.append(tc, tcAviso);
    tc.addEventListener('click', () => { if (performance.now() - toqueUI > 700) telaCheia(); });     // o toque é atendido em aoSoltar()
    /* no computador o botão só aparece enquanto o mouse se mexe, como em player de vídeo */
    addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      raiz.classList.add('mexeu'); clearTimeout(tcSome);
      tcSome = setTimeout(() => raiz.classList.remove('mexeu'), 2500);
    });
    ['fullscreenchange', 'webkitfullscreenchange'].forEach(t => document.addEventListener(t, aoMudarTelaCheia));
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

  /* ---------- tela de toque: celular e tablet ----------
     No computador nada muda: o mouse não navega e os controles não existem. O modo liga sozinho em aparelho de toque
     (ou no primeiro toque) e acrescenta: toque à direita avança, toque na borda esquerda volta, arrastar para os lados
     faz o mesmo, e um botão no canto abre o menu (mundos, som, reiniciar, notas, tela cheia). */
  const BORDA_VOLTA = 1 / 3;                       // fração da largura, a partir da esquerda, em que o toque volta
  function dicasDeToque(raiz) { raiz.querySelectorAll('[data-toque]').forEach(el => { el.textContent = el.dataset.toque; }); }
  function abrirPainel(v) { tq.painel.classList.toggle('aberto', v); tq.menu.setAttribute('aria-expanded', v ? 'true' : 'false'); }
  function esconderDica() { if (tq) tq.dica.classList.remove('visivel'); }
  function criarToque() {
    const h = util.html;
    const menu = h('<button id="tq-menu" class="no-print" type="button" aria-label="Menu" aria-expanded="false"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg></button>');
    const painel = h(`<div id="tq-painel" class="no-print">
      <div class="tq-l"><button type="button" data-a="voltar">Voltar</button><button type="button" data-a="avancar">Avançar</button></div>
      <div class="tq-r">Mundos</div>
      <div class="tq-l">${cenas.map((c, i) => `<button type="button" data-c="${i}" aria-label="Mundo ${numDaCena(i)}">${numDaCena(i)}</button>`).join('')}</div>
      <div class="tq-l"><button type="button" data-a="som"></button><button type="button" data-a="reiniciar">Reiniciar cena</button></div>
      <div class="tq-l"><button type="button" data-a="notas">Notas</button>${emAppInstalado() ? '' : '<button type="button" data-a="cheia">Tela cheia</button>'}<button type="button" data-a="fechar">Fechar</button></div></div>`);
    const dica = h('<div id="tq-dica" class="no-print">Toque à direita para avançar · na borda esquerda para voltar</div>');
    const girar = h('<div id="tq-girar" class="no-print">Gire o aparelho para ver maior</div>');
    document.body.append(menu, painel, dica, girar);
    tq = { menu, painel, dica, som: painel.querySelector('[data-a="som"]'), cheia: painel.querySelector('[data-a="cheia"]'), mundos: Array.from(painel.querySelectorAll('[data-c]')) };
    /* o toque nos controles é resolvido em aoSoltar(), sem depender do clique que o navegador sintetiza (ele some depois
       de um arrastar rápido). O clique fica para teclado e mouse, e é ignorado logo depois de um toque já atendido */
    const semToqueRecente = () => performance.now() - toqueUI > 700;
    menu.addEventListener('click', () => { if (semToqueRecente()) abrirPainel(!painel.classList.contains('aberto')); });
    painel.addEventListener('click', e => { const b = e.target.closest('button'); if (b && semToqueRecente()) acaoDoPainel(b); });
    dica.classList.add('visivel'); setTimeout(esconderDica, 7000);
  }
  function acaoDoPainel(b) {
    Som.destravar();
    if (b.dataset.c != null) { abrirPainel(false); entrarCena(+b.dataset.c); return; }
    const acoes = {
      voltar, avancar,
      som: () => { Som.alternarMudo(); atualizarUI(); },
      reiniciar: () => { abrirPainel(false); entrarCena(est.c); },
      notas: () => { abrirPainel(false); alternarNotas(); },
      cheia: () => { abrirPainel(false); telaCheia(); },
      fechar: () => abrirPainel(false)
    };
    if (acoes[b.dataset.a]) acoes[b.dataset.a]();
  }
  function modoToque() {
    if (est.toque) return;
    est.toque = true; document.documentElement.classList.add('toque');
    criarToque(); if (palco) dicasDeToque(palco); atualizarUI();
  }
  let toqueIni = null, dedos = 0, toqueUI = -1e9;
  function aoBaixar(e) {
    Som.destravar();
    if (e.pointerType === 'mouse') return;
    modoToque(); dedos++;
    const alvo = e.target && e.target.closest ? e.target : null;
    toqueIni = dedos === 1 ? {
      id: e.pointerId, x: e.clientX, y: e.clientY, t: performance.now(),
      ui: alvo ? alvo.closest('#tq-menu,#tq-painel,#tc,#tc-aviso,#notas') : null,         // começou nos controles ou nas notas: não navega
      botao: alvo ? alvo.closest('#tq-menu,#tc,#tq-painel button') : null
    } : null;
  }
  function aoSoltar(e) {
    Som.destravar();
    if (e.pointerType === 'mouse') return;
    dedos = Math.max(0, dedos - 1);
    const i = toqueIni; if (!i || i.id !== e.pointerId) return;
    toqueIni = null;
    const dx = e.clientX - i.x, dy = e.clientY - i.y;
    const batida = Math.abs(dx) < 14 && Math.abs(dy) < 14 && performance.now() - i.t < 700;
    if (i.ui) {
      if (tcAviso && tcAviso.contains(i.ui)) tcAviso.classList.remove('visivel');          // tocar no aviso fecha o aviso
      if (i.botao && batida) {
        toqueUI = performance.now();
        if (i.botao.id === 'tq-menu') abrirPainel(!tq.painel.classList.contains('aberto'));
        else if (i.botao.id === 'tc') { abrirPainel(false); telaCheia(); }
        else acaoDoPainel(i.botao);
      }
      return;
    }
    if (tq.painel.classList.contains('aberto')) { abrirPainel(false); return; }           // toque fora do menu só fecha o menu
    const noComeco = est.c === 0 && est.p <= 0;                                           // na tela de título, qualquer toque começa
    if (Math.abs(dx) > 48 && Math.abs(dx) > 1.5 * Math.abs(dy)) (dx < 0 || noComeco ? avancar : voltar)();   // arrastar
    else if (batida) (e.clientX < innerWidth * BORDA_VOLTA && !noComeco ? voltar : avancar)();
    else return;
    esconderDica();
  }
  function aoCancelar(e) { if (e.pointerType !== 'mouse') { dedos = Math.max(0, dedos - 1); toqueIni = null; } }

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
    ajustar(); addEventListener('resize', ajustar); addEventListener('orientationchange', () => setTimeout(ajustar, 250));
    if (window.visualViewport) visualViewport.addEventListener('resize', ajustar);
    addEventListener('keydown', tecla);
    addEventListener('pointerdown', aoBaixar); addEventListener('pointerup', aoSoltar); addEventListener('pointercancel', aoCancelar);
    ['touchend', 'click'].forEach(t => addEventListener(t, () => Som.destravar()));       // no iOS o áudio só destrava ao soltar o dedo
    if (!est.parado) criarTelaCheia();
    if (window.matchMedia && matchMedia('(hover: none) and (pointer: coarse)').matches) modoToque();
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
