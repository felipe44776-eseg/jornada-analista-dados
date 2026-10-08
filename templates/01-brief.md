# 01 · Brief do problema

> **Etapa 01 · Problema e decisão** · Data: AAAA-MM-DD · Responsável: ___ · IA: ___ · Status: `rascunho`

## 1. Contexto

*(3 a 5 linhas: organização, situação, por que a pergunta surgiu agora)*

## 2. A decisão

| Campo | Valor |
|---|---|
| Quem decide | |
| O que será decidido | |
| Até quando | |
| O que acontece se nada for decidido | |

**Teste da decisão.** Cada resposta possível precisa levar a uma ação diferente. Se todas levam à mesma ação, a pergunta não informa a decisão: reformule.

| Se a análise mostrar que… | …então a decisão será |
|---|---|
| | |
| | |

## 3. Pergunta principal

> **Pergunta:** *(uma frase, com população, período e métrica)*

| Campo | Valor |
|---|---|
| Tipo de pergunta | descritiva · exploratória · inferencial · preditiva · causal · mecanística |
| Por que esse tipo | |
| Unidade de análise | *(cliente, transação, município-mês…)* |
| População-alvo | |
| Período | |
| Métrica principal (definição operacional) | |
| **Efeito mínimo relevante (m)**: a menor diferença que mudaria a decisão | `[declarado: dono, data]` *(ex.: "2 p.p. de cancelamento"; perguntado aberto, sem sugestão da IA)* |
| **Efeito plausível (δ)**: o tamanho que se espera de fato, maior que m | `[declarado: dono ou literatura, data]` *(usado só para calcular o poder; nunca a estimativa da exploração)* |

**Afirmações permitidas por este tipo** *(ver [`referencias/frameworks.md`](../referencias/frameworks.md) §6):* ___
**Afirmações proibidas:** ___ *(ex.: pergunta exploratória não sustenta "X causa Y")*

## 4. Árvore de perguntas

Subperguntas que, respondidas juntas, respondem à principal. Sem sobreposição e sem lacuna (MECE).

| ID | Subpergunta | Tipo | Dado necessário | Etapa que responde |
|---|---|---|---|---|
| SQ1 | | | | |
| SQ2 | | | | |
| SQ3 | | | | |

## 5. Hipóteses a priori

O que o dono da pergunta, a área e a literatura esperam **antes** de ver o dado. Elas são registradas formalmente na etapa 05, junto com as que nascerem da exploração. Sem partição, são registradas por completo e travadas no G4.

| ID | Hipótese | Origem | Fundamento | m (mínimo relevante) | δ (plausível) | Rival mais forte |
|---|---|---|---|---|---|---|
| HP1 | | dono · área · literatura · análise anterior | | `[declarado: dono, data]` | `[declarado: dono ou literatura]` | |
| HP2 | | | | | | |

> Hipótese **sugerida pela IA** não conta como a priori: se for útil, vai para as candidatas da etapa 05.

## 6. Critérios de sucesso

| Nível | Critério mensurável | Como verificamos |
|---|---|---|
| Decisão | *ex.: dono decide entre A e B até dd/mm* | |
| Analítico | *ex.: estimar a taxa com IC 95% de ±2 p.p.* | |
| Comunicação | *ex.: deck executivo aprovado em 1 rodada* | |

## 7. Escopo

| Dentro | Fora |
|---|---|
| | |

## 8. Premissas e restrições

- Premissas: ___
- Restrições (prazo, acesso, custo, computação, jurídico): ___

## 9. Desenho causal *(só se a pergunta for causal)*

- Tipo de desenho: experimento aleatorizado · quase-experimento (diferenças em diferenças, descontinuidade, variável instrumental, controle sintético) · observacional com ajuste
- DAG ou lista de confundidores considerados (sem ajustar mediadores nem colisores): ___
- Premissas que sustentam a leitura causal (P1, P2…): ___
- **Linguagem permitida** (`AGENTS.md` §8):
  - experimento: verbo causal a partir de E1;
  - observacional ou quase-experimento: verbo **condicional** ("sob as premissas P1–P3, estimamos que…"), E2 ou mais, e sensibilidade a confundidor não medido (ex.: E-value) reportada.
- Se nada disso existir, **a pergunta não é causal**: volte ao item 3 e reclassifique.

## 10. Riscos, ética e privacidade

| Risco | Mitigação |
|---|---|
| *ex.: amostra só de clientes ativos (viés de sobrevivência)* | *comparar com base externa na etapa 03* |
| *ex.: dado pessoal de clientes* | *pseudonimizar antes de enviar à IA (kickoff §5)* |

## 11. Glossário

| Termo | Definição usada neste projeto |
|---|---|
| | |

## 12. Deck fantasma *(opcional)*

Títulos-mensagem **hipotéticos** do deck final, escritos agora para orientar a coleta. São hipóteses, não conclusões: a etapa 09 reescreve tudo com o que os dados mostrarem.

1. ___
2. ___
3. ___

## 13. Checklist do portão G1 ★

- [ ] Decisão, decisor e prazo explícitos; o teste da decisão passa
- [ ] Pergunta principal em uma frase, com população, período e métrica
- [ ] Tipo de pergunta classificado, com afirmações permitidas e proibidas
- [ ] **Efeito mínimo relevante (m) declarado pelo dono** (pergunta aberta, sem sugestão da IA) e **efeito plausível (δ)** declarado pelo dono ou pela literatura
- [ ] Árvore de perguntas MECE, cada subpergunta ligada a um dado
- [ ] Hipóteses a priori registradas **antes** de qualquer análise, com origem e rival
- [ ] Critérios de sucesso mensuráveis
- [ ] Escopo, premissas, restrições e riscos (incluindo privacidade) escritos
- [ ] Se causal: desenho, premissas e linguagem permitida declarados
- [ ] Revisado por segunda pessoa (nome: ___) ou ausência registrada em DEC-___
