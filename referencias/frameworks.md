# De onde vem cada etapa: frameworks e matriz de convergência

> Síntese da pesquisa de 2026-09-23. Os relatórios completos, com citações e o status de acesso de cada fonte, estão em `pesquisa/01-frameworks-de-processo.md` e `pesquisa/02-analise-rigor-comunicacao.md`.
> Marcação: **[sec.]** = conferido só em fonte secundária · **[não verificado]** = fonte primária não aberta; confira antes de citar.

## 1. Linha do tempo

| Ano | Framework | Autoria | Fases | Foco | O que trouxe de novo |
|---|---|---|---|---|---|
| 1977 | Análise exploratória de dados (EDA) | John Tukey | — | estatística | separar **explorar** (descobrir o que perguntar) de **confirmar** (testar o que foi perguntado) |
| 1996 | **KDD** | Fayyad, Piatetsky-Shapiro & Smyth (*AI Magazine*) | 9 passos (5 etapas) | descoberta de conhecimento | vocabulário-base; data mining é **um** passo de nove; alerta sobre padrões espúrios |
| ≤ 1998 | **SEMMA** | SAS Institute | Sample, Explore, Modify, Model, Assess | modelagem, preso à ferramenta | amostragem e partição como primeiro passo; sem fase de negócio nem de implantação |
| 1999 | **PPDAC** | MacKay & Oldford (1994); Wild & Pfannkuch (1999) | Problem, Plan, Data, Analysis, Conclusion | investigação estatística | ciclo interrogativo que manda **"check against reference points: internal, external"** |
| 2000 | **CRISP-DM 1.0** | consórcio NCR, SPSS, DaimlerChrysler, OHRA | 6 fases, 24 tarefas genéricas, 42 saídas | negócio + técnico | começa pelo negócio; saída definida para cada tarefa; ciclo iterativo |
| 2010 | OSEMN | Mason & Wiggins | Obtain, Scrub, Explore, Model, iNterpret | fluxo do analista | a interpretação como etapa **[não verificado: site original inacessível]** |
| 2015 | **IBM FMDS** | John B. Rollins | 10 etapas | negócio + estatística/ML | *Analytic approach* e *Data requirements* **antes** da coleta; *Feedback* no fim |
| 2015 | **ASUM-DM** | IBM | 5 fases + trilha de gestão | implementação e operação | gestão de projeto paralela às fases; *Operate & Optimize* |
| 2015 | Tipos de pergunta | Leek & Peng (*Science*) | 6 tipos | inferência | o tipo de pergunta define o método e a afirmação permitida (seção 6) |
| 2016 | **TDSP** | Microsoft | 5 estágios | equipe e engenharia | papéis, charter, *checkpoint decisions*, *exit report*, repositório padrão. **Repositórios arquivados em 2023, documentação retirada em jan/2025** |
| 2017 | Domino Lifecycle · Agile Data Science 2.0 | Domino Data Lab · Russell Jurney | 6–7 estágios · manifesto de 7 princípios | produto e equipe | "Anticipate auditability needs"; "Ship intermediate output. Even failed experiments have output" |
| 2021 | **CRISP-ML(Q)** | Studer et al. (Mercedes-Benz + TU Berlin) | 6 fases | ML em produção | **garantia de qualidade por tarefa** (requisitos → riscos → mitigação); baseline; *test set* bloqueado; monitoramento |
| 2021 | **Data Science Trajectories** | Martínez-Plumed et al. (*IEEE TKDE*) | mapa de 16 atividades, sem setas | ciência de dados exploratória | trajetórias em vez de sequência; atividades exploratórias e de gestão de dados |
| — | DMAIC (Six Sigma) | Motorola, 1986 **[sec.]** | Define, Measure, Analyze, Improve, Control | melhoria de processo | baseline medido antes de analisar; **Control** para sustentar o ganho |

**Adoção.** Nas enquetes da KDnuggets, o CRISP-DM foi a metodologia mais citada: 42% em 2007 e 43% em 2014, contra 13% e 8,5% do SEMMA **[sec.]**. Numa pesquisa com cientistas de dados, 82% não seguiam processo explícito e 85% achavam que um processo melhor melhoraria os resultados (Saltz et al., 2018). Num experimento controlado com equipes de estudantes, as que usaram CRISP-DM tiveram a melhor nota média de qualidade de projeto (8,4, contra 7,8 com Kanban, 7 sem método e 6,5 com Scrum), mas foram as últimas a começar a programar (Saltz, Shamshurin & Crowston, 2017).

## 2. CRISP-DM: a espinha dorsal

O guia de 2000 organiza o processo em 4 níveis: **fase → tarefa genérica → tarefa especializada → instância de processo**. Separa *o que fazer* (reference model) de *como fazer* (user guide).

| Fase | Tarefas genéricas |
|---|---|
| 1 Business Understanding | Determine business objectives · Assess situation · Determine data mining goals · Produce project plan |
| 2 Data Understanding | Collect initial data · Describe data · Explore data · Verify data quality |
| 3 Data Preparation | Select data · Clean data · Construct data · Integrate data · Format data |
| 4 Modeling | Select modeling technique · Generate test design · Build model · Assess model |
| 5 Evaluation | Evaluate results · Review process · Determine next steps |
| 6 Deployment | Plan deployment · Plan monitoring and maintenance · Produce final report · Review project |

Três citações do guia que o kit leva a sério:
- "A possible consequence of neglecting this step is to expend a great deal of effort producing the right answers to the wrong questions." (Business Understanding) → **etapa 01**.
- "The sequence of the phases is not rigid. Moving back and forth between different phases is always required." → **`Voltar à etapa NN`** nos portões.
- "Make sure that you are allowed to use the data." (Assess situation) → **etapa 00**, classificação e política de dados.

## 3. Matriz: cada etapa do funil e sua origem

"—" = o framework não trata a etapa explicitamente.

| Etapa do funil | CRISP-DM | KDD | SEMMA | IBM FMDS | TDSP | CRISP-ML(Q) | DMAIC | PPDAC |
|---|---|---|---|---|---|---|---|---|
| **00 Kickoff** | Assess situation · Produce project plan | — | — | — | papéis · estrutura de repositório | viabilidade (*feasibility*) | Define (recursos, cronograma) | Plan |
| **01 Problema e decisão** | Determine business objectives · Determine DM goals | passo 1 (domínio e objetivo) | — | Business understanding · Analytic approach | Business Understanding (*charter*, "sharp questions") | escopo; critérios de sucesso de negócio, ML e econômico | Define | Problem |
| **02 Dados internos** | Collect · Describe · Explore · Verify data quality | passo 2 (Selection) | Sample | Data requirements · Data collection · Data understanding | Data Acquisition & Understanding (*Data Quality Report*) | coleta com versionamento; verificação de qualidade (*schema*) | Measure | Plan · Data |
| **03 Dados externos** ★ | Collect initial data (várias fontes) | passo 2 | Sample | Data requirements · Data collection | *Data Sources* | coleta | Measure | "check against reference points: **external**" |
| **04 Preparação e partição** | Select · Clean · Construct · Integrate · Format · *Generate test design* | passos 3–4 (Preprocessing, Transformation) | Modify (partição em Sample) | Data preparation | *feature engineering* | preparação; mesmos parâmetros no treino e no teste | — | Data |
| **05 Exploração e pré-registro** | Explore data ("form hypothesis") | passo 6 (análise exploratória e seleção de hipóteses) | Explore | Data understanding | IDEAR (relatório exploratório) | — | Analyze | Analysis (planejada × não planejada) |
| **06 Modelagem** *(condicional; só exploração)* | Select technique · Generate test design · Build · Assess model | passos 5 e 7 (Data Mining) | Model | Modeling | Modeling | Modeling (baseline, reprodutibilidade) | Analyze | Analysis |
| **07 Testes confirmatórios** | **lacuna** ("perform basic analysis to verify the hypothesis") | alerta sobre padrões espúrios | Assess (parcial) | Evaluation ("statistical significance tests", opcional) | — | Evaluation (*test set* bloqueado, usado uma vez) | Analyze (validar causa-raiz) | Analysis (planejada) |
| **08 Validação e triangulação** | Evaluate results · Review process · Determine next steps | passo 8 (Interpretation/Evaluation) | Assess | Evaluation | *Customer Acceptance* | Evaluation (*test set* bloqueado, robustez) + QA | Improve (testar a solução) | Conclusions |
| **09 Insights** | Determine next steps | passos 8–9 | — | — | *Exit Report* (overview) | — | Improve | Conclusions |
| **10 Deck técnico** | Produce final report (*final report*) | passo 9 (documentar) | — | — | *Exit Report* | revisão dos documentos de saída | — | Conclusions (comunicação) |
| **11 Deck executivo** | Produce final report (*final presentation*) | passo 9 | — | — | *Exit Report*: "brief non-technical overview" | — | — | Conclusions |
| **12 Entrega e retrospectiva** | Plan deployment · Plan monitoring and maintenance · Review project | passo 9 (agir sobre o conhecimento) | — | Deployment · **Feedback** | Deployment · Customer Acceptance | Deployment · **Monitoring & Maintenance** | **Control** | novo ciclo |

## 4. O que cada framework empresta ao funil

| Framework | Contribuição | Onde está no kit |
|---|---|---|
| CRISP-DM | negócio primeiro; uma saída por tarefa; ciclo com volta | estrutura geral; um artefato por etapa; `Voltar à etapa NN` |
| KDD | padrões precisam ser válidos, novos e úteis; buscar muito acha falso positivo | pré-registro (G5); placar do funil |
| SEMMA | amostrar e particionar primeiro | partição selada (etapa 04) |
| IBM FMDS | abordagem analítica e requisitos de dados **antes** da coleta; *Feedback* | tipo de pergunta (01); matriz de requisitos (02); plano de acompanhamento (12) |
| ASUM-DM | gestão de projeto paralela às fases | kickoff (papéis, cronograma); `00-status.md` |
| TDSP | charter, *checkpoint decisions*, *exit report*, papéis, repositório padrão | brief (01); portões; deck técnico (10); estrutura de pastas |
| CRISP-ML(Q) | QA por tarefa: requisitos → riscos → mitigação; baseline; *test set* bloqueado; monitoramento | tabela "armadilha × salvaguarda" em cada etapa; cofre da confirmação; etapa 06; etapa 12 |
| DMAIC | baseline medido; *Control* | perfil (02); plano de acompanhamento com gatilho (12) |
| PPDAC | checar contra referências **internas e externas**; análises planejadas × não planejadas | etapa 03 obrigatória; registro × "exploratórias adicionais" (07) |
| Tukey · Nosek et al. (2018) | explorar ≠ confirmar; selar a confirmação e pré-registrar antes de abrir | cofre (04); registro travado (G5); única abertura (07) |
| Peng & Matsui | epiciclo: expectativa → dado → comparação → revisão | ciclo PEVD (P declara a expectativa) |
| Leek & Peng (2015) | o tipo de pergunta define a afirmação | brief (01); escada de evidência |
| Minto · Knaflic · Duarte · Alley | resposta primeiro; *Big Idea*; títulos-asserção; resumo no executivo, detalhe no apêndice | etapas 09 a 11 |
| Data Science Trajectories | trajetória em vez de cascata; atividades exploratórias | voltas registradas; busca exploratória de fontes (03) |
| Domino · Agile DS | auditabilidade; resultado falho também é resultado | rastreio de números; regra 7 (reportar tudo) |
| DataOps Manifesto | "Start with data testing"; "Make it reproducible" | testes de dados (04); comando único de reprodução (12) |
| Datasheets · Model Cards | documentar motivação, coleta, limites e desempenho por grupo | ficha de cada base (02); ficha do modelo (06) |
| NIST AI RMF | Govern · Map · Measure · Manage para risco de IA | regras de ouro; kickoff; portões; log de IA |

## 5. Princípios convergentes e lacunas

**Quase todos os frameworks concordam em:**

| # | Princípio | No kit |
|---|---|---|
| 1 | Começar pelo problema e traduzi-lo em objetivo analítico | etapa 01, regra 1 |
| 2 | Critérios de sucesso explícitos, em mais de um nível, antes de modelar | brief §6 |
| 3 | Avaliar viabilidade, riscos e custo cedo, com pontos de decisão | kickoff; portões |
| 4 | Entender os dados antes de modelar | etapa 02 |
| 5 | Preparação como fase própria, com decisões justificadas | etapa 04 (regras com motivo e contagem) |
| 6 | Iterar e voltar a fases anteriores é a regra | `Voltar à etapa NN` |
| 7 | Desenhar o teste antes de treinar; separar treino, validação e teste | cofre (04); registro travado (05); modelo congelado (06) |
| 8 | Avaliar em duas camadas: técnica e contra o negócio | etapa 08 §7 |
| 9 | Começar simples, com baseline | etapa 06 |
| 10 | Planejar monitoramento, manutenção e reavaliação | etapa 12 |
| 11 | Um artefato padronizado por etapa, com rastreabilidade | templates; IDs; log de decisões |
| 12 | Reprodutibilidade e versionamento | hashes; scripts; semente; `requirements.txt` |
| 13 | Envolver quem decide e especialistas o tempo todo | portões ★ com segunda pessoa |
| 14 | Fechar o ciclo com aprendizado | retrospectiva (12) |
| 15 | Restrições legais e de uso dos dados explícitas (convergência fraca) | kickoff; regra 12 |

**O que nenhum cobre bem, e o kit acrescenta:**

| Lacuna | Evidência | Como o kit cobre |
|---|---|---|
| **IA/LLM no próprio processo** | nenhum framework de 1996–2021 trata IA como executora. De 45 agentes de ciência de dados, mais de 90% não têm mecanismos explícitos de *trust and safety* (Rahman et al., 2025) | ciclo PEVD; portões humanos; 12 regras de ouro; log de IA |
| **Validação com dados externos** | só o PPDAC fala em checar contra referências externas; nenhum processo geral prescreve a etapa | etapa 03 obrigatória + triangulação na 08 |
| **Teste de hipótese formal** | o CRISP-DM fala em "verify the hypothesis" sem inferência formal; ninguém pede pré-registro, separação exploratório/confirmatório, correção de multiplicidade ou efeito com IC | cofre (04); registro travado (05); testes (07); escada de evidência |
| **Comunicação por público** | o CRISP-DM pede *final report* e *final presentation*; o TDSP, um resumo não técnico. Nenhum define artefatos, linguagem de incerteza e regras visuais por público | etapas 09 a 11; tradução técnico → executivo |
| **Ética e privacidade** | menções soltas; nenhuma tarefa com saída própria e portão | kickoff (classificação, política de envio à IA); regra 12 |

## 6. Tipos de pergunta (Leek & Peng, 2015)

Leek, J. T.; Peng, R. D. "What is the question?". *Science*, 347(6228):1314–1315, 2015. DOI 10.1126/science.aaa6146.

Duas teses:
- "an analysis can be fully reproducible and still be wrong";
- "the most frequent failure in data analysis is mistaking the type of question being considered".

O tipo de pergunta define o método e **o que se pode afirmar**. Regra do artigo: "each step in the analysis should be labeled according to its original intent". Ela vale também contra o *causal creep*: dar a análises secundárias o peso causal da principal.

O artigo traz um fluxograma para classificar a análise:

```text
Só resumiu o dado, sem interpretar? ──────────────────────────────► DESCRITIVA
        │ não
Quantificou se a descoberta vale para uma nova amostra? ── não ───► EXPLORATÓRIA
        │ sim
Quer saber como mudar uma medida altera outra? ── não ──┐
        │ sim                                          └─ Quer prever medidas de indivíduos?
        │                                                  sim ► PREDITIVA · não ► INFERENCIAL
Efeito médio ou determinístico?
        médio ► CAUSAL · determinístico ► MECANÍSTICA
```

| Tipo | Afirmação permitida | Erro de tratá-la como outro tipo (tabela do artigo) |
|---|---|---|
| Descritiva | "na base, 23% dos clientes…" | como inferencial: *n of 1 analysis* |
| Exploratória | "X e Y aparecem associados; hipótese a testar" | como inferencial: *data dredging*; como preditiva: *overfitting* |
| Inferencial | "estimamos, na população, … (IC 95%)" | como causal: *correlation does not imply causation* |
| Preditiva | "o modelo prevê Y com erro …" | *(nota do kit)* dizer que o modelo explica **por quê**: preditivas "do not necessarily explain why that choice of prediction works" |
| Causal | "X causa Y", com experimento; verbo condicional em desenho observacional | — |
| Mecanística | mecanismo demonstrado ("extremely challenging and rarely achievable" fora da engenharia) | — |

## 7. Frameworks do analista e da comunicação

| Framework | Ano e autoria | Etapas | O que é distintivo | No kit |
|---|---|---|---|---|
| **OSEMN** | Mason & Wiggins, 2010 **[não verificado: o post original está fora do ar]** | Obtain, Scrub, Explore, Model, iNterpret | taxonomia das tarefas do cientista de dados, não metodologia de projeto | 02–04 · 05 · 06–07 · 09 |
| **PPDAC** | MacKay & Oldford (1994; 2000); Wild & Pfannkuch (1999) | Problem, Plan, Data, Analysis, Conclusions | *problem aspect* (causal, descritivo, preditivo); ciclo interrogativo (gerar, buscar, interpretar, criticar, julgar); análises planejadas × não planejadas | 01 · 03 · 05–07 |
| **Epiciclo de análise** | Peng & Matsui, *The Art of Data Science* (Leanpub, ~2015) | 5 atividades: pergunta, exploração, modelos formais, interpretação, comunicação | em cada atividade, "setting expectations → collecting information → comparing → revising" | ciclo PEVD |
| **R4DS** (2ª ed.) | Wickham, Çetinkaya-Rundel & Grolemund (O'Reilly, 2023) | Import → Tidy → (Transform ↔ Visualize ↔ Model) → Communicate, com Program envolvendo tudo | *tidy data* como pré-condição; "entender" é um laço, não uma etapa | 04 · 05 · 10 |
| **CS109** (Harvard) | Blitzstein & Pfister (curso de 2015) | Ask, Get, Explore, Model, Communicate & visualize | perguntas-guia por etapa (amostragem e privacidade já em *Get*); setas de volta entre todas as etapas | 00–01 · 02–03 · 05 · 09–11 |
| **Google Data Analytics** | Google/Coursera | Ask, Prepare, Process, Analyze, Share, Act | a análise termina em **ação** | 01 · 02–04 · 05–07 · 09–11 · 12 |
| **EDA** | Tukey (1977); "We need both exploratory and confirmatory" (1980) | — | EDA como atitude; explorar ≠ confirmar | 05 × 07 |
| **Double Diamond** | Design Council (trabalho iniciado em 2003; lançado em 2004) | Discover, Define, Develop, Deliver | divergir e convergir, duas vezes | 01 (muitas perguntas → 1) · 05 (galeria → seleção) |
| **Pyramid Principle** · SCQ | Barbara Minto (1987, segundo o site oficial) | ideias em pirâmide sob um único ponto; Situação, Complicação, Pergunta | resposta primeiro | 09 · 11 |
| ***Storytelling with Data*** | Cole Nussbaumer Knaflic (Wiley, 2015) | contexto, visual eficaz, sem poluição, foco, design, história | *Big Idea* em uma frase; história de 3 minutos; storyboard antes do software | 09–11 |
| **Assertion–evidence** | Michael Alley; Garner & Alley (2013) | título em frase-asserção + evidência visual | experimento: mais compreensão e menos equívocos que título-tópico com tópicos | títulos-asserção nos decks |

Sobre p-valores, pré-registro, multiplicidade e poder: `referencias/guia-testes-estatisticos.md`.

## 8. Fontes principais

- Chapman et al. *CRISP-DM 1.0: Step-by-step data mining guide*, 2000. https://www.kde.cs.uni-kassel.de/wp-content/uploads/lehre/ws2012-13/kdd/files/CRISPWP-0800.pdf
- Fayyad, Piatetsky-Shapiro, Smyth. From Data Mining to Knowledge Discovery in Databases. *AI Magazine* 17(3), 1996. https://ojs.aaai.org/aimagazine/index.php/aimagazine/article/view/1230
- SAS. SEMMA, *Getting Started with SAS Enterprise Miner*. http://support.sas.com/documentation/cdl/en/emgs/59885/HTML/default/a000167823.htm
- Rollins. *Foundational Methodology for Data Science*, IBM, 2015. https://tdwi.org/~/media/64511a895d86457e964174edc5c4c7b1
- IBM. *Analytics Solutions Unified Method (ASUM)*, 2016. https://public.dhe.ibm.com/software/data/sw-library/services/ASUM.pdf
- Microsoft. *Team Data Science Process* (repositório arquivado). https://github.com/Azure/Microsoft-TDSP
- Studer et al. Towards CRISP-ML(Q). *MAKE* 3(2), 2021. https://arxiv.org/abs/2003.05155
- Martínez-Plumed et al. CRISP-DM Twenty Years Later. *IEEE TKDE* 33(8), 2021. https://research-information.bris.ac.uk/ws/files/220614618/TKDE_Data_Science_Trajectories_PF.pdf
- Wild & Pfannkuch. Statistical Thinking in Empirical Enquiry. *International Statistical Review* 67(3), 1999. https://www.stat.auckland.ac.nz/~iase/publications/isr/99.Wild.Pfannkuch.pdf
- Saltz, Shamshurin & Crowston. HICSS-50, 2017. https://scholarspace.manoa.hawaii.edu/server/api/core/bitstreams/07ccfe0d-2ab8-44ce-945a-6a02da486468/content
- Rahman et al. LLM-Based Data Science Agents: A Survey, 2025. https://arxiv.org/abs/2510.04023
- Leek & Peng. What is the question? *Science* 347(6228), 2015.
