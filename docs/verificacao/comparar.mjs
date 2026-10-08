// Compara PNGs de mesmo nome em duas pastas, pixel a pixel (regressão de capturas).
// Uso:  node verificacao/comparar.mjs <pastaAntes> <pastaDepois> [prefixo=passo] [limiar=0]
// Sai com código 1 se algum arquivo diferir. Para cada um: pixels diferentes, maior diferença e a caixa que os contém.
import fs from 'node:fs';
import path from 'node:path';
import { comparar } from './png.mjs';

const [a, b, prefixo = 'passo', limiar = '0'] = process.argv.slice(2);
if (!a || !b) { console.log('uso: node comparar.mjs <pastaAntes> <pastaDepois> [prefixo] [limiar]'); process.exit(2); }
const nomes = fs.readdirSync(a).filter(n => n.startsWith(prefixo) && n.endsWith('.png') && fs.existsSync(path.join(b, n))).sort((x, y) => x.localeCompare(y, undefined, { numeric: true }));
if (!nomes.length) { console.log(`nenhum PNG "${prefixo}*.png" presente nas duas pastas`); process.exit(2); }
let diferentes = 0;
for (const n of nomes) {
  const r = comparar(fs.readFileSync(path.join(a, n)), fs.readFileSync(path.join(b, n)), +limiar);
  if (r.erro) { diferentes++; console.log(`${n}: ${r.erro}`); continue; }
  if (r.pixelsDiferentes) diferentes++;
  console.log(`${n}: ${r.pixelsDiferentes ? `DIFERENTE: ${r.pixelsDiferentes} de ${r.de} pixels, maior diferença ${r.maiorDiferenca}/255, caixa x ${r.caixa[0]}-${r.caixa[2]}, y ${r.caixa[1]}-${r.caixa[3]}` : 'idêntico'}`);
}
console.log(`${nomes.length} arquivo(s) comparado(s), ${diferentes} diferente(s)`);
process.exit(diferentes ? 1 : 0);
