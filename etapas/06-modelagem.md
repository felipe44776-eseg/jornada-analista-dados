---
etapa: "06"
nome: "Modelagem (condicional)"
fase: "3 · Explorar"
portao: "G6"
papel_ia: "Cientista de machine learning"
condicional: "roda só se a pergunta do brief (G1) for preditiva; estimar efeito ajustado por regressão é hipótese da etapa 07"
entradas:
  - saidas/00-kickoff.md
  - saidas/01-brief.md
  - saidas/04-preparacao.md
  - saidas/05-registro-hipoteses.travado.md (§5, plano de modelagem)
  - dados/processados/exploracao.*
saidas:
  - saidas/06-ficha-modelo.md → saidas/06-ficha-modelo.travado.md (no G6)
  - modelos/M01.* (modelo congelado)
  - analise/06_modelo.py · resultados/06_modelo.json
template: templates/06-ficha-modelo.md
origem: "CRISP-DM: Select modeling technique, Generate test design, Build model, Assess model · KDD: Data Mining · SEMMA: Model, Assess · TDSP: Modeling · CRISP-ML(Q): model engineering com QA, baseline · Model Cards (Mitchell et al., 2019)"
---

# Etapa 06 — Modelagem *(condicional)*

> **Missão:** quando a pergunta é preditiva, construir **o modelo mais simples que resolve**, usando **só os dados de exploração**, validá-lo de forma honesta para a estrutura do dado e **congelá-lo** antes que a confirmação seja aberta.

## Quando esta etapa roda

| Roda | Não roda |
|---|---|
| pergunta **preditiva** no brief (G1) e plano de modelagem no registro (G5 §5) | pergunta descritiva, exploratória, inferencial ou causal |
| | estimar o **efeito ajustado** de X em Y por regressão: isso é hipótese da etapa 07, com covariáveis fixas no registro |

Se não roda, marque `06 · não se aplica` no status, com o motivo, e registre no log.

## Por que esta etapa fica antes da confirmação

Toda escolha de modelo (variáveis, hiperparâmetros, tratamento de desbalanceamento) é **exploratória**. Se ela acontecer depois de a confirmação ter sido aberta, quem escolhe já viu resultados confirmatórios. Por isso o modelo é desenvolvido e **congelado** aqui, e a etapa 07 faz a **avaliação única**, junto com os testes de hipótese.

Base nos frameworks: o *Modeling* do CRISP-DM manda gerar o desenho de teste **antes** de construir; o CRISP-ML(Q) acrescenta QA por tarefa e o *baseline* obrigatório; o *Model Card* documenta uso pretendido, dados, métricas por subgrupo e limites. Um holdout reusado de forma adaptativa acaba ele mesmo sofrendo overfitting (Dwork et al., 2015), e é por isso que a confirmação se usa **uma vez**.

## Papel da IA

Rodar baselines e candidatos, validar pelo esquema registrado, auditar vazamento variável a variável, escolher o modelo **na validação dentro da exploração**, congelá-lo e preencher a ficha. A IA não usa `confirmacao.*`, que continua no cofre.

## Roteiro PEVD

### P — Planejar
1. Leia o plano de modelagem do registro travado (§5): alvo, métrica principal, baseline, validação e critério de sucesso.
2. Declare a expectativa: o desempenho provável do baseline e o ganho plausível de um modelo melhor.

### E — Executar
1. **Baselines primeiro:** regra simples, média ou classe majoritária, modelo linear.
2. **Candidatos**, do mais simples ao mais complexo, validados pelo esquema registrado: agrupado, temporal ou espacial, conforme a dependência do dado.
3. **Auditoria de vazamento**, variável a variável: "essa informação existiria no momento da previsão?". Remova as que não existiriam e registre na ficha.
4. **Escolha o modelo na validação** dentro da exploração. Registre **todos** os modelos tentados.
5. **Interpretação:** importância por permutação, SHAP ou coeficientes, sempre como associação.
6. **Subgrupos** na validação. É obrigatório quando as previsões afetam pessoas.
7. **Congelamento, no G6** (no modo essencial, no portão do grupo, G5★):
   - salve o modelo final em `modelos/M01.*`, com o pipeline de pré-processamento incluído, e marque-o como somente leitura. `06_modelo.py` decide sozinho onde grava, para que nenhuma reexecução (pelo `rodar_tudo.py` ou pelo humano, no sorteio) regrave o congelado:

     ```python
     # início de analise/06_modelo.py: depois do congelamento, o modelo congelado nunca é regravado
     import pathlib
     RAIZ = pathlib.Path(__file__).resolve().parents[1]
     CONGELADO = (RAIZ / "saidas" / "06-ficha-modelo.travado.md").exists()
     SAIDA_MODELO = RAIZ / ("modelos_regerado" if CONGELADO else "modelos")
     SAIDA_MODELO.mkdir(exist_ok=True)
     ```
   - copie a ficha para `06-ficha-modelo.travado.md`, somente leitura;
   - grave o SHA-256 dos dois arquivos no status e numa DEC;
   - peça ao humano o commit com a tag **`trava-modelo`** (e a do portão) e a **âncora externa** (`AGENTS.md` §5): mensagem ao revisor com `git rev-parse trava-modelo` e os dois hashes, ou `git push origin trava-modelo` se o remoto passou no teste de proteção de tags do G0. Tag só local não basta;
   - a partir daqui, a 06 grava em `modelos_regerado/`, e o congelado nunca é regravado.

### V — Verificar
- O modelo supera o baseline **na validação** pela margem do critério?
- Se há dependência no dado, compare a validação correta com um KFold aleatório. A diferença mede o otimismo que você evitou.
- Algum passo tocou a confirmação? Não pode ter tocado.
- Rode o checklist do portão (§10 da ficha).

### D — Decidir: portão G6
Peça `Aprovo G6` e, depois da âncora, acrescente a DEC `âncora` com o SHA que o remoto devolve para `trava-modelo`, ou com o que o humano colar da mensagem. O modelo congelado segue para a avaliação única na etapa 07.

## Armadilhas

| Armadilha | Salvaguarda |
|---|---|
| Vazamento: variável do futuro ou alvo disfarçado | auditoria variável a variável |
| KFold aleatório com dependência temporal, espacial ou de entidade | validação que respeita a dependência + medida do otimismo |
| Escolher ou ajustar o modelo olhando a confirmação | a confirmação só abre na 07, com o modelo já congelado |
| Acurácia em classe desbalanceada | métrica ligada ao custo do erro (PR-AUC, recall em especificidade fixa, Brier) + calibração |
| "A AUC se manteve em outra população, então está tudo bem" | a ordenação costuma transferir; o **nível** não. Calibração é métrica de primeira classe quando muda a população ou o tempo |
| Modelo complexo sem ganho real sobre o baseline | critério de sucesso contra o baseline |
| "A variável mais importante causa o desfecho" | importância é associação; aviso na ficha |
| Reportar só o melhor de 40 modelos | tabela com todos, no placar |

## Prompts prontos

```text
Antes de qualquer modelo, rode e reporte os baselines do plano de modelagem,
com o esquema de validação registrado, usando só dados/processados/exploracao.*.
Depois proponha no máximo 3 candidatos, do mais simples ao mais complexo,
justificando cada um.
```

```text
Audite cada variável de entrada: ela existiria no momento em que a previsão
seria feita? Classifique como ok, suspeita ou vazamento e justifique.
Remova as de vazamento e mostre o impacto na métrica de validação.
```

## Volte para trás quando

- O plano de modelagem se mostra inadequado → **05**, como desvio registrado antes de abrir a confirmação.
- O vazamento exige refazer a preparação → **04** (a partição não muda: atribuição fixa por ID).
