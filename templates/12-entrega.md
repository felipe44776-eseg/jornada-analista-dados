# 12 · Entrega e retrospectiva

> **Etapa 12 · Entrega** · Data: AAAA-MM-DD · Responsável: ___ · IA: ___ · Status: `rascunho`

## 1. Pacote de entrega

| Item | Caminho | Conferido? |
|---|---|---|
| Deck técnico | `apresentacoes/deck-tecnico.*` | |
| Deck executivo | `apresentacoes/deck-executivo.*` | |
| Artefatos das etapas | `saidas/` | |
| Código | `analise/` | |
| Números (fonte de todo número publicado) | `resultados/*.json` | |
| Manifesto de dados (URL, data, hash) | `dados/externos/` + fichas da etapa 02 | |
| Arquivos travados e hashes | `saidas/*.travado.md` · `modelos/` · `00-status.md` §Travas · tags git | |
| Cópia dos dados externos (se a licença permitir) | | |
| Declaração de uso de IA (assinada) | `saidas/declaracao-uso-ia.md` | |

**Mapa de leitura por perfil**

| Se você é… | Comece por |
|---|---|
| quem decide | `apresentacoes/deck-executivo.*` |
| professor(a) ou revisor(a) | `apresentacoes/deck-tecnico.*` → `saidas/08-validacao.md` |
| quem quer reproduzir | a seção 2 abaixo |
| quem duvida de um número | a chave do número no deck → `resultados/*.json` → script em `analise/` |
| quem vai continuar a análise | `saidas/00-status.md` (pendências) → `saidas/08-validacao.md` §10 → `saidas/log-decisoes.md` |

## 2. Como reproduzir

```text
# ambiente
___
# dados (baixa e confere hashes)
___
# pipeline completo
___
```

Primeira reprodução: etapa 08 §6. **Reconferência com o pacote final** por: ___ em AAAA-MM-DD · `resultados/` idêntico: sim · não (listar) · hash de conteúdo dos processados idêntico: sim · não. Hash de bytes só vale para brutos e externos.

## 3. Plano de acompanhamento

A análise informou uma decisão. Como saber se a decisão funcionou e quando refazer a análise?

| Campo | Valor |
|---|---|
| Decisão tomada (se já houver) | |
| Indicador a acompanhar | |
| Frequência e responsável | |
| Resultado esperado se a recomendação estiver certa | |
| **Gatilho para refazer a análise** | *ex.: indicador fora da faixa por 2 meses; mudança de regra; nova safra da fonte F02* |

## 4. Retrospectiva

**O que funcionou** · **o que não funcionou** · **o que mudar no kit**

| Tema | Funcionou | Não funcionou | Mudar |
|---|---|---|---|
| Processo (etapas, portões) | | | |
| Dados (internos e externos) | | | |
| Uso da IA | | | |
| Comunicação | | | |

**A IA nesta análise** (a partir do `log-ia.md`):
- Onde mais ajudou: ___
- Erros da IA mais relevantes e como foram pegos: ___
- Onde a IA **não** deveria ter sido usada, ou precisou de mais controle: ___

**Tempo por fase** (aproximado): Enquadrar ___ · Reunir ___ · Explorar ___ · Comprovar ___ · Comunicar ___

## 5. Lições para o próximo projeto

1. ___
2. ___
3. ___

## 6. Checklist do portão G12

- [ ] Pacote completo e conferido
- [ ] Reprodução reconferida em ambiente limpo, com `resultados/` idêntico
- [ ] Plano de acompanhamento com indicador, responsável e gatilho
- [ ] Retrospectiva feita, incluindo o uso da IA
- [ ] Declaração de uso de IA conferida frase a frase contra o log e assinada
- [ ] Nenhum dado pessoal nem célula com n < 5 nos entregáveis publicados
- [ ] Status final: todos os portões aprovados, com DEC literal (ou 06 "não se aplica", com motivo); commit final com tag `G12`
