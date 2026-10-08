# 07 · Resultados dos testes confirmatórios

> **Etapa 07 · Testes** · Data: AAAA-MM-DD · Responsável: ___ · IA: ___ · Status: `rascunho`
> **Registro usado:** `saidas/05-registro-hipoteses.travado.md` · conferido contra a **âncora externa** de `trava-registro` (colada pelo humano, ou tag no remoto, lendo o arquivo pelo SHA dela): sim · não
> **Modelo congelado (se houver):** `modelos/M01.*` e a ficha travada · conferidos contra a âncora de `trava-modelo`: sim · não · hash do modelo avaliado [→ `M01.sha256`]
> **Confirmação:** devolvida do cofre em AAAA-MM-DD (DEC-___ tipo `leitura`) · hash de conteúdo confere com `resultados/04_particao.json`: sim · não
> **Script:** `analise/07_testes.py` → `resultados/07_testes.json`

## 1. Checagens de integridade (registro §6)

| Checagem | Resultado | Ação |
|---|---|---|
| contagem de linhas | | ok · **parar** (incidente) |
| hash de conteúdo | | ok · **parar** (incidente) |
| nulos nas variáveis das hipóteses | | ok · pendência |
| covariáveis × exploração | | ok · pendência |

## 2. Resumo

| Testadas | Confirmadas (E1) | Contrárias | Refutadas | Inconclusivas | Com desvio |
|---|---|---|---|---|---|
| | | | | | |

Correção aplicada: ___ (famílias: ___) · α = ___ · IC reportado: 1 − α/k · "não ajustado"

## 3. Tabela de resultados

Todo valor vem de `resultados/07_testes.json` (chave entre colchetes).

| H | Teste usado (plano B?) | *n* | Estimativa | IC | p | p ajustado | \|estimativa\| ≥ m? | Decisão | Chave |
|---|---|---|---|---|---|---|---|---|---|
| H01 | | | | | | | sim · não | confirmada · contrária · refutada · inconclusiva | `H01.*` |

> Reporte p com valor exato (p = 0,031), não "p < 0,05". p não é a probabilidade de a hipótese ser verdadeira, e p > α não prova ausência de efeito.

## 4. Pressupostos e planos B

| H | Pressuposto | Como foi checado | Resultado | Gatilho do plano B disparou? |
|---|---|---|---|---|
| | | | ok · violado | não · sim → teste ___ (estimando ___) |

## 5. Desvios do registro

Também registrados no log de decisões.

| H | Desvio | Motivo | Cego ou informado pelo resultado? | Nível resultante |
|---|---|---|---|---|
| | | | cego (documentado antes de ver o resultado da hipótese) · informado | mantém (declarado) · E0 |

## 6. Modelo congelado: avaliação única *(se a etapa 06 rodou)*

Também na §5 da ficha do modelo.

| Métrica | Baseline | Modelo | IC 95% (bootstrap por bloco ou entidade, se couber) | Critério atingido? |
|---|---|---|---|---|

## 7. Análises exploratórias adicionais

Tudo o que foi rodado **fora** do registro. Rotulado **E0**, nunca apresentado como confirmação.

| Análise | Motivo | Resultado | Vira hipótese para um próximo ciclo? |
|---|---|---|---|

## 8. Leitura por hipótese

Uma frase por hipótese, com o verbo da escada de evidência (`AGENTS.md` §8). Gráfico do achado: `Vnnc`, gerado na base do teste.

- **H01:** ___ [→ `H01.efeito`] · gráfico `V__c`
- **H02:** ___

## 9. Checklist do portão G7

- [ ] Hashes dos arquivos travados conferidos antes de abrir a confirmação
- [ ] Leitura da confirmação registrada (DEC `leitura`)
- [ ] Checagens de integridade rodadas para todas as hipóteses
- [ ] Todos os testes registrados rodaram, **inclusive os nulos**; nenhum teste fora do registro tratado como confirmatório
- [ ] Planos B só pelo gatilho objetivo
- [ ] Correção de multiplicidade por família; nível do IC coerente
- [ ] Decisão de cada hipótese pela regra de quatro resultados
- [ ] Desvios classificados em cego ou informado, com o nível resultante
- [ ] Modelo avaliado uma única vez, se houver
- [ ] Gráficos `Vnnc` gerados para os achados
- [ ] Todo número do artefato presente em `resultados/07_testes.json`
