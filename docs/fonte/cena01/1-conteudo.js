/* ================================================================
   CENA 01 · Mundo 1 — Incas e maias: o CRISP-DM
   Conteúdo: roteiro.md, seção 01. Não mudar números nem os textos marcados "texto exato".
   Templo, herói, HUD, pedras, lascas e cartão vêm da camada de jogo (fonte\jogo-*.js).
   Parte 1: conteúdo do roteiro e geometria própria da cena.
   ================================================================ */
(() => {
  const { E, html } = Deck.util;
  const { GY, RL, tier, BASE, pouso, rota } = Templo.geo;

  /* ---------- conteúdo (roteiro) ---------- */
  const FASES = Templo.FASES;                                // os 6 degraus: nome, tarefas e saídas
  const TOT_T = FASES.reduce((s, f) => s + f.tarefas, 0);   // 24
  const TOT_S = FASES.reduce((s, f) => s + f.saidas, 0);    // 42
  const VIDAS = 5;
  /* as cinco pedras: texto exato; `linhas` é só a quebra de linha da pedra grande e da lasca.
     volta = fase para onde o herói é jogado (0 = fim de jogo) */
  const PEDRAS = [
    { fase: 2, volta: 1, grito: 'Volta!', linhas: ['Os dados estavam', 'incompletos.'], lasca: ['Os dados estavam incompletos.'] },
    { fase: 3, volta: 2, grito: 'Volta!', linhas: ['Os dados', 'estavam', 'errados.'], lasca: ['Os dados estavam errados.'] },
    { fase: 4, volta: 3, grito: 'Volta!', linhas: ['O modelo', 'não funcionou.'], lasca: ['O modelo não funcionou.'] },
    { fase: 5, volta: 1, grito: 'Volta ao início!', linhas: ['Seu chefe', 'não entendeu.'], lasca: ['Seu chefe não entendeu.'] },
    { fase: 6, volta: 0, grito: '', linhas: ['Demorou tanto que', 'o cliente não', 'precisa mais.'], lasca: ['Demorou tanto que o cliente', 'não precisa mais.'] }
  ];
  const MANUAL = { cab: 'Manual do jogo · edição de 2000', linhas: ['Sem manutenção desde 2000. A versão 2.0 nunca saiu.', 'Sem método de garantia de qualidade.', 'Monitoramento: só o plano, sem fase para executar.', 'IA no processo: não prevista.'] };
  /* prazo ao fim de cada passo, de 1 (cheio) a 0: ilustrativo, sem número na tela */
  const PRAZO = [1, 1, 0.94, 0.78, 0.62, 0.46, 0.12, 0, 0];

  /* ---------- geometria própria da cena (px do palco) ---------- */
  /* queda final: do topo pelo flanco direito até o chão, ao pé da pilha */
  const SENTADO = { x: 826, y: GY };
  const QUEDA_DIR = [pouso(6)].concat([5, 4, 3, 2, 1].map(k => ({ x: tier(k).x + tier(k).w - RL / 2, y: tier(k).y })), [SENTADO]);
  /* pedra grande: centro onde ela para e é lida, tamanho, corpo do texto; lasca: topo na coluna da encosta */
  const PG = [
    { x: 430, y: 226, w: 312, h: 108, corpo: 28 },
    { x: 455, y: 252, w: 164, h: 164, corpo: 26, redonda: true },
    { x: 640, y: 216, w: 284, h: 108, corpo: 28 },
    { x: 692, y: 214, w: 304, h: 122, corpo: 31 },
    { x: 450, y: 216, w: 292, h: 126, corpo: 25 }
  ];
  const LASCA_Y = [162, 214, 266, 318, 370], LASCA_ROT = [-1.1, 0.8, -0.6, 1, -0.8];
  const S = 'width="1280" height="720" viewBox="0 0 1280 720"';
  let r = null;                                               // referências do DOM montado

  function desLaje() {                                                   // laje sob o herói da tela de título
    return `<polygon points="196,522 404,522 420,534 420,566 408,578 200,578 184,566 184,534" fill="#0C1060"/>
      <polygon points="198,525 402,525 417,536 417,564 406,575 202,575 187,564 187,536" fill="#3A3F8C"/>
      <polygon points="198,525 402,525 417,536 187,536" fill="#C1C1E3" opacity=".4"/>
      <g fill="none" stroke="#8E90C8" stroke-width="2.4" opacity=".6"><rect x="212" y="544" width="20" height="20"/><rect x="218" y="550" width="8" height="8"/><path d="M370,564 V544 H390 V560 H376 V550 H384"/></g>`;
  }
