/* ================================================================
   CAMADA DE JOGO · OFICINA: folhas com os componentes, para julgar o desenho sem abrir uma cena
     ?oficina=1  personagens: herói (8 estados), aliado (5 estados), auditor
     ?oficina=2  peças: HUD com 2 jogadores, pedra e lasca, baú (3 estados), cartão, aposta
     ?oficina=3  comuns às cenas 02 a 04: HUD de etapas, cabeçalho, prêmio, balão, segunda pessoa, frases
     ?heroi=1    o herói sozinho, ampliado
   Na folha, ← e → trocam de página.
   ================================================================ */
const Oficina = (() => {
  const { html, svg } = Deck.util;
  function base(palco, titulo) {
    const raiz = html(`<div class="jg-oficina"><svg width="1280" height="720" viewBox="0 0 1280 720"></svg><h1>${titulo}</h1></div>`);
    palco.appendChild(raiz); return { raiz, S: raiz.querySelector('svg') };
  }
  const rot = (raiz, x, y, t) => raiz.appendChild(html(`<span class="jg-of-r" style="left:${x}px;top:${y}px">${t}</span>`));
  const tit = (raiz, x, y, t) => raiz.appendChild(html(`<span class="jg-of-t" style="left:${x}px;top:${y}px">${t}</span>`));
  const chao = (S, y) => S.appendChild(svg('path', { d: `M0,${y} H1280`, stroke: '#8E90C8', 'stroke-width': 2, opacity: 0.45 }));

  function personagens(palco) {
    const { raiz, S } = base(palco, 'Oficina 1 de 2 · personagens');
    tit(raiz, 40, 66, 'Herói · o analista de dados');
    chao(S, 262);
    [['parado', 0], ['andando', 0.12], ['subindo', 0.14], ['atingido', 0], ['piscando', 0], ['rolando', 0.1], ['levantando', 0.35], ['derrotado', 0]].forEach(([nome, fase], i) => {
      const x = 80 + i * 152, h = Jogo.heroi(S, { escala: 1.15 });
      h.por(x, nome === 'rolando' ? 258 : 262).estado(nome === 'piscando' ? 'parado' : nome, fase);
      if (nome === 'piscando') h.el.style.opacity = 0.35;
      rot(raiz, x + 6, 268, nome);
    });
    tit(raiz, 40, 316, 'Aliado · a IA: faísca ciano com rastro');
    [['parada', 0], ['voando', -22], ['disparando', 0], ['fraca', 0], ['entregando', 0]].forEach(([nome, ang], i) => {
      const x = 96 + i * 232 + (nome === 'disparando' ? 70 : 0), a = Jogo.aliado(S, { escala: 1.2 }).por(x, 404).estado(nome, { ang });
      if (nome === 'entregando') { const o = a.oferta(); Jogo.bau(S, { escala: 0.5 }).por(o.x, o.y + 12); }
      rot(raiz, nome === 'entregando' ? x - 70 : x, 462, nome);
    });
    tit(raiz, 40, 540, 'Auditor · outra IA: a mesma faísca, só contorno');
    [['parada', 0], ['voando', -22], ['disparando', 0], ['fraca', 0]].forEach(([nome, ang], i) => {
      const x = 96 + i * 232 + (nome === 'disparando' ? 70 : 0);
      Jogo.aliado(S, { escala: 1.2, auditor: true }).por(x, 622).estado(nome, { ang });
      rot(raiz, x, 676, nome);
    });
    /* os três juntos, no tamanho em que entram em cena */
    tit(raiz, 1010, 540, 'Em cena, escala 1');
    chao(S, 700);
    Jogo.heroi(S, { escala: 1 }).por(1060, 700).estado('parado');
    Jogo.aliado(S, { escala: 1 }).por(1128, 616).estado('parada');
    Jogo.aliado(S, { escala: 1, auditor: true }).por(1210, 616).estado('parada');
  }

  function pecas(palco) {
    const { raiz, S } = base(palco, 'Oficina 2 de 2 · peças');
    const hud = Jogo.hud(raiz, { vidas: 5, fases: Templo.FASES.map(f => f.nome), jogadores: ['Analista', { nome: 'IA', ia: true }] });
    hud.el.style.top = '62px'; hud.definir({ visivel: true, vidas: 3, fase: 2, prazo: 0.6, jogadores: true });
    tit(raiz, 40, 160, 'Pedra com motivo e lasca');
    Jogo.pedra(raiz, { linhas: ['Os dados estavam', 'incompletos.'], x: 200, y: 252, w: 312, h: 108, corpo: 28, semente: 11 }).mostrar(true);
    Jogo.lasca(raiz, { linhas: ['Os dados estavam incompletos.'], x: 40, y: 322, rot: -1.1 }).fixar();
    tit(raiz, 40, 392, 'Baú');
    chao(S, 640);
    [['fechado', 96], ['armadilha', 230], ['exposto', 372]].forEach(([nome, x]) => { Jogo.bau(S, { escala: 0.95 }).por(x, 640).estado(nome); rot(raiz, x, 650, nome); });
    tit(raiz, 430, 160, 'Cartão de texto');
    Jogo.cartao(raiz, { cabecalho: 'Manual do jogo', linhas: [{ n: '1.', t: 'Sem método de garantia de qualidade.' }, { n: '2.', t: 'IA no processo: não prevista.', destaque: true }, 'Linha sem número.'],
      rodape: 'Rodapé: fonte e recorte do número', x: 430, y: 194, largura: 376, rot: 0 }).definir({ visivel: true });
    tit(raiz, 836, 160, 'Aposta · antes e depois');
    const ap = { pergunta: 'Com IA, quanto mais rápido?', opcoes: ['10%', '25%', '50%'], certa: 1, largura: 414 };
    Jogo.aposta(raiz, Object.assign({ x: 836, y: 194 }, ap)).definir({ visivel: true });
    Jogo.aposta(raiz, Object.assign({ x: 836, y: 428 }, ap)).definir({ visivel: true, revelada: true });
  }

  /* o que as cenas 02 a 04 dividem: cabeçalho, frases, balão, prêmio, segunda pessoa, palco em camadas */
  function comuns(palco) {
    const c = Jogo.camadas(palco, { classe: 'jg-of3' }), raiz = c.hud;
    raiz.appendChild(html('<div class="jg-of-h">Oficina 3 de 3 · comuns às cenas 02 a 04</div>'));
    const hud = Jogo.hud(raiz, { vidas: 5, fases: ['Kickoff', 'Problema e decisão', 'Dados internos', 'Dados externos'], rotulos: { fase: 'Etapa' }, formato: n => String(n - 1).padStart(2, '0'), jogadores: ['Analista', { nome: 'IA', ia: true }] });
    hud.el.style.top = '62px'; hud.definir({ visivel: true, vidas: 5, fase: 4, prazo: 0.85, jogadores: true });
    const cab = Jogo.cabecalho(raiz, { eyebrow: 'Mundo 2', titulo: 'O aliado: a IA entra no jogo' }); cab.el.style.top = '128px'; cab.definir(true);
    tit(raiz, 56, 236, 'Prêmio · inteiro, falha, desfeito'); chao(c.desenho, 420);
    [['inteiro', 110], ['falha', 290], ['desfeito', 470]].forEach(([nome, x]) => { Jogo.premio(c.atores, { escala: 1.1 }).por(x, 420).estado(nome); rot(raiz, x, 428, nome); });
    tit(raiz, 640, 236, 'Balão de fala · IA e pessoa');
    Jogo.balao(raiz, { texto: 'Achei a fonte.', x: 700, y: 330 }).definir(true); Jogo.aliado(c.atores, { escala: 1 }).por(668, 356).estado('parada');
    Jogo.balao(raiz, { texto: 'Fala de pessoa', x: 964, y: 330, ia: false }).definir(true);
    tit(raiz, 880, 392, 'Herói e segunda pessoa'); chao(c.desenho, 604);
    Jogo.heroi(c.atores, { escala: 1 }).por(1050, 604).estado('parado'); Jogo.heroi(c.atores, { escala: 1, colega: true }).por(1140, 604).estado('parado');
    Jogo.aliado(c.atores, { escala: 1, auditor: true }).por(1224, 520).estado('parada');
    tit(raiz, 56, 470, 'Frases de pé de tela');
    Jogo.frase(raiz, { texto: 'Voltar ainda acontece. Só ficou barato.', y: 520 }).definir(true);
    Jogo.frase(raiz, { texto: 'A IA acelera. O método protege.', acento: true }).definir(true);
    Jogo.logo(raiz);
  }

  /* o templo à noite (mundo 3), com os atores no topo: a noite escurece céu e pedra, não quem está em cena */
  function noite(palco) {
    const tp = Templo.criar(palco, { hora: 'noite', construido: true, degrauzinhos: true, pilha: true }), p = Templo.geo.pouso(6);
    tp.hud.appendChild(html('<div class="jg-of-h">Oficina 4 de 4 · templo à noite: Templo.criar(palco, { hora: \'noite\' })</div>'));
    Jogo.premio(tp.atores, { escala: 1.1 }).por(p.x - 96, p.y).estado('falha');
    Jogo.heroi(tp.atores, { escala: 1 }).por(p.x, p.y).estado('parado');
    const a = Jogo.aliado(tp.atores, { escala: 1 }).por(p.x + 70, p.y - 150).estado('entregando'), o = a.oferta();
    Jogo.bau(tp.atores, { escala: 0.8 }).por(o.x, o.y + 34).estado('fechado');
    Jogo.balao(tp.topo, { texto: 'Achei a fonte.', x: p.x + 100, y: p.y - 176 }).definir(true);
    Jogo.logo(tp.hud);
  }

  function abrir(palco, qual) {
    const PAGINAS = { 1: personagens, 2: pecas, 3: comuns, 4: noite, heroi: Heroi.folha }, N = 4;
    let atual = PAGINAS[qual] ? String(qual) : '1';
    const pintar = () => { palco.replaceChildren(); PAGINAS[atual](palco); };
    pintar();
    addEventListener('keydown', e => {
      if (atual === 'heroi' || !['ArrowRight', 'ArrowLeft', ' '].includes(e.key)) return;
      atual = String(e.key === 'ArrowLeft' ? (+atual + N - 2) % N + 1 : +atual % N + 1); pintar();
    });
  }
  return { abrir };
})();
