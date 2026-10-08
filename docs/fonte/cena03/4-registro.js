
  /* ================= Parte 4: o registro da cena ================= */
  Deck.registrar({
    id: '03',
    titulo: '03 · Mundo 3 — O trapaceiro: a IA erra com convicção',
    notas: {
      fala: '"Era falso. E esse é o problema do segundo jogador: ele não joga contra você, ele te entrega presentes. [baú 1] \'Achei a fonte.\' Entre três e treze por cento das URLs que esses modelos citam não existem. [baú 2] \'Já calculei.\' Um número plausível, sem rodar código nenhum. [baú 3] \'Você tem razão.\' Quando o analista-IA é instruído a confirmar, o veredito muda de trinta e quatro a sessenta e seis pontos percentuais. [baú 4] \'Deu significativo.\' Testou dezenas de recortes e mostrou o que deu. Nenhuma dessas falhas é exótica; todas aparecem na primeira semana de uso. E tem a pior. No experimento do BCG, nas tarefas em que a IA é boa, quem usou IA entregou com mais de quarenta por cento de qualidade a mais. Mas havia uma tarefa escolhida por estar fora do que ela faz bem, e nessa quem usou IA errou mais: sem IA, oitenta e quatro por cento acertaram; com IA, entre sessenta e setenta. São dezenove pontos a menos, por confiar na resposta errada. E quem usa não enxerga a linha entre uma coisa e outra. A IA não avisa quando erra. Vocês precisam de um mapa." (cerca de 2 min)',
      interacao: 'Nos baús 1 e 3 a entrega e a abertura são passos separados (1 e 2; 4 e 5): com o baú fechado na tela, perguntar "abre ou não abre?", contar as mãos e só então apertar a tecla. O tempo da pausa é do apresentador, não da animação. Nos baús 2 e 4, seguir direto, para o ritmo não cair.',
      rastreio: [
        'As quatro falhas e os três números: apresentacao/roteiro.md, slide 02, que rastreia para pesquisa/03-ia-na-analise-de-dados.md §3.1, §4.1 e §4.3.',
        'Fora do que a IA faz bem (1 tarefa escolhida para isso), 19 p.p. a menos de soluções corretas: o controle acertou cerca de 84,5%; os dois grupos com IA, 60% e 70%. pesquisa/03 §3.1.',
        'Os três números (3% a 13%, 34 a 66 p.p., 19 p.p.) foram conferidos em 2026-10-08 contra pesquisa/03 §4.1, §4.3 e §3.1. Não foram reabertos na fonte primária.',
        'Ilustrativo, sem fonte: as quatro falas da IA entre aspas, os baús e a ordem das armadilhas. No slide 02 do deck anterior o baú 4 dizia "50 recortes"; aqui virou "dezenas", porque o 50 não tem fonte.',
        'Ilustrativo, sem fonte (como no mundo 1): o número de vidas e a barra de prazo. Quanto o prazo cai a cada passo é escolha da cena, não está no roteiro.',
        'Cuidado: a IA não vira vilã. A faísca tem o mesmo brilho no acerto e no erro: é esse o ponto da cena.'
      ]
    },
    montar, desmontar,
    passos: [
      { nome: 'o prêmio falha, se desfaz e a noite cai · título', ambiente: { vento: 0.25 }, tocar: tocar0, fim: FIM[0] },
      { nome: 'a IA entrega o baú 1 · "Achei a fonte." · fechado, esperando: "abre ou não abre?"', tocar: tocarEntrega(0), fim: FIM[1] },
      { nome: 'o herói abre o baú 1 · Inventa a fonte · 3% a 13%', tocar: tocarAbre(0), fim: FIM[2] },
      { nome: 'baú 2, entrega e abertura · "Já calculei." · Calcula de cabeça', tocar: tocarInteiro(1), fim: FIM[3] },
      { nome: 'a IA entrega o baú 3 · "Você tem razão." · fechado, esperando: "abre ou não abre?"', tocar: tocarEntrega(2), fim: FIM[4] },
      { nome: 'o herói abre o baú 3 · Concorda com você · 34 a 66 p.p.', tocar: tocarAbre(2), fim: FIM[5] },
      { nome: 'baú 4, entrega e abertura · "Deu significativo." · Testa até dar', tocar: tocarInteiro(3), fim: FIM[6] },
      { nome: 'a fronteira: a linha só aparece depois que ele cruza · cartão do BCG', tocar: tocar7, fim: FIM[7] },
      { nome: 'última vida piscando · "A IA não avisa quando erra." · "Você precisa de um mapa."', ambiente: { vento: 0 }, tocar: tocar8, fim: FIM[8] }
    ]
  });
})();
