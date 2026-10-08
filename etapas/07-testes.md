---
etapa: "07"
nome: "Testes confirmatórios"
fase: "4 · Comprovar"
portao: "G7"
papel_ia: "Estatístico(a)"
entradas:
  - saidas/00-status.md (hashes travados)
  - saidas/01-brief.md (tipo de pergunta, efeito mínimo)
  - saidas/04-preparacao.md (transformações ajustadas na exploração)
  - saidas/05-registro-hipoteses.travado.md
  - saidas/06-ficha-modelo.travado.md + modelos/M01.* (se a etapa 06 rodou)
  - dados/processados/confirmacao.* (devolvido do cofre pelo humano)
saidas:
  - saidas/07-resultados-testes.md
  - saidas/06-ficha-modelo.md §5 (avaliação única, se houver modelo)
  - analise/07_testes.py · resultados/07_testes.json
  - figuras/Vnnc_*.png (gráficos dos achados, na base do teste)
template: templates/07-resultados-testes.md
origem: "Análise confirmatória (Tukey, 1980) · ASA Statement on p-values (2016) e editorial de 2019 · Holm (1979), Benjamini–Hochberg (1995) · equivalência/TOST (Lakens et al., 2018) · PPDAC: Analysis · DMAIC: Analyze"
---

# Etapa 07 — Testes confirmatórios

> **Missão:** abrir o conjunto de confirmação **uma única vez** e executar **exatamente** o que foi registrado (as hipóteses do G5 e a avaliação do modelo congelado no G6). Reportar tudo: efeito, incerteza e decisão, inclusive o que não deu certo.

## Por que esta etapa existe

- É a metade **confirmatória** da análise. Ela só vale porque o caminho foi fixado antes (G5, G6).
- A declaração da ASA sobre p-valores (2016) diz o que não fazer:
  - p não mede a probabilidade de a hipótese ser verdadeira;
  - decisão não se baseia só em p cruzar um limiar;
  - p não mede o tamanho do efeito;
  - "proper inference requires full reporting and transparency".
- O limiar de decisão é aceitável quando **há uma ação a tomar** e ele foi fixado antes (ASA Task Force, 2021).
- Muitos testes geram falsos positivos por acaso. A correção de multiplicidade (Holm; Benjamini–Hochberg) cobra esse custo, e é por isso que a priorização da etapa 05 importa.
- Com IA, há dois riscos:
  - a ferramenta "ajustar" o teste para chegar a um resultado (trocar de teste, filtrar, mudar a janela);
  - números reportados que não saíram da execução.

## Papel da IA

Conferir as travas, rodar as checagens de integridade registradas, executar o registro, aplicar os planos B pelo gatilho objetivo, calcular efeitos, ICs e p ajustados e aplicar a regra de decisão escrita. A IA **não reinterpreta** o registro. O que ele não previa, ela leva ao humano.

## Roteiro PEVD

### P — Planejar
1. **Confira cada trava contra a sua âncora externa**, não só contra o que você mesmo escreveu. As travas são **todas as linhas da tabela Travas do status**: `trava-registro` (registro), `trava-modelo` (ficha e modelo, se a 06 rodou) e, no ciclo 2, as `-c2`, qualquer que seja o portão em que nasceram (G5; pausa do modo essencial; G4 sem partição; G6):
   - recalcule o SHA-256 dos arquivos travados: `05-registro-hipoteses.travado.md` e, se houver, `06-ficha-modelo.travado.md` e `modelos/M01.*`;
   - **âncora por mensagem:** o humano cola, da mensagem que enviou ao revisor, o `git rev-parse` da tag e os SHA-256. Compare com `git rev-parse <tag>` e com os hashes recalculados;
   - **âncora por remoto:** `git ls-remote --tags origin <tag>` tem de devolver o mesmo SHA que `git rev-parse <tag>` e que a DEC `âncora`. Leia os arquivos **por esse SHA** (`git fetch origin <sha>` e `git show <sha>:saidas/05-registro-hipoteses.travado.md`) e compare os hashes com os dos locais. O modelo fora do git confere-se pelo hash gravado em `saidas/00-status.md` nesse mesmo SHA;
   - **sem git** (modos de chat): compare os SHA-256 dos arquivos travados e dos scripts de `analise/` com os que a mensagem traz;
   - status e DEC entram só como terceira conferência;
   - **se divergir, pare.**
2. Peça ao humano que devolva `confirmacao.*` do cofre para `dados/processados/`. Registre uma DEC do tipo `leitura`, com data e hash de conteúdo. **Sem partição**, não há cofre nem devolução: a 07 roda na base inteira, e as checagens de integridade (contagem e hash de conteúdo) conferem a base registrada no G4.
3. Liste os testes na ordem do registro, com as expectativas escritas lá.

### E — Executar
1. **Checagens de integridade** do registro (§6), para **todas** as hipóteses:
   - contagem ou hash de conteúdo divergente → **pare** e registre um incidente;
   - nulos ou covariáveis fora do esperado → pendência, sem reanálise.
2. Aplique à confirmação as transformações **ajustadas na exploração** (etapa 04), sem reajustá-las.
3. Para cada hipótese:
   - cheque os pressupostos da forma registrada;
   - rode o teste principal ou, **só se o gatilho objetivo disparar**, o plano B, com o estimando dele;
   - calcule a estimativa do efeito, o IC no nível registrado e o p exato.
4. Aplique a correção de multiplicidade por família, como registrada.
5. Aplique a **regra de decisão** do registro: confirmada, contrária, refutada ou inconclusiva.
6. **Modelo congelado**, se houver: uma única avaliação, com IC por bootstrap (por bloco ou entidade, se a partição for agrupada ou temporal). `07_testes.py` carrega sempre `modelos/M01.*`, o congelado (nunca `modelos_regerado/`), e grava o SHA-256 dele em `resultados/07_testes.json` (`M01.sha256`): numa reprodução, isso prova que o modelo avaliado foi o congelado. Preencha a §5 da ficha do modelo.
7. **Desvios:** qualquer decisão não prevista vai para o §4 do resultado e para o log.
   - Desvio **cego** (decidido antes de ver o resultado da hipótese e documentado) mantém o nível, declarado.
   - Desvio **informado pelo resultado** rebaixa a E0. Na dúvida, E0.
8. Análises extras entram na seção "exploratórias adicionais", rotuladas **E0**.
9. **Gráficos dos achados:** para cada hipótese confirmada ou contrária, regere o gráfico da exploração pela **mesma função**, agora na base do teste, com ID `Vnnc` e o *n* e a fonte correspondentes. É esse gráfico que vai para os decks.
10. Tudo em `resultados/07_testes.json`, com chaves estáveis (`H03.efeito`, `H03.ic`, `H03.p_ajustado`, `H03.decisao`).

### V — Verificar
- Rode `analise/07_testes.py` do zero: os números são idênticos?
- Confira cada número do artefato contra `resultados/07_testes.json`.
- Releia a leitura por hipótese:
  - nenhum "comprova";
  - nenhum "causa", salvo o permitido em `AGENTS.md` §8;
  - nenhum "não há efeito" para resultado inconclusivo.
- Rode o checklist do portão (§8 do artefato).

### D — Decidir: portão G7
Peça `Aprovo G7`. As hipóteses confirmadas e contrárias (E1) e as refutadas seguem para a validação na etapa 08. As inconclusivas vão para o deck técnico como tais.

## Como ler um resultado

*m* = efeito mínimo relevante, em módulo, declarado pelo dono no brief.

| Situação | Decisão | Leitura correta | Leitura errada |
|---|---|---|---|
| p ajustado < α, sinal de H1, \|estimativa\| ≥ m | **confirmada** (E1) | "os dados indicam que…" | "comprovado", "causa" |
| p ajustado < α, sinal **oposto**, \|estimativa\| ≥ m | **contrária** (E1, no sentido observado) | achado relevante no sentido inverso: reportar e validar | esconder, porque "não era a hipótese" |
| IC inteiro dentro de (−m; +m) | **refutada** (equivalência) | "se há efeito, é menor que m e não muda a decisão": é informação útil | "não deu nada" |
| todos os demais casos (ex.: IC largo, cruzando zero e m; ou significativo, mas abaixo de m, com IC alcançando m) | **inconclusiva** | "os dados não bastam para decidir" | "não há efeito" |

Com α reservado para um ciclo 2, leia α' = α/2 no lugar de α em toda a tabela (`AGENTS.md` §4).

Reporte p **exato** (p = 0,031), não "p < 0,05". O que se compara são efeitos: a diferença entre "significativo" e "não significativo" não é, ela mesma, significativa (Gelman & Stern, 2006).

## Armadilhas

| Armadilha | Salvaguarda |
|---|---|
| Trocar de teste depois de ver p = 0,06 | plano B só pelo gatilho objetivo registrado |
| Reportar só as confirmadas | tabela completa, com os quatro resultados |
| Esconder o efeito contrário | "contrária" é resultado registrado e comunicado |
| "p < 0,05, logo o efeito é importante" | comparar com o efeito mínimo relevante |
| "p > 0,05, logo não há efeito" | distinguir refutada (equivalência) de inconclusiva |
| Esquecer a correção de multiplicidade | por família, como registrada |
| Rodar de novo com outro filtro "para ver" | desvio informado pelo resultado = E0 |
| Ilustrar o achado com o gráfico da exploração | gráfico `Vnnc` na base do teste |
| Número de p copiado, não calculado | regra 2: só de `resultados/` |

## Prompts prontos

```text
Recalcule o SHA-256 dos arquivos travados e confira cada trava (trava-registro
e, se houver, trava-modelo) contra a âncora: o git rev-parse e os hashes que
vou colar da mensagem ao revisor, ou o SHA da tag no remoto, lendo os
arquivos por esse SHA. Status e DEC só como terceira conferência. Se
divergir, pare e me avise. Se bater, rode as checagens de integridade do
registro e depois H01..Hn exatamente como registradas. Para cada uma:
pressupostos (como checou), teste usado (e se o gatilho do plano B disparou),
n, estimativa, IC no nível registrado, p exato, p ajustado e decisão pela regra
de quatro resultados. Grave tudo em resultados/07_testes.json.
```

```text
Liste todo ponto em que você precisou decidir algo que o registro não previa.
Não resolva sozinho: descreva as opções, diga se a decisão seria cega ou
informada pelo resultado e recomende uma.
```

## Volte para trás quando

- O registro tinha um erro (ex.: teste inadequado ao tipo de variável) → corrija como **desvio registrado** (cego, se decidido antes de ver o resultado daquela hipótese), nunca por edição silenciosa.
- Aparece problema de dado na confirmação → **04**, com a regra de `AGENTS.md` §4 (a partição não se refaz; correção decidida sem olhar resultados; resultado anterior reportado junto).
