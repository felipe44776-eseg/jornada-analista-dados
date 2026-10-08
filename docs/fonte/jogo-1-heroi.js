/* ================================================================
   CAMADA DE JOGO · HERÓI
   O analista de dados: explorador de hoje, com mochila e notebook debaixo do braço.
   Sem gênero marcado, silhueta clara, quatro tons do azul e branco da ESEG.
   Esqueleto simples (coxa + canela, braços, tronco, cabeça) movido por poses; pés em (0,0).
   Uso:  const h = Heroi.criar(svg, { escala: 1 });  h.por(x, y);  h.estado('andando', fase);
   Estados: parado, andando, subindo, atingido, rolando, levantando, derrotado (+ h.piscar(ctx)).
   ================================================================ */
const Heroi = (() => {
  const L1 = 21, L2 = 21, QUADRIL = 42, ALTURA = 126;
  const C = { claro: '#F6F6FF', lav: '#C9C9EE', sombra: '#A9AADC', medio: '#8E90C8', aparelho: '#565A94', escuro: '#2A2F7C', marinho: '#000653', traco: '#00010F' };
  const rad = g => g * Math.PI / 180, n = v => Math.round(v * 10) / 10;
  const T = `stroke="${C.traco}" stroke-width="1.6" stroke-linejoin="round"`;

  /* ângulos em graus. cA/cB = coxa para a frente; kA/kB = joelho dobrado; br/ab = braço de trás e antebraço;
     bf = braço da frente; tr = tronco para a frente; cb = cabeça para a frente; giro = corpo inteiro;
     ar = no ar (dy explícito); sem ar, dy sai sozinho: o pé mais baixo encosta no chão */
  /* pf = perna da frente desenhada por cima do tronco (poses dobradas: sentado, agachado, rolando) */
  const BASE = { cA: 0, kA: 0, cB: 0, kB: 0, br: 0, ab: 0, bf: 0, tr: 0, cb: 0, giro: 0, dz: 0, olho: 'aberto', nota: 'braco', ar: false, pf: false };
  const POSES = {
    parado: { cA: 5, kA: 2, cB: -7, kB: 4, br: -8, ab: 12 },
    atingido: { cA: 40, kA: 14, cB: -26, kB: 34, br: 150, ab: 24, bf: 34, tr: -24, cb: -20, olho: 'x', ar: true, dy: -3 },
    rolando: { cA: 104, kA: 122, cB: 92, kB: 114, br: 64, ab: 84, bf: 26, tr: 46, cb: 30, olho: 'fechado', ar: true, dy: 20, pf: true },
    caido: { cA: 26, kA: 34, cB: 58, kB: 70, br: -50, ab: 20, bf: -10, cb: -6, giro: -90, olho: 'x', ar: true, dy: 33 },
    agachado: { cA: 80, kA: 120, cB: 62, kB: 104, br: 24, ab: 44, bf: 6, tr: 30, cb: 12, olho: 'fechado', pf: true },
    derrotado: { cA: 118, kA: 98, cB: 104, kB: 82, br: 30, ab: 20, bf: 64, tr: 10, cb: 44, dz: 5, olho: 'fechado', nota: 'chao', pf: true }
  };
  const pe = (c, k) => L1 * Math.cos(rad(c)) + L2 * Math.cos(rad(c - k));      // altura do quadril sobre o pé
  function resolver(p, extra) {
    const r = Object.assign({}, BASE, typeof p === 'string' ? POSES[p] : p, extra);
    if (!r.ar || r.dy == null) r.dy = QUADRIL - Math.max(pe(r.cA, r.kA), pe(r.cB, r.kB)) + r.dz;
    return r;
  }
  /* ciclo de passada: fase 0..1 = dois passos */
  function ciclo(fase, amp, joelho, tr) {
    const a = 2 * Math.PI * fase, s = Math.sin(a), c = Math.cos(a);
    return { cA: amp * s, kA: 5 + joelho * Math.max(0, c), cB: -amp * s, kB: 5 + joelho * Math.max(0, -c), br: amp * 0.9 * s, ab: 20, tr, cb: -tr * 0.4 };
  }
  function misturar(a, b, t) {
    const A = resolver(a), B = resolver(b), r = {};
    for (const k in A) r[k] = typeof A[k] === 'number' ? A[k] + (B[k] - A[k]) * t : (t < 0.5 ? A[k] : B[k]);
    r.ar = true;                                                               // dy já interpolado
    return r;
  }

  const perna = (lado, cor, bota) => `<g class="h-c${lado}"><rect x="-6" y="-3" width="12" height="26" rx="6" fill="${cor}" ${T}/>
      <g class="h-k${lado}"><rect x="-5.2" y="-3" width="10.4" height="19" rx="5.2" fill="${cor}" ${T}/>
        <path d="M-6.2,11 H6.2 V13.5 Q15.5,14.5 15.5,21 H-6.2 Z" fill="${bota}" ${T}/><path d="M-6.2,18.2 H15" stroke="${C.traco}" stroke-width="1.2" opacity=".55"/></g></g>`;
  const MARCA = `<g class="h-pos">
    <ellipse class="h-sombra" cx="2" cy="1.5" rx="25" ry="4.6" fill="${C.traco}" opacity=".42"/>
    <g class="h-nota-chao" opacity="0"><rect x="50" y="-6.5" width="35" height="6.5" rx="2" fill="${C.aparelho}" stroke="${C.claro}" stroke-width="1.6"/><path d="M52,-3.2 H83" stroke="${C.claro}" stroke-width="1" opacity=".7"/></g>
    <g class="h-corpo">
      <g class="h-tT">
        <g class="h-bT"><rect x="-4.4" y="-3" width="8.8" height="21" rx="4.4" fill="${C.sombra}" ${T}/>
          <g class="h-aT"><rect x="-4" y="-3" width="8" height="18" rx="4" fill="${C.sombra}" ${T}/><circle cx="0" cy="16" r="4.6" fill="${C.lav}" ${T}/></g></g>
        <g class="h-mochila"><rect x="-30" y="-49" width="21" height="10" rx="5" fill="${C.lav}" ${T}/><path d="M-24,-49 V-39 M-15,-49 V-39" stroke="${C.escuro}" stroke-width="1.5"/>
        <rect x="-32" y="-40" width="24" height="37" rx="7" fill="${C.medio}" ${T}/><path d="M-32,-28 H-8" stroke="${C.escuro}" stroke-width="1.6"/>
        <rect x="-28" y="-22" width="15" height="13" rx="3" fill="none" stroke="${C.escuro}" stroke-width="1.5"/></g>
      </g>
      ${perna('B', C.sombra, '#D9D9F4')}${perna('A', C.lav, C.claro)}
      <g class="h-tF">
        <path class="h-casaco" d="M-13,2 L-12,-30 Q-12,-40 -2,-40 L5,-40 Q14,-40 14,-30 L14,2 Q0,6 -13,2 Z" fill="${C.claro}" ${T}/>
        <path class="h-alca" d="M-9,-38 L4,-5" stroke="${C.medio}" stroke-width="3.6" stroke-linecap="round"/><path d="M-13,-3 Q0,1 14,-3" fill="none" stroke="${C.escuro}" stroke-width="2.2"/>
        <g class="h-nota" transform="rotate(-12 10 -18)"><rect x="-6" y="-29" width="33" height="22" rx="2.6" fill="${C.aparelho}" stroke="${C.claro}" stroke-width="1.7"/><circle cx="10.5" cy="-19.5" r="2.6" fill="${C.claro}"/><path d="M-4,-11.5 H25" stroke="${C.claro}" stroke-width="1.1" opacity=".75"/></g>
        <g class="h-bF"><path d="M0,0 L-5,19 L13,29" fill="none" stroke="${C.traco}" stroke-width="11.6" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M0,0 L-5,19 L13,29" fill="none" stroke="${C.claro}" stroke-width="8.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="13.5" cy="29" r="4.8" fill="${C.claro}" ${T}/></g>
        <g class="h-cb"><rect x="-4" y="-7" width="8" height="10" fill="${C.claro}"/>
          <circle cx="1" cy="-16" r="14.5" fill="${C.claro}" ${T}/><path d="M-13,-19 Q-16,-8 -9,-3.5 L-6,-9 Q-10,-12 -9,-20 Z" fill="${C.medio}" ${T}/>
          <circle class="h-o-aberto" cx="8.4" cy="-16.5" r="2.4" fill="${C.marinho}"/>
          <path class="h-o-fechado" d="M5,-16.5 Q8.2,-13.8 11.4,-16.5" fill="none" stroke="${C.marinho}" stroke-width="2.1" stroke-linecap="round"/>
          <path class="h-o-x" d="M5.6,-19.6 L11,-14.2 M11,-19.6 L5.6,-14.2" fill="none" stroke="${C.marinho}" stroke-width="2.3" stroke-linecap="round"/>
          <g class="h-chapeu"><ellipse cx="3" cy="-27" rx="23" ry="4.9" fill="${C.lav}" ${T}/><path d="M-10,-27 L-8,-38 Q1.5,-43.5 11,-38 L13,-27 Z" fill="${C.lav}" ${T}/>
          <path d="M-9.6,-30.4 L12.5,-30.4 L13,-27 L-10,-27 Z" fill="${C.marinho}"/></g></g>
      </g>
    </g>
    <g class="h-alerta" opacity="0"><rect x="-1" y="-166" width="9" height="20" rx="4.5" fill="#fff" ${T}/><circle cx="3.5" cy="-138" r="4.6" fill="#fff" ${T}/></g>
  </g>`;

  function criar(svgPai, op) {
    op = op || {};
    const g = Deck.util.svg('g', { class: 'jg-heroi' }); g.innerHTML = MARCA; svgPai.appendChild(g);
    const q = s => g.querySelector(s);
    const o = { pos: q('.h-pos'), corpo: q('.h-corpo'), tT: q('.h-tT'), tF: q('.h-tF'), cA: q('.h-cA'), kA: q('.h-kA'), cB: q('.h-cB'), kB: q('.h-kB'), bT: q('.h-bT'), aT: q('.h-aT'), bF: q('.h-bF'), cb: q('.h-cb'),
      olhos: { aberto: q('.h-o-aberto'), fechado: q('.h-o-fechado'), x: q('.h-o-x') }, nota: q('.h-nota'), notaChao: q('.h-nota-chao'), sombra: q('.h-sombra'), alerta: q('.h-alerta') };
    const st = { x: 0, y: 0, escala: op.escala || 1, pf: false };
    if (op.colega) {                                                         // "segunda pessoa": a mesma figura, sem chapéu, mochila nem notebook, em lavanda
      ['.h-mochila', '.h-chapeu', '.h-nota', '.h-alca', '.h-nota-chao'].forEach(s => q(s).setAttribute('display', 'none'));
      q('.h-casaco').setAttribute('fill', C.lav);
    }
    const h = {
      el: g, altura: ALTURA * st.escala,
      get x() { return st.x; }, get y() { return st.y; },
      por(x, y) { st.x = x; st.y = y; o.pos.setAttribute('transform', `translate(${n(x)},${n(y)}) scale(${st.escala})`); return h; },
      pose(p, extra) {
        const r = resolver(p, extra), tr = `translate(0,${-QUADRIL}) rotate(${n(r.tr)})`;
        o.corpo.setAttribute('transform', `translate(0,${n(r.dy)}) rotate(${n(r.giro)} 2 -48)`);
        o.tT.setAttribute('transform', tr); o.tF.setAttribute('transform', tr);
        o.cA.setAttribute('transform', `translate(2,${-QUADRIL}) rotate(${n(-r.cA)})`); o.kA.setAttribute('transform', `translate(0,${L1}) rotate(${n(r.kA)})`);
        o.cB.setAttribute('transform', `translate(-2,${-QUADRIL}) rotate(${n(-r.cB)})`); o.kB.setAttribute('transform', `translate(0,${L1}) rotate(${n(r.kB)})`);
        o.bT.setAttribute('transform', `translate(-4,-37) rotate(${n(-r.br)})`); o.aT.setAttribute('transform', `translate(0,16) rotate(${n(-r.ab)})`);
        o.bF.setAttribute('transform', `translate(4,-36) rotate(${n(-r.bf)})`); o.cb.setAttribute('transform', `translate(2,-41) rotate(${n(r.cb)})`);
        for (const k in o.olhos) o.olhos[k].setAttribute('opacity', k === r.olho ? 1 : 0);
        o.nota.setAttribute('opacity', r.nota === 'braco' ? 1 : 0); o.notaChao.setAttribute('opacity', r.nota === 'chao' ? 1 : 0);
        o.sombra.setAttribute('opacity', r.ar && r.dy < 30 ? 0.16 : 0.42);
        if (!!r.pf !== st.pf) { st.pf = !!r.pf; o.corpo.insertBefore(o.cA, st.pf ? null : o.tF); }
        return h;
      },
      /* estados nomeados; fase 0..1 (ciclo da passada, voltas do rolamento, progresso de levantar) */
      estado(nome, fase, sentido) {
        fase = fase || 0;
        if (nome === 'andando') return h.pose(ciclo(fase, 26, 44, 3));
        if (nome === 'subindo') return h.pose(ciclo(fase, 34, 64, 9));
        if (nome === 'rolando') return h.pose('rolando', { giro: (sentido || -1) * 360 * fase });
        if (nome === 'levantando') return h.pose(misturar('agachado', 'parado', fase));
        return h.pose(nome);                                                   // parado, atingido, caido, agachado, derrotado
      },
      mistura(a, b, t) { return h.pose(misturar(a, b, t)); },
      mostrar(v) { g.style.opacity = v ? 1 : 0; return h; },
      alerta(v) { o.alerta.setAttribute('opacity', v ? 1 : 0); return h; },
      /* pisca depois de perder vida (invencibilidade de jogo) */
      piscar(ctx, ms, atraso) {
        const n = 2 * Math.max(2, Math.round((ms || 800) / 220));              // n par: termina aceso
        const q = Array.from({ length: n + 1 }, (_, k) => ({ opacity: k % 2 ? 0.12 : 1, offset: k / n, easing: 'step-end' }));
        return ctx.anim(g, q, { duration: ms || 800, delay: atraso || 0, fill: 'none' });
      }
    };
    return h.por(0, 0).pose('parado');
  }

  /* oficina (?heroi=1): os estados lado a lado, ampliados, para julgar o desenho */
  function folha(palco) {
    const ESTADOS = [['parado', 0], ['andando', 0.12], ['subindo', 0.14], ['atingido', 0], ['piscando', 0], ['rolando', 0.1], ['levantando', 0.35], ['derrotado', 0]];
    const raiz = Deck.util.html('<div class="jg-oficina"><svg width="1280" height="720" viewBox="0 0 1280 720"><path d="M0,352 H1280 M0,682 H1280" stroke="#8E90C8" stroke-width="2" opacity=".5"/></svg><h1>Oficina do herói · estados</h1></div>');
    palco.appendChild(raiz);
    ESTADOS.forEach(([nome, fase], i) => {
      const x = 170 + (i % 4) * 305, y = i < 4 ? 352 : 682, h = criar(raiz.querySelector('svg'), { escala: 1.7 });
      h.por(x, nome === 'rolando' ? y - 4 : y).estado(nome === 'piscando' ? 'parado' : nome, fase);
      if (nome === 'piscando') h.el.style.opacity = 0.35;
      if (nome === 'atingido') h.alerta(true);
      raiz.appendChild(Deck.util.html(`<span class="jg-of-r" style="left:${x + 10}px;top:${y + 7}px">${nome}</span>`));
    });
  }
  return { criar, folha, ALTURA };
})();
