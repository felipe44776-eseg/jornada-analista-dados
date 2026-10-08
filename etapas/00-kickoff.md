---
etapa: "00"
nome: "Kickoff"
fase: "1 · Enquadrar"
portao: "G0"
papel_ia: "Organizador(a) do projeto"
entradas: []
saidas:
  - saidas/00-kickoff.md
  - saidas/00-status.md
  - saidas/log-decisoes.md
  - saidas/log-ia.md
  - requirements.txt · .gitignore
template: templates/00-kickoff.md
origem: "CRISP-DM: Assess situation, Produce project plan · TDSP: estrutura padronizada e papéis · ASUM-DM: gestão de projeto · NIST AI RMF: Govern · LGPD"
---

# Etapa 00 — Kickoff

> **Missão:** deixar o projeto pronto para rodar com segurança: pastas, ambiente fixado, **travas externas** montadas, capacidades da IA **testadas**, dados classificados quanto à privacidade e papéis definidos, antes de qualquer análise.

## Por que esta etapa existe

- O CRISP-DM abre com um inventário de recursos, requisitos, restrições e riscos (*Assess situation*). O guia avisa: "make sure that you are allowed to use the data". TDSP e ASUM-DM acrescentam estrutura padronizada, papéis e gestão.
- Com IA, três riscos nascem já no primeiro dia:
  1. **Presumir capacidade que a ferramenta não tem.** Por exemplo, acreditar que ela executou um código quando só descreveu o que ele faria, ou que abriu um link que nunca abriu.
  2. **Vazar dado pessoal sem perceber.** Em modo agente, o que o código imprime e o que a IA abre com a ferramenta de leitura vão para o provedor.
  3. **Confiar em travas que a própria IA escreve.** Por isso o cofre e as tags git ficam com o humano.

## Papel da IA

Organizar o projeto e **testar a si mesma** (executar, listar arquivos, abrir um link), registrando o resultado real de cada teste. Propor a classificação dos dados, que o humano confirma. A IA não decide nada sobre privacidade sozinha e não opera as travas externas: ela as pede e as registra.

## Roteiro PEVD

### P — Planejar
1. Pergunte ao humano o que falta, em **duas rodadas** de até 5 perguntas.
   - **Rodada 1:** nome e contexto do projeto; dono da pergunta (real ou simulado); prazo; onde estão os dados; que ferramenta de IA está em uso.
   - **Rodada 2:** política de dados da instituição; quem revisa os portões ★; modo (completo ou essencial); git disponível?; onde fica o cofre.
2. Declare a expectativa. Exemplo: "espero Python 3.11 com pandas; espero 2 arquivos em `dados/brutos/`".

### E — Executar
1. **Estrutura:** crie as pastas do `AGENTS.md` §6. Copie `templates/00-status.md`, `templates/log-decisoes.md` e `templates/log-ia.md` para `saidas/`.
2. **Teste de capacidades** (cole a saída real no artefato):
   - execução: rode `python --version` e um cálculo trivial;
   - arquivos: liste `dados/brutos/`, só os nomes;
   - internet: tente abrir uma página pública, como `https://servicodados.ibge.gov.br/api/docs`.
   Se algum teste falhar, o modo de operação muda (`AGENTS.md` §12).
3. **Ambiente:** crie `requirements.txt` com as bibliotecas-base e as versões fixadas. Registre as versões instaladas e a semente do projeto. Pacote novo só entra depois de conferido no PyPI: IAs sugerem nomes que não existem, e alguns desses nomes são registrados por atacantes.
4. **Travas externas** (pedidas por você, operadas pelo humano):
   - **git** (obrigatório em modo agente): `git init` e `.gitignore` com `dados/` (e `modelos/` e `modelos_regerado/`, se forem grandes). O primeiro commit e a tag `G0` são do humano;
   - **âncora externa** para os portões ★ e os travamentos (tags `trava-registro` e `trava-modelo`), por uma de duas rotas (`AGENTS.md` §5):
     - **mensagem** do humano ao revisor (e-mail, AVA), ou ao próprio e-mail se não houver revisor, com a frase de aprovação, o `git rev-parse` da tag e os hashes;
     - **remoto** com **proteção de tags testada agora**: crie e envie a tag `teste-trava`, mova-a e tente `git push -f origin teste-trava` e `git push --delete origin teste-trava`. Os dois têm de ser **recusados**. Se algum passar, a rota do remoto não vale, e fica a mensagem.

     Tag só local não é âncora;
   - **cofre:** o humano cria uma pasta **fora do projeto** para a confirmação e define a variável de ambiente `COFRE_DIR` com esse caminho;
   - **sal da partição:** um texto fixo, registrado no kickoff, que torna a atribuição exploração/confirmação estável e reproduzível.
5. **Proteção dos brutos:** calcule o SHA-256 de cada arquivo em `dados/brutos/` e marque-os como somente leitura (Windows: `attrib +R`; Linux/macOS: `chmod a-w`).
6. **Classificação dos dados:** proponha a classificação de cada base (pública, interna, pessoal, sensível) **a partir dos nomes de coluna e da documentação, sem abrir o conteúdo**. O humano confirma.
7. **Política de envio à IA:** para bases pessoais ou sensíveis, defina com o humano o que pode ser impresso ou enviado (agregados, esquema, amostra pseudonimizada) e escreva a regra no artefato. Registre também a configuração do provedor: conta, uso das conversas para treino e retenção.
8. Preencha papéis, cronograma e riscos em `saidas/00-kickoff.md`.

### V — Verificar
- Todo teste de capacidade tem saída real colada. "Deve funcionar" não conta.
- Releia a conversa: algum valor de dado pessoal apareceu? Se sim, registre uma DEC do tipo `incidente` e ajuste a regra.
- Rode o checklist do portão (§9 do artefato).

### D — Decidir: portão G0
Apresente o resumo (`AGENTS.md` §9) e peça `Aprovo G0`, o primeiro commit e a tag.

## Regra de privacidade para toda a análise

> **Em modo agente, tudo o que a IA vê vai para o provedor**: o que o código imprime e o que ela abre com ferramenta de leitura.
> - Dado se lê por **script que imprime contagens, agregados e esquemas**. Linha individual, só de base pseudonimizada e só quando necessário.
> - Colunas pessoais (nome, CPF, e-mail, telefone, endereço) nunca aparecem em `head()`, `value_counts()`, traceback ou relatório de validação.
> - Célula com *n* < 5 é suprimida.

## Armadilhas

| Armadilha | Salvaguarda |
|---|---|
| Presumir que a IA executou código ou abriu um link | saída real no artefato; sem execução, o humano roda e cola |
| Dado pessoal impresso no terminal ou aberto pela ferramenta de leitura | script que imprime só agregados; pseudonimizar antes |
| Editar um arquivo bruto "só para corrigir uma coisinha" | brutos somente leitura + hash conferido nas etapas seguintes |
| Ambiente não fixado: números mudam de máquina para máquina | `requirements.txt` com versões + semente |
| Travas que a própria IA escreve e atesta | cofre e tags com o humano (`AGENTS.md` §5) |
| Nenhum revisor para os portões ★ | nomear no kickoff; ausência registrada limita os achados a E2 |

## Prompt de partida

Cole no início da primeira sessão:

```text
Você vai operar o Funil de Análise Assistida por IA descrito em AGENTS.md.
Leia AGENTS.md e saidas/00-status.md (se existir) e siga o ciclo PEVD,
parando em cada portão para a minha aprovação explícita.

Contexto: <2 a 4 linhas: organização/disciplina, o que motivou a análise,
quem vai usar o resultado, onde estão os dados>.

Comece pela etapa 00: me faça as perguntas que faltarem, em até duas rodadas,
depois teste suas próprias capacidades (execução, arquivos, internet) e
registre as saídas reais.
```

## Volte para trás quando

Não há etapa anterior. Se o kickoff não fechar (sem dados acessíveis ou sem autorização de uso), **o projeto não começa**. Registre o motivo no log. Sem dono real da pergunta, use um **dono simulado** declarado (professor ou colega).
