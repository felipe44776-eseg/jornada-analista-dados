# 05 · Exploração e gráficos

> **Etapa 05 · Exploração** · Data: AAAA-MM-DD · Responsável: ___ · IA: ___ · Status: `rascunho`
> **Base usada:** `dados/processados/exploracao.*` (hash de conteúdo: ___). O conjunto de confirmação continua **no cofre**, fora do projeto, e não foi lido.
> Todo gráfico desta etapa leva no rodapé **"exploração (E0)"**. Os gráficos dos achados confirmados são regerados na etapa 07, na base do teste, com ID `Vnnc`.

## 1. Expectativas (declaradas antes de gerar os gráficos)

| Subpergunta | O que esperamos ver | Por quê |
|---|---|---|
| SQ1 | | |

## 2. Galeria (divergir)

Tudo o que foi gerado, inclusive o descartado. A galeria alimenta o placar do funil.

| ID | Subpergunta | Tipo de gráfico | Variáveis | Arquivo | Selecionado? |
|---|---|---|---|---|---|
| V01 | SQ1 | | | `figuras/V01_....png` | sim · não (motivo) |

## 3. Gráficos selecionados (convergir)

Especificação de cada gráfico que segue adiante. *(Repita o bloco.)*

### V__ — *título-mensagem (a conclusão, não o tema)*

| Campo | Valor |
|---|---|
| Pergunta que responde | SQ__ |
| Tipo e por que este tipo | *ver [`referencias/guia-graficos.md`](../referencias/guia-graficos.md)* |
| Codificação | x = ___ · y = ___ · cor = ___ · facetas = ___ |
| Dados, filtro e *n* | |
| Script | `analise/05_eda.py` (função/célula) |
| Ressalvas | |

Integridade: [ ] eixo de barras começa em zero · [ ] escalas comparáveis entre painéis · [ ] unidade e *n* visíveis · [ ] fonte no rodapé · [ ] paleta segura para daltonismo · [ ] sem 3D e sem eixo duplo enganoso · [ ] título diz a conclusão

## 4. Observações (nível E0)

Fatos observados, sem interpretação causal. Uma observação é matéria-prima de hipótese, não conclusão.

| ID | Observação | Gráficos | Subpergunta | Bate com a expectativa? |
|---|---|---|---|---|
| O01 | | V__ | SQ__ | sim · não → explicação/investigação |

## 5. Primeiro olhar externo

Comparação preliminar com as fontes da etapa 03, só descritiva. A comparação formal fica para a etapa 08.

| Observação | Fonte externa | O que a fonte sugere |
|---|---|---|

## 6. Hipóteses candidatas

| ID | Hipótese candidata | Origem | Relevância para a decisão (1–3) | Plausibilidade (1–3) | Testabilidade (1–3) | Vai para o registro? |
|---|---|---|---|---|---|---|
| HC01 | | HP1 (a priori) · análise anterior · O03 (exploração) · sugestão da IA | | | | sim → H__ · não (motivo) |

> Hipótese que não muda a decisão não se testa, por mais interessante que seja. Vai para "próximos passos".

## 7. Checklist do portão G5 ★

*Ver também o checklist do registro de hipóteses (`05-registro-hipoteses.md`).*

- [ ] Expectativas declaradas antes dos gráficos
- [ ] Galeria completa, com motivo de descarte
- [ ] Gráficos selecionados especificados, passando no checklist de integridade
- [ ] Observações escritas como fatos (E0), sem linguagem causal
- [ ] Hipóteses candidatas priorizadas, com critério explícito
- [ ] Registro completo; cópia `.travado.md` somente leitura; SHA-256 no status e na DEC; tag `trava-registro` ancorada fora (enviada ao remoto, ou mensagem do humano ao revisor com o `git rev-parse` da tag e o hash); DEC `âncora` registrada
- [ ] Conjunto de confirmação no cofre, intocado
- [ ] Revisado por segunda pessoa (nome: ___) ou ausência registrada em DEC-___
