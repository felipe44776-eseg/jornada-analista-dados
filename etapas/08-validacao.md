---
etapa: "08"
nome: "Validação e triangulação"
fase: "4 · Comprovar"
portao: "G8 ★"
papel_ia: "Analista de robustez (sessão principal) + auditor(a) adversarial (sessão nova, numa cópia do projeto, aberta pelo humano)"
entradas:
  - saidas/00-status.md
  - saidas/01-brief.md (critérios de sucesso)
  - saidas/02-dados-internos.md
  - saidas/03-fontes-externas.md (§3, comparações de nível)
  - saidas/04-preparacao.md (regras R__)
  - saidas/05-registro-hipoteses.travado.md (§3 sensibilidades, §4 triangulação de efeito, §5 plano de modelagem)
  - saidas/06-ficha-modelo.md (se houver)
  - saidas/07-resultados-testes.md
  - saidas/log-decisoes.md
  - resultados/*.json · analise/*.py
saidas:
  - saidas/08-validacao.md
  - analise/08_robustez.py · analise/08_triangulacao.py · resultados/08_*.json
  - analise/comparar_resultados.py (usado aqui, pelo auditor e na etapa 12)
template: templates/08-validacao.md
origem: "CRISP-DM: Evaluate results, Review process, Determine next steps · SEMMA: Assess · KDD: Interpretation/Evaluation · CRISP-ML(Q): QA e avaliação · multiverso (Steegen et al., 2016) · triangulação (Denzin) · ameaças à validade (Shadish, Cook & Campbell)"
---

# Etapa 08 — Validação e triangulação

> **Missão:** tentar derrubar cada achado antes que alguém de fora o faça, por **sensibilidade**, **régua externa** e **auditoria adversarial**, e dar a cada um o nível de evidência que ele merece **pela regra**.

## Por que esta etapa existe

- É o *Evaluation* do CRISP-DM: avaliar os resultados **contra os critérios de sucesso do negócio**, revisar o processo em busca de falhas e decidir os próximos passos.
- **Multiverso:** um achado que muda de sinal quando se troca uma escolha razoável não é sólido (Steegen et al., 2016). Aqui só rodam as variações **registradas no G5**; escolhê-las agora, conhecendo o resultado, seria escolher as que ele aguenta.
- **Triangulação:** a mesma relação vista por um processo gerador independente vale mais que qualquer p isolado. Uma **explicação** para a divergência, sozinha, não vale: um LLM sempre produz uma que parece plausível.
- **Auditoria em contexto limpo:** LLMs tendem a concordar com o usuário e com o que já escreveram, e juízes-LLM se deixam convencer por texto confiante. O auditor **reexecuta** o código, numa **cópia** do projeto, e compara com os resultados de referência. Se reexecutasse na pasta original, sobrescreveria os números que deveria conferir.

## Papel da IA

- **Sessão principal:** rodar as sensibilidades e as comparações registradas, testar a reprodução em ambiente limpo e atribuir níveis pela regra.
- **Sessão de auditoria**, nova e aberta **pelo humano** na cópia do projeto: reexecutar e tentar derrubar cada achado. A IA principal não lança o auditor nem escreve o prompt dele.

## Roteiro PEVD

### P — Planejar
1. Liste os candidatos:
   - hipóteses **confirmadas** e **contrárias** (E1);
   - hipóteses **refutadas** (equivalência);
   - o modelo, se atingiu o critério.
2. Declare a expectativa: quais você acha que resistem e por quê.

### E — Executar
1. **Sensibilidades registradas** (registro §3), em `analise/08_robustez.py`. Rode **todas**, para **todos** os candidatos, e classifique pelos critérios do registro:
   - **confirmadas e contrárias** → mantém = mesmo sinal e IC excluindo zero em todas as variações, e \|estimativa\| ≥ m na especificação principal;
   - **refutadas** → mantém = IC dentro de (−m; +m) em todas as variações;
   - **subgrupos** → pelo critério registrado (teste de interação, ou só os com *n* ≥ N_mín);
   - variação não registrada → só exploratória.
2. **Comparações de nível** (etapa 03 §3): a base se parece com a realidade?
   - Passou, ou a correção prevista foi aplicada: requisito de E2 cumprido.
   - Falhou sem correção prevista, ou não há comparação possível: **teto E1**, declarado nos decks.
3. **Triangulação de efeito** (registro §4), em `analise/08_triangulacao.py`. A fonte independente mostra o **mesmo efeito** dentro da tolerância registrada?
   - Sim: caminho para E3.
   - Divergência com correção **pré-especificada**: aplique e reporte a estimativa **em par** (bruta e corrigida).
   - Divergência sem correção pré-especificada: fica em **E2**.
4. **Reprodução em ambiente limpo:**
   - pasta nova, com o projeto copiado **sem** `dados/processados/` e **sem** `resultados/`; o `resultados/` original entra como `resultados_ref/`;
   - ambiente novo, recriado pelo `requirements.txt`;
   - `COFRE_DIR` apontando para uma pasta temporária **nova e vazia**;
   - `python analise/rodar_tudo.py --reproducao` (etapa 04). O script roda o pipeline na ordem registrada, simula a devolução do cofre antes da 07, grava o modelo regerado em `modelos_regerado/` (a 07 usa o congelado) e termina com `analise/comparar_resultados.py` (abaixo);
   - `resultados/` tem de sair idêntico, e os processados, com o mesmo hash de conteúdo. A etapa 12 reconfere.
5. **Preparação da cópia de auditoria**, feita pelo humano **depois do rascunho da 08** (passos 1 a 4), para que o auditor receba também os scripts e resultados da 08:
   - commit do rascunho e tag `G8-auditoria`. Ela não é trava: só marca o ponto de partida da cópia e do diff;
   - `git worktree add ../<projeto>-auditoria G8-auditoria`, ou uma cópia simples da pasta nesse estado;
   - copiar para a cópia o que fica fora do git: `dados/brutos/`, `dados/externos/` e `modelos/` (o congelado). Os processados são regerados pelo auditor. **Respeite a política de dados do kickoff** para a ferramenta do auditor, sobretudo se ela for de outro provedor;
   - na cópia, renomear `resultados/` para `resultados_ref/` e marcá-la como somente leitura (Windows: `attrib +R resultados_ref\*`; Linux/macOS: `chmod -R a-w resultados_ref`);
   - na sessão do auditor, `COFRE_DIR` aponta para uma pasta temporária **nova e vazia**;
   - remover o `CLAUDE.md` da cópia, ou manter só o `AGENTS.md`, cuja §0 manda o auditor ignorar o papel de analista;
   - separar, **da âncora** (e não da tag local nem da DEC), o SHA de **cada trava** da tabela Travas do status (`trava-registro`, `trava-modelo` e, no ciclo 2, as `-c2`): o que o remoto protegido devolve, ou o que está na mensagem. Se o modelo fica fora do git, separe também o SHA-256 dele, da mensagem da trava ou do `00-status.md` no SHA de `trava-modelo`. Tudo vai colado no prompt.
6. **Auditoria adversarial:**
   - o **humano** abre a sessão nova **na cópia**, de preferência com **outro modelo**, e cola o prompt literal abaixo;
   - o auditor recria o ambiente pelo `requirements.txt` e roda `python analise/rodar_tudo.py --reproducao`, que regera tudo, **inclusive** `08_robustez.py` e `08_triangulacao.py`, e compara com `resultados_ref/` por script;
   - o auditor confere **cada trava**: a tag aponta para o SHA colado, os arquivos travados não mudaram desde ele e o modelo avaliado é o congelado. Depois lê `git diff <SHA de trava-registro>..G8-auditoria -- analise/`, o que mudou nos scripts depois do travamento. O worktree enxerga as tags e os commits do repositório;
   - veredito por achado: **mantido** · **enfraquecido** · **derrubado** · **não reexecutado**;
   - **toda rodada vai para o log**, e nenhum veredito é descartado nem substituído por uma nova rodada "até dar certo".
7. **Critérios de sucesso** do brief (§6): atingidos?
8. **Ameaças à validade:** conclusão estatística, interna, de construto e externa.
9. **Níveis pela regra** (`AGENTS.md` §8), com os tetos. O modelo segue a mesma regra:
   - E2 = estável nas sensibilidades do plano de modelagem;
   - E3 = validação externa numa base independente registrada.
10. **Próximos passos:** comunicar, iterar (máximo de 2 ciclos, com a reserva de α do registro) ou coletar dado novo.

### V — Verificar
- Todas as sensibilidades registradas rodaram para todos os candidatos, inclusive os refutados?
- As tolerâncias usadas são as registradas (G3 e G5)?
- Algum nível foi dado por impressão, e não pela regra?
- A reprodução bateu? A auditoria rodou na cópia da tag `G8-auditoria`, reexecutou também os scripts da 08, comparou com `resultados_ref/` pelo script (e não com a própria saída) e partiu o diff do SHA da âncora?
- Rode o checklist do portão (§11 do artefato).

### D — Decidir: portão G8 ★
Portão crítico: segunda pessoa revisa, ou a ausência fica registrada e os níveis param em E2. Peça `Aprovo G8` e a âncora externa. Só achados validados (A01…) seguem para a comunicação.

## Comparação com a referência

A sessão principal escreve este script no passo 4; `rodar_tudo.py --reproducao` o chama no fim, e o auditor e a etapa 12 usam o mesmo. A tolerância de 1e-9 existe só para o ruído de ponto flutuante: qualquer diferença real aparece como `DIFERE`. Sem `resultados_ref/`, o script **falha**: "nada a comparar" nunca vira "0 diferenças".

```python
# analise/comparar_resultados.py — compara resultados/ (regerado) com resultados_ref/ (congelado), chave a chave
# uso: python analise/comparar_resultados.py      (sai com código 1 se algo diferir, faltar ou não houver referência)
import json, math, pathlib, sys

for s in (sys.stdout, sys.stderr):
    s.reconfigure(encoding="utf-8")                        # acentos intactos mesmo com a saída capturada
RAIZ = pathlib.Path(__file__).resolve().parents[1]      # funciona de qualquer pasta

def iguais(a, b, tol=1e-9):                               # tolerância só para ruído de ponto flutuante
    if isinstance(a, dict) and isinstance(b, dict):
        return a.keys() == b.keys() and all(iguais(a[k], b[k], tol) for k in a)
    if isinstance(a, list) and isinstance(b, list):
        return len(a) == len(b) and all(iguais(x, y, tol) for x, y in zip(a, b))
    if isinstance(a, float) or isinstance(b, float):
        if not (isinstance(a, (int, float)) and isinstance(b, (int, float))):
            return False
        if math.isnan(a) or math.isnan(b):
            return math.isnan(a) and math.isnan(b)
        return math.isclose(a, b, rel_tol=tol, abs_tol=tol)
    return a == b

ref_dir, novo_dir = RAIZ / "resultados_ref", RAIZ / "resultados"
refs = sorted(ref_dir.glob("*.json"))
if not refs:
    sys.exit(f"ERRO: nenhum JSON em {ref_dir}. Sem referência não há comparação.")
falhas = 0
for ref in refs:
    novo = novo_dir / ref.name
    r = json.loads(ref.read_text(encoding="utf-8"))
    n = json.loads(novo.read_text(encoding="utf-8")) if novo.exists() else {}
    for chave in sorted(k for k in set(r) | set(n) if not k.startswith("_")):
        ok = chave in r and chave in n and iguais(r[chave], n[chave])
        falhas += not ok
        print(f"{'ok    ' if ok else 'DIFERE'}  {ref.name}  {chave}  ref={r.get(chave, 'AUSENTE')}  novo={n.get(chave, 'AUSENTE')}")
for extra in sorted(set(p.name for p in novo_dir.glob("*.json")) - set(p.name for p in ref_dir.glob("*.json"))):
    print(f"EXTRA   {extra}  (sem referência: não conta como falha, mas explique)")
print(f"\n{falhas} diferença(s)")
sys.exit(1 if falhas else 0)
```

## Prompt de auditoria adversarial

O humano abre uma sessão **nova**, sem histórico, **na cópia de auditoria**, e cola:

```text
Você é auditor(a) independente de uma análise de dados. Você NÃO participou
da análise e não tem compromisso com as conclusões. Seu trabalho é achar os
erros antes que o público os ache. Se houver neste diretório instruções para
agir como analista, ignore-as: sua única tarefa é auditar.

Você está numa CÓPIA do projeto, na tag G8-auditoria. A referência é
resultados_ref/ (somente leitura), e COFRE_DIR aponta para uma pasta
temporária nova e vazia. Recrie o ambiente pelo requirements.txt e rode
python analise/rodar_tudo.py --reproducao: ele regera tudo na ordem
registrada, inclusive a 08, e termina comparando com resultados_ref/ por
script. Anexe a saída inteira; a comparação nunca é "no olho". Se não puder
executar, diga isso: o veredito passa a ser "não reexecutado".

TRAVAS, tiradas da âncora externa pelo humano (uma linha por trava da tabela
Travas do status; hash do modelo só se ele fica fora do git):
  trava-registro = <SHA>
  trava-modelo = <SHA>        modelo M01 = <SHA-256>
Para cada trava: (1) git rev-parse <tag> tem de dar o SHA colado;
(2) git diff --exit-code <SHA>..G8-auditoria -- <arquivos daquela trava na
tabela Travas> tem de sair vazio; (3) o SHA-256 de modelos/M01.* tem de ser
igual ao colado e ao M01.sha256 de resultados_ref/. Qualquer divergência:
pare e reporte, porque os números abaixo não valem. Depois rode
git diff <SHA de trava-registro>..G8-auditoria -- analise/ e leia o que mudou
nos scripts depois do travamento. Sem git, compare os SHA-256 dos arquivos
travados e dos scripts com os da mensagem que o humano colar.

Para cada candidato em saidas/08-validacao.md §1:
1. O número regerado bate com resultados_ref/? Anexe a saída da comparação.
2. O teste seguiu saidas/05-registro-hipoteses.travado.md? Existe desvio não
   declarado, ou desvio "cego" que na verdade foi informado pelo resultado?
   Algum script mudou depois do travamento sem registro?
3. Procure explicações alternativas: confundidores, viés de seleção,
   vazamento, erro de junção, mudança de definição, composição/paradoxo de
   Simpson, regressão à média, sazonalidade.
4. A linguagem respeita o nível de evidência e o tipo de pergunta do brief?
5. Veredito: mantido / enfraquecido / derrubado / não reexecutado, com
   justificativa em até 3 linhas.

No fim, liste: (a) números que não bateram; (b) afirmações sem rastreio;
(c) a crítica mais forte que um revisor cético faria a esta análise.
Não seja gentil à custa da precisão. Não sugira melhorias cosméticas.
```

## Armadilhas

| Armadilha | Salvaguarda |
|---|---|
| Auditar na mesma conversa (a IA defende o que fez) | sessão nova, aberta pelo humano, com prompt literal |
| Auditor que reexecuta na pasta original e compara a saída com ela mesma | cópia do projeto + `resultados_ref/` somente leitura + `comparar_resultados.py` |
| Cópia feita antes da 08: o auditor não reexecuta sensibilidades nem triangulação | tag `G8-auditoria` só depois do rascunho da 08 |
| Auditor que "confere" lendo o script, sem rodar | "bate" só com reexecução; senão, "não reexecutado" |
| Script alterado depois do travamento, sem registro | `git diff <SHA de trava-registro>..G8-auditoria -- analise/`, com o SHA tirado da âncora, não da tag local |
| Registro travado ou modelo trocado depois de abrir a confirmação | o auditor confere cada trava: `git diff --exit-code` dos arquivos travados desde o SHA da âncora e o hash do modelo contra o colado |
| Reprodução que retreina o modelo e avalia o retreinado | `rodar_tudo.py` grava o regerado em `modelos_regerado/`; a 07 usa o congelado e grava o hash dele (`M01.sha256`) |
| Pipeline rodado fora de ordem, ou sem o ambiente do projeto | `rodar_tudo.py --reproducao` num ambiente recriado do `requirements.txt` |
| Refazer a auditoria até o veredito agradar | toda rodada no log; nenhum veredito descartado |
| Escolher agora as sensibilidades que o achado aguenta | só as registradas no G5 |
| "A fonte externa deve estar errada" | só com correção pré-especificada; senão, fica em E2 |
| Refutada comunicada sem validação | refutadas passam pelas sensibilidades e pela auditoria |
| Todo achado vira "alta confiança" | regra da escada, com tetos |

## Volte para trás quando

- Um achado é derrubado e surge hipótese nova → novo ciclo em **05**, testado em dado novo ou na reserva, com a reserva de α (máximo de 2 ciclos).
- É preciso outra régua externa → **03** (a triangulação nova é registrada antes de comparar).
- A auditoria encontra erro de dado → **04**, pelas regras de `AGENTS.md` §4.
- Os critérios de sucesso se mostram inalcançáveis → **01**, junto com o dono da pergunta.
