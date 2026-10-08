
  /* ================= Parte 3: montagem (estado ANTES do passo 0) e estado final de cada passo ================= */
  /* dia claro: o Templo só tem 'escuro', 'amanhecer' e 'noite'. A luz do dia é desta cena, por cima do amanhecer */
  const SOL = 'translate(24px,6px) scale(1.14)';             // o disco cresce e se afasta da faísca; não sobe, para não entrar atrás do título
  const LUZ = 0.16;                                           // quanto a pedra do templo clareia (tp.flashes)
  let r = null;                                               // referências do DOM montado

  function montar(palco) {
    const tp = Templo.criar(palco, { classe: 'c05', hora: 'amanhecer', construido: true, degrauzinhos: true, pilha: true });
    const H = tp.hud, novo = m => { const el = html(m); H.appendChild(el); return el; };
    r = { tp, palco };
    /* luz do dia: céu, raios e clarão entram no plano do céu, atrás do disco; a névoa clareia serra, mata e encosta, atrás do templo */
    r.ceu = html('<div class="c05-ceu"></div>'); r.raios = html('<div class="c05-raios"></div>'); r.clarao = html('<div class="c05-clarao"></div>');
    [r.ceu, r.raios, r.clarao].forEach(el => tp.planos[0].insertBefore(el, tp.halo));
    r.nevoa = html('<div class="c05-nevoa"></div>'); tp.mundo.insertBefore(r.nevoa, tp.noiteFundo);
    /* atores, na ordem de empilhamento: a trilha fica atrás do herói */
    r.trilha = svg('g', { class: 'c05-trilha' }); r.trilha.innerHTML = desTrilha(); tp.atores.appendChild(r.trilha);
    r.pontos = Array.from(r.trilha.querySelectorAll('.c05-ponto')); r.marcos = Array.from(r.trilha.querySelectorAll('.c05-marco')); r.fios = Array.from(r.trilha.querySelectorAll('.c05-fio'));
    r.h = Jogo.heroi(tp.atores, { escala: 1 });
    r.ia = Jogo.aliado(tp.atores, { escala: 1 });
    /* acima do mundo. No lugar do HUD de vidas (o jogo acabou): o contador de conquistas, com um encaixe por conquista */
    r.placar = novo(`<div class="c05-placar"><span class="c05-slots">${CONQUISTAS.map(c => `<span class="c05-slot">${OCO}${medalha(c.emblema)}</span>`).join('')}</span>
      <span class="c05-cont"><b>0/${N}</b> ${esc(TEXTO.contador)}</span></div>`);
    r.slots = Array.from(r.placar.querySelectorAll('.c05-slot')); r.cont = r.placar.querySelector('.c05-cont'); r.contN = r.cont.querySelector('b');
    r.cab = Jogo.cabecalho(H, { eyebrow: TEXTO.eyebrow, titulo: TEXTO.titulo });
    r.partida = novo('<div class="c05-partida"></div>'); Jogo.gameOver(r.partida, TEXTO.partida);
    r.avisos = CONQUISTAS.map(c => {
      const el = novo(desAviso(c)), q = s => el.querySelector(s);
      return { el, caixa: q('.c05-av-m'), med: q('.c05-medalha'), vivo: q('.c05-medalha .c05-vivo'), rot: q('.c05-av-r'), nome: q('.c05-av-nome'), etq: q('.c05-etq'), linha: q('.c05-av-l') };
    });
    r.painel = novo(`<div class="c05-painel">${CONQUISTAS.map(c => `<div class="c05-pn-item"><div class="c05-pn-m">${medalha(c.emblema)}</div><div class="c05-pn-nome">${esc(c.nome)}</div></div>`).join('')}</div>`);
    r.pnMed = Array.from(r.painel.querySelectorAll('.c05-pn-m')); r.pnNome = Array.from(r.painel.querySelectorAll('.c05-pn-nome'));
    r.pergunta = Jogo.frase(H, { texto: TEXTO.pergunta });
    r.cartao = Jogo.cartao(H, { cabecalho: CREDITOS.cabecalho, linhas: [CREDITOS.chamada].concat(CREDITOS.itens.map(t => ({ n: '·', t }))), x: 140, y: 300, largura: 1000, rot: -0.6 });
    r.cartao.el.classList.add('c05-creditos');
    r.end = html(desEndereco()); r.qr = html(desQr()); r.cartao.el.appendChild(r.end); r.cartao.el.appendChild(r.qr);
    r.autoria = html(`<div class="c05-autoria">${CREDITOS.autoria.map(a => `<div><span class="c05-au-r">${esc(a.rotulo)}</span><span class="c05-au-t">${esc(a.texto)}</span></div>`).join('')}</div>`);
    r.cartao.el.appendChild(r.autoria);
    Jogo.logo(H);
    estadoInicial();
  }
  function desmontar() { r = null; }

  /* ---------- estado: tudo o que fim() usa ---------- */
  const op = (el, v) => { el.style.opacity = v; };
  const tf = (el, v) => { el.style.transform = v; };
  /* dia claro ligado ou desligado, por cima da hora 'amanhecer' do templo */
  function dia(v) {
    [r.ceu, r.raios, r.clarao, r.nevoa].forEach(el => op(el, v ? 1 : 0));
    op(r.tp.est, v ? 0 : Templo.HORAS.amanhecer.est); tf(r.tp.disco, v ? SOL : 'none');
    r.tp.flashes.forEach(f => op(f, v ? LUZ : 0));
  }
  /* contador "n/5 conquistas" e os n primeiros encaixes cheios */
  function placar(n) { r.contN.textContent = n + '/' + N; r.slots.forEach((s, j) => s.classList.toggle('cheia', j < n)); }
  /* só o aviso i fica na tela; i < 0 esconde todos */
  function aviso(i) { r.avisos.forEach((a, j) => { op(a.el, j === i ? 1 : 0); tf(a.el, 'none'); }); }
  function trilha(v) { r.pontos.concat(r.marcos).forEach(el => op(el, v ? 1 : 0)); r.fios.forEach(f => { f.style.strokeDashoffset = v ? 0 : 1; op(f, 1); }); }
  function painel(v) { op(r.painel, v ? 1 : 0); tf(r.painel, 'none'); }

  function estadoInicial() {                                 // quadro de partida: o templo ao amanhecer, sem nomes, com a faixa "Fase concluída"
    dia(false); r.tp.nomes(false); trilha(false); aviso(-1); painel(false); placar(0);
    op(r.placar, 0); op(r.partida, 1); tf(r.partida, 'none');
    r.cartao.definir({ visivel: false });
    r.h.por(TOPO.x, TOPO.y).estado('parado').mostrar(true);
    r.ia.por(LADO.x, LADO.y).estado('parada').mostrar(true);
  }
  function fimConquista(i) {
    return function () {
      if (i === 0) r.tp.nomes(false);                        // o aviso fica por cima do templo: os nomes das fases somem
      aviso(i); placar(i + 1);
      if (CONQUISTAS[i].grande) { trilha(true); r.h.por(TOPO.x, TOPO.y).estado('parado'); }
    };
  }
  /* estado final de cada passo: só o que o passo muda. Idempotente. */
  const FIM = [
    function fim0() { op(r.partida, 0); dia(true); r.tp.nomes(true); r.cab.definir(true); op(r.placar, 1); tf(r.placar, 'none'); placar(0); }
  ].concat(CONQUISTAS.map((_, i) => fimConquista(i)), [
    function fim6() { aviso(-1); trilha(false); painel(true); r.pergunta.definir(true); },
    function fim7() { painel(false); r.pergunta.definir(false); r.cartao.definir({ visivel: true }); }
  ]);
