# 00 · Kickoff

> **Etapa 00 · Kickoff** · Data: AAAA-MM-DD · Responsável: ___ · IA: ___ · Status: `rascunho`

## 1. Identificação

| Campo | Valor |
|---|---|
| Projeto | |
| Contexto (disciplina, cliente, área) | |
| Analista responsável | |
| Dono(a) da pergunta | *(real, ou **simulado**: professor ou colega, declarado)* |
| Revisor(a) dos portões ★ | *(ou "sem revisor", com as consequências de `AGENTS.md` §2)* |
| Prazo final | |
| **Modo** | completo (13 portões) · essencial (6 portões) |

## 2. IA e modo de operação

| Capacidade | Testada? | Resultado do teste (saída real) |
|---|---|---|
| Lê e escreve arquivos do projeto | sim · não | |
| Executa código | sim · não | *ex.: `python --version` → 3.11.x* |
| Acessa a internet | sim · não | *ex.: abriu `https://servicodados.ibge.gov.br/api/docs`* |
| Janela de contexto / limite de arquivo | | |

**Modo de operação:** agente · chat com execução · chat sem execução (`AGENTS.md` §12).
**Ferramenta e modelo:** *(nome e versão exatos)*.
**Configuração do provedor:** conta pessoal · institucional · uso das conversas para treino: desativado · ativado · retenção: ___

## 3. Ambiente e travas

| Item | Valor |
|---|---|
| Linguagem e versão | |
| Bibliotecas-base | pandas · numpy · scipy · statsmodels · matplotlib/seaborn · scikit-learn · pandera |
| Arquivo de dependências | `requirements.txt` (pacote novo só depois de conferido no PyPI) |
| Semente aleatória padrão | `42` *(ou outra, fixa para o projeto)* |
| **Sal da partição** | *(texto fixo, ex.: nome do projeto + data; usado no SHA-256 da atribuição)* |
| Repositório git | **obrigatório em modo agente**: `git init` · `.gitignore` com `dados/` (e `modelos/`, se for grande) · commit + tag por portão, feitos pelo humano |
| **Âncora externa** (portões ★ e travamentos: `trava-registro`, `trava-modelo`) | mensagem do humano ao revisor (e-mail, AVA; sem revisor, ao próprio e-mail) com a frase de aprovação, o `git rev-parse` da tag e os hashes · **ou** remoto com proteção de tags **testada no G0** (`push -f` e `push --delete` da tag `teste-trava` recusados: saída colada aqui) |
| **Cofre da confirmação** | *(pasta fora do projeto, criada pelo humano, informada em `COFRE_DIR`; opcionalmente compactada com senha)* |
| Como rodar tudo do zero | *(comando único, preenchido até o G4)* |

## 4. Dados disponíveis (preliminar)

| Base | Origem / dono | Classificação | Pode ir para a IA? | Tratamento exigido |
|---|---|---|---|---|
| | | pública · interna · pessoal · sensível | sim · só agregada · só esquema · não | *ex.: pseudonimizar CPF e nome* |

**Classificação:**
- **pública:** já publicada, com licença.
- **interna:** sem dado pessoal, mas não pública.
- **pessoal:** identifica ou torna identificável uma pessoa (LGPD, art. 5º, I).
- **sensível:** saúde, origem racial, religião, opinião política, biometria etc. (LGPD, art. 5º, II).

**Pseudonimizado continua sendo dado pessoal** (LGPD, art. 13, §4º). Só o dado anonimizado de forma irreversível deixa de ser pessoal (art. 12).

## 5. Política de dados com IA

- Base legal / autorização para usar os dados: ___
- O que **nunca** sai do ambiente local: ___
- Pseudonimização (quais colunas, qual método, onde fica a chave): ___
- **Canais de vazamento fechados:**
  - a IA não abre arquivo de dados com ferramenta de leitura, só por script que imprime agregados;
  - tracebacks e relatórios de validação mascaram colunas pessoais;
  - célula com n < 5 é suprimida;
  - a quarentena fica local.
- Política da instituição sobre IA generativa (link ou resumo; a ESEG não tem política pública localizada em set/2026, então confirme com a coordenação): ___

## 6. Papéis

| Papel | Quem | Responsabilidade |
|---|---|---|
| Dono(a) da pergunta | | define a decisão e o efeito mínimo relevante; aprova G1 e G11 |
| Analista | | opera o fluxo, aprova os portões, faz commits e tags, guarda o cofre |
| Revisor(a) | | segunda assinatura nos portões ★: no modo completo, G1, G3, G5, G8 e G11; no essencial, G1, G4, G5, G8 e G11. Recebe as mensagens de âncora |
| IA | *(ferramenta)* | planeja, executa, verifica; **não aprova portão** |

## 7. Cronograma

| Fase | Etapas | Data-alvo |
|---|---|---|
| 1 Enquadrar | 00–01 | |
| 2 Reunir | 02–04 | |
| 3 Explorar | 05–06 | |
| 4 Comprovar | 07–08 | |
| 5 Comunicar | 09–12 | |

## 8. Riscos iniciais

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| | baixa · média · alta | baixo · médio · alto | |

## 9. Checklist do portão G0

- [ ] Estrutura de pastas criada (`AGENTS.md` §6); `dados/brutos/` somente leitura, com hashes
- [ ] `saidas/00-status.md`, `log-decisoes.md` e `log-ia.md` criados a partir dos templates
- [ ] Capacidades da IA **testadas**, com a saída real colada; modo de operação escolhido
- [ ] Modo (completo ou essencial) escolhido e registrado
- [ ] Ambiente reproduzível: versão da linguagem, `requirements.txt`, semente
- [ ] Git iniciado (obrigatório em modo agente); âncora externa definida (mensagem, ou remoto com a proteção de tags testada e recusando `push -f` e `push --delete`); cofre criado fora do projeto e informado em `COFRE_DIR`; sal da partição fixado
- [ ] Toda base classificada, com regra do que pode ir para a IA e canais de vazamento fechados
- [ ] Configuração do provedor registrada
- [ ] Papéis definidos (dono real ou simulado declarado; revisor ou ausência registrada)
- [ ] Cronograma com data-alvo por fase
