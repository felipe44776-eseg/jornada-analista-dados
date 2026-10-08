# 06 · Ficha do modelo

> **Etapa 06 · Modelagem** · Data: AAAA-MM-DD · Responsável: ___ · IA: ___ · Status: `rascunho`
> Formato inspirado nos *Model Cards* (Mitchell et al., 2019).
> **§1–§4 e §6–§9** são preenchidas na etapa 06, só com dados de exploração, e congeladas no G6 (cópia `06-ficha-modelo.travado.md`, hash no status e fora do projeto). **§5** é preenchida na etapa 07, na avaliação única.

## 1. Propósito

| Campo | Valor |
|---|---|
| Pergunta preditiva que o modelo responde | *(liga ao brief e ao registro §5)* |
| Uso pretendido | |
| Usos fora de escopo | *(o que o modelo NÃO deve decidir)* |
| Quem é afetado pelas previsões | |

## 2. Dados

| Conjunto | Arquivo | Hash de conteúdo | Linhas | Período |
|---|---|---|---|---|
| Treino/validação | `exploracao.*` | | | |
| Avaliação final (etapa 07) | `confirmacao.*` (no cofre até a 07) | *(de `resultados/04_particao.json`)* | | |

**Alvo:** ___ · **Variáveis de entrada:** ___
**Variáveis excluídas e por quê:** *(vazamento: informação que não existiria no momento da previsão; proxies de atributo sensível)*

## 3. Modelos avaliados (na exploração)

Todos os modelos, inclusive os descartados.

| ID | Modelo | Hiperparâmetros (como escolhidos) | Métrica principal (validação) | Métricas secundárias | Situação |
|---|---|---|---|---|---|
| M00 | baseline: ___ | — | | | referência |
| M01 | | | | | escolhido · descartado (motivo) |

## 4. Validação e congelamento

- Esquema: ___ *(k-fold agrupado, temporal, espacial… e por que evita vazamento neste dado)*
- Variação entre dobras: ___ *(média ± desvio) [→ resultados/06_modelo.json]*
- KFold aleatório, se houver dependência: ___ *(mede o otimismo)*
- **Modelo congelado:** `modelos/M01.*`, somente leitura · SHA-256 ___ (também no status) · tag `trava-modelo` · data ___

## 5. Avaliação final no conjunto de confirmação *(etapa 07, uma única vez)*

| Métrica | Baseline | Modelo congelado | IC 95% (bootstrap; por bloco ou entidade se a partição for agrupada ou temporal) | Critério de sucesso atingido? |
|---|---|---|---|---|
| | | | | sim · não |

Calibração, se o modelo prevê probabilidade: ___
Nível de evidência (`AGENTS.md` §8): **E1** se atingiu o critério registrado; E2 e E3 dependem da etapa 08.

## 6. Interpretação

- Variáveis mais influentes e direção do efeito: ___ *(importância por permutação, SHAP ou coeficientes)*
- Exemplos de previsões certas e erradas: ___ *(sem dado pessoal; célula com n < 5 suprimida)*
- **Associação, não causa:** a importância de uma variável não diz o que acontece se ela for alterada.

## 7. Erros e subgrupos (na validação)

| Subgrupo | *n* | Métrica | Diferença para o geral | Preocupação? |
|---|---|---|---|---|

## 8. Limitações, riscos e monitoramento

- Limitações: ___
- Riscos de uso indevido: ___
- O que monitorar se o modelo for implantado (deriva de dados e de desempenho) e gatilho de recalibração: ___

## 9. Reprodutibilidade

Script `analise/06_modelo.py` · semente ___ · versões ___ · artefato `modelos/M01.*`

## 10. Checklist do portão G6

- [ ] Plano de modelagem do registro seguido; desvios registrados antes de abrir a confirmação
- [ ] Baseline reportado; modelo escolhido comparado com ele na validação
- [ ] Esquema de validação justificado pelo tipo de dependência do dado
- [ ] Vazamento verificado variável a variável
- [ ] **Nenhum uso de `confirmacao.*`**
- [ ] Todos os modelos tentados listados, inclusive descartados
- [ ] Subgrupos examinados quando há pessoas afetadas
- [ ] Modelo e ficha congelados, somente leitura; hashes no status e ancorados fora (tag `trava-modelo` enviada ao remoto, ou mensagem ao revisor com o `git rev-parse` da tag e os hashes); DEC `âncora` registrada
