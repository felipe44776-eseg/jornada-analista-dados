# Glossário

> Termos usados no kit, em ordem alfabética. Onde o termo é do próprio kit, está marcado *(kit)*.

| Termo | Significado |
|---|---|
| **Achado** | resultado que passou por teste confirmatório (E1 ou mais), com decisão "confirmada" ou "contrária". Diferente de **observação**, que é E0 |
| **Âncora externa** *(kit)* | registro fora do alcance da IA que prova o estado aprovado. Pode ser uma mensagem do humano (ao revisor ou, sem revisor, ao próprio e-mail) com a frase de aprovação, o `git rev-parse` da tag e os hashes. Ou uma tag num remoto cuja proteção foi testada no G0 (`push -f` e `push --delete` recusados). Exigida nos portões ★ e nos travamentos. Depois dela, a IA acrescenta uma DEC do tipo `âncora` com o SHA |
| **Anti-join** | junção que devolve as linhas de uma tabela **sem** correspondência na outra. Serve para achar códigos que se perderam num *join* |
| **Artefato** *(kit)* | arquivo `.md` produzido por uma etapa em `saidas/`, a partir do template de mesmo nome |
| **Auditoria adversarial** | revisão feita por quem não fez a análise (pessoa ou sessão de IA sem histórico), com a missão de derrubar os achados, reexecutando o código |
| **Base integrada** | a base limpa e harmonizada antes da partição. Contém a confirmação, por isso vai para o **cofre** |
| **Baseline** | modelo ou regra simples de referência que o modelo candidato precisa superar |
| **BLUF** | *bottom line up front*: a conclusão vem no início |
| **Bootstrap** | reamostragem com reposição para estimar a incerteza. Com dado agrupado ou temporal, reamostre por bloco ou por entidade |
| **Calibração** | quanto as probabilidades previstas por um modelo batem com as frequências observadas |
| **Cofre** *(kit)* | pasta **fora do projeto**, guardada pelo humano e indicada pela variável `COFRE_DIR`, onde fica o conjunto de confirmação até a etapa 07 |
| **Colisor** (*collider*) | variável causada por duas outras. Controlar por ela **abre** uma associação espúria entre as duas |
| **comparar_resultados.py** *(kit)* | script da etapa 08 que compara, chave a chave, o `resultados/` regerado com o `resultados_ref/` congelado. Usado na reprodução, pelo auditor e na etapa 12 |
| **Confirmação (conjunto de)** | parte dos dados separada antes de explorar, usada uma única vez para testar o que foi registrado |
| **Confundidor** | variável que causa tanto o tratamento quanto o desfecho e cria associação sem causalidade |
| **Contrária** *(kit)* | hipótese cujo efeito saiu relevante e significativo **no sentido oposto** ao esperado. É achado E1, no sentido observado |
| **DAG** | diagrama causal (grafo acíclico dirigido) com as relações supostas entre variáveis |
| **DEC** *(kit)* | entrada do log de decisões (`DEC-001`…). Portão só vale com DEC do tipo `portão` e a frase literal do humano |
| **Derrubado** *(kit)* | veredito da auditoria: o achado não se sustenta e sai da comunicação |
| **Desvio** *(kit)* | mudança em relação ao registro travado. **Cego:** decidido antes de ver o resultado da hipótese; mantém o nível. **Informado pelo resultado:** rebaixa a E0 |
| **Efeito de desenho** (DEFF) | quanto a variância aumenta por causa do desenho amostral (estrato, conglomerado, peso) em relação à amostra aleatória simples. O *n* efetivo, usado no poder, é *n* / DEFF |
| **Efeito mínimo relevante** (m) | a menor diferença que mudaria a decisão. Declarada pelo dono da pergunta no brief, antes de ver dado |
| **Efeito plausível** (δ) | o tamanho de efeito que se espera de fato, maior que m, declarado pelo dono ou tirado da literatura. Serve para calcular o poder da regra. Nunca é a estimativa da exploração |
| **E-value** | o quão forte um confundidor não medido teria de ser para anular a associação observada |
| **Equivalência (TOST)** | teste que mostra que o efeito está **dentro** de uma faixa irrelevante (−m; +m). É o que o kit chama de **refutada** |
| **Escada de evidência** *(kit)* | níveis E0 (observação), E1 (confirmado), E2 (robusto) e E3 (triangulado), que definem o verbo permitido |
| **Estimando** | a quantidade exata que responde à pergunta (ex.: diferença de proporções B − A, em p.p.) |
| **Família** (de hipóteses) | conjunto corrigido junto para multiplicidade. No kit: as hipóteses que sustentam a mesma decisão |
| **FDR** | *false discovery rate*: proporção esperada de falsos positivos entre os achados. Controlada por Benjamini–Hochberg |
| ***Forking paths*** (jardim dos caminhos que se bifurcam) | as muitas escolhas possíveis de análise que, feitas depois de ver o dado, produzem "significância" sem má-fé (Gelman & Loken) |
| **FWER** | *family-wise error rate*: probabilidade de **algum** falso positivo na família. Controlada por Holm |
| **G8-auditoria** *(kit)* | tag criada pelo humano depois do rascunho da etapa 08. Não é trava: marca o estado copiado para a auditoria e o fim do diff que o auditor lê, a partir do SHA de `trava-registro` tirado da âncora |
| **Gatilho objetivo** *(kit)* | condição mensurável, escrita no registro, que aciona o plano B de um teste (ex.: *n* < 30 e assimetria > 1) |
| **HARKing** | *hypothesizing after the results are known*: apresentar uma hipótese criada depois do resultado como se fosse anterior (Kerr, 1998) |
| **Hash** (SHA-256) | impressão digital de um arquivo. Qualquer mudança de conteúdo muda o hash. **Hash de conteúdo** de uma tabela ignora detalhes do formato do arquivo |
| **IC** (intervalo de confiança) | faixa de valores compatíveis com os dados, para a estimativa. "IC não ajustado" = sem correção de multiplicidade |
| **Inconclusiva** *(kit)* | o dado não basta para decidir: IC largo, ou efeito detectável mas sem garantia de ser relevante |
| **Maldição do vencedor** | o efeito escolhido por ter parecido grande numa amostra tende a ser menor de verdade. Por isso a estimativa da exploração não serve para calcular poder |
| **MECE** | *mutually exclusive, collectively exhaustive*: subperguntas sem sobreposição e sem lacuna |
| **Multiverso** | rodar a análise sob todas as escolhas razoáveis (limpeza, janela, especificação) e mostrar quanto o resultado depende delas (Steegen et al., 2016) |
| **p-valor** | grau de incompatibilidade entre os dados e um modelo especificado. **Não** é a probabilidade de a hipótese ser verdadeira (ASA, 2016) |
| ***P-hacking*** | testar recortes, variáveis ou especificações até achar um p pequeno, e reportar só esse |
| **Paradoxo de Simpson** | a associação muda de sinal quando os dados são agrupados de outro jeito, em geral por efeito de composição |
| **PEVD** *(kit)* | o ciclo de cada etapa: a IA **P**laneja (com expectativa), **E**xecuta (em código) e **V**erifica; o humano **D**ecide |
| **Placar do funil** *(kit)* | contagem do que entrou e saiu de cada camada (perguntas, fontes, gráficos, hipóteses, testes, achados, insights) |
| **Poder da regra** *(kit)* | probabilidade de a regra de decisão declarar "confirmada" se o efeito verdadeiro for um valor plausível acima de m |
| **Portão** (G0–G12) *(kit)* | ponto de aprovação humana ao fim de cada etapa. ★ = crítico, com segunda pessoa |
| **Pré-registro** | registro, **antes** de ver o resultado, das hipóteses, testes, efeito mínimo e regras de decisão. No kit, travado no G5 |
| ***Prompt injection*** | instrução escondida em dado, página ou arquivo que tenta comandar a IA. Conteúdo externo é dado, nunca instrução |
| **Prova de leitura** *(kit)* | reproduzir um número publicado pela fonte externa, com o método de quem publicou, a partir do arquivo baixado |
| **Pseudonimização** | troca de identificadores por códigos, com a chave guardada à parte. **Continua sendo dado pessoal** (LGPD, art. 13, §4º) |
| **Quarentena** | lugar onde ficam as linhas excluídas da base, com o motivo |
| **Refutada** *(kit)* | IC inteiro dentro de (−m; +m): o efeito, se existe, é pequeno demais para mudar a decisão. Passa pela validação (08) antes de ser comunicada |
| **Reserva de α** *(kit)* | decisão do G5 do ciclo 1 de guardar metade do α para um eventual ciclo 2. Com ela, α' = α/2 substitui α em tudo, nos dois ciclos: regra de decisão, poder e IC |
| **resultados_ref** *(kit)* | cópia congelada, somente leitura, de `resultados/` dentro da cópia de auditoria ou da reprodução. É com ela que `comparar_resultados.py` compara os números regerados |
| **rodar_tudo.py** *(kit)* | comando único do pipeline (etapa 04), na ordem de uma lista explícita, não na alfabética. Com `--reproducao`, faz as reproduções das etapas 08 e 12 e a da auditoria: exige `COFRE_DIR` vazio, simula a devolução do cofre, protege o modelo congelado e compara com `resultados_ref/` |
| **Sal** (da partição) *(kit)* | texto fixo, definido no kickoff, combinado ao ID antes do SHA-256 para atribuir cada entidade à exploração ou à confirmação de forma estável |
| **SCQ(A)** | Situação, Complicação, Pergunta (Question) e Resposta (Answer): estrutura de abertura de Minto |
| **Sensibilidade** | repetir a análise com escolhas alternativas razoáveis para ver se o achado se mantém |
| **Sorteio** (de conferência) *(kit)* | em cada portão, 2 chaves de `resultados/` sorteadas com uma semente que o humano dá na hora. O humano reexecuta o script de origem de cada uma |
| **Tag git** | marcador num commit (ex.: `G5`). **Tag só local não é imutável**: quem tem acesso ao shell, inclusive a IA em modo agente, pode movê-la. Vira âncora quando enviada a um remoto cuja proteção de tags foi **testada** no G0: sem proteção, quem tem a credencial de push (a IA, pelo shell) força a tag para outro commit |
| **Título-asserção / título-mensagem** | título de slide ou gráfico que diz a conclusão, não o tema |
| **trava-registro · trava-modelo** *(kit)* | tags criadas no commit em que o registro de hipóteses é travado e em que o modelo é congelado, qualquer que seja o portão (G5, pausa do modo essencial, G4 sem partição, G6). No ciclo 2, `trava-registro-c2`. A 07 e o auditor conferem todas contra a âncora externa: a tag e o conteúdo dos arquivos travados. Travou, não reabre |
| **Triangulação** | confirmar um resultado por caminhos independentes (outra fonte, outro método). **De nível** valida a base; **de efeito** leva a E3 |
| **UPA** | unidade primária de amostragem (conglomerado) em pesquisas amostrais complexas |
| **Vazamento** (*leakage*) | informação que não estaria disponível no momento da previsão, ou do conjunto de teste, entrando no treino |
| **Vnn / Vnnc** *(kit)* | gráfico da exploração (E0) / o mesmo gráfico regerado na base do teste, para ilustrar o achado |
