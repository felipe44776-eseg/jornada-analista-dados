/* ================================================================
   CAMADA DE JOGO · TEMPLO E CENÁRIO EM CAMADAS (mundos 1, 2 e 3)
   O templo do CRISP-DM: 6 degraus, uma fase por degrau, com céu, serra, mata, encosta e primeiro plano.
   Uso:  const t = Templo.criar(palco, { hora: 'amanhecer', construido: true, degrauzinhos: true, pilha: true });
   Camadas para a cena:  t.hud (HTML acima do mundo) · t.topo (HTML no plano do templo, acima dos atores)
                         t.atores (g de SVG: herói, aliado, baú) · t.fx (g de SVG: poeira, estilhaços)
   Estado na hora (para o fim() dos passos):  t.hora(nome) · t.construido(v) · t.degrauzinhos(v) · t.pilha(v) · t.nomes(v) · t.camera(x, y, z, exato)
   Geometria:  Templo.geo.tier(k) · pouso(k) · rota(a, b) · BASE · GY (chão) · TH (altura do degrau)
   ================================================================ */
const Templo = (() => {
  const { rng, E } = Deck.util;
  /* os 6 degraus do reference model do CRISP-DM (roteiro, cena 01): 24 tarefas, 42 saídas */
  const FASES = [
    { nome: 'Entendimento do negócio', tarefas: 4, saidas: 12 },
    { nome: 'Entendimento dos dados', tarefas: 4, saidas: 4 },
    { nome: 'Preparação dos dados', tarefas: 5, saidas: 8 },
    { nome: 'Modelagem', tarefas: 4, saidas: 8 },
    { nome: 'Avaliação', tarefas: 3, saidas: 5 },
    { nome: 'Implantação', tarefas: 4, saidas: 5 }
  ];
  const TOT_S = FASES.reduce((s, f) => s + f.saidas, 0);
  /* ---------- geometria (px do palco) ---------- */
  const GY = 604, TH = 54, X0 = 150, LL = 72, RL = 28, W1 = 700, SR = 48;
  const tier = k => ({ x: X0 + (k - 1) * LL, y: GY - k * TH, w: W1 - (k - 1) * (LL + RL), h: TH });   // k = 1..6
  const BASE = { x: 80, y: GY };
  /* onde os pés ficam: 0 = chão, k = em cima do degrau k (6 = topo) */
  const pouso = k => k === 0 ? BASE : k === 6 ? { x: tier(6).x + 150, y: tier(6).y } : { x: tier(k).x + 12, y: tier(k).y };
  /* caminho dos pés entre dois pousos, passando pelos lances de degrauzinhos */
  function rota(a, b) {
    if (a > b) return rota(b, a).reverse();
    const pts = [pouso(a)];
    for (let k = a + 1; k <= b; k++) {
      const t = tier(k);
      pts.push({ x: t.x - SR, y: k === 1 ? GY : tier(k - 1).y }, { x: t.x, y: t.y }, pouso(k));
    }
    return pts;
  }
  const PILHA = { x: 936, passo: 49, alt: 10, col: 4 };
  /* hora do dia: escuro (antes de amanhecer), amanhecer (mundos 1 e 2), noite (mundo 3; não escurece os atores) */
  const HORAS = {
    escuro: { veu: 0.94, est: 1, disco: 380, halo: 0, fundo: 0, templo: 0, rotulos: 1 },
    amanhecer: { veu: 0, est: 0.3, disco: 0, halo: 1, fundo: 0, templo: 0, rotulos: 1 },
    noite: { veu: 0, est: 1, disco: 0, halo: 0.2, fundo: 0.58, templo: 0.46, rotulos: 0.86 }
  };
  const n1 = v => (Math.round(v * 10) / 10);
  const pol = pts => pts.map(p => n1(p[0]) + ',' + n1(p[1])).join(' ');
  const S = 'width="1280" height="720" viewBox="0 0 1280 720"';
  const SERRA1 = [[-80, 470], [40, 428], [120, 378], [190, 412], [262, 348], [334, 396], [420, 330], [505, 388], [590, 344], [684, 402], [764, 358], [852, 412], [940, 372], [1040, 424], [1140, 386], [1240, 432], [1380, 398]];
  const SERRA2 = [[-80, 520], [20, 484], [96, 506], [196, 442], [286, 494], [352, 462], [446, 508], [540, 470], [640, 514], [730, 476], [830, 512], [900, 468], [1000, 500], [1380, 470]];
  const VOLUME = '150,604 150,550 222,550 222,496 294,496 294,442 366,442 366,388 438,388 438,334 510,334 510,280 710,280 710,334 738,334 738,388 766,388 766,442 794,442 794,496 822,496 822,550 850,550 850,604';

  /* ---------- desenho ---------- */
  function desSerra(pts, cor, corLuz, base) {
    let s = `<polygon points="${pol(pts.concat([[pts[pts.length - 1][0], base], [pts[0][0], base]]))}" fill="${cor}"/>`;
    for (let i = 1; i < pts.length - 1; i++) {
      if (pts[i][1] < pts[i - 1][1] && pts[i][1] < pts[i + 1][1]) {     // pico: face iluminada à direita
        const a = pts[i], b = pts[i + 1];
        s += `<polygon points="${pol([a, b, [a[0] + (b[0] - a[0]) * 0.18, b[1] + 26], [a[0] - 6, a[1] + 60]])}" fill="${corLuz}" opacity=".55"/>`;
      }
    }
    return s;
  }
  function desCopas(rnd, y0, rMin, rMax, cor, passo) {
    let s = '';
    for (let x = -90; x < 1380; x += passo * (0.7 + rnd() * 0.6)) {
      const rr = rMin + rnd() * (rMax - rMin);
      s += `<circle cx="${n1(x)}" cy="${n1(y0 - rr * 0.35 + rnd() * 12)}" r="${n1(rr)}" fill="${cor}"/>`;
    }
    return s + `<rect x="-90" y="${y0}" width="1470" height="${700 - y0}" fill="${cor}"/>`;
  }
  function desEstrelas(rnd) {
    let s = '';
    for (let i = 0; i < 96; i++) {
      const x = rnd() * 860, y = rnd() * 300, rr = 0.7 + rnd() * rnd() * 1.6;
      if (y < 160 && x < 720) continue;                                // não atrás do HUD nem do título
      if (y > 258 && x > 480 && x < 740) continue;                     // nem sobre o topo do templo
      if (x > 730 && x < 850 && y > 145 && y < 265) continue;          // nem sobre o disco
      s += `<circle cx="${n1(x)}" cy="${n1(y)}" r="${n1(rr)}" opacity="${n1(0.45 + rnd() * 0.55)}"${rnd() < 0.3 ? ` class="tp-pisca" style="animation-delay:-${n1(rnd() * 3.4)}s"` : ''}/>`;
    }
    return s;
  }
  function desEncosta() {
    const borda = [[914, -80], [892, 24], [908, 108], [878, 190], [894, 282], [868, 370], [886, 452], [860, 532], [872, 640]];
    return `<defs><linearGradient id="tp-enc" gradientUnits="userSpaceOnUse" x1="860" y1="0" x2="1180" y2="0">
        <stop offset="0" stop-color="#3A3F8C"/><stop offset=".1" stop-color="#1D2276"/><stop offset=".5" stop-color="#12166A"/><stop offset="1" stop-color="#0C1060"/></linearGradient></defs>
      <polygon points="${pol([[1420, -80]].concat(borda, [[1420, 640]]))}" fill="url(#tp-enc)"/>
      <polygon points="908,108 1030,146 996,282 894,282 878,190" fill="#00010F" opacity=".16"/>
      <polygon points="868,370 1010,404 968,532 860,532 886,452" fill="#00010F" opacity=".16"/>
      <polygon points="1100,-80 1420,-80 1420,640 1180,640 1220,420 1130,250 1170,90" fill="#00010F" opacity=".2"/>
      <path d="M896,140 L1420,112 M882,326 L1420,296 M874,498 L1420,470" stroke="#2A2F7C" stroke-width="2" fill="none" opacity=".8"/>
      <polyline points="${pol(borda)}" fill="none" stroke="#8E90C8" stroke-width="2.2" opacity=".6" stroke-linejoin="round"/>`;
  }
  function desPrimeiroPlano(rnd) {
    const folha = (bx, by, tx, ty, larg) => {                           // lâmina em forma de lente
      const mx = (bx + tx) / 2, my = (by + ty) / 2, dx = tx - bx, dy = ty - by, L = Math.hypot(dx, dy), nx = -dy / L * larg, ny = dx / L * larg;
      return `<path d="M${n1(bx)},${n1(by)} Q${n1(mx + nx)},${n1(my + ny)} ${n1(tx)},${n1(ty)} Q${n1(mx - nx * 0.35)},${n1(my - ny * 0.35)} ${n1(bx)},${n1(by)}Z"/>`;
    };
    let s = '<g fill="#00010F">';
    [[-30, 760, 60, 596, 30], [10, 770, 150, 640, 26], [-40, 740, -6, 560, 24], [60, 780, 228, 690, 22], [-20, 770, 104, 612, 20],
     [1310, 760, 1226, 604, 30], [1280, 780, 1150, 652, 24], [1320, 740, 1290, 566, 24], [1240, 790, 1080, 700, 20]].forEach(f => { s += folha(...f); });
    for (let x = -60; x < 1340; x += 30 + rnd() * 30) s += folha(x, 740, x + (rnd() - 0.5) * 30, 706 - rnd() * 10, 6);
    return s + '<rect x="-100" y="716" width="1480" height="80"/></g>';
  }
  function desBlocos(rnd) {
    const nb = [7, 6, 5, 4, 3, 2]; let s = '';
    for (let k = 1; k <= 6; k++) {
      const t = tier(k), n = nb[k - 1], cortes = [0];
      for (let i = 1; i < n; i++) cortes.push(t.w * (i + (rnd() - 0.5) * 0.24) / n);
      cortes.push(t.w);
      for (let i = 0; i < n; i++) {
        const x = t.x + cortes[i], w = cortes[i + 1] - cortes[i];
        s += `<g class="tp-bloco" data-k="${k}"><rect x="${n1(x)}" y="${t.y}" width="${n1(w)}" height="${TH}" fill="#141968"/>
          <rect x="${n1(x + 1)}" y="${t.y + 1}" width="${n1(w - 2)}" height="${TH - 2}" fill="url(#tp-pedra)"/>
          <rect x="${n1(x + 1)}" y="${t.y + 1}" width="${n1(w - 2)}" height="4" fill="#C1C1E3" opacity=".6"/>
          <rect x="${n1(x + 1)}" y="${t.y + TH - 8}" width="${n1(w - 2)}" height="7" fill="#00010F" opacity=".2"/>
          <rect x="${n1(x + 6 + rnd() * (w - 30))}" y="${n1(t.y + 12 + rnd() * 26)}" width="${n1(8 + rnd() * 10)}" height="3" fill="#00010F" opacity=".13"/></g>`;
      }
    }
    return s;
  }
  function desOrnamentos() {
    /* motivos geométricos abstratos (quadrados concêntricos e grega escalonada): não imitam escrita */
    const pos = [[1, 252], [1, 716], [2, 352], [2, 700], [3, 350], [3, 716], [4, 456], [4, 668], [5, 486], [5, 664]];
    return '<g fill="none" stroke="#8E90C8" stroke-width="2" opacity=".5" stroke-linejoin="miter">' + pos.map(([k, x], i) => {
      const y = tier(k).y + TH / 2 + 2;
      return i % 2 ? `<path d="M${x - 10},${y + 10} V${y - 10} H${x + 10} V${y + 6} H${x - 4} V${y - 4} H${x + 4}"/>`
        : `<rect x="${x - 10}" y="${y - 10}" width="20" height="20"/><rect x="${x - 4}" y="${y - 4}" width="8" height="8"/>`;
    }).join('') + '</g>';
  }
  /* degrauzinhos: um por tarefa. Cada <g class="tp-tarefa"> tem 3 rects: corpo, topo claro e quina. `sombra` desenha só o corpo, escuro (noite) */
  function desTarefas(sombra) {
    let s = '';
    for (let k = 1; k <= 6; k++) {
      const t = tier(k), n = FASES[k - 1].tarefas, yb = t.y + TH, dh = TH / n, dw = SR / n;
      for (let i = 1; i <= n; i++) {
        const x = t.x - SR + (i - 1) * dw, y = yb - i * dh, w = SR - (i - 1) * dw;
        s += sombra ? `<rect x="${n1(x)}" y="${n1(y)}" width="${n1(w)}" height="${n1(dh + 0.5)}"/>`
          : `<g class="tp-tarefa" data-k="${k}"><rect x="${n1(x)}" y="${n1(y)}" width="${n1(w)}" height="${n1(dh + 0.5)}" fill="#7477B6"/>
          <rect x="${n1(x)}" y="${n1(y)}" width="${n1(w)}" height="3" fill="#E3E2FD"/><rect x="${n1(x)}" y="${n1(y)}" width="2" height="${n1(dh)}" fill="#A9AADC"/></g>`;
      }
    }
    return s;
  }
  function desPilha(rnd) {
    let s = '';
    for (let j = 0; j < TOT_S; j++) {
      s += `<g class="tp-tab"><rect x="-22" y="-4" width="44" height="8" rx="1.5" fill="#B4B5E0"/><rect x="-22" y="-4" width="44" height="2.6" rx="1.3" fill="#ECEDFF"/>
        <rect x="${n1(-16 + rnd() * 4)}" y="0.4" width="${n1(20 + rnd() * 10)}" height="1.3" fill="#3A3F8C" opacity=".75"/></g>`;
    }
    return s;
  }

  /* ---------- montagem ---------- */
  function criar(palco, op) {
    op = Object.assign({ hora: 'amanhecer', construido: true, degrauzinhos: true, pilha: true }, op);
    const rnd = rng(20261007), raiz = document.createElement('div');
    raiz.className = 'tp' + (op.classe ? ' ' + op.classe : '');
    raiz.innerHTML = `
      <div class="tp-mundo">
        <div class="tp-pl" data-prof="0"><div class="tp-ceu"></div><div class="tp-halo"></div><div class="tp-disco"></div></div>
        <div class="tp-pl" data-prof="0.12"><div class="tp-vai" style="--prof:.5"><svg ${S}>${desSerra(SERRA1, '#4A4F9C', '#6B6FB8', 720)}</svg></div></div>
        <div class="tp-pl" data-prof="0.28"><div class="tp-vai" style="--prof:1"><svg ${S}>
          <defs><linearGradient id="tp-nev" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E3E2FD" stop-opacity="0"/><stop offset=".55" stop-color="#E3E2FD" stop-opacity=".3"/><stop offset="1" stop-color="#E3E2FD" stop-opacity="0"/></linearGradient></defs>
          <rect x="-100" y="400" width="1480" height="110" fill="url(#tp-nev)"/>${desSerra(SERRA2, '#2A2F7C', '#3A3F8C', 720)}
          <rect x="-100" y="478" width="1480" height="110" fill="url(#tp-nev)"/></svg></div></div>
        <div class="tp-pl" data-prof="0.55"><div class="tp-vai" style="--prof:1.7"><svg ${S}>${desCopas(rnd, 552, 20, 40, '#141968', 44)}${desCopas(rnd, 580, 22, 44, '#0C1060', 50)}</svg></div></div>
        <div class="tp-pl" data-prof="0.85"><svg ${S}>${desEncosta()}</svg></div>
        <div class="tp-noite-fundo" style="opacity:0"></div>
        <div class="tp-pl" data-prof="1">
          <svg ${S}><defs>
              <linearGradient id="tp-pedra" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#474C9A"/><stop offset="1" stop-color="#2B307E"/></linearGradient>
              <linearGradient id="tp-vol" gradientUnits="userSpaceOnUse" x1="150" y1="0" x2="850" y2="0"><stop offset="0" stop-color="#00010F" stop-opacity=".34"/><stop offset=".42" stop-color="#00010F" stop-opacity="0"/><stop offset=".7" stop-color="#ECEDFF" stop-opacity="0"/><stop offset="1" stop-color="#ECEDFF" stop-opacity=".16"/></linearGradient>
              <linearGradient id="tp-chao" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#11156A"/><stop offset=".3" stop-color="#060947"/><stop offset="1" stop-color="#00010F"/></linearGradient></defs>
            <rect x="-140" y="${GY}" width="1560" height="220" fill="url(#tp-chao)"/><rect x="-140" y="${GY}" width="1560" height="2" fill="#8E90C8" opacity=".45"/>
            ${desBlocos(rnd)}<g class="tp-orn"><polygon points="${VOLUME}" fill="url(#tp-vol)"/>${desOrnamentos()}</g>
            ${[1, 2, 3, 4, 5, 6].map(k => { const t = tier(k); return `<rect class="tp-flash" x="${t.x}" y="${t.y}" width="${t.w}" height="${TH}" fill="#ECEDFF" opacity="0"/>`; }).join('')}
            ${desTarefas()}
            <g class="tp-noite-templo" fill="#00010F" style="opacity:0"><polygon points="${VOLUME}"/><rect x="-140" y="${GY}" width="1560" height="220"/><g class="tp-noite-degraus">${desTarefas(true)}</g></g></svg>
          <div class="tp-z tp-rotulos">${FASES.map((f, i) => { const t = tier(i + 1); return `<div class="tp-fase" style="left:${t.x}px;top:${t.y}px;width:${t.w}px">${f.nome}</div>`; }).join('')}</div>
          <svg ${S}><g class="tp-pilha">${desPilha(rnd)}</g><g class="tp-atores"></g><g class="tp-fx"></g></svg>
          <div class="tp-z tp-topo"></div>
        </div>
        <div class="tp-veu"></div>
        <svg class="tp-est" ${S}>${desEstrelas(rnd)}</svg>
        <div class="tp-pl" data-prof="1.7"><div class="tp-vai" style="--prof:2.6"><svg ${S}>${desPrimeiroPlano(rnd)}</svg></div></div>
      </div>
      <div class="tp-hud"></div>`;
    /* o balanço do fundo e o piscar das estrelas seguem o relógio do documento: dois templos montados em horas diferentes ficam em fase */
    const relogio = (document.timeline && document.timeline.currentTime) || performance.now();
    raiz.querySelectorAll('.tp-vai').forEach(el => { el.style.animationDelay = -(relogio % 34000).toFixed(0) + 'ms'; });
    raiz.querySelectorAll('.tp-pisca').forEach(el => { el.style.animationDelay = (parseFloat(el.style.animationDelay) * 1000 - relogio % 3400).toFixed(0) + 'ms'; });
    palco.appendChild(raiz);
    const q = s => raiz.querySelector(s), qa = s => Array.from(raiz.querySelectorAll(s));
    const op1 = (el, v) => { el.style.opacity = v; }, tf = (el, v) => { el.style.transform = v; };
    const t = {
      raiz, geo: GEO, mundo: q('.tp-mundo'), hud: q('.tp-hud'), topo: q('.tp-topo'), atores: q('.tp-atores'), fx: q('.tp-fx'), pilhaG: q('.tp-pilha'), planos: qa('.tp-pl'),
      veu: q('.tp-veu'), est: q('.tp-est'), disco: q('.tp-disco'), halo: q('.tp-halo'), noiteFundo: q('.tp-noite-fundo'), noiteTemplo: q('.tp-noite-templo'), noiteDegraus: q('.tp-noite-degraus'), rotulos: q('.tp-rotulos'),
      blocos: qa('.tp-bloco'), orn: q('.tp-orn'), flashes: qa('.tp-flash'), fases: qa('.tp-fase'), tarefas: qa('.tp-tarefa'), tabs: qa('.tp-tab'),
      cam: { x: 0, y: 0, z: 0 }, estado: { hora: op.hora, nomes: true, construido: false, degrauzinhos: false, pilha: false }
    };
    t.planos.forEach(p => { p._prof = parseFloat(p.dataset.prof); });
    t.tarefasK = [1, 2, 3, 4, 5, 6].map(k => t.tarefas.filter(e => e.dataset.k === String(k)));
    t.blocosK = [1, 2, 3, 4, 5, 6].map(k => t.blocos.filter(b => b.dataset.k === String(k)));
    t.tabs.forEach((e, j) => {                                         // lugar de cada tabuleta na pilha
      const x = PILHA.x + (j % PILHA.col) * PILHA.passo + (rnd() - 0.5) * 5, y = GY - 5 - Math.floor(j / PILHA.col) * PILHA.alt, a = (rnd() - 0.5) * 4;
      e._p = { x, y }; e._fim = `translate(${n1(x)}px,${n1(y)}px) rotate(${n1(a)}deg) scale(1)`;
    });
    /* câmera: exato = repouso, em px inteiros (texto nítido); sem will-change, o Chrome redesenha na escala certa */
    t.camera = (x, y, z, exato) => {
      t.cam = { x, y, z };
      const f = exato ? Math.round : n1;
      t.planos.forEach(p => { const k = p._prof; p.style.transform = `translate(${f(-x * k)}px,${f(-y * k)}px) scale(${(1 + z * k).toFixed(4)})`; });
    };
    t.cameraPara = (ctx, a, ms) => { const d = Object.assign({}, t.cam); ctx.tween(ms, e => t.camera(d.x + (a.x - d.x) * e, d.y + (a.y - d.y) * e, d.z + (a.z - d.z) * e), { curva: E.inOut }); };
    /* estado na hora: é o que o fim() dos passos usa */
    const pintarRotulos = () => op1(t.rotulos, t.estado.nomes ? HORAS[t.estado.hora].rotulos : 0);
    t.hora = nome => {
      const h = HORAS[nome]; t.estado.hora = nome;
      op1(t.veu, h.veu); op1(t.est, h.est); tf(t.disco, h.disco ? `translateY(${h.disco}px)` : 'none'); op1(t.halo, h.halo);
      op1(t.noiteFundo, h.fundo); op1(t.noiteTemplo, h.templo); pintarRotulos();
      t.pilhaG.style.filter = h.templo ? 'brightness(.5)' : '';             // a pilha de tabuletas também escurece à noite
    };
    /* nomes das fases nos degraus: apague (false) quando um cartão ou painel for ficar por cima do templo */
    t.nomes = v => { t.estado.nomes = !!v; pintarRotulos(); };
    t.mudarHora = (ctx, nome, ms) => {                                   // transição animada entre duas horas; o fim() chama t.hora(nome)
      const a = HORAS[t.estado.hora], b = HORAS[nome], o = { duration: ms || 2400, easing: 'cubic-bezier(.4,0,.3,1)' };
      [[t.veu, 'veu'], [t.est, 'est'], [t.halo, 'halo'], [t.noiteFundo, 'fundo'], [t.noiteTemplo, 'templo'], [t.rotulos, 'rotulos']].forEach(([el, k]) => ctx.anim(el, [{ opacity: a[k] }, { opacity: b[k] }], o));
      ctx.anim(t.disco, [{ transform: `translateY(${a.disco}px)` }, { transform: `translateY(${b.disco}px)` }], o);
      ctx.anim(t.pilhaG, [{ filter: `brightness(${a.templo ? 0.5 : 1})` }, { filter: `brightness(${b.templo ? 0.5 : 1})` }], o);
    };
    t.construido = v => { t.estado.construido = !!v; t.blocos.forEach(b => { op1(b, v ? 1 : 0); tf(b, 'none'); }); t.fases.forEach(f => { op1(f, v ? 1 : 0); tf(f, 'none'); }); op1(t.orn, v ? 1 : 0); };
    t.degrauzinhos = v => { t.estado.degrauzinhos = !!v; t.tarefas.forEach(e => { op1(e, v ? 1 : 0); tf(e, 'none'); }); op1(t.noiteDegraus, v ? 1 : 0); };
    t.pilha = v => { t.estado.pilha = !!v; t.tabs.forEach(e => { op1(e, v ? 1 : 0); tf(e, e._fim); }); };
    /* efeitos na camada do templo */
    t.poeira = (ctx, x, y, n, f) => Jogo.fx.poeira(ctx, t.fx, x, y, n, f);
    t.estilhacos = (ctx, x, y, n, f) => Jogo.fx.estilhacos(ctx, t.fx, x, y, n, f);
    t.tremor = (ctx, px, ms) => ctx.tremor(t.mundo, px, ms);
    /* marcas para Jogo.mover.andar: chama fn(k) quando os pés chegam a cada pouso do caminho a -> b */
    t.marcasDePouso = (a, b, fn) => {
      const c = Jogo.mover.caminho(rota(a, b)), m = []; let ac = 0;
      c.seg.forEach((d, i) => { ac += d; if ((i + 1) % 3 === 0) { const k = a + (i + 1) / 3; m.push({ q: ac / c.L - 0.004, fn: () => fn(k) }); } });
      return m;
    };
    t.hora(op.hora); t.construido(op.construido); t.degrauzinhos(op.degrauzinhos); t.pilha(op.pilha); t.camera(0, 0, 0, true);
    return t;
  }
  const GEO = { GY, TH, X0, LL, RL, W1, SR, tier, BASE, pouso, rota, PILHA };
  return { criar, FASES, geo: GEO, HORAS };
})();
