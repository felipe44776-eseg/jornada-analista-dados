
  /* ================= Parte 2: o desenho (SVG para as formas, HTML para todo texto) ================= */
  const estrela = (cx, cy, R, ri) => Array.from({ length: 10 }, (_, k) => { const a = -Math.PI / 2 + k * Math.PI / 5, q = k % 2 ? ri : R; return n1(cx + Math.cos(a) * q) + ',' + n1(cy + Math.sin(a) * q); }).join(' ');

  /* portão do mapa: dois postes, a grade (fechado) e, em cima, a bandeira do checkpoint. Os críticos têm bandeira maior, com ★ */
  function desPortao(i) {
    const g = portao(i), crit = !!ETAPAS[i].critico, H = crit ? 92 : 72, x = g.x, y = g.y, t = y - H;
    const pano = crit
      ? `<polygon class="c04-pano" points="${x + 1.5},${t + 2} ${x + 38},${t + 2} ${x + 30},${t + 14} ${x + 38},${t + 26} ${x + 1.5},${t + 26}"/><polygon class="c04-estrela" points="${estrela(x + 16, t + 14, 8.6, 3.6)}"/>`
      : `<polygon class="c04-pano" points="${x + 1.5},${t + 2} ${x + 25},${t + 10} ${x + 1.5},${t + 18}"/>`;
    return `<g class="c04-portao" data-i="${i}">
      <g class="c04-band${crit ? ' critica' : ''}" data-g="G${i}"><rect class="c04-mastro" x="${x - 1.5}" y="${t}" width="3" height="${H - 29}"/><circle class="c04-mastro" cx="${x}" cy="${t}" r="3"/>${pano}</g>
      <rect class="c04-poste" x="${x - 12}" y="${y - 24}" width="5" height="28"/><rect class="c04-poste" x="${x + 7}" y="${y - 24}" width="5" height="28"/>
      <g class="c04-porta"><rect class="c04-porta-f" x="${x - 7}" y="${y - 23}" width="14" height="26"/><path class="c04-porta-g" d="M${x - 4},${y - 23} V${y + 3} M${x},${y - 23} V${y + 3} M${x + 4},${y - 23} V${y + 3}"/></g>
      <rect class="c04-verga" x="${x - 14}" y="${y - 29}" width="28" height="6" rx="2"/></g>`;
  }
  /* trecho do caminho que acende com a etapa i */
  function desLuz(i) {
    const f = i < 6 ? 0 : 1, de = i === 0 ? 24 : i === 7 ? -20 : portao(i - 1).x;
    if (i === 6) return `<path class="c04-ramal" d="${RAMAL}"/>`;
    let s = `<path d="M${de},${EIXO[f]} H${portao(i).x}"/>`;
    if (i === 7) s += `<path d="M${portao(5).x},${EIXO[0]} H1300"/>`;                    // o caminho principal passa ao lado da 06 e continua na fileira de baixo
    if (i === 12) s += `<path d="M${portao(12).x},${EIXO[1]} H${META.x + 6}"/><rect class="c04-meta" x="${META.x}" y="${Y[1]}" width="${META.w}" height="${ALT}" rx="5"/>`;
    return s;
  }
  function desMapa() {
    const g3 = portao(3), chev = (x, y) => `M${x},${y - 6} l6,6 l-6,6 M${x + 11},${y - 6} l6,6 l-6,6`;
    return CAIXAS.map((c, k) => `<rect class="c04-caixa" data-r="${k}" x="${c.x}" y="${c.y}" width="${c.w}" height="${c.h}" rx="16"/>`).join('') +
      `<path class="c04-trilho" d="M24,${EIXO[0]} H1300 M-20,${EIXO[1]} H${META.x + 6}"/><path class="c04-trilho c04-ramal" d="${RAMAL}"/>
      <rect class="c04-meta" x="${META.x}" y="${Y[1]}" width="${META.w}" height="${ALT}" rx="5"/>` +
      ETAPAS.map((e, i) => `<g class="c04-luz" data-i="${i}">${desLuz(i)}</g>`).join('') +
      `<path class="c04-chev" d="${chev(1252, EIXO[0])} ${chev(12, EIXO[1])}"/>` +
      ETAPAS.map((e, i) => { const p = lugar(i); return `<g class="c04-ponto" data-i="${i}">${[0, 1, 2, 3].map(k => `<rect class="c04-cel ${k < 3 ? 'ia' : 'hum'}" x="${p.x + k * (CEL + VAO)}" y="${p.y}" width="${CEL}" height="${ALT}" rx="4"/>`).join('')}</g>`; }).join('') +
      ETAPAS.map((e, i) => desPortao(i)).join('') +
      `<g class="c04-trava"><rect x="${g3.x - 14}" y="${g3.y - 21}" width="28" height="8" rx="3"/><rect x="${g3.x - 14}" y="${g3.y - 9}" width="28" height="8" rx="3"/></g>`;
  }
  /* a cópia de auditoria: o mesmo mapa, só em contorno tracejado, sem texto */
  function desFantasma() {
    return CAIXAS.map(c => `<rect class="c04-f-linha" x="${c.x}" y="${c.y}" width="${c.w}" height="${c.h}" rx="16"/>`).join('') +
      `<path class="c04-f-linha" d="M24,${EIXO[0]} H1262 M-4,${EIXO[1]} H${META.x + META.w}"/><path class="c04-f-linha" d="${RAMAL}"/>` +
      ETAPAS.map((e, i) => { const p = lugar(i); return `<g class="c04-f-ponto" data-i="${i}"><rect x="${p.x}" y="${p.y}" width="${PL}" height="${ALT}" rx="6"/></g>`; }).join('') +
      ETAPAS.map((e, i) => { const g = portao(i), H = e.critico ? 92 : 72; return `<path class="c04-f-linha c04-f-band" d="M${g.x},${g.y} V${g.y - H} ${e.critico ? 'h36 l-8,12 l8,12 h-36' : 'l24,8 l-24,8'}"/>`; }).join('');
  }
  /* dentro de uma etapa: o trilho, as quatro casas (três da IA, uma do humano) e o portão, com a grade que sobe */
  function desZoom() {
    const x = PZ.x, y0 = PZ.y0, h = YP - y0 - 16;
    return `<defs><clipPath id="c04-vao"><rect x="${x - 22}" y="${y0 + 16}" width="44" height="${h}"/></clipPath></defs>
      <rect class="c04-z-trilho" x="-40" y="${YP + 3}" width="1360" height="26" rx="6"/><rect class="c04-z-brilho" x="-40" y="${YP + 3}" width="1360" height="5"/>
      ${CICLO.map((c, k) => `<rect class="c04-casa ${c.ia ? 'ia' : 'hum'}" x="${ZX[k]}" y="${YP}" width="${ZW}" height="${ZH}" rx="10"/>`).join('')}
      <rect class="c04-z-vao" x="${x - 22}" y="${y0 + 16}" width="44" height="${h + 3}"/>
      <g clip-path="url(#c04-vao)"><g class="c04-z-grade">${[-17, -6, 5, 16].map(d => `<rect x="${x + d - 2.5}" y="${y0 + 12}" width="5" height="${h + 8}"/>`).join('')}<rect x="${x - 22}" y="${y0 + 58}" width="44" height="5"/><rect x="${x - 22}" y="${y0 + 112}" width="44" height="5"/></g></g>
      <rect class="c04-z-poste" x="${x - 38}" y="${y0 + 12}" width="16" height="${YP - y0 - 9}"/><rect class="c04-z-poste" x="${x + 22}" y="${y0 + 12}" width="16" height="${YP - y0 - 9}"/>
      <rect class="c04-z-verga" x="${x - 48}" y="${y0 - 8}" width="96" height="24" rx="5"/><circle class="c04-z-lampada" cx="${x}" cy="${y0 + 4}" r="7"/>`;
  }
  /* rótulos do mapa: nome da região, número de cada etapa e o nome que aparece quando o ponto acende */
  function rotulosMapa() {
    return CAIXAS.map((c, k) => `<div class="c04-regiao" style="left:${c.x + 14}px;top:${c.y + 6}px">${REGIOES[k]}</div>`).join('') +
      ETAPAS.map((e, i) => { const p = lugar(i); return `<div class="c04-num" style="left:${p.x}px;top:${p.y + 29}px">${e.n}</div>`; }).join('') +
      ETAPAS.map((e, i) => { const p = lugar(i), nv = NIVEL[i]; return `<div class="c04-nome" style="left:${nv === 'N' ? p.x + 40 : p.x}px;top:${nv === 'N' ? p.y + 29 : nv === 'A' ? p.y - 58 : p.y - 92}px">${e.nome}</div>`; }).join('');
  }
  /* rótulos de dentro da etapa: a letra na frente de cada casa e, embaixo, a linha exata do cartão do ciclo */
  function rotulosZoom() {
    return CICLO.map((c, k) => `<div class="c04-letra" style="left:${ZX[k]}px;top:${YP}px;width:${ZW}px;height:${ZH}px">${c.l}</div>`).join('') +
      CICLO.map((c, k) => `<p class="c04-ciclo${c.ia ? ' ia' : ''}" style="left:${ZX[k]}px;top:${YP + ZH + 14}px;width:${ZW}px"><b>${c.l} · ${c.nome}</b> <span>— <i>${c.dono}</i>: ${c.faz}</span></p>`).join('');
  }
  /* um dado do sorteio: (0,0) é o meio; o <g> de fora só posiciona, para o de dentro poder ser animado */
  function desDado(P, pontos) {
    return `<g transform="translate(${P.x},${P.y})"><g class="c04-dado"><rect x="-10" y="-10" width="20" height="20" rx="5"/>${pontos.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.1"/>`).join('')}</g></g>`;
  }
