/* ================================================================
   CENA 03 · Mundo 3 — O trapaceiro: a IA erra com convicção
   Conteúdo: roteiro.md, seção 03. Não mudar números nem os textos marcados "texto exato".
   Templo, HUD, herói, aliado, prêmio, baú, balão, cartão, lasca e frase vêm da camada de jogo (fonte\jogo-*.js).
   Parte 1: conteúdo do roteiro e geometria própria da cena.
   ================================================================ */
(() => {
  const { E, svg, rng } = Deck.util;
  const { pouso } = Templo.geo, M = Jogo.mover;

  /* ---------- conteúdo (roteiro) ---------- */
  const VIDAS = 5, FASE = 6;                                 // o herói está no topo: fase 6/6
  /* os quatro baús: fala da IA (balão), nome e texto da armadilha (cartão) e número (rodapé do cartão). Texto exato.
     O <b> e o <i> só marcam ênfase: o texto lido é o do roteiro. */
  const BAUS = [
    { fala: 'Achei a fonte.', nome: 'Inventa a fonte', texto: 'cita dataset, tabela ou URL que não existe.',
      numero: '<b>3% a 13%</b> das URLs citadas por LLMs não existem (Rao et al., 2026)' },
    { fala: 'Já calculei.', nome: 'Calcula de cabeça', texto: 'devolve um número plausível sem ter executado código.' },
    { fala: 'Você tem razão.', nome: 'Concorda com você', texto: 'confirma a hipótese de quem pergunta.',
      numero: '<b>34 a 66 p.p.:</b> quanto muda o veredito de um analista-IA quando a persona vira confirmatória (Bertran et al., <i>PNAS</i>, 2026)' },
    { fala: 'Deu significativo.', nome: 'Testa até dar', texto: 'roda dezenas de recortes e mostra o que "deu".' }
  ];
  const FRONTEIRA = {
    linhas: ['<b>Onde a IA é boa:</b> quem usou IA entregou com mais de 40% de qualidade a mais', '<b>Onde ela não é:</b> quem usou IA errou mais. Acerto de 84,5% sem IA e de 60% a 70% com IA'],
    rodape: 'quem usa não vê a linha (Dell\'Acqua et al., 2023; 758 consultores do BCG)'
  };
  const FRASES = ['A IA não avisa quando erra.', 'Você precisa de um mapa.'];
  /* os 9 passos do roteiro. `bau` = índice do baú em cena. `espera` = o baú chegou e fica fechado até a tecla
     (baús 1 e 3: a pausa da pergunta "abre ou não abre?" é do apresentador); sem `espera`, o passo termina com a armadilha aberta */
  const PASSOS = [
    {},                                                      // 0 · o prêmio era falso; a noite cai
    { bau: 0, espera: true },                                // 1 · a IA entrega o baú 1
    { bau: 0 },                                              // 2 · o herói abre o baú 1
    { bau: 1 },                                              // 3 · baú 2, entrega e abertura
    { bau: 2, espera: true },                                // 4 · a IA entrega o baú 3
    { bau: 2 },                                              // 5 · o herói abre o baú 3
    { bau: 3 },                                              // 6 · baú 4, entrega e abertura
    { fronteira: true },                                     // 7 · a fronteira
    { fronteira: true, fecho: true }                         // 8 · última vida
  ];
  /* quantos baús já foram abertos ao fim de cada passo: 0, 0, 1, 2, 2, 3, 4, 4, 4. A vida só cai na abertura */
  const ABERTOS = PASSOS.map((_, p) => PASSOS.slice(0, p + 1).filter(q => q.bau != null && !q.espera).length);
  /* prazo ao fim de cada passo, de 1 (cheio) a 0: ilustrativo, sem número na tela. O roteiro não fixa: escolha da cena.
     Cada armadilha e a queda na fronteira custam um pouco de tempo; aqui quem acaba são as vidas, não o prazo */
  const PRAZO = [1, 1, 0.86, 0.72, 0.72, 0.58, 0.44, 0.34, 0.34];

  /* ---------- geometria própria da cena (px do palco) ---------- */
  const TOPO = pouso(6), TY = TOPO.y;                        // (660, 280): quadro combinado com o fim da cena 02
  const PREMIO = { x: 564, y: TY, escala: 1.1 };
  const lado = x => ({ x: x + 74, y: TY - 96 });             // a faísca parada ao lado do herói: (734, 184) no início
  /* o topo só tem 200 px (510 a 710). O presente chega no ar, à direita, na luz da faísca;
     cada armadilha joga o herói um pouco mais para trás, até a beira */
  const RECUO = [TOPO.x, 636, 608, 578, 546];                // x do herói com 0, 1, 2, 3 e 4 baús abertos
  const ABRE = 684;                                          // onde ele para para abrir o baú
  const BAU = { x: 760, y: 284, escala: 0.85 };
  const ENTREGA = { x: BAU.x - 42, y: BAU.y - 104 };         // a faísca com o feixe aceso sobre o baú
  const FALA = { x: 838, y: 216 };                           // a faísca ao lado do presente, falando
  const BALAO = { x: FALA.x + 28, y: FALA.y - 26 };
  const CARTAO = { x: 884, y: 206, largura: 366, rot: [-1, 0.8, -0.7, 1] };
  const MARCA = { x: 56, y: [166, 220, 274, 328], rot: [-1.1, 0.8, -0.6, 1] };
  /* a fronteira (passo 7): ele sai da beira, cruza a linha, pisa em falso e cai ali mesmo */
  const LINHA_X = 580, FALSO = 620, QUEDA = 664;
  let r = null;                                              // referências do DOM montado
