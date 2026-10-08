/* ================================================================
   CENA 04 · Mundo 4 — O mapa: herói e aliado jogam juntos
   Conteúdo: roteiro.md, seção 04. Não mudar números nem os textos marcados "texto exato".
   Herói, segunda pessoa, aliado, auditor, pedra, baú, cartão, aposta, prêmio e HUD vêm da camada de jogo.
   O mapa, o zoom, o portão, as bandeiras e a cópia fantasma são desta cena.
   Parte 1: conteúdo do roteiro e geometria.
   ================================================================ */
(() => {
  const { E, html, svg } = Deck.util, M = Jogo.mover;
  const n1 = v => Math.round(v * 10) / 10, lim = v => Math.max(0, Math.min(1, v));

  /* ---------- conteúdo (roteiro) ---------- */
  const REGIOES = ['1 · Enquadrar', '2 · Reunir', '3 · Explorar', '4 · Comprovar', '5 · Comunicar'];
  /* as 13 etapas; r = região; critico = portão ★ depois dela; a 06 é condicional (desvio) */
  const ETAPAS = [
    { n: '00', nome: 'Kickoff', r: 0 }, { n: '01', nome: 'Problema e decisão', r: 0, critico: true },
    { n: '02', nome: 'Dados internos', r: 1 }, { n: '03', nome: 'Dados externos', r: 1, critico: true }, { n: '04', nome: 'Preparação e partição', r: 1 },
    { n: '05', nome: 'Exploração e pré-registro', r: 2, critico: true }, { n: '06', nome: 'Modelagem', r: 2, desvio: true },
    { n: '07', nome: 'Testes confirmatórios', r: 3 }, { n: '08', nome: 'Validação e triangulação', r: 3, critico: true },
    { n: '09', nome: 'Insights e storyline', r: 4 }, { n: '10', nome: 'Deck técnico', r: 4 }, { n: '11', nome: 'Deck executivo', r: 4, critico: true }, { n: '12', nome: 'Entrega e retrospectiva', r: 4 }
  ];
  const N = ETAPAS.length;
  const CRITICOS = ETAPAS.map((e, i) => e.critico ? i : -1).filter(i => i >= 0);                       // G1, G3, G5, G8, G11
  const POR_REGIAO = REGIOES.map((_, k) => ETAPAS.map((e, i) => e.r === k ? i : -1).filter(i => i >= 0));
  /* o fluxo de cada etapa: a linha na tela é "L · Nome — dono: faz" (texto exato) */
  const CICLO = [
    { l: 'P', nome: 'Planejar', dono: 'IA', ia: true, faz: 'diz o que espera antes de rodar' },
    { l: 'E', nome: 'Executar', dono: 'IA', ia: true, faz: 'código salvo, número gravado por script' },
    { l: 'V', nome: 'Verificar', dono: 'IA', ia: true, faz: 'testes, reexecução, expectativa contra resultado' },
    { l: 'D', nome: 'Decidir', dono: 'humano', ia: false, faz: 'aprova, ajusta ou manda voltar' }
  ];
  const PAPEIS = [
    { t: 'Aliado · IA analista: planeja, executa, verifica', destaque: true },
    { t: 'Auditor · outra IA, em sessão limpa: só confere, numa cópia', destaque: true },
    'Herói · humano: decide em todo portão',
    'Segunda pessoa: revisa os 5 portões ★'
  ];
  const APOSTA = {
    pergunta: 'Mesmos modelos, mesmos prompts. Só muda o processo. As falhas críticas caem de 72% para quanto?', opcoes: ['50%', '30%', '16%'], certa: 2,
    resposta: 'de 72% para 16%', rodape: '280 execuções com 3 portões humanos e o cálculo feito em código (HLER, Zhu et al., 2026)'
  };
  const PLACAS = ['5 fases · 13 etapas', '13 portões · 5 críticos, com segunda pessoa'];
  const FRASES = {
    ponte: 'Você precisa de um mapa.',                                    // última frase do mundo 3: a cena abre saindo dela
    decide: 'A IA planeja, executa e verifica. Só o humano decide.', salvo: 'O jogo salvo mora nos arquivos, não na conversa.',
    volta: 'Voltar ainda acontece. Agora só até o último portão.', sorteio: 'No portão, você sorteia dois números e manda rodar o código de novo.',
    armadilha: 'O número que a IA não calculou não passa do portão.', fecho: 'A IA acelera. O método protege.'
  };
  const PEDRA = { linhas: ['Os dados estavam', 'incompletos.'], lasca: ['Os dados estavam incompletos.'] };
  const VIDAS = 5, PASSOS = 12;
  /* ao fim de cada passo (0 a 10): a etapa do HUD, o prazo (ilustrativo, sem número) e os portões já abertos */
  const ETAPA_FIM = [0, 0, 0, 0, 1, 3, 3, 3, 8, 8, 8, 12];
  const PRAZO = [1, 1, 0.97, 0.96, 0.92, 0.78, 0.76, 0.74, 0.56, 0.56, 0.56, 0.36];
  const ABERTOS = [[], [], [], [0], [0], [0, 1, 2], [0, 1, 2], [0, 1, 2], [0, 1, 2, 3, 4, 5, 7], [0, 1, 2, 3, 4, 5, 7], [0, 1, 2, 3, 4, 5, 7], [0, 1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12]];
  const CONF = [0, 1, 2, 3, 4, 5, 7, 8];                                  // o que o auditor confere na cópia: o percorrido até a etapa 08 (a 06 não rodou)

  /* ---------- geometria do mapa (px do palco, câmera em repouso) ----------
     Duas fileiras, da esquerda para a direita. Cada etapa é uma placa de 4 casas; depois de cada uma, um portão. */
  const Y = [316, 530];                                                   // onde os pés ficam em cada fileira
  const X0 = 62, PASSO = 158, PL = 104, CEL = 23, VAO = 4, ALT = 24, TR = 12;   // TR = eixo do trilho abaixo do piso
  const DESVIO = { x: 1046, y: 258 };                                     // a etapa 06 fica fora do caminho principal
  const lugar = i => i === 6 ? DESVIO : { x: X0 + (i < 6 ? i : i - 7) * PASSO, y: Y[i < 6 ? 0 : 1] };
  const casa = (i, k) => { const p = lugar(i); return { x: p.x + CEL / 2 + k * (CEL + VAO), y: p.y }; };   // meio da casa k (0 a 3)
  const portao = i => { const p = lugar(i); return { x: p.x + PL + 27 + (i === 6 ? 2 : 0), y: p.y }; };
  const CAIXAS = [{ x: 44, w: 320, f: 0 }, { x: 372, w: 466, f: 0 }, { x: 846, w: 398, f: 0 }, { x: 44, w: 320, f: 1 }, { x: 372, w: 632, f: 1 }].map(c => Object.assign(c, { y: Y[c.f] - 136, h: 200 }));
  const META = { x: 1126, w: 100 };
  const EIXO = [Y[0] + TR, Y[1] + TR], EIXO_D = DESVIO.y + TR;
  const RAMAL = `M1002,${EIXO[0]} C1026,${EIXO[0]} 1022,${EIXO_D} 1046,${EIXO_D} H1198 C1222,${EIXO_D} 1218,${EIXO[0]} 1242,${EIXO[0]}`;
  /* onde o nome de cada etapa aparece no passo 1: N = na linha do número, A e B = dois níveis acima da placa */
  const NIVEL = ['N', 'A', 'A', 'B', 'A', 'N', 'A', 'A', 'B', 'A', 'B', 'A', 'N'];
  const INICIO = { x: 50, y: Y[0] }, CHEGADA = { x: 1062, y: Y[1] }, PREMIO = { x: 1176, y: Y[1] };
  const ENTREGA = { x: 593, y: 246 }, BAU = { x: 622, y: Y[0] }, DADOS = [{ x: 536, y: 208 }, { x: 562, y: 202 }], BALAO = { x: 598, y: 218 };
  const APOSTA_X = 255, APOSTA_SAI = 215;                                 // a aposta espera no centro; no passo 10 desliza para a esquerda e a resposta entra ao lado
  /* a faísca ao lado do herói no mapa: à direita quando ele está no começo de uma placa, atrás quando está diante de um portão */
  const lado = T => ({ x: T.x + 40, y: T.y - 70 }), atras = T => ({ x: T.x - 36, y: T.y - 62 }), lado8 = T => ({ x: T.x + 42, y: T.y - 60 });

  /* ---------- dentro da etapa (passos 2 e 3): quatro casas e o portão ---------- */
  const YP = 372, ZX = [140, 388, 636, 884], ZW = 232, ZH = 92;
  const SZ = (ZX[3] + ZW - ZX[0]) / PL;                                   // quanto a placa cresce para virar as quatro casas
  const PZ = { x: 1174, y0: 206 }, GRADE_SOBE = YP - PZ.y0 - 16;
  const ZENT = { x: 84, y: YP }, ZV = { x: 790, y: YP }, ZD = { x: 990, y: YP }, ZPORTA = { x: 1086, y: 300 };
  const ladoZ = P => ({ x: P.x + 78, y: P.y - 112 }), toque = k => ({ x: ZX[k] + ZW / 2, y: YP - 56 });

  /* ---------- passo 8: a câmera recua e a cópia fantasma aparece ao lado ---------- */
  const CAM0 = { x: 0, y: 0, s: 1 }, CAM8 = { x: 16, y: 96, s: 0.48 }, FANT = { x: 640, y: 96, s: 0.48 };
  const naCopia = i => { const p = lugar(i); return { x: FANT.x + (p.x + PL / 2) * FANT.s, y: FANT.y + p.y * FANT.s - 40 }; };
  const AUD = naCopia(8);
  let r = null;                                                           // tudo o que a cena montou
