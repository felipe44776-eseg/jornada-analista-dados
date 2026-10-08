# 03 · Fontes externas

> **Etapa 03 · Dados externos** · Data: AAAA-MM-DD · Responsável: ___ · IA: ___ · Status: `rascunho`
> Guia: `referencias/catalogo-fontes-externas.md` (catálogo, 15 perguntas de aptidão, harmonização, tolerâncias, protocolo anti-alucinação).
> **Sequência de preenchimento** (a da etapa 03): §1 → §2 (busca e candidatas) → §5 (aptidão; a pergunta 4 só fecha na §6) → seleção, marcada na §2 → **§3, depois da seleção e antes do download completo** → download → §4 → §6 → §7.

## 1. Necessidades

Vêm do brief (§4 e §10) e das lacunas da etapa 02 (§8).

| ID | Propósito | O que comparar ou acrescentar | Granularidade | Período | Geografia |
|---|---|---|---|---|---|
| N1 | benchmark | *ex.: dinâmica das nossas vendas × dinâmica do setor* | mês | 2023–2025 | UF |
| N2 | representatividade | *ex.: perfil etário dos clientes × população do município* | | | |
| N3 | ordem de grandeza | | | | |

Propósitos: **benchmark** · **representatividade** · **enriquecimento** · **ordem de grandeza** · **contexto**.

## 2. Busca

| Onde buscou (produtor ou agregador) | Termos usados | Data |
|---|---|---|
| | | |

**Candidatas**

| Fonte | Produtor | URL | Necessidade | Verificação | Situação |
|---|---|---|---|---|---|
| | | | N1 | abriu? identificador nos metadados? amostra baixada? | aprovada (F__) · descartada (motivo) · a verificar |

> **Nenhuma candidata passa sem abrir.** Link sugerido pela IA que ninguém abriu fica `a verificar` e não é usado. Bloqueio anti-bot não prova inexistência: tente a API ou o FTP oficial. A amostra baixada na verificação serve só para confirmar a existência: dela não se calcula a métrica de nenhuma comparação.

## 3. Plano de comparações de nível (valida a base; executado na etapa 08)

> Preenchido **antes do download completo e da prova de leitura**. A tolerância segue a regra do catálogo (§6). A margem substantiva é declarada pelo dono **sem ver os valores** de nenhum dos lados. Mudança posterior neste plano (ex.: a harmonização mudou a métrica) vai para uma DEC antes de qualquer comparação, sem mexer na tolerância nem na margem.

| ID | Métrica interna | Métrica externa (F__) | Propósito | Regra de tolerância | Margem substantiva `[declarada: dono, data]` | Se divergir… |
|---|---|---|---|---|---|---|
| C1 | | | | `2·√(ep_int² + ep_ext²)` · regra de negócio · razão em [0,5; 2] · dinâmica | | *classificar a causa; explicada só com evidência ou reconciliação numérica* |

> A **triangulação de efeito** (mesma relação numa fonte independente, caminho para E3) é registrada no G5, no registro de hipóteses §4.

## 4. Registro das fontes aprovadas *(repita para F02, F03…)*

### F01 — *nome da fonte*

| Campo | Valor |
|---|---|
| Produtor · distribuidor (se houver intermediário) | |
| URL canônica (página do produto) | |
| URL exata do recurso (arquivo ou endpoint + parâmetros) | |
| Data e hora de acesso | |
| Safra, versão ou data de referência · política de revisão | |
| Licença (com URL) e obrigações (atribuição, Não Comercial, ODbL) | |
| Dado pessoal? Quais campos? Base legal e medidas | |
| Formato, tamanho, encoding, separador | |
| Granularidade (unidade × tempo × geografia; sistema de código) | |
| Consulta ou filtros aplicados | |
| Script de download · arquivo local | `analise/03_baixar_externos.py` · `dados/externos/...` |
| SHA-256 | |
| Variáveis usadas e **definição de cada uma** (com código) | |
| Diferenças de definição em relação ao dado interno | |
| Quebras de série e limitações conhecidas | |

## 5. Aptidão ao uso (15 perguntas do catálogo §4)

| # | Pergunta | F01 | F02 | F03 |
|---|---|---|---|---|
| 1 | Conceito compatível (universo, unidade, variável) | | | |
| 2 | Granularidade suficiente | | | |
| 3 | Exatidão conhecida (CV, IC, cobertura) | | | |
| 4 | **Número publicado reproduzido** (fecha na §6) | | | |
| 5 | Safra registrada; revisões conhecidas | | | |
| 6 | Defasagem aceitável | | | |
| 7 | Série ativa | | | |
| 8 | Coerente com outra fonte | | | |
| 9 | Quebras mapeadas | | | |
| 10 | **Geografia: códigos do mesmo ano; anti-join vazio** | | | |
| 11 | Extração por script | | | |
| 12 | Dicionário e nota metodológica | | | |
| 13 | Produtor identificado; fonte primária | | | |
| 14 | **Licença permite o uso** | | | |
| 15 | **LGPD ok** | | | |
| | **Decisão** | apta · com ressalva · inapta | | |

Falhar em 1, 4, 10, 14 ou 15 = inapta até resolver.

## 6. Prova de leitura

| Fonte | Número publicado (onde) | Método de quem publicou | Valor calculado do download | Bate? |
|---|---|---|---|---|
| F01 | | *ex.: mediana entre jurisdições; ponderado* | [→ `F01.prova`] | sim · não (investigar) |

## 7. Plano de harmonização

| Camada | Interno | Externo | Como harmonizar |
|---|---|---|---|
| Conceito (universo, unidade, informante) | | | |
| Unidade, escala, base | | | *ex.: rebase para 2022=100* |
| Moeda e deflação | | | *ex.: IPCA (SIDRA 1737, var. 2266), mês a mês, base ago/2026* |
| Tempo | | | *ex.: competência × caixa; trimestre móvel* |
| Geografia | | | *ex.: TOM → IBGE, anti-join nos dois sentidos* |
| Quebras e lacunas | | | |

## 8. Checklist do portão G3 ★

- [ ] Toda necessidade tem ao menos uma fonte aprovada, ou a lacuna foi aceita e registrada
- [ ] A métrica-chave tem **duas fontes independentes**, ou a exceção foi registrada
- [ ] Plano de comparações de nível (§3) preenchido **antes** do download e da prova de leitura, com tolerância pela regra e margem declarada pelo dono sem ver os valores
- [ ] Toda fonte aprovada foi **aberta, baixada por script e registrada** (URL, data, safra, licença, SHA-256)
- [ ] Identificadores conferidos nos metadados da fonte, não aceitos da resposta da IA
- [ ] Aptidão avaliada pelas 15 perguntas; ressalvas escritas
- [ ] Prova de leitura feita em cada fonte, pelo método de quem publicou
- [ ] Harmonização planejada em camadas; crosswalks com anti-join
- [ ] Licenças e LGPD conferidas para o uso pretendido
- [ ] Revisado por segunda pessoa (nome: ___) ou ausência registrada em DEC-___
