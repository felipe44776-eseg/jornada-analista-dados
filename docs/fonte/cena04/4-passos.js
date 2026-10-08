
  /* ================= Parte 4: tocar(ctx), a versão animada de cada passo ================= */
  const some = [{ opacity: 1 }, { opacity: 0 }], surge = [{ opacity: 0 }, { opacity: 1 }];
  const sobe = [{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'translateY(0px)' }];
  const cai = [{ opacity: 0, transform: 'translateY(-26px)' }, { opacity: 1, transform: 'translateY(4px)', offset: 0.7 }, { opacity: 1, transform: 'translateY(0px)' }];
  const pulso = (ctx, el, k, ms) => ctx.anim(el, [{ transform: 'scale(1)' }, { transform: `scale(${k || 1.2})` }, { transform: 'scale(1)' }], { duration: ms || 320, fill: 'none', easing: 'ease-out' });
  const pulsoVidas = ctx => pulso(ctx, r.hud.el.querySelector('.jg-cor'), 1.16, 420);          // nenhuma vida se perde nesta cena: os corações só pulsam

  /* herói e faísca andando pelo mapa. pts em coordenadas do mapa; a posição na tela segue a câmera.
     o = { atraso, passada, rapido, marcas: [{ x, fn }] }: cada marca dispara quando os pés passam de x */
  function andarMapa(ctx, pts, ms, o) {
    o = o || {}; const c = M.caminho(pts), atraso = o.atraso || 0, n = Math.max(2, Math.min(Math.round(c.L / (o.passada || 15)), Math.round(ms / 110)));
    const marcas = (o.marcas || []).map(m => Object.assign({ feito: false }, m));
    ctx.tween(ms, (e, p) => {
      const P = c.em(e), T = tela(P), A = atras(T);
      marcas.forEach(m => { if (!m.feito && P.x >= m.x) { m.feito = true; m.fn(); } });
      r.h.por(T.x, T.y); r.ia.por(A.x, A.y);
      if (p >= 1) { r.h.estado('parado'); r.ia.estado('parada'); if (o.fim) o.fim(); }
      else { r.h.estado('andando', e * n / 2); r.ia.estado(o.rapido ? 'disparando' : 'voando', { ang: 0 }); }
    }, { atraso });
    const sons = Math.min(n, 12);
    for (let i = 1; i <= sons; i++) ctx.em(atraso + ms * (i - 0.5) / sons, () => ctx.som.passo({ ganho: 0.16 }));
  }
  /* o herói grande, dentro da etapa: passada proporcional ao tamanho dele */
  function caminhar(ctx, h, de, ate, ms, atraso) {
    const n = Math.max(2, Math.round(Math.abs(ate.x - de.x) / 30)), t0 = atraso || 0;
    ctx.tween(ms, (e, p) => { h.por(de.x + (ate.x - de.x) * e, de.y); if (p >= 1) h.estado('parado'); else h.estado('andando', e * n / 2); }, { atraso: t0 });
    for (let i = 1; i <= n; i++) ctx.em(t0 + ms * (i - 0.5) / n, () => ctx.som.passo({ ganho: 0.22 }));
  }
  /* o herói passa por um portão: a grade some e a bandeira balança */
  function abrirPorta(ctx, i) {
    ctx.anim(r.portas[i], [{ opacity: 1, transform: 'translateY(0px)' }, { opacity: 0, transform: 'translateY(-16px)' }], { duration: 200, easing: 'ease-in' });
    pulso(ctx, r.bands[i], 1.18, 300); ctx.som.clac({ tom: 1.1, ganho: 0.16 });
  }
  /* toque de checkpoint: a bandeira cresce, um anel de luz se abre e duas notas sobem */
  function checkpoint(ctx, i) {
    const s = ctx.som, g = portao(i), H = ETAPAS[i].critico ? 92 : 72;
    pulso(ctx, r.bands[i], 1.4, 460);
    const anel = ctx.temp(svg('circle', { cx: g.x + 10, cy: g.y - H + 10, r: 12, fill: 'none', stroke: '#fff', 'stroke-width': 4, class: 'jg-po' })); r.c.fx.appendChild(anel);
    const a = ctx.anim(anel, [{ transform: 'scale(.4)', opacity: 0.95 }, { transform: 'scale(4.2)', opacity: 0 }], { duration: 560, easing: 'ease-out' }); if (a) a.onfinish = () => ctx.soltar(anel);
    [3, 5].forEach((grau, k) => s.chip({ t: k * 0.09, freq: s.penta(grau, 523.25), dur: k ? 0.2 : 0.09, ganho: 0.13 })); s.clac({ tom: 1.2, ganho: 0.2 });
  }

  /* ---------- 0 · o mapa se desenrola ---------- */
  function tocar0(ctx) {
    const s = ctx.som, c = r.c, T0 = 500, DUR = 1500, CURVA = 'cubic-bezier(.3,0,.3,1)', tH = T0 + DUR + 100;
    r.fPonte.sair(ctx, 250);                                              // sai de "Você precisa de um mapa."
    r.hud.entrar(ctx, 150); r.cab.entrar(ctx, 300); r.hud.entrarJogadores(ctx, 800);
    ctx.anim(c.mundo, [{ clipPath: 'inset(0px 100% 0px 0px)' }, { clipPath: 'inset(0px 0% 0px 0px)' }], { duration: DUR, delay: T0, easing: CURVA });
    ctx.em(T0, () => {                                                    // o rolo corre na frente do papel
      const rolo = ctx.temp(html('<div class="c04-rolo"></div>')); c.hud.appendChild(rolo);
      ctx.anim(rolo, [{ transform: 'translateX(0px)' }, { transform: 'translateX(1280px)' }], { duration: DUR, easing: CURVA });
      ctx.anim(rolo, [{ opacity: 1 }, { opacity: 0 }], { duration: 180, delay: DUR - 180 });
    });
    for (let k = 0; k < 20; k++) s.clac({ t: (T0 + k * 72) / 1000, tom: 0.42 + k * 0.016, ganho: k % 3 ? 0.06 : 0.09 });      // papel desenrolando
    for (let k = 0; k < 5; k++) s.passo({ t: (T0 + k * 300) / 1000, ganho: 0.13 });
    [0, 2, 4, 7].forEach((g, i) => s.chip({ t: (T0 + DUR) / 1000 + i * 0.09, tipo: 'triangle', freq: s.penta(g, 392), dur: i === 3 ? 0.42 : 0.1, ganho: 0.2 }));   // toque de mapa
    /* herói e faísca no ponto 00 */
    ctx.anim(r.h.el, [0, 1, 0, 1, 0, 1].map((v, k) => ({ opacity: v, offset: k / 5, easing: 'step-end' })), { duration: 480, delay: tH });
    ctx.anim(r.ia.el, surge, { duration: 180, delay: tH + 300 });
    M.voar(ctx, r.ia, [{ x: -40, y: 160 }, { x: 30, y: 226 }, lado(INICIO)], 560, { atraso: tH + 300, estado: 'disparando' });
    ctx.em(tH + 1200, ctx.concluir);
  }

  /* ---------- 1 · o caminho se acende, região por região; cada ponto mostra o nome enquanto a região está em foco ---------- */
  function acenderUm(ctx, i) {
    const s = ctx.som;
    r.pontos[i].classList.add('aceso');
    ctx.anim(r.luz[i], surge, 260);
    pulso(ctx, r.pontos[i], 1.22, 260);
    ctx.anim(r.nums[i], [{ opacity: 0, transform: 'scale(1.5)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 220, easing: 'ease-out' });
    ctx.anim(r.nomes[i], [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0px)' }], { duration: 200, easing: 'ease-out' });
    s.chip({ tipo: 'triangle', freq: s.penta(i, 294), dur: 0.16, ganho: 0.22 }); s.clac({ tom: 0.9 + i * 0.03, ganho: 0.1 });   // uma nota por etapa, subindo
  }
  function tocar1(ctx) {
    const CADA = 230, FOCO = 780;
    let t = 250;
    POR_REGIAO.forEach((etapas, k) => {
      ctx.em(t, () => { r.caixas[k].classList.add('nomeada'); ctx.anim(r.regs[k], [{ opacity: 0, transform: 'translateX(-10px)' }, { opacity: 1, transform: 'translateX(0px)' }], { duration: 300, easing: 'ease-out' }); });
      etapas.forEach((i, j) => ctx.em(t + 120 + j * CADA, () => acenderUm(ctx, i)));
      t += 120 + etapas.length * CADA + FOCO;
      ctx.em(t, () => etapas.forEach(i => ctx.anim(r.nomes[i], some, 220)));          // o nome recolhe; ficam o número e a região
      t -= 80;
    });
    ctx.anim(r.placas[0], cai, { duration: 480, delay: t + 200 });
    ctx.em(t + 200, () => ctx.som.clac({ tom: 0.8, ganho: 0.24 }));
    ctx.em(t + 1100, ctx.concluir);
  }

  /* ---------- 2 · zoom na etapa: a faísca percorre P, E e V e para diante do portão fechado. Fica esperando a tecla ---------- */
  function acenderCasa(ctx, k) {
    r.casas[k].classList.add('acesa'); r.letras[k].classList.add('acesa');
    ctx.anim(r.casas[k], [{ filter: 'brightness(1.9)' }, { filter: 'brightness(1)' }], { duration: 340, fill: 'none' });
    ctx.anim(r.letras[k], [{ opacity: 1, transform: 'scale(1.35)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 260, easing: 'ease-out' });
    ctx.anim(r.ciclo[k], [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0px)' }], { duration: 320, easing: 'ease-out' });
  }
  function tocar2(ctx) {
    const s = ctx.som, NOTA = [5, 7, 9], ZOOM = 1000, CADA = 560;
    ctx.tween(ZOOM, e => { zoomEm(e); peoesEm(INICIO, lado); }, { curva: E.inOut });
    s.chip({ tipo: 'triangle', freq: 220, ate: 660, dur: 0.5, ganho: 0.09 });
    let de = ladoZ(ZENT), t = ZOOM + 150;
    [0, 1, 2].forEach(k => {
      const a = de, b = toque(k);
      M.voar(ctx, r.iaz, [a, { x: (a.x + b.x) / 2, y: Math.min(a.y, b.y) - 44 }, b], 380, { atraso: t, aoFim: 'voando' });
      ctx.em(t + 380, () => { acenderCasa(ctx, k); s.chip({ freq: s.penta(NOTA[k], 440), dur: 0.12, ganho: 0.14 }); s.chip({ tipo: 'triangle', freq: s.penta(NOTA[k] - 5, 440), dur: 0.16, ganho: 0.16 }); });   // três notas rápidas
      de = b; t += CADA;
    });
    /* o herói vem atrás, pelas casas que a faísca já acendeu, e para no fim da terceira */
    caminhar(ctx, r.hz, ZENT, ZV, 2300, ZOOM + 550);
    r.hud.gastarPrazo(ctx, PRAZO[2], 3 * CADA, ZOOM + 150);
    /* a faísca para diante do portão: a grade não cede. A quarta casa fica pulsando, à espera */
    M.voar(ctx, r.iaz, [de, ZPORTA], 420, { atraso: t + 60 });
    ctx.em(t + 620, () => { ctx.tremor(r.grade, 4, 260); s.clac({ tom: 0.5, ganho: 0.3 }); s.chip({ tipo: 'triangle', freq: 98, dur: 0.14, ganho: 0.2 }); r.casas[3].classList.add('c04-pulsa'); });
    ctx.em(ZOOM + 550 + 2300 + 150, ctx.concluir);
  }

  /* ---------- 3 · o herói dá o último passo e o portão abre ---------- */
  function tocar3(ctx) {
    const s = ctx.som;
    r.casas[3].classList.remove('c04-pulsa');
    caminhar(ctx, r.hz, ZV, ZD, 620, 100);
    ctx.em(720, () => { acenderCasa(ctx, 3); s.tambor({ freq: 55, ganho: 0.8, dur: 0.6 }); s.chip({ tipo: 'triangle', freq: 110, dur: 0.6, ganho: 0.26 }); r.c.tremor(ctx, 4, 220); });   // uma nota grave, de decisão
    ctx.em(1080, () => {
      ctx.anim(r.grade, [{ transform: 'translateY(0px)' }, { transform: `translateY(${-GRADE_SOBE}px)` }], { duration: 560, easing: 'cubic-bezier(.4,0,.2,1)' });
      for (let k = 0; k < 6; k++) s.clac({ t: k * 0.085, tom: 0.7 + k * 0.08, ganho: 0.14 });
    });
    ctx.em(1640, () => { r.lampada.classList.add('acesa'); pulso(ctx, r.lampada, 1.8, 360); s.chip({ freq: s.penta(7, 440), dur: 0.22, ganho: 0.12 }); });
    r.hud.gastarPrazo(ctx, PRAZO[3], 500, 720);
    r.fDecide.entrar(ctx, 1500);
    ctx.em(3100, ctx.concluir);
  }

  /* ---------- 4 · zoom de volta; sobem as 13 bandeiras; nas 5 críticas, a segunda pessoa ---------- */
  function subirBandeira(ctx, i) {
    const s = ctx.som, crit = !!ETAPAS[i].critico;
    ctx.anim(r.bands[i], [{ opacity: 1, transform: 'scaleY(0)' }, { opacity: 1, transform: 'scaleY(1.14)', offset: 0.7 }, { opacity: 1, transform: 'scaleY(1)' }], { duration: crit ? 340 : 240, easing: 'ease-out' });
    s.chip({ tipo: 'triangle', freq: 330 + i * 22, ate: 660 + i * 44, dur: 0.09, ganho: 0.16 }); s.clac({ tom: 1 + i * 0.03, ganho: 0.14 });
    if (!crit) return;
    [5, 7, 9].forEach(g => s.chip({ t: 0.06, tipo: 'triangle', freq: s.penta(g, 261.63), dur: 0.34, ganho: 0.11 }));      // acorde nas ★
    ctx.anim(r.colegas[CRITICOS.indexOf(i)].el, [{ opacity: 0, transform: 'translateY(-14px)' }, { opacity: 1, transform: 'translateY(0px)' }], { duration: 260, delay: 120, easing: 'ease-out' });
  }
  function tocar4(ctx) {
    const s = ctx.som, ZOOM = 950;
    r.fDecide.sair(ctx); ctx.anim(r.placas[0], some, 300);
    r.gmapa.classList.add('aberto');
    ctx.tween(ZOOM, e => { zoomEm(1 - e); peoesEm(casa(0, 3), atras); }, { curva: E.inOut });
    s.chip({ tipo: 'triangle', freq: 660, ate: 220, dur: 0.5, ganho: 0.09 });
    /* o portão da 00 já abriu: os dois seguem até o fim da etapa 01, diante do primeiro portão crítico */
    andarMapa(ctx, [casa(0, 3), casa(1, 3)], 1000, { atraso: ZOOM, marcas: [{ x: portao(0).x, fn: () => r.hud.mudarFase(ctx, 2) }] });
    r.hud.gastarPrazo(ctx, PRAZO[4], 1000, ZOOM);
    let t = ZOOM + 200;
    for (let i = 0; i < N; i++) { const ti = t; ctx.em(ti, () => subirBandeira(ctx, i)); t += 330 - i * 16; }                 // 13 vezes, acelerando
    ctx.anim(r.placas[1], cai, { duration: 480, delay: t + 150 });
    r.fSalvo.entrar(ctx, t + 750);
    ctx.em(t + 2300, ctx.concluir);
  }

  /* ---------- 5 · a pedra do mundo 1 cai de novo, na etapa 03: o herói volta só até a bandeira anterior ---------- */
  function tocar5(ctx) {
    const s = ctx.som, c = r.c, alvo = casa(3, 3), dest = casa(3, 0), SOBE = 1700;
    const G = { dx: alvo.x + 110 - r.pedra.x, dy: alvo.y - 44 - r.pedra.y, rot: -16, ms: 380 };   // do ponto de leitura, no alto à direita, até o herói
    r.fSalvo.sair(ctx); ctx.anim(r.placas[1], some, 300);
    andarMapa(ctx, [casa(1, 3), alvo], SOBE, { atraso: 150, marcas: [
      { x: portao(1).x, fn: () => { abrirPorta(ctx, 1); r.hud.mudarFase(ctx, 3); } }, { x: portao(2).x, fn: () => { abrirPorta(ctx, 2); r.hud.mudarFase(ctx, 4); } }] });
    r.hud.gastarPrazo(ctx, (PRAZO[4] + PRAZO[5]) / 2, SOBE, 150);
    /* a pedra chega e fica parada, com o texto inteiro, pelo tempo de leitura */
    const tE = 150 + SOBE - 500, tL = tE + r.pedra.chegar(ctx, 'cai', tE), tG = tL + 1900, tI = tG + G.ms;
    ctx.em(150 + SOBE + 80, () => r.h.alerta(true));
    let bob = null; ctx.em(tL, () => { bob = r.pedra.flutuar(ctx); });
    ctx.em(tG, () => { if (bob) bob.cancel(); r.pedra.golpear(ctx, G); });
    ctx.em(tI, () => {
      s.pedra({ ganho: 0.9 }); c.tremor(ctx, 7, 300);
      c.poeira(ctx, alvo.x, alvo.y - 10, 9, 1.2); c.estilhacos(ctx, alvo.x + 14, alvo.y - 46, 9);
      r.pedra.desfazer(ctx, G); r.h.alerta(false).estado('atingido');
      ctx.em(r.lasca.cravar(ctx, alvo.x, alvo.y - 44), () => s.clac({ tom: 0.7, ganho: 0.4 }));
      r.hud.gastarPrazo(ctx, PRAZO[5], 500, 150);                         // o prazo cai um pouco; nenhuma vida se perde
      ctx.em(300, () => pulsoVidas(ctx));
      /* jogado para trás num arco, mas só até a bandeira do portão anterior */
      ctx.em(130, () => ctx.tween(640, e => {
        const T = tela({ x: alvo.x + (dest.x - alvo.x) * e, y: alvo.y - 4 * 50 * e * (1 - e) }), A = atras(T), B = lado(tela(dest));
        r.h.por(T.x, T.y).pose('atingido', { giro: -360 * e }); r.ia.por(A.x + (B.x - A.x) * e, A.y + (B.y - A.y) * e);
      }, { fim: () => {
        const T = tela(dest); r.h.por(T.x, T.y).estado('agachado'); s.passo({ ganho: 0.5 }); c.poeira(ctx, dest.x, dest.y, 5, 0.8);
        checkpoint(ctx, 2); M.levantar(ctx, r.h, 180, 420);
      } }));
      r.fVolta.entrar(ctx, 1200);
      ctx.em(130 + 640 + 600 + 1500, ctx.concluir);
    });
  }

  /* ---------- 6 · o baú do mundo 3 chega pela faísca e fica fechado diante do portão. Fica esperando a tecla ---------- */
  function tocar6(ctx) {
    const s = ctx.som, T = tela(casa(3, 0));
    r.fVolta.sair(ctx); ctx.anim(r.lasca.el, some, 300);
    M.voar(ctx, r.ia, [lado(T), { x: ENTREGA.x - 4, y: ENTREGA.y - 30 }, ENTREGA], 380, { atraso: 250, aoFim: 'entregando', fim: () => s.presente() });
    r.balao.entrar(ctx, 720);
    ctx.anim(r.bau.el, [{ opacity: 0, transform: 'translateY(-30px)' }, { opacity: 1, transform: 'translateY(-4px)' }], { duration: 440, delay: 660, easing: 'ease-out' });
    r.hud.gastarPrazo(ctx, PRAZO[6], 500, 300);
    ctx.em(1700, ctx.concluir);
  }

  /* ---------- 7 · o portão não abre: a verificação e o sorteio do herói expõem a armadilha antes de ele pôr a mão ---------- */
  function tocar7(ctx) {
    const s = ctx.som, c = r.c;
    r.bau.el.classList.remove('c04-flutua');
    ctx.anim(r.trava, [{ opacity: 0, transform: 'scale(2.4)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 200, delay: 200, easing: 'cubic-bezier(.5,0,.8,.4)' });
    ctx.em(400, () => { s.clac({ tom: 0.5, ganho: 0.5 }); s.chip({ freq: 98, dur: 0.14, ganho: 0.16 }); c.tremor(ctx, 4, 200); });   // trava
    /* o sorteio do herói: dois dados */
    r.dados.forEach((d, k) => {
      ctx.anim(d, [{ opacity: 0, transform: `translate(${k ? -8 : 16}px,74px) rotate(-200deg)` }, { opacity: 1, transform: 'translate(0px,-12px) rotate(24deg)', offset: 0.7 }, { opacity: 1, transform: 'translate(0px,0px) rotate(0deg)' }], { duration: 420, delay: 900 + k * 200, easing: 'ease-out' });
      ctx.em(900 + k * 200 + 400, () => s.clac({ tom: 1.15 + k * 0.2, ganho: 0.3 }));
    });
    ctx.anim(r.linha, sobe, { duration: 420, delay: 1300 });
    /* reexecutados: os dados giram, e o baú aparece por dentro sem ter sido aberto. Estalo sem dano */
    ctx.em(2000, () => { r.dados.forEach((d, k) => ctx.anim(d, [{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], { duration: 400, delay: k * 120, fill: 'none', easing: 'ease-in-out' })); s.bipe({ freq: 990, dur: 0.06 }); s.bipe({ t: 0.14, freq: 1320, dur: 0.06 }); });
    ctx.em(2550, () => { r.bau.abrir(ctx, 'exposto'); s.clac({ tom: 1.4, ganho: 0.5 }); s.chip({ tipo: 'triangle', freq: 523.25, ate: 784, dur: 0.16, ganho: 0.16 }); pulsoVidas(ctx); });
    r.hud.gastarPrazo(ctx, PRAZO[7], 500, 900);
    r.fArmadilha.entrar(ctx, 2900);
    ctx.em(4400, ctx.concluir);
  }

  /* ---------- 8 · na etapa 08 entra o auditor: trabalha numa cópia fantasma do mapa, ao lado, sem tocar no original ---------- */
  function tocar8(ctx) {
    const s = ctx.som, de = casa(3, 0), ate = casa(8, 3), VEL = 0.52, T0 = 380;
    r.balao.sair(ctx); r.fArmadilha.sair(ctx);
    [r.linha, r.bau.el, r.trava].concat(r.dados).forEach(el => ctx.anim(el, some, 280));
    M.voar(ctx, r.ia, [ENTREGA, atras(tela(de))], 300, { aoFim: 'voando' });
    /* a armadilha ficou no portão: ele abre, e os dois correm até a etapa 08. O caminho principal passa ao lado da 06 */
    const tA = (1312 - de.x) / VEL, tB = (ate.x + 32) / VEL, fase = (n, porta) => () => { if (porta != null) abrirPorta(ctx, porta); r.hud.mudarFase(ctx, n); };
    andarMapa(ctx, [de, { x: 1312, y: Y[0] }], tA, { atraso: T0, passada: 26, rapido: true, marcas: [{ x: portao(3).x, fn: fase(5, 3) }, { x: portao(4).x, fn: fase(6, 4) }, { x: portao(5).x, fn: () => abrirPorta(ctx, 5) }] });
    andarMapa(ctx, [{ x: -32, y: Y[1] }, ate], tB, { atraso: T0 + tA, passada: 26, rapido: true, marcas: [{ x: -30, fn: fase(8) }, { x: portao(7).x, fn: fase(9, 7) }] });
    r.hud.gastarPrazo(ctx, PRAZO[8], tA + tB, T0);
    /* a câmera recua: o mapa fica pequeno à esquerda e a cópia aparece ao lado */
    const tC = T0 + tA + tB + 120;
    ctx.anim(r.rmapa, some, { duration: 260, delay: tC - 160 });
    ctx.tween(900, e => { camera(entreCameras(CAM0, CAM8, e)); const T = tela(ate), a = atras(T), b = lado8(T); r.h.por(T.x, T.y); r.ia.por(a.x + (b.x - a.x) * e, a.y + (b.y - a.y) * e); }, { atraso: tC, curva: E.inOut });
    ctx.anim(r.gfant, surge, { duration: 520, delay: tC + 480 });
    for (let k = 0; k < 8; k++) s.clac({ t: (tC + 480 + k * 60) / 1000, tom: 0.5 + k * 0.03, ganho: 0.05 });
    /* o auditor: outra faísca, só contorno. Percorre a cópia, etapa por etapa */
    const tAud = tC + 820, rota = CONF.map(naCopia).concat([AUD]), cm = M.caminho(rota); let ac = 0;
    ctx.anim(r.aud.el, surge, { duration: 150, delay: tAud });
    ctx.em(tAud, () => s.chip({ tipo: 'triangle', freq: 1568, dur: 0.5, ganho: 0.16 }));                                      // nota aguda, limpa
    M.voar(ctx, r.aud, [{ x: 1330, y: 130 }, { x: 1000, y: 214 }, rota[0]], 600, { atraso: tAud, estado: 'disparando', aoFim: 'voando' });
    M.voar(ctx, r.aud, rota, 1300, { atraso: tAud + 650, curva: E.lin, marcas: CONF.map((i, k) => { const q = ac / cm.L; ac += cm.seg[k]; return { q: Math.max(0, q - 0.003), fn: () => { r.fpontos[i].classList.add('conf'); s.clac({ tom: 1.3 + k * 0.04, ganho: 0.12 }); } }; }) });
    /* o cartão dos papéis */
    const tK = tAud + 650 + 1300 + 100, t1 = tK + r.papeis.entrar(ctx, tK);
    PAPEIS.forEach((_, i) => { r.papeis.revelar(ctx, i, t1 + 80 + i * 430); ctx.em(t1 + 80 + i * 430, () => s.clac({ tom: i < 2 ? 1.25 : 0.9, ganho: 0.22 })); });
    ctx.em(t1 + 80 + 3 * 430 + 1300, ctx.concluir);
  }

  /* ---------- 9 · a aposta: só a pergunta e as três opções. Fica esperando a tecla ---------- */
  function tocar9(ctx) {
    const s = ctx.som;
    r.papeis.sair(ctx);
    const t0 = 320 + r.aposta.entrar(ctx, 320);
    [0, 1, 2].forEach(k => ctx.em(320 + 380 + k * 140 + 120, () => s.bipe({ freq: 880, ganho: 0.1 })));                        // bipe de espera
    ctx.em(t0 + 300, ctx.concluir);
  }

  /* ---------- 10 · a resposta entra e FICA NA TELA ATÉ A TECLA: é o número mais importante da cena ---------- */
  function tocar10(ctx) {
    const s = ctx.som;
    r.aposta.el.classList.remove('c04-espera');
    ctx.em(150, () => { r.aposta.revelar(ctx); s.bipe({ freq: 1320, dur: 0.16 }); });
    ctx.anim(r.aposta.el, [{ transform: 'translateX(0px)' }, { transform: `translateX(${-APOSTA_SAI}px)` }], { duration: 420, delay: 450, easing: 'cubic-bezier(.3,0,.2,1)' });
    ctx.anim(r.resp, [{ opacity: 0, transform: 'translateY(18px) scale(.96)' }, { opacity: 1, transform: 'translateY(0px) scale(1)' }], { duration: 420, delay: 700, easing: 'cubic-bezier(.2,.7,.2,1)' });
    ctx.anim(r.resp.lastElementChild, surge, { duration: 400, delay: 1200 });
    ctx.em(1900, ctx.concluir);
  }

  /* ---------- 11 · herói e aliado cruzam o último portão com 5 vidas; o prêmio não falha ---------- */
  function tocar11(ctx) {
    const s = ctx.som, de = casa(8, 3), SAI = 0, VOLTA = 600, ANDA = 1750;
    /* a aposta e a resposta saem e a câmera volta ao mapa inteiro */
    [r.aposta.el, r.resp, r.gfant, r.aud.el].forEach(el => ctx.anim(el, some, 300));
    ctx.tween(VOLTA, e => { camera(entreCameras(CAM8, CAM0, e), e >= 1); const T = tela(de), a = lado8(T), b = atras(T); r.h.por(T.x, T.y); r.ia.por(a.x + (b.x - a.x) * e, a.y + (b.y - a.y) * e); }, { atraso: SAI + 200, curva: E.inOut });
    ctx.anim(r.rmapa, surge, { duration: 300, delay: SAI + 200 + VOLTA - 150 });
    /* da etapa 08 até a chegada, portão por portão */
    const tW = SAI + 200 + VOLTA + 50, fase = (n, porta) => () => { abrirPorta(ctx, porta); if (n) r.hud.mudarFase(ctx, n); };
    andarMapa(ctx, [de, CHEGADA], ANDA, { atraso: tW, passada: 18, marcas: [{ x: portao(8).x, fn: fase(10, 8) }, { x: portao(9).x, fn: fase(11, 9) }, { x: portao(10).x, fn: fase(12, 10) }, { x: portao(11).x, fn: fase(13, 11) },
      { x: portao(12).x, fn: () => { fase(0, 12)(); checkpoint(ctx, 12); s.fanfarra({ completa: true }); } }],
      fim: () => M.voar(ctx, r.ia, [atras(CHEGADA), lado(CHEGADA)], 320) });
    r.hud.gastarPrazo(ctx, PRAZO[11], ANDA, tW);
    const tP = tW + ANDA + 100;
    ctx.anim(r.premio.el, [{ opacity: 0, transform: 'translateY(-46px)' }, { opacity: 1, transform: 'translateY(5px)', offset: 0.75 }, { opacity: 1, transform: 'translateY(0px)' }], { duration: 420, delay: tP, easing: 'ease-out' });
    ctx.em(tP + 380, () => { r.c.poeira(ctx, PREMIO.x, PREMIO.y - 2, 6, 0.9); pulsoVidas(ctx); });
    ctx.anim(r.fimC, [{ opacity: 0, transform: 'scale(1.8)' }, { opacity: 1, transform: 'scale(.95)', offset: 0.7 }, { opacity: 1, transform: 'scale(1)' }], { duration: 400, delay: tP + 250, easing: 'cubic-bezier(.5,0,.8,.4)' });
    r.fFecho.entrar(ctx, tP + 800);
    ctx.em(tP + 800 + 520 + 600, ctx.concluir);
  }
