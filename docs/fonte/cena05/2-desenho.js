
  /* ================= Parte 2: desenho (emblemas, medalha, trilha dos quatro mundos) =================
     Mesma linguagem do herói: preenchimento chapado nos tons claros, contorno escuro fino e de junta redonda.
     Tudo azul e branco. O único ciano é a faísca do marco do mundo 2 (ver MARCO_FAISCA_CIANO). */
  const { html, svg } = Deck.util;
  const { tier, pouso } = Templo.geo;
  const N = CONQUISTAS.length;
  const esc = t => String(t).replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
  const n1 = v => Math.round(v * 10) / 10;
  const TR = '#00010F', CL = '#F6F6FF', LV = '#C9C9EE', SB = '#A9AADC', MD = '#8E90C8', ES = '#2A2F7C', MR = '#000653', CIANO = '#00A1B8';
  const T = `stroke="${TR}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"`;
  const VB = 'viewBox="-64 -64 128 128" aria-hidden="true"';     // (0,0) é o centro da medalha: girar e escalar saem em torno dele
  /* o marco do mundo 2 é a faísca da IA: ciano, como o aliado. `false` desenha a faísca em branco */
  const MARCO_FAISCA_CIANO = true;

  /* ---------- os cinco emblemas ----------
     des   o desenho, dentro da face da medalha (raio útil de uns 40). O que se mexe fica em <g class="c05-vivo">
     vida  o gesto do emblema logo depois de encaixar, só no aviso: (ctx, g, atraso) */
  const viver = (quadros, ms, curva) => (ctx, g, atraso) => ctx.anim(g, quadros, { duration: ms, delay: atraso, easing: curva || 'linear', fill: 'backwards' });
  const EMBLEMAS = {
    ampulheta: {                                                 // a ampulheta vira
      des: `<g class="c05-vivo"><path d="M-18,-27 H18 V-22 Q18,-8 4,-1.6 V1.6 Q18,8 18,22 V27 H-18 V22 Q-18,8 -4,1.6 V-1.6 Q-18,-8 -18,-22 Z" fill="${CL}" ${T}/>
        <path d="M-10,-11 Q0,-8.5 10,-11 Q7,-5 2.6,-2.6 H-2.6 Q-7,-5 -10,-11 Z" fill="${ES}"/><path d="M0,-2 V17" stroke="${ES}" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M-15,25.2 Q-13,13 0,9 Q13,13 15,25.2 Z" fill="${ES}"/>
        <rect x="-25" y="-36" width="50" height="9.5" rx="4.6" fill="${LV}" ${T}/><rect x="-25" y="26.5" width="50" height="9.5" rx="4.6" fill="${LV}" ${T}/></g>`,
      vida: viver([{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], 760, 'cubic-bezier(.5,0,.2,1)')
    },
    alvo: {                                                      // a flecha chega e crava na mosca
      des: `<circle r="33" fill="${CL}" ${T}/><circle r="23.5" fill="${MD}" ${T}/><circle r="14" fill="${CL}" ${T}/><circle r="5.4" fill="${MR}"/>
        <g class="c05-vivo"><path d="M24,-24 L36,-36 L43.1,-31.7 L33.2,-21.8 Z" fill="${CL}" ${T}/><path d="M24,-24 L36,-36 L31.7,-43.1 L21.8,-33.2 Z" fill="${LV}" ${T}/>
        <path d="M37,-37 L2.5,-2.5" stroke="${TR}" stroke-width="7.4" stroke-linecap="round"/><path d="M37,-37 L2.5,-2.5" stroke="${CL}" stroke-width="3.4" stroke-linecap="round"/></g>`,
      vida: viver([{ opacity: 0, transform: 'translate(52px,-52px) rotate(0deg)', easing: 'cubic-bezier(.5,0,.9,.6)' }, { opacity: 1, transform: 'translate(0px,0px) rotate(0deg)', offset: 0.4 },
        { opacity: 1, transform: 'translate(0px,0px) rotate(-7deg)', offset: 0.56 }, { opacity: 1, transform: 'translate(0px,0px) rotate(5deg)', offset: 0.72 },
        { opacity: 1, transform: 'translate(0px,0px) rotate(-2deg)', offset: 0.87 }, { opacity: 1, transform: 'translate(0px,0px) rotate(0deg)' }], 760)
    },
    olho: {                                                      // o olho pisca duas vezes
      des: `<path d="M0,-22 V-33 M-18.5,-17.5 L-25,-27 M18.5,-17.5 L25,-27" fill="none" stroke="${LV}" stroke-width="4.4" stroke-linecap="round"/>
        <g class="c05-vivo"><path d="M-36,0 Q0,-31 36,0 Q0,31 -36,0 Z" fill="${CL}" ${T}/><circle r="14.5" fill="${MD}" ${T}/><circle r="7" fill="${MR}"/><circle cx="-4.6" cy="-4.6" r="3.3" fill="#fff"/></g>`,
      vida: viver([{ transform: 'scaleY(1)' }, { transform: 'scaleY(.08)', offset: 0.16 }, { transform: 'scaleY(1)', offset: 0.34 }, { transform: 'scaleY(1)', offset: 0.6 },
        { transform: 'scaleY(.08)', offset: 0.76 }, { transform: 'scaleY(1)' }], 760)
    },
    ponte: {                                                     // a ponte se estende de uma margem à outra
      des: `<path d="M-32,27 q5.33,-4.4 10.67,0 t10.67,0 t10.67,0 t10.67,0 t10.67,0 t10.67,0 M-21,35.5 q5.25,-4.4 10.5,0 t10.5,0 t10.5,0 t10.5,0" fill="none" stroke="${MD}" stroke-width="3" stroke-linecap="round"/>
        <g class="c05-vivo"><path d="M-39,-7 Q0,-19 39,-7 V21 H25 Q25,-1 0,-1 Q-25,-1 -25,21 H-39 Z" fill="${CL}" ${T}/>
        <path d="M-39,-16 Q0,-28 39,-16" fill="none" stroke="${LV}" stroke-width="3.6" stroke-linecap="round"/>
        <path d="M-26,-19.3 V-10.8 M-13,-21.3 V-12.6 M0,-22 V-13.4 M13,-21.3 V-12.6 M26,-19.3 V-10.8" fill="none" stroke="${LV}" stroke-width="3" stroke-linecap="round"/></g>`,
      vida: viver([{ transform: 'translate(-39px,0px) scaleX(0) translate(39px,0px)' }, { transform: 'translate(-39px,0px) scaleX(1.05) translate(39px,0px)', offset: 0.72 },
        { transform: 'translate(-39px,0px) scaleX(1) translate(39px,0px)' }], 620, 'cubic-bezier(.2,.7,.3,1)')
    },
    bussola: {                                                   // a agulha oscila e acha o rumo
      des: `<path d="M0,-41 V-34 M0,41 V34 M-41,0 H-34 M41,0 H34" fill="none" stroke="${LV}" stroke-width="3.8" stroke-linecap="round"/>
        <path d="M27.4,-27.4 L24.4,-24.4 M-27.4,-27.4 L-24.4,-24.4 M27.4,27.4 L24.4,24.4 M-27.4,27.4 L-24.4,24.4" fill="none" stroke="${MD}" stroke-width="3" stroke-linecap="round"/>
        <g class="c05-vivo" transform="rotate(40)"><path d="M0,-31.5 L12.5,0 H-12.5 Z" fill="${CL}" ${T}/><path d="M0,31.5 L12.5,0 H-12.5 Z" fill="${MD}" ${T}/></g>
        <circle r="5.2" fill="${MR}" stroke="${CL}" stroke-width="2.2"/>`,
      vida: viver([{ transform: 'rotate(-150deg)', easing: 'ease-in-out' }, { transform: 'rotate(78deg)', offset: 0.42, easing: 'ease-in-out' }, { transform: 'rotate(18deg)', offset: 0.66, easing: 'ease-in-out' },
        { transform: 'rotate(50deg)', offset: 0.85, easing: 'ease-in-out' }, { transform: 'rotate(40deg)' }], 1000)
    }
  };
  /* medalha: aro claro, face marinho, o emblema no meio. A mesma serve ao aviso, ao contador e ao painel */
  function medalha(nome) {
    return `<svg class="c05-md" ${VB}><circle r="59" fill="#ECEDFF" ${T}/>
      <path d="M-49.8,-18.1 A53,53 0 0 1 18.1,-49.8" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/><path d="M49.8,18.1 A53,53 0 0 1 -18.1,49.8" fill="none" stroke="${SB}" stroke-width="5" stroke-linecap="round"/>
      <circle r="47" fill="${MR}" ${T}/><circle r="42.4" fill="none" stroke="${ES}" stroke-width="1.6"/>${EMBLEMAS[nome].des}</svg>`;
  }
  /* encaixe vazio: onde a medalha vai entrar (no aviso e no contador) */
  const OCO = `<svg class="c05-oco" ${VB}><circle r="55" fill="#ECEDFF" fill-opacity=".07" stroke="${SB}" stroke-width="4" stroke-dasharray="10 9.2"/></svg>`;
  /* estouro do encaixe: anel e doze riscos */
  const ESTOURO = `<svg class="c05-estouro" viewBox="-100 -100 200 200" aria-hidden="true"><circle r="61" fill="none" stroke="#fff" stroke-width="5"/>
    <g stroke="#fff" stroke-width="5.5" stroke-linecap="round">${Array.from({ length: 12 }, (_, i) => `<path d="M0,-72 V-${i % 2 ? 84 : 94}" transform="rotate(${i * 30})"/>`).join('')}</g></svg>`;

  /* ---------- a trilha dos quatro mundos, atrás do herói (passo 5) ----------
     Sobe da esquerda até a quina do topo do templo e segue até as costas do herói. Quatro marcos: templo, faísca, baú, mapa. */
  const TOPO = pouso(6), LADO = { x: TOPO.x + 74, y: TOPO.y - 96 };          // herói no topo; a faísca parada ao lado dele
  const T1 = `stroke="${TR}" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"`;
  const ESTRELA = (rr, k) => `M0,${-rr} L${k},${-k} L${rr},0 L${k},${k} L0,${rr} L${-k},${k} L${-rr},0 L${-k},${-k} Z`;
  const MUNDOS = [
    /* 1 · o templo */
    `<rect x="-21" y="7" width="42" height="9.5" fill="${CL}" ${T1}/><rect x="-14" y="-2.5" width="28" height="9.5" fill="${LV}" ${T1}/><rect x="-7" y="-12" width="14" height="9.5" fill="${CL}" ${T1}/>`,
    /* 2 · a faísca (a IA) */
    `<path d="${ESTRELA(12, 3.4)}" transform="rotate(45)" fill="${MARCO_FAISCA_CIANO ? CIANO : LV}" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/>
     <path d="${ESTRELA(19.5, 4.9)}" fill="${MARCO_FAISCA_CIANO ? CIANO : CL}" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/><circle r="4.2" fill="#fff"/>`,
    /* 3 · o baú */
    `<path d="M-18.5,-3 Q-18.5,-17 0,-17 Q18.5,-17 18.5,-3 Z" fill="${SB}" ${T1}/><rect x="-17.5" y="-3" width="35" height="18" rx="2.6" fill="${LV}" ${T1}/>
     <path d="M-4.2,-16.6 H4.2 V15 H-4.2 Z" fill="${CL}" ${T1}/><circle cy="3" r="2.7" fill="${MR}"/>`,
    /* 4 · o mapa */
    `<path d="M-20,-11 L-7,-15 L7,-11 L20,-15 V11 L7,15 L-7,11 L-20,15 Z" fill="${CL}" ${T1}/><path d="M-7,-15 V11 M7,-11 V15" fill="none" stroke="${MD}" stroke-width="1.6"/>
     <path d="M-14,7 Q-9,-3 -1,2 T12,-5" fill="none" stroke="${MR}" stroke-width="2.3" stroke-dasharray="3.4 3.2" stroke-linecap="round"/><circle cx="13" cy="-6.4" r="3" fill="${MR}"/>`
  ];
  const TRILHA = (() => {
    const A = { x: -24, y: 388 }, C = { x: 250, y: 306 }, B = { x: tier(6).x, y: tier(6).y - 7 };
    const bez = t => ({ x: (1 - t) * (1 - t) * A.x + 2 * (1 - t) * t * C.x + t * t * B.x, y: (1 - t) * (1 - t) * A.y + 2 * (1 - t) * t * C.y + t * t * B.y });
    const marcos = [0.2, 0.42, 0.64, 0.86].map(bez), pts = [];
    let ant = bez(0), ac = 0;
    for (let i = 1; i <= 600; i++) { const p = bez(i / 600); ac += Math.hypot(p.x - ant.x, p.y - ant.y); ant = p; if (ac >= 15) { ac = 0; pts.push(p); } }
    const fim = { x: TOPO.x - 46, y: B.y };
    for (let x = pts[pts.length - 1].x + 15; x <= fim.x; x += 15) pts.push({ x, y: B.y });
    const pontos = pts.filter(p => p.x > 6 && marcos.every(m => Math.hypot(p.x - m.x, p.y - m.y) > 44));
    return { marcos, pontos, x0: pontos[0].x, x1: pontos[pontos.length - 1].x, d: `M${A.x},${A.y} Q${C.x},${C.y} ${B.x},${B.y} L${fim.x},${fim.y}` };
  })();
  function desTrilha() {
    /* o fio é desenhado por stroke-dashoffset (pathLength 1): 1 = apagado, 0 = aceso */
    const fio = (cor, larg, op) => `<path class="c05-fio" d="${TRILHA.d}" pathLength="1" fill="none" stroke="${cor}" stroke-width="${larg}" stroke-opacity="${op}" stroke-linejoin="round" stroke-dasharray="1" stroke-dashoffset="1"/>`;
    return fio(MR, 8, 0.6) + fio('#ECEDFF', 3, 1) +
      TRILHA.pontos.map((p, j) => `<circle class="c05-ponto" cx="${n1(p.x)}" cy="${n1(p.y)}" r="4.3" fill="#fff" stroke="${MR}" stroke-width="1.7" style="animation-delay:${n1(j * 0.09 - 5.2)}s"/>`).join('') +
      TRILHA.marcos.map((m, k) => `<g class="c05-marco" transform="translate(${n1(m.x)},${n1(m.y)})"><g class="c05-marco-i"><circle r="37" fill="none" stroke="#ECEDFF" stroke-width="1.6" opacity=".5"/>
        <circle r="31" fill="${MR}" stroke="#ECEDFF" stroke-width="3.2"/>${MUNDOS[k]}</g></g>`).join('');
  }

  /* ---------- marcação do aviso de conquista e do cartão dos créditos ---------- */
  function desAviso(c) {
    return `<div class="c05-aviso${c.grande ? ' grande' : ''}"><div class="c05-av-m">${c.grande ? '<i class="c05-aura"></i>' : ''}${OCO}<div class="c05-medalha">${medalha(c.emblema)}</div></div>
      <div class="c05-av-t"><div class="c05-av-r">${esc(TEXTO.rotulo)}</div>
        <div class="c05-av-n"><span class="c05-av-nome">${esc(c.nome)}</span>${c.etiqueta ? `<span class="c05-etq">${esc(c.etiqueta)}</span>` : ''}</div>
        <div class="c05-av-l">${[].concat(c.linha).map(esc).join(' <br>')}</div></div></div>`;     /* o espaço antes do <br> mantém o texto corrido legível */
  }
  /* espaço do endereço e do código QR: tracejado e marcado enquanto CREDITOS.endereco e CREDITOS.qr estiverem vazios */
  function desEndereco() {
    const v = CREDITOS.vago.endereco, e = CREDITOS.endereco;
    /* preenchido: o endereço sozinho, no maior corpo que cabe numa linha (de 28 a 20 px); mais comprido que isso, quebra em duas */
    return e ? `<div class="c05-end cheia"><span class="c05-end-url" style="font-size:${Math.max(20, Math.min(28, Math.floor(612 / (e.length * 0.6))))}px">${esc(e)}</span></div>`
      : `<div class="c05-end"><span class="c05-vg-r">${esc(v.rotulo)}</span> <span class="c05-vg-t">${esc(v.texto)}</span></div>`;
  }
  function desQr() {
    const v = CREDITOS.vago.qr;
    return CREDITOS.qr ? `<div class="c05-qr cheia"><img alt="${esc(v.rotulo)}" src="${esc(CREDITOS.qr)}"></div>`
      : `<div class="c05-qr"><span class="c05-vg-r">${esc(v.rotulo)}</span> <span class="c05-vg-t">${esc(v.texto)}</span></div>`;
  }
