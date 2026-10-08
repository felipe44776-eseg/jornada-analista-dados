---
etapa: "11"
nome: "Deck executivo"
fase: "5 · Comunicar"
portao: "G11 ★"
papel_ia: "Redator(a) executivo(a)"
entradas:
  - saidas/01-brief.md
  - saidas/08-validacao.md
  - saidas/09-insights.md
  - saidas/10-roteiro-deck-tecnico.md
  - resultados/*.json · figuras/
saidas:
  - saidas/11-roteiro-deck-executivo.md
  - apresentacoes/deck-executivo.html (+ one-pager opcional)
template: templates/11-roteiro-deck-executivo.md
origem: "Minto: Pyramid Principle, SCQ · BLUF (US Army AR 25-50) · Duarte: apresentar para executivos (resumo primeiro; regra dos 10%) · Knaflic: Storytelling with Data · Google DA: Share, Act · CRISP-DM: Produce final report (apresentação final)"
---

# Etapa 11 — Deck executivo

> **Missão:** levar quem decide da pergunta à decisão em poucos minutos, com **resposta primeiro**, até 5 insights (um gráfico por insight), confiança explícita e decisão pedida.

## Por que esta etapa existe

- Quem decide não precisa do caminho: precisa da **resposta, do grau de confiança e do que fazer**. O caminho está no deck técnico, que funciona como apêndice.
- **BLUF** (*bottom line up front*) e a pirâmide de Minto estruturam o deck. Duarte recomenda liderar com achados e recomendação e seguir a "regra dos 10%": para um apêndice de 50 slides, 5 de resumo. Knaflic simplifica o gráfico até sobrar só a mensagem.
- Simplificar não é distorcer. O número e a ressalva do deck técnico continuam valendo, só que ditos em linguagem de negócio.
- Com IA, o risco é a **tradução inflar a evidência**: "os dados indicam" vira "comprovamos", e a confiança média some.

## Papel da IA

Comprimir e traduzir o jargão sem perder o número nem a ressalva, simplificar os gráficos (da mesma base) e preparar as perguntas difíceis. O humano ensaia e ajusta o tom para o público real.

## Tradução técnica → executiva

| No deck técnico | No deck executivo |
|---|---|
| "H04 · **E3** (robusta, coerente com F02, mantida na auditoria): +2,1 p.p. [1,2; 3,0]" | "**Confiança alta:** o cancelamento é cerca de 2 pontos maior no plano B, e isso aparece em todos os recortes e numa fonte externa" |
| "H02 · **E1**, sem triangulação" | "**Confiança média:** o sinal aparece nos nossos dados; ainda não há régua externa para confirmar" |
| "Associação; pergunta não causal" | "Andam juntos; não sabemos se um provoca o outro" |
| "Causal condicional (desenho observacional, premissas P1–P3)" | "Se as premissas forem válidas, estimamos que…" (as premissas vão nas notas) |
| "Refutada (equivalência), validada na 08 como E2: IC dentro de ±1 p.p." | "**Confiança média:** o efeito, se existe, é pequeno demais para mudar a decisão" |
| "Inconclusiva" | "Os dados não bastam para decidir. Para decidir, precisaríamos de cerca de N casos a mais", com o N calculado por poder [→ chave] |

**Semáforo de confiança:** alta (E3) · média (E1–E2) · a investigar (E0, **só no slide de próximos passos, nunca como insight**).

## Roteiro PEVD

### P — Planejar
1. Escreva o perfil do público: quem é, o que já sabe, o que teme, quanto tempo terá.
2. Declare a expectativa: número de slides e a pergunta mais difícil que você espera ouvir.

### E — Executar
1. Preencha o roteiro (template):
   - a recomendação no slide 1;
   - o resumo SCQ(A) no slide 2;
   - um insight por slide;
   - recomendação e impacto;
   - confiança;
   - decisão pedida.
2. **Simplifique os gráficos** a partir dos `Vnnc`: menos séries, destaque do que importa, anotação direta no lugar da legenda. Mesma base, mesmo script, outra camada visual.
3. Traduza o jargão pela tabela acima. **O número e a ressalva continuam.** Todo número sai de `resultados/`, com a chave nas notas.
4. Renderize (mesmos formatos da etapa 10). One-pager opcional.
5. Rode os cinco testes: título, 5 segundos, número, jargão e pergunta difícil.
6. **Ensaie** com o dono da pergunta ou com alguém no papel dele.

### V — Verificar
- Algum insight E0, derrubado ou "não reexecutado" acima de E1 entrou? Remova.
- Alguma "confiança alta" sem E3? Corrija.
- Todo número tem chave nas notas?
- Rode o checklist do portão (no roteiro).

### D — Decidir: portão G11 ★
Portão crítico: ensaio com o dono da pergunta ou substituto e revisão por segunda pessoa (ou ausência registrada, com "sem revisão independente" no deck). Peça `Aprovo G11`.

## Armadilhas

| Armadilha | Salvaguarda |
|---|---|
| Começar pela metodologia | resposta no slide 1 |
| Jargão estatístico | tradução para confiança alta, média ou a investigar |
| "Confiança alta" para achado E1 | alta só para E3 |
| Rótulos de Cohen ("efeito moderado") no lugar do número | o número na unidade do negócio, com a faixa |
| "Medir por mais N meses" com N inventado | N calculado por poder, com chave |
| Título-tema | título-asserção |
| Gráfico técnico copiado sem simplificar | anotação direta, uma série destacada |
| Recomendação escondida no fim | slide 1 e decisão pedida no último |
| Simplificar até distorcer | número e ressalva do técnico preservados |

## Prompts prontos

```text
Reescreva cada slide para uma diretora sem formação em estatística. Mantenha
todos os números (das chaves em resultados/) e as ressalvas; troque só o
jargão, pela tabela de tradução da etapa 11. "Confiança alta" só para E3. Se,
para simplificar, você precisar mudar o que um número significa, pare e me
avise.
```

```text
Faça o teste do título: liste só os títulos, em ordem, e diga se contam a
história completa sem os slides. Depois aja como a decisora e faça as 5
perguntas mais difíceis, com resposta curta e rastreio para cada uma.
```

## Volte para trás quando

- Os títulos não contam a história → **09**.
- Um número diverge do deck técnico ou de `resultados/` → **10** e a etapa que o produziu.
