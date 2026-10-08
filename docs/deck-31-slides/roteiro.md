# Roteiro da apresentação — Análise de dados assistida por IA

> Conteúdo slide a slide e fala do apresentador. O deck (`apresentacao/index.html`) é gerado a partir deste roteiro.
> **Não há análise real.** Os números citados vêm de fontes publicadas (pasta `pesquisa/`) ou dos projetos DataS1, DataS2 e DataS2.1 da disciplina, conferidos nos arquivos de origem. Cada slide traz o rastreio.

**Público:** turma de Data Science 2 (ESEG). **Duração-alvo:** 20 a 25 minutos + perguntas.
**Mensagem central:** *IA acelera; o método protege. Um funil de 13 etapas em que a IA planeja, executa e verifica, o humano decide, e as travas que importam ficam fora do alcance da IA.*

**Versões por tempo:**
- **10 min:** 1 · 2 · 8 · 10 · 11 · 14 · 17 · 21 · 25 · 29
- **20 min:** todos, menos 5, 6, 20 e 24
- **30 min:** todos + apêndice + o kit aberto no editor

---

## 01 · Capa

- **Eyebrow:** Data Science 2 · ESEG · 2026
- **Título:** Análise de dados assistida por IA: do problema à decisão
- **Subtítulo:** Um funil que aglutina o CRISP-DM e os principais frameworks de ciência de dados, com IA em todas as etapas e humano em cada portão
- **Autor:** Felipe Marins
- **Visual:** o funil de 5 camadas, estilizado; logo ESEG.
- **Fala (30 s):** "Hoje eu não vou mostrar uma análise. Vou mostrar um processo para fazer qualquer análise com IA do lado, do problema até a apresentação para quem decide, sem perder o rigor no caminho."

## 02 · A provocação

- **Título:** A IA faz em segundos o que levava dias, inclusive errar com convicção
- **Conteúdo:** quatro falhas típicas, com ícone simples:
  1. **Inventa a fonte:** cita dataset, tabela ou URL que não existe.
  2. **Calcula de cabeça:** devolve um número plausível sem ter executado código.
  3. **Concorda com você:** confirma a hipótese de quem pergunta (*sycophancy*).
  4. **Testa até dar:** roda 50 recortes e mostra o que "deu significativo".
- **Faixa de evidência (3 números):**
  - **mais de 40% de qualidade** dentro da "fronteira" da IA e **−19 p.p. de acerto** fora dela, com 758 consultores do BCG (Dell'Acqua et al., 2023; *Organization Science*, 2026);
  - **3% a 13%** das URLs citadas por LLMs não existem (Rao et al., 2026);
  - **34 a 66 p.p.:** quanto muda o veredito de um "analista-IA" quando a persona vira confirmatória (Bertran et al., *PNAS*, 2026).
- **Fala (60 s):** "Nenhuma dessas falhas é exótica. Todas aparecem na primeira semana de uso. O problema não é a IA errar; é errar com a mesma confiança com que acerta. E o estudo do BCG mostra o pior: quem usa a IA não enxerga onde fica a fronteira."
- **Fontes:** `pesquisa/03-ia-na-analise-de-dados.md` §3.1, §4.1, §4.3.

## 03 · A pergunta

- **Título:** Como usar IA em todas as etapas sem terceirizar o julgamento?
- **Conteúdo (roteiro da fala):**
  1. O que 30 anos de frameworks já resolveram.
  2. O que ficou faltando com a IA.
  3. A proposta: o funil.
  4. As etapas.
  5. Como usar amanhã.
- **Fala (20 s):** "A resposta tem duas partes: o que já sabíamos e o que a IA obriga a acrescentar."

## 04 · Linha do tempo

- **Título:** Trinta anos de frameworks respondem à mesma pergunta: como não se perder numa análise
- **Conteúdo (linha do tempo horizontal):**
  - **1977** EDA (Tukey): explorar ≠ confirmar
  - **1996** KDD (Fayyad, Piatetsky-Shapiro & Smyth)
  - **≤1998** SEMMA (SAS)
  - **1999** PPDAC (Wild & Pfannkuch)
  - **2000** CRISP-DM 1.0
  - **2015** IBM FMDS · ASUM-DM · Leek & Peng · Peng & Matsui
  - **2016** TDSP (Microsoft), aposentado em 2025
  - **2021** CRISP-ML(Q) · Data Science Trajectories
  - **2026** este funil, **com IA dentro do processo**
- **Rodapé:** "82% dos cientistas de dados pesquisados não seguiam processo explícito" (Saltz et al., 2018).
- **Fala (45 s):** "Todo mundo que já se perdeu numa análise inventou um framework. A boa notícia é que eles concordam em quase tudo. A má é que todos são anteriores aos LLMs."
- **Fontes:** `pesquisa/01-frameworks-de-processo.md` §0, §10.

## 05 · CRISP-DM *(opcional em 20 min)*

- **Título:** O CRISP-DM continua a espinha dorsal: seis fases, começando pelo negócio
- **Conteúdo:**
  - **Diagrama em ciclo:** Business Understanding ⇄ Data Understanding → Data Preparation ⇄ Modeling → Evaluation → Deployment, com o círculo externo e "Data" no centro.
  - **Números:** 6 fases · 24 tarefas genéricas · 42 saídas.
  - **Adoção:** 42% (2007) e 43% (2014) nas enquetes da KDnuggets, a mais citada **[fonte secundária]**.
  - **Citação em destaque:** "…producing the right answers to the wrong questions." (guia CRISP-DM 1.0)
- **Fala (60 s):** "Tem 26 anos, está sem manutenção desde 2000 e continua o mais usado. A frase em destaque é do próprio guia, e explica por que o nosso funil começa pela decisão, não pelo dado."
- **Fontes:** guia CRISP-DM 1.0 (Chapman et al., 2000); `pesquisa/01` §1, §10.

## 06 · O que cada framework acrescenta *(opcional em 20 min)*

- **Título:** Cada framework posterior tapou um buraco, e o funil herda os remendos
- **Conteúdo (tabela, 8 linhas):**
  | Framework | Acrescentou | No funil |
  |---|---|---|
  | KDD | "busque o bastante e você acha padrão falso" | pré-registro (05) |
  | SEMMA | amostrar e particionar primeiro | partição e cofre (04) |
  | PPDAC | checar contra referências internas **e externas** | dados externos (03) |
  | IBM FMDS | abordagem analítica antes da coleta; feedback | tipo de pergunta (01); acompanhamento (12) |
  | TDSP | charter, *checkpoint decisions*, *exit report* | brief, portões, deck técnico |
  | CRISP-ML(Q) | QA por tarefa (risco → mitigação); baseline; teste bloqueado | armadilhas × salvaguardas; cofre; modelo congelado |
  | Peng & Matsui | epiciclo: expectativa antes do dado | ciclo PEVD |
  | Leek & Peng | o tipo de pergunta define a afirmação | escada de evidência |
- **Fala (45 s):** "Nada aqui é invenção minha: cada peça do funil tem dono. A contribuição é juntar tudo e acrescentar o que faltava."

## 07 · Convergências e lacunas

- **Título:** Todos concordam no essencial, e nenhum trata do que a IA tornou urgente
- **Conteúdo (duas colunas):**
  - **Concordam (15 princípios; os 5 principais):** começar pelo problema · critério de sucesso antes de modelar · entender o dado antes de modelar · iterar é a regra · um artefato por etapa.
  - **Ninguém cobre bem:**
    1. **IA dentro do processo.** De 45 agentes de ciência de dados, mais de 90% não têm mecanismo explícito de *trust and safety* (Rahman et al., 2025).
    2. **Validação com dados externos.** Só o PPDAC menciona.
    3. **Teste de hipótese formal:** pré-registro, multiplicidade, efeito com IC.
    4. **Comunicação por público.**
    5. **Ética e privacidade** com portão.
- **Fala (45 s):** "A coluna da direita virou o briefing do funil: cada lacuna virou uma etapa ou uma regra."
- **Fontes:** `pesquisa/01` §14–15; `pesquisa/03` §1.1.

## 08 · O funil

- **Título:** A proposta: um funil de 5 fases e 13 etapas em que cada filtro é um portão humano
- **Conteúdo (visual principal, funil de cima para baixo):**
  | Fase | Etapas | Entra → sai |
  |---|---|---|
  | 1 · Enquadrar | 00 Kickoff · 01 Problema e decisão ★ | muitas perguntas → 1 pergunta ligada a uma decisão |
  | 2 · Reunir | 02 Dados internos · 03 Dados externos ★ · 04 Preparação | fontes → internas + externas aptas; **confirmação guardada no cofre** |
  | 3 · Explorar | 05 Exploração e pré-registro ★ · 06 Modelagem (condicional) | gráficos → hipóteses **travadas** (+ modelo congelado) |
  | 4 · Comprovar | 07 Testes confirmatórios · 08 Validação ★ | cofre aberto **uma vez** → evidências testadas, robustas e trianguladas |
  | 5 · Comunicar | 09 Insights · 10 Deck técnico · 11 Deck executivo ★ · 12 Entrega | evidências → até 5 insights → 1 decisão |
- **Legenda:** ★ = portão crítico, com segunda pessoa. Modo completo: 13 portões · modo essencial: 6.
- **Fala (75 s):** "O funil é a ideia central. Em cima entram muitas perguntas, muitas fontes, muitos gráficos; embaixo sai uma decisão. Cada estreitamento é um portão que só um humano abre. E repare na fronteira entre a fase 3 e a 4: tudo antes dela usa só dados de exploração. A confirmação fica guardada, e só é aberta uma vez."

## 09 · Quatro pilares

- **Título:** Quatro pilares sustentam o funil: o quê, como, quem decide e onde fica
- **Conteúdo (grade 2 × 2):**
  - **Funil (o quê):** 13 etapas, cada uma com missão, entradas e um artefato.
  - **Ciclo PEVD (como):** a IA **P**laneja, **E**xecuta e **V**erifica; o humano **D**ecide.
  - **Portões (quem decide):** só humano aprova, com a frase literal registrada; 5 críticos.
  - **Artefatos (onde fica):** o estado mora em arquivos, e todo número vem de `resultados/`, escrito por script.
- **Rodapé:** duas réguas atravessam tudo: a **escada de evidência** (E0–E3) e as **12 regras de ouro**.
- **Fala (40 s):** "Se vocês lembrarem de uma coisa, lembrem disso: o quê, como, quem decide, onde fica."

## 10 · Ciclo PEVD

- **Título:** Em cada etapa a IA planeja, executa e verifica, e só o humano decide
- **Conteúdo (diagrama em ciclo):**
  - **P · Planejar (IA):** objetivo, plano e **expectativa declarada** ("espero ~5% de nulos"), em termos neutros.
  - **E · Executar (IA):** código salvo e executado; números gravados em `resultados/`.
  - **V · Verificar (IA):** primeiro o determinístico (testes, hashes, reexecução), depois expectativa × resultado, checklist e conferência de cada afirmação. "Tem certeza?" não é verificação.
  - **D · Decidir (humano):** dá uma **semente** para sortear 2 números (um da etapa atual, um do projeto todo), reexecuta o script de origem de cada um e responde `Aprovo G3` · `Ajustar: …` · `Voltar à etapa 02: …`.
- **Rodapé:** inspirado no PDCA e no epiciclo de Peng & Matsui.
- **Fala (60 s):** "O passo que mais rende é o mais barato: pedir para a IA dizer o que espera antes de rodar. Quando diverge, ou é descoberta ou é bug, e na maioria das vezes é bug. E conferir dois números sorteados, com uma semente que eu dou na hora, é o antídoto contra aprovar sem ler: a IA não escolhe o que eu vou conferir."

## 11 · Travas externas

- **Título:** Instrução para a IA é a última linha de defesa; as travas que importam ficam fora do alcance dela
- **Conteúdo (tabela de 6 travas):**
  | Trava | Impede |
  |---|---|
  | **Cofre**: a confirmação fica numa pasta fora do projeto, guardada pelo humano | "dar uma olhadinha" antes da hora |
  | **Registro travado** + **âncora externa**: tag própria da trava (`trava-registro`), ancorada numa mensagem ao revisor ou num remoto com proteção de tags testada (tag só local a IA consegue mover) | mudar a hipótese depois de ver o resultado |
  | **Números emitidos por script** (`resultados/*.json`) | número digitado errado no deck |
  | **Sorteio com semente humana**: 2 números por portão, com o script reexecutado | aprovar sem ler; conferir só o que é fácil |
  | **Auditoria numa cópia**, contra resultados congelados | o auditor sobrescrever o que deveria conferir |
  | **Aprovação literal** registrada | aprovação fantasma |
- **Destaque:** em 280 execuções, 3 portões humanos antes dos resultados + cálculo em código reduziram as falhas críticas de **72% para 16%**, **com os mesmos modelos e prompts** (HLER, Zhu et al., 2026).
- **Fala (60 s):** "Princípio de construção: determinístico onde dá, IA onde há julgamento. Se uma regra pode virar código, vira código. Se pode virar trava fora do alcance da IA, vira trava. E o número do HLER mostra que o controle não está no modelo: está no processo em volta dele."
- **Fontes:** `fluxo/AGENTS.md` §5; `pesquisa/03` §2.

## 12 · Fase 1: Enquadrar

- **Título:** Enquadrar: a pergunta vem antes do dado, e o tipo de pergunta define o verbo permitido
- **Conteúdo:**
  - **Citação:** "The most frequent failure in data analysis is mistaking the type of question being considered" (Leek & Peng, *Science*, 2015).
  - **6 tipos**, em miniatura: descritiva · exploratória · inferencial · preditiva · causal · mecanística.
  - **Teste da decisão:** "se a análise mostrar X, faremos Y". Se toda resposta leva à mesma ação, a pergunta não serve.
  - **Efeito mínimo relevante declarado pelo dono**, agora e sem sugestão da IA: a menor diferença que mudaria a decisão.
  - **Hipóteses a priori**, com origem, cada uma com a **rival mais forte**.
- **Artefato:** `01-brief.md` · **Portão:** G1 ★
- **Fala (60 s):** "Duas perguntas que a IA nunca sugere: o que o dono acredita e qual diferença importa. Se ela sugere, a resposta vira dela. E o efeito mínimo precisa nascer antes do dado; senão ele é escolhido depois, do tamanho que faz o resultado dar."

## 13 · Fase 2: Reunir

- **Título:** Reunir: conhecer o dado antes de usá-lo e guardar a confirmação antes de explorar
- **Conteúdo:**
  - **02 Dados internos:** ficha de cada base (por que foi coletada, quem fica de fora), perfil por script, 6 dimensões de qualidade. **Base limpa demais é sinal de alerta.**
  - **04 Preparação:** toda regra com motivo e contagem; **nenhuma linha some em silêncio** (quarentena).
  - **Partição com atribuição fixa** (hash do ID), 70% exploração e 30% confirmação. A confirmação vai **para o cofre**, fora do projeto.
  - **Citação:** a parte de confirmação "is sealed until exploration is complete" (Nosek et al., *PNAS*, 2018).
- **Fala (60 s):** "Esse é o truque mais subestimado da análise: separar fisicamente os dados de confirmação antes de olhar. Sem isso, qualquer teste depois é a gente conferindo a própria cola."

## 14 · ★ Dados externos (1/2)

- **Título:** Dado interno não se valida sozinho: toda análise encara uma régua externa
- **Conteúdo:**
  - **Cinco propósitos:** benchmark · representatividade · enriquecimento · ordem de grandeza · contexto.
  - **Protocolo:** buscar no produtor oficial → **verificar existência** (identificador nos metadados da fonte) → 15 perguntas de aptidão → **fixar a tolerância antes de ver os números** → baixar por script com hash → **prova de leitura** → harmonizar → comparar (na etapa 08).
- **Artefato:** `03-fontes-externas.md` · **Portão:** G3 ★ (obrigatório)
- **Fala (60 s):** "É a etapa que nenhum framework clássico torna obrigatória, e a que mais salvou análises no nosso semestre. É também onde a IA mais alucina. A regra é dura: link só vale depois de aberto, baixado e reproduzido."

## 15 · ★ Dados externos (2/2): armadilhas reais de 2026

- **Título:** A régua externa também engana: quatro armadilhas encontradas nesta pesquisa
- **Conteúdo (4 cartões):**
  1. **O verificador alucinou.** A página do Kaggle não carregou, e a ferramenta de leitura devolveu "informação típica" como se fosse o conteúdo.
  2. **Série morta.** As tabelas 2014=100 da Pesquisa Mensal de Comércio estão encerradas desde dez/2022 (as atuais são 2022=100). Código antigo, ou sugerido por IA, aponta para elas.
  3. **Código diferente.** O CNPJ da Receita usa código TOM (São Paulo = 7107), não IBGE (3550308). O crosswalk oficial não tem o município 5101837, e um *join* ingênuo perde registros **sem dar erro**.
  4. **Denominador ambíguo.** Brasil: 203.080.756 no Censo 2022 × 213.421.037 na Estimativa 2025. Qual usar é decisão registrada.
- **Rodapé:** bloqueio anti-bot (o site do IBGE devolve 403) não prova que a fonte não existe; use a API ou o FTP oficial.
- **Fala (60 s):** "O primeiro cartão é o meu preferido: aconteceu durante a pesquisa deste trabalho. É a regra 3 funcionando ao vivo."
- **Fontes:** `pesquisa/04-fontes-externas.md` §1, A.1, A.2, B.3.

## 16 · Casos: a régua externa mudou quatro conclusões do semestre

- **Título:** No nosso semestre, a régua externa mudou quatro conclusões
- **Conteúdo (4 cartões: controle → caso → número):**
  1. **Peso amostral** (DataS2, diabetes): prevalência de **13,933%** no arquivo entregue contra **10,500%** no BRFSS completo com peso. A base superestimava em **32,7%**.
  2. **Prova de leitura** (DataS2): 10,50% contra os 10,0% do CDC. Com o método de quem publica, a **mediana entre 53 jurisdições dá 10,04%**. Não era erro, era outra estatística.
  3. **Mesma definição + deflação** (DataS2.1, Airbnb NYC): o preço do apartamento inteiro de 30+ noites, de 2019 a 2026, dava **−6,4%** com o preço com desconto e **+4,0%** na mesma definição, em dólar constante. O sinal inverteu.
  4. **Mesmo universo** (DataS2.1): o "60%" de cumprimento da lei dividia o total da cidade pelos anúncios da base. Com a mesma unidade dos dois lados, **86%** (2.268 de 2.635).
- **Rastreio:** `DataS2/docs/05-comparacao-brfss-original.md` (linhas 143–162, 278) · `DataS2.1/docs/05-comparativo-2019-2026.md` (53, 108, 117) · `DataS2.1/CLAUDE.md` (134–137)
- **Fala (75 s):** "Não é teoria. São quatro números que teriam sido apresentados errado, três deles com o sinal ou a ordem de grandeza trocados."

## 17 · Fase 3: Explorar e travar

- **Título:** Explorar: divergir em dezenas de gráficos, convergir em poucos e travar as hipóteses no G5
- **Conteúdo:**
  - **Expectativa antes de cada gráfico.** A galeria inteira entra no placar, e todo gráfico leva o rótulo "exploração (E0)".
  - **Título-mensagem:** "Cancelamento por plano" → "Cancelamento do plano B é maior em todas as regiões".
  - **Pré-registro:**
    - estimando, teste e plano B com gatilho objetivo;
    - efeito mínimo (m) e efeito plausível (δ) do brief, e **poder da regra** calculado em δ;
    - família e correção (Holm);
    - sensibilidades e triangulação de efeito.
  - **Travamento:** cópia somente leitura + SHA-256 ancorado fora.
  - **06 Modelagem** (só pergunta preditiva) acontece **aqui**, só na exploração, e o modelo é **congelado** antes da confirmação.
- **Destaque:** com só 4 graus de liberdade do pesquisador, a taxa de falso positivo chegou a **61%** (Simmons et al., 2011).
- **Fala (75 s):** "Com IA, gerar 200 gráficos custa segundos. A disciplina não está em gerar, está em escolher e registrar antes de ver a resposta. Até o modelo é uma hipótese: escolhido na exploração, congelado, avaliado uma vez."

## 18 · Fase 4: Testes confirmatórios

- **Título:** Comprovar: abrir o cofre uma vez, rodar só o registrado e reportar os quatro desfechos
- **Conteúdo:**
  - **Antes de abrir:** hash do registro conferido contra a **âncora externa** (o hash que o humano enviou ao revisor, ou a tag no remoto). Se divergir, para.
  - **Quatro desfechos**, com m = efeito mínimo relevante:
    - **confirmada:** p ajustado < α e efeito ≥ m no sentido esperado;
    - **contrária:** efeito relevante no sentido oposto, reportado;
    - **refutada:** IC todo dentro de ±m (equivalência: "não muda a decisão");
    - **inconclusiva:** faltou dado.
  - **Placar do funil:** *3 confirmadas em 5 testes ≠ 3 em 60.*
  - Desvio **cego** mantém o nível; desvio **informado pelo resultado** vira E0.
- **Fala (60 s):** "Resultado nulo não é fracasso: 'o efeito é menor que o que importa' é uma resposta útil para quem decide. O que invalida uma análise é esconder o nulo."

## 19 · Validação

- **Título:** Validar é tentar derrubar o próprio achado antes que alguém de fora o derrube
- **Conteúdo (três lentes):**
  - **Sensibilidade registrada no G5:** com e sem outliers, janelas, subgrupos e **composição** (Simpson).
  - **Régua externa em dois níveis:** a de **nível** valida a base (requisito de E2); a de **efeito**, numa fonte independente, leva a E3. Explicação plausível sem correção prevista não promove nada.
  - **Auditoria adversarial:** o humano abre uma sessão nova, de preferência com outro modelo, numa **cópia** do projeto feita depois da validação. O auditor **reexecuta** tudo, inclusive as sensibilidades, e compara, por script, com os resultados congelados. Toda rodada fica no log.
- **Destaque:** relatórios de "analistas-IA" com **conclusões opostas** sobre os mesmos dados passaram em revisão independente por IA (86%) e por maioria de especialistas humanos (78%) (Miao et al., 2026).
- **Fala (60 s):** "Pedir para a mesma conversa revisar o próprio trabalho produz defesa, não auditoria. E auditor que só lê o texto se convence com texto confiante. Tem que rodar."

## 20 · Casos: validação e pré-registro no semestre *(opcional em 20 min)*

- **Título:** Validação e registro também salvaram números no semestre
- **Conteúdo (4 cartões):**
  1. **Composição** (DataS2.1): a valorização mediana por célula era de **+29%**; estratificando por regime de estadia, **+7,2%**. "Os +29% eram composição."
  2. **Validação que imita o uso** (DataS2.1): MdAPE de **18,5%** com KFold aleatório contra **22,0%** com blocos espaciais.
  3. **Auditoria adversarial** (DataS2): 20 agentes, um cético por achado. **8 confirmados, 4 derrubados**. O OR de manchete foi de **0,7459 [0,719; 0,774]** para **0,6738 [0,641; 0,708]**, e os intervalos não se sobrepõem.
  4. **Régua fixa × régua móvel:** o DataS2.1 publicou dois critérios pré-registrados **reprovados** (C4 e C5). No DataS1, a meta de cobertura, anotada como "inicial; ajustar após exploração", foi de ≥ 95% para ≥ 90%, e o resultado, **87,7%**, ficou abaixo das duas, sem marca de reprovado.
- **Rastreio:** `DataS2.1/docs/07-modelagem.md` (70, 302–304) · `DataS2/docs/23-sintese-final.md` (75–76) · `DataS2/docs/25-linha-do-tempo.md` (253–254, 268) · `DataS2.1/docs/01-entendimento-do-negocio.md` (74–75, 103) · `DataS1/PLANO_CRISP_DM.md` (40) · `DataS1/RELATORIO_FINAL.md` (44)
- **Fala (75 s):** "O último cartão é meu: no DataS1, eu mesmo deixei a régua andar. É exatamente o que o pré-registro existe para impedir."

## 21 · Escada de evidência

- **Título:** A escada de evidência decide o verbo que você pode usar
- **Conteúdo (escada de baixo para cima):**
  | Nível | Critério | Como dizer | No executivo |
  |---|---|---|---|
  | **E0 · Observação** | visto na exploração | "observamos que…" | só em próximos passos |
  | **E1 · Confirmado** | teste registrado, na confirmação, decisão "confirmada" (ou "contrária", no sentido observado) | "os dados indicam que…" | confiança média |
  | **E2 · Robusto** | E1 + sensibilidades mantêm + base passa na régua de nível + auditoria mantém | "há evidência consistente de que…" | confiança média |
  | **E3 · Triangulado** | E2 + fonte independente mostra o mesmo efeito + revisão por segunda pessoa | "há evidência forte de que…" | confiança alta |
- **Tetos:** auditoria "enfraquecido" ou "não reexecutado" → máximo E1 · sem régua externa de nível → máximo E1 · sem revisão independente → máximo E2. Refutadas passam pela mesma validação para poder dizer "não muda a decisão".
- **Rodapé:** causalidade é um eixo à parte. Experimento permite "causa"; desenho observacional exige verbo condicional.
- **Fala (45 s):** "Isso resolve a briga entre o técnico e o executivo: o executivo ganha frase simples, e a frase simples continua honesta."

## 22 · Fase 5: Comunicar

- **Título:** Comunicar: o mesmo achado vira dois decks, um para auditar e outro para decidir
- **Conteúdo:**
  - **09 Insights:** o quê → **e daí** → **e agora**. Até 5 insights; **zero é resultado válido**. Resposta primeiro (Minto). **Teste do título:** só os títulos, em ordem, contam a história.
  - **Gráfico de achado = `Vnnc`**, a mesma função rodada na base do teste. O gráfico da exploração nunca aparece como prova.
  - **Tabela técnico × executivo:**
    | | Deck técnico | Deck executivo |
    |---|---|---|
    | Público | pares, professor | quem decide |
    | Objetivo | auditar e reproduzir | decidir |
    | Começa por | a pergunta e os dados | **a recomendação** |
    | Mostra | tudo: placar, 4 desfechos, desvios, limitações | até 5 insights, um gráfico cada |
    | Linguagem | efeito, IC, p ajustado | confiança alta, média ou a investigar |
    | Números | lidos de `resultados/` | os mesmos, sem jargão |
- **Fala (60 s):** "Simplificar não é distorcer. O número e a ressalva continuam lá, em outra língua. E títulos em frase-asserção têm evidência experimental de melhor compreensão (Garner & Alley, 2013)."

## 23 · As 12 regras de ouro

- **Título:** Doze regras transformam a IA de oráculo em ferramenta auditável
- **Conteúdo (grade 4 × 3):**
  1. A pergunta vem antes do dado.
  2. Número só nasce de código executado.
  3. Fonte só vale aberta, baixada e registrada.
  4. Expectativa antes do resultado.
  5. Explorar não é confirmar.
  6. Todo achado-chave encara uma régua externa.
  7. Tudo é reportado, inclusive o que falhou.
  8. O verbo obedece à evidência.
  9. Só humano abre portão.
  10. O estado mora em arquivos, não no chat.
  11. Quem audita não é quem fez.
  12. Privacidade antes de conveniência.
- **Rodapé:** **determinístico onde dá, IA onde há julgamento.**
- **Fala (50 s):** "Repare que nenhuma regra proíbe usar IA. Todas dizem **onde** a IA precisa de um controle."

## 24 · Onde a IA ajuda, onde erra *(opcional em 20 min)*

- **Título:** A IA ajuda em todas as etapas e erra de um jeito previsível em cada uma
- **Conteúdo (tabela, 5 linhas):**
  | Fase | Ajuda | Erra | Controle |
  |---|---|---|---|
  | Enquadrar | transforma pedido vago em perguntas | aceita a premissa de quem pergunta | teste da decisão; perguntas abertas; hipótese rival |
  | Reunir | perfil, junções, busca de fontes | inventa fonte; lê coluna errado; vaza dado pessoal | verificação; "inferido (confirmar)"; só agregados |
  | Explorar | dezenas de gráficos em minutos | acha padrão espúrio | expectativa antes; pré-registro travado |
  | Comprovar | escolhe o teste, escreve o código | *p-hacking* automatizado; falso sucesso | cofre; só o registrado; auditor reexecutando |
  | Comunicar | redige, resume, traduz | exagera, inventa impacto, some com a incerteza | escada de evidência; números por script |
- **Destaque:** em tarefas abertas de análise, os melhores agentes acertam entre 15% e 40% (DSBench, DA-Code, DiscoveryBench); em desafios reais, **humano + IA** superou IA sozinha (AgentDS, 2026).
- **Fontes:** `fluxo/referencias/riscos-ia.md`; `pesquisa/03` §1.3.

## 25 · O kit passou pela própria etapa 08

- **Título:** Antes de chegar aqui, o kit passou cinco vezes pela própria auditoria adversarial, e cada rodada achou o que as anteriores deixaram passar
- **Conteúdo (tabela de 5 rodadas):** cada rodada foi feita por um revisor em **sessão limpa**, sem o histórico da criação, que recebeu só os arquivos.
  | Rodada | Versão auditada | Críticos | Exemplo do que achou |
  |---|---|---|---|
  | 1 | v1 | **10** (de 37 problemas) | o hash do pré-registro era gravado **dentro** do arquivo que ele protegia, e gravar o hash muda o hash |
  | 2 | v2 | **1 novo, criado pela correção** | o auditor reexecutava na pasta original e comparava os números com eles mesmos |
  | 3 | v3 | **0** (3 importantes) | a cópia de auditoria era feita antes da validação, sem as sensibilidades |
  | 4 | v3.1 | **1** | a conferência das travas olhava sempre a tag G5, e a do modelo ficava sem âncora |
  | 5 | v3.2 | **3** | o auditor não conferia o conteúdo das travas, e tag num remoto sem proteção a IA consegue forjar |
  - **Hoje:** v3.3, com todos os achados corrigidos e o código do kit testado num projeto simulado.
- **Fala (60 s):** "Esse é o melhor argumento que eu tenho: o método pegou os erros do próprio método, cinco vezes. A segunda rodada mostra que consertar também quebra. A quarta e a quinta mostram que auditoria não termina: o kit não está 'auditado', está 'auditado até aqui'. Se eu tivesse pedido para a mesma conversa revisar, ela teria dito que estava ótimo."
- **Fontes:** `CLAUDE.md` do projeto, seção Histórico.

## 26 · Como usar o kit

- **Título:** Para usar: copie a pasta, cole um prompt e responda a cada portão
- **Conteúdo:**
  - **Estrutura:** `fluxo/` → `README.md` · `AGENTS.md` (instruções para a IA) · `etapas/` (13) · `templates/` (18) · `referencias/` (7)
  - **5 passos:** copiar a pasta e criar o cofre fora dela → pôr os dados em `dados/brutos/` → abrir a IA na pasta → colar o prompt de partida → responder a cada portão, depois de conferir os 2 números sorteados com a sua semente.
  - **Modos:** completo (13 portões) ou essencial (6 portões e escopo reduzido, para trabalho de disciplina). As 12 regras e as travas valem nos dois.
  - **Por ferramenta:** Claude Code → `CLAUDE.md` com `@AGENTS.md` · agentes que leem `AGENTS.md` → nada a fazer · IA de chat → anexar `AGENTS.md` + etapa atual.
  - **Prompt de partida** (versão curta):
    ```text
    Você vai operar o Funil de Análise Assistida por IA descrito em AGENTS.md.
    Leia AGENTS.md e saidas/00-status.md e siga o ciclo PEVD, parando em cada
    portão para a minha aprovação. Comece pela etapa 00.
    ```
- **Fala (45 s):** "O kit é só texto. Funciona com qualquer IA que aceite arquivos, e funciona melhor com as que executam código."

## 27 · Um portão na prática

- **Título:** Na prática, cada etapa termina num resumo, dois números para conferir e um pedido de decisão
- **Conteúdo (troca ilustrativa, marcada como exemplo):**
  > **IA:** Etapa 03 pronta para o G3.
  > - Feito: 7 fontes candidatas; 4 verificadas e baixadas com hash; 1 descartada (a tabela citada não existe nos metadados do órgão); 2 a verificar.
  > - Tolerâncias de C1 a C3 fixadas antes do download, com a margem que você declarou.
  > - Prova de leitura ok em F01 e F02.
  > - ⚠️ A métrica-chave tem só uma fonte independente.
  > - **Para conferir:** me dê uma semente.
  > - **Decisão pedida:** Aprovo G3 · Ajustar · Voltar.
  >
  > **Humano:** Ajustar: buscar uma segunda fonte para a métrica-chave.
  >
  > **IA:** … F05 verificada, prova de leitura ok. Checklist completo. Semente?
  >
  > **Humano:** 42. *(o sorteio aponta `F05.prova` e `D01.linhas`; ele reexecuta os dois scripts, os números batem)* Aprovo G3. *(`git tag G3` e `git push origin G3`)*
  >
  > **IA:** Registrei duas DECs: a do portão, com a sua frase, e a da âncora, com o SHA que o remoto devolve para G3. Sigo para a etapa 04.
- **Rodapé:** *exemplo ilustrativo do formato; não é uma análise real.*
- **Fala (40 s):** "Reparem no 'descartada: a tabela citada não existe'. É a regra 3 funcionando."

## 28 · Limites

- **Título:** O kit torna o erro visível e caro, não impossível
- **Conteúdo:**
  - Não substitui julgamento. Portão aprovado sem leitura anula o sistema.
  - Em modo agente, a IA tem shell: consegue ler qualquer arquivo que você lê e mover tags locais. O cofre torna a violação **deliberada e visível**, não impossível; só as **âncoras externas** (mensagem ao revisor, ou remoto com proteção de tags testada) ficam de fato fora do alcance dela.
  - Custa tempo: use o modo essencial para trabalhos curtos.
  - Pergunta descritiva de censo: o "teste" vira regra de comparação travada antes. Pouco dado: hipóteses travadas antes de explorar.
- **Fala (30 s):** "Processo não é garantia: é o que deixa o erro à vista a tempo de corrigir."

## 29 · Encerramento

- **Título:** IA acelera; o método protege
- **Conteúdo (3 mensagens):**
  1. A pergunta, a decisão e o efeito que importa vêm antes do dado.
  2. Toda conclusão encara uma régua externa e um revisor que não a escreveu e que reexecuta o código.
  3. A IA propõe e executa; quem aprova é você, com as travas fora do alcance dela.
- **Rodapé:** kit em `fluxo/`: 13 etapas · 18 templates · 7 referências · pesquisa em `pesquisa/`
- **Fala (30 s):** "Obrigado. O kit está disponível. Testem na próxima análise de vocês e me digam onde ele quebra: ele foi feito para ser auditado."

---

## Apêndice

### A1 · Matriz de convergência

- **Título:** Cada etapa do funil tem origem em pelo menos um framework clássico, exceto onde estavam as lacunas
- **Conteúdo:** matriz etapa × framework (CRISP-DM, KDD, SEMMA, IBM FMDS, TDSP, CRISP-ML(Q), DMAIC, PPDAC), igual à seção 3 de `fluxo/referencias/frameworks.md`, com as linhas das lacunas (03 dados externos, 07 testes) destacadas.
- **Fala:** só se perguntarem "de onde veio isso?".

### A2 · Referências principais

- Chapman et al. (2000), *CRISP-DM 1.0*.
- Fayyad, Piatetsky-Shapiro & Smyth (1996), *AI Magazine*.
- Wild & Pfannkuch (1999), *International Statistical Review*.
- Studer et al. (2021), CRISP-ML(Q).
- Martínez-Plumed et al. (2021), *IEEE TKDE*.
- Leek & Peng (2015), *Science*.
- Peng & Matsui (2015), *The Art of Data Science*.
- ASA (2016) sobre p-valores.
- Simmons, Nelson & Simonsohn (2011).
- Nosek et al. (2018), *PNAS*.
- Steegen et al. (2016), multiverso.
- Dell'Acqua et al. (2023; 2026).
- Zhu et al. (2026), HLER.
- Bertran, Fogliato & Wu (2026), *PNAS*.
- Miao, Pritchard & Zou (2026).
- Rahman et al. (2025).
- Minto (1987); Knaflic (2015); Garner & Alley (2013).
- Código de Boas Práticas das Estatísticas Europeias; LGPD (Lei 13.709/2018).

Lista completa em `fluxo/referencias/bibliografia.md`.
