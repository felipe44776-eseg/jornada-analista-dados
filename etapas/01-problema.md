---
etapa: "01"
nome: "Problema e decisão"
fase: "1 · Enquadrar"
portao: "G1 ★"
papel_ia: "Entrevistador(a) e consultor(a) de problema"
entradas:
  - saidas/00-kickoff.md
saidas:
  - saidas/01-brief.md
template: templates/01-brief.md
origem: "CRISP-DM: Determine business objectives, Determine data mining goals · TDSP: Business understanding (charter) · IBM FMDS: Business understanding, Analytic approach · DMAIC: Define · PPDAC: Problem · Google DA: Ask · CS109: Ask · Leek & Peng (2015): tipos de pergunta"
---

# Etapa 01 — Problema e decisão

> **Missão:** transformar um pedido vago numa pergunta respondível, ligada a uma decisão real, com tipo definido, critério de sucesso, **efeito mínimo relevante declarado pelo dono** e hipóteses a priori escritas, **antes** de olhar os dados.

## Por que esta etapa existe

- Todos os frameworks começam aqui: *Business Understanding* (CRISP-DM, TDSP, IBM), *Define* (DMAIC), *Problem* (PPDAC), *Ask* (Google, CS109). O guia do CRISP-DM avisa que pular esta fase leva a gastar muito esforço "producing the right answers to the wrong questions".
- **O tipo de pergunta define o método e a afirmação permitida.** Leek & Peng (2015): "the most frequent failure in data analysis is mistaking the type of question being considered".
- **O efeito mínimo relevante é uma decisão de negócio, não estatística:** "abaixo de quanto de diferença não vale mudar nada?". Ele precisa vir do dono **agora**, antes de qualquer número. Senão ele acaba sendo escolhido depois, do tamanho que faz o resultado "dar".
- Hipóteses a priori escritas agora são a defesa contra transformar, depois, uma suspeita antiga em "descoberta" (HARKing).
- Com IA, dois riscos: a ferramenta completar lacunas do contexto com suposições plausíveis, e ancorar as respostas do dono com as próprias sugestões.

## Papel da IA

Entrevistar, desafiar a vagueza, propor a árvore de perguntas, classificar o tipo de pergunta, sugerir métricas candidatas e **hipóteses rivais**. A IA **não sugere** as crenças do dono, a decisão, a métrica final nem o efeito mínimo: pergunta aberto e registra o que ouviu.

## Tipos de pergunta (Leek & Peng, 2015)

| Tipo | Pergunta típica | Afirmação permitida | Erro de trocar o tipo |
|---|---|---|---|
| **Descritiva** | Quanto? Quantos? Como se distribui? | "Na base, 23% dos clientes…" | tratar como inferencial: *n of 1 analysis* |
| **Exploratória** | Que padrões existem? | "X e Y aparecem associados; hipótese a testar" | tratar como inferencial: *data dredging*; como preditiva: *overfitting* |
| **Inferencial** | O padrão vale fora da base? | "Estimamos, na população, … (IC …)" | tratar como causal: *correlation does not imply causation* |
| **Preditiva** | Dado X, qual o Y provável? | "O modelo prevê Y com erro …" | dizer que o modelo explica **por quê** |
| **Causal** | Se mudarmos X, Y muda, em média? | com experimento: "X causa Y"; com desenho observacional: verbo **condicional**, sob premissas explícitas | causalidade sem desenho |
| **Mecanística** | Como exatamente X muda Y? | mecanismo demonstrado | raro fora da engenharia |

Fluxograma e fontes: [`referencias/frameworks.md`](../referencias/frameworks.md) §6.

## Roteiro PEVD

### P — Planejar
1. Leia o kickoff. Escreva em 3 linhas o que você já entende do problema, marcando cada suposição como `[suposição — confirmar]`.
2. Prepare a entrevista em rodadas de no máximo 5 perguntas. As perguntas sobre **decisão, crenças, fatos da organização, métrica e efeito mínimo** vão **abertas, sem sugestão de resposta**.

### E — Executar
1. **Rodada 1, a decisão:** quem decide? O quê? Até quando? Quais opções estão na mesa? O que acontece se nada for decidido?
2. **Rodada 2, a pergunta:**
   - o que exatamente precisa ser sabido, para qual população, período e unidade de análise;
   - qual métrica define sucesso e como ela é calculada;
   - **qual é a menor diferença que mudaria a decisão** (efeito mínimo relevante, m);
   - **qual é o tamanho de efeito que se espera de fato** (efeito plausível, δ, maior que m), com base na experiência do dono ou na literatura. Ele serve só para o cálculo de poder.
   Os dois entram como `[declarado: quem, data]`.
3. **Rodada 3, o que já se acredita:** o que o dono e a área esperam encontrar, e com base em quê. Essas são as hipóteses a priori, com **origem** registrada (dono · área · literatura · análise anterior). Hipótese sugerida por você **não** conta como a priori. Pergunte também as restrições e os riscos.
4. **Teste da decisão:** monte a tabela "se a análise mostrar X, a decisão será Y". Se todas as respostas levam à mesma ação, a pergunta não informa a decisão: reformule com o humano.
5. **Classifique o tipo de pergunta** e justifique por que não é o tipo vizinho. Escreva as afirmações permitidas e as proibidas.
6. **Árvore de perguntas (MECE):** 3 a 7 subperguntas que, juntas, respondem à principal, cada uma ligada ao dado que exige.
7. **Hipótese rival mais forte** para cada hipótese a priori. Aqui você pode, e deve, sugerir.
8. **Critérios de sucesso** mensuráveis: de decisão, analíticos e de comunicação.
9. Escopo, premissas, restrições, riscos (incluindo ética e privacidade) e glossário.
10. **Se a pergunta for causal:** desenho e premissas. Experimento permite verbo causal. Desenho observacional exige verbo condicional, nível E2 ou mais e análise de sensibilidade a confundidor não medido. Sem desenho, reclassifique.
11. *(Opcional)* **Deck fantasma:** 3 a 6 títulos-mensagem hipotéticos, marcados como hipóteses.

### V — Verificar
- Releia o brief como se fosse o decisor. A pergunta cabe em uma frase? A métrica é calculável? O efeito mínimo foi dito pelo dono (e não por você)?
- Sinais de pergunta ruim:
  - sem população ou sem período;
  - métrica indefinida;
  - "entender X" sem decisão por trás;
  - pergunta causal sem desenho;
  - subperguntas que se sobrepõem.
- Toda `[suposição — confirmar]` foi confirmada ou virou premissa explícita?
- Rode o checklist do portão (§13 do artefato).

### D — Decidir: portão G1 ★
Portão crítico: o **dono da pergunta** (real ou simulado) aprova o brief e uma segunda pessoa revisa, ou a ausência é registrada. Peça `Aprovo G1`.

## Armadilhas

| Armadilha | Salvaguarda |
|---|---|
| "Explore os dados e vê o que acha" (pergunta sem decisão) | teste da decisão |
| Pergunta causal respondida com dado observacional sem desenho | tipo de pergunta + afirmações proibidas escritas |
| A IA preenche o contexto com suposições plausíveis | marcar `[suposição — confirmar]`; o humano confirma |
| A IA sugere a crença, a métrica ou o efeito mínimo, e o dono concorda | perguntas abertas; resposta registrada como `[declarado: quem, data]` |
| Métrica vaga ("engajamento", "satisfação") | definição operacional com fórmula |
| Efeito mínimo escolhido depois de ver os dados | declarado pelo dono no G1, antes de qualquer número |
| Hipótese antiga apresentada depois como descoberta | hipóteses a priori registradas com origem, antes do dado |
| A IA concorda com a hipótese do chefe (bajulação) | hipótese rival obrigatória |
| O deck fantasma vira profecia autorrealizável | títulos marcados como hipóteses; a etapa 09 compara o fantasma com o resultado |

## Prompts prontos

```text
Antes de propor qualquer análise, me entreviste sobre a DECISÃO que este
trabalho vai informar. No máximo 5 perguntas por rodada, numeradas. Nas
perguntas sobre a decisão, as crenças do dono, a métrica e o menor efeito que
mudaria a decisão, NÃO sugira respostas: pergunte aberto. Marque como
[suposição — confirmar] tudo o que você estiver presumindo.
```

```text
Classifique a pergunta principal segundo Leek & Peng (descritiva, exploratória,
inferencial, preditiva, causal, mecanística). Justifique por que NÃO é o tipo
vizinho e liste as afirmações que o tipo permite e as que proíbe.
```

```text
Para cada hipótese a priori, escreva a hipótese rival mais forte que um
especialista cético defenderia, e que dado distinguiria uma da outra.
```

## Volte para trás quando

- Aparecer dado que não foi classificado no kickoff → **00**.
- O dono da pergunta mudar ou a decisão deixar de existir → reabra o **01** do zero e registre no log.
