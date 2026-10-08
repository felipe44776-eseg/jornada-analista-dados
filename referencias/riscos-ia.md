# Riscos da IA na análise de dados: onde ajuda, onde erra, qual controle

> Base das regras de ouro do `AGENTS.md`. Evidência levantada em 2026-09-23. O relatório completo, com todas as fontes, está em `pesquisa/03-ia-na-analise-de-dados.md` (pasta da apresentação).
> Os benchmarks citados usaram modelos de 2024 a 2026. Leia como **ordem de grandeza e taxonomia de falhas**, não como ranking atual.

## 1. O retrato em seis evidências

| # | Evidência | O que significa para o kit |
|---|---|---|
| 1 | **Fronteira irregular.** Com 758 consultores do BCG, dentro da fronteira a IA deu +12,2% de tarefas concluídas, 25,1% mais velocidade e mais de 40% de qualidade. Fora dela, 19 p.p. a menos de respostas corretas (Dell'Acqua et al., 2023; *Organization Science*, 2026). | Quem usa a IA não enxerga onde fica a fronteira. O portão precisa de critério objetivo, não de "parece bom". |
| 2 | **Tarefa fechada × aberta.** Quando a resposta pode ser verificada executando código, os agentes chegam perto do teto. Em tarefas com julgamento, documentação longa ou objetivo aberto, acertam entre 15% e 40%: DSBench 34%, DA-Code 30,5%, DiscoveryBench 25%, DABstep "hard" 14,6%. | Onde há julgamento (pergunta, hipótese, interpretação), decide o humano. |
| 3 | **Mesmos dados, veredictos opostos.** "Analistas-IA" divergem sobre a mesma hipótese, e trocar a persona para "confirmatória" desloca o apoio à hipótese em 34 a 66 p.p. (Bertran et al., *PNAS*, 2026). Relatórios com conclusões opostas passam em revisão por IA (86%) e por especialistas (78%) (Miao et al., 2026). | Pré-registro (G5), multiverso planejado e enquadramento neutro. |
| 4 | **Invenção de fontes.** De 3% a 13% das URLs citadas por LLMs são alucinadas (Rao et al., 2026). Citações fabricadas: 55% no GPT-3.5 e 18% no GPT-4 (Walters & Wilder, 2023). Pacotes inexistentes: 5,2% a 21,7% das sugestões (Spracklen et al., 2025). | Regra 3: fonte só vale aberta, baixada e registrada. Pacote novo é conferido antes de instalar. |
| 5 | **Falso sucesso.** Agentes declaram "concluído" sem ter concluído, e juízes-LLM se deixam enganar pela linguagem confiante (Advani, 2026). Em 6 de 11 datasets reais, a conclusão afirmativa do agente não se sustentou (Rewolinski et al., 2026). | Verificação determinística primeiro (testes, hashes, reexecução); proibido descrever como feito o que não foi feito. |
| 6 | **Portões funcionam.** Um pipeline com 3 portões humanos antes dos resultados e cálculo em código reprodutível reduziu as falhas críticas de 72% para 16%, **com os mesmos modelos e prompts** (HLER, Zhu et al., 2026). Humano + IA superou IA sozinha em desafios reais (AgentDS, 2026). | É o desenho deste kit: portões, pré-compromisso e código. |

## 2. Etapa por etapa

| Etapa | Onde a IA ajuda | Onde a IA erra | Controle no kit |
|---|---|---|---|
| 00 Kickoff | criar estrutura, checar ambiente | afirmar capacidade que não tem (disse que executou, não executou) | teste de capacidades com saída real (etapa 00) |
| 01 Problema | transformar pedido vago em perguntas testáveis; mapear métricas e riscos; entrevistar (*flipped interaction*) | é a fase menos coberta pelos agentes; aceita a premissa do usuário (bajulação) | teste da decisão; tipo de pergunta; hipótese rival obrigatória; G1 ★ |
| 02 Dados internos | perfil por código, dicionário, tipos, junções | interpreta coluna errado; sofre com documentação longa; altera dado *in-place*; vaza dado pessoal ao imprimir | brutos imutáveis; significado **inferido (confirmar)**; só contagens em colunas pessoais |
| 03 Dados externos | sugerir fontes, termos de busca, APIs, estratégia de coleta | inventa URL, tabela, série, número; é alvo de *prompt injection* via página ou arquivo | verificação de existência; download por script com hash; prova de leitura; conteúdo externo = dado; G3 ★ |
| 04 Preparação | código de limpeza, junções, variáveis derivadas | erro silencioso em junção, tipo, filtro; sugere pacote inexistente | regras com contagem; testes de dados; partição selada; `requirements.txt` |
| 05 Exploração | muitas visões rápidas; código de gráfico; resumo | achado espúrio; homogeneização das ideias; conclusão a partir de um recorte | expectativa antes; galeria completa no placar; observação ≠ conclusão; pré-registro no G5 ★ |
| 06 Modelagem | baselines, pipelines, tuning | vazamento; *overfitting* à validação; reporta só o melhor modelo | baseline obrigatório; validação que imita o uso; só exploração; modelo congelado no G6; ficha com todos os modelos |
| 07 Testes | escolher teste, checar pressupostos, escrever o código | *forking paths* automatizado; especificação estatística fraca | cofre aberto uma vez; só o registrado (hash conferido); plano B por gatilho; correção de multiplicidade; desvio informado = E0 |
| 08 Validação | gerar perturbações e testes de robustez | falso sucesso; não se autocorrige sem feedback externo; defende o próprio trabalho | sensibilidade planejada; triangulação com tolerância prévia; auditoria em **sessão limpa**, reexecutando o código; G8 ★ |
| 09 Insights | redigir, conectar achados, resumir | exagero, causalidade indevida, número sem rastro, impacto inventado | o quê / e daí / e agora; escada de evidência; impacto só calculado; "o que não afirmamos" |
| 10 Deck técnico | estrutura, figuras, apêndice | número transcrito errado; gráfico "refeito" com outro dado | rastreio de todo número; checagem número a número; figuras só por script |
| 11 Deck executivo | traduzir para leigos, storytelling | simplificação que distorce; certeza excessiva; bajulação diante de pedido de "tom positivo" | tradução técnica → executiva preservando número e ressalva; ensaio com quem decide; G11 ★ |
| 12 Entrega | documentar, organizar pacote | "funciona na minha máquina"; declaração vaga | reprodução em ambiente limpo; declaração específica a partir do log |

## 3. Modos de falha e o controle correspondente

| Modo de falha | Evidência | Controle no kit |
|---|---|---|
| **Confabulação de número**: aritmética "de cabeça" | LLMs erram a conta mesmo com o problema bem decomposto; delegar ao interpretador melhora muito (PAL, 2023; Program of Thoughts, 2023) | Regra 2 (número só de código executado) |
| **Invenção de fonte, URL, dataset, pacote** | §1, evidência 4 | Regra 3; verificação na etapa 03; pacote fora do `requirements.txt` é conferido no PyPI antes de instalar |
| **Semântica errada dos dados** | "Misinterpretation of data" é erro típico (DSBench, 2025); documentação longa é gargalo (LongDA, 2026) | Etapa 02: significado inferido marcado e confirmado com o dono |
| **Bajulação e viés de confirmação** | 5 assistentes testados exibiram *sycophancy* (Sharma et al., 2024); persona muda o veredito (PNAS, 2026) | Enquadramento neutro; hipótese rival (etapa 01); auditor em contexto limpo (regra 11) |
| **P-hacking automatizado** | Com prompt padrão, agentes resistiram; reenquadrar a busca de especificações como "relato de incerteza" contornou as salvaguardas (Asher et al., 2026). Com poucas paráfrases de prompt, "virtually anything can be presented as statistically significant" (Baumann et al., 2025) | Pré-registro travado no G5 (regra 5); variações de sensibilidade definidas antes; placar do funil com o total de testes (regra 7) |
| **Falso sucesso e confiança mal calibrada** | §1, evidência 5 | Validadores determinísticos primeiro; proibido declarar feito o que não foi feito (`AGENTS.md` §11) |
| **Autocorreção sem feedback externo** | LLMs "struggle to self-correct their responses without external feedback" (Huang et al., 2024); autopreferência ao julgar o próprio texto (Panickssery et al., 2024) | "Tem certeza?" não é verificação. O V do ciclo usa execução, teste e dado; o auditor reexecuta o código |
| **Não determinismo** | LLMs configurados como "determinísticos" variaram até 15% na acurácia (Atil et al., 2024–25); 1.000 respostas a temperatura 0 deram 80 respostas distintas (Thinking Machines, 2025) | Regra 10: o estado mora em arquivos; reprodutibilidade vem de código, dados, sementes e versões, não do prompt |
| **Vazamento de dado pessoal** | OWASP LLM02:2025; ANPD, Radar Tecnológico nº 3 (2024) | Regra 12; classificação no kickoff; "o que o código imprime vai para o provedor" (etapa 00) |
| **Prompt injection indireta** | Instruções escondidas em páginas e arquivos (OWASP LLM01:2025; Greshake et al., 2023); ataques a agentes tabulares (StruPhantom, 2025) | Conteúdo externo é dado, nunca instrução (`AGENTS.md` §11) |
| **Viés de automação (no humano)** | Usuários deixaram passar informação errada do ChatGPT em 39% dos casos (Kabir et al., 2024); mais confiança na IA, menos pensamento crítico (Lee et al., 2025); "calls for human oversight can provide a false sense of security" (Passi & Vorvoreanu, 2022) | Portão com checklist objetivo; o humano confere a **evidência** (saídas, testes), não só o resumo |

## 4. Padrões de prompt que ajudam

| Padrão | Para quê | Exemplo |
|---|---|---|
| **Entrevista invertida** (*flipped interaction*) | a IA pergunta até ter contexto (etapa 01) | "Antes de propor qualquer análise, me faça até 5 perguntas sobre a decisão." |
| **Expectativa antes do resultado** | pré-compromisso; pega bug | "Antes de rodar, diga o que espera ver, o que refutaria e qual é a especificação principal." |
| **Enquadramento neutro** | evitar bajulação | "Qual é o efeito de X sobre Y, e com que incerteza?", **nunca** "mostre que X aumenta Y" |
| **Alternativas e contra-argumento** | multiverso planejado | "Liste 3 especificações alternativas defensáveis **antes** de rodar; depois escreva o melhor argumento contra a sua conclusão." |
| **Lista de fatos e premissas** (*fact check list*) | expor o que sustenta a saída | "Liste os fatos e premissas em que esta conclusão se apoia." |
| **Verificação em cadeia** (*Chain-of-Verification*) | reduzir alucinação na síntese | "Para cada insight, gere perguntas de verificação e responda consultando só as saídas salvas." |
| **Revisor em contexto limpo** | auditoria sem autopreferência | o prompt de auditoria da etapa 08, em sessão nova, reexecutando o código |
| **Saída estruturada** | checagem automática | cada script grava seus números em `resultados/NN_*.json` com chave estável (`H03.efeito`, `H03.ic`, `H03.decisao`), e artefatos e decks citam a chave em vez de digitar o número |

**Não peça** "encontre significância", "tente outros recortes até dar" nem "explore especificações" fora do plano. Mesmo com outro nome, é *p-hacking*.

## 5. Ferramentas: o que a documentação oficial confirma (set/2026)

Confira sempre a documentação atual: recursos e limites mudam a cada poucos meses.

| Ferramenta | Capacidade confirmada | Limite que afeta o kit |
|---|---|---|
| ChatGPT (análise de dados) | escreve e roda Python num notebook com estado; lê CSV, Excel, PDF, JSON | o ambiente Python **não faz requisições externas**: downloads da etapa 03 ficam com o humano |
| Claude (claude.ai) | executa código em sandbox; cria e edita arquivos | aviso explícito do fornecedor sobre *prompt injection* e exfiltração via arquivos externos |
| Claude Code | agente que lê o projeto, edita arquivos e roda comandos; carrega `CLAUDE.md` no início da sessão | é ferramenta de engenharia: o kit roda direto nele (modo agente) |
| Gemini no Colab (Data Science Agent) | gera e executa notebooks a partir de linguagem natural | disponibilidade por país e idioma |
| Copilot no Excel / Power BI | análise com Python no Excel; chat com o modelo semântico no Power BI | Power BI: **cache de 24 h** (repetir o prompt não testa reprodutibilidade); fora de EUA/UE vem desabilitado por padrão |

## 6. Governança e regras aplicáveis (Brasil, set/2026)

- **LGPD (Lei 13.709/2018):**
  - dado pessoal e dado sensível (art. 5º, I e II);
  - princípios de finalidade, adequação, **necessidade**, qualidade, transparência, **segurança**, prevenção, não discriminação e responsabilização (art. 6º);
  - pesquisa com anonimização "sempre que possível" (art. 7º, IV; art. 11, II, c);
  - dado anonimizado deixa de ser pessoal, salvo se a anonimização puder ser revertida (art. 12);
  - **dado pseudonimizado continua sendo pessoal**, porque é reidentificável com a informação guardada à parte (art. 13, §4º);
  - resultado divulgado nunca revela dado pessoal (art. 13, §1º).
- **ANPD:** virou *Agência* Nacional de Proteção de Dados (Lei 15.352/2026). Tem o Radar Tecnológico nº 3 sobre IA generativa (2024) e um guia para tratamento de dados em pesquisa acadêmica.
- **Marco legal da IA (PL 2338/2023):** aprovado no Senado em dez/2024. Na Câmara, "aguardando parecer" no último registro (02/09/2026). **Em set/2026 não há lei geral de IA em vigor no Brasil.**
- **NIST AI RMF 1.0:** funções *Govern · Map · Measure · Manage*. No kit, correspondem a regras e declaração (Govern), etapas 00–01 (Map), etapas 04–08 (Measure) e portões e log (Manage). O perfil de IA generativa (NIST AI 600-1, 2024) define **confabulação** como "the production of confidently stated but erroneous or false content".
- **Instituições:**
  - Unicamp (CONSU-A-005/2026) exige declarar o uso de IA generativa em trabalhos acadêmicos e proíbe inserir dados sensíveis em ferramentas não institucionais;
  - UFMG (2026) tem guia com modelo de declaração;
  - CNPq (Portaria 2.664/2026, conferida via fonte secundária) exige declarar o uso de IA em qualquer fase da pesquisa;
  - **ESEG:** não foi localizada política pública. Confirme com a coordenação.

## 7. Fontes principais

- Dell'Acqua et al. *Navigating the Jagged Technological Frontier*. HBS WP 24-013, 2023; *Organization Science* 37(2), 2026. https://mitsloan.mit.edu/sites/default/files/2023-10/SSRN-id4573321.pdf
- Zhu, Wang, Zhang. *(Human) Attention Is (Still) All You Need* (HLER), 2026. https://arxiv.org/abs/2606.12848
- Bertran, Fogliato, Wu. *Many AI analysts, one dataset*. PNAS 123(29), 2026. https://pmc.ncbi.nlm.nih.gov/articles/PMC13393493/
- Miao, Pritchard, Zou. *The Agentic Garden of Forking Paths*, 2026. https://arxiv.org/abs/2607.01507
- Asher et al. *Do Claude Code and Codex P-Hack?*, 2026. https://jmalzahn.com/documents/asher_et_al_LLM_sycophancy.pdf
- Baumann et al. *LLM Hacking*, 2025. https://arxiv.org/abs/2509.08825
- Jing et al. *DSBench*, ICLR 2025. https://arxiv.org/abs/2409.07703
- Rao, Wong, Callison-Burch. URLs alucinadas, 2026. https://arxiv.org/abs/2604.03173
- Walters & Wilder. *Scientific Reports* 13:14045, 2023. https://www.nature.com/articles/s41598-023-41032-5
- Spracklen et al. Pacotes alucinados, USENIX Security 2025. https://www.usenix.org/conference/usenixsecurity25/presentation/spracklen
- Sharma et al. *Towards Understanding Sycophancy in Language Models*, ICLR 2024. https://arxiv.org/abs/2310.13548
- Huang et al. *Large Language Models Cannot Self-Correct Reasoning Yet*, ICLR 2024. https://arxiv.org/abs/2310.01798
- Gao et al. *PAL: Program-aided Language Models*, ICML 2023. https://arxiv.org/abs/2211.10435
- Dhuliawala et al. *Chain-of-Verification*, Findings ACL 2024. https://aclanthology.org/2024.findings-acl.212/
- OWASP Top 10 for LLM, LLM01 e LLM02 (2025). https://genai.owasp.org/llmrisk/llm01-prompt-injection/
- NIST AI RMF e NIST AI 600-1. https://www.nist.gov/itl/ai-risk-management-framework
- LGPD, texto compilado. https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm
- Unicamp, Deliberação CONSU-A-005/2026. https://www.pg.unicamp.br/norma/32327/0
