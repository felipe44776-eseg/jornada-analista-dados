// Decodificador mínimo de PNG (8 bits, RGB ou RGBA) e comparação pixel a pixel. Sem dependências.
import zlib from 'node:zlib';

export function decodificar(buf) {
  let p = 8, w, h, bpp = 0, ct; const idat = [];
  while (p < buf.length) {
    const len = buf.readUInt32BE(p), tipo = buf.toString('latin1', p + 4, p + 8), d = buf.subarray(p + 8, p + 8 + len);
    if (tipo === 'IHDR') { w = d.readUInt32BE(0); h = d.readUInt32BE(4); ct = d[9]; bpp = ct === 6 ? 4 : ct === 2 ? 3 : 0; }
    else if (tipo === 'IDAT') idat.push(d); else if (tipo === 'IEND') break;
    p += 12 + len;
  }
  if (!bpp) throw new Error('PNG com color type ' + ct);
  const raw = zlib.inflateSync(Buffer.concat(idat)), L = w * bpp, px = Buffer.alloc(h * L);
  for (let y = 0; y < h; y++) {
    const f = raw[y * (L + 1)], o = y * (L + 1) + 1, d = y * L;
    for (let x = 0; x < L; x++) {
      const a = x >= bpp ? px[d + x - bpp] : 0, b = y ? px[d - L + x] : 0, c = (x >= bpp && y) ? px[d - L + x - bpp] : 0; let v = raw[o + x];
      if (f === 1) v += a; else if (f === 2) v += b; else if (f === 3) v += (a + b) >> 1;
      else if (f === 4) { const pa = Math.abs(b - c), pb = Math.abs(a - c), pc = Math.abs(a + b - 2 * c); v += (pa <= pb && pa <= pc) ? a : (pb <= pc ? b : c); }
      px[d + x] = v & 255;
    }
  }
  return { w, h, bpp, px };
}

/* pixels cuja diferença em algum canal passa de `limiar`, com a caixa que os contém */
export function comparar(A, B, limiar = 6) {
  const a = decodificar(A), b = decodificar(B);
  if (a.w !== b.w || a.h !== b.h || a.bpp !== b.bpp) return { erro: `dimensões ${a.w}x${a.h} vs ${b.w}x${b.h}` };
  let n = 0, x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1, max = 0;
  for (let y = 0; y < a.h; y++) for (let x = 0; x < a.w; x++) {
    const i = (y * a.w + x) * a.bpp; let d = 0;
    for (let k = 0; k < 3; k++) d = Math.max(d, Math.abs(a.px[i + k] - b.px[i + k]));
    if (d > max) max = d;
    if (d > limiar) { n++; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  }
  return { pixelsDiferentes: n, de: a.w * a.h, maiorDiferenca: max, caixa: n ? [x0, y0, x1, y1] : null };
}
