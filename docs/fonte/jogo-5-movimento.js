/* ================================================================
   CAMADA DE JOGO · MOVIMENTO: levar o herói e o aliado por um caminho de pontos {x, y}
   Tudo recebe o ctx do passo (cancelável). Nenhum deles fixa estado final: o fim() do passo põe o ator no lugar.
     Jogo.mover.caminho(pts)                       percurso por comprimento: { L, seg, em(q) -> {x, y, sobe} }
     Jogo.mover.andar(ctx, heroi, pts, ms, o)      anda e sobe, com som de passos.   o = { atraso, curva, inv, marcas: [{q, fn}], ganho }
     Jogo.mover.rolar(ctx, heroi, pts, ms, o)      rola degrau abaixo.               o = { atraso, voltas, sentido, quique, saltos, curva, aoQuicar(P), fim }
     Jogo.mover.levantar(ctx, heroi, atraso, ms)   de agachado a parado
     Jogo.mover.voar(ctx, aliado, pts, ms, o)      a faísca voa pelos pontos.        o = { atraso, curva, estado: 'voando'|'disparando', marcas, fim }
   ================================================================ */
(() => {
  const { E } = Deck.util;
  function caminho(pts) {
    const seg = []; let L = 0;
    for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y); seg.push(d); L += d; }
    return { L, seg, em(q) {
      let d = Math.max(0, Math.min(1, q)) * L;
      for (let i = 0; i < seg.length; i++) {
        if (d <= seg[i] || i === seg.length - 1) {
          const f = seg[i] ? Math.min(1, d / seg[i]) : 0;
          return { x: pts[i].x + (pts[i + 1].x - pts[i].x) * f, y: pts[i].y + (pts[i + 1].y - pts[i].y) * f, sobe: pts[i + 1].y < pts[i].y - 1, ang: Math.atan2(pts[i + 1].y - pts[i].y, pts[i + 1].x - pts[i].x) * 180 / Math.PI };
        }
        d -= seg[i];
      }
      return { x: pts[pts.length - 1].x, y: pts[pts.length - 1].y, sobe: false, ang: 0 };
    } };
  }
  const disparar = lista => { const m = (lista || []).map(x => Object.assign({ feito: false }, x)); return e => m.forEach(x => { if (!x.feito && e >= x.q) { x.feito = true; x.fn(); } }); };

  /* inv = inversa da curva, para os passos soarem quando o pé bate (ex.: curva E.inQuad, inv Math.sqrt) */
  function andar(ctx, h, pts, dur, o) {
    o = o || {}; const c = caminho(pts), atraso = o.atraso || 0, n = Math.max(2, Math.round(c.L / 20)), inv = o.inv || (x => x), marcas = disparar(o.marcas);
    ctx.tween(dur, (e, p) => {
      const P = c.em(e);
      marcas(e);
      if (p >= 1) { h.por(P.x, P.y).estado('parado'); if (o.fim) o.fim(); return; }
      h.por(P.x, P.y).estado(P.sobe ? 'subindo' : 'andando', e * n / 2);
    }, { atraso, curva: o.curva || E.lin });
    if (o.ganho !== 0) for (let i = 1; i <= n; i++) ctx.em(atraso + dur * inv((i - 0.5) / n), () => ctx.som.passo({ ganho: o.ganho || 0.26 }));
  }
  function rolar(ctx, h, pts, dur, o) {
    o = o || {}; const c = caminho(pts), saltos = o.saltos || c.seg.length; let ult = 0;
    ctx.tween(dur, (e, p) => {
      const P = c.em(e), k = Math.floor(e * saltos);
      h.por(P.x, P.y - Math.abs(Math.sin(Math.PI * e * saltos)) * (o.quique || 10)).estado('rolando', e * (o.voltas || 1), o.sentido || -1);
      if (k > ult && p < 1) { ult = k; if (o.aoQuicar) o.aoQuicar(P); }
    }, { atraso: o.atraso || 0, curva: o.curva || E.lin, fim: o.fim });
  }
  function levantar(ctx, h, atraso, dur) { ctx.tween(dur || 480, e => h.estado('levantando', e), { atraso: atraso || 0, curva: E.outCubic, fim: () => h.estado('parado') }); }
  function voar(ctx, a, pts, dur, o) {
    o = o || {}; const c = caminho(pts), marcas = disparar(o.marcas), nome = o.estado || 'voando';
    ctx.tween(dur, (e, p) => {
      const P = c.em(e);
      marcas(e);
      a.por(P.x, P.y);
      if (p >= 1) { a.estado(o.aoFim || 'parada'); if (o.fim) o.fim(); } else a.estado(nome, { ang: P.ang });
    }, { atraso: o.atraso || 0, curva: o.curva || E.inOut });
  }
  Jogo.mover = { caminho, andar, rolar, levantar, voar };
})();
