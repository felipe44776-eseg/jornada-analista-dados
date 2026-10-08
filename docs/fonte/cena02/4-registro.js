
  /* ================= Parte 4: passos 4 e 5 e o registro da cena ================= */
  /* a luz enfraquece no degrau k: a faísca pisca e fica fraca; os degrauzinhos tentam acender e apagam; tom que cai e some */
  function enfraquecer(ctx, k, t) {
    [0, 90, 170, 260, 330].forEach((d, i) => ctx.em(t + d, () => r.ia.estado(i % 2 ? 'parada' : 'fraca')));   // termina fraca
    r.tp.tarefasK[k - 1].forEach((g, q) => ctx.anim(g.firstElementChild, [{ fill: r.corTarefa }, { fill: CIANO, offset: 0.2 }, { fill: r.corTarefa, offset: 0.45 }, { fill: CIANO, offset: 0.6 }, { fill: r.corTarefa }], { duration: 520, delay: t + q * 30, fill: 'none' }));
    ctx.anim(r.luz[k - 1], [{ opacity: 0 }, { opacity: 0.6 }, { opacity: 0 }, { opacity: 0.4 }, { opacity: 0 }], { duration: 520, delay: t, fill: 'none' });
    ctx.em(t, () => ctx.som.gliss({ de: k === 1 ? 660 : 494, para: k === 1 ? 165 : 110, dur: 0.75, ganho: 0.15 }));
  }
  /* o degrau continua do analista: o contorno branco se desenha em volta dele, com um tambor do mundo 1 */
  function marcarSeu(ctx, i, t) {
    const el = r.seus[i], k = SEUS[i], per = parseFloat(el.getAttribute('stroke-dasharray'));
    ctx.anim(el, [{ opacity: 0, strokeDashoffset: per }, { opacity: 1, strokeDashoffset: per * 0.92, offset: 0.08 }, { opacity: 1, strokeDashoffset: 0 }], { duration: 460, delay: t, easing: 'ease-out' });
    ctx.anim(r.tp.flashes[k - 1], [{ opacity: 0 }, { opacity: 0.3 }, { opacity: 0 }], { duration: 600, delay: t, fill: 'none' });
    ctx.anim(r.tp.fases[k - 1], [{ transform: 'scale(1)' }, { transform: 'scale(1.12)' }, { transform: 'scale(1)' }], { duration: 420, delay: t, fill: 'none', easing: 'ease-out' });
    ctx.em(t, () => ctx.som.tambor({ freq: k === 1 ? 58 : 110, ganho: 0.6 }));
  }

  /* ---------- passo 4: a luz da IA enfraquece no degrau 1 e no degrau 6; o herói sobe o último degrau sozinho ---------- */
  function tocar4(ctx) {
    const s = ctx.som, tp = r.tp, K = DEGRAU_DA_PEDRA, V1 = 430, V6 = 520;
    r.frase3.sair(ctx); ctx.anim(r.lasca.el, some, { duration: 300 });
    /* desce até o degrau 1: a luz enfraquece */
    M.voar(ctx, r.ia, [lado(pouso(K)), { x: 330, y: 400 }, IA_D1], V1, { atraso: 150, estado: 'disparando' });
    ctx.em(150, () => s.chip({ tipo: 'triangle', freq: 990, ate: 330, dur: 0.35, ganho: 0.12 }));
    enfraquecer(ctx, 1, 150 + V1 + 60);
    marcarSeu(ctx, 0, 150 + V1 + 420);
    /* volta pelos degraus do meio, com a luz cheia, e tenta o degrau 6: enfraquece de novo */
    const t6 = 150 + V1 + 900;
    M.voar(ctx, r.ia, [IA_D1, { x: 300, y: 420 }, { x: 480, y: 250 }, IA_D6], V6, { atraso: t6, estado: 'disparando' });
    ctx.em(t6, () => s.chip({ tipo: 'triangle', freq: 330, ate: 990, dur: 0.4, ganho: 0.12 }));
    enfraquecer(ctx, 6, t6 + V6 + 60);
    marcarSeu(ctx, 1, t6 + V6 + 420);
    /* ela recua, fraca, e fica para trás */
    const tR = t6 + V6 + 800;
    M.voar(ctx, r.ia, [IA_D6, IA_FRACA], 480, { atraso: tR, estado: 'fraca', aoFim: 'fraca' });
    /* o herói sobe o último degrau sozinho, no passo do mundo 1: é aqui que o prazo mais cai */
    const tS = tR + 150, SOBE = 1500;
    M.andar(ctx, r.h, rota(K, 6), SOBE, { atraso: tS, marcas: tp.marcasDePouso(K, 6, k => r.hud.mudarFase(ctx, k)) });
    r.hud.gastarPrazo(ctx, PRAZO[4], SOBE, tS);
    /* cartão dos estudos, à direita, e a frase */
    const tC = tS + 250, t0 = tC + r.estudos.entrar(ctx, tC) + 60;
    r.estL.forEach((el, i) => {
      ctx.anim(el, [{ opacity: 0, transform: 'translateX(-16px)' }, { opacity: 1, transform: 'translateX(0px)' }], { duration: 340, delay: t0 + i * 420, easing: 'ease-out' });
      ctx.em(t0 + i * 420, () => s.clac({ tom: i ? 0.8 : 1.2, ganho: 0.3 }));
    });
    r.estudos.revelar(ctx, 'rodape', t0 + 3 * 420);
    r.frase4.entrar(ctx, t0 + 3 * 420 + 380);
    ctx.em(t0 + 3 * 420 + 380 + 520 + 900, ctx.concluir);
  }

  /* ---------- passo 5: topo. Fanfarra, o prêmio brilhando; por um instante ele falha, como imagem com defeito ---------- */
  function tocar5(ctx) {
    const s = ctx.som, tp = r.tp, tV = 240, VOO = 560;
    r.estudos.sair(ctx); r.frase4.sair(ctx);
    /* a faísca recupera a luz, cruza o topo e deixa o prêmio */
    [0, 80, 160].forEach((d, i) => ctx.em(d, () => r.ia.estado(i % 2 ? 'fraca' : 'parada')));
    M.voar(ctx, r.ia, [IA_FRACA, { x: PREMIO.x, y: 226 }, IA_TOPO], VOO, { atraso: tV, estado: 'disparando' });
    ctx.em(tV, () => s.chip({ tipo: 'triangle', freq: 440, ate: 1320, dur: 0.4, ganho: 0.12 }));
    ctx.anim(r.premio.el, [{ opacity: 0, transform: 'scale(.2)' }, { opacity: 1, transform: 'scale(1.18)', offset: 0.7 }, { opacity: 1, transform: 'scale(1)' }], { duration: 420, delay: tV + 300, easing: 'ease-out' });
    ctx.em(tV + 300, () => { anel(ctx, PREMIO.x, PREMIO.y - 66, CIANO, 4); s.fanfarra(); });
    ctx.em(tV + 600, () => { anel(ctx, PREMIO.x, PREMIO.y - 66, '#fff', 5.5); tp.poeira(ctx, PREMIO.x, PREMIO.y, 8, 1.2); });
    ctx.anim(r.brilho, surge, { duration: 500, delay: tV + 520, easing: 'ease-out' });
    /* "Fase concluída" bate na tela; o herói comemora */
    const tB = 900;
    ctx.anim(r.fc, [{ opacity: 0, transform: 'scale(1.7)' }, { opacity: 1, transform: 'scale(.94)', offset: 0.7 }, { opacity: 1, transform: 'scale(1)' }], { duration: 430, delay: tB, easing: 'cubic-bezier(.5,0,.8,.4)' });   // cresce a partir da direita: não sai do palco
    ctx.em(tB + 300, () => { tp.tremor(ctx, 4, 220); s.tambor({ freq: 96, ganho: 0.7, dur: 0.5 }); });
    ctx.tween(760, e => r.h.por(TOPO.x, TOPO.y - Math.abs(Math.sin(Math.PI * 2 * e)) * 22).pose('parado', { br: -8 + 160 * Math.sin(Math.PI * e), cb: -10 * Math.sin(Math.PI * e) }),
      { atraso: tB + 150, fim: () => r.h.por(TOPO.x, TOPO.y).estado('parado') });
    const tR = tB + 900;
    ctx.anim(r.rotulo, POP, { duration: 300, delay: tR, easing: 'ease-out' });
    ctx.em(tR, () => s.clac({ tom: 1.1, ganho: 0.3 }));
    /* por um instante, o prêmio falha: a imagem se parte em faixas e treme; o herói repara */
    const tF = tR + 1000;
    ctx.em(tF, () => {
      s.falha(); r.premio.falhar(ctx, 560, 'inteiro'); r.h.alerta(true);
      ctx.anim(r.premio.el, pisca([1, 0.55, 1, 0.7, 1, 0.5, 1]).map((q, i) => Object.assign(q, { transform: `translateX(${[0, -7, 5, -3, 6, -4, 0][i]}px)` })), { duration: 560, fill: 'none' });
      ctx.anim(r.brilho, pisca([0.1, 0.9, 0.1, 0.6, 0.1, 0.1, 1]), { duration: 560, fill: 'none' });   // o brilho apaga junto
    });
    ctx.em(tF + 860, () => { s.falha({ ganho: 0.2 }); r.premio.falhar(ctx, 160, 'inteiro'); ctx.anim(r.brilho, pisca([0.1, 1]), { duration: 160, fill: 'none' }); });
    ctx.em(tF + 1250, () => r.h.alerta(false));
    r.pergunta.entrar(ctx, tF + 1350);
    ctx.em(tF + 1350 + 520 + 1000, ctx.concluir);
  }

  Deck.registrar({
    id: '02',
    entrada: 'seca',                                              // a cena redesenha a tela "Continuar?" do mundo 1 e a desfaz no passo 0: sem cortina
    titulo: '02 · Mundo 2 — O aliado: a IA entra no jogo',
    notas: {
      fala: '"Continuar? Então entra o segundo jogador. [aposta] Num experimento com 758 consultores do BCG, quem usou IA terminou vinte e cinco por cento mais rápido, fez doze por cento mais tarefas e entregou com mais de quarenta por cento de qualidade a mais. Eram consultores, não analistas de dados, mas o desenho é o mesmo: os degraus do meio viram segundos. A pedra ainda cai, só que voltar ficou barato. Agora reparem onde a luz dela enfraquece. Num mapeamento dos estudos sobre IA no ciclo de dados, quarenta e um tratam de exploração; três tratam de definir o problema; um, de implantação. O primeiro e o último degrau continuam seus. E chegamos. Fase concluída. [pausa] Quem entregaria isso ao chefe agora?" (cerca de 90 s)',
      interacao: 'Passo 1: "com IA, quanto mais rápido? Dez, vinte e cinco ou cinquenta por cento?". Mão levantada para cada opção, antes da tecla. Passo 5: "quem entregaria isso ao chefe agora?". Mão levantada. Não responder: a resposta é o mundo 3.',
      rastreio: [
        '25,1% mais rápido, +12,2% de tarefas concluídas, mais de 40% de ganho de qualidade, 758 consultores, três braços: pesquisa/03-ia-na-analise-de-dados.md §3.1. Na tela os dois primeiros estão arredondados para 25% e 12%.',
        '41 de análise exploratória, 33 de modelos, 23 de coleta e preparação, 3 de definição do problema, 1 de implantação: Chintakunta, Nascimento & Guimaraes (arXiv 2508.11698), §5.1, conferido na fonte em 2026-10-08. Um artigo pode contar em mais de uma etapa.',
        'O total de artigos fica fora da tela e da fala. pesquisa/01 §15.1 diz 62 e pesquisa/03 §1.1 diz 66. A divergência é do próprio artigo: o texto fala em "a corpus of 66 research papers" e as legendas de duas figuras usam "out of 62 papers", sem explicar a diferença.',
        'A IA vai bem em entendimento dos dados, preparação e modelagem, com "partial correctness" em cenários complexos (Musazade et al., 2024): pesquisa/03 §2. É o que sustenta os degraus 2, 3 e 4.',
        'Ilustrativo, sem fonte: a pedra do passo 3 e a frase "só ficou barato".'
      ]
    },
    montar, desmontar,
    passos: [
      { nome: 'sai da tela "Continuar?" do mundo 1; o HUD reinicia; herói na base; a faísca chega · 2 jogadores', ambiente: { vento: 0.45 }, tocar: tocar0, fim: FIM[0] },
      { nome: 'aposta da turma · "Com IA, quanto mais rápido?" · 10%, 25%, 50%', tocar: tocar1, fim: FIM[1] },
      { nome: 'a resposta: 25% · a IA dispara pelos degraus 2, 3 e 4 · cartão dos três números', tocar: tocar2, fim: FIM[2] },
      { nome: 'pedra no degrau 5 · "Os dados estavam incompletos." · volta um degrau e a IA o leva de volta', tocar: tocar3, fim: FIM[3] },
      { nome: 'a luz da IA enfraquece no degrau 1 e no degrau 6 · o herói sobe o último sozinho · cartão dos estudos', tocar: tocar4, fim: FIM[4] },
      { nome: 'topo · "Fase concluída" · o prêmio falha por um instante · "Você entregaria isso ao seu chefe agora?"', tocar: tocar5, fim: FIM[5] }
    ]
  });
})();
