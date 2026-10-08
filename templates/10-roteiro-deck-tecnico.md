# 10 · Roteiro do deck técnico

> **Etapa 10 · Deck técnico** · Data: AAAA-MM-DD · Responsável: ___ · IA: ___ · Status: `rascunho`
> **Público:** equipe de dados, professor(a), revisores. **Objetivo:** permitir escrutínio e reprodução.
> **Arquivo final:** `apresentacoes/deck-tecnico.html` *(ou .pptx / Marp / Quarto, ver etapa 10)*

## Estrutura sugerida (15 a 22 slides + apêndice)

| # | Título-asserção | Conteúdo | Visual | Rastreio (chaves / artefatos) | Notas do apresentador |
|---|---|---|---|---|---|
| 1 | *Capa: pergunta + resposta curta* | autor, data, versão; "sem revisão independente", se for o caso | — | — | |
| 2 | *Resumo técnico* | achados com nível de evidência, em 3–5 linhas | tabela | A__ | |
| 3 | *A decisão e a pergunta* | decisor, tipo de pergunta, efeito mínimo relevante, afirmações permitidas | — | brief §2–3 | |
| 4 | *De onde vêm os dados* | bases internas, período, unidade, qualidade | tabela | D__ · `02_perfil` | |
| 5 | *Com o que comparamos* | fontes externas, propósito, prova de leitura, veredito da base | tabela | F__ · C__ | |
| 6 | *Como preparamos e partimos* | regras, quarentena, junções, partição e cofre | fluxo | R__ · `04_particao` | |
| 7 | *O funil desta análise* | placar completo, com testes somados de todos os ciclos | funil | status | |
| 8–10 | *Padrões que viraram hipóteses* | gráficos da exploração, rotulados E0 | gráfico | V__ · O__ | |
| 11 | *O que registramos antes de testar* | hipóteses, efeito mínimo, famílias, correção, sensibilidades | tabela | registro travado (hash) | |
| 12 | *O que testamos e o que resultou* | todas as hipóteses: estimativa, IC (ajustado ou não), p, p ajustado, decisão (4 desfechos) | tabela + `Vnnc` | `H__.*` | |
| 13 | *Modelo (se houver)* | baseline × modelo congelado, validação, avaliação única com IC | tabela | `06_modelo` · `07_testes` | |
| 14 | *O que resistiu à validação* | sensibilidades, régua externa (nível e efeito), auditoria, níveis pela regra | tabela | A__ · C__ | |
| 15 | *Desvios e limitações* | desvios (cego ou informado), ameaças à validade | lista | 07 §5 · 08 §8 | |
| 16 | *Como reproduzir* | comando único, hashes, ambiente, resultado da reprodução em ambiente limpo | código | 08 §6 | |
| 17 | *Próximos passos* | iterações e dados que faltam | lista | 08 §10 | |
| 18 | *Uso de IA* | declaração resumida (versão curta) | texto | declaração (rascunho) | |
| A1… | *Apêndice* | todos os testes, análises exploratórias adicionais (E0), dicionário, gráficos descartados relevantes | | | |

## Regras

- **Todo número vem de `resultados/*.json`**, com a chave no rodapé ou nas notas. Sem chave, o número sai.
- **Contrárias, refutadas e inconclusivas aparecem** (slide 12). O deck técnico mostra o funil inteiro.
- Resultado com p **exato**, estimativa e IC. "Significativo" sozinho não informa.
- Achado ilustrado por `Vnnc` (base do teste). Exploração só com o rótulo "exploração (E0)".
- Linguagem da escada de evidência (`AGENTS.md` §8).

## Checklist do portão G10

- [ ] Todo número do deck conferido por script contra `resultados/`
- [ ] Nenhum número da lista "números revisados"
- [ ] Os quatro desfechos, os desvios e o placar do funil presentes
- [ ] Achados com gráficos `Vnnc`; gráficos de exploração rotulados E0
- [ ] Limitações e ameaças à validade presentes
- [ ] Reprodução em ambiente limpo (feita na etapa 08) reportada
- [ ] Rascunho da declaração de uso de IA feito a partir do `log-ia.md`
- [ ] Revisado por par técnico (nome: ___) ou ausência registrada em DEC-___, com "sem revisão independente" no deck
