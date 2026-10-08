
  /* ================= Parte 3: efeitos próprios da cena e os passos 0 a 3 ================= */
  const some = [{ opacity: 1 }, { opacity: 0 }], surge = [{ opacity: 0 }, { opacity: 1 }];
  const POP = [{ opacity: 0, transform: 'scale(.55)' }, { opacity: 1, transform: 'scale(1.1)', offset: 0.7 }, { opacity: 1, transform: 'scale(1)' }];
  const pisca = v => v.map((o, k) => ({ opacity: o, offset: k / (v.length - 1), easing: 'step-end' }));
  /* anel de luz que se abre a partir de um ponto (camada de efeitos do templo) */
  function anel(ctx, x, y, cor, k) {
    const c = svg('circle', { cx: x, cy: y, r: 20, fill: 'none', stroke: cor, 'stroke-width': 5, class: 'jg-po' }); r.tp.fx.appendChild(c); ctx.temp(c);
    const a = ctx.anim(c, [{ transform: 'scale(.3)', opacity: 0.95 }, { transform: `scale(${k || 4})`, opacity: 0 }], { duration: 560, easing: 'ease-out' });
    if (a) a.onfinish = () => ctx.soltar(c);
  }

  /* ---------- a IA faz o degrau k: os degrauzinhos acendem em ciano, um a um, e as saídas se escrevem e voam para a pilha ----------
     t = quando a faísca parte para o degrau (ms a partir de agora). Devolve o instante em que a última tabuleta pousa */
  const VOO_TAB = 430, PASSO_TAB = 36;
  function rajada(ctx, k, t) {
    const s = ctx.som, tp = r.tp, tar = tp.tarefasK[k - 1], P = pairo(k), js = tabsDe(k);
    tar.forEach((g, q) => {
      const tt = t + 40 + q * (170 / tar.length);
      ctx.anim(g.firstElementChild, [{ fill: r.corTarefa }, { fill: '#fff', offset: 0.4 }, { fill: CIANO }], { duration: 240, delay: tt });
      ctx.anim(g, [{ transform: 'scaleY(1)' }, { transform: 'scaleY(1.45)' }, { transform: 'scaleY(1)' }], { duration: 240, delay: tt, fill: 'none', easing: 'ease-out' });
    });
    ctx.anim(r.luz[k - 1], surge, { duration: 260, delay: t + 60 });
    ctx.anim(tp.flashes[k - 1], [{ opacity: 0, fill: CIANO }, { opacity: 0.34, fill: CIANO }, { opacity: 0, fill: CIANO }], { duration: 520, delay: t + 60, fill: 'none' });
    js.forEach((j, i) => {
      const el = tp.tabs[j], d = t + 170 + i * PASSO_TAB, Q = el._p, sx = P.x + 50 + (i % 3) * 18, sy = P.y - 14 - (i % 4) * 15;
      const aqui = `translate(${sx}px,${sy}px) rotate(0deg) scale(2.4)`, mx = Math.round(sx + (Q.x - sx) * 0.5), my = Math.round(Math.min(sy, Q.y) - 40);
      escrita(j, true);
      /* a tabuleta surge grande ao lado da faísca, a linha se escreve em ciano, e ela voa para o lugar dela na pilha */
      ctx.anim(el, [
        { opacity: 0, transform: `translate(${sx}px,${sy}px) rotate(-8deg) scale(.7)` },
        { opacity: 1, transform: aqui, offset: 0.14 },
        { opacity: 1, transform: aqui, offset: 0.4, easing: 'cubic-bezier(.45,0,.9,.55)' },
        { opacity: 1, transform: `translate(${mx}px,${my}px) rotate(14deg) scale(1.5)`, offset: 0.72, easing: 'cubic-bezier(.2,.4,.6,1)' },
        { opacity: 1, transform: el._fim }], { duration: VOO_TAB, delay: d });
      ctx.anim(r.riscos[j], [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 100, delay: d + VOO_TAB * 0.14, easing: 'ease-out' });
      ctx.em(d + VOO_TAB, () => s.clac({ tom: 1.3 + j * 0.016, ganho: 0.22 }));
    });
    return t + 170 + (js.length - 1) * PASSO_TAB + VOO_TAB;
  }
  /* a pedra desfaz o degrau k: os degrauzinhos apagam e as saídas dele saltam da pilha. Crie só na hora (dentro de ctx.em) */
  function desfazerDegrau(ctx, k) {
    r.tp.tarefasK[k - 1].forEach(g => ctx.anim(g.firstElementChild, [{ fill: CIANO }, { fill: r.corTarefa }], { duration: 200 }));
    ctx.anim(r.luz[k - 1], some, { duration: 200 });
    tabsDe(k).forEach((j, i) => { const el = r.tp.tabs[j], Q = el._p; ctx.anim(el, [{ opacity: 1, transform: el._fim }, { opacity: 0, transform: `translate(${Math.round(Q.x + 26 + i * 9)}px,${Math.round(Q.y - 52)}px) rotate(${40 + i * 25}deg) scale(1)` }], { duration: 380, delay: i * 30, easing: 'ease-out' }); });
  }
  /* "a IA o leva de volta": a faísca dispara na frente, um fio de luz a liga ao herói e ele sobe acelerado de a até b. Crie só na hora */
  function puxar(ctx, a, b, ms) {
    const s = ctx.som, cam = rota(a, b), L = lado(pouso(b));
    const fio = svg('line', { stroke: CIANO, 'stroke-width': 3.2, 'stroke-linecap': 'round', opacity: 0.85 }); r.tp.fx.appendChild(fio); ctx.temp(fio);
    M.voar(ctx, r.ia, cam.map(lado), ms - 70, { estado: 'disparando', curva: E.inOut });
    M.andar(ctx, r.h, cam, ms - 70, { atraso: 70, curva: E.inOut, ganho: 0 });
    ctx.tween(ms, () => { fio.setAttribute('x1', r.h.x + 6); fio.setAttribute('y1', r.h.y - 74); fio.setAttribute('x2', r.ia.x); fio.setAttribute('y2', r.ia.y); }, { fim: () => ctx.soltar(fio) });
    s.chip({ tipo: 'triangle', freq: 330, ate: 1320, dur: ms / 1000, ganho: 0.16 });
    rajada(ctx, b, 30);
    ctx.em(ms, () => { anel(ctx, L.x, L.y, CIANO, 3); s.chip({ freq: 1320, dur: 0.1, ganho: 0.1 }); });
  }

  /* ---------- passo 0: sai da tela "Continuar?" do mundo 1; o HUD reinicia; herói na base; a faísca chega ---------- */
  function tocar0(ctx) {
    const s = ctx.som, tp = r.tp, q = r.q, L = lado(BASE);
    s.ambiente({ vento: 0.45 }, 2.5);
    /* "Continuar?" aceito: a resposta pisca. No instante do corte, só isso muda: o resto do quadro do mundo 1 fica como estava
       (as animações de saída nascem na hora, dentro de ctx.em: criada com atraso, a animação já mexe na nitidez do texto) */
    s.chip({ freq: 660, dur: 0.06, ganho: 0.12 }); s.chip({ t: 0.08, freq: 990, dur: 0.14, ganho: 0.12 });
    ctx.anim(q.cont.el, [{ opacity: 1, transform: 'scale(1)' }, { opacity: 1, transform: 'scale(1.14)', offset: 0.3 }, { opacity: 1, transform: 'scale(1)', offset: 0.55 }, { opacity: 0, transform: 'translateY(22px) scale(1)' }], { duration: 560, easing: 'ease-out' });
    /* a tela de derrota sai */
    ctx.em(180, () => {
      q.manual.sair(ctx); ctx.anim(q.fimq.el, some, { duration: 320 });
      ctx.anim(q.p2, [{ opacity: 1, transform: 'translateY(0px)' }, { opacity: 0, transform: 'translateY(24px)' }], { duration: 300, delay: 60, easing: 'ease-in' });
    });
    /* o mundo reinicia: o título antigo sai, o véu sobe, as lascas e a pilha do mundo 1 somem, o herói derrotado pisca e some */
    ctx.em(300, () => {
      ctx.anim(q.cab.el, [{ opacity: 1, transform: 'translateX(0px)' }, { opacity: 0, transform: 'translateX(-28px)' }], { duration: 380, easing: 'ease-in' });
      ctx.anim(q.museu, [{ opacity: 1, transform: 'translateY(0px) rotate(0deg)' }, { opacity: 0, transform: 'translateY(-90px) rotate(-5deg)' }], { duration: 420, easing: 'ease-in' });
      ctx.anim(tp.veu, [{ opacity: Q01.veu }, { opacity: 0 }], { duration: 900, easing: 'cubic-bezier(.4,0,.3,1)' });
      ctx.anim(tp.rotulos, surge, { duration: 500, delay: 450 });
      q.lascas.forEach((l, i) => ctx.anim(l.el, [{ opacity: 1, transform: `translateY(0px) rotate(${Q01.lascaRot[i]}deg)` }, { opacity: 0, transform: `translateY(46px) rotate(${Q01.lascaRot[i] + 7}deg)` }], { duration: 320, delay: 80 + i * 70, easing: 'ease-in' }));
      tp.tabs.forEach((el, j) => ctx.anim(el, some, { duration: 180, delay: 150 + (tp.tabs.length - 1 - j) * 13 }));
      ctx.anim(r.h.el, pisca([1, 0, 1, 0, 1, 0]), { duration: 420, delay: 120 });
    });
    /* o HUD reinicia: fase 1, os corações voltam um a um, o prazo enche */
    const tV = 820;
    ctx.em(tV - 80, () => r.hud.mudarFase(ctx, 1));
    for (let i = 0; i < VIDAS; i++) ctx.em(tV + i * 105, () => {
      r.hud.definir({ vidas: i + 1 });
      ctx.anim(r.cor[i], [{ transform: 'scale(.4)' }, { transform: 'scale(1.5)' }, { transform: 'scale(1)' }], { duration: 260, fill: 'none', easing: 'ease-out' });
      s.chip({ freq: s.penta(i, 523.25), dur: 0.06, ganho: 0.1 });
    });
    ctx.em(tV + VIDAS * 105 + 60, () => { r.hud.gastarPrazo(ctx, PRAZO[0], 650); s.chip({ tipo: 'triangle', freq: 262, ate: 1047, dur: 0.6, ganho: 0.12 }); });
    r.cab.entrar(ctx, 950);
    /* o herói nasce na base: pisca, um anel de luz, toque de "jogador pronto" */
    const tH = 1600;
    ctx.em(tH - 300, () => r.h.por(BASE.x, BASE.y).estado('parado'));     // ainda invisível
    ctx.em(tH, () => { ctx.anim(r.h.el, pisca([0, 1, 0, 1, 0, 1]), { duration: 560 }); s.pronto(); anel(ctx, BASE.x, BASE.y - 60, '#fff', 5); });
    /* a faísca chega riscando o céu e para ao lado dele */
    const tA = 2400, VOO = 850;
    ctx.anim(r.ia.el, surge, { duration: 100, delay: tA });
    M.voar(ctx, r.ia, [{ x: 1350, y: 140 }, { x: 930, y: 250 }, { x: 430, y: 452 }, { x: L.x + 34, y: L.y - 12 }, L], VOO, { atraso: tA, estado: 'disparando', curva: E.outCubic });
    ctx.em(tA, () => s.gliss({ de: 440, para: 1320, dur: 0.6, ganho: 0.1 }));
    ctx.em(tA + VOO, () => { s.novoJogador(); anel(ctx, L.x, L.y, CIANO, 3.4); r.h.alerta(true); });
    ctx.em(tA + VOO + 250, () => r.hud.entrarJogadores(ctx));
    ctx.em(tA + VOO + 700, () => r.h.alerta(false));
    ctx.em(tA + VOO + 1300, ctx.concluir);
  }

  /* ---------- passo 1: aposta da turma. Nada se move: só a pergunta e as três opções ---------- */
  function tocar1(ctx) {
    const s = ctx.som, d = r.aposta.entrar(ctx, 0);
    s.bipe({ freq: 660, dur: 0.12 });
    [0, 1, 2].forEach(i => ctx.em(380 + i * 140, () => s.bipe({ freq: 880 + i * 110, dur: 0.07, ganho: 0.1 })));
    [0, 1].forEach(i => ctx.em(d + 300 + i * 520, () => s.bipe({ freq: 880, dur: 0.09, ganho: 0.09 })));   // bipe de espera
    ctx.em(d + 300 + 520 + 400, ctx.concluir);
  }

  /* ---------- passo 2: a resposta. A IA dispara pelos degraus 2, 3 e 4; o herói sobe atrás; cartão dos três números ---------- */
  function tocar2(ctx) {
    const s = ctx.som, tp = r.tp, T0 = 750, BATIDA = 400, VOO = 240, P4 = pouso(4);
    r.aposta.el.classList.remove('c02-espera'); r.aposta.revelar(ctx);
    s.bipe({ freq: 1320, dur: 0.14, ganho: 0.13 }); s.bipe({ t: 0.15, freq: 1760, dur: 0.24, ganho: 0.11 });
    /* um degrau por batida: a faísca dispara, as tarefas acendem, as saídas se escrevem; arpejo subindo */
    let de = lado(BASE);
    DISPARO.forEach((k, i) => {
      const t = T0 + i * BATIDA, origem = de;
      M.voar(ctx, r.ia, [origem, pairo(k)], VOO, { atraso: t, estado: 'disparando', aoFim: 'voando' });
      ctx.em(t, () => s.flauta({ freq: s.penta(3 + i * 2, 440), dur: 0.2, ganho: 0.2 }));
      rajada(ctx, k, t);
      de = pairo(k);
    });
    M.voar(ctx, r.ia, [de, lado(P4)], 280, { atraso: T0 + (DISPARO.length - 1) * BATIDA + VOO + 140, estado: 'voando' });
    /* o herói sobe atrás, correndo; o prazo quase não cai */
    const tH = T0 + 150, SOBE = 1450;
    M.andar(ctx, r.h, rota(0, 4), SOBE, { atraso: tH, marcas: tp.marcasDePouso(0, 4, k => r.hud.mudarFase(ctx, k)), ganho: 0.2 });
    r.hud.gastarPrazo(ctx, PRAZO[2], SOBE, tH);
    /* a aposta dá lugar ao cartão dos três números, no mesmo lugar */
    const tC = tH + SOBE + 250;
    ctx.anim(r.aposta.el, [{ opacity: 1, transform: 'translateY(0px)' }, { opacity: 0, transform: 'translateY(-24px)' }], { duration: 300, delay: tC - 300, easing: 'ease-in' });
    const t0 = tC + r.tres.entrar(ctx, tC) + 60;
    r.nums.forEach((el, i) => { ctx.anim(el, POP, { duration: 300, delay: t0 + i * 380, easing: 'ease-out' }); ctx.em(t0 + i * 380, () => s.clac({ tom: 0.9 + i * 0.12, ganho: 0.3 })); });
    r.tres.revelar(ctx, 'rodape', t0 + 3 * 380 + 120);
    ctx.em(t0 + 3 * 380 + 120 + 340 + 900, ctx.concluir);
  }

  /* ---------- passo 3: a IA faz o degrau 5; a pedra cai, desfaz o degrau e derruba o herói; a IA o leva de volta num instante ---------- */
  function tocar3(ctx) {
    const s = ctx.som, tp = r.tp, pedra = r.pedra, G = GOLPE, K = DEGRAU_DA_PEDRA, P4 = pouso(K - 1), P5 = pouso(K);
    r.tres.sair(ctx);
    M.voar(ctx, r.ia, [lado(P4), pairo(K)], 240, { atraso: 150, estado: 'disparando', aoFim: 'voando' });
    ctx.em(150, () => s.flauta({ freq: s.penta(9, 440), dur: 0.2, ganho: 0.2 }));
    rajada(ctx, K, 150);
    M.voar(ctx, r.ia, [pairo(K), lado(P5)], 240, { atraso: 560, estado: 'voando' });
    M.andar(ctx, r.h, rota(K - 1, K), 520, { atraso: 300, marcas: tp.marcasDePouso(K - 1, K, k => r.hud.mudarFase(ctx, k)), ganho: 0.2 });
    /* a pedra chega pela direita e fica parada, com o texto inteiro, pelo tempo de leitura */
    const tE = 520, tL = tE + pedra.chegar(ctx, 'desliza', tE), tG = tL + 1750, tI = tG + G.ms;
    ctx.em(tE, () => s.gliss({ de: 980, para: 520, dur: 0.3, ganho: 0.1 }));
    ctx.em(tL + 60, () => r.h.alerta(true));
    let bob = null; ctx.em(tL, () => { bob = pedra.flutuar(ctx); });
    M.voar(ctx, r.ia, [lado(P5), IA_ESQUIVA], 260, { atraso: tG - 320, estado: 'voando' });   // a faísca sai da frente
    ctx.em(tG, () => { if (bob) bob.cancel(); pedra.golpear(ctx, G); });
    ctx.em(tI, () => {
      const ix = P5.x + 6, iy = P5.y - 62;
      s.pedra({ ganho: 0.85 }); tp.tremor(ctx, 7, 300);
      tp.poeira(ctx, ix, iy + 44, 10, 1.3); tp.estilhacos(ctx, ix + 16, iy - 8, 9);
      pedra.desfazer(ctx, G);
      r.h.alerta(false).estado('atingido');                                // quadro parado: dá peso à pancada
      desfazerDegrau(ctx, K);
      ctx.em(r.lasca.cravar(ctx, ix, iy), () => { s.clac({ tom: 0.7, ganho: 0.5 }); tp.poeira(ctx, LASCA.x + 12, LASCA.y + 24, 5, 0.8); });
      ctx.em(120, () => { r.hud.perderVida(ctx); s.vida(); });
      r.hud.gastarPrazo(ctx, PRAZO[3] + 0.01, 400, 150);
      /* volta um degrau só */
      const ROLA = 680, LEVANTA = 440;
      ctx.em(130, () => M.rolar(ctx, r.h, rota(K, K - 1), ROLA, { voltas: 1, quique: 9, saltos: 2, curva: E.outQuad,
        fim: () => { r.hud.mudarFase(ctx, K - 1); r.h.por(P4.x, P4.y).estado('agachado'); M.levantar(ctx, r.h, 120, LEVANTA - 120); r.h.piscar(ctx, 440, 60); } }));   // para de piscar antes de ser puxado
      /* a faísca mergulha até ele e o leva de volta */
      M.voar(ctx, r.ia, [IA_ESQUIVA, lado(P4)], 320, { atraso: 430, estado: 'disparando' });
      const tP = 130 + ROLA + LEVANTA + 120, PUXA = 420;
      ctx.em(tP, () => { puxar(ctx, K - 1, K, PUXA); r.hud.gastarPrazo(ctx, PRAZO[3], PUXA); });
      ctx.em(tP + PUXA, () => r.hud.mudarFase(ctx, K));
      r.frase3.entrar(ctx, tP + PUXA + 180);
      ctx.em(tP + PUXA + 180 + 520 + 1000, ctx.concluir);
    });
  }
