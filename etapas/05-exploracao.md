---
etapa: "05"
nome: "Exploração, gráficos e pré-registro"
fase: "3 · Explorar"
portao: "G5 ★"
papel_ia: "Analista exploratório(a) + designer de visualização + estatístico(a)"
entradas:
  - saidas/01-brief.md
  - saidas/02-dados-internos.md
  - saidas/03-fontes-externas.md
  - saidas/04-preparacao.md
  - dados/processados/exploracao.*
  - resultados/02_*.json · resultados/04_*.json
saidas:
  - saidas/05-exploracao.md
  - saidas/05-registro-hipoteses.md → saidas/05-registro-hipoteses.travado.md (no G5)
  - analise/05_eda.py · resultados/05_*.json
  - figuras/Vnn_*.png
template: templates/05-exploracao.md + templates/05-registro-hipoteses.md
origem: "Tukey (1977, 1980): exploratório × confirmatório · CRISP-DM: Explore data · SEMMA: Explore · OSEMN: Explore · R4DS: Visualize · Peng & Matsui: epiciclo · KDD: passo 6 · Double Diamond: divergir/convergir · pré-registro (Nosek et al., 2018; Wagenmakers et al., 2012)"
---

# Etapa 05 — Exploração, gráficos e pré-registro

> **Missão:** explorar a base de exploração em busca de padrões que importam para a decisão, mostrá-los em gráficos honestos e transformá-los em hipóteses testáveis, **registradas e travadas antes de qualquer teste**.

## Por que esta etapa existe

- Tukey separou a análise **exploratória**, que descobre o que perguntar, da **confirmatória**, que testa o que foi perguntado. Os dois modos são legítimos; misturá-los é o problema. Só as análises pré-registradas "deserve the label 'confirmatory'" (Wagenmakers et al., 2012).
- **Epiciclo de Peng & Matsui:** declarar a expectativa, olhar o dado, comparar, revisar. Surpresa às vezes é descoberta; muitas vezes é bug.
- **Divergir e convergir** (Double Diamond): primeiro muitos gráficos, depois poucos, escolhidos pela árvore de perguntas.
- **O portão G5 separa exploração de confirmação.** Com poucos graus de liberdade (dois desfechos, *n* flexível, uma covariável, descartar uma condição), a taxa de falso positivo chega a 61% (Simmons et al., 2011). O pré-registro fixa o caminho antes de ver o resultado.
- Com IA, gerar 200 gráficos custa segundos. Por isso a disciplina de seleção, e a transparência sobre o que foi gerado, importam mais do que antes.

## Papel da IA

1. **Divergir:** gerar a galeria de gráficos por script, com IDs.
2. **Comparar:** expectativa × gráfico; registrar observações como fatos (E0).
3. **Convergir:** propor a seleção e os títulos-mensagem. O humano escolhe.
4. **Formalizar:** transformar as hipóteses escolhidas em registro completo e **executar o travamento**.

## Roteiro PEVD

### P — Planejar
1. Para cada subpergunta, escreva **o que espera ver e por quê**, antes de qualquer gráfico.
2. Planeje a galeria: univariados das variáveis-chave, desfecho × preditoras, segmentos, tempo, geografia, primeiro olhar externo.

### E — Executar
1. **Galeria:** gere os gráficos por `analise/05_eda.py`, salvando `figuras/V01_*.png`, `V02_*`… Registre todos no §2, inclusive os descartados. **Todo gráfico desta etapa leva no rodapé "exploração (E0)".**
2. **Observações:** para cada padrão relevante, escreva uma observação factual (O01…), com o gráfico de origem e a comparação com a expectativa.
3. **Análise anterior:** se a etapa 02 achou uma análise prévia, reproduza aqui, **só na exploração**, os cruzamentos dela. As hipóteses que saírem daí entram com origem "análise anterior".
4. **Seleção:** escolha os gráficos que respondem à árvore de perguntas. Especifique cada um e rode o checklist de integridade ([`referencias/guia-graficos.md`](../referencias/guia-graficos.md)).
5. **Títulos-mensagem:** o título diz a conclusão observada ("Cancelamento do plano B é maior em todas as regiões"), não o tema ("Cancelamento por plano"), e não exagera o que o gráfico mostra.
6. **Primeiro olhar externo:** coloque lado a lado, só de forma descritiva, o dado interno e as fontes da etapa 03.
7. **Hipóteses candidatas:** junte as a priori (brief §5) e as nascidas das observações. Priorize por relevância para a decisão, plausibilidade e testabilidade. Hipótese que não muda a decisão não se testa.
8. **Registro** (`templates/05-registro-hipoteses.md`). Para cada hipótese escolhida:
   - H0 e H1, com o **sinal esperado**;
   - estimando, teste e plano B com **gatilho objetivo**, como no guia ([`referencias/guia-testes-estatisticos.md`](../referencias/guia-testes-estatisticos.md));
   - o **efeito mínimo relevante (m)** e o **efeito plausível (δ)** vêm do brief, declarados, e não são propostos por você nem revistos para ganhar poder. Para hipótese nascida da exploração sobre métrica fora do brief, peça ao dono que declare m e δ **sem mostrar** a estimativa exploratória daquela relação;
   - **poder da regra de decisão**, por simulação, com δ (nunca com a estimativa da exploração, que é inflada pela seleção);
   - teste **bilateral** por padrão; unilateral só com o bilateral também registrado;
   - **família** e correção de multiplicidade;
   - a regra de decisão com os quatro resultados (confirmada, contrária, refutada, inconclusiva).

   Registre também, **antes de ver qualquer resultado confirmatório**:
   - as **sensibilidades** (o multiverso planejado, com os critérios "mantém", "enfraquece" e "inverte");
   - a **triangulação de efeito** que pode levar a E3 (fonte independente, comparação, tolerância);
   - as **checagens de integridade** que rodarão em todas as hipóteses na 07;
   - se a pergunta for preditiva, o **plano de modelagem**.
9. **Travamento, no G5.** Se o registro já foi travado no G4 (rota sem partição), **não trave de novo**: a 05 não altera as hipóteses a priori, e hipótese nascida aqui fica em E0.
   - copie o registro para `saidas/05-registro-hipoteses.travado.md` e marque-o como somente leitura;
   - calcule o SHA-256 dessa cópia, com fim de linha normalizado para LF;
   - grave o hash **só** em `00-status.md` e numa DEC do log, **nunca dentro do próprio arquivo**;
   - peça ao humano o commit com a tag **`trava-registro`** e a âncora fora do seu alcance (`AGENTS.md` §5): mensagem ao revisor (e-mail, AVA) com `git rev-parse trava-registro` e o hash, ou `git push origin trava-registro` se o remoto passou no teste de proteção de tags do G0. Tag só local não basta: com acesso ao shell, a IA consegue movê-la;
   - depois da âncora, acrescente a DEC do tipo `âncora` com o SHA que `git ls-remote --tags origin trava-registro` devolve, ou com o que o humano colar da mensagem;
   - **no modo essencial**, o travamento e a âncora são uma **pausa obrigatória ao fim da 05, antes da 06**. A tag `G5` fica para o portão do grupo (G5★), depois da modelagem. Ajuste que o revisor pedir no G5★ não reabre a trava: vira desvio registrado, cego porque a confirmação ainda está fechada.

### V — Verificar
- Toda observação é um fato? Busque "causa", "explica", "impacta" e "comprova" e reescreva.
- Todo gráfico selecionado passa no checklist de integridade?
- Toda hipótese registrada tem todos os campos?
- O poder da regra é razoável? Se for baixo, **reduza o número de hipóteses** ou aceite, por escrito, que o resultado provavelmente sairá inconclusivo. O efeito mínimo não se mexe.
- O conjunto de confirmação continua no cofre, intocado?
- Rode os checklists do portão (§7 da exploração e o do registro).

### D — Decidir: portão G5 ★
Portão crítico. **A partir daqui, é confirmatório:** mudança depois do travamento é desvio registrado. Peça `Aprovo G5` e o commit com tag `G5`, com a âncora do ★ e a DEC `âncora`. No modo completo com partição, `G5` e `trava-registro` marcam o mesmo commit.

## Armadilhas

| Armadilha | Salvaguarda |
|---|---|
| Gerar 200 gráficos e mostrar os 5 "bonitos" | galeria completa no placar; seleção pela árvore de perguntas |
| Título-tema ("Vendas por mês") | título-mensagem, sem exagero |
| Barra com eixo truncado, 3D, pizza de 12 fatias, eixo duplo | checklist de integridade + guia de gráficos |
| Observação escrita como conclusão | nível E0; verbo "observamos" |
| Testar tudo o que parece interessante | priorizar pela decisão; cada teste extra cobra na correção de multiplicidade |
| Hipótese vaga ("X influencia Y") | H0/H1 com sinal, estimando, efeito mínimo |
| A IA propõe o efeito mínimo depois de ver os efeitos da exploração | m e δ vêm do brief, declarados pelo dono; para hipótese nova, declarados sem ver a estimativa exploratória |
| Poder calculado com a estimativa da exploração | δ declarado; a estimativa exploratória é inflada pela seleção (maldição do vencedor) |
| Fatiar as hipóteses em famílias de 1 para escapar da correção | família = hipóteses que sustentam a mesma decisão; família de 1 exige justificativa aprovada |
| Sensibilidades escolhidas depois de ver o resultado | registradas no G5 |
| Hash gravado dentro do arquivo que ele protege | cópia `.travado.md`; hash só no status, no log e fora do projeto |
| A IA sugere só hipóteses que confirmam a narrativa | pedir, para cada uma, a rival mais forte |

## Prompts prontos

```text
Antes de gerar cada gráfico, escreva em uma linha o que você espera ver.
Depois de gerá-lo, compare: bateu? Se não bateu, a diferença é descoberta ou
erro (junção, filtro, unidade)? Investigue antes de seguir.
```

```text
Gere a galeria para as subperguntas SQ1..SQn usando só
dados/processados/exploracao.*. Salve cada gráfico como figuras/Vnn_<slug>.png,
com fonte, unidade, n e "exploração (E0)" no rodapé, e paleta segura para
daltonismo. Liste todos na tabela do §2, inclusive os que você descartaria.
```

```text
Para cada hipótese escolhida, preencha o registro: H0/H1 com sinal esperado,
estimando, teste principal e plano B com gatilho objetivo, o efeito mínimo
relevante (m) e o efeito plausível (δ) copiados do brief (não proponha
outros), a família e a correção, e o poder da regra de decisão por simulação,
em δ declarado no brief (nunca na estimativa da exploração), com α/k e o n
efetivo do conjunto de confirmação. Registre também as sensibilidades, a
triangulação de efeito e as checagens de integridade. Não abra o conjunto de
confirmação.
```

## Volte para trás quando

- A exploração revela problema de dado → **04** (ou **02**).
- Falta uma régua externa para uma observação importante → **03**.
- A exploração mostra que a pergunta estava errada → **01**, com registro no log.
