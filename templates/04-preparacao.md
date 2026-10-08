# 04 · Preparação e partição

> **Etapa 04 · Preparação** · Data: AAAA-MM-DD · Responsável: ___ · IA: ___ · Status: `rascunho`
> Números citados por chave de `resultados/04_*.json`.

## 1. Pipeline

| Ordem | Script | Entrada | Saída |
|---|---|---|---|
| 1 | `analise/04_limpar.py` | `dados/brutos/...` | `dados/processados/...` |
| 2 | `analise/04_integrar.py` | | `base_integrada` (vai para o cofre depois da partição) |
| 3 | `analise/04_particionar.py` | `base_integrada` | `dados/processados/exploracao.*` · `<cofre>/confirmacao.*` · `<cofre>/base_integrada.*` · `<cofre>/reserva.*` (se houver) |

**Rodar do zero:** `python analise/rodar_tudo.py --ate 04` *(a ordem de execução é a lista `ORDEM` do script, não a alfabética)*

## 2. Regras de limpeza

Toda regra tem motivo e contagem. **Nenhuma linha some em silêncio.** Regra que não pegou nada continua no código.

| ID | Regra | Motivo | Linhas afetadas (n · %) | Destino |
|---|---|---|---|---|
| R01 | | | [→ `R01.n`] | corrigida · sinalizada (flag) · quarentena |

> **Sinalizar ≠ excluir.** Uma flag tira a linha de uma análise específica e a mantém na base. A quarentena tira a linha da base e guarda o motivo em `dados/quarentena/`, que fica local.

## 3. Quarentena

| Motivo | Regra | Linhas | Arquivo |
|---|---|---|---|
| | R__ | | `dados/quarentena/...` |
| **Total** | | | |

## 4. Variáveis derivadas

| Variável | Definição / fórmula | Colunas de origem | Unidade |
|---|---|---|---|
| | | | |

## 5. Integração e harmonização

| Junção | Chave | Tipo | Linhas antes → depois | Taxa de correspondência | Não correspondidas: destino |
|---|---|---|---|---|---|
| D01 × F02 | `cod_ibge_7` | left | | | |

Harmonizações aplicadas (plano da etapa 03 §7): deflator e data-base, conversões de unidade, crosswalks (resultado do anti-join), compatibilização temporal.

## 6. Testes de dados

Assertivas executadas por código (pandera, Great Expectations ou `assert`) a cada execução. **Relatórios de falha mascaram colunas pessoais.**

| Teste | Regra | Resultado |
|---|---|---|
| chave única | `id` sem duplicata | passou · falhou |
| domínio | `idade` entre 0 e 120 | |
| totais | soma após junção = soma antes | |

## 7. Partição exploração × confirmação

| Campo | Valor |
|---|---|
| Método | aleatório estratificado (por variável **que não seja** o desfecho de hipótese de nível) · agrupado · temporal · espacial · por conglomerado no estrato (amostra complexa) · fonte independente · **sem partição** |
| Justificativa | *(por que evita vazamento neste dado)* |
| Atribuição | **fixa e estável:** SHA-256 de `"<sal>:<id>"` (sal do kickoff), nunca o `hash()` do Python; estratificada = ordenar pelo hash dentro do estrato; temporal/espacial = regra de corte documentada |
| Proporção | *padrão 70% / 30%; ajustada pelo poder preliminar abaixo* |
| Reserva (opcional) | ___% para um eventual segundo ciclo, gravada como `reserva.*` no cofre. Só leva a E1 se o G5 do ciclo 1 reservar α |
| Poder preliminar das HP | *probabilidade de a regra de decisão confirmar se o efeito verdadeiro for o **δ plausível do brief** (> m), com as variâncias do perfil (02), α/k (α'/k = (α/2)/k se houver reserva) e n efetivo = n / DEFF [→ `resultados/04_poder.json`]. Nunca calculado no próprio m* |
| Linhas em cada parte | [→ `particao.n_exploracao`] · [→ `particao.n_confirmacao`] |
| Hash de **conteúdo** de cada parte | |
| Cofre (`COFRE_DIR`, fora do projeto) | |
| Data da selagem | AAAA-MM-DD |
| O que foi verificado na confirmação | **só as contagens e a distribuição das variáveis de estratificação, registradas pelo próprio script de partição** |

> **Sem partição** (descritiva ou *n* pequeno): as hipóteses a priori são registradas por completo no template `05-registro-hipoteses.md` e **travadas agora**, antes de qualquer exploração, com a tag `trava-registro` ancorada fora. Hipóteses nascidas da exploração ficam em E0 até haver dado novo.

## 8. Convenções fixadas

- Arredondamento: ___ *(ex.: percentuais com 1 casa, valores monetários sem centavos)*
- Moeda e data-base: ___
- Formato de datas: ISO

## 9. Checklist do portão G4

- [ ] Pipeline roda do bruto ao processado com um comando (`rodar_tudo.py --ate 04`), sem edição manual
- [ ] Toda regra de limpeza com motivo e contagem; quarentena com totais
- [ ] Junções com taxa de correspondência; crosswalks com anti-join
- [ ] Harmonizações do plano da etapa 03 aplicadas e documentadas
- [ ] Testes de dados passam; relatórios de falha sem dado pessoal
- [ ] Partição com atribuição fixa por ID; poder preliminar calculado antes de fixar a proporção
- [ ] `confirmacao.*` e `base_integrada.*` **no cofre**, fora do projeto; nada além do script de partição as leu
- [ ] Hash de conteúdo das partes registrado no status
- [ ] (Sem partição) registro das hipóteses a priori travado, com a tag `trava-registro` ancorada fora e a DEC `âncora`
- [ ] Convenções de arredondamento e unidade fixadas
