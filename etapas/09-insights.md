---
etapa: "09"
nome: "Insights e storyline"
fase: "5 · Comunicar"
portao: "G9"
papel_ia: "Estrategista e storyteller"
entradas:
  - saidas/00-status.md (placar do funil)
  - saidas/01-brief.md
  - saidas/07-resultados-testes.md
  - saidas/08-validacao.md
  - resultados/*.json
saidas:
  - saidas/09-insights.md
template: templates/09-insights.md
origem: "OSEMN: iNterpret · PPDAC: Conclusions · KDD: interpretar e agir · Google DA: Share, Act · DMAIC: Improve · Minto: Pyramid Principle, SCQ(A) · Knaflic: Big Idea, história de 3 minutos, storyboard · assertion–evidence (Garner & Alley, 2013)"
---

# Etapa 09 — Insights e storyline

> **Missão:** converter achados validados em **poucos insights acionáveis** (o quê, e daí, e agora) e organizá-los numa história com a resposta primeiro, sem inflar a evidência.

## Por que esta etapa existe

- **Achado não é insight.** "O cancelamento é 2,1 p.p. maior no plano B" é um achado. O insight acrescenta o **e daí**, com o verbo que a evidência permite: "se a diferença não se explicar pelo perfil de quem escolhe o B, o plano pode estar perdendo clientes". E acrescenta o **e agora**: "rever o preço do B no próximo ciclo e medir".
- Os frameworks terminam em interpretação e ação: *iNterpret* (OSEMN), *Conclusions* (PPDAC), *Share* e *Act* (Google).
- **Pirâmide de Minto:** resposta primeiro, argumentos depois, evidência na base. **SCQ(A)** abre a história. **Big Idea** (Knaflic, a partir de Duarte): uma frase completa, com o ponto de vista e o que está em jogo.
- **Títulos-asserção:** num experimento com estudantes de engenharia, slides com título em frase-asserção e evidência visual deram mais compreensão e menos equívocos que títulos-tópico com tópicos (Garner & Alley, 2013).
- Com IA, o risco é o **enfeite**: impacto em reais que ninguém calculou, verbo mais forte que a evidência, contrafactual causal escrito sobre uma associação, narrativa do início vencendo os dados.

## Papel da IA

Propor a mensagem central, os cartões, a pirâmide e os decks fantasmas, e **se recusar a enfeitar**. O humano escolhe a recomendação.

## Roteiro PEVD

### P — Planejar
1. Liste os achados validados (A01…), inclusive os **contrários** (efeito relevante no sentido oposto ao esperado), com nível, tipo de afirmação e chaves em `resultados/`.
2. Liste também as hipóteses **refutadas validadas na etapa 08**, com o nível delas: "o efeito, se existe, é menor que m" é informação útil para a decisão.
3. Declare a expectativa: quais achados mais pesam na decisão do brief.

### E — Executar
1. **Mensagem central:** uma frase, de até 25 palavras, que responde à pergunta principal.
2. **SCQ(A):** situação, complicação, pergunta, resposta.
3. **Cartões de insight:** **até 5**, sem mínimo. Cada um com o quê (número citado pela chave), e daí, e agora, evidência, confiança (E3 = alta; E1–E2 = média), tipo de afirmação e ressalvas. **Zero achado confirmado é resultado válido**: nesse caso a mensagem central é "os dados não sustentam mudar X", com o que se aprendeu.
4. **Impacto:** só se calculado por script, com premissas escritas [→ chave]. Sem cálculo, não há número de impacto.
5. **Recomendação:** ação, alternativas consideradas, o que precisa ser verdade, riscos e a decisão pedida.
6. **Pirâmide:** mensagem → até 3 argumentos → evidências.
7. **Decks fantasmas:** só os títulos, dos dois decks, na ordem.
8. **Comparação com o fantasma do brief** (§12, se houver): o que se confirmou e o que mudou. **Se nada mudou, desconfie**: viés de confirmação, ou uma análise que só procurou o que já se esperava?
9. **O que não afirmamos:** limites explícitos.
10. **Placar final** do funil.

### V — Verificar
- Algum insight se apoia em E0, em achado **derrubado** pela auditoria ou em achado "não reexecutado" acima de E1? Remova ou rebaixe.
- O verbo de cada insight respeita o nível e o tipo (`AGENTS.md` §8)? Procure contrafactual causal escondido no "e daí".
- Todo número tem chave em `resultados/`?
- **Teste do título:** lidos em sequência, os títulos contam a história inteira?
- Rode o checklist do portão (§9 do artefato).

### D — Decidir: portão G9
Peça `Aprovo G9`. A partir daqui, os decks só **formatam** o que foi aprovado. Nenhum insight novo entra neles.

## Armadilhas

| Armadilha | Salvaguarda |
|---|---|
| Insight que é só fato ("vendas caíram 3%") | as três perguntas: o quê, e daí, e agora |
| "E daí" causal sobre associação ("o plano B **está custando** clientes") | verbo condicional, conforme o nível e o desenho |
| Encher cartões porque "precisa de 3 a 5" | até 5; zero é resultado válido |
| Esconder o resultado refutado ou o contrário | refutada validada é comunicável ("o efeito, se existe, é menor que m"), com confiança; contrária é insight como qualquer outro |
| Refutada comunicada sem ter passado pela validação | só refutadas que passaram pelas sensibilidades e pela auditoria da 08 |
| Recomendação que não decorre da evidência | pirâmide: cada argumento ancorado em A__ |
| Impacto em R$ inventado pela IA | impacto só com cálculo em script e premissas |
| A narrativa do início vence a evidência | comparar com o fantasma do brief e explicar as diferenças |
| Linguagem inflada ("comprova", "revolucionário") | verbo da escada de evidência |

## Prompts prontos

```text
Para cada achado validado, escreva: O QUÊ (número citado pela chave em
resultados/), E DAÍ (o que muda na decisão do brief, com o verbo que o nível
e o desenho permitem, sem contrafactual causal sobre associação) e E AGORA
(ação, dono, prazo). Se um achado não muda nenhuma decisão, diga isso em vez
de inventar um "e daí": ele vai para o deck técnico, não para o executivo.
```

```text
Escreva a mensagem central em uma frase de até 25 palavras. Depois aja como
o decisor cético e liste as 5 perguntas mais difíceis que ele faria, cada uma
com a resposta e o rastreio.
```

## Volte para trás quando

- Um insight depende de achado não validado → **08**.
- Os achados não respondem à pergunta do brief → **01**, para reenquadrar ou abrir novo ciclo, com registro e respeitando o limite de ciclos.
