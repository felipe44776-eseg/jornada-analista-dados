
  /* ================= Parte 2: montagem (estado ANTES do passo 0) e estado final de cada passo ================= */
  const novo = (pai, m) => { const el = html(m); pai.appendChild(el); return el; };

  /* a tela "Continuar?" do mundo 1, redesenhada. Tudo dentro de dois invólucros, que o fim do passo 0 remove */
  function quadroDoMundo1(tp) {
    const q = { hud: novo(tp.hud, '<div class="c02-q01"></div>'), topo: novo(tp.topo, '<div class="c02-q01"></div>') };
    q.cab = Jogo.cabecalho(q.hud, Q01.cab); q.cab.definir(true);
    q.museu = novo(q.hud, `<div class="c02-q01-museu"><b>${Q01.museu[0]}</b> ${Q01.museu[1]}</div>`);
    q.manual = Jogo.cartao(q.hud, { cabecalho: Q01.manual.cab, linhas: Q01.manual.linhas.map((t, i) => ({ n: (i + 1) + '.', t, destaque: i === 3 })), x: Q01.manual.x, y: Q01.manual.y, largura: Q01.manual.largura, rot: Q01.manual.rot });
    q.manual.definir({ visivel: true });
    q.p2 = novo(q.hud, `<div class="c02-q01-p2"><i></i><span>${Q01.novoJogador}</span></div>`);
    q.fimq = Jogo.frase(q.hud, { texto: Q01.pergunta, acento: true }); q.fimq.definir(true);
    q.cont = Jogo.continuar(q.hud, Q01.continuar, 3); q.cont.el.classList.add('c02-q01-cont'); q.cont.gastar(3);
    q.lascas = Q01.lascas.map((linhas, i) => { const l = Jogo.lasca(q.topo, { linhas, x: LASCA.x, y: Q01.lascaY[i], rot: Q01.lascaRot[i] }); l.fixar(); return l; });
    return q;
  }

  function montar(palco) {
    const tp = Templo.criar(palco, { classe: 'c02', hora: 'amanhecer', construido: true, degrauzinhos: true, pilha: true });
    const H = tp.hud;
    r = { tp };
    /* luz da IA sobre os lances de degrauzinhos e contorno dos degraus "seus": SVG no plano do templo, sob a pilha e os atores */
    r.marcas = svg('g', { class: 'c02-marcas' });
    r.marcas.innerHTML = `<defs><radialGradient id="c02-brilho"><stop offset="0" stop-color="${CIANO}" stop-opacity=".6"/><stop offset=".55" stop-color="${CIANO}" stop-opacity=".2"/><stop offset="1" stop-color="${CIANO}" stop-opacity="0"/></radialGradient></defs>`
      + [1, 2, 3, 4, 5, 6].map(k => { const T = tier(k); return `<ellipse class="c02-luz" cx="${T.x - SR / 2}" cy="${T.y + TH / 2}" rx="54" ry="50" fill="url(#c02-brilho)" style="opacity:0"/>`; }).join('')
      + SEUS.map(k => { const T = tier(k), w = T.w - 4, h = T.h - 4; return `<rect class="c02-seu" x="${T.x + 2}" y="${T.y + 2}" width="${w}" height="${h}" rx="2" fill="#fff" fill-opacity=".1" stroke="#fff" stroke-width="3.2" stroke-dasharray="${2 * (w + h)}" style="opacity:0"/>`; }).join('');
    tp.pilhaG.parentNode.insertBefore(r.marcas, tp.pilhaG);
    r.luz = Array.from(r.marcas.querySelectorAll('.c02-luz')); r.seus = Array.from(r.marcas.querySelectorAll('.c02-seu'));
    r.riscos = tp.tabs.map(t => { const l = t.children[2]; l.classList.add('c02-risco'); return l; });   // a linha escrita de cada tabuleta
    r.corTarefa = tp.tarefas[0].firstElementChild.getAttribute('fill');
    /* o quadro de partida fica por baixo do que é desta cena */
    r.q = quadroDoMundo1(tp);
    /* no plano do templo, acima dos atores: lasca, pedra e o rótulo do prêmio */
    r.lasca = Jogo.lasca(tp.topo, { linhas: PEDRA.lasca, x: LASCA.x, y: LASCA.y, rot: LASCA.rot });
    r.pedra = Jogo.pedra(tp.topo, Object.assign({ linhas: PEDRA.linhas, semente: 11 }, PG));
    r.rotulo = novo(tp.topo, `<div class="c02-rotulo">${RESULTADO}</div>`);
    /* acima do mundo */
    r.cab = Jogo.cabecalho(H, CAB);
    r.aposta = Jogo.aposta(H, Object.assign({}, APOSTA, PAINEL));
    /* cartão dos três números: a moldura é o cartão da camada de jogo; os números grandes são desenho da cena */
    r.tres = Jogo.cartao(H, Object.assign({ linhas: [], rodape: TRES.rodape, rot: -1 }, PAINEL));
    r.tres.el.insertBefore(html(`<div class="c02-tres">${TRES.numeros.map(x => `<div class="c02-num"><i>${x.antes}</i> <b>${x.n}</b> <span>${x.depois}</span></div>`).join('')}</div>`), r.tres.rodape);
    r.nums = Array.from(r.tres.el.querySelectorAll('.c02-num'));
    /* cartão dos estudos: mesma moldura, com o número de cada linha em corpo grande */
    r.estudos = Jogo.cartao(H, Object.assign({ cabecalho: ESTUDOS.cab, linhas: [], rodape: ESTUDOS.rodape, rot: 0.9 }, PAINEL4));
    r.estL = ESTUDOS.linhas.map(l => { const el = html(`<div class="c02-est-l"><b>${l.n}</b> <span>${l.t}</span></div>`); r.estudos.el.insertBefore(el, r.estudos.rodape); return el; });
    r.frase3 = Jogo.frase(H, { texto: FRASE3 }); r.frase4 = Jogo.frase(H, { texto: FRASE4 });
    r.pergunta = Jogo.frase(H, { texto: PERGUNTA, y: 642 }); r.pergunta.el.classList.add('c02-pergunta');   // grande e branca: o ciano fica só com a faísca
    r.fc = novo(H, '<div class="c02-fc"></div>'); Jogo.gameOver(r.fc, CONCLUIDA.join(' <br>'));
    Jogo.logo(H);
    r.hud = Jogo.hud(H, { vidas: VIDAS, fases: FASES.map(f => f.nome), jogadores: JOGADORES });
    r.cor = Array.from(r.hud.el.querySelectorAll('.jg-cor svg'));          // os corações, para a animação de recarga do passo 0
    /* atores: a ordem de criação é a de empilhamento. O brilho do prêmio é desenho da cena e fica atrás dele:
       halo que pulsa, raios que giram e três cintilações, em branco (parado=1 deixa tudo imóvel e à vista) */
    r.brilho = svg('g', { class: 'c02-brilho', transform: `translate(${PREMIO.x},${PREMIO.y - 70 * PREMIO.escala})` });
    r.brilho.innerHTML = `<defs><radialGradient id="c02-halo"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset=".6" stop-color="#ECEDFF" stop-opacity=".16"/><stop offset="1" stop-color="#ECEDFF" stop-opacity="0"/></radialGradient>
        <radialGradient id="c02-raio" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="80"><stop offset=".4" stop-color="#fff" stop-opacity=".8"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
      <circle class="c02-halo" r="76" fill="url(#c02-halo)"/>
      <g class="c02-raios" fill="url(#c02-raio)">${Array.from({ length: 12 }, (_, i) => `<polygon points="-6,-30 0,${i % 2 ? -62 : -80} 6,-30" transform="rotate(${i * 30})"/>`).join('')}</g>
      ${CINTILA.map((c, i) => `<path class="c02-cintila" style="animation-delay:${-i * 0.5}s" fill="#fff" d="M${c.x},${c.y - c.r} L${c.x + c.r * 0.24},${c.y - c.r * 0.24} L${c.x + c.r},${c.y} L${c.x + c.r * 0.24},${c.y + c.r * 0.24} L${c.x},${c.y + c.r} L${c.x - c.r * 0.24},${c.y + c.r * 0.24} L${c.x - c.r},${c.y} L${c.x - c.r * 0.24},${c.y - c.r * 0.24} Z"/>`).join('')}`;
    tp.atores.appendChild(r.brilho);
    r.premio = Jogo.premio(tp.atores, { escala: PREMIO.escala });
    r.premio.el.style.transformOrigin = `${PREMIO.x}px ${PREMIO.y}px`;     // para o prêmio crescer a partir da base
    r.h = Jogo.heroi(tp.atores, { escala: 1 });
    r.ia = Jogo.aliado(tp.atores, { escala: 1 });
    estadoInicial();
  }
  function desmontar() { r = null; }

  /* ---------- estado: tudo o que fim() usa ---------- */
  const op = (el, v) => { el.style.opacity = v; };
  const tf = (el, v) => { el.style.transform = v; };
  function heroiEm(p, estado) { r.h.por(p.x, p.y).estado(estado || 'parado').alerta(false).mostrar(true); }
  function iaEm(p, estado) { r.ia.por(p.x, p.y).estado(estado || 'parada').mostrar(true); }
  /* a linha da tabuleta j escrita pela IA: mais grossa e em ciano */
  function escrita(j, v) {
    const l = r.riscos[j];
    r.tp.tabs[j].classList.toggle('c02-escrita', v);
    l.style.fill = v ? CIANO : ''; l.style.opacity = v ? 1 : ''; l.setAttribute('y', v ? -0.4 : 0.4); l.setAttribute('height', v ? 2.6 : 1.3);
  }
  const tabsDe = k => Array.from({ length: FASES[k - 1].saidas }, (_, i) => PRIMEIRA(k) + i);
  /* degrau k feito pela IA: degrauzinhos acesos em ciano, com a luz por cima, e as saídas escritas na pilha */
  function degrauDaIA(k, v) {
    r.tp.tarefasK[k - 1].forEach(g => { g.classList.toggle('c02-acesa', v); g.firstElementChild.style.fill = v ? CIANO : ''; });
    op(r.luz[k - 1], v ? 1 : 0);
    tabsDe(k).forEach(j => { const el = r.tp.tabs[j]; escrita(j, v); op(el, v ? 1 : 0); tf(el, el._fim); });
  }

  function estadoInicial() {                                             // o quadro "Continuar?" do mundo 1: véu, HUD zerado, herói derrotado
    const L = lado(BASE);
    op(r.tp.veu, Q01.veu); r.tp.nomes(false);
    op(r.rotulo, 0); op(r.fc, 0); op(r.brilho, 0);
    r.hud.definir({ visivel: true, vidas: Q01.vidas, fase: Q01.fase, prazo: Q01.prazo, jogadores: false });
    r.h.por(Q01.sentado.x, Q01.sentado.y).estado('derrotado').mostrar(true);
    r.ia.por(L.x, L.y).estado('parada').mostrar(false);
    r.premio.por(PREMIO.x, PREMIO.y).estado('inteiro').mostrar(false);
  }
  /* estado final de cada passo: só o que o passo muda. Idempotente. */
  const FIM = [
    function fim0() {                                                    // o mundo reinicia: pilha vazia, HUD cheio, herói na base, faísca ao lado
      r.q.hud.remove(); r.q.topo.remove();
      op(r.tp.veu, 0); r.tp.nomes(true); r.tp.pilha(false);
      r.cab.definir(true);
      r.hud.definir({ visivel: true, vidas: VIDAS, fase: 1, prazo: PRAZO[0], jogadores: true });
      heroiEm(BASE); iaEm(lado(BASE));
    },
    function fim1() { r.aposta.definir({ visivel: true, revelada: false }); r.aposta.el.classList.add('c02-espera'); },
    function fim2() {
      r.aposta.el.classList.remove('c02-espera'); r.aposta.definir({ visivel: false, revelada: true });
      DISPARO.forEach(k => degrauDaIA(k, true));
      r.tres.definir({ visivel: true });
      heroiEm(pouso(4)); iaEm(lado(pouso(4)));
      r.hud.definir({ fase: 4, prazo: PRAZO[2] });
    },
    function fim3() {
      r.tres.definir({ visivel: false });
      degrauDaIA(DEGRAU_DA_PEDRA, true); r.lasca.fixar();
      heroiEm(pouso(5)); iaEm(lado(pouso(5)));
      r.hud.definir({ vidas: VIDAS - 1, fase: 5, prazo: PRAZO[3] });
      r.frase3.definir(true);
    },
    function fim4() {
      r.lasca.fixar(false); r.frase3.definir(false);
      r.seus.forEach(el => { op(el, 1); el.style.strokeDashoffset = 0; });
      heroiEm(TOPO); iaEm(IA_FRACA, 'fraca');
      r.estudos.definir({ visivel: true });
      r.hud.definir({ fase: 6, prazo: PRAZO[4] });
      r.frase4.definir(true);
    },
    function fim5() {                                                    // quadro final: é daqui que a cena 03 parte
      r.estudos.definir({ visivel: false }); r.frase4.definir(false);
      heroiEm(TOPO); iaEm(IA_TOPO);
      r.premio.por(PREMIO.x, PREMIO.y).estado('inteiro').mostrar(true); tf(r.premio.el, 'none'); op(r.brilho, 1);
      op(r.fc, 1); tf(r.fc, 'none'); op(r.rotulo, 1); tf(r.rotulo, 'none');
      r.pergunta.definir(true);
      r.hud.definir({ prazo: PRAZO[5] });
    }
  ];
