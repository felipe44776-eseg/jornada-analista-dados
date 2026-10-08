# 08 · Validação e triangulação

> **Etapa 08 · Validação** · Data: AAAA-MM-DD · Responsável: ___ · IA: ___ · Status: `rascunho`
> Os níveis de evidência seguem a **regra** de `AGENTS.md` §8, com os tetos. Nada aqui é atribuído por impressão.

## 1. Achados candidatos

Hipóteses **confirmadas** e **contrárias** (E1), hipóteses **refutadas** (equivalência) e o modelo, se atingiu o critério registrado.

| Candidato | Origem | Decisão na 07 | Enunciado | Nível de partida |
|---|---|---|---|---|
| | H__ · M01 | confirmada · contrária · refutada | | E1 |

## 2. Sensibilidades registradas (registro §3)

Todas as variações registradas, para todos os candidatos. Variação nova entra só como exploratória, marcada.

| Candidato | S1 | S2 | S3 | S4 | S5 | Resultado |
|---|---|---|---|---|---|---|
| | | | | | | mantém · enfraquece · inverte |

Critérios (do registro):

| Tipo de candidato | Mantém | Enfraquece | Inverte |
|---|---|---|---|
| confirmada ou contrária | mesmo sinal e IC excluindo zero em todas as variações, e \|estimativa\| ≥ m na especificação principal | mesmo sinal, mas IC cruzando zero em alguma variação | sinal oposto com IC que exclui zero |
| refutada | IC dentro de (−m; +m) em todas as variações | IC ultrapassa ±m em alguma | — |
| modelo | desempenho estável nas sensibilidades do plano de modelagem | queda acima do limite registrado | — |

Subgrupos: pelo critério registrado (teste de interação, ou só subgrupos com *n* ≥ N_mín).

## 3. Comparações de nível (plano da etapa 03 §3): a base passa?

| Comparação | Valor interno | Valor externo (F__) | Diferença | Tolerância (regra + margem declarada) | Dentro? | Classe da causa, se fora | Evidência |
|---|---|---|---|---|---|---|---|
| C1 | [→ `C1.interno`] | [→ `C1.externo`] | | | sim · não | conceito · cobertura · tempo · geografia · unidade · deflação · safra · erro interno · erro externo · desconhecida | |

**Veredito da base:**
- passa;
- passa com a correção prevista aplicada (estimativa em par: bruta [→ ___] × corrigida [→ ___]);
- **não passa**, ou **não há comparação possível** (exceção aceita no G3): nenhum achado passa de E1, e a limitação vai para os decks.

## 4. Triangulação de efeito (registro §4): caminho para E3

| Candidato | Fonte independente (outro processo gerador) | Efeito interno | Efeito externo | Tolerância registrada | Dentro? | Se fora: correção pré-especificada? |
|---|---|---|---|---|---|---|
| | F__ | | | | sim · não | sim (aplicada e reportada em par) · não (fica em E2) |

> Explicação plausível **sem** correção pré-especificada não promove nada: o achado fica em E2.

## 5. Auditoria adversarial

| Campo | Valor |
|---|---|
| Quem abriu a sessão | *(nome do humano)* |
| Auditor | outra pessoa · sessão nova de IA (modelo: ___) |
| Cópia de auditoria | caminho ___ · tag `G8-auditoria` (commit ___), criada depois do rascunho da 08 · `resultados_ref/` somente leitura · sem `CLAUDE.md` |
| Copiado para fora do git | `dados/brutos/` · `dados/externos/` · `modelos/` · dentro da política de dados do kickoff para a ferramenta do auditor: sim · não |
| `COFRE_DIR` do auditor | *(pasta temporária nova e vazia)* |
| Travas conferidas pelo auditor (SHAs tirados da âncora e colados no prompt) | `trava-registro` ___ · `trava-modelo` ___ · (ciclo 2) ___ · tag = SHA colado: sim · não · arquivos travados sem mudança desde o SHA (`git diff --exit-code`): sim · não · modelo avaliado = congelado (`M01.sha256` = hash colado): sim · não · qualquer "não": a auditoria para |
| `git diff <SHA>..G8-auditoria -- analise/` lido? | sim · sem alterações · alterações: ___ |
| Executou o código? | sim, `rodar_tudo.py --reproducao` em ambiente recriado do `requirements.txt`, inclusive a 08 · não (veredito "não reexecutado") |
| Prompt | literal da etapa 08 · outro (anexar e justificar) |
| Rodadas de auditoria (todas registradas no log) | DEC-___, DEC-___ |
| Números regerados iguais a `resultados_ref/` | ___ de ___ (saída inteira de `comparar_resultados.py` anexada) |

| Candidato | Crítica do auditor | Resposta / correção | Veredito |
|---|---|---|---|
| | | | mantido · enfraquecido · derrubado · não reexecutado |

## 6. Reprodução em ambiente limpo

| Campo | Valor |
|---|---|
| Onde (pasta e ambiente novos) | *(cópia sem `dados/processados/` e sem `resultados/`; original como `resultados_ref/`; ambiente do `requirements.txt`)* |
| `COFRE_DIR` apontando para | *(pasta temporária nova e vazia, nunca o cofre real)* |
| Comando | `python analise/rodar_tudo.py --reproducao` |
| Números de `resultados/` idênticos? (comparação no fim do comando) | sim · divergências: ___ |
| Hash de conteúdo dos processados idêntico? | sim · não |
| Modelo regerado idêntico ao congelado? *(informativo: a 07 usa o congelado)* | sim · não · não se aplica |

## 7. Critérios de sucesso do brief (§6)

| Critério | Atingido? | Evidência |
|---|---|---|
| | sim · parcial · não | |

## 8. Ameaças à validade

| Tipo | Pergunta | Resposta |
|---|---|---|
| Conclusão estatística | poder baixo? muitos testes? pressupostos? | |
| Interna | confundidores? seleção? vazamento? composição? | |
| Construto | a métrica mede o que dizemos que mede? | |
| Externa | vale para outra população, período ou lugar? | |

## 9. Achados validados

| ID | Achado (frase com o verbo do nível) | Sensibilidade | Base passa? | Triangulação | Auditoria | Revisão independente? | **Nível pela regra** | Causal? |
|---|---|---|---|---|---|---|---|---|
| A01 | | mantém | sim | dentro | mantido | sim | E3 | não · condicional (desenho: ___) |

Tetos: auditoria "enfraquecido" ou "não reexecutado" → máx. E1 · "derrubado" → sai · base não passa ou sem comparação de nível → máx. E1 · sem revisão independente → máx. E2. Refutadas recebem a mesma escala: o "achado" é "o efeito, se existe, é menor que m".

## 10. Próximos passos

- [ ] Seguir para comunicação (etapa 09)
- [ ] Novo ciclo (máximo de 2): voltar à etapa ___ porque ___ (hipótese nova testada em dado novo ou na reserva; com α reservado no G5 do ciclo 1, α' = α/2 em tudo e Holm dentro do ciclo; sem reserva, o ciclo 2 é exploratório, E0)
- [ ] Recomendar coleta de dado novo para: ___

## 11. Checklist do portão G8 ★

- [ ] Todas as sensibilidades registradas rodaram para todos os candidatos, inclusive os refutados
- [ ] Comparações de nível executadas com as tolerâncias do G3; veredito da base escrito
- [ ] Triangulação de efeito executada com as tolerâncias do G5
- [ ] Auditoria aberta pelo humano **numa cópia** da tag `G8-auditoria`, com reexecução (inclusive da 08) comparada a `resultados_ref/` por script e o `git diff` dos scripts lido; todas as rodadas no log
- [ ] Reprodução em ambiente limpo feita
- [ ] Níveis atribuídos pela regra, com os tetos
- [ ] Critérios de sucesso avaliados; ameaças à validade escritas
- [ ] Revisado por segunda pessoa (nome: ___) ou ausência registrada em DEC-___ (e níveis limitados a E2)
