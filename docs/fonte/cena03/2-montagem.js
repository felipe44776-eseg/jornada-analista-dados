
  /* ================= Parte 2: montagem (estado ANTES do passo 0) e estado final de cada passo ================= */
  /* luz sob o presente (da IA, por isso ciano), a linha da fronteira e a faixa de chão que pisca no passo em falso */
  function desCenario() {
    const b = BAU, t = pouso(6);
    return `<defs><radialGradient id="c03-luz-g"><stop offset="0" stop-color="#00A1B8" stop-opacity=".75"/><stop offset=".6" stop-color="#00A1B8" stop-opacity=".25"/><stop offset="1" stop-color="#00A1B8" stop-opacity="0"/></radialGradient></defs>
      <g class="c03-luz"><ellipse cx="${b.x}" cy="${b.y + 7}" rx="70" ry="17" fill="url(#c03-luz-g)"/>
        <ellipse cx="${b.x}" cy="${b.y + 5}" rx="50" ry="8.5" fill="none" stroke="#00A1B8" stroke-width="2.4" opacity=".9"/></g>
      <rect class="c03-piso" x="${LINHA_X}" y="${TY - 1}" width="${t.x + 50 - LINHA_X}" height="7" fill="#ECEDFF"/>
      <g class="c03-linha"><path d="M${LINHA_X},${TY - 14} V${TY - 124}" fill="none" stroke="#00010F" stroke-width="9" stroke-linecap="round" stroke-dasharray="12 10" opacity=".6"/>
        <path d="M${LINHA_X},${TY - 14} V${TY - 124}" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-dasharray="12 10"/>
        <polygon points="${LINHA_X - 10},${TY} ${LINHA_X},${TY - 11} ${LINHA_X + 10},${TY} ${LINHA_X},${TY + 11}" fill="#fff" stroke="#00010F" stroke-width="1.8" stroke-linejoin="round"/></g>`;
  }
  /* brilhos do presente fechado, enquanto ele espera a tecla: piscam por CSS (c03-on); parados, ficam invisíveis */
  function desBrilhos() {
    return [[-8, -88, 0], [42, -70, 0.7], [26, -26, 1.3], [-24, -44, 1.8]].map(([dx, dy, atraso]) =>
      `<g transform="translate(${BAU.x + dx} ${BAU.y + dy})"><path class="c03-brilho" style="animation-delay:-${atraso}s" opacity="0" d="M0,-11 L2.6,-2.6 L11,0 L2.6,2.6 L0,11 L-2.6,2.6 L-11,0 L-2.6,-2.6 Z" fill="#fff" stroke="#00010F" stroke-width="1"/></g>`).join('');
  }
  function montar(palco) {
    const tp = Templo.criar(palco, { classe: 'c03', hora: 'amanhecer', construido: true, degrauzinhos: true, pilha: true });
    const H = tp.hud;
    r = { tp };
    /* acima do mundo, na ordem de empilhamento */
    r.cab = Jogo.cabecalho(H, { eyebrow: 'Mundo 3', titulo: 'O trapaceiro: a IA erra com convicção' });
    r.marcas = BAUS.map((b, i) => { const m = Jogo.lasca(H, { linhas: [b.nome], x: MARCA.x, y: MARCA.y[i], rot: MARCA.rot[i] }); m.el.classList.add('c03-marca'); return m; });
    r.cartoes = BAUS.map((b, i) => {
      const c = Jogo.cartao(H, { cabecalho: b.nome + ':', linhas: [b.texto], rodape: b.numero, x: CARTAO.x, y: CARTAO.y, largura: CARTAO.largura, rot: CARTAO.rot[i] });
      c.el.classList.add('c03-arm'); return c;
    });
    r.fronteira = Jogo.cartao(H, { linhas: FRONTEIRA.linhas, rodape: FRONTEIRA.rodape, x: CARTAO.x, y: CARTAO.y, largura: CARTAO.largura, rot: -0.8 });
    r.fronteira.el.classList.add('c03-front');
    r.frases = [Jogo.frase(H, { texto: FRASES[0], acento: true, y: 600 }), Jogo.frase(H, { texto: FRASES[1], y: 653 })];
    r.frases[1].el.classList.add('c03-fecho');
    Jogo.logo(H);
    r.hud = Jogo.hud(H, { vidas: VIDAS, fases: Templo.FASES.map(f => f.nome), jogadores: ['Analista', { nome: 'IA', ia: true }] });
    r.coracoes = Array.from(r.hud.el.querySelectorAll('.jg-cor svg'));
    /* atores, na ordem de empilhamento: cenário da cena, prêmio, baús, brilhos, herói, faísca */
    r.cenario = svg('g', { class: 'c03-cenario' }); r.cenario.innerHTML = desCenario(); tp.atores.appendChild(r.cenario);
    r.luz = r.cenario.querySelector('.c03-luz'); r.linha = r.cenario.querySelector('.c03-linha'); r.piso = r.cenario.querySelector('.c03-piso');
    r.premio = Jogo.premio(tp.atores, { escala: PREMIO.escala });
    r.baus = BAUS.map(() => Jogo.bau(tp.atores, { escala: BAU.escala }));
    r.fantasma = Jogo.bau(tp.atores, { escala: BAU.escala });               // os recortes que "não deram" (baú 4)
    r.brilhos = svg('g', { class: 'c03-brilhos' }); r.brilhos.innerHTML = desBrilhos(); tp.atores.appendChild(r.brilhos);
    r.h = Jogo.heroi(tp.atores, { escala: 1 });
    r.ia = Jogo.aliado(tp.atores, { escala: 1 });
    /* no plano do templo, acima dos atores: a fala da IA */
    r.baloes = BAUS.map(b => Jogo.balao(tp.topo, { texto: b.fala, x: BALAO.x, y: BALAO.y }));
    estadoInicial();
  }
  function desmontar() { r = null; }

  /* ---------- estado ---------- */
  const op = (el, v) => { el.style.opacity = v; };
  /* pose de abrir o baú: o braço da frente sobe até a tampa (a camada de jogo não tem essa pose).
     MAO = quanto do gesto está feito enquanto ele espera a tecla: a mão perto da tampa, sem tocar */
  const POSE_ABRE = { cA: 16, kA: 6, cB: -14, kB: 10, br: -20, ab: 14, bf: 82, tr: 10, cb: 4 }, MAO = 0.55;
  /* o herói da camada de jogo só olha para a direita. Para ele se virar, a cena espelha o <g> dele em torno do x dos pés */
  function heroiEm(x, y, virado) {
    r.h.el.setAttribute('transform', virado ? `translate(${Math.round(2 * x * 10) / 10},0) scale(-1,1)` : 'translate(0,0)');
    return r.h.por(x, y);
  }
  /* espera pela tecla (passos 1 e 4): o baú i flutua, a luz pulsa e os brilhos piscam. É animação CSS, que continua
     depois que o passo termina. Com parado=1 e na impressão ela não roda: fica o baú fechado na luz, que é o quadro do fim() */
  function esperar(i, v) {
    r.baus.forEach((b, k) => b.el.classList.toggle('c03-flutua', !!v && k === i));
    r.luz.classList.toggle('c03-pulsa', !!v); r.brilhos.classList.toggle('c03-on', !!v);
  }
  /* o quadro em que a cena 02 termina: amanhecer, herói no topo, prêmio inteiro, faísca parada ao lado. HUD já recarregado */
  function estadoInicial() {
    r.cab.definir(false);
    r.hud.definir({ visivel: true, vidas: VIDAS, fase: FASE, prazo: PRAZO[0], jogadores: true });
    r.premio.por(PREMIO.x, PREMIO.y).estado('inteiro').mostrar(true);
    heroiEm(TOPO.x, TY, false).estado('parado').alerta(false).mostrar(true);
    const l = lado(TOPO.x); r.ia.por(l.x, l.y).estado('parada').mostrar(true);
    r.baus.forEach(b => b.por(BAU.x, BAU.y).estado('fechado').mostrar(false));
    r.fantasma.por(BAU.x, BAU.y).estado('fechado').mostrar(false);
    [r.luz, r.linha, r.piso].forEach(el => op(el, 0));
  }
  /* estado final do passo p, inteiro e na hora. É absoluto (não depende do passo anterior), então o fim natural,
     o pulo e o link direto dão sempre no mesmo quadro */
  function estadoFinal(p) {
    const tp = r.tp, P = PASSOS[p], abertos = ABERTOS[p], marcas = p > 0 ? ABERTOS[p - 1] : 0;
    const temBau = P.bau != null, espera = !!P.espera, hx = P.fronteira ? QUEDA : espera ? ABRE : RECUO[abertos];
    tp.hora('noite'); tp.camera(0, 0, 0, true);
    r.cab.definir(true);
    r.premio.estado('desfeito').mostrar(false);
    r.hud.definir({ visivel: true, vidas: VIDAS - abertos, fase: FASE, prazo: PRAZO[p], jogadores: true });
    r.coracoes.forEach((c, i) => c.classList.toggle('c03-ultima', !!P.fecho && i === 0));
    /* depois do passo 0 o herói olha para onde o prêmio estava; à espera da tecla, está diante do baú com a mão estendida */
    heroiEm(hx, TY, p === 0).alerta(false).mostrar(true);
    if (espera) r.h.mistura('parado', POSE_ABRE, MAO); else r.h.estado('parado');
    const ia = temBau ? FALA : lado(hx);
    r.ia.por(ia.x, ia.y).estado('parada').mostrar(true);
    BAUS.forEach((_, i) => {
      const atual = P.bau === i;                                          // o baú deste passo: fechado (espera) ou aberto, com a fala
      r.baus[i].por(BAU.x, BAU.y).estado(atual && !espera ? 'armadilha' : 'fechado').mostrar(atual);
      r.baloes[i].definir(atual);
      r.cartoes[i].definir({ visivel: atual && !espera });                // o cartão só entra quando a armadilha abre
      r.marcas[i].fixar(i < marcas);                                      // no passo seguinte, o cartão vira a marca com o nome
    });
    r.fantasma.mostrar(false);
    esperar(P.bau, espera);
    op(r.luz, temBau ? 1 : 0); op(r.piso, 0);
    op(r.linha, P.fronteira ? 1 : 0); r.linha.style.transform = 'none';
    r.fronteira.definir({ visivel: !!P.fronteira });
    r.frases.forEach(f => f.definir(!!P.fecho));
  }
  const FIM = PASSOS.map((_, p) => () => estadoFinal(p));
