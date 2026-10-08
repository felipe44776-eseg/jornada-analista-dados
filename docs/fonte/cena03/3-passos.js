
  /* ================= Parte 3: os passos ================= */
  const some = [{ opacity: 1 }, { opacity: 0 }], surge = [{ opacity: 0 }, { opacity: 1 }];
  const n1 = v => Math.round(v * 10) / 10;
  const pisca = vals => vals.map((v, k) => ({ opacity: v, offset: k / (vals.length - 1), easing: 'step-end' }));
  /* na beira do topo: o corpo vai para trás, sobre o vazio, e volta */
  const POSE_BEIRA_TRAS = { cA: 14, kA: 4, cB: -4, kB: 6, br: 140, ab: 20, bf: 76, tr: -24, cb: -14, olho: 'x' };
  const POSE_BEIRA_FRENTE = { cA: 22, kA: 18, cB: -10, kB: 14, br: -44, ab: 30, bf: 44, tr: 18, cb: 8 };

  /* pulinho no lugar (virar-se, levar um susto) */
  function salto(ctx, x, alt, ms, virado) { ctx.tween(ms, e => heroiEm(x, TY - 4 * alt * e * (1 - e), virado), { fim: () => heroiEm(x, TY, virado) }); }
  /* anel de luz que abre e some */
  function clarao(ctx, x, y, raio, ms) {
    const c = svg('circle', { cx: x, cy: y, r: raio, fill: 'none', stroke: '#fff', 'stroke-width': 6, class: 'c03-fx' });
    r.tp.fx.appendChild(c); ctx.temp(c);
    const a = ctx.anim(c, [{ transform: 'scale(.35)', opacity: 1 }, { transform: 'scale(2.4)', opacity: 0 }], { duration: ms || 420, easing: 'ease-out' });
    if (a) a.onfinish = () => ctx.soltar(c);
  }
  /* brilhos em volta do presente fechado, nos baús que abrem direto: até abrir, é um presente */
  function brilhos(ctx, t0, n) {
    const P = [[-52, -74], [50, -86], [58, -30], [-58, -24], [4, -100], [-30, -96]];
    for (let k = 0; k < n; k++) ctx.em(t0 + k * 330, () => {
      const [dx, dy] = P[k % P.length];
      const g = svg('path', { d: 'M0,-11 L2.6,-2.6 L11,0 L2.6,2.6 L0,11 L-2.6,2.6 L-11,0 L-2.6,-2.6 Z', fill: '#fff', stroke: '#00010F', 'stroke-width': 1 });
      r.tp.fx.appendChild(g); ctx.temp(g);
      const p = `translate(${BAU.x + dx}px,${BAU.y + dy}px)`;
      const a = ctx.anim(g, [{ opacity: 0, transform: `${p} scale(.2) rotate(0deg)` }, { opacity: 1, transform: `${p} scale(1) rotate(40deg)`, offset: 0.45 }, { opacity: 0, transform: `${p} scale(.2) rotate(90deg)` }], { duration: 620, easing: 'ease-in-out' });
      if (a) a.onfinish = () => ctx.soltar(g);
    });
  }

  /* ---------- passo 0: o prêmio era falso; a noite cai ---------- */
  /* silhueta aproximada da taça (escala 1, base em 0,0), para os pedaços nascerem com a forma dela */
  function naTaca(x, y) {
    const ax = Math.abs(x);
    if (y < -102 || y > 0) return false;
    if (y <= -64) return ax <= 31 || (ax >= 36 && ax <= 50 && y >= -94);
    if (y <= -40) return ax <= 27 * Math.sqrt(Math.max(0, 1 - Math.pow((y + 64) / 26, 2))) + 2;
    if (y <= -19) return ax <= 6;
    return ax <= (y <= -9 ? 21 : 30);
  }
  function desfazerPremio(ctx) {
    const tp = r.tp, s = ctx.som, rnd = rng(303), k = PREMIO.escala, C = 9;
    ctx.anim(r.premio.el, pisca([1, 0.25, 0.9, 0]), { duration: 240 });
    for (let y = -100; y < 0; y += C) for (let x = -50; x < 50; x += C) {
      if (!naTaca(x + C / 2, y + C / 2)) continue;
      const q = svg('rect', { x: n1(PREMIO.x + x * k), y: n1(PREMIO.y + y * k), width: n1(C * k - 1), height: n1(C * k - 1), fill: rnd() < 0.3 ? '#A9AADC' : rnd() < 0.5 ? '#E3E2FD' : '#F6F6FF', class: 'c03-fx' });
      tp.fx.appendChild(q); ctx.temp(q);
      const espera = 120 + (1 - y / -100) * 60 + rnd() * 420, dx = (rnd() - 0.5) * 70, cai = -y * k + 6 + rnd() * 26, gira = (rnd() - 0.5) * 240;
      const a = ctx.anim(q, [{ opacity: 1, transform: 'translate(0px,0px) rotate(0deg)', easing: 'cubic-bezier(.55,0,1,.6)' }, { opacity: 0.9, transform: `translate(${n1(dx)}px,${n1(cai)}px) rotate(${n1(gira)}deg)`, offset: 0.75 }, { opacity: 0, transform: `translate(${n1(dx * 1.2)}px,${n1(cai + 4)}px) rotate(${n1(gira)}deg)` }],
        { duration: 520 + rnd() * 380, delay: espera });
      if (a) a.onfinish = () => ctx.soltar(q);
    }
    tp.estilhacos(ctx, PREMIO.x, PREMIO.y - 74, 8, 0.7);
    ctx.em(420, () => tp.poeira(ctx, PREMIO.x, PREMIO.y - 4, 9, 1.2));
    s.falha({ ganho: 0.34 });
    [0, 1, 2, 3, 4, 5].forEach(i => s.chip({ t: 0.1 + i * 0.07, freq: 880 - i * 120, dur: 0.05, ganho: 0.07 }));
  }
  function tocar0(ctx) {
    const s = ctx.som, tp = r.tp, tF1 = 700, tF2 = 1650, tD = 2350, tN = 3050, NOITE = 2600;
    s.ambiente({ vento: 0.4 }, 1);
    /* mundo novo: os corações do HUD pulsam, recarregados */
    r.coracoes.forEach((c, i) => ctx.anim(c, [{ transform: 'scale(1)' }, { transform: 'scale(1.4)' }, { transform: 'scale(1)' }], { duration: 260, delay: 60 + i * 70, fill: 'none', easing: 'ease-out' }));
    /* o prêmio falha de novo; o herói se vira para olhar */
    ctx.em(tF1, () => { s.falha(); r.premio.falhar(ctx, 400, 'inteiro'); });
    ctx.em(tF1 + 330, () => { heroiEm(TOPO.x, TY, true).alerta(true); salto(ctx, TOPO.x, 9, 200, true); });
    ctx.em(tF2, () => { s.falha({ ganho: 0.36 }); r.premio.falhar(ctx, 640, 'falha'); });
    /* e se desfaz em pedaços: era falso */
    ctx.em(tD, () => desfazerPremio(ctx));
    ctx.em(tD + 560, () => r.h.alerta(false));
    /* a noite cai sobre o templo, com uma nota grave; o título entra */
    ctx.em(tN, () => {
      tp.mudarHora(ctx, 'noite', NOITE);
      s.tambor({ freq: 38, ganho: 0.8, dur: 1.6 }); s.chip({ tipo: 'triangle', freq: 82, ate: 55, dur: 1.7, ganho: 0.16 });
      s.ambiente({ vento: 0.25 }, 2.4);
    });
    r.cab.entrar(ctx, tN + 500);
    ctx.em(tN + NOITE + 300, ctx.concluir);
  }

  /* ---------- passos 1 a 6: os quatro baús ---------- */
  /* some o que ficou do baú anterior: o cartão sai e vira a marca com o nome; o baú aberto cai; a fala se apaga */
  function recolher(ctx, i) {
    const s = ctx.som, m = r.marcas[i], rot = MARCA.rot[i];
    r.cartoes[i].sair(ctx); r.baloes[i].sair(ctx, 60);
    ctx.anim(r.baus[i].el, [{ opacity: 1, transform: 'translateY(0px)' }, { opacity: 0, transform: 'translateY(50px)' }], { duration: 300, easing: 'ease-in' });
    /* a marca sai do cabeçalho do cartão e voa baixo até a lista: por baixo do título, por cima da escada
       (o cravar() da lasca faz um arco alto, que aqui passaria por cima do título) */
    const cx = MARCA.x + 22, cy = MARCA.y[i] + 24, de = { x: CARTAO.x + 40, y: CARTAO.y + 40 }, meio = { x: 560, y: 212 };
    ctx.anim(m.el, [
      { opacity: 0, transform: `translate(${de.x - cx}px,${de.y - cy}px) rotate(-6deg) scale(.5)` },
      { opacity: 1, transform: `translate(${de.x - cx - 30}px,${de.y - cy - 6}px) rotate(-6deg) scale(.6)`, offset: 0.1, easing: 'cubic-bezier(.4,0,.6,1)' },
      { opacity: 1, transform: `translate(${meio.x - cx}px,${meio.y - cy}px) rotate(-9deg) scale(.72)`, offset: 0.5, easing: 'cubic-bezier(.3,.3,.4,1)' },
      { opacity: 1, transform: `translate(-6px,3px) rotate(${rot - 3}deg) scale(1.1)`, offset: 0.9 },
      { opacity: 1, transform: `translate(0px,0px) rotate(${rot}deg) scale(1)` }], { duration: 640, delay: 120 });
    ctx.em(120 + 600, () => s.clac({ tom: 0.8, ganho: 0.45 }));
  }
  const pop = [{ opacity: 0, transform: 'scale(.2) rotate(-40deg)' }, { opacity: 1, transform: 'scale(1.15) rotate(6deg)', offset: 0.7 }, { opacity: 1, transform: 'scale(1) rotate(0deg)' }];
  const naBase = b => { b.el.style.transformBox = 'fill-box'; b.el.style.transformOrigin = '50% 100%'; };
  /* quatro jeitos de o presente chegar. Cada um devolve o instante (ms) em que o baú está na luz e a fala no balão */
  const ENTREGAS = {
    /* baú 1: a faísca acende o feixe e o baú aparece nele */
    feixe(ctx, i) {
      const s = ctx.som, b = r.baus[i];
      M.voar(ctx, r.ia, [lado(RECUO[i]), ENTREGA], 320, { aoFim: 'entregando', fim: () => s.presente() });
      ctx.anim(r.luz, surge, { duration: 300, delay: 360, fill: 'none' }); ctx.em(650, () => op(r.luz, 1));   // sem fill: a luz precisa ficar livre para pulsar depois
      ctx.anim(b.el, [{ opacity: 0, transform: 'translateY(-30px)' }, { opacity: 1, transform: 'translateY(5px)', offset: 0.7 }, { opacity: 1, transform: 'translateY(0px)' }], { duration: 460, delay: 360, easing: 'ease-out' });
      M.voar(ctx, r.ia, [ENTREGA, FALA], 320, { atraso: 1050 });
      r.baloes[i].entrar(ctx, 1400);
      return 1680;
    },
    /* baú 2: num rasante, sem cerimônia: "já calculei" */
    rasante(ctx, i) {
      const s = ctx.som, b = r.baus[i];
      M.voar(ctx, r.ia, [FALA, { x: 930, y: 150 }, { x: 800, y: 118 }, ENTREGA], 460, { atraso: 120, estado: 'disparando', aoFim: 'entregando', fim: () => s.presente() });
      naBase(b); ctx.anim(b.el, pop, { duration: 300, delay: 560, easing: 'ease-out' });
      M.voar(ctx, r.ia, [ENTREGA, FALA], 240, { atraso: 900 });
      r.baloes[i].entrar(ctx, 1120);
      return 1400;
    },
    /* baú 3: devagar, descendo pelo feixe até a mão dele: "você tem razão" */
    desce(ctx, i) {
      const s = ctx.som, b = r.baus[i];
      M.voar(ctx, r.ia, [FALA, ENTREGA], 420, { atraso: 150, aoFim: 'entregando' });
      ctx.em(600, () => { s.presente(); s.flauta({ freq: s.penta(7), dur: 0.6, ganho: 0.14, t: 0.25 }); });
      ctx.anim(b.el, [{ opacity: 0, transform: 'translateY(-64px)' }, { opacity: 1, transform: 'translateY(-50px)', offset: 0.2 }, { opacity: 1, transform: 'translateY(0px)' }], { duration: 800, delay: 600, easing: 'cubic-bezier(.3,.1,.3,1)' });
      M.voar(ctx, r.ia, [ENTREGA, FALA], 300, { atraso: 1450 });
      r.baloes[i].entrar(ctx, 1750);
      return 2000;
    },
    /* baú 4: três baús piscam e somem antes de ficar o que "deu" */
    sorteia(ctx, i) {
      const s = ctx.som, b = r.baus[i], T = 330, D = 150;
      M.voar(ctx, r.ia, [FALA, ENTREGA], 200, { atraso: 100, estado: 'disparando', aoFim: 'entregando' });
      [[-30, -62], [44, -86], [66, -28]].forEach(([dx, dy], k) => {
        ctx.em(T + k * D, () => { r.fantasma.por(BAU.x + dx, BAU.y + dy); s.bipe({ freq: 700 + k * 120, dur: 0.05, ganho: 0.09 }); });
        ctx.anim(r.fantasma.el, [{ opacity: 0.5 }, { opacity: 0.5, offset: 0.8 }, { opacity: 0 }], { duration: D - 10, delay: T + k * D, fill: 'none' });
      });
      naBase(b); ctx.anim(b.el, pop, { duration: 280, delay: T + 3 * D, easing: 'ease-out' });
      ctx.em(T + 3 * D, () => s.presente());
      M.voar(ctx, r.ia, [ENTREGA, FALA], 240, { atraso: 1080 });
      r.baloes[i].entrar(ctx, 1300);
      return 1580;
    }
  };
  /* os recortes que "não deram": saem de dentro do baú 4 quando ele abre */
  function recortes(ctx) {
    const rnd = rng(404), x0 = BAU.x, y0 = BAU.y - 44;
    for (let k = 0; k < 10; k++) {
      const g = svg('g', {});
      g.innerHTML = '<rect x="-14" y="-15" width="28" height="15" rx="2" fill="#C9C9EE" stroke="#00010F" stroke-width="1.4"/><path d="M-15,-15 Q-15,-26 0,-26 Q15,-26 15,-15 Z" fill="#A9AADC" stroke="#00010F" stroke-width="1.4"/><rect x="-3.5" y="-25.5" width="7" height="25.5" fill="#00A1B8" stroke="#00010F" stroke-width="1"/>';
      r.tp.fx.appendChild(g); ctx.temp(g);
      const dx = 10 + rnd() * 190, sobe = 40 + rnd() * 70, cai = 150 + rnd() * 130, gira = (rnd() - 0.5) * 520;   // para a direita e para baixo: longe do título
      const a = ctx.anim(g, [{ opacity: 0, transform: `translate(${x0}px,${y0}px) rotate(0deg) scale(.5)` },
        { opacity: 0.8, transform: `translate(${x0}px,${y0}px) rotate(0deg) scale(.5)`, offset: 0.04, easing: 'cubic-bezier(.2,.6,.5,1)' },
        { opacity: 0.8, transform: `translate(${n1(x0 + dx * 0.5)}px,${n1(y0 - sobe)}px) rotate(${n1(gira * 0.4)}deg) scale(1)`, offset: 0.36, easing: 'cubic-bezier(.5,0,.9,.5)' },
        { opacity: 0, transform: `translate(${n1(x0 + dx)}px,${n1(y0 + cai)}px) rotate(${n1(gira)}deg) scale(1)` }], { duration: 950 + rnd() * 450, delay: k * 50 });
      if (a) a.onfinish = () => ctx.soltar(g);
    }
  }
  /* quatro jeitos de levar o golpe: de ABRE até `para`. Cada um termina com o herói em pé, piscando */
  const levanta = (ctx, para, ms) => { r.h.por(para, TY).estado('agachado'); M.levantar(ctx, r.h, 120, ms); r.h.piscar(ctx, 760, 160); };
  const REACOES = {
    empurra(ctx, para) {                                                  // um tranco para trás
      ctx.tween(400, e => heroiEm(ABRE + (para - ABRE) * e, TY - 4 * 18 * e * (1 - e), false).pose('atingido', { giro: -12 * (1 - e) }), { curva: E.outQuad, fim: () => levanta(ctx, para, 300) });
    },
    rola(ctx, para) {                                                     // rola de costas
      M.rolar(ctx, r.h, [{ x: ABRE, y: TY }, { x: para, y: TY }], 540, { voltas: 1, quique: 9, saltos: 2, curva: E.outQuad, fim: () => levanta(ctx, para, 320) });
    },
    voa(ctx, para) {                                                      // arremessado pelo ar, cai de costas e demora a levantar
      const s = ctx.som;
      ctx.tween(640, e => heroiEm(ABRE + (para - ABRE) * e, TY - 4 * 40 * e * (1 - e), false).pose('atingido', { giro: -360 * e }), { fim: () => {
        r.h.por(para, TY).pose('caido'); s.passo({ ganho: 0.6 }); r.tp.tremor(ctx, 4, 150); r.tp.poeira(ctx, para, TY, 6, 0.9);
        ctx.tween(340, e => r.h.mistura('caido', 'agachado', e), { atraso: 420, curva: E.inOut, fim: () => { M.levantar(ctx, r.h, 0, 380); r.h.piscar(ctx, 700, 0); } });
      } });
    },
    beira(ctx, para) {                                                    // derrapa até a beira do topo e quase cai
      const s = ctx.som, tp = r.tp;
      ctx.tween(360, e => { heroiEm(ABRE + (para - ABRE) * e, TY, false).pose('atingido', { giro: 0, ar: false }); }, { curva: E.outCubic, fim: () => {
        tp.poeira(ctx, para - 26, TY, 8, 1.1); tp.estilhacos(ctx, para - 34, TY + 6, 5, 0.5); s.passo({ ganho: 0.5 });
        const seq = [['atingido', POSE_BEIRA_TRAS, 170], [POSE_BEIRA_TRAS, POSE_BEIRA_FRENTE, 260], [POSE_BEIRA_FRENTE, POSE_BEIRA_TRAS, 240], [POSE_BEIRA_TRAS, 'parado', 280]];
        let t = 0;
        seq.forEach(([a, b, ms], k) => { ctx.tween(ms, e => r.h.mistura(a, b, e), { atraso: t, curva: E.inOut, fim: k === seq.length - 1 ? () => { r.h.estado('parado'); r.h.piscar(ctx, 760, 0); } : null }); t += ms; });
        ctx.em(430, () => { tp.poeira(ctx, para - 30, TY, 4, 0.7); s.passo({ ganho: 0.3 }); });
      } });
      [80, 180, 280].forEach(q => ctx.em(q, () => tp.poeira(ctx, r.h.x + 10, TY, 3, 0.7)));
    }
  };
  /* por baú: como chega, quanto o herói espera para andar, quanto leva até o baú, como leva o golpe,
     quanto depois do estalo o cartão cai, e a força do tremor */
  const COREO = [
    { entrega: 'feixe', espera: 150, anda: 420, reacao: 'empurra', cartao: 760, tremor: 6 },
    { entrega: 'rasante', espera: 60, anda: 440, reacao: 'rola', cartao: 700, tremor: 7 },
    { entrega: 'desce', espera: 80, anda: 560, reacao: 'voa', cartao: 820, tremor: 8 },
    { entrega: 'sorteia', espera: 40, anda: 600, reacao: 'beira', cartao: 760, tremor: 10 }
  ];
  /* a entrega do baú i: some o que ficou do anterior, o presente chega e a IA diz o que trouxe; o herói vai até ele.
     Devolve o instante (ms) em que ele chega diante do baú */
  function entregar(ctx, i) {
    const K = COREO[i], de = RECUO[i];
    if (i > 0) recolher(ctx, i - 1);
    r.baus[i].por(BAU.x, BAU.y).estado('fechado');
    const tPronto = ENTREGAS[K.entrega](ctx, i);
    if (i === 0) ctx.em(420, () => { heroiEm(de, TY, false); salto(ctx, de, 8, 180, false); });         // ele se vira para o presente
    const tAnda = tPronto + K.espera;
    M.andar(ctx, r.h, [{ x: de, y: TY }, { x: ABRE, y: TY }], K.anda, { atraso: tAnda });
    return { tPronto, tChega: tAnda + K.anda + 60 };
  }
  /* o estalo do baú i: armadilha, clarão, uma vida a menos, o herói jogado para trás, e o cartão com o nome, o texto e,
     quando há, o número. Chamar na hora (dentro de ctx.em). Devolve em quantos ms o passo pode terminar */
  function estalar(ctx, i) {
    const s = ctx.som, tp = r.tp, K = COREO[i], C = r.cartoes[i], temNumero = !!BAUS[i].numero;
    r.baus[i].abrir(ctx, 'armadilha');
    s.clac({ tom: 1.25, ganho: 0.6 }); s.pedra({ ganho: 0.5 + i * 0.1, freq: 76 - i * 7 });
    tp.tremor(ctx, K.tremor, 260); clarao(ctx, BAU.x, BAU.y - 84, 34, 420);
    tp.estilhacos(ctx, BAU.x - 26, BAU.y - 66, 6 + i * 2, 0.9);
    if (i === 3) recortes(ctx);
    r.h.estado('atingido');
    ctx.em(110, () => { r.hud.perderVida(ctx); s.vida({ tom: 1 - i * 0.08 }); });
    r.hud.gastarPrazo(ctx, PRAZO[PASSOS.findIndex(q => q.bau === i && !q.espera)], 500, 150);
    ctx.em(90, () => REACOES[K.reacao](ctx, RECUO[i + 1]));
    const t0 = K.cartao + C.entrar(ctx, K.cartao);
    ctx.em(K.cartao + 430, () => s.clac({ tom: 0.9, ganho: 0.3 }));
    C.revelar(ctx, 0, t0 + 420);
    if (temNumero) C.revelar(ctx, 'rodape', t0 + 1320);
    return t0 + (temNumero ? 2500 : 1900);
  }
  /* passos 1 e 4 (baús 1 e 3): só a entrega. O baú fica fechado na luz, flutuando, com a fala da IA, e o herói com a mão
     estendida. O passo termina aí e espera a tecla: a pausa da pergunta "abre ou não abre?" é do apresentador */
  function tocarEntrega(i) {
    return function (ctx) {
      const { tPronto, tChega } = entregar(ctx, i);
      ctx.em(tPronto - 250, () => esperar(i, true));                      // flutua, pulsa e brilha por CSS: continua depois do fim do passo
      ctx.tween(340, e => r.h.mistura('parado', POSE_ABRE, MAO * e), { atraso: tChega, curva: E.inOut });
      ctx.em(tChega + 340 + 260, ctx.concluir);
    };
  }
  /* passos 2 e 5: o herói abre o baú que estava esperando. Recolhe a mão um instante e vai */
  function tocarAbre(i) {
    return function (ctx) {
      const REC = 0.4, tAbre = 400;
      ctx.tween(170, e => r.h.mistura('parado', POSE_ABRE, MAO + (REC - MAO) * e), { curva: E.inOut });
      ctx.tween(200, e => r.h.mistura('parado', POSE_ABRE, REC + (1 - REC) * e), { atraso: 190, curva: E.inQuad });
      ctx.em(tAbre, () => { esperar(i, false); ctx.em(estalar(ctx, i), ctx.concluir); });
    };
  }
  /* passos 3 e 6 (baús 2 e 4): entrega e abertura de uma vez, para o ritmo não cair */
  function tocarInteiro(i) {
    return function (ctx) {
      const b = r.baus[i], { tPronto, tChega } = entregar(ctx, i);
      let bob = null;
      ctx.em(tPronto - 250, () => { bob = ctx.anim(b.el, [{ translate: '0px 0px' }, { translate: '0px -5px' }], { duration: 680, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out', fill: 'none' }); });
      brilhos(ctx, tPronto - 200, 2);
      ctx.tween(210, e => r.h.mistura('parado', POSE_ABRE, e), { atraso: tChega, curva: E.inOut });
      ctx.em(tChega + 210, () => { if (bob) bob.cancel(); ctx.em(estalar(ctx, i), ctx.concluir); });
    };
  }

  /* ---------- passo 7: a fronteira ---------- */
  function tocar7(ctx) {
    const s = ctx.som, tp = r.tp, de = RECUO[4], tA = 820, dA = 780, tF = tA + dA;
    recolher(ctx, 3); ctx.anim(r.luz, some, 300);
    M.voar(ctx, r.ia, [FALA, lado(de)], 440, { atraso: 160 });
    /* ele sai da beira, confiante, com a faísca ao lado. O chão é igual o caminho todo */
    M.andar(ctx, r.h, [{ x: de, y: TY }, { x: FALSO, y: TY }], dA, { atraso: tA });
    M.voar(ctx, r.ia, [lado(de), lado(FALSO)], dA, { atraso: tA, curva: E.lin });
    ctx.em(tF, () => {
      /* passo em falso: o chão de fora pisca como o prêmio piscou, e ele escorrega */
      s.chip({ tipo: 'triangle', freq: 330, ate: 82, dur: 0.3, ganho: 0.2 }); s.falha({ ganho: 0.16 });
      ctx.anim(r.piso, pisca([0.9, 0, 0.7, 0, 0.5, 0]), { duration: 340, fill: 'none' });
      ctx.tween(440, e => heroiEm(FALSO + (QUEDA - FALSO) * e, TY - 4 * 12 * e * (1 - e), false).mistura('atingido', 'caido', E.inQuad(e)), { curva: E.outQuad, fim: () => {
        /* queda curta: cai ali mesmo, de costas */
        r.h.por(QUEDA, TY).pose('caido'); s.passo({ ganho: 0.6 }); s.tambor({ freq: 60, ganho: 0.45, dur: 0.3 });
        tp.tremor(ctx, 5, 200); tp.poeira(ctx, QUEDA - 20, TY, 8, 1);
        r.hud.gastarPrazo(ctx, PRAZO[7], 500, 100);
        ctx.tween(360, e => r.h.mistura('caido', 'agachado', e), { atraso: 900, curva: E.inOut, fim: () => M.levantar(ctx, r.h, 60, 420) });
      } });
      M.voar(ctx, r.ia, [lado(FALSO), lado(QUEDA)], 600, { curva: E.outQuad });
      /* só agora a linha aparece, atrás dele */
      ctx.em(200, () => {
        ctx.anim(r.linha, [{ opacity: 0, transform: 'scaleY(0)' }, { opacity: 1, transform: 'scaleY(1.06)', offset: 0.75 }, { opacity: 1, transform: 'scaleY(1)' }], { duration: 420, easing: 'ease-out' });
        s.chip({ tipo: 'triangle', freq: 196, ate: 392, dur: 0.22, ganho: 0.16 }); s.clac({ tom: 1.1, ganho: 0.3, t: 0.3 });
      });
      /* o cartão da fronteira */
      const C = r.fronteira, tC = 1150, t0 = tC + C.entrar(ctx, tC);
      C.revelar(ctx, 0, t0 - 200); C.revelar(ctx, 1, t0 + 900); C.revelar(ctx, 'rodape', t0 + 1900);   // sem cabeçalho: a primeira linha já chega com o cartão
      ctx.em(t0 + 3200, ctx.concluir);
    });
  }

  /* ---------- passo 8: última vida; a faísca continua igual ---------- */
  function tocar8(ctx) {
    const s = ctx.som;
    s.ambiente({ vento: 0 }, 0.8);                                       // silêncio
    ctx.em(700, () => { r.coracoes[0].classList.add('c03-ultima'); s.bipe({ freq: 660, dur: 0.14 }); });
    r.frases[0].entrar(ctx, 1500); r.frases[1].entrar(ctx, 3300);
    ctx.em(3300 + 520 + 900, ctx.concluir);
  }
