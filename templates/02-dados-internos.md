# 02 · Dados internos

> **Etapa 02 · Dados internos** · Data: AAAA-MM-DD · Responsável: ___ · IA: ___ · Status: `rascunho`

## 1. Expectativas (declaradas antes de rodar)

*(ex.: "espero ~50 mil linhas por ano, chave `id_cliente` única, até 10% de nulos em `renda`")*

## 2. Matriz de requisitos

Da árvore de perguntas (brief §4) para o dado.

| Subpergunta | Variável necessária | Disponível em | Situação |
|---|---|---|---|
| SQ1 | | `D01.coluna` | ok · parcial · ausente |

## 3. Inventário

| ID | Base | Origem / dono | Formato | Período | Uma linha é… | Linhas × colunas | Chave | Dicionário? | Privacidade | SHA-256 |
|---|---|---|---|---|---|---|---|---|---|---|
| D01 | | | | | | | | sim · não · parcial | | |

## 4. Ficha de cada base *(repita para D02, D03…)*

### D01 — *nome*

| Campo | Valor |
|---|---|
| Por que esses dados foram coletados | *(finalidade original, que pode ser diferente da nossa)* |
| Como foram coletados | *(sistema, formulário, sensor, raspagem, pesquisa amostral…)* |
| Quem está coberto / quem fica de fora | |
| Vieses conhecidos ou prováveis | |
| Atualização e defasagem | |
| Restrições de uso | |

**Dicionário resumido**

| Coluna | Tipo | Significado | Unidade | Domínio / valores válidos | Fonte do significado |
|---|---|---|---|---|---|
| | | | | | *dicionário oficial · dono · **inferido (confirmar)*** |

> Significado inferido pela IA é marcado **inferido (confirmar)** e confirmado com o dono dos dados antes do G2.

## 5. Perfil (gerado por `analise/02_perfil.py` → `resultados/02_perfil.json`)

Valores copiados do JSON, com a chave. Colunas pessoais: só contagens.

| Coluna | Tipo | % nulo | Distintos | Mín | Mediana | Máx | Observação |
|---|---|---|---|---|---|---|---|

- Duplicatas exatas: ___ · Duplicatas de chave: ___
- Cobertura temporal: de ___ a ___, com lacunas em ___
- Integridade referencial (chaves entre bases): ___

**Análise anterior e campos de terceiros** (só números univariados; cruzamentos apenas na etapa 05, na exploração)

| Item | Número publicado | Número reproduzido | Bate? | Observação |
|---|---|---|---|---|
| *ex.: taxa geral de cancelamento da análise anterior* | | [→ chave] | sim · não | |

## 6. Qualidade por dimensão

| Dimensão | Regra verificada | Resultado | Gravidade | Ação proposta (etapa 04) |
|---|---|---|---|---|
| Completude | *% de nulos por coluna crítica* | | baixa · média · alta | |
| Unicidade | *chave sem duplicata* | | | |
| Validade | *valores no domínio, formatos, faixas* | | | |
| Consistência | *regras entre colunas; totais que batem* | | | |
| Acurácia | *confronto com a realidade ou com a fonte* | | | |
| Tempestividade | *defasagem vs. o que a decisão exige* | | | |

## 7. Surpresas em relação à expectativa

| Esperado | Encontrado | Explicação / investigação |
|---|---|---|

## 8. Lacunas → necessidades externas

O que falta para responder à pergunta ou para checar o dado interno. É a entrada da etapa 03.

| Lacuna | Propósito da fonte externa | Exemplo de onde procurar |
|---|---|---|
| | benchmark · representatividade · enriquecimento · ordem de grandeza · contexto | |

## 9. Checklist do portão G2

- [ ] Toda subpergunta tem variável mapeada ou lacuna declarada
- [ ] Toda base com ficha, hash SHA-256 e classificação de privacidade
- [ ] Significados inferidos confirmados com o dono (ou marcados como risco)
- [ ] Perfil gerado por script versionado, não por inspeção manual
- [ ] Qualidade avaliada nas 6 dimensões, com gravidade e ação
- [ ] Surpresas explicadas ou abertas como pendência
- [ ] Lacunas convertidas em necessidades para a etapa 03
