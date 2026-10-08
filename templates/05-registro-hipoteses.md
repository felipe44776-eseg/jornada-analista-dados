# 05 · Registro de hipóteses (pré-registro)

> **Etapa 05 · Pré-registro** · Data: AAAA-MM-DD · Responsável: ___ · IA: ___ · Status: `rascunho`
>
> **Travamento (no G5; no modo essencial, na pausa ao fim da 05; sem partição, no G4):** este arquivo é copiado para `05-registro-hipoteses.travado.md` (somente leitura). O SHA-256 da cópia, com fim de linha normalizado para LF, vai **só** para `00-status.md`, para uma DEC e para fora do projeto: tag `trava-registro` enviada ao remoto, ou mensagem do humano ao revisor com o `git rev-parse` da tag e o hash. **Nunca escreva o hash neste arquivo.**
> Depois do travamento, nada aqui muda. Status das hipóteses, desvios e resultados ficam em `07-resultados-testes.md`.
> **Sem partição:** este registro é travado no **G4**, antes de qualquer exploração, só com as hipóteses a priori.

## 1. Configuração global

| Campo | Valor |
|---|---|
| Base dos testes | `confirmacao.*`, guardada no cofre até a etapa 07 (hash de conteúdo em `resultados/04_particao.json`) |
| Nível de significância (α) | *padrão 0,05* |
| Famílias de hipóteses | *família = hipóteses que sustentam a **mesma decisão**. Família de 1 exige justificativa, aprovada no G5* |
| Correção de multiplicidade | **Holm** (padrão) · Benjamini–Hochberg só em família declarada como **triagem** · BY sob dependência arbitrária |
| Nível do IC reportado | 1 − α/k (coerente com a correção) · ou 95% **rotulado "IC não ajustado"** |
| Reserva de α para um 2º ciclo | não (um eventual ciclo 2 será exploratório, E0) · sim: α' = α/2 **substitui α em tudo** neste registro e no do ciclo 2: na regra de decisão (p ajustado < α'), no poder (α'/k) e no IC (1 − α'/k) |
| Software e versões | |

## 2. Hipóteses *(repita o bloco)*

### H01 — *enunciado em linguagem comum*

| Campo | Valor |
|---|---|
| Origem | a priori (HP__, origem: dono · área · literatura) · análise anterior · exploração (O__, V__) |
| Estimando | *a quantidade que responde à pergunta, ex.: "diferença de proporções de cancelamento B − A, em p.p."* |
| H0 | |
| H1 e sinal esperado | *ex.: "B − A > 0"; o teste pode ser bilateral mesmo com sinal esperado* |
| Teste | **bilateral** (padrão) · unilateral (justificar; exige **também** o bilateral registrado, para que um efeito contrário relevante apareça como "contrária") |
| Desfecho (variável, unidade) | |
| Preditora / grupos | |
| Covariáveis de ajuste | *fixas aqui; não mudam depois* |
| População, filtros, exclusões | |
| Teste principal | *ver `referencias/guia-testes-estatisticos.md`; padrão robusto: Welch / bootstrap* |
| Pressupostos | |
| Plano B e **gatilho objetivo** | *ex.: "se n por grupo < 30 **e** assimetria absoluta > 1 na exploração → teste X". Preferir **Hodges-Lehmann**, que fica na mesma unidade de m; outra escala só por conversão registrada `[derivado de m]`* |
| **Efeito mínimo relevante (m)** | *do brief: `[declarado: dono, data]`, em módulo, sem revisão para ganhar poder. Hipótese nascida da exploração: o dono declara m **sem ver** a estimativa exploratória daquela relação* |
| **Efeito plausível (δ)** | *do brief: `[declarado: dono ou literatura, data]`, maior que m. **Nunca** a estimativa da exploração (inflada pela seleção)* |
| Poder da regra | *probabilidade de a regra abaixo declarar "confirmada" se o efeito verdadeiro for δ, por simulação, com α/k (pior caso de Holm; k = hipóteses na família; com reserva, α'/k) e n efetivo = n / DEFF [→ resultados/05_poder.json]* |
| **Regra de decisão** *(com reserva, α' no lugar de α)* | **confirmada**: p ajustado < α, sinal de H1 e \|estimativa\| ≥ m · **contrária**: p ajustado < α, sinal oposto e \|estimativa\| ≥ m (reportada como achado) · **refutada**: IC inteiro dentro de (−m; +m), ou seja, equivalência; se unilateral, IC abaixo de +m e sem efeito contrário relevante · **inconclusiva**: todos os demais casos |
| Se confirmada → | *(implicação para a decisão)* |
| Se contrária → | |
| Se refutada → | |
| Se inconclusiva → | |

## 3. Sensibilidades registradas (multiverso planejado)

Rodadas na etapa 08 para **todos** os candidatos: confirmadas, contrárias e refutadas. Definidas aqui, antes de ver resultado confirmatório. No modo essencial, só S1 e S3.

| ID | Variação | Por quê |
|---|---|---|
| S1 | com e sem outliers sinalizados (R__) | |
| S2 | janela temporal alternativa | |
| S3 | especificação alternativa (covariáveis, métrica) | |
| S4 | por subgrupo (checar paradoxo de Simpson e composição) | |
| S5 | reamostragem (bootstrap por bloco ou por entidade, se a partição for agrupada ou temporal) | |

**Critérios:**

| Candidato | Mantém | Enfraquece | Inverte |
|---|---|---|---|
| confirmada ou contrária | mesmo sinal e IC excluindo zero em todas as variações, e \|estimativa\| ≥ m na especificação principal | mesmo sinal, mas IC cruzando zero em alguma variação | sinal oposto com IC que exclui zero |
| refutada | IC dentro de (−m; +m) em todas as variações | IC ultrapassa ±m em alguma | — |

**Subgrupos (S4):** avaliados por **teste de interação** registrado aqui, ou só os subgrupos com *n* ≥ N_mín = ___, fixado agora. A heterogeneidade é reportada, mas não derruba o achado fora desse critério.

## 4. Triangulação de efeito (caminho para E3)

Para cada hipótese que se pretende levar a E3: uma fonte externa **independente** (outro processo gerador de dados) que meça o **mesmo efeito ou relação**.

| Hipótese | Fonte (F__) | Estimando comparável | Tolerância | Observações |
|---|---|---|---|---|
| H__ | | | *2 × √(EP_interno² + EP_externo²) + margem substantiva `[declarada: dono]`* | |

Comparações de **nível** (a base se parece com a realidade?) estão no plano da etapa 03. Elas validam a base, mas **não** levam a E3.

## 5. Plano de modelagem *(só se a pergunta for preditiva)*

| Campo | Valor |
|---|---|
| Alvo | |
| Métrica principal e por quê | *ligada ao custo do erro na decisão* |
| Métricas secundárias | *inclua calibração, se o modelo prevê probabilidade* |
| Baseline(s) | *regra simples, média ou classe majoritária, modelo linear* |
| Validação na exploração | *CV agrupada, temporal ou espacial (justificar pelo dado)* |
| Critério de sucesso | *ex.: superar o baseline em ≥ X na métrica principal, na avaliação única* |
| Avaliação final | **uma única vez** no conjunto de confirmação (etapa 07), com IC por bootstrap **por bloco ou por entidade** se a partição for agrupada ou temporal |
| Sensibilidades do modelo (caminho para E2) | *ex.: desempenho por período e por subgrupo com n ≥ N_mín; limite de queda aceitável: ___* |
| Validação externa (caminho para E3) | *base independente, métrica e tolerância, ou "não prevista" (teto E2)* |

Estimar **efeito ajustado** por regressão não é modelagem: registre-o como hipótese no §2.
**Modo essencial:** trave este registro (cópia, hash, tag `trava-registro`, âncora) **ao fim da 05, antes de começar a 06**.

## 6. Checagens de integridade (rodam na 07 para todas as hipóteses)

| Checagem | Regra | Se falhar |
|---|---|---|
| contagem de linhas da confirmação | igual à registrada na partição | **parar** e registrar incidente |
| hash de conteúdo da confirmação | igual ao de `resultados/04_particao.json` | **parar** e registrar incidente |
| nulos nas variáveis das hipóteses | taxa até ___ | pendência; não reanalisar |
| distribuição das covariáveis | compatível com a exploração (teste descritivo) | pendência |

## Checklist do registro (parte do G5)

- [ ] Toda hipótese com estimando, H0/H1 e sinal, teste, pressupostos e plano B com gatilho objetivo
- [ ] Efeito mínimo (m) e efeito plausível (δ) declarados, nunca estimados da exploração; poder da regra calculado com δ
- [ ] Teste bilateral por padrão; unilateral só com o bilateral também registrado
- [ ] Reserva de α para um 2º ciclo decidida
- [ ] Famílias definidas; correção escolhida (Holm, salvo triagem declarada); nível do IC coerente
- [ ] Regra de decisão com os quatro resultados e as implicações de cada um
- [ ] Sensibilidades, triangulação de efeito e checagens de integridade registradas
- [ ] Plano de modelagem completo, se a pergunta é preditiva
- [ ] Cópia `.travado.md` criada e somente leitura; SHA-256 no status e no log; tag `trava-registro` ancorada fora (remoto, ou mensagem ao revisor com o `git rev-parse` da tag e o hash); DEC `âncora` registrada
