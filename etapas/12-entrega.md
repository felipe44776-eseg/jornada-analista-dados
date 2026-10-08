---
etapa: "12"
nome: "Entrega e retrospectiva"
fase: "5 · Comunicar"
portao: "G12"
papel_ia: "Documentador(a) e facilitador(a) da retrospectiva"
entradas:
  - saidas/ (todos os artefatos)
  - saidas/08-validacao.md §6 (primeira reprodução em ambiente limpo)
  - saidas/declaracao-uso-ia.md (rascunho da etapa 10)
  - saidas/log-ia.md · saidas/log-decisoes.md
saidas:
  - saidas/12-entrega.md
  - saidas/declaracao-uso-ia.md (final, assinada)
template: templates/12-entrega.md + templates/declaracao-uso-ia.md
origem: "CRISP-DM: Plan deployment, Plan monitoring and maintenance, Review project (experience documentation) · TDSP: Deployment, Customer acceptance · DMAIC: Control · IBM FMDS: Deployment, Feedback · Google DA: Act · CRISP-ML(Q): Monitoring and maintenance · KDD: agir sobre o conhecimento"
---

# Etapa 12 — Entrega e retrospectiva

> **Missão:** fechar o ciclo. Entregar um pacote **reproduzível**, combinar como a decisão será acompanhada, registrar o que se aprendeu (inclusive sobre a IA) e **assinar a declaração de uso de IA**.

## Por que esta etapa existe

- O CRISP-DM termina com um plano de implantação, um **plano de monitoramento e manutenção** e a **documentação da experiência**. O DMAIC chama isso de *Control*, e a IBM de *Feedback*: a análise informa uma decisão, e a decisão precisa ser acompanhada.
- **Reprodutibilidade de verdade** só existe quando testada em ambiente limpo. A primeira reprodução foi feita na etapa 08; aqui ela é **reconferida** com o pacote final.
- A retrospectiva sobre o uso da IA (onde ajudou, onde errou, como o erro foi pego) melhora o próximo ciclo e o próprio kit.
- Integridade acadêmica: o uso de IA generativa é **declarado** e a responsabilidade é dos autores. Unicamp (2026), UFMG (2026), CNPq (2026) e as grandes editoras exigem declaração.

## Papel da IA

Montar o pacote, reconferir a reprodução, facilitar a retrospectiva a partir dos logs e completar o rascunho da declaração **marcando, frase a frase, a evidência no log**. O humano confere cada frase e assina.

## Roteiro PEVD

### P — Planejar
1. Liste o que vai no pacote e onde a reprodução será reconferida.
2. Declare a expectativa: tempo de reprodução e se os números devem sair idênticos.

### E — Executar
1. **Pacote:** decks, artefatos, código, `resultados/`, manifesto de dados (URL, data, hash) e declaração. Guarde cópia dos externos, se a licença permitir.
2. **Reconferir a reprodução em ambiente limpo**, como na etapa 08 §E4: pasta nova, ambiente recriado pelo `requirements.txt`, `resultados/` original como `resultados_ref/`, `COFRE_DIR` numa pasta temporária nova e vazia, e `python analise/rodar_tudo.py --reproducao`.
   - Use a **cópia guardada** dos externos (conferida por hash). A comparação final tem de sair sem diferenças, e os dados processados, com o mesmo hash de conteúdo.
   - À parte, baixe os externos de novo numa pasta separada e compare os hashes (checagem de deriva do catálogo §8, que lista todas as divergências). Uma diferença aqui é **deriva da fonte** (revisão, nova safra), a registrar, não falha da reprodução.
3. **Plano de acompanhamento:** indicador, frequência, responsável, resultado esperado e **gatilho para refazer a análise**.
4. **Retrospectiva:** o que funcionou, o que não funcionou e o que mudar no kit, em processo, dados, IA e comunicação. A parte de IA vem do `log-ia.md`.
5. **Declaração de uso de IA:** complete o rascunho. Cada frase leva a evidência (DEC ou linha do log). **Frase sem evidência é apagada, não suavizada.**
6. **Checagem final de privacidade** nos entregáveis publicados: sem dado pessoal, sem célula com *n* < 5.
7. Atualize o status: todos os portões aprovados (ou a 06 marcada como "não se aplica", com motivo). O humano faz o commit final com a tag `G12`.

### V — Verificar
- A reprodução produziu números idênticos? Se não, a diferença foi explicada?
- Cada frase da declaração tem evidência?
- Rode o checklist do portão (§6 do artefato).

### D — Decidir: portão G12
Peça `Aprovo G12`. Fim do ciclo.

## Armadilhas

| Armadilha | Salvaguarda |
|---|---|
| "Funciona na minha máquina" | reprodução em ambiente limpo por `rodar_tudo.py --reproducao`, com `resultados/` comparado por script |
| Hash de Parquet "diverge" com dado idêntico | hash de conteúdo para processados; hash de bytes só para brutos e externos |
| Análise entregue e esquecida | plano de acompanhamento com gatilho |
| Retrospectiva genérica ("foi bom") | baseada nos logs de IA e de decisões |
| Declaração pré-preenchida assinada sem conferir | frase a frase contra o log; o que não ocorreu é apagado |
| Dado pessoal num anexo publicado | checagem final de privacidade |

## Prompts prontos

```text
Crie uma pasta temporária e copie o projeto sem dados/processados e sem
resultados/; copie o resultados/ original como resultados_ref/. Defina
COFRE_DIR para outra pasta temporária, nova e vazia, recrie o ambiente pelo
requirements.txt e use a cópia guardada dos externos (conferida por hash).
Rode python analise/rodar_tudo.py --reproducao e mostre a saída inteira.
Depois, faça a checagem de deriva do catálogo §8 numa pasta separada e liste
todo hash que mudou.
```

```text
Complete saidas/declaracao-uso-ia.md a partir de saidas/log-ia.md e
saidas/log-decisoes.md. Para cada frase, indique a evidência (DEC ou linha do
log). Frase sem evidência: apague. Não suavize.
```

## Volte para trás quando

- A reprodução falha ou diverge → a etapa de origem da divergência.
