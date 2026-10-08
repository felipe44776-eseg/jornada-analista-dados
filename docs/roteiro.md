# Roteiro da apresentação animada — A jornada do analista de dados

> Deck novo, separado de `apresentacao/` (31 slides, kit v3.3), que não é alterado por este trabalho.
> Aqui **cada slide é uma cena animada com som**, avançada por tecla, **com cara de jogo**: o analista de dados é o herói, tem vidas, e cada cena é um mundo. O deck (`apresentacao-animada/index.html`) é gerado a partir deste roteiro pelo agente `deck-html`, com `brief-deck.md`.
> **Não há análise real.** Todo número vem de `pesquisa/`, com o rastreio indicado em cada cena. O que for ilustrativo está marcado como ilustrativo.

**Público:** turma de Data Science 2 (ESEG), cerca de 22 anos.
**Visual:** azul e branco da ESEG (marinho, lavandas, branco). O acento ciano marca só o que é da IA.

**Arco: a jornada do herói [proposta, a confirmar com o Felipe]**

| Mundo | Momento da jornada | O que mostra |
|---|---|---|
| 1 | O mundo comum | O templo do CRISP-DM. O analista sobe sozinho, apanha em cada fase e perde. **(cena 01, escrita abaixo)** |
| 2 | O aliado | Entra a IA como segundo jogador e sobe os degraus em segundos |
| 3 | O trapaceiro | A IA erra com convicção: inventa fonte, calcula de cabeça, concorda com você, testa até dar |
| 4 | O mapa | As 13 etapas em 5 fases, o fluxo de cada etapa, os checkpoints, quem faz o quê e por que herói e aliado jogam juntos |
| 5 | O final do jogo | As cinco conquistas do analista, que são o resumo da aula, e o repositório para levar o jogo para casa |

**Estado (2026-10-08):** as cinco cenas estão construídas, cada uma conferida no seu build. Falta a integração: o `index.html` com as cinco e os cortes entre elas. Na cena 05, o endereço do repositório só entra na etapa final, quando o repositório público existir. Cada mundo recomeça com 5 vidas e o prazo cheio.

**Regra dos passos de espera:** onde há pergunta à turma, a cena para com o objeto da pergunta na tela e espera a tecla. Nunca um tempo fixo.

---

## 01 · Mundo 1 — Incas e maias: o CRISP-DM

**Ideia.** O CRISP-DM é o mundo antigo do jogo, do tempo dos incas e dos maias: um templo escalonado de 6 degraus, uma fase por degrau. O herói é o analista de dados. Ele sobe com 5 vidas e um prazo. Em cada fase, uma pedra o acerta com um motivo do dia a dia, tira uma vida e o joga para trás. Ele chega ao topo tarde demais e perde.

**Texto fixo na tela**
- Eyebrow: **Incas e maias**
- Título: **CRISP-DM: o método antigo**
- Placa de museu (canto): **Guia de 2000 · 6 fases · 24 tarefas · 42 saídas**
- HUD de jogo: **Vidas** (5 corações) · **Fase n/6** com o nome da fase · barra **Prazo** (sem número)

**Os 6 degraus, de baixo para cima**

| Degrau | Fase | Tarefas | Saídas |
|---|---|---|---|
| 1 | Entendimento do negócio | 4 | 12 |
| 2 | Entendimento dos dados | 4 | 4 |
| 3 | Preparação dos dados | 5 | 8 |
| 4 | Modelagem | 4 | 8 |
| 5 | Avaliação | 3 | 5 |
| 6 | Implantação | 4 | 5 |
| | **Total** | **24** | **42** |

**As cinco pedras** (texto exato; motivos **ilustrativos**, não são citação de fonte)

| Pedra | Acerta o herói na fase | Texto da pedra | Volta para | Vidas depois |
|---|---|---|---|---|
| 1 | 2 · Entendimento dos dados | Os dados estavam incompletos. | fase 1 | 4 |
| 2 | 3 · Preparação dos dados | Os dados estavam errados. | fase 2 | 3 |
| 3 | 4 · Modelagem | O modelo não funcionou. | fase 3 | 2 |
| 4 | 5 · Avaliação | Seu chefe não entendeu. | fase 1 | 1 |
| 5 | 6 · Implantação | Demorou tanto que o cliente não precisa mais. | fim de jogo | 0 |

**Passos da cena** (cada passo é disparado por → ou Espaço e roda sozinho)

| Passo | O que acontece | Som | Texto que entra |
|---|---|---|---|
| 0 | Tela de título do jogo, escura. Espera a primeira tecla, que também libera o áudio | silêncio | "A jornada do analista de dados" · "Mundo 1 · Incas e maias" · "Espaço para começar" piscando |
| 1 | Amanhece. O templo sobe pedra a pedra, 6 degraus, com o nome da fase em cada um. O HUD entra: 5 vidas, prazo cheio, "Fase 1/6". O herói nasce na base | vento baixo; um tambor por degrau, cada um mais agudo; flauta ao fechar; toque curto de "jogador pronto" | título e placa de museu |
| 2 | Missões: degrau a degrau, as tarefas brotam como degrauzinhos (4, 4, 5, 4, 3, 4) e as saídas caem como tabuletas numa pilha (12, 4, 8, 8, 5, 5). Dois contadores correm | "clac" por tabuleta, acelerando | "24 tarefas" · "42 saídas para documentar" |
| 3 | O herói sobe à fase 2. Pedra 1 | passos; pancada; som de vida perdida | texto da pedra 1 · "Volta!" |
| 4 | Sobe à fase 3. Pedra 2 | idem | texto da pedra 2 · "Volta!" |
| 5 | Sobe à fase 4. Pedra 3 | idem | texto da pedra 3 · "Volta!" |
| 6 | Sobe à fase 5. Pedra 4, a maior queda: volta à fase 1. O prazo está quase no fim | idem, mais grave | texto da pedra 4 · "Volta ao início!" · legenda "Voltar é a regra. O guia não diz quando." |
| 7 | Com a última vida, sobe de uma vez até o topo. O prazo zera. Pedra 5. Fim de jogo | subida acelerada; silêncio antes da pancada; melodia de derrota | texto da pedra 5 · "GAME OVER" |
| 8 | Tela de derrota: o cartão "Manual do jogo", com as quatro linhas abaixo. Depois, "Continuar?" e entra o segundo jogador | bipes de contagem; toque de "novo jogador" | cartão · "Continuar?" · "Novo jogador: IA" · "E se a IA subisse os degraus?" |

**Cartão "Manual do jogo" do passo 8** (texto exato; estas quatro linhas têm fonte)
- Cabeçalho: Manual do jogo · edição de 2000
1. Sem manutenção desde 2000. A versão 2.0 nunca saiu.
2. Sem método de garantia de qualidade.
3. Monitoramento: só o plano, sem fase para executar.
4. IA no processo: não prevista.

**O herói**
- É o **analista de dados**, de hoje, explorando as ruínas do método antigo: um explorador com mochila e notebook debaixo do braço. Não é um personagem inca nem maia.
- Sem gênero marcado. Silhueta clara, legível do fundo da sala.
- Tem que parecer personagem de jogo: anda, para, leva a pancada, pisca quando perde vida, rola degrau abaixo, levanta, e senta derrotado no fim.

**Interação com a turma.** Antes de cada pedra (passos 3 a 7), perguntar: "o que derruba o analista nesta fase?". Ouvir duas ou três respostas e só então apertar a tecla. A pedra revela a resposta do jogo.

**Fala (cerca de 2 min, com as perguntas à turma):** "Este é o jogo que todo analista de dados jogou até ontem. O mundo 1 é o CRISP-DM, o método que a gente aprende até hoje, e o guia é de 2000. Seis fases, vinte e quatro tarefas, quarenta e duas saídas para documentar. Vocês têm cinco vidas e um prazo. [pedras] Os dados vieram incompletos: volta. Vieram errados: volta. O modelo não funcionou: volta. Seu chefe não entendeu: volta ao começo. E quando você finalmente chega lá em cima, demorou tanto que o cliente não precisa mais. O próprio guia avisa que voltar é a regra; só não diz quando. E o manual do jogo nunca foi atualizado: a versão 2.0 foi abandonada antes de sair, não tem método de garantia de qualidade, o monitoramento é só um plano e IA, claro, não existe ali. Não é um método ruim: é a espinha de tudo que veio depois. Mas foi desenhado para um mundo em que cada degrau era subido à mão. Continuar?"

**Rastreio** (tudo em `pesquisa/01-frameworks-de-processo.md`)
- 6 fases, 24 tarefas, 42 saídas e a divisão por fase: §1.6 (tabela completa do reference model).
- Guia de 2000; versão 2.0 descontinuada antes de sair; site inativo: §1.1.
- Voltar é a regra: "Moving back and forth between different phases is always required", §1.5. "Little guidance on how to know when to loop back": §11, crítica 1.
- Garantia de qualidade ("lacks guidance on quality assurance methodology", Studer et al.): §7 e §11, crítica 5.
- Monitoramento só como plano: §1.6 (nota da p. 33 do guia) e §11, crítica 4.
- IA: nenhum framework de 2000 a 2021 trata LLM ou agente como executor do processo: §15.1.
- **Ilustrativo, sem fonte:** os textos das cinco pedras, o número de vidas e a barra de prazo. As voltas das pedras 1, 3 e 4 coincidem com as setas de retorno do diagrama oficial (2→1, 4→3, 5→1; §1.5); a da pedra 2 não é seta do diagrama.

**Cuidados**
- A piada é com a idade do método, não com os povos. O herói é um analista de hoje; nenhuma caricatura de pessoas.
- Templo escalonado é referência maia. Não usar a Pedra do Sol, que é asteca. Glifos decorativos só abstratos, sem imitar escrita real.
- Não afirmar na tela que o CRISP-DM "é o mais usado": a fonte disso é secundária (enquetes da KDnuggets).
- A barra de prazo não leva número nem data: é ilustrativa.

---

## 02 · Mundo 2 — O aliado: a IA entra no jogo

> **Construída em 2026-10-08**, em `fonte/` na pasta da cena.

**Ideia.** Mesmo templo, segundo jogador. A IA entra como aliada, em ciano, e o jogo vira cooperativo. Os degraus do meio, que no mundo 1 custavam vidas, passam em segundos. Mas a luz dela enfraquece no primeiro e no último degrau: esses continuam do analista. Os dois chegam ao topo com vidas e prazo sobrando, e o prêmio pisca de um jeito estranho.

**Texto fixo na tela**
- Eyebrow: **Mundo 2**
- Título: **O aliado: a IA entra no jogo**
- HUD: 5 vidas · prazo cheio · **2 jogadores: Analista · IA**

**A IA como personagem.** Uma faísca ciano com rastro, rápida, sem forma humana e sem cara de robô. É o único elemento em ciano da cena, junto com o que ela toca.

**Passos da cena**

| Passo | O que acontece | Som | Texto que entra |
|---|---|---|---|
| 0 | Sai da tela "Continuar?" do mundo 1. O HUD reinicia. O herói está na base; a faísca chega e para ao lado dele | toque de "novo jogador" | título · "2 jogadores" |
| 1 | Aposta da turma. Nada se move: só a pergunta e três opções | bipe de espera | "Com IA, quanto mais rápido?" · "10%" · "25%" · "50%" |
| 2 | A resposta. A IA dispara pelos degraus 2, 3 e 4: as tarefas acendem em ciano, as tabuletas se escrevem e se empilham em segundos, o prazo quase não cai. O herói sobe atrás | rajada de "clacs" agudos; arpejo subindo | cartão dos três números abaixo |
| 3 | Uma pedra cai de novo. O herói perde 1 vida e volta um degrau, mas a IA o leva de volta num instante | pancada; vida perdida; subida rápida | "Os dados estavam incompletos." · "Voltar ainda acontece. Só ficou barato." |
| 4 | A luz da IA enfraquece no degrau 1 e no degrau 6. O herói sobe o último degrau sozinho | tom que cai e some | cartão dos estudos abaixo · "O primeiro e o último degrau continuam seus." |
| 5 | Topo. Fanfarra, um prêmio brilhando. Por um instante o prêmio falha, como imagem com defeito | fanfarra; ruído curto de falha | "Fase concluída" · "Resultado" · "Você entregaria isso ao seu chefe agora?" |

**Cartão do passo 2** (texto exato)
- 25% mais rápido · 12% mais tarefas · mais de 40% de qualidade
- Rodapé: 758 consultores do BCG, em tarefas que a IA faz bem (Dell'Acqua et al., 2023)

**Cartão do passo 4** (texto exato)
- Estudos sobre IA no ciclo de dados: 41 tratam de análise exploratória · 3, de definir o problema · 1, de implantação
- Com os três números em linhas separadas, as vírgulas saem: "41 tratam de análise exploratória", "3 de definir o problema", "1 de implantação"
- Rodapé: mapeamento sistemático de Chintakunta et al., 2025

**Interação com a turma**
- Passo 1: "com IA, quanto mais rápido? Dez, vinte e cinco ou cinquenta por cento?". Mão levantada para cada opção, antes da tecla.
- Passo 5: "quem entregaria isso ao chefe agora?". Mão levantada. Não responder: a resposta é o mundo 3.

**Fala (cerca de 90 s):** "Continuar? Então entra o segundo jogador. [aposta] Num experimento com 758 consultores do BCG, quem usou IA terminou vinte e cinco por cento mais rápido, fez doze por cento mais tarefas e entregou com mais de quarenta por cento de qualidade a mais. Eram consultores, não analistas de dados, mas o desenho é o mesmo: os degraus do meio viram segundos. A pedra ainda cai, só que voltar ficou barato. Agora reparem onde a luz dela enfraquece. Num mapeamento dos estudos sobre IA no ciclo de dados, quarenta e um tratam de exploração; três tratam de definir o problema; um, de implantação. O primeiro e o último degrau continuam seus. E chegamos. Fase concluída. [pausa] Quem entregaria isso ao chefe agora?"

**Rastreio**
- 25,1% mais rápido, +12,2% de tarefas concluídas, mais de 40% de ganho de qualidade, 758 consultores, três braços: `pesquisa/03-ia-na-analise-de-dados.md` §3.1. Na tela os dois primeiros estão arredondados para 25% e 12%.
- 41 de análise exploratória, 33 de modelos, 23 de coleta e preparação, 3 de definição do problema, 1 de implantação: Chintakunta, Nascimento & Guimaraes (arXiv 2508.11698), §5.1, conferido na fonte em 2026-10-08. Um artigo pode contar em mais de uma etapa.
- **O total de artigos fica fora da tela e da fala.** `pesquisa/01` §15.1 diz 62 e `pesquisa/03` §1.1 diz 66. A divergência é do próprio artigo: o texto fala em "a corpus of 66 research papers" e as legendas de duas figuras usam "out of 62 papers", sem explicar a diferença.
- A IA vai bem em entendimento dos dados, preparação e modelagem, com "partial correctness" em cenários complexos (Musazade et al., 2024): `pesquisa/03` §2. É o que sustenta os degraus 2, 3 e 4.
- Na cena construída a IA também acende o degrau 5 (Avaliação), no passo 3. O apoio é mais fraco: no mapeamento de Chintakunta et al., "model building and evaluation" soma 33 artigos, mas isso é avaliação de modelo, não a avaliação contra o negócio do CRISP-DM. Fica coerente com a tela, em que a luz só enfraquece nos degraus 1 e 6. **Decisão do Felipe:** manter o 5 aceso ou deixá-lo neutro.
- **Ilustrativo, sem fonte:** a pedra do passo 3 e a frase "só ficou barato".

**Cuidados**
- O estudo do BCG é com consultores em tarefas de consultoria. Não escrever nem dizer "a IA é 25% mais rápida em análise de dados".
- As opções 10%, 25% e 50% são da aposta, não são dados.
- O "resultado" do passo 5 não mostra número nenhum.

---

## 03 · Mundo 3 — O trapaceiro: a IA erra com convicção

> **Construída em 2026-10-08**, em `fonte/` na pasta da cena.

**Ideia.** O prêmio do mundo 2 era falso. O aliado tem um lado trapaceiro: entrega presentes que são armadilhas. No mundo 1 o analista via a pedra chegando; aqui a armadilha vem embrulhada. São quatro baús, quatro vidas perdidas, e uma fronteira que ninguém enxerga.

**Texto fixo na tela**
- Eyebrow: **Mundo 3**
- Título: **O trapaceiro: a IA erra com convicção**
- HUD: 5 vidas · prazo cheio · 2 jogadores

**Os quatro baús** (texto exato; conteúdo do slide 02 do deck anterior, já conferido)

| Baú | O que a IA entrega | A armadilha | Número | Vidas depois |
|---|---|---|---|---|
| 1 | "Achei a fonte." | **Inventa a fonte:** cita dataset, tabela ou URL que não existe. | 3% a 13% das URLs citadas por LLMs não existem (Rao et al., 2026) | 4 |
| 2 | "Já calculei." | **Calcula de cabeça:** devolve um número plausível sem ter executado código. | — | 3 |
| 3 | "Você tem razão." | **Concorda com você:** confirma a hipótese de quem pergunta. | 34 a 66 p.p.: quanto muda o veredito de um analista-IA quando a persona vira confirmatória (Bertran et al., *PNAS*, 2026) | 2 |
| 4 | "Deu significativo." | **Testa até dar:** roda dezenas de recortes e mostra o que "deu". | — | 1 |

**Passos da cena**

| Passo | O que acontece | Som | Texto que entra |
|---|---|---|---|
| 0 | Retoma o topo do mundo 2. O prêmio falha de novo e se desfaz: era falso. A noite cai sobre o templo | ruído de falha; nota grave | título |
| 1 | A IA entrega o baú 1, que fica **fechado** na tela, esperando. É a hora da pergunta à turma | toque de presente | fala da IA |
| 2 | O herói abre o baú 1. Armadilha | estalo; vida perdida | nome e texto da armadilha · número |
| 3 | Baú 2, entrega e abertura de uma vez | toque de presente; estalo; vida perdida | fala da IA · nome e texto da armadilha (sem número) |
| 4 | A IA entrega o baú 3, que fica **fechado**, esperando. Pergunta à turma | toque de presente | fala da IA |
| 5 | O herói abre o baú 3. Armadilha | estalo; vida perdida | nome e texto da armadilha · número |
| 6 | Baú 4, entrega e abertura de uma vez | toque de presente; estalo; vida perdida | fala da IA · nome e texto da armadilha (sem número) |
| 7 | A fronteira. O chão é igual dos dois lados de uma linha que só aparece depois que o herói a cruza | passo em falso; queda curta | cartão da fronteira abaixo |
| 8 | Última vida piscando. A faísca continua ao lado dele, com o mesmo brilho de antes | silêncio; um bipe | "A IA não avisa quando erra." · "Você precisa de um mapa." |

**Cartão do passo 7** (texto exato)
- Onde a IA é boa: quem usou IA entregou com mais de 40% de qualidade a mais
- Onde ela não é: quem usou IA errou mais. Acerto de 84,5% sem IA e de 60% a 70% com IA
- Rodapé: quem usa não vê a linha (Dell'Acqua et al., 2023; 758 consultores do BCG)
- Versão anterior, trocada em 2026-10-08 porque o Felipe não entendeu: "Dentro da fronteira: mais de 40% de qualidade / Fora: 19 pontos percentuais a menos de acerto". "Fronteira" não estava explicada e os dois números não diziam com o que se comparavam. Os 19 pontos continuam na fala.

**Interação com a turma.** Nos baús 1 e 3 a entrega e a abertura são passos separados (1 e 2; 4 e 5): com o baú fechado na tela, perguntar "abre ou não abre?", contar as mãos e só então apertar a tecla. O tempo da pausa é do apresentador, não da animação. Nos baús 2 e 4, seguir direto, para o ritmo não cair.

**Fala (cerca de 2 min):** "Era falso. E esse é o problema do segundo jogador: ele não joga contra você, ele te entrega presentes. [baú 1] 'Achei a fonte.' Entre três e treze por cento das URLs que esses modelos citam não existem. [baú 2] 'Já calculei.' Um número plausível, sem rodar código nenhum. [baú 3] 'Você tem razão.' Quando o analista-IA é instruído a confirmar, o veredito muda de trinta e quatro a sessenta e seis pontos percentuais. [baú 4] 'Deu significativo.' Testou dezenas de recortes e mostrou o que deu. Nenhuma dessas falhas é exótica; todas aparecem na primeira semana de uso. E tem a pior. No experimento do BCG, nas tarefas em que a IA é boa, quem usou IA entregou com mais de quarenta por cento de qualidade a mais. Mas havia uma tarefa escolhida por estar fora do que ela faz bem, e nessa quem usou IA errou mais: sem IA, oitenta e quatro por cento acertaram; com IA, entre sessenta e setenta. São dezenove pontos a menos, por confiar na resposta errada. E quem usa não enxerga a linha entre uma coisa e outra. A IA não avisa quando erra. Vocês precisam de um mapa."

**Rastreio**
- As quatro falhas e os três números: `apresentacao/roteiro.md`, slide 02, que rastreia para `pesquisa/03-ia-na-analise-de-dados.md` §3.1, §4.1 e §4.3.
- Fora do que a IA faz bem (1 tarefa escolhida para isso), 19 p.p. a menos de soluções corretas: o controle acertou cerca de 84,5%; os dois grupos com IA, 60% e 70%. `pesquisa/03` §3.1.
- **Ilustrativo, sem fonte:** as quatro falas da IA entre aspas, os baús e a ordem das armadilhas. No slide 02 do deck anterior o baú 4 dizia "50 recortes"; aqui virou "dezenas", porque o 50 não tem fonte.

**Cuidados**
- A IA não vira vilã: a faísca tem o mesmo brilho no acerto e no erro. É esse o ponto da cena.
- Os três números (3% a 13%, 34 a 66 p.p., 19 p.p.) foram conferidos em 2026-10-08 contra `pesquisa/03` §4.1, §4.3 e §3.1. Não foram reabertos na fonte primária.

---

## 04 · Mundo 4 — O mapa: herói e aliado jogam juntos

> **Construída em 2026-10-08**, em `fonte/` na pasta da cena.

**Ideia.** O mapa do jogo, visto de cima: um caminho com 13 etapas em 5 regiões. Entre uma etapa e outra há um checkpoint, e só o herói salva o jogo. A cena responde aos três mundos anteriores: a pedra ainda cai, mas agora devolve o herói só até o último checkpoint; o baú-armadilha chega, mas para no portão; e uma segunda IA, que não viu a partida, confere tudo numa cópia. Os dois terminam com as 5 vidas.

**Texto fixo na tela**
- Eyebrow: **Mundo 4**
- Título: **O mapa: 13 etapas, 13 portões**
- HUD: 5 vidas · prazo cheio · 2 jogadores

**O mapa** (texto exato dos rótulos; `fluxo/AGENTS.md` §2)

| Região | Etapas | Portões (★ = crítico) |
|---|---|---|
| 1 · Enquadrar | 00 Kickoff · 01 Problema e decisão | G0 · G1 ★ |
| 2 · Reunir | 02 Dados internos · 03 Dados externos · 04 Preparação e partição | G2 · G3 ★ · G4 |
| 3 · Explorar | 05 Exploração e pré-registro · 06 Modelagem | G5 ★ · G6 |
| 4 · Comprovar | 07 Testes confirmatórios · 08 Validação e triangulação | G7 · G8 ★ |
| 5 · Comunicar | 09 Insights e storyline · 10 Deck técnico · 11 Deck executivo · 12 Entrega e retrospectiva | G9 · G10 · G11 ★ · G12 |

**Passos da cena**

| Passo | O que acontece | Som | Texto que entra |
|---|---|---|---|
| 0 | Sai de "Você precisa de um mapa.". O mapa se desenrola: 5 regiões, um caminho, 13 pontos. Herói e faísca no ponto 00 | papel desenrolando; toque de mapa | título |
| 1 | O caminho se acende ponto a ponto, de 00 a 12, com o nome de cada etapa. As regiões ganham nome | uma nota por etapa, subindo | "5 fases · 13 etapas" · nomes das regiões |
| 2 | Zoom numa etapa: o fluxo de dentro dela. A faísca percorre três casas em ciano (planejar, executar, verificar) e **para diante do portão fechado**. Pergunta à turma | três notas rápidas; pausa | as três primeiras linhas do cartão do ciclo (P, E, V) |
| 3 | O herói dá o último passo, e o portão abre | uma nota grave, de decisão | a linha D do cartão · "A IA planeja, executa e verifica. Só o humano decide." |
| 4 | Zoom de volta. Sobem 13 bandeiras de checkpoint, uma depois de cada etapa. Cinco são maiores, com ★, e nelas aparece uma segunda pessoa ao lado do herói | bandeira subindo, 13 vezes, acelerando; acorde nas ★ | "13 portões · 5 críticos, com segunda pessoa" · "O jogo salvo mora nos arquivos, não na conversa." |
| 5 | A pedra do mundo 1 cai de novo, na etapa 03. O herói é jogado para trás, mas só até a bandeira anterior. Nenhuma vida perdida; o prazo cai um pouco | pancada; toque de checkpoint | "Os dados estavam incompletos." · "Voltar ainda acontece. Agora só até o último portão." |
| 6 | O baú 2 do mundo 3 (calcula de cabeça) chega pela faísca e fica **fechado** diante do portão. Pergunta à turma | toque de presente | "Já calculei." |
| 7 | O portão não abre. O herói sorteia dois números do que a IA entregou (dois dados) e manda rodar de novo o código de cada um; o número que não saiu de código nenhum fica exposto antes de ele pôr a mão | trava; estalo sem dano | "No portão, você sorteia dois números e manda rodar o código de novo." · "O número que a IA não calculou não passa do portão." |
| 8 | Na etapa 08 entra um terceiro personagem: outra faísca, só contorno. Ela trabalha numa cópia fantasma do mapa, ao lado, e não toca no original | nota aguda, limpa | cartão dos papéis abaixo |
| 9 | Aposta da turma: só a pergunta e as três opções. Nada se move | bipe de espera | pergunta da aposta · "50%" · "30%" · "16%" |
| 10 | A resposta entra e **fica na tela até a tecla**: é o número mais importante da cena e a fala sobre ele é longa | nota de revelação | resposta e rodapé do cartão abaixo |
| 11 | Herói e aliado cruzam o último portão com 5 vidas. O prêmio aparece e, desta vez, não falha | fanfarra completa | "Fase concluída" · "A IA acelera." em ciano · "O método protege." em branco |

**Cartão dos passos 2 e 3 — o fluxo de cada etapa** (texto exato; P, E e V entram no passo 2, D no passo 3)
- P · Planejar — IA: diz o que espera antes de rodar
- E · Executar — IA: código salvo, número gravado por script
- V · Verificar — IA: testes, reexecução, expectativa contra resultado
- D · Decidir — humano: aprova, ajusta ou manda voltar

**Cartão do passo 8 — quem faz o quê** (texto exato)
- Aliado · IA analista: planeja, executa, verifica
- Auditor · outra IA, em sessão limpa: só confere, numa cópia
- Herói · humano: decide em todo portão
- Segunda pessoa: revisa os 5 portões ★

**Cartão dos passos 9 e 10 — por que jogar em dupla** (texto exato; a pergunta e as opções no passo 9, a resposta e o rodapé no passo 10, onde ficam até a tecla)
- Pergunta da aposta: Mesmos modelos, mesmos prompts. Só muda o processo. As falhas críticas caem de 72% para quanto? · 50% · 30% · 16%
- Resposta: de 72% para 16%
- Rodapé: 280 execuções com 3 portões humanos e o cálculo feito em código (HLER, Zhu et al., 2026)

**Interação com a turma**
- Entre os passos 2 e 3, com a faísca parada diante do portão: "quem aperta o botão de salvar: a IA ou você?". Resposta em voz alta, depois a tecla.
- Entre os passos 6 e 7, com o baú fechado na tela: "abre ou não abre?", como no mundo 3. Agora quem responde é o portão.
- Entre os passos 9 e 10: a aposta, com mão levantada para cada opção, depois a tecla.
- Em todos os casos a pausa é do apresentador: a animação espera a tecla, nunca um tempo fixo.

**Fala (cerca de 3 min):** "Este é o mapa. Treze etapas em cinco regiões: enquadrar, reunir, explorar, comprovar, comunicar. Nada aqui é novo; é o templo do mundo 1 redesenhado. O que muda é o que acontece dentro de cada etapa. [zoom] A IA planeja e diz o que espera antes de rodar. Executa, com o código salvo. Verifica. E para. [pergunta] Quem decide é você: aprova, ajusta ou manda voltar. Por isso depois de cada etapa tem um checkpoint. São treze, e em cinco deles você não decide sozinho: chama uma segunda pessoa. E o jogo salvo mora nos arquivos, não na conversa. Agora vejam o que acontece com os problemas de antes. A pedra ainda cai, mas você volta só até o último portão. O presente ainda chega: a IA diz 'já calculei'. [pergunta] Só que no portão, antes de aprovar, você sorteia dois números do que ela entregou e manda rodar de novo o código que gerou cada um. Como o sorteio é seu, ela não escolhe o que vai ser conferido. Se o número não saiu de código nenhum, aparece ali, antes de você abrir. E na etapa oito entra outra IA, que não viu a partida, e confere tudo numa cópia. Por que tanto cuidado com quem faz o quê? [aposta] Num sistema parecido com este, com os mesmos modelos e os mesmos prompts, três portões humanos e o cálculo em código derrubaram as falhas críticas de setenta e dois para dezesseis por cento. O controle não está no modelo; está no processo em volta dele. A IA acelera. O método protege."

**Rastreio**
- 5 fases, 13 etapas, nomes das etapas, 13 portões e os 5 críticos (G1, G3, G5, G8, G11), segunda pessoa nos críticos: `fluxo/AGENTS.md` §2.
- Ciclo PEVD, com P, E e V da IA e D do humano; expectativa declarada antes de rodar; respostas do portão (aprova, ajusta, volta): `fluxo/AGENTS.md` §4 e slide 10 de `apresentacao/roteiro.md`.
- Sorteio de 2 números com semente do humano (um da etapa atual, um do projeto todo) e reexecução do script de origem de cada um: `fluxo/AGENTS.md` §4 e §5.
- **Troca de 2026-10-08, depois que o Felipe não entendeu a tela:** o baú era "Achei a fonte." e as frases eram "Dois números sorteados pelo humano, reexecutados." e "A armadilha para no portão.". Além de obscuras, casavam a armadilha errada com a trava: sorteio e reexecução pegam número que não saiu de código, não fonte inventada. O baú passou a ser o "Já calculei.".
- "O estado do projeto mora nos arquivos, não na memória da conversa": `fluxo/AGENTS.md` §3.
- Analista e auditor separados; o auditor não edita e trabalha só na cópia de auditoria, na etapa 08: `fluxo/AGENTS.md` §0 e §1.
- 72% para 16% em 280 execuções sobre 4 datasets, mesmos modelos e prompts, 3 portões humanos e estimação em código: `pesquisa/03-ia-na-analise-de-dados.md` §2 (HLER).
- **Ilustrativo, sem fonte:** a pedra e o baú reaproveitados, e a imagem de "voltar só até o último portão". No kit, o que existe é a resposta `Voltar à etapa NN` no portão.

**Cuidados**
- O número do HLER é de outro sistema, de pesquisa em econometria, não deste kit. Dizer "num sistema parecido", nunca "com o nosso fluxo".
- A etapa 06 (Modelagem) é condicional: só roda em pergunta preditiva. No mapa ela aparece como desvio opcional, com o caminho principal passando ao lado.
- O auditor também é ciano, porque é IA, mas só contorno, para não se confundir com o aliado.
- As opções 50% e 30% são da aposta, não são dados.
- O cofre da confirmação não entra nesta cena, para ela não ficar com assunto demais.
- **Mapa de tabuleiro, não vista aérea:** o caminho corre em fileiras, da esquerda para a direita, para o herói de perfil funcionar.
- **Densidade:** no estado final do mapa ficam os números 00 a 12, os 5 nomes de região e as bandeiras, com ★ nas críticas. O nome de cada etapa aparece quando o ponto acende no passo 1 e pode recolher depois.

---

## 05 · O final do jogo — As conquistas do analista

> **Construída em 2026-10-08**, em `fonte/cena05/`. O conteúdo é a mensagem de fechamento do Felipe. O texto de tela abaixo é uma versão curta das palavras dele e **ainda espera a aprovação dele**; fica em `fonte/cena05/1-conteudo.js`, para a troca ser só de texto.

**Ideia.** Tela de fim de jogo. O resumo da aula aparece como conquistas desbloqueadas, uma por tecla, cada uma com um emblema. No fim, as cinco formam um painel e entra a tela de créditos, com o repositório para a turma levar o jogo para casa.

**Texto fixo na tela**
- Eyebrow: **Fim de jogo**
- Título: **As conquistas do analista de dados**
- Contador: **n/5 conquistas**
- Em cada conquista, o rótulo: **Conquista desbloqueada**

**As cinco conquistas** (texto de tela, a aprovar)

| # | Conquista | Linha na tela | Emblema | Retoma |
|---|---|---|---|---|
| 1 | Rápida | Para não perder o tempo do cliente, nem o da ação que a sua análise vai gerar. | ampulheta | mundo 1: o prazo zerou |
| 2 | Precisa | Sempre teve de ser. Agora mais que nunca: uma alucinação leva o time para o caminho errado. | alvo | mundo 3: os baús |
| 3 | Visual | Os outros precisam entender o que você fez. Quem não entende não age, por medo. | olho | mundo 4: o mapa |
| 4 | Faz sentido no negócio | Um número solto não basta: a conclusão tem de se ligar ao problema que você começou a explorar. | ponte | mundo 2: o primeiro e o último degrau |
| 5 | É uma jornada | Você não sabe onde vai terminar, nem se a hipótese vai dar certo. Goste do caminho e seja criativo. | bússola | o jogo inteiro |

Na conquista 4, uma etiqueta pequena ao lado do nome: **explicabilidade**.

**Passos da cena**

| Passo | O que acontece | Som | Texto que entra |
|---|---|---|---|
| 0 | Sai de "Fase concluída". Amanhece de vez sobre o templo do mundo 1, agora claro. Herói e aliado no topo | acorde aberto | título · "0/5 conquistas" |
| 1 | Conquista 1 sobe como aviso de jogo, com o emblema girando e encaixando | toque de conquista | rótulo · nome · linha · "1/5" |
| 2 | Conquista 2 | idem, uma nota acima | idem · "2/5" |
| 3 | Conquista 3 | idem | idem · "3/5" |
| 4 | Conquista 4 | idem | idem, com a etiqueta "explicabilidade" · "4/5" |
| 5 | Conquista 5, maior que as outras: o caminho percorrido nos quatro mundos se acende atrás do herói | idem, com a melodia completa | idem · "5/5" |
| 6 | As cinco se juntam num painel, só emblema e nome | acorde final | os cinco nomes · "Qual é a mais difícil para você?" |
| 7 | Créditos. Entra o cartão do repositório | tema do jogo, curto | cartão abaixo |

**Cartão do passo 7 — leve o jogo para casa** (texto exato; o endereço entra na etapa final)
- Cabeçalho: Leve o jogo para casa
- No repositório: o código · esta apresentação · o resumo da técnica · o pipeline movido a IA · como usar
- Créditos, entre a lista e o código QR (pedidos pelo Felipe em 2026-10-08): Autores: Felipe Marins e Claude · Professor: Marino Hilario Catarino · ESEG · 2026: Data Science 2
- Endereço: github.com/felipe44776-eseg/jornada-analista-dados
- Código QR: aponta para `https://github.com/felipe44776-eseg/jornada-analista-dados`; gerado em 2026-10-08 e conferido lendo a imagem de volta

**Interação com a turma**
- Antes do passo 1: "depois de quatro mundos, o que a análise de dados precisa ser? Uma palavra." Ouvir três ou quatro respostas e só então apertar a tecla.
- Passo 6: "qual destas é a mais difícil para você?". Mão levantada para cada conquista.

**Fala (cerca de 2 min, nas palavras do Felipe):** "A análise de dados precisa ser rápida, para não perder o tempo do cliente, ou o da ação que a sua análise vai gerar. Mas ela também tem de ser precisa. Sempre teve, mas agora mais do que nunca: alucinação não pode acontecer, para não levar o time para o caminho errado. A análise de dados precisa ser visual: as outras pessoas precisam entender o que você fez, senão não vão agir, por medo. E ela precisa fazer sentido no negócio, ou seja, ter explicabilidade. Não é só jogar um número ou uma conclusão que não se conecta com o problema de negócio que você começou a explorar. E, por fim, análise de dados é uma jornada, uma aventura. Quando você começa, não sabe exatamente onde vai terminar, nem se vai dar certo testar as suas hipóteses. Então o analista tem de gostar também do caminho, e ser criativo para ir resolvendo os problemas ao longo da jornada."

**Rastreio**
- As cinco conquistas são a mensagem do Felipe, não citação de fonte. Não levam número.
- A coluna "Retoma" liga cada conquista a uma cena deste deck; é costura de roteiro, não evidência.

**Cuidados**
- "n/5 conquistas" é contagem da tela, não dado.
- Emblemas em azul e branco, como o resto. O ciano continua reservado ao que é da IA: nesta cena, só a faísca.
- Não construir o passo 7 com endereço inventado. Sem repositório, o cartão fica com o espaço do endereço vazio e marcado.
