# Guia de testes estatísticos

> Usado na etapa 05, para escolher o que vai ao registro, e na 07, para executar. A escolha, o plano B e o gatilho dele são definidos **antes** de ver o resultado no conjunto de confirmação. Fontes completas em `pesquisa/02-analise-rigor-comunicacao.md`.

## 1. Cinco perguntas antes de escolher

1. **Qual é o tipo de pergunta?** (brief §3) Inferencial pede estimativa com IC; preditiva pede validação de modelo (etapa 06); causal pede desenho, não só teste.
2. **Qual é o estimando?** A quantidade que responde à pergunta: diferença de médias, diferença de proporções em p.p., razão de chances, coeficiente ajustado.
3. **Qual é o desfecho, e o desenho?** Numérico, binário, categórico, contagem, tempo até evento; grupos independentes ou pareados.
4. **As observações são independentes?** Mesmo cliente em várias linhas, vizinhos, série temporal ou amostra complexa: se não forem, o teste "comum" subestima a incerteza. Use erro-padrão agrupado, modelo misto, reamostragem por bloco ou estimador de desenho.
5. **Qual é o efeito mínimo relevante (m), e qual o efeito plausível (δ)?** Os dois vêm do brief: m do dono, δ do dono ou da literatura. Sem m não há como ler o resultado; sem δ não há como calcular o poder. **Teste bilateral por padrão**; unilateral só com o bilateral também registrado.

## 2. Tabela de escolha

**Padrão robusto:** Welch para médias (sem pré-testar variâncias) e bootstrap para IC de estatísticas sem fórmula simples. Teste não paramétrico só com o **estimando dele** declarado.

| Objetivo | Desfecho | Desenho | Teste principal | Plano B (com gatilho registrado) | Estimando e tamanho de efeito | Python |
|---|---|---|---|---|---|---|
| Comparar com valor de referência | numérico | 1 amostra | t de uma amostra | Wilcoxon de postos sinalizados (estimando: pseudomediana) · bootstrap | diferença com IC · d | `scipy.stats.ttest_1samp` · `wilcoxon` |
| Comparar 2 grupos | numérico | independentes | **t de Welch** | Mann-Whitney: testa **P(X > Y)**, não medianas; estimando = probabilidade de superioridade ou Hodges-Lehmann · permutação | diferença de médias com IC · g de Hedges | `ttest_ind(equal_var=False)` · `mannwhitneyu` · `permutation_test` |
| Antes × depois | numérico | pareado | t pareado | Wilcoxon de postos sinalizados | diferença média com IC · d<sub>z</sub> | `ttest_rel` · `wilcoxon` |
| Comparar 3+ grupos | numérico | independentes | **ANOVA de Welch** (F de Welch) | Kruskal-Wallis (estimando: dominância estocástica) | ω² · contrastes com IC | `pingouin.welch_anova` · `kruskal` |
| 3+ medidas nas mesmas unidades | numérico | repetido | ANOVA de medidas repetidas | Friedman | η² parcial · W de Kendall | `pingouin.rm_anova` · `friedmanchisquare` |
| Comparar 2 proporções | binário | independentes | z para duas proporções | exato de Fisher · bootstrap | **diferença em p.p. com IC** · risco relativo · razão de chances | `proportions_ztest` · `confint_proportions_2indep` |
| Proporção antes × depois | binário | pareado | McNemar | — | razão de chances pareada | `statsmodels…mcnemar` |
| Associação entre 2 categóricas | categórico | tabela | qui-quadrado de independência | Fisher (esperados < 5) | V de Cramér (os limiares dependem do tamanho da tabela) | `chi2_contingency` · `fisher_exact` |
| Relação entre 2 numéricas | numérico | — | Pearson (linear) | Spearman (monotônica) · Kendall | r · ρ, com IC | `pearsonr` · `spearmanr` |
| **Efeito de X em Y ajustado por Z** | numérico | observacional | regressão linear com EP robusto (HC3), covariáveis **fixas no registro** | regressão quantílica · bootstrap | coeficiente com IC | `smf.ols(...).fit(cov_type="HC3")` |
| Idem, desfecho binário | binário | observacional | regressão logística | — | razão de chances com IC · efeito marginal | `smf.logit` |
| Taxa por unidade de exposição | contagem | — | Poisson **com offset** `log(exposição)` | binomial negativa (se houver superdispersão) | razão de taxas | `smf.glm(..., family=sm.families.Poisson(), offset=np.log(exposicao))` |
| Tempo até o evento | tempo (com censura) | — | log-rank · regressão de Cox | — | hazard ratio | `lifelines` |
| Experimento A/B | binário ou numérico | aleatorizado | z de proporções · Welch | permutação | diferença absoluta com IC | — |

`smf` = `statsmodels.formula.api` · `sm` = `statsmodels.api` · funções sem prefixo vêm de `scipy.stats`. `pingouin` é opcional.

**Três ou mais grupos:** registre os **contrastes** de interesse (ex.: Games-Howell depois de Welch; Dunn depois de Kruskal-Wallis) **dentro da família** da correção. Contraste escolhido depois de ver as médias é exploratório.

## 3. Pressupostos, sem cair no *forking path*

| Pressuposto | Como tratar | Observação |
|---|---|---|
| Independência | pelo **desenho**, não por teste | se violada, troque o estimador (EP agrupado, modelo misto, bloco) |
| Variâncias iguais | **não pré-teste**: use Welch por padrão | pré-testar e escolher o teste pelo resultado distorce as taxas de erro (Zimmerman, 2004) |
| Normalidade | com *n* moderado ou grande, a média é aproximadamente normal; Welch é robusto | teste de normalidade com *n* grande rejeita tudo: não decida por ele |
| Assimetria forte com *n* pequeno | **gatilho objetivo registrado** (ex.: "*n* por grupo < 30 **e** assimetria absoluta > 1 na exploração") → plano B | o gatilho é medido na **exploração** e escrito antes |
| Frequência esperada < 5 (qui-quadrado) | Fisher | |
| Bootstrap com *n* pequeno | prefira BCa ou *studentized*; o percentil simples cobre pouco | Hesterberg (2015) |

## 4. Correção de multiplicidade

Rodar 20 testes a α = 0,05 sem efeito real produz, em média, 1 falso positivo. Com poucos graus de liberdade do pesquisador (dois desfechos, *n* flexível, uma covariável, descartar uma condição), a taxa de falso positivo chegou a 61% em simulação (Simmons et al., 2011).

| Método | Controla | Quando usar | Python |
|---|---|---|---|
| **Holm** *(padrão do kit)* | erro familiar (FWER) | hipóteses confirmatórias; um falso positivo é caro. Domina Bonferroni: é sempre ao menos tão poderoso | `multipletests(p, method="holm")` |
| Benjamini–Hochberg | taxa de descoberta falsa (FDR) | **só em família declarada como triagem**, com muitas hipóteses e validação posterior | `method="fdr_bh"` |
| Benjamini–Yekutieli | FDR sob dependência arbitrária | triagem com testes fortemente dependentes | `method="fdr_by"` |

`multipletests` vem de `statsmodels.stats.multitest`.

- **Família** = hipóteses que sustentam a **mesma decisão**. Família de 1 exige justificativa, aprovada no G5.
- **Segundo ciclo:** se o G5 do ciclo 1 **reservar α** para um eventual ciclo 2, então α' = α/2 **substitui α em tudo**, nos dois ciclos: na regra de decisão (p ajustado < α'), no poder (α'/k) e no IC (1 − α'/k), com Holm dentro de cada ciclo. O ciclo 1 não é recalculado. Sem reserva, um ciclo 2 é exploratório (E0).
- **IC coerente com a correção:** reporte o IC no nível 1 − α/k (conservador) ou rotule como **"IC não ajustado"**. Senão aparece um IC que exclui zero ao lado de um p ajustado "inconclusivo".

## 5. Efeito, intervalo e o poder **da regra**

- **Reporte sempre** a estimativa, o IC e o p exato (p = 0,031). "Estatisticamente significativo" sozinho não é veredito: a diferença entre "significativo" e "não significativo" não é, ela mesma, significativa (Gelman & Stern, 2006).
- **Efeito mínimo relevante (m):** declarado pelo dono no brief ("abaixo de 1 p.p., não vale mudar o preço"). As convenções de Cohen (d = 0,2 / 0,5 / 0,8) são último recurso e "made subjectively", nas palavras dele.
- **Não use o poder convencional como chance de confirmar.** A regra do kit confirma quando p ajustado < α **e** a estimativa passa de m. Se o efeito verdadeiro for exatamente m, a estimativa fica abaixo de m em cerca de metade das vezes, **qualquer que seja o *n***. Por isso o poder que importa é o **da regra**: a probabilidade de ela declarar "confirmada" se o efeito verdadeiro for o **δ plausível declarado no brief**, maior que m. **Nunca use a estimativa da exploração como δ**: ela foi escolhida justamente por parecer grande, e isso a infla (maldição do vencedor). Esse poder se calcula por simulação, com α/k (pior caso de Holm; k = hipóteses na família; com reserva de α, α'/k) e o *n* efetivo = *n* / DEFF, em que DEFF é o efeito de desenho (1 em amostra simples; maior em amostra complexa ou agrupada). Na simulação do kit, com δ = m, a regra confirma cerca de 50% das vezes, com *n* de 5.000 por grupo no desfecho numérico e de 40.000 por grupo no binário.
- **Poder pós-teste** (calculado depois de um nulo, para "explicá-lo") é um procedimento falho (Hoenig & Heisey, 2001).

```python
# Poder da regra de decisão por simulação: 2 grupos, desfecho numérico, Welch
import numpy as np
from scipy import stats

def poder_da_regra(delta, m, dp, n1, n2, alfa=0.05, n_hip=1, deff=1.0, sims=5000, semente=42):
    """P(regra declara 'confirmada') se o efeito verdadeiro for delta (> m)."""
    rng = np.random.default_rng(semente)
    n1, n2 = int(n1 / deff), int(n2 / deff)          # n efetivo = n / efeito de desenho (1 = amostra simples)
    alfa_holm = alfa / n_hip                          # pior caso de Holm
    confirma = 0
    for _ in range(sims):
        a = rng.normal(0, dp, n1)
        b = rng.normal(delta, dp, n2)
        t, p = stats.ttest_ind(b, a, equal_var=False)
        est = b.mean() - a.mean()
        if p < alfa_holm and est >= m:                # sinal esperado positivo
            confirma += 1
    return confirma / sims

# Variante: desfecho binário, diferença de proporções (0,03 = 3 p.p.), z para duas proporções
def poder_da_regra_prop(p0, delta, m, n1, n2, alfa=0.05, n_hip=1, deff=1.0, sims=20000, semente=42):
    """P(regra declara 'confirmada') se a diferença verdadeira for delta (> m); p0 = proporção do grupo de referência."""
    rng = np.random.default_rng(semente)
    n1, n2 = int(n1 / deff), int(n2 / deff)
    p1 = rng.binomial(n1, p0, sims) / n1
    p2 = rng.binomial(n2, p0 + delta, sims) / n2
    pc = (p1 * n1 + p2 * n2) / (n1 + n2)              # proporção combinada sob H0, como em proportions_ztest
    ep = np.sqrt(pc * (1 - pc) * (1 / n1 + 1 / n2))
    z = np.divide(p2 - p1, ep, out=np.zeros(sims), where=ep > 0)
    p = 2 * stats.norm.sf(np.abs(z))                  # bilateral
    return float(np.mean((p < alfa / n_hip) & (p2 - p1 >= m)))

# Com reserva de α para um 2º ciclo, passe alfa = α' = α/2.
# ex.: m = 2 e δ = 3 (declarados no brief), dp = 8 (perfil da 02), 3 hipóteses na família
print(poder_da_regra(delta=3, m=2, dp=8, n1=600, n2=600, n_hip=3))   # ≈ 0,98
print(poder_da_regra(delta=2, m=2, dp=8, n1=5000, n2=5000, n_hip=3)) # ≈ 0,50: com δ = m, o teto é ~50%
# ex.: cancelamento de 10% no grupo A, m = 2 p.p. e δ = 3 p.p., 4.000 por grupo, 3 hipóteses
print(poder_da_regra_prop(p0=0.10, delta=0.03, m=0.02, n1=4000, n2=4000, n_hip=3))          # ≈ 0,92
print(poder_da_regra_prop(p0=0.10, delta=0.03, m=0.02, n1=4000, n2=4000, n_hip=3, deff=2))  # ≈ 0,73: amostra complexa, DEFF = 2
print(poder_da_regra_prop(p0=0.10, delta=0.02, m=0.02, n1=40000, n2=40000, n_hip=3))        # ≈ 0,50: δ = m
```

O DEFF vem da documentação da pesquisa (amostra complexa) ou, em dado agrupado, de 1 + (tamanho médio do grupo − 1) × correlação intraclasse, medida na exploração.

## 6. Refutar = mostrar equivalência

Na regra do kit, **refutada** = IC inteiro dentro de (−m; +m): o efeito, se existe, é menor que o relevante. É a lógica do teste de equivalência (TOST; Lakens, Scheel & Isager, 2018). "Não significativo" **não** quer dizer "sem efeito". Só a equivalência sustenta "não muda a decisão".

## 7. O que dizer de um p (ASA, 2016)

1. p indica o grau de incompatibilidade entre os dados e um modelo especificado.
2. p **não** é a probabilidade de a hipótese ser verdadeira, nem a de o acaso sozinho ter gerado os dados.
3. Decisões não devem depender só de p cruzar um limiar.
4. Inferência exige relato completo e transparência.
5. p não mede tamanho nem importância do efeito.
6. p isolado não é boa medida de evidência.

O kit usa um limiar porque **há uma decisão a tomar** e ele foi fixado antes (posição da ASA Task Force, 2021). No relatório, porém, o que se comunica é a estimativa, o IC e o p contínuo.

## 8. Dados amostrais complexos

Pesquisa com peso, estrato e conglomerado (PNAD Contínua, Vigitel, BRFSS…) **não é amostra aleatória simples**. Ignorar o desenho produz prevalência enviesada (sem peso) e IC estreito demais (sem o efeito de desenho). Use estimadores de desenho, como o pacote `survey` do R, `samplics` em Python ou o `svy` do Stata, com as variáveis de peso, estrato e UPA da documentação.

## 9. Antes de dizer "causa"

- [ ] Houve aleatorização? Se não, o padrão é o rótulo "associação".
- [ ] DAG explícito: confundidores, mediadores, colisores. Ajuste que fecha os caminhos de porta dos fundos **sem** condicionar em mediador ou colisor.
- [ ] Temporalidade: a causa vem antes do efeito.
- [ ] Paradoxo de Simpson: o efeito se inverte ao desagregar? (Caso clássico: as admissões de Berkeley, Bickel et al., 1975.)
- [ ] Sensibilidade a confundidor não medido (ex.: E-value).

Em desenho observacional, o verbo é **condicional** e exige E2 ou mais (`AGENTS.md` §8).

## 10. Como pedir à IA

```text
Para a hipótese H03 (desfecho binário, 2 grupos independentes, n ≈ 4.000 por
grupo na confirmação), proponha pelo guia: estimando, teste principal, plano B
com gatilho objetivo e o estimando do plano B, tamanho de efeito a reportar,
família e correção. Use o efeito mínimo do brief (m = 2 p.p., declarado pelo
dono) e calcule por simulação o poder DA REGRA para δ = 3 p.p. Mostre o código;
não rode nada no conjunto de confirmação.
```
