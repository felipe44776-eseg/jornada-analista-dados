
  /* ================= Parte 4: os passos (tocar) ================= */
  const some = [{ opacity: 1 }, { opacity: 0 }], surge = [{ opacity: 0 }, { opacity: 1 }];
  const desce = [{ opacity: 1, transform: 'translateY(0px)' }, { opacity: 0, transform: 'translateY(64px)' }];
  /* centro e largura de um elemento em px do palco (o palco é escalado para a janela). Medir ANTES de criar animação no elemento */
  function centro(el) {
    const p = r.palco.getBoundingClientRect(), b = el.getBoundingClientRect(), k = r.palco.offsetWidth / p.width;
    return { x: (b.left + b.width / 2 - p.left) * k, y: (b.top + b.height / 2 - p.top) * k, w: b.width * k };
  }
  function pulso(ctx, el, k) { ctx.anim(el, [{ transform: `scale(${k || 1.3})` }, { transform: 'scale(1)' }], { duration: 260, fill: 'none', easing: 'ease-out' }); }

  /* ---------- som: composto com as primitivas de som.js. Dó-ré-mi-sol-lá (graus 1 a 5): as notas da flauta do mundo 1 ---------- */
  const nota = (s, g, oitava) => s.penta(g, 440 * (oitava || 1));
  function acordeAberto(s) {                                  // passo 0: fundamental e quinta, sem terça
    [[1, 0], [4, 0.09], [6, 0.18], [9, 0.27]].forEach(([g, q]) => { s.flauta({ t: q, freq: nota(s, g, 0.25), dur: 1.5, ganho: 0.12 }); s.chip({ t: q, tipo: 'triangle', freq: nota(s, g, 0.25), dur: 1.3, ganho: 0.08 }); });
  }
  /* toque de conquista: duas notas de passagem e a nota da conquista k (1 a 5), cada uma um grau acima da anterior */
  function toque(s, k) {
    s.chip({ freq: nota(s, k - 2), dur: 0.06, ganho: 0.11 }); s.chip({ t: 0.075, freq: nota(s, k - 1), dur: 0.06, ganho: 0.11 });
    s.chip({ t: 0.15, freq: nota(s, k), dur: 0.34, ganho: 0.13 }); s.chip({ t: 0.15, tipo: 'triangle', freq: nota(s, k, 0.5), dur: 0.42, ganho: 0.18 });
    s.chip({ t: 0.25, tipo: 'triangle', freq: nota(s, k, 2), dur: 0.2, ganho: 0.06 });
  }
  /* uma nota da melodia completa (a quinta conquista repassa as cinco, uma por marco da trilha) */
  function notaDaMelodia(s, k) { s.chip({ freq: nota(s, k), dur: 0.2, ganho: 0.12 }); s.chip({ tipo: 'triangle', freq: nota(s, k, 0.5), dur: 0.26, ganho: 0.16 }); }
  function acorde(s, longo) {                                 // dó maior: fecho da melodia (passo 5) e acorde final (passo 6)
    const d = longo ? 1.5 : 0.9;
    [1, 3, 4, 6].forEach((g, i) => s.chip({ t: longo ? i * 0.05 : 0, tipo: 'triangle', freq: nota(s, g, 0.5), dur: d, ganho: 0.11 }));
    s.chip({ freq: nota(s, 6), dur: d * 0.8, ganho: 0.09 }); s.chip({ freq: nota(s, 3), dur: d * 0.7, ganho: 0.04 });
  }
  function tema(s) {                                          // passo 7: o motivo de flauta do mundo 1 (cena 01, passo 1), com um fecho em dó
    [[3, 0, 0.17], [4, 0.2, 0.17], [5, 0.4, 0.32], [4, 0.8, 0.17], [3, 1.0, 0.4], [2, 1.5, 0.17], [1, 1.72, 0.9]].forEach(([g, q, d]) => s.flauta({ freq: nota(s, g), t: q, dur: d }));
    [1, 3, 4].forEach(g => s.chip({ t: 1.72, tipo: 'triangle', freq: nota(s, g, 0.5), dur: 1.0, ganho: 0.09 }));
  }

  /* ---------- passo 0: sai de "Fase concluída"; amanhece de vez; título e "0/5 conquistas" ---------- */
  function tocar0(ctx) {
    const s = ctx.som, tp = r.tp, luz = { duration: 2600, delay: 350, easing: 'cubic-bezier(.4,0,.3,1)' };
    s.ambiente({ vento: 0.3 }, 2.5);
    ctx.em(350, () => acordeAberto(s));
    ctx.anim(r.partida, [{ opacity: 1, transform: 'translateY(0px) scale(1)' }, { opacity: 0, transform: 'translateY(-46px) scale(.86)' }], { duration: 440, delay: 550, easing: 'ease-in' });
    /* o dia: céu, clarão e névoa clareiam; as estrelas somem; o disco cresce */
    [r.ceu, r.clarao, r.nevoa].forEach(el => ctx.anim(el, surge, luz));
    ctx.anim(r.raios, surge, { duration: 1600, delay: 1500 });
    ctx.anim(tp.est, [{ opacity: Templo.HORAS.amanhecer.est }, { opacity: 0 }], luz);
    ctx.anim(tp.disco, [{ transform: 'translate(0px,0px) scale(1)' }, { transform: SOL }], luz);
    /* a luz desce o templo, degrau a degrau, e traz de volta o nome de cada fase */
    ctx.anim(tp.rotulos, [{ opacity: 1 }, { opacity: 1 }], 1);
    for (let k = 6; k >= 1; k--) {
      const t = 1150 + (6 - k) * 150;
      ctx.anim(tp.flashes[k - 1], [{ opacity: 0 }, { opacity: 0.6, offset: 0.3 }, { opacity: LUZ }], { duration: 620, delay: t });
      ctx.anim(tp.fases[k - 1], [{ opacity: 0, transform: 'scale(1.08)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 380, delay: t + 120, easing: 'ease-out' });
    }
    r.cab.entrar(ctx, 1500);
    /* o contador entra no lugar do HUD; os cinco encaixes vazios aparecem um a um */
    ctx.anim(r.placar, [{ opacity: 0, transform: 'translateY(-70px)' }, { opacity: 1, transform: 'translateY(6px)', offset: 0.7 }, { opacity: 1, transform: 'translateY(0px)' }], { duration: 620, delay: 2350, easing: 'cubic-bezier(.2,.7,.2,1)' });
    r.slots.forEach((el, j) => {
      const t = 2850 + j * 100;
      ctx.anim(el, [{ opacity: 0, transform: 'scale(.3)' }, { opacity: 1, transform: 'scale(1.2)', offset: 0.7 }, { opacity: 1, transform: 'scale(1)' }], { duration: 260, delay: t, easing: 'ease-out', fill: 'backwards' });
      ctx.em(t + 120, () => s.clac({ tom: 0.8 + j * 0.05, ganho: 0.16 }));
    });
    ctx.em(3350, () => pulso(ctx, r.contN, 1.3));
    ctx.em(4000, ctx.concluir);
  }

  /* ---------- passos 1 a 5: uma conquista por tecla ----------
     O aviso sobe do pé da tela; a medalha entra girando como moeda e encaixa; o emblema faz o gesto dele;
     o nome bate, a linha entra; uma cópia pequena da medalha sobe para o contador, que passa a n/5.
     A quinta é maior e, depois de encaixar, acende a trilha dos quatro mundos atrás do herói, com a melodia completa. */
  function tocarConquista(i) {
    return function (ctx) {
      const s = ctx.som, C = CONQUISTAS[i], av = r.avisos[i], g = !!C.grande, k = i + 1;
      const tSobe = g ? 260 : 200, giro = g ? 860 : 700, tMoeda = tSobe + 260, tEnc = tMoeda + Math.round(giro * 0.82);
      /* sai o aviso anterior (no primeiro, somem os nomes das fases, que ficariam atrás do aviso) */
      if (i === 0) ctx.anim(r.tp.rotulos, some, 400); else ctx.anim(r.avisos[i - 1].el, desce, { duration: 260, easing: 'ease-in' });
      /* o aviso sobe */
      ctx.anim(av.el, [{ opacity: 0, transform: 'translateY(250px)' }, { opacity: 1, transform: 'translateY(-10px)', offset: 0.72 }, { opacity: 1, transform: 'translateY(0px)' }], { duration: 460, delay: tSobe, easing: 'cubic-bezier(.2,.7,.2,1)' });
      ctx.em(tSobe, () => s.gliss({ de: 330, para: 660, dur: 0.22, ganho: 0.07 }));
      ctx.anim(av.rot, surge, { duration: 300, delay: tSobe + 180, fill: 'backwards' });
      /* a medalha gira como moeda e encaixa. fill 'backwards': depois do giro ela volta ao estilo de repouso, sem transform */
      const vira = (i % 2 ? 1 : -1) * 900;
      ctx.anim(av.med, [
        { opacity: 0, transform: `perspective(700px) translateY(-150px) rotateY(${vira}deg) scale(.5)`, easing: 'cubic-bezier(.2,.5,.3,1)' },
        { opacity: 1, offset: 0.14 },
        { opacity: 1, transform: 'perspective(700px) translateY(0px) rotateY(0deg) scale(1.2)', offset: 0.82, easing: 'ease-in' },
        { opacity: 1, transform: 'perspective(700px) translateY(0px) rotateY(0deg) scale(1)' }], { duration: giro, delay: tMoeda, fill: 'backwards' });
      for (let q = 0; q < (g ? 4 : 3); q++) ctx.em(tMoeda + 90 + q * 150, () => s.clac({ tom: 1.1 + q * 0.12, ganho: 0.16 }));
      /* encaixe: estouro, tranco no aviso, toque de conquista */
      ctx.em(tEnc, () => {
        const e = ctx.temp(html(ESTOURO)); av.caixa.appendChild(e);
        const a = ctx.anim(e, [{ opacity: 0.95, transform: 'scale(.7)' }, { opacity: 0, transform: `scale(${g ? 1.6 : 1.42})` }], { duration: g ? 620 : 480, easing: 'ease-out' });
        if (a) a.onfinish = () => ctx.soltar(e);
        ctx.anim(av.el, [{ transform: 'translateY(0px)' }, { transform: `translateY(${g ? 8 : 6}px)` }, { transform: 'translateY(0px)' }], { duration: 200, fill: 'none', easing: 'ease-out' });
        s.clac({ tom: 0.75, ganho: 0.4 }); toque(s, k);
        if (g) { s.tambor({ freq: 58, ganho: 0.5, dur: 0.5 }); r.tp.tremor(ctx, 4, 240); }
      });
      EMBLEMAS[C.emblema].vida(ctx, av.vivo, tEnc + 160);
      /* nome, etiqueta e linha */
      ctx.anim(av.nome, [{ opacity: 0, transform: 'translateX(-22px) scale(1.16)' }, { opacity: 1, transform: 'translateX(0px) scale(1)' }], { duration: 300, delay: tEnc - 40, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards' });
      if (av.etq) ctx.anim(av.etq, [{ opacity: 0, transform: 'scale(.6)' }, { opacity: 1, transform: 'scale(1.1)', offset: 0.7 }, { opacity: 1, transform: 'scale(1)' }], { duration: 300, delay: tEnc + 420, easing: 'ease-out', fill: 'backwards' });
      ctx.anim(av.linha, [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0px)' }], { duration: 420, delay: tEnc + 330, easing: 'ease-out', fill: 'backwards' });
      /* a quinta: a trilha dos quatro mundos se acende atrás do herói, da esquerda até ele */
      let tVoo = tEnc + 900;
      if (g) {
        const tT = tEnc + 520, DUR = 1750, quando = x => tT + DUR * (x - TRILHA.x0) / (TRILHA.x1 - TRILHA.x0);
        r.fios.forEach(f => ctx.anim(f, [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: DUR + 150, delay: tT - 90, easing: 'linear' }));
        r.pontos.forEach((el, j) => ctx.anim(el, [{ opacity: 0, transform: 'scale(.2)' }, { opacity: 1, transform: 'scale(1.9)', offset: 0.5 }, { opacity: 1, transform: 'scale(1)' }], { duration: 300, delay: quando(TRILHA.pontos[j].x), easing: 'ease-out' }));
        r.marcos.forEach((el, m) => {
          const t = quando(TRILHA.marcos[m].x);
          ctx.anim(el, surge, { duration: 120, delay: t });
          ctx.anim(el.firstElementChild, [{ transform: 'scale(.3)' }, { transform: 'scale(1.22)', offset: 0.6 }, { transform: 'scale(1)' }], { duration: 360, delay: t, easing: 'ease-out', fill: 'backwards' });
          ctx.em(t, () => notaDaMelodia(s, m + 1));
        });
        /* a luz chega ao herói: anel, pulo curto e a quinta nota */
        const tH = tT + DUR + 120;
        ctx.em(tH, () => {
          notaDaMelodia(s, 5);
          const c = svg('circle', { cx: TOPO.x, cy: TOPO.y - 60, r: 20, fill: 'none', stroke: '#fff', 'stroke-width': 5, class: 'jg-po' }); r.tp.fx.appendChild(c); ctx.temp(c);
          const a = ctx.anim(c, [{ transform: 'scale(.3)', opacity: 0.95 }, { transform: 'scale(5)', opacity: 0 }], { duration: 620, easing: 'ease-out' });
          if (a) a.onfinish = () => ctx.soltar(c);
          ctx.tween(400, e => r.h.por(TOPO.x, TOPO.y - Math.sin(Math.PI * e) * 18), { fim: () => r.h.por(TOPO.x, TOPO.y) });
        });
        tVoo = tH + 260;
      }
      /* uma cópia da medalha sobe do aviso para o encaixe do contador */
      ctx.em(tVoo, () => {
        const de = centro(av.med), para = centro(r.slots[i]), dx = para.x - de.x, dy = para.y - de.y, esc0 = para.w / de.w;
        const v = ctx.temp(html(`<div class="c05-voo" style="left:${n1(de.x - de.w / 2)}px;top:${n1(de.y - de.w / 2)}px;width:${n1(de.w)}px;height:${n1(de.w)}px">${medalha(C.emblema)}</div>`));
        r.tp.hud.appendChild(v);
        ctx.anim(v, [{ opacity: 0.2, transform: 'translate(0px,0px) scale(1)', easing: 'cubic-bezier(.3,0,.4,1)' }, { opacity: 1, offset: 0.12 },
          { opacity: 1, transform: `translate(${n1(dx)}px,${n1(dy)}px) scale(${esc0.toFixed(3)})` }], { duration: 560 });
        ctx.em(560, () => {
          ctx.soltar(v); placar(k);
          ctx.anim(r.slots[i], [{ transform: 'scale(1.7)' }, { transform: 'scale(1)' }], { duration: 300, fill: 'none', easing: 'ease-out' });
          pulso(ctx, r.contN, 1.5);
          if (g) acorde(s); else s.bipe({ freq: nota(s, k, 2), dur: 0.07, ganho: 0.1 });
        });
      });
      ctx.em(tVoo + 560 + (g ? 1000 : 700), ctx.concluir);
    };
  }

  /* ---------- passo 6: as cinco se juntam num painel, só emblema e nome; a pergunta à turma ---------- */
  function tocar6(ctx) {
    const s = ctx.som, de = r.slots.map(centro), para = r.pnMed.map(centro);          // mede antes de criar as animações
    ctx.anim(r.avisos[N - 1].el, desce, { duration: 280, easing: 'ease-in' });
    r.pontos.concat(r.marcos, r.fios).forEach(el => ctx.anim(el, some, 350));
    ctx.anim(r.painel, [{ opacity: 0, transform: 'translateY(26px)' }, { opacity: 1, transform: 'translateY(0px)' }], { duration: 360, delay: 260, easing: 'ease-out' });
    /* cada medalha desce do encaixe do contador para o lugar dela no painel, crescendo */
    r.pnMed.forEach((el, i) => {
      const t = 700 + i * 170, d0 = `translate(${n1(de[i].x - para[i].x)}px,${n1(de[i].y - para[i].y)}px) scale(${(de[i].w / para[i].w).toFixed(3)})`;
      ctx.anim(el, [{ opacity: 0, transform: d0 }, { opacity: 1, transform: d0, offset: 0.02, easing: 'cubic-bezier(.4,0,.5,1)' },
        { opacity: 1, transform: 'translate(0px,0px) scale(1.1)', offset: 0.82, easing: 'ease-out' }, { opacity: 1, transform: 'translate(0px,0px) scale(1)' }], { duration: 560, delay: t });
      ctx.anim(r.pnNome[i], [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0px)' }], { duration: 260, delay: t + 480, easing: 'ease-out' });
      ctx.em(t + 460, () => s.clac({ tom: 0.8 + i * 0.1, ganho: 0.32 }));
    });
    const tF = 700 + (N - 1) * 170 + 560;
    ctx.em(tF, () => acorde(s, true));
    r.pergunta.entrar(ctx, tF + 380);
    ctx.em(tF + 380 + 520 + 600, ctx.concluir);
  }

  /* ---------- passo 7: créditos. Entra o cartão do repositório ---------- */
  function tocar7(ctx) {
    const s = ctx.som;
    ctx.anim(r.painel, [{ opacity: 1, transform: 'translateY(0px)' }, { opacity: 0, transform: 'translateY(40px)' }], { duration: 300, easing: 'ease-in' });
    r.pergunta.sair(ctx);
    ctx.em(300, () => tema(s));
    const t0 = 300 + r.cartao.entrar(ctx, 300);
    r.cartao.revelar(ctx, 0, t0 + 80);
    CREDITOS.itens.forEach((_, i) => r.cartao.revelar(ctx, i + 1, t0 + 420 + i * 260));
    const tV = t0 + 420 + CREDITOS.itens.length * 260 + 160;
    ctx.anim(r.autoria, [{ opacity: 0, transform: 'translateX(-16px)' }, { opacity: 1, transform: 'translateX(0px)' }], { duration: 360, delay: t0 + 420, easing: 'ease-out' });
    ctx.anim(r.end, [{ opacity: 0, transform: 'translateX(-16px)' }, { opacity: 1, transform: 'translateX(0px)' }], { duration: 360, delay: tV, easing: 'ease-out' });
    ctx.anim(r.qr, [{ opacity: 0, transform: 'scale(.86)' }, { opacity: 1, transform: 'scale(1.03)', offset: 0.7 }, { opacity: 1, transform: 'scale(1)' }], { duration: 420, delay: tV + 260, easing: 'ease-out' });
    ctx.em(tV + 260 + 420 + 700, ctx.concluir);
  }
