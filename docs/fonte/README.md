# Como escrever uma cena deste deck

Contrato para quem constrói uma cena. Leia inteiro antes de escrever código. O conteúdo da cena vem do `roteiro.md`; aqui está **como** construir.

## 1. As três regras

1. **Escreva só em `fonte\cenaNN\`** (NN = número da cena no roteiro, com dois dígitos). Não edite `motor.js`, `som.js`, `jogo-*.js`, `jogo*.css`, `estilo.css`, `casca.html`, `montar.ps1`, nem a pasta de outra cena, nem o `index.html` da raiz. Se faltar algo na parte compartilhada, resolva dentro da sua pasta.
2. **Toda classe CSS da cena leva o prefixo dela** (`c02-`, `c03-`, `c04-`). Prefixos `jg-` e `tp-` são da parte compartilhada: use os componentes, não redefina as classes deles.
3. **`tocar(ctx)` anima, `fim()` fixa.** O estado final de um passo só existe se o `fim()` dele o aplicar. O motor chega a um passo de três jeitos (tocando, pulando a animação, link direto) e nos três o resultado tem de ser o mesmo.

## 2. Começar: copie o modelo e rode

`fonte\_modelo\` é uma cena mínima que funciona e usa todos os componentes. Copie a pasta, renomeie e troque o id, o prefixo e o conteúdo.

```powershell
# a partir de docs\
Copy-Item .\fonte\_modelo .\fonte\cena02 -Recurse      # depois troque '99' por '02' e m9- por c02- nos três arquivos

# build privado: só a sua cena, num arquivo fora do projeto (nunca no index.html)
& .\fonte\montar.ps1 -Cenas 02 -Destino C:\saida\c02.html

# estado final de cada passo, um PNG por passo (abra todos e olhe)
& .\verificacao\capturar.ps1 -Saida C:\saida\c02 -Deck C:\saida\c02.html -Cena 02

# a cena tocando de verdade: teclas, quadros do meio, HUD, textos, fim natural x link direto, PDF
node .\verificacao\conferir.mjs --saida C:\saida\c02 --deck C:\saida\c02.html --cena 02

# folhas de contato com os quadros do meio da animação
& .\verificacao\folhas.ps1 -Saida C:\saida\c02
```

Chame os `.ps1` com `&`, não com `pwsh -File` (com `-File`, uma lista como `-Passos 0,1` chega como texto). O modelo roda assim: `& .\fonte\montar.ps1 -Cenas _modelo -Destino <arquivo>` e `node .\verificacao\conferir.mjs --deck <arquivo> --cena 99 --esperado .\fonte\_modelo\esperado.json --saida <pasta>`.

Links de um deck montado: `?cena=02&passo=3&parado=1` (estado final do passo 3, sem animação e sem som) · `?cena=02&passo=3&tocar=1` (parte do fim do passo 2 e toca o 3) · `?oficina=1` a `?oficina=4` (folhas com todos os componentes e o templo à noite; ← e → trocam de folha).

## 3. Os arquivos de uma cena

| Arquivo | O que é |
|---|---|
| `*.js` | O código. Todos os `.js` da pasta são concatenados em ordem alfabética, **sem separação**, e juntos formam um bloco só: `(() => { ... Deck.registrar({...}); })();`. Pode ser um arquivo ou vários (`1-conteudo.js`, `2-montagem.js`…), desde que o primeiro abra o bloco e o último feche |
| `*.css` | O estilo da cena, com o prefixo dela |
| `esperado.json` | O que o roteiro manda: textos exatos, HUD e o que está visível ao fim de cada passo. O `conferir.mjs` lê este arquivo (seção 9) |

## 4. O registro e o ciclo de vida

```js
(() => {
  let r = null;                                   // referências do que foi montado
  function montar(palco) { /* constrói o DOM dentro de `palco`, no estado ANTES do passo 0 */ }
  function desmontar() { r = null; }              // o motor esvazia o palco; solte só as referências
  Deck.registrar({
    id: '02',                                     // é o que vai no link (?cena=02) e no indicador
    titulo: '02 · Mundo 2 — O aliado',
    notas: { fala: '...', interacao: '...', rastreio: ['...'] },   // tecla N: copie do roteiro
    montar, desmontar,
    passos: [
      { nome: 'o que acontece', ambiente: { vento: 0.4 }, tocar(ctx) { /* ... */ ctx.concluir(); }, fim() { /* ... */ } }
    ]
  });
})();
```

- **`montar(palco)`** roda toda vez que o motor precisa da cena: ao entrar, ao pular, ao voltar, no link direto e na impressão. Por isso não guarde estado fora de `r`.
- **Ir para o passo N** = `montar` + `fim()` dos passos 0 a N, nessa ordem. Cada `fim()` aplica só o que o passo dele muda.
- **`tocar(ctx)`** parte do estado final do passo anterior e tem de chamar `ctx.concluir()` quando acaba. Ao concluir, o motor chama o `fim()` do passo e cancela as animações: a tela não pode dar pulo nesse instante (o `conferir.mjs` compara os dois estados pixel a pixel).
- **`ambiente`** é o som contínuo ao fim do passo; vale para os passos seguintes até outro passo redefinir.
- **Passo 0:** num build privado a cena abre sozinha no passo 0, antes de qualquer tecla, e o som desse passo não toca (o navegador só libera áudio depois de uma tecla). É esperado: no deck completo a cena entra por uma tecla e o som toca. O `conferir.mjs` espera o passo 0 terminar antes de apertar a primeira tecla.

## 5. O `ctx` de um passo

Tudo o que `tocar` agenda passa pelo `ctx`, para o motor poder cancelar quando o apresentador pula ou volta.

| Chamada | Faz |
|---|---|
| `ctx.em(ms, fn)` | Roda `fn` daqui a `ms`. Dentro de `fn`, um novo `ctx.em` conta a partir daquele momento |
| `ctx.anim(el, quadros, opcoes)` | Web Animations no elemento. `fill: 'both'` por padrão; `opcoes` pode ser só a duração. Devolve a `Animation` |
| `ctx.tween(ms, (e, p) => {...}, { atraso, curva, fim })` | Chama a função a cada quadro; `e` é o progresso com a curva, `p` o progresso cru (0 a 1) |
| `ctx.temp(el)` / `ctx.soltar(el)` | Registra um elemento transitório (some no fim do passo) / remove antes |
| `ctx.tremor(el, px, ms)` | Tremor curto de um elemento. No templo: `tp.tremor(ctx, px, ms)` treme o mundo, não o texto |
| `ctx.som` | O módulo de som (seção 7) |
| `ctx.concluir()` | Avisa que o passo acabou |

Utilitários: `Deck.util.html('<div>…</div>')` (cria um elemento), `Deck.util.svg('circle', {…})`, `Deck.util.rng(semente)` (aleatório que repete), `Deck.util.E` (curvas: `lin`, `inQuad`, `outQuad`, `inCubic`, `outCubic`, `inOut`, `outBack`).

## 6. A camada de jogo

Todo componente devolve um objeto com `el` e um jeito de pôr o **estado na hora** (para o `fim()`), mais métodos animados que recebem o `ctx`. Veja todos desenhados em `?oficina=1` a `?oficina=4`. Os componentes de HTML (pedra, lasca, cartão, aposta, cabeçalho, frase, balão) nascem escondidos.

### Templo e cenário · `Templo.criar(palco, opcoes)`

O templo do CRISP-DM com céu, serra, mata, encosta e primeiro plano. Mundos 1, 2 e 3.

```js
const tp = Templo.criar(palco, { classe: 'c02', hora: 'amanhecer', construido: true, degrauzinhos: true, pilha: true });
tp.hud      // <div>: HTML acima do mundo (título, cartões, HUD, aposta). Não treme
tp.topo     // <div>: HTML no plano do templo, acima dos atores (pedra, lasca, rótulos que acompanham o herói)
tp.atores   // <g> de SVG: herói, aliado, baú. A ordem de criação é a de empilhamento
tp.fx       // <g> de SVG: efeitos
```

| Estado na hora | |
|---|---|
| `tp.hora(nome)` | `'escuro'` (antes de amanhecer), `'amanhecer'`, `'noite'` (escurece céu e templo, não os atores) |
| `tp.construido(v)` · `tp.degrauzinhos(v)` · `tp.pilha(v)` | Blocos e nomes das fases · os 24 degrauzinhos · as 42 tabuletas |
| `tp.nomes(v)` | Mostra ou apaga os nomes das fases. **Apague quando um cartão ou painel ficar por cima do templo** |
| `tp.camera(x, y, z, true)` | Posição de repouso da câmera (o `true` arredonda para px inteiros) |

| Animado | |
|---|---|
| `tp.mudarHora(ctx, nome, ms)` | Transição entre duas horas; o `fim()` chama `tp.hora(nome)` |
| `tp.cameraPara(ctx, { x, y, z }, ms)` | Move a câmera; o `fim()` chama `tp.camera(...)` |
| `tp.poeira(ctx, x, y, n, forca)` · `tp.estilhacos(ctx, x, y, n, forca)` · `tp.tremor(ctx, px, ms)` | Efeitos de impacto |
| `tp.marcasDePouso(a, b, fn)` | Marcas para `Jogo.mover.andar`: chama `fn(k)` quando os pés chegam a cada degrau de `a` a `b` |

Geometria (`Templo.geo`): `pouso(k)` dá onde os pés ficam (0 = chão à esquerda, 1 a 5 = em cima do degrau, 6 = topo, que tem 200 px de largura); `rota(a, b)` dá o caminho entre dois pousos pelos degrauzinhos; `tier(k)` dá `{x, y, w, h}` do degrau; `GY` = 604 é o chão; `BASE` = pouso 0. Conteúdo: `Templo.FASES` (nome, tarefas e saídas dos 6 degraus). Partes para animar por conta própria: `tp.blocosK[k-1]`, `tp.fases[k-1]` (nome do degrau), `tp.tarefasK[k-1]` (cada degrauzinho é um `<g>` com 3 `<rect>`: corpo, topo, quina), `tp.tabs` (as 42 tabuletas; `el._fim` é o transform de repouso), `tp.flashes[k-1]`, `tp.veu`, `tp.rotulos`, `tp.mundo`.

### HUD · `Jogo.hud(pai, config)`

```js
const hud = Jogo.hud(tp.hud, { vidas: 5, fases: Templo.FASES.map(f => f.nome), jogadores: ['Analista', { nome: 'IA', ia: true }] });
hud.definir({ visivel: true, vidas: 5, fase: 1, prazo: 1, jogadores: true });   // estado na hora; aceita só os campos que mudam
hud.entrar(ctx, atraso); hud.entrarJogadores(ctx, atraso);                       // animados
hud.perderVida(ctx); hud.mudarFase(ctx, n); hud.gastarPrazo(ctx, fracao, ms, atraso);
```

- `fases` é a lista de nomes: "n/N" sai do tamanho dela. `rotulos: { fase: 'Etapa' }` troca o rótulo. `formato: (n, N) => String(n - 1).padStart(2, '0')` troca o número (etapas 00 a 12).
- `prazo` é uma fração de 0 a 1. Não leva número na tela.
- `jogadores` cria a aba "2 jogadores: Analista · IA" sob o HUD; `ia: true` pinta o nome em ciano. Ela nasce escondida.

### Herói · `Jogo.heroi(camadaSvg, { escala })`

O analista: 126 px de altura na escala 1; `(x, y)` são os pés.

```js
const h = Jogo.heroi(tp.atores, { escala: 1 });
h.por(x, y).estado('parado').mostrar(true);     // estado na hora
h.estado('andando', fase);                      // fase 0..1 = dois passos; também 'subindo'
h.estado('rolando', voltas, sentido);           // sentido -1 = para a esquerda
h.estado('levantando', progresso);              // 0 = agachado, 1 = em pé
h.pose('atingido', { giro: -90 });              // pose com ajuste; mistura(a, b, t) interpola duas poses
h.alerta(true); h.piscar(ctx, ms, atraso);      // "!" sobre a cabeça · pisca depois de perder vida
```

Estados: `parado`, `andando`, `subindo`, `atingido`, `rolando`, `levantando`, `agachado`, `caido`, `derrotado`.

### Aliado e auditor · `Jogo.aliado(camadaSvg, { escala, auditor })`

A IA: faísca ciano com rastro. `auditor: true` desenha a mesma faísca só em contorno. `(x, y)` é o centro.

```js
const ia = Jogo.aliado(tp.atores, { escala: 1 });
ia.por(x, y).estado('parada').mostrar(true);
ia.estado('voando', { ang: -30 });              // ang = direção do movimento, em graus (0 = para a direita)
ia.estado('entregando'); const o = ia.oferta(); // o = ponto onde pôr o objeto oferecido (ex.: o baú)
```

Estados: `parada` (flutua ao lado do herói), `voando`, `disparando` (rastro longo), `fraca` (luz enfraquecida), `entregando` (feixe para baixo).

### Movimento · `Jogo.mover`

```js
Jogo.mover.andar(ctx, h, Templo.geo.rota(0, 2), 1400, { atraso: 100, marcas: tp.marcasDePouso(0, 2, k => hud.mudarFase(ctx, k)) });
Jogo.mover.rolar(ctx, h, Templo.geo.rota(2, 1), 800, { voltas: 1, quique: 9, saltos: 2, fim: () => { /* levantar */ } });
Jogo.mover.levantar(ctx, h, atraso, ms);
Jogo.mover.voar(ctx, ia, [{ x, y }, { x, y }], 700, { atraso: 0, estado: 'disparando', aoFim: 'parada', fim: () => {} });
```

Nenhum deles fixa o estado final: o `fim()` do passo põe herói e aliado no lugar. `andar` toca o som dos passos (`ganho: 0` desliga).

### Pedra e lasca · `Jogo.pedra(pai, o)` · `Jogo.lasca(pai, o)`

A pedra grande traz o motivo e é lida **antes** do impacto; a lasca é o motivo que fica à vista depois.

```js
const pedra = Jogo.pedra(tp.topo, { linhas: ['Os dados estavam', 'incompletos.'], x: 430, y: 226, w: 312, h: 108, corpo: 28, semente: 11 });
const lasca = Jogo.lasca(tp.topo, { linhas: ['Os dados estavam incompletos.'], x: 890, y: 162, rot: -1 });
const tL = tE + pedra.chegar(ctx, 'cai', tE);           // modos: cai, pousa, desliza, desce, esquerda. Devolve a duração
ctx.em(tL, () => { bob = pedra.flutuar(ctx); });        // parada, sendo lida
ctx.em(tG, () => { bob.cancel(); pedra.golpear(ctx, { dx: -186, dy: 200, rot: -16, ms: 360 }); });
ctx.em(tI, () => { pedra.desfazer(ctx, G); ctx.em(lasca.cravar(ctx, x, y), () => ctx.som.clac()); });
lasca.fixar();                                          // estado na hora (no fim()). A pedra grande nasce e termina escondida
```

`x, y` da pedra é o centro onde ela para. Deixe-a parada pelo menos 1,5 s com o texto inteiro dentro do palco.

### Baú · `Jogo.bau(camadaSvg, { escala })`

```js
const bau = Jogo.bau(tp.atores, { escala: 1 });
bau.por(x, y).estado('fechado').mostrar(true);  // (x, y) = meio da base. Estados: fechado, armadilha (aberto, causa dano), exposto (aberto no portão, sem dano)
ctx.em(1200, () => bau.abrir(ctx, 'armadilha'));        // troca de estado com um salto
```

### Cartão de texto · `Jogo.cartao(pai, o)`

```js
const c = Jogo.cartao(tp.hud, { cabecalho: 'Manual do jogo · edição de 2000', linhas: ['Linha comum.', { n: '4.', t: 'IA no processo: não prevista.', destaque: true }], rodape: 'Fonte', x: 252, y: 150, largura: 612, rot: -1.2 });
c.definir({ visivel: true });                   // estado na hora; { linhas: 2 } mostra só as duas primeiras
const t0 = 300 + c.entrar(ctx, 300); c.revelar(ctx, 0, t0); c.revelar(ctx, 1, t0 + 600); c.revelar(ctx, 'rodape', t0 + 1200); c.sair(ctx);
```

`destaque: true` pinta a linha em ciano: **só para o que é da IA**. `cabecalho` e `rodape` são opcionais.

### Aposta · `Jogo.aposta(pai, o)`

```js
const ap = Jogo.aposta(tp.hud, { pergunta: 'Com IA, quanto mais rápido?', opcoes: ['10%', '25%', '50%'], certa: 1, x: 360, y: 210, largura: 560 });
ap.definir({ visivel: true, revelada: false });                 // estado na hora
ap.entrar(ctx, atraso); ctx.em(2000, () => ap.revelar(ctx));    // um passo mostra a pergunta; o seguinte revela
```

Largura mínima de 420 px. A opção certa fica branca; as outras se apagam.

### Cabeçalho, frase e balão · `Jogo.cabecalho` · `Jogo.frase` · `Jogo.balao`

O texto fixo e as frases das cenas saem daqui, para os mundos ficarem iguais entre si.

```js
const cab = Jogo.cabecalho(tp.hud, { eyebrow: 'Mundo 2', titulo: 'O aliado: a IA entra no jogo' });   // canto de cima, sob o HUD
cab.definir(true); cab.entrar(ctx, atraso);
const f = Jogo.frase(tp.hud, { texto: 'Voltar ainda acontece. Só ficou barato.' });                    // centrada no pé da tela (y 636)
const q = Jogo.frase(tp.hud, { texto: 'Você entregaria isso ao seu chefe agora?', acento: true });     // acento: maior e em ciano
f.definir(true); f.definir(true, 'outro texto'); f.entrar(ctx, atraso); f.sair(ctx, atraso);
const b = Jogo.balao(tp.topo, { texto: 'Achei a fonte.', x: 700, y: 330 });                            // (x, y) = canto de baixo à esquerda, perto de quem fala
b.definir(true); b.entrar(ctx, atraso); b.sair(ctx); b.por(x, y);                                      // ia: false = fala de pessoa (contorno lavanda)
```

Só uma frase de pé de tela por vez no mesmo `y`: ao trocar, a anterior sai (`sair`) e o `fim()` a esconde. `acento: true` é para o que é da IA ou para a pergunta que fecha a cena, como na cena 01.

### Prêmio · `Jogo.premio(camadaSvg, { escala })`

A taça das cenas 02, 03 e 04. `(x, y)` é o meio da base; 112 px de altura na escala 1.

```js
const pr = Jogo.premio(tp.atores, { escala: 1.2 });
pr.por(x, y).estado('inteiro').mostrar(true);           // estados: inteiro, falha (imagem com defeito), desfeito (sumiu)
ctx.em(1500, () => pr.falhar(ctx, 500, 'inteiro'));     // pisca com defeito por 500 ms e termina no estado dado; o fim() fixa o mesmo estado
```

### Segunda pessoa · `Jogo.heroi(camadaSvg, { escala, colega: true })`

A mesma figura do herói, sem chapéu, mochila nem notebook, em lavanda. Mesma API.

### Cena sem templo · `Jogo.camadas(palco, { classe })`

Para o mapa da cena 04. Devolve as mesmas camadas do templo, vazias, sobre um fundo marinho.

```js
const c = Jogo.camadas(palco, { classe: 'c04' });
c.desenho   // <g> de SVG: o cenário da cena (o mapa)
c.meio      // <div>: HTML preso ao cenário, abaixo dos atores (nomes das etapas)
c.atores, c.fx, c.topo, c.hud                           // como no templo
c.tremor(ctx, px, ms); c.poeira(ctx, x, y, n); c.estilhacos(ctx, x, y, n);
```

Zoom e câmera, nessa cena, são por conta dela: aplique o transform em `c.mundo` (o `hud` fica de fora e não se mexe).

### Telas e logo

`Jogo.titulo(pai, { mundo, nome, dica })`, `Jogo.gameOver(pai, texto)` (faixa grande: "GAME OVER" por padrão; com `texto`, "Fase concluída"; devolve o elemento, que a cena posiciona e anima), `Jogo.continuar(pai, texto, pinos)` (com `.gastar(k)` e `.espera(v)`) e `Jogo.logo(pai)` (logo da ESEG no canto; ponha em toda cena).

## 7. Som · `ctx.som`

Tudo sintetizado. Cada chamada aceita `{ t: atraso em segundos, ganho }` e vira silêncio sozinha no mudo.

| Chamada | Som |
|---|---|
| `tambor({ freq })` · `flauta({ freq, dur })` · `gliss({ de, para, dur })` | Tambor grave · flauta · glissando |
| `pedra({ ganho, freq })` · `clac({ tom })` · `passo()` | Pancada · estalo seco · passo |
| `pronto()` · `vida({ tom })` · `derrota()` · `bipe({ freq })` · `novoJogador()` | Sons de jogo |
| `fanfarra({ completa })` · `falha()` · `presente()` | Fase concluída · imagem com defeito · toque de presente |
| `chip({ tipo: 'square' ou 'triangle', freq, ate, dur, ganho })` | Nota avulsa, para montar um som que não existe |
| `penta(grau, base)` | Frequência na escala pentatônica (para melodias: `flauta({ freq: som.penta(3) })`) |
| `ambiente({ vento: 0.5 }, rampaEmSegundos)` | Som contínuo; no passo, declare também em `ambiente:` |

Som novo: componha com `chip` dentro da sua cena. Não edite `som.js`.

## 8. Design

Azul e branco: marinho `#000653`, lavandas `#E3E2FD` e `#ECEDFF`, branco. Variáveis prontas em `estilo.css` (`--marinho`, `--lav-1`, `--lav-2`, `--acento`, `--n-900` a `--n-200`, `--l-500` a `--l-200`). O ciano `#00A1B8` marca **só o que é da IA**. Sem vermelho, dourado ou verde. Public Sans já está embutida. Nada abaixo de 20 px no palco. Palco de 1280×720; o topo já tem o HUD (y 14 a 60, mais a aba dos jogadores até y 98, à direita).

## 9. O `esperado.json`

```json
{
  "cena": "02", "passos": 6,
  "textos": [{ "seletor": ".c02-titulo", "texto": "O aliado: a IA entra no jogo" }, { "seletor": ".jg-ap-o span", "textos": ["10%", "25%", "50%"] }],
  "contagens": [{ "seletor": ".jg-cor svg", "n": 5 }],
  "hud": [{ "vidas": 5, "fase": "1/6", "nome": "Entendimento do negócio", "prazo": 1, "jogadores": true }],
  "estado": [{ ".c02-cab": true, ".jg-lasca": 0, ".c02-frase": "texto visível" }],
  "acento": [".jg-jog .ia", ".jg-ct-l.destaque", ".jg-ct-l.destaque *"],
  "quadros": { "1": [800, 2000] },
  "leitura": [{ "passo": 3, "seletor": ".jg-pedra", "indice": 0, "minimoParadaMs": 1500 }]
}
```

- `textos`: lidos no último passo, com espaços normalizados. `texto` para um elemento, `textos` para a lista de todos os que casam com o seletor.
- `hud`: uma entrada por passo, na ordem; `null` = HUD escondido. Só os campos que você puser são conferidos.
- `estado`: uma entrada por passo. Número = quantos elementos visíveis casam; texto = o texto do primeiro visível (`""` se nenhum); `true`/`false` = há algum visível.
- `acento`: seletores de HTML que podem ter ciano. Ciano em outro lugar é falha. O que está em SVG (aliado, faixa do baú) não entra. Dos componentes, têm ciano: `.jg-jog .ia`, `.jg-ct-l.destaque` e `.jg-ct-l.destaque *`, `.jg-frase.acento`, `.jg-balao.ia > div`.
- `quadros`: instantes (ms depois da tecla) em que o teste fotografa o meio da animação. `leitura`: mede quanto tempo o elemento ficou inteiro e parado.

## 10. Armadilhas já encontradas

- **Texto é HTML, forma é SVG.** No Chrome, `<text>` de SVG sai do lugar quando a escala muda. Rótulo que acompanha um objeto vai em HTML, em `tp.topo` ou `tp.hud`.
- **Estado final só por `fim()`.** Se `tocar` muda algo por estilo inline (texto, posição, classe), o `fim()` do mesmo passo tem de pôr o mesmo valor; e o `fim()` de um passo posterior tem de desfazer o que deve sumir.
- **Duas animações no mesmo elemento.** Uma animação com `delay` e `fill: 'both'` já aplica o primeiro quadro durante a espera, e atropela a anterior. Para sequência no mesmo elemento (chegar, depois golpear), crie a segunda na hora, dentro de `ctx.em`.
- **Texto atrás de texto é sobreposição, mesmo escurecido.** Cartão ou painel por cima do templo: `tp.nomes(false)` no `fim()` e `ctx.anim(tp.rotulos, [{opacity:1},{opacity:0}], 400)` no `tocar`.
- **Som é cortado ao pular.** Tudo o que o passo agendou para depois some junto. Não dependa de um som para entender a cena: ela tem de funcionar no mudo.
- **`easing: 'steps(1, jump-none)'` é inválido** e derruba o passo. Para piscar, use quadros com `easing: 'step-end'`.
- **Transform em elemento de SVG** gira e escala em torno do canto do desenho, não do elemento. Ponha `transform-box: fill-box` e `transform-origin` no CSS, ou monte o transform como `translate(x px, y px) rotate(...)`.
- **`will-change` e `translate3d` em camada com texto** deixam o texto borrado quando a escala muda (tela cheia). Não use.
- **Nada de altura em `vh`, nada de CDN, nada de `http` em `src` ou `href`.**
- **`hud.definir`, `tp.camera`, `h.por` no `tocar`** valem na hora e não são animados: use os métodos com `ctx` para animar e deixe os de estado para o `fim()`.
- **Elemento transitório** (poeira, pedra que cai) entra por `ctx.temp(el)`, senão sobra na tela quando o passo é pulado.
- **Ordem das chamadas no HUD.** `gastarPrazo` e `entrarJogadores` gravam o estado novo na hora da chamada, mesmo com atraso, e um `definir` posterior repinta tudo com ele. No `tocar`, chame `definir` antes deles, nunca depois.
- **Animação criada com `delay` muda a nitidez do texto desde a criação**, não só quando começa a andar. Para texto que precisa ficar nítido enquanto espera, crie a animação na hora, dentro de `ctx.em`.
- **Passos de espera.** Onde o roteiro tem pergunta à turma, o passo termina com o objeto da pergunta na tela e espera a tecla; a resposta é o passo seguinte. Nunca deixe a pergunta sair sozinha depois de um tempo fixo.
- **`id` de SVG (gradiente, `clipPath`) leva o prefixo da cena.** Na impressão todas as cenas ficam montadas ao mesmo tempo, e dois ids iguais se atropelam.
- **A troca de cena é uma cortina curta.** Ao avançar de uma cena para a seguinte, o motor deixa o último quadro da cena que sai por cima da que entra e o desfaz em 0,7 s. O que as duas cenas têm no mesmo lugar não se mexe; o resto se dissolve. Voltar (←), link direto e os atalhos 1 a 9 (ir direto a uma cena, para ensaio) são corte seco. A cena que redesenha o último quadro da anterior e o desfaz no próprio passo 0 (como a 02 faz com o fim da 01) declara `entrada: 'seca'` no registro, para a cortina não duplicar a imagem.
- **O canto de cima à direita já tem dono:** a aba "2 jogadores" vai até y 98. O que a cena puser ali começa abaixo disso.

## 11. Antes de concluir

1. `montar.ps1` com `node --check OK`.
2. Um PNG por passo (`capturar.ps1`), **todos abertos e olhados**: nada cortado, nada sobreposto, texto legível, HUD coerente.
3. `conferir.mjs` com 0 erros e 0 falhas, e as folhas do meio da animação olhadas.
4. Som e fluidez não aparecem em captura: confira os dois tocando o deck.
