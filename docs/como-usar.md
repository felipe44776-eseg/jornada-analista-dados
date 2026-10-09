# Como usar: o passo a passo

Este guia leva você do zero até a primeira aprovação: como pegar a sua cópia, o que preencher, **onde pôr a base de dados**, **o que escrever para a IA** em cada momento e o que muda de uma ferramenta para outra.

> Conferido em 2026-10-08 na documentação oficial de cada ferramenta, listada no fim. Essas ferramentas mudam rápido: se um botão estiver com outro nome, vale a página oficial.

**Neste guia**

1. [Antes de tudo: quatro passos que valem para qualquer ferramenta](#1-antes-de-tudo)
2. [O que você escreve, do começo ao fim](#2-o-que-você-escreve-do-começo-ao-fim)
3. [Qual ferramenta escolher](#3-qual-ferramenta-escolher)
4. [Passo a passo por ferramenta](#4-passo-a-passo-por-ferramenta): [Claude Code](#claude-code) · [Claude Cowork](#claude-cowork) · [claude.ai](#claudeai-no-navegador) · [Codex](#codex) · [ChatGPT](#chatgpt-no-navegador) · [Antigravity](#antigravity) · [Gemini CLI](#gemini-cli) · [Gemini](#gemini-no-navegador)
5. [Onde ficam os resultados](#5-onde-ficam-os-resultados)
6. [Páginas consultadas](#6-páginas-consultadas)

---

## 1. Antes de tudo

### Passo 1 · Pegue a sua cópia

Na página do repositório no GitHub, clique em **Use this template** e em **Create a new repository**. Dê um nome ao seu projeto. Se os seus dados não forem públicos, marque **Private**.

Prefere não usar o GitHub? Clique em **Code** e em **Download ZIP**, e descompacte numa pasta com o nome do projeto.

### Passo 2 · Preencha o `PROJETO.md`

É o único arquivo que você escreve para começar. Troque cada texto entre `<` e `>` pelo seu. Dá para editar direto no GitHub: abra o arquivo, clique no lápis, escreva e clique em **Commit changes**.

Um exemplo preenchido:

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
| é uma **conversa no navegador** (claude.ai, ChatGPT, Gemini) | **anexada na conversa, quando a IA pedir**, na etapa 02. A IA lê as instruções pelo seu repositório do GitHub, e a base não está lá |
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

Use o prompt inteiro, com o "Leia AGENTS.md inteiro": algumas ferramentas carregam sozinhas só o começo de arquivos longos, e é esse pedido que garante a leitura completa.

### No kickoff

A IA faz até duas rodadas de perguntas, sobre o que não estiver no `PROJETO.md`: a política de dados da sua instituição, se há git, onde fica o cofre. Responda em texto corrido. Depois ela testa o que consegue fazer (rodar código, listar arquivos, abrir uma página) e mostra o resultado real de cada teste. Se ela não executar código na ferramenta que você escolheu, o processo continua: ela entrega o script, você roda e cola a saída.

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

Em ferramenta de conversa, abra uma conversa nova, garanta que a IA está lendo a versão atual do seu repositório e cole o prompt de partida.

### Na etapa 04: guardar a confirmação

A IA separa os dados em duas partes. A de exploração fica no projeto; a de confirmação vai para o cofre. Ela pede que você confira a pasta do cofre. Se quiser, compacte o arquivo com senha. Em ferramenta de conversa, a IA entrega o arquivo de confirmação: baixe, guarde no seu computador e **não o envie de novo antes da etapa 07**.

### Na etapa 07: devolver a confirmação

A IA pede a devolução. Copie `confirmacao.*` do cofre para `dados/processados/` e escreva:

```text
Devolvi a confirmação.
```

Em ferramenta de conversa, é aqui que você anexa o arquivo de confirmação.

### Na etapa 08: abrir a auditoria

Quem abre é você, numa **sessão nova**, sem histórico, numa **cópia** do projeto. O texto a colar está pronto em [`etapas/08-validacao.md`](../etapas/08-validacao.md#prompt-de-auditoria-adversarial). A IA que fez a análise não abre a própria auditoria.

### Prompts prontos de cada etapa

Cada arquivo de [`etapas/`](../etapas/) termina com uma seção **Prompts prontos**, para quando você quiser pedir algo específico naquela etapa.

---

## 3. Qual ferramenta escolher

| Ferramenta | Como trabalha | Como recebe as instruções | Acesso |
|---|---|---|---|
| **Claude Code** | agente no terminal: edita arquivos e roda código | lê o `CLAUDE.md` deste repositório | plano pago do Claude ou conta Console |
| **Claude Cowork** | agente no app de desktop, sobre uma pasta sua | você cola o prompt de partida nas instruções do projeto | plano pago do Claude |
| **claude.ai** | conversa no navegador, com execução de código | projeto ligado ao seu repositório do GitHub | conta gratuita serve |
| **Codex** | agente no terminal | lê o `AGENTS.md` sozinho | planos do ChatGPT; o terminal consta na documentação a partir do Plus |
| **ChatGPT** | conversa no navegador, com análise de dados em Python | projeto com os arquivos, ou o plugin do GitHub | conta do ChatGPT; o número de arquivos por projeto varia com o plano |
| **Antigravity** | agente em app, IDE ou terminal (`agy`) | lê o `AGENTS.md` sozinho | conta Google pessoal, com cota semanal |
| **Gemini CLI** | agente no terminal | lê `GEMINI.md` | só com chave de API paga ou licença |
| **Gemini** | conversa no navegador | importa o seu repositório do GitHub na conversa | conta Google pessoal |

**Se puder escolher, use uma das que trabalham como agente** (Claude Code, Codex ou Antigravity). O kit foi desenhado para uma IA que lê e grava arquivos e executa código: é assim que os números saem de script e as travas funcionam. Nas ferramentas de conversa o processo é o mesmo, com uma diferença: é você quem leva os arquivos de um lado para o outro.

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

**Bom saber:** no Codespace, o login continua valendo quando você para e reinicia o ambiente, e é pedido de novo se o ambiente for reconstruído. Os dados em `dados/` ficam só dentro do Codespace: guarde os originais no seu computador.

### Claude Cowork

O agente do app de desktop do Claude, que trabalha sobre uma pasta do seu computador. A Anthropic está unindo o Cowork ao chat comum: em contas que já receberam a mudança, o mesmo recurso aparece direto no chat. **Acesso:** plano pago do Claude.

1. Baixe o seu repositório para o computador (`git clone`, ou **Download ZIP**).
2. Copie os dados para `dados/brutos/`, dentro da pasta do projeto.
3. Abra o Claude Desktop (macOS ou Windows) e entre na sua conta.
4. Em **Projects**, clique em **+** e em **Use an existing folder**; escolha a pasta do projeto.
5. Cole o [prompt de partida](#para-começar) nas instruções do projeto: é ele que manda a IA ler o `AGENTS.md` e o `PROJETO.md`.
6. Abra uma conversa no projeto, escreva `Comece pela etapa 00.` e siga a conversa dos portões.

**Bom saber:** o Cowork lê e grava só nas pastas que você conectar. No kickoff, quando a IA perguntar onde fica o cofre, confirme com ela se a pasta do cofre está ao alcance.

### As três ferramentas de navegador: como os arquivos circulam

claude.ai, ChatGPT e Gemini leem o seu repositório do GitHub, mas não gravam nele. Então o caminho é sempre o mesmo:

1. **As instruções chegam pelo GitHub.** Você liga a ferramenta ao seu repositório (o que você criou no [passo 1](#passo-1--pegue-a-sua-cópia)), e ela lê o `AGENTS.md`, o `PROJETO.md` e as etapas de lá.
2. **A base de dados chega pela conversa.** Você anexa o arquivo quando a IA pedir, na etapa 02. A pasta `dados/` não está no GitHub.
3. **O que a IA produz sai por download.** Baixe cada arquivo (script, relatório, gráfico) e ponha no seu repositório, na pasta que a IA indicar: `analise/`, `saidas/`, `resultados/`, `figuras/`.
4. **Para pôr um arquivo no repositório sem instalar nada:** na página do repositório, entre na pasta, clique em **Add file** e em **Upload files**, arraste os arquivos e clique em **Commit changes**.
5. **Depois de cada portão**, atualize a leitura da IA, do jeito de cada ferramenta (abaixo), para ela enxergar o `saidas/00-status.md` novo.

### claude.ai no navegador

Conversa com um ambiente próprio para rodar código. **Acesso:** conta gratuita serve, com limite de cinco projetos; a ligação com o GitHub e a execução de código estão em todos os planos.

1. **Ligue o GitHub, uma vez só:** em **Customize** → **Connectors** → **GitHub Integration**, clique em **Connect** e dê acesso ao seu repositório. Funciona com repositório privado.
2. Em claude.ai/projects, clique em **+ New Project** e dê o nome do seu trabalho. O projeto precisa ser privado, não compartilhado.
3. Em **Set project instructions**, cole o [prompt de partida](#para-começar) e salve.
4. Na base de conhecimento do projeto, clique em **+** e em **GitHub**, escolha o seu repositório, marque `AGENTS.md`, `PROJETO.md`, `etapas/` e `templates/`, e clique em **Add files**. Quando uma etapa pedir um guia de `referencias/`, acrescente esse arquivo do mesmo jeito.
5. Em **Settings** → **Capabilities**, ligue **Code execution and file creation**.
6. Abra uma conversa dentro do projeto e escreva: `Comece pela etapa 00.`
7. **A base de dados:** na etapa 02, quando a IA pedir, clique no **+** da caixa de mensagem e em **Add files or photos**. CSV e XLSX são aceitos, até 30 MB por arquivo.
8. Baixe os arquivos que a IA criar e suba no seu repositório ([como](#as-três-ferramentas-de-navegador-como-os-arquivos-circulam)).
9. **Depois de cada portão:** no repositório dentro da base de conhecimento do projeto, clique em **Sync now**.
10. Na etapa 04, baixe o arquivo de confirmação e guarde fora do projeto. Só anexe de novo na etapa 07.

### Codex

Agente de terminal da OpenAI. **Acesso:** incluído nos planos do ChatGPT; a documentação lista o terminal a partir do plano Plus.

1. Baixe o seu repositório e entre na pasta. No Codespace deste repositório o Codex já vem instalado.
2. No seu computador, instale:
   - com Node.js: `npm install -g @openai/codex`
   - macOS ou Linux: `curl -fsSL https://chatgpt.com/codex/install.sh | sh`
   - Windows (PowerShell): `powershell -ExecutionPolicy ByPass -c "irm https://chatgpt.com/codex/install.ps1 | iex"`
3. Copie os dados para `dados/brutos/` e crie o cofre ([passo 4](#passo-4--crie-o-cofre)).
4. Na pasta do projeto, digite `codex` e escolha **Sign in with ChatGPT**. No Codespace, use `codex login --device-auth`, que se habilita nas configurações de segurança do ChatGPT.
5. Cole o [prompt de partida](#para-começar).
6. Siga a conversa dos portões.

**Bom saber:** o Codex lê o `AGENTS.md` sozinho até 32 KiB. O prompt de partida pede a leitura do arquivo inteiro; se preferir, aumente o limite em `~/.codex/config.toml`, na opção `project_doc_max_bytes`.

### ChatGPT no navegador

Conversa que escreve e executa Python sobre os arquivos que você envia. **Acesso:** conta do ChatGPT; o número de arquivos por projeto varia com o plano.

1. Na barra lateral de chatgpt.com, clique em **New project** e dê o nome do seu trabalho.
2. Nas instruções do projeto, cole o [prompt de partida](#para-começar).
3. **As instruções do kit**, por um de dois caminhos:
   - **Pelo GitHub:** na aba **Plugins**, abra o plugin do GitHub, clique no botão de mais e autentique, escolhendo o seu repositório. Depois, na conversa, peça: `Leia AGENTS.md e PROJETO.md do repositório <nome do seu repositório>.`
   - **Por arquivo:** na seção **Sources** do projeto, suba `AGENTS.md`, `PROJETO.md`, o arquivo da etapa em que você está e o modelo dela, de `templates/`. Ao avançar de etapa, troque os dois últimos.
4. Abra uma conversa dentro do projeto e escreva: `Comece pela etapa 00.`
5. **A base de dados:** na etapa 02, quando a IA pedir, anexe o arquivo na conversa (`.csv`, `.xls` ou `.xlsx`).
6. Baixe os arquivos que a IA criar e suba no seu repositório ([como](#as-três-ferramentas-de-navegador-como-os-arquivos-circulam)).
7. Na etapa 04, guarde o arquivo de confirmação fora do projeto. Só anexe de novo na etapa 07.

**Bom saber:** no app de desktop do ChatGPT, um projeto pode ser ligado a uma pasta do computador: no menu do projeto, **Edit project** → **Add folder**.

### Antigravity

O caminho do Google sem assinatura: app de desktop, IDE e terminal (`agy`). **Acesso:** conta Google pessoal (`@gmail.com`), 18 anos ou mais; sem assinatura, há uma cota que se renova toda semana.

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

**Bom saber:** o Antigravity lê o `AGENTS.md` sozinho até 24.000 bytes por arquivo. O prompt de partida pede a leitura do arquivo inteiro.

### Gemini CLI

Desde 2026-06-18, o Gemini CLI atende quem tem chave de API paga ou licença do Gemini Code Assist Standard ou Enterprise. Para conta gratuita e para assinantes do Google AI Pro e Ultra, o Google indica o [Antigravity](#antigravity).

Se você tem chave ou licença:

1. Instale: `npm install -g @google/gemini-cli` (Node.js 20 ou mais novo).
2. Na raiz do projeto, crie um arquivo `GEMINI.md` com duas linhas: `@AGENTS.md` e `@PROJETO.md`. A alternativa é pôr em `settings.json`: `{"context": {"fileName": ["AGENTS.md", "GEMINI.md"]}}`.
3. Copie os dados para `dados/brutos/` e crie o cofre ([passo 4](#passo-4--crie-o-cofre)).
4. Na pasta do projeto, digite `gemini` e cole o [prompt de partida](#para-começar).

**Bom saber:** no Codespace, entre com a variável `GEMINI_API_KEY`.

### Gemini no navegador

Conversa em gemini.google.com, no computador. **Acesso:** conta Google pessoal, 18 anos ou mais, com a opção Keep Activity ligada.

1. Abra uma conversa nova.
2. **As instruções do kit, pelo GitHub:** clique em **Add file** → **More Uploads** → **Import code**, cole o endereço do seu repositório e clique em **Import**. Para repositório privado, vincule a sua conta do GitHub quando ele pedir. Entra um repositório por conversa, de até 5.000 arquivos e 100 MB.
   - **Sem GitHub:** no mesmo **Import code**, escolha **Upload folder** e aponte para a pasta do projeto no seu computador.
3. Cole o [prompt de partida](#para-começar).
4. **A base de dados:** na etapa 02, quando a IA pedir, clique em **Add files** → **Upload**. Cabem até 10 arquivos por mensagem, de até 100 MB cada.
5. Baixe os arquivos que o Gemini gerar, ou exporte para o Drive, e suba no seu repositório ([como](#as-três-ferramentas-de-navegador-como-os-arquivos-circulam)). Código pode ir direto para o Colab, em **Share & export** → **Export to Colab**, que é um bom lugar para rodar os scripts.
6. **Depois de cada portão**, e a cada sessão nova: abra outra conversa e importe o repositório de novo, porque o Gemini guarda o repositório como estava na hora da importação.

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
| claude.ai | <https://claude.com/docs/connectors/github> · <https://support.claude.com/en/articles/9519177-how-can-i-create-and-manage-projects> · <https://support.claude.com/en/articles/9517075-what-are-projects> · <https://support.claude.com/en/articles/8241126-uploading-files-to-claude> · <https://support.claude.com/en/articles/12111783-create-and-edit-files-with-claude> |
| Codex | <https://learn.chatgpt.com/docs/agent-configuration/agents-md> · <https://learn.chatgpt.com/docs/codex/cli> · <https://learn.chatgpt.com/docs/auth> · <https://learn.chatgpt.com/docs/pricing> · <https://github.com/openai/codex> |
| ChatGPT | <https://learn.chatgpt.com/docs/projects.md> · <https://learn.chatgpt.com/docs/web> · <https://learn.chatgpt.com/docs/plugins.md> · <https://help.openai.com/en/articles/8437071-data-analysis-with-chatgpt> · <https://help.openai.com/en/articles/10169521-projects-in-chatgpt> |
| Antigravity | <https://antigravity.google/docs/rules> · <https://antigravity.google/docs/getting-started/> · <https://antigravity.google/docs/cli/install/> · <https://antigravity.google/docs/plans/> · <https://antigravity.google/docs/faq/> |
| Gemini CLI | <https://developers.googleblog.com/en/an-important-update-transitioning-gemini-cli-to-antigravity-cli/> · <https://geminicli.com/docs/cli/gemini-md/> · <https://geminicli.com/docs/get-started/installation/> · <https://geminicli.com/docs/get-started/authentication/> |
| Gemini no navegador | <https://support.google.com/gemini/answer/16176929> · <https://support.google.com/gemini/answer/14903178> · <https://support.google.com/gemini/answer/14184041> · <https://blog.google/innovation-and-ai/products/gemini-app/generate-files-in-gemini/> |
