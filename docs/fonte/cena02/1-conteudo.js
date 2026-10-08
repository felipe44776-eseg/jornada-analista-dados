/* ================================================================
   CENA 02 · Mundo 2 — O aliado: a IA entra no jogo
   Conteúdo: roteiro.md, seção 02. Não mudar números nem os textos marcados "texto exato".
   Templo, herói, aliado, HUD, pedra, lasca, cartão, aposta e prêmio vêm da camada de jogo (fonte\jogo-*.js).
   Parte 1: conteúdo do roteiro e geometria própria da cena.
   Ciano: só a faísca e o que ela toca (degrauzinhos acesos, o risco escrito nas tabuletas, o fio que puxa o herói).
   ================================================================ */
(() => {
  const { E, html, svg } = Deck.util;
  const { GY, TH, SR, tier, BASE, pouso, rota } = Templo.geo, M = Jogo.mover;
  const FASES = Templo.FASES, VIDAS = 5, CIANO = '#00A1B8';

  /* ---------- conteúdo (roteiro) ---------- */
  const CAB = { eyebrow: 'Mundo 2', titulo: 'O aliado: a IA entra no jogo' };
  const JOGADORES = ['Analista', { nome: 'IA', ia: true }];
  /* aposta do passo 1: as opções são da aposta, não são dados. A certa (25%) só aparece no passo 2 */
  const APOSTA = { pergunta: 'Com IA, quanto mais rápido?', opcoes: ['10%', '25%', '50%'], certa: 1 };
  /* cartão do passo 2 (texto exato): "25% mais rápido · 12% mais tarefas · mais de 40% de qualidade" */
  const TRES = {
    numeros: [{ antes: '', n: '25%', depois: 'mais rápido' }, { antes: '', n: '12%', depois: 'mais tarefas' }, { antes: 'mais de', n: '40%', depois: 'de qualidade' }],
    rodape: "758 consultores do BCG, em tarefas que a IA faz bem (Dell'Acqua et al., 2023)"
  };
  /* cartão do passo 4 (texto exato): "Estudos sobre IA no ciclo de dados: 41 tratam de análise exploratória · 3, de definir o problema · 1, de implantação" */
  const ESTUDOS = {                                                         // os <br> são só quebra de linha: evitam palavra órfã
    cab: 'Estudos sobre IA <br>no ciclo de dados',
    linhas: [{ n: '41', t: 'tratam de análise exploratória' }, { n: '3', t: 'de definir o problema' }, { n: '1', t: 'de implantação' }],
    rodape: 'mapeamento sistemático <br>de Chintakunta et al., 2025'
  };
  /* pedra do passo 3: texto exato (ilustrativa, a mesma pedra 1 do mundo 1); `linhas` é só a quebra de linha */
  const PEDRA = { linhas: ['Os dados estavam', 'incompletos.'], lasca: ['Os dados estavam incompletos.'] };
  const FRASE3 = 'Voltar ainda acontece. Só ficou barato.', FRASE4 = 'O primeiro e o último degrau continuam seus.';
  const CONCLUIDA = ['Fase', 'concluída'], RESULTADO = 'Resultado', PERGUNTA = 'Você entregaria isso ao seu chefe agora?';
  /* prazo ao fim de cada passo, de 1 (cheio) a 0: ilustrativo, sem número na tela. Regra: "quase não cai" */
  const PRAZO = [1, 1, 0.96, 0.92, 0.86, 0.86];
  /* degraus em que a IA acende as tarefas e escreve as saídas: 2, 3 e 4 no passo 2; o 5 no passo 3.
     Os degraus 1 e 6 "continuam seus": ganham contorno branco no passo 4 */
  const DISPARO = [2, 3, 4], DEGRAU_DA_PEDRA = 5, SEUS = [1, 6];

  /* o quadro de partida: a tela "Continuar?" que fecha o mundo 1 (cena 01, passo 8). A troca de cena é corte seco,
     então esta cena redesenha aquele quadro em montar() e o desfaz no passo 0. Texto e posições copiados da cena 01 */
  const Q01 = {
    cab: { eyebrow: 'Incas e maias', titulo: 'CRISP-DM: o método antigo' },
    museu: ['Guia de 2000', `${FASES.length} fases · ${FASES.reduce((s, f) => s + f.tarefas, 0)} tarefas · ${FASES.reduce((s, f) => s + f.saidas, 0)} saídas`],
    manual: { cab: 'Manual do jogo · edição de 2000', linhas: ['Sem manutenção desde 2000. A versão 2.0 nunca saiu.', 'Sem método de garantia de qualidade.', 'Monitoramento: só o plano, sem fase para executar.', 'IA no processo: não prevista.'], x: 252, y: 150, largura: 612, rot: -1.2 },
    lascas: [['Os dados estavam incompletos.'], ['Os dados estavam errados.'], ['O modelo não funcionou.'], ['Seu chefe não entendeu.'], ['Demorou tanto que o cliente', 'não precisa mais.']],
    lascaY: [162, 214, 266, 318, 370], lascaRot: [-1.1, 0.8, -0.6, 1, -0.8],
    continuar: 'Continuar?', novoJogador: 'Novo jogador: IA', pergunta: 'E se a IA subisse os degraus?',
    sentado: { x: 826, y: GY }, vidas: 0, fase: 6, prazo: 0, veu: 0.76
  };

  /* ---------- geometria própria da cena (px do palco) ---------- */
  const lado = p => ({ x: p.x + 74, y: p.y - 96 });                       // a faísca parada ao lado do herói
  const pairo = k => ({ x: tier(k).x + 26, y: tier(k).y - 46 });          // onde ela para um instante ao fazer o degrau k
  const PRIMEIRA = k => FASES.slice(1, k - 1).reduce((s, f) => s + f.saidas, 0);   // 1ª tabuleta do degrau k na pilha (degrau 2 = 0)
  /* quadro final, combinado com a cena 03: herói em pouso(6), prêmio 96 px à esquerda (escala 1,1), aliado ao lado do herói */
  const TOPO = pouso(6), PREMIO = { x: TOPO.x - 96, y: TOPO.y, escala: 1.1 }, IA_TOPO = lado(TOPO);
  /* cintilações do brilho do prêmio: posição a partir do centro da taça e raio (ficam fora do título, do rótulo e do herói) */
  const CINTILA = [{ x: -56, y: -44, r: 11 }, { x: 42, y: -68, r: 9 }, { x: 34, y: 58, r: 8 }];
  const IA_ESQUIVA = { x: 300, y: 188 }, IA_FRACA = { x: 396, y: 246 }, IA_D1 = { x: 116, y: 526 }, IA_D6 = { x: 548, y: 222 };
  /* pedra: centro onde ela para e é lida; golpe até o herói no degrau 5 */
  const PG = { x: 716, y: 206, w: 312, h: 108, corpo: 28 }, GOLPE = { dx: -254, dy: 62, rot: -13, ms: 300 };
  const LASCA = { x: 890, y: 162, rot: -1.1 };
  /* painéis à direita do templo (aposta e cartões): não cobrem nenhum nome de fase */
  const PAINEL = { x: 700, y: 116, largura: 540 }, PAINEL4 = { x: 724, y: 112, largura: 516 };
  let r = null;                                                            // referências do DOM montado
