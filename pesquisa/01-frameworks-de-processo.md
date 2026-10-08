# Pesquisa 1: frameworks de processo para análise e ciência de dados

Base factual para montar um fluxo único de análise de dados assistida por IA e para apresentar à turma de Data Science.
Data da coleta: 2026-09-23. Pesquisa só na web.

## Como ler este relatório

- Sem marcação: afirmação conferida na fonte primária indicada. A URL foi aberta com WebFetch. Quando o WebFetch não conseguia ler um PDF, o arquivo baixado foi convertido em texto localmente (PyMuPDF) e lido por inteiro. Figuras críticas, como o diagrama do CRISP-DM, o diagrama do FMDS e o ciclo PPDAC, foram renderizadas e conferidas visualmente.
- `[sec.]`: fonte secundária que foi aberta. Usada quando a primária estava inacessível.
- `[não verificado]`: não consegui abrir nenhuma fonte que sustente a afirmação. Fica só como pista, e a turma deve conferir antes de usar.
- As fontes numeradas `[F#]` estão na seção 17, com o status de acesso de cada uma.
- Fontes primárias bloqueadas (HTTP 403/404, bloqueio da ferramenta ou certificado inválido): todas as páginas de enquete da KDnuggets; O'Reilly (manifesto Agile Data Science); MDPI (versão de periódico do CRISP-ML(Q)); ASQ (DMAIC); PeerJ/PMC; ScienceDirect; IEEE Xplore; web.archive.org; dataists.com (OSEMN); o post da IBM "Have you seen ASUM-DM?" (404). Quando existia uma alternativa aberta (arXiv, Crossref, Europe PMC, OpenAlex, repositório institucional), usei a alternativa e registrei qual foi.

---

## 0. Quadro-resumo

| Framework | Ano | Autoria/organização | Fases | Foco | Distintivo em uma linha | Status |
|---|---|---|---|---|---|---|
| KDD process | 1996 | Fayyad, Piatetsky-Shapiro, Smyth (AI Magazine) | 9 passos / 5 etapas | Descoberta de conhecimento, estatística/ML | Define KDD e trata data mining como um único passo (o 7º); traz o alerta estatístico sobre padrões espúrios | Referência acadêmica |
| SEMMA | documentado desde ≤1998 | SAS Institute | 5 | Técnico/modelagem, preso à ferramenta | Organiza o ferramental do SAS Enterprise Miner, sem fase de negócio nem de implantação | Legado |
| CRISP-DM 1.0 | 2000 (guia) | Consórcio NCR, SPSS, DaimlerChrysler, OHRA | 6 fases, 24 tarefas genéricas, 42 outputs | Negócio + técnico | Hierarquia em 4 níveis, reference model × user guide, output definido para cada tarefa | De facto; sem manutenção desde 2000 |
| FMDS | 2015 | John B. Rollins (IBM) | 10 | Negócio + estatística/ML | Etapas *Analytic approach*, *Data requirements* e *Feedback* | White paper |
| ASUM / ASUM-DM | 2015 (DM) / 2016 (datasheet) | IBM | 5 + trilha de gestão | Implementação + operação + gestão | Trilha de gestão de projeto (PMI/PRINCE2), fase *Operate & Optimize*, abordagem híbrida ágil/tradicional | Ligado ao ecossistema IBM |
| TDSP | 2016 | Microsoft | 5 | Equipe, colaboração, engenharia | Papéis, execução ágil, repositório e templates padronizados (charter, exit report) | Repositórios arquivados em 12/10/2023; docs removidas em 29/01/2025 |
| CRISP-ML(Q) | 2020 (arXiv) / 2021 (MAKE) | Studer et al. (Mercedes-Benz AG + TU Berlin) | 6 | ML em produção + garantia de qualidade | Metodologia de QA por tarefa (requisitos → riscos → mitigação) e fase de Monitoring & Maintenance | Acadêmico/industrial |
| DMAIC | Six Sigma (Motorola, 1986 [sec.]) | Six Sigma | 5 | Melhoria de processo, estatística | Baseline medido (*Measure*) e sustentação dos ganhos (*Control*) | Usado em LSS; integrado a data mining em estudos de caso |
| DST | 2019 (online) / 2021 (TKDE) | Martínez-Plumed et al. | Mapa com 16 atividades | Ciência de dados exploratória | Trajetórias em vez de sequência; atividades exploratórias e de gestão de dados | Acadêmico |

---

## 1. CRISP-DM 1.0 (Chapman et al., 2000)

### 1.1 Identificação

- Título: *CRISP-DM 1.0: Step-by-step data mining guide*. Autores: Pete Chapman (NCR), Julian Clinton (SPSS), Randy Kerber (NCR), Thomas Khabaza (SPSS), Thomas Reinartz (DaimlerChrysler), Colin Shearer (SPSS) e Rüdiger Wirth (DaimlerChrysler). Copyright 1999–2000; prefácio assinado pelo consórcio em agosto de 2000. [F1]
- Consórcio proprietário do documento: NCR Systems Engineering Copenhagen (EUA e Dinamarca), DaimlerChrysler AG (Alemanha), SPSS Inc. (EUA) e OHRA Verzekeringen en Bank Groep B.V. (Holanda). [F1]
- Histórico: o modelo foi concebido "in late 1996" por três "veterans" (DaimlerChrysler, SPSS/ISL e NCR). Teve financiamento da Comissão Europeia e um Special Interest Group (SIG) que passou de 200 membros, com workshops em Amsterdã, Londres, Nova York e Bruxelas. Foi testado em projetos na Mercedes-Benz e na OHRA, e um rascunho de boa qualidade existia em meados de 1999. [F1]
- O modelo se declara neutro em relação a indústria, ferramenta e aplicação ("industry-, tool- and application-neutral") e diz ter sido construído a partir de "practical, real-world experience", não de forma teórica ou acadêmica. [F1]
- Manutenção: o SIG do CRISP-DM 2.0 foi criado para lançar uma nova versão no fim dos anos 2000, mas "the group was discontinued before the new version could be delivered" [F26]. O site crisp-dm.org está inativo [F30]. Hoje a IBM mantém uma ajuda do CRISP-DM na documentação do SPSS Modeler [F53].

### 1.2 Hierarquia em 4 níveis

Citação do guia [F1, p. 9]: "sets of tasks described at four levels of abstraction (from general to specific): phase, generic task, specialized task and process instance".

| Nível | Definição no guia |
|---|---|
| Phase (fase) | O nível mais alto; cada fase tem várias tarefas genéricas. |
| Generic task (tarefa genérica) | "general enough to cover all possible data mining situations". Deve ser *complete* (cobrir o processo inteiro e todas as aplicações) e *stable* (continuar válida diante de técnicas novas). |
| Specialized task (tarefa especializada) | Descreve como executar a tarefa genérica em situações específicas. Exemplo do guia: *clean data* muda conforme os valores sejam numéricos ou categóricos, e conforme o problema seja clustering ou modelagem preditiva. |
| Process instance (instância de processo) | "a record of the actions, decisions and results of an actual data mining engagement", organizado pelas tarefas dos níveis superiores. |

O próprio guia avisa que a ordem das fases e tarefas "represents an idealized sequence of events". Na prática, muitas tarefas acontecem em outra ordem e é comum voltar a tarefas anteriores. O modelo "does not attempt to capture all of these possible routes". [F1, p. 9]

### 1.3 Reference model × user guide

- Citação [F1, p. 10]: "The reference model presents a quick overview of phases, tasks and their outputs and describes *what* to do in a data mining project. The user guide gives more detailed tips and hints for each phase and each task within a phase and depicts *how* to do a data mining project." O documento cobre os dois no nível genérico.
- O documento tem 5 partes [F1, p. 12]: I, introdução e mapeamento do genérico para o especializado; II, reference model (fases, tarefas genéricas, outputs); III, user guide (conselhos detalhados e checklists); IV, relatórios (outlines e referências cruzadas entre outputs e tarefas); V, apêndice (glossário e tipos de problema).
- O user guide detalha cada output em *Activities* e traz caixas de alerta com os rótulos "Beware!", "Remember!" e "Good idea!". Por exemplo: "Beware of setting unattainable goals" e "Each of the success criteria should relate to at least one of the specified business objectives". [F1, pp. 36–37]

### 1.4 Do genérico ao especializado (contextos)

- O guia define 4 dimensões de *data mining context*: application domain, data mining problem type, technical aspect e tool and technique. [F1, p. 10]
- Há 2 tipos de mapeamento: *mapping for the present* (aplicar o modelo genérico a um projeto só) e *mapping for the future* (escrever um modelo especializado para reutilizar em contextos parecidos). [F1, p. 11]
- A receita de mapeamento: analisar o contexto, remover o que não se aplica, acrescentar o que é específico, especializar o conteúdo genérico e, se ajudar, renomear. [F1, p. 11]

### 1.5 Natureza iterativa (as setas do diagrama)

- No diagrama (Figura 2, conferida visualmente [F1, p. 13]) há setas nos dois sentidos entre Business Understanding e Data Understanding e entre Data Preparation e Modeling. As setas de um sentido só são Data Understanding → Data Preparation, Modeling → Evaluation, Evaluation → Business Understanding e Evaluation → Deployment. Um círculo externo envolve tudo, e um cilindro "Data" fica no centro.
- Citações [F1, p. 13]: "The sequence of the phases is not rigid. Moving back and forth between different phases is always required." / "The arrows indicate the most important and frequent dependencies between phases." / "The outer circle in Figure 2 symbolizes the cyclical nature of data mining itself. Data mining is not over once a solution is deployed."

### 1.6 Fases, tarefas genéricas e outputs (lista completa do reference model)

São 6 fases, 24 tarefas genéricas e 42 outputs. A contagem inclui os 2 outputs que a fase Data Preparation declara no nível da fase. Nomes originais conferidos no texto [F1, pp. 16–34] e na Figura 3 [F1, p. 15].

| Fase | Tarefa genérica (EN → PT-BR) | Outputs (EN → PT-BR) |
|---|---|---|
| 1. Business Understanding (Entendimento do negócio) | 1.1 Determine business objectives (Determinar objetivos de negócio) | Background (Contexto); Business objectives (Objetivos de negócio); Business success criteria (Critérios de sucesso de negócio) |
| | 1.2 Assess situation (Avaliar a situação) | Inventory of resources (Inventário de recursos); Requirements, assumptions and constraints (Requisitos, premissas e restrições); Risks and contingencies (Riscos e contingências); Terminology (Terminologia/glossário); Costs and benefits (Custos e benefícios) |
| | 1.3 Determine data mining goals (Determinar objetivos de mineração) | Data mining goals (Objetivos de DM); Data mining success criteria (Critérios de sucesso de DM) |
| | 1.4 Produce project plan (Produzir plano de projeto) | Project plan (Plano de projeto); Initial assessment of tools and techniques (Avaliação inicial de ferramentas e técnicas) |
| 2. Data Understanding (Entendimento dos dados) | 2.1 Collect initial data (Coletar dados iniciais) | Initial data collection report (Relatório de coleta inicial) |
| | 2.2 Describe data (Descrever dados) | Data description report (Relatório de descrição dos dados) |
| | 2.3 Explore data (Explorar dados) | Data exploration report (Relatório de exploração) |
| | 2.4 Verify data quality (Verificar qualidade dos dados) | Data quality report (Relatório de qualidade) |
| 3. Data Preparation (Preparação dos dados). Outputs da fase: Dataset (Conjunto de dados); Dataset description (Descrição do conjunto) | 3.1 Select data (Selecionar dados) | Rationale for inclusion/exclusion (Justificativa de inclusão/exclusão) |
| | 3.2 Clean data (Limpar dados) | Data cleaning report (Relatório de limpeza) |
| | 3.3 Construct data (Construir dados) | Derived attributes (Atributos derivados); Generated records (Registros gerados) |
| | 3.4 Integrate data (Integrar dados) | Merged data (Dados combinados; inclui agregações) |
| | 3.5 Format data (Formatar dados) | Reformatted data (Dados reformatados) |
| 4. Modeling (Modelagem) | 4.1 Select modeling technique (Selecionar técnica) | Modeling technique (Técnica); Modeling assumptions (Premissas da técnica) |
| | 4.2 Generate test design (Gerar desenho de teste) | Test design (Desenho de teste) |
| | 4.3 Build model (Construir modelo) | Parameter settings (Parametrização); Models (Modelos); Model description (Descrição do modelo) |
| | 4.4 Assess model (Avaliar modelo, do ponto de vista técnico) | Model assessment (Avaliação do modelo); Revised parameter settings (Parametrização revisada) |
| 5. Evaluation (Avaliação) | 5.1 Evaluate results (Avaliar resultados) | Assessment of data mining results w.r.t. business success criteria (Avaliação dos resultados frente aos critérios de sucesso de negócio); Approved models (Modelos aprovados) |
| | 5.2 Review process (Revisar o processo) | Review of process (Revisão do processo) |
| | 5.3 Determine next steps (Determinar próximos passos) | List of possible actions (Lista de ações possíveis); Decision (Decisão) |
| 6. Deployment (Implantação) | 6.1 Plan deployment (Planejar implantação) | Deployment plan (Plano de implantação) |
| | 6.2 Plan monitoring and maintenance (Planejar monitoramento e manutenção) | Monitoring and maintenance plan (Plano de monitoramento e manutenção) |
| | 6.3 Produce final report (Produzir relatório final) | Final report (Relatório final); Final presentation (Apresentação final) |
| | 6.4 Review project (Revisar o projeto) | Experience documentation (Documentação de experiência/lições) |

Notas do guia que importam para o fluxo [F1]:
- Em *Requirements, assumptions and constraints*: "make sure that you are allowed to use the data" (p. 17). Premissas não verificáveis sobre o negócio devem ser listadas "if they form conditions on the validity of the results".
- *Assess model* é a avaliação técnica, feita pelo "data mining engineer". *Evaluate results* é a avaliação contra os objetivos de negócio e cobre também achados que não estavam nos objetivos (pp. 29–30).
- *Review process* inclui garantia de qualidade: "did we correctly build the model? Did we only use attributes that we are allowed to use and that are available for future analyses?" (p. 31).
- *Plan monitoring and maintenance* existe como plano. O guia não define uma fase para executar o monitoramento (p. 33).

### 1.7 Relatórios (Parte IV) e tipos de problema

- A Parte IV descreve relatórios pensados para "communicate the results of a phase to people not involved in this phase". O guia avisa que esses relatórios "are not necessarily identical to the outputs" do reference model. Há outlines para o relatório de Business Understanding e para os relatórios de coleta, descrição, exploração e qualidade, descrição do dataset, modelagem (assumption, test design, model description, model assessment), avaliação e implantação. O Final report traz: resumo do Business Understanding, processo, resultados, avaliação, planos de implantação e manutenção, custo/benefício, conclusões para o negócio e conclusões para DM futuros. A Parte IV também tem um *Summary of dependencies* e um *Project plan template*. [F1, pp. 63–69]
- Tipos de problema (apêndice): data description and summarization, segmentation, concept descriptions, classification, prediction e dependency analysis. [F1, pp. 71–72]

### 1.8 Onde o guia já toca temas "modernos"

- Ética e privacidade: "there may be legal or ethical constraints on the use of the data" e "Capture requirements on security, legal restrictions, privacy". [F1, pp. 38–39]
- Público-alvo: "Do we expect a written report for top management or do we expect a running system that is used by naive end users?". Também: "How should the model and results be presented to senior management/sponsor". E no relatório final: "The actual detailed content of the report depends very much on the audience". [F1, pp. 36, 38, 61]
- Hipóteses: em Explore data, "Form hypothesis and identify actions", "Transform hypothesis into a data mining goal" e "Perform basic analysis to verify the hypothesis". O guia não fala em inferência formal. [F1, p. 45]
- Validação no mundo real: "test the model(s) on test applications in the real application if time and budget constraints permit". [F1, p. 30]

### 1.9 O que é distintivo e qual o foco

É o único modelo clássico que junta objetivos de negócio e objetivos técnicos em dois níveis de critérios de sucesso, define um output para cada tarefa e separa o que fazer (reference model) de como fazer (user guide). Serve de base para quase todos os modelos posteriores [F26]. O foco é negócio + técnico. Não trata papéis, operação contínua nem QA formal (ver seção 11).

---

## 2. KDD: Fayyad, Piatetsky-Shapiro & Smyth (1996)

- Referência: "From Data Mining to Knowledge Discovery in Databases", *AI Magazine* 17(3), p. 37, 1996. DOI 10.1609/aimag.v17i3.1230. [F2]
- O termo "knowledge discovery in databases" foi cunhado no primeiro workshop KDD, em 1989. [F2]
- Definição [F2]: "KDD is the nontrivial process of identifying valid, novel, potentially useful, and ultimately understandable patterns in data". *Data mining* é "a step in the KDD process that consists of applying data analysis and discovery algorithms that ... produce a particular enumeration of patterns (or models) over the data".

### 2.1 Os 9 passos

Primeira frase de cada passo, verbatim do artigo [F2], com tradução:

| # | Passo (EN) | PT-BR | Etapa no diagrama de 5 |
|---|---|---|---|
| 1 | "developing an understanding of the application domain and the relevant prior knowledge and identifying the goal of the KDD process from the customer's viewpoint" | Entender o domínio e o conhecimento prévio; definir o objetivo do ponto de vista do cliente | fora do diagrama ("pré-KDD" [F7]) |
| 2 | "creating a target data set: selecting a data set, or focusing on a subset of variables or data samples" | Criar o conjunto de dados-alvo | Selection |
| 3 | "data cleaning and preprocessing" (ruído, dados faltantes, informação temporal) | Limpeza e pré-processamento | Preprocessing |
| 4 | "data reduction and projection: finding useful features to represent the data" | Redução e projeção (features, dimensionalidade) | Transformation |
| 5 | "matching the goals of the KDD process (step 1) to a particular data-mining method" | Casar o objetivo com o método (sumarização, classificação, regressão, clustering...) | Data Mining (*) |
| 6 | "exploratory analysis and model and hypothesis selection" | Análise exploratória e seleção de modelo e hipótese | Data Mining (*) |
| 7 | "data mining: searching for patterns of interest in a particular representational form" | Mineração propriamente dita | Data Mining |
| 8 | "interpreting mined patterns, possibly returning to any of steps 1 through 7 for further iteration" | Interpretar padrões, com retorno possível a qualquer passo anterior | Interpretation/Evaluation |
| 9 | "acting on the discovered knowledge" (usar, incorporar a sistemas, documentar e reportar; "checking for and resolving potential conflicts with previously believed (or extracted) knowledge") | Agir com base no conhecimento | fora do diagrama ("pós-KDD" [F7]) |

(*) O artigo não diz explicitamente em qual etapa do diagrama entram os passos 5 e 6. A correspondência entre passos e etapas é interpretação minha, compatível com Azevedo & Santos [F7].

### 2.2 A versão em 5 etapas

- A Figura 1 do artigo [F2] tem este fluxo: Data → **Selection** → Target Data → **Preprocessing** → Preprocessed Data → **Transformation** → Transformed Data → **Data Mining** → Patterns → **Interpretation/Evaluation** → Knowledge. Azevedo & Santos [F7] chamam essas 5 etapas de "the five stages of KDD".
- Iteração: "The KDD process is interactive and iterative, involving numerous steps with many decisions made by the user" e "can contain loops between any two steps". A figura mostra só o fluxo básico, não os laços. [F2]
- Ênfase: "Most previous work on KDD has focused on step 7 ... However, the other steps are as important (and probably more so)". [F2]
- Alerta estatístico, que interessa à lacuna de teste de hipóteses: "if one searches long enough in any data set (even randomly generated data), one can find patterns that appear to be statistically significant but, in fact, are not" e "data mining carried out poorly (without regard to the statistical aspects of the problem) is to be avoided". [F2]
- Objetivos de *verification* (verificar a hipótese do usuário) e de *discovery* (achar padrões novos). A noção de *interestingness* combina validade, novidade, utilidade e simplicidade. [F2]

Distintivo: é a formalização acadêmica do processo e o vocabulário de base (padrão, conhecimento, interestingness). Foco em estatística/ML e descoberta. Não tem artefatos nem gestão.

---

## 3. SEMMA (SAS Institute)

- Definição do SAS [F4]: "SEMMA is an acronym used to describe the SAS data mining process. It stands for Sample, Explore, Modify, Model, and Assess". No Enterprise Miner, os nós ficam em abas com esses mesmos nomes.
- As 5 etapas, verbatim do *Getting Started with SAS Enterprise Miner 4.3* [F3]:

| Etapa | Descrição do SAS (EN) | PT-BR | Nós típicos [F4] |
|---|---|---|---|
| Sample | "Sample the data by creating one or more data tables. The sample should be large enough to contain the significant information, yet small enough to process." | Amostrar/particionar | identificar, juntar, particionar e amostrar |
| Explore | "...searching for anticipated relationships, unanticipated trends, and anomalies in order to gain understanding and ideas." | Explorar | gráficos, estatísticas descritivas, variáveis importantes, associação |
| Modify | "...creating, selecting, and transforming the variables to focus the model selection process." | Modificar | variáveis novas, transformações, outliers, imputação, clustering, SOM |
| Model | "...using the analytical tools to search for a combination of the data that reliably predicts a desired outcome." | Modelar | árvores, redes neurais, LARS, SVM, regressões linear e logística |
| Assess | "...evaluating the usefulness and reliability of the findings from the data mining process." | Avaliar | comparar modelos; gráficos de resposta, lift e lucro |

- Iteração: "it might be necessary to repeat one or more of the steps several times". Depois do Assess, "you apply the scoring formula from one or more champion models to new data". [F3]
- Não é uma metodologia de projeto. A Wikipedia [sec.] cita uma página do SAS, hoje só arquivada, que diz que o SEMMA é "rather a logical organization of the functional tool set of" SAS Enterprise Miner "for carrying out the core tasks of data mining" [F5]. Não consegui abrir a página original: a cópia arquivada fica em web.archive.org, que está bloqueado para a ferramenta.
- Ano: não achei o ano de criação em fonte primária. Em fevereiro de 1998 uma análise de mercado já diz que o "Enterprise Miner follows SAS's own sequence of modeling steps, called SEMMA", com o produto em beta desde dezembro de 1997 e lançamento previsto para março de 1998 [F6]. "Criado em 1996": [não verificado].
- Correspondência com KDD segundo Azevedo & Santos (2008) [F7]: Sample ≈ Selection; Explore ≈ Preprocessing; Modify ≈ Transformation; Model ≈ Data Mining; Assess ≈ Interpretation/Evaluation. Os autores dizem que o SEMMA "can be seen as a practical implementation of the five stages of the KDD process".

Distintivo: acompanha a ferramenta passo a passo. Foco técnico e de modelagem. Não cobre negócio nem implantação ([F5, sec.]; [F37]).

---

## 4. Microsoft TDSP (Team Data Science Process)

### 4.1 Identificação e status

- Lançado no Ignite de setembro de 2016, segundo post da própria Microsoft [F13]. O DST data o TDSP de 2016 na Figura 2 e de 2017 no texto [F26]; a fonte primária é a de 2016.
- É descrito como "an agile, iterative, data science methodology" [F12].
- Status atual (verificado):
  - Os repositórios `Azure/Microsoft-TDSP` e `Azure/Azure-TDSP-ProjectTemplate` foram arquivados em 12/10/2023 e estão só para leitura. O README do Microsoft-TDSP diz: "This site is deprecated. Please visit the new site ... https://aka.ms/tdsp". [F9][F12]
  - As páginas no Microsoft Learn foram apagadas no commit `de8687c` ("delete files, create redirects"), de 29/01/2025, no repositório `MicrosoftDocs/architecture-center`. O commit removeu `docs/data-science-process/*` (overview, lifecycle, lifecycle-business-understanding/data/modeling/deployment/acceptance, roles-tasks, entre outros) e redirecionou tudo para `/azure/cloud-adoption-framework/scenarios/ai/plan`. [F14]
  - Hoje tanto `learn.microsoft.com/.../data-science-process/overview` quanto `aka.ms/tdsp` levam a "Plan for AI adoption – Cloud Adoption Framework". Essa página cobre 6 fases de adoção de IA (Strategy, Plan, Ready, Govern, Secure, Manage) e tem uma seção "Implement responsible AI". Não fala em ciclo de vida de projeto de dados. [F15][F54]

### 4.2 Componentes, ciclo de vida e artefatos

- 4 componentes [F9]: "A data science lifecycle definition, A standardized project structure, Infrastructure and resources for data science projects, Tools and utilities for project execution".
- Ciclo de vida segundo o `lifecycle-detail.md`, no repositório arquivado [F8]:

| Estágio (EN → PT-BR) | Objetivos | Artefatos |
|---|---|---|
| Business Understanding (Entendimento do negócio) | "specify the model target(s) as 'sharp' question(s)"; localizar as fontes de dados | Charter Document; Data Sources; Data Dictionaries |
| Data Acquisition and Understanding (Aquisição e entendimento dos dados) | ingerir os dados; "Determine if the data we have can be used to answer the question" | Data Quality Report; Solution Architecture; Checkpoint Decision (seguir, coletar mais dados ou reavaliar) |
| Modeling (Modelagem) | feature engineering; "Construct and evaluate an informative model"; checar se está pronto para produção | Feature Sets; Modeling Report; Checkpoint Decision |
| Deployment (Implantação) | colocar modelo e pipeline em produção ou ambiente equivalente | Status dashboard; Final modeling report; Final solution architecture document |
| Customer Acceptance (Aceite do cliente) | confirmar com o cliente que pipeline, modelo e implantação atendem ao negócio; transferir a operação | Project Final Report (no template, `Exit Report.md`) |

- Papéis:
  - No repositório [F10]: *Group Manager* (gerente de toda a unidade de ciência de dados), *Team Lead*, *Project Lead* e *Project Individual Contributor* (cientistas, analistas, engenheiros e arquitetos que executam o projeto).
  - Martinez et al. (2021) [sec.] citam outro conjunto de 4 papéis por fase do ciclo: solution architect, project manager, data scientist e project lead. [F29]
- Execução ágil [F11]: *work items* dos tipos Feature (um engajamento), User Story (Getting Data, Exploring Data, Generating Features, Building Models, Operationalizing Models, Retraining Models), Task e Bug. Há sprints, branches git por story e por task, pull request com revisão de código, e dashboards em Power BI.
- Estrutura do repositório-template [F12], com os nomes exatos:

```text
Code/
  Data_Acquisition_and_Understanding/
  Modeling/
  Deployment/
Docs/
  Project/          Charter.md · Exit Report.md · System Architecture.docx
  Data_Report/      DataSummaryReport.md · Data Defintion.md · DataPipeline.txt
  Data_Dictionaries/
  Model/            Baseline/ · Model 1/ · FinalReport.md
Sample_Data/        (só amostras pequenas para testar o código)
```

- O README do template diz que, no mínimo, devem existir o Charter e o Exit Report. [F12]
- Seções do Charter: Business background, Scope, Personnel, Metrics (com baseline e forma de medição), Plan, Architecture e Communication. [F12]
- Seções do Exit Report: Overview ("Executive summary of entire solution, brief non-technical overview"), Business Domain, Business Problem, Data Processing, Modeling/Validation, Solution Architecture, Benefits (para a empresa e para o cliente), Learnings, Links, Next Steps e Appendix. [F12]
- Utilitários: IDEAR ("Interactive Data Exploration and Reporting"), que gera o relatório padronizado da exploração, e AMAR ("Automated Modeling and Reporting"). [F13]

Distintivo: papéis definidos, execução ágil, estrutura de repositório e templates, e um estágio formal de aceite do cliente. Foco em equipe, colaboração e engenharia. Crítica: "Excessive dependence on Microsoft tools and technologies", e o papel do cientista de dados fica limitado a clonar repositórios e executar o projeto [F29, sec.].

---

## 5. IBM ASUM e ASUM-DM (Analytics Solutions Unified Method)

- ASUM-DM (*for Data Mining/Predictive Analytics*) foi apresentado pela IBM em outubro de 2015 como refinamento e extensão do CRISP-DM ([F17, sec.]). O DST também data o ASUM-DM de 2015 [F26]. O post original da IBM retorna 404.
- O DST descreve o ASUM-DM como uma metodologia "which refines and extends CRISP-DM, adding infrastructure, operations, deployment and project management sections as well as templates and guidelines, personalised for IBM's practices". [F26]
- O datasheet público do ASUM genérico (IBM, 1º de março de 2016, código AS00082-USEN-00) [F16] traz as fases e as descrições da tabela abaixo.

| Fase (EN → PT-BR) | Descrição IBM |
|---|---|
| Analyze (Analisar) | "Define what the solution needs to accomplish, both in terms of features and non-functional attributes ... Obtain agreement between all parties about these requirements." |
| Design (Projetar) | "Define all solution components and their dependencies, identify resources, and install a development environment. Iterative Prototyping Sprints are used when applicable" |
| Configure & Build (Configurar e construir) | "Configure, build, and integrate components based on an Iterative and incremental approach. Utilizes multi-environment testing and validation plan based on the V-model." |
| Deploy (Implantar) | "Create a plan to run and maintain the solution, including a support schedule. Migrate to Production ... and communicate the deployment to the business user audience." |
| Operate & Optimize (Operar e otimizar) | "Operate includes the maintenance tasks and checkpoints after roll out that facilitate a successful employment of the solution and preserve its health." |
| Project Management (trilha transversal) | "Consists of processes which assist with managing and monitoring the progress and maintenance of the project." |

- Outras características do datasheet [F16]:
  - Tem "cross-product/solution project management stream that is aligned to PMI ... and PRINCE2".
  - Usa um "hybrid Agile and Traditional implementation approach", com sprints de prototipação e desenvolvimento iterativo e incremental.
  - Usa o V-model para validação e testes, e é apresentado na interface Rational Method Composer.
  - Diz que "each phase is overseen by a project management stream".
- Uma fonte secundária diz que a parte de desenvolvimento do ASUM-DM segue o CRISP-DM e que a implantação ganha "collaboration, version control, security, and compliance" [F18, sec.].
- A lista fina de tarefas do ASUM-DM e o encaixe exato das tarefas do CRISP-DM em cada fase ASUM: [não verificado]. O material detalhado não estava acessível publicamente.

Distintivo: trilha de gestão de projeto paralela às fases, fase de operação pós-implantação e templates. Foco em implementação corporativa e gestão.

---

## 6. IBM Foundational Methodology for Data Science (FMDS), John B. Rollins, 2015

- White paper da IBM Analytics, junho de 2015 (código IMW14828-USEN-00). Autor: John B. Rollins, Ph.D. [F19]
- Definição adotada pelo autor: "A methodology is a general strategy that guides the processes and activities within a given domain. Methodology does not depend on particular technologies or tools, nor is it a set of techniques or recipes." [F19]
- Diferenciais declarados pelo autor: "very large data volumes, the incorporation of text analytics into predictive modeling and the automation of some processes". Distingue a abordagem *top-down* (primeiro o problema) da *bottom-up* (os dados sugerem o objetivo) e declara que a metodologia adota a top-down. [F19]

| # | Etapa (EN → PT-BR) | Frase-chave [F19] |
|---|---|---|
| 1 | Business understanding (Entendimento do negócio) | os sponsors definem "the problem, project objectives and solution requirements"; devem ficar envolvidos "throughout the project" |
| 2 | Analytic approach (Abordagem analítica) | "expressing the problem in the context of statistical and machine-learning techniques" |
| 3 | Data requirements (Requisitos de dados) | "The chosen analytic approach determines the data requirements." |
| 4 | Data collection (Coleta de dados) | identificar e reunir dados estruturados, não estruturados e semiestruturados; se houver lacunas, rever os requisitos |
| 5 | Data understanding (Entendimento dos dados) | estatística descritiva e visualização para "assess data quality and discover initial insights" |
| 6 | Data preparation (Preparação) | limpeza, integração, feature engineering, text analytics; "usually the most time-consuming step" |
| 7 | Modeling (Modelagem) | modelos preditivos ou descritivos "according to the previously defined analytic approach" |
| 8 | Evaluation (Avaliação) | conjuntos de teste e validação; "data scientists may assign statistical significance tests to the model as further proof of its quality" |
| 9 | Deployment (Implantação) | depois da aprovação dos sponsors; "Usually it is deployed in a limited way until its performance has been fully evaluated" |
| 10 | Feedback (Retroalimentação) | "the organization gets feedback on the model's performance and its impact on the environment"; refinar e reimplantar, possivelmente de forma automatizada |

- Laços do diagrama (Figura 1, conferida visualmente [F19]):
  - Setas nos dois sentidos: Data requirements ↔ Data collection, Data collection ↔ Data understanding, Data preparation ↔ Modeling e Modeling ↔ Evaluation.
  - Retornos: Data preparation → Data collection e Feedback → Modeling.
  - Sequência sem retorno: Business understanding → Analytic approach → Data requirements; Data understanding → Data preparation; e Evaluation → Deployment → Feedback.

Distintivo: explicita a abordagem analítica e os requisitos de dados antes da coleta, e fecha o ciclo com Feedback. Foco em negócio + estatística/ML. Críticas [F29, sec.]: é difícil escolher a abordagem analítica antes de explorar os dados; não define papéis; tem "zero concerns on reproducibility, knowledge accumulation and data security".

---

## 7. CRISP-ML(Q): Studer et al. (2021)

- Referência: Studer, Bui, Drescher, Hanuschkin, Winkler, Peters, Müller, "Towards CRISP-ML(Q): A Machine Learning Process Model with Quality Assurance Methodology". Primeira versão no arXiv em 11/03/2020 (2003.05155) e v2 em 24/02/2021 [F20]. Publicado em *Machine Learning and Knowledge Extraction* 3(2):392–413, em 22/04/2021, DOI 10.3390/make3020020 (conferido no Crossref; o site da MDPI retornou 403) [F20].
- Autores ligados à Mercedes-Benz AG (Group Research) e à TU Berlin. Declara ser "industry and application neutral". [F20]
- Motivação [F20]: o CRISP-DM "does not cover the application scenario of ML models inferring real-time decisions over a long period of time", e o problema "more worrying" é que ele "lacks guidance on quality assurance methodology".

### 7.1 As 6 fases e as tarefas principais

| Fase (EN → PT-BR) | Tarefas e métodos de QA [F20] |
|---|---|
| Business and Data Understanding (Entendimento do negócio e dos dados) | Define the Scope of the ML Application; Success Criteria em 3 níveis (business, ML e economic/KPI); Feasibility (aplicabilidade da técnica, restrições legais, requisitos de robustez, escalabilidade, explicabilidade e recursos); Data Collection (com *data version control*); Data Quality Verification (descrição, requisitos de dados documentados como *schema*, verificação); Review of Output Documents |
| Data Preparation (Preparação) | Select Data (feature selection dentro da validação cruzada, seleção de amostras, classes desbalanceadas); Clean Data (ruído, imputação); Construct Data (feature engineering, data augmentation); Standardize Data (formato de arquivo, normalização com os mesmos parâmetros no treino e no teste) |
| Modeling (Modelagem) | revisão de literatura; métricas de qualidade do modelo em 6 dimensões; seleção começando por modelos de menor capacidade ("baseline"); conhecimento de domínio validado isoladamente; treino; dados não rotulados e modelos pré-treinados; compressão; ensembles; *Assure reproducibility* (de método, de resultado e documentação experimental) |
| Evaluation (Avaliação) | Validate performance (*test set* bloqueado, "never shipped to any partner", e análise de desempenho por fatia); Determine robustness; Increase explainability (para quem pratica ML e para o usuário final); Compare results with defined success criteria (com possível revisão da FMEA) |
| Deployment (Implantação) | Define inference hardware; Model evaluation under production condition (de forma incremental); Assure user acceptance and usability (teste de campo, guia de uso e disclaimer); Minimize the risks of unforeseen errors (plano de fallback e *safety cages*); Deployment strategy (incremental) |
| Monitoring and Maintenance (Monitoramento e manutenção) | causas de degradação (distribuição não estacionária, desgaste de hardware, atualizações de sistema); *Monitor* (estatísticas de entrada e de predição contra o treino, validação por schema, limiares); *Update* (retreino ou fine-tuning, reavaliação antes de reimplantar); módulo de A/B testing e fallback; possível treino e implantação contínuos |

- Por que Business e Data Understanding viraram uma fase só: "these two activities, which are separate in CRISP-DM, are strongly intertwined, since business objectives can be derived or changed based on available data". [F20]
- As 6 medidas de qualidade de modelo (Tabela 2 de [F20]): Performance, Robustness, Scalability, Explainability, Model Complexity e Resource Demand. O artigo acrescenta que "fairness ... or trust might have to be assessed".

### 7.2 A metodologia de QA (Figura 2 de [F20])

Fluxo aplicado a cada tarefa de cada fase:
1. Start phase.
2. Define requirements and constraints.
3. Instantiate step and task.
4. Identify risks.
5. Se os riscos não são aceitáveis ("risks feasible?" = não): Choose quality assurance method, depois Mitigate risks, e o laço se repete.
6. Com os riscos aceitáveis: se a fase não terminou, volta para a próxima tarefa; se terminou, começa a próxima fase.

Citação: "If risks aren't feasible, appropriate quality assurance methods are chosen to mitigate risks in an iterative approach using guidelines and checklists." [F20]

- Limites declarados: "not designed for safety-critical systems". Restrições legais ficam "beyond the scope", embora o artigo cite fairness e trust. [F20]

Distintivo: QA orientado a risco em cada tarefa, uma fase de monitoramento e manutenção, e reprodutibilidade tratada como tarefa. Foco em ML em produção e qualidade.

---

## 8. DMAIC (Six Sigma) aplicado a dados e analytics

- Origem [sec.]: o Six Sigma foi "introduced by American engineer Bill Smith while working at Motorola in 1986", e a GE o tornou central em 1995, com Jack Welch [F22]. O DST [F26] diz "In 1996 Motorola developed the 6σ approach", uma data que diverge da Wikipedia; a turma deve conferir antes de citar.
- Definição [sec.]: DMAIC "refers to a data-driven improvement cycle used for optimizing and stabilizing business processes and designs" [F21].

| Fase (EN → PT-BR) | Propósito ([F21], sec.) |
|---|---|
| Define (Definir) | "clearly pronounce the business problem, goal, potential resources, project scope, and high-level project timeline" |
| Measure (Medir) | "a data collection step, the purpose of which is to establish process performance baselines" |
| Analyze (Analisar) | "identify, validate and select a root cause for elimination" |
| Improve (Melhorar) | "identify, test and implement a solution to the problem" |
| Control (Controlar) | "embed the changes and ensure sustainability ... making the change 'stick'" |

Aplicação a projetos de dados:
- Fahmy, Mohamed & Yousef (ICENCO 2017): propõem um "experimentation framework that integrates ... CRISP-DM ... with the phases Define-Measure-Analyze-Improve-Control", aplicado a *trouble tickets* em uma operadora de telecom do Oriente Médio. [F24]
- Pongboonchai-Empl et al. (*Production Planning & Control*, 2023): revisão sistemática com "quantitative analysis of 692 papers and an in-depth analysis of 41 papers". Concluem que "'Analyze' is by far the best-supported DMAIC's phase through techniques, such as Data Mining, Machine Learning, Big Data Analytics, Internet of Things, and Process Mining", e propõem um framework DMAIC I4.0. [F23]
- Referência conceitual sobre DMAIC como método de resolução de problemas: De Mast & Lokkerbol (2012), *Int. J. Production Economics* 139(2):604–614. Só os metadados foram verificados (OpenAlex); o conteúdo está [não verificado] [F25].
- O DST coloca o 6σ entre as abordagens que influenciaram o ecossistema de processos de DM [F26].

Distintivo em relação aos modelos de DM: exige um baseline medido antes de analisar (Measure) e uma fase para sustentar o ganho (Control, com cartas de controle). Foco em melhoria de processo e estatística. A pergunta é orientada a causa-raiz, não a um modelo preditivo.

---

## 9. Martínez-Plumed et al.: "CRISP-DM Twenty Years Later" e o mapa DST

- Referência: Martínez-Plumed, Contreras-Ochando, Ferri, Hernández-Orallo, Kull, Lachiche, Ramírez-Quintana e Flach. *IEEE Transactions on Knowledge and Data Engineering* 33(8):3048–3061, agosto de 2021, DOI 10.1109/TKDE.2019.2962680 (conferido no Crossref). A versão aceita (AAM) foi lida no repositório da Universidade de Bristol. [F26]
- Tese central [F26]:
  - "if the project is goal-directed and process-driven the process model view still largely holds", mas projetos exploratórios pedem "a more flexible model".
  - Data mining "is goal-oriented and concentrates on the process", enquanto a ciência de dados é "data-oriented and exploratory". Em metáfora: data mining é mineração, ciência de dados é prospecção.
- O mapa DST (Figura 3) não tem setas. O próprio artigo ressalta: "there are no arrows here, because the activities are not to be taken in any pre-determined order". [F26]

| Anel | Atividades (EN → PT-BR) |
|---|---|
| Externo: exploratórias | Goal exploration (objetivos atingíveis com dados); Data source exploration (fontes novas); Data value exploration (que valor extrair); Result exploration (ligar resultados a objetivos); Narrative exploration (histórias visuais e textuais); Product exploration (transformar o valor em serviço ou app) |
| Interno: CRISP-DM (orientadas a objetivo) | Business Understanding, Data Understanding, Data Preparation, Modelling, Evaluation, Deployment |
| Núcleo: gestão de dados | Data acquisition (obter ou criar dados, p. ex. sensores e apps); Data simulation (simular sistemas, perguntas do tipo *what-if*); Data architecting (desenho lógico e físico, integração); Data release (disponibilizar via bancos, interfaces, visualizações) |

- Trajetória: "an acyclic directed graph over activities". A notação usa transições numeradas de 0 a N; números iguais indicam paralelismo; círculos marcam atividades exploratórias, quadrados arredondados as do CRISP-DM e cilindros as de gestão de dados. [F26]
- Evidência:
  - 7 casos ilustrativos (entre eles recomendador turístico, simulador de poluição e perfil de motoristas) e 51 casos do NIST Big Data Public Working Group.
  - Nos 51 casos do NIST "we did not find any activity that is not represented in Figure 3", e "nearly half" caem só na região de gestão de dados. Pela Figura 13, parecem ser 23 de 51, mas essa leitura é minha. [F26]
- Uso proposto: classificar o projeto como exploratório, CRISP-DM (orientado a objetivo) ou de gestão de dados, com diagrama de Venn. Isso ajuda a estimar custo e equipe: mais exploração pede cientistas mais seniores, mais gestão de dados pede engenheiros. [F26]
- Atividades de ciência de dados que o CRISP-DM não cobre, segundo o artigo [F26]:
  - as 6 atividades exploratórias;
  - as 4 de gestão de dados (o CRISP-DM tratava "data" como "a static disk cylinder");
  - produtos de dados ("data-driven products");
  - inferência causal com geração de dados, por experimentos randomizados ou simulação;
  - o artigo também reconhece que "the trajectory model does not yet explicitly address all the ethical and legal issues".
- Automação [F26]: a modelagem já está bem automatizada (AutoML), mas data wrangling e implantação "are still escaping automation". Os passos exploratórios dependem de habilidades como contar histórias com os dados, e o artigo julga que isso está "far from the capabilities that AI provides today". A escrita é de 2019–2021, antes dos LLMs atuais.

Distintivo: troca a sequência por uma trajetória e explicita atividades exploratórias e de engenharia de dados. Foco na diversidade de projetos. É descritivo, não prescritivo ("exemplary rather than prescriptive").

---

## 10. Adoção (só números encontrados em fonte aberta)

### 10.1 Enquetes KDnuggets

Todas as páginas da KDnuggets retornaram 403 para a ferramenta e para acesso direto. Os números de 2007 e 2014 abaixo vêm de fontes secundárias abertas, que concordam entre si.

| Ano | CRISP-DM | Metodologia própria | SEMMA | KDD Process | Outras | Fonte aberta |
|---|---|---|---|---|---|---|
| 2007 | 42% | 19% | 13% | 7,3% | "other non-domain specific" 4%; outras 5,3% | Selamat et al. [F27, sec.]; Leidner [F28, sec.]: 42%, 13%, ~7% |
| 2014 | 43% | 27,5% | 8,5% | 7,5% | "other non-domain specific" 8%; outras 5,5% | Selamat et al. [F27, sec.]; Martinez et al. 2021 [F29, sec.]: 43%; Leidner [F28, sec.] |

- As fontes secundárias dão tamanhos de amostra diferentes: Selamat et al. falam em 200 respondentes por enquete; Leidner fala em "total N = 200"; o Data Science PM fala em 150–200 por enquete [F32, sec.]. A linha de 2007 não fecha 100% na fonte secundária porque algumas categorias foram omitidas.
- O CRISP-DM foi a metodologia mais usada nas quatro enquetes (2002, 2004, 2007 e 2014), segundo CASP-DM [F30] e DST [F26].
- Martinez et al. [F29, sec.] citam Piatetsky (KDnuggets, 2014): "CRISP-DM remains the most popular methodology ... with 43% share ... but a replacement for unmaintained CRISP-DM is long overdue".
- 2002 e 2004: [não verificado]. Resumos de busca atribuem ao CRISP-DM 51% em 2002 (n≈189) e 42% em 2004 (n≈170), mas não consegui abrir nenhuma fonte com esses números. Uma página acadêmica secundária cita "41%" para 2004 com base em Mariscal et al. (2010), o que é uma divergência. É preciso conferir nos originais: `kdnuggets.com/polls/2002/methodology.htm` e `kdnuggets.com/polls/2004/data_mining_methodology.htm`.

### 10.2 Levantamentos mais recentes

| Estudo | Amostra | Achado | Fonte |
|---|---|---|---|
| Saltz, Hotz, Wild & Stirling (AMCIS 2018) | cientistas de dados (survey) | "82% of the data scientists surveyed did not follow an explicit process"; "85% ... thought that adopting an improved process methodology would improve the teams' results" | [F33] |
| Data Science PM (Data Science Process Alliance), enquete no site | n = 109 | "nearly half of the respondents most commonly use CRISP-DM", seguido de Scrum, Kanban e "My Own". O site admite que "this poll is probably not a representative sample" | [F31]; Lahiri & Saltz [F34] citam o texto como Saltz (2022) |
| Corinium (2020), citado pelo Data Science PM | [não verificado] | "only 48% of data science organizations have established standardized processes" | [F31, sec.] |
| Lahiri & Saltz (HICSS-56, 2023) | 16 organizações (entrevistas) | "62% of the organizations reported using an agile framework, none actually followed the Scrum Guide (or any other published framework)"; as demais usavam processo ad hoc ou proprietário | [F34] |
| Plotnikova, Dumas & Milani (PeerJ CS, 2020) | 207 publicações (peer-reviewed + literatura cinzenta) | metodologias "primarily applied 'as-is'"; adaptações em crescimento (a maioria *modifications*, depois *extensions*), com dois propósitos: tecnológico (Big Data) e organizacional (integração a processos e TI) | [F36] (resumo via Europe PMC) |
| Shimaoka, Ferreira & Goldman (SBC Reviews, 2024) | 16 estudos (SLR) | padrões de adaptação do CRISP-DM: "phase addition, phase modification, features and tools addition, and integration with other approaches"; poucos estudos sobre agilidade em DS | [F37] |
| Saltz, Shamshurin & Crowston (HICSS-50, 2017), experimento controlado com estudantes | 4 condições | nota média de qualidade do projeto (1–10): CRISP 8,4; Agile Kanban 7,8; Baseline 7; Agile Scrum 6,5. Os times CRISP "were the last to start coding" e demoraram a entender os desafios de código. Os times sem método "started to work in a CRISP-like methodology" | [F35] |

---

## 11. Críticas documentadas ao CRISP-DM e o que veio depois

| # | Crítica | Fonte | Quem cobre depois |
|---|---|---|---|
| 1 | A sequência é idealizada, na prática "waterfall ... with backtracking", e há pouca orientação sobre quando voltar a uma fase | o próprio guia [F1, p. 9]; Studer et al. [F20]; Lahiri & Saltz: "provides little guidance on how to know when to loop back" [F34] | DST (trajetórias explícitas) [F26]; TDSP e ASUM (iteração ágil) [F8][F16] |
| 2 | Não diz como a equipe se organiza nem trata gestão de equipe; precisa de integração com gestão e métodos ágeis e de "method guidance" além de checklists | Martinez et al. 2021 [F29], citando Grady (2016) [sec.] | TDSP (papéis e sprints) [F10][F11]; ASUM (trilha de gestão) [F16]; Domino [F38] |
| 3 | Está desatualizado e sem manutenção: o SIG 2.0 foi descontinuado e o site saiu do ar | [F26]; [F30]; Piatetsky via [F29, sec.] | nenhum substituto oficial; derivados como CRISP-ML(Q) e CASP-DM |
| 4 | Não cobre ML operando por longo tempo: monitoramento e manutenção existem só como plano, e o drift não é tratado | Studer et al. [F20]; guia [F1, p. 33] | CRISP-ML(Q) (fase 6); ASUM (Operate & Optimize); FMDS (Feedback); Google MLOps (níveis 1–2) [F41]; DMAIC (Control) |
| 5 | Falta metodologia de garantia de qualidade | Studer et al. [F20] | CRISP-ML(Q) [F20]; DataOps ("Quality is paramount", "Start With Data Testing") [F42] |
| 6 | Pouca atenção à implantação como produto de software integrado a TI e processos | Plotnikova et al. [F36] | ASUM-DM [F26]; TDSP [F8]; MLOps [F41] |
| 7 | Pressupõe objetivo claro e dados já coletados; não comporta exploração de objetivos e fontes, produtos de dados, simulação e causalidade, nem engenharia de dados | Martínez-Plumed et al. [F26] | DST [F26] |
| 8 | Não trata grande escala, dados não estruturados (texto) nem aspectos "legal, ethical, project managerial" | Leidner (D2V) [F28] | D2V [F28]; FIN-DM (fase de *Compliance* e GDPR) [F37] |
| 9 | Rígido e com documentação pesada ("Nearly every task has a documentation step") | Data Science PM [F32, sec.]. Contraponto empírico: CRISP teve a melhor nota de projeto no experimento de Saltz et al. [F35] | TDSP (templates enxutos, mínimo charter + exit report) [F12]; Agile DS [F40] |
| 10 | Nenhum dos modelos permite prever o tempo de cada fase ou do projeto | Leidner [F28] (vale para todos os modelos, não só CRISP-DM) | DST sugere estimar custo por região do diagrama de Venn e por trajetórias análogas [F26] |
| 11 | O SEMMA é ainda mais restrito: não cobre negócio nem implantação e é preso à ferramenta | [F5, sec.]; [F37] | CRISP-DM e posteriores |

---

## 12. Outros frameworks que valem menção curta

| Framework | Ano / autoria | Fases e ideia central | Distintivo | Fonte |
|---|---|---|---|---|
| Domino Data Science Lifecycle | white paper de 2017 (citado como "Managing Data Science Teams" em [F29]); Domino Data Lab | White paper: Ideation → Data Acquisition and Exploration → Research and Development → Validation → Delivery → Monitoring ([F39], [F29], sec.). O *field guide* atual lista 7 estágios e acrescenta *Artifact Selection* [F38] | Princípios: "Expect and embrace iteration", "Enable compounding collaboration", "Anticipate auditability needs" [F38]. A Validation exige sign-off do negócio, de um eventual time de validação de modelos, de TI e, "increasingly, legal or compliance" [F38]. Preservar resultados nulos [F29, sec.]. Não é excludente com CRISP-DM e TDSP ("a la carte") [F39] | [F38][F39][F29] |
| Agile Data Science 2.0 | Russell Jurney; O'Reilly, 2017 (early release 2016) [F40] | Manifesto com 7 princípios: "Iterate, iterate, iterate"; "Ship intermediate output. Even failed experiments have output"; "Prototype experiments over implementing tasks"; "Integrate the tyrannical opinion of data in product management"; "Climb up and down the data-value pyramid"; "Discover and pursue the critical path to a killer product"; "Get Meta. Describe the process, not just the end-state" | *Data-value pyramid*: Records → Charts → Reports → Predictions → Actions. Trata o produto de dados como saída preferencial [F40]. Crítica: não se ocupa de "data security and privacy", nem propõe "methods for results evaluation" [F29, sec.] | [F40] (página do livro e slides do autor); o texto da O'Reilly retornou 403 |
| Google: MLOps, CD e pipelines de automação em ML | Google Cloud Architecture Center (última atualização 28/08/2024) | Passos: data extraction, data analysis, data preparation, model training, model evaluation, model validation, model serving, model monitoring. Nível 0: "Every step is manual". Nível 1: "The model is automatically trained in production using fresh data" (continuous training). Nível 2: CI/CD de pipelines | Maturidade medida pela automação; "Only a small fraction of a real-world ML system is composed of the ML code" | [F41] |
| DataOps Manifesto | DataKitchen (mantenedor; "30,000+ have signed"). Ano: [não verificado] (buscas indicam 2017) | 18 princípios, entre eles "Analytics is code", "Make it reproducible", "Quality is paramount", "Monitor quality and performance", "Reduce heroism". A versão atual traz um "+1. Start With Data Testing" | Aplica ágil, lean e controle estatístico de processo a pipelines analíticos | [F42] |
| PPDAC | MacKay & Oldford (1994), adaptado por Wild & Pfannkuch, *International Statistical Review* 67(3):223–265, 1999 | Problem → Plan (sistema de medição, desenho amostral, gestão de dados, piloto) → Data (coleta, gestão, limpeza) → Analysis (exploração, análises planejadas e não planejadas, geração de hipóteses) → Conclusions (interpretação, conclusões, ideias novas, comunicação) | Ciclo investigativo estatístico. Tem um ciclo interrogativo (Generate, Seek, Interpret, Criticise, Judge) com "Check against reference points: internal, external". É a referência mais próxima de teste de hipóteses e validação externa | [F43] (figura conferida visualmente) |
| CASP-DM | Martínez-Plumed et al., arXiv 2017 | Extensão do CRISP-DM para mudança de contexto e reuso de modelo, "backward compatible" | Antecipa mudanças de contexto em todas as fases | [F30] |
| RAMSYS | Moyle (via [F29], sec.) | Estende o CRISP-DM para equipes remotas. Papéis: modellers, data master, management committee | "Information vault" e "hypothesis investment account" (hipótese, evidência de refutação ou corroboração, refinamento) | [F29] |
| Microsoft CAF: Plan for AI adoption | Microsoft (documentação que substituiu as URLs do TDSP) | Strategy, Plan, Ready, Govern, Secure, Manage | Nível de programa e portfólio, não de projeto analítico. Tem uma seção "Implement responsible AI" | [F54] |
| NIST AI RMF 1.0 + Generative AI Profile | NIST; 26/01/2023; NIST-AI-600-1 em 26/07/2024 | Funções Govern, Map, Measure, Manage | Gestão de risco de IA, generativa inclusive. Complementa (não substitui) um processo de análise | [F47] |
| Model Cards e Datasheets for Datasets | Mitchell et al., FAT* 2019; Gebru et al., CACM dez/2021 | artefatos de documentação | Comunicação e ética: desempenho por grupo demográfico; motivação, composição, coleta e usos recomendados do dataset | [F50][F51] |
| OSEMN | Mason & Wiggins (2010) | Obtain, Scrub, Explore, Model, iNterpret | [não verificado]: o site original (dataists.com) tem certificado inválido | — |
| CRISP-DM0 | Heath & McGregor (2010) | extensão do CRISP-DM para "null hypothesis driven confirmatory data mining" | [não verificado]: só a referência, citada por Studer et al. [F20]; não abri o artigo | [F20] |

---

## 13. (a) Matriz de correspondência

Critérios de alinhamento: KDD, SEMMA e CRISP-DM seguem Azevedo & Santos (2008) [F7]. CRISP-ML(Q) × CRISP-DM segue a Tabela 1 de Studer et al. [F20]. As demais células são alinhamento interpretativo meu, feito a partir das descrições das fontes. "—" quer dizer que o framework não cobre a etapa explicitamente.

Atenção a um detalhe: Azevedo & Santos alinham SEMMA *Explore* com KDD *Preprocessing* e tratam Data Understanding como Selection + Preprocessing [F7]. A matriz abaixo coloca *Explore* em "exploração" pelo conteúdo descrito pelo SAS [F3].

### 13.1 Frameworks clássicos e corporativos

| Etapa comum | CRISP-DM | KDD (passos → etapas) | SEMMA | FMDS (IBM) | TDSP | ASUM-DM |
|---|---|---|---|---|---|---|
| Entendimento do problema | Business Understanding (1.1–1.3) | Passo 1 (pré-KDD) | — | 1 Business understanding; 2 Analytic approach | Business Understanding (charter, "sharp questions") | Analyze |
| Coleta/aquisição | 2.1 Collect initial data | Passo 2 → Selection | Sample | 3 Data requirements; 4 Data collection | Data Acquisition and Understanding (ingestão, pipeline) | tarefas equivalentes às do CRISP-DM [encaixe fino não verificado] |
| Entendimento/exploração | 2.2 Describe; 2.3 Explore; 2.4 Verify data quality | Passo 3 (parte) → Preprocessing; passo 6 (exploratória) | Explore | 5 Data understanding | Data Acquisition and Understanding (Data Quality Report, IDEAR) | idem |
| Preparação | Data Preparation (3.1–3.5) | Passos 3–4 → Preprocessing / Transformation | Modify | 6 Data preparation | Modeling (feature engineering) | idem |
| Modelagem | Modeling (4.1–4.3) | Passos 5–7 → Data Mining | Model | 7 Modeling | Modeling | Configure & Build |
| Avaliação | 4.4 Assess model (técnica) + Evaluation 5.1–5.3 (negócio, revisão, decisão) | Passo 8 → Interpretation/Evaluation | Assess | 8 Evaluation | Modeling (checkpoint) + Customer Acceptance | Configure & Build (V-model) |
| Implantação/entrega/comunicação | 6.1 Plan deployment; 6.3 Final report e Final presentation | Passo 9 (pós-KDD) | — (scoring de champion models depois do Assess) | 9 Deployment | Deployment | Deploy |
| Monitoramento/feedback | 6.2 Plan monitoring and maintenance (só plano); círculo externo | — | — | 10 Feedback | Deployment (telemetria, status dashboard) | Operate & Optimize |
| Gestão de projeto | 1.4 Produce project plan; 5.2 Review process; 6.4 Review project | — | — | — | papéis, work items, sprints, repositório padrão | trilha Project Management (PMI/PRINCE2) |

### 13.2 Frameworks de ML, qualidade e exploração

| Etapa comum | CRISP-ML(Q) | DMAIC | DST | Domino | Google MLOps | PPDAC |
|---|---|---|---|---|---|---|
| Entendimento do problema | Business & Data Understanding (escopo, critérios de negócio, ML e econômicos, viabilidade) | Define | Goal exploration; Business Understanding | Ideation (com ROI) | — | Problem |
| Coleta/aquisição | B&DU: Data Collection (versionamento) | Measure (coleta, baseline) | Data source exploration; Data acquisition; Data simulation | Data Acquisition and Exploration | Data extraction | Plan (medição, amostragem) + Data (coleta) |
| Entendimento/exploração | B&DU: Data Quality Verification (schema) | Measure / Analyze | Data value exploration; Data Understanding | idem | Data analysis | Analysis (exploração) |
| Preparação | Data Preparation (select, clean, construct, standardize) | — (implícito) | Data Preparation; Data architecting | idem | Data preparation | Data (gestão, limpeza) |
| Modelagem | Modeling (+ reprodutibilidade) | Analyze (causa-raiz) | Modelling | Research and Development | Model training | Analysis (planejada e não planejada; geração de hipóteses) |
| Avaliação | Evaluation (desempenho em test set bloqueado, robustez, explicabilidade, critérios) | Improve (testar a solução) | Evaluation; Result exploration | Validation (sign-off, inclusive legal/compliance) | Model evaluation; Model validation | Conclusions (interpretação) |
| Implantação/entrega/comunicação | Deployment (incremental, aceitação do usuário, fallback) | Improve (implementar) | Deployment; Product exploration; Narrative exploration; Data release | Delivery | Model serving | Conclusions (comunicação) |
| Monitoramento/feedback | Monitoring and Maintenance (monitor → update) | Control | — (sem atividade própria) | Monitoring | Model monitoring; continuous training (níveis 1–2) | novo ciclo PPDAC |
| Gestão de projeto | QA por tarefa (requisitos → riscos → mitigação) | Define (escopo, recursos, cronograma) | trajetórias mapeadas em plano (prazos por transição) | princípios; backlog de stakeholders | níveis de maturidade 0–2 | — |

---

## 14. (b) Princípios convergentes

| # | Princípio | Frameworks que sustentam (âncora) |
|---|---|---|
| 1 | Começar pelo problema e traduzi-lo em objetivo analítico ou técnico | CRISP-DM (1.1 → 1.3); KDD (passo 1); FMDS (1 → 2); TDSP ("sharp questions"); ASUM (Analyze); CRISP-ML(Q) (escopo); DMAIC (Define); Domino (Ideation); PPDAC (Problem). Exceção: SEMMA. O DST admite que o objetivo seja descoberto (goal exploration) |
| 2 | Critérios de sucesso explícitos, mensuráveis e em mais de um nível, definidos antes de modelar | CRISP-DM (business × DM success criteria); CRISP-ML(Q) (business, ML e econômico); TDSP (Metrics com baseline, no Charter); DMAIC (baseline em Measure); Domino (success criteria e ROI) |
| 3 | Avaliar viabilidade, riscos e custo-benefício cedo, com pontos de decisão go/no-go | CRISP-DM (Risks and contingencies; Costs and benefits; 5.3 Decision); CRISP-ML(Q) (Feasibility; parar se a amostra for insuficiente); TDSP (Checkpoint Decisions); ASUM (protótipos confrontados com os requisitos) |
| 4 | Entender os dados antes de modelar: descrever, explorar, verificar qualidade | CRISP-DM (fase 2); KDD (2–3, 6); SEMMA (Explore); FMDS (5); TDSP (Data Quality Report); CRISP-ML(Q) (Data Quality Verification); Google MLOps (data analysis); DataOps ("Start With Data Testing") |
| 5 | Preparação de dados como fase própria, iterativa, com decisões justificadas | CRISP-DM (3.1 Rationale for inclusion/exclusion; 3.2 Data cleaning report); KDD (3–4); SEMMA (Modify); FMDS (6, "most time-consuming"); CRISP-ML(Q) (documentar descartes, comparar imputações) |
| 6 | Iteração e retorno a fases anteriores são a regra | CRISP-DM ("Moving back and forth ... is always required"); KDD ("loops between any two steps"); SEMMA (repetir etapas); FMDS (laços); TDSP ("iterative"); ASUM (sprints); Domino ("Expect and embrace iteration"); Agile DS ("Iterate, iterate, iterate"); DST (trajetórias) |
| 7 | Desenhar o teste antes de treinar e separar treino, validação e teste | CRISP-DM (4.2 Generate test design); FMDS (testing e validation sets); CRISP-ML(Q) (test set bloqueado e curado por especialistas); SEMMA (particionamento em Sample); Google MLOps (evaluation × validation) |
| 8 | Avaliar em duas camadas: a técnica e contra o negócio, incluindo revisão do processo | CRISP-DM (4.4 × 5.1; 5.2 Review process); FMDS ("fully addresses the business problem"); TDSP (Customer Acceptance); CRISP-ML(Q) (comparar com os 3 critérios); Domino (sign-off dos stakeholders); KDD (interpretation/evaluation) |
| 9 | Começar simples, com baseline, e aumentar a complexidade só com evidência | CRISP-ML(Q) ("start with models of lower capacity, which can serve as baseline"); TDSP (pasta `Model/Baseline`); Domino ("starting with simple models", [F29], sec.); DMAIC (baseline); Agile DS (prototipar experimentos) |
| 10 | Planejar implantação com monitoramento, manutenção e critérios de retreino ou aposentadoria | CRISP-DM (6.2, user guide: "When should the data mining result or model not be used any more?"); CRISP-ML(Q) (fase 6); ASUM (Operate & Optimize); FMDS (Feedback); TDSP (telemetria); Domino (Monitoring); Google MLOps (monitoring, CT); DMAIC (Control); DataOps ("Monitor quality and performance") |
| 11 | Um artefato padronizado por etapa, com rastreabilidade das decisões | CRISP-DM (42 outputs + relatórios da Parte IV); TDSP (templates); ASUM (templates); CRISP-ML(Q) (Review of Output Documents; documentação experimental); Domino ("Anticipate auditability needs"); Agile DS ("Describe the process, not just the end-state") |
| 12 | Reprodutibilidade e versionamento de dados, código, configuração e sementes | CRISP-ML(Q) (data version control; reprodutibilidade de método e de resultado); DataOps ("We version everything"); TDSP (git e branches); Google MLOps (pipelines e metadados); Domino (preservar artefatos) |
| 13 | Envolver stakeholders e especialistas de domínio o tempo todo | FMDS (sponsors "throughout the project"); CRISP-DM (terminologia, especialistas na avaliação); TDSP (charter "vivo", aceite); ASUM (negócio + TI no time); Domino (backlog de stakeholders); DataOps ("Daily interactions"); CRISP-ML(Q) (especialista revisa features e requisitos) |
| 14 | Fechar o ciclo com aprendizado: lições, conflitos com o conhecimento anterior, novas perguntas | CRISP-DM (6.4 Experience documentation; círculo externo); KDD (passo 9: resolver conflitos com o conhecimento prévio); TDSP (Exit Report: Learnings); DataOps ("Reflect"); PPDAC (conclusões realimentam novos ciclos) |
| 15 | Deixar explícitas as restrições legais e de uso dos dados | CRISP-DM ("make sure that you are allowed to use the data"; atributos permitidos, em 5.2); CRISP-ML(Q) (legal constraints em Feasibility, com escopo declarado de fora); Domino (legal/compliance no sign-off); FIN-DM (fase de Compliance, [F37]). A convergência aqui é fraca: ver a lacuna 15.5 |

---

## 15. (c) Lacunas: o que nenhum framework cobre bem

### 15.1 Uso de IA/LLM no próprio processo

- O que existe: nenhum dos frameworks acima (2000–2021) trata LLMs ou agentes como executores ou assistentes do processo.
  - A automação aparece de forma pontual: o FMDS fala em "automation of some processes" [F19]; o CRISP-ML(Q) em AutoML e Neural Architecture Search na modelagem [F20]; o DST discute AutoML e julga os passos exploratórios difíceis de automatizar [F26].
  - O documento que substituiu o TDSP, o CAF, menciona "GenAIOps or MLOps" apenas como prática de operação [F54]. O NIST publicou um perfil de risco para IA generativa (2024), voltado a risco, não a processo analítico [F47].
- Evidência empírica recente:
  - Mapeamento sistemático de LLMs no ciclo de vida de DS: em 62 artigos, 41 tratam de análise exploratória, 33 de construção e avaliação de modelos e 23 de coleta e preparação, contra 3 de definição do problema e 1 de implantação [F44]. Parte dos estudos avalia LLMs "through the CRISP-DM framework" [F44].
  - Levantamento de 45 agentes de DS: "most systems emphasize exploratory analysis, visualization, and modeling while neglecting business understanding, deployment, and monitoring", e mais de 90% "lack explicit trust and safety mechanisms" [F45]. Outro survey propõe taxonomia de agentes (papéis, execução, conhecimento, reflexão) cruzada com etapas de DS [F46].
- O que falta:
  - definir a divisão de trabalho entre IA e humano por tarefa;
  - pontos de verificação humana obrigatórios;
  - registro de proveniência (prompt, modelo e versão, fontes consultadas, saídas);
  - controles contra alucinação em números e citações;
  - critérios de aceitação das saídas da IA.
  A instância de processo do CRISP-DM (4º nível) e o fluxo de QA do CRISP-ML(Q) são os pontos de apoio mais naturais para isso. Isto é análise minha, não afirmação das fontes.

### 15.2 Validação com dados externos

- O que existe:
  - CRISP-DM: testar em "test applications in the real application" se houver tempo e orçamento [F1].
  - FMDS: conjunto de validação final [F19].
  - CRISP-ML(Q): test set bloqueado, avaliação "under production condition", adaptação de domínio e times separados para coletar dados de treino e de teste [F20].
  - KDD: exige padrões "valid on new data with some degree of certainty" [F2].
  - PPDAC: o ciclo interrogativo manda checar contra "reference points: internal, external" [F43].
- O que falta: nenhum processo de DS prescreve validação externa como etapa, seja contra fonte independente (estatística oficial, outro período ou região, outra base) ou por triangulação de achados descritivos. A validação externa aparece estruturada em diretrizes de domínio, como o TRIPOD para modelos preditivos clínicos, que trata estudos de "developing, validating, or updating" modelos com checklist de 22 itens [F48], e sua versão para ML, o TRIPOD+AI (2024) [F49]. Mas não aparece nos process models gerais.

### 15.3 Teste de hipóteses formal

- O que existe:
  - KDD: alerta sobre padrões espúrios e distinção verificação × descoberta [F2].
  - CRISP-DM: formar hipóteses e "perform basic analysis to verify the hypothesis", sem inferência formal [F1].
  - FMDS: testes de significância como prova adicional, opcional [F19].
  - Domino: P&D por hipóteses e preservação de resultados nulos [F29, sec.].
  - RAMSYS: "hypothesis investment account" [F29, sec.].
  - PPDAC: separa análises planejadas de não planejadas [F43].
  - CRISP-DM0: extensão confirmatória com hipótese nula [não verificado; referência em F20].
  - O DST observa que o método científico é "more strict when it comes to hypothesis testing, replicable experimental design" [F26].
- O que falta: nos documentos consultados nenhum framework pede, como tarefa com output próprio:
  - pré-especificar hipóteses e o plano de análise;
  - separar os dados exploratórios dos confirmatórios;
  - controlar comparações múltiplas;
  - analisar poder estatístico;
  - reportar tamanho de efeito e incerteza.

### 15.4 Comunicação para públicos diferentes (técnico × executivo)

- O que existe:
  - CRISP-DM: identificar o público do relatório, com Final report e Final presentation (a apresentação tem "a subset of the information ... structured in a different way"); pergunta se o público espera relatório para a alta gestão ou sistema para usuário final [F1].
  - TDSP: Exit Report com "brief non-technical overview" [F12].
  - DST: *narrative exploration* e a habilidade de "tell a story about the data" [F26].
  - Agile DS: entregar saídas intermediárias [F40].
  - CRISP-ML(Q): explicabilidade para quem pratica ML e para o usuário final, mais guia de uso e disclaimer [F20].
  - Model Cards e Datasheets: artefatos de comunicação de limites e desempenho [F50][F51].
- O que falta: nenhum framework define um conjunto de artefatos por público com templates (resumo executivo × apêndice técnico × pacote de reprodutibilidade), níveis de incerteza comunicáveis ou regras de visualização. A comunicação é tratada como um output final, não como uma trilha contínua.

### 15.5 Ética e privacidade

- O que existe:
  - CRISP-DM: menções a restrições legais, éticas e de privacidade e a atributos "allowed to use", sem tarefa dedicada [F1].
  - CRISP-ML(Q): declara restrições legais "beyond the scope" e cita fairness e trust [F20].
  - DST: "does not yet explicitly address all the ethical and legal issues", e aponta que os riscos se concentram nas atividades exploratórias e de aquisição [F26].
  - Domino: sign-off de legal/compliance, sem mencionar viés, fairness ou privacidade [F38].
  - Agile DS e FMDS: criticados por ignorar segurança e privacidade [F29, sec.].
  - Aparecem como adaptações de domínio: FIN-DM (fase de Compliance/GDPR) e CRISP-MED-DM (privacidade de pacientes) [F37].
  - Governança externa ao processo: NIST AI RMF [F47] e a seção de IA responsável do CAF [F54].
  - No Brasil, o requisito legal de referência é a Lei nº 13.709, de 14 de agosto de 2018 (LGPD) [F52]. O detalhamento dos princípios da lei não foi verificado nesta pesquisa.
- O que falta: nenhum process model geral tem uma tarefa de avaliação de impacto (privacidade, viés, fairness), base legal e minimização de dados, com output próprio e gate de aprovação.

### 15.6 Outras lacunas registradas nas fontes

1. Estimar esforço e prazo por fase: nenhum modelo permite [F28].
2. Papéis e coordenação de equipe: ausentes no CRISP-DM, no FMDS e no KDD; tratados parcialmente no TDSP, ASUM e Domino [F29].
3. Critério para decidir quando voltar a uma fase anterior [F34].
4. Gestão e engenharia de dados como atividades de primeira classe [F26].
5. Inferência causal e geração de dados por experimento ou simulação [F26].
6. Dados não estruturados e grande escala [F28].

---

## 16. Notas para o fluxo .md assistido por IA

Esta seção é análise minha, não fato extraído das fontes.

- A hierarquia de 4 níveis do CRISP-DM [F1] encaixa bem num fluxo de arquivos .md:
  - fase = arquivo;
  - tarefa genérica = seção com *outputs* obrigatórios;
  - tarefa especializada = instruções condicionadas às 4 dimensões de contexto (domínio, tipo de problema, aspecto técnico, ferramenta);
  - instância de processo = log de execução do projeto, que é onde entra a proveniência do trabalho da IA.
- O fluxo de QA do CRISP-ML(Q) [F20] (requisitos → riscos → método de QA → evidência) pode virar um bloco padrão no fim de cada tarefa. Os *Checkpoint Decisions* do TDSP [F8] e a tarefa 5.3 *Determine next steps* do CRISP-DM funcionam como gates humanos.
- Declarar no início o tipo de trajetória, conforme o DST [F26] (orientada a objetivo, exploratória ou de gestão de dados), evita forçar um projeto exploratório na sequência do CRISP-DM.
- As 5 lacunas da seção 15 são exatamente o que o fluxo precisa acrescentar por conta própria.

---

## 17. Fontes (URL e status de acesso)

| ID | Fonte | URL | Status |
|---|---|---|---|
| F1 | Chapman et al., CRISP-DM 1.0 Step-by-step data mining guide (2000), espelho Univ. Kassel | https://www.kde.cs.uni-kassel.de/wp-content/uploads/lehre/ws2012-13/kdd/files/CRISPWP-0800.pdf | aberto; 78 págs. extraídas; figuras 2 e 3 conferidas |
| F2 | Fayyad, Piatetsky-Shapiro & Smyth, AI Magazine 17(3), 1996 | https://ojs.aaai.org/aimagazine/index.php/aimagazine/article/view/1230 · PDF: https://ojs.aaai.org/aimagazine/index.php/aimagazine/article/download/1230/1131 | aberto |
| F3 | SAS, Getting Started with SAS Enterprise Miner 4.3 (SEMMA) | http://support.sas.com/documentation/cdl/en/emgs/59885/HTML/default/a000167823.htm | aberto |
| F4 | SAS, Data Mining Using SAS Enterprise Miner: A Case Study Approach, 3rd ed. (Data Mining and SEMMA) | https://support.sas.com/documentation/cdl/en/emcs/66392/HTML/default/n0pejm83csbja4n1xueveo2uoujy.htm | aberto |
| F5 | Wikipedia, SEMMA | https://en.wikipedia.org/wiki/SEMMA | aberto (sec.) |
| F6 | Raab Associates (fev/1998), SAS Enterprise Miner | https://archive.raabassociatesinc.com/1998/02/sas-institute-enterprise-minerurban-science-gainsmartscrossz-software-crossz-voyager/ | aberto |
| F7 | Azevedo & Santos (2008), KDD, SEMMA and CRISP-DM: a parallel overview (IADIS) | https://recipp.ipp.pt/bitstream/10400.22/136/3/KDD-CRISP-SEMMA.pdf | aberto |
| F8 | Microsoft TDSP, lifecycle-detail.md (repositório arquivado) | https://github.com/Azure/Microsoft-TDSP/blob/master/Docs/lifecycle-detail.md | aberto |
| F9 | Microsoft TDSP, repositório e Docs/README | https://github.com/Azure/Microsoft-TDSP · https://github.com/Azure/Microsoft-TDSP/blob/master/Docs/README.md | aberto (arquivado em 12/10/2023) |
| F10 | TDSP, roles-tasks.md | https://github.com/Azure/Microsoft-TDSP/blob/master/Docs/roles-tasks.md | aberto |
| F11 | TDSP, project-execution.md | https://github.com/Azure/Microsoft-TDSP/blob/master/Docs/project-execution.md | aberto |
| F12 | Azure-TDSP-ProjectTemplate (estrutura, Charter.md, Exit Report.md) | https://github.com/Azure/Azure-TDSP-ProjectTemplate · https://github.com/Azure/Azure-TDSP-ProjectTemplate/blob/master/Docs/Project/Charter.md · https://github.com/Azure/Azure-TDSP-ProjectTemplate/blob/master/Docs/Project/Exit%20Report.md | aberto (arquivado em 12/10/2023) |
| F13 | Microsoft (2017), The Microsoft TDSP: Recent Updates (blog arquivado) | https://learn.microsoft.com/en-us/archive/blogs/machinelearning/the-microsoft-team-data-science-process-tdsp-recent-updates | aberto |
| F14 | MicrosoftDocs/architecture-center, commit de8687c ("delete files, create redirects") e histórico do diretório | https://github.com/MicrosoftDocs/architecture-center/commit/de8687cbbee8fdc1444dc35e0bd4ae2094d1a015 · https://github.com/MicrosoftDocs/architecture-center/commits/main/docs/data-science-process | aberto |
| F15 | URLs antigas do TDSP (redirecionam para o CAF) | https://learn.microsoft.com/en-us/azure/architecture/data-science-process/overview · https://aka.ms/tdsp | aberto (redirecionamento conferido) |
| F16 | IBM, Analytics Solutions Unified Method (ASUM), datasheet de 1º/03/2016 | https://public.dhe.ibm.com/software/data/sw-library/services/ASUM.pdf | aberto |
| F17 | Wikipedia, Cross-industry standard process for data mining | https://en.wikipedia.org/wiki/Cross-industry_standard_process_for_data_mining | aberto (sec.) |
| F18 | Yuma/Luminis, The Forgotten Step in CRISP-DM and ASUM-DM | https://www.weareyuma.com/blog/the-forgotten-step-in-crisp-dm-and-asum-dm-methodologies/ | aberto (sec.) |
| F19 | Rollins (IBM, jun/2015), Foundational Methodology for Data Science | https://tdwi.org/~/media/64511a895d86457e964174edc5c4c7b1 | aberto; figura conferida |
| F20 | Studer et al., Towards CRISP-ML(Q) (arXiv 2003.05155v2; MAKE 3(2):392–413, 2021) | https://arxiv.org/abs/2003.05155 · https://arxiv.org/pdf/2003.05155 · https://api.crossref.org/works/10.3390/make3020020 | aberto (MDPI 403; usei arXiv + Crossref) |
| F21 | Wikipedia, DMAIC | https://en.wikipedia.org/wiki/DMAIC | aberto (sec.) |
| F22 | Wikipedia, Six Sigma | https://en.wikipedia.org/wiki/Six_Sigma | aberto (sec.) |
| F23 | Pongboonchai-Empl et al. (2023), Integration of Industry 4.0 technologies into LSS DMAIC, PPC 35(12):1403–1428 | https://api.openalex.org/works/doi:10.1080/09537287.2023.2188496 · https://doi.org/10.1080/09537287.2023.2188496 | resumo via OpenAlex; T&F 403 |
| F24 | Fahmy, Mohamed & Yousef (ICENCO 2017), A data mining experimentation framework to improve six sigma projects | https://api.openalex.org/works?search=data%20mining%20experimentation%20framework%20improve%20six%20sigma%20projects&per-page=1 · https://doi.org/10.1109/icenco.2017.8289795 | resumo via OpenAlex; IEEE sem conteúdo |
| F25 | De Mast & Lokkerbol (2012), IJPE 139(2):604–614 | https://api.openalex.org/works?search=analysis%20Six%20Sigma%20DMAIC%20method%20perspective%20problem%20solving&per-page=1 · https://doi.org/10.1016/j.ijpe.2012.05.035 | só metadados |
| F26 | Martínez-Plumed et al., CRISP-DM Twenty Years Later, IEEE TKDE 33(8):3048–3061 (AAM de Bristol) | https://research-information.bris.ac.uk/ws/files/220614618/TKDE_Data_Science_Trajectories_PF.pdf · https://api.crossref.org/works/10.1109/TKDE.2019.2962680 | aberto |
| F27 | Selamat et al. (Bournemouth Univ.), Big Data Analytics: A Review of Data Mining Models for SMEs in the Transportation Sector | https://eprints.bournemouth.ac.uk/30415/1/DMKD%20for%20BRIAN-20170802_FINAL.pdf | aberto (sec. para KDnuggets) |
| F28 | Leidner, Data to Value: An "Evaluation-First" Methodology for Natural Language Projects (arXiv 2201.07725) | https://arxiv.org/abs/2201.07725 · https://arxiv.org/pdf/2201.07725 | aberto |
| F29 | Martinez, Viles & Olaizola (2021), Data Science Methodologies: Current Challenges and Future Approaches, Big Data Research 24:100183 | https://arxiv.org/abs/2106.07287 · https://arxiv.org/pdf/2106.07287 | aberto |
| F30 | Martínez-Plumed et al. (2017), CASP-DM (arXiv 1709.09003) | https://arxiv.org/pdf/1709.09003 | aberto |
| F31 | Data Science PM, CRISP-DM is Still the Most Popular Framework... | https://www.datascience-pm.com/crisp-dm-still-most-popular/ | aberto |
| F32 | Data Science PM, What is CRISP DM? | https://www.datascience-pm.com/crisp-dm-2/ | aberto (sec.) |
| F33 | Saltz, Hotz, Wild & Stirling (AMCIS 2018) | https://aisel.aisnet.org/amcis2018/ITProjMgmt/Presentations/12/ | aberto (resumo) |
| F34 | Lahiri & Saltz (HICSS-56, 2023), Evaluating Data Science Project Agility... | https://scholarspace.manoa.hawaii.edu/server/api/core/bitstreams/7fe7d024-3885-43fe-84e8-e7302ed6445f/content | aberto |
| F35 | Saltz, Shamshurin & Crowston (HICSS-50, 2017), Comparing Data Science Project Management Methodologies via a Controlled Experiment | https://scholarspace.manoa.hawaii.edu/server/api/core/bitstreams/07ccfe0d-2ab8-44ce-945a-6a02da486468/content | aberto |
| F36 | Plotnikova, Dumas & Milani (2020), PeerJ CS, DOI 10.7717/peerj-cs.267 | https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=DOI:10.7717/peerj-cs.267&resultType=core&format=json | resumo via Europe PMC; PeerJ e PMC bloqueados |
| F37 | Shimaoka, Ferreira & Goldman (2024), The evolution of CRISP-DM for Data Science, SBC Reviews, DOI 10.5753/reviews.2024.3757 | https://journals-sol.sbc.org.br/index.php/reviews/article/view/3757 · https://journals-sol.sbc.org.br/index.php/reviews/article/download/3757/2996 | aberto |
| F38 | Domino, Data science project management (field guide) | https://domino.ai/resources/field-guide/managing-data-science-projects | aberto |
| F39 | Data Science PM, Domino Data Science Life Cycle | https://www.datascience-pm.com/domino-data-science-life-cycle/ | aberto (sec.) |
| F40 | Jurney, Agile Data Science 2.0 (página do livro e slides do autor) | https://datasyndrome.com/book · https://www.slideshare.net/slideshow/agile-data-science-20/71937272 | aberto; O'Reilly 403 |
| F41 | Google Cloud, MLOps: Continuous delivery and automation pipelines in machine learning | https://docs.cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning | aberto |
| F42 | The DataOps Manifesto | https://dataopsmanifesto.org/en/ | aberto |
| F43 | Wild & Pfannkuch (1999), Statistical Thinking in Empirical Enquiry, ISR 67(3) | https://www.stat.auckland.ac.nz/~iase/publications/isr/99.Wild.Pfannkuch.pdf | aberto; figura conferida |
| F44 | Chintakunta, Nascimento & Guimaraes (2025), LLMs in the Data Science Lifecycle: A Systematic Mapping Study (arXiv 2508.11698) | https://arxiv.org/abs/2508.11698 · https://arxiv.org/pdf/2508.11698 | aberto |
| F45 | Rahman et al. (2025), LLM-Based Data Science Agents: A Survey (arXiv 2510.04023) | https://arxiv.org/abs/2510.04023 | aberto (resumo) |
| F46 | Chen et al. (2025), Large Language Model-based Data Science Agent: A Survey (arXiv 2508.02744) | https://arxiv.org/abs/2508.02744 | aberto (resumo) |
| F47 | NIST, AI Risk Management Framework | https://www.nist.gov/itl/ai-risk-management-framework | aberto |
| F48 | Collins et al. (2015), TRIPOD statement, BMJ 350:g7594 | https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=DOI:10.1136/bmj.g7594&resultType=core&format=json | resumo via Europe PMC |
| F49 | Collins et al. (2024), TRIPOD+AI statement, BMJ 385 | https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=DOI:10.1136/bmj-2023-078378&resultType=core&format=json | só metadados; BMJ 403 |
| F50 | Mitchell et al., Model Cards for Model Reporting (FAT* 2019) | https://arxiv.org/abs/1810.03993 | aberto |
| F51 | Gebru et al., Datasheets for Datasets (CACM 2021) | https://arxiv.org/abs/1803.09010 | aberto |
| F52 | ANPD, regulamentações (referência à Lei nº 13.709/2018, LGPD) | https://www.gov.br/anpd/pt-br/acesso-a-informacao/institucional/atos-normativos/regulamentacoes_anpd | aberto (planalto.gov.br recusou conexão) |
| F53 | IBM Docs, CRISP-DM Help Overview (SPSS Modeler) | https://www.ibm.com/docs/en/spss-modeler/saas?topic=dm-crisp-help-overview | aberto |
| F54 | Microsoft, Plan for AI adoption, Cloud Adoption Framework (destino dos redirecionamentos do TDSP) | https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ai/plan | aberto |

Fontes primárias que tentei abrir e não consegui (não foram citadas como verificadas):
- KDnuggets, 403:
  - https://www.kdnuggets.com/polls/2002/methodology.htm
  - https://www.kdnuggets.com/polls/2004/data_mining_methodology.htm
  - https://www.kdnuggets.com/polls/2007/data_mining_methodology.htm
  - https://www.kdnuggets.com/2014/10/crisp-dm-top-methodology-analytics-data-mining-data-science-projects.html
- O'Reilly, 403: https://www.oreilly.com/radar/a-manifesto-for-agile-data-science/
- MDPI, 403: https://www.mdpi.com/2504-4990/3/2/20
- ASQ, 403: https://asq.org/quality-resources/dmaic
- IBM, 404: https://developer.ibm.com/predictiveanalytics/2015/10/16/have-you-seen-asum-dm/
- dataists.com (OSEMN), certificado inválido: http://www.dataists.com/2010/09/a-taxonomy-of-data-science/

## 18. Itens marcados como não verificados (conferir antes de apresentar)

1. Percentuais das enquetes KDnuggets de 2002 e 2004. Os números de 2007 e 2014 vêm de fontes secundárias concordantes.
2. Ano de criação do SEMMA. O que está documentado é que já existia em fevereiro de 1998.
3. Encaixe fino das tarefas do CRISP-DM nas fases do ASUM-DM e a lista de tarefas do ASUM-DM.
4. A frase do SAS "logical organization of the functional tool set", verificada só através da Wikipedia.
5. Origem do Six Sigma em 1986 e adoção pela GE em 1995 (Wikipedia). O DST diz 1996.
6. Pesquisa Corinium de 2020 (48%), citada pelo Data Science PM.
7. Ano do DataOps Manifesto (buscas indicam 2017).
8. OSEMN (Mason & Wiggins, 2010) e CRISP-DM0 (Heath & McGregor, 2010): referências não abertas.
9. Conteúdo de De Mast & Lokkerbol (2012): só metadados.
