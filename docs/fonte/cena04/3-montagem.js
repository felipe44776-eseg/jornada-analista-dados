
  /* ================= Parte 3: montagem (estado ANTES do passo 0) e estado final de cada passo ================= */
  function montar(palco) {
    const c = Jogo.camadas(palco, { classe: 'c04' }), H = c.hud;
    const novo = (pai, m) => { const el = html(m); pai.appendChild(el); return el; };
    const q = s => c.raiz.querySelector(s), qa = s => Array.from(c.raiz.querySelectorAll(s));
    r = { c, cam: CAM0, rotulos: true };
    /* cenário: o mapa, a cópia fantasma e a vista de dentro da etapa. As classes c04-cam recebem a câmera */
    c.desenho.innerHTML = `<g class="c04-cam c04-mapa">${desMapa()}</g><g class="c04-fant" transform="translate(${FANT.x},${FANT.y}) scale(${FANT.s})">${desFantasma()}</g><g class="c04-cam c04-zoom">${desZoom()}</g>`;
    r.gmapa = q('.c04-mapa'); r.gfant = q('.c04-fant'); r.gzoom = q('.c04-zoom');
    r.caixas = qa('.c04-caixa'); r.pontos = qa('.c04-ponto'); r.luz = qa('.c04-luz'); r.portas = qa('.c04-porta'); r.bands = qa('.c04-band'); r.trava = q('.c04-trava');
    r.fpontos = qa('.c04-f-ponto'); r.casas = qa('.c04-casa'); r.grade = q('.c04-z-grade'); r.lampada = q('.c04-z-lampada');
    r.rmapa = novo(c.meio, `<div class="c04-cam c04-rotulos">${rotulosMapa()}</div>`);
    r.rzoom = novo(c.meio, `<div class="c04-cam c04-rotulos">${rotulosZoom()}</div>`);
    r.regs = qa('.c04-regiao'); r.nums = qa('.c04-num'); r.nomes = qa('.c04-nome'); r.letras = qa('.c04-letra'); r.ciclo = qa('.c04-ciclo');
    /* atores, na ordem de empilhamento: o que é do mapa (acompanha a câmera), os peões (tamanho fixo) e os de dentro da etapa */
    r.amapa = svg('g', { class: 'c04-cam' }); r.peoes = svg('g'); r.azoom = svg('g', { class: 'c04-cam' });
    c.atores.appendChild(r.amapa); c.atores.appendChild(r.peoes); c.atores.appendChild(r.azoom);
    r.colegas = CRITICOS.map(i => { const g = portao(i); return Jogo.heroi(r.amapa, { escala: 0.6, colega: true }).por(g.x + 20, g.y).estado('parado'); });
    r.premio = Jogo.premio(r.amapa, { escala: 0.9 }).por(PREMIO.x, PREMIO.y);
    r.bau = Jogo.bau(r.amapa, { escala: 0.55 }).por(BAU.x, BAU.y);
    const gd = svg('g'); gd.innerHTML = desDado(DADOS[0], [[-5, -5], [0, 0], [5, 5]]) + desDado(DADOS[1], [[-5, -5], [5, -5], [0, 0], [-5, 5], [5, 5]]); r.amapa.appendChild(gd);
    r.dados = Array.from(gd.querySelectorAll('.c04-dado'));
    r.h = Jogo.heroi(r.peoes, { escala: 0.66 }); r.ia = Jogo.aliado(r.peoes, { escala: 0.7 }); r.aud = Jogo.aliado(r.peoes, { escala: 0.7, auditor: true });
    r.hz = Jogo.heroi(r.azoom, { escala: 1.15 }); r.iaz = Jogo.aliado(r.azoom, { escala: 1.15 });
    /* no plano do mapa, acima dos atores */
    r.lasca = Jogo.lasca(c.topo, { linhas: PEDRA.lasca, x: 880, y: 112, rot: -1 });
    r.pedra = Jogo.pedra(c.topo, { linhas: PEDRA.linhas, x: 1090, y: 142, w: 300, h: 88, corpo: 26, semente: 11 });
    r.balao = Jogo.balao(c.topo, { texto: 'Já calculei.', x: BALAO.x, y: BALAO.y });
    /* acima do mundo: cabeçalho, placas, frases, cartões, aposta, HUD */
    r.cab = Jogo.cabecalho(H, { eyebrow: 'Mundo 4', titulo: 'O mapa: 13 etapas, 13 portões' });
    r.placas = PLACAS.map(t => novo(H, `<div class="c04-placa">${t}</div>`));
    r.fPonte = Jogo.frase(H, { texto: FRASES.ponte, y: 653 }); r.fPonte.el.classList.add('c04-ponte');   // no mesmo lugar e corpo em que a cena 03 a deixa
    r.fDecide = Jogo.frase(H, { texto: FRASES.decide }); r.fSalvo = Jogo.frase(H, { texto: FRASES.salvo }); r.fVolta = Jogo.frase(H, { texto: FRASES.volta });
    r.linha = novo(H, `<p class="c04-linha">${FRASES.sorteio}</p>`);
    r.fArmadilha = Jogo.frase(H, { texto: FRASES.armadilha }); r.fFecho = Jogo.frase(H, { texto: FRASES.fecho.replace('O método protege.', '<span class="c04-fecho-b">O método protege.</span>'), acento: true });   // "A IA acelera." em ciano, "O método protege." em branco
    r.papeis = Jogo.cartao(H, { linhas: PAPEIS, x: 220, y: 398, largura: 840, rot: -0.6 });
    r.aposta = Jogo.aposta(H, { pergunta: APOSTA.pergunta, opcoes: APOSTA.opcoes, certa: APOSTA.certa, x: APOSTA_X, y: 398, largura: 770 });
    r.resp = novo(H, `<div class="c04-resp"><div class="c04-resp-n">${APOSTA.resposta}</div><div class="c04-resp-r">${APOSTA.rodape}</div></div>`);
    r.fimC = novo(H, '<div class="c04-fim"></div>'); Jogo.gameOver(r.fimC, 'Fase concluída');
    Jogo.logo(H);
    r.hud = Jogo.hud(H, { vidas: VIDAS, fases: ETAPAS.map(e => e.nome), rotulos: { fase: 'Etapa' }, formato: n => String(n - 1).padStart(2, '0'), jogadores: ['Analista', { nome: 'IA', ia: true }] });
    /* antes do passo 0: o mapa enrolado, sem HUD nem título; só a frase que fechou o mundo 3 */
    aplicar(0);
    c.mundo.style.clipPath = 'inset(0px 100% 0px 0px)';
    r.cab.definir(false); r.hud.definir({ visivel: false, jogadores: false }); r.fPonte.definir(true);
    r.h.mostrar(false); r.ia.mostrar(false);
  }
  function desmontar() { r = null; }

  /* ---------- peças do estado ---------- */
  const op = (el, v) => { el.style.opacity = v ? 1 : 0; };
  const n2 = v => Math.round(v * 100) / 100;
  /* do mapa para a tela, pela câmera: os peões têm tamanho fixo e só mudam de lugar */
  const tela = P => ({ x: r.cam.x + P.x * r.cam.s, y: r.cam.y + P.y * r.cam.s });
  function camera(k, exato) {
    r.cam = k;
    const t = k.x === 0 && k.y === 0 && k.s === 1 ? 'none' : `translate(${exato ? Math.round(k.x) : n2(k.x)}px,${exato ? Math.round(k.y) : n2(k.y)}px) scale(${k.s.toFixed(4)})`;
    r.gmapa.style.transform = t; r.rmapa.style.transform = t; r.amapa.style.transform = t;
  }
  const entreCameras = (a, b, e) => ({ x: a.x + (b.x - a.x) * e, y: a.y + (b.y - a.y) * e, s: a.s + (b.s - a.s) * e });
  /* zoom: 0 = o mapa inteiro; 1 = dentro da etapa 00. A placa da etapa cresce até coincidir com as quatro casas, e uma vista se desfaz na outra */
  function zoomEm(e) {
    const p0 = lugar(0), s = Math.pow(SZ, e), px = p0.x + (ZX[0] - p0.x) * e, py = p0.y + (YP - p0.y) * e, z = s / SZ;
    camera(e >= 1 ? CAM0 : { x: px - p0.x * s, y: py - p0.y * s, s }, e <= 0);
    const tz = e >= 1 ? 'none' : `translate(${n2(px - ZX[0] * z)}px,${n2(py - YP * z)}px) scale(${z.toFixed(4)})`;
    const om = lim(1 - (e - 0.35) / 0.5), ot = lim(1 - (e - 0.1) / 0.35), oz = lim((e - 0.4) / 0.4);      // os rótulos do mapa somem antes das formas, para não ficar texto atrás de texto
    r.gmapa.style.opacity = om; r.amapa.style.opacity = om; r.rmapa.style.opacity = r.rotulos ? ot : 0; r.peoes.style.opacity = lim(1 - e / 0.22);
    [r.gzoom, r.rzoom, r.azoom].forEach(el => { el.style.transform = tz; el.style.opacity = oz; });
  }
  function peoesEm(Hm, modo) { const T = tela(Hm), A = modo(T); r.h.por(T.x, T.y); r.ia.por(A.x, A.y); }
  function acender(n) { for (let i = 0; i < N; i++) { r.pontos[i].classList.toggle('aceso', i < n); op(r.luz[i], i < n); op(r.nums[i], i < n); } }
  function regioes(n) { r.regs.forEach((el, k) => { op(el, k < n); el.style.transform = 'none'; r.caixas[k].classList.toggle('nomeada', k < n); }); }
  function casasAcesas(n) {
    CICLO.forEach((c, k) => { r.casas[k].classList.toggle('acesa', k < n); r.letras[k].classList.toggle('acesa', k < n); op(r.letras[k], k < n || c.ia); op(r.ciclo[k], k < n); r.ciclo[k].style.transform = 'none'; });
  }

  /* ---------- estado final de cada passo ----------
     aplicar(p) põe o estado INTEIRO do fim do passo p, na hora e sem som. É o fim() de todos os passos:
     como cada um escreve tudo, pular, voltar, link direto e impressão dão sempre no mesmo quadro. */
  function aplicar(p) {
    const dentro = p === 2 || p === 3, recuo = p >= 8 && p <= 10, bauNaTela = p === 6 || p === 7;
    r.c.mundo.style.clipPath = 'none';
    r.cab.definir(true); r.fPonte.definir(false);
    r.hud.definir({ visivel: true, vidas: VIDAS, fase: ETAPA_FIM[p] + 1, prazo: PRAZO[p], jogadores: true });
    /* o mapa */
    acender(p >= 1 ? N : 0); regioes(p >= 1 ? REGIOES.length : 0);
    r.nomes.forEach(el => { op(el, false); el.style.transform = 'none'; });
    r.gmapa.classList.toggle('aberto', p >= 4);                            // depois do zoom, cada placa mostra as três casas da IA e a do humano
    r.bands.forEach(el => op(el, p >= 4)); r.colegas.forEach(k => k.mostrar(p >= 4));
    r.portas.forEach((el, i) => op(el, ABERTOS[p].indexOf(i) < 0)); op(r.trava, p === 7);
    r.rotulos = !recuo;                                                   // com o mapa pequeno, número e nome ficariam abaixo de 20 px: somem
    zoomEm(dentro ? 1 : 0);
    if (recuo) camera(CAM8, true);
    op(r.gfant, recuo); r.fpontos.forEach((el, i) => el.classList.toggle('conf', recuo && CONF.indexOf(i) >= 0));
    /* dentro da etapa */
    casasAcesas(p >= 3 ? 4 : p === 2 ? 3 : 0);
    r.casas[3].classList.toggle('c04-pulsa', p === 2);
    r.grade.style.transform = p >= 3 ? `translateY(${-GRADE_SOBE}px)` : 'none'; r.lampada.classList.toggle('acesa', p >= 3);
    const hz = p >= 3 ? ZD : p === 2 ? ZV : ZENT, iz = p >= 2 ? ZPORTA : ladoZ(ZENT);
    r.hz.por(hz.x, hz.y).estado('parado'); r.iaz.por(iz.x, iz.y).estado('parada');
    /* os peões no mapa */
    const Hm = [INICIO, INICIO, casa(0, 3), casa(0, 3), casa(1, 3), casa(3, 0), casa(3, 0), casa(3, 0), casa(8, 3), casa(8, 3), casa(8, 3), CHEGADA][p], T = tela(Hm);
    const A = p <= 1 ? lado(T) : p <= 4 ? atras(T) : p === 5 ? lado(T) : bauNaTela ? ENTREGA : recuo ? lado8(T) : lado(T);
    r.h.por(T.x, T.y).estado('parado').alerta(false).mostrar(true);
    r.ia.por(A.x, A.y).estado(bauNaTela ? 'entregando' : 'parada').mostrar(true);
    r.aud.por(AUD.x, AUD.y).estado('parada').mostrar(recuo);
    /* pedra, baú, sorteio, prêmio */
    r.pedra.mostrar(false); r.lasca.fixar(p === 5);
    r.balao.definir(bauNaTela);
    r.bau.estado(p === 7 ? 'exposto' : 'fechado').mostrar(bauNaTela); r.bau.el.classList.toggle('c04-flutua', p === 6);
    r.dados.forEach(d => op(d, p === 7));
    r.premio.estado('inteiro').mostrar(p === 11);
    /* textos */
    r.placas.forEach((el, k) => { op(el, k === 0 ? p >= 1 && p <= 3 : p === 4); el.style.transform = 'none'; });
    r.fDecide.definir(p === 3); r.fSalvo.definir(p === 4); r.fVolta.definir(p === 5); r.fArmadilha.definir(p === 7); r.fFecho.definir(p === 11);
    op(r.linha, p === 7); r.linha.style.transform = 'none';
    r.papeis.definir({ visivel: p === 8 });
    r.aposta.definir({ visivel: p === 9 || p === 10, revelada: p === 10 }); r.aposta.el.classList.toggle('c04-espera', p === 9);
    r.aposta.el.style.transform = p === 10 ? `translateX(${-APOSTA_SAI}px)` : 'none';      // no passo 10 a aposta fica à esquerda e a resposta, ao lado, até a tecla
    op(r.resp, p === 10); r.resp.style.transform = 'none'; op(r.fimC, p === 11); r.fimC.style.transform = 'none';
  }
  const FIM = Array.from({ length: PASSOS }, (_, p) => () => aplicar(p));
