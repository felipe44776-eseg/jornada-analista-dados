# Pesquisa 2: fluxo do analista, rigor inferencial, qualidade/reprodutibilidade e comunicação

**Para que serve:** dar base factual e citável a um fluxo único de análise de dados assistida por IA (arquivos `.md` que uma IA segue), do problema às apresentações técnica e executiva, para uma turma de Data Science (ESEG).
**Verificado em:** 2026-09-23.
**Escopo (ajustado pelo coordenador):** o corpo prioriza A, B e D; C fica curto. No fecho entram só (c), o checklist de rigor, e (e), a tabela deck técnico × executivo. CRISP-DM, KDD, SEMMA, TDSP, ASUM e CRISP-ML ficam com outro pesquisador.

**Legenda de verificação**
- **[V]**: abri a fonte nesta pesquisa e conferi o trecho.
- **[S]**: conteúdo conferido só em fonte secundária aberta (indicada).
- **[M]**: conferi só os metadados bibliográficos (Crossref, Europe PMC, Semantic Scholar ou catálogo). O texto não foi aberto.
- **[NV]**: não verificado.

Citações literais ficam em inglês, entre aspas; as traduções são livres. Nos PDFs, conferi as citações no texto extraído. Nas páginas HTML, as citações vieram da extração do WebFetch, então pode haver pequena variação de pontuação.

---

## 0. Síntese para o desenho do fluxo `.md`

1. **Tipar a pergunta antes de tocar no dado.** Leek & Peng (2015): o erro mais frequente em análise de dados é confundir o tipo de pergunta. O PPDAC já exigia isso no "Problem aspect" (causative, descriptive, predictive).
2. **Declarar expectativas antes de olhar o dado,** usando o epiciclo de Peng & Matsui. É o antídoto operacional contra HARKing e contra o garden of forking paths.
3. **Separar fisicamente exploração e confirmação:** holdout selado e plano de análise registrado antes de abri-lo (Nosek et al. 2018; Wagenmakers et al. 2012). Um holdout reusado de forma adaptativa acaba sofrendo overfitting ele mesmo (Dwork et al. 2015).
4. **Reportar estimativa, intervalo e tamanho de efeito, com p contínuo.** "Estatisticamente significativo" não serve de veredito (ASA 2016; Wasserstein et al. 2019). Registrar que o editorial de 2019 não é política oficial da ASA (Task Force, 2021).
5. **Declarar a multiplicidade:** família de testes definida a priori, Holm para FWER e BH para FDR.
6. **Testar robustez** com multiverso ou specification curve sempre que houver decisões arbitrárias de processamento ou de especificação.
7. **Comunicar com estrutura:**
   - BLUF e pirâmide/SCQ no deck executivo;
   - títulos-asserção (assertion–evidence, action titles) nos dois decks;
   - ghost deck/storyboard antes da análise final, reescrito depois do resultado;
   - detalhe metodológico no apêndice.
8. **Cuidar de integridade e acessibilidade gráfica:** lie factor ≈ 1, barras a partir de zero, paleta Okabe–Ito ou viridis, contraste WCAG.

---

## A. Frameworks do fluxo do analista

### A1. OSEMN (Mason & Wiggins, 2010)

- **Autoria e ano:** Hilary Mason e Chris Wiggins, post "A Taxonomy of Data Science" no blog *dataists*, setembro de 2010.
- **Etapas:**
  - Obtain (obter);
  - Scrub (limpar/sanear);
  - Explore (explorar);
  - Model (modelar);
  - iNterpret (interpretar).
- **O que é distintivo:**
  - É uma taxonomia das tarefas do cientista de dados, não uma metodologia de projeto.
  - Enfatiza automação e escala.
  - A secundária reproduz epígrafes do post: "pointing and clicking does not scale", "the world is a messy place", "you can see a lot by looking" e "The purpose of computing is insight, not numbers" **[S datascience-pm.com]**. Não conferi a qual etapa cada epígrafe se refere.
- **Críticas usuais:** não cobre a pergunta de negócio nem o deployment, e o fluxo é linear **[S]**.
- **Fontes:**
  - Primária: http://www.dataists.com/2010/09/a-taxonomy-of-data-science/, **[NV]**. Em 2026-09-23 deu erro de certificado; por leitor proxy deu 404; o Wayback está bloqueado para a ferramenta.
  - Secundárias: https://planspace.org/20150220-data_science_isnt_magic/osemn/ **[S]** e https://www.datascience-pm.com/osemn/ **[S]**.

### A2. PPDAC (MacKay & Oldford; Wild & Pfannkuch, 1999)

**Autoria e ano**
- R. J. MacKay e R. W. Oldford. A origem está nas notas do curso Stat 231 da Universidade de Waterloo (1994), citadas por Wild & Pfannkuch como "MacKay, R.J. & Oldford, W. (1994). Stat 231 Course Notes" **[V]**.
- Formalização: "Scientific Method, Statistical Method and the Speed of Light", *Statistical Science* 15(3), 2000, DOI 10.1214/ss/1009212817 **[M]**. As páginas 254–278 vêm do índice de busca. Abri o working paper 2000-02 **[V]**.

**Etapas e subelementos** (Figure 8, "The statistical method") **[V]**

| Etapa | Subelementos (original) |
|---|---|
| **Problem** (problema) | Units & Target Population (Process); Response Variate(s); Explanatory Variates; Population Attribute(s); Problem Aspect(s): causative, descriptive, predictive |
| **Plan** (plano) | Study Population (Units, Variates, Attributes); selecting the response variate(s); dealing with explanatory variates; Sampling Protocol; Measuring processes; Data Collection Protocol |
| **Data** (dados) | Execute the Plan and record all departures; Data Monitoring; Data Examination for internal consistency; Data storage |
| **Analysis** (análise) | Data Summary (numerical and graphical); Model construction (build, fit, criticize cycle); Formal analysis |
| **Conclusions** (conclusões) | Synthesis (plain language, effective presentation graphics); Limitations of study (discussion of potential errors) |

**O que é distintivo**
- O desenho vem antes do dado, e cada etapa se legitima pelas anteriores: "there is little value in a Plan that does not address the Problem" **[V]**.
- O "Problem aspect" (causal, descritivo ou preditivo) antecipa a tipologia de Leek & Peng (A7).
- Os autores registram que Tukey nomeia um método de cinco estágios ("Question, Design, Collection, Analysis Answer") como adequado ao confirmatório, não ao exploratório. Eles encaixam a EDA dentro da etapa Data (monitoring e examination): "These tasks amount to carrying out a small PPDAC investigation" **[V]**.

**Wild & Pfannkuch (1999)**, "Statistical Thinking in Empirical Enquiry", *International Statistical Review* 67(3):223–265 (com discussão; o Crossref registra 223–248 para o artigo) **[V PDF + M]**
- Quadro em quatro dimensões **[V]**:
  1. investigative cycle (o PPDAC adaptado);
  2. types of thinking;
  3. interrogative cycle (Generate, Seek, Interpret, Criticise, Judge);
  4. dispositions (scepticism, imagination, curiosity and awareness, openness, a propensity to seek deeper meaning, being logical, engagement, perseverance).
- Citações **[V]**: "A PPDAC cycle is concerned with abstracting and solving a statistical problem grounded in a larger 'real' problem." e "A PPDAC investigative cycle is set off to achieve each learning goal."
- Subitens da Fig. 1(a) **[V, com OCR parcialmente corrompido]**:
  - Problem: grasping system dynamics, defining problem;
  - Plan: planning (measurement system, "sampling design", data management, piloting & analysis);
  - Data: data collection, data management, data cleaning;
  - Analysis: data exploration, planned analyses, unplanned analyses, hypothesis generation;
  - Conclusions: interpretation, conclusions, new ideas, communication.
- "Transnumeration" é definida como "numeracy transformations made to facilitate understanding" **[V]**.

**URLs:** https://sas.uwaterloo.ca/~rwoldfor/papers/sci-method/paperrev.pdf **[V]**; https://www.stat.auckland.ac.nz/~iase/publications/isr/99.Wild.Pfannkuch.pdf **[V]**

### A3. Peng & Matsui, *The Art of Data Science*: as 5 atividades e o epiciclo

- **Autoria e ano:** Roger D. Peng e Elizabeth Matsui, Leanpub. O ano de 2015 vem do índice de busca; a página da Leanpub não mostra data **[V página; ano S]**.
- **5 atividades centrais [V]:**
  1. "Stating and refining the question" (formular e refinar a pergunta);
  2. "Exploring the data" (explorar os dados);
  3. "Building formal statistical models" (construir modelos estatísticos formais);
  4. "Interpreting the results" (interpretar os resultados);
  5. "Communicating the results" (comunicar os resultados).
- **Epiciclo [V]:**
  1. "Setting Expectations";
  2. "Collecting information (data), comparing the data to your expectations, and if the expectations don't match,";
  3. "Revising your expectations or fixing the data so your data and your expectations match."
  - "Iterating through this 3-step process is what we call the 'epicycle of data analysis.'"
- **O que é distintivo:** exige expectativa explícita antes do dado em cada uma das 5 atividades, e os ciclos são aninhados (epiciclos sobre o ciclo maior).
- **Uso no `.md`:** cada etapa abre com um bloco "Expectativa" e fecha com "Comparação e revisão".
- **URLs:** https://bookdown.org/rdpeng/artofdatascience/epicycle-of-analysis.html **[V]**; https://leanpub.com/artofdatascience **[V]**

### A4. Wickham, Çetinkaya-Rundel & Grolemund, *R for Data Science* (2ª ed.)

- **Edição:** O'Reilly, 2023 (ISBN 9781492097402, via busca **[S]**). Versão online gratuita sob "CC BY-NC-ND 3.0" **[V]**.
- **Modelo [V]:** Import → Tidy → laço "Understand" (Transform ↔ Visualize ↔ Model) → Communicate, com Program envolvendo tudo.
  - "Together, tidying and transforming are called **wrangling**…"
  - "Surrounding all these tools is **programming**. Programming is a cross-cutting tool that you use in nearly every part of a data science project."
- **Em pt-BR:** importar, arrumar (tidy), transformar, visualizar, modelar, comunicar, programar.
- **O que é distintivo:** é centrado em ferramentas; tidy data é pré-condição; entender é um laço iterativo, não uma etapa.
- **URL:** https://r4ds.hadley.nz/intro **[V]**

### A5. Harvard CS109, "The Data Science Process" (Blitzstein & Pfister)

- **Fonte primária [V]:** slide 39 da aula 01-Introduction da CS109 2015 (Hanspeter Pfister, Joe Blitzstein, Verena Kaynig).

| Etapa (original) | pt-BR | Perguntas-guia (original) |
|---|---|---|
| **Ask** an interesting question | perguntar | What is the scientific goal? What would you do if you had all the data? What do you want to predict or estimate? |
| **Get** the data | obter | How were the data sampled? Which data are relevant? Are there privacy issues? |
| **Explore** the data | explorar | Plot the data. Are there anomalies? Are there patterns? |
| **Model** the data | modelar | Build a model. Fit the model. Validate the model. |
| **Communicate** and **visualize** the results | comunicar e visualizar | What did we learn? Do the results make sense? Can we tell a story? |

- **O que é distintivo:**
  - Traz perguntas-guia por etapa, um checklist embutido.
  - O diagrama tem setas de retorno entre todas as etapas e de "Communicate" de volta a "Ask", ou seja, iteração explícita **[V, leitura do diagrama]**.
  - Amostragem e privacidade já aparecem em "Get".
- **URLs:** https://github.com/cs109/2015/raw/master/Lectures/01-Introduction.pdf **[V]**. A atribuição a Blitzstein & Pfister também aparece em Piatetsky-Shapiro (2016): https://www.linkedin.com/pulse/data-science-process-rediscovered-gregory-piatetsky-shapiro **[V]** (a versão no KDnuggets deu 403).

### A6. Google Data Analytics Certificate: Ask, Prepare, Process, Analyze, Share, Act

- **Fases:** Perguntar, Preparar, Processar, Analisar, Compartilhar, Agir.
- **Texto do curso Google** "Introducing Data Analytics and Analytical Thinking": "Explain the data analysis process, making specific reference to the ask, prepare, process, analyze, share, and act phases" **[V]**.
- **Estrutura atual do certificado** (Coursera, acesso em 2026-09-23), 9 cursos **[V]**:
  1. Foundations: Data, Data, Everywhere
  2. Ask Questions to Make Data-Driven Decisions
  3. Prepare Data for Exploration
  4. Process Data from Dirty to Clean
  5. Analyze Data to Answer Questions
  6. Share Data Through the Art of Visualization
  7. Introduction to Data Analysis Using Python
  8. Google Data Analytics Capstone: Complete a Case Study
  9. Accelerate Your Job Search with AI
- O curso 2 lista o tópico "SMART questions" e a leitura "From issue to action: The six data analysis phases" **[V]**.
- **O que é distintivo:**
  - Orientado a stakeholder e à decisão.
  - A fase "Act" é explícita: a análise termina em ação, não em relatório.
  - Os cursos mapeiam as fases 1:1.
- **URLs [V]:** https://www.coursera.org/professional-certificates/google-data-analytics; https://www.coursera.org/learn/google-introducing-data-analytics-and-analytical-thinking; https://www.coursera.org/learn/ask-questions-make-decisions

### A7. Leek & Peng (2015), "What is the question?"

**Referência:** *Science* 347(6228):1314–1315, 20/03/2015 (online em 26/02/2015), DOI 10.1126/science.aaa6146 **[V PDF via AAAS + M]**

**Teses [V]**
- "an analysis can be fully reproducible and still be wrong"
- "the most frequent failure in data analysis is mistaking the type of question being considered"

**Os seis tipos [V]**

| Tipo | Definição (trechos do artigo) | Exemplo do artigo |
|---|---|---|
| Descriptive (descritiva) | "summarize the measurements in a single data set without further interpretation" | Censo dos EUA |
| Exploratory (exploratória) | busca "discoveries, trends, correlations, or relationships between the measurements to generate ideas or hypotheses"; "can rarely confirm those discoveries" | planeta Tatooine (Kepler) |
| Inferential (inferencial) | "quantifies whether an observed pattern will likely hold beyond the data set in hand" | poluição × expectativa de vida |
| Predictive (preditiva) | usa "features" para prever o "outcome" "on a single person or unit"; "do not necessarily explain why that choice of prediction works" | FiveThirtyEight |
| Causal | "what happens to one measurement on average if you make another measurement change" | tabagismo e câncer |
| Mechanistic (mecanística) | "changing one measurement always and exclusively leads to a specific, deterministic behavior in another"; fora da engenharia, "extremely challenging and rarely achievable" | desenho de asa e arrasto |

**Fluxograma [V, lido na figura]**
1. "Did you summarize the data?" Se não: *Not a data analysis*.
2. "Did you report the summaries without interpretation?" Se sim: **Descriptive**.
3. "Did you quantify whether your discoveries are likely to hold in a new sample?" Se não: **Exploratory**.
4. "Are you trying to figure out how changing the average of one measurement affects another?"
   - **Se não:** "Are you trying to predict measurement(s) for individuals?" Sim leva a **Predictive**; não, a **Inferential**.
   - **Se sim:** "Is the effect you are looking for an average effect or a deterministic effect?" Average leva a **Causal**; deterministic, a **Mechanistic**.

**Tabela "Common mistakes" [V]**

| Tipo real | Tipo percebido | Frase que descreve o erro |
|---|---|---|
| Inferential | Causal | "Correlation does not imply causation" |
| Exploratory | Inferential | "Data dredging" |
| Exploratory | Predictive | "Overfitting" |
| Descriptive | Inferential | "n of 1 analysis" |

**Casos e regras citados no artigo [V]**
- Exemplos reais: análise inferencial sobre celular e câncer cerebral lida como causal; análise exploratória de buscas no Google sobre gripe lida como preditiva.
- **Causal creep:** acontece quando análises secundárias de um ensaio randomizado recebem o mesmo peso causal da primária.
- Regra: "each step in the analysis should be labeled according to its original intent."

**Complemento:** Hernán, Hsu & Healy (2019), *CHANCE* 32(1):42–49, organizam as tarefas em "Description, prediction, and counterfactual prediction (which includes causal inference)". Análises causais "typically require not only good data and algorithms, but also domain expert knowledge" **[V abstract via Semantic Scholar]**.

**Uso no `.md`:** o arquivo da pergunta força o rótulo do tipo e herda restrições de linguagem. Exemplo: numa pergunta inferencial, o deck não pode usar verbo causal.

### A8. Tukey: EDA (1977) e a distinção exploratório × confirmatório

**Tukey (1977) e Tukey (1980)**
- *Exploratory Data Analysis*, Addison-Wesley, 1977, 688 p. **[V Open Library]**. Frase de abertura, conforme reproduzida pela Open Library: "Exploratory data analysis is detective work — numerical detective work — or counting detective work — or graphical detective work." **[S]**
- "We Need Both Exploratory and Confirmatory", *The American Statistician* 34(1):23–25, 1980 **[M]**.
- Conteúdo de 1980 resumido por MacKay & Oldford (2000) **[V]**: "Tukey characterized analyses as either exploratory or confirmatory. Confirmatory analysis is the assessment of pre-specified questions and is the traditional domain of inferential statistics. Tukey describes exploratory data analysis (EDA) more as an attitude and not as a bundle of techniques."

**NIST/SEMATECH e-Handbook [V]**
- Sequência clássica: Problem ⇒ Data ⇒ Model ⇒ Analysis ⇒ Conclusions.
- Sequência EDA: Problem ⇒ Data ⇒ Analysis ⇒ Model ⇒ Conclusions.
- Objetivos da EDA:
  - maximize insight;
  - uncover underlying structure;
  - extract important variables;
  - detect outliers and anomalies;
  - test underlying assumptions;
  - develop parsimonious models;
  - determine optimal factor settings.

**Motivação didática para "sempre plote"**
- Anscombe (1973), *The American Statistician* 27(1):17–21 **[M]**: quatro conjuntos "which have the same traditional statistical properties (mean, variance, correlation, regression line, etc.), yet are quite different" (documentação do R, `datasets::anscombe`) **[V]**.
- Matejka & Fitzmaurice (CHI 2017), "Same Stats, Different Graphs", o Datasaurus Dozen **[V]**.

**Regra operacional:** o exploratório gera hipóteses; o confirmatório testa hipóteses pré-especificadas em dados que não serviram para gerá-las. Gelman & Loken retomam o ponto: "step back to a sharper distinction between exploratory and confirmatory data analysis (de Groot, 1956, Tukey, 1977)" **[V]**.

**URLs:** https://openlibrary.org/books/OL4877620M/Exploratory_data_analysis **[V]**; https://www.itl.nist.gov/div898/handbook/eda/section1/eda11.htm e …/eda12.htm **[V]**; https://www.research.autodesk.com/publications/same-stats-different-graphs/ **[V]**

### A9. Double Diamond (Design Council): divergir e convergir

**Origem**
- "In 2003, the Design Council was promoting the positive impact of adopting a strategic approach to design … However, they had no standard way of describing the supporting process." A iniciativa foi de Richard Eisermann, então Director of Design and Innovation **[V]**.
- A página do Framework for Innovation diz "Launched in 2004" **[V]**.

**As quatro fases [V]**
- **Discover:** "helps people understand, rather than simply assume, what the problem is".
- **Define:** o insight "can help you to define the challenge in a different way".
- **Develop:** "encourages people to give different answers to the clearly defined problem".
- **Deliver:** "testing out different solutions at small-scale, rejecting those that will not work and improving the ones that will".

**Divergir e convergir:** a ideia vem da forma dos dois losangos (primeiro o espaço do problema, depois o da solução). A página não usa esses termos literalmente **[V]**.

**Framework for Innovation [V]:** quatro princípios ("Put people first"; "Communicate visually and inclusively"; "Collaborate and co-create"; "Iterate, iterate, iterate"), mais methods, leadership e engagement.

**Uso em DS**
- **1º losango:** divergir em perguntas e hipóteses candidatas; convergir na pergunta tipada (A7).
- **2º losango:** divergir em especificações e análises (multiverso, B4); convergir na recomendação.

**URLs [V]:** https://www.designcouncil.org.uk/our-resources/the-double-diamond/; https://www.designcouncil.org.uk/our-resources/framework-for-innovation/

### A10. Mapa de correspondência entre frameworks

Síntese minha, não é fonte.

| Fase do fluxo `.md` | OSEMN | PPDAC | Peng & Matsui | R4DS | CS109 | Google DA | Double Diamond |
|---|---|---|---|---|---|---|---|
| 1. Problema e pergunta tipada | — | Problem | Question | — | Ask | Ask | Discover → Define |
| 2. Plano de dados e de análise | — | Plan | (expectativas) | — | Get (sampling, privacy) | Prepare | Define |
| 3. Obtenção, qualidade, tidy | Obtain, Scrub | Data | — | Import, Tidy | Get | Prepare, Process | — |
| 4. EDA (gera hipóteses) | Explore | Data (examination); Analysis (summary) | Explore | Transform, Visualize | Explore | Analyze | Develop (divergir) |
| 5. Modelo/teste confirmatório | Model | Analysis (model, formal) | Formal models | Model | Model | Analyze | Develop → Deliver |
| 6. Interpretação e limitações | iNterpret | Conclusions (limitations) | Interpret | — | Communicate ("make sense?") | Share | Deliver |
| 7. Comunicação e ação | iNterpret | Conclusions (synthesis) | Communicate | Communicate | Communicate | Share, Act | Deliver |

Elementos transversais a todas as fases:
- Program (R4DS);
- epiciclo em toda fase (Peng & Matsui);
- ciclo interrogativo Generate → Judge (Wild & Pfannkuch);
- iteração explícita (setas do CS109).

---

## B. Rigor em teste de hipóteses

### B1. ASA Statement on p-values (2016): os 6 princípios

**Referência:** Wasserstein & Lazar (2016), "The ASA Statement on p-Values: Context, Process, and Purpose", *The American Statistician* 70(2):129–133, DOI 10.1080/00031305.2016.1154108 **[M]**. Conferi os princípios no release oficial da ASA de 7 de março de 2016 **[V]**.

| # | Original | Tradução livre |
|---|---|---|
| 1 | "P-values can indicate how incompatible the data are with a specified statistical model." | p indica o grau de incompatibilidade entre os dados e um modelo especificado. |
| 2 | "P-values do not measure the probability that the studied hypothesis is true, or the probability that the data were produced by random chance alone." | p não é P(hipótese verdadeira) nem P(o acaso sozinho gerou os dados). |
| 3 | "Scientific conclusions and business or policy decisions should not be based only on whether a p-value passes a specific threshold." | Decisões não devem depender só de p cruzar um limiar. |
| 4 | "Proper inference requires full reporting and transparency." | Inferência exige relato completo e transparência. |
| 5 | "A p-value, or statistical significance, does not measure the size of an effect or the importance of a result." | p não mede tamanho nem importância do efeito. |
| 6 | "By itself, a p-value does not provide a good measure of evidence regarding a model or hypothesis." | p isolado não é boa medida de evidência. |

**Alternativas citadas no release [V]:** "confidence, credibility, or prediction intervals; Bayesian methods; alternative measures of evidence such as likelihood ratios or Bayes factors; and other approaches such as decision-theoretic modeling and false discovery rates".

**URL:** https://www.amstat.org/asa/files/pdfs/p-valuestatement.pdf **[V]**

### B2. Editorial de 2019 ("Moving to a World Beyond 'p < 0.05'"), ATOM e contraponto de 2021

**O editorial [V PDF]**
- Wasserstein, Schirm & Lazar (2019), *The American Statistician* 73(sup1):1–19, DOI 10.1080/00031305.2019.1583913. É o editorial de um número especial com 43 artigos, que nasceu do Symposium on Statistical Inference (outubro de 2017).
- **Don'ts:** não basear conclusões só em "statistically significant"; não crer que o efeito existe porque deu significativo, nem que está ausente porque não deu; não tratar p como probabilidade de acaso ou de H verdadeira; não inferir importância prática a partir de significância.
- **Proposta central:** "it is time to stop using the term 'statistically significant' entirely. Nor should variants such as 'significantly different,' 'p < 0.05,' and 'nonsignificant' survive, whether expressed in words, by asterisks in a table, or in some other way."
- **p como número contínuo:** "reported as continuous quantities (e.g., p = 0.08)".
- **Intervalos:** "stop using confidence intervals as another means of dichotomizing"; tratá-los como "compatibility intervals".
- **s-value:** s = −log2(p) como leitura alternativa.
- Retoma Gelman & Stern (2006): "the difference between 'significant' and 'not significant' is not itself statistically significant."
- **ATOM:** "Accept uncertainty. Be thoughtful, open, and modest." ("Remember 'ATOM.'")
- URL: https://sites.pitt.edu/~bertsch/Moving%20to%20a%20World%20Beyond%20p%200%2005.pdf

**Contraponto institucional:** ASA President's Task Force (Benjamini et al., 2021), *Annals of Applied Statistics* 15(3), DOI 10.1214/21-AOAS1501 **[M]**. O texto veio de reprodução, porque AOAS e HDSR deram 403 **[S errorstatistics.com]**:
- a força-tarefa foi criada "to address concerns that a 2019 editorial in The American Statistician … might be mistakenly interpreted as official ASA policy";
- "P-values and significance tests, when properly applied and interpreted, increase the rigor of the conclusions drawn from data";
- "Thresholds are helpful when actions are required."

**Outra posição:** Benjamin et al. (2018), *Nature Human Behaviour* 2:6–10: "change the default P-value threshold for statistical significance from 0.05 to 0.005 for claims of new discoveries" **[V abstract]**.

**Guia de más interpretações:** Greenland et al. (2016), *Eur J Epidemiol* 31:337–350, com "an explanatory list of 25 misinterpretations" **[V]**. Dois itens que a lista classifica como falsos:
- "The P value is the probability that the test hypothesis is true…"
- "The specific 95% confidence interval presented by a study has a 95% chance of containing the true effect size"

**Posição para a aula:** o debate está aberto. Regra do fluxo: p contínuo + efeito + IC + contexto. Limiar só quando há decisão a tomar, fixado a priori.

### B3. Garden of forking paths, researcher degrees of freedom, p-hacking, HARKing e pré-registro

**Gelman & Loken [V PDF]**
- Working paper de 14/11/2013; versão "The Statistical Crisis in Science", *American Scientist* 102(6):460, 2014 **[M]**.
- Tese: "Researcher degrees of freedom can lead to a multiple comparisons problem, even in settings where researchers perform only a single analysis on their data."
- Fundamento: "P-values are based on what would have happened under other possible datasets."
- Remédios propostos:
  - pré-registro onde for viável;
  - "pre-publication replication", ou seja, "two experiments, the first being exploratory but still theory-based, and the second being purely confirmatory with its own preregistered protocol";
  - em dados observacionais, analisar todas as comparações relevantes e usar modelos multinível.

**HARKing: Kerr (1998)**, *Personality and Social Psychology Review* 2(3):196–217 **[V, página 1 do scan]**
- "HARKing is defined as presenting a post hoc hypothesis (i.e., one based on or informed by one's results) in one's research report as if it were, in fact, an a priori hypotheses."

**Researcher degrees of freedom: Simmons, Nelson & Simonsohn (2011)**, *Psychological Science* 22(11):1359–1366 **[V PDF]**
- O experimento combina quatro graus de liberdade: dois desfechos, n flexível, covariável e descartar uma condição.
- Com isso, a taxa de falso positivo a p ≤ .05 vai a **60,7%** ("a stunning 61% false-positive rate!") em 15.000 amostras simuladas.
- **Seis requisitos para autores:**
  1. regra de parada decidida antes da coleta e reportada;
  2. ≥ 20 observações por célula ou justificativa;
  3. listar todas as variáveis;
  4. reportar todas as condições;
  5. reportar os resultados também com as observações excluídas;
  6. reportar os resultados sem a covariável.
- **Quatro diretrizes para revisores.**
- O termo "p-hacking" aparece, junto com "data dredging", no release da ASA (fala de J. Utts) **[V]**. Não verifiquei quem cunhou o termo.

**Pré-registro: Nosek et al. (2018)**, *PNAS* 115(11):2600–2606 **[V]**
- Distinção "postdiction" × "prediction".
- A solução é "define the research questions and analysis plan before observing the research outcomes".
- Holdout: "In a process known as cross-validation, the dataset is split in two. One part is used for exploratory analysis to develop the models and predictions; the other part is sealed until exploration is complete. Sealing a dataset and preregistering the outcomes of the discovery process before unsealing converts postdictions from the initial dataset to predictions for the holdout dataset."

**Wagenmakers et al. (2012)**, *Perspectives on Psychological Science* 7(6):632–638 **[V abstract]**
- Só as análises pré-registradas "deserve the label 'confirmatory'"; as demais "should be labeled 'exploratory'".

**Reuso de holdout: Dwork et al. (2015)**, *Science* 349(6248):636–638 **[V abstract]**
- Na prática, a análise é adaptativa. Os autores propõem reusar o holdout preservando validade.
- Na versão arXiv: "Reusing a holdout set adaptively multiple times can easily lead to overfitting to the holdout set itself." **[V]**

### B4. Análise de multiverso e specification curve

- **Steegen, Tuerlinckx, Gelman & Vanpaemel (2016)**, *Perspectives on Psychological Science* 11(5):702–712 **[V PDF]**
  - Ponto de partida: "data are to a certain extent actively constructed".
  - O multiverso "involves performing all analyses across the whole set of alternatively processed data sets corresponding to a large set of reasonable scenarios".
  - Resultado: mostra "how much the conclusions change because of arbitrary choices in data construction" e aponta quais escolhas mais pesam na fragilidade.
- **Simonsohn, Simmons & Nelson (2020)**, *Nature Human Behaviour* 4(11):1208–1214 **[V PDF + abstract]**
  - Três passos: "(1) identifying the set of theoretically justified, statistically valid and non-redundant specifications; (2) displaying the results graphically, allowing readers to identify consequential specifications decisions; and (3) conducting joint inference across all specifications".
  - A curva mostra o efeito por especificação, ordenado por magnitude, com um "dashboard chart" das escolhas embaixo.
- **Diferença prática:** o multiverso cobre escolhas de processamento de dados. A specification curve cobre especificações de modelo e acrescenta inferência conjunta.

### B5. Múltiplas comparações: Bonferroni, Holm (1979), Benjamini–Hochberg (1995)

**Bonferroni**
- Rejeita se p ≤ α/m, o que equivale a multiplicar p pelo número de comparações **[V R `p.adjust`]**.
- Documentação do R: "There seems no reason to use the unmodified Bonferroni correction because it is dominated by Holm's method, which is also valid under arbitrary assumptions." **[V]**

**Holm (1979)**, "A simple sequentially rejective multiple test procedure", *Scandinavian Journal of Statistics* 6(2):65–70 **[M]**
- Procedimento step-down **[S Wikipedia]**:
  1. ordenar os valores p(1) ≤ … ≤ p(m);
  2. rejeitar H(k) se p(k) ≤ α/(m+1−k);
  3. parar na primeira não rejeição.
- Controle do FWER "in the strong sense"; "uniformly more powerful than the classic Bonferroni correction"; não exige independência.

**Benjamini & Hochberg (1995)**, *JRSS B* 57(1):289–300 **[M]**
- Controla o FDR, "the expected proportion of false discoveries amongst the rejected hypotheses" **[V R doc]**.
- Procedimento step-up **[S McDonald 2014]**:
  1. ordenar os p;
  2. calcular (i/m)·Q para cada posição;
  3. achar o maior p(i) abaixo de (i/m)·Q;
  4. declarar significativos ele e todos os menores.
- Variantes **[V R doc]**:
  - BY (Benjamini & Yekutieli, 2001) troca q por q/Σ(1/i) e "controls the FDR under the most general form of dependence structure".
  - Hochberg e Hommel são "valid when the hypothesis tests are independent or when they are non-negatively associated".

**Quando usar cada um** (síntese de V e S)

| Situação | Procedimento |
|---|---|
| Poucas hipóteses confirmatórias; um falso positivo é caro | Holm (FWER). Bonferroni puro não tem vantagem. |
| Muitas hipóteses, triagem com validação posterior | BH (FDR) |
| FDR com dependência arbitrária entre testes | BY |
| Exploração sem família definida | Não "corrigir para parecer confirmatório": rotular como exploratório e confirmar no holdout |

McDonald (2014) justifica Bonferroni quando "a single false positive in a set of tests would be a problem" **[S]**.

**URLs:** https://stat.ethz.ch/R-manual/R-devel/library/stats/html/p.adjust.html **[V]**; https://en.wikipedia.org/wiki/Holm%E2%80%93Bonferroni_method **[S]**; http://www.biostathandbook.com/multiplecomparisons.html **[S]**

### B6. Tamanho de efeito, IC, poder e tamanho amostral

**Convenções de Cohen (1992)**, "A power primer", *Psychological Bulletin* 112(1):155–159, Table 1 **[V]**

| Índice | Teste | Pequeno | Médio | Grande |
|---|---|---|---|---|
| d | diferença de 2 médias independentes | .20 | .50 | .80 |
| r | correlação | .10 | .30 | .50 |
| q | diferença entre 2 r (Fisher z) | .10 | .30 | .50 |
| g | teste do sinal (P − .50) | .05 | .15 | .25 |
| h | 2 proporções (arcoseno) | .20 | .50 | .80 |
| w | qui-quadrado (aderência e contingência) | .10 | .30 | .50 |
| f | ANOVA de 1 via | .10 | .25 | .40 |
| f² | regressão múltipla | .02 | .15 | .35 |

- O próprio Cohen avisa que as definições foram "made subjectively". O efeito médio deveria ser "visible to the naked eye of a careful observer" **[V]**.
- **Poder:** a convenção 0,80 com α = 0,05 dá razão β:α de 4:1 **[V]**. Exemplo do artigo: d = .50 com α = .05 bicaudal exige **N = 64 por grupo** **[V]**.

**Cramér's V** **[S real-statistics.com, que cita Cohen 1988, pp. 79–80]**
- V = √(χ²/(n·df*)), com df* = min(r−1, c−1); w = V·√df*.
- Os limiares de Cohen se aplicam a V·√df*. Portanto, o que conta como V "pequeno" depende do tamanho da tabela.

**Lakens (2013)**, *Frontiers in Psychology* 4:863 **[V]**
- "Effect sizes are the most important outcome of empirical studies."
- Entre sujeitos: reportar d_s ou Hedges' g.
- Intra-sujeitos: d_z ou g_av/g_rm.
- ANOVA: η²p para análise de poder, η²G para meta-análise, ω² como alternativa menos viesada.
- Sempre com IC em torno do efeito, indicar a versão usada (subscrito) e evitar ler os benchmarks de Cohen de forma rígida.

**Odds ratio:** Bland & Altman (2000), *BMJ* 320:1468 **[M]** (texto não aberto).

**Baixo poder: Button et al. (2013)**, *Nature Reviews Neuroscience* 14:365–376 **[V abstract]**
- Baixo poder "also reduces the likelihood that a statistically significant result reflects a true effect".
- Consequências: "overestimates of effect size and low reproducibility".

**Poder post hoc: Hoenig & Heisey (2001)**, *The American Statistician* 55(1):19–24 **[V abstract via Mendeley]**
- Calcular poder depois de um resultado não significativo, para interpretá-lo, é "fundamentally flawed".

**Mostrar ausência de efeito:** equivalence testing (TOST) contra um SESOI; Lakens, Scheel & Isager (2018), *AMPPS* 1(2):259–269 **[V abstract]**.

**Ferramenta:** G*Power 3 (Faul et al., 2007, *Behavior Research Methods* 39(2):175–191) **[M]**.

### B7. Pressupostos e alternativas robustas

Versão compacta; o guia de escolha de testes foi redigido por outra via.

- **Welch como default em 2 grupos:** Delacre, Lakens & Leys (2017), *IRSP* 30(1):92–101: Welch "provides a better control of Type 1 error rates when the assumption of homogeneity of variance is not met, and it loses little robustness compared to Student's t-test when the assumptions are met" **[V]**.
- **Não pré-testar variâncias com Levene:** Zimmerman (2004): "Optimum protection is assured by using a separate-variances test unconditionally whenever sample sizes are unequal." **[V abstract]**
- **ANOVA de 1 via:** Delacre et al. (2019), *IRSP* 32(1):13: "We therefore recommend using the W-test by default when comparing means." (W = Welch's F) **[V]**
- **Pré-teste de normalidade** (Shapiro–Wilk para decidir entre t e Mann–Whitney): altera as taxas condicionais de erro tipo I, embora o procedimento como um todo tenha ficado aceitável nos cenários simulados. Rochon, Gondan & Kieser (2012) **[V abstract]**.
- **WMW não é teste de medianas:** o que ele testa é Pr(X1 < X2) + Pr(X1 = X2)/2. Divine et al. (2018), *The American Statistician* 72(3):278–286 **[V abstract]**; ver também Hart (2001), *BMJ* **[M]**.
- **Amostras grandes:** "t-tests and their corresponding confidence intervals can and should be used even for heavily skewed data" (Fagerland, 2012) **[V abstract]**.
- **Tabelas com esperados pequenos:** a regra clássica pede esperados maiores que 5; McDonald recomenda teste exato quando o n total é menor que 1000 **[V biostathandbook.com/small.html]**.
- **Bootstrap:** o intervalo percentil "badly under-covers in small samples" (Hesterberg, 2015, arXiv 1411.5279) **[V]**. Referência original: Efron (1979), *Annals of Statistics* 7(1) **[M]**.
- **Permutação:** Ernst (2004), *Statistical Science* 19(4):676–685, descreve as situações em que o teste é exato e livre de distribuição **[S abstract via busca]**.
- **Tabela de referência** (objetivo × tipo de variável × teste): UCLA OARC, "What statistical analysis should I use?" **[V]**.

### B8. Correlação × causalidade: o mínimo antes de afirmar causa

**Tipagem**
- Inferencial não é causal (Leek & Peng).
- O FT Visual Vocabulary avisa que, em gráficos de correlação, "many readers will assume the relationships you show them to be causal" **[V]**.

**Paradoxo de Simpson**
- Simpson (1951), *JRSS B* 13(2):238–241 **[M]**.
- Caso Berkeley: Bickel, Hammel & O'Connell (1975), *Science* 187:398–404 **[V abstract]**.
  - Os dados agregados mostram "a clear but misleading pattern of bias against female applicants".
  - Com os dados agrupados corretamente por departamento, aparece "a small but statistically significant bias in favor of women".
  - A explicação: as mulheres se candidatavam mais a departamentos mais concorridos.

**DAGs, back doors e colliders**
- **Huntington-Klein, *The Effect*** (Chapman & Hall/CRC, 2021 **[M]**; online **[V]**):
  - back door path = "at least one arrow, somewhere along the line, is pointing back … towards the treatment variable";
  - collider: "the arrows on either side of it both point at it". O caminho que passa por ele já nasce fechado, mas "if you control for the collider, the path Opens back up";
  - identificação: "control for at least one variable on each of our Bad Paths without controlling for anything on one of our Good Paths".
- **Cunningham, *Causal Inference: The Mixtape*** (Yale University Press, 26/01/2021) **[V]**. O site hoje publica a 2ª edição em progresso como *Causal Inference: The Remix* **[V]**.
  - O backdoor criterion é satisfeito "when all backdoor paths are closed".
  - Condicionar num collider "opens up spurious correlations between the treatment and outcome".
- **Outras referências:**
  - Pearl (1995), *Biometrika* 82(4):669–688 **[M]**;
  - Pearl, Glymour & Jewell (2016), *Causal Inference in Statistics: A Primer* **[V página do livro]**;
  - Hernán & Robins, *Causal Inference: What If* (Chapman & Hall/CRC, 2020, PDF gratuito) **[V]**.
- **Bradford Hill (1965):** nove "viewpoints" para julgar se associações são causais **[S, via Fedak et al. (2015), *Emerging Themes in Epidemiology*; original não aberto]**.

**Mínimo operacional** (síntese)
1. Houve aleatorização? Se não, o default é o rótulo "inferencial".
2. Desenhar o DAG explícito, com confundidores, mediadores e colliders.
3. Escolher um conjunto de ajuste que feche os back doors sem condicionar em mediador ou collider.
4. Checar temporalidade.
5. Checar se o efeito se inverte ao desagregar (Simpson).
6. Fazer análise de sensibilidade ou multiverso.
7. Calibrar a linguagem no deck: "associado a", nunca "causa", sem desenho que sustente.

---

## C. Qualidade e reprodutibilidade

### C1. Dimensões de qualidade de dados

**DAMA UK Working Group (2013)**, "The Six Primary Dimensions for Data Quality Assessment": completeness, uniqueness, timeliness, validity, accuracy, consistency.
- O original é restrito a membros **[NV]**.
- Uso as definições adaptadas por Becker (2019), Federal Reserve Bank of Kansas City, TB 19-03 **[S]**. Ela usa oito componentes, as seis dimensões mais flexibility e usability, e deixa de fora value e confidence.

| Dimensão | Definição (Becker 2019) | Como medir |
|---|---|---|
| Completeness | "The proportion of data that is stored against the potential for 100 percent … is there missing data?" | contagem de ausentes; comparação com lista completa |
| Uniqueness | "does not contain multiple entries for the same object, based on how the object is defined" | regra explícita de duplicata |
| Validity | "conform to a defined domain of values" (ex.: idade 0–120) | % de valores fora do domínio do dicionário |
| Accuracy | "correctly describes the object of the data" | spot-check contra fonte conhecida |
| Consistency | "given a definition, data would represent the same object the same way" | estabilidade das definições ao longo do tempo |
| Timeliness | "How likely the data are to change or be updated…"; defasagem de release | frequência de atualização vs. frequência de uso |

- **DMBOK2 (2017)** apresenta vários frameworks: Strong-Wang, Redman, English e DAMA UK **[S Becker]**.
- **Não há consenso de lista:** DAMA NL (Black & van Nederpelt, 2020) partiu de "127 definitions from nine authoritative sources" e chegou a "60 preferred definitions" **[V]**.

**ISO/IEC 25012:2008** (SQuaRE, data quality model; publicada em 03/12/2008) **[V IEC webstore]**. São 15 características **[V iso25000.com]**:

| Grupo | Características |
|---|---|
| Inerentes | accuracy (sintática e semântica), completeness, consistency, credibility, currentness |
| Inerentes e dependentes de sistema | accessibility, compliance, confidentiality, efficiency, precision, traceability, understandability |
| Dependentes de sistema | availability, portability, recoverability |

### C2. Tidy data: Wickham (2014), *Journal of Statistical Software* 59(10) [V]

- **Três regras:** "1. Each variable forms a column. 2. Each observation forms a row. 3. Each type of observational unit forms a table." Equivale à 3ª forma normal de Codd em linguagem estatística.
- **Os cinco problemas mais comuns em dados "messy":**
  1. column headers are values, not variable names;
  2. multiple variables are stored in one column;
  3. variables are stored in both rows and columns;
  4. multiple types of observational units are stored in the same table;
  5. a single observational unit is stored in multiple tables.

### C3. Reprodutibilidade

**Sandve, Nekrutenko, Taylor & Hovig (2013)**, *PLoS Comput Biol* 9(10):e1003285 **[V]**
1. For Every Result, Keep Track of How It Was Produced
2. Avoid Manual Data Manipulation Steps
3. Archive the Exact Versions of All External Programs Used
4. Version Control All Custom Scripts
5. Record All Intermediate Results, When Possible in Standardized Formats
6. For Analyses That Include Randomness, Note Underlying Random Seeds
7. Always Store Raw Data behind Plots
8. Generate Hierarchical Analysis Output, Allowing Layers of Increasing Detail to Be Inspected
9. Connect Textual Statements to Underlying Results
10. Provide Public Access to Scripts, Runs, and Results

**Wilson et al. (2017)**, "Good enough practices in scientific computing", *PLoS Comput Biol* 13(6):e1005510 **[V]**
- Seções: data management, software, collaboration, project organization, keeping track of changes, manuscripts.
- Destaques:
  - "Save the raw data"
  - "Record all the steps used to process data"
  - "Put raw data and metadata in a data directory and files generated during cleanup and analysis in a results directory"
  - "Make dependencies and requirements explicit"
  - "Do not comment and uncomment sections of code to control a program's behavior"

**FAIR: Wilkinson et al. (2016)**, *Scientific Data* 3:160018
- Diferencial: "specific emphasis on enhancing the ability of machines to automatically find and use the data" **[V abstract via Europe PMC]**.
- 15 subprincípios **[V GO FAIR Foundation]**: F1–F4, A1, A1.1, A1.2, A2, I1–I3, R1, R1.1–R1.3. Exemplos:
  - F1: "(meta)data are assigned a globally unique and persistent identifier";
  - R1.1: "released with a clear and accessible data usage license";
  - R1.2: "associated with detailed provenance".

**Tradução para o fluxo `.md`:**
- dado bruto imutável;
- scripts e notebooks versionados;
- seed registrada;
- toda afirmação do deck ligada a uma tabela ou figura com o dado bruto por trás (Sandve, regras 7 e 9).

---

## D. Visualização e comunicação

### D1. Tufte: data-ink ratio, lie factor, integridade gráfica

**O livro:** *The Visual Display of Quantitative Information*, Graphics Press, 1983; 2ª ed. em 2001, com cores e correções acumuladas de 17 impressões **[V edwardtufte.com]**. O site menciona o "data-ink ratio" e a "detection of graphical deception: design variation vs. data variation" **[V]**.

**Definições formais:** não abri o texto do livro; conferi em material didático secundário **[S]**.
- **Lie factor** = "size of effect shown in graphic / size of effect in data". Acima de 1, o gráfico exagera o efeito.
  - Faixa tolerada: 0,95–1,05 **[S gist]**.
  - Exemplo clássico: lie factor de 14,8, uma variação numérica de 53% desenhada como 783% **[S slides]**.
- **Data-ink ratio** = data-ink / total ink. Forma equivalente: "1 minus the proportion of the graph that can be erased without loss of data-information".
- **Cinco princípios de data-ink:**
  1. above all else show data;
  2. maximize the data-ink ratio;
  3. erase non-data-ink;
  4. erase redundant data-ink;
  5. revise and edit.
- **Seis princípios de integridade:**
  1. a representação física deve ser proporcional às quantidades;
  2. rotulagem clara e detalhada contra distorção e ambiguidade;
  3. mostrar variação dos dados, não do design;
  4. em séries monetárias, usar unidades deflacionadas e padronizadas;
  5. o número de dimensões visuais não deve exceder o de dimensões dos dados;
  6. não citar dados fora de contexto.

**Complemento empírico:** Cleveland & McGill (1984), *JASA* 79(387):531–554 **[V]**
- Ordem de acurácia das tarefas perceptuais, da mais para a menos precisa:
  1. position along a common scale;
  2. positions along nonaligned scales;
  3. length, direction, angle;
  4. area;
  5. volume, curvature;
  6. shading, color saturation.
- Diretriz: "Graphs should employ elementary tasks as high in the ordering as possible."

**URLs:** https://www.edwardtufte.com/book/the-visual-display-of-quantitative-information/ **[V]**; https://anilbas.github.io/teaching/hci/week13/Tufte.pdf **[S]**; https://gist.githubusercontent.com/aparente/e48c353755958621b3c0004593105a90/raw/0d356f00b1579e37a5f645d01307e28a90d6f73e/references__tufte-principles.md **[S]**; https://www.statsclass.com/dsci310/Notes/Cleveland_McGill_EPT.pdf **[V]**

### D2. FT Visual Vocabulary

**Créditos:** FT Visual Journalism (Alan Smith, Chris Campbell, Ian Bott, Liz Faunce, Graham Parrish, Billy Ehrenberg-Shannon, Paul McCallum, Martin Stabe). © Financial Times 2016–2019, licença CC BY-SA 4.0. Inspirado no Graphic Continuum de Jon Schwabish e Severino Ribecca **[V poster]**.

**Como usar, segundo o poster:** "Use the categories across the top to decide which data relationship is most important in your story … This list is not meant to be exhaustive, nor a wizard" **[V]**.

**As nove categorias [V]**

| Categoria | Uso (poster) | Gráficos listados |
|---|---|---|
| **Deviation** | variações (+/−) em relação a um ponto fixo (zero, meta ou média de longo prazo) | diverging bar; diverging stacked bar; spine; surplus/deficit filled line |
| **Correlation** | relação entre 2+ variáveis; "many readers will assume the relationships you show them to be causal" | scatterplot; column + line timeline; connected scatterplot; bubble; XY heatmap |
| **Ranking** | a posição na ordem importa mais que o valor | ordered bar; ordered column; ordered proportional symbol; dot strip plot; slope; lollipop; bump |
| **Distribution** | valores e frequência; forma/assimetria | histogram; dot plot; dot strip plot; barcode plot; boxplot; violin plot; population pyramid; cumulative curve; frequency polygons; beeswarm |
| **Change over Time** | tendências de curto ou longo prazo | line; column; column + line timeline; slope; area chart; candlestick; fan chart (projections); connected scatterplot; calendar heatmap; Priestley timeline; circle timeline; vertical timeline; seismogram; streamgraph |
| **Magnitude** | comparação de tamanhos, em geral contagens e não taxas | column; bar; paired column; paired bar; Marimekko; proportional symbol; isotype (pictogram); lollipop; radar; parallel coordinates; bullet; grouped symbol |
| **Part-to-whole** | decomposição de um todo | stacked column/bar; Marimekko; pie; donut; treemap; Voronoi; arc; gridplot; Venn; waterfall |
| **Spatial** | quando localização ou padrão geográfico é o principal | basic choropleth (rate/ratio); proportional symbol (count/magnitude); flow map; contour map; equalised cartogram; scaled cartogram (value); dot density; heat map |
| **Flow** | volume ou intensidade de movimento entre estados | Sankey; waterfall; chord; network |

**Regras embutidas no poster [V]**
- column/bar: "Must always start at 0 on the axis";
- choropleth: "should always be rates rather than totals";
- pie: "difficult to accurately compare the size of the segments";
- stacked column/bar: difícil de ler com mais que poucos componentes.

**URL:** https://github.com/Financial-Times/chart-doctor/tree/main/visual-vocabulary (PDF `Visual-vocabulary-en.pdf`) **[V]**

### D3. Knaflic, *Storytelling with Data* (Wiley, 2015)

**Capítulos [V]**
0. introduction
1. the importance of context
2. choosing an effective visual
3. clutter is your enemy!
4. focus your audience's attention
5. think like a designer
6. dissecting model visuals
7. lessons in storytelling
8. pulling it all together
9. case studies

Existe também uma edição de 10º aniversário **[V]**.

**As seis lições** (como organizadas em curso da IMT Atlantique) **[S]**: importância do contexto; escolher o visual eficaz; eliminar clutter; focar a atenção da audiência; pensar como designer; contar uma história.

**Big Idea** (conceito de Nancy Duarte, em *Resonate*), post de 06/02/2014 **[V]**. Três requisitos:
1. "It must articulate your unique point of view";
2. "It must convey what's at stake";
3. "It must be a complete sentence".

**3-minute story [V]:** "If you had only three minutes to tell your audience what they need to know: what would that sound like?" Serve para descrever a mensagem "without reliance on your data and/or visuals".

**Storyboarding [V]**
- "don't start with your presentation software"; usar post-its;
- fazer depois de clarificar o contexto e antes dos slides;
- buscar "buy-in from your client or stakeholder at this step".

**URLs [V]:** https://www.storytellingwithdata.com/book/downloads; https://www.storytellingwithdata.com/blog/2014/02/whats-big-idea; https://www.storytellingwithdata.com/blog/2014/02/the-3-minute-story; https://www.storytellingwithdata.com/blog/2014/02/storyboarding. Curso IMT **[S]**: https://formations.imt-atlantique.fr/data_storytelling/panorama.html

### D4. Barbara Minto, *The Pyramid Principle*, e SCQ(A)

**Autora:** Barbara Minto foi a primeira mulher com MBA contratada pela McKinsey (Cleveland, 1963; Londres, 1966–1973) **[V Wikipedia]**.

**Datas do livro divergem entre as fontes**
- O site oficial diz que *The Minto Pyramid Principle: Logic in Writing, Thinking and Problem Solving* (edição de 1996) "supersedes the Pyramid Principle book, which was written in 1987 and re-issued by the publisher unchanged in 2002" **[V]**.
- A Wikipedia registra 1985 para a primeira edição **[V]**.
- Recomendo citar "1987 (segundo o site oficial)".

**Princípio [V]:** "your thinking will be easy for a reader to grasp if you present the ideas organized as a pyramid under a single point".

**SCQ [V]:** "Situation, Complication, Question Framework (SCQ Framework™) for identifying the question in your reader's mind". O rótulo "SCQA", com A = Answer (o ponto do topo da pirâmide), é o difundido em fontes secundárias **[S]**.

**URLs:** https://www.barbaraminto.com/ **[V]**; https://en.wikipedia.org/wiki/Barbara_Minto **[V]**

### D5. BLUF (Bottom Line Up Front)

- **Fonte:** Army Regulation 25–50, *Preparing and Managing Correspondence*, HQDA, 10/10/2020, com revisão administrativa de 04/10/2024 **[V]**.
- **Parágrafo 1–38a:** a redação eficaz é "understood by the reader in a single rapid reading and is clear, concise, and well-organized".
- **Parágrafo 1–38b:** "Two essential requirements include putting the main point at the beginning of the correspondence (bottom line up front) and using the active voice".
- **URL:** https://armypubs.army.mil/epubs/DR_pubs/DR_a/ARN42124-AR_25-50-007-WEB-13.pdf **[V]**

### D6. Action titles, ghost deck e a evidência do assertion–evidence

**Action title** (prática de consultoria, documentada por praticantes) **[S Slideworks, fundadores ex-BCG e ex-McKinsey]**
- "the most important point of the slide, formulated as a short, simple sentence".
- Tamanho: "one or max two lines, up to 15 words".
- Lidos em sequência, os títulos contam o argumento inteiro ("horizontal logic").

**Ghost deck**, também chamado shell ou skeleton **[S, blog "Working With McKinsey", ex-consultor, 06/07/2013]**
- "an early draft … about 20% complete, with most of the work going into developing leads (titles) and headlines".
- As páginas ficam "blank or rough sketches of exhibits".
- Usos:
  - ajustar o storyline antes de investir trabalho;
  - gerar a "shopping list" de conteúdo;
  - planejar o trabalho;
  - identificar lacunas de storyline e de dados.

**Evidência experimental: assertion–evidence** (Michael Alley, Penn State)
- Formato: headline em frase-asserção mais evidência visual, sem bullets **[V assertion-evidence.com]**.
- Garner & Alley (2013), *International Journal of Engineering Education* 29(6):1564–1579 **[V]**:
  - n = 110 estudantes de engenharia;
  - o grupo assertion–evidence mostrou "superior comprehension and fewer misconceptions … as well as lower perceived cognitive load";
  - e teve recall mais forte no pós-teste tardio.

**Convergências** (síntese)
- O storyboard de Knaflic equivale ao ghost deck.
- A Big Idea, o topo da pirâmide de Minto e o BLUF são o mesmo movimento.

**Risco metodológico** (síntese): o ghost deck é hipótese de trabalho. O título final tem de ser reescrito a partir do resultado. Um título pré-escrito que sobrevive a qualquer resultado é HARKing, ou forking paths, em formato de slide.

**URLs:** https://slideworks.io/resources/how-to-write-action-titles-like-mckinsey **[S]**; http://workingwithmckinsey.blogspot.com/2013/07/McKinsey-presentations-ghost-decks.html **[S]**; https://www.assertion-evidence.com/ **[V]**; https://writing.engr.psu.edu/ae_comprehension.pdf **[V]**

### D7. Comunicação técnica × executiva

**Executiva:** Duarte, "How to Present to Senior Executives" (HBR, 04/10/2012). Na HBR só carregou o cabeçalho; o conteúdo vem da versão no blog da Duarte, datada de 22/06/2026 **[V]**.
- "Summarize up front": "Lead with your findings and your recommendation".
- Set expectations.
- Summary slides: "Follow the 10% rule: If your appendix is 50 slides, create 5 summary slides". O detalhe fica no apêndice, para responder perguntas.
- Give them what they asked for.
- Rehearse.
- Com 30 minutos disponíveis, estruturar como se fossem 5.

**Técnica**
- Definir o público e o que ele precisa aprender; cuidado com a "curse of knowledge": "Experts often suffer from the curse of knowledge, which means that their expert understanding of a topic ruins their explanations to newcomers." (Google Technical Writing One) **[V]**.
- Método e incerteza explícitos (ASA 2016, princípio 4; ATOM) **[V]**.

**Síntese:** os dois decks compartilham a mesma Big Idea. Mudam três coisas:
- o nível: decisão e implicação, no executivo; método, evidência e limitação, no técnico;
- a ordem: BLUF no executivo; PPDAC com títulos-asserção no técnico;
- o destino do detalhe: apêndice no executivo; corpo no técnico.

**URLs:** https://www.duarte.com/blog/how-to-effectively-present-to-senior-executives/ **[V]**; https://hbr.org/2012/10/how-to-present-to-senior-execu **[V parcial]**; https://developers.google.com/tech-writing/one/audience **[V]**

### D8. Acessibilidade

**Okabe & Ito, "Color Universal Design (CUD)"** (2002, modificado em 2008) **[V]**. O RGB é o oficial; o hex eu derivei do RGB.

| Cor | RGB | Hex |
|---|---|---|
| black | 0,0,0 | #000000 |
| orange | 230,159,0 | #E69F00 |
| sky blue | 86,180,233 | #56B4E9 |
| bluish green | 0,158,115 | #009E73 |
| yellow | 240,228,66 | #F0E442 |
| blue | 0,114,178 | #0072B2 |
| vermillion | 213,94,0 | #D55E00 |
| reddish purple | 204,121,167 | #CC79A7 |

Princípios dos autores:
- escolher cores identificáveis por todos os tipos de visão;
- "Use not only different colors but also a combination of different shapes, positions, line types and coloring patterns";
- nomear as cores quando o público precisar se referir a elas;
- rotular direto no gráfico em vez de usar legenda.

**Colormaps contínuos**
- **viridis** **[V]:** criado por Stéfan van der Walt e Nathaniel Smith; default do matplotlib 2.0; perceptualmente uniforme, amigável a daltonismo e imprime bem em P&B (apresentado na SciPy 2015).
- **Documentação do matplotlib** **[V]:** colormaps com luminosidade monotônica são interpretados melhor; o `jet` é "a poor choice"; evitar combinar vermelho e verde.
- **cividis** **[V]:** Nuñez, Anderton & Renslow (2018), *PLOS ONE* 13(7):e0199239.

**Wilke, *Fundamentals of Data Visualization*** (O'Reilly; online sob CC BY-NC-ND 4.0) **[V]**
- "Approximately 8% of males and 0.5% of females" têm alguma deficiência de visão de cor.
- Escalas qualitativas funcionam melhor com 3 a 5 categorias.
- Recomenda a paleta Okabe–Ito e testar as figuras em simulador de CVD.

**WCAG 2.2 [V]**

| Critério | Nível | Exigência |
|---|---|---|
| 1.4.1 Use of Color | A | cor não pode ser o único meio de transmitir informação |
| 1.4.3 Contrast (Minimum) | AA | texto com contraste 4.5:1; texto grande (≥ 18 pt, ou 14 pt em negrito) com 3:1 |
| 1.4.11 Non-text Contrast | AA | 3:1 para "Graphical Objects: Parts of graphics required to understand the content" |

**URLs:** https://jfly.uni-koeln.de/color/ **[V]**; https://bids.github.io/colormap/ **[V]**; https://matplotlib.org/stable/users/explain/colors/colormaps.html **[V]**; https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0199239 **[V]**; https://clauswilke.com/dataviz/color-pitfalls.html **[V]**; https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html, …/non-text-contrast.html, …/use-of-color.html **[V]**

---

## Fecho (c): checklist de rigor para teste de hipóteses

1. **Pergunta tipada:** descritiva, exploratória, inferencial, preditiva, causal ou mecanística. A linguagem da conclusão tem de ser compatível com o tipo, sem causal creep. (Leek & Peng 2015)
2. **Antes de ver o desfecho, escritos por extenso:** a hipótese, o estimando e o SESOI, junto com as expectativas. (Peng & Matsui; Nosek et al. 2018; Lakens et al. 2018)
3. **Plano de análise registrado** num `.md` datado e versionado, antes de abrir o holdout. Inclui teste, covariáveis, exclusões, transformações e regra de parada. (Nosek et al. 2018; Wagenmakers et al. 2012; Simmons et al. 2011, requisito 1)
4. **Exploração e confirmação em dados distintos:** o holdout fica selado e é usado uma vez, ou segue um protocolo de reuso. (Nosek et al. 2018; Dwork et al. 2015)
5. **Poder e tamanho amostral calculados a priori** a partir de um efeito justificável, nunca de "observed power" post hoc. (Cohen 1992; Hoenig & Heisey 2001; Button et al. 2013)
6. **Pressupostos resolvidos por desenho, não por pré-teste mecânico:** Welch por default; Welch's F na ANOVA; permutação ou bootstrap quando apropriado, sabendo que o percentil falha com n pequeno. (Delacre et al. 2017, 2019; Zimmerman 2004; Rochon et al. 2012; Hesterberg 2015)
7. **Unidade de análise e dependência verificadas:** grupos pareados ou independentes, medidas repetidas, clusters. O teste escolhido tem de refletir isso. (UCLA OARC)
8. **Família de testes definida a priori, com correção declarada:** Holm para FWER, BH para FDR, BY sob dependência arbitrária. Bonferroni puro não tem vantagem sobre Holm. (Holm 1979; Benjamini & Hochberg 1995; R `p.adjust`)
9. **Todos os graus de liberdade relatados:** todas as variáveis e condições; resultados com e sem as exclusões; com e sem a covariável. (Simmons et al. 2011)
10. **Robustez medida:** multiverso ou specification curve para as escolhas arbitrárias, reportando a fragilidade. (Steegen et al. 2016; Simonsohn et al. 2020)
11. **Resultado reportado como efeito + IC ("compatibility interval") + p contínuo,** por exemplo p = 0,08. Sem asteriscos e sem a dicotomia significativo/não significativo. (ASA 2016, princípios 3 e 5; Wasserstein et al. 2019; Lakens 2013)
12. **p e IC interpretados corretamente,** conferindo contra a lista de 25 más interpretações. Não significativo não quer dizer ausência de efeito; para afirmar ausência, usar equivalência (TOST). (Greenland et al. 2016; Lakens et al. 2018)
13. **Efeitos comparados diretamente:** a diferença entre "significativo" e "não significativo" não é, por si, significativa. (Gelman & Stern 2006, citado em Wasserstein et al. 2019)
14. **Causa só com identificação explícita:** DAG, back doors fechados, nenhum collider controlado, Simpson checado. Sem isso, o rótulo fica "associação". (Huntington-Klein; Cunningham; Bickel et al. 1975)
15. **Transparência e reprodutibilidade:** código, versões e seeds registrados; dado bruto por trás de cada figura; exploratórios rotulados como tais; relato completo, inclusive do que "não deu". (ASA 2016, princípio 4; Sandve et al. 2013; Kerr 1998)

---

## Fecho (e): deck técnico × deck executivo

**Diferenças gerais**

| Dimensão | Deck técnico | Deck executivo |
|---|---|---|
| **Público** | Pares analíticos, professor/banca, time de dados. Avaliam a validade do método. | Decisores (gestão, cliente, stakeholder). Avaliam implicação, custo e risco. |
| **Objetivo** | Tornar o raciocínio auditável e reprodutível; sustentar a validade das conclusões. | Viabilizar uma decisão ou ação (a fase "Act"); aprovar a recomendação. |
| **Pergunta que o deck responde** | "O resultado é válido, robusto e bem estimado, e sob quais limites?" | "O que fazer, por quê, e o que está em jogo?" |
| **Lógica de ordenação** | Assertion–evidence em todo slide; narrativa PPDAC (problema → plano → dados → análise → conclusões). | BLUF e pirâmide: a resposta vem no 1º slide; SCQ(A) na abertura; 3 a 5 argumentos de suporte. |
| **Tamanho** | Cerca de 12–18 slides, mais apêndice. | Cerca de 5–8 slides; o resumo tem ~10% do tamanho do apêndice (regra de Duarte). |
| **Títulos** | Frase-asserção com o resultado e sua qualificação. | Action title com a implicação ("so what"), até 2 linhas / ~15 palavras. |
| **Nível de detalhe** | Método, n, pressupostos, ajustes, efeito + IC, diagnósticos, referência ao código. | Só o que muda a decisão; números arredondados; incerteza como faixa ou cenário. |
| **Estatística** | p contínuo, IC, d/r/V/OR, poder a priori, correção de multiplicidade. | Efeito em unidade de negócio, com faixa. Sem asteriscos e sem "estatisticamente significativo". |
| **Gráficos** | Diagnósticos, distribuições completas, specification curve, forest plot; categorias FT. | Uma mensagem por gráfico, uma série em destaque, rótulo direto, barras a partir de zero, Okabe–Ito. |
| **Uso do apêndice** | Material suplementar: diagnósticos completos, EDA rotulada como exploratória, tabelas, dicionário de dados. | É onde o deck técnico "mora": não se apresenta, usa-se para responder perguntas. |
| **Base** | Garner & Alley 2013; MacKay & Oldford 2000; Leek & Peng 2015; ASA 2016; Wasserstein et al. 2019; Sandve et al. 2013. | AR 25-50 (BLUF); Minto; Duarte; Knaflic; FT Visual Vocabulary; Slideworks (prática de mercado). |

**Estrutura sugerida: deck técnico**
1. Título-asserção com a Big Idea.
2. Pergunta tipada (Leek & Peng) e critério de sucesso.
3. Dados: origem, amostragem, qualidade (DAMA/ISO), exclusões.
4. Plano registrado e split exploratório/confirmatório.
5. EDA: distribuições e anomalias.
6. Hipóteses, testes, pressupostos e família de testes.
7. Resultado principal: efeito + IC + p contínuo.
8. Resultados secundários, já com correção de multiplicidade.
9. Robustez (multiverso ou specification curve).
10. Ameaças à validade: DAG e confundidores, poder, forking paths.
11. Conclusões rotuladas pelo tipo de pergunta, com limitações.
12. Reprodutibilidade: repositório, versões, seeds.

Depois, o apêndice.

**Estrutura sugerida: deck executivo**
1. Título = recomendação em frase completa (Big Idea / BLUF).
2. Situação → Complicação → Pergunta → Resposta.
3. a 5. Uma evidência por slide: um gráfico, action title e o número em unidade de negócio com faixa de incerteza.
6. Impacto e o que está em jogo (cenários).
7. Riscos e limitações em linguagem calibrada ("associado a", não "causa").
8. Decisão pedida e próximos passos.

Depois, o apêndice, que é o deck técnico condensado.

**Erros comuns**
- **No deck técnico:**
  - títulos-tópico seguidos de bullets;
  - omitir as análises que falharam;
  - usar "significativo" como veredito;
  - não rotular exploratório × confirmatório;
  - excesso de casas decimais;
  - causal creep.
- **No deck executivo:**
  - o "big reveal" deixado para o fim;
  - excesso de texto;
  - gráfico sem mensagem;
  - causalidade não sustentada;
  - esconder a incerteza;
  - responder à pergunta que não foi feita;
  - detalhe metodológico no corpo em vez do apêndice.

---

## Lacunas e itens não verificados

**Fontes originais inacessíveis (substituídas por equivalentes)**

| Item | Situação | Substituto usado |
|---|---|---|
| OSEMN, post original | fora do ar (certificado inválido / 404) **[NV]** | secundárias [S] |
| Tufte, *Visual Display* | texto do livro não aberto | fórmulas e princípios via material didático [S]; dados bibliográficos e conceitos centrais no site do autor [V] |
| Holm (1979) e Benjamini & Hochberg (1995) | JSTOR e Wiley bloqueados | procedimentos via documentação do R [V], Wikipedia e McDonald [S] |
| DAMA UK (2013) | white paper restrito a membros | Becker/KC Fed [S] e DAMA NL [V] |
| ASA Task Force (2021) | AOAS e HDSR deram 403 | reprodução em errorstatistics.com [S] |
| Tukey (1980) | texto não aberto | resumo de MacKay & Oldford [V] |
| HBR (2012) | corpo não carregou | versão no blog da Duarte (2026) [V] |

**Só metadados conferidos, sem abrir o texto [M]:** Amrhein, Greenland & McShane (2019, *Nature*); Hart (2001); Cochran (1954); Bland & Altman (2000); Simpson (1951); Pearl (1995); Wong (2011, *Nature Methods*); Efron (1979); Anscombe (1973).

**Via fonte secundária [S]:** Bradford Hill (1965), via Fedak et al. (2015); Ernst (2004), via snippet de busca.

**Datas ou detalhes a confirmar se forem citados em sala**
- Peng & Matsui (2015) e R4DS 2e (O'Reilly, 2023): ano via índice de busca e livrarias.
- Minto: 1987 (site oficial) × 1985 (Wikipedia).
- Double Diamond: 2003 (início do trabalho) × 2004 (lançamento).
- Subitens da Fig. 1(a) de Wild & Pfannkuch: lidos com OCR corrompido.

**"Action title" e "ghost deck":** são jargão de consultoria. Não achei fonte acadêmica primária; estão documentados por praticantes [S]. A evidência experimental mais próxima é a do assertion–evidence (Garner & Alley, 2013) [V].
