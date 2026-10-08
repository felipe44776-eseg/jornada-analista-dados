/* ================================================================
   CAMADA DE JOGO · o que mais de uma das cenas 02 a 04 usa:
   cabeçalho da cena (eyebrow + título), frase de pé de tela, balão de fala, prêmio (que pode falhar),
   e um palco em camadas para cena que não usa o templo (o mapa da cena 04).
   ================================================================ */
(() => {
  const { html, svg } = Deck.util, n1 = v => Math.round(v * 10) / 10;
  const some = [{ opacity: 1 }, { opacity: 0 }];

  /* cabeçalho fixo da cena, no canto de cima à esquerda, sob o HUD. o = { eyebrow, titulo } */
  Jogo.cabecalho = (pai, o) => {
    const el = html(`<header class="jg-cab" style="opacity:0"><span class="jg-cab-e">${o.eyebrow}</span><h1 class="jg-cab-t">${o.titulo}</h1></header>`);
    pai.appendChild(el);
    return { el, definir(v) { el.style.opacity = v ? 1 : 0; el.style.transform = 'none'; },
      entrar(ctx, atraso) { return ctx.anim(el, [{ opacity: 0, transform: 'translateX(-28px)' }, { opacity: 1, transform: 'translateX(0px)' }], { duration: 800, delay: atraso || 0, easing: 'cubic-bezier(.2,.7,.2,1)' }); } };
  };

  /* frase centrada no pé da tela. o = { texto, y (topo, padrão 636), acento: true = pergunta ou frase "da IA", em ciano e maior } */
  Jogo.frase = (pai, o) => {
    const el = html(`<p class="jg-frase${o.acento ? ' acento' : ''}" style="top:${o.y == null ? (o.acento ? 642 : 636) : o.y}px;opacity:0">${o.texto || ''}</p>`);
    pai.appendChild(el);
    return { el, definir(v, texto) { if (texto != null) el.textContent = texto; el.style.opacity = v ? 1 : 0; el.style.transform = 'none'; },
      entrar(ctx, atraso) { return ctx.anim(el, [{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'translateY(0px)' }], { duration: 520, delay: atraso || 0, easing: 'ease-out' }); },
      sair(ctx, atraso) { return ctx.anim(el, some, { duration: 300, delay: atraso || 0 }); } };
  };

  /* balão de fala: o canto de baixo à esquerda fica em (x, y), perto de quem fala. ia: true = fala da IA (contorno ciano) */
  Jogo.balao = (pai, o) => {
    const el = html(`<div class="jg-balao${o.ia === false ? '' : ' ia'}" style="left:${o.x}px;top:${o.y}px;opacity:0"><div>${o.texto}</div></div>`);
    pai.appendChild(el);
    return { el, definir(v) { el.style.opacity = v ? 1 : 0; el.style.transform = 'none'; },
      por(x, y) { el.style.left = x + 'px'; el.style.top = y + 'px'; },
      entrar(ctx, atraso) { return ctx.anim(el, [{ opacity: 0, transform: 'scale(.5)' }, { opacity: 1, transform: 'scale(1.08)', offset: 0.7 }, { opacity: 1, transform: 'scale(1)' }], { duration: 280, delay: atraso || 0, easing: 'ease-out' }); },
      sair(ctx, atraso) { return ctx.anim(el, some, { duration: 220, delay: atraso || 0 }); } };
  };

  /* ---------- prêmio: taça em azul e branco. Estados: inteiro, falha (imagem com defeito), desfeito (sumiu) ---------- */
  const T = 'stroke="#00010F" stroke-width="1.8" stroke-linejoin="round"';
  const TACA = `<path d="M-29,-94 Q-52,-92 -47,-73 Q-43,-61 -26,-62 M29,-94 Q52,-92 47,-73 Q43,-61 26,-62" fill="none" stroke="#C9C9EE" stroke-width="6.5" stroke-linecap="round"/>
    <rect x="-30" y="-9" width="60" height="9" rx="3" fill="#8E90C8" ${T}/><rect x="-21" y="-19" width="42" height="10" rx="3" fill="#A9AADC" ${T}/><rect x="-5.5" y="-40" width="11" height="22" fill="#C9C9EE" ${T}/>
    <path d="M-31,-102 H31 L27,-64 Q22,-39 0,-38 Q-22,-39 -27,-64 Z" fill="#F6F6FF" ${T}/><path d="M-31,-102 H31 L30,-93 H-30 Z" fill="#C9C9EE" ${T}/>
    <polygon points="${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 5.2 : 12.5; return n1(Math.cos(a) * r) + ',' + n1(-71 + Math.sin(a) * r); }).join(' ')}" fill="#000653"/>`;
  const RAIOS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => `<polygon points="-5,-66 0,-112 5,-66" transform="rotate(${i * 36} 0 -70)"/>`).join('');
  let serie = 0;
  Jogo.premio = (camada, o) => {
    o = o || {}; const id = 'jg-pr' + (++serie), FAIXAS = [[-150, 62], [-88, 40], [-48, 60]], DESVIO = [-13, 10, -7];
    const g = svg('g', { class: 'jg-premio' });
    g.innerHTML = `<defs>${FAIXAS.map((f, i) => `<clipPath id="${id}-${i}"><rect x="-90" y="${f[0]}" width="180" height="${f[1]}"/></clipPath>`).join('')}</defs>
      <g class="p-pos"><ellipse cx="0" cy="2" rx="40" ry="5" fill="#00010F" opacity=".4"/><g class="p-raios" fill="#E3E2FD" opacity=".42">${RAIOS}</g>
        ${FAIXAS.map((f, i) => `<g clip-path="url(#${id}-${i})"><g class="p-fatia">${TACA}</g></g>`).join('')}
        <g class="p-ruido" fill="#E3E2FD" opacity="0"><rect x="-58" y="-90" width="40" height="4"/><rect x="14" y="-50" width="52" height="4"/><rect x="-44" y="-24" width="30" height="3"/></g></g>`;
    camada.appendChild(g);
    const pos = g.querySelector('.p-pos'), fatias = Array.from(g.querySelectorAll('.p-fatia')), ruido = g.querySelector('.p-ruido'), raios = g.querySelector('.p-raios');
    const st = { x: 0, y: 0, escala: o.escala || 1 };
    const p = {
      el: g,
      por(x, y) { st.x = x; st.y = y; pos.setAttribute('transform', `translate(${n1(x)},${n1(y)}) scale(${st.escala})`); return p; },
      estado(nome) {
        const falha = nome === 'falha';
        fatias.forEach((f, i) => f.setAttribute('transform', `translate(${falha ? DESVIO[i] : 0},0)`));
        ruido.setAttribute('opacity', falha ? 0.9 : 0); raios.setAttribute('opacity', falha ? 0.12 : 0.42);
        pos.setAttribute('opacity', nome === 'desfeito' ? 0 : 1);
        return p;
      },
      mostrar(v) { g.style.opacity = v ? 1 : 0; return p; },
      /* pisca entre inteiro e falha por `ms` e termina em `aoFim` ('inteiro', 'falha' ou 'desfeito'). O fim() do passo fixa o mesmo estado */
      falhar(ctx, ms, aoFim) { const n = Math.max(2, Math.round((ms || 500) / 80)); for (let k = 0; k < n; k++) ctx.em(k * 80, () => p.estado(k % 2 ? 'inteiro' : 'falha')); ctx.em(n * 80, () => p.estado(aoFim || 'inteiro')); return n * 80; }
    };
    return p.por(0, 0).estado('inteiro');
  };

  /* ---------- palco em camadas para cena sem templo ----------
     Devolve as mesmas camadas do templo: hud (HTML acima do mundo), topo (HTML no mundo), atores e fx (g de SVG),
     mais `desenho` (g de SVG para o cenário da cena). O mundo treme; o hud não. */
  Jogo.camadas = (palco, o) => {
    o = o || {}; const S = 'width="1280" height="720" viewBox="0 0 1280 720"';
    const raiz = html(`<div class="jg-cena${o.classe ? ' ' + o.classe : ''}"><div class="jg-mundo"><svg ${S}><g class="jg-desenho"></g></svg><div class="jg-z jg-meio"></div><svg ${S}><g class="jg-atores"></g><g class="jg-fx"></g></svg><div class="jg-z jg-topo"></div></div><div class="jg-z jg-hudc"></div></div>`);
    palco.appendChild(raiz);
    const q = s => raiz.querySelector(s), c = { raiz, mundo: q('.jg-mundo'), desenho: q('.jg-desenho'), meio: q('.jg-meio'), atores: q('.jg-atores'), fx: q('.jg-fx'), topo: q('.jg-topo'), hud: q('.jg-hudc') };
    c.poeira = (ctx, x, y, n, f) => Jogo.fx.poeira(ctx, c.fx, x, y, n, f);
    c.estilhacos = (ctx, x, y, n, f) => Jogo.fx.estilhacos(ctx, c.fx, x, y, n, f);
    c.tremor = (ctx, px, ms) => ctx.tremor(c.mundo, px, ms);
    return c;
  };
})();
