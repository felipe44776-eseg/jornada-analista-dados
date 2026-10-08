# 11 · Roteiro do deck executivo

> **Etapa 11 · Deck executivo** · Data: AAAA-MM-DD · Responsável: ___ · IA: ___ · Status: `rascunho`
> **Público:** quem decide. **Objetivo:** uma decisão informada em poucos minutos.
> **Arquivo final:** `apresentacoes/deck-executivo.html` + `apresentacoes/one-pager.pdf` *(opcional)*

## Estrutura sugerida (6 a 10 slides)

| # | Título-asserção | Conteúdo | Visual | Confiança | Rastreio (chaves) | Notas |
|---|---|---|---|---|---|---|
| 1 | *A recomendação, como frase* | uma linha de contexto | — | — | 09 §5 | |
| 2 | *Resumo em um slide* | SCQ(A) + até 3 insights + recomendação + decisão pedida | texto enxuto | — | 09 §2–5 | |
| 3 | *Insight 1* | um gráfico (`Vnnc` simplificado), "e daí" em uma linha | gráfico anotado | alta · média | I01 | |
| 4 | *Insight 2* | idem | | | I02 | |
| 5 | *Insight 3* | idem | | | I03 | |
| 6 | *O que recomendamos e o que se ganha* | ação, dono, prazo, impacto em faixa (só se calculado) | tabela curta | | 09 §5 | |
| 7 | *Quão seguros estamos* | semáforo por insight; refutadas validadas ("não muda a decisão"), com confiança; o que não afirmamos | semáforo (alta · média · a investigar) | | 08 · 09 §4, §8 | |
| 8 | *Próximos passos e decisão pedida* | quem, o quê, quando; itens E0 "a investigar" | lista | — | | |
| A | *Apêndice* | link para o deck técnico | — | — | 10 | |

Com **zero ou um** insight confirmado, o deck fica mais curto. Não se completa o formato com achado fraco.

## Regras

- **Resposta primeiro.** O slide 1 já diz a recomendação. O contexto vem depois, e curto.
- **Um slide, uma mensagem, um gráfico.** O título é a conclusão ("Cancelamento é cerca de 2 pontos maior no plano B"), não o tema ("Análise de cancelamento").
- **Sem jargão estatístico:** confiança alta (E3), média (E1–E2) ou a investigar (E0, só em próximos passos). A faixa e a ressalva, numa frase.
- **O verbo obedece à evidência** (`AGENTS.md` §8). Nada de "causa" fora do permitido.
- **Todo número sai de `resultados/`**, com a chave nas notas do apresentador.
- **Gráficos simplificados** a partir dos `Vnnc`: menos séries, destaque do que importa, anotação direta.

## Testes antes do portão

| Teste | Como | Passou? |
|---|---|---|
| **Título** | ler só os títulos, em ordem: contam a história? | |
| **5 segundos** | cada gráfico entendido em 5 s por alguém de fora | |
| **Número** | cada número bate com `resultados/` | |
| **Jargão** | nenhum termo que o decisor precise perguntar | |
| **Pergunta difícil** | 5 perguntas prováveis do decisor com resposta preparada | |

## Checklist do portão G11 ★

- [ ] Recomendação no primeiro slide; decisão pedida no último
- [ ] Até 5 insights, cada um com um gráfico e uma confiança; alta só para E3
- [ ] Nenhum insight E0, derrubado, ou "não reexecutado" acima de E1; E0 só em próximos passos
- [ ] Linguagem sem jargão e proporcional à evidência
- [ ] Os cinco testes passaram
- [ ] Ensaio com o dono da pergunta ou substituto (nome: ___)
- [ ] Revisado por segunda pessoa (nome: ___) ou ausência registrada em DEC-___, com "sem revisão independente" no deck
