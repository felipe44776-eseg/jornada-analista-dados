
  /* ================= Parte 2: montagem (estado ANTES do passo 0) e estado final de cada passo ================= */
  function montar(palco) {
    const tp = Templo.criar(palco, { classe: 'c1', hora: 'escuro', construido: false, degrauzinhos: false, pilha: false });
    const H = tp.hud, novo = m => { const el = html(m); H.appendChild(el); return el; };
    r = { tp, mundo: tp.mundo };
    /* no plano do templo, acima dos atores: lascas, pedras grandes e o "Volta!" */
    r.lascas = PEDRAS.map((p, i) => Jogo.lasca(tp.topo, { linhas: p.lasca, x: 890, y: LASCA_Y[i], rot: LASCA_ROT[i] }));
    r.pedras = PEDRAS.map((p, i) => Jogo.pedra(tp.topo, Object.assign({ linhas: p.linhas, semente: 11 + i }, PG[i])));
    r.grito = html('<div class="c1-grito"></div>'); tp.topo.appendChild(r.grito);
    /* acima do mundo, na ordem de empilhamento */
    r.cab = novo('<header class="c1-cab c1-sombra"><span class="c1-eyebrow">Incas e maias</span><h1 class="c1-titulo">CRISP-DM: o método antigo</h1></header>');
    r.museu = novo(`<div class="c1-museu"><b>Guia de 2000</b> ${FASES.length} fases · ${TOT_T} tarefas · ${TOT_S} saídas</div>`);
    r.contT = novo('<div class="c1-cont c1-cont-t c1-sombra"><b>0</b><span>tarefas</span></div>');
    r.contS = novo('<div class="c1-cont c1-cont-s c1-sombra"><b>0</b><span>saídas para documentar</span></div>');
    r.legVolta = novo('<p class="c1-leg c1-leg-volta c1-sombra">Voltar é a regra. O guia não diz quando.</p>');
    r.goC = novo('<div class="c1-go"></div>'); r.go = Jogo.gameOver(r.goC);
    r.manual = Jogo.cartao(H, { cabecalho: MANUAL.cab, linhas: MANUAL.linhas.map((x, i) => ({ n: (i + 1) + '.', t: x, destaque: i === 3 })), x: 252, y: 150, largura: 612, rot: -1.2 });
    r.p2 = novo('<div class="c1-p2"><i></i><span>Novo jogador: IA</span></div>');
    r.fimq = novo('<p class="c1-leg c1-fimq c1-sombra">E se a IA subisse os degraus?</p>');
    r.abre = novo(`<div class="c1-abre"><svg ${S}>${desLaje()}<g class="c1-abre-heroi"></g></svg></div>`);
    Jogo.logo(H);
    /* camada de jogo: HUD, herói e telas */
    r.hud = Jogo.hud(H, { vidas: VIDAS, fases: FASES.map(f => f.nome) });
    r.h = Jogo.heroi(tp.atores, { escala: 1 });
    r.h0 = Jogo.heroi(r.abre.querySelector('.c1-abre-heroi'), { escala: 2.3 }).por(302, 525);
    Jogo.titulo(r.abre, { mundo: 'Mundo 1 · Incas e maias', nome: 'A jornada do analista de dados', dica: 'Espaço para começar' });
    r.cont = Jogo.continuar(H, 'Continuar?', 3); r.cont.el.classList.add('c1-continuar');
    r.contTn = r.contT.querySelector('b'); r.contSn = r.contS.querySelector('b');
    estadoInicial();
  }
  function desmontar() { r = null; }

  /* ---------- estado: tudo o que fim() usa ---------- */
  const op = (el, v) => { el.style.opacity = v; };
  const tf = (el, v) => { el.style.transform = v; };
  const num = (el, v) => { el.textContent = v; };
  function heroiEm(p, estado) { r.h.por(p.x, p.y).estado(estado || 'parado').alerta(false).mostrar(true); }
  /* "Volta!" acima do herói, na fase para onde ele foi jogado; i < 0 esconde */
  function grito(i) {
    if (i < 0) { op(r.grito, 0); return; }
    const p = pouso(PEDRAS[i].volta);
    num(r.grito, PEDRAS[i].grito); r.grito.style.left = (p.x + 8) + 'px'; r.grito.style.top = (p.y - 174) + 'px'; op(r.grito, 1);
  }

  function estadoInicial() {                                             // o templo já nasce no escuro, sem degraus
    [r.abre, r.cab, r.museu, r.contT, r.contS, r.legVolta, r.goC, r.p2, r.fimq, r.grito, r.cont.el].forEach(el => op(el, 0));
    r.manual.definir({ visivel: false });
    r.hud.definir({ visivel: false, vidas: VIDAS, fase: 1, prazo: 1 });
    r.h.por(BASE.x, BASE.y).estado('parado').mostrar(false);
    r.tp.camera(0, 8, 0.05, true);
  }
  /* estado final de um passo de pedra (passos 3 a 6): lasca cravada, herói na fase de volta, HUD */
  function fimPedra(i) {
    return function () {
      const p = PEDRAS[i];
      if (i === 0) { op(r.contT, 0); op(r.contS, 0); r.tp.camera(0, 0, 0, true); }
      r.lascas[i].fixar(); heroiEm(pouso(p.volta)); grito(i);
      r.hud.definir({ vidas: VIDAS - 1 - i, fase: p.volta, prazo: PRAZO[3 + i] });
      if (i === 3) op(r.legVolta, 1);
    };
  }
  /* estado final de cada passo: só o que o passo muda. Idempotente. */
  const FIM = [
    function fim0() { op(r.abre, 1); },
    function fim1() {
      r.tp.hora('amanhecer'); r.tp.construido(true); op(r.abre, 0);
      op(r.cab, 1); tf(r.cab, 'none'); op(r.museu, 1); tf(r.museu, 'none');
      r.hud.definir({ visivel: true, vidas: VIDAS, fase: 1, prazo: PRAZO[1] }); heroiEm(BASE);
      r.tp.camera(0, 0, 0, true);
    },
    function fim2() {
      r.tp.degrauzinhos(true); r.tp.pilha(true);
      op(r.contT, 1); op(r.contS, 1); num(r.contTn, TOT_T); num(r.contSn, TOT_S);
      r.hud.definir({ prazo: PRAZO[2] }); r.tp.camera(8, 0, 0, true);
    },
    fimPedra(0), fimPedra(1), fimPedra(2), fimPedra(3),
    function fim7() {
      op(r.legVolta, 0); grito(-1); r.lascas[4].fixar(); heroiEm(SENTADO, 'derrotado');
      r.hud.definir({ vidas: 0, fase: PEDRAS[4].fase, prazo: PRAZO[7] });
      op(r.goC, 1); tf(r.goC, 'none');
    },
    function fim8() {                                                   // tela de derrota: o mundo escurece e os nomes das fases somem
      op(r.goC, 0); op(r.tp.veu, 0.76); r.tp.nomes(false);
      r.manual.definir({ visivel: true });
      op(r.cont.el, 1); tf(r.cont.el, 'none'); r.cont.gastar(3); r.cont.espera(false);
      op(r.p2, 1); tf(r.p2, 'none'); op(r.fimq, 1); tf(r.fimq, 'none');
    }
  ];
