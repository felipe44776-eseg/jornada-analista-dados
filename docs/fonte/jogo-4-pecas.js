/* ================================================================
   CAMADA DE JOGO · PEÇAS: efeitos, pedra com motivo, lasca, cartão de texto, aposta, baú, logo
   Todas devolvem um objeto com `el` e um método de estado "na hora" (para o fim() dos passos),
   mais métodos animados que recebem o ctx do passo. Texto sempre em HTML; formas em SVG.
   ================================================================ */
(() => {
  const { html, svg, rng } = Deck.util;
  const n1 = v => Math.round(v * 10) / 10, pol = pts => pts.map(p => n1(p[0]) + ',' + n1(p[1])).join(' ');
  const br = linhas => (Array.isArray(linhas) ? linhas : [linhas]).join(' <br>');     // o espaço mantém o textContent legível

  /* ---------- efeitos: nascem numa camada <g> de SVG e somem sozinhos ---------- */
  Jogo.fx = {
    poeira(ctx, camada, x, y, n, f) {
      f = f || 1;
      for (let i = 0; i < n; i++) {
        const c = svg('circle', { cx: n1(x + (Math.random() - 0.5) * 14), cy: n1(y), r: n1(3 + Math.random() * 6), fill: '#C1C1E3', class: 'jg-po' });
        camada.appendChild(c); ctx.temp(c);
        const a = ctx.anim(c, [{ transform: 'translate(0px,0px) scale(.5)', opacity: 0.6 }, { transform: `translate(${n1((Math.random() - 0.5) * 70 * f)}px,${n1(-(8 + Math.random() * 30) * f)}px) scale(2)`, opacity: 0 }],
          { duration: 480 + Math.random() * 420, easing: 'cubic-bezier(.1,.6,.3,1)' });
        if (a) a.onfinish = () => ctx.soltar(c);
      }
    },
    estilhacos(ctx, camada, x, y, n, f) {
      f = f || 1;
      for (let i = 0; i < n; i++) {
        const g = svg('polygon', { points: '-8,-5 5,-8 9,3 -2,8', fill: i % 3 ? '#E3E2FD' : '#A9AADC', stroke: '#00010F', 'stroke-width': 1.2 });
        camada.appendChild(g); ctx.temp(g);
        const dx = (Math.random() - 0.5) * 260 * f, sobe = 30 + Math.random() * 90, gira = (Math.random() - 0.5) * 700, k = 0.6 + Math.random() * 0.9;
        const a = ctx.anim(g, [{ transform: `translate(${n1(x)}px,${n1(y)}px) rotate(0deg) scale(${n1(k)})`, opacity: 1, easing: 'cubic-bezier(.2,.6,.5,1)' },
          { transform: `translate(${n1(x + dx * 0.55)}px,${n1(y - sobe)}px) rotate(${n1(gira * 0.5)}deg) scale(${n1(k)})`, opacity: 1, offset: 0.4, easing: 'cubic-bezier(.5,0,.9,.5)' },
          { transform: `translate(${n1(x + dx)}px,${n1(y + 120)}px) rotate(${n1(gira)}deg) scale(${n1(k * 0.7)})`, opacity: 0 }], { duration: 620 + Math.random() * 380 });
        if (a) a.onfinish = () => ctx.soltar(g);
      }
    }
  };

  /* ---------- pedra com motivo: a pedra grande, lida antes do impacto ---------- */
  function corpoDaPedra(w, h, semente, redonda) {                       // contorno irregular com semente; laje (superelipse) ou redonda
    const rnd = rng(semente), n = 13, e = redonda ? 2 : 4.6, cx = w / 2, cy = h / 2, pts = [], baixo = [], dentro = [];
    for (let i = 0; i < n; i++) {
      const a = (i + (rnd() - 0.5) * 0.45) / n * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
      const rr = Math.pow(Math.pow(Math.abs(c), e) + Math.pow(Math.abs(s), e), -1 / e) * (0.94 + rnd() * 0.06);
      const p = [cx + c * rr * (w / 2 - 3), cy + s * rr * (h / 2 - 3)];
      pts.push(p);
      if (s > 0.15) { baixo.push(p); dentro.unshift([cx + (p[0] - cx) * 0.9, cy + (p[1] - cy) * 0.8]); }
    }
    return `<svg viewBox="0 0 ${w} ${h}"><defs><linearGradient id="jg-pg${semente}" x1="0" y1="0" x2="0.25" y2="1"><stop offset="0" stop-color="#FBFBFF"/><stop offset=".55" stop-color="#E3E2FD"/><stop offset="1" stop-color="#C4C5EA"/></linearGradient></defs>
      <polygon points="${pol(pts)}" fill="url(#jg-pg${semente})" stroke="#00010F" stroke-width="2.4" stroke-linejoin="round"/>
      <polygon points="${pol(baixo.concat(dentro))}" fill="#8E90C8" opacity=".38"/>
      <path d="M${n1(w * 0.1)},${n1(h * 0.3)} l9,6 l-4,9 M${n1(w * 0.88)},${n1(h * 0.62)} l-10,-5 l3,-9" fill="none" stroke="#8E90C8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }
  const P0 = 'translate(0px,0px) rotate(0deg)';
  const CHEGADAS = {                                                    // [quadros, opções]: chega e para onde é lida
    cai: [[{ opacity: 1, transform: 'translate(0px,-430px) rotate(-8deg)' }, { opacity: 1, transform: 'translate(0px,12px) rotate(2deg)', offset: 0.62 }, { opacity: 1, transform: 'translate(0px,-5px) rotate(-1deg)', offset: 0.82 }, { opacity: 1, transform: P0 }], { duration: 560, easing: 'cubic-bezier(.4,0,.6,1)' }],
    pousa: [[{ opacity: 1, transform: 'translate(40px,-460px) rotate(50deg)', easing: 'cubic-bezier(.55,0,1,.5)' }, { opacity: 1, transform: P0, offset: 0.66 }, { opacity: 1, transform: 'translate(0px,-9px) rotate(-3deg)', offset: 0.82 }, { opacity: 1, transform: P0 }], { duration: 640 }],
    desliza: [[{ opacity: 1, transform: 'translate(780px,-40px) rotate(14deg)' }, { opacity: 1, transform: 'translate(-22px,2px) rotate(-4deg)', offset: 0.7 }, { opacity: 1, transform: P0 }], { duration: 480, easing: 'cubic-bezier(.1,.7,.3,1)' }],
    desce: [[{ opacity: 1, transform: 'translate(0px,-420px) rotate(3deg)' }, { opacity: 1, transform: P0 }], { duration: 950, easing: 'cubic-bezier(.2,.5,.3,1)' }],
    esquerda: [[{ opacity: 1, transform: 'translate(-640px,-30px) rotate(-10deg)' }, { opacity: 1, transform: P0 }], { duration: 750, easing: 'cubic-bezier(.1,.6,.2,1)' }]
  };
  /* o = { linhas, x, y (centro onde ela para e é lida), w, h, corpo (px do texto), redonda, semente } */
  Jogo.pedra = (pai, o) => {
    const el = html(`<div class="jg-pedra" style="left:${o.x - o.w / 2}px;top:${o.y - o.h / 2}px;width:${o.w}px;height:${o.h}px;font-size:${o.corpo || 28}px;opacity:0">${corpoDaPedra(o.w, o.h, o.semente || 11, o.redonda)}<span>${br(o.linhas)}</span></div>`);
    pai.appendChild(el);
    return {
      el, x: o.x, y: o.y,
      mostrar(v) { el.style.opacity = v ? 1 : 0; el.style.transform = 'none'; },
      /* modo: cai | pousa | desliza | desce | esquerda. Devolve a duração (ms): some `atraso` para saber quando ela está parada */
      chegar(ctx, modo, atraso) { const c = CHEGADAS[modo || 'cai']; ctx.anim(el, c[0], Object.assign({ delay: atraso || 0 }, c[1])); return c[1].duration; },
      /* flutua enquanto é lida; chame .cancel() no retorno antes do golpe. Crie só na hora (dentro de ctx.em) */
      flutuar(ctx) { return ctx.anim(el, [{ translate: '0px 0px' }, { translate: '0px -7px' }], { duration: 640, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out', fill: 'none' }); },
      /* g = { dx, dy, rot, ms, recuo }: do ponto de leitura até o alvo. Crie só na hora. Devolve a duração total */
      golpear(ctx, g) {
        const rec = g.recuo || 0, q = [{ opacity: 1, transform: P0 }];
        if (rec) q.push({ opacity: 1, transform: g.recuoPara || `translate(${n1(-g.dx * 0.07)}px,-16px) rotate(${n1(-g.rot * 0.2)}deg)`, offset: rec / (rec + g.ms), easing: 'cubic-bezier(.6,0,1,.55)' });
        q.push({ opacity: 1, transform: `translate(${g.dx}px,${g.dy}px) rotate(${g.rot}deg)` });
        ctx.anim(el, q, { duration: rec + g.ms, easing: rec ? 'ease-out' : 'cubic-bezier(.55,0,1,.5)' });
        return rec + g.ms;
      },
      /* some no ponto do golpe (o estilhaço é Jogo.fx.estilhacos) */
      desfazer(ctx, g) { ctx.anim(el, [{ opacity: 1, transform: `translate(${g.dx}px,${g.dy}px) rotate(${g.rot}deg) scale(1)` }, { opacity: 0, transform: `translate(${g.dx - 14}px,${g.dy + 18}px) rotate(${g.rot - 8}deg) scale(1.18)` }], { duration: 170, easing: 'ease-out' }); }
    };
  };
  /* lasca: o motivo que fica à vista depois do impacto. o = { linhas, x, y, rot } */
  Jogo.lasca = (pai, o) => {
    const x = o.x == null ? 890 : o.x, rot = o.rot || 0;
    const el = html(`<div class="jg-lasca" style="left:${x}px;top:${o.y}px;opacity:0"><div>${br(o.linhas)}</div></div>`);
    pai.appendChild(el);
    return {
      el, x, y: o.y,
      fixar(v) { el.style.opacity = v === false ? 0 : 1; el.style.transform = `rotate(${rot}deg)`; },
      /* salta de (deX, deY) e se crava no lugar; devolve o instante (ms) em que crava */
      cravar(ctx, deX, deY, atraso) {
        const dx = deX - (x + 70), dy = deY - (o.y + 22), d = atraso == null ? 90 : atraso;
        ctx.anim(el, [{ opacity: 0, transform: `translate(${n1(dx)}px,${n1(dy)}px) rotate(-40deg) scale(.35)` }, { opacity: 1, transform: `translate(${n1(dx * 0.5)}px,${n1(dy * 0.5 - 90)}px) rotate(20deg) scale(.8)`, offset: 0.5 },
          { opacity: 1, transform: `translate(0px,0px) rotate(${rot}deg) scale(1)` }], { duration: 640, delay: d, easing: 'cubic-bezier(.3,.3,.4,1)' });
        return d + 640;
      }
    };
  };

  /* ---------- cartão de texto: cabeçalho, linhas, rodapé; `destaque` = linha em ciano (só o que é da IA) ----------
     o = { cabecalho, linhas: ['texto' | { n: '1.', t: 'texto', destaque: true }], rodape, x, y, largura, rot } */
  Jogo.cartao = (pai, o) => {
    const rot = o.rot == null ? -1.2 : o.rot, L = (o.linhas || []).map(l => typeof l === 'string' ? { t: l } : l);
    const el = html(`<div class="jg-cartao" style="left:${o.x}px;top:${o.y}px;width:${o.largura || 612}px;opacity:0">${o.cabecalho ? `<div class="jg-ct-cab">${o.cabecalho}</div>` : ''}
      ${L.map(l => `<div class="jg-ct-l${l.destaque ? ' destaque' : ''}">${l.n ? `<b>${l.n}</b> ` : ''}<span>${l.t}</span></div>`).join('')}${o.rodape ? `<div class="jg-ct-rod">${o.rodape}</div>` : ''}</div>`);
    pai.appendChild(el);
    const linhas = Array.from(el.querySelectorAll('.jg-ct-l')), rod = el.querySelector('.jg-ct-rod');
    return {
      el, linhas, rodape: rod,
      /* visivel; linhas = quantas linhas aparecem (padrão: todas); rodape (padrão: junto com a última linha) */
      definir(e) {
        const n = e.linhas == null ? linhas.length : e.linhas;
        el.style.opacity = e.visivel ? 1 : 0; el.style.transform = `rotate(${rot}deg)`;
        linhas.forEach((l, i) => { l.style.opacity = i < n ? 1 : 0; l.style.transform = 'none'; });
        if (rod) rod.style.opacity = (e.rodape == null ? n >= linhas.length : e.rodape) ? 1 : 0;
      },
      /* cai no lugar; as linhas ficam escondidas até revelar(). Devolve a duração */
      entrar(ctx, atraso) {
        ctx.anim(el, [{ opacity: 0, transform: 'translateY(-90px) rotate(-9deg)' }, { opacity: 1, transform: 'translateY(8px) rotate(0.6deg)', offset: 0.7 }, { opacity: 1, transform: `translateY(0px) rotate(${rot}deg)` }], { duration: 620, delay: atraso || 0, easing: 'ease-out' });
        linhas.forEach(l => ctx.anim(l, [{ opacity: 0 }, { opacity: 0 }], { duration: 1, delay: 0 }));
        if (rod) ctx.anim(rod, [{ opacity: 0 }, { opacity: 0 }], { duration: 1 });
        return 620;
      },
      /* revela a linha i (ou 'rodape'). Crie com atraso a partir do início do passo */
      revelar(ctx, i, atraso) { ctx.anim(i === 'rodape' ? rod : linhas[i], [{ opacity: 0, transform: 'translateX(-16px)' }, { opacity: 1, transform: 'translateX(0px)' }], { duration: 340, delay: atraso || 0, easing: 'ease-out' }); },
      sair(ctx, atraso) { ctx.anim(el, [{ opacity: 1, transform: `translateY(0px) rotate(${rot}deg)` }, { opacity: 0, transform: `translateY(30px) rotate(${rot}deg)` }], { duration: 320, delay: atraso || 0, easing: 'ease-in' }); }
    };
  };

  /* ---------- aposta: pergunta, três opções, revelação da certa ----------
     o = { pergunta, opcoes: ['10%', '25%', '50%'], certa: 1, x, y, largura } */
  Jogo.aposta = (pai, o) => {
    const el = html(`<div class="jg-aposta" style="left:${o.x}px;top:${o.y}px;width:${o.largura || 560}px;opacity:0"><div class="jg-ap-q">${o.pergunta}</div><div class="jg-ap-o">${o.opcoes.map(t => `<span>${t}</span>`).join('')}</div></div>`);
    pai.appendChild(el);
    const ops = Array.from(el.querySelectorAll('.jg-ap-o span'));
    const pintar = rev => ops.forEach((s, i) => { s.classList.toggle('certa', rev && i === o.certa); s.classList.toggle('errada', rev && i !== o.certa); });
    return {
      el, opcoes: ops,
      definir(e) { el.style.opacity = e.visivel ? 1 : 0; el.style.transform = 'none'; pintar(!!e.revelada); },
      entrar(ctx, atraso) {
        ctx.anim(el, [{ opacity: 0, transform: 'translateY(26px) scale(.94)' }, { opacity: 1, transform: 'translateY(0px) scale(1)' }], { duration: 420, delay: atraso || 0, easing: 'cubic-bezier(.2,.7,.2,1)' });
        ops.forEach((s, i) => ctx.anim(s, [{ opacity: 0, transform: 'scale(.6)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 260, delay: (atraso || 0) + 380 + i * 140, easing: 'ease-out', fill: 'backwards' }));
        return 380 + ops.length * 140 + 260;
      },
      /* marca a certa e apaga as outras. Crie só na hora (dentro de ctx.em) */
      revelar(ctx) { pintar(true); ctx.anim(ops[o.certa], [{ transform: 'scale(1)' }, { transform: 'scale(1.3)' }, { transform: 'scale(1.06)' }], { duration: 420, easing: 'ease-out', fill: 'none' }); }
    };
  };

  /* ---------- baú: fechado, armadilha (aberto, causa dano), exposto (aberto no portão, sem dano) ----------
     Vive numa camada de SVG; (0,0) é o meio da base. A faixa ciano marca que veio da IA. */
  const T = 'stroke="#00010F" stroke-width="1.8" stroke-linejoin="round"';
  const BOLA = (cx, cy, r, cor) => `<g>${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<polygon points="${cx - 5},${cy - r + 2} ${cx},${cy - r - 9} ${cx + 5},${cy - r + 2}" transform="rotate(${a} ${cx} ${cy})" fill="${cor}" ${T}/>`).join('')}<circle cx="${cx}" cy="${cy}" r="${r}" fill="${cor}" ${T}/><circle cx="${cx - r * 0.3}" cy="${cy - r * 0.3}" r="${r * 0.28}" fill="#fff" opacity=".7"/></g>`;
  const CAIXA = `<rect x="-44" y="-46" width="88" height="46" rx="5" fill="#C9C9EE" ${T}/><path d="M-44,-23 H44" stroke="#8E90C8" stroke-width="2"/><rect x="-10" y="-46" width="20" height="46" fill="#00A1B8" ${T}/><circle cx="0" cy="-27" r="6" fill="#fff" ${T}/>`;
  const TAMPA = `<path d="M-46,-46 Q-46,-78 0,-78 Q46,-78 46,-46 Z" fill="#A9AADC" ${T}/><path d="M-10,-46 V-76.5 Q0,-78 10,-76.5 V-46 Z" fill="#00A1B8" ${T}/>`;
  Jogo.bau = (camada, o) => {
    o = o || {};
    const g = svg('g', { class: 'jg-bau' });
    g.innerHTML = `<g class="b-pos"><ellipse cx="0" cy="2" rx="50" ry="6" fill="#00010F" opacity=".4"/>
      <g class="b-fechado">${CAIXA}${TAMPA}</g>
      <g class="b-armadilha"><polygon points="${Array.from({ length: 20 }, (_, i) => { const a = i / 20 * Math.PI * 2, r = i % 2 ? 34 : 66; return n1(Math.cos(a) * r) + ',' + n1(-96 + Math.sin(a) * r * 0.82); }).join(' ')}" fill="#fff" ${T}/>
        <g transform="translate(-44,-46) rotate(-112)"><g transform="translate(44,46)">${TAMPA}</g></g>${CAIXA}<rect x="-40" y="-52" width="80" height="9" rx="3" fill="#00010F"/>
        <path d="M0,-48 l-9,-7 l18,-7 l-18,-7 l18,-7 l-9,-6" fill="none" stroke="#8E90C8" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>${BOLA(0, -102, 17, '#E3E2FD')}</g>
      <g class="b-exposto"><g opacity=".34">${CAIXA}${TAMPA}</g><rect x="-44" y="-46" width="88" height="46" rx="5" fill="none" stroke="#E3E2FD" stroke-width="2.4" stroke-dasharray="7 5"/>
        <path d="M-46,-46 Q-46,-78 0,-78 Q46,-78 46,-46" fill="none" stroke="#E3E2FD" stroke-width="2.4" stroke-dasharray="7 5"/>${BOLA(0, -30, 13, '#fff')}
        <path d="M-58,-70 V-88 H-40 M58,-70 V-88 H40 M-58,-8 V8 H-40 M58,-8 V8 H40" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/></g></g>`;
    camada.appendChild(g);
    const pos = g.querySelector('.b-pos'), partes = { fechado: g.querySelector('.b-fechado'), armadilha: g.querySelector('.b-armadilha'), exposto: g.querySelector('.b-exposto') };
    const st = { x: 0, y: 0, escala: o.escala || 1 };
    const b = {
      el: g,
      por(x, y) { st.x = x; st.y = y; pos.setAttribute('transform', `translate(${n1(x)},${n1(y)}) scale(${st.escala})`); return b; },
      estado(nome) { for (const k in partes) partes[k].setAttribute('opacity', k === nome ? 1 : 0); return b; },
      mostrar(v) { g.style.opacity = v ? 1 : 0; return b; },
      /* abre com um salto; nome = 'armadilha' ou 'exposto'. Crie só na hora (dentro de ctx.em) */
      abrir(ctx, nome) { b.estado(nome); g.style.transformBox = 'fill-box'; g.style.transformOrigin = '50% 100%'; return ctx.anim(g, [{ transform: 'scale(1,.8)' }, { transform: 'scale(1.12,1.14)' }, { transform: 'scale(1)' }], { duration: 300, easing: 'ease-out', fill: 'none' }); }
    };
    return b.por(0, 0).estado('fechado');
  };

  /* logo da ESEG, discreto no canto (branco, para fundo escuro) */
  Jogo.logo = pai => { const el = html(`<img class="jg-logo" alt="Faculdade ESEG" src="${ATIVOS.logoEseg}">`); pai.appendChild(el); return el; };
})();
