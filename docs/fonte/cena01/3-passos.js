
  /* ================= Parte 3: os passos 0 a 6 ================= */
  const some = [{ opacity: 1 }, { opacity: 0 }], surge = [{ opacity: 0 }, { opacity: 1 }];
  const entra = [{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'translateY(0px)' }];
  const M = Jogo.mover;
  function pulso(ctx, el, k) { ctx.anim(el, [{ transform: `scale(${k || 1.14})` }, { transform: 'scale(1)' }], { duration: 170, fill: 'none', easing: 'ease-out' }); }
  const marcasDeFase = (ctx, a, b) => r.tp.marcasDePouso(a, b, k => r.hud.mudarFase(ctx, k));   // o HUD troca de fase a cada degrau pisado
  /* a lasca com o motivo salta do impacto e se crava na coluna da encosta */
  function voarLasca(ctx, i, ix, iy) {
    ctx.em(r.lascas[i].cravar(ctx, ix, iy), () => { ctx.som.clac({ tom: 0.7, ganho: 0.5 }); r.tp.poeira(ctx, 902, LASCA_Y[i] + 24, 5, 0.8); });
  }

  /* ---------- as quatro primeiras pedras: cada uma chega, bate e derruba de um jeito ---------- */
  const COREO = [
    { chega: 'cai', sobe: 1500, leitura: 2000, golpe: { dx: -186, dy: 200, rot: -16, ms: 360 }, reacao: 'rola', volta: 800, levanta: 480, tremor: 7, forca: 0.85 },
    { chega: 'pousa', sobe: 1400, leitura: 1900, golpe: { dx: -86, dy: 110, rot: -104, ms: 600 }, reacao: 'atropela', volta: 620, levanta: 480, tremor: 8, forca: 0.9 },
    { chega: 'desliza', sobe: 1400, leitura: 1900, golpe: { dx: -252, dy: 110, rot: -22, ms: 250 }, reacao: 'voa', volta: 720, levanta: 1040, tremor: 9, forca: 0.95 },
    { chega: 'desce', sobe: 1400, leitura: 2000, golpe: { dx: -216, dy: 64, rot: -34, ms: 300, recuo: 260 }, reacao: 'despenca', volta: 1750, levanta: 560, tremor: 13, forca: 1, grave: true }
  ];
  function tocarPedra(i) {
    return function (ctx) {
      const s = ctx.som, tp = r.tp, P = PEDRAS[i], K = COREO[i], G = K.golpe, pedra = r.pedras[i], de = i === 0 ? 0 : PEDRAS[i - 1].volta, alvo = pouso(P.fase), dest = pouso(P.volta);
      ctx.anim(r.grito, [{ opacity: i === 0 ? 0 : 1 }, { opacity: 0 }], { duration: 220 });
      if (i === 0) { ctx.anim(r.contT, some, 450); ctx.anim(r.contS, some, 450); tp.cameraPara(ctx, { x: 0, y: 0, z: 0 }, 900); }
      /* sobe até a fase onde a pedra espera */
      M.andar(ctx, r.h, rota(de, P.fase), K.sobe, { atraso: 200, marcas: marcasDeFase(ctx, de, P.fase) });
      r.hud.gastarPrazo(ctx, (PRAZO[2 + i] + PRAZO[3 + i]) / 2, K.sobe, 200);
      /* a pedra chega e fica parada, com o texto inteiro, pelo tempo de leitura */
      const tE = 200 + K.sobe - 300, tL = tE + pedra.chegar(ctx, K.chega, tE), tG = tL + K.leitura, tI = tG + (G.recuo || 0) + G.ms;
      if (i === 1) ctx.em(tE + 420, () => { s.pedra({ ganho: 0.45 }); ctx.tremor(r.mundo, 4, 200); tp.poeira(ctx, PG[1].x, PG[1].y + 80, 7, 1); });
      if (i === 2) ctx.em(tE, () => s.gliss({ de: 980, para: 520, dur: 0.3, ganho: 0.1 }));
      if (i === 3) [0, 300, 600].forEach(q => ctx.em(tE + q, () => s.tambor({ freq: 44, ganho: 0.5, dur: 0.4 })));
      ctx.em(200 + K.sobe + 120, () => r.h.alerta(true));
      let bob = null; ctx.em(tL, () => { bob = pedra.flutuar(ctx); });
      /* o golpe */
      ctx.em(tG, () => { if (bob) bob.cancel(); pedra.golpear(ctx, G); });
      ctx.em(tI, () => {
        const ix = alvo.x + 6, iy = alvo.y - 62;
        s.pedra({ ganho: K.forca, freq: K.grave ? 40 : 52 }); ctx.tremor(r.mundo, K.tremor, K.grave ? 380 : 300);
        tp.poeira(ctx, ix, iy + 44, 10, 1.3); tp.estilhacos(ctx, ix + 16, iy - 8, K.grave ? 14 : 9, K.grave ? 1.3 : 1);
        pedra.desfazer(ctx, G);
        r.h.alerta(false).estado('atingido');                            // quadro parado: dá peso à pancada
        voarLasca(ctx, i, ix, iy);
        ctx.em(120, () => { r.hud.perderVida(ctx); s.vida({ tom: K.grave ? 0.7 : 1 }); });
        r.hud.gastarPrazo(ctx, PRAZO[3 + i], 500, 150);
        ctx.em(260, () => { grito(i); ctx.anim(r.grito, [{ opacity: 0, transform: 'translateY(22px) scale(.5)' }, { opacity: 1, transform: 'translateY(-8px) scale(1.18)', offset: 0.6 }, { opacity: 1, transform: 'translateY(0px) scale(1)' }], { duration: 400, easing: 'ease-out' }); });
        const depois = () => { r.hud.mudarFase(ctx, P.volta); r.h.por(dest.x, dest.y).estado('agachado'); M.levantar(ctx, r.h, 140, K.levanta - 140); r.h.piscar(ctx, 760, 200); };
        ctx.em(130, () => {
          if (K.reacao === 'rola') M.rolar(ctx, r.h, rota(P.fase, P.volta), K.volta, { voltas: 1, quique: 9, saltos: 2, curva: E.outQuad, fim: depois });
          else if (K.reacao === 'atropela') M.rolar(ctx, r.h, rota(P.fase, P.volta), K.volta, { voltas: 2, quique: 6, saltos: 3, fim: depois });
          else if (K.reacao === 'despenca') M.rolar(ctx, r.h, rota(P.fase, P.volta), K.volta, { voltas: 4, quique: 15, saltos: 4, curva: E.outQuad, fim: depois,
            aoQuicar: Q => { s.passo({ ganho: 0.55 }); ctx.tremor(r.mundo, 4, 130); tp.poeira(ctx, Q.x, Q.y, 4, 0.7); } });
          else {                                                         // 'voa': arremessado pelo ar, cai de costas e demora a levantar
            ctx.tween(K.volta, e => r.h.por(alvo.x + (dest.x - alvo.x) * e, alvo.y + (dest.y - alvo.y) * e - 4 * 84 * e * (1 - e)).pose('atingido', { giro: -360 * e }), { fim: () => {
              r.hud.mudarFase(ctx, P.volta); r.h.por(dest.x, dest.y).pose('caido'); s.passo({ ganho: 0.6 }); ctx.tremor(r.mundo, 4, 150); tp.poeira(ctx, dest.x, dest.y, 6, 0.9);
              ctx.tween(360, e => r.h.mistura('caido', 'agachado', e), { atraso: 280, curva: E.inOut, fim: () => { M.levantar(ctx, r.h, 0, 400); r.h.piscar(ctx, 700, 0); } });
            } });
          }
        });
        if (i === 3) ctx.anim(r.legVolta, entra, { duration: 520, delay: 130 + K.volta + 200 });
        ctx.em(130 + K.volta + K.levanta + 700, ctx.concluir);
      });
    };
  }

  /* ---------- tocar(): a versão animada dos passos 0 a 2 ---------- */
  function tocar0(ctx) {                                                 // tela de título; conclui na hora: a primeira tecla já começa o jogo
    r.abre.classList.add('entra'); ctx.concluir();
  }
  function tocar1(ctx) {                                                 // amanhece; o templo sobe; o HUD entra; o herói nasce
    const s = ctx.som, tp = r.tp, TAMBOR = [58, 66, 74, 84, 96, 110];
    s.ambiente({ vento: 0.55 }, 3);
    r.abre.classList.remove('entra');
    ctx.anim(r.abre, [{ opacity: 1, transform: 'translateY(0px) scale(1)' }, { opacity: 0, transform: 'translateY(-26px) scale(1.04)' }], { duration: 520, easing: 'cubic-bezier(.5,0,.9,.4)' });
    ctx.anim(tp.veu, [{ opacity: 0.94 }, { opacity: 0 }], { duration: 4200, easing: 'cubic-bezier(.4,0,.3,1)' });
    ctx.anim(tp.est, [{ opacity: 1 }, { opacity: 0.3 }], { duration: 4200 });
    ctx.anim(tp.disco, [{ transform: 'translateY(380px)' }, { transform: 'translateY(0px)' }], { duration: 6000, easing: 'cubic-bezier(.2,.6,.2,1)' });
    ctx.anim(tp.halo, surge, { duration: 4800 });
    tp.cameraPara(ctx, { x: 0, y: 0, z: 0 }, 6000);
    ctx.anim(r.cab, [{ opacity: 0, transform: 'translateX(-28px)' }, { opacity: 1, transform: 'translateX(0px)' }], { duration: 800, delay: 600, easing: 'cubic-bezier(.2,.7,.2,1)' });
    let t = 1100;
    for (let k = 1; k <= 6; k++) {
      const T = tier(k), bl = tp.blocosK[k - 1], t0 = t, ult = t0 + 430 + (bl.length - 1) * 60;
      bl.forEach((b, i) => ctx.anim(b, [{ opacity: 1, transform: `translateY(${-(T.y + 150)}px)` }, { opacity: 1, transform: 'translateY(0px)' }], { duration: 430, delay: t0 + i * 60, easing: 'cubic-bezier(.55,.05,.95,.45)' }));
      ctx.em(t0 + 430, () => { s.tambor({ freq: TAMBOR[k - 1], ganho: 0.9 }); ctx.tremor(r.mundo, 5, 230); tp.poeira(ctx, T.x + 16, T.y + T.h - 2, 5); });
      ctx.em(ult, () => { tp.poeira(ctx, T.x + T.w - 16, T.y + T.h - 2, 5); });
      ctx.anim(tp.fases[k - 1], [{ opacity: 0, transform: 'scale(1.1)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 380, delay: ult + 40, easing: 'ease-out' });
      t += 800;
    }
    const fecho = t - 800 + 430 + 60 + 420;
    ctx.anim(tp.orn, surge, { duration: 700, delay: fecho - 300 });
    ctx.anim(r.museu, [{ opacity: 0, transform: 'translateY(-90px) rotate(-5deg)' }, { opacity: 1, transform: 'translateY(0px) rotate(1.8deg)', offset: 0.55 }, { opacity: 1, transform: 'translateY(0px) rotate(-0.8deg)', offset: 0.8 }, { opacity: 1, transform: 'translateY(0px) rotate(0deg)' }], { duration: 900, delay: fecho, easing: 'ease-out' });
    ctx.em(fecho + 100, () => { [[3, 0, .17], [4, .2, .17], [5, .4, .32], [4, .8, .17], [3, 1.0, .6]].forEach(([g, q, d]) => s.flauta({ freq: s.penta(g), t: q, dur: d })); });
    r.hud.entrar(ctx, fecho + 500);
    /* o herói nasce na base: pisca, um anel de luz, toque de "jogador pronto" */
    const tH = fecho + 1700;
    ctx.anim(r.h.el, [0, 1, 0, 1, 0, 1].map((v, k) => ({ opacity: v, offset: k / 5, easing: 'step-end' })), { duration: 560, delay: tH });
    ctx.em(tH, () => {
      s.pronto();
      const c = Deck.util.svg('circle', { cx: BASE.x, cy: BASE.y - 60, r: 20, fill: 'none', stroke: '#fff', 'stroke-width': 5, class: 'jg-po' }); tp.fx.appendChild(c); ctx.temp(c);
      ctx.anim(c, [{ transform: 'scale(.3)', opacity: 0.95 }, { transform: 'scale(5)', opacity: 0 }], { duration: 620, easing: 'ease-out' });
    });
    ctx.em(tH + 1100, ctx.concluir);
  }
  function tocar2(ctx) {                                                 // missões: 24 tarefas, 42 saídas
    const s = ctx.som, tp = r.tp, RITMO = [1, 0.9, 0.8, 0.7, 0.62, 0.55];
    tp.cameraPara(ctx, { x: 8, y: 0, z: 0 }, 1800);
    num(r.contTn, 0); num(r.contSn, 0);
    ctx.anim(r.contT, entra, { duration: 450 }); ctx.anim(r.contS, entra, { duration: 450, delay: 150 });
    let t = 600, nt = 0, ns = 0, j = 0;
    FASES.forEach((f, i) => {
      const T = tier(i + 1), fr = RITMO[i], voo = 440 * (0.72 + 0.28 * fr);
      ctx.anim(tp.flashes[i], [{ opacity: 0 }, { opacity: 0.32 }, { opacity: 0 }], { duration: 650, delay: t, fill: 'none' });
      tp.tarefasK[i].forEach((el, q) => {
        const tt = t + q * 125 * fr;
        ctx.anim(el, [{ opacity: 1, transform: 'scaleY(0)' }, { opacity: 1, transform: 'scaleY(1.2)', offset: 0.7 }, { opacity: 1, transform: 'scaleY(1)' }], { duration: 260, delay: tt, easing: 'ease-out' });
        ctx.em(tt + 130, () => { num(r.contTn, ++nt); pulso(ctx, r.contTn, 1.1); });
      });
      t += f.tarefas * 125 * fr + 80;
      for (let q = 0; q < f.saidas; q++, j++) {
        const el = tp.tabs[j], tt = t + q * 100 * fr, sx = T.x + T.w - 28, sy = T.y + 27, Q = el._p;
        const ax = sx + (Q.x - sx) * 0.55, ay = Math.min(sy, Q.y) - 60 - (j * 37 % 40);
        ctx.anim(el, [
          { opacity: 0, transform: `translate(${sx}px,${sy}px) rotate(-50deg) scale(.4)`, easing: 'cubic-bezier(.2,.6,.4,1)' },
          { opacity: 1, transform: `translate(${Math.round(ax * 10) / 10}px,${Math.round(ay * 10) / 10}px) rotate(${70 + j * 13 % 60}deg) scale(1)`, offset: 0.45, easing: 'cubic-bezier(.5,0,.9,.5)' },
          { opacity: 1, transform: el._fim }], { duration: voo, delay: tt });
        ctx.em(tt + voo, () => { num(r.contSn, ++ns); s.clac({ tom: 0.85 + ns * 0.012, ganho: 0.42 }); if (ns % 3 === 0 || ns === TOT_S) pulso(ctx, r.contSn, 1.08); });
      }
      t += f.saidas * 100 * fr + 140;
    });
    r.hud.gastarPrazo(ctx, PRAZO[2], t - 600, 600);
    ctx.em(t + 420, () => { pulso(ctx, r.contTn, 1.22); pulso(ctx, r.contSn, 1.22); });
    ctx.em(t + 1000, ctx.concluir);
  }
