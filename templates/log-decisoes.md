# Log de decisões

> **Só acrescenta.** Nenhuma entrada é apagada ou editada. Para corrigir uma decisão, crie uma entrada nova que cite a anterior ("substitui DEC-007").

**Tipos de entrada**

| Tipo | Quando |
|---|---|
| `portão` | aprovação de um portão. **Traz a frase literal do humano**, o nome e a data. Sem ela, o portão não está aprovado |
| `âncora` | nos portões ★ e nos travamentos, **depois** do push da tag ou da mensagem ao revisor: a tag (`Gx`, `trava-registro`, `trava-modelo`) e o SHA que `git ls-remote --tags origin <tag>` devolve, ou o que o humano colar da mensagem. É uma entrada nova, porque o SHA só existe depois do commit que contém a DEC do portão |
| `ajuste` | pedido de ajuste dentro da etapa |
| `volta` | reabertura de etapa anterior |
| `leitura` | abertura do cofre ou primeira leitura da confirmação (data e hash de conteúdo) |
| `desvio` | desvio do registro travado: cego ou informado pelo resultado |
| `auditoria` | cada rodada de auditoria adversarial, com o veredito (nenhuma é descartada) |
| `exceção` | exceção a uma regra de ouro, com justificativa |
| `incidente` | dado pessoal exposto, leitura fora de hora da confirmação, trava violada |
| `escopo` | mudança de escopo |

| ID | Data | Etapa | Tipo | Decisão | Frase literal do humano (portões) | Alternativas consideradas | Motivo | Gatilho para reabrir | Quem decidiu |
|---|---|---|---|---|---|---|---|---|---|
| DEC-001 | AAAA-MM-DD | 00 | portão | G0 aprovado | "Aprovo G0" | — | checklist do G0 completo | — | |

**Gatilho para reabrir:** toda decisão de método (partição, métrica, fonte, tratamento de outlier) diz em que condição deve ser revista. Por exemplo: "se a nova safra da F02 mudar a definição" ou "se o n de confirmação cair abaixo de 500". Decisão sem gatilho vira dogma.
