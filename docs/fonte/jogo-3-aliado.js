/* ================================================================
   CAMADA DE JOGO · ALIADO (a IA) e AUDITOR
   Uma faísca ciano com rastro: rápida, sem forma humana e sem cara de robô. O ciano é o que marca "da IA".
   O auditor é a mesma faísca, só contorno. Vive numa camada <g> de SVG; (0,0) é o centro da faísca.
   Uso:  const a = Jogo.aliado(camada, { escala: 1, auditor: false });  a.por(x, y).estado('parada');
   Estados: parada (ao lado do herói) · voando · disparando · fraca (luz enfraquecida) · entregando (oferece um objeto)
            voando e disparando aceitam { ang } = direção do movimento em graus (0 = para a direita)
   ================================================================ */
(() => {
  const CIANO = '#00A1B8', n1 = v => Math.round(v * 10) / 10;
  const ESTRELA = (r, k) => `M0,${-r} L${k},${-k} L${r},0 L${k},${k} L0,${r} L${-k},${k} L${-r},0 L${-k},${-k} Z`;
  /* comprimento do rastro, esticão do miolo e brilho de cada estado */
  const EST = {
    parada: { rastro: 0, estica: 1, brilho: 1, escala: 1, feixe: 0, vivo: true },
    voando: { rastro: 56, estica: 1.08, brilho: 1, escala: 1, feixe: 0 },
    disparando: { rastro: 140, estica: 1.3, brilho: 1.25, escala: 1, feixe: 0, riscos: 1 },
    fraca: { rastro: 0, estica: 1, brilho: 0.3, escala: 0.74, feixe: 0, miolo: 0.5, vivo: true },
    entregando: { rastro: 0, estica: 1, brilho: 1, escala: 1, feixe: 1 }
  };
  const OFERTA = { x: 42, y: 62 };
  let serie = 0;                                                        // cada faísca tem os seus ids de gradiente                                      // onde fica o objeto oferecido, a partir do centro

  Jogo.aliado = (camada, o) => {
    o = o || {};
    const oco = !!o.auditor, id = 'jg-al' + (++serie), g = Deck.util.svg('g', { class: 'jg-aliado' + (oco ? ' auditor' : '') });
    const corpo = oco ? `fill="none" stroke="${CIANO}" stroke-width="3" stroke-linejoin="round"` : `fill="${CIANO}" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"`;
    g.innerHTML = `<defs><radialGradient id="${id}-halo"><stop offset="0" stop-color="${CIANO}" stop-opacity=".55"/><stop offset=".55" stop-color="${CIANO}" stop-opacity=".18"/><stop offset="1" stop-color="${CIANO}" stop-opacity="0"/></radialGradient>
        <linearGradient id="${id}-rastro" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="${CIANO}" stop-opacity=".85"/><stop offset="1" stop-color="${CIANO}" stop-opacity="0"/></linearGradient></defs>
      <g class="a-pos"><g class="a-vivo">
        <g class="a-feixe" opacity="0"><polygon points="0,6 ${OFERTA.x - 30},${OFERTA.y + 6} ${OFERTA.x + 30},${OFERTA.y + 6}" fill="${oco ? 'none' : CIANO}" ${oco ? `stroke="${CIANO}" stroke-width="1.6" stroke-dasharray="6 5"` : 'opacity=".22"'}/></g>
        <g class="a-gira">
          <g class="a-rastro"><path class="a-cauda" d="" ${oco ? `fill="none" stroke="${CIANO}" stroke-width="2.2" stroke-linejoin="round"` : `fill="url(#${id}-rastro)"`}/>
            <g class="a-po" fill="${oco ? 'none' : CIANO}" ${oco ? `stroke="${CIANO}" stroke-width="1.6"` : ''}><circle r="4.2"/><circle r="3"/><circle r="2"/></g>
            <g class="a-riscos" stroke="${CIANO}" stroke-width="2.4" stroke-linecap="round" opacity="0"><path d="M-40,-20 H-96 M-56,22 H-128 M-30,-34 H-62"/></g></g>
          <g class="a-miolo">${oco ? `<circle r="27" fill="none" stroke="${CIANO}" stroke-width="1.6" stroke-dasharray="5 6" opacity=".8"/>` : `<circle class="a-halo" r="40" fill="url(#${id}-halo)"/>`}
            <path d="${ESTRELA(15, 4.2)}" transform="rotate(45)" ${corpo} opacity="${oco ? 1 : 0.9}"/><path d="${ESTRELA(24, 6)}" ${corpo}/>
            <circle r="5.4" fill="${oco ? 'none' : '#fff'}" ${oco ? `stroke="${CIANO}" stroke-width="2.4"` : ''}/></g>
        </g></g></g>`;
    camada.appendChild(g);
    const q = s => g.querySelector(s);
    const p = { pos: q('.a-pos'), vivo: q('.a-vivo'), gira: q('.a-gira'), cauda: q('.a-cauda'), po: Array.from(g.querySelectorAll('.a-po circle')), riscos: q('.a-riscos'), miolo: q('.a-miolo'), halo: q('.a-halo'), feixe: q('.a-feixe') };
    const st = { x: 0, y: 0, escala: o.escala || 1, nome: 'parada' };
    const a = {
      el: g, auditor: oco,
      get x() { return st.x; }, get y() { return st.y; }, get nome() { return st.nome; },
      por(x, y) { st.x = x; st.y = y; p.pos.setAttribute('transform', `translate(${n1(x)},${n1(y)}) scale(${st.escala})`); return a; },
      estado(nome, extra) {
        const e = EST[nome] || EST.parada, ang = (extra && extra.ang) || 0, L = e.rastro;
        st.nome = nome;
        p.gira.setAttribute('transform', `rotate(${n1(ang)})`);
        p.cauda.setAttribute('d', L ? `M2,-10 Q${-L * 0.45},-5 ${-L},0 Q${-L * 0.45},5 2,10 Z` : '');
        p.po.forEach((c, i) => { c.setAttribute('cx', n1(-L * (0.62 + i * 0.2))); c.setAttribute('cy', i === 1 ? -7 : 5); c.setAttribute('opacity', L ? 0.8 - i * 0.2 : 0); });
        p.riscos.setAttribute('opacity', e.riscos ? 0.8 : 0);
        p.miolo.setAttribute('transform', `scale(${e.estica * e.escala},${e.escala / Math.sqrt(e.estica)})`);
        p.miolo.setAttribute('opacity', e.miolo || 1);
        if (p.halo) p.halo.setAttribute('opacity', Math.min(1, e.brilho));
        p.feixe.setAttribute('opacity', e.feixe);
        if (e.vivo && !p.vivo.classList.contains('jg-al-flutua')) p.vivo.style.animationDelay = -(((document.timeline && document.timeline.currentTime) || 0) % 3000).toFixed(0) + 'ms';   // flutua em fase com o relógio
        p.vivo.classList.toggle('jg-al-flutua', !!e.vivo);
        return a;
      },
      /* ponto (em coordenadas da camada) onde fica o objeto oferecido no estado 'entregando' */
      oferta() { return { x: st.x + OFERTA.x * st.escala, y: st.y + (OFERTA.y + 6) * st.escala }; },
      mostrar(v) { g.style.opacity = v ? 1 : 0; return a; }
    };
    return a.por(0, 0).estado('parada');
  };
})();
