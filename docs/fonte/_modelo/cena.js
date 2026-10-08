/* ================================================================
   MODELO DE CENA · copie esta pasta para fonte\cenaNN\ e troque: o id ('99' -> 'NN'), o prefixo CSS (m9- -> cNN-) e o conteúdo.
   Roda sozinho:  & .\fonte\montar.ps1 -Cenas _modelo -Destino <arquivo.html>   e abra <arquivo.html>?cena=99
   Mostra, em 4 passos: templo, HUD com 2 jogadores, cabeçalho, herói, aliado, pedra, lasca, baú, balão, cartão, frase, aposta, prêmio e som.
   Regra de ouro: tocar(ctx) anima; fim() fixa o estado final. Tudo o que tocar() deixa na tela, fim() tem de pôr.
   ================================================================ */
(() => {
  const { E, html } = Deck.util;
  const { BASE, pouso, rota } = Templo.geo, M = Jogo.mover;
  const some = [{ opacity: 1 }, { opacity: 0 }], surge = [{ opacity: 0 }, { opacity: 1 }];
  let r = null;                                                // tudo o que a cena montou; zera em desmontar()

  /* ---------- montar: constrói o DOM no estado ANTES do passo 0 ---------- */
  function montar(palco) {
    const tp = Templo.criar(palco, { classe: 'm9', hora: 'amanhecer', construido: true, degrauzinhos: true, pilha: true });
    const H = tp.hud;                                          // HTML acima do mundo: cabeçalho, cartões, HUD
    r = { tp };
    r.cab = Jogo.cabecalho(H, { eyebrow: 'Mundo 99', titulo: 'Modelo de cena' });
    r.selo = html('<div class="m9-selo">Elemento próprio da cena</div>'); H.appendChild(r.selo);   // HTML e CSS da cena, com o prefixo dela
    r.frase = Jogo.frase(H, { texto: 'Frase que entra no passo 2.' });
    r.cartao = Jogo.cartao(H, { cabecalho: 'Cabeçalho do cartão', linhas: ['Primeira linha, comum.', { t: 'Linha do que é da IA.', destaque: true }], rodape: 'Rodapé: fonte e recorte do número', x: 330, y: 190, largura: 560, rot: -1 });
    r.aposta = Jogo.aposta(H, { pergunta: 'Pergunta da aposta?', opcoes: ['10%', '25%', '50%'], certa: 1, x: 360, y: 210, largura: 560 });
    Jogo.logo(H);
    r.hud = Jogo.hud(H, { vidas: 5, fases: Templo.FASES.map(f => f.nome), jogadores: ['Analista', { nome: 'IA', ia: true }] });
    /* atores: camada de SVG no plano do templo. A ordem de criação é a ordem de empilhamento */
    r.premio = Jogo.premio(tp.atores, { escala: 1 });
    r.bau = Jogo.bau(tp.atores, { escala: 0.9 });
    r.h = Jogo.heroi(tp.atores, { escala: 1 });
    r.ia = Jogo.aliado(tp.atores, { escala: 1 });
    /* HTML no plano do templo, acima dos atores: pedra, lasca, balão */
    r.lasca = Jogo.lasca(tp.topo, { linhas: ['Os dados estavam incompletos.'], x: 890, y: 162, rot: -1 });
    r.pedra = Jogo.pedra(tp.topo, { linhas: ['Os dados estavam', 'incompletos.'], x: 430, y: 226, w: 312, h: 108, corpo: 28, semente: 11 });
    r.balao = Jogo.balao(tp.topo, { texto: 'Fala da IA.', x: 0, y: 0 });
    /* estado antes do passo 0: os componentes já nascem escondidos; o resto, esconda aqui */
    r.selo.style.opacity = 0;
    r.hud.definir({ visivel: false, vidas: 5, fase: 1, prazo: 1, jogadores: false });
    r.h.por(BASE.x, BASE.y).estado('parado').mostrar(false);
    r.ia.por(BASE.x + 74, BASE.y - 96).estado('parada').mostrar(false);
    r.bau.mostrar(false); r.premio.mostrar(false);
  }
  function desmontar() { r = null; }
  const ladoDoHeroi = p => ({ x: p.x + 74, y: p.y - 96 });     // onde a faísca fica quando está parada ao lado do herói
  /* a faísca sobe um pouco e oferece o baú no feixe: onde ficam ela, o baú e o balão, a partir do pouso do herói */
  function entrega(p) { const l = ladoDoHeroi(p), ia = { x: l.x + 40, y: l.y - 46 }; return { ia, bau: { x: ia.x + 42, y: ia.y + 104 }, balao: { x: ia.x + 30, y: ia.y - 28 } }; }

  /* ---------- fim(): estado final de cada passo, na hora, sem som. Só o que o passo muda ---------- */
  const FIM = [
    function fim0() {
      r.cab.definir(true); r.selo.style.opacity = 1;
      r.hud.definir({ visivel: true, jogadores: true });
      r.h.por(BASE.x, BASE.y).estado('parado').mostrar(true);
      const l = ladoDoHeroi(BASE); r.ia.por(l.x, l.y).estado('parada').mostrar(true);
    },
    function fim1() {
      const p = pouso(1), l = ladoDoHeroi(p);
      r.h.por(p.x, p.y).estado('parado').alerta(false); r.ia.por(l.x, l.y).estado('parada');
      r.lasca.fixar(); r.hud.definir({ vidas: 4, fase: 1, prazo: 0.8 });
    },
    function fim2() {
      const e = entrega(pouso(1));
      r.ia.por(e.ia.x, e.ia.y).estado('entregando'); r.bau.por(e.bau.x, e.bau.y).estado('armadilha').mostrar(true);
      r.balao.por(e.balao.x, e.balao.y); r.balao.definir(true);
      r.hud.definir({ vidas: 3 }); r.frase.definir(true);
      r.tp.nomes(false);                                        // o cartão fica por cima do templo: os nomes das fases somem, para nada vazar por trás
      r.cartao.definir({ visivel: true });
    },
    function fim3() {
      const l = ladoDoHeroi(pouso(1));
      r.ia.por(l.x, l.y).estado('parada'); r.bau.mostrar(false); r.balao.definir(false);
      r.cartao.definir({ visivel: false }); r.frase.definir(false); r.aposta.definir({ visivel: true, revelada: true });
      r.premio.por(BASE.x - 14, BASE.y).estado('inteiro').mostrar(true);
    }
  ];

  /* ---------- tocar(ctx): a versão animada. Agende TUDO pelo ctx e termine com ctx.concluir() ---------- */
  function tocar0(ctx) {                                        // cabeçalho, HUD com 2 jogadores, herói e aliado
    const s = ctx.som, l = ladoDoHeroi(BASE);
    s.ambiente({ vento: 0.4 }, 2);
    r.cab.entrar(ctx); ctx.anim(r.selo, surge, { duration: 500, delay: 400 });
    r.hud.entrar(ctx, 300); r.hud.entrarJogadores(ctx, 900);
    ctx.anim(r.h.el, surge, { duration: 300, delay: 600 });
    ctx.em(600, () => s.pronto());
    ctx.anim(r.ia.el, surge, { duration: 200, delay: 1200 });
    M.voar(ctx, r.ia, [{ x: -60, y: 300 }, { x: 60, y: 420 }, l], 700, { atraso: 1200, estado: 'disparando' });
    ctx.em(1900, () => s.novoJogador());
    ctx.em(2600, ctx.concluir);
  }
  function tocar1(ctx) {                                        // sobem ao degrau 2; a pedra bate; volta ao degrau 1
    const s = ctx.som, tp = r.tp, alvo = pouso(2), dest = pouso(1), G = { dx: -186, dy: 200, rot: -16, ms: 360 };
    M.andar(ctx, r.h, rota(0, 2), 1400, { atraso: 100, marcas: tp.marcasDePouso(0, 2, k => r.hud.mudarFase(ctx, k)) });
    M.voar(ctx, r.ia, [ladoDoHeroi(BASE), ladoDoHeroi(pouso(1)), ladoDoHeroi(alvo)], 1400, { atraso: 100, curva: E.lin });
    r.hud.gastarPrazo(ctx, 0.9, 1400, 100);
    const tE = 1300, tL = tE + r.pedra.chegar(ctx, 'cai', tE), tG = tL + 1800, tI = tG + G.ms;   // chega, fica parada 1,8 s para ser lida, bate
    let bob = null; ctx.em(tL, () => { bob = r.pedra.flutuar(ctx); r.h.alerta(true); });
    ctx.em(tG, () => { if (bob) bob.cancel(); r.pedra.golpear(ctx, G); });                       // animações em sequência no mesmo elemento: crie na hora, dentro de ctx.em
    ctx.em(tI, () => {
      s.pedra({ ganho: 0.85 }); tp.tremor(ctx, 7, 300); tp.poeira(ctx, alvo.x, alvo.y - 18, 10, 1.3); tp.estilhacos(ctx, alvo.x + 16, alvo.y - 70, 9);
      r.pedra.desfazer(ctx, G); r.h.alerta(false).estado('atingido');
      ctx.em(r.lasca.cravar(ctx, alvo.x, alvo.y - 62), () => s.clac({ tom: 0.7 }));
      ctx.em(120, () => { r.hud.perderVida(ctx); s.vida(); });
      r.hud.gastarPrazo(ctx, 0.8, 500, 150);
      ctx.em(130, () => M.rolar(ctx, r.h, rota(2, 1), 800, { voltas: 1, quique: 9, saltos: 2, curva: E.outQuad,
        fim: () => { r.hud.mudarFase(ctx, 1); r.h.por(dest.x, dest.y).estado('agachado'); M.levantar(ctx, r.h, 140, 340); r.h.piscar(ctx, 760, 200); } }));
      M.voar(ctx, r.ia, [ladoDoHeroi(alvo), ladoDoHeroi(dest)], 600, { atraso: 500 });
      ctx.em(130 + 800 + 480 + 700, ctx.concluir);
    });
  }
  function tocar2(ctx) {                                        // a faísca fala e entrega um baú; é armadilha; a frase e o cartão entram
    const s = ctx.som, p = pouso(1), e = entrega(p);
    M.voar(ctx, r.ia, [ladoDoHeroi(p), e.ia], 350, { aoFim: 'entregando', fim: () => s.presente() });
    r.balao.por(e.balao.x, e.balao.y); r.balao.entrar(ctx, 350);
    r.bau.por(e.bau.x, e.bau.y).estado('fechado');
    ctx.anim(r.bau.el, [{ opacity: 0, transform: 'translateY(-30px)' }, { opacity: 1, transform: 'translateY(0px)' }], { duration: 400, delay: 350 });
    ctx.em(1300, () => { r.bau.abrir(ctx, 'armadilha'); s.pedra({ ganho: 0.6, freq: 70 }); r.tp.tremor(ctx, 5, 220); r.h.estado('atingido'); r.hud.perderVida(ctx); s.vida(); });
    ctx.em(1900, () => { r.h.estado('parado'); r.h.piscar(ctx, 700); });
    r.frase.entrar(ctx, 1800);
    ctx.anim(r.tp.rotulos, some, { duration: 400, delay: 2000 });
    const t0 = 2200 + r.cartao.entrar(ctx, 2200);
    r.cartao.revelar(ctx, 0, t0 + 100); r.cartao.revelar(ctx, 1, t0 + 600); r.cartao.revelar(ctx, 'rodape', t0 + 1100);
    ctx.em(t0 + 1800, ctx.concluir);
  }
  function tocar3(ctx) {                                        // aposta: pergunta, três opções, revelação; o prêmio aparece e falha um instante
    const s = ctx.som, p = pouso(1);
    r.cartao.sair(ctx); r.frase.sair(ctx); r.balao.sair(ctx); ctx.anim(r.bau.el, some, { duration: 300 });
    M.voar(ctx, r.ia, [entrega(p).ia, ladoDoHeroi(p)], 400);
    const t0 = 300 + r.aposta.entrar(ctx, 300);
    ctx.em(t0 + 900, () => { r.aposta.revelar(ctx); s.fanfarra(); });
    r.premio.por(BASE.x - 14, BASE.y).estado('inteiro');
    ctx.anim(r.premio.el, surge, { duration: 300, delay: t0 + 1300 });
    ctx.em(t0 + 2000, () => { s.falha(); r.premio.falhar(ctx, 400, 'inteiro'); });
    ctx.em(t0 + 2900, ctx.concluir);
  }

  /* ---------- registro: o id é o que vai no link (?cena=99) ---------- */
  Deck.registrar({
    id: '99',
    titulo: '99 · Modelo de cena',
    notas: { fala: 'Texto da fala do roteiro, entre aspas.', interacao: 'O que perguntar à turma, e quando.', rastreio: ['De onde vem cada número.'] },
    montar, desmontar,
    passos: [
      { nome: 'cabeçalho, HUD com 2 jogadores, herói e aliado', ambiente: { vento: 0.4 }, tocar: tocar0, fim: FIM[0] },
      { nome: 'sobem ao degrau 2; pedra; volta ao degrau 1', tocar: tocar1, fim: FIM[1] },
      { nome: 'balão, baú-armadilha, frase e cartão', tocar: tocar2, fim: FIM[2] },
      { nome: 'aposta, revelação e prêmio', tocar: tocar3, fim: FIM[3] }
    ]
  });
})();
