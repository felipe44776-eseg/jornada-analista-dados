# Como usar em cada ferramenta de IA

O kit não depende de ferramenta: as instruções para a IA estão no [`AGENTS.md`](../AGENTS.md) e o contexto do seu projeto, no [`PROJETO.md`](../PROJETO.md). O que muda de uma ferramenta para outra é **como ela carrega esses dois arquivos** e **se ela consegue mexer nos arquivos e rodar código**.

> **Conferido em 2026-10-08, na documentação oficial de cada ferramenta.** Essas ferramentas mudam rápido. O que não foi possível confirmar em página oficial está marcado como **não verificado**; as páginas consultadas estão no fim.

## Qual escolher

| Ferramenta | Como trabalha | Lê o `AGENTS.md` sozinha? | Acesso |
|---|---|---|---|
| **Claude Code** | agente no terminal: edita arquivos e roda código | sim, pelo `CLAUDE.md` deste repositório | plano pago do Claude ou conta Console |
| **Claude Cowork** | agente no app de desktop, sobre uma pasta sua | não verificado | plano pago do Claude |
| **claude.ai** | conversa no navegador, com execução de código própria | não; você sobe os arquivos num projeto | conta gratuita serve |
| **Codex** | agente no terminal | sim | incluído nos planos do ChatGPT; no gratuito, não verificado para o terminal |
| **ChatGPT** | conversa no navegador | não; você sobe os arquivos num projeto | não verificado para o plano gratuito |
| **Antigravity** | agente em app, IDE ou terminal (`agy`) | sim | conta Google pessoal, com cota semanal |
| **Gemini CLI** | agente no terminal | lê `GEMINI.md`; `AGENTS.md` com configuração | **só com chave de API paga ou licença** (ver abaixo) |
| **Gemini no navegador** | conversa | não; você anexa os arquivos | conta Google pessoal |

**Se puder escolher, use uma das que trabalham como agente** (Claude Code, Codex ou Antigravity). O kit foi desenhado para uma IA que lê e grava arquivos e executa código: é assim que os números saem de script e as travas funcionam. Nas ferramentas de conversa o processo é o mesmo, mas você salva os arquivos e, às vezes, roda o código.

## O prompt de partida

Vale para todas as ferramentas, na primeira mensagem. No Claude Code deste repositório basta `Comece pela etapa 00.`, porque o `CLAUDE.md` já carrega os dois arquivos.

```text
Você vai operar o Funil de Análise Assistida por IA descrito em AGENTS.md.
Leia AGENTS.md inteiro, PROJETO.md e saidas/00-status.md (se existir) e siga o ciclo PEVD,
parando em cada portão para a minha aprovação explícita.

O contexto do projeto está em PROJETO.md.

Comece pela etapa 00: me faça as perguntas que faltarem, em até duas rodadas,
depois teste suas próprias capacidades (execução, arquivos, internet) e
registre as saídas reais.
```

"Leia AGENTS.md inteiro" não é enfeite. O arquivo tem cerca de 33 mil bytes, e duas ferramentas cortam o que carregam sozinhas: o Codex para de carregar aos 32 KiB e o Antigravity trunca cada arquivo acima de 24.000 bytes. Pedir a leitura do arquivo inteiro contorna o corte.

## Regras que valem em qualquer ferramenta

- **Tudo o que a IA vê vai para o provedor dela.** Dado pessoal não entra em conversa nem é aberto pela IA. A regra completa está na [etapa 00](../etapas/00-kickoff.md).
- **O conjunto de confirmação só é entregue à IA na etapa 07.** Em ferramenta de conversa, não suba esse arquivo antes.
- **Sem execução de código, a IA entrega o script e você roda e cola a saída.** Ela nunca pode simular uma execução ([`AGENTS.md`](../AGENTS.md) §12).

---

## Anthropic

### Claude Code

O caminho mais direto, e o que o `README` descreve.

- **Instruções:** lê o `CLAUDE.md` da pasta, que neste repositório importa o `AGENTS.md` e o `PROJETO.md` com `@arquivo`.
- **No Codespace deste repositório:** já vem instalado. No terminal, `claude`. O login abre uma página; copie o código que ela mostrar e cole no terminal.
- **No seu computador:**
  - macOS, Linux ou WSL: `curl -fsSL https://claude.ai/install.sh | bash`
  - Windows (PowerShell): `irm https://claude.ai/install.ps1 | iex`
  - com Node.js: `npm install -g @anthropic-ai/claude-code`

  Depois, abra o terminal na pasta do projeto e rode `claude`.
- **Primeira mensagem:** `Comece pela etapa 00.`
- **Acesso:** plano Pro, Max, Team ou Enterprise, ou conta Console. O plano gratuito do claude.ai não inclui o Claude Code.
- **Atenção:** no Codespace, o login sobrevive a parar e iniciar o ambiente, mas se perde quando o ambiente é reconstruído.

### Claude Cowork

O agente do app de desktop do Claude, que trabalha sobre uma pasta do seu computador. A Anthropic está unindo o Cowork ao chat comum: em contas que já receberam a mudança, não há mais uma opção "Cowork" separada.

- **Instruções:** **não verificado** se ele lê sozinho um `CLAUDE.md` ou um `AGENTS.md` da pasta. O que está documentado são as instruções do projeto, que valem para toda sessão dele. Por isso, cole sempre o prompt de partida.
- **Passo a passo:**
  1. Baixe este repositório para o computador (clone, ou **Code** → **Download ZIP**).
  2. Abra o Claude Desktop (macOS ou Windows) e entre na sua conta.
  3. Em **Projects**, clique em **+** e em **Use an existing folder**; escolha a pasta do projeto.
  4. Cole o prompt de partida nas instruções do projeto ou na primeira mensagem.
- **Acesso:** plano pago do Claude.
- **Atenção:** o Cowork lê e grava só nas pastas que você conectar. **Não verificado** onde o código roda no desktop comum: a página de suporte fala em ambiente isolado nos servidores da Anthropic.

### claude.ai no navegador

Conversa, com um ambiente próprio para rodar código. Não enxerga a pasta do seu computador.

- **Instruções:** um **Project**, com instruções e arquivos de conhecimento que valem para todas as conversas dele.
- **Passo a passo:**
  1. Em claude.ai/projects, clique em **+ New Project**.
  2. Em **Set project instructions**, cole o prompt de partida e salve.
  3. Na base de conhecimento, suba `AGENTS.md`, `PROJETO.md` e os arquivos de `etapas/`, `templates/` e `referencias/`.
  4. Ligue **Code execution and file creation** em **Settings** → **Capabilities**.
  5. Abra uma conversa no projeto e escreva: `Comece pela etapa 00.`
- **Acesso:** conta gratuita serve, com limite de cinco projetos. A execução de código está disponível em todos os planos.
- **Atenção:** você mesmo salva, no seu repositório, cada arquivo que a IA produzir.

---

## OpenAI

### Codex

Agente de terminal da OpenAI. Há também uma versão em nuvem, que trabalha sobre repositórios do GitHub; **não verificado** se ela lê o `AGENTS.md`.

- **Instruções:** lê o `AGENTS.md` da pasta sozinho. Para de carregar quando o total chega a 32 KiB, e o `AGENTS.md` deste kit passa um pouco disso: use o prompt de partida, que pede a leitura do arquivo inteiro. O limite é a opção `project_doc_max_bytes`, em `~/.codex/config.toml`.
- **No Codespace deste repositório:** já vem instalado. No terminal, `codex`.
- **No seu computador:**
  - com Node.js: `npm install -g @openai/codex`
  - macOS ou Linux: `curl -fsSL https://chatgpt.com/codex/install.sh | sh`
  - Windows (PowerShell): `powershell -ExecutionPolicy ByPass -c "irm https://chatgpt.com/codex/install.ps1 | iex"`

  Depois, `codex` na pasta do projeto e **Sign in with ChatGPT**.
- **Login sem navegador local** (Codespace): `codex login --device-auth`. É um recurso em beta e precisa ser habilitado nas configurações de segurança do ChatGPT.
- **Primeira mensagem:** o prompt de partida.
- **Acesso:** a página de preços diz que o Codex está incluído nos planos do ChatGPT. **Não verificado** se o terminal funciona nos planos Free e Go: a documentação lista o terminal a partir do Plus.

### ChatGPT no navegador

Conversa. Não enxerga a pasta do seu computador.

- **Instruções:** um **Project**, com instruções e arquivos (**Sources**) que valem para todas as conversas dele.
- **Passo a passo:**
  1. Em chatgpt.com, crie um projeto.
  2. Nas instruções do projeto, cole o prompt de partida.
  3. Suba `AGENTS.md`, `PROJETO.md` e os arquivos de `etapas/`, `templates/` e `referencias/`.
  4. Abra uma conversa no projeto e escreva: `Comece pela etapa 00.`
- **Acesso:** **não verificado** na documentação oficial se projetos estão no plano gratuito, nem o limite de arquivos por projeto.
- **Atenção:** **não verificado** se a conversa executa código. Na etapa 00 a IA testa a própria capacidade e registra o resultado: se ela não executar, vale a regra de você rodar o script e colar a saída.

---

## Google

### Antigravity

O caminho do Google para quem não paga: app de desktop, IDE e terminal (`agy`).

- **Instruções:** lê o `AGENTS.md` da pasta sozinho. Trunca cada arquivo acima de 24.000 bytes, e o `AGENTS.md` deste kit é maior: use o prompt de partida, que pede a leitura do arquivo inteiro.
- **App:** baixe em antigravity.google/download. Clique no ícone de pasta com **+**, em **New Project**, em **Add Folder**, escolha a pasta do projeto e clique em **Create**.
- **Terminal:**
  - macOS ou Linux: `curl -fsSL https://antigravity.google/cli/install.sh | bash`
  - Windows (PowerShell): `irm https://antigravity.google/cli/install.ps1 | iex`

  Depois, `agy` na pasta do projeto.
- **Primeira mensagem:** o prompt de partida.
- **Acesso:** conta Google pessoal, 18 anos ou mais, em país atendido (o Brasil está na lista). Sem assinatura, há uma cota que se renova toda semana. **Não verificado** se conta de escola funciona; a página de dúvidas sugere usar uma conta `@gmail.com`.
- **Atenção:** **não verificado** se o `agy` funciona no GitHub Codespaces. Em conexão remota, ele mostra um endereço e você cola o código no terminal.

### Gemini CLI

**Deixou de atender quem usava de graça.** Desde 2026-06-18, o Gemini CLI não atende mais contas gratuitas nem assinantes do Google AI Pro e Ultra; o Google indica o Antigravity no lugar. Continua para quem tem chave de API paga ou licença do Gemini Code Assist Standard ou Enterprise.

Se você tem uma dessas:

- **Instruções:** lê `GEMINI.md`. Para ler o `AGENTS.md`, há duas saídas documentadas:
  - criar um `GEMINI.md` na raiz com as linhas `@AGENTS.md` e `@PROJETO.md`;
  - ou pôr em `settings.json`: `{"context": {"fileName": ["AGENTS.md", "GEMINI.md"]}}`.
- **Instalação:** `npm install -g @google/gemini-cli`, com Node.js 20 ou mais novo. Depois, `gemini` na pasta do projeto.
- **Atenção:** o login com conta Google precisa de um navegador que fale com o terminal. No Codespace, use a variável `GEMINI_API_KEY`.

### Gemini no navegador

Conversa em gemini.google.com. Não tem "projeto".

- **Instruções:** os **Gems** guardam instruções e arquivos, mas saem das contas pessoais a partir de novembro de 2026. O substituto, as **Skills**, não se aplica a todas as conversas como um projeto. O caminho que não depende disso é anexar os arquivos.
- **Passo a passo:**
  1. Abra uma conversa nova.
  2. Anexe `AGENTS.md`, `PROJETO.md` e o arquivo da etapa em que você está (cabem até 10 arquivos por mensagem).
  3. Cole o prompt de partida.
  4. A cada sessão nova, anexe de novo o `AGENTS.md`, o `PROJETO.md`, o arquivo da etapa atual e o `saidas/00-status.md`.
- **Acesso:** conta Google pessoal.
- **Atenção:** **não verificado** se a conversa executa código. Vale a regra de você rodar o script e colar a saída. Você mesmo salva os arquivos.

---

## Páginas consultadas

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

## O que ficou sem confirmação

- Se o Claude Cowork lê sozinho um `CLAUDE.md` ou um `AGENTS.md` da pasta, e onde o código dele roda.
- Se o Codex em nuvem lê o `AGENTS.md`, e se o Codex de terminal funciona nos planos Free e Go.
- Se o ChatGPT no navegador executa código, e se projetos estão no plano gratuito.
- Se o Antigravity aceita conta de escola, e se o `agy` funciona no Codespaces.
- Se o Gemini no navegador executa código.
- O ambiente do Codespaces deste repositório foi escrito a partir da documentação e **não foi testado** num Codespace de verdade.

Achou algo desatualizado? A regra do kit vale aqui também: confira na fonte antes de confiar.
