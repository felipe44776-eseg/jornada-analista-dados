# Guia de gráficos

> Usado na etapa 05 (galeria e seleção), na 07 (gráficos dos achados, `Vnnc`) e nas etapas 10 e 11 (decks). Um gráfico responde a **uma** pergunta, tem **título-mensagem** e passa no checklist de integridade. Fontes completas em `pesquisa/02-analise-rigor-comunicacao.md` §D.

**Princípio perceptual** (Cleveland & McGill, 1984): o olho compara com mais precisão **posição numa escala comum**, depois comprimento, ângulo e direção, depois área, volume e, por último, saturação de cor. Codifique o que importa mais alto nessa ordem. É por isso que barras e pontos vencem pizzas e mapas de calor na comparação de valores.

## 1. Escolha pela pergunta

Categorias baseadas no *Visual Vocabulary* do Financial Times.

| A pergunta é… | Categoria | Use | Evite |
|---|---|---|---|
| Quanto difere de uma referência (meta, média, fonte externa)? | Desvio | barras divergentes · pirulito com linha de referência | barras empilhadas |
| X e Y andam juntos? | Correlação | dispersão (com transparência ou hexbin se *n* grande) · matriz de correlação | linhas ligando pontos sem ordem |
| Quem é maior? | Ranking | barras horizontais ordenadas · dot plot | pizza · ordem alfabética |
| Como os valores se distribuem? | Distribuição | histograma · densidade · boxplot ou violino · ECDF · pontos individuais (*strip*) | só a média numa barra |
| Como mudou no tempo? | Mudança no tempo | linha · *slope chart* (2 momentos) · barras para períodos discretos | eixo de tempo com intervalos irregulares sem aviso |
| Quanto é? | Magnitude | barras (eixo em zero) · dot plot | 3D · pictograma com área distorcida |
| Que parte do todo? | Parte-todo | barras empilhadas 100% · treemap · waffle; pizza só com 2 ou 3 fatias | pizza de 12 fatias · rosca 3D |
| Onde? | Espacial | mapa coroplético **de taxa** · mapa de pontos · hexbin | coroplético de contagem absoluta (vira mapa de população) |
| Para onde flui? | Fluxo | Sankey · diagrama de cordas | — |
| Interno × externo? | Comparação de fontes | séries lado a lado na **mesma escala** · pontos com IC · linha interna sobre faixa externa | dois eixos y |
| Quão incerto é? | Incerteza | barras de erro · faixas de IC · gráfico de intervalos | esconder a incerteza |

## 2. Checklist de integridade

Todo gráfico selecionado na etapa 05 passa por ele.

- [ ] **Barras começam em zero.** Linhas podem não começar, se o recorte estiver claro.
- [ ] **Mesma escala** em painéis que o leitor vai comparar, ou aviso explícito.
- [ ] **Proporcionalidade:** o tamanho visual do efeito é proporcional ao tamanho no dado (o *lie factor* de Tufte ≈ 1).
- [ ] Sem 3D, sombra, gradiente ou ícone decorativo.
- [ ] **Eixo duplo** só com justificativa. Prefira dois painéis.
- [ ] Unidade, período, *n* e **fonte** visíveis.
- [ ] **Taxa**, não contagem, quando as populações diferem (sobretudo em mapas).
- [ ] **Incerteza** visível quando o gráfico sustenta uma inferência.
- [ ] Categorias em ordem com lógica (por valor ou ordem natural), nunca alfabética por acidente.
- [ ] Paleta segura para daltonismo (cerca de 8% dos homens e 0,5% das mulheres têm alguma deficiência de visão de cor); cor com significado consistente em todos os gráficos.
- [ ] **Cor não é o único meio** de transmitir a informação: use também forma, posição, rótulo ou padrão (WCAG 1.4.1).
- [ ] Contraste de texto ≥ 4,5:1 (WCAG 1.4.3); elementos gráficos necessários para entender o conteúdo com ≥ 3:1 (WCAG 1.4.11).
- [ ] **Título-mensagem**, com anotação direta no lugar de legenda quando possível.
- [ ] **Rótulo da base:** "exploração (E0)" nos gráficos da etapa 05; *n* e fonte da base do teste nos `Vnnc`.

## 3. Título-mensagem

O título diz **a conclusão observada**, não o tema, e não diz mais do que o gráfico mostra.

| Título-tema (evite) | Título-mensagem (use) | Exagerado (evite) |
|---|---|---|
| Cancelamento por plano | Cancelamento do plano B é maior em todas as regiões | Plano B causa cancelamento |
| Vendas mensais 2023–2025 | Vendas cresceram 4% ao ano, abaixo do setor (6%) | Vendas despencaram frente ao mercado |
| Distribuição de idade | Base tem menos clientes acima de 60 anos que a população da cidade | Idosos rejeitam o produto |

Na etapa 05 o título descreve uma observação (E0). No deck, ele usa o verbo do nível de evidência (`AGENTS.md` §8).

## 4. Paletas

| Uso | Paleta | Valores |
|---|---|---|
| Categórica (até 8 grupos) | **Okabe–Ito** | `#E69F00` `#56B4E9` `#009E73` `#F0E442` `#0072B2` `#D55E00` `#CC79A7` `#000000` |
| Sequencial (de menos a mais) | **viridis** ou **cividis** | `matplotlib` / `seaborn`: `cmap="viridis"` |
| Divergente (abaixo × acima de uma referência) | dois matizes com centro neutro **no valor que importa** (zero, média, meta) | `cmap="RdBu"`, com `TwoSlopeNorm(vcenter=...)` |

Regra de destaque: **uma cor para o que importa, cinza para o contexto.** Sobretudo no deck executivo.

## 5. Exploração × confirmação: qual gráfico vai para o deck

| Gráfico | Base | ID | Pode ir para o deck como… |
|---|---|---|---|
| da galeria da etapa 05 | exploração | `Vnn` | **"exploração (E0)"**: origem de uma hipótese, nunca prova |
| do achado confirmado | a do teste (etapa 07) | `Vnnc` | **evidência** do achado, com o nível de evidência dele |

O `Vnnc` sai da **mesma função** que gerou o `Vnn`, rodada sobre a base do teste. Mostrar o gráfico da exploração como prova é mostrar o dado que gerou a hipótese como se o tivesse confirmado.

## 6. Mesmo gráfico, duas camadas

| | Deck técnico | Deck executivo |
|---|---|---|
| Séries | todas as relevantes | a que sustenta a mensagem, destacada |
| Incerteza | IC ou faixa explícita | faixa sutil ou nota ("confiança alta") |
| Rótulos | eixos completos, *n*, teste | anotação direta do número-chave |
| Fonte | completa, com ID (`V07`, `F02`) | curta, com rastreio nas notas |

Os dois saem do **mesmo script e da mesma base**. O executivo simplifica a camada visual, nunca o dado.

## 7. Convenções de código

- Uma função por gráfico em `analise/05_eda.py`, chamada pelo ID e com a **base como parâmetro**: `grafico_v07(df, rotulo="exploração (E0)")` gera o `V07`; a mesma função, rodada na etapa 07 sobre a base do teste, gera o `V07c`.
- Salvar PNG em 200 dpi (e SVG, se o deck for HTML) como `figuras/V07_cancelamento-por-plano.png`.
- Rodapé com fonte e *n* gerado a partir dos dados, nunca digitado.
- Semente fixa em tudo o que tiver aleatoriedade (jitter, amostragem para dispersão).

## 8. Como pedir à IA

```text
Gere o gráfico V07 para a subpergunta SQ2 seguindo referencias/guia-graficos.md:
escolha o tipo pela seção 1 e justifique em uma linha; aplique o checklist da
seção 2 e diga item a item se passou; escreva 3 opções de título-mensagem que
não exagerem o que o gráfico mostra. Salve em figuras/V07_<slug>.png.
```
