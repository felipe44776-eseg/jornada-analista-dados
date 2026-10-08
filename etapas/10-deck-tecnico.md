---
etapa: "10"
nome: "Deck técnico"
fase: "5 · Comunicar"
portao: "G10"
papel_ia: "Redator(a) técnico(a) e designer de slides"
entradas:
  - saidas/00-status.md (placar, números revisados)
  - saidas/01-brief.md
  - saidas/02-dados-internos.md
  - saidas/03-fontes-externas.md
  - saidas/04-preparacao.md
  - saidas/05-exploracao.md
  - saidas/05-registro-hipoteses.travado.md
  - saidas/06-ficha-modelo.md (se houver)
  - saidas/07-resultados-testes.md
  - saidas/08-validacao.md
  - saidas/09-insights.md
  - saidas/log-ia.md
  - resultados/*.json · figuras/
saidas:
  - saidas/10-roteiro-deck-tecnico.md
  - apresentacoes/deck-tecnico.html (ou .pptx / Marp / Quarto)
  - saidas/declaracao-uso-ia.md (rascunho)
template: templates/10-roteiro-deck-tecnico.md
origem: "CRISP-DM: Produce final report (relatório e apresentação final), Review project · TDSP: exit report · R4DS: Communicate · Sandve et al. (2013): reprodutibilidade · assertion–evidence (Alley)"
---

# Etapa 10 — Deck técnico

> **Missão:** produzir uma apresentação que permita a um par técnico **entender, criticar e reproduzir** a análise, mostrando o funil inteiro e não só o que deu certo.

## Por que esta etapa existe

- O CRISP-DM fecha com relatório e apresentação final e com a revisão do projeto; o TDSP pede um *exit report*.
- O público técnico precisa do caminho: dados, escolhas, testes (inclusive os que falharam), validação e limitações. Sem isso, não há como confiar nem como reproduzir.
- **O placar do funil é evidência.** Dizer quantas hipóteses foram testadas, e quantas falharam, é o que permite ao leitor avaliar o risco de falso positivo.

## Papel da IA

Montar o roteiro a partir dos artefatos, gerar o deck **lendo os números de `resultados/`**, escrever as notas do apresentador com rastreio e rascunhar a declaração de uso de IA a partir do `log-ia.md`.

## Formato de saída

| Formato | Quando usar | Observação |
|---|---|---|
| **HTML autocontido** *(padrão)* | apresentar no navegador e exportar PDF | 1 arquivo, slides 16:9 (1280×720), CSS e JS embutidos, imagens em data URI, `@media print` com 1 slide por página |
| **Marp** ou **Quarto** | quem prefere escrever em Markdown | o roteiro já é quase o deck |
| **PPTX** (`python-pptx`) | quando exigido pela disciplina ou pelo cliente | gerado a partir do roteiro, não à mão |

## Regras de design

- **Um slide, uma mensagem.** O título é uma asserção (a conclusão), em até 2 linhas.
- **Gráfico de achado = `Vnnc`**, gerado na base do teste (etapa 07). Gráfico da exploração só aparece rotulado **"exploração (E0)"**.
- Todo gráfico com fonte, unidade e *n*; paleta segura para daltonismo; destaque só do que importa.
- Tabela de resultados com os quatro desfechos: estimativa, IC (rotulado ajustado ou não), p exato e p ajustado.
- **Todo número sai de `resultados/*.json`**, citado pela chave no rodapé ou nas notas: `[→ H03.efeito]`.
- Numeração de slides; apêndice separado.

## Roteiro PEVD

### P — Planejar
1. Copie o template do roteiro e escolha o formato.
2. Declare a expectativa: número de slides e o que vai para o apêndice.

### E — Executar
1. Preencha o roteiro slide a slide: título-asserção, conteúdo, visual, chaves de rastreio, notas.
2. Inclua **obrigatoriamente**:
   - o placar do funil;
   - a tabela com todas as hipóteses (confirmadas, contrárias, refutadas, inconclusivas);
   - os desvios;
   - a validação (sensibilidade, régua externa, auditoria);
   - as limitações;
   - como reproduzir (resultado da reprodução em ambiente limpo, feita na etapa 08);
   - o uso de IA.
3. Gere o deck **lendo os números de `resultados/`** e os gráficos pelos scripts, sem retoque manual.
4. Rascunhe `saidas/declaracao-uso-ia.md` a partir do `log-ia.md`, para o slide de uso de IA. A versão final é assinada na etapa 12.
5. **Amarre os números:** um script extrai todos os números do deck e os confere com `resultados/`. Onde não existe amarração, os números derivam a cada rodada de edição, e esse é o erro mais comum depois de uma análise bem-feita.

### V — Verificar
- A checagem número a número bateu 100%? Corrija na origem, nunca no slide.
- Algum número da lista "números revisados" (`00-status.md`) voltou a aparecer?
- Um par técnico consegue reproduzir com o slide "como reproduzir"?
- Rode o checklist do portão (no roteiro).

### D — Decidir: portão G10
Revisão por um par técnico (colega ou professor), ou ausência registrada, caso em que o deck declara "sem revisão independente". Peça `Aprovo G10`.

## Armadilhas

| Armadilha | Salvaguarda |
|---|---|
| Deck só com os acertos | placar do funil + tabela completa de hipóteses |
| Número digitado à mão diverge do resultado | deck lê `resultados/`; script de conferência |
| Gráfico da exploração usado como prova do achado | gráfico `Vnnc` na base do teste |
| Gráfico refeito "mais bonito" com filtro diferente | mesma função, mesma base |
| Slide-parede de texto | uma mensagem por slide; detalhe no apêndice |
| Declaração de IA escrita de memória | rascunho a partir do `log-ia.md` |

## Prompts prontos

```text
Gere o deck técnico a partir de saidas/10-roteiro-deck-tecnico.md em HTML
autocontido (1280×720, @media print com 1 slide por página). Leia todos os
números de resultados/*.json pelas chaves do roteiro e ponha a chave nas
notas do apresentador. Para os achados, use os gráficos Vnnc; os de
exploração só com o rótulo "exploração (E0)".
```

```text
Escreva um script que extraia todos os números do deck (slides e notas) e
monte a tabela: número | slide | chave | valor em resultados/ | bate? Não
corrija nada no slide: aponte as divergências.
```

## Volte para trás quando

- A história não se sustenta no formato técnico → **09**.
- Um número não reconcilia com `resultados/` → a etapa que o produziu.
