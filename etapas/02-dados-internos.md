---
etapa: "02"
nome: "Dados internos"
fase: "2 · Reunir"
portao: "G2"
papel_ia: "Engenheiro(a) de dados"
entradas:
  - saidas/01-brief.md
  - saidas/00-kickoff.md
saidas:
  - saidas/02-dados-internos.md
  - analise/02_perfil.py · resultados/02_perfil.json
template: templates/02-dados-internos.md
origem: "CRISP-DM: Collect initial data, Describe data, Explore data, Verify data quality · IBM FMDS: Data requirements, Data collection, Data understanding · KDD: Selection · SEMMA: Sample · OSEMN: Obtain · DMAIC: Measure · Datasheets for Datasets"
---

# Etapa 02 — Dados internos

> **Missão:** saber exatamente o que os dados internos são, de onde vêm, quem cobrem e quão confiáveis são, antes de qualquer análise. E dizer, com precisão, o que falta.

## Por que esta etapa existe

- É o *Data Understanding* do CRISP-DM: coletar, descrever, explorar superficialmente e verificar qualidade. A IBM acrescenta *Data requirements*: começar pelo que a pergunta exige, não pelo que a base tem.
- *Datasheets for Datasets* (Gebru et al.): conhecer a **motivação** e o **processo de coleta** evita usar o dado para o que ele não serve. Todo dado foi coletado para outra finalidade.
- As dimensões de qualidade (completude, unicidade, validade, consistência, acurácia, tempestividade) dão vocabulário e checklist.
- Com IA, o risco típico é a ferramenta **adivinhar o significado** de uma coluna pelo nome (`status = 2` significa o quê?) e seguir como se soubesse.

## Papel da IA

Escrever e rodar o perfil, montar o inventário e as fichas, avaliar a qualidade. **Não adivinhar semântica:** todo significado inferido é marcado e confirmado com o dono dos dados.

## Limite desta etapa

> Aqui o perfil é **univariado e de qualidade**. Não cruze o desfecho com as preditoras. Isso já é exploração, que acontece na etapa 05, só na base de exploração, depois da partição da etapa 04. Cruzar agora contamina o conjunto de confirmação.

## Roteiro PEVD

### P — Planejar
1. Da árvore de perguntas (brief §4), monte a **matriz de requisitos**: subpergunta → variável necessária.
2. Declare as expectativas: linhas por período, chave única, faixa de nulos, período coberto.

### E — Executar
1. **Inventário:** liste cada base (D01, D02…) com origem, formato, período, unidade de linha, dimensões, chave e SHA-256.
2. **Perfil por script** (`analise/02_perfil.py`): tipos, % de nulos, distintos, mínimo, mediana e máximo, duplicatas exatas e de chave, cobertura temporal e lacunas, integridade referencial entre bases. Os números vão para `resultados/02_perfil.json`, e o artefato cita as chaves.
   Colunas pessoais: **só contagens**, nunca valores. Dado se lê **por script**, nunca abrindo o arquivo com ferramenta de leitura.
3. **Fichas:** para cada base, responda por que foi coletada, como, quem cobre e quem fica de fora, vieses prováveis e defasagem.
4. **Dicionário:** use a documentação oficial. O que você inferir fica marcado **inferido (confirmar)**. Pergunte ao humano em lote.
5. **Qualidade:** avalie as 6 dimensões com regra, resultado, gravidade e ação proposta para a etapa 04.
6. **Surpresas:** compare cada expectativa com o encontrado e explique ou investigue as diferenças.
7. **Análise anterior e campos de terceiros:**
   - se já existe uma análise sobre o mesmo tema, **reproduza os números univariados dela** antes de corrigi-los: só assim se sabe se a diferença é de método ou de dado. Os cruzamentos (desfecho × preditoras) dessa análise só são reproduzidos na etapa 05, na base de exploração;
   - campo derivado por terceiro (ocupação estimada, escore, categoria atribuída por fornecedor) é **reproduzido ou validado** antes de usar.
8. **Lacunas → necessidades externas:** o que falta para responder e o que precisa ser checado fora. É a entrada da etapa 03.

### V — Verificar
- O perfil foi gerado por script versionado? Os números do artefato batem com a saída?
- Todo significado inferido foi confirmado ou virou risco declarado?
- Rode o checklist do portão (§9 do artefato).

### D — Decidir: portão G2
Peça `Aprovo G2`. Se os dados não permitem responder à pergunta, diga isso agora: é a hora mais barata para descobrir.

## Armadilhas

| Armadilha | Salvaguarda |
|---|---|
| A IA adivinha o significado de uma coluna pelo nome | marcar **inferido (confirmar)** e perguntar |
| Perfil "no olho" | script versionado, saída salva |
| Duplicata escondida por chave composta | testar a unicidade da chave declarada |
| A base cobre só quem "sobreviveu" (clientes ativos, empresas abertas) | ficha: quem fica de fora; checar com fonte externa na 03 |
| O perfil vaza dado pessoal (valores mais frequentes de `nome`) | colunas pessoais: só contagens |
| Cruzar desfecho × preditoras "só para ter uma ideia" | proibido antes da partição (etapa 04) |
| Base **limpa demais** (0 nulos, 0 fora de domínio, 0 duplicatas) tratada como boa notícia | é sinal de pré-processamento desconhecido: descubra quem limpou, como, e quem ficou de fora |
| Campo derivado por terceiro usado como se fosse medida direta | reproduzir ou validar o campo antes de usar; registrar a definição |

## Prompts prontos

```text
Escreva analise/02_perfil.py para todas as bases de dados/brutos/: tipos, % de
nulos, distintos, min/mediana/max, duplicatas (exatas e de chave), cobertura
temporal e integridade referencial. Colunas pessoais (liste-as antes): só
contagens, nunca valores. Rode e preencha o §5 do artefato com a saída real.
```

```text
Para cada coluna, diga de onde veio o significado que você está usando:
dicionário oficial, dono dos dados ou inferência sua. Liste as inferidas para
eu confirmar em lote.
```

## Volte para trás quando

- Os dados não permitem responder à pergunta como formulada → **01**: reformule ou reduza o escopo.
- Aparece dado pessoal ou sensível não classificado → **00**.
