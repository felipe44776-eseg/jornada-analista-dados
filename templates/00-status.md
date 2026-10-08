# Status do projeto

> Mantido pela IA e atualizado a cada portão. **Portão só conta como aprovado com DEC do tipo `portão`, com a frase literal do humano, no `log-decisoes.md`, e, nos ★ e travamentos, com a DEC do tipo `âncora`** (SHA que o remoto devolve para a tag, ou o que o humano colar da mensagem ao revisor). Status "aprovado" sem isso = não aprovado.

| Campo | Valor |
|---|---|
| Projeto | |
| Pergunta principal · tipo | *(preenchida no G1)* |
| Analista responsável | |
| Revisor(a) dos portões ★ | *(nome, ou "sem revisão independente": ver DEC-___)* |
| Dono(a) da pergunta | *(real, ou simulado: declarar)* |
| Modo | completo (13 portões) · essencial (6 portões) |
| Ferramenta e modelo de IA · modo de operação | |
| Repositório git | sim (tags por portão; obrigatório em modo agente) · não |
| Âncora externa | remoto com tags (`origin`) · mensagens ao revisor (e-mail/AVA) |
| Cofre da confirmação (`COFRE_DIR`) | *(caminho fora do projeto; senha com o humano, se houver)* |
| Sal da partição | *(registrado no kickoff)* |
| Etapa atual | 00 |
| Última atualização | AAAA-MM-DD |

No modo essencial, **Etapa atual** lista as etapas do grupo (ex.: `07+08`). O sorteio de conferência lê este campo.

## Travas

| Arquivo travado | SHA-256 | Tag de travamento | Onde nasceu | DEC `âncora` |
|---|---|---|---|---|
| `saidas/05-registro-hipoteses.travado.md` | | `trava-registro` | G5 · pausa ao fim da 05 (essencial) · G4 (sem partição) | |
| `saidas/06-ficha-modelo.travado.md` | | `trava-modelo` | G6 · G5★ (essencial) | |
| `modelos/M01.*` | | `trava-modelo` | G6 · G5★ (essencial) | |
| `confirmacao.*` (hash de conteúdo) | | — | G4 (conferido na 07 pela contagem e pelo hash) | — |
| *(ciclo 2)* `saidas/05-registro-hipoteses-c2.travado.md` | | `trava-registro-c2` | `G5-c2` | |

Uma linha por trava. A 07 e o auditor conferem **todas**. Travou, não reabre: ajuste posterior é desvio registrado.

## Portões

| Etapa | Portão | Status | Data | Aprovado por | DEC | Âncora (★ e travamentos) |
|---|---|---|---|---|---|---|
| 00 Kickoff | G0 | pendente | | | | — |
| 01 Problema e decisão | G1 ★ | pendente | | | | |
| 02 Dados internos | G2 | pendente | | | | — |
| 03 Dados externos | G3 ★ | pendente | | | | |
| 04 Preparação e partição | G4 | pendente | | | | só no modo essencial ou sem partição |
| 05 Exploração e pré-registro | G5 ★ | pendente | | | | |
| 06 Modelagem *(condicional)* | G6 | pendente · não se aplica (motivo) | | | | |
| 07 Testes confirmatórios | G7 | pendente | | | | — |
| 08 Validação e triangulação | G8 ★ | pendente | | | | |
| 09 Insights e storyline | G9 | pendente | | | | — |
| 10 Deck técnico | G10 | pendente | | | | — |
| 11 Deck executivo | G11 ★ | pendente | | | | |
| 12 Entrega e retrospectiva | G12 | pendente | | | | — |

No modo essencial, marque os portões do grupo juntos (G1: 00+01 · G4: 02+03+04 · G5: 05+06 · G8: 07+08 · G11: 09+10+11 · G12).
Status possíveis: `pendente` · `em andamento` · `aguardando portão` · `aprovado` · `reaberto` · `não se aplica`.

## Placar do funil

| Camada | Entrou | Saiu | Filtro aplicado | Portão |
|---|---|---|---|---|
| Perguntas | __ levantadas | 1 principal + __ subperguntas | relevância para a decisão | G1 |
| Fontes | __ internas + __ externas avaliadas | __ + __ aptas | aptidão ao uso | G2 · G3 |
| Registros | __ linhas brutas | __ na análise · __ em quarentena | regras R01–R__ | G4 |
| Padrões | __ gráficos gerados | __ observações relevantes | ligação com a árvore de perguntas | G5 |
| Hipóteses | __ candidatas | __ registradas | prioridade × testabilidade | G5 |
| Modelos | __ tentados (incluindo baselines) | 1 congelado | validação na exploração | G6 |
| Testes | __ rodados (todos os ciclos) | __ confirmadas · __ contrárias · __ refutadas · __ inconclusivas | regra de decisão + correção | G7 |
| Achados | __ candidatos | __ E1 · __ E2 · __ E3 · __ derrubados | sensibilidade + régua externa + auditoria | G8 |
| Decisão | __ achados | __ insights · 1 recomendação | "e daí?" para a decisão | G9 |

> O placar vai para o deck técnico porque o número de caminhos tentados faz parte da evidência. Três hipóteses confirmadas em 5 testes pesam diferente de três confirmadas em 60.

## Números revisados: não reintroduzir

Todo número que chegou a ser escrito errado em algum artefato ou deck e foi corrigido. A IA consulta esta lista antes de redigir qualquer entregável.

| Número errado | Número correto | Por que estava errado | Onde foi corrigido | Data |
|---|---|---|---|---|
| | | *ex.: preço com desconto comparado com preço cheio* | | |

## Pendências abertas

| # | Pendência | Etapa | Responsável | Desde |
|---|---|---|---|---|
| | | | | |

## Próximo passo

*(uma frase)*
