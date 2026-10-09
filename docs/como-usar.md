# Como usar: o passo a passo

Este guia leva você do zero até a primeira aprovação: como pegar a sua cópia, o que preencher, **onde pôr a base de dados**, **o que escrever para a IA** em cada momento e o que muda de uma ferramenta para outra.

> **Conferido em 2026-10-08, na documentação oficial de cada ferramenta.** Essas ferramentas mudam rápido. O que não foi possível confirmar em página oficial está marcado como **não verificado**; as páginas consultadas estão no fim.

**Neste guia**

1. [Antes de tudo: quatro passos que valem para qualquer ferramenta](#1-antes-de-tudo)
2. [O que você escreve, do começo ao fim](#2-o-que-você-escreve-do-começo-ao-fim)
3. [Qual ferramenta escolher](#3-qual-ferramenta-escolher)
4. Passo a passo por ferramenta: [Claude Code](#claude-code) · [Claude Cowork](#claude-cowork) · [claude.ai](#claudeai-no-navegador) · [Codex](#codex) · [ChatGPT](#chatgpt-no-navegador) · [Antigravity](#antigravity) · [Gemini CLI](#gemini-cli) · [Gemini](#gemini-no-navegador)
5. [Onde ficam os resultados](#5-onde-ficam-os-resultados)
6. [Páginas consultadas e o que ficou sem confirmação](#6-páginas-consultadas)

---

## 1. Antes de tudo

### Passo 1 · Pegue a sua cópia

Na página do repositório no GitHub, clique em **Use this template** e em **Create a new repository**. Dê um nome ao seu projeto. Se os seus dados não forem públicos, marque **Private**.

Prefere não usar o GitHub? Clique em **Code** e em **Download ZIP**, e descompacte numa pasta com o nome do projeto.

### Passo 2 · Preencha o `PROJETO.md`

É o único arquivo que você escreve para começar. Troque cada texto entre `<` e `>` pelo seu. Um exemplo preenchido:

```markdown
## 1. Tema
Evasão no primeiro ano de um curso de graduação.

## 2. Pergunta e decisão
- **O que eu quero saber:** quem trabalha mais de 30 horas por semana evade mais no primeiro ano?
- **Que decisão depende da resposta:** se sim, a coordenação cria um plano de apoio para quem trabalha.
- **Quem decide:** a coordenadora do curso (simulada pelo professor da disciplina).

## 3. Dados
- **O que eu já tenho:** matriculas_2023.csv e matriculas_2024.csv, em dados/brutos/.
- **De onde vieram:** secretaria do curso, uso autorizado só para este trabalho.
- **Tem dado pessoal?** sim: nome e matrícula.

## 4. Referências
- Censo da Educação Superior (INEP): https://www.gov.br/inep/pt-br/areas-de-atuacao/pesquisas-estatisticas-e-indicadores/censo-da-educacao-superior

## 5. Como vou trabalhar
- **Modo:** essencial
- **Prazo:** 2026-11-20
- **Quem revisa os portões ★:** minha colega de grupo
- **Ferramenta de IA:** Claude Code
```

O exemplo é inventado, só para mostrar o formato.

### Passo 3 · Ponha a base de dados no lugar certo

| Se a sua ferramenta… | A base vai… |
|---|---|
| trabalha como **agente**, numa pasta (Claude Code, Codex, Antigravity, Cowork, Gemini CLI) | na pasta **`dados/brutos/`**, dentro do projeto. Se a pasta não existir, crie. Copie os arquivos para lá como estão, sem abrir e "arrumar" antes |
| é uma **conversa no navegador** (claude.ai, ChatGPT, Gemini) | **anexada na conversa, só quando a IA pedir**, na etapa 02. Não ponha a base junto com os arquivos de instrução do projeto |
| você **não tem dados** | escreva isso no `PROJETO.md`. A etapa 03 procura bases públicas e a IA confere se cada uma existe antes de usar |

Três regras sobre os dados, para qualquer ferramenta:

- **`dados/brutos/` é somente leitura.** Nada ali é alterado, nem por você nem pela IA. Toda limpeza sai de um script e gera um arquivo novo.
- **A pasta `dados/` não vai para o GitHub.** O `.gitignore` deste repositório já cuida disso. Guarde os seus originais em outro lugar também.
- **Dado pessoal não entra em conversa.** Tudo o que a IA vê vai para o provedor dela. A IA lê os dados por script que imprime só contagens e totais; nome, CPF, e-mail e telefone nunca aparecem na tela. A regra completa está na [etapa 00](../etapas/00-kickoff.md).

### Passo 4 · Crie o cofre

O cofre é uma pasta **fora do projeto**. Na etapa 04, a parte dos dados que vai testar a hipótese é guardada ali, e só volta na etapa 07. Crie a pasta e diga onde ela fica pela variável `COFRE_DIR`, **antes de abrir a IA**:

| Onde você está | Comando |
|---|---|
| Codespace, macOS ou Linux | `mkdir -p ../cofre && export COFRE_DIR="$(cd ../cofre && pwd)"` |
| Windows (PowerShell) | `mkdir ..\cofre; $env:COFRE_DIR = (Resolve-Path ..\cofre).Path` |
| Conversa no navegador | não há comando: o cofre é uma pasta do seu computador, e você é quem guarda o arquivo de confirmação |

A variável vale para o terminal em que você a definiu. Se fechar o terminal, defina de novo antes de chamar a IA.

---

## 2. O que você escreve, do começo ao fim

A IA conduz. Você escreve pouco, e quase sempre as mesmas coisas.

### Para começar

No Claude Code deste repositório basta `Comece pela etapa 00.`, porque o `CLAUDE.md` já carrega as instruções e o seu `PROJETO.md`. Em qualquer outra ferramenta, cole o **prompt de partida**:

```text
Você vai operar o Funil de Análise Assistida por IA descrito em AGENTS.md.
Leia AGENTS.md inteiro, PROJETO.md e saidas/00-status.md (se existir) e siga o ciclo PEVD,
parando em cada portão para a minha aprovação explícita.

O contexto do projeto está em PROJETO.md.

Comece pela etapa 00: me faça as perguntas que faltarem, em até duas rodadas,
depois teste suas próprias capacidades (execução, arquivos, internet) e
registre as saídas reais.
```

"Leia AGENTS.md inteiro" tem motivo: o arquivo tem cerca de 33 mil bytes, e duas ferramentas cortam o que carregam sozinhas (o Codex aos 32 KiB e o Antigravity aos 24.000 bytes por arquivo).

### No kickoff

A IA faz até duas rodadas de perguntas, sobre o que não estiver no `PROJETO.md`: a política de dados da sua instituição, se há git, onde fica o cofre. Responda em texto corrido. Depois ela testa o que consegue fazer (rodar código, listar arquivos, abrir uma página) e mostra o resultado real de cada teste.

### Em cada portão

A IA para, mostra um resumo e pede uma semente. A conversa é sempre esta:

| Quem | O quê |
|---|---|
| IA | mostra o resumo da etapa e pede: "me dê uma semente" |
| **Você** | `Semente: 4217` (qualquer número, escolhido na hora) |
| IA | roda o sorteio e mostra 2 números a conferir, cada um com o script que o gerou |
| **Você** | roda de novo cada script indicado, por exemplo `python analise/02_perfil.py`, e confere se o número que saiu é o do resumo |
| **Você** | responde com **uma** destas frases |

```text
Aprovo G1
```

```text
Ajustar: a pergunta está ampla demais; restrinja ao primeiro semestre.
```

```text
Voltar à etapa 02: faltou a base de 2024.
```

A IA não aceita "ok, pode seguir" como aprovação: ela pergunta se aquilo é a aprovação do portão. Escreva a frase.

Depois de aprovar, o commit e a tag são seus:

```bash
git add -A
git commit -m "G1 aprovado"
git tag G1
```

Nos **portões ★** há mais um passo, a âncora fora do projeto. O caminho simples: rode `git rev-parse G1` e mande uma mensagem ao seu revisor (ou ao seu próprio e-mail, se não houver revisor) com a frase de aprovação e o código que o comando mostrou. A IA lembra na hora e explica a alternativa.

No **modo essencial** são 6 portões: G1 ★ (etapas 00 e 01), G4 ★ (02 a 04), G5 ★ (05 e 06), G8 ★ (07 e 08), G11 ★ (09 a 11) e G12.

### Para continuar noutro dia

O estado do projeto fica nos arquivos, não na conversa. Abra uma sessão nova e escreva:

```text
Leia saidas/00-status.md e continue de onde paramos.
```

Em ferramenta de conversa, anexe de novo o `AGENTS.md`, o `PROJETO.md`, o arquivo da etapa atual e o `saidas/00-status.md`, e cole o prompt de partida.

### Na etapa 04: guardar a confirmação

A IA separa os dados em duas partes. A de exploração fica no projeto; a de confirmação vai para o cofre. Ela pede que você confira a pasta do cofre. Se quiser, compacte o arquivo com senha. Em ferramenta de conversa, a IA entrega o arquivo de confirmação: baixe, guarde no seu computador e **não o envie de novo antes da etapa 07**.

### Na etapa 07: devolver a confirmação

A IA pede a devolução. Copie `confirmacao.*` do cofre para `dados/processados/` e escreva:

```text
Devolvi a confirmação.
```

Em ferramenta de conversa, é aqui que você anexa o arquivo de confirmação.

### Na etapa 08: abrir a auditoria

Quem abre é você, numa **sessão nova**, sem histórico, numa **cópia** do projeto. O texto a colar está pronto em [`etapas/08-validacao.md`](../etapas/08-validacao.md#prompt-de-auditoria-adversarial). A IA que fez a análise não pode abrir a própria auditoria.

### Prompts prontos de cada etapa

Cada arquivo de [`etapas/`](../etapas/) termina com uma seção **Prompts prontos**, para quando você quiser pedir algo específico naquela etapa.

---

## 3. Qual ferramenta escolher

| Ferramenta | Como trabalha | Lê o `AGENTS.md` sozinha? | Acesso |
|---|---|---|---|
| **Claude Code** | agente no terminal: edita arquivos e roda código | sim, pelo `CLAUDE.md` deste repositório | plano pago do Claude ou conta Console |
| **Claude Cowork** | agente no app de desktop, sobre uma pasta sua | não verificado | plano pago do Claude |
| **claude.ai** | conversa no navegador, com execução de código própria | não; você sobe os arquivos num projeto | conta gratuita serve |
| **Codex** | agente no terminal | sim | incluído nos planos do ChatGPT; no gratuito, não verificado para o terminal |
| **ChatGPT** | conversa no navegador | não; você sobe os arquivos num projeto | não verificado para o plano gratuito |
| **Antigravity** | agente em app, IDE ou terminal (`agy`) | sim | conta Google pessoal, com cota semanal |
| **Gemini CLI** | agente no terminal | lê `GEMINI.md`; `AGENTS.md` com configuração | **só com chave de API paga ou licença** |
| **Gemini** | conversa no navegador | não; você anexa os arquivos | conta Google pessoal |

**Se puder escolher, use uma das que trabalham como agente** (Claude Code, Codex ou Antigravity). O kit foi desenhado para uma IA que lê e grava arquivos e executa código: é assim que os números saem de script e as travas funcionam. Nas ferramentas de conversa o processo é o mesmo, mas você salva os arquivos e, às vezes, roda o código.

---

## 4. Passo a passo por ferramenta

Todos partem do [passo 1](#passo-1--pegue-a-sua-cópia) e do [passo 2](#passo-2--preencha-o-projetomd) já feitos.

### Claude Code

Agente de terminal da Anthropic. **Acesso:** plano Pro, Max, Team ou Enterprise, ou conta Console; o plano gratuito do claude.ai não inclui o Claude Code.

**No navegador, pelo GitHub Codespaces** (nada para instalar):

1. No seu repositório, clique em **Code**, na aba **Codespaces**, e em **Create codespace on main**. Espere o ambiente abrir; na primeira vez leva alguns minutos.
2. No painel de arquivos, à esquerda, abra o `PROJETO.md`, preencha e salve.
3. Arraste os seus arquivos de dados do computador para a pasta `dados/brutos/` do painel.
4. No terminal, embaixo, crie o cofre: `mkdir -p ../cofre && export COFRE_DIR="$(cd ../cofre && pwd)"`
5. No mesmo terminal, digite `claude`. O login mostra um endereço: abra, autorize, copie o código e cole no terminal.
6. Escreva: `Comece pela etapa 00.`
7. Responda às perguntas do kickoff e siga a conversa dos portões, da [seção 2](#em-cada-portão).

**No seu computador:**

1. Baixe o seu repositório: `git clone <endereço do seu repositório>` e entre na pasta.
2. Instale o Claude Code:
   - macOS, Linux ou WSL: `curl -fsSL https://claude.ai/install.sh | bash`
   - Windows (PowerShell): `irm https://claude.ai/install.ps1 | iex`
   - com Node.js: `npm install -g @anthropic-ai/claude-code`
3. Copie os dados para `dados/brutos/` e crie o cofre ([passo 4](#passo-4--crie-o-cofre)).
4. Na pasta do projeto, `claude`, e depois `Comece pela etapa 00.`

**Atenção:** no Codespace, o login sobrevive a parar e iniciar o ambiente, mas se perde quando o ambiente é reconstruído. Os dados em `dados/` só existem dentro do Codespace: se você apagar o Codespace, eles vão junto.

### Claude Cowork

O agente do app de desktop do Claude, que trabalha sobre uma pasta do seu computador. A Anthropic está unindo o Cowork ao chat comum: em contas que já receberam a mudança, não há mais uma opção "Cowork" separada. **Acesso:** plano pago do Claude.

1. Baixe o seu repositório para o computador (`git clone`, ou **Download ZIP**).
2. Copie os dados para `dados/brutos/`, dentro da pasta do projeto.
3. Abra o Claude Desktop (macOS ou Windows) e entre na sua conta.
4. Em **Projects**, clique em **+** e em **Use an existing folder**; escolha a pasta do projeto.
5. Cole o [prompt de partida](#para-começar) nas instruções do projeto ou na primeira mensagem.
6. Siga a conversa dos portões.

**Atenção:** **não verificado** se o Cowork lê sozinho o `CLAUDE.md` ou o `AGENTS.md` da pasta; por isso o prompt de partida é obrigatório aqui. **Não verificado** onde o código roda no desktop comum (a página de suporte fala em ambiente isolado nos servidores da Anthropic), então pergunte à IA, no kickoff, se ela enxerga a pasta do cofre. O Cowork lê e grava só nas pastas que você conectar.

### claude.ai no navegador

Conversa, com um ambiente próprio para rodar código. Não enxerga a pasta do seu computador. **Acesso:** conta gratuita serve, com limite de cinco projetos.

1. Em claude.ai/projects, clique em **+ New Project** e dê o nome do seu projeto.
2. Em **Set project instructions**, cole o [prompt de partida](#para-começar) e salve.
3. Na base de conhecimento do projeto, clique em **+** e suba os arquivos de instrução: `AGENTS.md`, `PROJETO.md` e os arquivos de `etapas/`, `templates/` e `referencias/`. **Não suba a base de dados aqui.**
4. Em **Settings** → **Capabilities**, ligue **Code execution and file creation**.
5. Abra uma conversa dentro do projeto e escreva: `Comece pela etapa 00.`
6. Na etapa 02, quando a IA pedir os dados, **anexe o arquivo na conversa**.
7. A cada arquivo que a IA produzir (script, relatório, gráfico), baixe e salve na pasta certa do seu repositório: `analise/`, `saidas/`, `resultados/`, `figuras/`.
8. Na etapa 04, baixe o arquivo de confirmação e guarde fora do projeto. Só anexe de novo na etapa 07.

### Codex

Agente de terminal da OpenAI. **Acesso:** a página de preços diz que o Codex está incluído nos planos do ChatGPT. **Não verificado** se o terminal funciona nos planos Free e Go: a documentação lista o terminal a partir do Plus.

1. Baixe o seu repositório e entre na pasta. No Codespace deste repositório o Codex já vem instalado.
2. No seu computador, instale:
   - com Node.js: `npm install -g @openai/codex`
   - macOS ou Linux: `curl -fsSL https://chatgpt.com/codex/install.sh | sh`
   - Windows (PowerShell): `powershell -ExecutionPolicy ByPass -c "irm https://chatgpt.com/codex/install.ps1 | iex"`
3. Copie os dados para `dados/brutos/` e crie o cofre ([passo 4](#passo-4--crie-o-cofre)).
4. Na pasta do projeto, digite `codex` e escolha **Sign in with ChatGPT**. No Codespace, sem navegador local, use `codex login --device-auth` (recurso em beta, que precisa ser habilitado nas configurações de segurança do ChatGPT).
5. Cole o [prompt de partida](#para-começar).
6. Siga a conversa dos portões.

**Atenção:** o Codex lê o `AGENTS.md` sozinho, mas para de carregar aos 32 KiB, e o arquivo deste kit passa um pouco disso. O prompt de partida resolve, ao pedir a leitura do arquivo inteiro. O limite é a opção `project_doc_max_bytes`, em `~/.codex/config.toml`. Há também uma versão do Codex em nuvem, que trabalha sobre repositórios do GitHub; **não verificado** se ela lê o `AGENTS.md`.

### ChatGPT no navegador

Conversa. Não enxerga a pasta do seu computador. **Acesso:** **não verificado** na documentação oficial se projetos estão no plano gratuito.

1. Em chatgpt.com, crie um projeto com o nome do seu trabalho.
2. Nas instruções do projeto, cole o [prompt de partida](#para-começar).
3. Suba os arquivos de instrução no projeto: `AGENTS.md`, `PROJETO.md` e os arquivos de `etapas/`, `templates/` e `referencias/`. **Não suba a base de dados aqui.**
4. Abra uma conversa dentro do projeto e escreva: `Comece pela etapa 00.`
5. Na etapa 02, quando a IA pedir os dados, **anexe o arquivo na conversa**.
6. Salve no seu repositório cada arquivo que a IA produzir.
7. Na etapa 04, guarde o arquivo de confirmação fora do projeto. Só anexe de novo na etapa 07.

**Atenção:** **não verificado** se a conversa executa código. Na etapa 00 a IA testa a própria capacidade e registra o resultado. Se ela não executar, ela entrega o script, você roda no seu computador e cola a saída; ela nunca pode simular uma execução.

### Antigravity

O caminho do Google para quem não paga: app de desktop, IDE e terminal (`agy`). **Acesso:** conta Google pessoal, 18 anos ou mais, em país atendido (o Brasil está na lista). Sem assinatura, há uma cota que se renova toda semana. **Não verificado** se conta de escola funciona; a página de dúvidas sugere usar uma conta `@gmail.com`.

**Pelo app:**

1. Baixe o seu repositório para o computador e copie os dados para `dados/brutos/`.
2. Baixe o Antigravity em antigravity.google/download e entre com a sua conta Google.
3. Clique no ícone de pasta com **+**, em **New Project**, em **Add Folder**, escolha a pasta do projeto e clique em **Create**.
4. Cole o [prompt de partida](#para-começar).
5. Siga a conversa dos portões.

**Pelo terminal:**

1. Instale:
   - macOS ou Linux: `curl -fsSL https://antigravity.google/cli/install.sh | bash`
   - Windows (PowerShell): `irm https://antigravity.google/cli/install.ps1 | iex`
2. Crie o cofre ([passo 4](#passo-4--crie-o-cofre)), entre na pasta do projeto e digite `agy`.
3. Cole o [prompt de partida](#para-começar).

**Atenção:** o Antigravity lê o `AGENTS.md` sozinho, mas trunca cada arquivo acima de 24.000 bytes, e o deste kit é maior. O prompt de partida resolve. **Não verificado** se o `agy` funciona no GitHub Codespaces.

### Gemini CLI

**Deixou de atender quem usava de graça.** Desde 2026-06-18, o Gemini CLI não atende mais contas gratuitas nem assinantes do Google AI Pro e Ultra; o Google indica o Antigravity no lugar. Continua para quem tem chave de API paga ou licença do Gemini Code Assist Standard ou Enterprise.

Se você tem uma dessas:

1. Instale: `npm install -g @google/gemini-cli` (Node.js 20 ou mais novo).
2. Na raiz do projeto, crie um arquivo `GEMINI.md` com duas linhas: `@AGENTS.md` e `@PROJETO.md`. A alternativa é pôr em `settings.json`: `{"context": {"fileName": ["AGENTS.md", "GEMINI.md"]}}`.
3. Copie os dados para `dados/brutos/` e crie o cofre ([passo 4](#passo-4--crie-o-cofre)).
4. Na pasta do projeto, digite `gemini` e cole o [prompt de partida](#para-começar).

**Atenção:** o login com conta Google precisa de um navegador que fale com o terminal. No Codespace, use a variável `GEMINI_API_KEY`.

### Gemini no navegador

Conversa em gemini.google.com. Não tem "projeto". **Acesso:** conta Google pessoal.

1. Abra uma conversa nova.
2. Anexe `AGENTS.md`, `PROJETO.md` e o arquivo da etapa em que você está, de `etapas/`. Cabem até 10 arquivos por mensagem; o Gemini também aceita uma pasta de código ou um repositório do GitHub.
3. Cole o [prompt de partida](#para-começar).
4. Na etapa 02, quando a IA pedir os dados, **anexe o arquivo na conversa**.
5. Salve no seu repositório cada arquivo que a IA produzir.
6. A cada sessão nova, anexe de novo o `AGENTS.md`, o `PROJETO.md`, o arquivo da etapa atual e o `saidas/00-status.md`.

**Atenção:** os **Gems**, que guardam instruções e arquivos, saem das contas pessoais a partir de novembro de 2026; o substituto, as **Skills**, não se aplica a todas as conversas como um projeto. **Não verificado** se a conversa executa código: vale a regra de você rodar o script e colar a saída.

---

## 5. Onde ficam os resultados

A etapa 00 cria estas pastas no seu projeto:

| Pasta | O que tem |
|---|---|
| `saidas/` | os documentos de cada etapa, o status do projeto e o registro das decisões |
| `analise/` | os scripts, numerados pela etapa |
| `resultados/` | os números, em arquivos gravados pelos scripts; nenhum número é digitado |
| `figuras/` | os gráficos, cada um gerado por script |
| `apresentacoes/` | o deck técnico e o deck executivo, no fim |
| `dados/` | brutos, externos e processados; fica fora do git |

Para saber em que ponto o projeto está, abra `saidas/00-status.md`.

---

## 6. Páginas consultadas

| Ferramenta | Página |
|---|---|
| Claude Code | <https://code.claude.com/docs/en/memory> · <https://code.claude.com/docs/en/setup> · <https://code.claude.com/docs/en/devcontainer> · <https://code.claude.com/docs/en/authentication> |
| Claude Cowork | <https://support.claude.com/en/articles/16761823-claude-cowork-and-chat-are-one-claude> · <https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork> · <https://claude.com/docs/cowork/guide/projects> · <https://claude.com/product/cowork> |
| claude.ai | <https://support.claude.com/en/articles/9519177-how-can-i-create-and-manage-projects> · <https://support.claude.com/en/articles/9517075-what-are-projects> · <https://support.claude.com/en/articles/12111783-create-and-edit-files-with-claude> |
| Codex | <https://learn.chatgpt.com/docs/agent-configuration/agents-md> · <https://learn.chatgpt.com/docs/codex/cli> · <https://learn.chatgpt.com/docs/auth> · <https://learn.chatgpt.com/docs/pricing> · <https://github.com/openai/codex> |
| ChatGPT | <https://learn.chatgpt.com/docs/projects.md> · <https://learn.chatgpt.com/docs/web> |
| Antigravity | <https://antigravity.google/docs/rules> · <https://antigravity.google/docs/getting-started/> · <https://antigravity.google/docs/cli/install/> · <https://antigravity.google/docs/plans/> · <https://antigravity.google/docs/faq/> |
| Gemini CLI | <https://developers.googleblog.com/en/an-important-update-transitioning-gemini-cli-to-antigravity-cli/> · <https://geminicli.com/docs/cli/gemini-md/> · <https://geminicli.com/docs/get-started/installation/> · <https://geminicli.com/docs/get-started/authentication/> |
| Gemini no navegador | <https://support.google.com/gemini/answer/18560919> · <https://support.google.com/gemini/answer/15146780> · <https://support.google.com/gemini/answer/14903178> |

### O que ficou sem confirmação

- Se o Claude Cowork lê sozinho um `CLAUDE.md` ou um `AGENTS.md` da pasta, e onde o código dele roda.
- Se o Codex em nuvem lê o `AGENTS.md`, e se o Codex de terminal funciona nos planos Free e Go.
- Se o ChatGPT no navegador executa código, e se projetos estão no plano gratuito.
- Se o Antigravity aceita conta de escola, e se o `agy` funciona no Codespaces.
- Se o Gemini no navegador executa código.
- O ambiente do Codespaces deste repositório foi escrito a partir da documentação e **não foi testado** num Codespace de verdade.

Achou algo desatualizado? A regra do kit vale aqui também: confira na fonte antes de confiar.
