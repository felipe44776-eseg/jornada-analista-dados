
  /* ================= Parte 4: passos 7 e 8 e o registro da cena ================= */
  function tocar7(ctx) {                                                 // última vida: sobe de uma vez; o prazo zera; pedra 5; fim de jogo
    const s = ctx.som, tp = r.tp, pedra = r.pedras[4], T6 = pouso(6), SOBE = 1900;
    const G = { dx: 178, dy: 22, rot: 15, ms: 250, recuo: 320, recuoPara: 'translate(-38px,-6px) rotate(-7deg)' };
    ctx.anim(r.grito, some, 220); ctx.anim(r.legVolta, some, 350);
    M.andar(ctx, r.h, rota(1, 6), SOBE, { atraso: 200, curva: E.inQuad, inv: Math.sqrt, marcas: marcasDeFase(ctx, 1, 6), ganho: 0.3 });
    r.hud.gastarPrazo(ctx, 0, SOBE, 200);
    /* a pedra 5 chega devagar e sem som, pela esquerda */
    const tTopo = 200 + SOBE, tE = tTopo + 150, tL = tE + pedra.chegar(ctx, 'esquerda', tE), tG = tL + 1700, tI = tG + G.recuo + G.ms;
    ctx.em(tTopo, () => { s.ambiente({ vento: 0 }, 0.3); s.bipe({ freq: 220, dur: 0.2, ganho: 0.1 }); pulso(ctx, r.hud.el.querySelector('.jg-prazo'), 1.14); });   // o prazo zerou: silêncio
    ctx.em(tE + 450, () => r.h.alerta(true));
    let bob = null; ctx.em(tL, () => { bob = pedra.flutuar(ctx); });
    ctx.em(tG, () => { if (bob) bob.cancel(); pedra.golpear(ctx, G); });
    ctx.em(tI, () => {
      s.pedra({ ganho: 1, freq: 40 }); ctx.tremor(r.mundo, 15, 400);
      tp.poeira(ctx, T6.x, T6.y - 20, 12, 1.4); tp.estilhacos(ctx, T6.x - 10, T6.y - 70, 14, 1.3);
      pedra.desfazer(ctx, G);
      r.h.alerta(false).estado('atingido');
      voarLasca(ctx, 4, T6.x, T6.y - 62);
      ctx.em(120, () => { r.hud.perderVida(ctx); s.vida({ tom: 0.6 }); });
      /* cai pelo outro lado, quicando nos degraus, até sentar ao pé da pilha */
      ctx.em(140, () => M.rolar(ctx, r.h, QUEDA_DIR, 1150, { voltas: 3, sentido: 1, quique: 18, saltos: 6, curva: E.inQuad,
        aoQuicar: Q => { s.passo({ ganho: 0.5 }); ctx.tremor(r.mundo, 3, 120); tp.poeira(ctx, Q.x, Q.y, 3, 0.6); },
        fim: () => { tp.poeira(ctx, SENTADO.x, GY - 2, 8, 1); ctx.tween(320, e => r.h.mistura('rolando', 'derrotado', e), { curva: E.outCubic, fim: () => r.h.estado('derrotado') }); } }));
      ctx.em(520, () => s.derrota());
      const tGO = 140 + 1150 + 100;
      ctx.anim(r.goC, [{ opacity: 0, transform: 'scale(2.4)' }, { opacity: 1, transform: 'scale(.94)', offset: 0.7 }, { opacity: 1, transform: 'scale(1)' }], { duration: 430, delay: tGO, easing: 'cubic-bezier(.5,0,.8,.4)' });
      ctx.em(tGO + 300, () => { ctx.tremor(r.mundo, 6, 240); s.tambor({ freq: 48, ganho: 0.9, dur: 0.7 }); });
      ctx.em(tGO + 1150, ctx.concluir);
    });
  }
  function tocar8(ctx) {                                                 // tela de derrota: manual do jogo, Continuar?, novo jogador
    const s = ctx.som;
    ctx.anim(r.tp.veu, [{ opacity: 0 }, { opacity: 0.76 }], { duration: 700, easing: 'ease-out' });
    ctx.anim(r.tp.rotulos, some, { duration: 500 });                      // os nomes das fases somem: nada vaza por trás do cartão
    ctx.anim(r.goC, [{ opacity: 1, transform: 'translateY(0px) scale(1)' }, { opacity: 0, transform: 'translateY(-40px) scale(.8)' }], { duration: 420, easing: 'ease-in' });
    r.manual.entrar(ctx, 300);
    MANUAL.linhas.forEach((_, i) => {
      const t = 1050 + i * 620;
      r.manual.revelar(ctx, i, t);
      ctx.em(t, () => s.clac({ tom: i === 3 ? 1.3 : 0.9, ganho: 0.3 }));
    });
    /* Continuar? com três bipes; cada bipe gasta um pino */
    const tC = 1050 + 4 * 620 + 500;
    r.cont.gastar(0); r.cont.espera(true);
    ctx.anim(r.cont.el, [{ opacity: 0, transform: 'scale(.7)' }, { opacity: 1, transform: 'scale(1.08)', offset: 0.7 }, { opacity: 1, transform: 'scale(1)' }], { duration: 320, delay: tC, easing: 'ease-out' });
    [0, 1, 2].forEach(k => ctx.em(tC + 250 + k * 600, () => { s.bipe({ freq: k === 2 ? 660 : 880 }); r.cont.gastar(k + 1); }));
    /* entra o segundo jogador */
    const tP = tC + 250 + 3 * 600;
    ctx.em(tP, () => { r.cont.espera(false); s.novoJogador(); });
    ctx.anim(r.p2, [{ opacity: 0, transform: 'translateX(90px) scale(.9)' }, { opacity: 1, transform: 'translateX(-8px) scale(1.06)', offset: 0.7 }, { opacity: 1, transform: 'translateX(0px) scale(1)' }], { duration: 420, delay: tP, easing: 'ease-out' });
    ctx.anim(r.fimq, [{ opacity: 0, transform: 'translateY(14px) scale(.96)' }, { opacity: 1, transform: 'translateY(0px) scale(1)' }], { duration: 700, delay: tP + 900, easing: 'cubic-bezier(.2,.7,.2,1)' });
    ctx.em(tP + 900 + 700 + 500, ctx.concluir);
  }

  Deck.registrar({
    id: '01',
    titulo: '01 · Mundo 1 — Incas e maias: o CRISP-DM',
    notas: {
      fala: '"Este é o jogo que todo analista de dados jogou até ontem. O mundo 1 é o CRISP-DM, o método que a gente aprende até hoje, e o guia é de 2000. Seis fases, vinte e quatro tarefas, quarenta e duas saídas para documentar. Vocês têm cinco vidas e um prazo. [pedras] Os dados vieram incompletos: volta. Vieram errados: volta. O modelo não funcionou: volta. Seu chefe não entendeu: volta ao começo. E quando você finalmente chega lá em cima, demorou tanto que o cliente não precisa mais. O próprio guia avisa que voltar é a regra; só não diz quando. E o manual do jogo nunca foi atualizado: a versão 2.0 foi abandonada antes de sair, não tem método de garantia de qualidade, o monitoramento é só um plano e IA, claro, não existe ali. Não é um método ruim: é a espinha de tudo que veio depois. Mas foi desenhado para um mundo em que cada degrau era subido à mão. Continuar?" (cerca de 2 min, com as perguntas à turma)',
      interacao: 'Antes de cada pedra (passos 3 a 7), perguntar: "o que derruba o analista nesta fase?". Ouvir duas ou três respostas e só então apertar a tecla. A pedra revela a resposta do jogo.',
      rastreio: [
        'Tudo em pesquisa/01-frameworks-de-processo.md.',
        '6 fases, 24 tarefas, 42 saídas e a divisão por fase: §1.6 (tabela completa do reference model).',
        'Guia de 2000; versão 2.0 descontinuada antes de sair; site inativo: §1.1.',
        'Voltar é a regra: "Moving back and forth between different phases is always required", §1.5. "Little guidance on how to know when to loop back": §11, crítica 1.',
        'Garantia de qualidade ("lacks guidance on quality assurance methodology", Studer et al.): §7 e §11, crítica 5.',
        'Monitoramento só como plano: §1.6 (nota da p. 33 do guia) e §11, crítica 4.',
        'IA: nenhum framework de 2000 a 2021 trata LLM ou agente como executor do processo: §15.1.',
        'Ilustrativo, sem fonte: os textos das cinco pedras, o número de vidas e a barra de prazo. As voltas das pedras 1, 3 e 4 coincidem com as setas de retorno do diagrama oficial (2→1, 4→3, 5→1; §1.5); a da pedra 2 não é seta do diagrama.'
      ]
    },
    montar, desmontar,
    passos: [
      { nome: 'tela de título; espera a primeira tecla', ambiente: { vento: 0 }, tocar: tocar0, fim: FIM[0] },
      { nome: 'amanhece, o templo sobe, o HUD entra, o herói nasce', ambiente: { vento: 0.55 }, tocar: tocar1, fim: FIM[1] },
      { nome: 'missões: 24 tarefas e 42 saídas', tocar: tocar2, fim: FIM[2] },
      { nome: 'pedra 1 na fase 2 · "Os dados estavam incompletos." · volta à fase 1', tocar: tocarPedra(0), fim: FIM[3] },
      { nome: 'pedra 2 na fase 3 · "Os dados estavam errados." · volta à fase 2', tocar: tocarPedra(1), fim: FIM[4] },
      { nome: 'pedra 3 na fase 4 · "O modelo não funcionou." · volta à fase 3', tocar: tocarPedra(2), fim: FIM[5] },
      { nome: 'pedra 4 na fase 5 · "Seu chefe não entendeu." · volta ao início', tocar: tocarPedra(3), fim: FIM[6] },
      { nome: 'pedra 5 no topo · "Demorou tanto que o cliente não precisa mais." · GAME OVER', ambiente: { vento: 0 }, tocar: tocar7, fim: FIM[7] },
      { nome: 'manual do jogo, Continuar?, novo jogador: IA', tocar: tocar8, fim: FIM[8] }
    ]
  });
})();
